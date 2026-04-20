# Development Setup

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


From a blank laptop to a running Ontologia stack in under 30 minutes. If anything here is wrong or slow, file an issue — the onboarding experience is a product.

---

## 1. Prerequisites

- **OS.** macOS 14+, Ubuntu 22.04+ or Windows 11 + WSL2.
- **Node.js.** 20 LTS via `nvm` (`.nvmrc` pinned).
- **pnpm.** 9.x (`corepack enable`).
- **Docker Desktop** / Colima / OrbStack — for Neo4j, Postgres, Redis, MinIO locally.
- **Git.** 2.40+.
- **An editor.** We recommend VS Code with workspace settings auto-applied (`.vscode/`).

Optional:

- `mkcert` for local HTTPS.
- `ngrok` / Cloudflare Tunnel for testing webhooks against local.
- `ripgrep`, `jq`, `httpie`.

## 2. Clone and bootstrap

```bash
git clone git@github.com:ontologia/ontologia.git
cd ontologia
cp .env.example .env
pnpm install
pnpm dev:services      # starts docker-compose with Postgres, Neo4j, Redis, MinIO
pnpm dev:migrate       # runs Postgres migrations and Neo4j constraints
pnpm seed              # optional demo data
pnpm dev               # starts api (3001), web (3000), worker (one process)
```

Open `http://localhost:3000`. Sign up with any email — Clerk dev instance auto-verifies.

## 3. Repository layout (monorepo)

```
/
├── apps/
│   ├── web/                   # React frontend
│   ├── api/                   # Fastify backend
│   ├── worker/                # BullMQ worker
│   └── docs-site/             # Docusaurus public docs
├── packages/
│   ├── graph/                 # GraphStore interface + Neo4j adapter
│   ├── db/                    # Drizzle schema + migrations
│   ├── shared/                # Shared types, zod schemas, utils
│   ├── sdk-js/                # Published JS SDK
│   ├── ui/                    # Design system components (Radix + Tailwind)
│   ├── events/                # Event bus abstractions
│   ├── connectors/
│   │   ├── dbt/
│   │   ├── datahub/
│   │   └── atlan/
│   └── test-utils/            # Test fixtures, factories
├── infra/
│   ├── terraform/             # IaC
│   └── compose/               # docker-compose for local dev
├── docs/                      # This folder
└── .github/
    └── workflows/             # CI
```

- **Turborepo** orchestrates builds.
- **pnpm workspaces** manage deps.
- **TypeScript project references** keep compile times down.

## 4. Environment variables

Every service has a typed, Zod-validated config loaded at boot. The `.env.example` is canonical; rotate entries whenever you add a config.

Key variables:

```
# core
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# postgres
DATABASE_URL=postgres://ontologia:password@localhost:5432/ontologia_dev

# neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=changeme
NEO4J_DATABASE=ontologia_shared
NEO4J_MODE=shared           # shared | dedicated

# redis
REDIS_URL=redis://localhost:6379

# object storage
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET=ontologia-local

# auth
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# billing
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# email
RESEND_API_KEY=

# llm
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# observability
SENTRY_DSN=
LOGTAIL_TOKEN=
OTEL_EXPORTER_OTLP_ENDPOINT=

# features
FEATURE_CYPHER_CONSOLE=false
FEATURE_AI_SUGGESTIONS=false
```

## 5. docker-compose services

Local-only, `infra/compose/docker-compose.yml`:

- `postgres:16-alpine`
- `neo4j:5-enterprise` (dev licence)
- `redis:7-alpine`
- `minio/minio` with a bucket created at boot
- `mailhog` for local SMTP capture

## 6. Seeding demo data

`pnpm seed` loads:

- 1 organisation, 1 workspace, 1 sample ontology ("e-commerce").
- 30 concepts, 45 relations, 10 commits on `main`, 1 open review on a feature branch.
- Enough breadth to test all flows without staring at an empty canvas.

## 7. Running tests

```bash
pnpm test                     # vitest, all packages
pnpm test:watch               # watch mode
pnpm test:e2e                 # Playwright, starts services first
pnpm test:integration         # Testcontainers + real Postgres/Neo4j
pnpm test:property            # fast-check property tests on versioning
```

See [TESTING_STRATEGY.md](TESTING_STRATEGY.md).

## 8. Code quality locally

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm check                    # lint + typecheck + tests; what CI runs
```

Pre-commit (`husky` + `lint-staged`): formats staged files and blocks commits that break lint/typecheck on touched files.

## 9. Making changes

1. Create a branch: `git checkout -b feat/<short-description>`.
2. Small PR scope. ≤ 400 LOC diff aimed for.
3. Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`.
4. Open PR against `main`; fill out the PR template (what, why, screenshots, test plan).
5. Request review (1 reviewer on internal, 2 on schema / security changes).

See [GIT_WORKFLOW.md](GIT_WORKFLOW.md).

## 10. Common pitfalls

- **"Neo4j connection refused"**: Docker not running or port conflict. `docker compose ps`.
- **"Clerk publishable key missing"**: copy from Clerk dashboard, restart dev server.
- **Slow canvas on seed data**: React Flow dev mode is slower; build with `pnpm build:web && pnpm preview`.
- **Stripe webhook signature invalid**: use `stripe listen --forward-to localhost:3001/v1/stripe/webhook`.
- **Neo4j full-text index missing**: rerun `pnpm dev:migrate`.

## 11. IDE config

Provided in `.vscode/`:

- ESLint, Prettier formatters on save.
- TypeScript workspace version.
- Recommended extensions: ESLint, Prettier, Tailwind, Vitest Explorer, Drizzle Kit, Docker.

## 12. Support

- `#engineering` in Slack.
- [Onboarding checklist](../09_team/ONBOARDING.md).
- Pair with any engineer for an hour on your first Friday; it compounds.

---

Related: [Tech Stack](../02_architecture/TECH_STACK.md) · [Coding Standards](CODING_STANDARDS.md) · [Git Workflow](GIT_WORKFLOW.md) · [Testing Strategy](TESTING_STRATEGY.md)
