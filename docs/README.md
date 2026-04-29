# Semlify — Documentation

**Primary owners**: Valentin Lemort (product, commercial) · Alexandre Delplace (engineering, CTO) · **Status**: Draft v4 (ontology-only product)

> The source of truth for your concepts. A multi-tenant SaaS for designing, versioning and governing **ontologies** — the T-Box of classes and relation types plus the A-Box of concept schemes and concepts that power RAG pipelines, agents, analytics and operations. One engine, one API, one audit trail — **SKOS** for concept-level interop, **OWL / RDF / Turtle** for the full model, **JSON-LD** for linked data. Taxonomies live inside ontologies as `ConceptScheme` instances; a single ontology hosts as many as the team needs.

---

## 1. What is this repository?

This directory is the **single source of truth** for everything related to building, shipping and selling Semlify as a two-founder bootstrapped company. It is structured so that:

- **Engineers** have everything they need to go from a blank laptop to a green production deploy on a ~$25 / month infra stack.
- **Product and design** have PRD, personas, flows, features and a design system.
- **Go-to-market, sales and finance** have playbooks, workspace-based pricing, a lean cost model and competitive intelligence.
- **Leadership (the two founders)** have a bootstrap-aligned roadmap, strategy and refinements backlog.

The underlying product specification is derived from `Semlify — Spécifications v1.0.pdf` and the April 2026 ontology-only repositioning. Proposed evolutions of that spec are tracked in [`01_product/REFINEMENTS.md`](REFINEMENTS%20(imported%20to%20notion).md).

---

## 2. Bootstrap posture in one paragraph

Two founders. No fundraising. Free-tier infra until paying customers justify upgrading. Workspace-based pricing — Free, Team ($499/mo), Business ($1,990/mo), Enterprise (from $40k/yr) — gated by concept count, API calls, workspaces, seats and support tier, not by artefact mode. Every paid workspace can model at whatever depth suits it: a shallow vocabulary with two classes and a single scheme, or a 30-class ontology hosting a dozen taxonomies side-by-side. MVP ships a change-event log at concept and ontology level plus revert and tags; the git-like branches / merges / reviews workflow is pre-designed but deferred to S1 / S2 until two paying customers need it. Default-alive by month 12. Content-led inbound and founder-led outbound. No SDR, no paid ads, no analyst relations in Year 1.

Full context: [`00_overview/VISION.md`](VISION%20(imported%20to%20notion).md) · [`00_overview/ROADMAP.md`](ROADMAP%20(imported%20to%20notion).md) · [`07_business/BUSINESS_STRATEGY.md`](BUSINESS_STRATEGY%20(imported%20to%20notion).md).

---

## 3. How the docs are organised

```
docs/
├── 00_overview/              Vision, roadmap, glossary (product terminology + standards)
├── 01_product/               PRD, personas (architect / maintainer / consumer), feature specs, user flows, refinements
├── 02_architecture/          System design, data model (T-Box + A-Box), API, versioning system (MVP + deferred)
├── 03_engineering/           Dev setup, standards, testing, FE/BE guides
├── 04_design/                Design system, UI/UX, accessibility, brand
├── 05_operations/            Infra (lean), CI/CD (free-tier), monitoring, incidents, SLAs
├── 06_security_compliance/   Security, auth, GDPR, compliance checklists
├── 07_business/              Strategy (bootstrap), GTM, sales, marketing, competition
├── 08_finance/               Workspace pricing, cost of build/operation, bootstrap projections, unit economics
├── 09_team/                  Onboarding, contributing, hiring plan (2 → 4 FTE over 3 years)
└── 10_launch/                Launch checklist, beta program, support
```

Every file is self-contained. Cross-links are used rather than copying content. Every file carries an ownership header of the form:

```
**Primary owner**: X · **Contributor**: Y · **Status**: Draft v4 (ontology-only)
```

Primary owner = the decision-maker. Contributor = the other founder (or future hire).

---

## 4. The product in one frame

Semlify is an **ontology editor**. Every artefact in the app is an Ontology. The data model is two-layer:

- **T-Box (schema)** — `ConceptClass` nodes (e.g. Manufacturer, Model, Engine) and `RelationType` edges (e.g. `manufacturedBy`, `poweredBy`) with domain / range. Custom attributes per class, plus six always-present SKOS slots (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example`).
- **A-Box (instances)** — `ConceptScheme` containers holding `Concept` nodes typed by a class, connected by typed relations. Many schemes can live in the same ontology and reuse the same T-Box.

A **taxonomy** in Semlify is a ConceptScheme — usually one that leans heavily on the built-in `broader` relation — not a separate product. The Cars seed ontology hosts five schemes at once (Model catalogue 2026, Body style taxonomy, Fuel type taxonomy, Market segments, Manufacturing geography) on a single T-Box of 9 classes and 13 relation types.

Three entry templates in the "New ontology" modal: **Blank**, **Product reference**, **Catalog with multi-taxonomies**. All land in the same product; no mode switch, no migration.

Personas (detailed in [`01_product/PERSONAS.md`](PERSONAS%20(imported%20to%20notion).md)):

- **Data Architect** — designs the T-Box. Lives in the Schema view.
- **Catalogue Maintainer** — runs the A-Box day to day. Lives in the Taxonomies tree and Tables view.
- **Downstream Consumer (Platform Engineer)** — reads the ontology through the API, webhooks and exports.

---

## 5. Suggested reading order by role

### Founder-onboarding path (start here if you're reading this fresh)
1. [00_overview/VISION.md](VISION%20(imported%20to%20notion).md)
2. [00_overview/ROADMAP.md](ROADMAP%20(imported%20to%20notion).md)
3. [07_business/BUSINESS_STRATEGY.md](BUSINESS_STRATEGY%20(imported%20to%20notion).md)
4. [08_finance/PRICING_MODEL.md](08_finance/PRICING_MODEL.md)
5. [01_product/FEATURES.md](FEATURES%20(imported%20to%20notion).md) — what's built today, what's staged next
6. [02_architecture/VERSIONING_SYSTEM.md](02_architecture/VERSIONING_SYSTEM.md) — the distinctive subsystem, MVP + deferred
7. [08_finance/FINANCIAL_PROJECTIONS.md](08_finance/FINANCIAL_PROJECTIONS.md)

### New engineer (day 1)
1. [00_overview/VISION.md](VISION%20(imported%20to%20notion).md)
2. [09_team/ONBOARDING.md](09_team/ONBOARDING.md)
3. [03_engineering/DEVELOPMENT_SETUP.md](03_engineering/DEVELOPMENT_SETUP.md)
4. [02_architecture/ARCHITECTURE.md](02_architecture/ARCHITECTURE.md)
5. [02_architecture/DATA_MODEL.md](02_architecture/DATA_MODEL.md)
6. [02_architecture/VERSIONING_SYSTEM.md](02_architecture/VERSIONING_SYSTEM.md)
7. [03_engineering/CODING_STANDARDS.md](03_engineering/CODING_STANDARDS.md)
8. [03_engineering/TESTING_STRATEGY.md](03_engineering/TESTING_STRATEGY.md)

### Operations / SRE
1. [05_operations/INFRASTRUCTURE.md](05_operations/INFRASTRUCTURE.md) — lean stack, cost checkpoints per phase
2. [05_operations/CI_CD.md](05_operations/CI_CD.md) — free-tier CI budget, Phase-by-Phase workflows
3. [05_operations/DEPLOYMENT.md](05_operations/DEPLOYMENT.md)
4. [05_operations/MONITORING.md](05_operations/MONITORING.md) — free-tier observability stack
5. [05_operations/INCIDENT_RESPONSE.md](05_operations/INCIDENT_RESPONSE.md)
6. [05_operations/BACKUP_DR.md](05_operations/BACKUP_DR.md)

### Security / Compliance
1. [06_security_compliance/SECURITY.md](06_security_compliance/SECURITY.md)
2. [06_security_compliance/AUTHENTICATION.md](06_security_compliance/AUTHENTICATION.md)
3. [06_security_compliance/DATA_PRIVACY.md](06_security_compliance/DATA_PRIVACY.md)
4. [06_security_compliance/COMPLIANCE.md](06_security_compliance/COMPLIANCE.md)
5. [06_security_compliance/SECURITY_CHECKLIST.md](06_security_compliance/SECURITY_CHECKLIST.md)

### Customer Success / Support
1. [07_business/CUSTOMER_SUCCESS.md](07_business/CUSTOMER_SUCCESS.md)
2. [10_launch/SUPPORT.md](10_launch/SUPPORT.md)
3. [05_operations/SLA.md](05_operations/SLA.md)
4. [10_launch/BETA_PROGRAM.md](10_launch/BETA_PROGRAM.md)

### Launch readiness
1. [10_launch/LAUNCH_CHECKLIST.md](10_launch/LAUNCH_CHECKLIST.md)
2. [06_security_compliance/SECURITY_CHECKLIST.md](06_security_compliance/SECURITY_CHECKLIST.md)
3. [05_operations/RELEASE_PROCESS.md](05_operations/RELEASE_PROCESS.md)
4. [00_overview/ROADMAP.md](ROADMAP%20(imported%20to%20notion).md)

### Product / Design
1. [01_product/PRD.md](PRD%20(imported%20to%20notion).md)
2. [01_product/PERSONAS.md](PERSONAS%20(imported%20to%20notion).md)
3. [01_product/FEATURES.md](FEATURES%20(imported%20to%20notion).md)
4. [01_product/USER_FLOWS.md](USER_FLOWS%20(imported%20to%20notion).md)
5. [04_design/DESIGN_SYSTEM.md](04_design/DESIGN_SYSTEM.md)
6. [00_overview/ROADMAP.md](ROADMAP%20(imported%20to%20notion).md)

### Go-to-market / Sales
1. [07_business/BUSINESS_STRATEGY.md](BUSINESS_STRATEGY%20(imported%20to%20notion).md)
2. [07_business/GO_TO_MARKET.md](07_business/GO_TO_MARKET.md) — founder-led, content-first
3. [07_business/COMPETITIVE_ANALYSIS.md](07_business/COMPETITIVE_ANALYSIS.md)
4. [07_business/SALES_PLAYBOOK.md](07_business/SALES_PLAYBOOK.md) — founder-run deal mechanics
5. [07_business/MARKETING_STRATEGY.md](07_business/MARKETING_STRATEGY.md) — no paid ads in Y1
6. [08_finance/PRICING_MODEL.md](08_finance/PRICING_MODEL.md)

### Finance / Leadership
1. [08_finance/PRICING_MODEL.md](08_finance/PRICING_MODEL.md) — workspace + concept count, no per-seat
2. [08_finance/COST_ANALYSIS.md](08_finance/COST_ANALYSIS.md) — bootstrap infra floor
3. [08_finance/UNIT_ECONOMICS.md](08_finance/UNIT_ECONOMICS.md) — bootstrap CAC bands
4. [08_finance/FINANCIAL_PROJECTIONS.md](08_finance/FINANCIAL_PROJECTIONS.md) — default-alive plan
5. [09_team/HIRING_PLAN.md](09_team/HIRING_PLAN.md) — 2 → ~4 FTE over 3 years

---

## 6. MVP scope vs deferred

Many architecture and product documents are deliberately split into "MVP" and "Deferred" sections. The MVP ships only what two founders can build and maintain alone, and sells at a price a mid-market buyer will actually pay.

| Area | MVP | Deferred |
|---|---|---|
| Versioning | Change-event log, revert, tags, tag-to-tag diff | Branches, commits, 3-way merge, reviews (S1 / S2) |
| Collaboration | Shared workspace, presence indicators, notifications centre, AI suggestions panel | Threaded comments, review requests, branch policies, merge queues, real-time cursors |
| Governance | Role-based access, audit log, deprecation + replacement workflow, validation panel | Branch protection, required validators, per-class approval policies |
| Multi-tenancy | Shared Neo4j (Team / Business) + Postgres RLS | Dedicated Neo4j Aura per Enterprise tenant |
| Auth | Email + Google (Clerk) | SSO (OIDC on Team+, SAML on Business+), SCIM |
| Pricing | Free / Team / Business / Enterprise | Add-ons (AI pack, extra API) |
| Enterprise motion | Opportunistic | Active pursuit, SOC 2, trust center, QBRs |

Deferred sections are preserved in each relevant doc rather than deleted. They unlock when two paying customers request them (branches / reviews) or when we have the security posture in place (SSO, SOC 2).

---

## 7. Status & versioning

| Document set | Status | Last updated |
|---|---|---|
| Product spec (v4, ontology-only) | Draft v4 | 23 Apr 2026 |
| Engineering docs | Ready for two-founder build | 20 Apr 2026 |
| Business docs | Ready for founder-led motion | 23 Apr 2026 |
| Finance docs | Bootstrap-aligned, workspace-priced | 23 Apr 2026 |
| Refinements | Pending product review | 23 Apr 2026 |

Docs are versioned with the repo. Material changes are proposed via PR referencing the relevant refinement or ADR.

---

## 8. Architectural Decision Records (ADRs)

Major technical decisions are tracked under [`02_architecture/adr/`](02_architecture/adr/) (folder populated as decisions are ratified). Template:

```
# ADR-NNN: <title>
Status: proposed | accepted | deprecated | superseded
Date: YYYY-MM-DD
Context: ...
Decision: ...
Consequences: ...
```

Strategic business / financial decisions follow the same pattern at the top of their docs (see headers on PRICING_MODEL, BUSINESS_STRATEGY, VERSIONING_SYSTEM — the three most consequential strategic decisions in this repo).

---

## 9. Conventions

- All documents are Markdown, GitHub-flavoured.
- Dates in `YYYY-MM-DD`.
- Money figures in USD unless explicitly labelled.
- Diagrams: Mermaid preferred, embedded inline.
- File names `SCREAMING_SNAKE_CASE.md`, folders `snake_case/`.
- Use present tense ("the API returns…"), active voice, second person for guides ("you install…").
- Every doc opens with `# Title` then a blank line then the ownership header then a blank line then the body.

---

## 10. Contact

- Product / Commercial / Founder: Valentin Lemort — `valentin.lemort@thinkware.fr`
- Engineering / CTO / Founder: Alexandre Delplace
- Everyone else: TBD (see [09_team/HIRING_PLAN.md](09_team/HIRING_PLAN.md) for when)

---

*Last updated: 2026-04-23 · v4 (ontology-only product)*
