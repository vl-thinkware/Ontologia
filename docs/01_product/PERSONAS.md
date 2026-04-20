# Personas

Three primary personas drive v1.0. They are intentionally narrow; secondary personas (CIO sponsor, compliance officer, LLM ops engineer) are acknowledged but not optimised for until v2.

---

## Persona A — Alex, the Knowledge Architect (primary)

**Role titles.** Data Architect, Knowledge Engineer, Ontology Engineer, Information Architect.

**Company & seniority.** Mid-market to enterprise; 5–12 years of experience; often reports into the Head of Data or Chief Data Officer.

**Day-to-day tools.** Neo4j Browser, draw.io, Confluence, dbt, Jupyter, Git, sometimes Protégé.

**Technical profile.**
- Comfortable with graph concepts, Cypher, SPARQL basics.
- Reads OWL/SKOS spec sheets without crying.
- Codes occasionally (Python, SQL, sometimes Java).

**Goals.**
- Maintain a coherent, evolving model of the business's conceptual world.
- Provide stable references to downstream consumers (BI, RAG, search).
- Prove that changes are intentional, reviewed and reversible.

**Frustrations.**
- Existing tools are either academic and ugly (Protégé) or generic and unstructured (Miro, draw.io).
- Ontologies live in five artefacts: a Confluence page, a diagram, a CSV, a notebook, and "the source of truth — actually, ask Marc".
- No native way to review changes before they land.
- Every downstream integration is a bespoke ETL.

**Core jobs-to-be-done in Ontologia.**
- Model concepts and typed relations quickly.
- Branch, commit, merge with clear history.
- Review other people's contributions before publishing.
- Publish a versioned endpoint the platform team can trust.

**What would make Alex a fan.**
- Canvas that feels as fast as Figma.
- Diffs that are correct, readable and shareable.
- A changelog she can paste into a release note.
- An API her platform peers stop complaining about.

**What would make Alex bounce.**
- A tool that bills itself as "simple" but silently loses edits.
- Any UX that conflates "draft" and "published".
- Slow canvas on > 5k nodes.

---

## Persona B — Priya, the Domain Expert (contributor)

**Role titles.** Product Manager, Business Analyst, Category Manager, Compliance Officer, Subject-Matter Expert.

**Company & seniority.** 3–10 years in the domain (retail, finance, healthcare, manufacturing).

**Day-to-day tools.** Excel / Google Sheets, Notion, Confluence, Jira, Tableau.

**Technical profile.**
- Not a developer. Doesn't write SQL, ever.
- Understands spreadsheets and org charts. Would not recognise Cypher if it bit her.

**Goals.**
- Capture and maintain domain truth ("a *discontinued* product is one that …").
- Avoid chasing the data team for every label correction.
- Be heard — have her contributions land with attribution.

**Frustrations.**
- The data team keeps "improving" taxonomies she relies on, then forgets to tell her.
- Google Sheets "maps" are brittle; Notion pages are free-form prose and can't be queried.
- She has no safe place to propose changes without breaking production.

**Core jobs-to-be-done.**
- Propose a change on a branch without fear.
- Comment on concepts in plain language.
- Approve or request changes on other people's proposals.

**What makes Priya a fan.**
- Zero Cypher. Ever.
- Clear "draft → review → published" affordances.
- Clean email digests summarising what changed.

**What makes Priya bounce.**
- Any mention of "schema" or "OWL" in the default UI.
- An onboarding that assumes she'll use the canvas like a data architect.

---

## Persona C — Paul, the Platform Engineer (integrator)

**Role titles.** Data Engineer, ML Engineer, Backend Engineer on a platform / AI team.

**Company & seniority.** 4–15 years. Owns the pipelines that ingest, enrich and serve data.

**Day-to-day tools.** Python, dbt, Airflow / Dagster, DataHub / Atlan, Snowflake / BigQuery, LangChain / LlamaIndex, Terraform.

**Technical profile.**
- Deeply technical. Favours a clean REST/GraphQL contract, versioned and documented.
- Allergic to rubber-stamped APIs that change silently.

**Goals.**
- Consume the live ontology in ETL, RAG indexing, feature engineering, search index builders.
- Subscribe to changes without polling.
- Make the ontology part of the immutable-artefact pipeline (reproducible AI).

**Frustrations.**
- Existing "source-of-truth" taxonomies live in shared drives.
- He's handed CSVs via email with no diff.
- Downstream breakage when labels silently change upstream.

**Core jobs-to-be-done.**
- Pull a versioned snapshot via REST.
- Subscribe to webhooks on merge/commit events.
- Query by Cypher (for advanced cases).

**What makes Paul a fan.**
- Stable, versioned REST API with OpenAPI.
- Predictable rate limits, idempotency keys, pagination.
- Webhook signatures (HMAC) and replay tooling.
- A Python SDK that matches the REST contract.

**What makes Paul bounce.**
- Undocumented API quirks.
- Rate limits without clear headers.
- No staging environment.

---

## Secondary personas (context)

- **Executive sponsor (CDO, VP Data).** Buys the tool. Cares about governance, auditability, vendor trust, ROI.
- **Security / compliance officer.** Reviews vendor for GDPR, SOC 2, SSO readiness.
- **LLM ops engineer.** Increasingly present in 2026. Wants the graph as a retrieval source.

## Anti-personas (not optimised for in v1)

- **OWL-DL reasoning researcher.** Our light inference won't satisfy them. Referred to Protégé.
- **Single-user hobbyist.** Free tier welcomes them, but we do not build for them.

---

Related: [PRD](PRD.md) · [User Flows](USER_FLOWS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
