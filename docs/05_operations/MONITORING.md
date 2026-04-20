# Monitoring & Observability

We run a small stack with outsized reliability expectations. Observability is the difference between knowing we're down and hearing about it from a tweet.

---

## 1. The three signals

- **Logs.** Structured JSON via pino → Logtail.
- **Metrics.** OpenTelemetry → Grafana Cloud Prometheus.
- **Traces.** OTLP → Grafana Tempo.

Plus:
- **Errors.** Sentry (frontend + backend).
- **Product analytics.** PostHog.
- **Uptime.** Grafana Cloud synthetic checks + a public status page.

## 2. Logging standard

- JSON only. Never freeform text.
- Base fields: `time, level, msg, service, env, version, requestId, traceId, spanId, orgId?, userId?`.
- Levels: `trace | debug | info | warn | error | fatal`.
- PII never in logs: we redact email, IP (mask last octet), names, tokens.
- Log sampling on hot paths at `info` level.

Example:

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
  "route":"POST /v1/commits",
  "status":201,
  "durationMs":112,
  "msg":"commit created"
}
```

## 3. Metrics catalogue (selected)

### Golden signals
- `http_requests_total{route,method,status,org_plan}`
- `http_request_duration_seconds{route,method,quantile}` — histograms
- `http_errors_total{route,status}`

### Business-level
- `commits_total{branch,org_plan}`
- `reviews_opened_total`, `reviews_merged_total`
- `webhooks_delivered_total{result}` (success / fail / dead)
- `imports_total{format,result}`, `imports_concepts_per_job_histogram`

### Infra
- `neo4j_query_duration_seconds{op}` where op ∈ `read | write | merge`
- `pg_query_duration_seconds{table}`
- `redis_latency_seconds{op}`
- `worker_jobs_total{queue,status}`

### Resource
- CPU / memory / network per service provided by the cloud host; scraped into Grafana.

Cardinality discipline: we tag on `org_plan` (Free/Starter/Pro/Enterprise) but **not** on `org_id` in general metrics. Per-tenant metrics are exposed in the Enterprise console only.

## 4. Tracing

- OpenTelemetry SDKs on API and worker.
- Sampling: 100% on errors, 10% on everything else (boosted for slow traces).
- Spans on: HTTP handlers, DB calls, external HTTP, queue enqueue/consume, LLM calls.
- Trace context propagated via `traceparent` header for webhooks.

## 5. Dashboards

Standard dashboards (Grafana):

1. **SRE overview.** Request rate, error rate, latency quantiles per service and per region.
2. **Versioning deep dive.** Commit latency, diff cache hit rate, merge duration, conflicts rate.
3. **Webhook delivery.** Success rate, retry count, DLQ size, per-customer drilldown.
4. **Database health.** Postgres connections, slow queries, replica lag (if any), Neo4j heap / query times.
5. **Infra cost.** Spend per service per day.
6. **Business.** Sign-ups, activation rate, MRR, churn.

## 6. Alerting

### Channels
- Pager (PagerDuty / OpsGenie) → on-call engineer.
- Slack `#alerts` for informational signals.
- Email digest for weekly summaries.

### Alert policy (examples)

| Alert | Condition | Severity | Route |
|---|---|---|---|
| API error rate high | `http_errors_total{status>=500} / http_requests_total > 1% over 5 min` | SEV1 | Pager |
| API latency regression | p95 of `/v1/commits` > 500 ms for 10 min | SEV2 | Slack |
| Neo4j slow query spike | p95 > 1.5 s for 10 min | SEV2 | Slack |
| Worker backlog | BullMQ queue age > 60 s for 10 min | SEV2 | Slack + pager if > 5 min SEV1 |
| Webhook DLQ growth | > 10 deliveries / hour | SEV2 | Slack |
| Sign-up failure rate | > 5% for 10 min | SEV1 | Pager |
| Billing event failure | > 1 Stripe webhook failure / hour | SEV2 | Slack |
| Certificate expiry | < 14 days | SEV3 | Slack |
| Disk / memory on DB | > 85% | SEV2 | Slack |

Alert fatigue is enemy #1. New alerts require a named owner and a runbook link.

## 7. Runbooks

Every paging alert links to a runbook in `docs/05_operations/runbooks/` (folder to be populated per alert). Each runbook has:

- Symptoms.
- Dashboards to check.
- Common causes.
- Mitigation steps (least destructive first).
- Escalation path.

## 8. Status page

- Public status at `status.ontologia.com` powered by Instatus or similar.
- Components: API, Web App, Authentication, Webhooks, Imports, Search.
- Auto-posts "investigating" when a SEV1 fires for > 5 min; manual updates after that.
- Customers can subscribe to email / RSS.

## 9. On-call

- Weekly rotation. Compensated where required by local law.
- On-call handoff at Mon 10:00 UTC with a 15-minute pairing window.
- Response time targets:
  - SEV1 acknowledged within 5 min; stabilised within 30 min.
  - SEV2 acknowledged within 15 min; fixed within same business day.

Detail in [INCIDENT_RESPONSE.md](INCIDENT_RESPONSE.md).

## 10. SLOs

Per [SLA.md](SLA.md):

| SLO | Target |
|---|---|
| API availability (2xx/3xx on `/v1/*`) | 99.9% monthly |
| Webhook delivery ≤ 1 min p95 | 99% monthly |
| Commit write p95 ≤ 400 ms | 99% monthly |
| Data durability | 99.999% annual |

Breach of an SLO for two consecutive months triggers an SLO review retrospective.

## 11. Security observability

- Audit log written for every privileged operation.
- Brute-force login detection (Clerk + our own rules).
- WAF / bot management metrics surfaced.
- Secret scanning in CI (gitleaks); alerts on matches.

## 12. Data privacy in telemetry

- We never log PII.
- We do not send customer ontology content to third-party observability tools.
- LLM requests/responses are not stored in logs; only counts, model and token usage.

Related: [Infrastructure](INFRASTRUCTURE.md) · [Incident Response](INCIDENT_RESPONSE.md) · [SLA](SLA.md)
