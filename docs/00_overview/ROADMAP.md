# Roadmap

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-paced)

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

---

## Phase 0 — Foundations (months 1–3)

**Goal.** Prove the stack and ship an empty, deployable application behind auth on a shoestring infra budget.

- Neo4j Aura **Free** + Neon Postgres **Free** + Upstash Redis **Free** + Cloudflare R2 **Free** tiers.
- Multi-tenant skeleton: orgs, workspaces, memberships, role model.
- Auth via Clerk (free dev tier) with email + OIDC.
- CRUD API for concepts & relations (no versioning yet).
- Canvas v0: React Flow, create/edit/delete nodes & edges, Inspector drawer.
- CI/CD (GitHub Actions → Fly.io + Vercel), observability baseline (Sentry free + Grafana Cloud free).

**Exit criteria.** Both founders use the app daily to model a sample taxonomy. Monthly infra cost ≤ $25.

## Phase 1 — MVP with design partners (months 4–6)

**Goal.** Ship to 3–5 design partners (free extended pilots) and validate the core authoring loop.

Must-have features M1–M6 from [FEATURES.md](../01_product/FEATURES.md):

- **M2 change history**: immutable change events per concept and per ontology, diff between two events, revert, tags. **No branches, no reviews, no merges** — deferred to v1.1 or later.
- CSV + JSON-LD + simplified OWL import; JSON / CSV / JSON-LD / TTL export.
- Full-text search (Postgres `tsvector`).
- Tree view (is-a hierarchy) with drag-drop reparenting.
- Billing wired in test mode (Stripe), Free + Team only; Business tier gated behind a waitlist.

**Exit criteria.** A non-technical domain expert can import a taxonomy, edit it, commit and revert without hand-holding. At least 3 design partners give us written "yes, we would pay" feedback.

## Phase 2 — Paid launch (months 7–9)

**Goal.** Turn on paid billing. Get the first 10 paying Team customers. Light governance features.

- Stripe production: Free + Team live; Business tier live behind an upgrade flow; Enterprise manually invoiced.
- Plan gating (concepts, API calls, workspaces) enforced server-side.
- Concept-level comments (S3).
- Public REST API (S4) with API keys and OpenAPI 3.1 docs.
- Rich metadata: synonyms, definitions, source, status, confidence (S6).
- Changelog + exportable audit log (S5).
- Email notifications (signup, invite, upgrade, change digest).
- Public pricing page.
- Hosted docs site with quickstart and conceptual guides.

**Exit criteria.** 10 paying Team customers. $4,000+ MRR. Monthly net cash positive.

## Phase 3 — GA and commercial ramp (months 10–14)

**Goal.** 1.0 launch. Business-tier ready for real mid-market deals. First Enterprise pilot.

- SAML SSO + SCIM 2.0 (needed for Business / Enterprise).
- Webhooks + first-party connectors: dbt, DataHub (C3 partial).
- AI suggestions (C2): missing concepts, similar concepts, relation candidates — opt-in, drafts only.
- Cypher console (C4, read-only).
- Starter template library (C6): e-commerce, finance, healthcare, manufacturing.
- Ontology importer library open-sourced.
- MCP server (C5) for agent-first access.
- SOC 2 Type I roadmap published; audit initiated when the first customer pays for it.

**Exit criteria.** 30+ paying customers, 2+ Business customers, 1 paid Enterprise pilot. $12,000+ MRR.

## Phase 4 — Enterprise readiness and collaboration depth (months 15+)

**Goal.** Unlock true Enterprise revenue and ship the deferred collaboration workflow.

- Dedicated Neo4j Aura tenants for Enterprise.
- Regional data residency (EU).
- Per-ontology ACLs, approval policies, tamper-evident audit log.
- **Branches (S1) + review requests (S2)** — shipped once at least two paying Business/Enterprise customers have requested them. Until then, the MVP change history handles 95% of the need.
- Three-way merge with conflict UI.
- Advanced role granularity and BYOK.
- SLA-backed uptime, CSM motion.
- SOC 2 Type I audit complete; Type II scoping begins.

**Exit criteria.** First $40k+ ACV Enterprise contract signed. Profitable on a cash basis.

---

## Beyond — 2028+ exploration

- Reasoning plugins (rules engine, light RDFS).
- Realtime collaborative cursors (Figma-style).
- Version-aware embeddings for RAG indexing.
- Marketplace of published public ontologies (FIBO, SKOS, schema.org overlays).
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
