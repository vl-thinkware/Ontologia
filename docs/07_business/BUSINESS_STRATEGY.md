# Business Strategy

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

Why we believe Ontologia can become the default place where teams design, track and govern their ontologies — and the bootstrap plan to get there without outside funding.

---

## 1. The bet

Every medium-to-large organisation maintains *implicit* ontologies — in spreadsheets, Confluence pages, data catalogues, MDM systems, email threads. These ontologies drift, conflict and rot, and nobody owns them end-to-end. The rise of AI systems that consume structured knowledge (RAG, agents, copilots) suddenly makes this sprawl expensive: bad ontology = bad retrieval = bad answers.

The bet: a dedicated, opinionated tool that makes ontology work *collaborative, visual, and tracked* — the way Notion did for docs and Figma for design — will win this category. Incumbents either sit in desktop-era tooling (Protégé, TopBraid) or demand six-figure enterprise deals before the first user has tried the product (Collibra, Atlan, PoolParty).

## 2. Mission, vision, principles

- **Mission**: give teams a place to design and operate the living knowledge models their products rely on.
- **Vision (5 years)**: the default collaborative ontology platform for mid-market and enterprise. Thousands of orgs with an Ontologia workspace.
- **Principles**:
  - Ontology work is collaborative, iterative, and auditable.
  - Lock-in is bad for customers and bad for us — export and import are first-class.
  - The graph is the product; UX is the reason people use it.
  - **Default-alive, founder-controlled.** We optimise for profitability and independence, not for headline growth.
  - Enterprise-ready when the enterprise pays; not before.

## 3. Category positioning

| Category | Example players | Where they fall short | Our angle |
|---|---|---|---|
| Ontology editors | Protégé, TopBraid, PoolParty | Desktop, steep learning curve, or €20–150k/yr enterprise-only | Web-native, workspace-priced, single-taxonomist-friendly |
| Data catalogues | Collibra, Atlan, Alation | Discover & govern existing data, not design new ontologies | Complementary — design upstream, export downstream |
| Graph DB vendors | Neo4j, Stardog, AWS Neptune | Infra, not authoring | We sit on top of them |
| Note / doc tools | Notion, Confluence | Free text, no structure enforcement | We provide structure with ease |
| Diagram tools | Lucid, Miro, Whimsical | Pretty but not model-backed | Our diagrams *are* the model |

Our category pitch: **"Collaborative ontology platform."** Short term we educate the market; long term we own the term.

## 4. Ideal customer profile (ICP)

### Primary ICP — lean AI / data teams at mid-market companies
- 100–2,000 employees.
- Building RAG / agents / copilots that must answer questions about the company.
- One or two knowledge architects carrying the load; no budget for a Collibra rollout.
- Buyer: Head of Data, Head of AI, or a technical founder.
- Users: a taxonomist, a data scientist, a product manager.

This is where the bootstrap motion actually closes deals. One champion, one workspace, quick decision.

### Secondary ICP — regulated industries with small ontology teams
- Healthcare, pharma, life sciences, public sector.
- Compliance-driven versioning, traceability, cross-team alignment.
- Start as Team or Business; grow to Enterprise once procurement is ready.

### Tertiary ICP — SaaS platforms with domain APIs
- Companies whose product *is* a set of entities and relationships (CRMs, ERPs, insurance, logistics).
- They want to expose their own domain model to customers and integrators.

### Non-ICP (for now)
- Fortune 100 RFPs with multi-year procurement cycles — we'll be there in three years, not now.
- Unregulated SMBs with no explicit model needs.

## 5. Value proposition

Three intertwined outcomes:

1. **Clarity.** One place where the organisation's vocabulary is owned and evolved.
2. **Speed.** Changes ship faster — a visual canvas replaces long email threads.
3. **Trust.** Every change is attributable, timestamped, revertible, and exportable.

The features (canvas, change history, revert, tags, API) are the means, not the message. The business story is always in terms of the three outcomes.

## 6. Competitive moats

| Moat | How we build it |
|---|---|
| UX | Relentless polish of the canvas and change history; beat desktop-era tools on every dimension |
| Positive lock-in | Change history and audit log become the org's knowledge memory — hard to give up |
| Integrations | API, webhooks, import/export formats so we become the hub |
| Community and OSS | Ontology importer library, public ontology templates, Discord |
| Brand trust | Honest pricing, honest compliance roadmap, no dark patterns |
| Agent ecosystem (C2, C5) | MCP server + AI suggestions make Ontologia the canonical source agents look up |
| **Founder speed** | Two decision-makers ship faster than a 50-person product org |

None is alone enough. Combined they raise switching cost without hurting the customer.

## 7. Strategic goals — 12 months (bootstrap edition)

| Goal | Metric | Target |
|---|---|---|
| First paying customers | MRR | 15–25 paying logos; $10k–$15k MRR end of year 1 |
| Default-alive | Monthly net cash | Positive from month 9 |
| Product–market signal | Activation, NRR | ≥ 35% free-to-team activation; ≥ 100% NRR on paid |
| First Enterprise pilot | ARR | 1–2 Enterprise logos (paid pilots or deals >$40k) |
| Compliance-on-demand | SOC 2 | Roadmap public; audit triggered by first customer that pays for it |
| Team | Founders + 0–1 hire | Both founders able to draw a token salary |

## 8. Strategic goals — 3 years

- $1.2M–$1.8M ARR.
- Profitable on a cash basis. No external fundraise unless strategically opportunistic.
- 120–180 paying customers.
- SOC 2 Type II if customer demand justifies it.
- Core team of 3–5 people.
- Active community and a healthy OSS presence.

These are deliberately modest versus a VC-backed playbook. Hitting them means we have a durable business that we own and control.

## 9. Strategic risks & responses

| Risk | Mitigation |
|---|---|
| A hyperscaler launches "Cloud Ontology Studio" | UX gap, neutrality (multi-cloud), portability; community; two-founder speed of iteration |
| Incumbents cut prices | Our bootstrap cost base means we can survive a price war better than VC-burners can |
| Bootstrap slowness costs us the category window | Focus on a narrow wedge (mid-market, single-taxonomist) where we move faster than anyone |
| AI changes the shape of the need | Embrace agents (C2, C5) as first-class; ontology becomes agent memory |
| Enterprise procurement cycles too long | Business tier acts as the bridge; pilots are paid; no prospect gets more than 4 founder-weeks without a signature |
| Founder capacity | Work-life guardrails (one week off per quarter); automate everything; contractors for non-core work |
| Key-person risk (2 founders) | Cross-training, docs (this repo), operational runbooks |

## 10. Capital strategy

- **Year 0**: zero external capital. Founders carry personal runway.
- **Year 1**: revenue-funded from month 6–9. No fundraising.
- **Year 2**: cash-generative. Retained earnings fund everything.
- **Year 3**: first optional fundraise only if (a) a specific distribution partnership demands speed or (b) we can see a 10x acceleration the cash would unlock.
- **Default answer to all funding offers**: no.

Why: outside capital would force a growth curve and cost structure that are incompatible with the product we want to build.

## 11. Build vs buy vs partner

| Function | Stance |
|---|---|
| Auth | Buy (Clerk) |
| Billing | Buy (Stripe) |
| Email | Buy (Resend) |
| Observability | Buy (Grafana Cloud, Sentry) |
| CRM | Buy (HubSpot free tier; Attio later) |
| Knowledge graph DB | Buy managed (Neo4j Aura) with abstraction to swap later |
| LLM | Partner (OpenAI / Anthropic) with adapter to add open-weight models later |
| Domain integrations | Partner + open-source adapters |

We do not reinvent commodities. We invest every hour of founder time in the ontology authoring experience and the graph plumbing that customers cannot replicate.

## 12. Pricing strategy (executive summary)

Detail in [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md). Summary:

- **Free** forever for individuals and open-source communities (bounded at 500 concepts / 5k API calls).
- **Team** at $499/mo (or $4,990/yr) — the primary SMB price point.
- **Business** at $1,990/mo (or $19,900/yr) — mid-market with SSO, SCIM, unlimited workspaces.
- **Enterprise** from $40,000/yr — dedicated infra, BYOK, SLA.

Value metric: **workspace + volume** (concepts and API calls). Deliberately not per-seat: one taxonomist can deliver most of the value, and we refuse to penalise that customer.

## 13. Operating model

- Remote, async by default, 2 synchronous syncs per week between founders (Monday plan, Friday review).
- Document-driven decisions (RFCs, ADRs in `docs/`), not meeting-driven.
- Weekly shipping cadence.
- Monthly financial and strategic review (45 min).
- Quarterly strategy checkpoint with external advisor if we have one.
- Customers as co-builders — the first 10 paying customers get direct founder attention in exchange for honest feedback and case studies.

## 14. North-star metrics

- **NSM**: Active weekly workspaces (workspaces with at least one change in a 7-day window).
- Supporting metrics: ontologies per org, concepts authored per week, API usage, churn by plan, Free-to-Team conversion, Team-to-Business upgrade rate.

## 15. Culture as strategy

Even as a two-person team we intentionally build a culture that scales later.

The team (and any future hire) attracts and retains the best if Ontologia is seen as:
- Technically excellent (deep engineering + design).
- Operated ethically (honest pricing, transparent compliance, no manipulative growth hacks).
- A place where one can do the best work of their career.

We refuse practices that trade long-term reputation for short-term gain: dark UX, manipulative pricing, misleading AI claims, aggressive sales discounting that trains customers to wait for the next deal.

## 16. 3-year financial shape

See [FINANCIAL_PROJECTIONS.md](../08_finance/FINANCIAL_PROJECTIONS.md). Headline: bottom-up plan reaches ~$1.5M ARR by end of year 3 with gross margin of 82–85% and blended CAC under $1,200, funding both founders at market salary and one or two additional team members.

---

Related: [Go-to-Market](GO_TO_MARKET.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Financial Projections](../08_finance/FINANCIAL_PROJECTIONS.md) · [Vision](../00_overview/VISION.md) · [Hiring Plan](../09_team/HIRING_PLAN.md)
