# CI / CD

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)

GitHub Actions workflows and the policies that govern them. Lean in Phase 0–2 (free-tier minutes only), richer from Phase 3 onward.

> **Bootstrap constraints.** GitHub Actions private-repo free tier is 2,000 minutes / month. We design CI to fit inside that budget by running expensive checks only where they earn their keep, caching aggressively, and deferring nightly matrices until we have revenue.

---

## 1. Workflows

| Workflow | Trigger | Purpose | When it ships |
|---|---|---|---|
| `ci.yml` | PR, push to `main` | lint, typecheck, tests, build, security scans | Phase 0 |
| `e2e.yml` | PR (on label `run-e2e` or critical paths), `main` | full Playwright suite | Phase 2 |
| `deploy-staging.yml` | push to `main` | migrate + deploy staging | Phase 2 |
| `deploy-prod.yml` | manual (tag) | migrate + deploy prod (with approval) | Phase 2 |
| `release.yml` | tag `v*` | build release artefacts + changelog | Phase 2 |
| `nightly.yml` | cron | property-based tests, deep e2e, perf smoke | Phase 3 |
| `sdk-publish.yml` | tag `sdk-js-v*` or `sdk-py-v*` | publish to npm / PyPI | Phase 3 |
| `docs.yml` | change under `docs/**` | build and deploy `docs.semlify.com` | Phase 2 |
| `security-scans.yml` | cron + PR | Semgrep, npm audit, dependency diff | Phase 2 |

Phase 0–1: a single `ci.yml` plus a manual "push to Render" script is enough. Two founders don't need canary deploys.

## 2. Runners & caches

- Linux runners by default. macOS runners (expensive) only for the occasional browser-compat job, which we don't run in Y1.
- Turborepo remote cache (Vercel free tier) for monorepo tasks.
- `pnpm` store cached in GitHub Actions keyed by lockfile hash.
- Docker layer caching via GitHub Container Registry for the API image.

## 3. CI ordering

Order within `ci.yml`:

1. Setup + install (parallel across packages).
2. Lint + typecheck (parallel).
3. Unit tests (parallel by package).
4. Integration tests (Testcontainers spun up per job — Postgres + Redis; Neo4j only on the tests that need it).
5. Build (FE bundle sizes enforced via a simple gzip check).
6. E2E on critical paths (smoke suite, not full — from Phase 2 onwards).
7. Security scans (from Phase 2 onwards).
8. Coverage aggregation + upload to Codecov free tier.

Fail-fast on lint/typecheck; tests run in parallel.

## 4. Required checks (branch protection)

On `main`:

- `ci / lint`
- `ci / typecheck`
- `ci / unit`
- `ci / integration`
- `ci / build`
- `ci / security` (from Phase 2)
- `e2e / smoke` on PRs touching app code (from Phase 2)
- ≥ 1 approval from the other founder (both founders = both CODEOWNERs on the whole repo during Phase 0–2)

Phase 3+ (first hire): CODEOWNERs split by area; 1 approval from a non-author human.

## 5. Secrets in CI

- Provided via GitHub Actions encrypted secrets.
- Never printed; CI masks by default, and we also redact explicitly in log-sensitive steps.
- OIDC used to authenticate to cloud providers where supported (no long-lived cloud keys in CI when avoidable).
- Doppler CLI used for runtime env in staging deploys.

## 6. Deploy jobs

### Phase 0–1 (manual shove)

```bash
# local script, committed to repo
pnpm --filter db migrate:deploy
pnpm --filter graph migrate:deploy
render deploys:create --service api-prod
```

That's it. We don't run auto-deploy until we have paying customers and therefore a reason to care about hands-on mishaps.

### Phase 2 — staging

```yaml
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter db migrate:deploy
      - run: pnpm --filter graph migrate:deploy
  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: render deploys:create --service api-staging --wait
      - run: pnpm --filter web vercel-deploy --env staging
  smoke:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - run: pnpm --filter e2e test:smoke --env staging
```

### Phase 2+ — prod

Same as staging, with:
- `workflow_dispatch` trigger only.
- `environment: production` and two-of-two founder reviewers required.
- Rolling deploy on Render; we skip canary in Year 1 because traffic volume doesn't justify the complexity.

### Phase 4+ — canary

Traffic split 10% for 10 minutes before 100% — introduced when we have > 50 paying customers and a failed deploy would cost us more than the engineering time to add canary.

## 7. Release artefacts

- Backend Docker images pushed to `ghcr.io/semlify/api:<sha>` and tagged `:v1.2.3`.
- Source maps uploaded to Sentry with the release version.
- SDKs built with the same tag (from Phase 3).
- Release notes auto-generated from Conventional Commits and posted to `#releases` in the team Slack (Phase 2+).

## 8. Metrics on CI

- Per-workflow runtime distribution tracked in Grafana (Phase 3+).
- Flaky-test dashboard updated nightly (Phase 3+).
- Deploy success/failure rate per week.
- **Monthly Actions minutes used**: tracked every Monday; alert if > 80% of free-tier budget mid-month.

## 9. Engineering hygiene enforced by CI

- Bundle-size budgets ([FRONTEND_GUIDE.md](../03_engineering/FRONTEND_GUIDE.md#16-performance-budgets-enforced)).
- Migration numbering continuity.
- OpenAPI spec regenerated and the diff surfaced on PR.
- No drift: `pnpm dedupe --check`, `turbo run build --dry-run`.

## 10. Breakglass

If CI is broken in a way that blocks a critical fix:

- Alexandre can `workflow_dispatch` the deploy workflow with a specific `sha`.
- Requires Valentin's ack in Slack (2-of-2 founder rule stays in place — we are the only humans who can approve).
- Must be followed by a short retro written within 48 hours.

## 11. Year-one CI budget target

- CI runs: aim for < 80% of the 2,000 free-tier minutes / month.
- If we're trending over, inspect the slowest jobs first:
  - Integration tests with full Neo4j start-up → gate behind file-path filters.
  - E2E smoke → move to nightly instead of per-PR.
  - Cold `pnpm install` → audit the monorepo for fresh-cache misses.

Paid Actions minutes unlock only when they're cheaper than the engineering time it would take to keep us inside the free tier.

Related: [Deployment](DEPLOYMENT.md) · [Release Process](RELEASE_PROCESS.md) · [Testing Strategy](../03_engineering/TESTING_STRATEGY.md) · [Infrastructure](INFRASTRUCTURE.md)
