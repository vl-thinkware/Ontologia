# Product Requirements Document — Ontologia v1.0

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v5 (ontology-only product)


Document owner: Product (Valentin Lemort)
Status: **draft for engineering review**
Last updated: 2026-04-23
Source of truth for v1 scope: `Ontologia — Spécifications v1.0.pdf` (17 Apr 2026), the T-Box / A-Box data-model refactor of late April 2026, and the ontology-only repositioning of 23 April 2026.

> **One product, one data model — modelled at whatever depth suits the team.** Every artefact in Ontologia is an Ontology. The data model is a two-layer graph: a *schema layer* (T-Box) of `ConceptClass` and `RelationType` entities, and an *instance layer* (A-Box) of `ConceptScheme` containers holding typed `Concept` nodes. Taxonomies are ConceptSchemes living inside an ontology — a single ontology can host many taxonomies side-by-side. There is no separate "glossary" or "taxonomy" product: users model with as few or as many classes as they need, and the product never asks them to switch mode. See [DATA_MODEL.md](../02_architecture/DATA_MODEL.md).

---

## 1. Problem statement

Every data-, content- and AI-mature organisation maintains some form of **concept registry** — the shared list of things the business talks about, plus how they relate. Depending on the team and the maturity, that registry shows up as:

- a **business glossary** owned by data governance or a founding PM,
- a **controlled vocabulary** or **taxonomy** owned by content ops, merchandising, or support ops,
- an **ontology** or **knowledge graph** owned by data architects or an AI platform team.

These names sound different, but under the hood they're the same thing at different depths: a typed graph of concepts. Yet today that single problem is fragmented across a shelf of incompatible tools:

- Glossaries rot in Confluence, Notion or Google Docs, or live inside expensive data catalogs (Collibra, Alation, Atlan) that non-data stakeholders can't easily edit.
- Taxonomies run on PoolParty, TopBraid, Smartlogic (powerful, heavy, expensive) or on shared spreadsheets that break past ~1,000 terms.
- Ontologies are edited in Protégé, TopBraid or hand-rolled Neo4j projects that non-engineers can't touch.

Across all of these, teams suffer the same pains:

- **Schema and instances are divorced.** The T-Box lives in one artefact (or in someone's head), the A-Box in another; evolving them together is a project, not an everyday act.
- **Multi-profile editing is broken.** The people who *own the truth* are rarely the people who can wield the tool.
- **No software-engineering hygiene.** No diffs, no reviews, no versioned publishing, no audit trail.
- **Downstream integration is bespoke.** Every consumer (BI, RAG, search, agents, content systems) rebuilds its own ingestion.
- **Depth is a lock-in.** Graduating from a flat list to a hierarchy, or from a hierarchy to a typed graph, means a new vendor and a new rewrite.

No tool today offers a **typed-graph concept registry with GitHub ergonomics that scales from a few classes and one scheme to a dozen taxonomies sharing a single T-Box — in the same product, same API, same audit trail.**

## 2. Product goal

Deliver a SaaS platform where teams can **collaboratively design, version and govern ontologies at any depth** — from a thin schema with one scheme to a rich T-Box hosting many taxonomies side-by-side:

- A fast, opinionated editor with complementary views — **Dashboard**, **Schema**, **Canvas (Schema + Taxonomies modes)**, **Taxonomies tree**, **Tables** and **Concept detail** — all backed by one data model.
- A full T-Box editor: classes with custom attributes (string / number / boolean / enum / date / reference / money, required and localizable flags, enum values, description, hint) plus six SKOS-aligned built-ins (prefLabel, altLabel, hiddenLabel, definition, notation, example) carried by every concept; and relation types with domain / range and optional symmetry.
- A governance layer (change-event log, revert, tags, tag-to-tag diff, deprecation + replacement workflow, validation panel; branches/merges on the roadmap).
- A collaboration layer (live presence, notifications centre, AI suggestions, CSV import wizard, export modal covering JSON-LD / SKOS Turtle / OWL RDF-XML / CSV, API Playground).
- A stable, versioned API and standard-compliant exports so downstream pipelines can consume the registry without bespoke glue.
- Multi-tenant, role-based access, at a workspace-based price point reachable by every team — not just the ones with a six-figure data-governance budget.

## 3. Non-goals (v1.0)

- OWL-DL reasoning / formal proof engines (we ship pragmatic validation only).
- On-prem deployment (deferred to Enterprise tier, v1.5+).
- Native Turtle / OWL code editor (import and export only at v1).
- Real-time multiplayer cursors (deferred to Phase 3; presence and notifications ship at MVP).
- Instance-level master data management (we model the *concept*; MDM handles the records).
- Being a data catalog. We sit next to data catalogs, not inside them.
- Full ISO 25964 thesaurus compliance (we ship SKOS, which is the 80/20).

## 4. Target users

See [PERSONAS.md](PERSONAS.md) for full personas. Ontologia serves **three co-equal personas** — not three product modes — who often coexist on the same account.

| Persona | Primary views | Primary jobs-to-be-done |
|---|---|---|
| **Data Architect** | Schema, Canvas (Schema mode) | Design and evolve the T-Box; get domain/range right; make exports round-trippable |
| **Catalogue Maintainer** | Taxonomies tree, Tables, Concept detail | Curate concepts, prefLabels, deprecations; keep schemes healthy; react to validation-panel alerts |
| **Downstream Consumer (Platform Engineer)** | API Playground, Export modal | Pull versioned snapshots, subscribe to webhooks, consume SKOS / OWL / JSON-LD feeds |

Secondary personas (executive sponsor, security / compliance officer, LLM ops engineer) are acknowledged but not optimised for in v1.

## 5. Key use cases

1. **Cars catalogue from scratch.** A product engineer uses the "Catalog with multi-taxonomies" starter; adds Manufacturer, Model, BodyStyle, FuelType classes; creates five schemes (Model catalogue 2026, Body style taxonomy, Fuel type taxonomy, Market segments, Manufacturing geography); imports a CSV of 100 models; tags `v1` and exports SKOS Turtle to plug the catalogue into a retail search index.
2. **Evolving the T-Box under production schemes.** A data architect adds a new `Transmission` class plus a `hasTransmission` relation type on an ontology that already has thousands of active concepts. The Schema view blocks the delete of the old transmission attribute until every referencing concept has migrated. The Validation panel surfaces the remaining work.
3. **Taxonomy maintenance inside an existing ontology.** A catalogue maintainer working on the Body style taxonomy reparents "Coupe" under "Performance" by drag-drop in the Taxonomies tree — which rewrites the `broader` relation, records a ChangeEvent and keeps every downstream consumer stable.
4. **Governed change with deprecation.** A maintainer deprecates the concept "Diesel" on the Fuel type taxonomy with a `dct:isReplacedBy` pointer to "Diesel (EU6)". The Validation panel flags every Model still pointing at the old concept until they're remapped.
5. **Compliance audit.** A security officer exports a complete audit log of all changes over the past 12 months — every create, update, deprecation, revert, tag and bulk_import, with author, timestamp, diff and rationale.
6. **Safe rollback.** An editor publishes a buggy bulk import; an admin reverts the `bulk_import` event in one click; the audit trail is intact.
7. **AI integration.** A platform engineer retrieves the current published tag over REST, runs the API Playground to sanity-check payload shape, and wires a webhook so their RAG index re-builds on every `tag.created` event.

## 6. Functional requirements (MoSCoW)

### Must have (v1.0) — already proven out in the mockup

**M1 — T-Box editor.** Full Schema view: classes on the left (click-to-expand editor with SKOS built-ins read-only and custom attributes editable), relation types on the right (add/delete with domain, range, symmetry, built-in flag). Inline attribute editor supports value types string / number / boolean / enum / date / reference / money, required + localizable flags, enum values, description, hint. Delete-class and delete-relation-type refuse when they would break existing references; built-in `broader` relations cannot be removed.

**M2 — A-Box editor.** Concepts live in ConceptSchemes; every concept is typed to exactly one class and carries the six SKOS built-ins. Concept detail view has tabs for Overview, Properties, Relations, History, Usage and AI. Typed relations enforce domain/range at save time.

**M3 — Canvas with two modes.** Canvas opens on **Schema mode** by default (T-Box as an ER-style diagram with classes as nodes, relation types as edges). Toggle to **Taxonomies mode** shows the active scheme's concepts; the scheme switcher is visible in the toolbar. Nodes are draggable; hub-and-spoke initial layout. Right-rail inspector adapts: class inspector in Schema mode, concept inspector in Taxonomies mode.

**M4 — Taxonomies tree view** (`/tree`). Left rail: per-scheme collapsible trees. Centre: full ConceptDetail embedded. Drag-drop rows to re-parent, which rewrites the `broader` relation and records a ChangeEvent.

**M5 — Tables view.** Sortable datagrid (name, class, scheme, languages, relations, status, last change). Filter chips (all / active / deprecated), scheme tabs, row search, multi-select bulk actions (Deprecate, Tag). Rows click through to the full concept detail.

**M6 — Change control.** Every mutation records a ChangeEvent with author, timestamp, kind and parent. History panel on the right rail with filters by kind / author / entity. Diff modal per event (synthesized before/after). Tag-to-tag diff (v1.2 → v1.3) shows added / modified / removed rollups. Revert creates an opposite event; revert-of-revert is allowed.

**M7 — Starter templates.** "New ontology" modal with three starters: **Blank**, **Product reference**, **Catalog with multi-taxonomies**. Not a mode selector — just a preset that seeds a new ontology.

**M8 — Multi-tenant & workspaces.** Organisations contain workspaces; workspaces contain ontologies. Coarse-grained global roles: Owner, Editor, Reviewer, Viewer. **Container-scoped roles can be granted `CAN_WRITE` on specific ontologies (T-Box) or specific ConceptSchemes (A-Box) without leaking write access to the rest of the org** — so a product maintainer can curate a scheme inside a shared ontology without touching the schema layer. No cross-tenant data visibility.

**M9 — Import / Export.**
  - Import: CSV (wizard: upload → map → preview → import; produces one `bulk_import` event). JSON-LD, simplified OWL and SKOS import sit behind the same wizard where the mapping step is inferred.
  - Export modal: JSON-LD, SKOS Turtle, OWL RDF/XML, CSV. Scope selector picks between the full ontology (T-Box + every scheme) and a single scheme (A-Box only). Live preview + download.

**M10 — Governance.** Deprecation with reason and `dct:isReplacedBy` replacement pointer. Validation panel flags: orphan concepts, domain/range violations, duplicate prefLabels per scheme, deprecated-still-referenced, missing class.

**M11 — AI suggestions.** Per-concept panel: suggest altLabels (synonyms), auto-translate prefLabel into workspace languages, detect likely duplicates, suggest class for uncategorized concepts. Each accepted suggestion records a normal ChangeEvent.

**M12 — Collaboration surface.** Live presence (teammate avatars in the topbar, editing banner on active concepts, presence chips on tree rows). Notifications centre (bell icon) showing change events authored by others + review requests (once reviews ship).

**M13 — Distribution.** Export modal (M9), API Playground modal (endpoint picker covering list-concepts, list-relations, schema, get-concept, SPARQL; query params for `lang`, `tag`, `format`, `scheme`; live JSON response; copy-as-cURL / copy-as-fetch).

**M14 — Search & navigation.** Full-text search on concepts, descriptions, custom properties, SKOS altLabels and hiddenLabels. Quick-jump command palette (⌘K). Global topbar search forwards keystrokes into the command palette.

**M15 — Dashboard.** Activity feed (live from ChangeEvents, filter by kind, clickable rows), usage gauges, per-ontology tiles.

### Should have (v1.1)

**S1 — Review Requests (conceptual PRs).** Propose → review → approve / request changes → publish. Email and in-app notifications.

**S2 — Branches & merges.** Branch from any tag or event; switch; fast-forward or 3-way merge; conflict detection at the concept / relation level.

**S3 — Threaded comments & annotations.** Thread-style comments on concepts, classes, relation types and diffs; @mentions.

**S4 — Public REST API (hardened).** OpenAPI 3.1 documented; API-key auth; read / write endpoints for ontologies, classes, relation types, schemes, concepts, relations, change events and tags. Python SDK matches the REST contract.

**S5 — Changelog & audit log.** Human-friendly "what changed this month" digest (per ontology, emailable); exportable (CSV / JSON) audit log.

**S6 — Real-time collaboration server** (Yjs / Automerge) for live co-editing on concept detail, replacing optimistic presence-only behaviour with real cursors.

### Could have (v2.0)

**C1 — Light inference.** Transitive closure over `broader` / `is-a`; declared-transitivity propagation; declared-symmetry validation.

**C2 — Expanded AI pack.** Suggest relation candidates, suggest class hierarchies, definition drafting from corpus links; opt-in, drafts only.

**C3 — Webhooks & connectors.** Webhook subscriptions on key events (`change.created`, `tag.created`, `review.approved`). Native connectors: dbt, DataHub, Atlan, PoolParty-compatible SKOS feed.

**C4 — Cypher / SPARQL write console.** Read-only SPARQL already ships in the API Playground; write-capable console is Phase 3+.

**C5 — Vertical template packs.** Out-of-the-box starter ontologies for common verticals (product ontology for e-commerce, risk ontology for financial services, compliance ontology for healthcare).

### Won't have (this release)

- Full OWL-DL reasoning.
- Native Turtle / OWL code editor.
- Self-hosted deployment.
- Real-time multiplayer cursors at GA (Phase 3).

## 7. Non-functional requirements

| Domain | Requirement |
|---|---|
| Availability | 99.9% monthly on Team / Business / Enterprise; 99.5% on Free |
| P95 latency | < 300 ms for CRUD; < 1.5 s for diff of ≤ 10k changes |
| Scale per workspace | 1M concepts, 5M relations without degradation |
| Security | SOC 2 Type I within 12 months of GA, Type II within 24 months |
| Compliance | GDPR; CCPA; configurable data residency on Enterprise |
| Accessibility | WCAG 2.2 AA for all public-facing UI |
| i18n | English + French at GA; Spanish + German within 12 months |
| Browser support | Last 2 versions of Chrome, Edge, Firefox, Safari |

## 8. Key user journeys

Fully illustrated in [USER_FLOWS.md](USER_FLOWS.md). At a glance:

- **Create a new ontology.** Sign up → "New ontology" → pick Blank / Product reference / Catalog-with-multi-taxonomies → open in Schema view.
- **Add classes and relation types.** Schema view → add class → fill attributes → add relation types with domain / range.
- **Create a scheme.** Taxonomies tree left rail → "+ New scheme" → name it.
- **Add concepts.** Tree / tables / canvas → "New concept" modal → pick class + scheme → fill SKOS built-ins and custom attributes.
- **Tag & export.** History → "Create tag" → Export modal → pick format + scope → download.
- **Govern via deprecation.** Concept detail → "Deprecate" → add reason + replacement → Validation panel shows blocking references.

## 9. Success metrics

### North-star metric
**Weekly active governed ontologies (WAGO)** — ontologies receiving at least one change event or one review event per week across the paid fleet.

### Activation
- % of new workspaces that publish their first tag within 24 h (target > 60%).
- Time-to-first-publish (target median < 10 min on the "Catalog with multi-taxonomies" starter).
- Time-to-first-scheme and time-to-first-class tracked separately.

### Depth reach
- % of paying workspaces whose ontology hosts more than one ConceptScheme (target > 40% by year 2 — the multi-taxonomy value prop manifesting in the wild).
- Median classes-per-ontology and schemes-per-ontology across the paid fleet.

### Engagement
- Avg change events per ontology per month (target > 8 on Team+).
- Share of accepted AI suggestions (signal of AI-pack value).

### Retention & commercial
- D30 paid retention > 90%.
- Net revenue retention (NRR) > 110% at 12 months.
- Logo churn < 2% / month.

### Reliability / quality
- Sev-1 incidents per quarter ≤ 1.
- Error rate on `/api/*` < 0.5%.
- Change failure rate < 15%.

## 10. Assumptions

- Neo4j Aura meets multi-tenant isolation and cost targets (one db per tenant on Business+; namespaced on Free / Team).
- Clerk covers auth for MVP; we will migrate if / when SSO complexity demands it.
- An average paying workspace stays under 200k concepts for the first 18 months.
- A meaningful share of Business customers will run multi-taxonomy ontologies on a shared T-Box — that's the differentiator over single-purpose taxonomy tools.

## 11. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| "Ontology" as a product name scares glossary-first buyers | Slow top-of-funnel for governance PMs | Talk use-cases, not modes: demos lead with a Cars catalogue or a product glossary rather than with "OWL". Starter templates hide the jargon. |
| Multi-taxonomy pitch is abstract until seen in a demo | Long time-to-understanding on cold calls | Every landing page and demo leads with the Cars example — 9 classes, 13 relation types, 5 schemes on one T-Box, live. |
| Merge / review UX is hard and wrong by default | Blocks governance workflows when shipped | Prototype conflict and review UI with design partners before S1 GA; start with fast-forward only. |
| Neo4j per-tenant cost explodes on Free / Team | Margin erosion | Namespacing on Free / Team, per-tenant DB only on Business+. |
| Enterprise incumbents (PoolParty, TopBraid, Collibra) add ontology + taxonomy combinators | Differentiation erosion | Lead on versioning depth + multi-taxonomy-on-one-T-Box UX + API-first ergonomics; move fast on integrations. |
| Data-sensitive industries require on-prem | Lost enterprise deals | Publish 2027 on-prem roadmap; offer VPC deployment as bridge. |

## 12. Dependencies

- Neo4j Aura availability in target regions (US, EU).
- Clerk (auth), Stripe (billing), Sentry + Logtail (observability), Render (BE), Neon (Postgres), Upstash (Redis), Cloudflare R2 (object storage).
- Legal: Terms of Service, Privacy Policy, DPA, SCC.

## 13. Open questions

Tracked in [REFINEMENTS.md](REFINEMENTS.md).

## 14. Related documents
- [Vision](../00_overview/VISION.md)
- [Roadmap](../00_overview/ROADMAP.md)
- [Personas](PERSONAS.md)
- [Features](FEATURES.md)
- [User Flows](USER_FLOWS.md)
- [Architecture](../02_architecture/ARCHITECTURE.md)
- [Versioning System](../02_architecture/VERSIONING_SYSTEM.md)
- [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
- [Go-to-market](../07_business/GO_TO_MARKET.md)
- [Pricing Model](../08_finance/PRICING_MODEL.md)
