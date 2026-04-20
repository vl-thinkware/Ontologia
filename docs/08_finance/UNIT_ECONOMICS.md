# Unit Economics

How a single customer generates — or doesn't generate — profit. This document underpins pricing discipline and growth investment decisions.

> Currency: USD. All figures rounded. Assumptions reviewed quarterly.

---

## 1. Why unit economics matter

- They tell us whether growth is healthy or subsidised.
- They set the ceiling on how much we can invest to acquire a customer.
- They expose plan-level profitability, guiding packaging decisions.

Definitions used below are consistent with SaaS industry norms and with the rest of the documentation in [FINANCIAL_PROJECTIONS.md](FINANCIAL_PROJECTIONS.md).

## 2. Summary — central scenario (year 2)

| Segment | ARPA | Gross margin | CAC | Payback | LTV | LTV/CAC |
|---|---|---|---|---|---|---|
| Starter | $1,400 | 60% | $700 | ~10 months | $3,200 | 4.6x |
| Pro | $25,000 | 78% | $13,000 | ~9 months | $160,000 | 12x |
| Enterprise | $180,000 | 82% | $55,000 | ~5 months | $2.2M | 40x |
| **Blended** | $13,600 | 76% | $9,000 | ~10 months | $115,000 | 12x |

These are our targets; actuals are re-measured monthly once cohorts exist.

## 3. Revenue per account (ARPA)

Average revenue per paying account, by plan, computed at cohort anniversary.

| Plan | Avg seats | List | Avg ACV | Notes |
|---|---|---|---|---|
| Starter | 6 | $15 | $1,080 | Minimum spend floor $180 / yr; average ARPA = $1,400 |
| Pro | 35 | $49 | $20,580 | Target ARPA rises to $25k with adds-on (SCIM, extra region, AI) |
| Enterprise | 250 | $420 (effective) | $105,000 | Target ARPA $180k with MSAs usually 1–2 years |

Expansion is included in year-over-year ARPA growth.

## 4. Gross margin by plan

| Plan | Revenue / mo | Direct COGS / mo | Gross margin |
|---|---|---|---|
| Starter (6 editors) | $90 | $36 | 60% |
| Pro (35 editors) | $1,715 | $380 | 78% |
| Enterprise (250 editors) | $15,000 | $2,700 | 82% |

Gross margin scales with shared infra leverage and support deflection. Starter is deliberately thinner to invest in funnel.

## 5. Customer Acquisition Cost (CAC)

CAC methodology:
`CAC = (S&M spend for the period) / (new logos acquired in the period)`

Segmented CAC:
- **Self-serve CAC**: (PLG-attributed marketing cost) / (PLG signups that paid).
- **Mid-market CAC**: (AE + SDR + proportional marketing) / (mid-market closed deals).
- **Enterprise CAC**: (Enterprise AE + SE + proportional marketing) / (Enterprise closed deals).

Targets:

| Segment | CAC target | Acceptable ceiling |
|---|---|---|
| Self-serve (Starter) | $500–$1,000 | $1,500 |
| Mid-market (Pro) | $8k–$12k | $15k |
| Enterprise | $40k–$55k | $60k |

CAC trending above acceptable ceiling triggers a channel review.

## 6. CAC payback

`Payback months = CAC / (ARPA × gross margin ÷ 12)`

| Plan | ARPA | Gross margin | Monthly gross profit | CAC | Payback |
|---|---|---|---|---|---|
| Starter | $1,400 | 60% | $70 | $700 | 10 months |
| Pro | $25,000 | 78% | $1,625 | $13,000 | 8 months |
| Enterprise | $180,000 | 82% | $12,300 | $55,000 | 4.5 months |

Payback targets: < 12 months Pro, < 18 months Enterprise, < 24 months worst case.

## 7. Retention & lifetime value (LTV)

Simplified LTV using gross margin and churn:

`LTV = ARPA × gross margin / (logo churn + 0.5 × revenue churn)`

| Plan | Annual logo churn | Expansion | Net churn | LTV |
|---|---|---|---|---|
| Starter | 35% | 15% | ~25% | $3,200 |
| Pro | 12% | 25% | negative (-5%) | $160,000+ (cap displayed as $160k) |
| Enterprise | 6% | 35% | negative (-15%) | $2.2M+ (cap displayed as $2.2M) |

For Pro and Enterprise, net retention > 100% in year 2+ means LTV is bounded only by plan limits; we apply a prudence cap at 10-year ARR × GM for modelling purposes.

## 8. LTV / CAC ratios

| Segment | LTV | CAC | LTV/CAC |
|---|---|---|---|
| Self-serve (Starter) | $3,200 | $700 | 4.6x |
| Mid-market (Pro) | $160,000 | $13,000 | 12x |
| Enterprise | $2.2M | $55,000 | 40x |
| **Blended** | $115,000 | $9,000 | ~12x |

Category benchmarks for healthy SaaS: 3–4x+. We aim for 5x+ blended, reached by year 2.

## 9. Net revenue retention (NRR)

| Year | Starter | Pro | Enterprise | Blended |
|---|---|---|---|---|
| 1 | 80% | 113% | 129% | 108% |
| 2 | 82% | 118% | 132% | 118% |
| 3 | 85% | 122% | 138% | 125% |

NRR engine:
- Seat expansion through team growth.
- Workspace expansion into new BUs.
- Add-on attach (AI, SCIM, region, audit retention).
- Plan upgrades (Starter → Pro).

Retention, not acquisition, is the primary lever for long-term valuation.

## 10. Magic number

`Magic number = (Q1 ARR - Q0 ARR) × 4 / Q0 S&M spend`

- Year 1 target: ≥ 0.5.
- Year 2 target: ≥ 0.8.
- Year 3 target: ≥ 1.0.

Below 0.5 means S&M is overspending for the return; above 1.0 means we should likely invest more.

## 11. Rule of 40

`Rule of 40 = growth rate % + FCF margin %`

- Year 1: -50 (heavy investment).
- Year 2: 0.
- Year 3: 20+.
- Year 4+: ≥ 40.

Rule of 40 is the healthy SaaS litmus test at steady state.

## 12. Burn multiple

`Burn multiple = net burn / net new ARR`

| Year | Net burn | Net new ARR | Burn multiple |
|---|---|---|---|
| 0 | $2.1M | $0.1M | 21 (pre-revenue is expected) |
| 1 | $3.5M | $1.7M | 2.0 |
| 2 | $6.3M | $5.7M | 1.1 |
| 3 | $9M | $10.5M | 0.9 |

Targets: < 2 at Series A, < 1 at Series B. Burn multiple is our capital-efficiency compass.

## 13. Seat economics (inside an account)

At Pro level, per-seat economics:

- Revenue: $49/mo = $588/yr.
- Allocated COGS: ~$11/mo = $132/yr.
- Gross margin per seat: 78%.
- Marginal support cost: ~$5/mo at scale.
- Contribution margin: ~$32/mo per seat.

Expansion within an account is extremely profitable because CAC is near zero.

## 14. Enterprise account economics

Typical Enterprise deal (250 editors, dedicated):

- ARR: $180,000.
- Dedicated infra COGS: ~$24,000/yr.
- CS labour allocation: ~$8,000/yr.
- Support escalations: ~$2,000/yr.
- **Gross profit**: ~$146,000/yr (82% GM).
- **CAC**: $55,000 → first-year contribution margin $91,000.
- After year 2: CAC fully absorbed, >$140k annual contribution margin.

Enterprise carries the business once retention stabilises.

## 15. Cost per acquisition channel

Indicative channel-level economics (year 2):

| Channel | Share of new ARR | CAC |
|---|---|---|
| Organic inbound | 35% | $2,000 |
| Referrals & word-of-mouth | 20% | $1,500 |
| Events & community | 15% | $9,000 |
| Outbound | 15% | $14,000 |
| Partnerships | 10% | $8,000 |
| Paid | 5% | $18,000 |

We scale the cheapest working channels first.

## 16. Seasonality

- Q4: enterprise procurement cycles and budget flushes give a bump.
- Q1: slow start; reset prospecting.
- Summer: slight slowdown in sign-ups; pipeline-build time.
- We plan sales capacity with a smoothing factor to avoid hero quarters.

## 17. Sensitivity to key inputs

Impact on blended LTV/CAC of a 20% change in each input:

- Churn -20% → LTV +25% → LTV/CAC +25%.
- ARPA +20% → LTV +20%, LTV/CAC +20%.
- CAC +20% → LTV/CAC -17%.
- Gross margin +5 points → LTV +6–7%.
- Expansion +20% → LTV +15%.

## 18. Key health signals

- **First-week activation ≥ 40%**: funnel works.
- **Pro payback ≤ 12 months**: sales motion works.
- **Enterprise churn < 8%**: ICP fit.
- **NRR ≥ 115%**: retention engine works.
- **Magic number ≥ 0.8 by year 2**: efficient growth.

## 19. What could break unit economics

- **Support cost creep**: mitigated by docs, community, deflection.
- **Aggressive discounting**: guarded by approval matrix.
- **Infra cost shocks**: adapter patterns, multi-vendor.
- **Feature adoption too low to justify build cost**: feature kill-switch policies, post-launch adoption gates.
- **Churn concentration**: diversify ICP across 3–5 verticals.

## 20. Dashboards

Weekly metrics dashboard (built in Mode or Grafana):

- Pipeline & bookings.
- Activation and self-serve funnel.
- Cohort retention heatmap.
- Gross margin trend.
- CAC, LTV, payback by segment.
- Magic number and burn multiple.

Reviewed every Monday; owners of each metric named on the dashboard.

Related: [Pricing Model](PRICING_MODEL.md) · [Cost Analysis](COST_ANALYSIS.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Customer Success](../07_business/CUSTOMER_SUCCESS.md)
