# Glossary

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


Shared vocabulary used across product, engineering, design and GTM. Terms are alphabetical. When in doubt, refer here rather than inventing new words.

---

**ACL (Access Control List).** Per-resource permission grant (e.g. "user X can edit ontology Y"). Complements role-based access control.

**Audit log.** Immutable record of every action taken inside a workspace (who, what, when, from where). Exportable on Pro+ plans.

**Branch.** Named pointer to a chain of commits on an ontology. Mirrors Git semantics. Default branch is `main`.

**Canvas.** The interactive graph editor in the main application view.

**Changelog.** Human-readable feed of significant commits, merges and releases, scoped to an ontology or workspace.

**Commit.** An atomic, immutable snapshot of an ontology on a branch. Carries author, timestamp, message and a link to its parent commit.

**Concept.** A node in the graph — a named idea in the user's domain ("Product", "Risk", "Subscription"). Has typed properties, a status and a stable id.

**Conflict (merge conflict).** Two branches modified the same concept or relation divergently. Resolved via a 3-way merge UI.

**Connector.** A first-party integration to an external system (dbt, DataHub, Atlan, webhook).

**Cypher.** Neo4j's declarative query language. Exposed through a read-only console on Pro+.

**Design partner.** An early customer (often free) who co-develops the product with us in exchange for influence and reference status.

**Diff.** A structured comparison between two commits / branches, showing added, modified and deleted concepts and relations.

**Draft.** Uncommitted local changes on a branch. Lives in the browser until the user commits.

**HEAD.** The most recent commit on the currently checked-out branch.

**Inspector.** Right-hand drawer that shows a selected concept's or relation's properties, history and comments.

**Instance.** A concrete occurrence of a concept (distinct from the concept definition itself). Ontologia supports instances in a light form; deep instance management is out of scope.

**is-a.** Canonical hierarchical relation ("Car is-a Vehicle"). First-class in the tree view.

**JSON-LD.** Linked-data serialization format. One of our supported import/export formats.

**Knowledge graph.** A domain model expressed as typed nodes and edges. The artefact an ontology describes.

**Merge.** Integrating changes from one branch into another. Fast-forward where possible, 3-way otherwise.

**Multi-tenant.** Architectural property: many organisations share infrastructure, but each sees only its own data.

**Neo4j.** The native graph database powering the ontology store.

**Ontology.** A structured description of concepts and relations in a domain. In Ontologia, an ontology lives in a workspace and has at least one branch (`main`).

**Organisation (Org).** Billing entity. Holds one or more workspaces, users and subscriptions.

**OWL.** Web Ontology Language. We read a simplified subset on import; we do not perform OWL-DL reasoning.

**PII.** Personally Identifiable Information. Minimised and access-controlled throughout the stack.

**PR (Review Request / conceptual PR).** Proposed set of commits on a branch awaiting review before merging to `main`.

**Property.** A key/value pair attached to a concept or relation (e.g. `definition`, `source`, `confidence`).

**RAG (Retrieval-Augmented Generation).** A common downstream use of ontologies for LLM pipelines.

**Relation.** A typed, directed edge between two concepts (e.g. `is-a`, `part-of`, `has-property`).

**Relation type.** The declared kind of a relation, optionally marked transitive or symmetric. Defined per ontology.

**Revert.** Create a new commit that restores the state of a previous commit. History is never rewritten.

**Role.** Workspace-scoped permission bundle: Owner, Editor, Reviewer, Viewer.

**SCIM.** System for Cross-domain Identity Management. Used for enterprise user provisioning.

**SKOS.** Simple Knowledge Organisation System — RDF vocabulary for thesauri. Partial import support.

**Soft-delete.** Marking a concept `deprecated` rather than physically removing it. Default behaviour.

**SSO.** Single Sign-On (SAML / OIDC). Enterprise-tier.

**Status (of a concept).** Lifecycle flag: `draft`, `validated`, `deprecated`.

**Tenant.** See *Organisation*.

**Tree view.** Collapsible hierarchical view filtered to `is-a` relations.

**Version.** Colloquial term for a commit. Prefer "commit" in engineering contexts.

**Webhook.** Outbound HTTP callback triggered by workspace events (commit, merge, etc.).

**Workspace.** A container for related ontologies inside an organisation. Holds members, roles, billing per-seat counts.

---

See also: [Data Model](../02_architecture/DATA_MODEL.md) for the formal schema, and [API Specification](../02_architecture/API_SPECIFICATION.md) for how these entities appear on the wire.
