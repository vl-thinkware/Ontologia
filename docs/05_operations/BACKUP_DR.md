# Backup & Disaster Recovery

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


What we back up, how often, how fast we can recover, and how we prove it.

---

## 1. Guarantees

| Target | Free / Starter | Pro | Enterprise |
|---|---|---|---|
| RPO (data loss tolerance) | 24 h | 1 h | 15 min |
| RTO (recovery time objective) | 24 h | 4 h | 1 h |
| Backup retention | 7 days | 30 days | 90 days |
| Data durability | 99.999% annual | 99.999% | 99.9999% |

Targets are what we contractually commit to on Enterprise; others are engineering targets reviewed quarterly.

## 2. What we back up

### PostgreSQL
- Point-in-time recovery (PITR) via managed provider (Neon/Supabase).
- WAL-based; granularity measured in seconds.
- Logical dumps nightly, encrypted, to R2 `backups/pg/<env>/<date>/`.

### Neo4j Aura
- Daily automated snapshots (Aura native).
- On-demand snapshots before destructive releases or risky data migrations.
- Tenant-scoped export jobs (Pro+): logical JSON export of ontologies per workspace, encrypted, stored in R2.

### Object storage (R2)
- Bucket versioning enabled.
- Cross-region replication (post-v1).
- Lifecycle policy: keep non-current versions for 30 days.

### Redis
- Treated as cache. We do not back up. On full loss, services degrade gracefully while we rewarm.
- Exception: rate-limit counters (acceptable to reset), BullMQ queues (jobs retried from idempotent intents).

### Application secrets
- Doppler snapshots weekly.
- Emergency access via 1Password shared vault (break-glass envelope).

## 3. How we back up

- **Automatic** for managed DB PITR and Neo4j Aura snapshots.
- **Scheduled jobs** for logical dumps and tenant exports (cron + BullMQ).
- **On-demand** before risky operations (flagged in the deploy PR).

## 4. Where backups live

- Primary copy: in the provider's backup service.
- Secondary copy: `backups/` in Cloudflare R2, encrypted at rest with a customer-managed key (KMS).
- Enterprise tenants: optional dedicated bucket in their chosen region.

## 5. Encryption & access

- All backup artefacts encrypted with AES-256 via KMS.
- Access to backup buckets restricted to the SRE role; every access audited.
- Customer-managed keys available on Enterprise (BYOK).

## 6. Restore procedures

Each procedure has a runbook. The general steps:

### 6.1 Postgres PITR
1. Provider dashboard → PITR to `TIMESTAMP`.
2. Run a read-only verification suite against the restored instance.
3. Swap connection strings for the affected service.

### 6.2 Neo4j tenant restore
1. Identify tenant and target timestamp.
2. Provision a temporary Neo4j DB, load the chosen snapshot / export.
3. Verify with a smoke query set.
4. Cut over the tenant's `tenant_registry` entry (or merge changes since snapshot, if partial).
5. Notify affected users.

### 6.3 Full environment restore (DR drill)
1. Provision new Postgres, Neo4j, Redis, R2 buckets via Terraform in a secondary region.
2. Restore from latest PITR + snapshots.
3. Point DNS at the new region via Cloudflare.
4. Validate using the DR test suite.
5. Announce.

## 7. DR drills

- **Quarterly tabletop.** 1-hour meeting: walk through a scenario, identify gaps.
- **Semi-annual live drill.** Partial: restore a tenant to a scratch environment and run a verification suite.
- **Annual live drill.** Full: bring up a secondary region and run smoke tests.

Outcomes documented in `docs/05_operations/drills/`.

## 8. Data retention & deletion

- Customer data retained while the subscription is active.
- On deletion request, data is removed within 30 days; backups expire per their retention.
- After 90 days, the data is irrecoverable by design (enforced by backup rotation).
- GDPR and local-law overrides available for Enterprise.

See [DATA_PRIVACY.md](../06_security_compliance/DATA_PRIVACY.md).

## 9. Verifying backups

- Nightly job restores a random tenant's latest backup into a throwaway DB and runs `SELECT count(*)` / Cypher sanity queries.
- Metrics: `backup_restore_success_total`, `backup_restore_duration_seconds`.
- Alert on two consecutive failed verifications.

## 10. Handling silent data corruption

- Application-level invariants (cycle-free on declared transitive relations, version chain consistency) are checked nightly per-tenant.
- A violation triggers a SEV2 investigation and, if confirmed, a targeted restore.

## 11. Documentation index

- `docs/05_operations/runbooks/restore-postgres.md`
- `docs/05_operations/runbooks/restore-neo4j.md`
- `docs/05_operations/runbooks/failover-region.md`
- `docs/05_operations/runbooks/rotate-kms-key.md`

(Files to be authored as part of Phase 0/1 operational readiness.)

Related: [Infrastructure](INFRASTRUCTURE.md) · [SLA](SLA.md) · [Compliance](../06_security_compliance/COMPLIANCE.md) · [Data Privacy](../06_security_compliance/DATA_PRIVACY.md)
