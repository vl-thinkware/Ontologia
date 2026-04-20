# Business Strategy

Why we believe Ontologia can become the default place where enterprise knowledge graphs are designed, reviewed and governed — and the plan to get there.

---

## 1. The bet

Every medium-to-large organisation maintains *implicit* ontologies — in spreadsheets, Confluence pages, data catalogues, MDM systems, email threads. These ontologies drift, conflict and rot, and nobody owns them end-to-end. The rise of AI systems that consume structured knowledge (RAG, agents, copilots) suddenly makes this sprawl expensive: bad ontology = bad retrieval = bad answers.

The bet: a dedicated, opinionated tool that treats ontologies like source code — with branches, diffs, reviews, merges — will win this category, much like Figma won design, Notion won docs, and GitHub won code.

## 2. Mission, vision, principles

- **Mission**: give teams a place to design and operate the living knowledge models their products rely on.
- **Vision (5 years)**: every Fortune 1000 has an Ontologia workspace the same way they have a GitHub org.
- **Principles**:
  - Ontology work is collaborative, iterative, and auditable.
  - Lock-in is bad for customers and is bad for us — export and import are first-class.
  - The graph is the product; UX is the reason people use it.
  - Enterprise-ready from day one, even if we sell to teams first.

## 3. Category positioning

| Category | Example players | Where they fall short | Our angle |
|---|---|---|---|
| Ontology editors | Protégé, TopBraid | Desktop, steep learning curve, no collaboration | Web-native, Figma-like UX |
| Data catalogues | Collibra, Atlan, Alation | Discover & govern existing data, not design new ontologies | We complement — design upstream, export downstream |
| Graph DB vendors | Neo4j, Stardog, AWS Neptune | Infra, not authoring | We sit on top of them |
| Note / doc tools | Notion, Confluence | Free text, no structure enforcement | We provide structure with ease |
| Diagram tools | Lucid, Miro, Whimsical | Pretty but not model-backed | Our diagrams *are* the model |
| General IDE (Cursor) | — | Not made for domain experts | We lower the bar for non-dev |

Our category pitch: **"Collaborative ontology platform."** Short term we educate the market; long term we own the term.

## 4. Ideal customer profile (ICP)

### Primary ICP — enterprise AI / data teams
- 500–10k employees.
- Building RAG / agents / copilots that must answer questions about the company.
- Already invested in a data catalogue, feeling its limits.
- Pain: inconsistent vocabularies across teams; AI hallucinations traced to missing ontology.
- Buyer: Chief Data Officer, Head of AI, Director of Knowledge Engineering.
- Users: knowledge architects, domain experts, data scientists.

### Secondary ICP — regulated industries with domain models
- Healthcare (SNOMED CT, ICD, internal terminologies).
- Pharma (MedDRA, lab ontology).
- Life sciences and academia.
- Public sector (open data, metadata standards).
- Pain: compliance-driven versioning, traceability, cross-team alignment.

### Tertiary ICP — SaaS platforms with domain APIs
- Companies whose product *is* a set of entities and relationships (CRMs, ERPs, insurance, logistics).
- They want to expose their own domain model to customers and integrators.
- Pain: every partner receives a different version of the schema.

### Non-ICP (for now)
- Single-user hobbyists (supported by the free plan, not pursued).
- Unregulated SMBs with no explicit model needs.

## 5. Value proposition

We sell three intertwined outcomes:

1. **Clarity.** One place where the organisation's vocabulary is owned and evolved.
2. **Speed.** Changes ship faster — branches + review replace long email threads.
3. **Trust.** Every change is attributable, reviewable, revertible, and exportable.

The underlying **features** (canvas, diff, merge, reviews, API) are the means, not the message. The business story is always in terms of the three outcomes.

## 6. Competitive moats

| Moat | How we build it |
|---|---|
| UX | Relentless polish of canvas + diff; beat desktop-era tools on every dimension |
| Workflow lock-in (positive) | Review process, branches, audit log become the org's history — hard to give up |
| Integrations | API, webhooks, import/export formats so we become the hub |
| Community | Public ontology library, contributor program, certifications |
| Brand trust | Security posture, SOC 2, transparent pricing |
| Agent ecosystem (C2, C3) | When agents need a ground-truth ontology, we're the canonical place |

None are alone enough. Combined they raise switching cost without hurting the customer.

## 7. Strategic goals — 12 months

| Goal | Metric | Target |
|---|---|---|
| Product–market fit in our primary ICP | Retention, NPS, expansion | 100 paying orgs; GRR ≥ 90%; NPS ≥ 40 |
| Revenue foundation | ARR | $1–2M ARR |
| Operational maturity | SLA attainment, SOC 2 Type I | 99.5% met; audit report in hand |
| Design partner references | Case studies | 5 public, 10 referenceable |
| Geographic coverage | EU region GA | Available by end of year |

## 8. Strategic goals — 3 years

- $15–25M ARR.
- SOC 2 Type II + ISO 27001 in progress.
- 300+ enterprise customers, half outside the US.
- Two strategic ecosystem partnerships (one cloud, one SI).
- Self-serve motion generating ≥ 30% of new ARR.

## 9. Strategic risks & responses

| Risk | Mitigation |
|---|---|
| A hyperscaler launches "Cloud Ontology Studio" | UX gap, neutrality (multi-cloud), portability; community; speed of iteration |
| Data catalogue vendors add an ontology module | Depth and UX beat breadth; integrations make us complementary; partner rather than fight |
| AI changes the shape of the need | We embrace agents (C2, C3) as first-class customers; our ontology becomes their memory |
| Enterprise procurement cycles are long | Self-serve and prosumer tier to build pipeline; design-partner pricing to shorten |
| Talent concentration | Remote-first hiring, strong docs, pay at market median (equity-heavy early) |

## 10. Funding & capital strategy

- **Pre-seed / seed**: already planned; 18–24 months runway through GA + early enterprise.
- **Series A**: unlock once ARR trends above $1.5M with healthy retention. Use proceeds to hire sales, CS, security, and international coverage.
- **Series B**: only when the self-serve and enterprise motions are both proven at scale.
- **Capital discipline**: default-alive mindset; revenue covers operating costs before heavy burn.

## 11. Build vs buy vs partner

| Function | Stance |
|---|---|
| Auth | Buy (Clerk) |
| Billing | Buy (Stripe) |
| Email | Buy (Resend) |
| Observability | Buy (Grafana Cloud, Sentry) |
| CRM | Buy (HubSpot initially) |
| Knowledge graph DB | Buy managed (Neo4j Aura) with abstraction to swap later |
| LLM | Partner (OpenAI / Anthropic / open models) with ability to self-host |
| Domain integrations | Partner + build adapters |

We don't reinvent commodities. We invest ruthlessly in the ontology authoring experience and the graph plumbing that customers cannot replicate.

## 12. Pricing strategy (executive summary)

Detail in [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md). Summary:

- Free forever for individual learners and open-source communities (bounded).
- Starter team ($15 / editor / month) to capture prosumers and small teams.
- Pro ($49 / editor / month) for the primary ICP teams.
- Enterprise (custom, starting $40k / year) for regulated and scale customers.

Value metric: **active editor seats**, with sensible guardrails on objects and API usage. We reject pure consumption pricing early on because it confuses buyers and discourages usage.

## 13. Operating model

- Remote-first, async by default, 3 synchronous meetings per week max.
- Small, senior team until ~$3M ARR. Hire generalists, then specialists.
- Weekly shipping cadence, monthly review of metrics, quarterly strategy checkpoint.
- Document-driven decisions (RFCs), not meeting-driven.
- Customers as co-builders — design partners in the first 12 months get bespoke attention in exchange for honest feedback.

## 14. North-star metrics

- **NSM**: Active editor weeks (editors who committed at least once in a 7-day window).
- Supporting metrics: ontologies per org; commits per week; review cycle time; reviewer participation; API usage; churn by segment.

## 15. Culture as strategy

The team attracts and retains the best if Ontologia is seen as:
- Technically excellent (deep engineering + design).
- Operated ethically (security, privacy, honesty about limits).
- A place people can do the best work of their career.

We refuse practices that trade long-term reputation for short-term gain: dark UX, manipulative pricing, misleading AI claims.

## 16. 3-year financial shape (aspirational)

See [FINANCIAL_PROJECTIONS.md](../08_finance/FINANCIAL_PROJECTIONS.md). Headline: bottom-up plan reaches ~$15–20M ARR in three years with gross margin of 78–82% and efficient CAC under $15k for mid-market.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Financial Projections](../08_finance/FINANCIAL_PROJECTIONS.md) · [Vision](../00_overview/VISION.md)
