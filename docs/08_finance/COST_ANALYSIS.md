# Cost Analysis

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)

What it costs to build and run Semlify — month by month, as a two-founder bootstrapped company, with a deliberate bias toward free tiers, usage-based pricing, and deferring every expense that is not customer-visible.

> All figures in USD. Cost bands based on public pricing observed in April 2026. Reviewed monthly.

---

## 1. Cost structure overview

Four buckets:

1. **COGS** — direct cost of delivering the service. Drives gross margin.
2. **Build (engineering + product + design)** — founders' time, plus minimal tools.
3. **Acquire (sales + marketing)** — content, events, and any paid channels.
4. **Run the company** — legal, accounting, banking, insurance.

Founder time is *not* loaded into any bucket while we are bootstrapped. Tracking cash out only; once we start drawing salaries (year 2), we layer that in explicitly.

## 2. The bootstrap floor — what we actually pay today

Monthly infra + tooling cost before we have customers:

| Item | Tier | Cost / month |
|---|---|---|
| Neo4j Aura Free | Free | $0 |
| Neon Postgres | Free | $0 |
| Upstash Redis | Free | $0 |
| Cloudflare R2 | Free (10 GB) | $0 |
| Fly.io compute (small) | Hobby | $15 |
| Vercel (frontend) | Hobby | $0 |
| Cloudflare (DNS, CDN) | Free | $0 |
| Clerk auth | Free dev tier | $0 |
| Stripe | pay-per-transaction | $0 until revenue |
| Resend (email) | Free (3k emails) | $0 |
| Sentry | Free (5k events) | $0 |
| GitHub | Free | $0 |
| Linear | Free (2 users) | $0 |
| 1Password | 2 users | $7.99 |
| Domain | annual | ~$2 |
| **Total** | | **~$25 / month** |

One-time: Mac / Linux workstations we already own; no new hardware.

## 3. Infra cost at 10 paying customers (month 6–9 of year 1)

| Item | Tier | Cost / month |
|---|---|---|
| Neo4j Aura Professional | Shared tenant, 8 GB | $65 |
| Neon Postgres Launch | Shared | $20 |
| Upstash Redis Pro | pay-as-you-go | $15 |
| Cloudflare R2 | usage | $5 |
| Fly.io compute | 2 small machines | $35 |
| Vercel Pro | Pro | $20 |
| Clerk auth | Pro | $25 |
| Resend | Pro | $20 |
| Sentry Team | Team | $26 |
| Grafana Cloud | Free + usage | $10 |
| Stripe Tax | pay-per-txn | $10 |
| Linear Standard | 2 users | $16 |
| 1Password | 2 users | $8 |
| **Total** | | **~$275 / month** |

At $5,000 MRR, that is 5.5% COGS — ample room for gross margin.

## 4. Infra cost at 50 paying customers (year 2)

| Item | Cost / month |
|---|---|
| Neo4j Aura (mixed shared + first dedicated) | $700 |
| Postgres (Neon scale) | $150 |
| Redis (Upstash pay-as-you-go) | $80 |
| R2 object storage | $40 |
| Compute (Fly.io / Vercel) | $250 |
| Clerk auth | $120 |
| Resend email | $80 |
| Observability (Grafana Cloud, Sentry, Logtail) | $200 |
| LLM pass-through (opt-in AI pack) | $150 (covered by add-on revenue) |
| Security scanning (Semgrep, Dependabot) | $0–$50 |
| **Total** | **~$1,800 / month** |

At $40,000 MRR, infra is 4.5% of revenue — on target.

## 5. Per-tenant COGS blended by plan

| Plan | Avg monthly COGS | Monthly price | Gross margin |
|---|---|---|---|
| Free | $2–$4 | $0 | negative (marketing expense, capped by the 500-concept / 5k-API ceiling) |
| Team | $60–$90 | $416–$499 | ~82% |
| Business | $250–$400 | $1,659–$1,990 | ~85% |
| Enterprise (dedicated) | $600–$1,200 | $3,333+ | ~85–90% |

Numbers compress as we get better at resource-sharing on the shared tenant and as Neo4j Aura reserved pricing kicks in around $50k committed.

## 6. COGS scaling curves

| Paying customers | Monthly infra | Monthly infra / paying customer |
|---|---|---|
| 10 | $275 | $27 |
| 50 | $1,800 | $36 |
| 200 | $6,500 | $33 |
| 500 | $15,000 | $30 |
| 1,000 | $28,000 | $28 |

Per-customer infra cost stays in a $25–$40 band through the first 1,000 customers. The big step-up happens when we add a second dedicated Neo4j cluster for Enterprise isolation, which Enterprise ACV more than covers.

## 7. Reserved capacity (only when we have visibility)

We commit to reserved capacity only when monthly usage has been ≥ 80% predictable for three consecutive months.

Likely candidates (year 2):
- Neo4j Aura: commit to annual pricing at ~$50k/yr to unlock 15% discount — only once we have two Enterprise customers plus steady Business volume.
- Cloudflare: no commit needed before year 3.
- No cloud-provider reservations until we migrate anything off managed services, which we do not plan in year 1–2.

## 8. LLM cost model (AI add-on pack)

- Average request: ~2k tokens in, 500 tokens out.
- Cheapest tier (Claude Haiku, GPT-4o-mini): ~$0.005 / request.
- Mid-tier (Claude Sonnet, GPT-4o): ~$0.02 / request.
- Budget: $199/mo AI pack covers up to ~10,000 mid-tier requests or ~40,000 cheap-tier requests per month.
- Margin target on AI pack: ≥ 40% after vendor cost at the 80th-percentile usage profile.

Multi-vendor adapter is a must: any vendor price shock gets routed around rather than eaten.

## 9. Build cost (founders' time, year 0 and year 1)

Year 0 (months 0–6, pre-launch): two founders full-time, zero cash compensation.

Cash cost of building:
- Infra + tooling: ~$150–$300 / month (see Section 2).
- Legal company setup (SAS or Delaware C-Corp + basic templates): $1,500–$3,000 one-time.
- Accounting software (bookkeeping): $25 / month from year 1.
- Domain + branding assets: ~$500 one-time.

Founder draws: $0 in year 0. Starting from month 9–12 of year 1 when MRR covers infra + tooling + 3 months of safety buffer, founders may take token draws ($1,000–$2,000 / month each). Full or partial market salaries only from year 2 onward.

### Contractors (selectively)

- Part-time designer (0.1 FTE) from month 4: ~$1,500/month for landing page + early brand work.
- Part-time technical writer (0.05 FTE) from month 6: ~$600/month for docs polish.

Everything else stays with the founders.

## 10. Acquisition cost (marketing and sales, year 1)

Bootstrap channel mix — total year 1 cash cost < $3,000:

| Channel | Monthly cost |
|---|---|
| Content (founders write) | $0 |
| Open-source (Ontology-Importer library) | $0 |
| SEO tooling (Ahrefs Starter) | $29 |
| Community (Discord, OSS events) | $50 travel / goodies |
| Founder-led sales | $0 cash; time only |
| Paid ads | $0 in year 1 |
| Events (one low-cost talk / meetup) | $100 / event, 3 / year |

Year 2 may add: small paid retargeting experiment (budget $500/mo), one paid conference sponsorship (~$3,000).

## 11. Company-running cost

| Item | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Legal (company + customer MSAs, external counsel) | $2,000 | $4,000 | $8,000 |
| Accounting (external bookkeeper + annual return) | $1,500 | $3,500 | $6,000 |
| Banking fees | $200 | $400 | $600 |
| Insurance (cyber, professional) | $0 | $2,500 | $6,000 |
| Founders' tools (1Password, Notion personal, Miro) | $800 | $1,200 | $1,800 |
| **Total / year** | **~$4,500** | **~$11,600** | **~$22,400** |

Note: We defer insurance to year 2 because most early customers will not demand it; we carry the risk explicitly.

## 12. Compliance cost (deferred, not zeroed)

Customer-facing compliance is expensive. We defer it until a customer *pays* for it.

- **SOC 2 Type I** audit: $8,000–$15,000 one-time + $6,000–$10,000 / year. Triggered by first customer that contractually requires it or by $250k ARR — whichever comes first.
- **GRC tooling** (Drata / Vanta / Secureframe): $8,000–$15,000 / year. Begun only at SOC 2 kick-off.
- **Annual penetration test**: $8,000–$15,000. Triggered at SOC 2 kick-off or by Enterprise customer requirement.
- **ISO 27001**: deferred past year 2 unless customer demands it.
- **HIPAA BAA**: on-demand per customer.

We publish a clear compliance roadmap (see [COMPLIANCE.md](../06_security_compliance/COMPLIANCE.md)) so prospects know when to expect each milestone.

## 13. Cost of infrastructure failure

- DR drill: 1 per quarter, half a founder-day each — no cash cost.
- Annual full restore test: one founder-day — no cash cost.
- SLA credit reserve: 1% of annual recognised revenue, held on the balance sheet.

## 14. Cost of building feature C2 (AI suggestions)

- Engineering: Alexandre, ~3 weeks part-time during year 1.
- LLM experimentation budget: $300 one-time.
- Evaluation tooling: internal scripts, no cash cost.
- Ongoing: self-funding via the $199/mo add-on.

## 15. Cost of building feature C5 (MCP server)

- Engineering: Alexandre, ~2 weeks.
- Runs on existing infra; marginal hosting $0 in year 1.
- Strategic value: positions Semlify as the canonical ontology source for agent ecosystems.

## 16. Cost efficiency levers (bootstrap-specific)

- **Caching** (Redis, HTTP): cuts read load by 60–80% — mandatory from day one.
- **Shared multi-tenant** on Team and Business avoids per-customer infra cost.
- **CDN + edge compute** on Cloudflare for hot paths.
- **Batching jobs** during off-peak hours.
- **Prefer usage-based billing from vendors** over flat tiers until volume justifies it.
- **Turn off what is not used**: monthly cost audit kills subscriptions with <1 use per week.

## 17. Cost risks

| Risk | Mitigation |
|---|---|
| Neo4j Aura price hikes | Shared tenant leverage; adapter pattern to swap GraphStore if needed; keep an ArcadeDB fallback evaluated |
| LLM vendor price volatility | Multi-model adapter; pass-through on heavy workloads; add-on pricing can absorb a 2x spike |
| Cloud egress surprises | Cloudflare R2 (zero egress); aggressive caching |
| Enterprise tenant under-priced | Floor $40k/yr; per-customer cost dashboard to catch drift early |
| Support load from Free users | Hard 500-concept / 5k-API ceiling; docs-first |
| Compliance spend ahead of demand | Deferred until customer-paid trigger |

## 18. Governance

- **Monthly cost review**: Valentin + Alexandre, 30 minutes, first Monday of the month.
- **Every new subscription** requires both founders' approval.
- **Cost dashboard** in Grafana: per-vendor monthly spend, per-customer estimated COGS.
- **Alerts** on anomalies (spend doubling week-over-week, any single line item > 20% of COGS).

## 19. Where cost is worth spending (even when bootstrapped)

- **Founder health**: at least one week off per quarter. Burnout is the most expensive cost we could incur.
- **Security**: customer-visible basics (TLS, password hygiene, audit log) from day one.
- **Performance**: latency is a product feature; caching and proper indexing get built right the first time.
- **Docs**: every hour of writing saves hours of support.
- **Design polish**: the UX difference vs Protégé is the reason customers will pay.

## 20. Where we resist spending

- **Agencies** for marketing before we know what we are promoting.
- **Annual SaaS contracts** for tools we have not verified we will use.
- **Conferences** that do not align to ICP — maximum one per quarter.
- **Growth hack tools** that do not respect the user.
- **Logos on an office wall** — we do not have an office.
- **Premature hires**. Our costliest line item is the one that is not a bug, not a feature, and not a customer.

---

Related: [Pricing Model](PRICING_MODEL.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Infrastructure](../05_operations/INFRASTRUCTURE.md) · [Business Strategy](BUSINESS_STRATEGY%20(imported%20to%20notion).md)
