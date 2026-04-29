# Ontologia

**Primary owners**: Valentin Lemort (product, commercial) · Alexandre Delplace (engineering, CTO) · **Status**: Draft v4 (ontology-only product)

**The source of truth for your concepts.** A multi-tenant SaaS for designing, versioning and governing **ontologies** — the typed concept graphs that power RAG pipelines, agents, analytics and operations. Built on Neo4j, Postgres, Redis and Cloudflare R2.

Every artefact in Ontologia is an Ontology. The data model is two-layer: a T-Box of `ConceptClass` and `RelationType` entities, and an A-Box of `ConceptScheme` containers holding typed `Concept` nodes. Taxonomies are first-class citizens (schemes inside an ontology) — a single ontology can host many side-by-side on a shared T-Box. Standard-compliant exports ship on day one: **SKOS** (Turtle), **OWL / RDF/XML**, **JSON-LD**, CSV.

This repository currently holds the **product, engineering, business and launch documentation** that will drive Ontologia from its bootstrapped MVP to general availability. The application source code will live in sibling repositories (monorepo, SDKs, examples).

## Posture

- **Two founders, bootstrapped.** Valentin (PM + commercial + finance) and Alexandre (CTO + engineering). No fundraising planned. Default-alive by month 12.
- **Workspace-based pricing.** Free · Team ($499/mo · $4,990/yr) · Business ($1,990/mo · $19,900/yr) · Enterprise (from $40k/yr). Gated by concept count, API calls, workspaces and support tier — not by artefact type. No per-seat tax. See [`docs/08_finance/PRICING_MODEL.md`](docs/08_finance/PRICING_MODEL.md).
- **MVP scope intentionally trimmed.** Change-event log at concept and ontology level, plus revert, tags and tag-to-tag diff. The full git-like branches / commits / merges / reviews workflow is pre-designed but deferred to S1 / S2 (ships when two paying customers need it). See [`docs/02_architecture/VERSIONING_SYSTEM.md`](docs/02_architecture/VERSIONING_SYSTEM.md).
- **Infra under $300/mo until paying customers justify more.** Render + Neon + Neo4j Aura + Upstash + Cloudflare, mostly on free tiers through Phase 2.

## Where to start

- **Documentation hub**: [`docs/README.md`](docs/README.md)
- **Product vision**: [`docs/00_overview/VISION.md`](VISION%20(imported%20to%20notion).md)
- **Bootstrap roadmap**: [`docs/00_overview/ROADMAP.md`](ROADMAP%20(imported%20to%20notion).md)
- **Architecture (MVP)**: [`docs/02_architecture/ARCHITECTURE.md`](docs/02_architecture/ARCHITECTURE.md)
- **Pricing (workspace-based)**: [`docs/08_finance/PRICING_MODEL.md`](docs/08_finance/PRICING_MODEL.md)
- **Founder-led GTM**: [`docs/07_business/GO_TO_MARKET.md`](docs/07_business/GO_TO_MARKET.md)
- **Launch checklist**: [`docs/10_launch/LAUNCH_CHECKLIST.md`](docs/10_launch/LAUNCH_CHECKLIST.md)

## Suggested reading order by role

- **Engineers** → `docs/README.md` § "New engineer"
- **Product / Design** → `docs/README.md` § "Product / Design"
- **GTM / Sales** → `docs/README.md` § "Go-to-market / Sales"
- **Finance / Leadership** → `docs/README.md` § "Finance / Leadership"
- **Security / Compliance** → `docs/README.md` § "Security / Compliance"
- **Operations / SRE** → `docs/README.md` § "Operations / SRE"

## Repository structure

```
.
├── Ontologia — Spécifications v1.0.pdf   Original product spec (v1, FR)
├── docs/                                 Full documentation tree (58 files)
│   ├── 00_overview/                      Vision, roadmap, glossary
│   ├── 01_product/                       PRD, personas, features, flows, refinements
│   ├── 02_architecture/                  Architecture, data model, API, versioning
│   ├── 03_engineering/                   Dev setup, standards, testing, FE/BE guides
│   ├── 04_design/                        Design system, UX, accessibility, brand
│   ├── 05_operations/                    Infra, CI/CD, monitoring, incidents, SLA
│   ├── 06_security_compliance/           Security, auth, privacy, compliance
│   ├── 07_business/                      Strategy, GTM, sales, marketing, competition
│   ├── 08_finance/                       Pricing, cost, projections, unit economics
│   ├── 09_team/                          Onboarding, contributing, hiring, conduct
│   └── 10_launch/                        Launch checklist, beta program, support
├── .gitignore
└── README.md
```

## Ownership shorthand

Every document carries a header like `**Primary owner**: X · **Contributor**: Y · **Status**: ...`. In general:

- **Valentin** owns: product, design, business strategy, GTM, sales, marketing, pricing, finance, hiring, onboarding, launch, compliance (legal side).
- **Alexandre** owns: architecture, engineering, infra, CI/CD, monitoring, backups, security (technical side), authentication, contributing guide.
- Several documents are co-owned; the header names the primary decision-maker.

## Status

Pre-GA, bootstrapped, two founders. Documentation-first repository. Application repositories will be added under the same GitHub org as they come online.

## License

Proprietary. All rights reserved © Ontologia / Thinkware. Public-facing examples and SDKs (when published) will be MIT.

## Contact

- Product / Commercial: Valentin Lemort — `valentin.lemort@thinkware.fr`
- Engineering / CTO: Alexandre Delplace
