# Support

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


How we support customers after they sign up — channels, SLAs, tooling, and the principles that keep support a place of trust rather than friction.

---

## 1. Support philosophy

- **Support is a product feature**. A well-handled ticket is as memorable as a great onboarding.
- **Solve problems at the root**. Every repeated question becomes a doc, an in-product hint, or a bug to fix.
- **Proactive > reactive**. We surface issues before customers hit them.
- **Humans talk to humans**. No chatbot-only mazes.
- **Transparent status**. Incidents disclosed in near-real-time.

## 2. Support tiers

| Plan | Channels | First response | Target resolution |
|---|---|---|---|
| Free | Community + docs | Best effort | — |
| Starter | Community + email | 24 h (business days) | 5 business days |
| Pro | Community + email + chat | 8 h (business hours) | 2 business days |
| Enterprise | Dedicated channel, phone, email, chat, TAM | 1 h (P1), 4 h (P2), 1 BD (P3) | 4 BH (P1), 1 BD (P2), 5 BD (P3) |

Business hours: 9 am–6 pm in the customer's primary region (auto-detected). 24/7 for Enterprise on P1.

## 3. Ticket priority

- **P1 — Critical**: production outage or blocker; no workaround.
- **P2 — High**: major functionality impaired; partial workaround.
- **P3 — Normal**: bug or question; workaround available.
- **P4 — Low**: enhancement / FAQ.

Priority is set by the customer initially and confirmed by the support engineer. Escalation flow documented per role.

## 4. Channels

- **Intercom / Plain** for chat + email.
- **Community Slack / Discord** for peer-to-peer support and announcements.
- **Email**: `support@semlify.com` for asynchronous questions.
- **Phone** for Enterprise P1.
- **Private Slack channel** per Enterprise account.
- **Status page** at `status.semlify.com` with incidents and maintenance.

## 5. Self-service

Our goal: customers solve 50%+ of questions without opening a ticket.

- Searchable docs hub (`docs.semlify.com`).
- In-product contextual help (tooltips, empty states, error messages with links).
- Getting-started tutorials for key flows.
- Troubleshooting guides for common errors.
- Community with tagged experts.

Metrics:
- Deflection rate (tickets avoided) tracked from help-centre search + in-product help.
- Top-10 ticket topics reviewed monthly.

## 6. Community support

- Public Slack / Discord.
- Moderated by paid moderators + volunteers.
- Recognition: badges, swag, annual gifts for top contributors.
- Code of conduct enforced (see [CODE_OF_CONDUCT.md](../09_team/CODE_OF_CONDUCT.md)).

## 7. Ticket lifecycle

1. **Received**: ticket enters queue; acknowledgement auto-sent.
2. **Triaged**: priority set, assigned to on-duty engineer.
3. **In progress**: diagnosed, response sent.
4. **Waiting on customer**: if further info needed.
5. **Resolved**: solution provided; customer satisfaction survey sent.
6. **Closed**: no response for 5 business days after resolution.

Escalation paths:
- Support → Senior support → Engineering on-call → PM.
- Concurrent paths: CS for relationship; security for security-related tickets.

## 8. On-call

- Engineering on-call covers production incidents (see [INCIDENT_RESPONSE.md](../05_operations/INCIDENT_RESPONSE.md)).
- Support on-call (business hours) for ticket-driven issues.
- Enterprise 24/7 on-call rota for P1 incidents.
- Pay premium for after-hours on-call participation.

## 9. Tooling

- **Ticketing**: Intercom or Plain (year 0), transition to dedicated if support volume grows.
- **Knowledge base**: Docusaurus site.
- **Community platform**: Slack / Discord + Circle (optional).
- **Status page**: Statuspage or Better Uptime.
- **Incident tooling**: PagerDuty + Slack + Jeli (post-seed).
- **Voice of customer**: Canny + HubSpot + PostHog.

## 10. Knowledge management

- Every resolved ticket reviewed for possible KB article.
- Weekly "docs to write" meeting with top 5 candidates.
- Quarterly full audit; outdated content retired.
- Ownership: KB articles assigned to a named owner.

## 11. Support team shape

- Year 0: founders cover support + CS.
- Year 1: 1 support lead + CSM overlap.
- Year 2: 3 support engineers, 1 support lead, KB writer.
- Year 3: 6–8 support engineers split by region + role.

Hire support engineers with technical depth (able to debug, read logs, propose code-level fixes).

## 12. Metrics

- First response time (FRT).
- Time to resolution (TTR).
- CSAT (post-resolution survey).
- Ticket volume per 100 MAU.
- Deflection rate.
- Backlog age.
- Escalation rate.
- Reopen rate.

Dashboards in Grafana and Mode; reviewed weekly.

## 13. SLA compliance

- SLA breaches tracked per customer and per period.
- Service credits auto-calculated and issued per [SLA.md](../05_operations/SLA.md).
- Monthly SLA report for Enterprise.

## 14. Security & privacy tickets

- Security-related tickets fast-tracked to security on-call.
- Privacy / DSAR tickets routed to `privacy@semlify.com` workflow.
- No PII from tickets logged in analytics; redacted in internal dashboards.

## 15. Escalation to engineering

- Engineering support rotation ("ranger" rota): 1 engineer / sprint.
- Rangers respond to tickets requiring code investigation within 4 business hours.
- Rangers open bugs with reproducible steps; PM triages.

## 16. Sales & CS handoff

- Pre-sale: initial technical questions routed to sales engineers.
- Post-sale: CSM owns relationship; support owns tickets.
- Shared visibility in CRM.

## 17. Support playbooks

Maintained in `docs/10_launch/support_playbooks/`. Examples:

- Customer cannot sign in.
- Webhook signatures failing.
- API key rotation.
- Missing commit / data recovery request.
- Export failing.
- SSO / SCIM issues.
- Billing dispute.
- GDPR / DSAR request.

Each playbook: symptom → diagnosis → resolution → when to escalate → how to prevent.

## 18. Incident comms

For customer-visible incidents:
- Status page updated within 15 min of confirmed impact.
- Ticket banner in app.
- Email to affected customers on P1.
- Postmortem published within 5 business days (see [INCIDENT_RESPONSE.md](../05_operations/INCIDENT_RESPONSE.md)).

## 19. Anti-patterns

- Auto-closing tickets to hit SLAs.
- Deflecting customers to docs without diagnosis.
- Blaming customers for edge cases.
- Scripted responses that feel fake.
- Ignoring community voice because it's not a paying ticket.

## 20. Continuous improvement

- Weekly support retro.
- Monthly deep dive on top themes.
- Quarterly support handbook review.
- Annual customer support satisfaction survey.
- Shared learnings with product + eng + CS.

Related: [Customer Success](../07_business/CUSTOMER_SUCCESS.md) · [SLA](../05_operations/SLA.md) · [Incident Response](../05_operations/INCIDENT_RESPONSE.md) · [Launch Checklist](LAUNCH_CHECKLIST.md)
