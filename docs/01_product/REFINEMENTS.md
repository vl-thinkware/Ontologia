# Refinements to v1 Spec

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


This document consolidates proposed refinements to `Ontologia — Spécifications v1.0.pdf` (17 Apr 2026). The other docs in this repo are kept faithful to v1 — this file is where we stage evolutions for product review.

Priority legend: **P0** (ship before GA) · **P1** (should land during v1.x) · **P2** (revisit in 2027).

---

## A. Answers to the five open questions in the PDF

### 1. Product name — P0
**Recommendation.** Keep **Ontologia** as the product name but lead in marketing with the phrase "knowledge models" rather than "ontologies", since Persona B finds the latter intimidating. Register `ontologia.io` and `ontologia.com`; defend trademark in US + EU.

**Why.** Changing a name mid-build is costly, and the name is already memorable and descriptive to Persona A (the buyer).

### 2. Versioning granularity — P0
**Recommendation.** **Manual commits** (the Git model). Each commit can include many changes, as in the PDF.
**Additionally:** keep an invisible per-action event stream server-side (for observability and future "activity" views), but never show it as history.

### 3. Hard vs soft delete — P0
**Recommendation.** **Soft-delete only** (status becomes `deprecated`). Deprecated concepts vanish from default canvas but remain queryable via an explicit filter and remain in every historical commit.
**Refinement vs PDF.** Offer an admin-only "archive ontology" action that removes all versions from the active UI after 30 days in a recycling bin (hard delete on confirmation, gated by billing-safe checks).

### 4. Schema-strict vs schema-flexible relation types — P0
**Recommendation.** **Flexible by default, strict on demand.** A workspace setting "Enforce declared relation types" (off by default) enables an optional schema-first mode. Strict mode is expected on Enterprise.

### 5. Real-time collaboration cursors — P1
**Recommendation.** **Defer** to v1.5. Ship high-quality diff/merge first; revisit cursors once merge UX is stable. Until then, show "who is currently viewing" passively on each ontology (no cursors, no conflict during edit — last write in a draft wins on the client).

---

## B. Proposed additions (not in PDF)

### B1. Webhooks in v1.0, not v2.0 — **P0**
**Rationale.** Platform Engineers (Persona C) need change events from day one. Without webhooks, adoption by the downstream integration path is blocked. Cost to add is small: a simple outbound queue + HMAC signatures.

### B2. Rate limits & usage quotas — P0
**Rationale.** The PDF does not specify limits. We should define and enforce:
- Free: 1 ontology, 3 users, 500 concepts, 100 API calls/h.
- Starter: 5 ontologies, 10 users, unlimited concepts, 1,000 API calls/h.
- Pro: unlimited ontologies, 30 users, 10,000 API calls/h + 100 webhook events/min.
- Enterprise: custom.

Enforced via Redis token bucket; surfaced in `X-RateLimit-*` headers.

### B3. Regional data residency — P1
**Rationale.** EU customers (finance, health) often require EU-hosted data. With Neo4j Aura multi-region and Postgres on a major cloud, we can commit to **EU or US** region selection at workspace creation, on Pro+.

### B4. API keys scoped by permission — P0
**Rationale.** Spec says "API key auth". Add scopes:
- `read:ontology`, `write:ontology`, `read:comments`, `write:comments`, `admin:webhooks`.
An API key issued with `read:ontology` alone cannot mutate the graph.

### B5. SSO & SCIM baseline — P1
Spec defers SSO to Phase 4 (Enterprise). Recommendation:
- **OIDC** available on Pro (single-IdP, self-serve).
- **SAML + SCIM** gated to Enterprise.

### B6. Audit log exportability — P0
Spec mentions audit log but not retention / export. Standardise:
- 12-month retention on Pro.
- 7-year retention on Enterprise.
- Signed, tamper-evident export (hash chain) for Enterprise.

### B7. Python SDK shipped with v1.0 — P0
**Rationale.** The PDF describes an OpenAPI schema. Shipping a Python SDK on day one removes 80% of the friction for Persona C, who lives in pandas + Airflow. A JavaScript SDK follows.

### B8. "Publish" concept separate from `main` — P1
**Rationale.** Some downstream systems want a stability guarantee stronger than "latest commit on main". Introduce **published versions**: an admin-stamped, immutable ref (`ontology:v2.3`) that downstream consumers target.

### B9. LLM usage budgets on C2 (AI suggestions) — P1
**Rationale.** The PDF lists AI suggestions without mentioning cost. Every workspace needs a monthly LLM credit cap; overage prompts upgrade or purchase of credits. Tied into [COST_ANALYSIS.md](../08_finance/COST_ANALYSIS.md).

### B10. Status page + public SLA — P0
**Rationale.** B2B buyers expect `status.ontologia.com` and a public SLA document from day one.

### B11. Test & staging environments — P0
Spec is silent. Recommendation:
- `api.ontologia.com` (prod), `staging.ontologia.com` (pre-prod), `sandbox.ontologia.com` (customer test tenants with sample data, no billing).

### B12. Accessibility requirement — P0
**Rationale.** WCAG 2.2 AA is a sales unblocker in public sector and large enterprise (especially EU). Added to the PRD's NFRs.

### B13. Data export guarantee — P0
**Rationale.** A hard requirement for GDPR and for buyer trust: every workspace can export all its data at any time (JSON-LD + audit log) without a support ticket.

### B14. Review-only mode — P1
**Rationale.** Some stakeholders (execs, auditors) should see changelogs and approve without being counted as a billable editor. "Reviewer" role is cheaper; consider a free "Observer" role on Enterprise only.

### B15. Template marketplace — P2
Post-GA. Community-contributed starter ontologies (e-commerce, FIBO subset, SKOS thesauri). Revenue share optional.

---

## C. Risks not covered in the PDF

| Risk | Severity | Mitigation |
|---|---|---|
| Neo4j vendor lock-in | Medium | Abstract graph ops behind a port; write an adapter layer so Memgraph / ArangoDB can be swapped if pricing shifts |
| Clerk outage blocks login | Medium | Cache short-lived session tokens (≤ 1 h) client-side; publish a status page; consider auth fallback by v1.5 |
| GPU-intensive AI features erode margins | Medium | Gate C2 behind a credit system; prefer small purpose-built models over frontier models for suggestions |
| One bad merge corrupts an ontology | High | Make Revert idempotent, write integration tests over a generated-state-machine of commit graphs |
| Large ontology (> 1M concepts) freezes the canvas | High | Ship virtualisation + on-demand loading in v1.0; spec a "big mode" Pro+ feature |
| Data loss in a Neo4j Aura incident | Critical | Nightly logical backups to S3 (per tenant); documented RPO ≤ 24h, RTO ≤ 4h |

---

## D. Documentation gaps in the v1 PDF

The PDF does not currently specify:

- Concrete rate limits, quotas and overage behaviour — addressed in B2 and [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).
- SLA uptime numbers per tier — addressed in [SLA.md](../05_operations/SLA.md).
- Backup and DR targets — addressed in [BACKUP_DR.md](../05_operations/BACKUP_DR.md).
- Security posture (SOC 2, GDPR DPA) — addressed in [SECURITY.md](../06_security_compliance/SECURITY.md) and [DATA_PRIVACY.md](../06_security_compliance/DATA_PRIVACY.md).
- Authentication model beyond "Clerk or Auth0" — expanded in [AUTHENTICATION.md](../06_security_compliance/AUTHENTICATION.md).

These are resolved in the new docs; once accepted, fold back into a v1.1 PDF.

---

## Review protocol

Decisions required from product leadership:

1. Approve or adjust each **P0** item. Target: **2026-04-30**.
2. Ratify **P1** items after design partner feedback (May–June 2026).
3. Revisit **P2** items at v1.0 GA retrospective.

File issues / ADRs for any item marked "approved" and reference them in the acceptance criteria of the related feature.
