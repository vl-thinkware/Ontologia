# Go-to-Market

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)

How we take Semlify to customers with two founders, no paid ads, and cash we don't want to spend. Every motion here is designed to run on founder time, content, and reputation — not on an SDR team we cannot afford.

> **Baseline reality.** Two people (Valentin on product + commercial, Alexandre on engineering). No fundraising assumed. No paid acquisition until unit economics and product are both healthy. Win the first 15–25 paying logos founder-to-founder, publish everything we learn, and let content compound.
>
> **One product, one narrative.** Semlify is an ontology editor. The sell is "model your concept world at whatever depth you need, host many taxonomies on a single T-Box, export SKOS or OWL, plug it into your AI / catalogue / search." We compete against enterprise taxonomy management (PoolParty, TopBraid EDG, Protégé) and data catalogues (Collibra, Atlan, DataHub) — positioned as developer-friendly, API-first, ontology-native, and priced an order of magnitude below the incumbents.

---

## 1. GTM at a glance

Two motions only in Year 1. A third unlocks when we have reference customers and a repeatable discovery pattern.

| Motion | Who it's for | Purchase path | Typical ACV | Cycle | Who runs it in Y1 |
|---|---|---|---|---|---|
| **Self-serve PLG** | Builders kicking the tyres on Team | Sign-up → 14-day trial → credit card | $4,990 | 1–21 days | Product-led; no human touch unless asked |
| **Founder-led sales** | Mid-market (100–2,000 employees) | Inbound or warm outbound → 2–3 calls → paid pilot → annual | $22,000 (Business), $60k+ (Enterprise) | 30–90 days | Valentin |
| Enterprise motion | 2,000+ employees with procurement | Deferred — opportunistic only if inbound arrives | $60k–$120k+ | 60–180 days | Deferred to Year 2 unless a warm intro lands |

Team tier is the PLG engine. Business is where founder-led sales pays the bills. Enterprise is a windfall until we have the team to service it properly.

## 2. Target segments (first 18 months)

### Primary segment A — Mid-market AI & data teams
- **Size**: 100–2,000 employees, one-to-three-person AI or knowledge team.
- **Titles**: Head of AI, Head of Data, Lead Knowledge Engineer, Principal Data Scientist, Ontologist, AI Platform Lead, Data Architect.
- **Why they buy**: they have a RAG or agent project in production, vocabulary drift is showing up in eval scores, and they do not have budget or headcount to build an authoring tool internally.
- **Why now**: AI initiatives shipped in 2024–25 are hitting their second year of maintenance; the "we'll manage it in a spreadsheet" answer is cracking.
- **Competition displaced**: Protégé, TopBraid Composer, PoolParty (for teams that don't need its text-classification stack), hand-rolled Neo4j projects, draw.io + Confluence.

### Primary segment B — Catalogue-heavy mid-market
- **Size**: 50–5,000 employees in e-commerce, automotive, media, publishing, legal, support, digital asset management.
- **Titles**: Taxonomist, Content Operations Lead, Category Manager, Metadata Specialist, Product Data Manager, Information Architect.
- **Why they buy**: a product catalogue plus two or three parallel taxonomies (body style, fuel type, segment, geography — the Cars shape) has outgrown the spreadsheet; incumbent SKOS tools (PoolParty, Synaptica, Smartlogic) force them into separate projects per taxonomy, which breaks whenever the shared schema moves.
- **Why now**: content systems, search, and AI tagging are all pulling on the same classifications at once; broken upstream terms break three downstream systems.
- **Competition displaced**: PoolParty, Synaptica, Smartlogic, CMS built-in taxonomy editors, Excel "master lists".

### Primary segment C — Data governance and compliance teams
- **Size**: 100–5,000 employees; often in data governance, compliance/risk, or a founding PM function at Series B+ companies.
- **Titles**: Data Governance Lead, Data Steward, Compliance PM, Head of Data Strategy, Product Manager for a governance initiative.
- **Why they buy**: Confluence / Notion glossaries rot; data catalogs (Collibra, Alation, Atlan) lock the glossary inside the data team and cost far more than a governance PM's budget. Semlify lets them own a small ontology (a handful of classes, one or two schemes) that their downstream data catalog then consumes via JSON-LD.
- **Why now**: AI copilots inside the company need a vetted, versioned definition source; regulation (EU AI Act, SR-11-7 for banks, HIPAA) is adding real audit requirements.
- **Competition displaced**: Confluence, Notion, Google Docs, the glossary module of Collibra / Alation / Atlan (as a standalone-then-feed pattern).

### Secondary — regulated mid-market (pharma, life sciences, finserv compliance, public sector research)
- Longer cycle but excellent retention.
- Frequently runs multi-scheme ontologies — a pharma company might have one ontology with a compliance glossary scheme, a study-type taxonomy, and a drug-interaction section all sharing the same T-Box.
- Often needs EU residency, audit log, SSO from day one.
- Do not chase before we have SSO + audit log shipped (M8 / S5).

### Tertiary — API-first product companies
- SaaS with a rich domain model exposed via API.
- Pain: partner schema drift, catalogue inconsistencies across partners.
- Good for expansion stories; rarely the first deal.

### Developer / builder tier (PLG inbound)
- AI engineers, RAG builders, technical founders, research labs.
- Free tier captures them; some graduate to Team once they hit usage limits.
- We do not spend on this segment; we serve it well so content compounds.

> **Who we are not chasing in Year 1**: Fortune 500 enterprise procurement, public-sector RFPs, any deal that needs a 6+ month security review before a pilot. We'll be ready for those by the time they find us — not before.

## 3. Messaging spine

**Master headline** (semlify.com homepage): "The source of truth for your concepts."

**Sub-head**: "One ontology editor. Classes, relation types and many taxonomies on a shared schema — with change history, a versioned API, and SKOS, OWL and JSON-LD exports your pipelines already know how to read."

**Hero demo**: the Cars ontology. In under three minutes, a viewer sees 9 classes, 13 relation types and 5 ConceptSchemes living on a single T-Box, with the canvas, the tree, the tables, a tag and an SKOS export.

### Key narrative pillars

1. **Ontology-native, not taxonomy-retrofitted.** Every artefact in Semlify is an Ontology. Taxonomies are first-class citizens (ConceptSchemes inside the ontology) but they don't force the product into a SKOS-only corner.
2. **One T-Box, many taxonomies.** The differentiator nobody else has in a modern UX: add a taxonomy to an existing ontology in two clicks; it automatically inherits the T-Box.
3. **Modern web UX with the discipline of an ontology editor.** Canvas that feels as fast as Figma; Schema view that a data architect respects; Taxonomies tree a maintainer loves.
4. **Versioned like your code (without the complexity of git).** Change history, revert, tags, tag-to-tag diff. Branches and reviews deferred and explicitly called out.
5. **API-first.** API Playground on day one; JSON-LD, SKOS, OWL, CSV exports from the same modal.

### Sub-heads by persona
- Data Architect: "Design the T-Box with classes, relation types, domain/range and rich attributes. Evolve it safely even when a dozen schemes depend on it."
- Catalogue Maintainer: "Tree-native UX, drag-drop reparent, bulk deprecation, AI-assisted synonyms and translations — all inside the same ontology."
- Platform Engineer: "An API your RAG or catalogue pipeline can pin to. Webhook on change. JSON-LD, SKOS, OWL, CSV from the same endpoint."
- Founder / commercial buyer: "Workspace pricing. Unlimited editors. Public pricing page. One tier whether you model with 3 classes or 300."

**Proof points**: live Cars-ontology demo, CSV import wizard, Export modal with live preview, API Playground with copy-as-cURL, change events with revert, tag-to-tag diff, Validation panel, AI suggestions panel.

### Category play
We do not fight for the word "ontology management tool" in isolation — that category is small and heavily occupied by legacy names. Our category story is **"concept infrastructure for AI and content"**. We position against:
- **Rolling your own** (everyone) — "stop rebuilding the same editor every two years".
- **Legacy desktop ontology tools** (Protégé, TopBraid) — "a modern web editor that respects the discipline".
- **Enterprise taxonomy platforms** (PoolParty, TopQuadrant, Smartlogic / Semaphore, Graphwise) — "one T-Box, many taxonomies, 10× cheaper at entry, API-first".
- **Data catalog glossaries** (Collibra, Atlan, Alation) — "the upstream their glossary should consume, with richer structure and a clean JSON-LD feed".

Full detail in [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md).

## 4. Channels

### Inbound — where we spend our time
- **Content hub** at `semlify.com/learn`, organised by use case (not by "mode"):
  - "Designing a T-Box" track — for architects. Topics: class design, relation types, domain/range, evolving schemas safely.
  - "Running a catalogue" track — for maintainers. Topics: multi-taxonomy design, SKOS interop, bulk edits, deprecation workflows, AI-assisted curation.
  - "Pipelines & AI" track — for platform engineers. Topics: JSON-LD export patterns, SKOS for search / CMS / DAM, SPARQL and Cypher, webhooks, tagged snapshots as RAG anchors.
- **Open source**: examples repo at `github.com/semlify/examples` with a Cars reference ontology, a product-reference mini-ontology, import/export CLIs, `semlify.dev` developer portal.
- **Technical writing by the founders**: engineering deep-dives by Alexandre, product and market pieces by Valentin. Syndicated to Hacker News, LinkedIn, relevant subreddits (r/LocalLLaMA, r/ragdev, r/informationscience, r/taxonomy, r/dataengineering).
- **Comparison pages** — factual, linked, updated quarterly:
  - Semlify vs Protégé — web vs desktop, collaboration, versioning.
  - Semlify vs TopBraid EDG — pricing, UX, API-first.
  - Semlify vs PoolParty — multi-taxonomy on one T-Box, pricing, SKOS round-trip.
  - Semlify vs TopQuadrant / Graphwise — scope and price positioning.
  - Semlify vs Collibra / Atlan / Alation glossaries — upstream vs in-catalog, editability, feed-first pattern.
  - Semlify vs Semaphore — classification scope and pricing.
  - Semlify vs "rolling your own" on Neo4j / Stardog.
- **Short demo video library** tied to the top SEO pages. ~3 minutes each, Cars ontology demo as the anchor.

### Outbound — narrow, warm, founder-signed
- 10–15 personalised emails per week from Valentin during Y1 months 3–12. Named accounts only, researched, offering a specific insight (not a meeting).
- Zero SDR cadences. Zero sequencer. Zero generic cold outreach.
- LinkedIn DMs to people who engaged with our content (warm signal) — no scraped lists.

### Communities — presence, not sponsorship
- Knowledge Graph Conference slack, The Graph Forum, r/LocalLLaMA, r/ragdev, Data Council community, LinkedIn ontology groups.
- Taxonomy Bootcamp community, Taxodiary, LinkedIn Taxonomy and Thesaurus Design group, ISKO mailing lists, r/taxonomy, r/informationscience.
- Data Governance slack / LinkedIn groups, CDO Club, Metadata Management community, r/dataengineering threads on governance.
- Speak at practitioner-heavy events where a talk slot is free; sponsor at most one event in Y1 if budget allows (< $5k).
- Host a small user Slack from day one with channels by use case (`#architecture`, `#catalogues`, `#api-and-pipelines`, `#general`).

### Partners — opportunistic, not structured
- Neo4j (technology alliance) — easy wins since we export to Cypher-friendly formats. Listing on their partner page is free.
- No systems integrator programme until we have 20+ paying logos and a person who can own it.
- Cloud marketplaces deferred until Year 2–3.

### Referral — built in, not financial
- "Share your ontology" public-link feature. Free editor invites within any paid workspace.
- No cash commissions in Y1; a "refer a customer, get three months free" credit line is enough.

### Paid acquisition — off
- No Google Ads, LinkedIn Ads, retargeting, or sponsored newsletters in Year 1.
- First paid test happens only when (a) a channel already works organically and (b) paid CAC projections beat our $300 / $2,500 / $8,000 bootstrap bands across Team / Business / Enterprise (see [UNIT_ECONOMICS.md](../08_finance/UNIT_ECONOMICS.md)).

## 5. Stages of the buyer journey

1. **Aware**: reads a comparison post, watches the Cars-ontology demo, follows Valentin or Alexandre on LinkedIn.
2. **Interested**: signs up Free, creates an ontology from the Catalog-with-multi-taxonomies starter, invites a colleague.
3. **Evaluating**: hits Free limits or starts using the API; books a 20-minute call with Valentin.
4. **Pilot / PoV** (Business+): scoped 2–4 week pilot on a Team workspace with written success criteria; upgrade to Business once criteria met.
5. **Commit**: annual contract — Team ($4,990 / yr self-serve) or Business ($19,900 / yr with light MSA).
6. **Expand**: more workspaces, higher API tier, AI add-on, Enterprise conversation at year-2 renewal.
7. **Advocate**: public case study, conference talk together, referral to adjacent team.

## 6. Product-led motion (Team tier)

### Activation
- Sign-up frictionless (email or Google via Clerk).
- "New ontology" modal with three starters — Blank, Product reference, Catalog-with-multi-taxonomies — on first load.
- First-run tooltip ring: Schema → Canvas → Tree → Export modal.
- In-app checklist: add 1 class, add 1 scheme, add 5 concepts, create a tag, run the Export modal once.
- Time-to-first-tag target: under 10 minutes. Tracked weekly; see [FEATURES.md](FEATURES%20(imported%20to%20notion).md).

### Conversion Free → Team
- Soft limit on Free at 500 concepts / 5k API calls per month.
- In-context upgrade prompts only when the user hits the wall; never on load.
- Team unlocks: multi-workspace, long-lived API keys, webhooks, unlimited editors, priority email support.
- Founder inbox (`valentin@semlify.com`) on every upgrade screen for anyone who wants to talk.

### Retention
- Weekly digest (opt-out): new change events, API quota used.
- Quarterly "your ontology health" email: orphans, duplicate candidates, cycle warnings, deprecated-still-referenced — the Validation panel turned into email.

## 7. Founder-led sales motion (Business tier)

### Ideal deal shape
- One workspace, one team, one owner who will champion internally.
- Paid pilot ($2–5k one-time) or a 2–4 week free pilot with an email commitment to upgrade on success.
- Annual contract on Business ($1,990 / mo or $19,900 / yr), 1-year term.

### Founder roles (Year 1)
- Valentin runs discovery, demo, PoV coordination, close, handoff.
- Alexandre joins the technical deep-dive call for Business+ deals (one call per opportunity, timeboxed 45 minutes).
- CSM work is Valentin's too, for the first ten customers. Direct Slack or WhatsApp channel with every early customer.

### Discovery questions
- What concept work do you do today — what classes, how many taxonomies, where does it live (Excel, Confluence, PoolParty, Protégé, Collibra, homegrown)?
- Who depends on it? How does a change reach them?
- What's the blast radius when something's wrong in production?
- Which downstream initiative does this support (RAG, agent, data catalog, search, content tagging, compliance reporting)? What does that initiative need to hit this quarter?
- Do you need multiple taxonomies sharing the same model (the classic e-commerce / automotive shape)? How do you handle that today?
- What would a 10× improvement look like — and what would it unlock?

### Demo script (45 minutes)

1. Recap of discovery in their language (5 min).
2. Import a sample of their data — CSV / SKOS they sent ahead, or the Cars reference if we're still abstract (10 min).
3. Walk the four core views: Schema (T-Box), Canvas in both modes, Taxonomies tree with drag-drop reparent, Tables with a bulk deprecate (10 min).
4. Edit a concept, save, show the change event; revert the change live, then revert the revert (5 min).
5. Create a tag, open the API Playground, pull the tagged snapshot, flip to the Export modal and download SKOS Turtle (10 min).
6. Security & control: workspace roles, container-scoped roles on ontology vs scheme, audit trail, SSO roadmap (5 min).

We do not demo branches or reviews in Y1 — they aren't shipped. If a prospect asks, we're honest: "We deferred them because 95% of the operational need is covered by change events plus revert plus tag-to-tag diff. We'll ship them when two paying customers tell us they need them."

### PoV structure
- 2–4 weeks (not 6 — we don't have a CSM team to carry long pilots).
- Written success criteria co-signed by the buyer. Example: "At the end of the pilot, three people from our team have co-edited the ontology; we've deprecated at least one concept with a replacement pointer; our RAG eval score using the exported JSON-LD matches or exceeds our current baseline."
- Weekly 20-minute check-in with Valentin.
- End-of-PoV email with outcomes and a signed order form ready to go.

### Qualification (MEDDPICC-lite)
- Metrics: what KPI moves if this works?
- Economic buyer: named, reachable, has approved the number.
- Decision process: stages and owners written down.
- Pain: real and current, not theoretical.
- Champion: someone who will defend the line item at budget time.
- Competition: including "do nothing" and "have a junior engineer build it".

At least five of these are explicit before a PoV starts.

## 8. Enterprise motion (opportunistic in Year 1)

We do not actively pursue enterprise deals until (a) SSO + SAML + audit log are shipped and (b) SOC 2 Type I readiness is underway.

If a warm inbound arrives before then, we take the call, set expectations honestly, and offer a "Business Plus" commercial arrangement (Business tier on a dedicated Neo4j Aura instance, custom contract, light SLA) while the Enterprise surface area ships.

Full enterprise requirements (MSA, SSO, SCIM, SOC 2, residency, dedicated CSM, QBRs, named SE, analyst relations) come online progressively in Year 2. Detail in [ROADMAP.md](ROADMAP%20(imported%20to%20notion).md).

### Procurement & security readiness (as it ships)
- Trust center at `semlify.com/trust` with SOC 2 scope, penetration test letter, DPA, sub-processor list.
- Pre-answered security questionnaire for the ten most common frameworks (CAIQ, SIG Lite, a couple of regulated-industry ones).
- Standard response time on ad-hoc questions: 5 business days.

### Expansion
- Land one team, publish their ontology internally, let adjacent teams ask to consume it.
- Executive sponsor programme once we have three or more Enterprise customers.

## 9. Pricing & discounting discipline

- Self-serve list price is public at `semlify.com/pricing` and is the default.
- Annual contract already includes a discount (~17%) vs monthly — that's the "discount".
- Additional discounting: up to 15% on one founder's approval, 15–25% with both founders' approval, >25% documented as a customer-specific case. Detail in [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).
- No quarter-end pressure discounts — we do not have quarters to pressure.
- Grandfathering for early customers: any paying logo onboarded in the first 50 keeps their pricing for 24 months across price changes.

## 10. GTM calendar — first 12 months

**Phase 0 — Foundations (months 1–3, ~$25/mo infra)**
- Website live with pricing page. Landing page collects waitlist.
- Content hub seeded with 6–8 foundational articles.
- 5 design partners recruited via founder networks — free access, weekly 30-minute sessions, explicit "we'll use your feedback" agreement.

**Phase 1 — MVP design partners (months 4–6)**
- MVP shipped to design partners; weekly cadence.
- 15–20 articles on the content hub.
- Open a waitlist for public Free tier.
- Valentin speaks at one practitioner event.

**Phase 2 — Paid launch (months 7–9, Stripe live, target 10 paying logos)**
- Public launch on Product Hunt, Hacker News, LinkedIn. Cars-ontology demo is the hero.
- Free tier self-serve.
- Team tier self-serve with Stripe checkout.
- Business tier via Valentin-led calls.
- First two paid customers per primary segment get founder onboarding and appear (with permission) as first case studies.

**Phase 3 — GA ramp (months 10–12)**
- SSO + SAML ship — unlocks first Business-tier regulated buyers.
- AI pack ($199/mo add-on) ships.
- MCP server ships — drives builder inbound.
- Webhooks + first connectors (dbt, DataHub) ship.
- Target: 15–25 paying logos, $10–15k MRR.

## 11. GTM tech stack (lean)

| Function | Tool | Cost |
|---|---|---|
| CRM | Notion database (Y1) → HubSpot free tier when >30 deals tracked | $0 → $0 |
| Email sequencing | Hand-sent from Valentin's inbox (Y1) | $0 |
| Analytics | PostHog self-hosted cloud free tier | $0 |
| Attribution | UTMs + "how did you hear about us?" on signup | $0 |
| Community | Slack free tier | $0 |
| Support | Shared inbox (`support@semlify.com`) via Resend / Plain free tier | $0 |
| Docs | Docusaurus on `docs.semlify.com` (Vercel free tier) | $0 |
| Demo / landing video | Loom free tier | $0 |

Total GTM stack spend target for Year 1: under $100 / month.

## 12. Metrics & dashboards

Weekly scorecard, reviewed every Monday (Valentin + Alexandre, 20 minutes).

- **Pipeline**: qualified conversations, paid pilots active, Business deals in proposal.
- **Acquisition**: landing-page visits, Free signups, starter-template selection mix (Blank / Product reference / Catalog-with-multi-taxonomies), Free → Team conversion, Team → Business conversion.
- **Revenue**: MRR, new MRR, expansion MRR, churn MRR, net new MRR, cash in bank.
- **Product usage**: weekly active editors, change events per ontology, schemes per ontology (the multi-taxonomy depth indicator), API calls, export format mix (JSON-LD vs SKOS vs OWL vs CSV).
- **CS**: time to first tag (<10 min median target), time to tenth change event, NPS (once we have 20+ responses).

Dashboard lives in a single PostHog board + a one-tab Google Sheet. No weekly business review deck in Year 1.

## 13. Sales enablement (Year 1 asset list)

Minimum viable library maintained by Valentin:
- Product 101 deck (15 slides, living doc).
- Cars-ontology demo recording (5 minutes).
- Discovery call guide (this document's section 7).
- Objection handling library — one-pager, see [SALES_PLAYBOOK.md](SALES_PLAYBOOK.md).
- Competitor battlecards — one page per, quarterly refresh.
- ROI napkin math (not a calculator) — "if this saves one RAG regression per quarter, or prevents one catalogue-wide relabel from breaking downstream, it pays for itself".
- Technical deep-dive deck (Alexandre's slides, for SE-style calls).
- Two reference customer stories by month 9 (anonymous or named depending on permission).

## 14. What we will not do

- Pay-to-play reviews on G2 or elsewhere.
- Dark patterns in pricing, signup, or cancellation.
- "AI solves everything" marketing.
- Quarter-end discount scrambles.
- Chase logos we cannot service well.
- Hire an SDR before we've proven the founder-led motion to at least 25 paying logos.
- Take fundraising meetings that come with board seats before Business-tier deal mechanics are boringly repeatable.

## 15. Ownership

- **Valentin** owns GTM strategy, content calendar (30%), commercial (25%), marketing spend (20%), founder-led sales.
- **Alexandre** owns technical credibility (engineering blog, conference talks, open-source repos, trust center content), ~10% of his time — the rest is product.
- Founder standup every Monday on GTM; asynchronous update in Slack on Wednesday and Friday.
- First GTM hire (Year 2) is a generalist full-stack marketer who can write, edit video, run community, and segment an email list.

Related: [Business Strategy](BUSINESS_STRATEGY%20(imported%20to%20notion).md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Marketing Strategy](MARKETING_STRATEGY.md) · [Customer Acquisition](CUSTOMER_ACQUISITION%20(imported%20to%20notion).md) · [Partnerships](PARTNERSHIPS.md) · [Pricing Model](../08_finance/PRICING_MODEL.md) · [Unit Economics](../08_finance/UNIT_ECONOMICS.md) · [Roadmap](ROADMAP%20(imported%20to%20notion).md)
