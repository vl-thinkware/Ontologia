# Pricing Model

The plans, how we chose them, and the rules we follow when packaging, pricing and evolving them.

> **Currency**: USD is the list currency. We bill in EUR / GBP at published conversion rates for the corresponding regions. Enterprise contracts in local currency on request.

---

## 1. Packaging philosophy

- **Predictable**. Value metric is *editor seats*, not mystery "consumption units". Customers understand what they pay for.
- **Transparent**. List prices are public. Discounts are rules-based, not ad hoc.
- **Generous on ceilings**. Free and Starter tiers can actually be used; we don't engineer rage-quits.
- **Fair to grow into**. Upgrades unlock meaningful capabilities, not arbitrary gates.
- **No dark patterns**. No auto-upgrades, no usage traps, no hostile cancellation flow.

## 2. Plans at a glance

| Plan | Price (USD) | Editors | Workspaces | Ontologies | API calls / month | Retention / audit | Support |
|---|---|---|---|---|---|---|---|
| **Free** | $0 | 2 | 1 | 1 | 1,000 | 30 days | Community |
| **Starter** | $15 / editor / month, billed annually (or $19 monthly) | Up to 10 | 3 | 5 | 100,000 | 90 days | Email, 24 h first response |
| **Pro** | $49 / editor / month, billed annually (or $59 monthly) | Up to 100 | 10 | Unlimited | 1,000,000 | 12 months audit log | Chat, 8 h first response |
| **Enterprise** | Custom, starting $40,000 / year | Unlimited | Unlimited | Unlimited | Unlimited within fair-use | 7 years audit log | Dedicated CSM + named support, 1 h first response (P1) |

Viewers and reviewers are free on every paid plan.

## 3. What each tier includes (detail)

### Free
- Everything needed to understand the product.
- Single workspace, one ontology, two editors, one reviewer, unlimited viewers.
- Core authoring, branches, reviews (1 parallel branch).
- JSON-LD / JSON / CSV exports.
- No API key creation (read API via session only).
- Community support.

### Starter
- For small teams and side projects.
- Up to 10 editors, 3 workspaces, 5 ontologies.
- Up to 5 parallel branches.
- 100,000 API calls / month.
- Audit log (90 days).
- Email support (24 h first response business days).

### Pro
- For teams where ontology work is business-critical.
- Up to 100 editors, 10 workspaces, unlimited ontologies.
- SSO (OIDC), branch protection policies, custom roles via CASL profiles.
- Webhooks, public API, SCIM (add-on).
- EU or US region at provisioning.
- Audit log (12 months), chat support.
- Includes one "Success onboarding" session.

### Enterprise
- For regulated or scale customers.
- Unlimited editors, workspaces, ontologies.
- SSO (SAML + OIDC), SCIM 2.0, custom roles and ACLs, per-ontology ACLs.
- Dedicated Neo4j Aura per tenant, dedicated Postgres schema.
- Data residency (EU / US / additional on request).
- Audit log retention up to 7 years.
- 99.95% uptime SLA with service credits.
- Custom DPA, Security reviews, pen test report under NDA.
- TAM (technical account manager), executive sponsor.
- Priority phone + chat support.
- Optional BYO KMS keys, customer-managed encryption.
- HIPAA BAA on demand.

## 4. Add-ons

| Add-on | Price |
|---|---|
| Extra workspaces (Pro) | $99 / workspace / month |
| Additional API volume (Pro) | $49 / 500,000 calls / month |
| AI suggestions pack (C2) | $10 / editor / month (Starter+); included in Enterprise |
| SCIM (Pro) | $500 / month |
| Additional region (Pro) | $500 / month |
| Additional audit log retention (Pro) | $200 / month per extra year |
| Premium support (Pro → Enterprise levels) | 20% of base ARR |

Add-ons are priced to reflect actual cost + strategic positioning. Customers should feel they get more than they pay for.

## 5. Billing mechanics

- **Annual billing**: invoice, wire or card. 10% discount vs monthly card.
- **Monthly billing**: card (Stripe).
- **Multi-year**: 5% extra discount for 2-year, 8% for 3-year. Pre-payment optional.
- **Prorations**: seat additions prorated daily. Removals credit next cycle.
- **Taxes**: VAT, GST, sales tax applied based on billing address.
- **Currencies**: USD default; EUR, GBP, CAD, AUD published. Enterprise can request local currency.
- **Invoices**: Stripe + tax provider (Stripe Tax). Sent on billing start date and each renewal.

## 6. Trials and pilots

- **Free tier acts as the trial**. Any user can upgrade to Pro with a 14-day money-back guarantee.
- **Pro trial on Starter**: one-click 14-day Pro trial per workspace, card required, auto-downgrades if not upgraded.
- **Enterprise pilots**: 2–6 weeks, scoped success criteria, pre-agreed commercial. Paid in advance if the customer expects >50 users.

## 7. Discounting rules

Discount authority:

| Discount | Who approves |
|---|---|
| Up to 10% | AE |
| 10–20% | AE + RVP of Sales (or CEO if role vacant) |
| 20–30% | CEO |
| >30% | CEO + Board approval (exceptional) |

Common levers:

- Multi-year pre-payment.
- Marquee logo agreement (reference + case study).
- Volume (editor seat bands).
- Non-profit / academic (up to 50%).
- Early adopter grandfathering.

Discount discipline avoids quarter-end chaos and preserves pricing integrity.

## 8. Volume bands (Enterprise)

Indicative — every Enterprise deal includes custom legal terms.

| Editor seats | Price / editor / year |
|---|---|
| 100 | $540 |
| 250 | $480 |
| 500 | $420 |
| 1,000 | $360 |
| 2,500+ | Custom (usually $300–$330) |

Additional line items: SCIM, extra regions, BYOK, HIPAA BAA, support tier, training.

## 9. Non-profit, academic and open-source programmes

- **Non-profit**: up to 50% off Pro.
- **Academic research**: Pro free for accredited researchers; Enterprise discounted for universities.
- **Open-source projects**: free Pro for OSS organisations maintaining public ontologies.

Fair-use caps apply; we do not subsidise unrelated commercial use.

## 10. Fair use

- Abusive API traffic or sharing editor accounts across many humans triggers conversations, not surprise invoices.
- Overage default behaviour: notify the owner at 80% and 100% of a limit; throttle (not block) at 120%; contact for upgrade at 150%.
- Limits are published.

## 11. Refunds and credits

- 14-day money-back guarantee on first upgrade to Pro.
- SLA credits per [SLA.md](../05_operations/SLA.md).
- Operational apology credits issued by CS for confirmed, customer-impacting issues.

## 12. Price changes

- Written notice 60 days in advance for Pro; 90 days for Enterprise.
- Grandfathering for existing annual customers to the end of their term.
- CPI-linked increase capped at 5% per year on renewals for Enterprise unless negotiated otherwise.
- No surprise hikes mid-term.

## 13. Seat policy

- **Editor**: users who create or modify content. Charged.
- **Reviewer**: users who can comment and approve reviews but cannot modify content outside review. Free.
- **Viewer**: read-only. Free.
- SSO users still count against editor seats when they create or modify.
- A user can be an editor in one workspace and a viewer in another; charged once per org at the editor rate if editor in any.

## 14. How we arrived at these prices

- **Benchmarks**: Atlan, Notion, Linear, Figma, Neo4j Aura, Collibra.
- **Design-partner WTP**: surveyed during discovery; $30–$60 per editor / month was acceptable.
- **Cost envelope**: aim for gross margin > 75% on Pro seats, > 82% on Enterprise.
- **Positioning**: undercut TopBraid/Collibra at the mid-market while commanding a premium over hobby tools.

## 15. Future pricing explorations (not yet shipped)

- Usage-based top-ups for very-high API volumes (likely post-Series A).
- Marketplace revenue share for published ontology templates.
- Federation / multi-org billing for holding companies.
- "Ecosystem" tier: public-sector and standards bodies at cost-plus pricing.

Changes to the public pricing page go through product + CS + finance review.

## 16. Pricing page commitments

- Public.
- Plain English.
- Clear per-plan FAQ.
- ROI calculator.
- Comparison with like-for-like alternatives (fact-checked).
- Contact-us only for the Enterprise starting point; we still publish the floor.

## 17. Invoicing, procurement & purchase orders

- PO-based billing supported for Enterprise and on Pro for >$10k ACV.
- NET 30 default; NET 45 on request; NET 60 rare and CEO-approved.
- Payment via wire (USD, EUR, GBP, CHF), card, or marketplace (post-listing).
- Accepted on AWS Marketplace / Azure Marketplace where we're listed.

## 18. Risk and financial controls

- Revenue recognised per ASC 606 / IFRS 15.
- Contracted annual prepaid revenue deferred and recognised monthly.
- Monthly MRR / ARR reconciliation with the product usage.
- Audited annually post-Series A.
- Subscription and tax reporting automated via Stripe + tax provider.

## 19. Ownership

- **CEO** owns pricing strategy.
- **Finance lead (or CFO later)** owns billing infrastructure, revenue recognition, invoicing.
- **Sales / CS** owns discount discipline.
- **Product marketing** owns pricing page and packaging narrative.
- **Legal** owns contract terms.

Quarterly pricing review by this group; any change signed off before release.

## 20. Anti-patterns we avoid

- Charging for seats people don't actually use.
- Hidden overage fees.
- Forcing an annual commitment to get basic features.
- Pressuring customers with "limited time" discounts that aren't really limited.
- Surprising enterprises with post-sales cost escalation.

Related: [Cost Analysis](COST_ANALYSIS.md) · [Financial Projections](FINANCIAL_PROJECTIONS.md) · [Unit Economics](UNIT_ECONOMICS.md) · [Business Strategy](../07_business/BUSINESS_STRATEGY.md) · [Go-to-Market](../07_business/GO_TO_MARKET.md)
