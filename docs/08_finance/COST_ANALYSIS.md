# Cost Analysis

What it costs to build and run Ontologia — today, at GA, and at scale. A pragmatic view used for pricing decisions, gross-margin analysis, and capital planning.

> All figures in USD. Cost bands are realistic mid-range estimates based on public pricing and comparable SaaS businesses in 2025–2026. Update quarterly.

---

## 1. Cost structure overview

We break costs into four buckets:

1. **COGS** — direct cost of delivering the service. Drives gross margin.
2. **R&D (engineering + product + design)** — building the product.
3. **S&M (sales + marketing)** — acquiring and retaining customers.
4. **G&A** — running the company.

Plus: infrastructure capex-equivalent (pre-paid reserved capacity) treated as COGS over the term.

## 2. COGS — per-tenant components

For each paying tenant we incur a blend of fixed and variable costs.

| Component | Starter (small team) | Pro (mid-size team) | Enterprise (dedicated) |
|---|---|---|---|
| Neo4j Aura (graph DB) | Shared (~$25/mo allocated) | Shared (~$80/mo allocated) | Dedicated ~$500–$2,500/mo |
| Postgres (Neon / RDS) | Shared (~$10/mo allocated) | Shared (~$40/mo allocated) | Dedicated ~$200–$800/mo |
| Redis (Upstash / ElastiCache) | $5/mo allocated | $20/mo allocated | $100–$300/mo |
| Cloudflare R2 (object storage) | Negligible | $5–$20/mo | $50–$200/mo |
| Compute (Fly.io / Vercel / Render) | $10/mo allocated | $40/mo allocated | $200–$800/mo |
| CDN & bandwidth (Cloudflare) | Included | Mostly included | $50–$200/mo |
| Clerk auth | $0 on free tier → $0.02/MAU | ~$0.02/MAU | Enterprise plan ~$3k/yr min |
| Stripe billing | 2.9% + 30¢ per transaction | Same | Wire / ACH for many |
| Email (Resend) | $20/mo pool | $90/mo pool | $200/mo pool |
| Observability (Grafana Cloud, Sentry, Logtail) | $50/mo pool | $200/mo pool | $500–$1,500/mo |
| LLM pass-through (for AI features, opt-in) | Pass-through + 20% margin | Pass-through + 20% margin | Pass-through or fixed bundle |
| Security tooling (GitGuardian, Semgrep, Snyk) | allocated | allocated | allocated |
| CS & support (labour alloc) | $3/seat/mo | $8/seat/mo | $30/seat/mo |

Indicative **blended COGS per plan** (excluding LLM pass-through):

| Plan | Monthly COGS per typical customer | Price | Gross margin |
|---|---|---|---|
| Free | $3–$5 | $0 | Negative — marketing expense |
| Starter (5 editors) | $20–$35 | $75 | ~60–70% |
| Pro (20 editors) | $150–$250 | $980 | ~75–82% |
| Enterprise (100 editors, dedicated) | $3,500–$6,000 | $45,000/yr ≈ $3,750/mo average | ~75–85% (blended with platform fees) |

Numbers widen with scale (economies on Aura, Redis, support leverage).

## 3. COGS scaling curves

Assumptions:

- Neo4j Aura per-instance cost drops with commit discounts at >$200k/yr committed.
- Shared tiers benefit from batching at ~5–10× more customers on the same cluster.
- Support labour scales sub-linearly with good docs and community.

| Customers | Total COGS / month | Avg COGS / paying customer |
|---|---|---|
| 50 | $12k | $240 |
| 250 | $45k | $180 |
| 1,000 | $140k | $140 |
| 5,000 | $550k | $110 |
| 15,000 | $1.4M | $93 |

## 4. Infrastructure reserved capacity

To reduce cost, we commit to reserved capacity at predictable scale:

- Neo4j Aura committed spend tier at ~$50k/yr unlocks 15% discount.
- Cloudflare Enterprise commit unlocks negotiated bandwidth + WAF pricing.
- AWS / GCP committed-use discounts when we migrate compute to Kubernetes in year 2.

Pre-pay only when usage prediction has ≥ 80% confidence.

## 5. LLM cost model (feature C2)

- Average request: ~2k tokens in, 500 tokens out.
- Using GPT-4-class models: ~$0.03–$0.05 per request.
- Using cheaper models (GPT-4o-mini, Claude Haiku) for most cases: ~$0.005 per request.
- Fallback to open-weights (Llama, Mistral) for internal features: pay infra only.

Per-tenant quota enforced. Pass-through billing for Enterprise customers choosing "pay for what you use" pattern.

Margin target on AI features: ≥ 50% (after vendor cost).

## 6. Engineering (R&D) cost

### Team shape year 1 (post-GA)

| Role | Count | Blended fully-loaded cost (USD/yr) |
|---|---|---|
| Founders (CEO, CTO) | 2 | $300k each |
| Senior engineers (FE, BE, data, infra) | 5 | $220k |
| Product manager | 1 | $220k |
| Designer | 1 | $200k |
| DevRel | 1 | $200k |
| Total | 10 | ≈ $2.5M |

Includes salary + equity refresh cost + benefits + computer + SaaS tools.

### Year 2 shape
- 18–22 people. Engineering ~12.
- Target: R&D ≤ 50% of OPEX in year 2, ≤ 40% by year 3.

### Tools
- GitHub Enterprise, Vercel, Fly.io, Grafana Cloud, Sentry, Linear, Notion, Figma, Slack, 1Password, Doppler, Drata.
- Blended ~$400/employee/month in SaaS costs.

## 7. Sales & marketing cost

### Year 1
- ~$400k total: events, content, paid ads (small), partner MDF.
- 1 AE + 1 SDR + 1 CSM + fractional CMO.
- Total S&M headcount cost ≈ $800k.
- Total S&M ≈ $1.2M.

### Year 2
- Sales team: 3 AEs, 2 SDRs, 1 sales ops.
- Marketing: head of marketing, content lead, DevRel, events, growth.
- Total S&M ≈ $3.5–4M.

### Year 3
- Sales: 8 AEs (mix of mid-market + enterprise), 4 SDRs, 2 sales ops, 1 VP Sales.
- Marketing: full team of 7–9.
- Total S&M ≈ $8–10M.

Target: S&M as a % of revenue ≤ 60% year 1, ≤ 50% year 2, ≤ 45% year 3.

## 8. G&A cost

- Legal (fractional + outside counsel): $150k year 1; $400k year 2.
- Finance (bookkeeping + fractional CFO): $120k year 1.
- People ops: $100k year 1; $300k year 2.
- Office / remote stipends: $80k year 1.
- Insurance (D&O, E&O, cyber): $40k year 1; ramps with team and revenue.
- Audits (SOC 2): $50k year 1; $35k / yr after.
- Compliance tooling (Drata / Vanta): $30k / yr.

Year 1 G&A ~$600k. Year 2 ~$1.2M. Year 3 ~$2.5M.

## 9. Total cost envelope

| Year | COGS | R&D | S&M | G&A | Total OPEX |
|---|---|---|---|---|---|
| 0 (pre-GA, build) | $80k | $1.6M | $200k | $300k | $2.2M |
| 1 (GA year) | $650k | $2.5M | $1.2M | $600k | $5.0M |
| 2 | $2.2M | $5.5M | $4.0M | $1.2M | $12.9M |
| 3 | $5.5M | $9.5M | $10M | $2.5M | $27.5M |

Compare with revenue projections in [FINANCIAL_PROJECTIONS.md](FINANCIAL_PROJECTIONS.md).

## 10. Per-customer acquisition cost (CAC)

Reconciled to sales cycle:

| Segment | Blended CAC | Payback |
|---|---|---|
| Self-serve (Free → Starter → Pro) | $500–$1,500 | < 6 months |
| Mid-market (assisted sale) | $8k–$15k | 10–14 months |
| Enterprise | $40k–$60k | 12–24 months |

CAC discipline: we do not spend to acquire customers we can't retain. Any channel exceeding targets for two quarters is cut.

## 11. Cost of support

- Community self-service: aim > 40% of Free+Starter support covered by docs/community.
- Ticket-to-success ratio: target < 15 minutes average per Pro+ ticket on average (simple questions).
- Enterprise TAM coverage: 1 TAM per ~$2M ARR covered.

Invest early in:
- Comprehensive docs (saves CSM hours).
- In-product help (tooltips, onboarding).
- Templates library (cuts "how do I start?" tickets).

## 12. Cost of security & compliance

- SOC 2 Type I audit: one-time ~$25k + ongoing $20–30k/yr audit fee.
- Annual penetration test: $25–40k.
- GRC platform (Drata/Vanta/Secureframe): $25k/yr.
- Bug bounty (post year 1): $30k/yr reserve.
- ISO 27001 (year 2+): ~$80k one-time + ongoing audit fees.
- Vendor security reviews: covered by GRC + internal.

Budgeted separately because customers care about this as a product feature.

## 13. Cost of infrastructure failure

Budget a reserve for:
- DR drills (quarterly): $5k per drill in labour.
- Annual restore-from-backup full test: $15k in labour + infra.
- Region failover: $20k per year in reserved secondary capacity once we offer it.
- SLA credit reserve: ~1% of annual revenue.

## 14. Cost of building feature C2 (AI suggestions)

- Engineering: 2 FTE for 6 months (~$230k).
- LLM ops: initial model experimentation budget $15k.
- Evaluation tooling and red-teaming: $25k.
- Ongoing: $0.05–$0.50 per editor-month at steady state, billed via the AI add-on.

ROI: feature expected to drive 10–15% upgrade rate and 5% ACV increase.

## 15. Cost of building feature C5 (MCP server)

- Engineering: 1 FTE for 3 months (~$55k).
- Runs on existing infra; marginal hosting $200/mo.
- Strategic: positions Ontologia as the canonical ontology source for agent ecosystems.

## 16. Cost efficiency levers

- **Caching** (Redis, HTTP): cuts read load by 60–80%.
- **Shared multi-tenant** on Starter/Pro avoids per-customer infra cost.
- **CDN + edge compute** (Cloudflare Workers) for hot paths.
- **Batching jobs** during off-peak hours.
- **Rightsizing Aura** per tenant at scheduled review points.
- **Auto-scaling** on compute tiers.
- **Reserved commits** once usage is predictable.

## 17. Cost risks

| Risk | Mitigation |
|---|---|
| Neo4j Aura price hikes | Multi-year pricing; adapter pattern to swap GraphStore if needed |
| LLM vendor price volatility | Multi-model strategy; pass-through to customer on heavy workloads |
| Cloud egress surprises | Cloudflare R2 (zero egress); cache strategy |
| Enterprise dedicated tenants under-priced | Pricing floor + annual cost review; per-customer cost dashboards |
| Support labour creep | Docs-first; deflection metrics; template library |
| Compliance costs scaling fast | Batch audits; tooling; in-house ownership vs consultants |

## 18. Governance

- Monthly cost review by CEO + CTO + (future) CFO.
- Quarterly deep dive with engineering team.
- Cost dashboards in Grafana with per-tenant cost estimation.
- Alerts on anomalies (doubling week-over-week).

## 19. Where cost is worth spending

- **People**. Paying below market is false economy.
- **Security**. Customers vote with SOC 2 in hand.
- **Performance**. Latency is a product feature.
- **Reliability**. SLA credits are cheaper than a lost enterprise.
- **Docs**. Every hour of writing saves hours of support.
- **Design polish**. Our category win depends on UX excellence.

## 20. Where we resist spending

- Agencies for marketing before we know what we're promoting.
- Long-term SaaS contracts we haven't verified we'll use.
- Conferences that don't align to ICP.
- "Growth hack" tools that don't respect the user.
- Logos on our office wall.

Related: [Pricing Model](PRICING_MODEL.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Infrastructure](../05_operations/INFRASTRUCTURE.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md)
