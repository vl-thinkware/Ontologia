# Service Level Agreement

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


Public-facing SLA structure. The marketing-friendly version lives at `ontologia.com/legal/sla`. Enterprise contracts may supersede these defaults with MSA-specific terms.

---

## 1. Scope

This SLA covers the Ontologia hosted SaaS service at `api.ontologia.com` and `app.ontologia.com`. It does not cover:

- Free tier workspaces.
- Customer-caused issues (self-inflicted rate limits, invalid inputs).
- Events outside our control — force majeure, internet routing, third-party IdP outages beyond acknowledged scope.
- Scheduled maintenance (announced ≥ 5 business days in advance).

## 2. Uptime commitments

| Plan | Monthly uptime commitment | Remedy (credits) |
|---|---|---|
| Free | No SLA | none |
| Starter | 99.5% | credit on next invoice up to 5% |
| Pro | 99.9% | credit on next invoice up to 10% |
| Enterprise | 99.95% (default) — may be negotiated higher | credit on next invoice up to 20%, or as contracted |

"Uptime" = `successful 2xx/3xx responses on /v1/* ÷ total valid requests` measured per minute, aggregated monthly.

### Credit calculation

| Monthly uptime | Credit (% of monthly fee) |
|---|---|
| < target but ≥ target − 0.5% | 5% |
| < target − 0.5% but ≥ target − 2% | 10% |
| < target − 2% | 20% |

Credits do not exceed the cap per plan. Credits must be requested within 30 days.

## 3. Performance SLOs

These are operational targets, not contract-level SLAs on Starter/Pro; Enterprise contracts may elevate them.

| Operation | Target (p95 monthly) |
|---|---|
| REST read | ≤ 300 ms |
| Commit write (≤ 50 changes) | ≤ 400 ms |
| Commit write (≤ 500 changes) | ≤ 1.5 s |
| Diff (≤ 1k entities) | ≤ 500 ms |
| Webhook delivery first attempt | ≤ 60 s |
| Export job (≤ 10k concepts) | ≤ 60 s |

## 4. Support response targets

| Plan | Business-hours response | 24×7 response | Channels |
|---|---|---|---|
| Free | Best effort | — | Community forum |
| Starter | ≤ 24 h | — | Email, in-app chat |
| Pro | ≤ 8 h | — | Email, in-app chat |
| Enterprise | ≤ 2 h (P1), ≤ 8 h (P2) | Yes (P1) | Email, chat, dedicated Slack Connect |

Severity P1 = production unavailable; P2 = production impaired but usable; P3 = minor / question.

## 5. Maintenance

- Routine maintenance windows announced ≥ 5 business days in advance, ≤ 2 h per event.
- Opt-in maintenance channels for Enterprise customers with geographic constraints.
- Maintenance counting toward uptime: no (pre-announced windows excluded).

## 6. Data protection commitments

- Data durability target: 99.999% (Pro) / 99.9999% (Enterprise).
- Encryption at rest & in transit: always on.
- Regional data residency: Pro+ at creation (US or EU).
- Backup retention: see [BACKUP_DR.md](BACKUP_DR.md).

## 7. Security commitments

Detailed in [SECURITY.md](../06_security_compliance/SECURITY.md):

- SOC 2 Type I within 12 months of GA, Type II within 24 months.
- Annual penetration test.
- 72 h notification for confirmed security incidents affecting customer data (Pro+).
- Sub-processors list public at `ontologia.com/legal/subprocessors`; 30 days' notice before material changes.

## 8. Exceptions

- Beta or labelled-experimental features are excluded from SLA.
- Issues caused by customer code (malformed requests, webhook sinks that return 5xx) are excluded.
- Third-party IdP (Clerk) outages: best effort to maintain sessions for 15 min with cached tokens.

## 9. How we measure

- Synthetic checks every 60 s from three regions.
- Real-user monitoring via an error-rate SLI on `/v1/*`.
- Status page reflects measured state.
- Monthly report for Pro/Enterprise with uptime numbers, auto-generated.

## 10. Requesting credits

1. Email `support@ontologia.com` within 30 days of the affected month.
2. Include the dashboard screenshot or Ontologia-confirmed incident identifier.
3. Credits applied on the next invoice.

## 11. Changes to this SLA

- Changes require 30 days' notice to current customers.
- Changes cannot reduce commitments mid-term of a paid contract.

Related: [Incident Response](INCIDENT_RESPONSE.md) · [Monitoring](MONITORING.md) · [Security](../06_security_compliance/SECURITY.md)
