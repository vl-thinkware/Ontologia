# Git Workflow

## 1. Model

**Trunk-based development.** Short-lived branches off `main`, frequent merges, feature flags to hide unfinished work.

- `main` — always shippable, green, deployed to staging on every merge.
- `release/*` — cut from `main` at a SHA, used for GA pinning on the Enterprise tier where releases are slower (monthly).
- Everything else is short-lived.

## 2. Branch naming

- `feat/<slug>` — new functionality.
- `fix/<slug>` — bugfix.
- `refactor/<slug>` — no functional change.
- `chore/<slug>` — tooling, deps, infra.
- `docs/<slug>` — docs only.
- `perf/<slug>` — performance.

Slug is kebab-case, short, human.

## 3. Commits

- **Conventional Commits** format:
  ```
  <type>(<scope>): <subject>

  <body>

  <footer>
  ```
- Accepted types: `feat | fix | refactor | docs | style | test | chore | perf | build | ci | revert`.
- Scope is optional but encouraged: `feat(canvas): virtualised rendering`.
- `!` after type denotes breaking change (`feat(api)!: remove /v0 route`) and requires `BREAKING CHANGE:` in the footer.
- Subject in the imperative, ≤ 72 chars, no trailing period.
- `commitlint` enforces format.

## 4. Pull Requests

### PR lifecycle

1. Open as **draft** until you want feedback or ready.
2. Fill out the PR template:
   - What
   - Why
   - How tested
   - Screenshots / video for UI
   - Checklist (tests added, docs updated, feature flag added if needed)
3. Assign yourself; request 1 reviewer (2 on security / schema / payments).
4. Keep under ~400 LOC diff; split if larger.
5. Rebase if main moves and PR goes stale (we avoid merge commits into feature branches).
6. Merge via **Squash and merge** — PR title becomes the squash commit message (so it must follow Conventional Commits).

### Review SLA

- First response within **4 business hours**.
- Full review within **24 business hours**.
- Urgent hotfix tag `urgent-review`: we all stop and look.

### Merge conditions

- All required checks green (lint, typecheck, unit, integration, coverage, a11y where applicable, e2e for critical flows).
- ≥ 1 approving review.
- No unresolved conversations.
- Branch up to date with `main`.
- Feature flag in place for any user-visible change that isn't fully GA-ready.

### Reverting

- If main breaks, revert first, investigate second.
- `git revert` a squashed commit; if revert is messy, roll back the deploy.
- File a post-mortem if customer impact > 10 minutes.

## 5. Code ownership

`CODEOWNERS` at repo root:

```
apps/api/**                    @backend
apps/web/**                    @frontend
packages/graph/**              @backend @data-platform
packages/db/migrations/**      @backend @cto
packages/sdk-js/**             @api
infra/**                       @platform
docs/**                        @product @cto
```

Owners are auto-requested on PRs touching their area. Merges require their approval for the sensitive paths (migrations, payments, auth).

## 6. Protected branches

`main`:
- Require PR.
- Require status checks.
- Require review approval.
- Require linear history.
- Do not allow force-push.
- Do not allow deletion.

`release/*`:
- Same as main, plus: require CODEOWNER approval, require signed commits.

## 7. Tags & releases

- Semver: `vMAJOR.MINOR.PATCH`.
- Tag on every GA release. Release notes auto-generated from Conventional Commits between tags, curated by the release lead.
- Pre-releases: `v1.0.0-rc.1`.
- Changelog published at `docs.ontologia.com/changelog`.

## 8. Hotfix flow

1. Cut branch off the latest release tag.
2. Smallest possible fix.
3. PR → reviews → merge into `release/*` → deploy.
4. Cherry-pick (or re-author) into `main` within 24 h.
5. Post-mortem if customer impact.

## 9. Long-running changes

If a change cannot land in a week:

- Put it behind a feature flag.
- Split into PRs: scaffolding → core logic → UI wiring → flag flip.
- Keep the branch current with main via daily rebase.

## 10. Commit signing

Signed commits encouraged; required on `release/*`. Team members must set up `commit.gpgsign` or the ssh-signing alternative. See [onboarding checklist](../09_team/ONBOARDING.md).

## 11. What not to commit

- Secrets. Ever. `gitleaks` runs in CI and blocks merges.
- Generated artefacts (put them in `.gitignore`).
- Large binary blobs. Use Git LFS if genuinely needed (rare).
- Dependency lockfiles from other package managers (we use pnpm only).

Related: [Coding Standards](CODING_STANDARDS.md) · [Release Process](../05_operations/RELEASE_PROCESS.md) · [Contributing](../09_team/CONTRIBUTING.md)
