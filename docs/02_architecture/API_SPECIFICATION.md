# REST API Specification

Ontologia exposes a versioned, OpenAPI-described REST API for programmatic use. This document summarises the contract; the canonical source is the auto-generated OpenAPI 3.1 spec at `https://api.ontologia.com/v1/openapi.json`.

---

## 1. Conventions

- **Base URL.** `https://api.ontologia.com/v1`
- **Content type.** `application/json; charset=utf-8` by default. `application/ld+json` on export endpoints.
- **Time.** ISO-8601 (RFC 3339), UTC.
- **IDs.** String UUIDs (v7 preferred).
- **Errors.** RFC 7807 problem-details. Example:

```json
{
  "type": "https://errors.ontologia.com/validation",
  "title": "Validation failed",
  "status": 400,
  "detail": "field 'name' is required",
  "instance": "/v1/concepts",
  "trace_id": "c45a6…"
}
```

- **Pagination.** Cursor-based: `?cursor=…&limit=50`. Response includes `next_cursor`.
- **Idempotency.** `Idempotency-Key` header on all POST/PUT/DELETE that mutate; 24 h window.
- **Request id.** `X-Request-Id` (server-generated, echoed).
- **Rate limits.** See §7.

## 2. Authentication & authorisation

### 2.1 Two credential types
- **User session JWT (Clerk).** For the web app.
- **API key (Bearer).** For programmatic use.

```
Authorization: Bearer sk_live_abc…
```

### 2.2 Scopes

An API key declares scopes at creation:

- `read:ontology` · `write:ontology`
- `read:comments` · `write:comments`
- `read:reviews` · `write:reviews`
- `admin:webhooks` · `admin:api_keys`
- `admin:members`

A call that doesn't match the scope returns `403 insufficient_scope`.

## 3. Resources & endpoints

### 3.1 Organisations / workspaces
Read-only via API v1 except member operations.

```
GET    /me
GET    /orgs/{orgId}
GET    /orgs/{orgId}/workspaces
GET    /workspaces/{workspaceId}
POST   /orgs/{orgId}/memberships           (admin:members)
DELETE /memberships/{membershipId}         (admin:members)
```

### 3.2 Ontologies

```
GET    /workspaces/{workspaceId}/ontologies
POST   /workspaces/{workspaceId}/ontologies
GET    /ontologies/{id}
PATCH  /ontologies/{id}
DELETE /ontologies/{id}                    (soft-delete)
```

### 3.3 Branches

```
GET    /ontologies/{id}/branches
POST   /ontologies/{id}/branches           {name, fromCommitId}
GET    /branches/{id}
DELETE /branches/{id}
POST   /branches/{id}/merge                {into: branchId, strategy?: 'ff'|'three-way'}
```

### 3.4 Commits

```
GET    /branches/{id}/commits
POST   /commits                            {branchId, expectedHeadCommitId, message, changes: Changeset}
GET    /commits/{id}
POST   /commits/{id}/revert                {branchId}
GET    /ontologies/{id}/diff?from={ref}&to={ref}
```

`Changeset`:

```json
{
  "addConcepts":   [{"id":"uuid","name":"Product","description":"...","properties":{...}}],
  "modConcepts":   [{"id":"uuid","patch":{"description":"..."}}],
  "delConcepts":   ["uuid1","uuid2"],
  "addRelations":  [{"fromId":"u1","toId":"u2","relationType":"is-a","properties":{}}],
  "modRelations":  [{"id":"r1","patch":{"label":"..."}}],
  "delRelations":  ["r2"]
}
```

### 3.5 Concepts & relations (query convenience)

```
GET /ontologies/{id}/concepts?ref=main&search=&status=&limit=&cursor=
GET /concepts/{id}?ref=main
GET /ontologies/{id}/relations?ref=main
```

These are read-only views. All mutations go through commits.

### 3.6 Relation types

```
GET  /ontologies/{id}/relation-types
POST /ontologies/{id}/relation-types       {name,label,isTransitive,isSymmetric,strict}
PATCH /relation-types/{id}
```

Changes to relation types are themselves recorded as commits.

### 3.7 Reviews (conceptual PRs)

```
POST   /reviews                            {branchId, targetBranchId, title, reviewers:[userId]}
GET    /reviews/{id}
POST   /reviews/{id}/approve
POST   /reviews/{id}/request-changes
POST   /reviews/{id}/merge
POST   /reviews/{id}/close
```

### 3.8 Comments

```
POST   /comments                           {targetType, targetId, body, parentId?}
GET    /comments?targetType=concept&targetId=…
PATCH  /comments/{id}
DELETE /comments/{id}
POST   /comments/{id}/resolve
```

### 3.9 Import / export (async jobs)

```
POST   /ontologies/{id}/imports            multipart: file + config
GET    /jobs/{jobId}
POST   /ontologies/{id}/exports?format=jsonld|json|csv
GET    /exports/{exportId}/download        (presigned URL)
```

### 3.10 Webhooks

```
GET    /webhooks                           (admin:webhooks)
POST   /webhooks                           {url, events:[…], active:true}
PATCH  /webhooks/{id}
DELETE /webhooks/{id}
POST   /webhooks/{id}/rotate-secret
POST   /webhooks/{id}/deliveries/{deliveryId}/retry
```

### 3.11 API keys (admin:api_keys)

```
GET    /api-keys
POST   /api-keys                           {name, scopes:[…]}
DELETE /api-keys/{id}
```

The raw key is returned **once** in the POST response.

### 3.12 Audit log

```
GET /audit-events?action=&userId=&from=&to=&cursor=
```

Exportable CSV/JSON on Pro+.

## 4. Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted — async job enqueued |
| 204 | No content (deletes, resolves) |
| 400 | Validation error |
| 401 | Missing / invalid credentials |
| 403 | Insufficient scope or role |
| 404 | Not found (also when cross-tenant) |
| 409 | Conflict (stale HEAD, duplicate name, merge conflict) |
| 410 | Resource deleted |
| 422 | Semantic validation error |
| 429 | Rate limited |
| 500 | Server error |
| 503 | Temporary overload |

## 5. Webhook payloads

Every webhook:
- Method: `POST`.
- Headers: `X-Ontologia-Event`, `X-Ontologia-Delivery`, `X-Ontologia-Signature: t=…,v1=hex`.
- Signature: `HMAC_SHA256(secret, "{t}.{body}")`.
- Timeout: 10 s.
- Retries: `1s, 5s, 30s, 2m, 10m, 1h, 6h, 24h` then DLQ.
- Replay: owner can replay any delivery from the dashboard or API.

Body example (`commit.created`):

```json
{
  "id": "evt_01J…",
  "type": "commit.created",
  "createdAt": "2026-05-01T10:12:34Z",
  "orgId": "org_…",
  "data": {
    "ontologyId":"…",
    "branchId":"…",
    "commitId":"…",
    "author":{"id":"…","displayName":"Alex"},
    "message":"Add 3 concepts",
    "stats":{"concepts":{"added":3,"modified":0,"deleted":0}}
  }
}
```

## 6. Versioning policy

- `v1` URL prefix is stable for 24 months after GA.
- Additive changes (new fields) are non-breaking.
- Breaking changes ship a new major version `v2/*`; `v1` remains available with a 12-month deprecation window.
- Deprecation is announced in `Sunset` and `Deprecation` headers, in the changelog, and by email to API key owners.

## 7. Rate limits

Default buckets (token bucket, Redis):

| Tier | Requests / hour | Webhook deliveries / min |
|---|---|---|
| Free | 100 | 10 |
| Starter | 1 000 | 60 |
| Pro | 10 000 | 600 |
| Enterprise | Custom | Custom |

Headers returned on every response:

```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9997
X-RateLimit-Reset: 1714567890
Retry-After: 30      (only on 429)
```

Large responses respect a 5 MB cap; beyond that, clients must paginate.

## 8. SDKs

- `ontologia-python` (official). Auto-generated from OpenAPI with hand-crafted ergonomics for commits and diffs.
- `ontologia-js`. Isomorphic (Node + browser).

Both SDKs:
- Type-safe with the latest spec.
- Support idempotency keys and automatic retries on 429 / 503.
- Expose a webhook signature verifier helper.

## 9. Error taxonomy

Common `type` URLs:

- `/validation` — request body or query violates schema.
- `/stale-head` — commit against an outdated branch HEAD (409).
- `/merge-conflict` — 3-way merge failed (409).
- `/insufficient-scope` — API key missing scope (403).
- `/not-a-member` — user not in org (404).
- `/rate-limited` — 429 with `Retry-After`.
- `/entity-too-large` — commit payload over cap (413).

## 10. Example — end-to-end

Create a commit with two new concepts and a relation:

```bash
curl -X POST https://api.ontologia.com/v1/commits \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "branchId": "br_01J...",
    "expectedHeadCommitId": "cm_01J...",
    "message": "Add Product and Category",
    "changes": {
      "addConcepts": [
        {"id":"c_product","name":"Product","description":"A sellable item."},
        {"id":"c_category","name":"Category"}
      ],
      "addRelations": [
        {"fromId":"c_product","toId":"c_category","relationType":"belongs-to"}
      ]
    }
  }'
```

Response `201 Created`:

```json
{
  "id": "cm_01J...",
  "branchId": "br_01J...",
  "message": "Add Product and Category",
  "stats": {"concepts":{"added":2,"modified":0,"deleted":0},"relations":{"added":1,"modified":0,"deleted":0}},
  "createdAt": "2026-05-01T10:12:34Z"
}
```

---

Related: [Data Model](DATA_MODEL.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Integrations](INTEGRATIONS.md) · [Authentication](../06_security_compliance/AUTHENTICATION.md)
