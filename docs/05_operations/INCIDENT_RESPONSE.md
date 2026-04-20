# Incident Response

A practical playbook for the first 60 minutes of an incident, and the days that follow.

---

## 1. Definitions

- **Incident.** Any unplanned event that degrades service for customers.
- **SEV1.** Customer-facing outage, data risk, security breach. All hands.
- **SEV2.** Major feature degraded, many customers affected but service usable.
- **SEV3.** Minor degradation, workarounds available.

Security incidents escalate to SEV1 by default.

## 2. Roles during an incident

- **Incident Commander (IC).** Coordinates. Usually the on-call engineer at first; can hand off.
- **Comms Lead.** Customer-facing updates (status page, email, Slack/intercom).
- **Scribe.** Timeline of actions and observations in the incident doc.
- **Subject-matter experts.** Pulled in as needed.

A single person can hold two roles early on; split as soon as feasible.

## 3. First minutes — checklist

1. **Acknowledge the page** (5 min SEV1 target).
2. Open an incident channel in Slack: `#inc-<short-name>`.
3. Start the incident doc from a template (timeline, severity, affected components, hypotheses, actions, owner).
4. Post status page "Investigating" for SEV1/SEV2.
5. Triage:
   - What is affected? (API? Canvas? Webhooks? A single tenant?)
   - Since when? (deploy? schema change? external vendor?)
   - How big? (customer-count estimate, error rate).
6. Decide if rollback is the safe move.

## 4. Mitigation first, root cause second

- If a recent deploy is implicated: **rollback** before investigating deeply.
- If an external vendor is implicated: isolate, fall back where possible, comms the blast radius.
- If a migration is implicated: pause downstream consumers, inspect, decide.

Prefer the cheaper, reversible mitigation — even if it's temporary.

## 5. Communication cadence

- **Internal.** Updates in the incident channel every 15 min during SEV1.
- **External.**
  - Status page updates every 30 min on SEV1.
  - Proactive email to affected Enterprise customers within 30 min of declaration.
  - Post-incident public note within 72 h (short) and a full RCA within 7 business days for SEV1.

## 6. Common incident types

### API error spike
- Check recent deploys; consider rollback.
- Sentry top issues.
- Per-route error distribution.
- Neo4j / Postgres saturation?

### Webhook delivery broken
- Check dispatcher logs.
- Retry budget.
- Customer endpoint down (400+ errors) — not our problem but we should surface it.

### Database saturation
- Read or write? Which pool?
- Scale vertically if quick; identify top slow query otherwise.
- Kill long-running queries with operator blessing.

### Auth outage
- Clerk status.
- Our cache of sessions can hold for ~15 min.
- Publish status; pause non-essential jobs to reduce load.

### Data integrity concern (rare, critical)
- STOP writes to the affected area.
- Engage CTO immediately.
- Preserve evidence (logs, DB snapshots).

### Security incident
- Engage security lead.
- Preserve evidence.
- Rotate affected credentials.
- Do not assume malice vs mistake before evidence.
- Legal / privacy consulted; see [COMPLIANCE.md](../06_security_compliance/COMPLIANCE.md).

## 7. Post-incident (for SEV1 and SEV2)

1. **Retrospective** within 5 business days. Blameless. Focus on systems, not people.
2. Artifact: a Markdown RCA under `docs/05_operations/rca/<date>-<slug>.md` with:
   - Timeline.
   - Detection latency.
   - Customer impact.
   - Root cause.
   - What went well.
   - What to change — concrete, owned actions with due dates.
3. Follow-ups are tracked in the tracker and must close within agreed timelines; CTO reviews at monthly engineering all-hands.

## 8. RCA template (short)

```
# RCA <YYYY-MM-DD> <short title>

- Severity:
- Duration:
- Customer impact:
- Services affected:

## Summary

## Timeline (UTC)

## Root cause

## Detection

## Contributing factors

## What went well

## What we'll change

| Action | Owner | Due |
```

## 9. SLO impact

Each incident that burns more than 10% of the monthly error budget gets an automatic action item to review priorities.

## 10. Tooling

- PagerDuty / OpsGenie for paging.
- Slack for coordination.
- Google Docs or GitHub incident repo for RCAs.
- Status page at `status.ontologia.com` (Instatus).

## 11. Chaos & game days

- Quarterly game day: simulate a failure and run the playbook end-to-end.
- Annual tabletop security incident with legal.

## 12. Contact list

- On-call: rotating (see PagerDuty schedule).
- CTO: primary escalation for SEV1 technical.
- CEO: informed for any SEV1 lasting > 1 h.
- Legal: notified within 4 h for security/data incidents.

Related: [Monitoring](MONITORING.md) · [SLA](SLA.md) · [Security](../06_security_compliance/SECURITY.md) · [Compliance](../06_security_compliance/COMPLIANCE.md)
