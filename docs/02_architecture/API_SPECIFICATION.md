# REST API Specification

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (MVP scope trimmed)

Ontologia exposes a versioned, OpenAPI-described REST API for programmatic use. This document summarises the contract; the canonical source is the auto-generated OpenAPI 3.1 spec at `https://api.ontologia.com/v1/openapi.json`.

> **MVP scope**: the `/branches`, `/commits`, and `/reviews` endpoints are deferred to the S1/S2 release. MVP mutations happen via change events applied directly to an ontology. See [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md).

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
- `admin:webhooks` · `admin:api_keys`
- `admin:members`

A call that doesn't match the scope returns `403 insufficient_scope`.

## 3. Resources & endpoints

### 3.1 Organisations / workspaces

```
GET    /me
GET    /orgs/{orgId}
GET    /orgs/{orgId}/workspaces
POST   /orgs/{orgId}/workspaces             {name}                   (admin:members)
GET    /workspaces/{workspaceId}
POST   /orgs/{orgId}/memberships            (admin:members)
DELETE /memberships/{membershipId}          (admin:members)
```

### 3.2 Ontologies

```
GET    /workspaces/{workspaceId}/ontologies
POST   /workspaces/{workspaceId}/ontologies {name, description}
GET    /ontologies/{id}
PATCH  /ontologies/{id}                     {name?, description?}
DELETE /ontologies/{id}                     (soft-delete)
```

### 3.3 Change events (MVP history)

```
GET    /ontologies/{id}/change-events?entityType=&entityId=&from=&to=&cursor=&limit=
POST   /ontologies/{id}/change-events       {operation, entityType, entityId?, diff, message?, expectedLastEventId?}
GET    /change-events/{eventId}
POST   /change-events/{eventId}/revert      {message?}
GET    /ontologies/{id}/diff?from={eventId}&to={eventId}
```

`diff` shape follows the TypeScript `Diff` type in [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md) §4. Conflict handling:

- If `expectedLastEventId` is supplied and no longer matches the server's current last event for the entity, the server returns `409 stale-head` and the client must refetch.
- `operation='bulk_import'` accepts a list of creates and is idempotent via `Idempotency-Key`.

### 3.4 Concepts & relations (query convenience)

```
GET /ontologies/{id}/concepts?search=&status=&limit=&cursor=
POST /ontologies/{id}/concepts              {name, description?, properties?}
GET /concepts/{id}
PATCH /concepts/{id}                        {name?, description?, properties?, expectedLastEventId?}
DELETE /concepts/{id}                       {expectedLastEventId?}
GET /ontologies/{id}/relations
POST /ontologies/{id}/relations             {fromId, toId, relationType, properties?}
PATCH /relations/{id}                       {properties?, expectedLastEventId?}
DELETE /relations/{id}                      {expectedLastEventId?}
```

Convenience routes. Each mutation appends a `change_event` internally; clients that want to batch should use the change-events endpoint directly.

### 3.5 Relation types

```
GET  /ontologies/{id}/relation-types
POST /ontologies/{id}/relation-types        {name, label, isTransitive, isSymmetric, strict}
PATCH /relation-types/{id}
```

Changes to relation types are themselves recorded as change events.

### 3.6 Tags

```
GET    /ontologies/{id}/tags
POST   /ontologies/{id}/tags                {name, changeEventId}
GET    /tags/{id}
DELETE /tags/{id}
```

Deleting a tag appends a `tag` change event marking the tag deprecated; the tag row itself is retained for referential integrity.

### 3.7 Comments

```
POST   /comments                            {targetType, targetId, body, parentId?}
GET    /comments?targetType=concept&targetId=…
PATCH  /comments/{id}                       {body?}
DELETE /comments/{id}
POST   /comments/{id}/resolve
```

`targetType` values in MVP: `concept`, `relation`, `change_event`.

### 3.8 Import / export (async jobs)

```
POST   /ontologies/{id}/imports             multipart: file + config
GET    /jobs/{jobId}
POST   /ontologies/{id}/exports?format=jsonld|json|csv|ttl
GET    /exports/{exportId}/download         (presigned URL)
```

### 3.9 Webhooks

```
GET    /webhooks                            (admin:webhooks)
POST   /webhooks                            {url, events:[…], active:true}
PATCH  /webhooks/{id}
DELETE /webhooks/{id}
POST   /webhooks/{id}/rotate-secret
POST   /webhooks/{id}/deliveries/{deliveryId}/retry
```

### 3.10 API keys (admin:api_keys)

```
GET    /api-keys
POST   /api-keys                            {name, scopes:[…]}
DELETE /api-keys/{id}
```

The raw key is returned **once** in the POST response.

### 3.11 Audit log

```
GET /audit-events?action=&userId=&from=&to=&cursor=
```

Exportable CSV / JSON on Team+; retention per [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

### 3.12 Usage

```
GET /usage                                  current period counters (workspaces, concepts, api_calls) vs plan limits
```

### 3.13 Deferred — branches and reviews (ship with S1 / S2)

```
// Branches (deferred)
GET    /ontologies/{id}/branches
POST   /ontologies/{id}/branches            {name, fromCommitId}
GET    /branches/{id}
DELETE /branches/{id}
POST   /branches/{id}/merge                 {into, strategy?: 'ff'|'three-way'}

// Commits (deferred)
GET    /branches/{id}/commits
POST   /commits                             {branchId, expectedHeadCommitId, message, changes}
GET    /commits/{id}
POST   /commits/{id}/revert                 {branchId}

// Reviews (deferred)
POST   /reviews                             {branchId, targetBranchId, title, reviewers:[userId]}
GET    /reviews/{id}
POST   /reviews/{id}/approve
POST   /reviews/{id}/request-changes
POST   /reviews/{id}/merge
POST   /reviews/{id}/close
```

When these ship, they will not break the MVP routes; the change-events endpoint remains the lower-level primitive.

## 4. Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted — async job enqueued |
| 204 | No content (deletes, resolves) |
| 400 | Validation error |
| 401 | Missing / invalid credentials |
| 402 | Plan limit reached (upgrade required) |
| 403 | Insufficient scope or role |
| 404 | Not found (also when cross-tenant) |
| 409 | Conflict (stale head, duplicate name) |
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

Body example (`change.created`):

```json
{
  "id": "evt_01J…",
  "type": "change.created",
  "createdAt": "2026-05-01T10:12:34Z",
  "orgId": "org_…",
  "data": {
    "ontologyId": "…",
    "changeEventId": "…",
    "author": {"id": "…", "displayName": "Alex"},
    "operation": "create",
    "entityType": "concept",
    "entityId": "…",
    "message": "Add Product concept"
  }
}
```

MVP event types:
- `ontology.created`
- `change.created` · `change.reverted`
- `tag.created`
- `concept.deprecated`
- `member.invited` · `member.role_changed` · `member.removed`
- `billing.plan_changed` · `billing.usage_threshold`

Deferred (S1 / S2): `branch.created` · `branch.deleted` · `branch.merged` · `review.opened` · `review.approved` · `review.merged` · `review.closed`.

## 6. Versioning policy

- `v1` URL prefix is stable for 24 months after GA.
- Additive changes (new fields, new endpoints) are non-breaking.
- Breaking changes ship as a new major version `v2/*`; `v1` remains available with a 12-month deprecation window.
- Deprecation is announced in `Sunset` and `Deprecation` headers, in the changelog, and by email to API key owners.

## 7. Rate limits

Default buckets (token bucket, Redis):

| Plan | API calls / month (plan limit) | Burst rate / minute | Webhook deliveries / min |
|---|---|---|---|
| Free | 5,000 | 30 | 10 |
| Team | 500,000 | 600 | 60 |
| Business | 5,000,000 | 3,000 | 600 |
| Enterprise | Custom | Custom | Custom |

Headers returned on every response:

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 597
X-RateLimit-Reset: 1714567890
Retry-After: 30                   (only on 429)
```

Plan-level monthly limits (concepts, API calls) surface as `402 plan-limit-reached` once exceeded; the burst per-minute limits surface as `429 rate-limited`.

Large responses respect a 5 MB cap; beyond that, clients must paginate.

## 8. SDKs

- `ontologia-python` (official). Auto-generated from OpenAPI with hand-crafted ergonomics for change events and diffs.
- `ontologia-js`. Isomorphic (Node + browser).

Both SDKs:
- Type-safe with the latest spec.
- Support idempotency keys and automatic retries on 429 / 503.
- Expose a webhook signature verifier helper.

## 9. Error taxonomy

Common `type` URLs:

- `/validation` — request body or query violates schema.
- `/stale-head` — change event submitted against an outdated `expectedLastEventId` (409).
- `/insufficient-scope` — API key missing scope (403).
- `/not-a-member` — user not in org (404).
- `/rate-limited` — 429 with `Retry-After`.
- `/plan-limit-reached` — 402; body includes the limit hit and upgrade link.
- `/entity-too-large` — payload over cap (413).

## 10. Example — end-to-end (MVP)

Create two concepts and a relation via change events, then tag the result:

```bash
# Create concept 1
curl -X POST https://api.ontologia.com/v1/ontologies/ont_01J.../concepts \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","description":"A sellable item."}'

# Create concept 2
curl -X POST https://api.ontologia.com/v1/ontologies/ont_01J.../concepts \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"name":"Category"}'

# Link them
curl -X POST https://api.ontologia.com/v1/ontologies/ont_01J.../relations \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"fromId":"c_product","toId":"c_category","relationType":"belongs-to"}'

# Tag the current state
curl -X POST https://api.ontologia.com/v1/ontologies/ont_01J.../tags \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"name":"2026-Q2","changeEventId":"ce_01J..."}'
```

Each mutation returns the created entity along with the `changeEventId` the server appended to the history.

---

Related: [Data Model](DATA_MODEL.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Integrations](INTEGRATIONS.md) · [Authentication](../06_security_compliance/AUTHENTICATION.md) · [Pricing Model](../08_finance/PRICING_MODEL.md)
