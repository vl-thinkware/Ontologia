# Feature Specifications

Each feature is listed with: ID, priority, user story, acceptance criteria, dependencies, and implementation notes. Priorities map to the MoSCoW bucket from the [PRD](PRD.md).

Legend: **M** = Must (v1.0) · **S** = Should (v1.1) · **C** = Could (v2.0).

---

## M1 — Visual graph editor

**User story.** As a Knowledge Architect, I can lay out and edit concepts and typed relations visually so that I model my domain quickly.

**Acceptance criteria.**
- Create a concept with name and optional description; edit both inline.
- Attach typed relations between two concepts; pick or create a relation type.
- Drag, multi-select, copy/paste, undo/redo (session-scoped).
- Zoom 10%–400%, pan, fit-to-screen, mini-map.
- Filter the canvas by relation type, status, or free-text.
- Performance budget: < 150 ms FPS cost on a 5,000-node canvas.

**Dependencies.** Concept/relation APIs (Phase 0). Frontend lib: React Flow.

---

## M2 — Git-like versioning

**User story.** As an Architect, every change I make is recorded as a commit I can review and revert.

**Acceptance criteria.**
- "Commit" action collects all pending draft changes into an atomic commit.
- Commit metadata: id, parent id, branch id, author, timestamp, message, stats (adds / mods / dels).
- History view lists commits in reverse chronological order with branch lanes.
- Diff view between any two commits (graph or list).
- Revert creates a new commit that inverts a target commit.
- Versioning is never "rewritten" (no force-push equivalent in v1.0).

**Dependencies.** Data model (see [DATA_MODEL.md](../02_architecture/DATA_MODEL.md)), diff algorithm.

---

## M3 — Branches

**User story.** As an Architect, I can branch off `main`, iterate, then merge back.

**Acceptance criteria.**
- Create, rename, delete, switch branches.
- Fast-forward merge where no divergence.
- 3-way merge when both branches advanced; conflict UI lists concept/relation-level conflicts with "take ours / take theirs / merge manually".
- Merge produces a single merge commit referencing both parents.
- Branch protection on `main` (Pro+): require at least N approvals.

**Dependencies.** Versioning (M2).

---

## M4 — Multi-tenant workspaces & roles

**User story.** As an Owner, I can create an org, invite members and control who does what.

**Acceptance criteria.**
- Org → Workspace → Ontology hierarchy.
- Roles: `owner`, `editor`, `reviewer`, `viewer`.
- Invite by email; accept via magic link.
- Revoke member access immediately invalidates tokens (session + API keys scoped to member).
- No cross-tenant data visible anywhere in the UI or API.

**Dependencies.** Auth (Clerk), Postgres tenant model, [MULTI_TENANCY.md](../02_architecture/MULTI_TENANCY.md).

---

## M5 — Import / Export

**User story.** As any user, I can bring an existing taxonomy in and take it out.

**Acceptance criteria.**
- CSV import with a mapping step (which column → concept name / description / parent).
- JSON-LD import using a documented `@context`.
- Simplified OWL import (classes + subClassOf only at v1).
- Export: JSON (native format), CSV, JSON-LD.
- Imports run async as jobs; user sees progress; failures are actionable.

**Dependencies.** BullMQ, MinIO/S3 for temporary file storage.

---

## M6 — Search & navigation

**User story.** As any user, I can find any concept in < 2 seconds.

**Acceptance criteria.**
- Full-text search across concept name, description, synonyms, property values.
- Filters: status, relation type, property key/value.
- Tree view for `is-a` hierarchy with lazy loading; drag-drop reparent triggers a draft edit.
- Cmd-K / Ctrl-K palette: jump to ontology, branch, concept, or action.

**Dependencies.** Postgres `tsvector` (MVP) or OpenSearch (scale-up option, Phase 3).

---

## S1 — Review Requests (conceptual PRs)

**User story.** As an Architect, I can require review before changes land on `main`.

**Acceptance criteria.**
- Open a Review Request from a branch against a target branch.
- Request reviewers by name; roles gated (only Reviewers/Editors can approve).
- Reviewers can comment on any concept/relation, approve, or request changes.
- Merge blocked until approvals satisfy the branch policy.
- Email + in-app notifications on open, comment, approval, merge.

**Dependencies.** Comments (S2), notification service.

---

## S2 — Comments & annotations

**User story.** I can have a discussion about a specific concept or relation.

**Acceptance criteria.**
- Comment threads on a concept, a relation, or a diff entry.
- @mentions; resolves; edit history.
- Inline reactions (thumbs-up).

**Dependencies.** Postgres comments table, notification service.

---

## S3 — Public REST API

**User story.** As a Platform Engineer, I can read and write the ontology from my pipeline.

**Acceptance criteria.**
- Endpoints: ontologies, branches, commits, concepts, relations, searches (see [API_SPECIFICATION.md](../02_architecture/API_SPECIFICATION.md)).
- Auth via API key (Bearer token) scoped to workspace.
- Rate limits: documented, with `X-RateLimit-*` headers.
- OpenAPI 3.1 schema published at `/api/openapi.json`.
- SDK: `ontologia-python`, `ontologia-js` (generated from OpenAPI).

**Dependencies.** Auth, rate-limiter (Redis), versioning.

---

## S4 — Changelog & audit log

**User story.** As an Owner, I can prove what happened, when, and by whom.

**Acceptance criteria.**
- Changelog: per-ontology, per-branch, commit-level, human-readable.
- Audit log: per-org, every action (auth, membership, billing, ontology changes).
- Filters: user, date range, action type.
- Export CSV / JSON; retention ≥ 12 months on Pro, ≥ 7 years on Enterprise.

**Dependencies.** Event bus.

---

## S5 — Rich metadata

**User story.** I can attach extra information — definitions, synonyms, sources — to each concept.

**Acceptance criteria.**
- Built-in fields: `definition`, `synonyms[]`, `source`, `status`, `confidence` (0–1).
- Arbitrary custom properties (string, number, boolean, date, reference).
- Schema (when defined) validates types on commit.

---

## C1 — Light inference

- Compute transitive closure of `is-a`.
- Detect cycles in declared hierarchies.
- Validate transitivity / symmetry declarations of relation types.
- Expose results via the API; display warnings in the canvas.

---

## C2 — AI suggestions

- "Concepts you might have missed" — cluster descriptions, surface gaps.
- "Similar concept already exists" — warn on near-duplicates during editing.
- "Suggested relation" — propose likely relations between selected pair.
- All suggestions are opt-in, shown as drafts, never auto-committed.
- LLM calls run through a single abstraction with usage quotas per workspace.

---

## C3 — Webhooks & integrations

- Event types: `commit.created`, `branch.merged`, `review.opened`, `review.approved`, `concept.deprecated`.
- HMAC-signed payloads; retry with exponential backoff; dead-letter queue; replay from UI.
- Native connectors: dbt (export model descriptions), DataHub (push lineage & terms), Atlan (bi-directional sync).

---

## C4 — Cypher console

- Read-only query interface for Pro+ workspaces.
- Query scoped to the workspace's Neo4j database.
- Results rendered as table + graph preview.
- Rate-limited; slow-query kill switch; no write access in v1.

---

## C5 — Templates library

- Seed ontologies for e-commerce, finance (FIBO subset), healthcare (ICD-lite), manufacturing.
- "Start from template" in workspace creation.
- Community submissions later (post-GA).

---

## Cross-cutting features

- **Onboarding.** Product tour, sample ontology, first-commit nudge.
- **Billing portal.** Stripe-hosted for Starter/Pro; manual invoicing for Enterprise.
- **Notifications.** Email (Resend), in-app center, per-user preferences.
- **Search (global).** Across ontologies, commits, comments.

---

Related: [User Flows](USER_FLOWS.md) · [API Specification](../02_architecture/API_SPECIFICATION.md) · [Data Model](../02_architecture/DATA_MODEL.md)
