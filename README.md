# Ontologia

Collaborative ontology platform — the "GitHub + Notion" of enterprise knowledge graphs. Multi-tenant SaaS for designing, versioning, reviewing and governing ontologies, powered by Neo4j, Postgres, Redis and Cloudflare R2.

This repository currently holds the **product, engineering, business and launch documentation** that will drive Ontologia from pre-seed to GA. The application source code lives in sibling repositories (monorepo, SDKs, examples).

## Where to start

- **Documentation hub**: [`docs/README.md`](docs/README.md)
- **Product vision**: [`docs/00_overview/VISION.md`](docs/00_overview/VISION.md)
- **Roadmap**: [`docs/00_overview/ROADMAP.md`](docs/00_overview/ROADMAP.md)
- **Architecture**: [`docs/02_architecture/ARCHITECTURE.md`](docs/02_architecture/ARCHITECTURE.md)
- **Pricing**: [`docs/08_finance/PRICING_MODEL.md`](docs/08_finance/PRICING_MODEL.md)
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
├── docs/                                 Full documentation tree (59 files)
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

## Status

Pre-GA. Documentation-first repository; application repositories will be added under the same GitHub org.

## License

Proprietary. All rights reserved © Ontologia / Thinkware. Public-facing examples and SDKs (when published) will be MIT.

## Contact

- CEO / Product: Valentin Lemort — `valentin.lemort@thinkware.fr`
