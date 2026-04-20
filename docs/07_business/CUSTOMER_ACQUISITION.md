# Customer Acquisition

The funnels, plays, and experiments we run to turn strangers into happy, expanding customers. Operational companion to [GO_TO_MARKET.md](GO_TO_MARKET.md) and [MARKETING_STRATEGY.md](MARKETING_STRATEGY.md).

---

## 1. The acquisition funnel

```
Visitors  →  Signups  →  Activated  →  Paid  →  Expanded  →  Advocate
```

Each arrow has a conversion rate, a cycle time, and an owner. If any arrow is below target for two cycles, we open an experiment queue.

### Target rates (steady state)

| Transition | Target | Owner |
|---|---|---|
| Visitor → Signup | 3% | Marketing |
| Signup → Activated | 40% | Product / growth |
| Activated → Paid | 8% (self-serve), 25% (sales-led) | Sales / growth |
| Paid → Expanded | 40% in year 1 | CS |
| Expanded → Advocate | 25% | CS |

## 2. Acquisition channels & expected mix

### Year 1 (post-GA)

| Channel | Share of new ARR |
|---|---|
| Inbound from SEO / content | 35% |
| Referrals / word-of-mouth | 20% |
| Community & events | 15% |
| Outbound to named accounts | 15% |
| Partnerships | 10% |
| Paid (LinkedIn ABM, Google brand) | 5% |

### Year 2+

Shift 10 points from inbound to outbound + partnerships as sales capacity grows.

## 3. Ideal-customer acquisition plays

### Play 1 — "RAG teams failing on consistency"
- Signal: public posts, conference talks, job listings mentioning RAG + taxonomy / ontology / knowledge graph pain.
- Message: "Your retrieval is only as good as your vocabulary."
- Offer: 30-minute teardown of their domain sample.
- Channel: LinkedIn + email to Head of AI.

### Play 2 — "Modernise away from Protégé"
- Signal: LinkedIn profile mentions Protégé; company in pharma / healthcare / manufacturing.
- Message: "Bring your ontology to the web — bring your team with you."
- Offer: migration tool + 2-hour working session.
- Channel: direct outreach + content.

### Play 3 — "New data catalogue, no design tool"
- Signal: customer list of Collibra, Alation, Atlan; absence of dedicated modelling tool.
- Message: "Your catalogue describes what you have. We describe what you need."
- Offer: integration demo + PoV.
- Channel: partner co-marketing and referrals.

### Play 4 — "Regulated industry model governance"
- Signal: companies with compliance officers, formal terminology committees.
- Message: "Every change attributable, reviewable, reversible."
- Offer: compliance-oriented demo and security pack.
- Channel: industry analyst intros + conference sponsorships.

### Play 5 — "AI platform teams at scale-ups"
- Signal: Series B+ AI scale-ups, RAG-heavy public posts.
- Message: "Ship agents that know what your company means by every term."
- Offer: free Pro for 6 months in exchange for design-partner commitment.
- Channel: founder-to-founder.

Plays are versioned; each has a dedicated sheet with prospects, touches, and outcomes.

## 4. Self-serve funnel optimisation

### Acquisition page
- Single primary CTA.
- Live interactive demo near the fold.
- Testimonials from design partners.
- Clear pricing link.

### Signup
- Email or Google.
- No credit card for Free.
- Under 30 seconds from click to first screen.

### Onboarding
- Workspace created automatically.
- Choose a sample template or import from Excel / CSV / JSON-LD.
- 3-step interactive tour (canvas, branch, share).
- Time-to-first-commit target: under 10 minutes.

### Activation
- Defined as: at least one concept created + one relationship + one commit within 7 days.
- Unactivated users receive tailored help emails (not generic drips).

### Upgrade
- Contextual upgrade prompts (hitting a Free limit, inviting 4th editor, requesting audit log).
- In-product comparison link when user explores locked feature.
- Stripe Checkout; annual / monthly toggle.

## 5. Outbound motion

### Account selection
- ICP score from fit + intent signals.
- Named account list refreshed quarterly.

### Cadence
- 10-touch sequence over 21 days: email + LinkedIn + call + value add (content / event invite).
- Personalised first message; templated only after first reply.
- Honest subject lines; no fake re-threading ("Re: from last week" when we never wrote).

### Metrics
- Reply rate > 8%.
- Positive reply rate > 3%.
- Meeting rate > 2% of outreach.
- Meeting-to-opportunity conversion > 30%.

### Tooling
- HubSpot Sequences (or Outreach later).
- LinkedIn Sales Navigator.
- Apollo / Clay for enrichment.

No mass spam; no purchased lists we haven't vetted.

## 6. Referral programmes

### Customer referrals
- Any paying customer who refers a closed deal gets a $1,000 credit on their next renewal or a donation to the charity of their choice.
- Named programme, public landing page, simple form.

### Partner referrals
- Registered SI / consultancy partners receive 20% first-year revenue share on referred deals.
- Partner portal (post-seed): deal registration, training materials, co-marketing kit.

## 7. Events & field marketing

### First-year plan
- 2 keynote / headline sponsorships at flagship industry events.
- 4 workshops or booth presences at developer-oriented conferences.
- 2 founder-hosted dinners in NYC / SF / London.
- 6 field events co-hosted with partners.

### Play at each event
- Pre-event: 2-week outreach.
- At event: demos, swag, signup QR.
- Post-event: 7-day follow-up window with tailored notes.

## 8. Community as acquisition

- Public Discord / Slack.
- Monthly AMA with the team.
- Certification programme for ontologists (beta badge → full certification post-launch).
- User-generated content encouraged with credits and shout-outs.
- Job board on the community site.

## 9. Partner-sourced acquisition

See [PARTNERSHIPS.md](PARTNERSHIPS.md). Channels:

- Systems integrators (implementation + referral).
- Graph DB vendors (Neo4j, Stardog).
- Cloud marketplaces (AWS, Azure, GCP) — post Series A.
- Data catalogue vendors (integration partnerships).
- Academic / research partners (citations drive SEO).

## 10. Experiments queue

Every week we pick 1–2 experiments from the backlog. Standard template:

- Hypothesis.
- Audience and size.
- Treatment.
- Control.
- Metric and target uplift.
- Runtime.
- Decision criteria.

Examples:
- "Adding a sample ontology picker on signup increases activation by 5 points."
- "A free-ontology-migration offer increases outbound reply rate by 50%."
- "Pricing page with ROI calculator increases upgrade by 10%."

Results logged in `docs/07_business/experiments/` and shared in the weekly scorecard.

## 11. Attribution & measurement

- First-touch and last-touch attribution reported together.
- Self-reported "how did you hear about us?" on signup.
- UTMs on every link.
- Weekly scorecard + monthly deep dive.

Do not chase vanity traffic. Chase qualified signups.

## 12. Customer Data Platform

Consolidated profile: traits, events, plan, workspace size, activation state, engagement score. Used for:

- Contextual in-app nudges.
- Segmented email.
- Churn-risk alerts to CS.
- Product analytics.

Stored with privacy-by-default: no PII in analytics beyond business necessity, PII redaction in logs.

## 13. Churn acquisition (recovery)

Lost customers aren't gone forever. Recovery programme:

- 30-day post-churn survey with genuine questions and no sales pitch.
- 6-month re-engagement email with new features that relate to their past friction.
- Annual "state of the category" long-form piece sent to lapsed champions.

## 14. Budget discipline

- CAC < $3k self-serve, < $15k mid-market, < $60k enterprise.
- Payback < 12 months (self-serve), < 18 months (mid-market), < 24 months (enterprise).
- Any channel exceeding these is cut, not optimised.

## 15. Ownership & cadence

- Growth lead owns the funnel (role initially covered by CEO + CMO jointly).
- Weekly acquisition stand-up (sales + marketing + product + CS).
- Monthly review with experiment outcomes and channel economics.
- Quarterly budget re-allocation.

## 16. Anti-patterns we avoid

- Signups optimised for volume over intent.
- Outbound that wastes prospects' time.
- Partnerships that exist on paper only.
- Programs that require customers to beg for the promised benefit.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Partnerships](PARTNERSHIPS.md) · [Customer Success](CUSTOMER_SUCCESS.md)
