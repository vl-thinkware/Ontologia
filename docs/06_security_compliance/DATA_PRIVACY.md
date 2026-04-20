# Data Privacy

How Ontologia handles personal data, where it lives, who can access it, and how customers exercise their rights. Aligns with GDPR (EU/EEA) and CCPA/CPRA (California). This is an operational document; legal primary texts live at `ontologia.com/legal`.

---

## 1. Roles

- For **customer data in workspaces**, Ontologia is a **data processor**; the customer (Organisation) is the data controller.
- For **account data** (user emails, billing), Ontologia is a **data controller**.
- Sub-processors used for hosting, email, billing, analytics, observability are listed at `ontologia.com/legal/subprocessors`.

## 2. Personal data we process

### As controller (account)
- Name, email, avatar.
- Auth metadata (hashed passwords via Clerk; IP; user agent).
- Billing: company name, billing email, payment method metadata (processed by Stripe).
- Support conversations.

### As processor (customer content)
- Ontology names, concept names/descriptions, comments, attached metadata.
- Audit log content reflecting customer users' actions.
- Uploads during imports.

## 3. Where data lives

- Primary storage: Postgres, Neo4j and Cloudflare R2, in the region chosen by the Org (US or EU) on Pro+.
- Backups: same region.
- Observability: anonymised where feasible; PII-minimised logs.
- Email: Resend (EU/US depending on region).
- LLM vendor: region-aligned where vendor supports.

## 4. Data minimisation

- Logs redact PII by default (email, name, tokens, IP → masked last octet).
- We do not ship raw customer content to third-party analytics.
- Canvas drafts stay local (IndexedDB) until committed.

## 5. Data retention

| Data | Retention |
|---|---|
| Active account | While subscription is active |
| Deleted workspace | 30-day soft delete, then hard delete |
| Backups | 7 days (Starter), 30 days (Pro), 90 days (Enterprise) |
| Audit logs | 12 months (Pro), 7 years (Enterprise) |
| Operational logs | 30–365 days per plan |
| Marketing leads | 24 months or until unsubscribe |
| Support tickets | 3 years |

Retention exceeded only for legal obligation (tax records, disputes).

## 6. Rights management (data subject requests)

Contact: `privacy@ontologia.com`.

### Access
- Users can export their own account data from the profile page.
- Controllers (customer admins) can export workspace data at any time.
- Requests processed within 30 days.

### Rectification
- Self-service for profile fields.
- For fields locked by the IdP (SSO), the IdP is the source.

### Erasure
- User-level: a verified request triggers deletion across Clerk, Postgres, and downstream audit metadata (we retain only what law requires).
- Workspace-level: owner-initiated from Org settings.

### Portability
- JSON export at any time.
- Ontology exports in JSON-LD, JSON, CSV.

### Objection & restriction
- Marketing: unsubscribe link in every email.
- Processing that the user can't block entirely (auth, billing): documented in the privacy policy.

## 7. Processor obligations (for customer workspaces)

- DPA available at `ontologia.com/legal/dpa`.
- Sub-processor list with 30-day notice of material changes.
- Security measures per [SECURITY.md](SECURITY.md).
- Breach notification within 72 h of confirmed unauthorised access to personal data.

## 8. International transfers

- Standard Contractual Clauses (SCCs) for EU → US transfers where applicable.
- UK Addendum for UK customers.
- Data Privacy Framework (DPF) adherence to be evaluated post-GA.

## 9. Cookies & tracking

- Only essential cookies by default.
- Analytics (PostHog) with IP anonymisation; optional consent banner in EU traffic for any additional cookies.
- No third-party advertising trackers.

## 10. Children

- Service not intended for individuals under 16. Accounts created by minors may be deleted.

## 11. AI / LLM data handling

For feature C2:

- Customer ontology content sent to LLM providers stays in the agreed region.
- We do not allow providers to train on our data — contracts require opt-out / zero-retention.
- Per-tenant kill-switch.
- Logs retain metadata only, never prompts/responses.

## 12. DPIAs (Data Protection Impact Assessments)

- Performed for any feature that processes personal data in a new way (e.g. AI suggestions using employee names in descriptions).
- Template stored in `docs/06_security_compliance/dpia/` (to be populated per feature).

## 13. Subject requests workflow (internal)

1. Ticket created in the privacy queue.
2. Verification step (email match, workspace admin auth).
3. Request executed by the on-duty operator with a documented runbook.
4. Confirmation sent to the user with what was done and what, if anything, was retained and why.

## 14. US state laws

- CCPA/CPRA: residents can request access, deletion, opt-out of "sale" (we do not sell). Same intake as GDPR.
- Shield/notice policies updated as new state laws come into force.

## 15. Breaches

Covered in [SECURITY.md § 14](SECURITY.md#14-incident-response-security). For personal-data breaches affecting EU residents, we notify:
- Lead supervisory authority within 72 h.
- Affected data subjects where risk is high, via the controller where we are a processor.

## 16. Document owners & review

- Owner: CTO + outside counsel.
- Review cadence: twice per year, or on material change.

Related: [Security](SECURITY.md) · [Compliance](COMPLIANCE.md) · [Backup & DR](../05_operations/BACKUP_DR.md)
