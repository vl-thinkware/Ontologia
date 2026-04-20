# Financial Projections

Bottom-up financial model covering the next 3 years. Projections are **plans, not forecasts** — we commit to the quarterly milestones and re-baseline every 6 months.

> Currency: USD. All numbers are rounded. This document summarises the model; the detailed spreadsheet lives in `docs/08_finance/model/ontologia_model_v1.xlsx`.

---

## 1. Executive summary

| Metric | Year 0 | Year 1 | Year 2 | Year 3 |
|---|---|---|---|---|
| New logos | 10 (design partners) | 180 | 600 | 1,200 |
| Paying customers (end of year) | 10 | 150 | 550 | 1,300 |
| ARR (end of year) | $0.1M | $1.8M | $7.5M | $18M |
| Net new ARR | $0.1M | $1.7M | $5.7M | $10.5M |
| Gross margin | 55% | 72% | 78% | 81% |
| Net revenue retention | — | 108% | 118% | 125% |
| Headcount (end of year) | 10 | 18 | 34 | 60 |
| Cash burn | -$2.1M | -$3.5M | -$7.0M | -$10M |
| Capital raised to date | $3M seed | $3M (unchanged) | +$15M Series A | Unchanged |
| Cash on hand (end of year) | $0.9M | $3.4M (post-Series A) | $11M | $1M (warrants a Series B) |

Path to default-alive at ~$25M ARR with disciplined spend.

## 2. Revenue build — top-down check

| Segment | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Free (no revenue) | 2,000 orgs | 8,000 orgs | 20,000 orgs |
| Starter | 100 orgs @ $1,200 ACV = $120k | 400 orgs @ $1,400 = $560k | 900 orgs @ $1,600 = $1.4M |
| Pro | 45 orgs @ $15k ACV = $675k | 130 orgs @ $25k = $3.25M | 320 orgs @ $35k = $11.2M |
| Enterprise | 5 orgs @ $150k ACV = $750k | 20 orgs @ $180k = $3.6M | 80 orgs @ $190k = $15.2M |
| **Headline ARR** | ~$1.5M | ~$7.4M | ~$27.8M |

Year-3 build represents best case given adoption trajectory; planning assumptions keep ARR closer to $18M (central scenario), with upside to $27M.

## 3. Revenue build — bottom-up scenarios

### Central scenario (primary plan)

Funnel assumptions per quarter (year 1 steady state):

- Website visitors: 30k → 45k by year-end.
- Signups: 1,000 → 1,500 / month.
- Activation: 40%.
- Paid conversion (self-serve): 6%.
- Mid-market sales: 8 closed / quarter end of year 1.
- Enterprise: 1–2 per quarter end of year 1.

Implied ending ARR: ~$1.8M.

### Optimistic scenario
- 20% better conversion + 25% more traffic.
- Enterprise ramp quicker.
- ARR: ~$2.8M year 1, ~$11M year 2.

### Downside scenario
- Longer enterprise cycles.
- Self-serve conversion 4%.
- ARR: ~$1.1M year 1, ~$4M year 2.

We plan on the central scenario and stage spend in tranches that unlock only when we hit milestones.

## 4. Customer cohort assumptions

| Plan | Churn (annual) | Expansion (annual) | GRR | NRR |
|---|---|---|---|---|
| Starter | 35% | 15% | 65% | 80% |
| Pro | 12% | 25% | 88% | 113% |
| Enterprise | 6% | 35% | 94% | 129% |
| Blended (weighted) | 15% | 25% | 85% | 110% y1 → 125% y3 |

Starter churn is intentionally higher (prosumer base); Pro and Enterprise are the lifeblood.

## 5. Pricing assumptions in the model

- Starter: $15/editor/month (annual commit).
- Pro: $49/editor/month (annual commit).
- Enterprise: $40k/yr minimum, scaling to $300k+ at 1,000 seats.
- No major price change through year 3; CPI adjustments on renewals only.
- AI add-on attaches ~20% of Pro customers by end of year 1, 40% by year 3.

## 6. Gross margin

| Year | Revenue | COGS | Gross margin |
|---|---|---|---|
| 1 | $1.8M | $520k | 71% |
| 2 | $7.5M | $1.65M | 78% |
| 3 | $18M | $3.4M | 81% |

Gross margin improves as we benefit from:
- Reserved capacity on infrastructure.
- Shared multi-tenant leverage.
- Support deflection via docs and self-serve.
- Cheaper LLM model usage as open-weights catch up.

## 7. Operating expense plan

| Year | R&D | S&M | G&A | Total OPEX |
|---|---|---|---|---|
| 0 | $1.6M | $0.2M | $0.3M | $2.1M |
| 1 | $2.5M | $1.2M | $0.6M | $4.3M |
| 2 | $5.5M | $4.0M | $1.2M | $10.7M |
| 3 | $9.5M | $10M | $2.5M | $22M |

Spend rules:

- **R&D ≤ 50% of revenue** by end of year 2.
- **S&M payback ≤ 18 months** blended.
- **G&A ≤ 15% of revenue** from year 2.

## 8. Cash flow

| Year | Revenue | OPEX | EBITDA | Capex / non-cash | Cash burn |
|---|---|---|---|---|---|
| 0 | $0.1M | $2.1M | -$2.1M | $0 | -$2.1M |
| 1 | $1.0M billed | $4.3M | -$3.3M | $0.2M | -$3.5M |
| 2 | $4.8M collected | $10.7M | -$5.9M | $0.4M | -$6.3M |
| 3 | $14M collected | $22M | -$8M | $1.0M | -$9M |

Revenue collected < ARR due to annual-in-advance mechanics (deferred revenue helps cash flow).

## 9. Capital plan

- **Seed** (Year 0): $3M raised; 18 months runway to GA.
- **Series A** (Year 1, Q3–Q4): $15M at post ~$80–120M if milestones met (ARR > $1.5M, healthy retention, SOC 2 Type I).
- **Series B** (Year 3): only if both motions prove and we can deploy $30–40M productively.

Capital priorities:
1. Extend runway to 24+ months at all times.
2. Hire talent at market median with equity heavy.
3. Invest in product and security; marketing follows product-market fit.
4. No capital into prestige real estate or premature international offices.

## 10. Headcount plan

| Year | Eng | Design | PM | DevRel | Sales | CS | Marketing | G&A | Total |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 6 | 1 | 1 | 1 | — | — | — | 1 | 10 |
| 1 | 10 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 22 |
| 2 | 16 | 3 | 3 | 2 | 6 | 3 | 5 | 4 | 42 |
| 3 | 24 | 4 | 5 | 3 | 12 | 7 | 9 | 6 | 70 |

Hire ahead of revenue only when evidence supports it (e.g., sales reps hired 1 quarter ahead of quota ramp).

## 11. Key ratios we track

| Ratio | Target year 1 | Target year 3 |
|---|---|---|
| Magic number | 0.5 | 1.0+ |
| Rule of 40 | -50 | 0+ |
| Gross margin | 70%+ | 80%+ |
| LTV/CAC | 3x | 5x+ |
| Burn multiple | 2.0 | 1.0 |
| NRR | 108% | 125% |

## 12. Sensitivity analysis

Top variables and the impact of a 20% change in each:

- **Mid-market win rate**: +20% = +$350k ARR year 1.
- **Enterprise ACV**: +20% = +$150k ARR year 1.
- **Starter churn**: -20% = +$40k ARR year 1 (small absolute effect, big brand effect).
- **Marketing spend efficiency**: +20% = +$120k ARR year 1.
- **LLM cost**: +50% = -$100k COGS year 2 (mitigated by add-on pricing).

## 13. Key risks

| Risk | Financial impact | Mitigation |
|---|---|---|
| Enterprise sales cycle longer than 6 months | ARR miss year 1 | Pilot-to-paid programmes; mid-market bridge |
| Vendor cost shock (LLM, Aura) | Margin compression | Multi-vendor, adapter pattern |
| Hiring market heats up | Burn creep | Remote-first, equity-heavy, defined bands |
| Enterprise procurement delays | Cash timing | Longer runway, PO-based billing |
| Competitive launch from hyperscaler | Deal freeze | Integrations, partnerships, UX differentiation |

## 14. Discounting and revenue recognition assumptions

- Average blended discount: 8% of list.
- Revenue recognised rateably per ASC 606.
- ARR booked at the contract's annualised value.
- Services revenue (training / onboarding) < 5% of total revenue and excluded from SaaS metrics.

## 15. Tax and international

- US Delaware C-Corp; tax provision negligible until profitability.
- UK and EU subsidiary considered year 2 for local billing.
- Transfer pricing via arm's-length service agreement.
- VAT / GST via Stripe Tax.

## 16. Fundraising readiness

- Up-to-date data room: pitch, metrics, model, cap table, legal, customer pipeline.
- Monthly investor update after seed.
- Clean cap table; standard SAFE / preferred equity docs.
- Board of 3 (CEO + investor + independent) at seed; 5 at Series A.

## 17. Board reporting

Monthly pack:
- Revenue summary (ARR, NRR, GRR).
- Sales pipeline and conversion.
- Product metrics (NSM, activation).
- Financials (P&L, cash, runway).
- Hiring progress.
- Risks and asks.

Quarterly: strategic update + compliance + security summary.

## 18. What would break the plan

- Unable to close first 5 enterprise logos in year 1 → Series A delayed.
- Self-serve activation < 25% → growth flywheel slow.
- Negative magic number → slow S&M or re-examine product.
- SOC 2 audit delayed → enterprise wall.

Each trigger has a pre-agreed response plan (cut, pivot, raise).

## 19. What would blow the plan up (positively)

- A viral moment (e.g., an agent ecosystem standard adopts us).
- A strategic partnership with a hyperscaler.
- A high-profile customer case study cascading into 10+ similar logos.

We plan conservatively and we also think about upside — staffing, infra, support must be able to absorb it without breaking.

## 20. Ownership & rhythm

- **CEO**: owns the financial plan.
- **Finance lead (CFO later)**: maintains the model.
- **Leadership team**: reviews monthly.
- **Board**: reviews quarterly.
- **Re-baseline**: twice a year or on major milestones (Series A, first $5M ARR).

Related: [Pricing Model](PRICING_MODEL.md) · [Cost Analysis](COST_ANALYSIS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Go-to-Market](../07_business/GO_TO_MARKET.md)
