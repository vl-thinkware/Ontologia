# Sales Playbook

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

The practical field guide for running the Ontologia sales motion with two founders. Valentin carries every deal in Year 1; Alexandre joins for one technical call per opportunity. Written for us now, and for the first AE whenever we can afford one.

> **Operating model**. Founder-led for at least the first 25 paying logos. No SDR, no outbound sequencer, no discount pressure, no forecasting theatre. One CRM is a Notion database. The target is a handful of well-run deals per month, not a funnel to feed.

---

## 1. Sales philosophy

- We sell outcomes, not features. The outcome is clarity, speed, and trust in the organisation's knowledge.
- We tell the truth about limitations — including the features we've deferred (branches, reviews, merges).
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
- Account research (10 minutes max): company, industry, the named AI or data initiative, a specific article or signal we can reference.
- Exit: a named contact and a specific hypothesis about their pain.

### Stage 2 — Qualify
- 15-minute call or an asynchronous exchange.
- BANT-lite: real budget or path to it, named buyer, concrete pain, timing this quarter or next.
- Exit: explicit yes/no to continue. If yes, discovery scheduled within 7 days.

### Stage 3 — Discover
- 30–45 minutes. Valentin leads. Deep dive into current state and desired outcome.
- Map the DMU: champion, economic buyer, technical buyer, end users, any security gatekeeper.
- Exit: a written one-paragraph summary sent within 2 hours; the buyer confirms or corrects it. If they don't respond in 5 business days, the deal is stalled and moves to "no next step".

### Stage 4 — Demo
- Always personalised. Opens with *their* vocabulary, imported live from a CSV they sent or one we found for their domain.
- 45–60 minutes with champion + 1–3 invited colleagues.
- Live flow: canvas authoring → edit → save → change event → revert → create tag → API pull by tag → JSON-LD export.
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
- **C — Competition**: what else is on the table, including "do nothing" and "an engineer builds it over a weekend".

No deal is qualified for a pilot until at least five of these are filled and written in the Notion page.

## 5. Discovery question library

### Current state
- How are ontologies / taxonomies / controlled vocabularies maintained today?
- Which teams publish their own vocabulary? Which consume it?
- Where does drift show up? What's the usual first sign something is wrong?
- Walk me through your last schema or taxonomy change — how did it reach production?

### Pain
- Walk me through the last time a change went wrong. What was the fallout?
- How much time do the data / AI teams spend reconciling models?
- What does leadership say about knowledge quality or RAG quality?
- If you hit a regression in prod next week, how fast could you roll the vocabulary back?

### Outcome
- If this were solved, what would be different?
- Who would benefit most internally?
- What does success look like at 90 days? 12 months?

### Process
- Who cares about this, by name?
- What tools were tried before Ontologia showed up?
- What's the budget source? Who signs?
- Is there a deadline tied to a business event (product launch, audit, board cycle)?

### Champion & stakeholders
- Who else should I bring into the next conversation?
- What would make this real for your CIO / CDO / CTO / Head of AI?
- Is there anyone who would actively object? Why?

## 6. Demo playbook

### Setup (5 min)
- Recap discovery findings in one sentence each.
- State goals for the demo.
- Ask about hard time constraints (end-of-hour stop; more often than not, they'll overrun).

### Narrative (30 min)
1. **Their problem** — mirror the pain back in one slide using their language.
2. **Our approach** — "ontology as product", not "ontology as code" (the git-like story is deferred). Source of truth, versioned as change events, revertible, exportable.
3. **Live flow** on their domain:
   - Import a CSV sample (or pre-built ontology close to their domain).
   - Edit a concept on the canvas; save; show the change event in the history.
   - Revert the change; show the new change event that inverts it; show history.
   - Create a tag `demo-v1`; pull via API with `?tag=demo-v1`; show the JSON-LD export.
4. **Collaboration & safety** — workspace roles, audit trail, soft limits, change events unlimited in Team+.
5. **Trust** — what we ship today for security (auth, RLS, audit log), what ships next (SSO, SAML — M3/M6 on the [roadmap](../00_overview/ROADMAP.md)).

### Interaction (10 min)
- Hand over controls for 5 minutes. Let them try a change themselves. First-impression friction is priceless.

### Close (5 min)
- Recap what resonated in their words.
- Agree on the next step and owner.
- Send a written follow-up within 2 hours, including a link to the pricing page and a proposed 2–4 week pilot outline if fit.

## 7. Objection handling

| Objection | Response |
|---|---|
| "We already have a data catalogue." | Catalogues discover, we design. Teams running both move faster than teams with either alone. Show one-minute data-catalogue-to-ontology import. |
| "We can do this in Confluence / Notion / a spreadsheet." | Many do. What's missing is structure enforcement, change history at the field level, and an API your RAG pipeline can hit. Try reviewing a 500-line Confluence change. |
| "Protégé / TopBraid / PoolParty already do this." | They're powerful, and we respect them. They're desktop-first or multi-seat priced. We're web, collaborative, and one workspace price. |
| "We'll build it internally." | A small percentage of companies should. Most discover that authoring UX is a 12–18 month project with ongoing maintenance. What would that cost your team? |
| "Graph DBs (Neo4j / Stardog) include an editor." | Infrastructure, not authoring. Running a graph DB is not the same as designing what goes into it. We sit on top — and we export to Cypher. |
| "Too expensive." | Let's look at the downstream cost of model drift, a rollback that takes a day, or a knowledge engineer's time reconciling spreadsheets. If those are lower than our price, we'll find a shape that fits — or part ways honestly. |
| "Why not per-seat pricing?" | Most customers have one or two taxonomists doing the real work. Per-seat punishes you for inviting a reviewer. Workspace pricing is fairer and easier to budget. |
| "Where are branches and merges?" | Deferred — we'll ship them when two customers tell us they need them. Today's change events plus revert plus tags cover ~95% of the operational need. Want to be one of those two customers? |
| "Not the right time." | Understood. What event would make now the right time? Budget cycle? Initiative milestone? We'll check back on that date, not before. |
| "Security review is heavy." | We're SOC 2 Type I-ready in planning (Year 2 ship). For now: our DPA, architecture doc, data residency options, and penetration test once we do one. Happy to walk your security team through each. |
| "Lock-in worries me." | Export is first-class — JSON-LD, JSON, CSV, Cypher. Here's a live script you can run any day. |
| "Who uses this?" | We're early. Here's our current design-partner list (with permission). If you want to be a reference customer, there's a pricing lock and founder access attached. |

## 8. Competitive battlecards (summary)

Detail and current pricing in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md).

| Competitor | Strengths | Weaknesses | Best angle |
|---|---|---|---|
| Protégé | Mature, academic credibility, free | Desktop-only, no collaboration, no API | UX, team workflow, web |
| TopBraid Composer / EDG | Full stack incl. governance | Heavy, $100k+ ACV, legacy UX | Modern UX, transparent pricing, faster to ship |
| PoolParty | Mature semantic suite | €20–150k / year range, complex | Price, simplicity, workspace pricing |
| Stardog Studio | Graph + inference native | Infra-first, not collaborative authoring | We sit on top; Stardog exports land cleanly |
| Collibra / Atlan / Alation | Cataloguing power, enterprise fit | Not design-first; not what we do | Complementary, not competitive |
| "Build internally" | Fits exactly | Ownership cost, 12–18 month build, maintenance | TCO, time-to-value, and "what will you de-prioritise to build this?" |

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

See [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

## 10. Redline & legal

- Standard MSA and DPA posted publicly at `ontologia.com/legal`.
- Known acceptable redlines catalogued in a Notion page so we don't re-negotiate resolved issues.
- Legal escalation path: Valentin → outside counsel (fractional, via Ironclad or a boutique B2B SaaS firm) → both founders aligned before countersignature.
- We avoid: unlimited indemnity, IP assignment clauses outside standard carveouts, MFN clauses, custom SLA uptime commitments beyond [SLA.md](../05_operations/SLA.md).

## 11. Security & procurement support

- Trust center shared at discovery stage, even when we're honest about what isn't yet shipped.
- Security questionnaire response within 5 business days in Year 1. Aim for 2 days once we have pre-answered library in place.
- VSOC / vendor security onboarding call offered to Enterprise on request — Alexandre leads.

## 12. Handoff to CS (or founder-as-CS)

Every won deal triggers an internal handoff with:
- Goals and success metrics captured during discovery and pilot.
- Stakeholder map.
- Technical context (imports, integrations, planned API usage, region).
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
- Monthly product walkthrough from Alexandre on new shipped features and how to demo them.
- Quarterly competitive refresh: re-check competitor pricing and positioning.
- New-hire ramp (Year 2 first hire): 30/60/90 with certification on discovery call, demo, and objection handling.

## 15. Metrics

Weekly, in one Google Sheet:
- Qualified conversations (count).
- Demos run (count).
- Pilots active.
- Proposals in redline.
- Win rate last trailing 10 deals.
- Average cycle time (first-touch to close) by segment.
- Average ACV by segment.
- Pipeline coverage (target 3× next-quarter goal at the start of the quarter).
- MRR movement: new, expansion, churn, net new.

NRR / GRR reported quarterly once we have >20 customers through at least one renewal cycle.

## 16. Anti-patterns

- Selling features nobody asked about.
- Demoing deferred features (branches, merges, reviews) as if they're shipped. Don't.
- Discounting to "close the quarter" — we don't have quarters.
- Skipping the security conversation with buyers who will ask later.
- Ignoring the champion's internal narrative about our stage and team size.
- Passing an unready deal to CS (or, in Year 1, to future-Valentin).
- Promising a custom feature without Alexandre's written agreement on scope and date.

## 17. Continuous improvement

- Every lost deal gets a three-sentence post-mortem in the Notion pipeline page.
- Every won deal gets a short pattern log — what worked we'd want to repeat.
- Playbook updated monthly based on field learnings; changelog at the bottom of this file (once it exists in git).

## 18. Ownership

- **Valentin**: all sales stages, pricing approvals within band, CRM hygiene, objection library, proposals, renewal conversations.
- **Alexandre**: technical deep-dive call per opportunity, security questionnaire responses, custom-feature scoping, trust-center content.
- Monday founder standup covers open pipeline; Wednesday async Slack update covers stalls and blockers.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Customer Success](CUSTOMER_SUCCESS.md) · [Business Strategy](BUSINESS_STRATEGY.md)
