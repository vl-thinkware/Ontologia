# Infrastructure

All infrastructure is declared as code. This document describes what runs where and how we provision, modify and decommission it.

---

## 1. Environments

| Environment | Purpose | URL | Data |
|---|---|---|---|
| `dev` | Each engineer's laptop | `localhost` | Disposable |
| `preview` | Per-PR ephemeral deploy | `*.preview.ontologia.com` | Synthetic |
| `staging` | Pre-prod, always live | `staging.ontologia.com` | Sanitised clone of prod (daily refresh) |
| `sandbox` | Customer playground | `sandbox.ontologia.com` | Customer test tenants |
| `prod` | Production | `app.ontologia.com` / `api.ontologia.com` | Real |

Staging and prod share the same IaC modules with different parameters.

## 2. High-level diagram

```mermaid
flowchart LR
  users((Users))-- HTTPS -->cf[Cloudflare\nDNS + WAF + CDN]
  cf-- static FE -->vercel[Vercel\n(web app)]
  cf-- API -->api[Fastify API\nFly.io / Render]
  api-- TCP -->pg[(Postgres\nmanaged)]
  api-- bolt -->neo[(Neo4j Aura\nmulti-region)]
  api-- TCP -->red[(Redis\nmanaged)]
  api-- S3 -->r2[(Cloudflare R2)]
  api-- external APIs -->ext[Stripe / Clerk / Resend / LLM]
  workers[Workers]-- consumes -->red
  workers-- DB -->pg
  workers-- DB -->neo
  workers-- S3 -->r2
```

## 3. Vendors & accounts

| Service | Vendor | Account owner | Notes |
|---|---|---|---|
| DNS / CDN / WAF | Cloudflare | CTO | Free tier fine at GA |
| FE hosting | Vercel | CTO | Pro plan |
| BE hosting | Fly.io (primary), Render (fallback) | CTO | Multi-region from Phase 3 |
| Postgres | Neon or Supabase (EU + US) | CTO | Pro w/ PITR |
| Graph DB | Neo4j Aura | CTO | Pro; dedicated DBs on Pro+ tier customers |
| Redis | Upstash | CTO | per-region |
| Object storage | Cloudflare R2 | CTO | zero egress to users |
| Auth | Clerk | CTO | MAU-priced |
| Billing | Stripe | CEO | live + test |
| Email | Resend (primary), Postmark (fallback) | CTO | SPF/DKIM/DMARC set |
| Observability | Grafana Cloud, Sentry, Logtail | CTO | single pane for perf |
| Secrets | Doppler (MVP) → AWS Secrets Manager (Phase 3) | CTO | per env |
| CI | GitHub Actions | CTO | OIDC to cloud providers |

## 4. Regions

- v1.0 prod: `us-east-1` (primary) + `eu-west-1` (for EU tenants) only.
- Neo4j Aura: regional per tenant (Pro+); shared DBs are co-located with Postgres.
- CDN: global (Cloudflare).

## 5. Terraform layout

```
infra/terraform/
├── modules/
│   ├── core/             # DNS, WAF, Vercel project, Cloudflare R2 buckets
│   ├── api/              # Fly/Render app definitions
│   ├── postgres/         # DB provisioning + PITR
│   ├── redis/            # Upstash DB
│   ├── clerk/            # Clerk env (stub; most via dashboard)
│   ├── stripe/           # Stripe products + prices
│   └── observability/    # Sentry, Grafana, Logtail wiring
└── envs/
    ├── staging/
    └── prod/
```

- State stored in a locked S3 bucket with DynamoDB locking (or Terraform Cloud).
- CI applies staging on merge to `main`; prod via a manually-approved workflow.

## 6. Secrets management

- Secrets defined in Doppler (or AWS Secrets Manager).
- App reads from env on boot.
- No secrets in Terraform state (use `sensitive = true` + external data sources).
- Rotation: quarterly for all long-lived keys; on-demand on suspicion of compromise.

## 7. Boot sequence

- API starts → loads config → connects to Postgres / Neo4j / Redis → registers routes → OTel initialised → listens.
- Worker starts → connects to Redis / Postgres / Neo4j → subscribes to queues.
- Readiness probes: `/healthz` (liveness), `/ready` (dependencies OK).
- Graceful shutdown on SIGTERM, up to 30 s drain.

## 8. Autoscaling

- API: min 2, max 10 per region. CPU-based autoscaling with request latency as the authoritative metric.
- Workers: min 1, max 5 per queue.
- Scale-down delays to avoid flapping during deploys.

## 9. Network perimeter

- All public traffic via Cloudflare.
- WAF rules: block common exploits, enforce geo where necessary on Enterprise.
- Rate limits at Cloudflare (coarse) + app (fine-grained).
- Internal traffic: Fly.io private network (6PN) or Render VPC peering.
- No inbound DB access from the internet; always via API / workers.

## 10. Deployment model

- Frontend: Vercel preview per PR; prod deploy from `main`.
- Backend: blue/green deploys via Fly.io releases or Render rolling deploys.
- Migrations: run as a dedicated pre-deploy job. See [DATABASE_MIGRATIONS.md](../03_engineering/DATABASE_MIGRATIONS.md).

Detail in [DEPLOYMENT.md](DEPLOYMENT.md).

## 11. Observability infra

- **Logs.** `pino` → stdout → container runtime → Logtail.
- **Metrics.** OpenTelemetry exporter → Grafana Cloud Prometheus.
- **Traces.** OTLP → Grafana Tempo.
- **Errors.** Sentry (FE + BE).
- **Uptime.** Grafana Cloud Synthetic checks for `/healthz`, `/ready` and core flows.
- **Status page.** Instatus.com or a self-built static page subscribing to Grafana alerts.

## 12. Disaster recovery infra

- Postgres PITR enabled; 7 days on Starter, 30 days on Pro+, 90 days on Enterprise.
- Neo4j Aura daily snapshots; manual on-demand before destructive migrations.
- R2 lifecycle: versioning on, 30-day retention of non-current versions.

Detail in [BACKUP_DR.md](BACKUP_DR.md).

## 13. Cost controls

- Fly.io / Render: autoscale min set to avoid "always-on" costs in staging.
- Neo4j Aura: right-sized per tenant; dormant tenants scaled down after 14 days.
- Redis: per-region per-env.
- LLM: per-workspace cap + global cap to prevent runaway bills.

Full analysis in [COST_ANALYSIS.md](../08_finance/COST_ANALYSIS.md).

## 14. Change management

- All infra changes via PR.
- `infra/terraform/envs/prod` requires CODEOWNER approval.
- Tagged `infra-change` in the release notes.
- High-impact changes (DB version upgrade, region add, provider swap) need an ADR.

Related: [Deployment](DEPLOYMENT.md) · [CI/CD](CI_CD.md) · [Monitoring](MONITORING.md) · [Backup & DR](BACKUP_DR.md) · [Cost Analysis](../08_finance/COST_ANALYSIS.md)
