# Pricing Model

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)

How Ontologia is packaged, priced, and evolved. This plan is built for a two-founder, bootstrapped company that must reach sustainability on revenue, not funding rounds.

> **Currency**: USD is the list currency. We bill in EUR / GBP at published conversion rates for the corresponding regions. Enterprise contracts in local currency on request.

---

## 1. Packaging philosophy

- **Workspace, not seats.** A single taxonomist can deliver most of the value; charging per editor penalises exactly the customer we want. The paid metric is the *workspace* (a knowledge domain shared by a team) plus soft volume limits (concepts and API calls).
- **Predictable.** Customers see three numbers on the pricing page and a clear Enterprise floor.
- **Generous free tier.** Real work can be done on Free. It is the trial.
- **Flat tiers, not complex usage bands.** Bootstrap-friendly: low operational overhead, no billing engineering debt.
- **List prices public.** Discounts are rule-based, not salesperson-ad-hoc.
- **No dark patterns.** No auto-upgrades, no surprise overage invoices, no hostile cancellation flow.

## 2. Plans at a glance

| Plan | Price (USD) | Workspaces | Concepts (per org) | API calls / month | Audit retention | Support |
|---|---|---|---|---|---|---|
| **Free** | $0 | 1 | 500 | 5,000 | 30 days | Community |
| **Team** | $499 / month · $4,990 / year (save ~17%) | 3 | 25,000 | 500,000 | 90 days | Email, 24 h first response |
| **Business** | $1,990 / month · $19,900 / year (save ~17%) | Unlimited | 100,000 | 5,000,000 | 12 months | Chat + email, 8 h first response |
| **Enterprise** | Custom, starting **$40,000 / year** | Unlimited | Custom | Custom | Up to 7 years | Named CSM, 1 h P1 response |

Unlimited viewers on every plan. Unlimited editors on every paid plan — we are not charging per person.

## 3. What each tier includes

### Free — the trial
- One workspace, one ontology, up to 500 concepts.
- Unlimited collaborators at any role.
- Core authoring, change history, revert, tags.
- JSON-LD / JSON / CSV / TTL export.
- 5,000 API calls / month via UI session; no long-lived API keys.
- Community support (Discord + GitHub discussions).

### Team — $499 / month (or $4,990 / year)
- For a small team or a single domain expert running production taxonomies.
- Up to 3 workspaces, 25,000 concepts total.
- Up to 500,000 API calls / month.
- Long-lived API keys and webhooks.
- OIDC SSO (Google Workspace, Microsoft Entra).
- 90-day audit log.
- Email support with a 24-hour first-response SLA on business days.
- One onboarding call with a founder.

### Business — $1,990 / month (or $19,900 / year)
- For organisations with multiple domains, compliance appetite, or high API usage.
- Unlimited workspaces, up to 100,000 concepts.
- 5,000,000 API calls / month.
- SAML SSO, SCIM 2.0 provisioning.
- Custom roles via CASL profiles.
- 12-month audit log.
- EU *or* US region at provisioning.
- Chat + email support, 8-hour first response.
- Includes two onboarding sessions and one quarterly review.

### Enterprise — from $40,000 / year
- For regulated, scale, or procurement-heavy customers.
- Dedicated Neo4j Aura instance per tenant; dedicated Postgres schema.
- Data residency (EU, US, additional on request).
- SAML + OIDC, SCIM 2.0, per-ontology ACLs, approval workflows.
- Audit retention up to 7 years.
- 99.95% uptime SLA with service credits.
- Custom DPA, security questionnaires, pen test under NDA.
- Named CSM and executive sponsor.
- Priority phone + chat support; 1-hour P1 first response.
- Optional BYO KMS keys, customer-managed encryption.
- HIPAA BAA on demand.
- Custom ontology-volume and API ceilings.

## 4. Add-ons

Kept deliberately short to limit bootstrap operational overhead.

| Add-on | Price |
|---|---|
| Extra 25,000 concepts (Team) | $200 / month |
| Extra 2,000,000 API calls (Team / Business) | $99 / month |
| AI suggestion pack (C2) | $199 / month, flat (any paid plan); included in Enterprise |
| Additional region, non-Enterprise (Business) | $400 / month |
| Extended audit retention beyond plan default (Business) | $150 / month per extra year |

Add-ons are priced to cover marginal cost + a simple margin; they are not a second product.

## 5. Billing mechanics

- **Annual billing**: invoice, wire or card. ~17% discount vs monthly card (two months free).
- **Monthly billing**: card via Stripe.
- **Multi-year**: 5% extra discount for 2-year, 8% for 3-year. Pre-payment optional.
- **Prorations**: plan upgrades prorated daily; downgrades take effect next cycle.
- **Taxes**: VAT, GST and sales tax applied automatically via Stripe Tax based on billing address.
- **Currencies**: USD default; EUR, GBP published. Enterprise can request local currency.
- **Invoices**: sent on billing start date and each renewal.

## 6. Trials and pilots

- **Free tier is the trial.** Any Free account can upgrade to Team with a 14-day money-back guarantee.
- **Team → Business**: one-click 14-day Business trial per org, card on file; auto-reverts to Team if not upgraded.
- **Enterprise pilots**: 2–6 weeks, scoped success criteria, paid in advance from 50 users or $10k ACV equivalent.

## 7. Discounting rules

With just two founders, discount authority is simple and intentionally tight.

| Discount | Who approves |
|---|---|
| Up to 15% | Valentin solo |
| 15–25% | Valentin + Alexandre |
| >25% | Valentin + Alexandre, documented rationale, logo or multi-year commitment required |

Common levers:

- Annual pre-payment (already baked into the list).
- Multi-year pre-payment (extra 5–8%).
- Reference logo + case study agreement (up to 15%).
- Non-profit / academic (up to 50% on Team and Business).
- Early-adopter grandfathering for the first 10 paying customers.

Discipline matters more at bootstrap scale: every dollar discounted is a dollar we do not spend on infrastructure, one more month to break-even.

## 8. Enterprise sizing guide

Indicative — every Enterprise deal has custom legal and commercial terms.

| Ontology scale | Starting ACV |
|---|---|
| Up to 50k concepts, single region | $40,000 |
| 50k–250k concepts, single region | $60,000 |
| 250k–1M concepts, single region | $90,000 |
| 1M+ concepts or multi-region | $120,000+ |
| BYO KMS, HIPAA BAA, dedicated CSM bundle | Add $15,000–$30,000 |

Additional line items: extra regions, extended retention, training, integration services.

## 9. Non-profit, academic and OSS

- **Non-profit**: up to 50% off Team or Business.
- **Academic research**: Team free for accredited researchers; Business discounted for universities.
- **Open-source projects**: free Team for OSS organisations publishing their ontologies.

Fair-use caps apply; we do not subsidise commercial spin-offs.

## 10. Fair use

- Limits are published on the pricing page.
- Overage default behaviour: notify the workspace owner at 80% and 100%; throttle (not block) at 120%; contact for upgrade at 150%.
- Account sharing across unrelated humans triggers conversations, not surprise invoices.
- We reserve the right to rate-limit automation that degrades service for others.

## 11. Refunds and credits

- 14-day money-back guarantee on first upgrade from Free to Team.
- SLA credits per [SLA.md](../05_operations/SLA.md).
- Operational apology credits issued by Valentin for confirmed, customer-impacting issues.

## 12. Price changes

- Written notice 60 days in advance for Team / Business; 90 days for Enterprise.
- Grandfathering for existing annual customers to the end of their current term.
- CPI-linked increase capped at 5% per year on Enterprise renewals unless negotiated otherwise.
- No surprise hikes mid-term.

## 13. Role policy (clarification, not a pricing metric)

- **Editor**: users who create or modify content. Unlimited.
- **Reviewer**: users who can comment and validate changes. Unlimited.
- **Viewer**: read-only. Unlimited.
- Roles exist for governance and audit; they do not drive billing.

This is the most visible difference from PoolParty, Collibra, Atlan and TopBraid: a single taxonomist can run a fully-paid Ontologia organisation without negotiating over seats.

## 14. How we arrived at these prices

- **Market benchmarks**: PoolParty starts around €20k/year and scales to €100k–€150k; TopBraid EDG is commonly quoted at $100k+; Collibra and Atlan are in the same enterprise band. Protégé is free desktop software without collaboration.
- **Positioning**: materially below the enterprise incumbents, materially above hobby tools, with an explicitly collaborative and web-native experience.
- **Design-partner willingness-to-pay**: $400–$800 per month for Team was acceptable; $1,500–$2,500 for Business; $40k–$80k typical for a mid-market Enterprise deal.
- **Cost envelope**: gross margin target >80% on Team and Business, >85% on Enterprise (dedicated infra adds cost but ACV covers it).
- **Bootstrap math**: break-even needs approximately 5 Team + 1 Business customer (~$4,500 MRR / $54k ARR); see [FINANCIAL_PROJECTIONS.md](FINANCIAL_PROJECTIONS.md).

## 15. Future pricing explorations (not yet shipped)

- **Usage-based top-ups** for very-high API volumes beyond Business.
- **Template marketplace** revenue share for published ontology templates.
- **Federation billing** for holding companies with many subsidiaries.
- **Public-sector / standards-body** tier at cost-plus pricing.

Any of these ship only when the current plans are generating the cash to support them.

## 16. Pricing page commitments

- Public and scrapeable.
- Plain English.
- Per-plan FAQ.
- ROI calculator based on saved taxonomist hours and data-quality incidents.
- Fact-checked comparison with the usual alternatives.
- Contact-us only for Enterprise; we still publish the $40k/yr floor.

## 17. Invoicing and procurement

- PO-based billing supported for Enterprise and for Business over $10k ACV.
- NET 30 default; NET 45 on request; NET 60 rare and requires both founders' approval.
- Payment via wire (USD, EUR, GBP), card, or cloud marketplace (once listed).
- Marketplace listings (AWS / Azure / GCP) tracked in [PARTNERSHIPS.md](../07_business/PARTNERSHIPS.md).

## 18. Financial controls

- Revenue recognised per ASC 606 / IFRS 15.
- Annual prepaid revenue deferred and recognised monthly.
- Monthly MRR / ARR reconciliation with product usage, done by Valentin.
- Subscription and tax reporting automated via Stripe + Stripe Tax.
- External audit only if required by a specific customer or once ARR exceeds $1M.

## 19. Ownership

- **Valentin** owns pricing strategy, the pricing page, discounts, invoicing, revenue recognition.
- **Alexandre** owns billing instrumentation (Stripe integration, metering of concepts / API calls, usage data).
- **Legal**: external counsel on a per-contract basis until volume justifies a retainer.

Monthly pricing review (Valentin + Alexandre, 30 minutes). Any change signed off before release.

## 20. Anti-patterns we avoid

- Charging per person when one person can do the job.
- Hidden overage fees.
- Forcing an annual commitment to unlock basic features.
- Pressuring customers with "limited time" discounts that aren't really limited.
- Surprising enterprise customers with post-sales cost escalation.
- Enterprise-only security features (SSO, audit log) held hostage to force an upgrade beyond what is reasonable.

---

Related: [Cost Analysis](COST_ANALYSIS.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Go-to-Market](../07_business/GO_TO_MARKET.md)
