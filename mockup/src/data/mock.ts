// Mock data for the Ontologia MVP mockup.
// Everything here is illustrative; no backend is involved.

export type Plan = "free" | "team" | "business" | "enterprise";

export type Workspace = {
  id: string;
  name: string;
  plan: Plan;
  role: "owner" | "editor" | "viewer";
  memberCount: number;
};

export type Ontology = {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  conceptCount: number;
  relationCount: number;
  lastChange: string; // ISO date
  lastAuthor: string;
  tags: string[];
};

export type Concept = {
  id: string;
  name: string;
  description: string;
  // Canvas position
  x: number;
  y: number;
  // Domain fields
  properties: Array<{ key: string; value: string }>;
  lastChangeId: string;
  color?: "violet" | "emerald" | "amber" | "sky" | "rose";
};

export type Relation = {
  id: string;
  from: string; // concept id
  to: string; // concept id
  label: string; // relation type
};

export type ChangeEvent = {
  id: string;
  kind: "create" | "update" | "delete" | "revert" | "tag" | "bulk_import";
  entityKind: "concept" | "relation" | "ontology" | "tag";
  entityId: string;
  entityName: string;
  author: { name: string; initials: string; color: string };
  message?: string;
  at: string; // ISO date-time
  revertsEventId?: string;
  summary: string;
};

export type Tag = {
  id: string;
  name: string;
  changeEventId: string;
  createdBy: string;
  createdAt: string;
};

export const currentUser = {
  id: "u_valentin",
  name: "Valentin Lemort",
  email: "valentin@thinkware.fr",
  initials: "VL",
  color: "#7c56fc",
};

export const workspaces: Workspace[] = [
  {
    id: "ws_thinkware",
    name: "Thinkware",
    plan: "team",
    role: "owner",
    memberCount: 4,
  },
  {
    id: "ws_personal",
    name: "Personal",
    plan: "free",
    role: "owner",
    memberCount: 1,
  },
];

export const activeWorkspaceId = "ws_thinkware";

export const ontologies: Ontology[] = [
  {
    id: "ont_ecom",
    name: "E-commerce catalogue",
    description:
      "Product, category and attribute taxonomy for the retail platform. Source of truth for RAG and search.",
    workspaceId: "ws_thinkware",
    conceptCount: 248,
    relationCount: 612,
    lastChange: "2026-04-19T15:42:00Z",
    lastAuthor: "Valentin Lemort",
    tags: ["v1.2", "2026-Q2"],
  },
  {
    id: "ont_crm",
    name: "Customer domain model",
    description:
      "Accounts, contacts, interactions, lifecycle stages. Used by the sales agent and the analytics warehouse.",
    workspaceId: "ws_thinkware",
    conceptCount: 92,
    relationCount: 184,
    lastChange: "2026-04-17T09:12:00Z",
    lastAuthor: "Alexandre Delplace",
    tags: ["v0.8"],
  },
  {
    id: "ont_knowledge",
    name: "Knowledge base concepts",
    description:
      "Internal documentation taxonomy used by the RAG pipeline for the support agent.",
    workspaceId: "ws_thinkware",
    conceptCount: 57,
    relationCount: 104,
    lastChange: "2026-04-15T17:05:00Z",
    lastAuthor: "Valentin Lemort",
    tags: [],
  },
];

export const concepts: Concept[] = [
  {
    id: "c_product",
    name: "Product",
    description:
      "A sellable item in the catalogue. Always has a SKU, a display name and at least one category.",
    x: 400,
    y: 160,
    color: "violet",
    properties: [
      { key: "sku", value: "string (required, unique)" },
      { key: "name", value: "string (required)" },
      { key: "status", value: "active | draft | archived" },
      { key: "price", value: "money" },
    ],
    lastChangeId: "ce_10",
  },
  {
    id: "c_category",
    name: "Category",
    description:
      "A node in the taxonomy tree. Products belong to one or more categories.",
    x: 80,
    y: 60,
    color: "emerald",
    properties: [
      { key: "slug", value: "string (required, unique)" },
      { key: "name", value: "string (required)" },
      { key: "parent", value: "Category (optional)" },
    ],
    lastChangeId: "ce_02",
  },
  {
    id: "c_brand",
    name: "Brand",
    description:
      "A vendor or manufacturer. Each product has exactly one brand.",
    x: 80,
    y: 280,
    color: "sky",
    properties: [
      { key: "name", value: "string (required)" },
      { key: "country", value: "ISO-3166" },
    ],
    lastChangeId: "ce_03",
  },
  {
    id: "c_attribute",
    name: "Attribute",
    description:
      "A structured property that can be attached to products (size, colour, material…).",
    x: 720,
    y: 60,
    color: "amber",
    properties: [
      { key: "key", value: "string (required)" },
      { key: "valueType", value: "string | enum | number" },
    ],
    lastChangeId: "ce_06",
  },
  {
    id: "c_variant",
    name: "Variant",
    description:
      "A concrete purchasable form of a product (size M, colour blue).",
    x: 720,
    y: 280,
    color: "rose",
    properties: [
      { key: "sku", value: "string (required)" },
      { key: "attributes", value: "Attribute[] (required, >=1)" },
    ],
    lastChangeId: "ce_08",
  },
  {
    id: "c_collection",
    name: "Collection",
    description: "A curated set of products grouped for merchandising.",
    x: 400,
    y: 400,
    color: "emerald",
    properties: [
      { key: "name", value: "string (required)" },
      { key: "season", value: "enum (optional)" },
    ],
    lastChangeId: "ce_09",
  },
];

export const relations: Relation[] = [
  { id: "r_1", from: "c_product", to: "c_category", label: "belongsTo" },
  { id: "r_2", from: "c_product", to: "c_brand", label: "madeBy" },
  { id: "r_3", from: "c_product", to: "c_attribute", label: "hasAttribute" },
  { id: "r_4", from: "c_product", to: "c_variant", label: "hasVariant" },
  { id: "r_5", from: "c_variant", to: "c_attribute", label: "definedBy" },
  { id: "r_6", from: "c_collection", to: "c_product", label: "contains" },
  { id: "r_7", from: "c_category", to: "c_category", label: "parentOf" },
];

export const changeEvents: ChangeEvent[] = [
  {
    id: "ce_12",
    kind: "update",
    entityKind: "concept",
    entityId: "c_product",
    entityName: "Product",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Added `status` field with draft/active/archived enum",
    at: "2026-04-19T15:42:00Z",
    summary: "+1 property, status (enum)",
  },
  {
    id: "ce_11",
    kind: "tag",
    entityKind: "tag",
    entityId: "tag_v1_2",
    entityName: "v1.2",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Released to RAG pipeline — pinned for Q2",
    at: "2026-04-18T10:14:00Z",
    summary: 'Tagged change event ce_10 as "v1.2"',
  },
  {
    id: "ce_10",
    kind: "create",
    entityKind: "relation",
    entityId: "r_6",
    entityName: "Collection → contains → Product",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Collections can now reference products for merchandising",
    at: "2026-04-18T09:31:00Z",
    summary: "New relation: Collection -[contains]-> Product",
  },
  {
    id: "ce_09",
    kind: "create",
    entityKind: "concept",
    entityId: "c_collection",
    entityName: "Collection",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Introducing curated collections for the spring launch",
    at: "2026-04-17T14:02:00Z",
    summary: "New concept with 2 properties",
  },
  {
    id: "ce_08",
    kind: "update",
    entityKind: "concept",
    entityId: "c_variant",
    entityName: "Variant",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Variants must have at least one attribute",
    at: "2026-04-16T11:28:00Z",
    summary: "Updated `attributes` cardinality to >=1",
  },
  {
    id: "ce_07",
    kind: "revert",
    entityKind: "concept",
    entityId: "c_product",
    entityName: "Product",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Reverting — price should stay required on Product",
    at: "2026-04-15T16:00:00Z",
    revertsEventId: "ce_05",
    summary: "Reverted ce_05",
  },
  {
    id: "ce_06",
    kind: "create",
    entityKind: "concept",
    entityId: "c_attribute",
    entityName: "Attribute",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    at: "2026-04-15T10:11:00Z",
    summary: "New concept with 2 properties",
  },
  {
    id: "ce_05",
    kind: "update",
    entityKind: "concept",
    entityId: "c_product",
    entityName: "Product",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Making price optional for draft products",
    at: "2026-04-14T17:45:00Z",
    summary: "Price set to optional",
  },
  {
    id: "ce_04",
    kind: "bulk_import",
    entityKind: "ontology",
    entityId: "ont_ecom",
    entityName: "E-commerce catalogue",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Imported initial taxonomy from the legacy spreadsheet",
    at: "2026-04-12T09:00:00Z",
    summary: "+42 concepts, +118 relations",
  },
  {
    id: "ce_03",
    kind: "create",
    entityKind: "concept",
    entityId: "c_brand",
    entityName: "Brand",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    at: "2026-04-11T14:22:00Z",
    summary: "New concept with 2 properties",
  },
  {
    id: "ce_02",
    kind: "create",
    entityKind: "concept",
    entityId: "c_category",
    entityName: "Category",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    at: "2026-04-11T14:20:00Z",
    summary: "New concept with 3 properties",
  },
  {
    id: "ce_01",
    kind: "create",
    entityKind: "concept",
    entityId: "c_product",
    entityName: "Product",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Seed: the root concept of the catalogue",
    at: "2026-04-11T14:15:00Z",
    summary: "New concept with 4 properties",
  },
];

export const tags: Tag[] = [
  {
    id: "tag_v1_2",
    name: "v1.2",
    changeEventId: "ce_10",
    createdBy: "Valentin Lemort",
    createdAt: "2026-04-18T10:14:00Z",
  },
  {
    id: "tag_2026_q2",
    name: "2026-Q2",
    changeEventId: "ce_09",
    createdBy: "Valentin Lemort",
    createdAt: "2026-04-17T15:00:00Z",
  },
];

// Usage gauges for the plan widget
export const usage = {
  concepts: { used: 397, limit: 5000 },
  apiCalls: { used: 142350, limit: 500000 },
  workspaces: { used: 1, limit: 3 },
  webhooks: { used: 2, limit: 10 },
};

// Members for the settings screen
export const members = [
  {
    name: "Valentin Lemort",
    email: "valentin@thinkware.fr",
    role: "Owner",
    initials: "VL",
    color: "#7c56fc",
    invitedAt: "2026-04-01",
    lastActive: "just now",
  },
  {
    name: "Alexandre Delplace",
    email: "alexandre@thinkware.fr",
    role: "Editor",
    initials: "AD",
    color: "#059669",
    invitedAt: "2026-04-02",
    lastActive: "2 hours ago",
  },
  {
    name: "Marie Dupont",
    email: "marie@thinkware.fr",
    role: "Editor",
    initials: "MD",
    color: "#d97706",
    invitedAt: "2026-04-10",
    lastActive: "yesterday",
  },
  {
    name: "Pierre Martin",
    email: "pierre@thinkware.fr",
    role: "Viewer",
    initials: "PM",
    color: "#0284c7",
    invitedAt: "2026-04-14",
    lastActive: "3 days ago",
  },
];

// API keys for the API settings screen
export const apiKeys = [
  {
    id: "key_prod",
    name: "Production — RAG pipeline",
    prefix: "ont_live_8f2a",
    createdBy: "Alexandre Delplace",
    createdAt: "2026-04-05",
    lastUsed: "5 minutes ago",
    scopes: ["read:ontologies", "read:exports"],
  },
  {
    id: "key_staging",
    name: "Staging — eval runs",
    prefix: "ont_live_2c91",
    createdBy: "Alexandre Delplace",
    createdAt: "2026-04-05",
    lastUsed: "2 hours ago",
    scopes: ["read:ontologies"],
  },
  {
    id: "key_import",
    name: "Import script",
    prefix: "ont_live_7d44",
    createdBy: "Valentin Lemort",
    createdAt: "2026-04-12",
    lastUsed: "2 days ago",
    scopes: ["read:ontologies", "write:imports"],
  },
];
