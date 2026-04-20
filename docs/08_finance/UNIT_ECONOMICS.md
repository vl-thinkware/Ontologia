# Unit Economics

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

How a single customer generates — or doesn't generate — profit. This underpins pricing discipline and every growth-spend decision while we are bootstrapped and optimising for runway, not headline growth.

> Currency: USD. All figures rounded. Assumptions reviewed monthly.

---

## 1. Why this matters more when bootstrapped

- Every acquisition dollar is founder-personal until revenue replaces it.
- Payback period, not LTV/CAC, is the real ceiling on what we can afford.
- Plan-level profitability guides packaging, not intuition.
- Keeps us honest about whether a given channel is viable at two-founder capacity.

Definitions below follow the bootstrap posture in [FINANCIAL_PROJECTIONS.md](FINANCIAL_PROJECTIONS.md) and the workspace-based pricing in [PRICING_MODEL.md](PRICING_MODEL.md).

## 2. Summary — central scenario (year 2, steady state)

| Segment | ACV | Gross margin | CAC | Payback | LTV (5-yr cap) | LTV/CAC |
|---|---|---|---|---|---|---|
| Team | $4,990 | 82% | $300 | ~1 month | $16,000 | ~53x |
| Business | $19,900 | 85% | $2,500 | ~2 months | $68,000 | ~27x |
| Enterprise | $60,000 | 86% | $8,000 | ~2 months | $220,000 | ~28x |
| **Blended** | $9,200 | 83% | $1,200 | ~2 months | $28,000 | ~23x |

These are targets; actuals get remeasured monthly once cohorts exist. Ratios look unusually high because the bootstrap plan deliberately keeps CAC near zero (founder-led inbound + content). Those ratios will compress if we ever turn on paid channels.

## 3. Revenue per account (ACV)

We no longer model per-seat revenue. ACV is the annual contracted value for the workspace.

| Plan | List | Typical ACV | Notes |
|---|---|---|---|
| Team | $4,990 / yr | $4,990 | Some customers stay on monthly ($499 × 12 = $5,988); blended ≈ $5,200 |
| Business | $19,900 / yr | $22,000 | AI pack and extra region attach push ACV above list |
| Enterprise | From $40,000 | $60,000 | Mid-market pricing; deals >$90k included in blend via volume mix |

Expansion shows up as plan upgrades (Team → Business) and add-on attach.

## 4. Gross margin by plan

| Plan | ARR | Direct COGS / yr | Gross margin |
|---|---|---|---|
| Team | $4,990 | $900 | 82% |
| Business | $22,000 | $3,300 | 85% |
| Enterprise (mid) | $60,000 | $8,400 | 86% |

Shared-tenant infra keeps COGS on Team and Business low. Enterprise COGS rises in absolute terms due to dedicated Neo4j, but ACV more than compensates.

## 5. Customer Acquisition Cost (CAC)

CAC methodology while bootstrapped:

`CAC = (out-of-pocket marketing + paid tooling directly attributable) / new paying logos in period`

Founder time is *not* loaded into CAC during the bootstrap period. Once one of us becomes a full-time salesperson, we revisit.

| Segment | CAC target | Acceptable ceiling |
|---|---|---|
| Team (content-led) | $100–$400 | $800 |
| Business (founder-led) | $1,500–$3,500 | $5,000 |
| Enterprise (founder-led) | $6,000–$10,000 | $15,000 |

Channels above the ceiling get paused until we understand why.

## 6. CAC payback

`Payback months = CAC / (monthly gross profit)`

| Plan | Monthly revenue | Gross margin | Monthly gross profit | CAC | Payback |
|---|---|---|---|---|---|
| Team (annual) | $416 | 82% | $341 | $300 | ~1 month |
| Business (annual) | $1,833 | 85% | $1,558 | $2,500 | ~2 months |
| Enterprise (mid) | $5,000 | 86% | $4,300 | $8,000 | ~2 months |

Bootstrap rule: blended payback must stay under 6 months. Anything longer means the paying customers we have today are subsidising the acquisition of future ones, which we cannot afford.

## 7. Retention and lifetime value (LTV)

Simplified LTV with prudent five-year cap (we refuse to model unbounded LTV while the product is this young).

`LTV = ARPA × gross margin × min(1 / net-churn, 5 years)`

| Plan | Annual logo churn | Expansion | Net churn | LTV (5-yr cap) |
|---|---|---|---|---|
| Team | 25% | 10% | ~18% | $16,000 |
| Business | 12% | 20% | negative (−6%) | $68,000 |
| Enterprise | 6% | 25% | negative (−15%) | $220,000 |

LTV numbers are lower than in the pre-bootstrap draft not because the product is worse, but because we refuse to claim LTV that depends on decades of retention we have not proven.

## 8. LTV / CAC ratios

| Segment | LTV | CAC | LTV/CAC |
|---|---|---|---|
| Team | $16,000 | $300 | ~53x |
| Business | $68,000 | $2,500 | ~27x |
| Enterprise | $220,000 | $8,000 | ~28x |
| **Blended** | $28,000 | $1,200 | ~23x |

These ratios are artificially high because CAC is near-zero while we are founder-led. Benchmarks to watch once we ever spend on paid acquisition: 3x+ is healthy, 5x+ is great, 10x+ means we are likely under-investing.

## 9. Net revenue retention (NRR)

| Year | Team | Business | Enterprise | Blended |
|---|---|---|---|---|
| 1 | 85% | 108% | 118% | 105% |
| 2 | 88% | 114% | 125% | 112% |
| 3 | 90% | 118% | 130% | 118% |

NRR engine:
- Team → Business plan upgrades.
- Add-on attach (AI pack, extra region, extra retention).
- Multi-workspace expansion inside the same customer.

With no per-seat metric, NRR is slower-moving than typical SaaS but much more stable.

## 10. Magic number (used sparingly while bootstrapped)

`Magic number = (Q1 ARR − Q0 ARR) × 4 / Q0 S&M spend`

This metric is meaningful only once we have non-trivial S&M spend; before then it explodes because the denominator is small. We'll introduce it formally once monthly S&M spend crosses $2,000.

## 11. Rule of 40 (target path)

`Rule of 40 = growth rate % + FCF margin %`

- Year 1: -15 to 0 (founder-funded infra, very low revenue).
- Year 2: 30+ (break-even approached).
- Year 3: 50+ (profitable growth).

Because the bootstrap model targets profitability by month 12–18, Rule of 40 is expected to rise faster than in VC-funded SaaS where growth is privileged over margin.

## 12. Burn multiple (not applicable while bootstrapped)

We are not burning external capital; founders are bootstrapping from personal runway. We track *monthly net cash* instead:

- Cash in: MRR collected.
- Cash out: hosting + tools + founder draw (if any).
- Target: net cash positive by month 9–12.

If monthly net cash ever goes below −$2,000 for two months in a row, we cut costs before we cut product quality.

## 13. Workspace economics (inside a Team account)

- Revenue: $499/mo = $4,990/yr (annual) or $5,988/yr (monthly).
- Allocated COGS: ~$75/mo (Neo4j shared tenant, Postgres row, Redis, storage, OpenAI fair-share).
- Gross margin: ~82%.
- Marginal support cost at scale: ~$15/mo.
- Contribution margin: ~$325/mo per Team customer.

Expansion within an account is extremely profitable because acquisition cost is already paid.

## 14. Business and Enterprise account economics

**Business (annual)**:
- ARR: $19,900 (up to $22,000 with common add-ons).
- Dedicated Postgres schema + shared Neo4j: ~$275/mo COGS.
- Founder CS time: ~$1,000/yr allocated.
- **Gross profit**: ~$18,700/yr.
- **CAC**: $2,500 → first-year contribution $16,200.

**Enterprise (mid, $60k)**:
- ARR: $60,000.
- Dedicated Neo4j Aura + dedicated Postgres schema: ~$7,200/yr.
- Founder CSM time: ~$1,200/yr allocated.
- **Gross profit**: ~$51,600/yr (86% GM).
- **CAC**: $8,000 → first-year contribution $43,600.

A single Enterprise customer pays for a meaningful share of our personal runway.

## 15. Cost per acquisition channel (bootstrap channels only)

| Channel | Share of new ARR (target year 2) | Typical CAC |
|---|---|---|
| SEO and content | 40% | $100–$300 |
| Open-source and community | 15% | near $0 (time cost only) |
| Referrals and word-of-mouth | 20% | near $0 |
| Founder-led outbound | 15% | $2,000–$5,000 |
| Partnerships (Neo4j, cloud marketplaces) | 10% | $3,000–$8,000 |

No paid acquisition in year 1 or 2. We will consider paid channels only once content and community are saturating at their natural capacity *and* we have gross margin to reinvest.

## 16. Seasonality

- Q4: enterprise procurement cycles; potential bump but also European holiday drag.
- Q1: budgets reset; slow start.
- Summer: signup slowdown; good time to ship and write.
- We plan founder capacity with a smoothing factor so no month relies on a "hero" deal.

## 17. Sensitivity to key inputs

Impact on blended LTV/CAC of a 20% change in each input:

- Churn −20% → LTV +25% → LTV/CAC +25%.
- ACV +20% → LTV +20%, LTV/CAC +20%.
- CAC +20% → LTV/CAC −17%.
- Gross margin +5 points → LTV +6–7%.
- Expansion +20% → LTV +15%.

## 18. Key health signals (bootstrap edition)

- **Free → Team conversion ≥ 3%** on qualified signups.
- **Team annual payback ≤ 3 months**: sales motion works.
- **Business logo churn < 15%**: ICP fit for paid mid-market.
- **Blended NRR ≥ 110%** by end of year 2.
- **Monthly net cash positive** from month 9 onward.

## 19. What could break unit economics

- **Support cost creep** as free users scale: mitigated by strong docs, Discord, paid-first SLAs.
- **Aggressive discounting**: guarded by the two-founder approval matrix.
- **Infra cost shocks** (Neo4j pricing change, OpenAI cost spike): multi-vendor LLM adapter, usage caps.
- **Concept count inflation** on Free pulling down gross margin: hard cap at 500 concepts; no accidental generosity.
- **Churn concentration**: we diversify ICP across at least three verticals before we take any single-vertical marketing investment.

## 20. Dashboards

Weekly dashboard (Grafana Cloud + Stripe + Postgres):

- New signups, activation, Free → Team conversion.
- MRR / ARR, by plan.
- Cohort retention heatmap.
- Gross margin trend.
- CAC, payback by segment.
- Monthly net cash.

Reviewed every Monday; Valentin owns commercial metrics, Alexandre owns product-usage metrics.

---

Related: [Pricing Model](PRICING_MODEL.md) · [Cost Analysis](COST_ANALYSIS.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Customer Success](../07_business/CUSTOMER_SUCCESS.md)
