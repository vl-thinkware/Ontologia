# Ontologia — Documentation

> The "GitHub + Notion" of enterprise ontologies. A multi-tenant SaaS for building, versioning and governing knowledge graphs, powered by Neo4j.

---

## 1. What is this repository?

This directory is the **single source of truth** for everything related to building, shipping and selling Ontologia. It is structured so that:

- **Engineers** have everything they need to go from a blank laptop to a green production deploy.
- **Designers and PMs** have product specs, personas, flows and a design system.
- **Go-to-market, sales and finance** have playbooks, pricing, cost models and competitive intelligence.
- **Leadership** has a roadmap, strategy and refinements backlog.

The underlying product specification is derived from `Ontologia — Spécifications v1.0.pdf`. Proposed evolutions of that spec are tracked in [`01_product/REFINEMENTS.md`](01_product/REFINEMENTS.md).

---

## 2. How the docs are organised

```
docs/
├── 00_overview/              Vision, roadmap, glossary
├── 01_product/               PRD, personas, feature specs, refinements
├── 02_architecture/          System design, data model, API, versioning
├── 03_engineering/           Dev setup, standards, testing, FE/BE guides
├── 04_design/                Design system, UI/UX, accessibility, brand
├── 05_operations/            Infra, CI/CD, monitoring, incidents, SLAs
├── 06_security_compliance/   Security, auth, GDPR, compliance checklists
├── 07_business/              Strategy, GTM, sales, marketing, competition
├── 08_finance/               Pricing, cost of build/operation, projections
├── 09_team/                  Onboarding, contributing, hiring plan
└── 10_launch/                Launch checklist, beta program, support
```

Every file is self-contained. Cross-links are used rather than copying content.

---

## 3. Suggested reading order by role

### New engineer (day 1)
1. [00_overview/VISION.md](00_overview/VISION.md)
2. [09_team/ONBOARDING.md](09_team/ONBOARDING.md)
3. [03_engineering/DEVELOPMENT_SETUP.md](03_engineering/DEVELOPMENT_SETUP.md)
4. [02_architecture/ARCHITECTURE.md](02_architecture/ARCHITECTURE.md)
5. [02_architecture/DATA_MODEL.md](02_architecture/DATA_MODEL.md)
6. [03_engineering/CODING_STANDARDS.md](03_engineering/CODING_STANDARDS.md)
7. [03_engineering/TESTING_STRATEGY.md](03_engineering/TESTING_STRATEGY.md)

### Operations / SRE
1. [05_operations/INFRASTRUCTURE.md](05_operations/INFRASTRUCTURE.md)
2. [05_operations/DEPLOYMENT.md](05_operations/DEPLOYMENT.md)
3. [05_operations/MONITORING.md](05_operations/MONITORING.md)
4. [05_operations/INCIDENT_RESPONSE.md](05_operations/INCIDENT_RESPONSE.md)
5. [05_operations/BACKUP_DR.md](05_operations/BACKUP_DR.md)

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
4. [00_overview/ROADMAP.md](00_overview/ROADMAP.md)

### Product / Design
1. [01_product/PRD.md](01_product/PRD.md)
2. [01_product/PERSONAS.md](01_product/PERSONAS.md)
3. [01_product/FEATURES.md](01_product/FEATURES.md)
4. [04_design/DESIGN_SYSTEM.md](04_design/DESIGN_SYSTEM.md)
5. [00_overview/ROADMAP.md](00_overview/ROADMAP.md)

### Go-to-market / Sales
1. [07_business/BUSINESS_STRATEGY.md](07_business/BUSINESS_STRATEGY.md)
2. [07_business/GO_TO_MARKET.md](07_business/GO_TO_MARKET.md)
3. [07_business/COMPETITIVE_ANALYSIS.md](07_business/COMPETITIVE_ANALYSIS.md)
4. [07_business/SALES_PLAYBOOK.md](07_business/SALES_PLAYBOOK.md)
5. [08_finance/PRICING_MODEL.md](08_finance/PRICING_MODEL.md)

### Finance / Leadership
1. [08_finance/PRICING_MODEL.md](08_finance/PRICING_MODEL.md)
2. [08_finance/COST_ANALYSIS.md](08_finance/COST_ANALYSIS.md)
3. [08_finance/UNIT_ECONOMICS.md](08_finance/UNIT_ECONOMICS.md)
4. [08_finance/FINANCIAL_PROJECTIONS.md](08_finance/FINANCIAL_PROJECTIONS.md)

---

## 4. Status & versioning

| Document set | Status | Last updated |
|---|---|---|
| Product spec (v1) | Draft, based on 17 Apr 2026 PDF | 20 Apr 2026 |
| Engineering docs | Ready for team onboarding | 20 Apr 2026 |
| Business docs | Ready for fundraising / early GTM | 20 Apr 2026 |
| Refinements | Pending product review | 20 Apr 2026 |

Docs are versioned with the repo. Material changes should be proposed via a PR referencing the relevant issue / ADR.

---

## 5. Architectural Decision Records (ADRs)

Major technical decisions are tracked under [`02_architecture/adr/`](02_architecture/adr/) (to be created as decisions are ratified). Template:

```
# ADR-NNN: <title>
Status: proposed | accepted | deprecated | superseded
Date: YYYY-MM-DD
Context: ...
Decision: ...
Consequences: ...
```

---

## 6. Conventions

- All documents are Markdown, GitHub-flavoured.
- Dates in `YYYY-MM-DD`.
- Money figures in USD unless explicitly labelled.
- Diagrams: Mermaid preferred, embedded inline.
- File names `SCREAMING_SNAKE_CASE.md`, folders `snake_case/`.
- Use present tense ("the API returns…"), active voice, second person for guides ("you install…").

---

## 7. Contact

- Product / CEO: Valentin Lemort — `valentin.lemort@thinkware.fr`
- Engineering: TBD
- Design: TBD
- GTM: TBD

---

*Last updated: 2026-04-20*
