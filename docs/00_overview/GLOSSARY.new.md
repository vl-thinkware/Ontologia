# Glossary

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)
**Last updated**: April 2026 · **Scope**: Canonical definitions used across every Ontologia doc, the product UI, the API, and user-facing copy. If a term appears here and in one of the peer docs, this page wins.

---

## How to read this glossary

Terms are grouped by concern, not alphabetised — grouping makes the relationships between them easier to learn. The **Modelling** group is load-bearing for everything else; if you only read one section, read that.

Every entry follows the shape:

> **Term** — single-sentence definition.
> *Maps to*: SKOS / OWL vocabulary it corresponds to, if any.
> *See also*: closely related terms.

---

## Modelling

> **Ontology** — a workspace-scoped container that holds both the schema (classes + relation types) and one or more taxonomies of concepts that follow that schema. Every artefact created in Ontologia is an Ontology; there are no glossary-only or taxonomy-only artefacts.
> *Maps to*: `owl:Ontology`.
> *See also*: ConceptClass, RelationType, ConceptScheme.

> **T-Box** — the schema layer of an ontology: the set of ConceptClasses and RelationTypes that constrain what instances can exist and how they can connect. Short for *terminological box*.
> *See also*: A-Box, ConceptClass, RelationType.

> **A-Box** — the instance layer of an ontology: the actual Concepts and Relations that live inside one or more ConceptSchemes. Short for *assertional box*.
> *See also*: T-Box, ConceptScheme, Concept.

> **ConceptClass** — a T-Box definition for a kind of thing (e.g. `Manufacturer`, `Model`, `Engine`). Every concept is typed by exactly one class. Classes carry a human name + description, a colour, and zero or more custom attributes (see `ClassProperty`). Every concept of a class also carries the six SKOS built-in attributes.
> *Maps to*: `owl:Class`.

> **RelationType** — a T-Box definition for a kind of edge between concepts (e.g. `manufacturedBy`, `hasBodyStyle`). Each relation type declares a `domainClassId` and a `rangeClassId` so the editor can reject mismatched connections. Flags: `isBuiltIn`, `isTransitive`, `isSymmetric`, `strict`.
> *Maps to*: `owl:ObjectProperty`.

> **ClassProperty** — a typed custom attribute declared on a ConceptClass (e.g. `horsepower: number`, `modelYear: number`, `msrpUsd: money`). Supported value types: `string`, `number`, `boolean`, `enum`, `date`, `reference`, `money`. Flags: `required`, `localizable`.
> *See also*: SKOS built-in attribute.

> **ConceptScheme** — an A-Box container for a group of concepts that share the parent ontology's T-Box. Also called a **taxonomy** in product copy when the scheme is organised via `broader` relations. An ontology typically has several: e.g. the Cars ontology ships a Model catalogue, a Body style taxonomy, a Fuel type taxonomy, a Market segments taxonomy, and a Manufacturing geography scheme.
> *Maps to*: `skos:ConceptScheme`.

> **Concept** — an A-Box instance typed by a ConceptClass, living inside exactly one ConceptScheme. Every concept carries the six SKOS built-in attributes, zero or more custom property values, and a `lastChangeId` pointing at the event that last touched it.
> *Maps to*: `skos:Concept`.

> **Relation** — an A-Box edge between two concepts, typed by a RelationType and scoped to a ConceptScheme. Always directed (`from` → `to`).

---

## SKOS built-in attributes

Every Concept carries the following six slots by virtue of being a SKOS Concept. They are not declared in a class's custom properties — the class editor surfaces them as always-present.

> **prefLabel** — the canonical display name for a concept. At most one per language.
> *Maps to*: `skos:prefLabel`.

> **altLabel** — alternative names (synonyms, acronyms, spelling variants). Many per language.
> *Maps to*: `skos:altLabel`.

> **hiddenLabel** — search-only labels. Useful for misspellings, legacy codes, internal names. Never shown as display text. Many per language.
> *Maps to*: `skos:hiddenLabel`.

> **definition** — authoritative meaning of the concept. At most one per language.
> *Maps to*: `skos:definition`.

> **notation** — a stable machine-friendly code (SKU, ISO alpha-2, enum value). Language-neutral.
> *Maps to*: `skos:notation`.

> **example** — free-text illustrative usage. Many per language.
> *Maps to*: `skos:example`.

---

## Hierarchy (inside a ConceptScheme)

> **broader / narrower** — the SKOS hierarchy edge. `Camry —[broader]→ Mid-size Sedan` reads *the Camry is a narrower term than Mid-size Sedan*. Every taxonomy-style scheme ships a class-scoped `broader` RelationType; the Taxonomies tree uses it to build the tree.
> *Maps to*: `skos:broader`, `skos:narrower`.

> **related** — a non-hierarchical pointer between two concepts, typically rendered as a `competitorOf`-style symmetric relation or a user-defined RelationType.
> *Maps to*: `skos:related`.

---

## Views (UI)

> **Dashboard** — the workspace home. Usage gauges, activity feed from live ChangeEvents, ontology tiles.

> **Canvas / Schema mode** — ER-style diagram of the ontology's T-Box. Classes are nodes, relation types are edges. Default view when opening an ontology.

> **Canvas / Taxonomies mode** — same canvas toggled to show concrete Concepts from a single selected scheme, with their A-Box relations.

> **Schema view** — dedicated full-page T-Box editor. Lists classes and relation types side by side; clicking a class expands its full attribute editor (SKOS built-ins documented + custom `ClassProperty` editor with add/edit/delete).

> **Taxonomies tree** — the `/tree` view. Left rail is a per-scheme accordion of trees built from `broader` relations; center pane is the full ConceptDetail for the selected concept. Drag-drop rows to re-parent.

> **Tables view** — a sortable, filterable datagrid over the concepts of the active ontology (or a single scheme). Multi-select bulk actions: Deprecate, Tag.

> **Concept detail** — the full concept page: Overview, Properties, Relations, History, Usage, and AI tabs. Accessible from every view and also at `/ontologies/:id/concepts/:conceptId`.

---

## Versioning & change control

> **ChangeEvent** — the audit record produced by every mutation. Kinds: `create`, `update`, `delete`, `revert`, `tag`, `bulk_import`. Carries author, timestamp, summary and optional message.

> **Tag** — a named pointer to a ChangeEvent (e.g. `v1.3`). Downstream consumers pin API calls to a tag so they get a stable snapshot.

> **Tag-to-tag diff** — the modal that compares two tags and shows a roll-up of added / modified / removed concepts between them.

> **Revert** — recording a new ChangeEvent that inverts a previous one. The original entry stays visible in history (non-destructive).

---

## Governance

> **Deprecation** — marking a concept inactive. Optional pointer to a replacement concept (`dct:isReplacedBy`) + free-text reason. Deprecated concepts stay in the graph for referential integrity and show a strike-through + banner everywhere.
> *Maps to*: `owl:deprecated`, `dct:isReplacedBy`.

> **Validation panel** — a right-rail surface that flags governance issues live: orphan concepts, domain/range violations on relations, duplicate prefLabels within a scheme, deprecated concepts still referenced by active relations, concepts missing a class.

---

## Distribution

> **Export modal** — the picker that serialises the ontology into JSON-LD, SKOS Turtle, OWL RDF/XML or CSV, with a scope selector (full ontology vs per-scheme) and a live preview.

> **API Playground** — a modal that exposes five endpoints (list concepts, list relations, schema, get concept, SPARQL) against the live workspace data. Copy-as-cURL / Copy-as-fetch shortcuts.

> **Starter template** — the preset picked when creating a new ontology. Current options: Blank, Product reference, Catalog with multi-taxonomies.

---

## Collaboration

> **Presence** — the fake-teammate overlay: avatars in the topbar, an "X is editing this" banner on the active concept, and small avatar chips on tree rows where a teammate is parked.

> **Notifications center** — the bell icon in the topbar. Opens a popover listing recent ChangeEvents authored by others, plus static review/comment prompts. Mark-read persists per session.

---

## Roles

> **OntologyArchitect** — can edit the T-Box (classes + relation types) and the A-Box of every ontology in a workspace.

> **CatalogueMaintainer** — can edit concepts + relations inside designated ConceptSchemes but cannot change the T-Box.

> **Downstream consumer** — read-only API client. Pins calls to a tag for stability.

---

## Serialization

> **JSON-LD** — the default linked-data JSON export. Pairs well with glossaries and RAG pipelines.

> **SKOS Turtle** — the Turtle serialization of a ConceptScheme. Round-trips with PoolParty, Sitecore, Algolia and anything that speaks SKOS.

> **OWL RDF/XML** — full ontology export including T-Box. Consumed by Protégé, Stardog, GraphDB.

> **CSV** — flat concept list with custom property columns. For BI, spreadsheets, legacy pipelines.

---

## Legacy terms (no longer used)

These terms appear in older drafts; they're kept here only so search still lands somewhere. Do not use them in new copy.

- ~~Artefact mode~~ — replaced by "Ontology". Every workspace creation is now "New ontology".
- ~~Glossary artefact~~ / ~~taxonomy artefact~~ — fold into Ontology + one or more ConceptSchemes.
- ~~synonymOf~~ / ~~seeAlso~~ as first-class relations — subsumed by `altLabel` and user-defined RelationTypes.
- ~~Implicit class~~ — dropped; all classes are explicit in the current T-Box editor.
