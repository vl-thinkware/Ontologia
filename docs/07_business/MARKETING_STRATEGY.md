# Marketing Strategy

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v4 (ontology-only product)

How two founders build awareness, educate the mid-market, and generate qualified pipeline without a marketing budget. Every dollar spent on marketing in Year 1 must be defensible against the cash-in-bank chart.

> **Operating reality.** No paid ads in Year 1. No agency. No analyst relations. No DevRel hire. Two founders write everything, publish everything, and the company earns trust by being consistently useful on the public internet.
>
> **One product, one story.** Ontologia is an ontology editor. The story is "model your concept world at whatever depth you need — classes, relation types and as many taxonomies as you want on a single T-Box — with change history, an API, and SKOS / OWL / JSON-LD exports your pipelines already know how to read." We don't sell three tools in one; we sell one tool that makes the three-tools-in-one problem disappear.

---

## 1. Marketing goals by phase

Phase labels match [ROADMAP.md](../00_overview/ROADMAP.md).

**Phase 0 — Foundations (months 1–3)**
- Landing page and waitlist live.
- 8–10 foundational articles on the content hub by month 3.
- 500 waitlist signups from founder network + first article syndication.

**Phase 1 — MVP design partners (months 4–6)**
- 20–25 articles total.
- First founder conference talk or podcast appearance.
- 2,000 waitlist signups; 5 design partners actively using the product.

**Phase 2 — Paid launch (months 7–9)**
- Public Free tier opens; Stripe self-serve Team tier live.
- Product Hunt + Hacker News + LinkedIn launch moment — the Cars-ontology demo is the hero.
- 5,000 website visits / month by end of month 9.
- 200 Free-tier signups per month; 5% Free → Team conversion.

**Phase 3 — GA ramp (months 10–12)**
- 10,000 visits / month.
- 500 Free signups / month.
- ~20% of Business-tier pipeline originated from content or community (the rest from warm intros and founder outreach).
- One flagship report ("State of Concept Infrastructure 2026").

**Year 2 aspirational** (only if unit economics hold):
- 40–60k visits / month.
- Self-sustaining practitioner community.
- First generalist marketing hire.

We do not chase vanity traffic. A smaller audience of the right buyers beats 10× traffic of the wrong ones.

## 2. Brand positioning

**Master tagline** (ontologia.com): "The source of truth for your concepts."

**Sub-head**: "One ontology editor. Classes, relation types and as many taxonomies as you need — on a shared T-Box, with change history, a versioned API, and SKOS / OWL / JSON-LD exports."

**Hero demo across the site**: the Cars ontology (9 classes, 13 relation types, 5 ConceptSchemes) rendered live on the landing page. It answers the question "what does this product actually do?" in a single scroll.

**Supporting narrative**:
- Concepts deserve the same care and tooling as code — but without the cognitive weight of git for domain experts.
- Ontologies are living systems that need change history, revert, and a trustworthy API — not branches, merges, and pull requests. (At least not yet.)
- AI doesn't solve the structure problem. Good structure — a typed graph with classes, relation types and hierarchical schemes — makes AI work.
- One ontology, many taxonomies, one T-Box. It's the shape of real-world catalogues (automotive, retail, media, pharma) and nothing else ships it as a first-class product.

**Tone of voice**:
- Clear, technical, confident, humble.
- Honest about what we have and haven't shipped.
- Evidence over claims — show before tell, link our sources.
- Quietly funny where warranted; never performative.

**What we don't say**:
- "Three tools in one" — we used to; we don't any more. It undersold the integrated model.
- "Revolutionary". "10×". "Disruptor". "AI-native" without a concrete meaning.
- "Enterprise-grade" before we're actually enterprise-grade.
- Anything a generic AI content farm could have written.

See also: [BRAND_GUIDELINES.md](../04_design/BRAND_GUIDELINES.md).

## 3. Audience segments

- **Data Architects** (primary authoring persona) — design the T-Box. Want Schema-view ergonomics, domain/range rigour, clean OWL / JSON-LD export.
- **Catalogue Maintainers** (primary authoring persona) — run schemes day-to-day. Want Taxonomies tree, drag-drop reparent, bulk edits, AI-assisted curation, SKOS Turtle.
- **Platform Engineers / LLM engineers** (consumer persona) — pull the ontology through the API. Want a versioned endpoint, webhook-on-change, JSON-LD/SKOS/OWL/CSV from the same place.
- **Champions / buyers** — anyone senior enough to push a procurement cycle and defend a $5k or $20k line item. Head of AI, Head of Data, VP Content, VP Merchandising, CDO, Head of Data Strategy.

One brand, one product, multiple personas meeting inside it.

## 4. Positioning pillars

1. **Ontology-native.** Every artefact is an ontology. Taxonomies are first-class, but they're ConceptSchemes inside an ontology — so your schema lives in one place and your taxonomies reuse it.
2. **One T-Box, many taxonomies.** The differentiator: in the Cars demo, 5 ConceptSchemes share 9 classes and 13 relation types. No other mid-market tool handles this shape in a modern UX.
3. **Figma for concepts.** Visual, collaborative, browser-native. Four primary views — Schema, Canvas, Taxonomies tree, Tables — plus a full Concept detail. Canvas opens on Schema mode by default; flip to Taxonomies mode for A-Box work.
4. **Versioned like your code (without the complexity of git).** Change history, revert, tags, tag-to-tag diff, validation panel, deprecation + replacement workflow. Branches-and-merges are explicitly deferred; we lean into that as a feature, not a gap.
5. **API-first with an in-app Playground.** Any feature in the UI is available via REST. JSON-LD / SKOS Turtle / OWL RDF-XML / CSV exports from a single modal, scoped to the full ontology or a single scheme.

Every campaign ties back to at least one pillar.

## 5. Content strategy

### Content hub: `ontologia.com/learn`

Organised by **use case**, not by tool mode:

**Designing a T-Box** (architect audience)
- Primers: "What is an ontology T-Box?", "Classes vs relation types vs attributes", "When do you add a class?"
- How-tos: "Designing the Cars T-Box from scratch", "Evolving a schema under a production scheme", "Migrating from Protégé / OWL", "Domain and range done right".
- Deep dives (Alexandre): "Change events as an alternative to git-for-data", "Building an optimistic-concurrency editor on Neo4j + Postgres", "Why we deferred branches and merges".

**Running a catalogue** (maintainer audience)
- Primers: "SKOS in 15 minutes", "ConceptScheme patterns for product catalogues", "Hierarchical vs faceted classifications".
- How-tos: "Moving a taxonomy off a spreadsheet", "Bulk rename without breaking downstream tagging", "Deprecate a concept with a replacement pointer", "Using AI suggestions without losing your mind".
- Case studies: anonymised wins from design partners.

**Pipelines & AI** (platform engineer audience)
- Primers: "JSON-LD for people who only wrote JSON", "What is an ontology tag and why pin your RAG to it?"
- How-tos: "Pin your RAG pipeline to an ontology tag", "Consume SKOS Turtle into a CMS / DAM", "Webhook fan-out to multiple downstream indices", "The API Playground as your first integration call".
- Reference: API guide, SDKs, MCP server, webhooks spec.

**Cross-cutting / shared**
- Market pieces (Valentin): "What mid-market teams actually pay for knowledge tooling", "One T-Box, many taxonomies: why the shape matters", "The workspace-price pattern for collaboration SaaS".
- Comparison pages (see [COMPETITIVE_ANALYSIS.md](COMPETITIVE_ANALYSIS.md)): Ontologia vs Protégé, vs TopBraid EDG, vs PoolParty, vs Collibra / Atlan / Alation glossaries, vs Graphwise, vs Semaphore, vs "rolling your own".

### Formats
- Long-form articles (1,500–3,500 words). The backbone.
- Short posts (500–800 words) for tactical pieces and weekly cadence.
- 3–5 minute screencasts by Alexandre ("here's how we built X this week").
- Sample ontologies repo on GitHub, with MIT licence. Cars is the anchor example; product-reference and a domain-ontology sample join later.
- Interactive demos embedded on key landing pages — the Cars ontology runs live in the hero.

### Content calendar (founder-sustainable)
- **1 long-form article per week** at steady state (alternating Valentin and Alexandre).
- **1 short post per week** from the other founder.
- **1 video per month** — not per week. Videos worth watching, not content farms.
- **1 customer / use-case piece per month** once we have paying logos.
- **1 seasonal campaign per quarter** tied to a conference, product launch, or report.

If a week goes by without content, that's acceptable — but we review it. The content engine is a signal of how we're doing on everything else.

### Editorial standards
- Fact-checked; linked sources.
- Every comparison mentions at least one genuine strength of the competitor. No hit pieces.
- Performance or cost claims are reproducible. Public notebooks or repro scripts when possible.
- Author byline, last-updated date, and a short "what we got wrong" note when we update.
- AI-assisted drafts are fine. AI-written, human-skimmed content is not allowed. The reader can tell.

## 6. SEO strategy

### Principles
- Target high-intent, low-competition keywords first (long tail).
- Build topic clusters — each hub page linked from 5–10 supporting pieces.
- Technical SEO baseline: Core Web Vitals green on every page, structured data, clean internal linking, fast Vercel / Next.js hosting.
- Build backlinks through guest posts, practitioner interviews, open-source contributions, and being useful in community discussions.
- Quarterly audit. Zero black-hat.

### Target metrics (organic)
- 30 ranking keywords in the top 20 by month 9.
- 50 keywords in the top 10 by month 12.
- Organic traffic doubling QoQ for three consecutive quarters post-public launch, then normalising.

### Key clusters to build first

- **"Ontology editor"** / **"ontology management"** (mid-volume, moderate competition).
- **"SKOS editor"** / **"SKOS management"** / **"PoolParty alternative"** / **"Synaptica alternative"** (highest intent, mid-volume).
- **"Protégé alternative"** / **"TopBraid alternative"** (long tail, high intent).
- **"RAG + knowledge graph"** / **"ontology for RAG"** (builder audience).
- **"Taxonomy management for e-commerce / automotive / media / legal"** (vertical long tail).
- **"Collibra alternative glossary"** / **"Alation alternative glossary"** (migration intent, at the glossary-only angle).
- **"Modern data stack knowledge layer"** / **"AI grounding source of truth"** (emerging volume).

## 7. Community & developer relations

- Public Slack community from month 1 of Phase 2. Hosted free tier. Channels: `#general`, `#showcase`, `#help`, `#architecture`, `#catalogues`, `#api-and-pipelines`, `#feature-requests`, `#changelog`.
- Monthly community call at 30 minutes — product update, one community member's demo, open Q&A.
- Open-source sample repos: `ontologia/examples` (Cars reference ontology, product-reference sample, vertical starters), `ontologia/sdk-js`, `ontologia/import-cli`.
- Hackathons are deferred until we have a community of > 500. No point running one into an empty room.
- Sponsorships: at most one event in Year 1 if it's a practitioner event with < $5k sponsorship tier. Otherwise attend as speakers only.

### Where we show up

- **Conferences**: Knowledge Graph Conference, Data Council, FOSDEM data/ML track, Taxonomy Bootcamp, ISKO (International Society for Knowledge Organization) regional events, DAM Europe / DAM NY, CDOIQ Symposium, Data Governance Conference, practitioner meetups.
- **Podcasts**: TWIML, Data Engineering Podcast, The Machine Learning Podcast, Software Engineering Daily, Taxonomy Talks, Information Architecture podcast, Content Strategy Podcast, Data Governance Today, Catalog & Cocktails.
- **Newsletters**: Gradient Flow, TheSequence, RAGtime, Taxodiary, Enterprise Knowledge Insights, CDO Magazine, Data Governance Institute pieces, practitioner newsletters.

### DevRel staffing
- Valentin + Alexandre are DevRel in Year 1. No hire.
- First community or DevRel hire not before Year 2 Q3, and only if the Free tier is producing > 200 weekly-active builders.

## 8. Product marketing

- Clear positioning docs for every major feature at launch — even the ones that feel small (Export modal, API Playground, AI suggestions panel, Validation panel, tag-to-tag diff).
- Launch rituals: blog post, 3-minute video, docs update, email to newsletter, LinkedIn post from both founders, Hacker News submission where it fits.
- Annual "State of Concept Infrastructure" report — flagship data piece covering the maturity of glossary, taxonomy and ontology practice and the pattern of multi-taxonomy-on-one-T-Box as it shows up in the wild. First edition by month 10.
- Pricing page is a product surface: maintained, updated, with a live comparison table and a FAQ that covers the hard questions (workspace vs seat, annual discount, what counts as a workspace, does tier X cover N schemes).
- In-app education: tooltips, contextual guides, starter templates on first load, empty-state CTAs.

## 9. Campaign playbook

Each campaign has:
- One clear audience and one clear promise.
- Primary content asset (a report, a free tool, a guide).
- Supporting content (social posts, newsletter issue, partner co-marketing when relevant).
- Measurable goals (signups, MQLs, attendance, report downloads with emails).
- Post-mortem 30 days after end. Written. One page.

### Year-one candidate campaigns

- **"Ontology fitness check"** — interactive tool evaluating an imported ontology's coverage, cycles, duplicates, deprecated-still-referenced. Requires sign-up. Gated download of the full report.
- **"Knowledge graphs make RAG smarter"** — evidence-based paper with reproducible benchmarks. Co-authored if we find a good partner.
- **"Migrate from Protégé / TopBraid"** — technical tutorial + open-source migration script.
- **"The SKOS audit"** — drop in a SKOS file, get a free report on missing `prefLabel`s, cycles, ambiguous alt labels, deprecated terms without replacement pointers.
- **"Migrate from PoolParty"** — step-by-step tutorial + import script + commercial migration offer (first 3 taxonomy customers get free migration).
- **"From Confluence to JSON-LD in one afternoon"** — guide + importer for teams with a glossary in Confluence.
- **"Cars in 60 seconds"** — rapid demo video walking the hero ontology end-to-end on the landing page.
- **"State of Concept Infrastructure 2026"** — flagship annual report. Published month 10.

We run at most one campaign at a time. Founder bandwidth is the real constraint.

## 10. Email marketing

- Double opt-in from day one.
- Newsletter frequency: weekly, cap one per week + launch moments + transactional.
- Newsletter mix: engineering, product, community, customer, practitioner spotlight.
- Segments: Free users, paying customers, waitlist, newsletter-only subscribers.
- Target metrics: open rate > 30% (stretch > 40%), CTR > 4%, unsubscribe < 0.5%.
- Tool: Resend + a simple segmentation layer we build on top. No Mailchimp.

## 11. Paid acquisition — off in Year 1

Zero paid spend in Year 1 on any of: Google Ads, LinkedIn Ads, Facebook/Instagram, Twitter/X promoted posts, sponsored newsletters, or affiliate networks.

Paid experiments unlock when:
- Organic content is producing at least 50 qualified Free-tier signups per week.
- Free → Team conversion is above 4%.
- We have written-down, reproducible CAC for each tier (Team, Business) from organic channels.

At that point: a single 30-day test on one channel with a $5k budget and kill criteria written before launch. Channel candidates: LinkedIn ABM to named accounts, Google brand defence, a sponsored slot in one practitioner newsletter.

No generic display, no programmatic, no influencer promos ever.

## 12. Events & conferences

- **Speak** at 2–4 practitioner conferences in Year 1 (free to submit, free to attend as a speaker).
- **Sponsor** at most one event at a low tier in Year 1 if a community-fit event needs it.
- **Host** — no user conference in Year 1; digital meetup in Year 2; in-person in Year 3.
- Side events (dinners, workshops) at major industry gatherings only if a customer is co-hosting.

Budget and ROI tracked for every event. No "logo placement" sponsorships.

## 13. Social & community media

- **LinkedIn**: primary for leaders, founders' voice, Valentin's commercial lens. Long-form 1–2× per week.
- **X / Bluesky**: primary for engineers and researchers. Alexandre's voice. 3–5 posts per week at steady state.
- **YouTube**: tutorials, conference talks, product walkthroughs. Monthly.
- **LinkedIn Ontology group, r/LocalLLaMA, r/ragdev, r/informationscience, r/taxonomy, Hacker News**: we participate, we don't spam.

We do not buy followers, run engagement pods, automate "thought leadership" posts, or hire ghostwriters.

## 14. Analyst & press

- Analyst relations deferred to Year 2. When we're ready: Gartner, Forrester, IDC for the enterprise story; RedMonk for the dev voice. Quarterly briefings once traction warrants it.
- Press: launch moments covered by a small group of technical journalists. Pitch list curated by Valentin. Avoid hype cycles.

## 15. Website & brand experience

- Fast, clean, accessible — we practise what we preach (see [ACCESSIBILITY.md](../04_design/ACCESSIBILITY.md)).
- Pages: home, product, use cases, pricing, trust, docs, learn, customers, changelog, company, careers, blog.
- Live, interactive Cars-ontology demo near the fold on the home page.
- Pricing page linked from every page; comparison table with competitors updated quarterly.
- Trust page with DPA, architecture overview, security posture, and a public roadmap snippet for SOC 2.
- Everything hosted on Vercel free or hobby tier in Year 1.

## 16. Measurement

### North-star metrics for marketing
- Qualified Free signups per week.
- Free → Team conversion rate.
- Team-tier MRR originated from self-serve.
- Business-tier deals sourced by content or community (vs by warm intro).
- Brand search volume (Google Search Console).

### Product-depth signal
- % of paying workspaces running more than one ConceptScheme (the multi-taxonomy value prop manifesting in the wild).
- Median classes-per-ontology and schemes-per-ontology across the paid fleet.

### Attribution (lightweight)
- Self-reported "how did you hear about us?" on signup, plus "what are you building today?" (open-ended, to avoid forcing a mode label).
- UTMs on all campaigns.
- PostHog for funnel analytics.
- Google Sheet for monthly roll-up. No attribution platform in Year 1.

### Reporting cadence
- Weekly scorecard (Monday) — headline numbers.
- Monthly review with both founders (second Friday of the month) — deep-dive into the weakest funnel that month.
- Quarterly deep dive and content retrospective.

## 17. Anti-hype pledge

- No misleading AI claims. We don't say "AI understands your ontology" or "self-improving knowledge graph".
- No fake benchmarks. Every performance claim is reproducible.
- No paid reviews, no astroturfing.
- No dark patterns in signup, cancellation, or email consent.
- Customer quotes are verified, attributed where permitted, and updated or removed when the relationship ends.

## 18. Team & budget

### Year 1
- **People**: Valentin (30% content + campaigns + community), Alexandre (engineering deep-dives, 10% of his time).
- **Spend target**: under $300 / month across all marketing stack and tools combined. One sponsorship < $5k allowed if the fit is perfect.
- **No hire** in Year 1.

### Year 2 (aspirational, only if Year 1 lands near plan)
- First generalist full-stack marketer (content + community + email + light design) around month 16 if MRR hits the plan trajectory. See [HIRING_PLAN.md](../09_team/HIRING_PLAN.md).
- Budget rises to ~15% of new ARR planned for the year.

### Year 3
- PMM or senior content role, demand-gen generalist as second hire.
- Budget ~10–12% of new ARR.

## 19. Alignment with sales & CS

- Monday founder standup: pipeline, content, product (Valentin + Alexandre, 20 minutes).
- Valentin rides every prospect call during Year 1; every marketing decision is informed by the last ten calls.
- Shared definition of "qualified" (MEDDPICC-lite, see [SALES_PLAYBOOK.md](SALES_PLAYBOOK.md)).
- CS feedback loop: Valentin logs recurring customer language, friction points, and expansion signals in the pipeline Notion.

## 20. Anti-patterns & what we avoid

- "Spray and pray" advertising campaigns.
- Webinars we'd rather not attend ourselves.
- AI-generated content with a human skim on top.
- Targets that reward volume over quality of pipeline.
- Content calendars that outrun founder bandwidth.
- Paying for press mentions.
- Sponsoring anything because "it looks good".

## 21. Ownership

- **Valentin** owns marketing strategy, campaign calendar, pricing-page content, long-form market pieces, email newsletter, LinkedIn presence, analyst and press (from Year 2), events.
- **Alexandre** owns engineering blog, open-source repos, developer-facing content, trust-center content, X / Bluesky presence, conference technical talks.
- Weekly Monday standup; shared content Notion with drafts in flight.

Related: [Go-to-Market](GO_TO_MARKET.md) · [Sales Playbook](SALES_PLAYBOOK.md) · [Customer Acquisition](CUSTOMER_ACQUISITION.md) · [Competitive Analysis](COMPETITIVE_ANALYSIS.md) · [Partnerships](PARTNERSHIPS.md) · [Brand Guidelines](../04_design/BRAND_GUIDELINES.md) · [Business Strategy](BUSINESS_STRATEGY.md) · [Roadmap](../00_overview/ROADMAP.md)
