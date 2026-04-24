# Sales Playbook

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product) · **Last updated**: April 2026

The practical field guide for running the Ontologia sales motion with two founders. Valentin carries every deal through the first 25 paying logos; Alexandre joins for one technical call per opportunity, typically the SPARQL / JSON-LD / SKOS round-trip conversation. Written for us now, and for the first AE whenever we can afford one.

> **Operating model.** Founder-led through the first 25 paying logos. No SDR, no outbound sequencer, no discount pressure, no forecasting theatre. The CRM is a Notion database. The target is a handful of well-run deals per month, not a funnel to feed.
>
> **One product, three segments.** Ontologia is one product — an ontology editor. Every workspace artefact is an Ontology; taxonomies live as ConceptSchemes inside an ontology. The sales motion is one process. What changes is the segment we identify in discovery — **AI & data teams**, **catalogue-heavy mid-market**, or **data governance** — which shifts the vocabulary we use, the competitor benchmark we're measured against, and which parts of the demo we linger on. Same product, same price list, same demo flow.

---

## 1. Sales philosophy

- We sell outcomes, not features. The outcome is a stable source of truth for the concepts the rest of the business (AI pipelines, catalogues, data governance) depends on.
- We tell the truth about limitations — including features we've deferred (branches, reviews, merges, full OWL-DL reasoning, ISO 25964).
- We disqualify early and fast. A clean "no" is better than a long "maybe".
- We stay honest about our stage: two founders, bootstrapped, building in public, fewer than 50 paying customers.
- We treat customers like co-builders, especially in year one. Any buyer in the first 50 customers gets founder access and grandfathered pricing for 24 months.

## 2. Sales team shape

| Role | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Founder-led sales (Valentin) | 100% of deals | Still primary | Enterprise + strategic only |
| Founder technical support (Alexandre) | ~5% of his time | ~5% | ~5% |
| First commercial hire | — | Senior generalist (seller + CS) when >30 paying logos | — |
| SDR | Not planned | Not planned | Maybe, after 50 paying logos and proven outbound channel |
| Dedicated SE | — | — | Probably |
| CSM | Valentin does it | Valentin + first hire | Dedicated CSM |

Do not hire an SDR to "feed the pipeline" until founder-led outbound has produced at least 10 signed Business-tier deals. If we can't close them, an SDR won't change that.

## 3. The Ontologia sales process

```
Identify → Qualify → Discover → Demo → Pilot (optional) → Propose → Negotiate → Close → Handoff → Expand
```

Exit criteria are mandatory. Deals do not advance on optimism.

### Stage 1 — Identify
- Source: Free-tier signup showing engagement, warm intro, content engagement (commented on an article, replied on LinkedIn), inbound email.
- Account research (10 minutes max): company, industry, the named initiative, a specific article or signal we can reference.
- **Segment tag**: from the first signal, tag the deal `segment=ai-data`, `segment=catalogue`, or `segment=governance`. The tag is a hypothesis, not a commitment — we'll re-confirm it in discovery. It determines the competitor set we prepare for and which parts of the Cars demo we emphasise.
- Exit: a named contact, a segment hypothesis, and a specific hypothesis about their pain.

### Stage 2 — Qualify
- 15-minute call or an asynchronous exchange.
- BANT-lite: real budget or path to it, named buyer, concrete pain, timing this quarter or next.
- Exit: explicit yes/no to continue. If yes, discovery scheduled within 7 days.

### Stage 3 — Discover
- 30–45 minutes. Valentin leads. Deep dive into current state and desired outcome. See section 5 for the question library.
- First five minutes are segment calibration: confirm or flip the tag. A prospect who opened the conversation as "we want a taxonomy tool" often turns out to be a governance buyer once you ask which downstream systems consume it.
- Map the DMU: champion, economic buyer, technical buyer, end users, any security gatekeeper.
- Exit: a written one-paragraph summary sent within 2 hours; the buyer confirms or corrects it. If they don't respond in 5 business days, the deal is stalled and moves to "no next step".

### Stage 4 — Demo
- Always personalised. Opens with *their* vocabulary, imported live from a CSV / SKOS / OWL they sent or one we found for their domain. If we're still abstract, we fall back to the **Cars ontology** (9 classes, 13 relation types, 5 schemes) — the universal hero demo.
- 30–45 minutes with champion + 1–3 invited colleagues.
- One flow, three emphases. See section 6 for the script and the per-segment lingering points.
- Do NOT demo branches, reviews, or merges. They are deferred (see [VERSIONING_SYSTEM.md](../02_architecture/VERSIONING_SYSTEM.md)). If asked, explain why.
- Exit: clear reaction. Advance to pilot or propose, or politely disqualify.

### Stage 5 — Pilot (optional but common for Business)
- When: Business-tier deal, or a Team deal involving a compliance or security gatekeeper.
- Duration: 2–4 weeks — never 6.
- Must have: scoped success criteria in writing, named champion, commercial pre-agreed, one Valentin check-in per week.
- Exit: success criteria met and order form signed within 10 business days of pilot end, or explicit "no" with a written post-mortem.

### Stage 6 — Propose
- Standard one-page order form referencing the MSA. Offers annual (default) or 2-year (with an extra 5% off).
- Aligned to the buyer's KPI. Never a 30-slide deck.
- Exit: verbal or written commit to redline.

### Stage 7 — Negotiate
- Stay on list price unless volume or multi-year justifies otherwise.
- Trade concessions for value: multi-year, case study permission, reference call.
- Legal and security tracks run in parallel, not sequentially.
- Exit: signed order form and MSA.

### Stage 8 — Close
- Counter-signature, first invoice via Stripe (self-serve) or manual (Enterprise), welcome email from Valentin.
- Founder Slack / email channel opened with the champion.

### Stage 9 — Handoff
- In Year 1, Valentin is CS. In Year 2, a warm handoff to the first commercial hire within 24 hours of signature.
- Shared Notion page: account plan, goals, stakeholders, risks, integration context, expansion hypothesis.

### Stage 10 — Expand
- 60-day check-in, 90-day check-in. At each, ask: who else inside would benefit? What would slow that down?
- First renewal conversation starts 90 days before end of term.
- QBRs quarterly for Enterprise (when we have any), semi-annual for Business, on-demand for Team.

## 4. Qualification criteria (MEDDPICC-lite)

- **M — Metrics**: what KPI does Ontologia move? How much is it worth? If they can't answer, dig. If still no answer, disqualify.
- **E — Economic buyer**: identified, reachable, has approved a budget range.
- **D — Decision process**: named stages, owners, likely timing.
- **D — Decision criteria**: what will drive the choice? What would kill the deal?
- **P — Pain**: explicit, current, tied to a live initiative.
- **I — Implicate**: downstream consequences of doing nothing are understood and agreed.
- **C — Champion**: insider who will defend the line item at budget time.
- **C — Competition**: what else is on the table, including "do nothing", "stay in Confluence / a spreadsheet", and "an engineer builds it over a weekend".

No deal is qualified for a pilot until at least five of these are filled and written in the Notion page.

## 5. Discovery question library

### Universal opening (all segments)
- How are concepts — classes, relations, controlled vocabularies, business definitions — maintained today?
- Walk me through the last change that went wrong. What was the fallout?
- Which downstream systems depend on this vocabulary (RAG, catalogue, search, CMS, DAM, data catalogue, compliance reporting)?
- Who owns it today? Is that working?
- What does leadership say about knowledge quality?

### If the buyer sounds like **AI & data**
- Is this feeding a RAG index, an agent's tool-use, a search index, or all three?
- How many classes, how many typed relations? Is there instance data too or just schema?
- How do you pin the knowledge graph for a given model release — or do you rebuild from live data every time?
- Do you export OWL / RDF / Turtle / JSON-LD today? To what? How do you version it?
- Who on the team is comfortable with SPARQL or Cypher? Who isn't, and what do they need?
- What does your RAG eval look like when the vocabulary drifts?

### If the buyer sounds like **catalogue mid-market**
- How many products / items in the catalogue? How many parallel classifications (body style, fuel, segment, region, …)?
- Where do those live today — spreadsheet, PoolParty, Synaptica, the CMS, homegrown?
- Do the classifications share any structure, or are they maintained as parallel silos?
- What downstream systems consume them — CMS, search, PIM, DAM, support categorisation, AI tagging?
- What does a rename or reparent workflow look like? How do you prevent broken references?
- Language footprint — one, two, five?

### If the buyer sounds like **data governance**
- How many business terms today? Who writes the definitions and who signs off?
- Do you have a data catalogue (Collibra / Atlan / Alation / DataHub)? Is the glossary inside it used by non-data stakeholders, or only by the data team?
- What regulation or audit is driving this right now — EU AI Act, SR-11-7, HIPAA, SOC 2, internal governance?
- How often does a definition change, and how do you know it changed?
- What's the relationship between the glossary and the data-lineage graph? Are they in the same tool?
- If your AI copilot answered with a wrong definition tomorrow, how would you catch it?

### Pain (all segments)
- How much time do the data / AI / content / governance teams spend reconciling models?
- If you hit a regression in prod next week, how fast could you roll the vocabulary back?
- What's the blast radius when something goes wrong upstream?

### Outcome, process, champion (all segments)
- If this were solved, what would be different? Who benefits most internally?
- What tools were tried before Ontologia showed up?
- What's the budget source? Who signs? Is there a deadline tied to a business event?
- Who else should I bring in? Who would actively object? Why?

## 6. Demo playbook

### Setup (5 min)
- Recap discovery findings in one sentence each.
- State goals for the demo in the buyer's own words.
- Ask about hard time constraints (end-of-hour stop; more often than not, they'll overrun).

### Core flow — the Cars ontology (30–45 min)

We use the Cars ontology as the universal hero. 9 classes (Manufacturer, Model, BodyStyle, Engine, Transmission, FuelType, DriveType, Segment, Country), 13 relation types, 5 ConceptSchemes (Model catalogue, Body-style taxonomy, Fuel-type taxonomy, Market-segments taxonomy, Manufacturing-geography scheme). It lands for every segment — AI teams see typed relations, catalogue buyers see many schemes on one T-Box, governance buyers see a versioned, audited model.

The sequence:

1. **Dashboard** (1 min) — open the Cars workspace. Show the ontology card: concept count, scheme count, last change event, current tag.
2. **Schema canvas** (5 min) — show the T-Box shape. Point at Manufacturer → Model, Model → BodyStyle, Model → Engine, Engine → FuelType. This is the shape. It's one ontology.
3. **New class with custom attributes + SKOS built-ins** (5 min) — add a `Trim` class. Show the six SKOS built-ins on every concept by default (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `notation`, `example`). Add a typed custom attribute (`baseMsrp: decimal`). Save.
4. **Taxonomies canvas** (3 min) — switch to the Taxonomies view. Show the five schemes living side by side on the same T-Box. This is the differentiator that doesn't exist anywhere else in a modern UX.
5. **Taxonomies tree — drag-drop reparent** (5 min) — open the Body-style taxonomy tree. Drag "Crossover" under "SUV". Show the reference rewrite. Mention bulk rename.
6. **Concept detail — AI tab + deprecation** (5 min) — open a concept. Show AI suggestions (altLabels, translations, duplicate candidates, class classifier). Deprecate one concept with a replacement pointer.
7. **Change history + tag-to-tag diff** (5 min) — show the change events from the last 10 minutes of demoing, revert the deprecation, re-apply, create a tag `demo-v1`, open tag-to-tag diff against the previous tag.
8. **Export modal + API Playground** (5 min) — open the Export modal, preview JSON-LD, SKOS Turtle, OWL RDF-XML, CSV. Open the API Playground, pull the Cars ontology at `?tag=demo-v1`, show copy-as-cURL.

### Per-segment emphasis

Same flow, different lingering points:

| Segment | Linger on | Skim | One-line close |
|---|---|---|---|
| AI & data | API Playground (15 min), JSON-LD + webhook pattern, SPARQL read, tag-to-tag diff as deterministic RAG anchor | Taxonomies tree | "Pin a tag, point your RAG at the JSON-LD endpoint, subscribe to `tag.created`. Done." |
| Catalogue mid-market | Taxonomies canvas (5 schemes on one T-Box), tree drag-drop reparent, bulk deprecation, SKOS Turtle export | API Playground | "One T-Box, every classification your downstream systems need, SKOS out to the CMS and PIM." |
| Data governance | Concept detail with SKOS built-ins, validation panel, deprecation with replacement pointer, change history + tag-to-tag diff, roles + audit | Schema canvas detail | "The source of truth your copilot, your catalogue and your auditor all read from the same URL." |

### Interaction (5 min)
- Hand over controls for a few minutes. Let them try a change themselves. First-impression friction is priceless.

### Close (5 min)
- Recap what resonated in their words.
- Agree on the next step and owner.
- Send a written follow-up within 2 hours, including a link to the pricing page and a proposed 2–4 week pilot outline if fit.

## 7. Objection handling

Grouped by category, not by segment. Segment-specific phrasing is in the "when to use" column.

### Cost

| Objection | Response | When |
|---|---|---|
| "Too expensive." | Look at the downstream cost of a bad rename, a day-long rollback, or a specialist's time reconciling spreadsheets. If those are lower than our price, we'll find a shape that fits — or part ways honestly. | All |
| "Why not per-seat pricing?" | Most customers have one or two people authoring, plus reviewers. Per-seat punishes you for inviting a reviewer. Workspace pricing is easier to budget and fairer. See [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md). | All |
| "We only need a single small taxonomy — Team is overkill." | Free tier covers 500 concepts and gives you the full product surface. Come back when you hit the wall. | Catalogue, governance |

### Vendor lock-in

| Objection | Response | When |
|---|---|---|
| "Lock-in worries me." | Export is first-class in every relevant standard — JSON-LD, SKOS Turtle, OWL RDF-XML, CSV. API read via SPARQL. Here's a live script you can run any day. | All |
| "What if you go under?" | Fair question. The data is yours; every format we export in is a W3C standard. Worst case you re-host in Protégé (for OWL), PoolParty (for SKOS) or DataHub (for the glossary). We'd rather earn the renewal. | All |

### Competitor already installed

| Objection | Response | When |
|---|---|---|
| "We already have Collibra / Atlan / Alation." | Keep it. Their glossary is catalogue-shaped and data-team-gated; non-data stakeholders can't edit. Our JSON-LD feed drives their glossary downstream. Many of our customers run both. | Governance |
| "We already have PoolParty / Synaptica / Smartlogic." | They're powerful and we respect them. If you're happy with the cost, UX and release cadence, stay. If any of the three is a live problem, we're an order of magnitude cheaper, multi-scheme on one T-Box, and SKOS-round-trippable. | Catalogue |
| "We already use TopBraid EDG." | Six-figure ACV, Java-heritage UX. If your team is already productive there, keep it. Where we win is mid-market buyers who got handed an EDG licence and couldn't get anyone outside the data team to log in. | AI, catalogue, governance |
| "Our CMS has a built-in taxonomy editor." | Right — until search, DAM and AI tagging all pull from the same taxonomy and need one source of truth, not four. | Catalogue |
| "We just use Confluence / Notion / a spreadsheet." | Many do. What's missing is model enforcement, field-level change history, and an API downstream systems can hit. Our onboarding imports a Confluence glossary page or a CSV in one click. | Governance, catalogue |
| "Why not just Protégé?" | Protégé is a desktop IDE. No API, no multi-user collaboration, no SKOS export, no hosted runtime. Great for a PhD thesis; painful for a team that wants to ship this quarter. | AI |

### Technical-depth scare

| Objection | Response | When |
|---|---|---|
| "Ontology sounds scary." | It is, if you read the textbook. You can land on the Blank template and start with five concepts — no formal ontologist required. Most customers get to production on a T-Box with under 20 classes. | Governance, catalogue |
| "We need full OWL-DL reasoning." | We ship light inference (transitive closure, cycle detection, contradiction detection). For HermiT-style DL proofs, stay on Protégé or Stardog. | AI |
| "We need ISO 25964." | We ship SKOS, which is the W3C subset 90% of teams actually need. If full 25964 is mandated, Synaptica is a better fit. | Catalogue |
| "We need multilingual." | EN/FR at GA, ES/DE within 12 months. If you need more than four languages by end of Y2, we're not the right fit yet. | Catalogue, governance |
| "Where are branches and merges?" | Deferred — we'll ship them when two customers tell us they need them. Today's change events, revert, tags and tag-to-tag diff cover ~95% of the operational need. Want to be one of those two customers? | AI |

### "Glossary is enough" / "our shape is too small"

| Objection | Response | When |
|---|---|---|
| "Our taxonomy is 80 terms — we don't need a tool." | Probably true today. Come back at 300, when stakeholders start disagreeing on definitions and your search index needs a feed. We'll import your sheet in one click. | Catalogue, governance |
| "Our glossary is 200 definitions in a doc." | Until an audit asks "when was this definition last changed and who signed off?" or your AI copilot cites a stale one in front of a client. JSON-LD feed with tags is a one-URL fix. | Governance |
| "Our AI copilot just needs definitions in a doc." | Your copilot needs definitions it can trust — versioned, with attribution, pinned to a tag so a release doesn't shift under it. That's us. | AI, governance |

### Internal ownership

| Objection | Response | When |
|---|---|---|
| "Who owns this internally?" | Three people, one weekly review: data architect holds the T-Box, catalogue maintainer (or data steward, or content lead) runs the A-Box, platform engineer owns the API key. That's enough. See [PERSONAS.md](../01_product/PERSONAS.md). | All |
| "We'll build it internally." | Some companies should. Most discover authoring UX is a 12–18 month project with ongoing maintenance. What would that cost your team? And what do you de-prioritise to build it? | AI |
| "Not the right time." | Understood. What event would make now the right time — budget cycle, initiative milestone, audit? We'll check back on that date, not before. | All |
| "Security review is heavy." | SSO + audit log ship in the Business tier; SOC 2 Type I readiness is underway. For now: our DPA, architecture doc, data residency options. Happy to walk your security team through each. | All |
| "Who uses this?" | We're early. Here's our current design-partner list (with permission). If you want to be a reference customer, there's a pricing lock and founder access attached. | All |

## 8. Competitive battlecards

Detail and current pricing in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md). One table, keyed by competitor.

| Competitor | Where they win | Where we win | Our cheat-code move |
|---|---|---|---|
| **Protégé** (OSS) | DL reasoning, academic credibility, free | Web-native, multi-user, API, hosted runtime, SKOS export, modern UX | Load the Cars ontology and invite the prospect to co-edit live. Protégé can't do that. |
| **TopBraid EDG** (TopQuadrant) | End-to-end SHACL + governance, pharma references | Transparent mid-market pricing, modern UX, multi-scheme on one T-Box without three projects | Side-by-side: same model in EDG (30 min of project setup) vs Ontologia (2 minutes to first class). |
| **PoolParty** (Semantic Web Company) | Mature SKOS, text extraction, multilingual | Tree-native UX, multi-scheme on one T-Box, workspace pricing 10× cheaper at entry | Open the Cars workspace and toggle the 5 schemes. "This is three PoolParty projects." |
| **Synaptica** | ISO 25964, polyhierarchy, library-science depth | SKOS 80/20 at a fraction of the price, also does the ontology layer they can't | Be honest: if they need 25964, stay on Synaptica. If they only use SKOS, we're the upgrade. |
| **Smartlogic / Semaphore** (Progress) | Classification depth, SharePoint stack | Mid-market price point below their floor, same SKOS interop, API-first | "You're their customer until your CMS renewal. We'll still be here at a tenth the cost." |
| **Graphwise** (Ontotext, post-rebrand) | GraphDB engine, FIBO, research lineage | Lighter, API-first, mid-market pricing | Position as complementary when GraphDB is already in place; export to their engine. |
| **Collibra** | Deep data-governance breadth, lineage, enterprise fit | Focused glossary/ontology non-data stakeholders can edit, feed-first into their catalogue | JSON-LD feed demo: Ontologia → Collibra glossary, live, in the call. |
| **Alation** | Query-log popularity, analytics-team adoption | Stakeholder-editable glossary, 10× cheaper, richer structure | Same feed-first pattern as Collibra. |
| **Atlan** | Modern catalogue UX, collaboration | Ontology-layer depth their catalogue doesn't reach | Partnership angle, not replacement; position upstream. |
| **Secoda / DataHub** | Lower entry pricing / open-source | Structured glossary, typed relations, richer export | DataHub has a native hook — ship the integration on the call. |
| **Confluence / Notion / spreadsheets** | Already deployed, free at margin | Structure, versioning, API, audit | One-click import from a Confluence page or CSV, then versioned and API-served in 10 minutes. |
| **"Build internally"** | Perfect fit in theory | TCO, 12–18 month build, ongoing maintenance | "What do you de-prioritise to build this? And who owns it in year 3?" |

## 9. Proposal & pricing guide

- Default to list price at `ontologia.com/pricing`. Team $499/mo or $4,990/yr. Business $1,990/mo or $19,900/yr. Enterprise from $40k/yr.
- Annual commit already includes ~17% off monthly — that's the headline discount. We do not stack another 10% on top by default.
- 2-year commit: additional 5% off. Cap at 20% total off list without both-founder approval.
- Founder-approved discounting bands:
  - Up to **15%**: one founder approves.
  - **15–25%**: both founders approve.
  - **> 25%**: only for customer-specific strategic reasons, documented in writing, both founders + explicit rationale.
- Free editor seats inside paid workspaces: unlimited by default — no reviewer tax.
- Custom terms (MSA redlines, indemnity caps, SLA language) approved by Valentin with Alexandre's sign-off on technical clauses.

Pricing is the same across segments. An AI team, a catalogue team and a governance team on the same tier get the same product. See [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

## 10. Redline & legal

- Standard MSA and DPA posted publicly at `ontologia.com/legal`.
- Known acceptable redlines catalogued in a Notion page so we don't re-negotiate resolved issues.
- Legal escalation path: Valentin → outside counsel (fractional, via Ironclad or a boutique B2B SaaS firm) → both founders aligned before countersignature.
- We avoid: unlimited indemnity, IP assignment clauses outside standard carveouts, MFN clauses, custom SLA uptime commitments beyond [SLA.md](../05_operations/SLA.md).

## 11. Security & procurement support

- Trust center shared at discovery stage, even when we're honest about what isn't yet shipped.
- Security questionnaire response within 5 business days in Year 1. Aim for 2 days once we have a pre-answered library in place.
- VSOC / vendor security onboarding call offered to Enterprise on request — Alexandre leads.

## 12. Handoff to CS (or founder-as-CS)

Every won deal triggers an internal handoff with:
- Segment tag and the outcomes tied to it.
- Goals and success metrics captured during discovery and pilot.
- Stakeholder map.
- Technical context (imports, integrations, planned API usage, region, downstream systems).
- Expansion hypothesis (adjacent team, adjacent use case, quota growth).
- Known risks.

In Year 1, the handoff is Valentin to Valentin — but it's still written down, because context rot is the number one cause of churn.

## 13. Forecasting & hygiene

- Weekly pipeline review: Monday morning, 20 minutes, Valentin's Notion database.
- A deal without a recent touch (> 14 days) is auto-flagged and either restarted or marked dead with a reason.
- Stage categories:
  - **Commit** (> 90% confidence, order form drafted or signed).
  - **Upside** (50–89%, pilot running or proposal in redline).
  - **Pipeline** (20–49%, discovery complete, demo scheduled or done).
  - **Early** (< 20%, qualification in progress).
- Loss reasons captured for every lost deal; quarterly (or whenever three deals have been lost since the last review) win/loss retrospective between Valentin and Alexandre.

## 14. Enablement rituals (Year 1 = founder drills)

- Weekly 30-minute call review: Valentin plays a recorded discovery or demo; Alexandre pokes holes at product fit.
- Monthly product walkthrough from Alexandre on new shipped features and how to demo them on the Cars ontology.
- Quarterly competitive refresh: re-check competitor pricing and positioning.
- New-hire ramp (Year 2 first hire): 30/60/90 with certification on discovery call, Cars-ontology demo, and objection handling.

## 15. Metrics

Weekly, in one Google Sheet:
- Qualified conversations (count), broken down by segment tag.
- Demos run (count).
- Pilots active.
- Proposals in redline.
- Win rate last trailing 10 deals, by segment.
- Average cycle time (first-touch to close) by segment.
- Average ACV by segment.
- Pipeline coverage (target 3× next-quarter goal at the start of the quarter).
- MRR movement: new, expansion, churn, net new.

NRR / GRR reported quarterly once we have >20 customers through at least one renewal cycle.

## 16. Anti-patterns

- Selling features nobody asked about.
- Demoing deferred features (branches, merges, reviews, HermiT reasoning, ISO 25964) as if they're shipped. Don't.
- Talking about the product as "glossary mode" or "taxonomy mode" — that framing is gone. It's one ontology, with schemes inside it.
- Discounting to "close the quarter" — we don't have quarters.
- Skipping the security conversation with buyers who will ask later.
- Ignoring the champion's internal narrative about our stage and team size.
- Passing an unready deal to CS (or, in Year 1, to future-Valentin).
- Promising a custom feature without Alexandre's written agreement on scope and date.

## 17. Continuous improvement

- Every lost deal gets a three-sentence post-mortem in the Notion pipeline page, with segment tag.
- Every won deal gets a short pattern log — what worked we'd want to repeat.
- Playbook updated monthly based on field learnings; changelog at the bottom of this file (once it exists in git).

## 18. Ownership

- **Valentin**: all sales stages, pricing approvals within band, CRM hygiene, objection library, proposals, renewal conversations. Founder-led through the first 25 paying logos.
- **Alexandre**: technical deep-dive call per opportunity — especially SPARQL, JSON-LD, SKOS round-trips, OWL exports, webhook patterns. Also: security questionnaire responses, custom-feature scoping, trust-center content.
- Monday founder standup covers open pipeline; Wednesday async Slack update covers stalls and blockers.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Personas](../01_product/PERSONAS.md) · [Customer Success](CUSTOMER_SUCCESS.md) · [Business Strategy](BUSINESS_STRATEGY.md)
