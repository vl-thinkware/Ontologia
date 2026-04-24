# Tech Stack

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


The "what we use and why" list. Each choice includes a brief justification, the version we target at launch, and a note on exit cost.

---

## Summary table

| Layer                     | Choice                             | Version      | Rationale in one line                                     | Exit cost                          |
| ------------------------- | ---------------------------------- | ------------ | --------------------------------------------------------- | ---------------------------------- |
| Frontend framework        | React                              | 18.x         | Ecosystem for canvas libs (React Flow), large talent pool | Low (components portable)          |
| Frontend build            | Vite                               | 5.x          | Fast DX; no bespoke webpack                               | Low                                |
| Graph canvas              | React Flow                         | 12.x         | Best TS-first flow library; performant up to 10k nodes    | Medium (custom nodes tied to API)  |
| Tree view                 | react-arborist / d3-hierarchy      | latest       | Virtualised, keyboardable                                 | Low                                |
| State (server)            | TanStack Query                     | 5.x          | Cache + refetch + optimistic updates                      | Low                                |
| State (client)            | Zustand                            | 4.x          | Minimalist, no Redux ceremony                             | Low                                |
| Styling                   | Tailwind CSS + Radix UI            | 3.x / latest | Tokens + accessible primitives                            | Low                                |
| Forms                     | React Hook Form + Zod              | latest       | Client/server schema parity                               | Low                                |
| Backend runtime           | Node.js                            | 20 LTS       | Shared TS types, mature ecosystem                         | Low                                |
| API framework             | Fastify                            | 4.x          | High throughput, first-class schema + OpenAPI             | Medium                             |
| Validation                | Zod                                | 3.x          | Single source of truth for types and runtime validation   | Low                                |
| Queue                     | BullMQ                             | 5.x          | Mature Redis-based jobs                                   | Medium                             |
| Event bus                 | Redis Streams                      | 7.x          | Simple, transactional, enough for our volume              | Low                                |
| Primary DB                | PostgreSQL                         | 16.x         | Default OLTP for SaaS; ubiquitous managed offerings       | Low                                |
| Graph DB                  | Neo4j Aura                         | 5.x          | Native graph, managed, multi-region                       | **High** — product is graph-native |
| Cache / rate limit        | Redis                              | 7.x          | Hot path and counters                                     | Low                                |
| Object storage            | Cloudflare R2                      | —            | Zero egress; S3-compatible                                | Low                                |
| Auth                      | Clerk                              | latest       | Fastest path from 0 to SSO-ready B2B auth                 | Medium                             |
| Billing                   | Stripe                             | latest       | Self-serve + tax + invoicing                              | Low                                |
| Email                     | Resend                             | latest       | Simple API, good deliverability                           | Low                                |
| Error tracking            | Sentry                             | latest       | BE + FE, perf traces                                      | Low                                |
| Logs                      | Logtail (Better Stack)             | latest       | JSON logs, cheap at our scale                             | Low                                |
| Metrics                   | Grafana Cloud                      | latest       | Prometheus + Loki + Tempo in one place                    | Low                                |
| LLM                       | OpenAI primary, Anthropic fallback | latest       | Quality + cost routing behind our own port                | Low                                |
| IaC                       | Terraform                          | 1.x          | Standard; works across all listed providers               | Medium                             |
| CI                        | GitHub Actions                     | —            | Standard                                                  | Low                                |
| FE hosting                | Vercel                             | —            | Preview per PR, edge cache                                | Medium                             |
| BE hosting                | Fly.io or Render                   | —            | Cheap start, global footprint                             | Medium                             |
| CDN / WAF                 | Cloudflare                         | —            | Free tier covers perimeter                                | Low                                |
| Container runtime (later) | AWS ECS / Fargate                  | —            | Future migration target                                   | Medium                             |

---

## Detailed rationale per key choice

### Neo4j Aura (graph store)
Chosen over Memgraph and ArangoDB because:
- Managed cluster per tenant is a first-class pattern (multi-tenancy is done for us).
- Strong ecosystem around Cypher, OpenCypher.
- Mature driver and audited security.
- Marketing benefit: the PDF spec already commits to "powered by Neo4j"; partnership with Neo4j's marketplace is realistic.

Exit is expensive — mitigated by an **adapter interface** (`GraphStore`) that wraps all Cypher calls so we can swap engines if pricing changes materially.

### Fastify (vs Express, NestJS, tRPC)
- Fastify ~ 2x Express throughput at low memory.
- JSON schema / Zod integration is first-class; OpenAPI generation comes for free via `fastify-swagger`.
- Lighter than NestJS without giving up DI (via `awilix`).
- tRPC rejected: we need a language-agnostic API (Python SDK).

### Clerk (vs Auth0, WorkOS, custom)
- Day-one email/password + OAuth + magic links.
- SSO (OIDC/SAML) + SCIM available when we need them without re-architecting.
- Priced per MAU, predictable.
- Migration path to WorkOS or custom later if margin pressure justifies.

### PostgreSQL (vs MySQL, SQL Server)
- Standard choice in 2026.
- Row-level security (RLS) helps enforce tenant isolation at the DB layer.
- JSONB for flexible metadata, `tsvector` for full-text search until we outgrow it.

### React Flow (vs Cytoscape.js, custom canvas)
- TS-native, node-based, used by major products (Zapier, Retool community clones).
- Good virtualisation + custom node rendering.
- Cytoscape.js shortlisted as fallback; migration is bounded to one package.

### Tailwind + Radix (vs Chakra, MUI)
- No opinionated CSS-in-JS runtime.
- Radix is unstyled + accessible; Tailwind applies our tokens cleanly.
- Keeps bundle size tight on the canvas page.

### Clerk + Stripe + Resend = "pay for infra, not build it"
As a small team racing to ship, we buy these capabilities until we have customer revenue that demands we internalise.

---

## Version & upgrade policy

- Pin by minor version in `package.json`; Dependabot weekly PRs.
- Major upgrades require an ADR.
- Security advisories (`npm audit`, Snyk) resolved within 7 days for critical, 30 days for high.
- Node LTS cadence; plan to adopt the next LTS within 3 months of release.

## Approved third-party libraries (frontend)

- `react`, `react-dom`, `react-router-dom`
- `@tanstack/react-query`, `zustand`
- `reactflow`
- `d3-hierarchy`, `react-arborist`
- `@radix-ui/*`
- `tailwindcss`, `class-variance-authority`, `clsx`
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `lucide-react` (icons)
- `date-fns`
- `posthog-js` (product analytics)

## Approved third-party libraries (backend)

- `fastify`, `@fastify/*` plugins (sensible, rate-limit, cors, swagger)
- `neo4j-driver`
- `pg`, `drizzle-orm` (ORM), `drizzle-kit` (migrations)
- `ioredis`, `bullmq`
- `zod`
- `pino` (logs)
- `@clerk/backend`
- `stripe`
- `openai`, `@anthropic-ai/sdk`
- `@opentelemetry/*`
- `vitest` (tests), `supertest` (HTTP), `fast-check` (property-based tests)

## Tools

- `pnpm` as package manager (workspaces).
- `turbo` for build orchestration in the monorepo.
- `prettier`, `eslint` with the project preset in [CODING_STANDARDS.md](../03_engineering/CODING_STANDARDS.md).
- `husky` + `lint-staged` for pre-commit checks.
- `commitlint` + conventional commits.

Related: [Architecture](ARCHITECTURE.md) · [Development Setup](../03_engineering/DEVELOPMENT_SETUP.md) · [Coding Standards](../03_engineering/CODING_STANDARDS.md)
