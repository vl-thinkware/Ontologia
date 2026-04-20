# Vision

## One-liner
Ontologia is the **GitHub + Notion of enterprise ontologies** — a multi-tenant SaaS where data teams build, version and govern the knowledge graphs that power their AI, analytics and operations.

## Why now

Three forces make 2026 the right moment to launch:

1. **Knowledge graphs became critical infrastructure for AI.** Retrieval-augmented generation (RAG), agent tool-use, product catalogs, compliance taxonomies — all rely on a clean, structured, up-to-date graph of domain knowledge. When the graph drifts, AI outputs drift with it.
2. **Teams have outgrown the "draw.io + wiki" era.** Five years of ad-hoc ontologies have produced opaque, orphaned artefacts nobody can safely change. Organisations need versioning, reviews and audit trails — the same primitives engineers have had for code since 2008.
3. **Neo4j has matured as managed infra.** Neo4j Aura removes the cluster-ops burden that used to make "graph-native tooling" a six-month platform project. The moment to build a great product layer on top is now.

## Thesis
> Ontologies will be managed like code — but by people who don't write code. We build the product layer that makes that true.

## What we are (and are not)

**We are:**
- An opinionated, visual, multi-tenant editor for conceptual models.
- A versioning and governance layer (commits, branches, reviews, diffs, audit log).
- A system of record that exposes a stable, versioned API for AI/data pipelines.

**We are not:**
- A reasoner. We ship "light" inference (transitive closure, cycle detection) — not OWL DL proofs.
- A general graph database. Neo4j is our engine; we don't re-invent it.
- A MDM (master data management) suite. We model the *concepts*; MDM handles instance-level stewardship.
- A drawing tool. Every diagram is backed by a typed, queryable graph.

## Who we serve

Three personas (detailed in [PERSONAS.md](../01_product/PERSONAS.md)):

- **Knowledge Architect** — designs and maintains the graph.
- **Domain Expert** — contributes domain truth without writing Cypher.
- **Platform Engineer** — consumes the graph in pipelines, agents and search.

## 3-year vision

By end of 2029, Ontologia should be the default registry that every data-mature organisation points to when it asks "what do we mean by *customer*, *product*, *risk*?". Concretely:

- **300+ paying workspaces** across mid-market and enterprise.
- **$6–10M ARR** with 85%+ gross margin.
- **Referenced by two OSS/commercial RAG stacks** as a supported knowledge source.
- **Top-of-mind alongside dbt, Datahub and Atlan** in the modern data stack.

## Guiding principles

1. **The graph is sacred.** Every change is auditable, reversible and attributable.
2. **Make the hard thing visible.** Merges, conflicts, consequences — we surface them, we don't hide them.
3. **Respect both sides of the keyboard.** Same product must feel natural to a non-technical PM and to a staff data engineer.
4. **Boring tech where it doesn't matter, excellent tech where it does.** React Flow, Postgres, Node.js, Neo4j — well-understood pieces. The magic lives in versioning and UX, not in stack novelty.
5. **Ship small, ship often.** Weekly releases, feature flags, public changelog.

## Success criteria for v1.0

- Activation: a new user can import a CSV taxonomy and publish v1 in < 10 minutes.
- Retention: D30 retention > 40% on paid workspaces.
- Reliability: 99.9% availability on Pro+ tiers.
- Commercial: 20 paying workspaces within 6 months of GA.

## Related documents
- [Roadmap](ROADMAP.md)
- [Glossary](GLOSSARY.md)
- [PRD](../01_product/PRD.md)
- [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
