# Versioning System

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (MVP scope trimmed)

This is Ontologia's most distinctive subsystem. It must be simple enough to explain to a domain expert and robust enough for a knowledge architect. This document describes the conceptual model, the algorithms, and the invariants we protect.

> **MVP scope (v2 of this doc)**: MVP ships with an *immutable change history* at the concept and ontology level, plus revert and tags. The git-like *branches / merge / review* workflow is deferred until at least two paying customers on Business or Enterprise have demonstrated a real need. Section 1–6 describe the MVP. Section 7–10 describe the deferred branch/merge design we will revisit.

---

## 1. Core concepts (MVP)

- **Change event.** An immutable record of a single editorial action on an ontology. Identified by a UUID; has an author, a timestamp, an entity type (`concept` | `relation`), an entity id, a diff payload, and an optional human-readable message.
- **Ontology.** A container of change events. The state of the ontology at any time is the result of applying all change events in order.
- **Tag.** A named, immutable pointer to a specific change event (e.g. `v1-released`, `2026-Q2`). Tags never move once created.
- **Draft.** Client-side, uncommitted pending changes. Lives in the browser and in a server-side workspace-scoped staging area for resilience. Not part of the history until submitted.
- **Revert event.** A change event that inverts the effect of a specified prior change event. It is itself a change event — history is never rewritten, only appended to.

## 2. Invariants (MVP)

1. **Immutability.** Once a change event is written, its data is never mutated. The only way to "undo" is to append a revert event.
2. **Attribution.** Every change event has exactly one author and a server-assigned timestamp.
3. **Traceability.** For every concept or relation version, we can answer: which change event created it? which change event most recently modified it? which reverted what?
4. **Reproducibility.** Given `(ontologyId, changeEventId)`, the state of the ontology up to and including that event is deterministic.
5. **No history rewriting.** Admins cannot delete change events; they can only append reverts. Tags cannot be moved.

## 3. Change event storage (MVP)

Change events are stored in Postgres (authoritative, immutable, append-only) with a pointer into Neo4j for the materialised state.

### 3.1 Postgres table (simplified)

```sql
create table change_event (
  id uuid primary key,
  ontology_id uuid not null,
  author_id uuid not null,
  created_at timestamptz not null default now(),
  entity_type text not null check (entity_type in ('concept','relation','ontology','tag')),
  entity_id uuid,
  operation text not null check (operation in ('create','update','delete','revert','tag')),
  diff jsonb not null,
  message text,
  reverts_event_id uuid references change_event(id)
);

create index on change_event (ontology_id, created_at);
create index on change_event (ontology_id, entity_type, entity_id);
```

### 3.2 Neo4j materialised state

Neo4j holds the *current* state of each ontology. When a change event is written:

1. Begin a transaction.
2. Apply the diff to the current Neo4j state.
3. Link the affected concept/relation nodes to the change event id (`LAST_MODIFIED_BY` edge).
4. Commit Postgres row + Neo4j transaction in a two-phase write coordinated by the application layer (with idempotency keys so retries are safe).

The source of truth for history is Postgres; Neo4j is a derived store that can be rebuilt by replaying events.

## 4. Diff payload

```ts
type Diff =
  | { op: 'create', entity: Concept | Relation }
  | { op: 'update', entity_id: string, before: Partial<Entity>, after: Partial<Entity> }
  | { op: 'delete', entity_id: string, snapshot: Entity }
  | { op: 'revert', reverts_event_id: string, inverse: Diff };
```

Storing before/after in the update variant gives us cheap two-way diffing and trivial reverts.

## 5. Revert (MVP)

Given a target change event `T`:

1. Compute the inverse diff of `T`.
2. Append a new change event with `operation='revert'` and `reverts_event_id=T.id`.
3. Apply the inverse diff to Neo4j in the same transaction.
4. Emit a `change.reverted` event.

A revert of a revert is just another change event; the chain is fully traceable.

## 6. Tags (MVP)

- A tag is a named pointer to a change event id.
- Tags are created by ontology owners and editors.
- Tags cannot be moved or deleted — delete means append a new "tag deprecated" event and create a fresh one.
- Tags are the primary way downstream consumers target a known-good version of an ontology (e.g. `ontology@v2.3`).

---

## 7. Deferred: branches (S1)

The following design is pre-agreed but not in the MVP. It ships only when at least two paying customers have asked for it and Alexandre has the bandwidth.

### 7.1 Concepts

- **Commit.** A grouped, named bundle of change events written atomically. Has a parent commit (or two parents for merges).
- **Branch.** A named pointer to a commit. Moves forward as commits are added.
- **Ref.** Generic name for "something that resolves to a commit" (`main`, `feature/x`, a specific SHA-like id).

### 7.2 Commit graph

```
main:     C0 ── C1 ── C2 ── C3 (HEAD)
                    \
feature/ab:          C2' ── C3' (HEAD)
```

A merge:

```
main:     C0 ── C1 ── C2 ── C3 ── M4 (HEAD)
                    \           /
feature/ab:          C2' ── C3'
```

### 7.3 Neo4j materialisation

In the branch world, the set of concepts/relations "alive at" a commit is modelled with `(:Commit)-[:INCLUDES]->(:Concept|:ConceptRelation)`. We'll use snapshot pages (materialise the full INCLUDES set every 50 commits) to avoid O(N) copies on every commit.

## 8. Deferred: diff algorithm between commits

Given commits `A` and `B`:

- **Added = INCLUDES(B) − INCLUDES(A)**
- **Removed = INCLUDES(A) − INCLUDES(B)**
- **Modified = items whose `id` is in both sets but whose `versionId` differs**

Same TypeScript shape as MVP diffs, scaled to many entities at once. Cached for 1 hour; invalidated on new commits on either commit's branch.

## 9. Deferred: merge algorithm

### 9.1 Fast-forward
If the target branch's HEAD is an ancestor of the source branch's HEAD: just move the target branch pointer to the source HEAD. No merge commit.

### 9.2 3-way merge
Let `O` = lowest common ancestor (LCA), `A` = HEAD of target, `B` = HEAD of source.

1. Compute `diffA = diff(O, A)` and `diffB = diff(O, B)`.
2. For each concept/relation: if only one side touched it, take that side; if both sides touched it and the change is identical, trivial merge; otherwise, **conflict**.
3. Compile the merged state.
4. If no conflicts, write a merge commit with two parents (`A`, `B`).
5. If conflicts, return a `ConflictReport`; merge is deferred until resolved.

### 9.3 Conflict types

| Conflict | Example |
|---|---|
| `name_conflict` | Both branches renamed concept `X` differently |
| `description_conflict` | Both edited the description |
| `property_conflict` | Both set different values for the same property key |
| `relation_conflict` | Both connected `X` to `Y` with different relation types |
| `deletion_modification` | One deleted `X`, the other modified it |
| `structural_conflict` | Both added a relation that creates a cycle where the type forbids it |

Each conflict ships with a resolution suggestion (choose ours / choose theirs / custom).

## 10. Deferred: branch policies + review requests (S2)

When we ship S1 we also ship S2. A branch can be protected with:

- `requireReviews: n` (minimum approvals).
- `requireChecks: ['cycle-free','no-breaking-rename']` (server-side validators).
- `restrictDirectCommits: boolean`.
- `allowedMergers: userId[] | role[]`.

Default policy on `main` for Business+ workspaces: `requireReviews=1`, `restrictDirectCommits=false`, `requireChecks=['cycle-free']`.

Server-side validators:

- **cycle-free**: rejects commits that would introduce a cycle in declared transitive relations.
- **no-breaking-rename**: rejects commits where > 10% of concepts are renamed without deprecation.
- **relation-type-strict**: when strict mode is on, rejects commits using undeclared relation types.

Validators are pure functions over diffs, added via a plugin interface.

---

## 11. Edge cases (MVP)

- **Empty ontology.** The first change event creates the ontology; no predecessor needed.
- **Concurrent edits.** Handled optimistically: each change event submission carries `expectedLastEventId` for the affected entity. If the entity has moved on, the server returns `409 Conflict` and the UI prompts to reload.
- **Large bulk imports.** Run as a single change event with an `operation='bulk_import'` variant whose diff is a list of creates. Idempotent via a client-supplied import id.
- **Clock skew.** Server-assigned timestamps only; the client's timestamp is recorded separately for audit but never used for ordering.

## 12. Performance targets (MVP)

| Operation | P50 | P95 |
|---|---|---|
| Write change event (single concept edit) | 80 ms | 250 ms |
| Append revert event | 100 ms | 300 ms |
| Diff two change events at ontology level (≤ 500 entities delta) | 80 ms | 300 ms |
| Create tag | 30 ms | 100 ms |
| Load change history page (50 events) | 120 ms | 400 ms |

Measured on the canonical Neo4j Aura instance (4 GB shared tenant) plus Neon Postgres Launch.

## 13. Testing strategy (MVP)

- **Unit tests** on the diff and revert functions with small handcrafted graphs.
- **Property-based tests** (`fast-check`) on invariants: "after revert(X) then revert of that revert, state equals original".
- **Scenario tests**: scripted sequences of change events; snapshot compare the resulting Neo4j state against Postgres-replayed state.
- **Chaos tests**: random bytes in messages, enormous bulk imports, concurrent edits — we expect graceful failure, not corruption.
- **Rebuild test**: nightly job replays all events for a sample ontology and verifies the resulting Neo4j state matches the live state. If not, page Alexandre.

## 14. Open design choices

Tracked in [REFINEMENTS.md](../01_product/REFINEMENTS.md). Most notably: when exactly we ship S1 branches, whether we enforce optional linear history once branches exist, and how we handle multi-entity events (one change touching many concepts via a schema rename).

---

Related: [Data Model](DATA_MODEL.md) · [API Specification](API_SPECIFICATION.md) · [Architecture](ARCHITECTURE.md) · [Testing Strategy](../03_engineering/TESTING_STRATEGY.md) · [Features](../01_product/FEATURES.md)
