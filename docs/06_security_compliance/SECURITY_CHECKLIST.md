# Pre-Production Security Checklist

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


Actionable list to tick before we turn on a new environment, new feature or GA the product.

---

## 1. Identity & access

- [ ] All team members on SSO.
- [ ] MFA required for all staff (WebAuthn preferred).
- [ ] Production access gated by justified request + audit.
- [ ] Break-glass vault documented and tested.
- [ ] No shared accounts in any production system.

## 2. Secrets

- [ ] All secrets in Doppler / Secrets Manager.
- [ ] `gitleaks` in CI blocks on detection.
- [ ] Rotation schedule documented.
- [ ] KMS keys have separation of duties for rotation.

## 3. Network

- [ ] Cloudflare WAF on with managed + custom rulesets.
- [ ] TLS 1.3 everywhere.
- [ ] HSTS max-age ≥ 1 year; preloaded for production domains.
- [ ] No public DB ports.
- [ ] Egress allowlist on workers for partner APIs.

## 4. Application

- [ ] Input validation at the boundary (Zod).
- [ ] Output encoding default (React escaping, DOMPurify for HTML).
- [ ] Parameterised SQL and Cypher; no string concatenation.
- [ ] Rate limiting per user, API key, IP.
- [ ] CSRF protections in place (SameSite + origin checks).
- [ ] Content Security Policy configured (nonce-based for scripts).
- [ ] CORS allowlist limited to our domains.
- [ ] Cookies: `Secure; HttpOnly; SameSite=Lax`.
- [ ] Secure headers: `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` strict.

## 5. Tenancy

- [ ] `orgId` present and indexed on every tenant-scoped Neo4j node/edge.
- [ ] Postgres RLS enabled on every tenant-scoped table.
- [ ] Redis keys prefixed by `org:{id}:`.
- [ ] R2 objects prefixed by `org/{id}/`.
- [ ] Contract tests: cross-tenant requests return 404.

## 6. Authentication

- [ ] Clerk configured with required MFA policies.
- [ ] Password policy: 12+ chars, breach list check.
- [ ] Session JWT short-lived (≤ 15 min) with refresh rotation.
- [ ] API key hashes stored via Argon2id.
- [ ] API key revocation propagates across regions.

## 7. Authorisation

- [ ] CASL rules unit-tested per role.
- [ ] Endpoint authz audited against the role capability table.
- [ ] Branch policies enforced server-side.
- [ ] Break-glass admin impersonation requires justification and audit.

## 8. Data protection

- [ ] Encryption at rest on all stores.
- [ ] TLS for all internal service-to-service calls that traverse provider networks.
- [ ] Field-level encryption for API key hashes and webhook secrets (verified).
- [ ] Backup retention per plan tested via restore drill.
- [ ] Region residency enforced at provisioning time.

## 9. Logging & monitoring

- [ ] Structured logs with `orgId`, `userId`, `traceId`.
- [ ] PII redaction verified in production log sampling.
- [ ] Alerts defined for every SLO with a runbook link.
- [ ] Status page live and wired to alerts.

## 10. Supply chain

- [ ] Dependabot or Renovate weekly.
- [ ] License check (no GPL/AGPL) passing.
- [ ] `pnpm audit --prod` green or justified exceptions documented.
- [ ] Semgrep ruleset passing.

## 11. Product

- [ ] Data export works from the UI and API.
- [ ] Account deletion is self-serve.
- [ ] Workspace deletion has 7-day soft window.
- [ ] Webhook signatures verified in a demo client.
- [ ] Rate-limit headers returned on every 429.

## 12. Compliance touchpoints

- [ ] Privacy policy live and up to date.
- [ ] Terms of service live.
- [ ] DPA template available at `semlify.com/legal/dpa`.
- [ ] Sub-processor list published.
- [ ] Cookie consent banner in EU traffic.

## 13. Incident readiness

- [ ] On-call rotation populated and acknowledged.
- [ ] Runbooks for top alerts authored and tested.
- [ ] Quarterly game day scheduled.
- [ ] RCA template in the repo.

## 14. Feature-specific (C2 — AI suggestions)

- [ ] Per-tenant LLM opt-in.
- [ ] Per-tenant monthly quota.
- [ ] Vendor contract forbids training on our data.
- [ ] Only content necessary sent to LLM.
- [ ] Zero-retention header / option enabled where vendor supports.

## 15. Launch gates

Sign-off required from:

- [ ] CTO (engineering readiness)
- [ ] Product (functional readiness)
- [ ] Design (UX & a11y readiness)
- [ ] Legal (contract readiness)
- [ ] Security (this checklist)

Only when all gates are green do we flip a release from flagged to GA.

Related: [Security](SECURITY.md) · [Launch Checklist](../10_launch/LAUNCH_CHECKLIST.md)
