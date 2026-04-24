# Personas

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)


Ontologia serves **three personas** who all sit inside the same ontology — the Data Architect designing the T-Box, the Catalogue Maintainer curating the A-Box, and the Downstream Consumer pulling it all through the API. They often coexist on a single account; a small team might have one person wearing all three hats, while a larger team will split them.

The personas below are intentionally narrow; secondary personas (executive sponsor, compliance officer, LLM ops engineer) are acknowledged but not optimised for until v2.

---

## Persona A — Alex, the Data Architect

**Role titles.** Data Architect, Knowledge Engineer, Ontologist, Information Architect, Taxonomist (senior), AI Platform Lead, Principal Data Scientist.

**Company & seniority.** Mid-market to enterprise; 5–12 years of experience; often reports into the Head of Data, Chief Data Officer, or Head of AI Platform. Occasionally a founding data engineer at a Series B+ company building their first formal model.

**Day-to-day tools.** Protégé, TopBraid, Neo4j Browser, draw.io, Confluence, dbt, Jupyter, Git, LangChain / LlamaIndex. Familiar with PoolParty and Synaptica by reputation, may have inherited one.

**Technical profile.**
- Comfortable with graph concepts, Cypher, SPARQL basics.
- Reads OWL / SKOS spec sheets without crying.
- Codes occasionally (Python, SQL, sometimes Java).

**Goals.**
- Design a coherent, evolving **T-Box** — classes, relation types, domain / range, attributes — that the rest of the team (and downstream systems) can rely on.
- Evolve the schema safely even when a dozen schemes and thousands of concepts already depend on it.
- Prove that every structural change is intentional, reviewed and reversible.

**Frustrations.**
- Existing ontology editors are either academic and ugly (Protégé) or heavy and expensive (TopBraid EDG). The taxonomy suites (PoolParty, Synaptica) don't let you model typed relations beyond SKOS `broader` / `related`.
- Schema and instances are authored in different tools (often different *jobs*), so every structural change turns into a migration project.
- No native way to review changes before they land.
- Every downstream integration is a bespoke ETL.

**Core jobs-to-be-done in Ontologia.**
- Design classes and relation types in the Schema view; get domain / range and attributes right on the first pass.
- Use Canvas (Schema mode) to think visually about the model.
- Delete and rename safely — the product refuses structural changes that would break existing concepts until the maintainer has migrated them.
- Branch, commit, merge with clear history (post-MVP).
- Review other people's contributions before publishing.
- Publish a versioned endpoint the platform team can trust.
- Export OWL / RDF / Turtle / JSON-LD for tools that expect them.

**Primary views.** Schema, Canvas (Schema mode), History, Validation panel.

**What would make Alex a fan.** A Schema view that treats classes and relation types as first-class citizens, not an afterthought. Attribute types (string / number / enum / date / reference / money) with required + localizable flags out of the box. An OWL / JSON-LD export that round-trips cleanly.

**What would make Alex bounce.** A "taxonomy" tool that hides classes, forcing her to misuse `broader` for everything. Delete-class that silently breaks downstream. Slow canvas on > 5k nodes.

---

## Persona B — Tara, the Catalogue Maintainer

**Role titles.** Taxonomist, Content Operations Lead, Category Manager, Metadata Specialist, Information Architect (content side), Data Steward, Business Glossary Owner, Product Data Specialist, Corporate Librarian.

**Company & seniority.** Mid-market to enterprise; 3–15 years; common in e-commerce, media, publishing, legal, support organisations, digital asset management, data governance, compliance. Often reports into a VP Content, VP Merchandising, Head of CX, Head of Information Management, or CDO.

**Day-to-day tools.** PoolParty, Synaptica, Smartlogic, MultiTes, Collibra, Alation, Confluence, Notion, Excel, Airtable, the CMS's built-in taxonomy editor. For many: a giant shared spreadsheet.

**Technical profile.**
- Not a developer. Comfortable with hierarchy, set theory, classification, controlled vocabularies.
- Strong opinions about **broader / narrower / related**, preferred vs alternate vs hidden labels, deprecation workflows.
- May know SKOS concepts by name even if they've never serialised RDF by hand.

**Goals.**
- Keep each ConceptScheme clean, deep and consistent — in a Cars ontology, that might be the Model catalogue plus four taxonomies (body style, fuel type, segment, geography) all living inside the same ontology and reusing the same T-Box.
- Add / rename / deprecate concepts without breaking downstream tagging.
- React quickly to the Validation panel (orphans, duplicate prefLabels, deprecated-still-referenced).

**Frustrations.**
- Spreadsheet-based taxonomies become unmaintainable past ~1,000 terms.
- Legacy tools (PoolParty, Synaptica) are powerful but expensive, heavy, and intimidating to collaborators — and they force you to own schemas separately per taxonomy.
- No affordance for "deprecated but still referenced" — renaming a term silently breaks prior content.
- Moving a concept in a tree and having downstream references follow still requires a DBA in most tools.

**Core jobs-to-be-done in Ontologia.**
- Build out each ConceptScheme using the Taxonomies tree — drag-drop to reparent, which rewrites `broader` and records a ChangeEvent.
- Maintain prefLabels, altLabels, hiddenLabels and definitions per language on every concept.
- Bulk deprecate / bulk tag via the Tables view's multi-select.
- Deprecate concepts with a reason and a `dct:isReplacedBy` pointer; watch the Validation panel for stragglers.
- Accept / reject AI suggestions (synonyms, translations, duplicates, class suggestions).
- Export clean SKOS (Turtle / RDF / JSON-LD) scoped to the scheme their downstream consumers need.

**Primary views.** Taxonomies tree (the main workspace), Tables, Concept detail, Validation panel.

**What would make Tara a fan.** A tree-native UI that feels fast even on deep schemes. Drag-drop reparenting that just works. Bulk actions that don't require a CSV round-trip. A Validation panel that tells her what to fix next. A price an order of magnitude below PoolParty.

**What would make Tara bounce.** A canvas-first UI that forces her into graph mode for a tree task. Lack of `broader` / `narrower` as first-class relation types. No SKOS export. Missing "preferred / alternate / hidden label" vocabulary.

---

## Persona C — Paul, the Downstream Consumer (Platform Engineer)

**Role titles.** Data Engineer, ML Engineer, Backend Engineer on a platform / AI team, MLOps Engineer, Integration Engineer.

**Company & seniority.** 4–15 years. Owns the pipelines that ingest, enrich and serve data and knowledge.

**Day-to-day tools.** Python, dbt, Airflow / Dagster, DataHub / Atlan, Snowflake / BigQuery, LangChain / LlamaIndex, Terraform.

**Technical profile.**
- Deeply technical. Favours a clean REST / GraphQL contract, versioned and documented.
- Allergic to rubber-stamped APIs that change silently.

**Goals.**
- Consume the live ontology in ETL, RAG indexing, feature engineering, search index builders, content pipelines.
- Subscribe to changes without polling.
- Make the source of truth part of the immutable-artefact pipeline (reproducible AI).

**Frustrations.**
- Existing "source-of-truth" taxonomies live in shared drives.
- He's handed CSVs via email with no diff.
- Downstream breakage when labels silently change upstream.
- Exports that look like SKOS but need hand-written shims to actually load.

**Core jobs-to-be-done.**
- Pull a versioned snapshot via REST, pinned to a tag.
- Explore endpoints in the **API Playground** (list-concepts, list-relations, schema, get-concept, SPARQL) with live query params (`lang`, `tag`, `format`, `scheme`); copy working cURL / fetch snippets straight into his codebase.
- Subscribe to webhooks on change / tag events (post-MVP).
- Export as JSON-LD, SKOS Turtle, OWL RDF/XML or CSV — the same format selector from the UI and the API.
- Query by simple filters (for advanced cases, eventually SPARQL / Cypher).

**Primary views.** API Playground, Export modal, Dashboard (activity feed).

**What makes Paul a fan.** Stable, versioned REST API with OpenAPI. Predictable rate limits, idempotency keys, pagination. Webhook signatures (HMAC) and replay tooling. A Python SDK that matches the REST contract. An API Playground that shortens his first integration from a day to an hour.

**What makes Paul bounce.** Undocumented API quirks. Rate limits without clear headers. No staging environment. Exports that rename `prefLabel` to `label` halfway through a release.

---

## Secondary personas (context)

- **Domain Expert / contributor** — a PM, analyst, product specialist or compliance officer who occasionally contributes a concept definition or approves a change. In v1 they're a light Tara; in Phase-3 (when reviews ship) they gain a review inbox.
- **Executive sponsor (CDO, VP Data, VP Content, Head of Legal).** Buys the tool. Cares about governance, auditability, vendor trust, ROI.
- **Security / compliance officer.** Reviews vendor for GDPR, SOC 2, SSO readiness.
- **LLM ops engineer.** Wants the concept store as a retrieval / grounding source for RAG and agents. Overlaps heavily with Paul.

## Anti-personas (not optimised for in v1)

- **OWL-DL reasoning researcher.** Our pragmatic validation won't satisfy them. Referred to Protégé or Stardog.
- **Single-user hobbyist.** Free tier welcomes them, but we do not build for them.
- **Library-science-grade thesaurus administrator** with ISO 25964 requirements. We ship SKOS, not full ISO 25964; they should stay with MultiTes / Synaptica for now.

---

## Persona → primary surface cheat-sheet

| Persona | Primary views | Typical export | Time-to-value target |
|---|---|---|---|
| Alex — Data Architect | Schema, Canvas (Schema), History | OWL RDF/XML, JSON-LD | < 30 min to a clean T-Box from Blank template |
| Tara — Catalogue Maintainer | Taxonomies tree, Tables, Concept detail | SKOS Turtle | < 10 min to first tag from a seeded starter |
| Paul — Downstream Consumer | API Playground, Export modal | JSON-LD, SKOS | < 1 hr from API key to working RAG ingestion |

All three operate on the same ontology, the same workspace tier, the same audit trail.

---

Related: [PRD](PRD.md) · [User Flows](USER_FLOWS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Go-to-market](../07_business/GO_TO_MARKET.md) · [Sales Playbook](../07_business/SALES_PLAYBOOK.md)
