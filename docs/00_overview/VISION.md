# Vision

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)


## One-liner
Ontologia is the **source of truth for your concepts** — a multi-tenant SaaS where teams design, version and govern the ontologies that power their AI, analytics and operations. One model, one API, one audit trail, from the first three classes to a ten-thousand-concept catalogue with a dozen taxonomies inside it.

## Why now

Four forces make 2026 the right moment to launch:

1. **Every AI system needs grounded concepts.** Retrieval-augmented generation (RAG), agent tool-use, product catalogs, compliance taxonomies — all rely on a clean, structured, up-to-date model of domain knowledge. When the concepts drift, AI outputs drift with them.
2. **Enterprise knowledge tooling is stuck in the 2010s.** PoolParty, TopBraid, Protégé, Collibra, Atlan — powerful but heavy, expensive, fragmented across taxonomy, ontology and glossary silos. Teams don't need three tools to manage three facets of the same knowledge; they need one tool that treats schema (T-Box) and instances (A-Box) as a single governed graph.
3. **Teams have outgrown the "draw.io + wiki + spreadsheet" era.** Five years of ad-hoc glossaries and taxonomies have produced opaque, orphaned artefacts nobody can safely change. Organisations need versioning, reviews and audit trails — the same primitives engineers have had for code since 2008.
4. **Neo4j has matured as managed infra.** Neo4j Aura removes the cluster-ops burden that used to make "graph-native tooling" a six-month platform project. The moment to build a great product layer on top is now.

## Thesis
> Concepts will be managed like code — but by people who don't write code. The boundary between "glossary", "taxonomy" and "ontology" is a vocabulary problem, not a product problem: all three are different *depths* of the same primitive, a typed graph of concepts. We build the ontology editor that makes working at any depth feel natural — from three classes to three hundred — and serves SKOS-aligned output to every downstream consumer.

## The model

The primitive is the **Ontology**: a two-layer graph that the UI exposes through a handful of views.

**T-Box (schema layer)**
- `ConceptClass` nodes (e.g. Manufacturer, Model, Engine, BodyStyle) with custom attributes and the six SKOS-aligned built-ins every class carries: `prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example`.
- `RelationType` edges (e.g. `manufacturedBy`, `poweredBy`, `hasBodyStyle`) typed with `domain` and `range` classes, optionally symmetric, including four built-in class-scoped `broader` relations used for hierarchical schemes.

**A-Box (instance layer)**
- `ConceptScheme` containers ("Model catalogue 2026", "Body style taxonomy", "Market segments"). One ontology can host as many schemes as the team needs; they all reuse the same T-Box.
- `Concept` nodes, typed to one class, connected by typed relations. Each concept carries SKOS labels, a status (`active` / `deprecated`), an optional replacement pointer, and authoring metadata.

Everything the user does in the product flows through that model:

| View | Shows | When you use it |
|---|---|---|
| **Dashboard** | Activity feed, usage gauges, per-ontology tiles | Any time you open the app |
| **Schema** | T-Box — classes and relation types, side by side with the full attribute editor | Designing or evolving the model |
| **Canvas (Schema mode, default)** | T-Box as an ER-style diagram; classes as nodes, relation types as edges | Thinking about structure |
| **Canvas (Taxonomies mode)** | A-Box — concepts in the selected scheme, laid out as nodes | Visualising an instance graph |
| **Taxonomies tree** | Per-scheme collapsible trees with the full Concept detail embedded to the right | Curating the day-to-day |
| **Tables** | Sortable datagrid of concepts with filter chips and bulk actions | Auditing, cleanup, deprecations |
| **Concept detail** | All tabs for one concept — Overview, Properties, Relations, History, Usage, AI | Deep edits |

Every mutation (from any view) records a ChangeEvent in the shared history. Exports and the API read from the same model, so a JSON-LD, SKOS Turtle, OWL RDF/XML or CSV download is always faithful.

## Starter templates

The "New ontology" modal opens on three starters so users aren't staring at a blank canvas:

- **Blank** — empty T-Box, one default scheme.
- **Product reference** — small product / variant / category T-Box; single catalogue scheme.
- **Catalog with multi-taxonomies** — the Cars-style shape: one T-Box, several schemes side by side (a primary catalogue plus body-style, fuel-type, segment and geography taxonomies).

There is no separate "Glossary" or "Taxonomy" product. A glossary in Ontologia is simply an ontology with a small T-Box and a single scheme; a taxonomy is a ConceptScheme. Users never migrate between modes — they just add more classes or more schemes as their model grows.

## What we are (and are not)

**We are:**
- An opinionated, visual, multi-tenant ontology editor with first-class Schema, Canvas, Taxonomies tree and Tables views, backed by one typed graph.
- A versioning and governance layer (change-event log, revert, tags, tag-to-tag diff, deprecation with replacement pointer, validation panel; branches/merges on the roadmap).
- A system of record that exposes a stable, versioned API for AI/data pipelines.
- Interoperable with the standards that matter: **SKOS** for concept-level semantics (every concept carries the six SKOS slots natively), **OWL/RDF/Turtle** for full-ontology exchange, **JSON-LD** for linked data.

**We are not:**
- A reasoner. We ship pragmatic validation (cycle detection, domain/range checking, orphan detection) — not OWL DL proofs.
- A general graph database. Neo4j is our engine; we don't re-invent it.
- An MDM (master data management) suite. We model the *concepts*; MDM handles instance-level stewardship at scale.
- A data catalog. Data catalogs document tables and columns; we document the concepts those tables try to represent.
- A drawing tool. Every diagram is backed by a typed, queryable graph.

## Who we serve

Three personas (detailed in [PERSONAS.md](../01_product/PERSONAS.md)):

- **Data Architect** — designs the T-Box. Lives in the Schema view. Cares about class design, relation-type rigour, domain/range correctness, round-trippable exports.
- **Catalogue Maintainer** — runs the A-Box day to day. Lives in the Taxonomies tree and the Tables view. Cares about prefLabels, deprecations, drag-drop reparenting, bulk edits, scheme health.
- **Downstream Consumer (Platform Engineer)** — reads the ontology through the API, webhooks and exports. Cares about a stable endpoint pinned to a tag, a clean JSON-LD / SKOS feed, predictable webhooks on change.

Ontologia is built so one person can wear all three hats on a small team, or three people can specialise on a large one — same workspace, same tier, same pricing.

## 3-year vision

By end of 2029, Ontologia should be the default registry every data-mature organisation points to when it asks *"what do we mean by X, and how does it connect to Y?"* — regardless of whether the team calls the answer a glossary, a taxonomy, or an ontology. Concretely:

- **300+ paying workspaces** across mid-market and enterprise.
- **$6–10M ARR** with 85%+ gross margin.
- **Referenced by two OSS/commercial RAG stacks** as a supported knowledge source.
- **Top-of-mind alongside Protégé, PoolParty and TopBraid** in the ontology / taxonomy management stack, and alongside **Atlan, Collibra and DataHub** as the upstream their glossaries consume.

## Guiding principles

1. **The graph is sacred.** Every change is auditable, reversible and attributable.
2. **One engine, any depth.** Three classes or three hundred — same product, same storage, same API. Users don't grow out of a "simple mode"; they just model more.
3. **Make the hard thing visible.** Hierarchy cycles, conflicting definitions, broken references, orphan concepts, deprecated-still-referenced — we surface them in the validation panel, we don't hide them.
4. **Respect both sides of the keyboard.** Same product must feel natural to a non-technical catalogue maintainer and to a staff data engineer consuming the API.
5. **Interoperate with standards.** SKOS, OWL, RDF, JSON-LD — we speak them so customers don't get locked in.
6. **Boring tech where it doesn't matter, excellent tech where it does.** React Flow, Postgres, Node.js, Neo4j — well-understood pieces. The magic lives in the model, the versioning and the UX, not in stack novelty.
7. **Ship small, ship often.** Weekly releases, feature flags, public changelog.

## Success criteria for v1.0

- **Activation**: a new user can create an ontology from a starter template, add a class, create a scheme and export SKOS in < 10 minutes.
- **Depth reach**: at least one flagship customer running a multi-taxonomy ontology (5+ schemes on a shared T-Box) in production by GA + 6 months — proving the core value proposition.
- **Retention**: D30 retention > 40% on paid workspaces.
- **Reliability**: 99.9% availability on Team+ tiers.
- **Commercial**: 20 paying workspaces within 6 months of GA.

## Related documents
- [Roadmap](ROADMAP.md)
- [Glossary](GLOSSARY.md)
- [PRD](../01_product/PRD.md)
- [Personas](../01_product/PERSONAS.md)
- [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
- [Competitive Analysis](../07_business/COMPETITIVE_ANALYSIS.md)
