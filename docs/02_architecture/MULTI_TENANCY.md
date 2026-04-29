# Multi-Tenancy

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


This document describes how Semlify isolates organisations ("tenants") across the stack. Every engineering decision that involves data, cache, jobs or logs must honour these rules.

---

## 1. Tenancy model

```
Organisation (tenant) ── Workspaces ── Ontologies ── Branches ── Commits
                      └─ Members (with roles)
                      └─ API keys, webhooks, audit log
                      └─ Billing (one subscription)
```

- An organisation is the billing boundary and the isolation boundary.
- A user can belong to many organisations.
- A membership carries a role: `owner | editor | reviewer | viewer`.
- Roles extend to optional per-ontology ACL overrides in Enterprise.

## 2. Isolation levels

| Layer | Free / Starter | Pro | Enterprise |
|---|---|---|---|
| Neo4j | Shared DB, `orgId` namespaced | One DB per org (Aura DB instance) | One DB per org + optional dedicated instance |
| Postgres | Shared DB, RLS by `org_id` | Shared DB, RLS | Same |
| Redis | Shared, `org:{id}:` key prefix | Same | Optional dedicated Redis |
| Object storage | Bucket prefix `org/{id}/` | Same | Optional dedicated bucket / KMS |
| Regions | US by default | US or EU at creation | US, EU, (APAC on request) |

Per-tenant Neo4j on Pro+ is the strongest isolation we can achieve without running our own cluster ops. It also yields predictable performance — one noisy neighbour cannot eat another tenant's cache.

## 3. Enforcement

### 3.1 API layer
Every API handler:
1. Authenticates the caller (Clerk JWT or API key).
2. Resolves the caller's `orgId` (from the route, or from the token's org claim).
3. Asserts the caller is a member with sufficient role.
4. Sets `app.current_org_id` for this transaction (used by Postgres RLS).
5. Passes `orgId` explicitly to downstream clients (Neo4j, Redis, S3).

A Fastify plugin wraps all routes except the public website / auth endpoints. Missing `orgId` in a tenant-scoped handler is a 500 caught in tests.

### 3.2 Postgres RLS
Tenant-scoped tables enable RLS:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON <table>
  USING (org_id = current_setting('app.current_org_id')::uuid)
  WITH CHECK (org_id = current_setting('app.current_org_id')::uuid);
```

The service role bypasses RLS for migrations and background jobs but must still set `app.current_org_id` when operating on a tenant's behalf.

### 3.3 Neo4j
- **Shared DB path.** Every Cypher query goes through a repository layer that injects `WHERE n.orgId = $orgId`. A lint rule rejects any `MATCH` without an explicit `orgId` filter in review.
- **DB-per-tenant path.** The driver selects the database at session creation from a `TenantRegistry` (`orgId → dbName` lookup).

### 3.4 Redis
All keys use the pattern `org:{orgId}:…`. The Redis client wraps `get/set/del` to prepend the prefix; raw clients are banned by an ESLint rule.

Rate limits, cache keys, pub/sub channels all follow this convention.

### 3.5 Object storage
Objects live under `org/{orgId}/…`. Presigned URLs include an audit event.

### 3.6 Jobs & events
BullMQ jobs carry `orgId` in their payload. Workers refuse jobs without `orgId`. Redis Streams events carry `orgId` as a top-level field.

### 3.7 Logs, metrics, traces
- Every log line includes `orgId` and `userId` when applicable.
- Metrics have an `org_id` label (cardinality bounded — enterprise only, not every free user, to stay within Prometheus limits).
- Traces attach `org.id` on the root span.

## 4. Provisioning & de-provisioning

### 4.1 Create tenant
1. Sign-up flow creates a Postgres `organizations` row with `plan=free`.
2. A `workspace` row is created.
3. Depending on plan:
   - Free/Starter: no Neo4j work; namespace is logical.
   - Pro/Enterprise: a provisioning job calls Neo4j Aura API to create a dedicated database; records the connection info encrypted in Postgres.
4. Stripe customer created.
5. Initial owner membership written.

### 4.2 Promote plan
When an org upgrades from Starter to Pro:
1. Provision a dedicated Neo4j database for the org.
2. Run a migration job that copies all ontologies for that `orgId` from the shared DB into the dedicated DB.
3. Flip a registry flag.
4. Delete the data from the shared DB only after verification.

### 4.3 Delete tenant
1. Owner requests deletion (double confirmation, 7-day soft-delete window).
2. Soft-delete flags the organisation; data hidden from UI, API returns 410 Gone.
3. After 7 days, hard-delete: drop the Neo4j database, delete Postgres rows, purge object storage, revoke API keys, notify members.
4. Export archive generated at request time and emailed to the owner.

## 5. Cross-tenant operations

Very few operations cross tenants. Examples:

- **Global full-text search for internal ops.** Admin-only, logged and audited.
- **Template marketplace (post-v1).** Templates live in a special "public" namespace, cloned into tenants on request.

All other cross-tenant joins in code are forbidden.

## 6. Authentication edge cases

- A user in multiple orgs has a JWT claim `org_id` that must match the route's `orgId`. Frontend passes the active org explicitly.
- Revoking a membership invalidates the user's API keys scoped to that org and causes JWT refresh on the frontend.
- Service-to-service (workers) authenticate with a rotating internal secret and always declare the `orgId` they are acting on.

## 7. Data residency (Pro+)

Regions supported at v1.0: `us-east-1`, `eu-west-1`.

- Region is chosen at org creation and **immutable**.
- All data, backups and logs for that org stay within region.
- Cross-region support burden: limited to SaaS operations dashboards (aggregate, no customer data).

Documented in [DATA_PRIVACY.md](../06_security_compliance/DATA_PRIVACY.md).

## 8. Noisy-neighbour protections

- Rate limits per org + per user + per API key (token bucket in Redis).
- Job queue has per-org concurrency caps on Starter (soft) and Pro (higher soft cap).
- LLM usage capped per org per month; overage prompts upgrade.
- Slow-query kill: Cypher queries > 30 s are terminated and logged.

## 9. Testing

- Contract test: every new API endpoint must prove that a request from org A for a resource owned by org B returns 404 — never 403 (avoid leaking existence).
- RLS test: run the full integration suite with RLS enabled, repeated with a malicious user context; all queries must return zero rows.
- Scanning: periodic audit script crawls Postgres rows, Neo4j nodes, Redis keys for any missing `org_id` / `orgId` / prefix.

## 10. Migration from shared Neo4j to dedicated Neo4j

Happens on plan upgrade. The job:

1. Takes a logical snapshot of the shared DB filtered by `orgId`.
2. Restores into the newly provisioned dedicated DB.
3. Writes a read-only marker on the old data (prevents new writes).
4. Flips the `tenant_registry` pointer.
5. Verifies with sampling.
6. Purges source rows.

Rollback path: flip pointer back; keep logs for 7 days.

---

Related: [Architecture](ARCHITECTURE.md) · [Data Model](DATA_MODEL.md) · [Security](../06_security_compliance/SECURITY.md) · [Data Privacy](../06_security_compliance/DATA_PRIVACY.md)
