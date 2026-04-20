# Compliance

What standards Ontologia intends to meet, where we are on the journey, and how we keep our story honest when customers, auditors or regulators ask.

---

## 1. Frameworks in scope

| Framework | Who cares | Status | Target |
|---|---|---|---|
| GDPR (EU/EEA) | Every EU customer | By-design, ongoing | Continuous |
| UK GDPR + DPA 2018 | UK customers | By-design | Continuous |
| CCPA / CPRA (California) | US customers | By-design | Continuous |
| SOC 2 Type I | US mid-market and up | Targeted | GA + 6 months |
| SOC 2 Type II | US enterprise | Targeted | GA + 18 months |
| ISO 27001 | EU enterprise, regulated industries | Considered | Year 2–3 |
| HIPAA BAA | Healthcare tenants | On demand | Year 2+ |
| FedRAMP / StateRAMP | US public sector | Not planned | — |
| C5 (Germany) | DACH enterprise | Evaluated | Year 3 |
| SOC 3 | Public marketing | After SOC 2 II | Year 2 |

Approach: build controls once, map to multiple frameworks. SOC 2 is the scaffold; ISO 27001 inherits most evidence; GDPR is operational and enforced continuously.

## 2. SOC 2 trust service criteria

We target the five TSCs:

- **Security** (mandatory)
- **Availability**
- **Confidentiality**
- **Processing integrity**
- **Privacy**

Availability is included because customers evaluate it against our SLA. Privacy is included because we handle personal data directly.

### Control families

- Organisation & management (governance, roles, training).
- Communications (policies, incident comms, customer notifications).
- Risk management (annual risk assessment + quarterly updates).
- Monitoring (logging, alerting, audit review).
- Logical & physical access (RBAC, MFA, offices, laptops).
- System operations (change management, incident response, capacity).
- Change management (SDLC, peer review, approvals).
- Risk mitigation (vendor management, BCP/DR).
- Confidentiality (classification, retention, disposal).
- Privacy (notice, choice, collection, use, retention, access, security).

Evidence is collected continuously via Drata / Vanta / Secureframe (we'll pick one pre-audit).

## 3. Policies we maintain

All policies are versioned in the private `ontologia/corp` repo with change history and approval signatures.

- Information Security Policy.
- Acceptable Use Policy.
- Access Control Policy.
- Asset Management Policy.
- Business Continuity & Disaster Recovery Policy.
- Change Management Policy.
- Code of Conduct.
- Confidentiality Policy.
- Data Classification Policy.
- Data Retention & Disposal Policy.
- Encryption Policy.
- Human Resources Security Policy.
- Incident Response Policy.
- Network Security Policy.
- Password Policy.
- Physical Security Policy.
- Privacy Policy (public + internal).
- Risk Management Policy.
- Secure Development Policy.
- Third-Party Risk / Vendor Management Policy.
- Vulnerability Management Policy.

Each policy has an owner (role, not person) and is reviewed at least annually.

## 4. GDPR programme

### Roles
- **Controller** for account data; **Processor** for workspace content.
- DPO (or DPA-designated person) named in the privacy policy. If not required, an internal privacy lead is documented.

### Lawful bases
- Contract (service delivery).
- Legitimate interests (product analytics, fraud prevention — balancing tests documented).
- Consent (marketing emails, optional cookies).
- Legal obligation (tax, retention by law).

### Records of processing activities (Article 30)
- Maintained in a spreadsheet / tool; reviewed quarterly.
- Fields: purpose, categories of data, recipients, retention, transfers.

### Data subject rights
- Process described in [DATA_PRIVACY.md § 6](DATA_PRIVACY.md#6-rights-management-data-subject-requests).
- Inbound queue at `privacy@ontologia.com`.
- 30-day SLA; extension up to 60 days with justification.

### DPIAs
- Performed for any feature that processes personal data in a new or risky way (e.g. profiling, automated decisions, AI suggestions using personal data).
- Template in `docs/06_security_compliance/dpia/TEMPLATE.md`.

### Sub-processors
- List published at `ontologia.com/legal/subprocessors`.
- 30-day notice before adding or changing a sub-processor that affects customer data.
- Annual review of each sub-processor's DPA, security posture and certifications.

### International transfers
- Standard Contractual Clauses (2021 version) in all DPAs with sub-processors outside the EEA/UK.
- UK IDTA / Addendum where applicable.
- Data Privacy Framework assessed when stable.

## 5. CCPA / CPRA programme

- Privacy policy includes CCPA disclosures.
- We do not sell or share personal information in the CCPA sense.
- Rights: know, delete, correct, limit use of sensitive PI, opt-out of sharing.
- Intake via `privacy@ontologia.com` — same workflow as GDPR.
- Notice at collection on web forms.

## 6. ISO 27001 approach (future)

- Adopt the 93 controls in Annex A (2022 version).
- ISMS scope: Ontologia's SaaS platform and supporting corporate infrastructure.
- Statement of Applicability (SoA) with justifications for any excluded controls.
- Internal audit programme + external certification by an accredited body.

## 7. HIPAA BAA (future, on demand)

Only offered when an Enterprise customer legitimately needs it. Requires:

- Dedicated Neo4j Aura, encrypted field hardening.
- Access controls and audit logs per HIPAA security rule.
- BAA signed with us; we sign BAAs with sub-processors handling PHI.
- Incident response procedures with breach notification per HIPAA.
- Training for every employee who may handle PHI.

Pricing adjusted to reflect compliance costs.

## 8. Vendor management

### On-boarding
- Security questionnaire (SIG Lite or custom).
- DPA signed where personal data is involved.
- Proof of certifications (SOC 2, ISO 27001) where available.
- Risk tier assigned: High / Medium / Low.

### Monitoring
- Annual review for High-tier vendors.
- Two-year review for Medium / Low.
- Alert list on security advisories for all vendors.

### Exit
- Process to terminate and confirm data deletion.
- Retain evidence of deletion for our compliance file.

## 9. Risk management

### Assessment
- Annual enterprise risk assessment.
- Quarterly update on top 10 risks.
- Risks scored on Impact × Likelihood; ownership assigned.

### Register
- Stored in the GRC tool.
- Categories: cybersecurity, privacy, compliance, operational, financial, reputational.

### Treatment
- Accept / mitigate / transfer / avoid.
- Each mitigation has an owner, deadline, and verification.

## 10. Business continuity & disaster recovery

- See [BACKUP_DR.md](../05_operations/BACKUP_DR.md).
- Annual BC/DR exercise; results shared with the board.
- Customer-facing BC/DR summary available under NDA.

## 11. Secure SDLC (engineering compliance)

- Peer-reviewed commits via GitHub (branch protection).
- Required checks: tests, type-check, lint, security scans.
- Segregation of duties on production changes (author ≠ approver).
- Evidence exported weekly by the GRC tool.

## 12. HR compliance

- Background checks commensurate with role and local law.
- Confidentiality and IP agreements at hire.
- Onboarding training (security, privacy, code of conduct) within 30 days.
- Annual refresher training with attestation.
- Access revoked same day on termination; documented.

## 13. Physical compliance

- Co-located office: badge access, visitor logs, clean-desk policy.
- Remote-first policy with secure home office expectations.
- Full-disk encryption on all endpoints; MDM enforced.
- Lost or stolen devices: immediate remote wipe.

## 14. Logging & audit evidence

- Identity and admin actions logged for 2+ years in immutable storage.
- Customer-facing audit logs per plan (see [AUTHENTICATION.md § 10](AUTHENTICATION.md#10-audit-logging)).
- Access reviews quarterly for all production systems.

## 15. Customer-facing artefacts

| Artefact | Where |
|---|---|
| Privacy policy | `ontologia.com/legal/privacy` |
| Terms of service | `ontologia.com/legal/terms` |
| DPA | `ontologia.com/legal/dpa` |
| Sub-processor list | `ontologia.com/legal/subprocessors` |
| Cookie policy | `ontologia.com/legal/cookies` |
| Security overview | `ontologia.com/trust` |
| SOC 2 report | `ontologia.com/trust` (NDA-gated) |
| Pen test letter | `ontologia.com/trust` (NDA-gated) |

All artefacts dated and versioned.

## 16. Compliance roadmap (operational)

**Year 0 (pre-GA)**
- Finalise policies and first risk assessment.
- Pick and implement GRC tool.
- Publish DPA and sub-processor list.

**Year 0 + 6 months (SOC 2 Type I)**
- External audit, observation window at least 30 days.
- Public SOC 2 report under NDA.

**Year 0 + 18 months (SOC 2 Type II)**
- Observation window 6–12 months.
- Annual re-audit thereafter.

**Year 2 (ISO 27001)**
- Stage 1 audit.
- Stage 2 audit and certification.
- Re-certification every 3 years with annual surveillance.

**Year 2+ (HIPAA, C5)**
- On demand, per enterprise contracts.

## 17. Roles & accountabilities

- **CTO**: owner of the security and compliance programme until we hire a dedicated CISO.
- **Privacy lead**: currently CTO, will transition to a privacy officer once volume requires.
- **Legal counsel**: outside counsel for contracts and regulatory advice; inside counsel post Series A.
- **Employees**: everyone is responsible for reporting concerns and suspected incidents.

## 18. Training

- Security & privacy onboarding within 30 days of hire.
- Annual refresher; quarterly phishing simulations.
- Role-specific training for engineers (secure coding), support (data handling), finance (fraud / SoX-lite practices).

## 19. Customer contractual commitments

Pro & Enterprise contracts include:
- Uptime SLA (see [SLA.md](../05_operations/SLA.md)).
- Data processing addendum.
- Sub-processor notice (30 days).
- Breach notification (72 h).
- Right to audit (Enterprise, under NDA).
- Export on termination.

## 20. Document owners & review

- Owner: CTO.
- Review cadence: quarterly; any material change triggers immediate update.
- Customers and auditors can request the current version from `compliance@ontologia.com`.

Related: [Security](SECURITY.md) · [Data Privacy](DATA_PRIVACY.md) · [Authentication](AUTHENTICATION.md) · [Security Checklist](SECURITY_CHECKLIST.md)
