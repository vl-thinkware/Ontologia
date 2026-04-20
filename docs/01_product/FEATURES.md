# Feature Specifications

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (MVP scope trimmed)

Each feature has: ID, priority, user story, acceptance criteria, dependencies, and implementation notes. Priorities map to the MoSCoW bucket from the [PRD](PRD.md).

Legend: **M** = Must (MVP, v1.0) · **S** = Should (v1.1) · **C** = Could (v2.0 and beyond).

> **MVP scope change (v2 of this doc)**: the git-like branches/merge/review workflow is **deferred to v1.1 or later**. MVP ships with an immutable change history at the concept-and-ontology level, plus revert and tags — enough for full auditability and safe editing, without the complexity of branches and three-way merges.

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

**Owner**: Alexandre (implementation), Valentin (UX).

---

## M2 — Change history (concept-level and ontology-level)

**User story.** As an Architect, every change I make is recorded as an immutable change event I can review and revert.

**Acceptance criteria.**
- Every edit (create / update / delete on a concept or a relation) is persisted as a change event with: id, author, timestamp, entity type, entity id, diff payload, optional message.
- History view (per ontology) lists change events in reverse chronological order with filters (author, date range, entity type).
- Per-concept history view lists the change events that touched that concept.
- Diff view between any two change events at the ontology level.
- Revert creates a *new* change event that inverts a target change (no rewrite).
- History is append-only; no force-edit, no force-delete of history.
- Tag a point-in-time snapshot with a human-readable name (e.g. `v1-released`, `2026-Q2`); tags are immutable.

**Why this shape for MVP**: most of the auditability and safety benefits of git-like versioning come from the immutable history + revert + tags. We ship those first and skip the branching/merging complexity until customer demand justifies it.

**Dependencies.** [DATA_MODEL.md](../02_architecture/DATA_MODEL.md) (ChangeEvent node and payload format), diff algorithm.

**Owner**: Alexandre (history storage), Valentin (UX of the history view).

---

## M3 — Multi-tenant workspaces & roles

**User story.** As an Owner, I can create an org, invite members and control who does what.

**Acceptance criteria.**
- Org → Workspace → Ontology hierarchy.
- Roles: `owner`, `editor`, `reviewer`, `viewer`.
- Invite by email; accept via magic link.
- Revoke member access immediately invalidates tokens (session + API keys scoped to member).
- No cross-tenant data visible anywhere in the UI or API.

**Dependencies.** Auth (Clerk), Postgres tenant model, [MULTI_TENANCY.md](../02_architecture/MULTI_TENANCY.md).

**Owner**: Alexandre (implementation), Valentin (policy & UX).

---

## M4 — Import / Export

**User story.** As any user, I can bring an existing taxonomy in and take it out.

**Acceptance criteria.**
- CSV import with a mapping step (which column → concept name / description / parent).
- JSON-LD import using a documented `@context`.
- Simplified OWL import (classes + subClassOf only at v1).
- Export: JSON (native format), CSV, JSON-LD, TTL.
- Imports run async as jobs; user sees progress; failures are actionable.

**Dependencies.** BullMQ, Cloudflare R2 for temporary file storage.

**Owner**: Alexandre.

---

## M5 — Search & navigation

**User story.** As any user, I can find any concept in < 2 seconds.

**Acceptance criteria.**
- Full-text search across concept name, description, synonyms, property values.
- Filters: status, relation type, property key/value.
- Tree view for `is-a` hierarchy with lazy loading; drag-drop reparent triggers a change event.
- Cmd-K / Ctrl-K palette: jump to ontology, concept, or action.

**Dependencies.** Postgres `tsvector` for MVP.

**Owner**: Alexandre.

---

## M6 — Billing & plan gating

**User story.** As an Owner, I subscribe, upgrade, cancel, and the product enforces my plan limits.

**Acceptance criteria.**
- Stripe subscription for Team and Business, annual or monthly.
- Enterprise invoiced manually.
- Plan limits (workspaces, concepts, API calls) enforced server-side with friendly 402-style errors in the UI.
- Free-tier ceilings: 1 workspace, 500 concepts, 5,000 API calls / month.
- Upgrade flow completes in < 60 seconds.

**Dependencies.** Stripe, metered usage counters, [PRICING_MODEL.md](../08_finance/PRICING_MODEL.md).

**Owner**: Valentin (business rules & pricing page), Alexandre (implementation).

---

## S1 — Branches (deferred from MVP)

**User story.** As an Architect, I can branch off `main`, iterate in isolation, then merge back.

**Acceptance criteria (when we ship).**
- Create, rename, delete, switch branches.
- Fast-forward merge where no divergence.
- 3-way merge when both branches advanced; conflict UI at concept / relation level.
- Merge produces a single merge event referencing both parents.
- Branch protection on `main` (Business+): require at least N approvals.

**Dependencies.** M2 history, conflict-resolution UI, branch-aware data model changes.

**Status**: deferred. Shipped when two or more paying customers on Business/Enterprise demonstrate a real need; see [VERSIONING_SYSTEM.md](../02_architecture/VERSIONING_SYSTEM.md).

**Owner**: Alexandre (implementation), Valentin (UX).

---

## S2 — Review requests (deferred from MVP)

**User story.** As an Architect, I can require review before changes land on `main`.

**Acceptance criteria (when we ship).**
- Open a review request from a branch against a target branch.
- Request reviewers by name; roles gated (only reviewers/editors can approve).
- Reviewers can comment on any concept/relation, approve, or request changes.
- Merge blocked until approvals satisfy the branch policy.
- Email + in-app notifications on open, comment, approval, merge.

**Dependencies.** S1 branches, S3 comments, notification service.

**Status**: deferred. Ships with S1 at the earliest.

**Owner**: Alexandre + Valentin.

---

## S3 — Comments & annotations

**User story.** I can have a discussion about a specific concept or relation.

**Acceptance criteria.**
- Comment threads on a concept or a relation.
- @mentions; resolves; edit history.
- Inline reactions (thumbs-up).

**Dependencies.** Postgres comments table, notification service.

**Owner**: Alexandre (implementation), Valentin (UX).

---

## S4 — Public REST API

**User story.** As a Platform Engineer, I can read and write the ontology from my pipeline.

**Acceptance criteria.**
- Endpoints: ontologies, change events, concepts, relations, searches (see [API_SPECIFICATION.md](../02_architecture/API_SPECIFICATION.md)).
- Auth via API key (Bearer token) scoped to workspace.
- Rate limits: documented, with `X-RateLimit-*` headers.
- OpenAPI 3.1 schema published at `/api/openapi.json`.
- SDK: `ontologia-python`, `ontologia-js` (generated from OpenAPI).

**Dependencies.** Auth, rate-limiter (Redis), M2 history.

**Owner**: Alexandre.

---

## S5 — Changelog & audit log

**User story.** As an Owner, I can prove what happened, when, and by whom.

**Acceptance criteria.**
- Changelog: per-ontology, change-event-level, human-readable.
- Audit log: per-org, every action (auth, membership, billing, ontology changes).
- Filters: user, date range, action type.
- Export CSV / JSON; retention: 30 days on Free, 90 days on Team, 12 months on Business, up to 7 years on Enterprise.

**Dependencies.** Event bus.

**Owner**: Alexandre.

---

## S6 — Rich metadata

**User story.** I can attach extra information — definitions, synonyms, sources — to each concept.

**Acceptance criteria.**
- Built-in fields: `definition`, `synonyms[]`, `source`, `status`, `confidence` (0–1).
- Arbitrary custom properties (string, number, boolean, date, reference).
- Schema (when defined) validates types on change event application.

**Owner**: Alexandre (storage), Valentin (UX).

---

## C1 — Light inference

- Compute transitive closure of `is-a`.
- Detect cycles in declared hierarchies.
- Validate transitivity / symmetry declarations of relation types.
- Expose results via the API; display warnings in the canvas.

**Owner**: Alexandre.

---

## C2 — AI suggestions

- "Concepts you might have missed" — cluster descriptions, surface gaps.
- "Similar concept already exists" — warn on near-duplicates during editing.
- "Suggested relation" — propose likely relations between selected pair.
- All suggestions are opt-in, shown as drafts, never auto-applied.
- LLM calls run through a single adapter with usage quotas per workspace; multi-vendor from day one.

**Owner**: Alexandre (adapter + UX flow), Valentin (prompt quality + evaluation).

---

## C3 — Webhooks & integrations

- Event types: `change.created`, `tag.created`, `member.invited`, `concept.deprecated`.
- HMAC-signed payloads; retry with exponential backoff; dead-letter queue; replay from UI.
- Native connectors: dbt (export model descriptions), DataHub (push lineage & terms), Atlan (bi-directional sync).

**Owner**: Alexandre.

---

## C4 — Cypher console

- Read-only query interface for Business+ workspaces.
- Query scoped to the workspace's Neo4j database.
- Results rendered as table + graph preview.
- Rate-limited; slow-query kill switch; no write access in v1.

**Owner**: Alexandre.

---

## C5 — MCP server

- Expose the ontology as an MCP server so LLM agents (Claude, OpenAI Assistants, etc.) can look up concepts, relations, and synonyms.
- Read-only in v1; write endpoints gated by signed approvals.
- Strategic positioning: Ontologia as the canonical ontology source for agent ecosystems.

**Owner**: Alexandre.

---

## C6 — Templates library

- Seed ontologies for e-commerce, finance (FIBO subset), healthcare (ICD-lite), manufacturing.
- "Start from template" in workspace creation.
- Community submissions later.

**Owner**: Valentin.

---

## Cross-cutting features

- **Onboarding.** Product tour, sample ontology, first-change nudge. Owner: Valentin (content), Alexandre (implementation).
- **Billing portal.** Stripe-hosted for Team/Business; manual invoicing for Enterprise. Owner: Valentin.
- **Notifications.** Email (Resend), in-app center, per-user preferences. Owner: Alexandre.
- **Search (global).** Across ontologies, change events, comments. Owner: Alexandre.

---

Related: [User Flows](USER_FLOWS.md) · [API Specification](../02_architecture/API_SPECIFICATION.md) · [Data Model](../02_architecture/DATA_MODEL.md) · [Versioning System](../02_architecture/VERSIONING_SYSTEM.md) · [Roadmap](../00_overview/ROADMAP.md)
