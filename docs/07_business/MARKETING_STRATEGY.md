# Marketing Strategy

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

How two founders build awareness, educate the mid-market, and generate qualified pipeline without a marketing budget. Every dollar spent on marketing in Year 1 must be defensible against the cash-in-bank chart.

> **Operating reality.** No paid ads in Year 1. No agency. No analyst relations. No DevRel hire. Two founders write everything, publish everything, and the company earns trust by being consistently useful on the public internet.

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
- Product Hunt + Hacker News + LinkedIn launch moment.
- 5,000 website visits / month by end of month 9.
- 200 Free-tier signups per month; 5% Free → Team conversion.

**Phase 3 — GA ramp (months 10–12)**
- 10,000 visits / month.
- 500 Free signups / month.
- ~20% of Business-tier pipeline originated from content or community (the rest from warm intros and founder outreach).
- One flagship report ("State of Ontology & AI", our annual piece).

**Year 2 aspirational** (only if unit economics hold):
- 40–60k visits / month.
- Self-sustaining practitioner community.
- First generalist marketing hire.

We do not chase vanity traffic. A smaller audience of the right buyers beats 10× traffic of the wrong ones.

## 2. Brand positioning

**Tagline**: "The ontology platform for teams building knowledge-rich AI products."

**Supporting narrative**:
- Knowledge deserves the same care and tooling as code — but without the cognitive weight of git for domain experts.
- Ontologies are living systems that need change history, revert, and a trustworthy API — not branches, merges, and pull requests. (At least not yet.)
- AI doesn't solve the structure problem. Good structure makes AI work.

**Tone of voice**:
- Clear, technical, confident, humble.
- Honest about what we have and haven't shipped.
- Evidence over claims — show before tell, link our sources.
- Quietly funny where warranted; never performative.

**What we don't say**:
- "Revolutionary". "10×". "Disruptor". "AI-native" without a concrete meaning.
- "Enterprise-grade" before we're actually enterprise-grade.
- Anything that a generic AI content farm could have written.

See also: [BRAND_GUIDELINES.md](../04_design/BRAND_GUIDELINES.md).

## 3. Audience segments

- **Practitioners**: ontologists, knowledge engineers, taxonomy and MDM folks, data modellers. Love depth, hate fluff. Primary consumers of long-form technical content.
- **AI / data leaders** at mid-market companies (100–2,000 employees): Head of AI, Head of Data, occasionally CDO. Want ROI, control, and a short path from pilot to production.
- **Builders**: AI engineers, RAG developers, platform engineers, indie hackers. Want API quality, speed, openness. Drive bottom-up adoption via the Free tier.
- **Champions**: anyone senior enough to push a procurement cycle and defend a $5k or $20k line item.

One brand, different entry points. Not separate funnels.

## 4. Positioning pillars

1. **Figma for ontologies** — the experience argument. Visual, collaborative, browser-native.
2. **Versioned like your code (without the complexity of git)** — the engineering argument. Change history, revert, tags, API. Branches-and-merges are explicitly deferred; we lean into that as a feature, not a gap.
3. **Source of truth for AI** — the business argument. RAG pipelines and agents pin to a tag; the ontology becomes the team-owned structural layer AI products rely on.

Every campaign ties back to at least one pillar.

## 5. Content strategy

### Content hub: `ontologia.com/learn`
- **Primers**: "What is an ontology?", "Property graphs vs RDF: which matters for AI teams", "Why taxonomy drift kills RAG".
- **How-tos**: "Design your first SKU ontology in 30 minutes", "Import a controlled vocabulary from Excel", "Pin your RAG pipeline to an ontology tag".
- **Deep dives (Alexandre)**: "Change events as an alternative to git-for-data", "Building an optimistic-concurrency editor on Neo4j + Postgres", "Why we deferred branches and merges".
- **Market pieces (Valentin)**: "What mid-market AI teams actually pay for knowledge tooling", "The workspace-price pattern for collaboration SaaS".
- **Case studies**: customer stories with concrete before/after outcomes. First two by month 9.
- **Comparison pages**: factual, sourced, evenhanded. Protégé, TopBraid EDG, PoolParty, Stardog Studio, "build your own".

### Formats
- Long-form articles (1,500–3,500 words). The backbone.
- Short posts (500–800 words) for tactical pieces and weekly cadence.
- 3–5 minute screencasts by Alexandre ("here's how we built X this week").
- Sample ontologies repo on GitHub, with MIT licence.
- Interactive demos embedded on key landing pages.

### Content calendar (founder-sustainable)
- **1 long-form article per week** at steady state (alternating Valentin and Alexandre).
- **1 short post per week** from the other founder.
- **1 video per month** — not per week. Videos that are worth watching, not content farms.
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
- "Ontology authoring" (Protégé competitors, desktop-to-web migration).
- "RAG + knowledge graph" (builder audience).
- "Taxonomy / controlled vocabulary management" (MDM and practitioner audience).
- "Mid-market data platform tooling" (buyer-side content).

## 7. Community & developer relations

- Public Slack community from month 1 of Phase 2. Hosted free tier. Channels: `#general`, `#showcase`, `#help`, `#feature-requests`, `#changelog`.
- Monthly community call at 30 minutes — product update, one community member's demo, open Q&A.
- Open-source sample repos: `ontologia/examples` (sample ontologies), `ontologia/sdk-js`, `ontologia/import-cli`.
- Hackathons are deferred until we have a community of > 500. No point running one into an empty room.
- Sponsorships: at most one event in Year 1 if it's a practitioner event with < $5k sponsorship tier. Otherwise attend as speakers only.

### Where we show up
- Knowledge Graph Conference, Data Council, FOSDEM data/ML track, practitioner meetups.
- Podcasts: TWIML, Data Engineering Podcast, The Machine Learning Podcast, Software Engineering Daily.
- Newsletters: we pitch pieces to Ben Lorica's Gradient Flow, TheSequence, RAGtime, and a rotating list of practitioner newsletters.

### DevRel staffing
- Valentin + Alexandre are DevRel in Year 1. No hire.
- First community or DevRel hire not before Year 2 Q3, and only if the Free tier is producing > 200 weekly-active builders.

## 8. Product marketing

- Clear positioning docs for every major feature at launch — even the ones that feel small.
- Launch rituals: blog post, 3-minute video, docs update, email to newsletter, LinkedIn post from both founders, Hacker News submission where it fits.
- Annual "State of Ontology & AI" report — flagship data piece, targets an analyst-quality piece of writing. First edition by month 10.
- Pricing page is a product surface: maintained, updated, with a live comparison table and a FAQ that covers the hard questions (workspace vs seat, annual discount, what counts as a workspace).
- In-app education: tooltips, contextual guides, sample ontologies on first load, empty-state CTAs.

## 9. Campaign playbook

Each campaign has:
- One clear audience and one clear promise.
- Primary content asset (a report, a free tool, a guide).
- Supporting content (social posts, newsletter issue, partner co-marketing when relevant).
- Measurable goals (signups, MQLs, attendance, report downloads with emails).
- Post-mortem 30 days after end. Written. One page.

### Year-one candidate campaigns
- **"Ontology fitness check"** — interactive tool evaluating an imported ontology's coverage, cycles, and duplicates. Requires sign-up. Gated download of the full report.
- **"Knowledge graphs make RAG smarter"** — evidence-based paper with reproducible benchmarks. Co-authored if we find a good partner.
- **"Open ontologies we love"** — curated list with interviews of maintainers. Feeds our community.
- **"Migrate from Protégé / TopBraid"** — technical tutorial + open-source migration script.
- **"State of Ontology & AI 2026"** — our flagship annual report.

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
- **LinkedIn Ontology group, r/LocalLLaMA, r/ragdev, Hacker News**: we participate, we don't spam.

We do not buy followers, run engagement pods, automate "thought leadership" posts, or hire ghostwriters.

## 14. Analyst & press

- Analyst relations deferred to Year 2. When we're ready: Gartner, Forrester, IDC for the enterprise story; RedMonk for the dev voice. Quarterly briefings once traction warrants it.
- Press: launch moments covered by a small group of technical journalists. Pitch list curated by Valentin. Avoid hype cycles.

## 15. Website & brand experience

- Fast, clean, accessible — we practise what we preach (see [ACCESSIBILITY.md](../04_design/ACCESSIBILITY.md)).
- Pages: home, product, use cases, pricing, trust, docs, learn, customers, changelog, company, careers, blog.
- Live, interactive demo near the fold on the home page.
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

### Attribution (lightweight)
- Self-reported "how did you hear about us?" on signup.
- UTMs on all campaigns.
- PostHog for funnel analytics.
- Google Sheet for monthly roll-up. No attribution platform in Year 1.

### Reporting cadence
- Weekly scorecard (Monday).
- Monthly review with both founders (second Friday of the month).
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
