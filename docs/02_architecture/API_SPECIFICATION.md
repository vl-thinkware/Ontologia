# REST API Specification

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v4 (ontology-only, SKOS built-ins)

Ontologia exposes a versioned, OpenAPI-described REST API for programmatic use. This document summarises the contract; the canonical source is the auto-generated OpenAPI 3.1 spec at `https://api.ontologia.com/v1/openapi.json`.

> **MVP scope**: the `/branches`, `/commits`, and `/reviews` endpoints are deferred to the S1/S2 release. MVP mutations happen via change events applied directly to an ontology. See [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md).
>
> **T-Box and A-Box are first-class.** Following [DATA_MODEL.md](DATA_MODEL.md) v5, every top-level artefact is an `Ontology`. The API exposes its schema layer (`/concept-classes`, `/relation-types`) and its instance layer (`/schemes`, `/concepts`, `/relations`) as separate, explicit resources. Taxonomies live inside an ontology as `ConceptScheme` instances — they reuse the parent ontology's T-Box and are authored, read, and exported through the same endpoints as any other scheme.
>
> **Read endpoints mirror the mockup's API Playground.** The Playground exposes five top-level reads against an ontology — `/concepts`, `/relations`, `/schema`, `/concepts/:conceptId`, and `/sparql` — and they are the canonical ergonomic shapes for third-party integrations. See §3.8, §3.9, §3.18.

---

## 1. Conventions

- **Base URL.** `https://api.ontologia.com/v1`
- **Content type.** `application/json; charset=utf-8` by default. `application/ld+json` on export endpoints.
- **Time.** ISO-8601 (RFC 3339), UTC.
- **IDs.** String UUIDs (v7 preferred).
- **Errors.** RFC 7807 problem-details. Example:

```json
{
  "type": "https://errors.ontologia.com/validation",
  "title": "Validation failed",
  "status": 400,
  "detail": "field 'name' is required",
  "instance": "/v1/concepts",
  "trace_id": "c45a6…"
}
```

- **Pagination.** Cursor-based: `?cursor=…&limit=50`. Response includes `next_cursor`.
- **Idempotency.** `Idempotency-Key` header on all POST/PUT/DELETE that mutate; 24 h window.
- **Request id.** `X-Request-Id` (server-generated, echoed).
- **Rate limits.** See §7.
- **Language / version / serialization negotiation.** See §1.1.

### 1.1 Request negotiation — `?lang`, `?tag`, `?format`

Every read endpoint on an ontology understands three orthogonal query-string knobs:

| Query param | Effect | Default |
|---|---|---|
| `?lang=<BCP47>` | Picks the language of labels/definitions/examples in the response. Falls back to `Ontology.defaultLanguage` when a value is missing; `fellBack:true` is surfaced in the payload. A single tag (`en`, `fr`) — full locales (`fr-CA`) are normalised to the primary subtag. | `Ontology.defaultLanguage` |
| `?tag=<name>` | Pins the response to an immutable version tag (see §3.10). When present, the server reconstructs the ontology's state at the change event the tag points at. | current HEAD |
| `?format=json\|jsonld\|skos` | Picks the serializer. `json` is the native shape shown in §3 examples; `jsonld` wraps it with `@context` / `@id` / `@type`; `skos` emits a SKOS-compliant Turtle or RDF/XML rendering (per-language labels via `xml:lang`). | `json` |

`Accept-Language` is honoured as a lower-precedence equivalent of `?lang=`. When both are supplied, the query param wins. Sending a `lang` tag that isn't in `Ontology.languages` returns `400 unknown-language`.

**Single-language response shape (default, `format=json`).** Every label or definition field is a resolved scalar plus lineage metadata:

```json
{
  "prefLabel":  { "value": "Tesla Model 3", "lang": "en", "fellBack": false },
  "definition": { "value": "Compact electric sedan.", "lang": "en", "fellBack": true, "requested": "fr" }
}
```

`fellBack:true` tells the client the server returned the `defaultLanguage` value because the requested language has no translation yet. When no value exists in either language, the field is `null` and `fellBack:false`.

**Multilingual response shape.** Pass `?expand=labels,definitions,properties,examples` to receive every enabled language at once. Used by the side-by-side multilingual view in the mockup, by SKOS / JSON-LD exports, and by bulk translators. The shape for each field becomes an array:

```json
{
  "labels": {
    "prefLabel":   [{ "lang": "en", "value": "Model 3" }, { "lang": "fr", "value": "Model 3" }],
    "altLabel":    [{ "lang": "en", "value": "Tesla sedan" }, { "lang": "fr", "value": "Berline Tesla" }],
    "hiddenLabel": [{ "lang": "en", "value": "tesla 3" }]
  },
  "definitions": [
    { "lang": "en", "value": "Compact electric sedan produced by Tesla." },
    { "lang": "fr", "value": "Berline électrique compacte produite par Tesla." }
  ],
  "notation": "M3",
  "examples": [
    { "lang": "en", "value": "The Model 3 competes with the BMW i4 in the luxury EV segment." }
  ]
}
```

**Writes.** Mutations target the structured bag directly. See §3.8 for the PATCH and POST shapes — a write always carries `lang` alongside `value` and respects the SKOS cardinalities (1-per-lang for `prefLabel` and `definition`, N-per-lang for `altLabel`, `hiddenLabel`, `example`; 0..1 language-neutral scalar for `notation`).

## 2. Authentication & authorisation

### 2.1 Two credential types
- **User session JWT (Clerk).** For the web app.
- **API key (Bearer).** For programmatic use.

```
Authorization: Bearer sk_live_abc…
```

### 2.2 Scopes

An API key declares scopes at creation:

- `read:ontology` · `write:ontology` — includes T-Box (classes, relation types) and A-Box (schemes, concepts, relations)
- `write:schema` — finer-grained: allows T-Box edits only (classes, relation types). Sidecar to `write:ontology` for CI / sync jobs that should not touch instances.
- `write:instance` — finer-grained: allows A-Box edits only (schemes, concepts, relations). Used by catalogue-only or taxonomy-only integrations.
- `read:comments` · `write:comments`
- `admin:roles` — create / update fine-grained `(:Role)` nodes and `CAN_WRITE` edges
- `admin:webhooks` · `admin:api_keys`
- `admin:members`

A call that doesn't match the scope returns `403 insufficient_scope`. Container-scoped roles (see §3.6) add a second check: even with `write:instance`, a user can only mutate schemes their roles `CAN_WRITE`.

## 3. Resources & endpoints

### 3.1 Organisations / workspaces

```
GET    /me
GET    /orgs/{orgId}
GET    /orgs/{orgId}/workspaces
POST   /orgs/{orgId}/workspaces             {name}                   (admin:members)
GET    /workspaces/{workspaceId}
POST   /orgs/{orgId}/memberships            (admin:members)
DELETE /memberships/{membershipId}          (admin:members)
```

### 3.2 Ontologies (top-level artefact containers)

```
GET    /workspaces/{workspaceId}/ontologies
POST   /workspaces/{workspaceId}/ontologies {name, description?,
                                             languages?: BCP47[], defaultLanguage?: BCP47,
                                             starter?: 'blank'|'skos-core'|'schema-org'|'cars-demo'|…}
GET    /ontologies/{id}
PATCH  /ontologies/{id}                     {name?, description?, defaultLanguage?}
DELETE /ontologies/{id}                     (soft-delete)

// Language configuration (dedicated routes — see §3.2.1)
GET    /ontologies/{id}/languages
PUT    /ontologies/{id}/languages           {languages: BCP47[], defaultLanguage: BCP47}   (write:ontology)
POST   /ontologies/{id}/languages           {lang: BCP47}                                  (write:ontology)
DELETE /ontologies/{id}/languages/{lang}    {strategy?: 'block'|'drop'|'retag', retagTo?: BCP47}   (write:ontology)
```

An `Ontology` is the T-Box container — it holds `ConceptClass` and `RelationType` definitions, and declares the set of `languages` every A-Box concept underneath it may use. Every ontology is auto-provisioned with a default `ConceptScheme` on create so A-Box-first authors (catalogue, single taxonomy) can start adding concepts immediately; you can add more schemes at any time (§3.7). `languages` defaults to `['en']` with `defaultLanguage: 'en'` when not specified. `starter` seeds a prebuilt T-Box — e.g. `cars-demo` provisions the Cars ontology used throughout this spec's examples (9 classes, 13 relation types, 5 schemes).

#### 3.2.1 Language configuration

`GET /ontologies/{id}/languages` returns `{ languages: ['en','fr'], defaultLanguage: 'en' }`.

`POST /ontologies/{id}/languages` adds a new enabled language. Existing concepts gain an empty label/definition slot for that language — translators then backfill via PATCH on each concept. Returns `409 language-already-enabled` if `lang` is already in the set.

`DELETE /ontologies/{id}/languages/{lang}` removes a language, and the query `strategy` controls what happens to concept values still tagged with it:

| strategy | Behaviour |
|---|---|
| `block` *(default)* | Fails with `409 language-in-use {count}` if any concept still carries a value in `lang`. Safest for audited artefacts. |
| `drop`  | Deletes every `LangString` with `lang` matching, across every concept under the ontology. One `change_event` per touched concept. |
| `retag` | Rewrites `lang` → `retagTo` on every `LangString`. Used when migrating `en-GB` → `en`. Fails `409 retag-conflict` on any concept where both languages already have a `prefLabel`. |

`PUT /ontologies/{id}/languages` replaces the whole set in a single call. The server computes the diff (adds + removes), applies `strategy='block'` to removals by default, and returns the unified list on success. `defaultLanguage` must be present in the final `languages` array.

Both routes append an `ontology.languages_changed` event to the change log and emit the matching webhook.

### 3.3 Roles & permissions

```
GET    /orgs/{orgId}/roles                                          (admin:roles)
POST   /orgs/{orgId}/roles                  {name, description?}    (admin:roles)
PATCH  /roles/{id}                          {name?, description?}   (admin:roles)
DELETE /roles/{id}                                                  (admin:roles)

GET    /roles/{id}/write-targets                                    (admin:roles)
PUT    /roles/{id}/write-targets            {targets:[{type:'ontology'|'scheme', id}]}
                                                                    (admin:roles)

POST   /roles/{id}/assignees                {userId}                (admin:roles)
DELETE /roles/{id}/assignees/{userId}                               (admin:roles)
```

Roles are container-scoped — a `CatalogueMaintainer` role can be given `CAN_WRITE` to a single `ConceptScheme` without leaking access to the parent Ontology's T-Box. See [DATA_MODEL.md](DATA_MODEL.md) §2.1.

### 3.4 Change events (MVP history)

```
GET    /ontologies/{id}/change-events?entityType=&entityId=&from=&to=&cursor=&limit=
POST   /ontologies/{id}/change-events       {operation, entityType, entityId?, diff, message?, expectedLastEventId?}
GET    /change-events/{eventId}
POST   /change-events/{eventId}/revert      {message?}
GET    /ontologies/{id}/diff?from={eventId}&to={eventId}
```

`entityType` values: `ontology` · `concept_class` · `relation_type` · `scheme` · `concept` · `concept_relation` · `tag`.

`diff` shape follows the TypeScript `Diff` type in [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md) §4. Conflict handling:

- If `expectedLastEventId` is supplied and no longer matches the server's current last event for the entity, the server returns `409 stale-head` and the client must refetch.
- `operation='bulk_import'` accepts a list of creates and is idempotent via `Idempotency-Key`.

### 3.5 Concept classes (T-Box — `owl:Class`)

```
GET    /ontologies/{id}/concept-classes
POST   /ontologies/{id}/concept-classes     {name, label?, description?, parentClassId?, properties?: ClassProperty[]}    (write:schema)
GET    /concept-classes/{id}
PATCH  /concept-classes/{id}                {name?, label?, description?, parentClassId?, properties?: ClassProperty[], expectedLastEventId?}  (write:schema)
DELETE /concept-classes/{id}                {expectedLastEventId?}                          (write:schema)
```

Every class surfaces the **six SKOS-inspired built-in attribute slots** on every one of its concepts (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example` — see [DATA_MODEL.md](DATA_MODEL.md) §2.6). The built-ins are not included in — and cannot be declared inside — the `properties` array. `properties` is for **custom, additive** ClassProperty rows authored on top of the built-ins:

```ts
{
  key: string               // e.g. 'horsepower', 'priceMsrp'
  label: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date' | 'reference' | 'money'
  required: boolean
  localizable: boolean      // true → concepts store this value as LangString[] (per language)
  options?: string[]        // required when type='enum'
}
```

- `reference` properties store a `conceptId` pointing at a concept in the same ontology.
- `money` properties store `{ amount, currency }` pairs.

Delete is blocked (`409 class-in-use`) if any live `Concept` in any scheme attached to the parent Ontology still carries this `classId`. Clients should migrate concepts to another class first (`PATCH /concepts/{id} {classId}`) or bulk-deprecate.

Flipping `localizable` on an existing class property is a structural migration and returns `409 localizable-migration-requires-confirm` unless `?confirmMigration=true` is supplied — see [DATA_MODEL.md](DATA_MODEL.md) §2.6. On confirm, false→true seeds an empty `localizedValues[]` on every existing concept; true→false is only accepted when every concept has at most the default-language value for that key.

### 3.6 Relation types (T-Box — `owl:ObjectProperty`)

```
GET    /ontologies/{id}/relation-types
POST   /ontologies/{id}/relation-types      {name, label?, description?, isTransitive?, isSymmetric?, isReflexive?, strict?, domainClassId, rangeClassId}   (write:schema)
GET    /relation-types/{id}
PATCH  /relation-types/{id}                 {name?, label?, description?, isTransitive?, isSymmetric?, isReflexive?, strict?, domainClassId?, rangeClassId?, expectedLastEventId?}  (write:schema)
DELETE /relation-types/{id}                 {expectedLastEventId?}                          (write:schema)
```

`domainClassId` and `rangeClassId` map to the `IS_SUBJECT_OF` and `IS_TARGET_OF` edges in Neo4j (≈ `rdfs:domain` / `rdfs:range`). Both must reference classes that are `HAS_CLASS`-attached to the parent Ontology. Changing them while live relations of this type exist returns `409 incompatible-domain` unless the instances already match the new domain / range.

Taxonomy hierarchies are authored as **class-scoped `broader` relation types** — one RelationType named `broader` per hierarchised class (e.g. `BodyStyle→BodyStyle`, `FuelType→FuelType`). Exporters collapse them back to a single `skos:broader` predicate on SKOS / JSON-LD output. See [DATA_MODEL.md](DATA_MODEL.md) §2.3.1.

Changes to relation types are recorded as change events (`entityType='relation_type'`).

### 3.7 Concept schemes (A-Box containers — `skos:ConceptScheme`)

```
GET    /ontologies/{id}/schemes
POST   /ontologies/{id}/schemes             {name, description?, sourceLanguage?}          (write:instance)
GET    /schemes/{id}
PATCH  /schemes/{id}                        {name?, description?, sourceLanguage?}         (write:instance)
DELETE /schemes/{id}                        (soft-delete; confirms if scheme is non-empty)
```

Every Ontology ships with one default scheme on create. A single Ontology routinely hosts **several schemes side-by-side** — a main catalogue plus one scheme per taxonomy. The Cars demo seed is a good illustration: one `Model catalogue 2026` scheme (manufacturers + models + engines + transmissions + drive types) plus four taxonomy schemes (`Body style taxonomy`, `Fuel type taxonomy`, `Market segments`, `Manufacturing geography`) — all typed against the same nine classes in the parent ontology's T-Box.

`sourceLanguage` is the scheme-level SKOS declaration (`skos:ConceptScheme` primary language in exports) and is independent from the parent Ontology's multilingual configuration — a scheme may be authored primarily in one language yet carry concepts translated into every language the ontology has opted into. If omitted, it defaults to `Ontology.defaultLanguage`.

### 3.8 Concepts (A-Box — `skos:Concept`)

```
// Ontology-level reads — the shapes surfaced in the API Playground
GET    /ontologies/{id}/concepts?search=&classId=&schemeId=&lang=&tag=&format=&expand=&limit=&cursor=
GET    /ontologies/{id}/concepts/{conceptId}?lang=&tag=&format=&expand=

// Scheme-scoped reads and writes
GET    /schemes/{schemeId}/concepts?search=&status=&classId=&lang=&expand=&limit=&cursor=
POST   /schemes/{schemeId}/concepts         {classId, labels, definitions?, notation?, examples?,
                                             properties?, broaderId?,
                                             name?, description?, altLabels?}              (write:instance)
GET    /concepts/{id}?lang=&expand=
PATCH  /concepts/{id}                       {classId?, labels?, definitions?, notation?, examples?,
                                             properties?, broaderId?,
                                             name?, description?, altLabels?, expectedLastEventId?}   (write:instance)
DELETE /concepts/{id}                       {expectedLastEventId?}                          (write:instance)

// Translation-focused helpers
POST   /concepts/{id}/translations          {lang, prefLabel?, altLabel?: string[],
                                             hiddenLabel?: string[], definition?, example?: string[],
                                             properties?: {[key]: string}}                  (write:instance)
DELETE /concepts/{id}/translations/{lang}   {expectedLastEventId?}                          (write:instance)
```

`classId` is required on create and must reference a `ConceptClass` on the parent Ontology. `broaderId` sets `skos:broader` inside the same scheme and is resolved by the write layer into a `ConceptRelation` of the class-scoped `broader` RelationType (§3.6).

**Returned payload — the six SKOS built-ins plus custom properties.** Every concept returned by the API carries the built-in slots on the class (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example`) alongside the class-specific custom properties. Example for the Tesla Model 3:

```json
{
  "id": "c_model_model_3",
  "classId": "cls_model",
  "schemeId": "sch_catalogue",
  "prefLabel":   { "value": "Model 3", "lang": "en", "fellBack": false },
  "altLabel":    [{ "value": "Tesla sedan", "lang": "en" }],
  "hiddenLabel": [{ "value": "tesla 3", "lang": "en" }],
  "definition":  { "value": "Compact electric sedan produced by Tesla.", "lang": "en", "fellBack": false },
  "notation":    "M3",
  "example":     [{ "value": "The Model 3 is Tesla's entry-level sedan.", "lang": "en" }],
  "properties": [
    { "key": "horsepower",  "value": 283 },
    { "key": "priceMsrp",   "value": { "amount": 38990, "currency": "USD" } },
    { "key": "launchedAt",  "value": "2017-07-28" }
  ],
  "status": "validated"
}
```

**Request shape (write).** `labels` is the structured SKOS bag and is preferred for new clients. `notation` is a plain scalar; `examples` is a `LangString[]`.

```json
{
  "classId": "cls_model",
  "labels": {
    "prefLabel": [
      { "lang": "en", "value": "Model 3" },
      { "lang": "fr", "value": "Model 3" }
    ],
    "altLabel": [
      { "lang": "en", "value": "Tesla sedan" },
      { "lang": "fr", "value": "Berline Tesla" }
    ],
    "hiddenLabel": [
      { "lang": "en", "value": "tesla 3" }
    ]
  },
  "definitions": [
    { "lang": "en", "value": "Compact electric sedan produced by Tesla." }
  ],
  "notation": "M3",
  "examples": [
    { "lang": "en", "value": "The Model 3 competes with the BMW i4." }
  ],
  "properties": [
    { "key": "horsepower", "value": 283 },
    { "key": "priceMsrp",  "value": { "amount": 38990, "currency": "USD" } }
  ]
}
```

**Legacy scalar fields.** `name`, `description`, and `altLabels` remain accepted as an input convenience for pre-multilingual clients. The server maps them onto `labels.prefLabel[defaultLanguage]`, `definitions[defaultLanguage]`, and `labels.altLabel` at the default language respectively. Mixing legacy and structured fields in the same request returns `400 conflicting-label-shape`.

**Response shape.** Depends on `?expand=`:

- *(default, no expand)* — collapsed, single-language projection per the `?lang=` / `Accept-Language` negotiation in §1.1. Every label/definition is `{ value, lang, fellBack, requested? }`; `notation` is a scalar; `example` is a single resolved `LangString` (use `expand=examples` for the full list).
- `?expand=labels,definitions,properties,examples` — full multilingual bag as shown in the request example, plus the collapsed scalars (`name`, `description`) at the top level for back-compat.

**Translation helpers.** `POST /concepts/{id}/translations` is a convenience route for writing all of a concept's values in one language in one call. It is equivalent to a PATCH that merges each field into the right spot in the structured bag, but reads more naturally in translator workflows. Sending a `lang` not in `Ontology.languages` returns `400 unknown-language`. Sending a `prefLabel` for a language that already has one overwrites it (prefLabel is 1-per-language); `altLabel` / `hiddenLabel` / `example` arrays replace the existing per-language set for that language atomically. `DELETE /concepts/{id}/translations/{lang}` drops every value tagged with `lang` on this concept in a single change event.

### 3.9 Concept relations (A-Box — typed object properties)

```
// Ontology-level read — surfaced in the API Playground
GET    /ontologies/{id}/relations?relationTypeId=&subjectClassId=&targetClassId=&schemeId=&limit=&cursor=

// Scheme-scoped reads and writes
GET    /schemes/{schemeId}/relations
POST   /schemes/{schemeId}/relations        {subjectConceptId, targetConceptId, relationTypeId, label?, properties?}   (write:instance)
PATCH  /relations/{id}                      {label?, properties?, expectedLastEventId?}    (write:instance)
DELETE /relations/{id}                      {expectedLastEventId?}                          (write:instance)
```

`relationTypeId` must be `HAS_RELATION_TYPE`-attached to the parent Ontology. If the referenced `RelationType.strict = true`, the subject and target concept classes must exactly match its domain / range; otherwise `rdfs:subClassOf` matches are allowed.

The ontology-level `/relations` read returns every relation across every scheme in the ontology — useful for building the graph canvas view or exporting the full relation web in one call. Filter by `schemeId` to narrow to one scheme.

Each mutation appends a `change_event` internally; clients that want to batch should use the change-events endpoint directly.

### 3.10 Tags

```
GET    /ontologies/{id}/tags
POST   /ontologies/{id}/tags                {name, changeEventId}
GET    /tags/{id}
DELETE /tags/{id}
```

Tags are immutable pointers into the change-event log. Use `?tag=<name>` on any ontology read (`/concepts`, `/relations`, `/schema`, `/concepts/:id`, `/sparql`) to pin the response to the state at that tag.

Deleting a tag appends a `tag` change event marking the tag deprecated; the tag row itself is retained for referential integrity.

### 3.11 Comments

```
POST   /comments                            {targetType, targetId, body, parentId?}
GET    /comments?targetType=concept&targetId=…
PATCH  /comments/{id}                       {body?}
DELETE /comments/{id}
POST   /comments/{id}/resolve
```

`targetType` values in MVP: `ontology`, `concept_class`, `relation_type`, `scheme`, `concept`, `concept_relation`, `change_event`.

### 3.12 Import / export (async jobs)

```
POST   /ontologies/{id}/imports             multipart: file + config
GET    /jobs/{jobId}
POST   /ontologies/{id}/exports?format=jsonld|skos|ttl|owl|json|csv
GET    /exports/{exportId}/download         (presigned URL)
```

| `format` | MIME | Typical use |
|---|---|---|
| `jsonld` | `application/ld+json` | Default structured export; AI / RAG / wiki ingestion |
| `skos` | `text/turtle` (SKOS profile) | Per-scheme export to PoolParty, Synaptica, Smartlogic, Algolia, Sitecore |
| `ttl` | `text/turtle` | Raw Turtle; T-Box export to Protégé, TopBraid, Stardog, GraphDB |
| `owl` | `application/rdf+xml` | OWL/XML for OWL-first toolchains |
| `json` | `application/json` | Flat JSON for generic pipelines and BI |
| `csv` | `text/csv` | Spreadsheets, BI warehouses, flat-file consumers |

Import formats mirror exports: `csv`, `skos` (Turtle / RDF / XML), `owl` (simplified OWL), `jsonld`. File format is auto-detected on upload. See [USER_FLOWS.md](../01_product/USER_FLOWS.md) §5 for the import wizard.

### 3.13 Webhooks

```
GET    /webhooks                            (admin:webhooks)
POST   /webhooks                            {url, events:[…], active:true}
PATCH  /webhooks/{id}
DELETE /webhooks/{id}
POST   /webhooks/{id}/rotate-secret
POST   /webhooks/{id}/deliveries/{deliveryId}/retry
```

### 3.14 API keys (admin:api_keys)

```
GET    /api-keys
POST   /api-keys                            {name, scopes:[…]}
DELETE /api-keys/{id}
```

The raw key is returned **once** in the POST response.

### 3.15 Audit log

```
GET /audit-events?action=&userId=&from=&to=&cursor=
```

Exportable CSV / JSON on Team+; retention per [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

### 3.16 Usage

```
GET /usage                                  current period counters (workspaces, concepts, api_calls) vs plan limits
```

### 3.17 Schema — compact T-Box view

```
GET    /ontologies/{id}/schema?lang=&tag=&format=
```

Returns the full T-Box of an ontology in one call — every `ConceptClass` (including the six SKOS built-in slots and any custom `ClassProperty` rows) and every `RelationType` (with its domain / range and flags). This is the fastest way for an integration to learn "what lives in this ontology" before issuing concept reads. `format=jsonld` renders it as `owl:Class` / `owl:ObjectProperty` definitions; `format=skos` restricts the output to what SKOS cares about (labels, definitions, notations on classes treated as `skos:Collection`).

Example response (`format=json`, Cars ontology):

```json
{
  "ontologyId": "ont_cars",
  "name": "Cars",
  "languages": ["en", "fr"],
  "defaultLanguage": "en",
  "classes": [
    {
      "id": "cls_manufacturer",
      "name": "Manufacturer",
      "label": "Manufacturer",
      "builtInAttributes": ["prefLabel", "altLabel", "hiddenLabel", "definition", "notation", "example"],
      "properties": [
        { "key": "foundedYear", "type": "number", "required": false, "localizable": false },
        { "key": "tagline",     "type": "string", "required": false, "localizable": true }
      ]
    },
    { "id": "cls_model", "name": "Model", "builtInAttributes": ["prefLabel","altLabel","hiddenLabel","definition","notation","example"],
      "properties": [
        { "key": "horsepower", "type": "number", "required": false, "localizable": false },
        { "key": "priceMsrp",  "type": "money",  "required": false, "localizable": false }
      ]
    }
    // … 7 more
  ],
  "relationTypes": [
    { "id": "rt_manufactured_by",  "name": "manufacturedBy",  "domain": "cls_model",        "range": "cls_manufacturer", "strict": true },
    { "id": "rt_powered_by",       "name": "poweredBy",       "domain": "cls_model",        "range": "cls_engine",       "strict": true },
    { "id": "rt_competitor_of",    "name": "competitorOf",    "domain": "cls_model",        "range": "cls_model",        "strict": true, "isSymmetric": true }
    // … 10 more, including four class-scoped `broader` types
  ]
}
```

### 3.18 SPARQL

```
POST   /ontologies/{id}/sparql              body: SPARQL 1.1 query (application/sparql-query)
                                            ?format=json|jsonld|skos (default: SPARQL JSON Results)
```

Runs a SPARQL 1.1 SELECT / CONSTRUCT / ASK / DESCRIBE query against the ontology. The graph is exposed with the standard SKOS + OWL vocabularies — `skos:Concept`, `skos:prefLabel`, `skos:broader`, `owl:Class`, `owl:ObjectProperty`, `rdfs:domain`, `rdfs:range`. The SPARQL endpoint honours `?tag=` (pin to an immutable version) and `?lang=` (bias rendered literals to a language with default-language fallback).

Example — every Tesla model with its horsepower, read at the `2026-Q2` tag:

```sparql
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cars: <https://ontologia.com/ont/ont_cars#>

SELECT ?model ?label ?hp WHERE {
  ?model a cars:Model ;
         cars:manufacturedBy cars:c_mfr_tesla ;
         skos:prefLabel ?label ;
         cars:horsepower ?hp .
  FILTER(LANG(?label) = "en")
}
```

Only `read:ontology` scope is required. Writes via SPARQL Update are not exposed — use the REST mutation endpoints instead so every change flows through the change-event log.

### 3.19 Deferred — branches and reviews (ship with S1 / S2)

```
// Branches (deferred)
GET    /ontologies/{id}/branches
POST   /ontologies/{id}/branches            {name, fromCommitId}
GET    /branches/{id}
DELETE /branches/{id}
POST   /branches/{id}/merge                 {into, strategy?: 'ff'|'three-way'}

// Commits (deferred)
GET    /branches/{id}/commits
POST   /commits                             {branchId, expectedHeadCommitId, message, changes}
GET    /commits/{id}
POST   /commits/{id}/revert                 {branchId}

// Reviews (deferred)
POST   /reviews                             {branchId, targetBranchId, title, reviewers:[userId]}
GET    /reviews/{id}
POST   /reviews/{id}/approve
POST   /reviews/{id}/request-changes
POST   /reviews/{id}/merge
POST   /reviews/{id}/close
```

When these ship, they will not break the MVP routes; the change-events endpoint remains the lower-level primitive.

## 4. Status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted — async job enqueued |
| 204 | No content (deletes, resolves) |
| 400 | Validation error |
| 401 | Missing / invalid credentials |
| 402 | Plan limit reached (upgrade required) |
| 403 | Insufficient scope or role |
| 404 | Not found (also when cross-tenant) |
| 409 | Conflict (stale head, duplicate name) |
| 410 | Resource deleted |
| 422 | Semantic validation error |
| 429 | Rate limited |
| 500 | Server error |
| 503 | Temporary overload |

## 5. Webhook payloads

Every webhook:
- Method: `POST`.
- Headers: `X-Ontologia-Event`, `X-Ontologia-Delivery`, `X-Ontologia-Signature: t=…,v1=hex`.
- Signature: `HMAC_SHA256(secret, "{t}.{body}")`.
- Timeout: 10 s.
- Retries: `1s, 5s, 30s, 2m, 10m, 1h, 6h, 24h` then DLQ.
- Replay: owner can replay any delivery from the dashboard or API.

Body example (`change.created`):

```json
{
  "id": "evt_01J…",
  "type": "change.created",
  "createdAt": "2026-05-01T10:12:34Z",
  "orgId": "org_…",
  "data": {
    "ontologyId": "ont_cars",
    "changeEventId": "ce_…",
    "author": {"id": "usr_…", "displayName": "Alex"},
    "operation": "create",
    "entityType": "concept",
    "entityId": "c_model_model_3",
    "message": "Add Model 3"
  }
}
```

MVP event types:
- `ontology.created` · `ontology.updated` · `ontology.languages_changed`
- `concept_class.created` · `concept_class.updated` · `concept_class.deleted`
- `relation_type.created` · `relation_type.updated` · `relation_type.deleted`
- `scheme.created` · `scheme.updated` · `scheme.deleted`
- `change.created` · `change.reverted`
- `tag.created`
- `concept.deprecated` · `concept.translation_added` · `concept.translation_removed`
- `role.created` · `role.write_targets_changed`
- `member.invited` · `member.role_changed` · `member.removed`
- `billing.plan_changed` · `billing.usage_threshold`

Deferred (S1 / S2): `branch.created` · `branch.deleted` · `branch.merged` · `review.opened` · `review.approved` · `review.merged` · `review.closed`.

## 6. Versioning policy

- `v1` URL prefix is stable for 24 months after GA.
- Additive changes (new fields, new endpoints) are non-breaking.
- Breaking changes ship as a new major version `v2/*`; `v1` remains available with a 12-month deprecation window.
- Deprecation is announced in `Sunset` and `Deprecation` headers, in the changelog, and by email to API key owners.

## 7. Rate limits

Default buckets (token bucket, Redis):

| Plan | API calls / month (plan limit) | Burst rate / minute | Webhook deliveries / min |
|---|---|---|---|
| Free | 5,000 | 30 | 10 |
| Team | 500,000 | 600 | 60 |
| Business | 5,000,000 | 3,000 | 600 |
| Enterprise | Custom | Custom | Custom |

Headers returned on every response:

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 597
X-RateLimit-Reset: 1714567890
Retry-After: 30                   (only on 429)
```

Plan-level monthly limits (concepts, API calls) surface as `402 plan-limit-reached` once exceeded; the burst per-minute limits surface as `429 rate-limited`.

Large responses respect a 5 MB cap; beyond that, clients must paginate.

## 8. SDKs

- `ontologia-python` (official). Auto-generated from OpenAPI with hand-crafted ergonomics for change events and diffs.
- `ontologia-js`. Isomorphic (Node + browser).

Both SDKs:
- Type-safe with the latest spec.
- Support idempotency keys and automatic retries on 429 / 503.
- Expose a webhook signature verifier helper.

## 9. Error taxonomy

Common `type` URLs:

- `/validation` — request body or query violates schema.
- `/stale-head` — change event submitted against an outdated `expectedLastEventId` (409).
- `/insufficient-scope` — API key missing scope (403).
- `/not-a-member` — user not in org (404).
- `/rate-limited` — 429 with `Retry-After`.
- `/plan-limit-reached` — 402; body includes the limit hit and upgrade link.
- `/entity-too-large` — payload over cap (413).
- `/unknown-language` — a `lang` tag in a query param, header, or body isn't part of the parent ontology's enabled languages (400).
- `/unknown-tag` — `?tag=` refers to a version tag that doesn't exist on this ontology (404).
- `/conflicting-label-shape` — mixing structured `labels`/`definitions` with the legacy `name`/`description`/`altLabels` input fields in the same request (400).
- `/language-already-enabled` · `/language-in-use` · `/retag-conflict` — raised by the language-config routes in §3.2.1 (409).
- `/localizable-migration-requires-confirm` — flipping a ClassProperty's `localizable` flag requires `?confirmMigration=true` because it reshapes every existing concept value (409).

## 10. Example — end-to-end (MVP)

Build the "Model 3 manufacturedBy Tesla, poweredBy an electric engine" slice of the Cars demo — T-Box first, then A-Box, then translate into French, then tag, then query. This is the long-form flow an ontology author walks through; pre-seeded starters (`starter=cars-demo` on ontology create) install the full T-Box for you in one call.

```bash
ONT=ont_cars
CATALOGUE=sch_catalogue

# --- Ontology setup with enabled languages ---
curl -X PATCH https://api.ontologia.com/v1/ontologies/$ONT \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"defaultLanguage":"en"}'

curl -X PUT https://api.ontologia.com/v1/ontologies/$ONT/languages \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"languages":["en","fr"],"defaultLanguage":"en"}'

# --- T-Box ---
# Define class Model with custom horsepower + priceMsrp properties
curl -X POST https://api.ontologia.com/v1/ontologies/$ONT/concept-classes \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Model","label":"Model","description":"A car model sold by a manufacturer.",
    "properties":[
      {"key":"horsepower","label":"Horsepower","type":"number","required":false,"localizable":false},
      {"key":"priceMsrp","label":"MSRP","type":"money","required":false,"localizable":false}
    ]
  }'
# → {"id":"cls_model", ...}

# Define class Manufacturer
curl -X POST https://api.ontologia.com/v1/ontologies/$ONT/concept-classes \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"name":"Manufacturer","label":"Manufacturer"}'
# → {"id":"cls_manufacturer", ...}

# Define relation type manufacturedBy: Model → Manufacturer
curl -X POST https://api.ontologia.com/v1/ontologies/$ONT/relation-types \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"name":"manufacturedBy","label":"manufactured by","domainClassId":"cls_model","rangeClassId":"cls_manufacturer","strict":true}'
# → {"id":"rt_manufactured_by", ...}

# --- A-Box ---
# Create Tesla, the manufacturer
curl -X POST https://api.ontologia.com/v1/schemes/$CATALOGUE/concepts \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "classId":"cls_manufacturer",
    "labels":{"prefLabel":[{"lang":"en","value":"Tesla"}]},
    "notation":"TSLA"
  }'
# → {"id":"c_mfr_tesla", ...}

# Create Model 3 with built-ins + custom properties
curl -X POST https://api.ontologia.com/v1/schemes/$CATALOGUE/concepts \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "classId":"cls_model",
    "labels":{
      "prefLabel": [{"lang":"en","value":"Model 3"}],
      "altLabel":  [{"lang":"en","value":"Tesla sedan"}],
      "hiddenLabel":[{"lang":"en","value":"tesla 3"}]
    },
    "definitions":[{"lang":"en","value":"Compact electric sedan produced by Tesla."}],
    "notation":"M3",
    "examples":[{"lang":"en","value":"The Model 3 is Teslas entry-level sedan."}],
    "properties":[
      {"key":"horsepower","value":283},
      {"key":"priceMsrp","value":{"amount":38990,"currency":"USD"}}
    ]
  }'
# → {"id":"c_model_model_3", ...}

# Add the French translation in a single call
curl -X POST https://api.ontologia.com/v1/concepts/c_model_model_3/translations \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "lang":"fr",
    "prefLabel":"Model 3",
    "altLabel":["Berline Tesla"],
    "definition":"Berline électrique compacte produite par Tesla."
  }'

# Read back in French (lang negotiation — collapsed projection)
curl "https://api.ontologia.com/v1/ontologies/$ONT/concepts/c_model_model_3?lang=fr" \
  -H "Authorization: Bearer sk_live_..."
# → {
#     "id":"c_model_model_3",
#     "prefLabel":{"value":"Model 3","lang":"fr","fellBack":false},
#     "definition":{"value":"Berline électrique compacte produite par Tesla.","lang":"fr","fellBack":false},
#     "notation":"M3",
#     ...
#   }

# Side-by-side projection — both languages at once, JSON-LD serializer
curl "https://api.ontologia.com/v1/ontologies/$ONT/concepts/c_model_model_3?expand=labels,definitions,properties,examples&format=jsonld" \
  -H "Authorization: Bearer sk_live_..."

# Link them with manufacturedBy
curl -X POST https://api.ontologia.com/v1/schemes/$CATALOGUE/relations \
  -H "Authorization: Bearer sk_live_..." \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{"subjectConceptId":"c_model_model_3","targetConceptId":"c_mfr_tesla","relationTypeId":"rt_manufactured_by"}'

# --- Tag ---
curl -X POST https://api.ontologia.com/v1/ontologies/$ONT/tags \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"name":"2026-Q2","changeEventId":"ce_01J..."}'

# --- Read back at the tag, via SPARQL ---
curl -X POST "https://api.ontologia.com/v1/ontologies/$ONT/sparql?tag=2026-Q2&lang=en" \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/sparql-query" \
  --data '
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cars: <https://ontologia.com/ont/ont_cars#>
SELECT ?label ?hp WHERE {
  ?m a cars:Model ;
     cars:manufacturedBy cars:c_mfr_tesla ;
     skos:prefLabel ?label ;
     cars:horsepower ?hp .
  FILTER(LANG(?label) = "en")
}'
```

Each mutation returns the created entity along with the `changeEventId` the server appended to the history.

---

Related: [Data Model](DATA_MODEL.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Integrations](INTEGRATIONS.md) · [Authentication](../06_security_compliance/AUTHENTICATION.md) · [Pricing Model](../08_finance/PRICING_MODEL.md)
