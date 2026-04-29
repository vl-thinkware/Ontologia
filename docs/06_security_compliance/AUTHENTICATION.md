# Authentication & Authorisation

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


How users and machines prove who they are, and what they are allowed to do.

---

## 1. Credential types

| Type | Used by | Where |
|---|---|---|
| **Clerk user session (JWT)** | Humans in the web app | Browser, session cookie + short-lived JWT |
| **Magic link / Email OTP** | Onboarding fallback | Web app |
| **OAuth** (Google, Microsoft) | Humans | Web app |
| **OIDC / SAML** | Humans in SSO orgs | Pro+ / Enterprise |
| **SCIM token** | IdPs provisioning users | Enterprise |
| **API key (Bearer)** | Machines | Customer integrations |
| **Internal service secret** | Our own workers → API | Private network |

## 2. Users

### Sign-up
- Email / password or OAuth (Google, Microsoft).
- Magic link option available.
- Passwords enforce 12+ chars, composition per NIST 800-63 recommendations; breach-list check at creation.

### Sign-in
- Clerk validates credentials, returns short-lived JWT (15 min) + refresh (7 days rolling, up to 30 days absolute).
- 2FA: TOTP or WebAuthn. WebAuthn encouraged (passkeys); required for Owner role on Pro+.

### Session management
- Single-session JWT stored in memory + refresh in httpOnly secure cookie.
- Revocation: logging out invalidates the refresh; admin can kill all sessions of a member in the Org settings.

### Enterprise SSO (Pro+/Enterprise)
- OIDC auto-provisioned via Clerk.
- SAML supported on Enterprise.
- SCIM 2.0 provisioning; group-to-role mapping.
- Just-in-time provisioning when an IdP pushes a new user into a group.

## 3. Authorisation model

### Entities
- User → Memberships → Organisation → Workspaces → Ontologies.
- Roles per membership: `owner | editor | reviewer | viewer`.

### Role capabilities (default)

| Capability | owner | editor | reviewer | viewer |
|---|---|---|---|---|
| Create / delete ontologies | ✓ | — | — | — |
| Invite / remove members | ✓ | — | — | — |
| Manage billing | ✓ | — | — | — |
| Create branches | ✓ | ✓ | — | — |
| Commit on `main` | ✓ | ✓ (unless policy) | — | — |
| Open review request | ✓ | ✓ | — | — |
| Approve review request | ✓ | ✓ | ✓ | — |
| Merge | ✓ | ✓ (unless policy) | ✓ (policy-gated) | — |
| Read ontologies | ✓ | ✓ | ✓ | ✓ |
| Create API keys | ✓ | — (scoped) | — | — |

### Per-ontology ACL overrides (Enterprise)
- A policy can restrict an ontology to a subset of members regardless of org role.
- Policies stored in Postgres; enforced centrally in the authz plugin.

### Branch protection
- Per branch: require N approvals, restrict direct commits, require checks.
- Admins bypass only with a reason and an audit entry.

## 4. Authorisation implementation

- **CASL-style** policy module (`@casl/ability` or a small in-house equivalent).
- Rules compiled from the member's role + branch policy + resource ACL.
- Every handler calls `ability.can(action, resource)`.
- Violations return `403 insufficient_scope` (API key) or `403 not_authorised` (user), except cross-tenant requests which return **404 not_found** to avoid leaking existence.

## 5. API keys

### Creation
- Owner or explicitly delegated role creates via API settings.
- User picks a name and scopes.
- Full raw key is shown once; we store Argon2id hash + an 8-character prefix for UI identification.

### Scopes
- `read:ontology`, `write:ontology`
- `read:comments`, `write:comments`
- `read:reviews`, `write:reviews`
- `admin:webhooks`
- `admin:api_keys`
- `admin:members`

Least privilege default suggestion surfaced in UI.

### Rotation & revocation
- Keys can be rotated (issues a new raw value, old invalidates at a chosen delay).
- Revocation: immediate across all regions (Redis publish).

### Use of API keys
- `Authorization: Bearer sk_live_…`
- No cookies or session on API-key requests.
- Rate limits per key + per org.

## 6. Machine-to-machine

- Workers → API use a short-lived internal JWT signed with a rotating symmetric secret (in KMS), scoped by service identity.
- Every M2M call declares the tenant it is operating on.
- External webhooks we send are signed (HMAC-SHA256); customers verify with the secret we provide.

## 7. Password policies

- We delegate to Clerk. Settings enforced:
  - 12+ character minimum.
  - Breach list check (HIBP via Clerk).
  - No max length.
  - Don't enforce rotation (NIST guidance).
- MFA required for owner roles on Pro+.

## 8. Account recovery

- Standard Clerk recovery via email.
- Owner recovery with lost access: documented secure process; contact `security@semlify.com`. Requires proof of business identity (payment method, DNS record).

## 9. Session security

- Cookies: `Secure`, `HttpOnly`, `SameSite=Lax`.
- Refresh token rotation on every use.
- Revocation list checked on refresh.

## 10. Audit logging

- Every sign-in, MFA challenge, role change, API-key create/rotate/revoke is logged.
- Log fields include: who, org, action, IP (masked), user agent, result.
- Exportable on Pro+.

## 11. Threats considered

- Credential stuffing → Clerk has rate limits; we additionally notify on "new sign-in from new device".
- Token theft → short JWT life, refresh rotation, device binding (planned).
- Privilege escalation → RBAC tested per PR; cross-tenant tests prevent existence leakage.
- API-key leakage → detection via regex in CI; rotation tooling; scanning services (optional).
- Phishing → passkey support; SSO for enterprise.

## 12. Internal & partner access

- Support engineers can impersonate with justification and 7-day audit trail (Enterprise opt-out).
- No production DB access without a break-glass procedure.
- Data access requests logged and reviewed monthly.

## 13. SCIM (Enterprise)

- SCIM 2.0 token issued per IdP connection.
- Operations supported: `Users` CRUD, `Groups` CRUD, group-to-role mapping.
- Rate-limited; health endpoint; provisioning logs exposed in the admin console.

## 14. Roadmap

- v1.0: Clerk MAU auth, API keys, RBAC with roles + branch policies.
- v1.1: OIDC self-serve on Pro, audit log polish.
- v1.5: SAML + SCIM GA, device management.
- v2.0: fine-grained resource ACLs, per-ontology dedicated roles.

Related: [Security](SECURITY.md) · [Compliance](COMPLIANCE.md) · [API Specification](../02_architecture/API_SPECIFICATION.md) · [Multi-Tenancy](../02_architecture/MULTI_TENANCY.md)
