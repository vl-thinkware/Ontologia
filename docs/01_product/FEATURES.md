**Primary owner**: @Valentin LEMORT · **Contributor**: @Alexandre Delplace

**Last updated**: 25 April 2026

**Scope**: Canonical feature list for Ontologia. Each feature is marked `MVP`, `V1` (post-launch first twelve months), or `V2+` (roadmap). If a feature is listed here, it either exists in the built mockup or is scheduled. Anything not on this page is explicitly out of scope.

---

## How to read this page

Features are grouped by the surface area they affect, not by tier or persona. Every entry carries:

- **Status** — one of `MVP`, `V1`, `V2+`
- **Surface** — the view(s) in which the feature lives
- **One-line description** — what the feature does

For anything deeper, follow the link to the dedicated spec.

---

## 1. Core modelling (T-Box)

|Feature|Status|Surface|What it does|
|---|---|---|---|
|ConceptClass CRUD|MVP|Schema|Create, rename, recolour, describe, delete classes. Deletion refuses when the class is still referenced by concepts.|
|Custom attributes on a class|MVP|Schema|Add typed properties: `string`, `number`, `boolean`, `enum` (with values list), `date`, `reference`, `money`. Flags: `required`, `localizable`.|
|SKOS built-in attributes|MVP|Schema|Every class exposes the six SKOS slots (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example`) as always-present. No configuration needed.|
|RelationType CRUD|MVP|Schema|Create relation types with `domain` + `range` class pointers. Flags: `isBuiltIn`, `isTransitive`, `isSymmetric`, `strict`. Deletion refuses when the type is still in use.|
|Schema ER canvas|MVP|Canvas (Schema)|Classes as nodes, relation types as edges. Hub-and-spoke initial layout. Drag nodes freely. Built-in `broader` edges dashed; user-defined edges solid purple.|
|Class inspector|MVP|Canvas (Schema) · right rail|Click a class on the canvas to see identity, instance count, SKOS built-ins, custom attributes, and every relation type participating (as domain and as range). "Edit in Schema view" deep link.|

## 2. Core modelling (A-Box)

|Feature|Status|Surface|What it does|
|---|---|---|---|
|Concept CRUD|MVP|Canvas (Taxonomies), Tables, Tree, Concept detail|Create, edit and remove concepts. New Concept modal scoped to a ConceptScheme.|
|Multilingual labels|MVP|Concept detail, Inspector|Edit `prefLabel`, `altLabel`, `hiddenLabel` per workspace-configured language. Side-by-side multilingual view on ConceptDetail.|
|Custom property values|MVP|Concept detail, Tables, Inspector|Fill typed values per class attribute. `localizable` attributes take multiple language-tagged values.|
|Relation CRUD|MVP|Canvas (Taxonomies)|Drag between concept handles to open the RelationPickerModal; it filters applicable RelationTypes by domain/range. Delete edges via selection + Backspace.|
|ConceptScheme CRUD|MVP|Sidebar, Schema|Create and rename schemes inside an ontology. Schemes share the parent ontology's T-Box.|
|SKOS broader/narrower tree|MVP|Taxonomies tree|`/tree` view builds a scheme's hierarchy from `broader` relations and renders an expandable tree.|
|Drag-drop reparenting|MVP|Taxonomies tree|Drop a row onto another to rewrite its broader relation. Cycle-safe. Records one ChangeEvent summarising the move.|
|Deprecation + replacement|MVP|Concept detail, Inspector|Mark a concept inactive with optional `dct:isReplacedBy` pointer and free-text reason. Strike-through + banner surface the status everywhere.|

## 3. Views

|View|Status|Notes|
|---|---|---|
|Canvas · Schema mode|MVP|Default when opening an ontology. Shows the T-Box.|
|Canvas · Taxonomies mode|MVP|Toggle at top-right. Shows concrete concepts inside the selected scheme. Scheme switcher on the left overlay.|
|Schema view|MVP|Full-page T-Box editor. Classes accordion with inline attribute editor; relation types list with inline forms.|
|Taxonomies tree|MVP|Left rail: per-scheme trees. Center: full ConceptDetail (tabs: Overview, Properties, Relations, History, Usage, AI).|
|Tables view|MVP|Sortable/filterable datagrid. Multi-select bulk actions (Deprecate, Tag).|
|Concept detail|MVP|Stand-alone page at `/ontologies/:id/concepts/:conceptId`. Also embedded in the tree view.|
|Dashboard|MVP|Usage gauges, ontology tiles, activity feed filterable by event kind.|

## 4. Change control

|Feature|Status|Surface|What it does|
|---|---|---|---|
|ChangeEvent journal|MVP|History panel, Dashboard|Every mutation records an event (kind, author, timestamp, summary, optional message).|
|Revert|MVP|History panel, Diff modal|Records a new event that inverts a prior one. Original event stays visible.|
|Tagging|MVP|History panel, Topbar|Name a ChangeEvent (`v1.3`). Downstream consumers pin API calls to the tag.|
|Single-event diff|MVP|Diff modal|Click any event in the history panel to see a field-level before/after table.|
|Tag-to-tag diff|MVP|Tag diff modal|Compare two tags and see added / modified / removed concepts between them.|
|Activity feed|MVP|Dashboard|Live feed of events across every ontology. Filterable by kind; clickable rows.|

## 5. Governance

|Feature|Status|Surface|What it does|
|---|---|---|---|
|Validation panel|MVP|Right rail tab|Live analysis: orphan concepts, domain/range violations, duplicate prefLabels per scheme, deprecated-still-referenced, missing class.|
|Roles|V1|Settings · Members|`OntologyArchitect` / `CatalogueMaintainer` / `Viewer`. Scoped to Ontology or Scheme.|
|Review requests|V2+|Notifications, History|Author request → reviewer sign-off → tag. Currently stubbed in notifications.|
|SHACL validation|V2+|Schema|Importable SHACL shapes that run on save.|

## 6. AI helpers

|Feature|Status|Surface|What it does|
|---|---|---|---|
|altLabel suggestions|MVP|Concept detail · AI tab, Inspector|Heuristic synonym suggestions from a curated dictionary. (un peu ambitieux pour un MVP?) —> Effet wahou assuré par contre|
|Auto-translate prefLabel|MVP|Concept detail · AI tab|Translate the prefLabel into the ontology's other languages. (un peu ambitieux pour un MVP?) —> Effet wahou assuré par contre|
|Duplicate detection|MVP|Concept detail · AI tab|Jaccard-on-altLabels suggests a possible duplicate with overlap score. (un peu ambitieux pour un MVP?) —> Effet wahou assuré par contre|
|Class suggestion|MVP|Concept detail · AI tab|When a concept has no class, propose the best-fit one from the ontology. (un peu ambitieux pour un MVP?) —> Effet wahou assuré par contre|
|Review-flow assistant|V2+|Validation panel|Natural-language explanation of validation failures + proposed fixes.|
|Multilingual definition rewrite|V2+|Concept detail|AI-polished prose passes across all languages.|

## 7. Collaboration

|Feature|Status|Surface|What it does|
|---|---|---|---|
|Live presence|MVP (mocked)|Canvas, Concept detail, Tree|Fake-teammate avatars in topbar; "X is editing" banner; presence chips on tree rows.|
|Notifications center|MVP|Topbar|Bell icon + popover. Lists recent ChangeEvents authored by others + static review/comment prompts. Read/unread state.|
|Comments on concepts|V1|Concept detail|Threaded comments per concept. Mentions.|
|Real-time cursors|V2+|Canvas|Replace the current mock with a Yjs + WebSocket implementation.|
|Branching / merging|V2+|Topbar, History|Fork an ontology, diverge, merge back with conflict resolution.|

## 8. Import / Export

|Feature|Status|Surface|What it does|
|---|---|---|---|
|CSV import wizard|MVP|`/import`|Four-step wizard: upload → map columns → pick target ontology + class → preview → import. Creates one `bulk_import` event.|
|SKOS Turtle export|MVP|Export modal|Turtle serialization of ConceptSchemes. Honours tags via `?tag=`.|
|JSON-LD export|MVP|Export modal|Linked-data JSON for RAG pipelines and modern web consumers.|
|OWL RDF/XML export|MVP|Export modal|Full ontology export for Protégé / Stardog / GraphDB.|
|CSV export|MVP|Export modal|Flat concept list with custom property columns.|
|Live preview in export modal|MVP|Export modal|Dark preview pane, line/char counts, copy-to-clipboard, download-as-file.|
|Webhooks|V1|Settings|Emit on `concept.created`, `relation.deleted`, `ontology.tagged`, etc.|
|MCP server|V2+|—|Expose the ontology as an MCP tool for LLM agents.|

## 9. Distribution

|Feature|Status|Surface|What it does|
|---|---|---|---|
|REST API|MVP|—|Five endpoints: `GET /ontologies/:id/concepts`, `.../relations`, `.../schema`, `.../concepts/:conceptId`, `POST /sparql`.|
|API Playground modal|MVP|Editor topbar|Live endpoint tester against in-memory store. Copy-as-cURL / copy-as-fetch.|
|Version pinning (`?tag=`)|MVP|API|Pin a request to a specific tag for stable snapshots.|
|Language negotiation (`?lang=`)|MVP|API|Return labels + definitions in the requested language, falling back to default.|
|Format negotiation (`?format=`)|MVP|API|`json` (default) · `jsonld` · `skos`.|
|API keys|MVP|Settings|Create, scope, revoke. Per-key last-used and request counts.|

## 10. Editor ergonomics

|Feature|Status|Surface|What it does|
|---|---|---|---|
|Command palette|MVP|⌘K|Jump to any ontology, scheme, concept. Invoke actions (new concept, tag, export).|
|Global search|MVP|Topbar|Any keystroke opens the Command Palette pre-filled.|
|Inline editing|MVP|Concept detail|Toggle an edit mode that mutates the store via `updateConcept`. Save records a ChangeEvent.|
|Deprecation banner|MVP|Concept detail, Inspector, Tree editor|Amber strip surfaces the replacedBy link + reason wherever a deprecated concept appears.|

## 11. Authentication & workspaces

|Feature|Status|Surface|What it does|
|---|---|---|---|
|Email / Google sign-in|MVP|`/signin`|Mocked in the prototype; wired to a backend at launch.|
|Workspaces|MVP|Topbar, Settings|One user can belong to several workspaces. Each workspace scopes ontologies, roles, billing, API keys.|
|Plan gating|MVP|Settings · Billing|Free / Team / Business / Enterprise. Gated by concept count, API calls, workspaces, seats, support tier.|
|SSO (SAML)|V1|Settings|Enterprise tier.|
|SCIM|V2+|Settings|Enterprise tier.|

---

## Out of scope

- **No mobile UI.** Responsive down to tablet; narrower than that is explicitly out of scope.
- **No email digests.** Activity lives in-product.
- **No chat / video inside the product.** Use Slack / Teams integrations via webhooks.
- **No scheduled exports.** Use the API + your own cron.
- **No billing self-service for Enterprise.** Those contracts are human-signed.