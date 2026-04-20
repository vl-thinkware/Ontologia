# Testing Strategy

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


We test enough to ship confidently. We don't test so much that we can't ship. This document defines what lives at each level and how to decide where a test goes.

---

## 1. Test pyramid

```
              ┌───────────────┐
              │   E2E (thin)  │      ~30 scenarios, critical flows
              └───────────────┘
         ┌───────────────────────┐
         │    Integration        │    ~400 tests, real DBs via Testcontainers
         └───────────────────────┘
  ┌─────────────────────────────────┐
  │         Unit                    │    thousands, fast, pure
  └─────────────────────────────────┘
```

- **Unit** — per-module, in-process, no network. Vitest.
- **Integration** — spin up Postgres + Neo4j + Redis in Docker via Testcontainers. Test from HTTP handler down to DB and back.
- **E2E** — Playwright. Full stack under real auth (a test Clerk instance).
- **Property-based** — `fast-check` on the versioning/diff/merge modules.
- **Contract tests** — API consumers (SDKs) run generated tests against a staging deploy.
- **Load tests** — k6 scenarios, monthly, against pre-prod.
- **Security tests** — dependency scan, SAST, DAST; see [SECURITY.md](../06_security_compliance/SECURITY.md).

## 2. What to test at each level

**Unit**
- Pure functions (diff, merge, snapshot resolution, validators).
- Small React components (visual logic).
- Zod schemas (boundary values).

**Integration**
- Service + repository → Neo4j / Postgres.
- Every API route happy path + one representative failure.
- Tenant isolation: cross-tenant request returns 404.
- Webhook dispatcher: retry / DLQ behaviour.
- Clerk/Stripe via stubs of the SDK, not real HTTP.

**E2E**
- Activation flow (sign up → first commit).
- Review request: open → approve → merge.
- Conflict → resolve → merge.
- CSV import → edit → export.
- Billing upgrade.
- Webhook delivery with a local sink.

**Property-based (critical)**
- `revert(a, b); revert(b', a) ≡ identity` up to commit id.
- `ff(A→A) ≡ noop`.
- `merge(A, B) = merge(B, A)` modulo merge commit parent order when no conflicts.
- Concept history is monotonic: `versionId` set is a superset of previous.

## 3. Coverage targets

| Package | Statement | Branch | Rationale |
|---|---|---|---|
| `packages/graph` | 85% | 80% | Core logic, bugs here are unrecoverable |
| `apps/api` | 80% | — | Routes + services |
| `apps/worker` | 80% | — | Idempotency matters |
| `apps/web` | 70% | — | Visual, lower marginal value |
| Global | 75% | — | — |

Coverage gates are soft for PRs that *decrease* coverage in a specific file by > 5% — CI warns, not blocks.

## 4. Test data

- **Factories** (`packages/test-utils`): `makeOrg()`, `makeOntology()`, `makeCommit()`, `makeConcept()`, `makeDiff()`.
- **Fixtures** for seeded ontologies (small, medium, pathological).
- **Determinism.** Seeds all RNGs, mocks `Date.now()` via `vi.useFakeTimers()`, IDs generated from a deterministic sequence in tests.

## 5. Testing Cypher

- `packages/graph` integration tests run against an ephemeral Neo4j from Testcontainers.
- Every named Cypher file has a test fixture graph and expected output.
- "Cypher lint": a script that parses every Cypher string, asserts `orgId` is a parameter, and that no `MATCH (n)` without a label exists.

## 6. Testing multi-tenancy

Contract test required for every tenant-scoped endpoint:

```ts
it("returns 404 when requesting another tenant's resource", async () => {
  const { orgA, orgB } = await seedTwoOrgs();
  const res = await authedRequest(orgB).get(`/v1/ontologies/${orgA.ontologyId}`);
  expect(res.status).toBe(404); // never 403 — do not leak existence
});
```

## 7. Testing versioning invariants

```ts
import fc from "fast-check";

it("revert is idempotent on a stable HEAD", async () => {
  await fc.assert(
    fc.asyncProperty(genOntology(), genCommitSeq(), async (ontology, seq) => {
      const head = await applyCommits(ontology, seq);
      await revertTo(ontology, head.id);
      const again = await revertTo(ontology, head.id);
      expect(stateAt(ontology, again.id)).toEqual(stateAt(ontology, head.id));
    })
  );
});
```

## 8. E2E testing

- Playwright against a local stack started by CI.
- Runs on: Chromium, Firefox; WebKit on critical suite.
- Each test isolates its data by creating a fresh org via API before the first page load.
- Screenshots + videos on failure, uploaded as CI artefacts.
- Thin pyramid: ~30 scenarios; slow tests are a tax, not a virtue.

## 9. Performance testing

- k6 scripts under `ops/perf/`:
  - Auth + list ontologies.
  - Write commit (small, medium, large).
  - Diff between two random commits.
  - Import 100k concepts CSV.
- Targets match the performance table in [VERSIONING_SYSTEM.md § 13](../02_architecture/VERSIONING_SYSTEM.md#13-performance-targets).
- Run against pre-prod monthly; on-demand before a release with perf-sensitive changes.

## 10. Accessibility testing

- `@axe-core/playwright` integrated into e2e.
- Storybook runs axe in CI on each component variant.
- No violations at WCAG 2.2 AA level.

## 11. Flake policy

- Flake = failure that passes on retry within the same commit.
- Flake rate dashboarded in Grafana.
- Test is quarantined after 3 flakes in 7 days: moved to a nightly job, owner tagged to fix or delete in ≤ 5 business days.

## 12. Test tooling summary

| Purpose | Tool |
|---|---|
| Unit / integration | Vitest |
| Property tests | fast-check |
| HTTP integration | supertest |
| E2E | Playwright |
| Containers | Testcontainers |
| Visual regression (critical components) | Chromatic (later) |
| Load | k6 |
| Accessibility | @axe-core/playwright |
| Security — SAST | Semgrep |
| Security — deps | `pnpm audit`, Snyk |
| Secrets scan | gitleaks |

Related: [Development Setup](DEVELOPMENT_SETUP.md) · [Versioning System](../02_architecture/VERSIONING_SYSTEM.md) · [CI/CD](../05_operations/CI_CD.md)
