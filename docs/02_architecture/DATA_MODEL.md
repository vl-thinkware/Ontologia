# Data Model

Complete schema for the two databases powering Ontologia — Neo4j for the graph domain, PostgreSQL for everything relational.

---

## 1. Overview

Each organisation (tenant) has:

- **one tenant-scoped Neo4j database** (Pro+) or **a namespace inside a shared database** (Free/Starter) holding that org's ontologies, commits, concepts, relations.
- **rows in the shared Postgres** for users, orgs, memberships, billing, comments, audits, reviews, notifications, API keys, webhooks.

All Postgres tables carry an `org_id` column enforced via RLS. All Neo4j nodes and relations carry an `orgId` property when on shared Neo4j.

---

## 2. Neo4j schema

### 2.1 Node labels

```cypher
// Organisation metadata (mirror of Postgres for local joins; optional)
(:Org {id, name, createdAt, plan})

// Ontology containers
(:Ontology {
  id,                 // uuid
  orgId,              // string (tenant)
  name,               // string
  description,        // string
  defaultBranchId,    // uuid, refs :Branch
  createdAt, updatedAt,
  createdBy           // userId
})

// Branches
(:Branch {
  id,                 // uuid
  orgId, ontologyId,
  name,               // string (unique per ontology)
  headCommitId,       // uuid, refs :Commit
  isProtected,        // boolean
  createdAt, createdBy
})

// Commits
(:Commit {
  id,                 // uuid
  orgId, ontologyId, branchId,
  message,            // string
  authorId,           // userId
  parentCommitId,     // uuid or null
  mergeParentId,      // uuid or null (for merge commits)
  stats: {
    concepts: { added, modified, deleted },
    relations: { added, modified, deleted }
  },
  createdAt
})

// Concepts
(:Concept {
  id,                 // uuid — stable across versions
  versionId,          // uuid — unique per concept version
  orgId, ontologyId,
  firstCommitId,      // uuid
  lastCommitId,       // uuid (points to the commit that created this version)
  name, description,
  status,             // 'draft' | 'validated' | 'deprecated'
  synonyms,           // string[]
  source,             // string or null
  confidence,         // number 0..1 or null
  properties          // map (JSON) of custom keys
})

// Relation types (schema)
(:RelationType {
  id,
  orgId, ontologyId,
  name,               // e.g. 'is-a', 'part-of'
  label,              // human readable
  isTransitive,       // boolean
  isSymmetric,        // boolean
  isReflexive,        // boolean
  strict              // boolean — when true, relations of this type must be declared
})
```

### 2.2 Relationships

```cypher
// Org → ontologies
(:Org)-[:HAS_ONTOLOGY]->(:Ontology)

// Ontology → branches / commits
(:Ontology)-[:HAS_BRANCH]->(:Branch)
(:Ontology)-[:HAS_COMMIT]->(:Commit)

// Commit lineage
(:Commit)-[:PARENT]->(:Commit)
(:Commit)-[:MERGED_FROM]->(:Commit)   // optional, for merge commits

// Branch head
(:Branch)-[:POINTS_TO]->(:Commit)

// A commit "sees" the set of concept/relation versions alive at that commit.
// Modeled via a bitmap-like membership:
(:Commit)-[:INCLUDES]->(:Concept)
(:Commit)-[:INCLUDES]->(:ConceptRelation)

// Concept genealogy (version chain)
(:Concept)-[:NEXT_VERSION]->(:Concept)

// Typed relations between concepts — realised as a node to carry metadata per edge and per version
(:ConceptRelation {
  id, versionId,
  orgId, ontologyId,
  relationTypeId,     // refs :RelationType
  label, properties,
  firstCommitId, lastCommitId
})
(:Concept)-[:HAS_RELATION]->(:ConceptRelation)-[:TARGETS]->(:Concept)
```

Why realise a relation as a node? To attach per-edge properties and version them independently. This mirrors how git handles path-level diffs.

### 2.3 Indexes & constraints

```cypher
CREATE CONSTRAINT ontology_id IF NOT EXISTS FOR (o:Ontology) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT branch_id IF NOT EXISTS FOR (b:Branch) REQUIRE b.id IS UNIQUE;
CREATE CONSTRAINT commit_id IF NOT EXISTS FOR (c:Commit) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT concept_version_id IF NOT EXISTS FOR (c:Concept) REQUIRE c.versionId IS UNIQUE;
CREATE CONSTRAINT relation_version_id IF NOT EXISTS FOR (r:ConceptRelation) REQUIRE r.versionId IS UNIQUE;
CREATE CONSTRAINT relation_type_id IF NOT EXISTS FOR (r:RelationType) REQUIRE r.id IS UNIQUE;

// Lookup by tenant
CREATE INDEX concept_org_ontology IF NOT EXISTS FOR (c:Concept) ON (c.orgId, c.ontologyId);
CREATE INDEX relation_org_ontology IF NOT EXISTS FOR (r:ConceptRelation) ON (r.orgId, r.ontologyId);
CREATE INDEX commit_lookup IF NOT EXISTS FOR (c:Commit) ON (c.orgId, c.ontologyId, c.branchId);

// Full-text
CREATE FULLTEXT INDEX concept_fts IF NOT EXISTS FOR (c:Concept) ON EACH [c.name, c.description, c.synonyms];
```

### 2.4 Versioning invariants

1. A concept is **never mutated in place**. Edits produce a new `:Concept` node with the same `id` but a new `versionId`, linked via `[:NEXT_VERSION]` from the previous version and tagged with the new `lastCommitId`.
2. A commit atomically adds `[:INCLUDES]` edges for the new versions and retires (by not including) prior versions.
3. A branch's current state = "concepts included by HEAD commit and not superseded within HEAD's transitive commit set."
4. Revert creates a new commit whose `[:INCLUDES]` set equals the target commit's `[:INCLUDES]` set.

More detail in [VERSIONING_SYSTEM.md](VERSIONING_SYSTEM.md).

---

## 3. PostgreSQL schema

Written in Drizzle-style pseudo-SQL. Real migrations live in `/packages/db/migrations`.

### 3.1 Tenancy & identity

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free', -- free | starter | pro | enterprise
  region TEXT NOT NULL DEFAULT 'us',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','editor','reviewer','viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.2 Collaboration

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('concept','relation','diff','commit')),
  target_id TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  parent_id UUID REFERENCES comments(id),
  body TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  target_branch_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open','changes_requested','approved','merged','closed')),
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE review_reviewers (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  decision TEXT CHECK (decision IN ('approved','changes_requested','pending')) DEFAULT 'pending',
  decided_at TIMESTAMPTZ,
  PRIMARY KEY (review_id, user_id)
);
```

### 3.3 Audit & notifications

```sql
CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,            -- e.g. 'commit.created'
  resource_type TEXT NOT NULL,     -- e.g. 'ontology'
  resource_id TEXT NOT NULL,
  ip INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON audit_events (org_id, created_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.4 API keys & webhooks

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  hashed_key TEXT NOT NULL,        -- argon2id
  prefix CHAR(8) NOT NULL,         -- visible prefix for UI
  scopes TEXT[] NOT NULL,
  created_by UUID NOT NULL,
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id BIGSERIAL PRIMARY KEY,
  subscription_id UUID REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  status TEXT NOT NULL,            -- pending | success | failed | dead
  attempts INT NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  response_code INT,
  response_body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.5 Billing

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID UNIQUE NOT NULL REFERENCES organizations(id),
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  seats INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL,           -- active | trialing | past_due | canceled
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  stripe_invoice_id TEXT,
  amount_cents INT,
  currency TEXT DEFAULT 'USD',
  status TEXT,
  issued_at TIMESTAMPTZ
);
```

### 3.6 Row-Level Security (RLS)

Every tenant-scoped table has RLS enabled:

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON comments
  USING (org_id = current_setting('app.current_org_id')::uuid);
```

API handlers set `SET LOCAL app.current_org_id = '<org>';` inside every transaction. RLS is a defence in depth; the API is still the primary authorisation boundary.

---

## 4. Event payloads (Redis Streams + webhooks)

All events share a base envelope:

```json
{
  "id": "evt_01J…",
  "orgId": "org_…",
  "type": "commit.created",
  "createdAt": "2026-05-01T10:12:34.000Z",
  "data": { … type-specific … }
}
```

Event types at v1.0:
- `ontology.created`
- `branch.created` · `branch.deleted` · `branch.merged`
- `commit.created` · `commit.reverted`
- `review.opened` · `review.approved` · `review.merged` · `review.closed`
- `concept.deprecated`
- `member.invited` · `member.role_changed` · `member.removed`

---

## 5. Import/export formats

- **JSON (native).** Export shape mirrors the Neo4j entities listed above. Stable field names.
- **CSV.** Two-files-or-one-zip: `concepts.csv`, `relations.csv`; column contracts documented in the UI and in [API_SPECIFICATION.md](API_SPECIFICATION.md).
- **JSON-LD.** Documented `@context` published at `ontologia.com/schemas/context.jsonld`.

Related: [Architecture](ARCHITECTURE.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Multi-Tenancy](MULTI_TENANCY.md) · [API Specification](API_SPECIFICATION.md)
