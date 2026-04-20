# Data Model

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (MVP scope trimmed)

Complete schema for the two databases powering Ontologia — Neo4j for the graph domain, PostgreSQL for everything relational and for the authoritative change history.

> **MVP scope (v2 of this doc)**: MVP uses an *append-only ChangeEvent log* in Postgres and a materialised current-state view in Neo4j. The commit-graph / branch / review tables described in Section 6 are **deferred** until the branches feature (S1 / S2) ships.

---

## 1. Overview

Each organisation (tenant) has:

- **one tenant-scoped Neo4j database** (Business+) or **a namespace inside a shared database** (Free / Team) holding the current state of that org's ontologies, concepts, and relations.
- **rows in the shared Postgres** for users, orgs, memberships, change events, billing, comments, audits, notifications, API keys, and webhooks.

All Postgres tables carry an `org_id` column enforced via RLS. All Neo4j nodes and relations carry an `orgId` property when on shared Neo4j.

---

## 2. Neo4j schema (MVP — current-state only)

### 2.1 Node labels

```cypher
// Organisation metadata (mirror of Postgres for local joins; optional)
(:Org {id, name, createdAt, plan})

// Ontology containers
(:Ontology {
  id,                 // uuid
  orgId,              // string (tenant)
  name,
  description,
  createdAt, updatedAt,
  createdBy           // userId
})

// Concepts — one node per concept, mutated in place in Neo4j (history lives in Postgres)
(:Concept {
  id,                 // uuid — stable
  orgId, ontologyId,
  name, description,
  status,             // 'draft' | 'validated' | 'deprecated'
  synonyms,           // string[]
  source,
  confidence,         // number 0..1 or null
  properties,         // map (JSON) of custom keys
  lastChangeEventId,  // uuid — pointer into change_event table
  updatedAt
})

// Relation types (schema)
(:RelationType {
  id,
  orgId, ontologyId,
  name,               // e.g. 'is-a', 'part-of'
  label,
  isTransitive,
  isSymmetric,
  isReflexive,
  strict
})

// Typed relations between concepts — realised as a node to carry per-edge metadata
(:ConceptRelation {
  id,
  orgId, ontologyId,
  relationTypeId,
  label, properties,
  lastChangeEventId,
  updatedAt
})

// Tags — named, immutable pointers into the change_event log
(:Tag {
  id,
  orgId, ontologyId,
  name,
  changeEventId,      // uuid — target change event
  createdAt, createdBy
})
```

### 2.2 Relationships

```cypher
// Org → ontologies
(:Org)-[:HAS_ONTOLOGY]->(:Ontology)

// Ontology → concepts / relations / tags
(:Ontology)-[:HAS_CONCEPT]->(:Concept)
(:Ontology)-[:HAS_RELATION_TYPE]->(:RelationType)
(:Ontology)-[:HAS_TAG]->(:Tag)

// Typed relations between concepts
(:Concept)-[:HAS_RELATION]->(:ConceptRelation)-[:TARGETS]->(:Concept)
```

Why realise a relation as a node? To attach per-edge properties cleanly and version them independently via change events.

### 2.3 Indexes & constraints

```cypher
CREATE CONSTRAINT ontology_id IF NOT EXISTS FOR (o:Ontology) REQUIRE o.id IS UNIQUE;
CREATE CONSTRAINT concept_id IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT relation_id IF NOT EXISTS FOR (r:ConceptRelation) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT relation_type_id IF NOT EXISTS FOR (r:RelationType) REQUIRE r.id IS UNIQUE;
CREATE CONSTRAINT tag_id IF NOT EXISTS FOR (t:Tag) REQUIRE t.id IS UNIQUE;

// Lookup by tenant
CREATE INDEX concept_org_ontology IF NOT EXISTS FOR (c:Concept) ON (c.orgId, c.ontologyId);
CREATE INDEX relation_org_ontology IF NOT EXISTS FOR (r:ConceptRelation) ON (r.orgId, r.ontologyId);

// Full-text
CREATE FULLTEXT INDEX concept_fts IF NOT EXISTS FOR (c:Concept) ON EACH [c.name, c.description, c.synonyms];
```

### 2.4 Versioning invariants (MVP)

1. Neo4j holds the **current** state. Edits mutate concept / relation nodes in place, and set `lastChangeEventId` to the id of the change event that produced the current state.
2. The authoritative history lives in Postgres as append-only `change_event` rows — see Section 3.2. Neo4j can be rebuilt from scratch by replaying events.
3. Tags are immutable pointers into the change_event log.
4. Revert is itself a new change event whose diff is the inverse of the target event.

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
  plan TEXT NOT NULL DEFAULT 'free', -- free | team | business | enterprise
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

### 3.2 Change history (MVP)

```sql
CREATE TABLE change_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('concept','relation','ontology','tag')),
  entity_id UUID,
  operation TEXT NOT NULL CHECK (operation IN ('create','update','delete','revert','tag','bulk_import')),
  diff JSONB NOT NULL,
  message TEXT,
  reverts_event_id UUID REFERENCES change_event(id)
);

CREATE INDEX ON change_event (org_id, ontology_id, created_at DESC);
CREATE INDEX ON change_event (org_id, ontology_id, entity_type, entity_id, created_at DESC);

CREATE TABLE tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  name TEXT NOT NULL,
  change_event_id UUID NOT NULL REFERENCES change_event(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (org_id, ontology_id, name)
);
```

### 3.3 Collaboration (MVP — comments only)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  ontology_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('concept','relation','change_event')),
  target_id TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  parent_id UUID REFERENCES comments(id),
  body TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Review requests are deferred; see Section 6.

### 3.4 Audit & notifications

```sql
CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  org_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,            -- e.g. 'change.created'
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

### 3.5 API keys & webhooks

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

### 3.6 Billing (workspace / volume — not per-seat)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID UNIQUE NOT NULL REFERENCES organizations(id),
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,              -- free | team | business | enterprise
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly','annual','enterprise_custom')),
  status TEXT NOT NULL,            -- active | trialing | past_due | canceled
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage counters for plan limits (workspaces, concepts, API calls)
CREATE TABLE usage_counters (
  org_id UUID NOT NULL,
  period_start DATE NOT NULL,      -- first of the billing month
  workspaces INT NOT NULL DEFAULT 0,
  concepts INT NOT NULL DEFAULT 0,
  api_calls BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, period_start)
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

Note: no `seats` column on `subscriptions`. Users are never billed as seats; plan gating is driven by `usage_counters`.

### 3.7 Row-Level Security (RLS)

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
  "type": "change.created",
  "createdAt": "2026-05-01T10:12:34.000Z",
  "data": { }
}
```

Event types at v1.0 (MVP):
- `ontology.created`
- `change.created` — any new entry in `change_event`
- `change.reverted` — a change event with `operation='revert'`
- `tag.created`
- `concept.deprecated`
- `member.invited` · `member.role_changed` · `member.removed`
- `billing.plan_changed` · `billing.usage_threshold`

Deferred (ship with S1 / S2):
- `branch.created` · `branch.deleted` · `branch.merged`
- `review.opened` · `review.approved` · `review.merged` · `review.closed`

---

## 5. Import / export formats

- **JSON (native).** Export shape mirrors the Neo4j entities listed above. Stable field names.
- **CSV.** Two-files-or-one-zip: `concepts.csv`, `relations.csv`; column contracts documented in the UI and in [API_SPECIFICATION.md](API_SPECIFICATION.md).
- **JSON-LD.** Documented `@context` published at `ontologia.com/schemas/context.jsonld`.
- **TTL.** Read-only export in MVP; import in a later release.

---

## 6. Deferred schema — branches and reviews (S1 / S2)

The following Neo4j nodes and Postgres tables are designed and documented but **not shipped in MVP**. They will be added once branches and review requests ship (Phase 4 in [ROADMAP.md](../00_overview/ROADMAP.md)).

### 6.1 Neo4j additions when S1 ships

```cypher
(:Branch {
  id,
  orgId, ontologyId,
  name,
  headCommitId,
  isProtected,
  createdAt, createdBy
})

(:Commit {
  id,
  orgId, ontologyId, branchId,
  message,
  authorId,
  parentCommitId,
  mergeParentId,
  stats: { /* concepts/relations added/modified/deleted */ },
  createdAt
})

// A commit "sees" a set of concept/relation versions
(:Commit)-[:INCLUDES]->(:Concept)
(:Commit)-[:INCLUDES]->(:ConceptRelation)
(:Commit)-[:PARENT]->(:Commit)
(:Commit)-[:MERGED_FROM]->(:Commit)
(:Branch)-[:POINTS_TO]->(:Commit)

// Concept genealogy becomes multi-version
(:Concept)-[:NEXT_VERSION]->(:Concept)
```

### 6.2 Postgres additions when S2 ships

```sql
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

When S1 ships, the `change_event` table stays. Commits become a grouping layer on top: a commit references a set of change events. The MVP log never needs to be migrated.

---

Related: [Architecture](ARCHITECTURE.md) · [Versioning System](VERSIONING_SYSTEM.md) · [Multi-Tenancy](MULTI_TENANCY.md) · [API Specification](API_SPECIFICATION.md)
