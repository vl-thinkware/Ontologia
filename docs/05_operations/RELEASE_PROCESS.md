# Release Process

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


How we go from "green on main" to "customer impact", safely and repeatably.

---

## 1. Cadence

- **Continuous to staging.** Every merge to `main` deploys to staging in < 15 min.
- **Weekly to prod.** Tuesdays at 14:00 UTC (avoid Mondays and Fridays). Shipment of the accumulated green changes.
- **Monthly stable track.** `release/x.y` tag cut monthly, targeted by Enterprise customers on pinned releases.
- **Hotfixes.** Any day, any time, with extra care.

## 2. Roles

- **Release lead (rotating, weekly).** Owns the release train.
- **Release reviewers (CODEOWNERS).** Required approvals on the prod deploy workflow.
- **Communications.** Changelog draft + customer comms, owned by the release lead unless delegated.

## 3. Release lead checklist (weekly)

Day before:

- [ ] Changes on `main` since last tag catalogued and labelled.
- [ ] Any open SEV2+ items triaged.
- [ ] Release notes drafted from Conventional Commits + manual curation.
- [ ] Breaking changes flagged with migration guidance.
- [ ] Go/no-go signals green: synthetic checks, staging soak, e2e suite.

Release day:

- [ ] Tag `vX.Y.Z`.
- [ ] Trigger `deploy-prod.yml`.
- [ ] Approve; watch canary metrics for 10 min.
- [ ] Confirm 100% rollout.
- [ ] Post-deploy smoke passes.
- [ ] Changelog published to `docs.ontologia.com/changelog`.
- [ ] Customer email for significant releases.
- [ ] `#deploys` retro note: what went well, what was flaky.

## 4. Versioning

- Semantic Versioning.
- Public API changes govern major/minor bumps:
  - Additive (non-breaking): minor bump.
  - Breaking: major bump with deprecation window.
- UI-only changes don't bump the API version.

## 5. Release notes style

- Group by type: `Added`, `Improved`, `Fixed`, `Deprecated`, `Security`.
- One clear sentence per item; link to docs where helpful.
- No internal jargon. "Improved diff rendering performance on large ontologies" > "Introduced virtualised rendering for DiffNode".
- Breaking changes get their own section at the top with migration notes.

## 6. Feature flags & GA transitions

- New features ship behind a flag, default OFF.
- Enablement ramp: internal → beta cohort → GA.
- A feature is "GA" when:
  - Docs page published.
  - Supported in the SDK.
  - Telemetry baseline exists.
  - At least one customer success story or design partner.
- Flag-removal PR within 2 releases of 100% rollout.

## 7. Deprecations

Any public change that will remove behaviour:

- Document in the release notes under `Deprecated`.
- Add runtime warnings (log + `Deprecation` / `Sunset` headers on the API).
- Email affected tenants via API key owners.
- Removal window: 12 months public API, 6 months for internal / undocumented features.

## 8. Enterprise release track

- `release/x.y` branch cut monthly from a stable `main` SHA.
- Only bug fixes and security patches cherry-picked into release branches.
- Pin selected by each Enterprise customer; they can opt into a later release after validation.
- End-of-life per release: 12 months.

## 9. Hotfix flow

1. Identify smallest change.
2. Branch from the affected release tag.
3. PR with `hotfix:` in title, minimum review (CTO + one).
4. Deploy to staging-like env for smoke.
5. Deploy to prod with expedited canary.
6. Cherry-pick into `main` within 24 h.

## 10. Release communications

- Minor / patch releases: public changelog only.
- Notable features / breaking changes: email to all admins, post on blog, optional webinar for Enterprise.
- Security fixes: CVE-style advisory when appropriate, coordinated disclosure if reported externally.

## 11. Metrics

- Change failure rate (rollbacks + hotfixes ÷ releases) — target < 15%.
- Lead time for changes (PR open → prod) — target p95 < 48 h.
- Time to restore service — target p95 < 60 min.

DORA metrics dashboarded in Grafana.

## 12. Release retrospectives

- Lightweight note after every release.
- Quarterly deep dive: trends in failure rate, lead time, flaky tests, incident triggers.

Related: [Deployment](DEPLOYMENT.md) · [CI/CD](CI_CD.md) · [Incident Response](INCIDENT_RESPONSE.md)
