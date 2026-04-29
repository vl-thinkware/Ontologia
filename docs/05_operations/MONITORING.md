# Monitoring & Observability

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)

We run a small stack with outsized reliability expectations. With two founders, observability is what keeps us honest — we'd rather get paged than learn about downtime from a customer email.

> **Bootstrap posture.** Phase 0–1 uses free tiers across Sentry, Logtail, Grafana Cloud, Better Uptime. The goal is to never lose sight of what the system is doing, even when the whole observability stack costs less than a lunch. We upgrade tiers only when a specific customer SLA or a specific outage has justified it.

---

## 1. The three signals

- **Logs**: structured JSON via pino → Logtail (Phase 2+). Phase 0–1: Render log viewer.
- **Metrics**: OpenTelemetry → Grafana Cloud Prometheus (Phase 2+).
- **Traces**: OTLP → Grafana Tempo (Phase 3+).

Plus:
- **Errors**: Sentry (frontend + backend) from day one.
- **Product analytics**: PostHog Cloud free tier (Phase 1+).
- **Uptime**: Better Uptime synthetic checks + a public status page (Phase 2+).

## 2. Logging standard

- JSON only. Never freeform text.
- Base fields: `time, level, msg, service, env, version, requestId, traceId, spanId, orgId?, userId?`.
- Levels: `trace | debug | info | warn | error | fatal`.
- PII never in logs: redact email, mask last octet of IP, names, tokens.
- Log sampling on hot paths at `info` level.

Example (an MVP change-event write):

```json
{
  "time":"2026-05-01T10:12:34.456Z",
  "level":"info",
  "service":"api",
  "env":"prod",
  "version":"v1.2.3",
  "requestId":"req_…",
  "traceId":"…",
  "orgId":"org_…",
  "route":"POST /v1/change-events",
  "status":201,
  "durationMs":112,
  "msg":"change event created"
}
```

## 3. Metrics catalogue (selected)

### Golden signals
- `http_requests_total{route,method,status,org_plan}`
- `http_request_duration_seconds{route,method,quantile}` — histograms
- `http_errors_total{route,status}`

### Business-level (MVP)
- `change_events_total{operation,org_plan}` where operation ∈ `create | update | delete | revert | tag | bulk_import`
- `tags_created_total`
- `reverts_total`
- `webhooks_delivered_total{result}` (success / fail / dead)
- `imports_total{format,result}`, `imports_concepts_per_job_histogram`

> Branches, commits, and reviews are deferred (see [VERSIONING_SYSTEM.md](../02_architecture/VERSIONING_SYSTEM.md)). The corresponding metrics (`commits_total`, `reviews_opened_total`, `reviews_merged_total`) ship with S1 / S2.

### Infra
- `neo4j_query_duration_seconds{op}` where op ∈ `read | write | merge`
- `pg_query_duration_seconds{table}`
- `redis_latency_seconds{op}`
- `worker_jobs_total{queue,status}`

### Resource
- CPU / memory / network per service provided by Render; scraped into Grafana (Phase 2+).

Cardinality discipline: we tag on `org_plan` (Free / Team / Business / Enterprise) but **not** on `org_id` in general metrics. Per-tenant metrics are exposed in the Enterprise console only.

## 4. Tracing

- OpenTelemetry SDKs on API and worker, enabled from Phase 2.
- Sampling: 100% on errors, 10% on everything else (boosted for slow traces).
- Spans on: HTTP handlers, DB calls, external HTTP, queue enqueue/consume, LLM calls.
- Trace context propagated via `traceparent` header for webhooks.

## 5. Dashboards

Standard Grafana dashboards, built as we need them:

1. **SRE overview** (Phase 2). Request rate, error rate, latency quantiles per service and per region.
2. **Change-event deep dive** (Phase 2). Change-event write latency, revert rate, diff cache hit rate, bulk-import throughput.
3. **Webhook delivery** (Phase 3). Success rate, retry count, DLQ size, per-customer drilldown.
4. **Database health** (Phase 2). Postgres connections, slow queries, replica lag, Neo4j heap / query times.
5. **Infra cost** (Phase 1). Spend per service per day, pulled from each vendor's API.
6. **Business** (Phase 1). Sign-ups, activation rate, MRR, churn — PostHog → Grafana.

Phase 0: we don't have dashboards. We have Sentry, Render logs, and a Monday standup.

## 6. Alerting

### Channels
- **Pager** (Better Uptime on-call — both founders receive SEV1) → on-call founder.
- **Slack `#alerts`** for informational signals.
- **Email digest** for weekly summaries.

In Year 1, both founders are on-call all the time, with an informal day-on / day-off pattern when both are available. There is no formal rotation until the first hire in Year 2+.

### Alert policy (examples)

| Alert | Condition | Severity | Route |
|---|---|---|---|
| API error rate high | `http_errors_total{status>=500} / http_requests_total > 1% over 5 min` | SEV1 | Pager |
| API latency regression | p95 of `POST /v1/change-events` > 500 ms for 10 min | SEV2 | Slack |
| Neo4j slow query spike | p95 > 1.5 s for 10 min | SEV2 | Slack |
| Worker backlog | BullMQ queue age > 60 s for 10 min | SEV2 | Slack + pager if > 5 min SEV1 |
| Webhook DLQ growth | > 10 deliveries / hour | SEV2 | Slack |
| Sign-up failure rate | > 5% for 10 min | SEV1 | Pager |
| Billing event failure | > 1 Stripe webhook failure / hour | SEV2 | Slack |
| Certificate expiry | < 14 days | SEV3 | Slack |
| Disk / memory on DB | > 85% | SEV2 | Slack |
| Infra bill anomaly | Daily run-rate > 1.5× trailing 7-day average | SEV3 | Slack (sent to Valentin too) |

Alert fatigue is enemy #1. New alerts require a named owner and a runbook link — no exceptions, even with two founders.

## 7. Runbooks

Every paging alert links to a runbook in `docs/05_operations/runbooks/` (folder populated incrementally per alert). Each runbook has:

- Symptoms.
- Dashboards to check.
- Common causes.
- Mitigation steps (least destructive first).
- Escalation path.

In Year 1 the escalation path is: Alexandre → Valentin → customer email with an honest "we're on it".

## 8. Status page

- Public status at `status.semlify.com` powered by Better Stack Status (free up to 10 components).
- Components: API, Web App, Authentication, Webhooks, Imports, Search.
- Auto-posts "investigating" when a SEV1 fires for > 5 minutes; manual updates after that.
- Customers can subscribe to email / RSS.

## 9. On-call (founder era)

- Both founders carry the pager.
- Weekly "who's primary?" written in Slack every Monday (Valentin covers Mon–Wed nights; Alexandre covers Thu–Sun nights by default; flex as needed).
- Response time targets:
  - SEV1: acknowledged within 15 minutes (not 5 — we are two people with lives).
  - SEV2: acknowledged within 1 hour during business hours, next-morning otherwise.

A formal paid on-call rotation with compensated hours arrives with the first engineering hire (Year 2+).

Detail in [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).

## 10. SLOs

Per [SLA.md](SLA.md):

| SLO | Target |
|---|---|
| API availability (2xx/3xx on `/v1/*`) | 99.5% monthly (Free/Team), 99.9% (Business), 99.95% (Enterprise) |
| Webhook delivery ≤ 1 min p95 | 99% monthly |
| Change-event write p95 ≤ 250 ms | 99% monthly |
| Data durability | 99.999% annual |

Breach of an SLO for two consecutive months triggers an SLO review retrospective between the founders.

## 11. Security observability

- Audit log written for every privileged operation.
- Brute-force login detection (Clerk + our own rules).
- Cloudflare WAF / bot management metrics surfaced into Grafana.
- Secret scanning in CI (gitleaks); alerts on matches.

## 12. Data privacy in telemetry

- We never log PII.
- We never send customer ontology content to third-party observability tools.
- LLM requests/responses are not stored in logs; only counts, model, and token usage.
- Traces in Tempo do not include request bodies or response payloads.

## 13. Year-one observability budget

| Tool | Tier | Monthly cost |
|---|---|---|
| Sentry | Free (5k errors) | $0 |
| Logtail | Free (1 GB ingest) | $0 |
| Grafana Cloud | Free | $0 |
| Better Uptime | Free (10 monitors) | $0 |
| PostHog Cloud | Free (1M events) | $0 |
| **Total Phase 0–1** | | **$0** |

First paid upgrade: usually Sentry Team ($26/mo) around Phase 3 when monthly error volume exceeds the free 5k. We accept this hit as necessary — error triage slows us down if we're sampling errors.

Related: [Infrastructure](INFRASTRUCTURE.md) · [Incident Response](INCIDENT_RESPONSE.md) · [SLA](SLA.md) · [Cost Analysis](../08_finance/COST_ANALYSIS.md)
