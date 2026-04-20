# Competitive Analysis

The landscape Ontologia operates in, what distinguishes us, how we win, and where we should be humble.

---

## 1. Categories adjacent to us

Ontologia straddles four categories. None is a perfect fit, which is both opportunity and challenge.

1. **Ontology editors / semantic modelling tools** (Protégé, TopBraid, PoolParty, Semaphore).
2. **Graph databases & semantic stacks** (Neo4j, Stardog, GraphDB, AWS Neptune, TigerGraph).
3. **Data catalogues / governance** (Collibra, Atlan, Alation, Secoda, DataHub).
4. **Knowledge / docs / diagram tools** (Notion, Confluence, Lucid, Miro, Whimsical).

We *use* (3)-(4) for inspiration on UX and (2) for infrastructure. We *compete with* (1) for category ownership. We *partner with* (2) and (3) where appropriate.

## 2. Competitors in depth

### 2.1 Protégé (Stanford)

- **What it is**: The reference desktop OWL editor. Free and open source.
- **Strengths**: Mature, deep OWL/DL reasoning, extensive plugin ecosystem, widely taught in academia.
- **Weaknesses**: Desktop-first (Protégé Desktop) or aging web (WebProtégé). Steep learning curve. No modern collaboration primitives. UI feels late-2000s. No commercial support.
- **Where it wins**: Academic research, taxonomy standardisation committees, DL reasoning-heavy workloads.
- **Our angle**: Modern web-native UX, collaboration, branching/review, managed infrastructure, enterprise-grade security. We are not a Protégé replacement for DL reasoning; we are for *operational* ontology work by teams.

### 2.2 TopBraid (TopQuadrant)

- **What it is**: Commercial semantic platform. TopBraid Composer (author) + TopBraid EDG (enterprise data governance).
- **Strengths**: End-to-end platform, SHACL support, mature in pharma and regulated industries.
- **Weaknesses**: Heavy, Java Swing heritage, opaque pricing, long sales cycles, dated UX, steep adoption curve.
- **Where it wins**: Large regulated enterprises with deep SHACL / RDF investments.
- **Our angle**: Modern UX, transparent pricing, faster time-to-value, API-first, friendly to non-semantic-PhD users.

### 2.3 PoolParty / Semaphore (Smartlogic)

- **What it is**: Commercial taxonomy / thesaurus management products.
- **Strengths**: Strong for taxonomy / SKOS, enterprise search alignment, AI-text classification integrations.
- **Weaknesses**: Narrower than a general ontology tool, expensive, less open.
- **Our angle**: Broader domain (ontology, not just taxonomy), modern collaboration, developer-friendly API, lower entry price.

### 2.4 Stardog

- **What it is**: Enterprise knowledge graph database with inference and virtualisation.
- **Strengths**: Query federation, logical inference, tight integration with enterprise data.
- **Weaknesses**: Primarily a database, not an authoring tool. Their Studio UX is improving but still utilitarian.
- **Our angle**: Complement — Ontologia models, Stardog (or Neo4j) operates. We export to their formats.

### 2.5 Neo4j

- **What it is**: Leading property-graph database with Aura managed service and Neo4j Browser / Bloom visualisation.
- **Strengths**: Dominant graph DB, Cypher, Aura, community.
- **Weaknesses**: Not an authoring or governance tool for schemas / ontologies.
- **Our angle**: Technology alliance — we run on Aura, export Cypher, integrate Bloom. The ontology lives in Ontologia; the instance graph lives in Neo4j.

### 2.6 AWS Neptune, Azure Cosmos DB (Gremlin), GCP

- Cloud-native graph / multi-model databases.
- Infrastructure plays. We integrate as export targets and are cloud-neutral.

### 2.7 Collibra / Atlan / Alation / Secoda / DataHub

- **What they are**: Data catalogues. Surface the data you already have.
- **Strengths**: Discoverability, lineage, governance, data stewardship workflows.
- **Weaknesses**: Schemas and taxonomies are a subset of features. Not built to author rich ontologies.
- **Our angle**: Complement — they catalogue tables; we model concepts. We integrate bi-directionally; catalogue customers often find they need an upstream design tool.

### 2.8 Notion / Confluence

- **What they are**: General-purpose knowledge bases.
- **Strengths**: Ubiquity, ease, collaboration primitives.
- **Weaknesses**: Unstructured text; no model enforcement; no diff beyond page-level.
- **Our angle**: The team starts here, then outgrows it when consistency and API access matter.

### 2.9 Lucid / Miro / Whimsical

- **What they are**: Diagram-first collaboration tools.
- **Strengths**: Beautiful, fast, collaborative.
- **Weaknesses**: Diagrams aren't models; they don't power APIs, AI, or exports.
- **Our angle**: Our canvas is as fast *and* backed by a typed graph.

### 2.10 Build-internally

- **What it is**: An in-house editor and store.
- **Strengths**: Perfect fit for their needs.
- **Weaknesses**: Ownership cost of ~2 engineers forever. UX will drift behind the market.
- **Our angle**: Buy the platform, invest in your ontology.

### 2.11 LLM-only approach

- **What it is**: "Just ask the LLM to extract the ontology from our docs."
- **Strengths**: Zero setup, fast demos.
- **Weaknesses**: Drift, no governance, no versioning, no human-in-the-loop, no explainability.
- **Our angle**: LLMs are great assistants; ontologies are the source of truth agents need to stay sane.

## 3. Strategic map

```
                  Modelling depth →
        +---------+--------+-----------+
        |         | Stardog| TopBraid  |
        | Ontolog.| Neptune| Protégé   |
   Team +---------+--------+-----------+
   collab|        |        |           |
     ←   | Notion | Atlan  |   ...     |
        +---------+--------+-----------+

```

Sweet spot: high collaboration, high modelling depth. Few players live in that corner, and the ones that try (TopBraid EDG) are heavy and expensive.

## 4. Feature comparison (summary)

| Capability | Protégé | TopBraid | Neo4j | Atlan | **Ontologia** |
|---|---|---|---|---|---|
| Web-native | Partial | Partial | — | ✓ | ✓ |
| Real-time collab | — | Basic | — | Basic | ✓ |
| Branches & diffs | — | Partial | — | — | ✓ |
| Reviews & approvals | — | Custom | — | Custom | ✓ |
| JSON-LD / OWL / SKOS import/export | ✓ | ✓ | Partial | Partial | ✓ |
| Neo4j / RDF export | ✓ | ✓ | Native | Partial | ✓ |
| API / SDK | ✓ | ✓ | ✓ | ✓ | ✓ |
| SSO / SCIM / audit | Partial | ✓ | ✓ | ✓ | ✓ |
| AI suggestions | — | Partial | — | ✓ | ✓ (opt-in) |
| Price transparency | Free | Hidden | Public | Hidden | Public |

## 5. Pricing & GTM comparison

| Vendor | Entry | Enterprise |
|---|---|---|
| Protégé | Free | — |
| TopBraid | — | $100k+/yr typical |
| Neo4j Aura | $65/mo | Custom |
| Stardog | $0 dev | Custom |
| Collibra | — | $150k+/yr typical |
| Atlan | — | $100k+/yr |
| **Ontologia** | Free, $15, $49, Custom | $40k+/yr |

We are intentionally priced for the mid-market band that the incumbents leave unattended.

## 6. Win themes

1. **UX**: measurably faster, prettier, and more joyful than anything in the category.
2. **Git-for-ontology**: branches, diff, merge, review — this is our signature capability.
3. **API-first**: any feature in the UI exists in the API. Developers love us.
4. **Transparency**: public pricing, public trust center, public changelog.
5. **Openness**: exports are first-class; we win customers who fear lock-in.
6. **Modern security posture**: SOC 2, EU residency, fast security-review turnaround.
7. **Practical AI**: opt-in assistance that respects privacy and never trains on customer data.

## 7. Risk themes (where we must stay humble)

- **DL reasoning depth**: we don't compete with Protégé on complex OWL reasoning. We offer pragmatic validation, not HermiT.
- **Governance breadth**: Collibra-class governance (policies, stewardship workflows) is broader than our scope. We integrate rather than replicate.
- **Academic credibility**: we're new. Build trust via open-source examples, conference talks, and peer-reviewed blog posts.
- **Enterprise sales muscle**: incumbents have deep enterprise relationships. We win by being better *and* cheaper at the same time, and by winning champions first.

## 8. Competitive intelligence process

- Battlecards maintained monthly in the sales enablement space.
- Win/loss interviews every 10 deals.
- Public presence monitoring (G2, Reddit, conferences, LinkedIn).
- Quarterly competitor deep-dive presented to the team.

## 9. Partner, not compete

Several "competitors" are better treated as partners:

- **Neo4j, Stardog, GraphDB, Neptune**: infrastructure alliances.
- **Collibra, Atlan, Alation**: integration partners. Their customers are our prospects and vice versa.
- **SI / consultancies**: referral and implementation partners. Especially meaningful in regulated industries.

## 10. Anti-competition pledge

- We will not misrepresent a competitor's capabilities.
- Our comparison content must cite sources and include genuine strengths of the other vendor.
- We do not enforce exclusivity deals that restrict customers from evaluating alternatives.
- If we lose a deal, we congratulate the winner honestly and keep the door open.

## 11. Long-term category vision

The "collaborative ontology platform" category is currently unnamed. Our job is to define it — via analyst relations, content, and shipping — so that in five years, every buyer considering this problem searches for the category by its name and sees us as its reference implementation.

Related: [Business Strategy](BUSINESS_STRATEGY.md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Pricing Model](../08_finance/PRICING_MODEL.md)
