# Customer Success

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


How we help customers realise the value they bought. The playbook for onboarding, retention, expansion, and turning happy customers into advocates.

---

## 1. CS mission

Every Ontologia customer reaches their first milestone within 30 days, their second within 90, and is measurably ahead of where they started within 12 months. We prevent churn by making customers successful, not by making cancellation painful.

## 2. CS philosophy

- CS is a business function, not a support queue.
- Value realised by the customer is our north star — revenue follows.
- Be proactive: we open conversations before the customer has to.
- Honest always: we tell customers when they should *not* use a feature, or when another tool is a better fit.
- Data informs, humans decide. Health scores trigger attention, not automation.

## 3. Customer segments & coverage models

| Segment | Plan | ARR band | Coverage |
|---|---|---|---|
| Self-serve | Free / Starter | $0–$5k | Digital (docs, in-app, community) |
| Growth | Starter / Pro | $5k–$30k | Pooled CSM + digital |
| Scale | Pro | $30k–$100k | Named CSM |
| Enterprise | Enterprise | $100k+ | Named CSM + TAM + exec sponsor |

## 4. Customer journey milestones

1. **Kickoff** — goals, success metrics, stakeholders.
2. **First value** — first meaningful ontology committed, first reviewer added.
3. **Scale-out** — new team joins, API or integration live.
4. **Governance** — roles, branch policies, audit usage.
5. **Expansion** — new workspace or upgraded plan.
6. **Advocate** — case study, referral, speaker or reference.

## 5. Onboarding

### Goal
First value delivered to the customer in ≤ 14 days (Scale/Enterprise); ≤ 7 days (self-serve).

### Steps

- **Week 0** — Welcome email, kickoff invite, sandbox workspace ready.
- **Week 1** — 30-minute kickoff: goals, stakeholders, timeline. Share kickoff template (`docs/07_business/templates/kickoff.md`).
- **Week 2** — Technical setup: SSO, SCIM, webhook, import path. Training session #1 (authoring + branches).
- **Week 3** — Governance setup: roles, branch policies, audit log. Training session #2 (reviews + merges).
- **Week 4** — Success review: confirm first milestone hit, confirm next milestone.

For self-serve customers this is compressed into in-app onboarding + email drip; check-in at day 14 and day 60.

### Onboarding kit
- Personalised runbook in Notion.
- Architecture diagram tailored to their integrations.
- Sample ontologies aligned to their domain.
- Recorded training videos they can share internally.

## 6. Product adoption programme

### Adoption pillars
- Editor seats *activated* vs *provisioned*.
- Branches created and merged.
- Reviews completed.
- API usage.
- Integrations live (import, export, webhooks).
- Audit log views.

### Interventions
- In-app nudges when pillars drift below baseline.
- CSM outreach when a Scale/Enterprise customer dips.
- Monthly adoption report for named accounts.

## 7. Training & certification

- Free self-paced courses: "Ontologia Essentials" (2 h), "Authoring Deep Dive" (3 h), "Governance & Reviews" (2 h), "API & Integrations" (3 h).
- Instructor-led workshops included for Pro+ customers quarterly.
- Certification exam: "Ontologia Certified Practitioner" — free, proctored online.
- Advanced certification: "Ontologia Certified Administrator" for admins.

## 8. Support tiers & SLAs

See also [SLA.md](../05_operations/SLA.md).

| Plan | First response | Target resolution | Channels |
|---|---|---|---|
| Free | Best effort | — | Community |
| Starter | 24 h | 5 business days | In-app + email |
| Pro | 8 h | 2 business days | In-app + email + chat |
| Enterprise | 1 h (urgent) | 4 business hours (urgent) | Dedicated channel, phone, email, chat |

Support queue shared between CS and support engineers. Escalation to engineering on-call when required.

## 9. Health scoring

Health is computed weekly from:
- Activation (0–25): editors provisioned vs activated.
- Breadth (0–20): ontologies / concepts / relationships created.
- Collaboration (0–20): branches, reviews, merges.
- Advanced usage (0–15): API, webhooks, audit log, integrations.
- Sentiment (0–20): NPS, support tone, exec meetings, advocacy.

Categories:
- **Green** ≥ 75
- **Yellow** 50–74
- **Red** < 50

Health feeds Slack alerts to CS and informs QBR prep.

## 10. Quarterly business reviews (Enterprise & Scale)

- Review goals and metrics from kickoff.
- Demonstrate value delivered.
- Identify blockers.
- Review product roadmap.
- Discuss expansion opportunities.
- Capture feedback for PM + engineering.

Materials: tailored deck, value scorecard, upcoming-features preview.

## 11. Renewals

### Timeline
- 120 days out: renewal planning meeting, confirm stakeholders and budget.
- 90 days out: executive alignment on goals for next year.
- 60 days out: renewal proposal delivered.
- 30 days out: target close.
- 0 days: contract renewed (or churn handled gracefully).

### Renewal checklist
- Business review delivered.
- Champion confirmed.
- Expansion opportunity reviewed.
- Pricing & terms confirmed.
- Commercial approvals gathered.
- Legal redlines resolved.

### Retention goals
- GRR ≥ 92% year 1, ≥ 95% by year 3.
- NRR ≥ 110% year 1, ≥ 125% by year 3.

## 12. Expansion

### Triggers
- New team joins the workspace.
- Usage near plan limits (objects, editors, API quota).
- Integration request in an adjacent BU.
- Positive champion with cross-team influence.

### Playbook
- CSM surfaces the trigger.
- AE runs the expansion conversation.
- Joint proposal (technical + commercial).
- Formalised in the renewal or a mid-term amendment.

## 13. Churn prevention & handling

### Prevention
- Health score acted on within 7 days.
- Executive sponsor calls for Enterprise reds.
- Root-cause playbook: adoption, value, fit, team change.

### If churn happens
- Exit interview within 7 days.
- Data export support and deletion confirmation.
- Honest goodbye email and open door.
- Churn reason captured in CRM; patterns reviewed quarterly.

We do not make cancelling difficult. Self-serve customers can cancel in one click.

## 14. Voice of Customer (VoC)

- Customer feedback board (Canny or similar).
- Twice-yearly NPS survey.
- Targeted PM-led interviews every quarter.
- Advisory board of 8–12 design partners meeting quarterly.
- Public changelog inviting comments.

VoC feeds the product roadmap; we publicly acknowledge what we did / didn't take on and why.

## 15. Advocacy & references

### Advocacy levels
- **Referenceable**: willing to take a call from a prospect.
- **Published case study**: logo, quote, metrics.
- **Speaker**: conference talk, podcast, webinar.
- **Champion network**: ongoing community.

### Reward structure
- Credits, swag, exclusive events, early access.
- No pay-for-play; we never buy references.

## 16. Tooling

- CRM: HubSpot.
- Support: Plain or Intercom.
- Community: Discord/Slack + Circle.
- CS platform: Vitally, Catalyst, or ChurnZero (pick one when book of business > 50 accounts).
- Health modelling: ClickHouse + Mode + internal dashboards.

## 17. CS team shape

- Year 0–1: founder-led + 1 CSM.
- Year 1–2: 3 CSMs (1 Enterprise, 1 Scale, 1 pooled), 1 support lead, 1 training / enablement specialist.
- Year 3: 6–10 CSMs split by segment and region, dedicated renewal managers, TAMs for top accounts.

## 18. Internal rhythms

- **Weekly**: CS stand-up reviewing red accounts and renewals.
- **Monthly**: CS review with leadership, cohort analysis.
- **Quarterly**: cross-functional voice-of-customer presentation to engineering + product.
- **Annually**: CS strategy reset and OKRs.

## 19. Metrics

- NRR, GRR, logo churn, revenue churn, expansion rate.
- Time to first value, time to second milestone, activation rate.
- Health score distribution over time.
- Support volume and first-response compliance.
- NPS, CSAT, CES.
- Advocacy pipeline: references, case studies, speakers.

## 20. Anti-patterns

- Treating CS as a reactive support function.
- Incentives that reward renewal at any cost (misaligned ethics).
- Wait-and-see approaches when health scores flag.
- Training customers on features they don't need.
- Hiding churn reasons instead of learning from them.

Related: [Sales Playbook](SALES_PLAYBOOK.md) · [Customer Acquisition](CUSTOMER_ACQUISITION.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Support](../10_launch/SUPPORT.md) · [SLA](../05_operations/SLA.md)
