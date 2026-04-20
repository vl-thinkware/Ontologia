# Security

This document summarises Ontologia's security posture. For the audit-ready version, see the trust center at `ontologia.com/trust`.

---

## 1. Principles

- **Defence in depth.** Every layer assumes the one above failed.
- **Least privilege.** Each service, human and token has the minimum permissions to function.
- **Shift left.** Security requirements are in design reviews, not post-merge audits.
- **Measure what we can, log what we can't.** If we can't prevent, we detect and recover.

## 2. Compliance roadmap

| Target | Status | Milestone |
|---|---|---|
| GDPR (data protection) | Active — by-design | GA |
| SOC 2 Type I | Targeted | GA + 6 months |
| SOC 2 Type II | Targeted | GA + 18 months |
| ISO 27001 | Considered | Year 2–3 |
| HIPAA BAA (healthcare tenants) | Considered | Year 2+ |

Detail in [COMPLIANCE.md](COMPLIANCE.md) and [DATA_PRIVACY.md](DATA_PRIVACY.md).

## 3. Access control

### Customer data
- Multi-tenant enforcement at app + DB layers. See [MULTI_TENANCY.md](../02_architecture/MULTI_TENANCY.md).
- Roles: `owner`, `editor`, `reviewer`, `viewer`.
- API keys scoped and rotatable.

### Internal (team)
- Single sign-on for all employee tools (Google Workspace or Microsoft, depending on hire).
- MFA required everywhere (WebAuthn preferred).
- Role-based access to cloud consoles via groups.
- Production data access gated by approval + audit.
- Break-glass vault (1Password) with alerting on opening.

## 4. Network security

- TLS 1.3 only; HSTS 1-year; TLS certs auto-renewed via Cloudflare / Let's Encrypt.
- Cloudflare WAF rules enabled; managed rulesets + custom rules for Cypher injection patterns.
- No public DB ports. Applications connect via private networking.
- Outbound egress from workers restricted to allowlisted hosts (LLM, Stripe, partner connectors, webhook customer endpoints).

## 5. Application security

- Input validation via Zod at the HTTP boundary.
- Output encoding (React by default; DOMPurify for any `dangerouslySetInnerHTML`).
- Parameterised SQL (Drizzle) and Cypher (`$params`); string concatenation banned.
- CSRF: mitigated by same-origin + SameSite cookies + CORS allowlist.
- Rate limiting per user, per API key, per IP.
- Idempotency keys on mutating endpoints to prevent replay.
- Secure cookies: `Secure; HttpOnly; SameSite=Lax` on session.

## 6. Authentication

Detail in [AUTHENTICATION.md](AUTHENTICATION.md). Summary:

- Clerk handles user auth (email, OAuth, magic link, OIDC/SAML on Pro+).
- JWT verified on every request.
- API keys stored hashed (Argon2id), raw shown once on creation.
- API keys scoped; revocation is immediate.

## 7. Secrets management

- Doppler (initial) or AWS Secrets Manager.
- No secrets in code, logs, CI logs, or configuration files.
- Secret scanning in CI (`gitleaks`) blocks merges.
- Rotation: quarterly for all long-lived credentials; on-demand on suspicion.

## 8. Encryption

- In transit: TLS 1.3.
- At rest: AES-256 managed by providers.
- Customer-managed keys (BYOK) on Enterprise.
- Field-level encryption for sensitive Postgres columns (API key hashes, webhook secrets).

## 9. Logging & auditing

- Structured logs with tenancy metadata (see [MONITORING.md](../05_operations/MONITORING.md)).
- Separate append-only audit log for privileged operations and data access on Enterprise.
- Logs retained:
  - Application: 30 days (Starter), 90 days (Pro), 1 year (Enterprise).
  - Audit: 12 months (Pro), 7 years (Enterprise).

## 10. Secure SDLC

- Every PR runs:
  - Static analysis (`semgrep` with our ruleset).
  - Dependency audit (`pnpm audit`, Snyk).
  - License check (no GPL/AGPL).
  - Secret scanning (`gitleaks`).
- Threat modelling for any change involving auth, tenancy, payments or new external integrations.
- Required PR reviewers for sensitive paths (`auth`, `billing`, `migrations`).

## 11. Vulnerability management

- Critical CVEs patched within 7 days.
- High within 30 days.
- Medium within 90 days.
- Published advisories at `ontologia.com/trust/advisories`.

## 12. Pen testing

- Third-party penetration test annually.
- Findings prioritised and tracked; critical mitigations within 30 days.
- Summary letter published (not full report).

## 13. Bug bounty

Target: launch a managed program (HackerOne / Intigriti) within 12 months of GA. In the meantime, responsible-disclosure mailbox `security@ontologia.com`.

- Safe-harbour statement published.
- Acknowledgements page.
- Targets and out-of-scope list maintained.

## 14. Incident response (security)

- Same playbook as [INCIDENT_RESPONSE.md](../05_operations/INCIDENT_RESPONSE.md) with security role.
- Customer notification within 72 h for confirmed breaches affecting customer data (Pro+).
- Regulatory notifications within statutory windows (e.g. 72 h GDPR).

## 15. Supply chain

- Pinned dependencies.
- Verified provenance where available (npm `--provenance`, GitHub attestations).
- Container base images: distroless or minimal Alpine; weekly rebuild.
- Monitoring for compromised packages (Socket.dev).

## 16. Employee laptops & offices

- Full-disk encryption.
- MDM (Kandji or similar) enforced.
- Screen lock, password, MFA required.
- Phishing training onboarding + annual.
- No production access from personal devices.

## 17. Sub-processors

- List at `ontologia.com/legal/subprocessors`.
- Customers notified 30 days in advance of changes affecting data.
- Each sub-processor reviewed annually for DPAs and security posture.

## 18. Responsible AI considerations

For feature C2 (AI suggestions):

- Customer ontology data used in prompts never leaves the agreed region.
- No training on customer data without explicit, opt-in consent (never opt-out).
- Logging of prompts is minimal: metadata only (model, tokens, latency), not the content.
- A kill-switch per tenant.

## 19. Useful contacts

- `security@ontologia.com` — reports.
- `privacy@ontologia.com` — GDPR / DSAR.
- `abuse@ontologia.com` — misuse of service.

Related: [Authentication](AUTHENTICATION.md) · [Data Privacy](DATA_PRIVACY.md) · [Compliance](COMPLIANCE.md) · [Security Checklist](SECURITY_CHECKLIST.md)
