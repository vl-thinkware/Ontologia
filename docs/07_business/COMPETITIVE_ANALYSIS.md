# Competitive Analysis

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)


The landscape Ontologia operates in, what distinguishes us, how we win, and where we should be humble.

> **Frame of reference.** Ontologia is an ontology editor. Our direct competition sits in two bands: the **enterprise taxonomy / ontology management** band (PoolParty, TopBraid EDG / TopQuadrant, Protégé, Graphwise, Semaphore) and the **enterprise data catalog** band (Collibra, Atlan, Alation). A third, fuzzier band — general-purpose knowledge bases (Notion, Confluence, Google Docs) — is where most small concept registries actually live today. We displace all three, but we compete head-on with the first.

---

## 1. Categories adjacent to us

1. **Ontology editors / semantic modelling tools** — Protégé, TopBraid Composer, TopBraid EDG (TopQuadrant), Graphwise (formerly Ontotext tooling), Stardog Studio.
2. **Enterprise taxonomy / thesaurus platforms** — PoolParty (PoolParty Semantic Suite), Synaptica, Smartlogic / Semaphore (Progress).
3. **Enterprise data catalog glossaries** — Collibra, Alation, Atlan, Secoda, DataHub (open source).
4. **Graph databases as infrastructure** — Neo4j, Stardog, GraphDB, AWS Neptune, TigerGraph. **Partners**, not competitors.
5. **General-purpose knowledge bases** — Confluence, Notion, Google Docs, SharePoint. Where most concept work actually starts and rots.

We partner with (4). We compete with (1)–(3). We displace (5) and, often, whichever tool in (1)–(3) the prospect inherited but finds unusable.

## 2. Competitors in depth

### 2.1 Protégé (Stanford)

- **What it is**: The reference desktop OWL editor. Free and open source.
- **Strengths**: Mature, deep OWL / DL reasoning, extensive plugin ecosystem, widely taught in academia.
- **Weaknesses**: Desktop-first (Protégé Desktop) or aging web (WebProtégé). Steep learning curve. No modern collaboration primitives. UI feels late-2000s. No commercial support. No concept of a "scheme" that can be swapped independently of the class layer.
- **Where it wins**: Academic research, DL-reasoning-heavy workloads, ontology standardisation committees.
- **Our angle**: Modern web-native UX, collaboration, change history, managed infrastructure, enterprise-grade security. First-class ConceptSchemes sitting on top of the T-Box. We are not a Protégé replacement for DL reasoning; we are for *operational* ontology work by teams.

### 2.2 TopBraid (TopQuadrant) — Composer + EDG

- **What it is**: Commercial semantic platform. TopBraid Composer (author) + TopBraid EDG (enterprise data governance).
- **Strengths**: End-to-end platform, SHACL support, strong in pharma and regulated industries, rich governance workflows.
- **Weaknesses**: Heavy, Java Swing heritage, opaque pricing (six-figure ACVs typical), long sales cycles, dated UX, steep adoption curve. Schema + instance + governance stack is powerful but demands a specialist admin.
- **Where it wins**: Large regulated enterprises with deep SHACL / RDF investments and a dedicated ontology team.
- **Our angle**: Modern UX, transparent pricing an order of magnitude below, faster time-to-value, API-first, friendly to non-PhD users, multi-taxonomy on one T-Box without three separate projects.

### 2.3 PoolParty (Semantic Web Company) — PoolParty Semantic Suite

- **What it is**: The enterprise taxonomy / thesaurus management product. Comprehensive SKOS authoring, multilingual support, text-classification integrations.
- **Strengths**: Mature SKOS, broad import/export, text extraction and auto-classification, strong in finance, pharma, government.
- **Weaknesses**: Priced at $30–80k/year entry, intimidating UX for non-specialists, server-heavy deployment model, limited modern API ergonomics. A taxonomy lives in its own project; hosting several taxonomies that share a schema is awkward.
- **Where it wins**: Large taxonomy teams with specialist taxonomists, strong multilingual needs, text-classification stacks, already-paying customers.
- **Our angle**: Tree-native UX that feels modern, one T-Box with many schemes side-by-side, SKOS round-trip rigorous enough for a PoolParty customer to migrate, **10× cheaper entry point** ($499/mo vs $2,500+/mo equivalent), workspace pricing with unlimited editors. We are not chasing PoolParty's text-extraction depth in Y1 — we steer those deals away honestly.

### 2.4 Synaptica

- **What it is**: Enterprise taxonomy / ontology / KOS (Knowledge Organization System) platform — Graphite for ontologies, KMS for taxonomies.
- **Strengths**: ISO 25964 compliance, deep thesaurus features (polyhierarchy, compound terms), library-science credibility.
- **Weaknesses**: Narrow audience, expensive, UX designed for specialists, slow release cadence.
- **Where it wins**: Corporate librarians, professional taxonomist teams, ISO 25964 mandates.
- **Our angle**: We ship SKOS, not full ISO 25964. Buyers who need 25964 stay on Synaptica; everyone else gets a faster, cheaper, modern alternative that also handles typed-relation ontology work their Synaptica instance can't.

### 2.5 Smartlogic / Semaphore (Progress)

- **What it is**: Semaphore taxonomy / classification platform, owned by Progress.
- **Strengths**: Classification and text-tagging depth, enterprise content-management integrations, SharePoint / Microsoft stack plays.
- **Weaknesses**: Enterprise-only sales, expensive, UX dated, long procurement cycles.
- **Where it wins**: Large enterprises already invested in the Progress / SharePoint stack.
- **Our angle**: Mid-market teams under the Semaphore price floor — the ones who need taxonomy management but can't justify a $100k+ contract. Same SKOS interop; fraction of the cost; API-first; ontology-layer modelling included.

### 2.6 Graphwise (formerly Ontotext tooling)

- **What it is**: Commercial stack around GraphDB and ontology/taxonomy authoring — increasingly positioned as a full knowledge-graph platform since the 2024 rebrand.
- **Strengths**: Strong RDF engine, FIBO and other standards integrations, research-grade lineage.
- **Weaknesses**: Platform pricing, steep adoption, UX that lags the product.
- **Our angle**: Lighter, API-first, priced for mid-market. We integrate rather than replace where a GraphDB engine is already in use.

### 2.7 TopQuadrant (umbrella)

- Vendor behind TopBraid; covered under 2.2.

### 2.8 Stardog

- **What it is**: Enterprise knowledge graph database with inference and virtualisation.
- **Strengths**: Query federation, logical inference, tight integration with enterprise data.
- **Weaknesses**: Primarily a database, not an authoring tool. Their Studio UX is improving but still utilitarian.
- **Our angle**: Complement — Ontologia models, Stardog (or Neo4j) operates. We export to their formats.

### 2.9 Neo4j

- **What it is**: Leading property-graph database with Aura managed service and Neo4j Browser / Bloom visualisation.
- **Strengths**: Dominant graph DB, Cypher, Aura, community.
- **Weaknesses**: Not an authoring or governance tool for schemas / ontologies / taxonomies.
- **Our angle**: Technology alliance — we run on Aura, integrate Bloom. The ontology lives in Ontologia; the instance graph can live in Neo4j downstream.

### 2.10 Collibra (Glossary module)

- **What it is**: The heavyweight data-governance platform. Glossary is one module alongside lineage, policy, stewardship.
- **Strengths**: Deep governance breadth, strong audit and lineage, enterprise references across regulated industries.
- **Weaknesses**: Entry pricing around $150k+/year, slow to deploy, glossary sits inside the data team's tool — Product, Legal and Marketing can't easily edit. Configuration-heavy.
- **Where it wins**: Large enterprises that need end-to-end data governance in one suite.
- **Our angle**: Ontologia is the upstream Collibra's glossary should consume via JSON-LD. Editable by non-data stakeholders, priced an order of magnitude below, and richer in structure.

### 2.11 Alation (Glossary module)

- **What it is**: Data catalog with a glossary module; strong in data-discovery and query workflows.
- **Strengths**: Query-log-based popularity, strong analytics-team adoption, modern UX for catalog users.
- **Weaknesses**: Glossary is catalog-shaped; non-data stakeholders rarely log in. Pricing in the $100k+ band.
- **Our angle**: Same pattern as Collibra — we're the feed, not the replacement.

### 2.12 Atlan (Glossary module)

- **What it is**: Modern data catalog with a clean UX and good glossary affordances.
- **Strengths**: Modern UX, collaboration-native, fast growth among data teams.
- **Weaknesses**: Still catalog-first; glossary is a feature, not the product. Pricing in the $60k+ band. Non-data stakeholders still bounce.
- **Our angle**: Atlan is our most likely integration partner. We position as the ontology-layer their catalog consumes — not a direct replacement.

### 2.13 Secoda, DataHub

- **What they are**: Newer / open-source data catalogs. Secoda is Notion-like; DataHub is LinkedIn-originated, open-source.
- **Strengths**: Lower entry pricing (Secoda) or free (DataHub); friendly for data-platform teams.
- **Weaknesses**: Glossaries are thin; collaboration outside the data team is weak.
- **Our angle**: Best integrations — our JSON-LD feed plugs into DataHub out of the box (and into Secoda via webhook).

### 2.14 Notion / Confluence / Google Docs / SharePoint

- **What they are**: General-purpose knowledge bases. Where most glossaries actually live today.
- **Strengths**: Ubiquity, ease, collaboration primitives.
- **Weaknesses**: Unstructured text; no model enforcement; no diff beyond page-level; no API a catalog can consume; definitions rot.
- **Our angle**: The glossary starts here, then outgrows it when consistency and API access matter. Our onboarding has a one-click importer that parses a Notion / Confluence glossary page into concepts.

### 2.15 Build-internally

- **What it is**: An in-house editor and store.
- **Strengths**: Perfect fit for their needs.
- **Weaknesses**: Ownership cost of ~2 engineers forever. UX will drift behind the market.
- **Our angle**: Buy the platform, invest in your concepts.

### 2.16 LLM-only approach

- **What it is**: "Just ask the LLM to extract the ontology from our docs."
- **Strengths**: Zero setup, fast demos.
- **Weaknesses**: Drift, no governance, no versioning, no human-in-the-loop, no explainability.
- **Our angle**: LLMs are great assistants (we use them in our AI suggestions panel). Concepts are the source of truth agents need to stay sane.

## 3. Strategic map

```
                       Modelling depth →
         +-------------+-------------+---------------------+
  Modern |             | Ontologia   |                     |
  UX     |             | (sweet spot)|                     |
  ↑      +-------------+-------------+---------------------+
         | Notion /    | Atlan /     | TopBraid EDG /      |
         | Confluence  | Collibra /  | PoolParty /         |
  ←      | spreadsheet | Alation     | Graphwise / Protégé |
         +-------------+-------------+---------------------+
```

Sweet spot: modern web UX, typed-graph depth, multi-scheme-per-ontology capability. TopBraid EDG lives in the deep-modelling corner but carries desktop-era UX and a six-figure price tag; Collibra / Atlan / Alation live in the middle band but as catalog-shaped glossaries; the bottom-left is where most work actually happens today.

## 4. Feature comparison

| Capability | Protégé | TopBraid EDG | PoolParty | Graphwise | Collibra / Atlan / Alation | **Ontologia** |
|---|---|---|---|---|---|---|
| Web-native UX | Partial | Partial | ✓ (dated) | ✓ (dated) | ✓ | ✓ (modern) |
| Typed classes + relation types (T-Box) | ✓ | ✓ | Partial (SKOS-centric) | ✓ | Partial | ✓ |
| Many schemes on one shared T-Box | Via project structure | ✓ (heavy) | Awkward (one project per taxonomy) | ✓ (heavy) | — | ✓ (native) |
| SKOS round-trip | ✓ | ✓ | ✓ | ✓ | Partial | ✓ |
| OWL / RDF / Turtle export | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| JSON-LD export | Partial | ✓ | ✓ | ✓ | Partial | ✓ |
| Change history / revert / tags | Plugin-dependent | ✓ | Partial | Partial | ✓ | ✓ |
| Tag-to-tag diff | — | Partial | — | — | Partial | ✓ |
| Drag-drop reparent with relation rewrite | — | Partial | ✓ | Partial | — | ✓ |
| Bulk deprecate + replacement pointer | Plugin | ✓ | ✓ | ✓ | Partial | ✓ |
| Validation panel (orphans, duplicates, cycles, D/R violations) | Plugin | ✓ | ✓ | ✓ | Partial | ✓ |
| Live presence + notifications | — | Basic | Basic | Basic | ✓ | ✓ |
| API-first (full coverage, OpenAPI 3.1) | Partial | ✓ | ✓ | ✓ | ✓ | ✓ |
| API Playground in-app | — | — | — | — | — | ✓ |
| SSO / SCIM / audit | Partial | ✓ | ✓ | ✓ | ✓ | ✓ (Business+) |
| AI suggestions (synonyms, translations, dup detection) | — | Partial | ✓ | Partial | Partial | ✓ |
| Price transparency | Free | Hidden | Hidden | Hidden | Hidden | Public |
| Entry price | Free | ~$100k+/yr | $30–80k/yr entry | Custom | $60k–$150k+/yr | Free / $499/mo |

## 5. Pricing & GTM comparison

| Vendor | Entry | Enterprise |
|---|---|---|
| Protégé | Free | — |
| TopBraid EDG / TopQuadrant | — | $100k+/yr typical |
| Neo4j Aura | $65/mo | Custom |
| Stardog | $0 dev | Custom |
| PoolParty Semantic Suite | — | $30–80k/yr entry |
| Synaptica | — | $40k+/yr |
| Smartlogic / Semaphore | — | $60k+/yr |
| Graphwise | — | Custom |
| Collibra | — | $150k+/yr typical |
| Alation | — | $100k+/yr |
| Atlan | — | $60k+/yr |
| **Ontologia** | Free, $499/mo, $1,990/mo | $40k+/yr |

We are intentionally priced for the mid-market band that the incumbents leave unattended. The same workspace tier scales from three classes and one scheme to a hundred classes and a dozen schemes.

## 6. Win themes

1. **One T-Box, many taxonomies.** Nobody else makes this easy in a modern UX. In the Cars demo, the prospect watches us toggle between Model catalogue 2026, Body style taxonomy, Fuel type taxonomy, Market segments and Manufacturing geography — all living on one schema — in ten seconds.
2. **Modern web UX.** The canvas is Figma-fast. The Schema view respects the discipline. The Taxonomies tree drags and drops like a Notion outline. None of the incumbents feel like this.
3. **Versioning that's pragmatic.** Change events, revert, tags, tag-to-tag diff in MVP; branches and reviews pre-designed for S1 / S2. Honest about what's shipped.
4. **API-first with an in-app Playground.** Any feature in the UI exists in the API, and the API Playground shortens first-integration from a day to an hour.
5. **Transparency.** Public pricing, public trust center, public changelog.
6. **Openness.** Exports are first-class in every relevant standard; we win customers who fear lock-in.
7. **Practical AI.** Per-concept suggestions that respect privacy and never train on customer data.

## 7. Risk themes (where we must stay humble)

- **DL reasoning depth**: we don't compete with Protégé on complex OWL reasoning. We offer pragmatic validation, not HermiT.
- **Governance breadth**: Collibra-class governance (policies, stewardship workflows, lineage) is broader than our scope. We integrate rather than replicate.
- **Text classification**: PoolParty's Extractor / Smartlogic's classifier are specialist products. We don't compete there in Y1.
- **Academic credibility**: we're new. Build trust via open-source examples, conference talks, and peer-reviewed blog posts.
- **Enterprise sales muscle**: incumbents have deep enterprise relationships. We win by being better *and* cheaper at the same time, and by winning champions first.

## 8. Competitive intelligence process

- Battlecards maintained monthly in the sales enablement space.
- Win/loss interviews every 10 deals.
- Public presence monitoring (G2, Reddit, conferences, LinkedIn).
- Quarterly competitor deep-dive presented to the team.

## 9. Partner, not compete

Several "competitors" are better treated as partners:

- **Neo4j, Stardog, GraphDB, AWS Neptune**: infrastructure alliances.
- **Collibra, Atlan, Alation, DataHub**: integration partners. Their customers are our prospects and vice versa.
- **SI / consultancies**: referral and implementation partners. Especially meaningful in regulated industries.

## 10. Anti-competition pledge

- We will not misrepresent a competitor's capabilities.
- Our comparison content must cite sources and include genuine strengths of the other vendor.
- We do not enforce exclusivity deals that restrict customers from evaluating alternatives.
- If we lose a deal, we congratulate the winner honestly and keep the door open.

## 11. Long-term category vision

The "concept infrastructure for AI and content" category is currently unnamed and split across three analyst buckets (data governance for glossary, knowledge-graph tools for ontology, taxonomy management for SKOS). Our job is to collapse those buckets by shipping a product where the answer to "which one do you need?" is "yes, all of them, in the same ontology" — and where the buyer, whatever their starting vocabulary, sees Ontologia as the reference implementation.

Related: [Business Strategy](BUSINESS_STRATEGY.md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Pricing Model](../08_finance/PRICING_MODEL.md)
