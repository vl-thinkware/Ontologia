# Go-to-Market

How we take Ontologia to customers — what we sell, to whom, through which motions, at which stage.

---

## 1. GTM at a glance

Three parallel motions, each at a different speed and spend:

| Motion | Who it's for | Purchase path | Average ACV | Cycle |
|---|---|---|---|---|
| **Product-led (PLG)** | Individuals & small teams | Self-serve, credit card | $0–$5k | Minutes–days |
| **Mid-market sales** | 200–2k companies, single department | Assisted self-serve + PoV | $15k–$60k | 30–60 days |
| **Enterprise sales** | 2k+ companies, cross-team rollout | Sales-led, RFP, procurement | $60k–$300k+ | 60–180 days |

PLG feeds the mid-market pipeline. Mid-market proves the business case that the enterprise motion sells into other BUs.

## 2. Target segments (first 18 months)

### Primary — Enterprise AI / Data
- Job titles: Head of AI, Head of Data, CDO, Director of Knowledge Engineering, Principal Data Scientist, Ontologist.
- Industry-agnostic but leans towards financial services, manufacturing, retail, healthcare tech.
- Trigger events: AI initiative kicked off; data catalogue RFP; knowledge graph programme.

### Secondary — Regulated domains
- Pharma, life sciences, public sector.
- Slower cycle, longer deals, strong retention.

### Tertiary — API-first platform companies
- SaaS with a rich domain model they expose via API.
- Pain: partner schema drift.

### Developer / prosumer (PLG)
- AI engineers, RAG builders, technical founders.
- Free and Starter tier capture.

## 3. Messaging spine

**Headline**: "The collaborative ontology platform for teams building knowledge-rich products."

**Sub-heads by persona**:
- CDO: "Make your vocabulary a shared asset, not a dozen conflicting spreadsheets."
- Head of AI: "Give your agents and RAG pipelines a single source of truth you can version, review and trust."
- Engineering lead: "Design ontologies like code. Branch, diff, review, merge, ship."
- Knowledge architect: "Finally, a modern editor worthy of your discipline."

**Proof points**: canvas + diff demo, import from Excel / OWL, export to Neo4j / JSON-LD, SOC 2, EU data residency.

## 4. Channels

### Inbound
- SEO content hub (`ontologia.com/learn`) — long-form guides, comparison pages, tutorials.
- Open-source examples repo (`github.com/ontologia/examples`).
- Dev-advocate content — videos, talks, conference demos.
- Comparison pages (vs Protégé, vs TopBraid, vs "rolling your own"). Evenhanded and factual.
- Weekly technical newsletter.

### Outbound
- Targeted outreach to named accounts by SDRs (post-seed).
- Account-based approach: 100–200 named accounts with tailored plays.
- Email sequences + LinkedIn DMs from founders in month 0–6.

### Communities
- Sponsorships and presence at: Knowledge Graph Conference, The Graph Forum, O'Reilly Radar, Data Council, RE:WORK AI.
- Slack / Discord community for users and practitioners.
- Open-source ontology of the month featurette.

### Partners
- Neo4j (technology alliance).
- Systems integrators (EPAM, Thoughtworks, Slalom, Capgemini).
- Cloud marketplaces (AWS, Azure, GCP) — post Series A.

### Referral
- Explicit referral programme: 20% first-year commission for partners; credits for customers who refer.

## 5. Stages of the buyer journey

1. **Aware**: reads a comparison post, watches a demo video.
2. **Interested**: signs up Free / Starter, imports a small ontology.
3. **Evaluating**: invites colleagues, tries branches & reviews.
4. **Pilot / PoV**: scoped 2–6 week pilot with success criteria.
5. **Commit**: annual contract; security review; procurement.
6. **Expand**: more workspaces; adjacent teams; API usage.
7. **Advocate**: case study; conference talk; referrals.

Each stage has owned content and nudges (email, in-app, sales touches).

## 6. Product-led motion (PLG)

### Activation
- Sign-up frictionless (email or Google).
- First ontology template offered (e.g. "Sample pharmaceutical terms", "E-commerce catalogue").
- Canvas with one-click sample import so users see value within 5 minutes.
- In-app checklist: create 5 concepts, add a relationship, share with a teammate, commit.

### Conversion to paid
- Usage limits on Free (objects, contributors, history depth).
- Upgrade prompts surfaced in context, never intrusive.
- Starter → Pro: team size, branches, API, audit log are the Pro unlocks.

### Retention
- Weekly digest email on activity, reviews needed, API quota.
- Quarterly "your ontology's health" report with recommendations.

## 7. Sales motion (mid-market)

### Ideal deal shape
- 3–8 named users; single BU.
- Paid pilot or short evaluation.
- Annual contract, 1–2 years.

### Roles
- SDR qualifies and books.
- AE runs discovery → demo → PoV → close.
- Solutions engineer supports AE on technical fit.
- CSM onboards post-sale.

### Discovery questions
- What ontology work do you do today? Where does it live?
- Who depends on it? How does change happen?
- What's the blast radius when something's wrong?
- What AI or data-graph initiative does this support?
- What would a 10x improvement look like?

### Demo script
- Start with their vocabulary, not ours.
- Import their sample ontology live.
- Show canvas, then a realistic change with branch + review.
- Finish with an export to Neo4j or JSON-LD to demonstrate openness.

### PoV structure
- 2–6 weeks.
- Written success criteria signed by the buyer.
- Weekly check-in + end-of-PoV report.
- Pre-agreed commercial if success criteria met.

### Qualification (MEDDPICC-lite)
- Metrics, Economic buyer, Decision process, Pain, Champion, Competition.
- Honest disqualification — better than a long "maybe".

## 8. Enterprise motion

### Added requirements
- Master Services Agreement with legal and security riders.
- SSO, SCIM, audit logs.
- EU / US data residency.
- Dedicated CSM.
- Quarterly business reviews.
- Named Enterprise SE support.

### Procurement & security review
- Trust center (`ontologia.com/trust`) with SOC 2, pen test letter, DPA, sub-processor list.
- Standard questionnaire pre-answered; custom responses within 5 business days.

### Expansion
- Land with a BU; expand by publishing ontologies that other BUs want to reference.
- Executive sponsor program.
- Designated technical architect relationship.

## 9. Pricing & discounting discipline

- Self-serve list price is public and the default.
- Discounting starts at volume thresholds and multi-year commitments.
- We avoid aggressive quarter-end discounts; price stability builds trust.
- Grandfathering clause for early customers on price changes.

Detail in [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

## 10. GTM calendar — first 12 months

**Month 1–3 (pre-GA / design partner)**
- 10 design partners recruited; weekly sessions.
- Foundational SEO content (~20 articles).
- Private beta landing page collects waitlist.

**Month 4–6 (public beta)**
- Launch on Product Hunt, Hacker News, relevant subs.
- Open Starter tier self-serve.
- First conference talks and sponsorships.

**Month 7–9 (GA)**
- GA launch event.
- Enterprise tier opens with EU residency.
- First sales hires (AE + SDR).
- Case studies from design partners.

**Month 10–12 (scale)**
- Partner programme launched.
- 2–3 marketplace listings.
- First user conference (digital).

## 11. GTM tech stack

| Function | Tool |
|---|---|
| CRM | HubSpot |
| Email sequencing | HubSpot Sequences / Lemlist |
| Analytics | PostHog + Snowflake |
| Attribution | HubSpot + UTMs; no ad-tracking pixels early |
| Community | Slack or Discord (TBD) + Circle |
| Support | Intercom or Plain |
| Docs | Docusaurus on `docs.ontologia.com` |

Start lean; consolidate as we learn.

## 12. Metrics & dashboards

- Pipeline: SQLs, SAOs, win rate, cycle time.
- Acquisition: website visits, signups, activation.
- Revenue: ARR, NRR, GRR, churn, CAC, payback.
- Product: NSM (active editor weeks), feature adoption.
- CS: time to first value, time to second commit, NPS.

Weekly business review template in `docs/07_business/TEMPLATES/wbr.md` (post-GA).

## 13. Sales enablement

- Product 101 deck.
- Discovery call guide.
- Objection handling library.
- Competitor battlecards.
- ROI calculator.
- Technical deep-dive deck (for SE-led sessions).
- Reference stories library (anonymised and named).

## 14. What we will not do

- Pay-to-play reviews on G2 or elsewhere.
- Dark patterns in pricing or signup.
- Vague "AI" marketing that oversells.
- Discount-driven quarter ends that distort incentives.
- Chase logos at the expense of retention.

## 15. Ownership

- CEO owns GTM strategy until a VP Sales joins (~ Series A).
- Head of Marketing (first 3–6 months of GA) owns demand and content.
- CTO owns trust center and technical credibility.
- Every function reviews GTM effectiveness monthly.

Related: [Business Strategy](BUSINESS_STRATEGY.md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Customer Acquisition](CUSTOMER_ACQUISITION.md) · [Partnerships](PARTNERSHIPS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md)
