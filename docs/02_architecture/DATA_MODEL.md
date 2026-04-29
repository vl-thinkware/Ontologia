# Data Model

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v5 (Ontology-only top level, SKOS built-ins)

Complete schema for the two databases powering Semlify — Neo4j for the graph domain, PostgreSQL for everything relational and for the authoritative change history.

> **MVP scope**: MVP uses an *append-only ChangeEvent log* in Postgres and a materialised current-state view in Neo4j. The commit-graph / branch / review tables described in Section 6 are **deferred** until the branches feature (S1 / S2) ships.
>
> **One shape, top-to-bottom: Ontology → T-Box → A-Box.** An Ontology is a *T-Box* container: it defines `ConceptClass` (what things exist — `owl:Class`) and `RelationType` (how things connect — `owl:ObjectProperty`, with domain / range via `IS_SUBJECT_OF` / `IS_TARGET_OF` ≈ `rdfs:domain` / `rdfs:range`). One or more `ConceptScheme` nodes hang off that ontology and form the *A-Box*: each scheme is a `skos:ConceptScheme` holding typed `Concept` nodes and their `ConceptRelation` edges. A taxonomy is *not* a separate artefact kind — it is a `ConceptScheme` whose concepts are connected by one of the ontology's `broader` relation types. A single ontology routinely hosts several schemes side-by-side (a main catalogue plus a handful of classification taxonomies), all reusing the same T-Box.

---

## 1. Overview

Each organisation (tenant) has:

- **one tenant-scoped Neo4j database** (Business+) or **a namespace inside a shared database** (Free / Team) holding the current state of that org's ontologies, concept schemes, concepts, and relations.
- **rows in the shared Postgres** for users, orgs, memberships, change events, billing, comments, audits, notifications, API keys, and webhooks.

All Postgres tables carry an `org_id` column enforced via RLS. All Neo4j nodes and relations carry an `orgId` property when on shared Neo4j.

The Neo4j graph is organised in three layers. Read top-to-bottom as *who can do what → what the world looks like → what's in the world*:

1. **Identity & permission** — `Org`, `Role`, `User` (mirror). Role nodes carry `CAN_WRITE` edges to specific containers (Ontology or ConceptScheme).
2. **T-Box (schema)** — `Ontology` defines `ConceptClass` and `RelationType` nodes. Relation types are bound to classes via `IS_SUBJECT_OF` and `IS_TARGET_OF` edges (domain / range).
3. **A-Box (instances)** — one or more `ConceptScheme` nodes hang off an Ontology. Each scheme contains typed `Concept` nodes (each bound to a `ConceptClass` from the parent Ontology) and `ConceptRelation` nodes (each bound to a `RelationType`).

---

## 2. Neo4j schema (MVP — current-state only)

### 2.1 Identity & permission layer

```cypher
// Organisation — mirror of the Postgres row for local graph joins
(:Org {
  id,                 // uuid
  name,
  plan,               // free | team | business | enterprise
  createdAt
})

// Roles — scoped to an org, named, carry a set of write targets as CAN_WRITE edges.
// Roles are first-class nodes (not just a membership string) so that a role like
// "CatalogueMaintainer" can be given write access to one ConceptScheme without leaking
// write access to the parent Ontology's T-Box.
(:Role {
  id,                 // uuid
  orgId,
  name,               // e.g. 'OntologyArchitect', 'CatalogueMaintainer', 'TaxonomyEditor'
  description,
  createdAt
})

// User mirror — minimal copy of the Postgres row, sufficient for graph joins
(:User { id, orgId, email, displayName })
```

Relationships:

```cypher
(:Org)-[:DEFINES_ROLE]->(:Role)
(:Org)-[:HAS_MEMBER]->(:User)
(:User)-[:HAS_ROLE]->(:Role)

// CAN_WRITE targets a specific container — either a whole Ontology (T-Box)
// or a single ConceptScheme (A-Box slice). Read access is modelled in Postgres
// via memberships (workspaces inherit org read by default).
(:Role)-[:CAN_WRITE]->(:Ontology)
(:Role)-[:CAN_WRITE]->(:ConceptScheme)
```

> **Why a graph Role rather than the Postgres `role` column alone?** Because write scope is per-container and needs to be queryable at graph-edit time ("can Mila edit *this* scheme right now?"). The Postgres `memberships.role` stays as the coarse global role (owner / editor / reviewer / viewer); the graph `Role` refines it to specific containers. MVP provisions two defaults per org — `OntologyArchitect` (`CAN_WRITE` on the ontology itself, i.e. can edit the T-Box) and `CatalogueMaintainer` (`CAN_WRITE` on the ontology's main scheme) — and lets customers define more.

### 2.2 T-Box — the ontology / schema layer

```cypher
// Artefact container. Every top-level artefact in Semlify is an Ontology. The
// ontology owns the T-Box (classes + relation types) and the language configuration
// for every concept underneath it.
(:Ontology {
  id,                 // uuid
  orgId,
  name,
  description,
  languages,          // BCP-47 tag[] — enabled languages for A-Box labels/definitions (e.g. ['en','fr'])
  defaultLanguage,    // BCP-47 tag — canonical language, must be in `languages`. Used for fallback
                      // and for the legacy `concept.name` / `concept.description` mirror fields.
  createdAt, updatedAt,
  createdBy           // userId
})

// Concept class — owl:Class equivalent. The set of things that can exist in any
// ConceptScheme attached to this Ontology. Classes surface the six SKOS-inspired
// built-in attribute slots on every Concept (prefLabel / altLabel / hiddenLabel /
// definition / notation / example — see §2.7) plus any custom ClassProperty
// authored here. The built-ins are not stored as ClassProperty rows — they are
// implicit on every class and always present on every Concept.
(:ConceptClass {
  id,                 // uuid
  orgId, ontologyId,
  name,               // e.g. 'Manufacturer', 'Model', 'Engine'
  label,              // human-friendly
  description,
  parentClassId,      // optional — sub-class relationships (rdfs:subClassOf)
  properties,         // ClassProperty[] — custom, additive on top of the six SKOS built-ins
                      //   { key, label, type, required, localizable, options? }
                      //   - type: 'string' | 'number' | 'boolean' | 'enum' | 'date'
                      //     | 'reference' | 'money'
                      //   - localizable: true → concept values of this property are LangString[]
                      //     (per-language), false → concept values are a single market-agnostic scalar.
                      //   - options: string[] — enum values when type='enum'
  createdAt, updatedAt
})

// Relation type — owl:ObjectProperty equivalent. Describes how ConceptClasses
// connect. Domain / range are carried as edges (IS_SUBJECT_OF / IS_TARGET_OF)
// not as string properties, so schema changes are queryable.
(:RelationType {
  id,                 // uuid
  orgId, ontologyId,
  name,               // e.g. 'manufacturedBy', 'poweredBy', 'broader'
  label,
  description,
  isTransitive,       // bool
  isSymmetric,        // bool
  isReflexive,        // bool
  strict,             // bool — if true, concepts must match domain/range exactly
  isBuiltIn,          // bool — true for class-scoped `broader` relation types (see §2.3.1)
  createdAt, updatedAt
})
```

T-Box relationships:

```cypher
(:Ontology)-[:HAS_CLASS]->(:ConceptClass)
(:ConceptClass)-[:SUBCLASS_OF]->(:ConceptClass)      // optional class hierarchy

(:Ontology)-[:HAS_RELATION_TYPE]->(:RelationType)

// Domain / range — a RelationType declares which class it starts from and
// which class it targets. These are the two *definitional* edges of the T-Box.
(:RelationType)-[:IS_SUBJECT_OF]->(:ConceptClass)    // ≈ rdfs:domain
(:RelationType)-[:IS_TARGET_OF]->(:ConceptClass)     // ≈ rdfs:range
```

Worked example — the **Cars ontology** that ships as the demo seed:

```cypher
// T-Box authored once on the Cars ontology
(o:Ontology {id:'ont_cars', name:'Cars', defaultLanguage:'en', languages:['en','fr']})

// Nine concept classes
(mfr :ConceptClass {id:'cls_manufacturer',  name:'Manufacturer'})
(mdl :ConceptClass {id:'cls_model',         name:'Model'})
(bdy :ConceptClass {id:'cls_body_style',    name:'BodyStyle'})
(eng :ConceptClass {id:'cls_engine',        name:'Engine'})
(trx :ConceptClass {id:'cls_transmission',  name:'Transmission'})
(fue :ConceptClass {id:'cls_fuel_type',     name:'FuelType'})
(drv :ConceptClass {id:'cls_drive_type',    name:'DriveType'})
(seg :ConceptClass {id:'cls_segment',       name:'Segment'})
(ctr :ConceptClass {id:'cls_country',       name:'Country'})

(o)-[:HAS_CLASS]->(mfr), (o)-[:HAS_CLASS]->(mdl), (o)-[:HAS_CLASS]->(bdy),
(o)-[:HAS_CLASS]->(eng), (o)-[:HAS_CLASS]->(trx), (o)-[:HAS_CLASS]->(fue),
(o)-[:HAS_CLASS]->(drv), (o)-[:HAS_CLASS]->(seg), (o)-[:HAS_CLASS]->(ctr)

// Cross-class relation types — the web of "how a car is described"
(:RelationType {id:'rt_manufactured_by',  name:'manufacturedBy',  strict:true})   // Model → Manufacturer
(:RelationType {id:'rt_headquartered_in', name:'headquarteredIn', strict:true})   // Manufacturer → Country
(:RelationType {id:'rt_has_body_style',   name:'hasBodyStyle',    strict:true})   // Model → BodyStyle
(:RelationType {id:'rt_powered_by',       name:'poweredBy',       strict:true})   // Model → Engine
(:RelationType {id:'rt_uses_fuel',        name:'usesFuel',        strict:true})   // Engine → FuelType
(:RelationType {id:'rt_has_transmission', name:'hasTransmission', strict:true})   // Model → Transmission
(:RelationType {id:'rt_has_drive',        name:'hasDrive',        strict:true})   // Model → DriveType
(:RelationType {id:'rt_in_segment',       name:'inSegment',       strict:true})   // Model → Segment
(:RelationType {id:'rt_competitor_of',    name:'competitorOf',    strict:true, isSymmetric:true})  // Model ↔ Model

// Four class-scoped `broader` relation types — one per hierarchised class.
// See §2.3.1 for why it's one-per-class rather than a single shared type.
(:RelationType {id:'rt_broader_body',    name:'broader', strict:true, isBuiltIn:true})  // BodyStyle → BodyStyle
(:RelationType {id:'rt_broader_fuel',    name:'broader', strict:true, isBuiltIn:true})  // FuelType → FuelType
(:RelationType {id:'rt_broader_segment', name:'broader', strict:true, isBuiltIn:true})  // Segment → Segment
(:RelationType {id:'rt_broader_country', name:'broader', strict:true, isBuiltIn:true})  // Country → Country
```

### 2.3 A-Box — the scheme / instance layer

```cypher
// ConceptScheme ≈ skos:ConceptScheme. A named bag of concepts that lives
// inside an Ontology. Schemes are the unit of permission scoping for A-Box
// edits and the unit of SKOS export. One Ontology hosts many schemes — a
// main catalogue plus one scheme per taxonomy (body styles, fuel types, etc.).
(:ConceptScheme {
  id,                 // uuid
  orgId, ontologyId,
  name,               // e.g. 'Model catalogue 2026', 'Body style taxonomy'
  description,
  sourceLanguage,     // default 'en' — legacy field, superseded by Ontology.defaultLanguage
                      // for concept labels/definitions. Kept for backward compat with the
                      // scheme-level SKOS export where `skos:ConceptScheme` declares its
                      // primary language.
  createdAt, updatedAt,
  createdBy
})

// Concept ≈ skos:Concept. Always typed — `classId` must be one of the
// ConceptClass ids HAS_CLASS-attached to the parent Ontology.
//
// Every Concept carries the six SKOS-inspired built-in slots (labels + definition +
// notation + example — see §2.7) by virtue of its class, plus any custom
// ClassProperty values declared on the class.
//
// The legacy `name` and `description` fields are kept as the default-language
// mirror so surfaces with no language context (legacy API clients, canvas
// tooltips, search result snippets) keep working without a payload shape change.
(:Concept {
  id,                 // uuid — stable
  orgId, ontologyId, schemeId,
  classId,            // FK into :ConceptClass — carried for fast lookup

  // --- SKOS built-ins (present on every concept, in every class) ---
  labels,             // { prefLabel:   LangString[],  // 1 per lang — skos:prefLabel
                      //   altLabel:    LangString[],  // N per lang — skos:altLabel
                      //   hiddenLabel: LangString[]   // N per lang — skos:hiddenLabel
                      // }
  definitions,        // LangString[]  — skos:definition, up to 1 per enabled language
  notation,           // string | null — skos:notation, 0..1, language-neutral machine code
                      //                 (e.g. 'M3' for the Model 3, 'V8-5.0' for an engine)
  examples,           // LangString[]  — skos:example, 0..many illustrative usages

  // Default-language mirrors — canonical scalars, maintained by the write layer.
  // Always equal to pickLang(labels.prefLabel, ontology.defaultLanguage) and
  // pickLang(definitions, ontology.defaultLanguage) respectively.
  name,               // skos:prefLabel in Ontology.defaultLanguage
  description,        // skos:definition in Ontology.defaultLanguage

  status,             // 'draft' | 'validated' | 'deprecated'
  source,
  confidence,         // number 0..1 or null

  // Custom attributes — one entry per ClassProperty declared on the parent class.
  // Additive on top of the six SKOS built-ins. Shape of each entry depends on
  // the class property's `localizable` flag:
  //   localizable:false → { key, value: scalar }
  //   localizable:true  → { key, localizedValues: LangString[] }  // up to 1 per enabled language
  properties,         // ConceptPropertyValue[]

  lastChangeEventId,  // uuid — pointer into change_event table
  updatedAt
})

// LangString — the atomic multilingual value used by labels, definitions, examples,
// and localizable property values. `lang` is a BCP-47 tag and MUST be one of
// Ontology.languages for the owning concept's ontology.
//
// type LangString = { lang: BCP47, value: string }

// ConceptRelation — a concrete instance of a RelationType between two Concepts
// that both live in the same ConceptScheme. Realised as a node so per-edge
// metadata can be attached and versioned independently.
(:ConceptRelation {
  id,                 // uuid
  orgId, ontologyId, schemeId,
  relationTypeId,     // FK — must be HAS_RELATION_TYPE-attached to the parent Ontology
  label,              // optional override of RelationType.label
  properties,         // map (JSON)
  lastChangeEventId,
  updatedAt
})

// Tag — named, immutable pointer into the change_event log
(:Tag {
  id,
  orgId, ontologyId,
  name,
  changeEventId,
  createdAt, createdBy
})
```

A-Box relationships:

```cypher
// Ontology → schemes → concepts
(:Ontology)-[:HAS_SCHEME]->(:ConceptScheme)
(:ConceptScheme)-[:HAS_CONCEPT]->(:Concept)
(:Concept)-[:IN_SCHEME]->(:ConceptScheme)            // inverse, for fast "which scheme am I in"

// Concept → class (carried as FK on the Concept node, and as an edge for queries)
(:Concept)-[:HAS_CLASS_INSTANCE]->(:ConceptClass)

// SKOS-native hierarchy between concepts in a scheme. `broader` is authored
// in the T-Box as one class-scoped RelationType per hierarchised class (see
// §2.3.1); the edges below are the materialised instances that the query layer
// follows for tree views and SKOS export.
(:Concept)-[:BROADER]->(:Concept)                    // ≈ skos:broader
(:Concept)-[:NARROWER]->(:Concept)                   // inverse, materialised for fast read

// Typed relations — a ConceptRelation binds subject → target and references a RelationType
(:Concept)-[:HAS_RELATION]->(:ConceptRelation)-[:TARGETS]->(:Concept)
(:ConceptRelation)-[:OF_TYPE]->(:RelationType)

// Tags
(:Ontology)-[:HAS_TAG]->(:Tag)
```

Worked example — the Cars A-Box. The ontology hosts **five schemes side-by-side**, all typed against the same T-Box:

```cypher
// A-Box — five ConceptSchemes hang off the Cars ontology
(sCat :ConceptScheme {id:'sch_catalogue',   name:'Model catalogue 2026'})    // main A-Box
(sBdy :ConceptScheme {id:'sch_body_style',  name:'Body style taxonomy'})
(sFue :ConceptScheme {id:'sch_fuel_type',   name:'Fuel type taxonomy'})
(sSeg :ConceptScheme {id:'sch_segments',    name:'Market segments'})
(sGeo :ConceptScheme {id:'sch_geography',   name:'Manufacturing geography'})
(o)-[:HAS_SCHEME]->(sCat), (o)-[:HAS_SCHEME]->(sBdy), (o)-[:HAS_SCHEME]->(sFue),
(o)-[:HAS_SCHEME]->(sSeg), (o)-[:HAS_SCHEME]->(sGeo)

// Concepts in the main catalogue — manufacturers, models, engines, transmissions, drives
(:Concept {id:'c_mfr_toyota',  classId:'cls_manufacturer', schemeId:'sch_catalogue', name:'Toyota',
           notation:'TOY'})
(:Concept {id:'c_mfr_bmw',     classId:'cls_manufacturer', schemeId:'sch_catalogue', name:'BMW'})
(:Concept {id:'c_mfr_tesla',   classId:'cls_manufacturer', schemeId:'sch_catalogue', name:'Tesla'})
// … Ford, Volkswagen, Porsche, Honda, Volvo — 8 manufacturers total

(camry :Concept {id:'c_model_camry',   classId:'cls_model', schemeId:'sch_catalogue', name:'Camry',
                 notation:'CAMRY'})
(m3    :Concept {id:'c_model_model_3', classId:'cls_model', schemeId:'sch_catalogue', name:'Model 3',
                 notation:'M3'})
(p911  :Concept {id:'c_model_911',     classId:'cls_model', schemeId:'sch_catalogue', name:'911',
                 notation:'911'})
// … Mustang, Golf, etc. — 13 models total

(:Concept {id:'c_engine_v8_50', classId:'cls_engine', schemeId:'sch_catalogue', name:'5.0L V8',
           notation:'V8-5.0'})
// … 7 engines, 6 transmissions, 4 drive types — all in the catalogue

// Concepts in the body style taxonomy scheme — typed BodyStyle, linked by broader
(:Concept {id:'c_body_sedan',     classId:'cls_body_style', schemeId:'sch_body_style', name:'Sedan'})
(:Concept {id:'c_body_suv',       classId:'cls_body_style', schemeId:'sch_body_style', name:'SUV'})
(:Concept {id:'c_body_crossover', classId:'cls_body_style', schemeId:'sch_body_style', name:'Crossover'})
  -[:BROADER]->(:Concept {id:'c_body_suv'})   // Crossover broader SUV

// Typed relations live in the catalogue scheme
(cr1:ConceptRelation {id:'cr_01', relationTypeId:'rt_manufactured_by'})
(m3)-[:HAS_RELATION]->(cr1)-[:TARGETS]->(:Concept {id:'c_mfr_tesla'})
(cr1)-[:OF_TYPE]->(:RelationType {id:'rt_manufactured_by'})

(cr2:ConceptRelation {id:'cr_02', relationTypeId:'rt_powered_by'})
(m3)-[:HAS_RELATION]->(cr2)-[:TARGETS]->(:Concept {id:'c_engine_electric_ac'})

(cr3:ConceptRelation {id:'cr_03', relationTypeId:'rt_competitor_of'})   // symmetric
(m3)-[:HAS_RELATION]->(cr3)-[:TARGETS]->(:Concept {id:'c_model_i4'})
```

The demo seed carries **~112 relation instances** across all five schemes.

Invariants enforced by the write layer:

- `Concept.classId` **must** match a ConceptClass that is `HAS_CLASS` of the parent Ontology.
- `ConceptRelation.relationTypeId` **must** match a RelationType that is `HAS_RELATION_TYPE` of the parent Ontology.
- If `RelationType.strict = true`, subject `Concept.classId` must equal the class on the other end of `IS_SUBJECT_OF`, and target `Concept.classId` must equal the class on the other end of `IS_TARGET_OF`. When `strict = false`, sub-class matches are allowed (via `SUBCLASS_OF`).
- `BROADER` / `NARROWER` can only connect concepts inside the same `ConceptScheme`, and the underlying `ConceptRelation` must reference a `broader` RelationType whose domain and range both point at the shared class.
- Every `LangString.lang` written onto a Concept (in `labels.*`, `definitions`, `examples`, or `properties[*].localizedValues`) **must** appear in the parent Ontology's `languages` array.
- `labels.prefLabel` has **at most one** entry per language — it is the canonical display label. `altLabel` and `hiddenLabel` accept **N per language**.
- `notation` is language-neutral — a single scalar, 0..1 per concept, never carries a `lang` tag.
- `Ontology.defaultLanguage` **must** be an element of `Ontology.languages`. Removing a language from `languages` is blocked while any concept under that ontology still has values tagged with it (the API surfaces a migration endpoint to drop or retag them first — see [API_SPECIFICATION.md](API_SPECIFICATION.md)).
- `Concept.name` and `Concept.description` are derived — the write layer rewrites them on every label/definition mutation to keep them in sync with the `defaultLanguage` value. Direct writes to `name`/`description` via the legacy API implicitly update `labels.prefLabel[defaultLanguage]` and `definitions[defaultLanguage]`.
- For every ClassProperty with `localizable:true`, the matching entry on the Concept uses the `{ key, localizedValues }` shape; for `localizable:false`, the plain `{ key, value }` shape. A Concept cannot carry a property key that isn't declared on its class schema.

### 2.3.1 Many schemes under one ontology — the taxonomist's pattern

One ontology can — and usually does — host several ConceptSchemes. The T-Box is authored once; each scheme reuses it for a different purpose. The Cars demo seed is the canonical illustration:

```
Ontology: "Cars"                                ← T-Box authored once
├── Classes:       Manufacturer · Model · BodyStyle · Engine · Transmission
│                  · FuelType · DriveType · Segment · Country
├── RelationTypes: manufacturedBy · headquarteredIn · hasBodyStyle · poweredBy
│                  · usesFuel · hasTransmission · hasDrive · inSegment
│                  · competitorOf (symmetric)
│                  + four class-scoped `broader` types (body, fuel, segment, country)
│
├── ConceptScheme: "Model catalogue 2026"       ← main A-Box: manufacturers, models,
│                                                 engines, transmissions, drive types
├── ConceptScheme: "Body style taxonomy"        ← skos:broader tree over BodyStyle
├── ConceptScheme: "Fuel type taxonomy"         ← skos:broader tree over FuelType
├── ConceptScheme: "Market segments"            ← skos:broader tree over Segment
└── ConceptScheme: "Manufacturing geography"    ← skos:broader tree over Country
```

Worked example in Cypher:

```cypher
// T-Box — authored once on the ontology (see §2.2)
(o:Ontology {id:'ont_cars', name:'Cars'})

// A-Box — five ConceptSchemes hang off the ontology, all typed by the shared T-Box
(sCat :ConceptScheme {id:'sch_catalogue',   name:'Model catalogue 2026'})
(sBdy :ConceptScheme {id:'sch_body_style',  name:'Body style taxonomy'})
(sFue :ConceptScheme {id:'sch_fuel_type',   name:'Fuel type taxonomy'})
(sSeg :ConceptScheme {id:'sch_segments',    name:'Market segments'})
(sGeo :ConceptScheme {id:'sch_geography',   name:'Manufacturing geography'})
(o)-[:HAS_SCHEME]->(sCat), (o)-[:HAS_SCHEME]->(sBdy), (o)-[:HAS_SCHEME]->(sFue),
(o)-[:HAS_SCHEME]->(sSeg), (o)-[:HAS_SCHEME]->(sGeo)

// Concepts inside each scheme are typed by the reusable T-Box classes
(:Concept {id:'c_model_camry',    classId:'cls_model',      schemeId:'sch_catalogue'})
(:Concept {id:'c_body_sedan',     classId:'cls_body_style', schemeId:'sch_body_style'})
(:Concept {id:'c_fuel_petrol',    classId:'cls_fuel_type',  schemeId:'sch_fuel_type'})
(:Concept {id:'c_seg_luxury',     classId:'cls_segment',    schemeId:'sch_segments'})
(:Concept {id:'c_country_japan',  classId:'cls_country',    schemeId:'sch_geography'})
```

Why one RelationType per hierarchised class instead of a single `broader`? Because `RelationType` has strict domain / range in the T-Box — a single "broader" typed BodyStyle→BodyStyle couldn't also connect FuelType→FuelType. Defining one `broader` RelationType per class keeps the T-Box honest and lets the UI enforce that a body style can't be reparented under a fuel type (and vice versa). The four `broader` relation types all share `name:'broader'` and `isBuiltIn:true`, so exporters can collapse them back to a single `skos:broader` predicate on output.

Permission implications — `Role.CAN_WRITE` targets either the ontology (edit the T-Box, affects every scheme) or a specific scheme (edit only that tree's concepts). In the Cars scenario: one ontology-scoped *"Ontology architect"* role for the one or two people who own the shared schema, plus per-scheme *"Scheme maintainer"* roles so a product manager can own "Model catalogue 2026" without gaining write access to "Body style taxonomy".

### 2.4 Indexes & constraints

```cypher
CREATE CONSTRAINT org_id           IF NOT EXISTS FOR (o:Org)            REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT role_id          IF NOT EXISTS FOR (r:Role)           REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT ontology_id      IF NOT EXISTS FOR (o:Ontology)       REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT class_id         IF NOT EXISTS FOR (c:ConceptClass)   REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT reltype_id       IF NOT EXISTS FOR (r:RelationType)   REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT scheme_id        IF NOT EXISTS FOR (s:ConceptScheme)  REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT concept_id       IF NOT EXISTS FOR (c:Concept)        REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT relation_id      IF NOT EXISTS FOR (r:ConceptRelation) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT tag_id           IF NOT EXISTS FOR (t:Tag)            REQUIRE t.id IS UNIQUE;

// Uniqueness of names inside a container
CREATE CONSTRAINT class_name_per_ontology   IF NOT EXISTS FOR (c:ConceptClass) REQUIRE (c.ontologyId, c.name) IS UNIQUE;
CREATE CONSTRAINT reltype_name_per_ontology IF NOT EXISTS FOR (r:RelationType) REQUIRE (r.ontologyId, r.name) IS UNIQUE;
CREATE CONSTRAINT concept_name_per_scheme   IF NOT EXISTS FOR (c:Concept)      REQUIRE (c.schemeId, c.name)   IS UNIQUE;
CREATE CONSTRAINT notation_per_scheme       IF NOT EXISTS FOR (c:Concept)      REQUIRE (c.schemeId, c.notation) IS UNIQUE;

// Lookup by tenant
CREATE INDEX concept_org_scheme   IF NOT EXISTS FOR (c:Concept)         ON (c.orgId, c.schemeId);
CREATE INDEX concept_class        IF NOT EXISTS FOR (c:Concept)         ON (c.classId);
CREATE INDEX relation_org_scheme  IF NOT EXISTS FOR (r:ConceptRelation) ON (r.orgId, r.schemeId);

// Full-text — indexes the default-language mirrors plus flattened per-language
// label values. The write layer maintains `searchText` as a space-separated
// concatenation of every `labels.prefLabel[*].value`, `labels.altLabel[*].value`,
// `labels.hiddenLabel[*].value`, `definitions[*].value`, and `notation` so a
// single Lucene index covers all enabled languages without needing one index per language.
CREATE FULLTEXT INDEX concept_fts IF NOT EXISTS FOR (c:Concept) ON EACH [c.name, c.description, c.searchText];
```

### 2.5 Versioning invariants (MVP)

1. Neo4j holds the **current** state. Edits mutate Concept / ConceptRelation / ConceptClass / RelationType / ConceptScheme nodes in place, and set `lastChangeEventId` to the id of the change event that produced the current state.
2. The authoritative history lives in Postgres as append-only `change_event` rows — see Section 3.2. Neo4j can be rebuilt from scratch by replaying events.
3. Tags are immutable pointers into the change_event log.
4. Revert is itself a new change event whose diff is the inverse of the target event.

More detail in [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md).

### 2.6 Concept attributes — six SKOS built-ins plus custom ClassProperties

Every class authored in Semlify surfaces the same six built-in attribute slots in the class editor. These are **always present** on every Concept of every class — they are not declared in the class's `properties` array. They map 1:1 to SKOS:

| Slot           | SKOS                | Cardinality                | Purpose                                                                    |
| -------------- | ------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `prefLabel`    | `skos:prefLabel`    | **1 per language**         | Canonical display name. Uniqueness per `(concept, lang)` is enforced.      |
| `altLabel`     | `skos:altLabel`     | N per language             | Synonyms / variants surfaced in search and chip lists.                     |
| `hiddenLabel`  | `skos:hiddenLabel`  | N per language             | Search-only aliases. Matched by full-text search, never rendered in lists. |
| `definition`   | `skos:definition`   | 0 or 1 per language        | Long-form description, one paragraph per language.                         |
| `notation`     | `skos:notation`     | 0..1 (language-neutral)    | Machine code / short identifier. No `lang` tag — a single scalar.          |
| `example`      | `skos:example`      | 0..N                       | Illustrative usage snippets. Each example is a `LangString`.               |

On top of the six built-ins, each class may declare **custom `ClassProperty`** rows to capture domain-specific data:

```ts
type ClassProperty = {
  key: string            // e.g. 'horsepower', 'priceMsrp', 'launchedAt'
  label: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'reference' | 'money'
  required: boolean
  localizable: boolean   // true → concept values are LangString[]
  options?: string[]     // enum values
}
```

- `reference` values are `conceptId` pointers into a scheme in the same ontology — the UI renders them as typeahead chips. They are *not* a replacement for typed `ConceptRelation` edges; use them only for flat 1:1 lookups that don't deserve their own relation type.
- `money` values are `{ amount: number, currency: ISO4217 }` pairs.
- Market-agnostic attributes (`horsepower`, `weightKg`, `launchedAt`) stay `localizable:false` and carry one scalar. Market-facing attributes (`marketingTagline`, `legalNotice`) set `localizable:true` and carry a `LangString[]` just like `definitions`.

The Concept-level value object tracks this distinction:

```ts
type ConceptPropertyValue =
  | { key: string; value: string | number | boolean | Date | { amount: number; currency: string } | string /* conceptId */ }
  | { key: string; localizedValues: LangString[] }
```

`localizable` is set when the class property is declared. Changing it later is a T-Box migration — flipping false→true seeds an empty `localizedValues[]` bag on every existing concept of that class; true→false is only allowed when every concept has at most one language's worth of value (the write layer picks the default-language value as the scalar) and is logged as a T-Box `change_event`.

### 2.7 Multilingual labels (SKOS)

Customers operate across multiple countries and business units. A single concept (e.g. the Tesla *Model 3*) needs to carry native-language prefLabels, alternative labels, definitions, and selected custom attributes in every language the ontology has opted into — without forking the graph. Semlify models this on top of SKOS, with two deliberate choices: labels sit on the concept (not as separate `:Label` nodes), and localisation is opt-in per class property (the six SKOS built-ins are always multilingual where SKOS itself is multilingual).

**Language configuration lives on the Ontology**, not on each Concept. `Ontology.languages` is a closed set of BCP-47 tags (e.g. `['en','fr','de']`); `Ontology.defaultLanguage` picks the canonical one. Every localised value written under that ontology must carry a `lang` tag from this set — the write layer rejects writes to unknown languages. This keeps the "language universe" of an artefact declared and queryable, and gives the UI a single source of truth for which columns to render in the side-by-side view.

**Fallback is explicit, not magical.** When a reader (API client, export, UI surface) requests a concept in a language that has no value for a given field, the server returns the value tagged with `Ontology.defaultLanguage` if one exists, otherwise `null`. Fallback behaviour is surfaced in the payload:

```json
{
  "prefLabel": { "value": "Model 3", "lang": "en", "fellBack": true, "requested": "de" }
}
```

This keeps the rendering side honest — the side-by-side multilingual view uses `fellBack` to grey out and badge missing translations rather than silently pretending they exist. The API contract for `?lang=` and `Accept-Language` is documented in [API_SPECIFICATION.md](API_SPECIFICATION.md).

**Legacy scalar mirrors.** `Concept.name` and `Concept.description` are kept as maintained-by-the-write-layer mirrors of the default-language `prefLabel` and `definition`. This is a deliberate backwards-compatibility affordance: surfaces with no language context (canvas tooltips, search result snippets, the CSV export's primary column, pre-multilingual API clients, the Postgres search join key for change-event summaries) can keep reading a single string without knowing about the label bag. Any write to the multilingual bag triggers a mirror rewrite in the same transaction; any legacy write to `name`/`description` is routed into `labels.prefLabel[defaultLanguage]` / `definitions[defaultLanguage]`.

**Change history.** Every label/definition/translation mutation is a normal `change_event` row with `entity_type='concept'`. The `diff` column carries a JSON patch whose ops target the structured path — e.g. `add /labels/altLabel/- {lang:'fr', value:'Tesla Model 3 Berline'}` or `replace /definitions/0/value "…"`. No new entity_type enum values are needed for i18n; the existing concept diff model is rich enough because labels, definitions, examples, and localized property values are all inside the concept row. Reverting a translation is a normal event-level revert.

**Export alignment.** SKOS RDF/XML export renders per-language labels using the `xml:lang` attribute (`<skos:prefLabel xml:lang="fr">Model 3</skos:prefLabel>`); JSON-LD export uses `@language` in the value objects; CSV export spreads a separate column per enabled language (`prefLabel_en`, `prefLabel_fr`, `definition_en`, `definition_fr`) with `altLabel_<lang>` columns carrying `|`-separated values. `notation` exports as a single language-neutral column. The CSV importer mirrors this convention and creates `LangString` entries keyed off the suffix.

---

## 3. PostgreSQL schema

Written in Drizzle-style pseudo-SQL. Real migrations live in `/packages/db/migrations`.

### 3.1 Tenancy & identity

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free', -- free | team | business | enterprise
  region TEXT NOT NULL DEFAULT 'us',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','editor','reviewer','viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fine-grained, container-scoped roles. Mirrored into Neo4j as (:Role) nodes
-- with CAN_WRITE edges. The coarse `memberships.role` stays as a global fallback
-- (owner / editor / reviewer / viewer); `roles` refines it per-container.
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                 -- e.g. 'OntologyArchitect'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, name)
);

CREATE TABLE role_write_targets (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('ontology','scheme')),
  target_id UUID NOT NULL,
  PRIMARY KEY (role_id, target_type, target_id)
);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

### 3.2 Change history (MVP)

```sql
CREATE TABLE change_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  scheme_id UUID,                     -- nullable — T-Box edits don't have a scheme
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'ontology','concept_class','relation_type',  -- T-Box entities
    'scheme','concept','concept_relation',       -- A-Box entities
    'tag'
  )),
  entity_id UUID,
  operation TEXT NOT NULL CHECK (operation IN ('create','update','delete','revert','tag','bulk_import')),
  diff JSONB NOT NULL,
  message TEXT,
  reverts_event_id UUID REFERENCES change_event(id)
);

CREATE INDEX ON change_event (org_id, ontology_id, created_at DESC);
CREATE INDEX ON change_event (org_id, scheme_id, created_at DESC);
CREATE INDEX ON change_event (org_id, ontology_id, entity_type, entity_id, created_at DESC);

CREATE TABLE tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  name TEXT NOT NULL,
  change_event_id UUID NOT NULL REFERENCES change_event(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, ontology_id, name)
);
```

### 3.3 Collaboration (MVP — comments only)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN (
    'ontology','concept_class','relation_type','scheme','concept','concept_relation','change_event'
  )),
  target_id TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  parent_id UUID REFERENCES comments(id),
  body TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Review requests are deferred; see Section 6.

### 3.4 Audit & notifications

```sql
CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,            -- e.g. 'change.created'
  resource_type TEXT NOT NULL,     -- e.g. 'ontology', 'scheme', 'concept_class'
  resource_id TEXT NOT NULL,
  ip INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON audit_events (org_id, created_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.5 API keys & webhooks

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  hashed_key TEXT NOT NULL,        -- argon2id
  prefix CHAR(8) NOT NULL,         -- visible prefix for UI
  scopes TEXT[] NOT NULL,
  created_by UUID NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id BIGSERIAL PRIMARY KEY,
  subscription_id UUID REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  status TEXT NOT NULL,            -- pending | success | failed | dead
  attempts INT NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  response_code INT,
  response_body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.6 Billing (workspace / volume — not per-seat)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID UNIQUE NOT NULL REFERENCES organizations(id),
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,              -- free | team | business | enterprise
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly','annual','enterprise_custom')),
  status TEXT NOT NULL,            -- active | trialing | past_due | canceled
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage counters for plan limits (workspaces, concepts, API calls)
CREATE TABLE usage_counters (
  org_id UUID NOT NULL,
  period_start DATE NOT NULL,      -- first of the billing month
  workspaces INT NOT NULL DEFAULT 0,
  concepts INT NOT NULL DEFAULT 0,
  api_calls BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, period_start)
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  stripe_invoice_id TEXT,
  amount_cents INT,
  currency TEXT DEFAULT 'USD',
  status TEXT,
  issued_at TIMESTAMPTZ
);
```

Note: no `seats` column on `subscriptions`. Users are never billed as seats; plan gating is driven by `usage_counters`.

### 3.7 Row-Level Security (RLS)

Every tenant-scoped table has RLS enabled:

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON comments
  USING (org_id = current_setting('app.current_org_id')::uuid);
```

API handlers set `SET LOCAL app.current_org_id = '<org>';` inside every transaction. RLS is a defence in depth; the API is still the primary authorisation boundary.

---

## 4. Event payloads (Redis Streams + webhooks)

All events share a base envelope:

```json
{
  "id": "evt_01J…",
  "orgId": "org_…",
  "type": "change.created",
  "createdAt": "2026-05-01T10:12:34.000Z",
  "data": { }
}
```

Event types at v1.0 (MVP):

- `ontology.created` · `ontology.updated` · `ontology.languages_changed`
- `concept_class.created` · `concept_class.updated` · `concept_class.deleted`
- `relation_type.created` · `relation_type.updated` · `relation_type.deleted`
- `scheme.created` · `scheme.updated` · `scheme.deleted`
- `change.created` — any new entry in `change_event`
- `change.reverted` — a change event with `operation='revert'`
- `tag.created`
- `concept.deprecated` · `concept.translation_added` · `concept.translation_removed`
- `role.created` · `role.write_targets_changed`
- `member.invited` · `member.role_changed` · `member.removed`
- `billing.plan_changed` · `billing.usage_threshold`

Deferred (ship with S1 / S2):

- `branch.created` · `branch.deleted` · `branch.merged`
- `review.opened` · `review.approved` · `review.merged` · `review.closed`

---

## 5. Import / export formats

The T-Box / A-Box split makes the mapping to Semantic Web standards direct — Semlify no longer has to *guess* what's a class and what's an instance on export.

| Format       | T-Box coverage                                            | A-Box coverage                                 | Round-trip? |
| ------------ | --------------------------------------------------------- | ---------------------------------------------- | ----------- |
| **JSON-LD**  | ConceptClass → `owl:Class`, RelationType → `owl:ObjectProperty` | Concept → `skos:Concept`, ConceptScheme → `skos:ConceptScheme` | ✅           |
| **SKOS (RDF/XML or Turtle)** | implicit (SKOS is A-Box-centric; per-scheme export)         | full — prefLabel / altLabel / hiddenLabel / definition / notation / example all map natively | ✅           |
| **OWL / Turtle** | full T-Box with `rdfs:domain` / `rdfs:range`            | concepts as instances of `owl:Class`           | ✅           |
| **JSON (native)** | full                                                    | full                                           | ✅           |
| **CSV**      | classes and relation types in separate files               | `concepts.csv`, `relations.csv`                | partial     |

Column contracts and JSON-LD `@context` (`semlify.com/schemas/context.jsonld`) are documented in [API_SPECIFICATION.md](API_SPECIFICATION.md). TTL import ships in Phase 2.

---

## 6. Deferred schema — branches and reviews (S1 / S2)

The following Neo4j nodes and Postgres tables are designed and documented but **not shipped in MVP**. They will be added once branches and review requests ship (Phase 4 in [ROADMAP.md](ROADMAP%20(imported%20to%20notion).md)).

### 6.1 Neo4j additions when S1 ships

```cypher
(:Branch {
  id,
  orgId, ontologyId,
  name,
  headCommitId,
  isProtected,
  createdAt, createdBy
})

(:Commit {
  id,
  orgId, ontologyId, branchId,
  message,
  authorId,
  parentCommitId,
  mergeParentId,
  stats: { /* classes/relations/concepts added/modified/deleted */ },
  createdAt
})

// A commit "sees" a set of T-Box and A-Box versions
(:Commit)-[:INCLUDES]->(:ConceptClass)
(:Commit)-[:INCLUDES]->(:RelationType)
(:Commit)-[:INCLUDES]->(:Concept)
(:Commit)-[:INCLUDES]->(:ConceptRelation)
(:Commit)-[:PARENT]->(:Commit)
(:Commit)-[:MERGED_FROM]->(:Commit)
(:Branch)-[:POINTS_TO]->(:Commit)

// Entity genealogy becomes multi-version
(:Concept)-[:NEXT_VERSION]->(:Concept)
(:ConceptClass)-[:NEXT_VERSION]->(:ConceptClass)
(:RelationType)-[:NEXT_VERSION]->(:RelationType)
```

### 6.2 Postgres additions when S2 ships

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  target_branch_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open','changes_requested','approved','merged','closed')),
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE review_reviewers (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  decision TEXT CHECK (decision IN ('approved','changes_requested','pending')) DEFAULT 'pending',
  decided_at TIMESTAMPTZ,
  PRIMARY KEY (review_id, user_id)
);
```

When S1 ships, the `change_event` table stays. Commits become a grouping layer on top: a commit references a set of change events. The MVP log never needs to be migrated.

---

Related: [Architecture](ARCHITECTURE.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Multi-Tenancy](MULTI_TENANCY.md) · [API Specification](API_SPECIFICATION.md)
