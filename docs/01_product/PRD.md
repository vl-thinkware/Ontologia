# Product Requirements Document — Ontologia v1.0

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


Document owner: Product (Valentin Lemort)
Status: **draft for engineering review**
Last updated: 2026-04-20
Source of truth for v1 scope: `Ontologia — Spécifications v1.0.pdf` (17 Apr 2026)

---

## 1. Problem statement

Data and AI teams at mid-market and enterprise companies increasingly depend on **knowledge graphs** — product taxonomies, entity graphs, compliance ontologies — to power search, analytics, RAG and agent pipelines. These artefacts:

- are edited by multiple people with very different technical profiles,
- evolve continuously with the business,
- must stay consistent across downstream systems (BI, data catalogs, ML features),
- have no first-class tool that combines graph-native storage with modern, software-engineering-style governance.

Existing tools are either academic (Protégé), heavy and expensive (TopBraid Composer), or conceptually mismatched (Confluence + draw.io, Miro, Figma). None offers the "GitHub ergonomics for concepts" that teams need.

## 2. Product goal

Deliver a SaaS platform where teams can **collaboratively design, version and govern ontologies** with:

- A fast, visual graph editor for concepts and typed relations.
- Git-like versioning (commits, branches, diffs, revert).
- Conceptual pull requests with review and comments.
- A stable, versioned API for integration into data and AI pipelines.
- Multi-tenant, role-based access.

## 3. Non-goals (v1.0)

- OWL-DL reasoning / formal proof engines.
- On-prem deployment (deferred to Enterprise tier, v1.5+).
- Native Turtle/OWL code editor (import only, v1).
- Real-time multiplayer cursors (deferred post-v1).
- Deep instance-level master data management.

## 4. Target users

See [PERSONAS.md](PERSONAS.md) for full personas.

| Persona | Primary role | Primary jobs-to-be-done |
|---|---|---|
| Knowledge Architect | Builds and maintains ontologies | Model, govern, publish stable versions |
| Domain Expert | Contributes domain knowledge | Suggest/edit, comment, approve |
| Platform Engineer | Consumes the graph | Integrate via API/webhooks, receive change notifications |

## 5. Key use cases

1. **Build from scratch.** A new data architect imports a CSV of product categories, links them, publishes v1 to `main`, and exports JSON-LD for downstream consumption.
2. **Governed change.** A product manager proposes a new set of product variants on a branch; two architects review and approve; the branch is merged; downstream systems pick up the new version via webhook.
3. **Compliance audit.** A security officer exports a complete audit log of all changes in the past 12 months with author, timestamp and diff.
4. **Safe rollback.** An editor merges a buggy re-categorisation; an admin reverts to the prior version in 30 seconds; the audit trail is intact.
5. **AI integration.** A platform engineer retrieves the `main@latest` version over REST and indexes it for a RAG system, re-indexing automatically on every webhook.

## 6. Functional requirements (MoSCoW)

### Must have (v1.0)

**M1 — Visual graph editor.** Create/edit/delete concepts (nodes) and relations (edges). Each concept has a name, description, properties (key/value), a status (`draft`, `validated`, `deprecated`), and a stable id. Canvas supports zoom, pan, filter by relation type, multi-select.

**M2 — Git-like versioning.** Every change set is saved as an immutable commit with author, timestamp, message and parent commit. UI surfaces the commit graph and a diff view (add/modify/delete) between any two commits. Revert to a previous commit is a one-click operation that creates a new commit.

**M3 — Branches.** Branches from any commit; switch; fast-forward or 3-way merge; conflict detection at the concept/relation level; conflict resolution UI.

**M4 — Multi-tenant & workspaces.** Organisations contain workspaces; workspaces contain ontologies. Roles: Owner, Editor, Reviewer, Viewer. No cross-tenant data visibility.

**M5 — Import / Export.** Import: CSV (concepts + relations), JSON-LD, simplified OWL. Export: JSON, CSV, JSON-LD.

**M6 — Search & navigation.** Full-text search on concepts, descriptions, properties, synonyms. Tree view for `is-a` hierarchies. Quick-jump command palette.

### Should have (v1.1)

**S1 — Review Requests (conceptual PRs).** Propose → review → approve / request changes → merge. Email and in-app notifications.

**S2 — Comments & annotations.** Thread-style comments on concepts, relations and diffs; @mentions.

**S3 — Public REST API.** OpenAPI 3.1 documented; API-key auth; read/write endpoints for ontologies, concepts, relations, commits and branches.

**S4 — Changelog & audit log.** Human-friendly changelog; exportable (CSV/JSON) audit log.

**S5 — Rich metadata.** Custom properties including synonyms, source, confidence, validation status.

### Could have (v2.0)

**C1 — Light inference.** Transitive closure over `is-a`; cycle detection; contradiction detection on declared symmetry/transitivity of relation types.

**C2 — AI suggestions.** LLM-based suggestions for missing concepts, similar concepts, candidate relations.

**C3 — Webhooks & connectors.** Webhook subscriptions on key events (`commit.created`, `branch.merged`, `review.approved`). Native connectors: dbt, DataHub, Atlan.

**C4 — Cypher console.** Read-only in v1, opt-in write later.

**C5 — Templates.** Out-of-the-box starter ontologies for common verticals.

### Won't have (this release)

- Full OWL-DL reasoning.
- Native Turtle/OWL editor.
- Self-hosted deployment.

## 7. Non-functional requirements

| Domain | Requirement |
|---|---|
| Availability | 99.9% monthly on Pro/Enterprise; 99.5% on Free/Starter |
| P95 latency | < 300 ms for CRUD; < 1.5 s for diff of ≤10k changes |
| Scale per workspace | 1M concepts, 5M relations without degradation |
| Security | SOC 2 Type I within 12 months of GA, Type II within 24 months |
| Compliance | GDPR; CCPA; configurable data residency on Enterprise |
| Accessibility | WCAG 2.2 AA for all public-facing UI |
| i18n | English + French at GA; Spanish + German within 12 months |
| Browser support | Last 2 versions of Chrome, Edge, Firefox, Safari |

## 8. Key user journeys

Fully illustrated in [USER_FLOWS.md](USER_FLOWS.md). At a glance:

1. Sign up → create workspace → invite collaborators.
2. Start from template OR import CSV.
3. Edit on `main` OR branch + open Review Request.
4. Diff → Review → Merge.
5. Consume via API / webhook.

## 9. Success metrics

### North-star metric
**Weekly active governed ontologies (WAGO)** — ontologies receiving at least one commit or one review event per week across the paid fleet.

### Activation
- % of new workspaces that create a first commit within 24 h (target > 60%).
- Time-to-first-commit (target median < 10 min).

### Engagement
- Avg commits per ontology per month (target > 8 on Pro).
- Avg reviewers per branch merged (target > 1 on Pro).

### Retention & commercial
- D30 paid retention > 90%.
- Net revenue retention (NRR) > 110% at 12 months.
- Logo churn < 2% / month.

### Reliability / quality
- Sev-1 incidents per quarter ≤ 1.
- Error rate on `/api/*` < 0.5%.
- Change failure rate < 15%.

## 10. Assumptions

- Neo4j Aura meets multi-tenant isolation and cost targets (one db per tenant on Pro+; namespaced on Starter).
- Clerk covers auth for MVP; we will migrate if / when SSO complexity demands it.
- An average paying workspace stays under 200k concepts for the first 18 months.

## 11. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Merge UX is hard and wrong by default | Blocks adoption | Prototype the conflict UI with design partners before GA; start with fast-forward only |
| Neo4j per-tenant cost explodes on Starter | Margin erosion | Use namespacing on Free/Starter, per-tenant DB only on Pro+ |
| "Ontology" framing scares non-technical users | Slow adoption by Persona B | Adopt "knowledge model" / "concept map" vocabulary in marketing; keep "ontology" in engineering docs |
| Competitors (Atlan, DataHub) add a similar layer | Differentiation erosion | Lead on versioning depth + graph-native UX; move fast on integrations |
| Data-sensitive industries require on-prem | Lost enterprise deals | Publish 2027 on-prem roadmap; offer VPC deployment as bridge |

## 12. Dependencies

- Neo4j Aura availability in target regions (US, EU).
- Clerk (auth), Stripe (billing), Sentry + Logtail (observability), Vercel (FE), Render or Fly.io (BE).
- Legal: Terms of Service, Privacy Policy, DPA, SCC.

## 13. Open questions

Tracked in [REFINEMENTS.md](REFINEMENTS.md). The five from the PDF are included there with recommended answers.

## 14. Related documents
- [Vision](../00_overview/VISION.md)
- [Roadmap](../00_overview/ROADMAP.md)
- [Features](FEATURES.md)
- [User Flows](USER_FLOWS.md)
- [Architecture](../02_architecture/ARCHITECTURE.md)
- [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
