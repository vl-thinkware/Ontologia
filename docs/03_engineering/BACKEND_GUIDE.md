# Backend Guide

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


Patterns and recipes for the Semlify API and worker services.

---

## 1. Layering

```
Route (Fastify handler)
  └── Service (business logic)
        ├── Repositories (Postgres, Neo4j, Redis, S3)
        ├── External clients (Stripe, LLM, email)
        └── Event bus (Redis Streams)
```

Strict rule: **routes never touch repositories directly**. Services own transactions and orchestrate.

## 2. Project layout (`apps/api`)

```
apps/api/src/
├── server.ts                  # boot
├── config.ts                  # zod-validated env
├── logger.ts                  # pino + request id
├── db.ts                      # drizzle + neo4j drivers
├── plugins/                   # fastify plugins
│   ├── auth.ts
│   ├── tenant.ts
│   ├── authz.ts
│   ├── rate-limit.ts
│   ├── otel.ts
│   ├── sentry.ts
│   └── openapi.ts
├── routes/
│   └── v1/
│       ├── ontologies/
│       ├── branches/
│       ├── commits/
│       ├── reviews/
│       ├── comments/
│       ├── webhooks/
│       ├── exports/
│       └── admin/
├── services/
│   ├── ontology.service.ts
│   ├── commit.service.ts
│   ├── merge.service.ts
│   ├── review.service.ts
│   ├── import-export.service.ts
│   ├── webhook.service.ts
│   ├── billing.service.ts
│   └── notification.service.ts
├── repositories/
│   ├── postgres/
│   │   ├── ontology.repo.ts
│   │   └── …
│   └── graph/
│       ├── commit.repo.ts
│       ├── concept.repo.ts
│       └── …
├── events/
│   └── emit.ts
└── errors.ts
```

## 3. Plugins chain (order matters)

1. `@fastify/sensible` — standard error helpers.
2. `@fastify/helmet` — headers.
3. `@fastify/cors` — strict allow-list.
4. `plugins/otel.ts` — tracing.
5. `plugins/sentry.ts` — capture.
6. `plugins/auth.ts` — verifies JWT or API key.
7. `plugins/tenant.ts` — resolves org, sets `app.current_org_id`.
8. `plugins/authz.ts` — role + scope checks (per-route).
9. `plugins/rate-limit.ts` — per user + per org buckets.
10. `plugins/openapi.ts` — auto-generates the spec.

## 4. Config

```ts
// config.ts
export const config = Config.parse(process.env);

const Config = z.object({
  NODE_ENV: z.enum(["development","test","staging","production"]),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  NEO4J_URI: z.string(),
  NEO4J_MODE: z.enum(["shared","dedicated"]).default("shared"),
  REDIS_URL: z.string(),
  CLERK_SECRET_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  LOGTAIL_TOKEN: z.string().optional(),
  // feature flags:
  FEATURE_CYPHER_CONSOLE: z.coerce.boolean().default(false),
  FEATURE_AI_SUGGESTIONS: z.coerce.boolean().default(false),
});
```

Nothing reads `process.env` directly except `config.ts`.

## 5. Routes

```ts
// routes/v1/commits/post.ts
export const route: FastifyPluginAsync = async (app) => {
  app.post("/", {
    schema: { body: CreateCommitBody, response: { 201: CommitResponse } },
    preHandler: [app.auth, app.tenant, app.authz("write:ontology")],
    handler: async (req, reply) => {
      const result = await app.services.commit.create({
        orgId: req.tenant.orgId,
        userId: req.user.id,
        input: req.body,
      });
      return reply.code(201).send(result);
    },
  });
};
```

- One file per endpoint.
- Zod schemas live in `packages/shared` so the SDK and UI share them.

## 6. Services

- Single responsibility per service.
- Services accept an object of dependencies (poor-man DI) for testability.
- All mutations inside a single transaction (Postgres) or Cypher write transaction.

Example skeleton:

```ts
export class CommitService {
  constructor(
    private readonly concepts: ConceptRepo,
    private readonly commits: CommitRepo,
    private readonly events: EventEmitter,
  ) {}

  async create(input: CreateCommitInput): Promise<Commit> {
    return withTx(async (tx) => {
      const head = await this.commits.head(input.branchId, tx);
      if (head.id !== input.expectedHeadCommitId) throw new StaleHead();

      const commit = await this.commits.write(input, head, tx);
      await this.events.emit({ type: "commit.created", data: commit });
      return commit;
    });
  }
}
```

## 7. Repositories

- Postgres via Drizzle ORM.
- Neo4j via the `GraphStore` port; current adapter uses `neo4j-driver`.
- Always accept a transaction handle; the service owns the transaction lifetime.
- Return domain types, not driver types.

## 8. Events & webhooks

- Emitting: `events.emit({ type, orgId, data })` writes to Redis Streams atomically after the DB commit (outbox pattern if needed; v1 uses transactional enqueue for simplicity).
- The webhook dispatcher (worker) consumes the stream and delivers per subscription.
- HMAC signature: `v1=hex(HMAC_SHA256(secret, t + "." + body))`.

## 9. Jobs (worker)

Each queue has:
- A typed job schema (Zod).
- Idempotency keys derived from input.
- A retry policy and DLQ.

Queues:

| Queue | Concurrency | Retry | DLQ after |
|---|---|---|---|
| import | 1/org | 3 | 24 h |
| export | 1/org | 3 | 24 h |
| merge | 1/org | 0 (user-driven) | n/a |
| webhook-delivery | 50 | exponential up to 24 h | 24 h |
| llm-suggestions | 5 | 2 | 1 h |

Workers respect tenant isolation: each job declares `orgId`; repositories refuse queries without it.

## 10. Authentication

Two paths:

- **User sessions.** Clerk JWT; `auth` plugin verifies and attaches `req.user = { id, email, orgs: [...] }`.
- **API keys.** Key prefix + secret; lookup by prefix, constant-time compare against Argon2id hash; attach `req.user = { id: apiKeyId, scopes: [...] }`.

The tenant plugin picks the active org (from URL path, or from a `x-semlify-org` header), checks membership, sets `app.current_org_id`.

See [AUTHENTICATION.md](../06_security_compliance/AUTHENTICATION.md).

## 11. Validation & parsing

- Zod schemas at the boundary.
- Outgoing responses serialised via Fastify's schema serialization for speed and consistency.
- Enums kept in `packages/shared` so the SDK reflects them.

## 12. Error handling

- `throw new AppError("stale_head", { …context })` — handled by an error mapper to RFC 7807.
- Non-`AppError` exceptions: logged at `error`, returned as `500` with a neutral body.
- `onError` hook logs with request id, user id, org id.

## 13. Observability (backend)

- `pino` JSON logs.
- `X-Request-Id` propagated across services.
- OpenTelemetry traces; spans around DB, HTTP and queue operations.
- Metrics:
  - `http_requests_total{route,method,status,org_plan}`
  - `commit_write_duration_seconds`
  - `merge_conflicts_total`
  - `webhook_delivery_failures_total`

## 14. Feature flags

`config.FEATURE_*` booleans for boot-time flags; a runtime flag service (PostHog feature flags) for per-org / per-user flags. Flags are cheap to add; leave a comment with a removal target.

## 15. Shutdown

- SIGTERM: stop accepting new HTTP; let in-flight requests drain up to 30 s; close DB pools; exit.
- Workers: finish current job, requeue stragglers, exit.

## 16. Anti-patterns to avoid

- Mutations outside services.
- Repositories reaching into other repositories.
- Services talking HTTP to the internet directly — wrap in a typed client.
- Accepting `req` / `reply` inside services (ties them to HTTP).
- Catching errors just to swallow them.
- Business logic in middleware beyond what the plugin chain prescribes.

Related: [Architecture](../02_architecture/ARCHITECTURE.md) · [API Specification](../02_architecture/API_SPECIFICATION.md) · [Coding Standards](CODING_STANDARDS.md) · [Testing Strategy](TESTING_STRATEGY.md)
