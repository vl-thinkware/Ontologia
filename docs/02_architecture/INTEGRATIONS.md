# Integrations

Ontologia is only valuable if it plugs into the rest of the data stack. This document captures every supported integration, at what maturity, and how engineers should build new ones.

---

## 1. Integration maturity ladder

| Level | Definition | Owned by |
|---|---|---|
| L0 — **Platform primitives** | API + webhooks + SDKs. Anyone can build on them. | Ontologia |
| L1 — **First-party connectors** | Maintained by us, in the Ontologia integrations catalog. | Ontologia |
| L2 — **Certified partners** | Third-party build, we test and endorse. | Partner |
| L3 — **Community** | Community-built, listed with a "community" tag. | Community |

The roadmap below assigns each integration to a level and phase.

## 2. v1.0 (GA) integrations

### L0 — Platform primitives
- REST API (`/v1`).
- OpenAPI 3.1 spec.
- Python SDK (`ontologia-python`).
- JavaScript SDK (`ontologia-js`).
- Webhook subscriptions (signed).

### L1 — First-party connectors (day-one)
- **dbt Cloud / dbt Core.** Export concept metadata as dbt model descriptions and tags.
- **DataHub (OSS + SaaS).** Push glossary terms and business lineage.
- **Atlan.** Bi-directional sync of business terms and ontology references.

## 3. Post-GA (v1.x)

- **Snowflake / BigQuery — "ontology as a table".** Materialise a flat view of concepts and relations in the customer's warehouse.
- **Confluence.** Publish a read-only rendering of an ontology as a Confluence page tree (or space).
- **Slack.** Summary of daily / weekly changes to a watched ontology; thread-based review reminders.
- **GitHub.** Commit status checks linked to conceptual PRs.
- **LangChain / LlamaIndex retriever.** A supported "OntologiaRetriever" class for RAG stacks.
- **Elasticsearch / OpenSearch.** Index-push for search systems.

## 4. Long-term (v2+)

- **SCIM 2.0** (enterprise user provisioning).
- **SAML 2.0 / OIDC** enterprise IdPs (Okta, Entra, Ping).
- **Kafka / event bus bridge** for customers pushing ontology events into their own buses.
- **Airflow / Dagster operators** for scheduled exports.
- **MDM suites** (Informatica, Reltio) — bridge for customers who already own MDM.

## 5. Principles for building integrations

1. **One-way before two-way.** Sync out is cheaper and safer; start there.
2. **Events, not polling.** Webhooks first, cron later.
3. **Respect tenant boundaries.** Every integration is scoped to one workspace / org by default.
4. **Credentials are shortlived.** Prefer OAuth for partner systems; store tokens encrypted.
5. **Observability on the hot path.** Every outbound call has a span and a per-integration SLO.
6. **Fail loud, recover gracefully.** Integration failures surface in the UI; exponential backoff; DLQ after 24 h.

## 6. Building a new first-party connector

Directory layout:

```
packages/connectors/{name}/
  src/
    index.ts           // export a ConnectorManifest
    sync.ts            // pull/push logic
    mappings.ts        // field mappings
    credentials.ts     // OAuth/secret handling
  test/
  README.md
```

Manifest contract:

```ts
export const manifest: ConnectorManifest = {
  id: "datahub",
  label: "DataHub",
  category: "Data catalog",
  auth: { type: "oauth2", scopes: [...] },
  events: ["ontology.updated","branch.merged"],
  actions: ["pushTerms","pullTerms"],
  ui: { icon: "data-hub.svg", fields: [...] }
};
```

Each connector is a package. Connectors ship their own UI schema so the settings page can render without bespoke frontend changes.

## 7. Webhook contract cheat sheet

For customers writing their own integrations, see full contract in [API_SPECIFICATION.md § 5](API_SPECIFICATION.md#5-webhook-payloads). Key points:

- HMAC-SHA-256 signature header.
- Event types published in OpenAPI spec.
- 10 s timeout, exponential retries (up to 24 h).
- DLQ and replay in UI.

## 8. Testing integrations

- Record-and-replay fixtures (`polly.js`-style) for external HTTP calls.
- Sandbox accounts for each partner (dbt Cloud trial, DataHub local, Atlan test tenant).
- Nightly smoke tests against live sandboxes, non-blocking.

## 9. Partner program (high level)

- L2 certification requires:
  - Connector using our Partner SDK.
  - Shared test harness green.
  - Security review.
  - Customer-facing documentation.
  - Named contact for support.

The partner program is commercial; see [PARTNERSHIPS.md](../07_business/PARTNERSHIPS.md).

---

Related: [API Specification](API_SPECIFICATION.md) · [Partnerships](../07_business/PARTNERSHIPS.md)
