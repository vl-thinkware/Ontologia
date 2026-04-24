# Roadmap

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)

Time-boxed against an assumed kickoff of **May 2026** with the two-founder team described in [HIRING_PLAN.md](../09_team/HIRING_PLAN.md). Dates are plans, not commitments; scope is the commitment.

## Snapshot

| Phase | Window | Theme | Release label |
|---|---|---|---|
| 0 | May–Jul 2026 (3 months) | Foundations | `0.1.x` internal |
| 1 | Aug–Oct 2026 (3 months) | MVP with design partners | `0.5.x` closed beta |
| 2 | Nov 2026 – Jan 2027 (3 months) | Paid launch | `0.9.x` open beta |
| 3 | Feb–Jun 2027 (5 months) | GA and commercial ramp | `1.0` GA |
| 4 | Jul 2027 onward | Enterprise-ready + collaboration depth | `1.x` |

Bootstrap pacing: longer phases, fewer features per phase, customer-paid gating for every capability that costs us money to run.

> **What already works in the mockup.** The features enumerated in [FEATURES.md](../01_product/FEATURES.md) — full T-Box editor with per-class attributes and SKOS built-ins, Canvas (Schema + Taxonomies modes), Taxonomies tree with drag-drop reparenting and embedded concept detail, Tables view with filters and bulk actions, change events / revert / tags / tag-to-tag diff, deprecation + replacement workflow, validation panel, AI suggestions panel, presence + notifications, export modal (JSON-LD / SKOS Turtle / OWL RDF-XML / CSV), API Playground, CSV import wizard — are all proven out in the interactive mockup and set the scope baseline. Each phase below is about turning that baseline into a production, multi-tenant product.

---

## Phase 0 — Foundations (months 1–3)

**Goal.** Prove the stack and ship an empty, deployable application behind auth on a shoestring infra budget.

- Neo4j Aura **Free** + Neon Postgres **Free** + Upstash Redis **Free** + Cloudflare R2 **Free** tiers.
- Multi-tenant skeleton: orgs, workspaces, memberships, role model.
- Auth via Clerk (free dev tier) with email + OIDC.
- CRUD API for T-Box (classes, relation types) and A-Box (schemes, concepts, typed relations). No versioning wiring yet.
- Canvas v0 (Schema mode only): React Flow, create/edit/delete classes & relation types, right-rail class inspector.
- CI/CD (GitHub Actions → Fly.io + Vercel), observability baseline (Sentry free + Grafana Cloud free).

**Exit criteria.** Both founders use the app daily to model the Cars seed (or their own sample ontology) end-to-end. Monthly infra cost ≤ $25.

## Phase 1 — MVP with design partners (months 4–6)

**Goal.** Ship to 3–5 design partners (free extended pilots) and validate the core authoring loop against the mockup feature set.

Must-have features M1–M7 from [FEATURES.md](../01_product/FEATURES.md):

- **M1 — Full Schema view (T-Box editor).** Classes and relation types, inline attribute editor (key, type, required / localizable, enum values, description, hint), SKOS built-ins as read-only system attributes, delete-safety checks.
- **M2 — Canvas with two modes.** Schema mode (default) shows classes + relation types; Taxonomies mode shows the active scheme as an instance graph. Hub-and-spoke initial layout, node drag, right-rail inspector adapts per mode.
- **M3 — Taxonomies tree view.** Per-scheme collapsible trees in the left rail; full ConceptDetail embedded in the centre (tabs: Overview, Properties, Relations, History, Usage, AI). Drag-drop reparenting rewrites `broader`.
- **M4 — Tables view.** Sortable datagrid, filter chips, scheme tabs, row search, multi-select bulk actions (Deprecate, Tag).
- **M5 — Change control.** Every mutation records a ChangeEvent; history panel on the right rail with filters; diff modal per event; tag-to-tag diff (added / modified / removed); revert creates an opposite event.
- **M6 — Imports + exports.** CSV wizard (upload → map → preview → import); Export modal with format picker (JSON-LD, SKOS Turtle, OWL RDF/XML, CSV), scope selector (full ontology vs per-scheme), live preview.
- **M7 — Starter templates.** "New ontology" modal with Blank, Product reference, Catalog-with-multi-taxonomies.
- Full-text search (Postgres `tsvector`) + Command Palette (⌘K).
- Billing wired in test mode (Stripe), Free + Team only; Business tier gated behind a waitlist.

**Exit criteria.** A non-technical maintainer can create an ontology from a starter template, add a class, create a scheme, run a CSV import and export SKOS without hand-holding. At least 3 design partners give us written "yes, we would pay" feedback.

## Phase 2 — Paid launch (months 7–9)

**Goal.** Turn on paid billing. Get the first 10 paying Team customers. Ship the governance layer.

- Stripe production: Free + Team live; Business tier live behind an upgrade flow; Enterprise manually invoiced.
- Plan gating (concepts, API calls, workspaces) enforced server-side.
- **Deprecation + replacement workflow** (dct:isReplacedBy), deprecation reason stored and shown on every surface.
- **Validation panel**: orphan concepts, domain/range violations, duplicate prefLabels per scheme, deprecated-still-referenced, missing class.
- **AI suggestions panel** per concept: suggest altLabels, auto-translate prefLabel, detect likely duplicates, suggest class for uncategorized concepts. Each accepted suggestion records a normal change event.
- **Collaboration surface**: live presence in the topbar + per-concept editing banner + scheme-row presence chips; notifications centre (bell icon) listing change events authored by others.
- Public REST API with API keys and OpenAPI 3.1 docs. **API Playground** modal (endpoint picker, query params, live response, copy-as-cURL / copy-as-fetch) ships with the API.
- Activity feed on Dashboard (live from ChangeEvents, filter by kind, clickable rows).
- Email notifications (signup, invite, upgrade, change digest).
- Public pricing page.
- Hosted docs site with quickstart and conceptual guides.

**Exit criteria.** 10 paying Team customers. $4,000+ MRR. Monthly net cash positive.

## Phase 3 — GA and commercial ramp (months 10–14)

**Goal.** 1.0 launch. Business-tier ready for real mid-market deals. First Enterprise pilot.

- SAML SSO + SCIM 2.0 (needed for Business / Enterprise).
- Webhooks + first-party connectors: dbt, DataHub.
- **More export formats**: OWL/Manchester, GraphQL schema, Excel workbook.
- **Threaded comments** on concepts, classes and relation types.
- **Real-time collaboration server** (Yjs / Automerge on top of presence channel): cursors, live co-edit on the concept detail.
- MCP server for agent-first access to the ontology.
- Starter template library: e-commerce, finance, healthcare, manufacturing.
- SOC 2 Type I roadmap published; audit initiated when the first customer pays for it.

**Exit criteria.** 30+ paying customers, 2+ Business customers, 1 paid Enterprise pilot. $12,000+ MRR.

## Phase 4 — Enterprise readiness and branching (months 15+)

**Goal.** Unlock true Enterprise revenue and ship the deferred collaboration workflow.

- Dedicated Neo4j Aura tenants for Enterprise.
- Regional data residency (EU).
- Per-ontology ACLs, approval policies, tamper-evident audit log.
- **Branches (S1) + review requests (S2)** — shipped once at least two paying Business/Enterprise customers have requested them. Until then, the MVP change history plus revert and tags handles the operational need.
- Three-way merge with conflict UI.
- Advanced role granularity and BYOK.
- SLA-backed uptime, CSM motion.
- SOC 2 Type I audit complete; Type II scoping begins.

**Exit criteria.** First $40k+ ACV Enterprise contract signed. Profitable on a cash basis.

---

## Beyond — 2028+ exploration

- Reasoning plugins (rules engine, light RDFS, SHACL validation).
- Version-aware embeddings for RAG indexing.
- Marketplace of published public ontologies (FIBO, SKOS, schema.org overlays; community-contributed verticals).
- Federated ontologies across workspaces (import-by-reference with pinned tags).
- Revenue-share for community-published templates.
- Native cloud-marketplace listings (AWS, Azure, GCP).

## How we manage the roadmap

- Monthly founder review; quarterly re-baseline.
- Feature flags for every new surface.
- Single linear product tracker in Linear (free tier).
- Public-facing roadmap on the website updated quarterly — no dated promises on items beyond the current phase.
- **A feature ships only when (a) the MVP metric is healthy *or* (b) a paying customer is waiting for it and has signed.**

## Related
- [Vision](VISION.md)
- [Product Requirements Document](../01_product/PRD.md)
- [Features](../01_product/FEATURES.md)
- [Refinements & open questions](../01_product/REFINEMENTS.md)
- [Launch Checklist](../10_launch/LAUNCH_CHECKLIST.md)
- [Hiring Plan](../09_team/HIRING_PLAN.md)
- [Financial Projections](../08_finance/FINANCIAL_PROJECTIONS.md)
