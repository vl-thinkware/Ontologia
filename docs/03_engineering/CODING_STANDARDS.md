# Coding Standards

Opinions live here so debates don't live in PRs. When something is missing, propose it in a PR against this file.

---

## 1. Language & versions

- TypeScript **strict**. `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Node 20 LTS features allowed; we do not target older runtimes.
- ES modules everywhere; no CommonJS in our code.

## 2. Linting & formatting

- `eslint` with `@typescript-eslint`, `eslint-plugin-unicorn`, `eslint-plugin-security`, project-specific rules in `packages/eslint-config`.
- `prettier` — no arguments about it. Run on save. `printWidth: 100`.
- `import/order` enforced; absolute imports via `@ontologia/*` aliases.
- `no-default-export` in `apps/api/*` (exception: Next-style handlers in docs site).

## 3. Project conventions

- File names: `kebab-case.ts`. React components: `PascalCase.tsx`.
- One main export per file; no barrel files in hot paths.
- Colocate tests: `foo.ts` → `foo.test.ts`.
- Avoid `index.ts` re-exports across packages; import from the precise module.

## 4. Types first

- Schema definitions (Zod) are the source of truth. Types are inferred (`z.infer<typeof>`), not hand-written.
- Prefer `type` over `interface` except for extensible public contracts.
- `any` is banned. `unknown` is acceptable at boundaries and must be narrowed immediately.
- Result types: prefer `Result<T, E>` over throwing when the error is expected; throw only for truly exceptional paths.

## 5. Error handling

- Throw `AppError` subclasses with a machine code (`'stale_head'`, `'merge_conflict'`). API maps these to RFC 7807 responses.
- Do not leak raw DB errors to clients.
- Every catch block has either a retry, a user-facing message, or a log line — never silent.
- Never use `console.*` in production code. Use the `logger`.

## 6. Logging, tracing, metrics

- Structured JSON logs via `pino`. Fields: `time, level, msg, orgId?, userId?, traceId, spanId, requestId`.
- OpenTelemetry spans around external calls (Neo4j, Postgres, Redis, LLM, Stripe). Follow the [sampling policy](../05_operations/MONITORING.md).
- Counter metrics with bounded labels; do not emit per-user metrics.
- PII is **never** logged. Redact email/name/IP before log-write.

## 7. Security-sensitive code

- No `eval`, no dynamic `Function`, no untrusted template evaluation.
- SQL via Drizzle only; no `db.raw`. Parameterised everywhere.
- Cypher parameters are always `$params`; never string-concatenated.
- Secrets come from `process.env` via a typed `config` module; never hardcoded.
- User-supplied HTML sanitised with `DOMPurify` on both ends.

See [SECURITY.md](../06_security_compliance/SECURITY.md).

## 8. Performance

- Any function hot on a request path needs a comment on its algorithmic complexity.
- Avoid N+1 queries; fetch in batches.
- Stream large payloads with async iterators; do not build multi-MB JSON in memory.
- Use `React.memo`, `useMemo`, `useCallback` judiciously — profile first; do not over-memoise.
- Canvas code runs in `requestIdleCallback` / `requestAnimationFrame` where applicable; never block the main thread > 16 ms.

## 9. Accessibility

- Every interactive element is keyboard operable.
- Use Radix primitives; they handle focus traps and aria attributes for us.
- Colour contrast ≥ WCAG 2.2 AA. Dev tools axe run in CI on storybook.

See [ACCESSIBILITY.md](../04_design/ACCESSIBILITY.md).

## 10. React conventions

- Functional components only.
- One component per file (except for tightly related primitives: `Button`, `Button.Icon`).
- Props typed, defaulted via destructuring. No `React.FC` (hides children typing).
- Fetch data via TanStack Query hooks in `hooks/queries/`.
- Side effects in effects; prefer event handlers to effects when you can.
- All forms use React Hook Form + Zod.

## 11. Backend conventions (Fastify)

- Route files mirror the URL layout: `src/routes/v1/commits/post.ts`.
- Each route exports an object: `{ method, url, schema, preHandler[], handler }`.
- Schemas are Zod; Fastify plugin converts them to JSON schema for OpenAPI.
- `preHandler` stack: auth → tenant → authz → validate → handler.
- No business logic in controllers. Call a service in `src/services/`.
- Services depend on repositories (Postgres / Neo4j); never on HTTP objects.
- All mutations wrapped in a transaction.

## 12. Cypher conventions

- Always set `orgId` on match and create:
  ```cypher
  MATCH (c:Concept { orgId: $orgId, id: $id }) …
  ```
- Use explicit parameters; never string-concatenate.
- Return shape documented in the repository method docstring.
- No `MATCH (n)` without a label.
- Complex reads go through named Cypher files under `packages/graph/cypher/`.

## 13. Testing conventions

- Each `.ts` has a `.test.ts` close by.
- Test names read as sentences: `"returns 409 when HEAD is stale"`.
- Arrange / Act / Assert, separated by blank lines.
- Factories over literals (`makeCommit({message:'…'})`).
- No network in unit tests; integration tests spin up Testcontainers.
- Coverage gates: 85% on `packages/graph`, 75% global. Branches: not enforced as a headline metric.

See [TESTING_STRATEGY.md](TESTING_STRATEGY.md).

## 14. Commit & PR hygiene

- Conventional Commits. Examples: `feat(canvas): virtualised rendering`, `fix(api): …`, `refactor(graph): …`, `docs: update API spec`.
- Small PRs. Aim ≤ 400 LOC; if larger, split or include a reading guide.
- PRs must pass: lint, typecheck, unit, integration, e2e (on critical paths), coverage.
- Every PR has: description, screenshots (for UI), test plan.

## 15. Reviews

- First reviewer claimed within 4 business hours.
- Review etiquette: [see internal guide](../09_team/CONTRIBUTING.md#reviewing).
- "Comment", "Approve", "Request changes". Prefer specific over vague ("here, this leaks the request id").
- Blocking only for correctness, security, maintainability. Style issues should be resolved by linters, not reviewers.

## 16. Dependencies

- Every new dependency requires a PR title `chore(deps): add X because Y`.
- Weigh: bundle size (frontend), maintenance signal (last commit, open issues), licence (MIT / Apache-2 / BSD only).
- No GPL / AGPL libraries without legal review.

## 17. Deprecation

- Deprecated APIs get a `@deprecated` JSDoc + `Sunset` header + entry in the changelog.
- Removal window: 6 months for internal, 12 months for public API.

## 18. Banned things

- `lodash` in frontend bundles (native or focused imports only).
- `moment` (use `date-fns` or `Temporal` polyfill).
- `axios` in frontend (use the generated SDK or `fetch`).
- CSS-in-JS with runtime (we use Tailwind + CVA).
- `!!` to coerce booleans in business logic — be explicit.

## 19. ADRs

Significant decisions ship with an ADR in `docs/02_architecture/adr/NNN-title.md`. Template: see [README](../README.md).

Related: [Development Setup](DEVELOPMENT_SETUP.md) · [Git Workflow](GIT_WORKFLOW.md) · [Testing Strategy](TESTING_STRATEGY.md) · [Frontend Guide](FRONTEND_GUIDE.md) · [Backend Guide](BACKEND_GUIDE.md)
