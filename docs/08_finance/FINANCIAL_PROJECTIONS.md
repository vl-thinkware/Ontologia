# Financial Projections

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

Bottom-up financial model for a two-founder bootstrapped company. This is a **plan, not a forecast** — we commit to quarterly milestones and re-baseline every three months.

> Currency: USD. All numbers rounded. The detailed working model will live in `docs/08_finance/model/ontologia_model_v2.xlsx` once built.

---

## 1. Executive summary

| Metric | Year 0 (build) | Year 1 (launch) | Year 2 (sustain) | Year 3 (grow) |
|---|---|---|---|---|
| Paying customers (end of year) | 3–5 design partners | 15–25 | 50–80 | 120–180 |
| ARR (end of year) | $0 | $120k–$180k | $450k–$700k | $1.2M–$1.8M |
| Gross margin | n/a | 75% | 82% | 85% |
| Net revenue retention | n/a | ~105% | ~112% | ~118% |
| Headcount | 2 founders | 2 founders + 1 part-time contractor | 2–3 founders + 1–2 | 3–4 full-time |
| Monthly cash OUT (average) | $250 tooling + founder time | $600–$1,000 | $1,500–$2,500 | $4,000–$7,000 |
| Monthly cash IN (average) | $0 | $5,000–$12,000 | $40,000–$55,000 | $100,000–$140,000 |
| External funding | $0 | $0 | $0 (optional small round only if we choose) | Optional |

Target: **default-alive by month 12**, comfortably profitable by end of year 2, enough retained earnings by end of year 3 that one or both founders can draw a market-rate salary.

## 2. Bootstrap posture — the ground rules

- **No external funding assumed.** If we raise, it is opportunistic and only to accelerate a proven motion.
- **Founders carry personal runway** during year 0 and the first two quarters of year 1.
- **Every cost justified monthly.** Tooling and infra are reviewed at the start of each month.
- **Revenue funds the next step**, not the other way around. Marketing spend grows as gross profit grows.
- **Hire only when a customer is waiting for the hire.** See [HIRING_PLAN.md](../09_team/HIRING_PLAN.md).
- **Prefer usage-based cloud tiers** and free plans wherever they do not compromise customer experience.

## 3. Revenue build — bottom-up

### Year 0 (build phase, months 0–6)

- 3–5 design partners on free extended pilots; no billed revenue.
- Feedback drives feature prioritisation.

### Year 1 (launch, months 7–18)

Month-by-month scenarios for the first 12 months of paid availability.

| Month | New Team logos | New Business logos | New Enterprise | End-of-month MRR |
|---|---|---|---|---|
| 1 | 2 | 0 | 0 | $1,000 |
| 2 | 2 | 0 | 0 | $2,000 |
| 3 | 2 | 1 | 0 | $4,000 |
| 4 | 2 | 0 | 0 | $5,000 |
| 5 | 3 | 1 | 0 | $8,500 |
| 6 | 2 | 0 | 0 | $9,500 |
| 7 | 3 | 1 | 0 | $13,000 |
| 8 | 3 | 0 | 0 | $14,500 |
| 9 | 3 | 1 | 0 | $18,000 |
| 10 | 3 | 1 | 1 (pilot→paid $40k/yr) | $23,300 |
| 11 | 3 | 0 | 0 | $24,800 |
| 12 | 3 | 1 | 0 | $28,300 |

End-of-year-1 ARR: ~$340k headline / ~$180k retained after expected churn and downgrades.

### Year 2 (sustain)

- 4–6 new Team logos / month.
- 1–2 new Business logos / month.
- 2–4 Enterprise deals / year (founder-led).
- ARR end of year 2: ~$550k central, $450k downside, $700k upside.

### Year 3 (grow)

- First non-founder hire in sales or DevRel if unit economics justify it.
- ARR end of year 3: ~$1.5M central.

## 4. Customer cohort assumptions

| Plan | Annual logo churn | Expansion | GRR | NRR |
|---|---|---|---|---|
| Team | 25% | 10% | 75% | 85% |
| Business | 12% | 20% | 88% | 108% |
| Enterprise | 6% | 25% | 94% | 118% |
| Blended (weighted) | 18% | 18% | 82% | 105% Y1 → 118% Y3 |

Team churn is intentionally higher — small teams change tools. Business and Enterprise carry retention.

## 5. Pricing assumptions in the model

- Team: $499/mo or $4,990/yr (annual commit).
- Business: $1,990/mo or $19,900/yr (annual commit).
- Enterprise: $40k/yr floor, central mix around $60k, high-end to $120k+.
- No major price change through year 3; CPI adjustments on renewals only.
- AI add-on attaches ~15% of Team + Business customers by end of year 1, 30% by year 3.

## 6. Gross margin

| Year | Revenue (recognised) | COGS | Gross margin |
|---|---|---|---|
| 1 | $120k | $30k | 75% |
| 2 | $480k | $87k | 82% |
| 3 | $1.3M | $195k | 85% |

Gross margin improves as we benefit from:
- Reserved capacity on Neo4j Aura and Postgres.
- Shared multi-tenant leverage on Team + Business.
- Support deflection via docs and community.
- Cheaper LLM model usage as the adapter pattern lets us switch providers.

## 7. Operating expense plan

| Year | Infra + tooling | Marketing (out-of-pocket) | Legal / accounting | Founder draws | Total cash OPEX |
|---|---|---|---|---|---|
| 0 | $1,500 | $0 | $500 | $0 | $2,000 |
| 1 | $9,000 | $1,200 | $2,500 | $0 (or minimal) | ~$12,700 |
| 2 | $18,000 | $6,000 | $4,000 | $24,000 (shared) | ~$52,000 |
| 3 | $40,000 | $24,000 | $8,000 | $150,000 (two founders, partial market rate) | ~$220,000 |

Spend rules:
- **Infra ≤ 20% of revenue** from month 6 onward (higher before revenue exists).
- **Marketing ≤ 15% of prior-quarter gross profit.**
- **No full-time hire** until a paying customer's retention or a booked pipeline funds it for 12 months forward.

Founder draws start once MRR covers infra + tooling + a modest safety buffer for three months.

## 8. Cash flow

| Year | Revenue collected | Cash OPEX | Net cash | Cumulative cash |
|---|---|---|---|---|
| 0 | $0 | $2,000 | −$2,000 | −$2,000 |
| 1 | $105,000 | $12,700 | +$92,300 | +$90,300 |
| 2 | $440,000 | $52,000 | +$388,000 | +$478,000 |
| 3 | $1,250,000 | $220,000 | +$1,030,000 | +$1,508,000 |

Annual-in-advance billing is a cash-flow tailwind: ~60% of ARR is collected upfront, smoothing the first year dramatically.

## 9. Capital plan

- **No planned fundraise.** Bootstrap from founders' runway and revenue.
- **Safety net**: each founder keeps 6 months of personal runway outside the company. If shared cash reserves drop below 3 months of committed infra + tooling, we cut costs *before* we touch product quality.
- **Opportunistic capital**: if a strategic partner (e.g., Neo4j, cloud marketplace) offers capital at favourable terms with meaningful distribution, we consider it. Default answer is no.
- **No board, no investor updates, no SAFE notes** in year 0–1. Lightweight SARL / Delaware C-Corp setup only.

## 10. Headcount plan

| Year | Valentin | Alexandre | Contractors | Full-time hires | Total FTE |
|---|---|---|---|---|---|
| 0 | Full-time, unpaid | Full-time, unpaid | 0 | 0 | 2 |
| 1 | Full-time, token draw Q4 | Full-time, token draw Q4 | 1 designer 0.1 FTE; 1 writer 0.05 FTE | 0 | ~2.15 |
| 2 | Full-time, half-salary | Full-time, half-salary | 2 part-time | 0 | ~2.5 |
| 3 | Full-time, market salary | Full-time, market salary | 2 part-time | 1 (GTM or SRE — whichever the data says) | 3–4 |

See [HIRING_PLAN.md](../09_team/HIRING_PLAN.md) for triggers and role definitions.

## 11. Key ratios we track

| Ratio | Target year 1 | Target year 3 |
|---|---|---|
| Gross margin | 70%+ | 85%+ |
| LTV/CAC (note: founder time not costed) | 10x+ | 15x+ |
| Monthly net cash | positive from month 9 | comfortably positive |
| Rule of 40 | -10 to +10 | 50+ |
| NRR | 105% | 118%+ |

Magic number and burn multiple are deferred until we have paid marketing spend large enough for the denominators to be meaningful.

## 12. Sensitivity analysis

Top variables and the impact of a 20% change in each on year 2 ARR:

- **Business win rate**: +20% = +$90k ARR.
- **Enterprise ACV**: +20% = +$40k ARR.
- **Team churn**: −20% (from 25% to 20%) = +$25k ARR.
- **Content-driven inbound**: +20% = +$50k ARR.
- **LLM cost per request**: +50% = −$4k COGS (too small to matter yet).

## 13. Key risks

| Risk | Financial impact | Mitigation |
|---|---|---|
| Slow Team adoption | Runway stretched; founder draws delayed | Cheap infra; Free tier converts; content plays |
| First Enterprise takes >9 months to close | Year-1 ARR misses central case | Mid-market bridge; Business tier is primary revenue anchor |
| Vendor cost shock (LLM, Aura) | Margin compression | Multi-vendor LLM adapter; Aura reserved; Free-tier feature gating |
| One founder needs to leave | Existential | 6-month overlap clause in founder agreement; extensive docs (this repo) |
| Competitive launch from incumbent | Slower acquisition | Open-source community, ontology importers, lower price point |

## 14. Discounting and revenue recognition assumptions

- Average blended discount: 8% off list (annual commitments absorb most of it).
- Revenue recognised rateably per ASC 606 / IFRS 15.
- ARR booked at the contract's annualised value.
- Services revenue (training / onboarding) bundled into Business/Enterprise; not broken out.

## 15. Tax and international

- French SAS or US Delaware C-Corp (to be finalised by Valentin with counsel).
- VAT / GST via Stripe Tax.
- No planned subsidiaries until revenue warrants it.
- Transfer pricing not applicable in the two-founder phase.

## 16. Fundraising readiness (optional path)

We maintain enough rigour to raise quickly if we choose to, but we do not optimise for it.

- Clean cap table (founders' equity + future ESOP pool).
- Metrics dashboard publishable on 24 hours' notice.
- Legal templates (DPA, MSA, employment offer) ready.
- Customer references warm.

## 17. Monthly founder review

Each month Valentin and Alexandre do a 45-minute review:

- MRR, ARR, churn.
- Pipeline and conversion.
- Product metrics (activation, NSM).
- Cash in, cash out, runway.
- Biggest risks and decisions for the next month.

Decisions logged in `docs/07_business/FOUNDER_DECISIONS.md` (to be created on first monthly review).

## 18. What would break the plan

- Unable to close first 3 Business customers in year 1 → reconsider positioning.
- Free → Team conversion < 1% → revise onboarding or pricing.
- Blended annual churn > 30% → pause acquisition until retention fixed.
- Monthly cash negative for two consecutive months post-launch → cost-cut immediately.

Each trigger has a pre-agreed response plan.

## 19. What would blow the plan up (positively)

- An ontology-adopting standard body or large open-source project champions us.
- A strategic partnership with Neo4j, AWS, Azure, or GCP creates consistent inbound.
- A high-profile customer case study cascades into similar logos.

If any of these happen, we have pre-agreed "upside infra headroom" budgets ready.

## 20. Ownership and rhythm

- **Valentin** owns the financial plan, maintains the model, runs monthly review.
- **Alexandre** owns infra/tooling cost tracking and attends monthly review.
- **External accountant** from year 1 (annual filing; quarterly check-in year 2+).
- **Re-baseline** every 3 months.

---

Related: [Pricing Model](PRICING_MODEL.md) · [Cost Analysis](COST_ANALYSIS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Go-to-Market](../07_business/GO_TO_MARKET.md) · [Hiring Plan](../09_team/HIRING_PLAN.md)
