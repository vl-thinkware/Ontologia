# Launch Checklist

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


The definitive pre-GA checklist. Every box ticked, every owner signed off, every gate green. When this doc is 100% done, we turn Semlify from "beta" to "generally available".

---

## 1. Timeline

- T–90 days: open beta; feature-completeness for GA scope.
- T–60 days: soak period; bug-burn; docs finalisation.
- T–30 days: launch readiness review.
- T–14 days: comms assets frozen.
- T–7 days: go / no-go call.
- T–0: GA launch.
- T+14 days: post-launch retro.

## 2. Gate owners

- **CTO** — engineering, infrastructure, security, reliability.
- **Product** — functional completeness, UX, onboarding.
- **Design** — visual polish, accessibility.
- **Security** — security checklist, SOC 2 Type I, trust center.
- **Legal** — terms, DPA, privacy, sub-processors.
- **CS** — support coverage, docs, onboarding flows.
- **Sales** — pipeline readiness, collateral.
- **Marketing** — launch campaign, site, PR.
- **Finance** — billing, revenue recognition, invoicing flows.
- **CEO** — final go/no-go.

## 3. Product readiness

- [ ] All GA-scope features shipped (M1–M6 complete, at least S1 + S2).
- [ ] No P0 bugs; P1 bugs with documented workarounds.
- [ ] Known issues list published.
- [ ] Feature flags default-on where intended; default-off remaining.
- [ ] In-app onboarding tested by 5 external users.
- [ ] Sample ontologies reviewed by design and domain experts.
- [ ] Release notes drafted for the launch version.

## 4. Engineering readiness

- [ ] E2E suite green on main for 14 consecutive days.
- [ ] Load tests at 3× expected traffic pass.
- [ ] Chaos drill (Neo4j failover, Postgres failover, Redis restart) pass.
- [ ] Deployment pipeline idempotent; rollback tested.
- [ ] Canary deploy mechanism tested.
- [ ] Backup + restore drill complete within RPO/RTO.
- [ ] Region provisioning tested (US and EU).
- [ ] Zero production-credentials in non-prod.
- [ ] Observability dashboards signed off.

## 5. Security readiness

- [ ] [SECURITY_CHECKLIST.md](../06_security_compliance/SECURITY_CHECKLIST.md) 100% ticked.
- [ ] SOC 2 Type I audit complete or observation window started.
- [ ] Pen test complete; critical findings resolved.
- [ ] WAF rules tuned; false-positive rate < 1%.
- [ ] Secret scanning + dep audit green on main.
- [ ] Threat model reviewed for GA scope.
- [ ] Trust center published.

## 6. Privacy readiness

- [ ] Privacy policy live.
- [ ] Terms of service live.
- [ ] DPA available; signed for design-partner customers.
- [ ] Sub-processor list published.
- [ ] Cookie banner deployed to EU traffic.
- [ ] DSR intake and workflow operational.
- [ ] DPIA completed for any feature processing personal data in a new way.

## 7. Legal readiness

- [ ] MSA posted.
- [ ] Order-form templates for Starter, Pro, Enterprise.
- [ ] Open-source license clarity on public repos.
- [ ] Trademark filings initiated.
- [ ] Insurance in force (D&O, E&O, cyber).

## 8. Billing readiness

- [ ] Stripe products, prices, tax rules configured.
- [ ] Proration + cancellation + refund flows tested.
- [ ] Dunning + failed-payment flow tested.
- [ ] PO / wire payment flow documented and rehearsed.
- [ ] Revenue recognition rules loaded in the finance tool.
- [ ] 14-day money-back guarantee flow live.
- [ ] Test customer full lifecycle signup → upgrade → downgrade → cancel → delete.

## 9. Docs readiness

- [ ] `docs.semlify.com` live with searchable content.
- [ ] Getting Started under 10 minutes validated by 3 external users.
- [ ] API reference generated from OpenAPI.
- [ ] SDK (TypeScript) published to npm.
- [ ] Webhook implementation guide live with working demo.
- [ ] Import / export guides for each supported format.
- [ ] Branching & review tutorial.
- [ ] Changelog page live and up to date.

## 10. Support readiness

- [ ] Intercom / Plain configured.
- [ ] Support rota assigned.
- [ ] Response-time SLAs enforced.
- [ ] Canned responses for top 30 anticipated tickets.
- [ ] Community channel (Slack/Discord) active with moderators.
- [ ] Self-serve knowledge base: at least 80 articles.
- [ ] Status page live at `status.semlify.com`.

## 11. Customer success readiness

- [ ] Onboarding kit finalised.
- [ ] Kickoff template for Enterprise ready.
- [ ] Health score model implemented.
- [ ] QBR deck template ready.
- [ ] Training certification program beta-live.

## 12. Sales readiness

- [ ] Demo environment with sample data.
- [ ] Pitch deck and one-pagers finalised.
- [ ] Battlecards for top 5 competitors.
- [ ] Pricing page live; internal pricing calculator ready.
- [ ] Security questionnaire responses canned.
- [ ] Order-form templates signed off by legal.

## 13. Marketing readiness

- [ ] Launch page live.
- [ ] Product video (90 s) published.
- [ ] Long-form product video (5–8 min) published.
- [ ] 3 customer case studies or testimonials live.
- [ ] 10+ foundational blog posts published.
- [ ] Social assets ready.
- [ ] Press list briefed under embargo.
- [ ] Analyst briefings done.
- [ ] Product Hunt + Hacker News launch plan.
- [ ] Email campaign to waitlist scheduled.
- [ ] Paid ads ready (small initial spend).

## 14. Partner readiness

- [ ] Neo4j partner page live.
- [ ] Initial integration listings (catalogue vendors, at least 2) live.
- [ ] Referral program page live.
- [ ] SI partner pack ready for first signed partners.

## 15. Infrastructure & costs

- [ ] Reserved capacity purchased where sensible.
- [ ] Cost dashboards reviewed weekly.
- [ ] Alert thresholds set for anomalies.
- [ ] EU region provisioned and tested.
- [ ] DR region validated.
- [ ] On-call rota + escalation wired to PagerDuty.

## 16. Trust & transparency

- [ ] Trust center includes: security overview, SOC 2 (NDA), pen test letter, DPA, sub-processors, uptime, incident history.
- [ ] Changelog public.
- [ ] Roadmap public.
- [ ] Pricing public.

## 17. Internal readiness

- [ ] All team trained on the launch narrative.
- [ ] Internal FAQ document for employees.
- [ ] Handover from beta to GA operations.
- [ ] Executive communications drafted (investors, advisors).

## 18. Go / No-Go meeting (T–7)

Attendees: all gate owners + CEO.

Agenda:
- Status of every gate.
- Outstanding risks and mitigations.
- Final go/no-go vote.

Decision recorded; if any gate is red, GA is held until fixed.

## 19. Launch day

- [ ] Final merge to main → tag GA release.
- [ ] Deploy to production via standard canary.
- [ ] Verify all health checks green.
- [ ] Flip "GA" flag on.
- [ ] Publish launch blog post and email.
- [ ] Press embargo lifts.
- [ ] Social channels activated.
- [ ] War room staffed for 12 hours.
- [ ] Hourly status updates in `#launch`.

## 20. Post-launch (T+14)

- [ ] Metrics snapshot: signups, activations, paid conversions, support tickets, incidents.
- [ ] Retrospective with all gate owners.
- [ ] Lessons captured in `docs/10_launch/retros/ga_launch.md`.
- [ ] Planning note for the next 90 days.

## 21. Rollback plan

If launch goes sideways:
- Public acknowledgement within 30 min of confirmed impact.
- Partial rollback via feature flag where possible.
- Full rollback to last known-good release if required.
- Customer communication + status page update every 15 min during incident.
- Retro within 5 business days.

## 22. Signatures

| Gate | Owner | Signed |
|---|---|---|
| Product | Product lead | ☐ |
| Engineering | CTO | ☐ |
| Security | Security lead (CTO until role filled) | ☐ |
| Design | Design lead | ☐ |
| Privacy / Legal | Legal (outside counsel confirmed) | ☐ |
| Finance / Billing | Finance lead | ☐ |
| Sales | Sales lead (CEO until hire) | ☐ |
| Marketing | Marketing lead | ☐ |
| CS / Support | CS lead | ☐ |
| CEO | CEO | ☐ |

Related: [Beta Program](BETA_PROGRAM.md) · [Support](SUPPORT.md) · [Release Process](../05_operations/RELEASE_PROCESS.md) · [Security Checklist](../06_security_compliance/SECURITY_CHECKLIST.md) · [Roadmap](ROADMAP%20(imported%20to%20notion).md)
