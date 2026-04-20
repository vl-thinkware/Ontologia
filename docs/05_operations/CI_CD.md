# CI / CD

GitHub Actions workflows and the policies that govern them.

---

## 1. Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | PR, push to `main` | lint, typecheck, tests, build, security scans |
| `e2e.yml` | PR (on label `run-e2e` or critical paths), `main` | full Playwright suite |
| `deploy-staging.yml` | push to `main` | migrate + deploy staging |
| `deploy-prod.yml` | manual (tag) | migrate + deploy prod (with approval) |
| `release.yml` | tag `v*` | build release artefacts + changelog |
| `nightly.yml` | cron | property-based tests, deep e2e, perf smoke |
| `sdk-publish.yml` | tag `sdk-js-v*` or `sdk-py-v*` | publish to npm / PyPI |
| `docs.yml` | change under `docs/**` | build and deploy `docs.ontologia.com` |
| `security-scans.yml` | cron + PR | Semgrep, npm audit, dependency diff |

## 2. Runners & caches

- Linux runners by default; macOS for the occasional browser compatibility job.
- Turborepo remote cache (Vercel) for monorepo tasks.
- `pnpm` store cached keyed by lockfile hash.
- Docker layer caching via registry for the API image.

## 3. CI ordering

Order within `ci.yml`:

1. Setup + install (parallel across packages).
2. Lint + typecheck (parallel).
3. Unit tests (parallel by package).
4. Integration tests (Testcontainers spun up per job).
5. Build (FE bundle sizes enforced).
6. E2E on critical paths (smoke suite, not full).
7. Security scans.
8. Coverage aggregation + upload.

Fail-fast on lint/typecheck; tests run in parallel.

## 4. Required checks (branch protection)

On `main`:

- `ci / lint`
- `ci / typecheck`
- `ci / unit`
- `ci / integration`
- `ci / build`
- `ci / security`
- `e2e / smoke` (on PRs touching app code)
- ≥ 1 approval from reviewers
- CODEOWNER approval where relevant

## 5. Secrets in CI

- Provided via GitHub Actions encrypted secrets.
- Never printed; CI masks by default, but we also redact explicitly in log-sensitive steps.
- OIDC used to authenticate to cloud providers (no long-lived cloud keys in CI).
- Doppler CLI used for runtime env in staging deploys.

## 6. Deploy jobs

### staging

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
      - run: flyctl deploy --strategy rolling --config infra/fly/staging-api.toml
      - run: pnpm --filter web vercel-deploy --env staging
  smoke:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - run: pnpm --filter e2e test:smoke --env staging
```

### prod

Same, with:
- `workflow_dispatch` trigger only.
- `environment: production` and reviewers required.
- Canary 10% traffic for 10 min before 100%.

## 7. Release artefacts

- Backend Docker images pushed to `ghcr.io/ontologia/api:<sha>` and tagged `:v1.2.3`.
- Source maps uploaded to Sentry with the release version.
- SDKs built with the same tag.

## 8. Metrics on CI

- Per-workflow runtime distribution tracked in Grafana.
- Flaky test dashboard updated nightly.
- Deploy success/failure rate per week.

## 9. Engineering hygiene enforced by CI

- Bundle size budgets ([FRONTEND_GUIDE.md](../03_engineering/FRONTEND_GUIDE.md#16-performance-budgets-enforced)).
- Migration numbering continuity.
- OpenAPI spec regenerated and diff surfaced on PR.
- No drift: `pnpm dedupe --check`, `turbo run build --dry-run`.

## 10. Breakglass

If CI is broken in a way that blocks a critical fix:

- CTO can `workflow_dispatch` the deploy workflow with a specific `sha`.
- Requires 2-of-3 approval from CTO / VP Eng / Lead Engineer.
- Must be followed by a retro.

Related: [Deployment](DEPLOYMENT.md) · [Release Process](RELEASE_PROCESS.md) · [Testing Strategy](../03_engineering/TESTING_STRATEGY.md)
