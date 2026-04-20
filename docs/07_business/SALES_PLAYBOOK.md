# Sales Playbook

The practical field guide for anyone doing direct sales at Ontologia — founders today, AEs and SEs tomorrow. Everything an account team needs to run a deal from first touch to close to expansion.

---

## 1. Sales philosophy

- We sell outcomes, not features. The outcome is clarity, speed, and trust in the organisation's knowledge.
- We tell the truth about limitations. Trust is the deepest moat.
- We disqualify early and fast. A clean "no" is better than a long "maybe".
- We run a tight process. Predictability serves the customer and the business.
- We treat customers like co-builders, especially in year one.

## 2. Sales team shape

| Role | Month 0–6 | Month 6–18 | Post Series A |
|---|---|---|---|
| Founder-led sales | Yes | Shared with AE | Strategic accounts only |
| SDR | — | 1–2 | 4+ |
| AE (mid-market) | — | 1 | 3–6 |
| AE (enterprise) | — | 1 | 2–4 |
| SE | — | 1 (fractional) | 2–4 |
| CSM | — | 1 | 3–6 |

## 3. The Ontologia sales process

```
Identify → Qualify → Discover → Demo → PoV (optional) → Propose → Negotiate → Close → Handoff → Expand
```

Each stage has exit criteria. Deals cannot advance until they are met.

### Stage 1 — Identify
- Source: inbound signup, outbound cadence, event, referral.
- Account research: company, industry, recent AI initiatives, signals (job postings, blog posts, PR).
- Exit: a named contact and a hypothesis about their pain.

### Stage 2 — Qualify
- 15-minute call or written exchange.
- BANT-lite: Budget availability, Authority (or path to it), Need, Timing.
- Exit: clear yes/no decision to continue; if yes, discovery scheduled.

### Stage 3 — Discover
- 30–45 minutes. Deep dive into their current state and desired outcome.
- Map the decision-making unit: champion, economic buyer, technical buyer, users, security, procurement.
- Exit: a written summary of findings with agreed next steps; the buyer confirms the summary.

### Stage 4 — Demo
- Always personalised. We open with *their* vocabulary.
- 45–60 minutes with champion + 1–3 invited colleagues.
- Demonstrate: canvas authoring, branches, review, diff, export.
- Exit: clear reaction; either advance to PoV / propose, or politely disqualify.

### Stage 5 — PoV (optional)
- When: complex environment, high-ACV deal, or security review will happen anyway.
- Duration: 2–6 weeks.
- Must have: scoped success criteria in writing; named champion; commercial pre-agreed.
- Exit: success criteria met or not; if met, commercial moves to proposal.

### Stage 6 — Propose
- Formal proposal document or order form.
- Aligned to the metrics they care about.
- Offered 1-year and 2-year options.
- Exit: verbal or written commitment to move to redlines.

### Stage 7 — Negotiate
- Stay on list price unless volume justifies. Trade concessions for value (multi-year, case study, reference).
- Keep legal and security tracks in parallel.
- Exit: signed order form and MSA.

### Stage 8 — Close
- Counter-signature, invoice, welcome email.
- Internal notification in `#deals-won`.

### Stage 9 — Handoff
- Warm introduction to the CSM within 24 h of signature.
- Shared Notion page with account plan, goals, stakeholders, risks.

### Stage 10 — Expand
- CSM drives adoption; AE re-engages at the right trigger for expansion.
- QBRs quarterly (Enterprise) or semi-annually (Pro).

## 4. Qualification criteria (MEDDPICC-lite)

- **M — Metrics**: what KPI does Ontologia move? How much is it worth?
- **E — Economic buyer**: identified, reachable, and has approved budget?
- **D — Decision process**: mapped stages, owners, timing.
- **D — Decision criteria**: what will drive the choice?
- **P — Pain**: explicit, painful, and tied to a real initiative.
- **I — Implicate the pain**: downstream consequences are understood.
- **C — Champion**: insider who will carry us through.
- **C — Competition**: what else is on the table (including "do nothing")?

No deal is considered qualified until at least five of these are filled.

## 5. Discovery question library

### Current state
- How are ontologies maintained in your organisation today?
- Which teams publish their own vocabulary? Which consume it?
- Where does drift show up? What's the usual first sign?

### Pain
- Walk me through the last time a change to the vocabulary went wrong. What was the fallout?
- How much time do data / AI teams spend reconciling models?
- What does leadership say about knowledge quality?

### Outcome
- If this were solved, what would be different?
- Who would benefit most?
- What does success look like at 90 days? 12 months?

### Process
- Who cares about this?
- What tools were tried before?
- What's the budget source? Who signs?

### Champion
- Who else should I bring into the next conversation?
- What would make this real for your CIO / CDO / CTO?

## 6. Demo playbook

### Setup (5 min)
- Recap discovery findings.
- State goals for the demo.
- Ask about time constraints.

### Narrative (25 min)
1. **The problem** — mirror their pain in one slide.
2. **Our approach** — ontology as code.
3. **Live flow** — import a sample of *their* data → sketch a change → branch → diff → review → merge → export.
4. **Collaboration** — show a comment, a review, an audit entry.
5. **Security & control** — SSO, roles, audit, residency, export.

### Interaction (10 min)
- Hand over controls. Let them try a change themselves when appropriate.

### Close (5 min)
- Recap what resonated.
- Agree on next step and owner.
- Send a written follow-up within 2 hours.

## 7. Objection handling

| Objection | Response |
|---|---|
| "We already have a data catalogue." | Great — we integrate with it. Catalogues discover; we design. Teams who have both move faster than teams with either alone. |
| "We can do this in Confluence." | Some do. What's missing is structure enforcement and diffs. Try to review a 500-line Confluence change — then try the same with our diff. |
| "Protégé / TopBraid already do this." | They're powerful and we respect them. They're desktop-first; modern teams want web collaboration, reviews, and a platform API. |
| "We'll build it internally." | A small percentage of companies should. Most will find that authoring UX is a two-year project they don't want to own. |
| "Graph DBs include an editor." | Infrastructure, not authoring. Running a graph DB ≠ designing what goes into it. |
| "Too expensive." | Let's look at the downstream cost of model drift and delayed AI work. If it's < that, we'll find a shape that fits. |
| "Not the right time." | Understood. What event would make now the right time? We'll check back at that trigger. |
| "Security review is heavy." | Our trust center pre-answers 90% of it. Here's our DPA, SOC 2 scope, pen test letter, residency docs. |
| "Lock-in worries me." | Export is first-class — JSON-LD, JSON, CSV, Cypher. Here's a live script you can run any day. |

## 8. Competitive battlecards (summary)

Detail in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md).

| Competitor | Strengths | Weaknesses | Best angle |
|---|---|---|---|
| Protégé | Mature, academic credibility | Desktop, no collaboration | UX & team workflow |
| TopBraid Composer / EDG | Full stack incl. governance | Heavy, expensive | Modern UX, pricing transparency |
| Stardog | Graph + inference | Infra, not authoring | We sit on top |
| Collibra / Atlan / Alation | Cataloguing power | Not design-first | Complementary |
| "Build internally" | Fits exactly | Ownership cost | Total cost & time to value |

## 9. Proposal & pricing guide

- Default to list price.
- Volume tiers pre-computed in the internal calculator.
- Annual commit earns 10% off monthly; 2-year commit earns a further 5%.
- Free tier for 5 hands-on seats in any paid org (for champions and reviewers). No additional discount on top.
- Custom terms approved by CEO/CFO only.

## 10. Redline & legal

- Standard MSA and DPA posted publicly.
- Known acceptable redlines catalogued so AEs don't re-negotiate resolved issues.
- Legal escalation path: AE → Ops → CEO → outside counsel.

## 11. Security & procurement support

- Trust center shared at discovery stage.
- Dedicated security questionnaire response within 5 business days.
- VSOC (vendor security onboarding call) offered to enterprise on request.

## 12. Handoff to CS

Every won deal triggers an internal handoff with:
- Goals, success metrics, and timeline.
- Stakeholder map.
- Technical context (integrations, region, SSO).
- Expansion hypothesis.
- Known risks.

A 30-minute joint call with champion completes the handoff.

## 13. Forecasting & hygiene

- Weekly pipeline review with stage aging.
- A deal without a recent touch (>14 days) auto-flagged.
- Commit category: Commit (>90%), Upside (50–89%), Pipeline (20–49%), Omitted (<20%).
- Loss reasons captured; quarterly win/loss review.

## 14. Enablement rituals

- Weekly team practice: call review + objection drilling.
- Monthly product walkthrough from PM team.
- Quarterly deep dive on competition and market trends.
- New hire ramp: 30/60/90 plan with certification on discovery and demo.

## 15. Metrics

- Win rate by stage.
- Cycle time.
- Average ACV.
- Pipeline coverage (target 3–4x quota).
- Ramp time for new AEs.
- NRR / GRR in the book of business.

## 16. Anti-patterns

- Selling features nobody asked about.
- Discounting without a trade.
- Skipping the security story with buyers who will ask later.
- Ignoring the champion's internal narrative.
- Passing an unready deal to CS.

## 17. Continuous improvement

- Every lost deal gets a short post-mortem.
- Every won deal gets a short pattern log — what worked we'd want to repeat.
- Playbook updated monthly based on field learnings.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Customer Success](CUSTOMER_SUCCESS.md)
