# Hiring Plan

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

Who we hire, when, and how. Written from a two-founder bootstrap baseline, not a VC-funded headcount ramp. Living document; refreshed at the start of each quarter.

---

## 1. Hiring philosophy

- **The team is two founders.** Everything about hiring assumes this for the next 12–18 months, minimum.
- **Every hire is a customer-funded hire.** We do not hire on a forecast; we hire after the revenue exists or the commitment is signed.
- **Slow to hire, kind to let go.** High bar at entry; exits handled with respect.
- **Seniority before specialists.** Our first full-time hire will be a senior generalist.
- **Contractors first.** For many functions (design polish, writing, legal, bookkeeping), a part-time specialist is a better fit for our volume than a full-time employee.
- **Remote-first.** Hire the best person for the role, not the nearest person.

## 2. Founder roles and responsibilities

### Valentin — co-founder, business and product

Time allocation (year 1):

- Product management, prioritisation, roadmap: 30%
- Sales, pricing, customer success: 25%
- Marketing, content, community: 20%
- Finance, legal, operations: 15%
- Hiring and team: 10%

Owns every document in `07_business/`, `08_finance/`, `10_launch/`, most of `00_overview/`, and shares `01_product/` with Alexandre.

### Alexandre Delplace — co-founder, CTO

Time allocation (year 1):

- Engineering (backend, graph, infra): 60%
- Engineering (frontend): 20%
- Security, compliance, on-call: 10%
- Hiring (technical): 5%
- Architecture, tech strategy: 5%

Owns every document in `02_architecture/`, `03_engineering/`, `04_design/` (shared with Valentin), `05_operations/`, `06_security_compliance/`, and shares `01_product/` with Valentin.

### Shared / joint responsibilities

- Monthly financial and strategic review (Section 8 of [FINANCIAL_PROJECTIONS.md](../08_finance/FINANCIAL_PROJECTIONS.md)).
- Roadmap sign-off.
- Hiring decisions (both must agree).
- Pricing changes (both must agree).
- Any contract > $5,000 ACV signed by both.

## 3. When do we hire full-time number 3?

We do **not** hire a full-time person until *all* the following are true:

- MRR has covered infra + tooling + a modest founder draw for both founders for six consecutive months.
- We have a signed 12-month pipeline or retained customer base that funds the new role's fully-loaded cost without shrinking the cash buffer.
- The specific pain the hire solves has persisted for at least one quarter despite process changes and automation attempts.
- Both founders agree this is the single most valuable use of the next $100k.

Realistically this means: end of year 1 at the earliest, likelier mid-year 2.

## 4. First full-time hire (likely year 2)

Candidate roles in priority order:

1. **Founding Product Engineer** — senior full-stack, Neo4j-comfortable, takes a vertical slice from design to production. Frees Alexandre to think deeper on platform, security, and architecture. Triggered when engineering velocity is the bottleneck.
2. **Developer Relations / Community Lead** — writes, speaks, runs Discord, owns the importer library. Frees Valentin from content treadmill. Triggered when content is producing traffic but founder time is the constraint.
3. **Customer Success / Technical Account** — onboards Business and Enterprise customers, handles support escalations. Triggered when Valentin is spending > 40% of the week on support.

Whichever role is picked is the one the data says is the biggest constraint that quarter. The other two are deferred.

## 5. Year 2 target: three full-time people

By end of year 2:

- Valentin (founder, business / product)
- Alexandre (founder, CTO)
- Full-time hire #1 (one of the three roles above)

Part-time contractors we likely retain:

- Designer (0.1–0.2 FTE) for marketing and UX polish.
- Technical writer (0.05–0.1 FTE) for docs.
- Bookkeeper (monthly, ~4 hours).
- External counsel (on-demand per contract).

## 6. Year 3 shape

By end of year 3:

- Both founders.
- 1–2 full-time hires (the second likely the role we didn't pick in year 2).
- Same part-time contractors plus an additional senior engineer *if* Enterprise revenue justifies it.

Target team size end of year 3: **3–4 full-time**, not 72.

## 7. Headcount plan

| Function | Year 0 | Year 1 | Year 2 | Year 3 |
|---|---|---|---|---|
| Founders | 2 | 2 | 2 | 2 |
| Engineering (non-founder) | 0 | 0 | 0–1 | 1–2 |
| DevRel / community | 0 | 0 | 0–1 | 1 |
| Customer success / support | 0 | 0 | 0–1 | 0–1 |
| Part-time contractors (FTE-equivalent) | 0 | 0.15 | 0.3 | 0.4 |
| **Total FTE** | **2** | **~2.15** | **2.5–3.5** | **3.5–5** |

Numbers are plan-linked, not goal-linked. We hire if unit economics and pipeline justify.

## 8. Compensation bands

Transparent bands for every role. Market data sourced from Pave, Radford, Levels.fyi, and peer networks.

- Posted in the job ad.
- Re-benchmarked annually.
- Adjusted for cost-of-labour by geography using a published policy.

Example Founding Product Engineer (EU / UK / mid-market US, 2026–2027):

- Base: €75k–€110k (EU) / $140k–$180k (US).
- Equity: 0.5%–1.5% (first non-founder engineer — meaningful).
- 4-year vest with 1-year cliff.
- Small signing bonus as needed.

Founders' own compensation:

- Year 0: $0.
- Year 1: token draws of $1,000–$2,000 / month starting from month 9–12 when cash allows.
- Year 2: half-market base salary.
- Year 3: full market base salary if revenue permits.

## 9. Equity philosophy

- First 5 hires receive meaningful equity (0.5%–2%, role and timing dependent).
- 4-year vest, 1-year cliff.
- Double-trigger acceleration on change of control for founders and future leads.
- Annual refresh grants based on performance and tenure.
- We do not dilute out the founders' control while bootstrapping; the cap table stays simple.

## 10. Offer process

1. Reference checks complete (3 references, at least one prior direct manager).
2. Both founders align within 48 h of final interview.
3. Offer call from the hiring founder.
4. Written offer within 24 h.
5. Offer expiry: 7 days by default.

No low-ball offers. Our first offer is our best offer.

## 11. Interview process

Consistent for every role. Kept lean — two founders cannot afford 8-stage interview loops.

Phases:

1. **Founder screen** (30 min): motivation, experience, logistics.
2. **Hiring founder deep dive** (60 min): role fit, scope, ambition.
3. **Craft interview** (half-day take-home + 90-min walk-through): role-specific. For engineers: build a small slice against the real codebase. For DevRel: draft a blog post and a Discord response. For CS: respond to a real support ticket plus a customer roleplay.
4. **Second founder chat** (45 min): values, collaboration, conflict handling.
5. **Reference calls** (3 references).

Decision: both founders must say yes. Target: two weeks from first call to offer.

## 12. What we assess

- **Craft**: role-specific excellence.
- **Ownership**: how they handle ambiguity and consequence.
- **Judgement**: how they decide with limited information.
- **Collaboration**: how they make others better.
- **Growth trajectory**: slope > current level.
- **Mission alignment**: they care about the problem and the customer.

We explicitly do not value pedigree over performance, bravado over substance, or "culture fit" as a synonym for sameness.

## 13. Sourcing

- **Network-first**: founder and early-customer referrals; $2,000 referral bonus once we have cash to pay it.
- **Community-driven**: people from the ontology, graph, data ecosystems (including our own Discord once it's healthy).
- **Public job board**: our website (no ATS in year 1; Notion + email is enough).
- **Targeted outbound**: by the hiring founder directly.

No external agencies before year 3 unless we're filling a genuinely specialist senior role.

## 14. Candidate experience

- Response within 5 business days to every application.
- Rejections explain the reason (briefly and kindly).
- Honorarium ($150) for candidates who complete a take-home exceeding 2 hours.
- Interview feedback offered on request.

## 15. Onboarding hand-off

Hiring closes with a hand-off to the [ONBOARDING.md](ONBOARDING.md) plan. The hiring founder is the onboarding buddy for the first 30 days.

## 16. Probation / orientation period

- 90-day orientation (expectations, not a formal probation).
- Weekly 1:1s with the hiring founder.
- 30 / 60 / 90 check-ins with written feedback from both founders.
- Mutual decision at day 90 to continue; honest if not a fit.

## 17. Location strategy

- Remote-first across Europe and North America.
- Shared working hours overlap: at least 3 hours / day with Paris.
- No office; occasional team meetup (1–2 times per year, modest budget).

## 18. Contractor model

- Designer, writer, bookkeeper, legal are part-time / per-engagement.
- All contracts include IP assignment and confidentiality.
- Contractors can become full-time later if the relationship works.

## 19. Anti-patterns we avoid

- Hiring "because the pipeline looks hot for a week".
- Hiring sales before marketing produces inbound that sales can close.
- Offers without reference checks.
- Ghosting candidates.
- Hiring to signal growth to prospects or investors.

## 20. Review cadence

- Hiring plan refreshed at the start of every quarter.
- Monthly check: are we at or near the trigger conditions for the first full-time hire?
- Exits reviewed honestly and quickly; learn and move on.

---

Related: [Onboarding](ONBOARDING.md) · [Contributing](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Financial Projections](../08_finance/FINANCIAL_PROJECTIONS.md)
