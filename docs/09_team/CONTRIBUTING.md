# Contributing

How to contribute to Ontologia as a team member, a design partner, or an external contributor on our open-source components.

---

## 1. Ways to contribute

- **Code**: features, fixes, refactors, tests, tooling.
- **Docs**: tutorials, reference, translations, examples.
- **Design**: UX critiques, prototypes, icon updates, accessibility audits.
- **Examples**: public ontology templates and importers.
- **Reports**: bugs, security issues, UX friction.
- **Community**: answering questions, reviewing PRs, triaging issues.

## 2. Code of conduct

Everyone interacting with our community, repo, Slack, or events agrees to our [Code of Conduct](CODE_OF_CONDUCT.md). Short version: be kind, be humble, assume good intent, and leave the campsite cleaner than you found it.

## 3. Repositories

- `ontologia/ontologia` — monorepo (apps + packages). Closed-source (proprietary), contributions via internal GitHub.
- `ontologia/examples` — public ontology examples. MIT license.
- `ontologia/sdks` — TypeScript SDK and code samples. MIT license.
- `ontologia/docs-public` — marketing and docs site. MIT for content; CC-BY for images.
- `ontologia/claude-plugins` — optional integrations. MIT.

External contributors work in the public repos. Internal contributors work across all.

## 4. Local development (internal)

See [DEVELOPMENT_SETUP.md](../03_engineering/DEVELOPMENT_SETUP.md) for the full monorepo setup. Short version:

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm db:migrate
pnpm dev
```

Default ports: web 3000, API 4000, docs 3001.

## 5. Branching & commits

- Trunk-based: feature branches off `main`, short-lived (< 3 days).
- Branch names: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
- Commits use [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat(canvas): add snap-to-grid`).
- See [GIT_WORKFLOW.md](../03_engineering/GIT_WORKFLOW.md) for branch protection rules.

## 6. Pull requests

- Linked issue or short problem statement.
- Description: what, why, how.
- Screenshots / recordings for UI changes.
- Tests included unless explicitly out of scope.
- `pnpm check` green locally before push.
- Small PRs preferred (< 400 lines excluding generated code).

### Review
- At least one reviewer approval required.
- Sensitive paths (`auth`, `billing`, `migrations`, `multi-tenancy`) require a CODEOWNER.
- Reviewer SLA: 1 business day.

### Merge strategy
- Squash merge into `main`. Conventional Commits drive the changelog.

## 7. Testing expectations

| Change type | Required tests |
|---|---|
| Feature | Unit + at least one integration test |
| Bug fix | Test that reproduces the bug |
| Refactor | Equivalent coverage; behaviour unchanged |
| UI | Visual regression snapshot |
| Security | Specific negative tests; cross-tenant tests |

See [TESTING_STRATEGY.md](../03_engineering/TESTING_STRATEGY.md).

## 8. Coding standards

Read [CODING_STANDARDS.md](../03_engineering/CODING_STANDARDS.md). Must-know rules:

- Prettier + ESLint pre-commit.
- TypeScript strict mode, no `any` without a comment.
- No direct DB access outside `@ontologia/db`.
- No secrets anywhere near the repo.
- Public functions documented with JSDoc.

## 9. Documentation

- Every feature PR updates or adds documentation in `docs/`.
- Public features update `docs-public`.
- Internal docs in `docs/` follow the style of the rest of the repo (plain English, no jargon, link heavily).
- We use Markdown with Mermaid for diagrams.

## 10. Accessibility

- WCAG 2.2 AA is the minimum for anything shipped (see [ACCESSIBILITY.md](../04_design/ACCESSIBILITY.md)).
- Accessibility review required for significant UI changes.

## 11. Design system

- Use components from `@ontologia/ui`.
- New components go through design review.
- No one-off Tailwind values; extend tokens if needed.

## 12. Security

- Follow the [Security Checklist](../06_security_compliance/SECURITY_CHECKLIST.md).
- Threat-model any change to authz, auth, billing, or public API.
- Security issues: `security@ontologia.com` (PGP public key published).

## 13. Community contributions (public repos)

### Reporting bugs
- Issue template with repro steps, expected vs actual, environment, screenshots if relevant.

### Suggesting features
- Open a discussion first. Features are considered via our public roadmap.

### Code contributions
- Fork → feature branch → PR against `main`.
- DCO sign-off on commits (`git commit -s`).
- We use a CLA for non-trivial contributions (automated via `cla-assistant`).

### Licensing
- Public repos use MIT unless noted otherwise.
- Contributions are licensed under the repo's license.

## 14. Examples & public ontologies

The `examples/` repo collects community-curated ontology templates. Add a new one by:

1. Folder `examples/<topic>/` with `ontology.json` (JSON-LD), `README.md`, and screenshots.
2. Test: `pnpm validate examples/<topic>`.
3. PR with author credit.

## 15. Translations

Post-GA, we accept translations of the docs and marketing site. Translation contributions follow the `docs-public` repo guidelines and use Lokalise as the translation management tool.

## 16. Working with the roadmap

- Public roadmap at `ontologia.com/roadmap`.
- Requests reviewed by PM weekly.
- Customers can upvote.
- Status labels: Idea, Considering, Planned, In Progress, Shipped.
- "Planned" does not mean "guaranteed"; we communicate changes.

## 17. Support channels

- Public: community Slack/Discord, GitHub discussions.
- Customers: Intercom / Plain.
- Security: `security@ontologia.com`.
- Privacy: `privacy@ontologia.com`.

## 18. Contributor recognition

- Every merged PR gets a thank-you in the release notes when non-trivial.
- Annual "Contributors of the Year" list with swag and credits.
- Major external contributors may be offered paid contract work.

## 19. Hiring path

Community contributors who demonstrate excellent taste and consistency are natural candidates for our team. Reach out at `jobs@ontologia.com` or see [HIRING_PLAN.md](HIRING_PLAN.md).

## 20. Decision making

- RFC process for significant changes (`docs/rfcs/NNNN-title.md`).
- Maintainers approve RFCs within 2 weeks.
- Disagreements: escalate to CTO for technical, CEO for strategic.

## 21. Credits & license summary

- Public repos: MIT unless specified.
- Docs: CC-BY-4.0.
- Trademarks & logos: owned by Ontologia SAS. See `TRADEMARKS.md` in public repos.

Related: [Onboarding](ONBOARDING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Hiring Plan](HIRING_PLAN.md) · [Coding Standards](../03_engineering/CODING_STANDARDS.md) · [Git Workflow](../03_engineering/GIT_WORKFLOW.md)
