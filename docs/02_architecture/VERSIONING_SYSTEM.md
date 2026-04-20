# Versioning System

This is Ontologia's most distinctive subsystem. It must be simple enough to explain to Persona B (Domain Expert) and robust enough for Persona A (Knowledge Architect). This document describes the conceptual model, the algorithms and the invariants we protect.

---

## 1. Core concepts

- **Commit.** An immutable snapshot of an ontology at a moment in time. Identified by a UUID; has a message, an author, a timestamp and a parent (or two parents for merges).
- **Branch.** A named pointer to a commit. Moves forward as commits are added.
- **Ontology.** A container of commits and branches. The default branch is `main`.
- **Draft.** Client-side, uncommitted pending changes. Lives in the browser (and in a server-side workspace-scoped staging area for resilience).
- **Ref.** A generic name for "something that resolves to a commit" (`main`, `feature/x`, a specific SHA-like id).

## 2. Invariants

1. **Immutability.** Once a commit is written, its data is never mutated. The only way to "undo" is to create a revert commit.
2. **Attribution.** Every commit has exactly one author; merges have one author *and* two parents.
3. **Traceability.** For every concept / relation version, we can answer: which commit created it? which commit retired it?
4. **Reproducibility.** Given `(ontologyId, commitId)`, the state of the ontology is deterministic.
5. **No history rewriting.** No force-push in v1.0. Admins cannot delete commits; only revert.

## 3. The commit graph

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

`M4` has two parents: `C3` (main) and `C3'` (feature/ab).

## 4. Staging model (drafts)

Editors work in a **draft** over a ref. The draft stores the deltas on top of that ref (adds, modifies, deletes) without touching the graph. The draft persists:

- Locally in IndexedDB (source of truth for unsaved work).
- Periodically synced to the server (`/v1/drafts/:id`) to protect against lost work.

Committing = "promote this draft to a new commit on this branch."

## 5. Commit semantics in Neo4j

The commit is a node. The set of concepts/relations "alive at" a commit is modelled with `(:Commit)-[:INCLUDES]->(:Concept|:ConceptRelation)`.

Rationale: diffing two commits becomes a set operation on their INCLUDES sets, which Neo4j handles efficiently with proper indexing.

### 5.1 Writing a commit
In a single Cypher transaction:

1. Read HEAD of the target branch.
2. For each changed concept/relation:
   - If added: create a new `:Concept|:ConceptRelation` with a fresh `versionId`, link with `INCLUDES` to the new commit.
   - If modified: create a new version node, `NEXT_VERSION` from the previous version, link with `INCLUDES`.
   - If deleted: do not link `INCLUDES`; set `status='deprecated'` on the previous version.
3. For all concepts/relations unchanged in this commit, copy over the `INCLUDES` edges (constant-time pointer list, not a deep copy).
4. Create the `:Commit` node with parent = old HEAD.
5. Move `:Branch`-[:POINTS_TO]-> to the new commit.

All within the same transaction; either everything lands or nothing does.

### 5.2 Copy-on-write optimisation
To avoid O(N) `INCLUDES` copies on every commit we use **snapshot pages**. Every 50 commits on a branch, we materialise a full `INCLUDES` set; intermediate commits store only deltas (`ADDED`, `REMOVED` edges) over the nearest snapshot. Resolving "state at commit X" walks forward from the nearest snapshot.

Thresholds tunable via config; monitored by a Grafana panel.

## 6. Diff algorithm

Given commits `A` and `B`:

- **Added = INCLUDES(B) − INCLUDES(A)**
- **Removed = INCLUDES(A) − INCLUDES(B)**
- **Modified = items whose `id` is in both sets but whose `versionId` differs**

Represented as:

```ts
type Diff = {
  concepts: { added: Concept[]; removed: Concept[]; modified: ConceptChange[] };
  relations: { added: Relation[]; removed: Relation[]; modified: RelationChange[] };
  stats: { added: number; modified: number; removed: number };
};
```

Cached for 1 hour; invalidated on new commits on either commit's branch.

## 7. Merge algorithm

### 7.1 Fast-forward
If the target branch's HEAD is an ancestor of the source branch's HEAD: just move the target branch pointer to the source HEAD. No merge commit.

### 7.2 3-way merge
Let:
- `O` = lowest common ancestor (LCA) commit.
- `A` = HEAD of target (e.g. `main`).
- `B` = HEAD of source (e.g. `feature/x`).

Algorithm:
1. Compute `diffA = diff(O, A)` and `diffB = diff(O, B)`.
2. For each concept `c`:
   - If only one side touched it, take that side.
   - If both sides touched it:
     - Same change? Trivial merge.
     - Different changes? **Conflict.**
3. Same for relations.
4. Compile the merged state.
5. If no conflicts, write a merge commit with two parents (`A`, `B`) including the merged state.
6. If conflicts, return a `ConflictReport`; merge is deferred until resolved.

### 7.3 LCA (ancestor) computation
Walk parents breadth-first from both sides. With commits numbered by topological order, this is `O(d)` where `d` is the distance from HEAD to branch point. For typical ontologies (< 10k commits), negligible.

### 7.4 Conflict types

| Conflict | Example |
|---|---|
| `name_conflict` | Both branches renamed concept `X` differently |
| `description_conflict` | Both edited the description |
| `property_conflict` | Both set different values for the same property key |
| `relation_conflict` | Both connected `X` to `Y` with different relation types |
| `deletion_modification` | One deleted `X`, the other modified it |
| `structural_conflict` | Both added a relation that creates a cycle where the type forbids it |

Each conflict ships a resolution suggestion (choose ours / choose theirs / custom).

## 8. Revert

Given target commit `T` on branch `B` with HEAD `H`:

- Compute `diff(T, H)`.
- Create a new commit `R` whose `INCLUDES` set equals `T`'s.
- Move branch `B` to `R`.
- Emit `commit.reverted` event with `revertedCommitId=H-target`, `restoredCommitId=T`.

## 9. Branch policies

A branch can be protected with:

- `requireReviews: n` (minimum approvals).
- `requireChecks: ['lint','cycle-free','no-breaking-rename']` (server-side validators).
- `restrictDirectCommits: boolean`.
- `allowedMergers: userId[] | role[]`.

Default policy on `main` for new Pro+ workspaces: `requireReviews=1`, `restrictDirectCommits=false`, `requireChecks=['cycle-free']`.

## 10. Server-side validators (for protected branches)

- **cycle-free**: rejects commits that would introduce a cycle in declared transitive relations.
- **no-breaking-rename**: rejects commits where > 10% of concepts are renamed without deprecation.
- **relation-type-strict**: when strict mode is on, rejects commits using undeclared relation types.

Validators are pure functions over diffs; added via a plugin interface.

## 11. Published versions (post-v1.0)

Owners may "publish" a commit as an immutable, named version (`ontology:v2.3`). Downstream consumers target published versions rather than `main` to avoid drift.

Published versions are just tags — pointers to commits — stored in Postgres (`published_versions` table) and visible in the UI and API.

## 12. Edge cases

- **Empty ontology.** `main` points to a genesis commit whose INCLUDES set is empty.
- **First commit.** `parentCommitId` is null.
- **Fork of an empty branch.** Not allowed; branches can only be created from an existing commit.
- **Concurrent commits on the same branch.** Handled optimistically: commit request carries `expectedHeadCommitId`. If HEAD moved, the server returns `409 Conflict` and the UI prompts to rebase.
- **Large bulk imports.** Run as a single commit with a `bulk: true` flag; the INCLUDES copy becomes a full snapshot automatically.

## 13. Performance targets

| Operation | P50 | P95 |
|---|---|---|
| Write commit (≤ 50 changes) | 120 ms | 400 ms |
| Diff two commits (≤ 1k INCLUDES delta) | 80 ms | 300 ms |
| Fast-forward merge | 50 ms | 150 ms |
| 3-way merge (≤ 500 concepts touched) | 400 ms | 1.5 s |
| Revert to any commit | 150 ms | 600 ms |

Measured on the canonical Neo4j Aura instance (2 vCPU / 8 GB).

## 14. Testing strategy

- **Unit tests** on the diff and merge functions with small handcrafted graphs.
- **Property-based tests** (`fast-check`) on invariants: "after revert(X, Y) then revert the revert, state equals original HEAD".
- **Scenario tests**: scripted sequences of commits and merges; snapshot compare the resulting INCLUDES sets.
- **Chaos tests**: random bytes in commit messages, enormous drafts, concurrent merges — we expect graceful failure, not corruption.

## 15. Open design choices

Tracked in [REFINEMENTS.md](../01_product/REFINEMENTS.md). Most notably: snapshot interval tuning, published versions in v1.0 vs v1.1, optional linear-history enforcement on `main`.

---

Related: [Data Model](DATA_MODEL.md) · [API Specification](API_SPECIFICATION.md) · [Testing Strategy](../03_engineering/TESTING_STRATEGY.md)
