# Roadmap

This roadmap restates and extends the phases described in the v1 spec. It is time-boxed against an assumed kickoff of **May 2026** (team of 3–4 engineers + design). Dates shift with hiring; scope does not.

## Snapshot

| Phase | Window | Theme | Release label |
|---|---|---|---|
| 0 | May–Jun 2026 | Foundations | `0.1.x` internal |
| 1 | Jul–Aug 2026 | MVP | `0.5.x` closed beta |
| 2 | Sep–Oct 2026 | Governance | `0.9.x` open beta |
| 3 | Nov 2026 – Jan 2027 | Growth | `1.0` GA |
| 4 | Feb 2027 onward | Enterprise | `1.x` / `2.0` |

---

## Phase 0 — Foundations (months 1–2)

**Goal.** Prove the stack and ship an empty, deployable application behind auth.

- Neo4j Aura + Postgres (managed) provisioned, IaC'd.
- Multi-tenant skeleton: orgs, workspaces, memberships, role model.
- Auth via Clerk (MVP) with email/OIDC, RBAC hooks.
- CRUD API for concepts & relations (no versioning yet).
- Canvas v0: React Flow, create/edit/delete nodes & edges, Inspector drawer.
- CI/CD (GitHub Actions → Vercel/Render), observability baseline (Sentry + Logtail).

**Exit criteria.** Internal team uses the app daily to model a sample taxonomy.

## Phase 1 — MVP (months 3–4)

**Goal.** Ship closed beta to 10 design partners. Must-have features M1–M6.

- Commits, history, revert (immutable commit graph in Neo4j).
- Branches: create / switch / simple fast-forward merge.
- CSV import + JSON / CSV / JSON-LD export.
- Full-text search (Postgres `tsvector` initially; OpenSearch if volumes justify).
- Tree view (is-a hierarchy) with drag-drop reparenting.
- Billing wired (Stripe test mode, Free + Starter only).

**Exit criteria.** A non-technical domain expert can import a taxonomy, edit it, commit and revert without handholding.

## Phase 2 — Governance (months 5–6)

**Goal.** Open beta. Should-have S1–S5.

- Review Requests (conceptual PRs) with approval workflow.
- Visual diff (graph + list) between any two refs.
- Concept-level comments, threads, mentions, notifications.
- Public REST API (API keys, OpenAPI 3.1 docs).
- Rich metadata: synonyms, definitions, source, status, confidence.
- Changelog + exportable audit log.

**Exit criteria.** At least 3 design-partner workspaces running production governance flows.

## Phase 3 — Growth & GA (months 7–9)

**Goal.** 1.0 launch, commercial ramp-up.

- Advanced merge with 3-way conflict UI.
- Webhooks + native connectors: dbt, DataHub, Atlan.
- AI suggestions (could-have C2): missing concepts, similar concepts, relation candidates.
- Cypher console (read-only v1).
- Starter template library (e-commerce, finance, healthcare).
- Marketplace-grade onboarding, docs site, quickstarts.

**Exit criteria.** GA announcement, 20 paying workspaces, positive NPS on activation flow.

## Phase 4 — Enterprise (months 10+)

**Goal.** Unlock the enterprise tier and prep Series-A narrative.

- SSO SAML + OIDC, SCIM provisioning.
- Exportable, tamper-evident audit log.
- Regional data residency (US, EU).
- Role granularity (per-ontology ACLs, approval policies).
- Option for single-tenant / on-prem Neo4j (Enterprise license pass-through).
- SLA-backed uptime, dedicated support, CSM motion.

**Exit criteria.** First $100k+ ACV enterprise contract signed.

---

## Beyond v1.x — 2027+ exploration

- Reasoning plugins (rules engine, light RDFS).
- Realtime collaborative cursors (Figma-style).
- Version-aware embeddings for RAG indexing.
- Marketplace of published public ontologies (FIBO, SKOS, schema.org overlays).
- LLM agent bindings — "talk to your ontology".

## How we manage the roadmap

- Quarterly planning, monthly re-forecast.
- Feature flags for every new surface.
- Single linear product tracker (Linear or Shortcut).
- Monthly public roadmap update.

## Related
- [Product Requirements Document](../01_product/PRD.md)
- [Refinements & open questions](../01_product/REFINEMENTS.md)
- [Launch Checklist](../10_launch/LAUNCH_CHECKLIST.md)
