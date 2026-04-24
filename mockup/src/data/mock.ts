// Mock data for the Ontologia MVP mockup.
// Everything here is illustrative; no backend is involved.
// Structure follows the T-Box / A-Box data model in docs/02_architecture/DATA_MODEL.md v4:
//   - Ontology (T-Box container) HAS_CLASS ConceptClass + HAS_RELATION_TYPE RelationType
//   - Ontology HAS_TAXONOMY ConceptScheme (A-Box container)
//   - ConceptScheme HAS_CONCEPT Concept (each typed via classId)
//   - ConceptRelation links Concepts using a RelationType defined in the parent Ontology.

export type Plan = "free" | "team" | "business" | "enterprise";

export type ArtefactMode = "glossary" | "taxonomy" | "ontology";

// -----------------------------------------------------------------------------
// Multilingual labels (SKOS-aligned)
// -----------------------------------------------------------------------------

// BCP-47-ish language tag. We start with en / fr; Ontology.languages declares
// which tags are enabled for a given artefact.
export type LangTag = "en" | "fr" | "de" | "es" | "ja";

// A language-tagged string (≈ rdf:langString).
export type LangString = { lang: LangTag; value: string };

// Same shape, re-aliased for readability where the text is long-form (definition,
// description, long marketing copy).
export type LangText = LangString;

// SKOS label bag attached to every Concept.
//  - prefLabel   — at most one per language, the canonical display name
//  - altLabel    — many per language, synonyms shown in UIs and search
//  - hiddenLabel — many per language, search-only (misspellings, legacy codes)
export type Labels = {
  prefLabel: LangString[];
  altLabel: LangString[];
  hiddenLabel: LangString[];
};

// Human-readable label for a language tag — used by the UI.
export const LANGUAGE_NAMES: Record<LangTag, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  ja: "日本語",
};

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
  mode: ArtefactMode;
  conceptCount: number;
  relationCount: number;
  classCount: number;
  relationTypeCount: number;
  schemeCount: number;
  lastChange: string; // ISO date
  lastAuthor: string;
  tags: string[];
  // Multilingual config — what languages this artefact is authored in and which
  // one is the fallback when a label / definition is missing a translation.
  languages: LangTag[];
  defaultLanguage: LangTag;
};

// T-Box — class (≈ owl:Class). `isImplicit` means the class was auto-provisioned
// for glossary / taxonomy mode and should stay hidden in UI surfaces unless the
// ontology is switched to ontology mode.
export type ConceptClass = {
  id: string;
  ontologyId: string;
  name: string;
  label: string;
  description?: string;
  parentClassId?: string;
  isImplicit?: boolean;
  color?: "violet" | "emerald" | "amber" | "sky" | "rose" | "ink";
  // Schema for custom attributes carried by every instance of this class.
  // The `localizable` flag is opt-in — flip it on for attributes whose values
  // vary per market (e.g. marketingName, packagingCopy) and off for everything
  // that is market-agnostic (sku, price, status).
  properties?: ClassProperty[];
};

// T-Box — property definition on a ConceptClass.
export type ClassProperty = {
  key: string;
  valueType:
    | "string"
    | "number"
    | "boolean"
    | "enum"
    | "date"
    | "reference"
    | "money";
  required: boolean;
  localizable: boolean;
  description?: string;
  enumValues?: string[];
  hint?: string; // Human-readable value hint (e.g. "string (required, unique)")
};

// T-Box — relation type (≈ owl:ObjectProperty). Domain / range map to
// IS_SUBJECT_OF / IS_TARGET_OF edges in Neo4j.
export type RelationType = {
  id: string;
  ontologyId: string;
  name: string;
  label: string;
  description?: string;
  domainClassId: string;
  rangeClassId: string;
  isTransitive?: boolean;
  isSymmetric?: boolean;
  isReflexive?: boolean;
  strict?: boolean;
  isBuiltIn?: boolean; // broader / narrower in taxonomy mode, etc.
};

// A-Box container (≈ skos:ConceptScheme)
export type ConceptScheme = {
  id: string;
  ontologyId: string;
  name: string;
  description?: string;
  conceptCount: number;
  sourceLanguage?: string;
};

// A-Box instance (≈ skos:Concept). Always typed via classId — for glossary /
// taxonomy mode this will point to the implicit class.
//
// `name` and `description` are the canonical top-level values in the
// ontology's default language. They mirror labels.prefLabel[defaultLang] and
// definitions[defaultLang], and are kept on the struct so that existing read
// surfaces (canvas labels, dashboard rows) keep working without a lookup.
export type Concept = {
  id: string;
  name: string;
  description: string;
  ontologyId: string;
  schemeId: string;
  classId: string;
  // Canvas position
  x: number;
  y: number;
  // SKOS labels — multilingual
  labels: Labels;
  // Definition per language (≈ skos:definition)
  definitions: LangText[];
  // Custom attribute values, shaped according to the ConceptClass schema.
  properties: ConceptPropertyValue[];
  lastChangeId: string;
  color?: "violet" | "emerald" | "amber" | "sky" | "rose";
  // Lifecycle — taxonomy-mode concepts that have been retired from the tree
  // but kept on the graph for referential integrity. Surfaces a strike-through
  // + badge in the tree view.
  deprecated?: boolean;
  // When a concept is deprecated we can (optionally) point at its replacement
  // so downstream consumers auto-follow — mirrors dct:isReplacedBy /
  // skos:exactMatch behaviour. Stored as a concept id within the same
  // workspace.
  replacedBy?: string;
  // Free-text rationale shown next to the deprecated chip. Surfaced in
  // Inspector / ConceptDetail / TaxonomyConceptEditor so other editors
  // understand *why* the term was retired.
  deprecationReason?: string;
};

// A-Box — custom attribute value on a Concept.
//
// If the class property is marked `localizable`, carries `localizedValues` —
// one LangString per language the author has translated into. Otherwise
// carries a single plain `value`.
export type ConceptPropertyValue = {
  key: string;
  value?: string;
  localizedValues?: LangString[];
};

export type Relation = {
  id: string;
  from: string; // concept id
  to: string; // concept id
  schemeId: string;
  relationTypeId: string;
  label: string; // cached from RelationType for render perf
};

// Container-scoped role — carries CAN_WRITE edges to one or more ontologies
// or concept schemes (see DATA_MODEL.md §2.1). The mockup shows a couple of
// realistic defaults per workspace.
export type Role = {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  writeTargets: Array<
    | { type: "ontology"; id: string }
    | { type: "scheme"; id: string }
  >;
  memberInitials: string[];
};

export type ChangeEvent = {
  id: string;
  kind: "create" | "update" | "delete" | "revert" | "tag" | "bulk_import";
  entityKind:
    | "concept"
    | "relation"
    | "ontology"
    | "tag"
    | "concept_class"
    | "relation_type"
    | "scheme";
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
    id: "ont_cars",
    name: "Cars ontology",
    description:
      "Reference ontology for automotive data — manufacturers, models, body styles, powertrains, and the markets they serve. Defines every Class (Manufacturer, Model, BodyStyle, Engine, Transmission, FuelType, DriveType, Segment, Country) and RelationType (manufacturedBy, poweredBy, hasBodyStyle, headquarteredIn, inSegment…) used across the catalogue. Several taxonomies hang off this ontology and reuse its T-Box: the Model catalogue, plus classification trees for body styles, fuel types, market segments, and manufacturing geography.",
    workspaceId: "ws_thinkware",
    mode: "ontology",
    conceptCount: 68,
    relationCount: 112,
    classCount: 9,
    relationTypeCount: 13,
    schemeCount: 5,
    lastChange: "2026-04-20T09:30:00Z",
    lastAuthor: "Valentin Lemort",
    tags: ["v1.2", "2026-Q2"],
    languages: ["en", "fr", "de"],
    defaultLanguage: "en",
  },
];

// -----------------------------------------------------------------------------
// T-Box (schema layer) — ConceptClasses + RelationTypes per ontology
// -----------------------------------------------------------------------------

export const conceptClasses: ConceptClass[] = [
  // --- ont_cars — ontology mode, full T-Box
  {
    id: "cls_manufacturer",
    ontologyId: "ont_cars",
    name: "Manufacturer",
    label: "Manufacturer",
    description:
      "A company that designs and produces vehicles. Owns one or more models and is headquartered in exactly one country.",
    color: "sky",
    properties: [
      {
        key: "legalName",
        valueType: "string",
        required: true,
        localizable: false,
        hint: "string (required)",
      },
      {
        key: "foundedYear",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer",
      },
      {
        key: "website",
        valueType: "string",
        required: false,
        localizable: false,
        hint: "URL",
      },
    ],
  },
  {
    id: "cls_model",
    ontologyId: "ont_cars",
    name: "Model",
    label: "Model",
    description:
      "A specific nameplate produced by a manufacturer (e.g. Toyota Camry, BMW 3 Series). Each Model has a body style, at least one powertrain configuration and a market segment.",
    color: "violet",
    properties: [
      {
        key: "modelYear",
        valueType: "number",
        required: true,
        localizable: false,
        hint: "integer (required)",
      },
      {
        key: "startYear",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer — first production year of this generation",
      },
      {
        key: "msrpUsd",
        valueType: "money",
        required: false,
        localizable: false,
        hint: "USD (manufacturer's suggested retail price)",
      },
      {
        key: "tagline",
        valueType: "string",
        required: false,
        localizable: true,
        hint: "string",
        description:
          "Customer-facing tagline shown on marketing pages. Market-specific — can differ per language.",
      },
    ],
  },
  {
    id: "cls_body_style",
    ontologyId: "ont_cars",
    name: "BodyStyle",
    label: "Body style",
    description:
      "Shape category of a vehicle (Sedan, SUV, Pickup…). Hierarchised by `broader` into the Body style taxonomy.",
    color: "emerald",
    properties: [
      {
        key: "doorCount",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer",
      },
      {
        key: "passengerCapacity",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer",
      },
    ],
  },
  {
    id: "cls_engine",
    ontologyId: "ont_cars",
    name: "Engine",
    label: "Engine",
    description:
      "A specific powertrain configuration — displacement, cylinder layout, or electric motor capacity. Models are poweredBy one or more Engine options.",
    color: "amber",
    properties: [
      {
        key: "displacementL",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "litres (blank for EV)",
      },
      {
        key: "horsepower",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "HP",
      },
      {
        key: "cylinders",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer (blank for EV)",
      },
    ],
  },
  {
    id: "cls_transmission",
    ontologyId: "ont_cars",
    name: "Transmission",
    label: "Transmission",
    description: "Gear mechanism between engine and wheels.",
    color: "rose",
    properties: [
      {
        key: "gearCount",
        valueType: "number",
        required: false,
        localizable: false,
        hint: "integer",
      },
      {
        key: "type",
        valueType: "enum",
        required: true,
        localizable: false,
        enumValues: ["manual", "automatic", "cvt", "dct", "single-speed"],
        hint: "manual | automatic | cvt | dct | single-speed",
      },
    ],
  },
  {
    id: "cls_fuel_type",
    ontologyId: "ont_cars",
    name: "FuelType",
    label: "Fuel type",
    description:
      "Energy source used by the drivetrain. Hierarchised by `broader` into the Fuel type taxonomy.",
    color: "emerald",
    properties: [
      {
        key: "emissionsType",
        valueType: "enum",
        required: false,
        localizable: false,
        enumValues: ["zero-tailpipe", "low", "standard"],
        hint: "zero-tailpipe | low | standard",
      },
    ],
  },
  {
    id: "cls_drive_type",
    ontologyId: "ont_cars",
    name: "DriveType",
    label: "Drive type",
    description: "Which wheels receive power from the powertrain.",
    color: "sky",
    properties: [
      {
        key: "abbreviation",
        valueType: "string",
        required: true,
        localizable: false,
        hint: "FWD | RWD | AWD | 4WD",
      },
    ],
  },
  {
    id: "cls_segment",
    ontologyId: "ont_cars",
    name: "Segment",
    label: "Segment",
    description:
      "Market segment — mirrors the Euro A..F letters + J / S naming. Hierarchised by `broader` into the Market segments taxonomy.",
    color: "violet",
    properties: [
      {
        key: "exampleLength",
        valueType: "string",
        required: false,
        localizable: false,
        hint: "e.g. 4.5–4.9 m",
      },
    ],
  },
  {
    id: "cls_country",
    ontologyId: "ont_cars",
    name: "Country",
    label: "Country",
    description:
      "Sovereign state where a manufacturer is headquartered or where a model is produced. Hierarchised by `broader` into the Manufacturing geography taxonomy.",
    color: "ink",
    properties: [
      {
        key: "isoCode",
        valueType: "string",
        required: false,
        localizable: false,
        hint: "ISO 3166 alpha-2 (e.g. DE, JP)",
      },
    ],
  },
];

export const relationTypes: RelationType[] = [
  // --- Core automotive relations
  {
    id: "rt_manufactured_by",
    ontologyId: "ont_cars",
    name: "manufacturedBy",
    label: "manufactured by",
    description: "A Model is built by exactly one Manufacturer.",
    domainClassId: "cls_model",
    rangeClassId: "cls_manufacturer",
    strict: true,
  },
  {
    id: "rt_headquartered_in",
    ontologyId: "ont_cars",
    name: "headquarteredIn",
    label: "headquartered in",
    description: "A Manufacturer's legal headquarters sits in a Country.",
    domainClassId: "cls_manufacturer",
    rangeClassId: "cls_country",
    strict: true,
  },
  {
    id: "rt_has_body_style",
    ontologyId: "ont_cars",
    name: "hasBodyStyle",
    label: "has body style",
    description: "A Model is built in one body style (Sedan, SUV, …).",
    domainClassId: "cls_model",
    rangeClassId: "cls_body_style",
    strict: true,
  },
  {
    id: "rt_powered_by",
    ontologyId: "ont_cars",
    name: "poweredBy",
    label: "powered by",
    description:
      "A Model is available with one or more Engine options.",
    domainClassId: "cls_model",
    rangeClassId: "cls_engine",
    strict: false,
  },
  {
    id: "rt_uses_fuel",
    ontologyId: "ont_cars",
    name: "usesFuel",
    label: "uses fuel",
    description:
      "A Model runs on one or more fuel types — some nameplates offer both combustion and electric.",
    domainClassId: "cls_model",
    rangeClassId: "cls_fuel_type",
    strict: false,
  },
  {
    id: "rt_has_transmission",
    ontologyId: "ont_cars",
    name: "hasTransmission",
    label: "has transmission",
    description: "A Model is offered with a given Transmission option.",
    domainClassId: "cls_model",
    rangeClassId: "cls_transmission",
    strict: false,
  },
  {
    id: "rt_has_drive",
    ontologyId: "ont_cars",
    name: "hasDrive",
    label: "has drive",
    description:
      "A Model is offered in this DriveType configuration (FWD / RWD / AWD / 4WD).",
    domainClassId: "cls_model",
    rangeClassId: "cls_drive_type",
    strict: false,
  },
  {
    id: "rt_in_segment",
    ontologyId: "ont_cars",
    name: "inSegment",
    label: "in segment",
    description:
      "A Model lives in exactly one market segment (A–F, J, S).",
    domainClassId: "cls_model",
    rangeClassId: "cls_segment",
    strict: true,
  },
  {
    id: "rt_competitor_of",
    ontologyId: "ont_cars",
    name: "competitorOf",
    label: "competitor of",
    description:
      "Two models compete head-to-head in the same segment and price range.",
    domainClassId: "cls_model",
    rangeClassId: "cls_model",
    isSymmetric: true,
  },

  // --- SKOS broader edges, one per hierarchised class. A separate RelationType
  // per class lets us keep domain/range strict in the T-Box while still
  // supporting several independent taxonomy trees inside the same ontology.
  {
    id: "rt_broader_body",
    ontologyId: "ont_cars",
    name: "broader",
    label: "broader (body style)",
    description:
      "skos:broader — a body style has a more general parent (Sedan ⊂ Passenger). Powers the Body style taxonomy.",
    domainClassId: "cls_body_style",
    rangeClassId: "cls_body_style",
    isTransitive: true,
    isBuiltIn: true,
  },
  {
    id: "rt_broader_fuel",
    ontologyId: "ont_cars",
    name: "broader",
    label: "broader (fuel)",
    description:
      "skos:broader — a fuel type rolls up into a family (Gasoline ⊂ Combustion). Powers the Fuel type taxonomy.",
    domainClassId: "cls_fuel_type",
    rangeClassId: "cls_fuel_type",
    isTransitive: true,
    isBuiltIn: true,
  },
  {
    id: "rt_broader_segment",
    ontologyId: "ont_cars",
    name: "broader",
    label: "broader (segment)",
    description:
      "skos:broader — market segments rolled up into super-segments. Powers the Market segments taxonomy.",
    domainClassId: "cls_segment",
    rangeClassId: "cls_segment",
    isTransitive: true,
    isBuiltIn: true,
  },
  {
    id: "rt_broader_country",
    ontologyId: "ont_cars",
    name: "broader",
    label: "broader (country)",
    description:
      "skos:broader — a country rolls up into a continent / manufacturing region. Powers the Manufacturing geography scheme.",
    domainClassId: "cls_country",
    rangeClassId: "cls_country",
    isTransitive: true,
    isBuiltIn: true,
  },
];

// -----------------------------------------------------------------------------
// A-Box (instance layer) — ConceptSchemes + Concepts + Relations
// -----------------------------------------------------------------------------

export const conceptSchemes: ConceptScheme[] = [
  {
    id: "sch_catalogue",
    ontologyId: "ont_cars",
    name: "Model catalogue 2026",
    description:
      "Default scheme for the cars ontology. Holds Manufacturers, Models, Engines, Transmissions and DriveType concepts wired up through the T-Box relations defined above.",
    conceptCount: 34,
    sourceLanguage: "en",
  },
  {
    id: "sch_body_tree",
    ontologyId: "ont_cars",
    name: "Body style taxonomy",
    description:
      "Hierarchical classification of vehicle shapes — Passenger vs Utility, with Sedan/Coupe/Hatchback/… under Passenger and SUV/Pickup/Minivan under Utility. Concepts are typed as `BodyStyle` and hierarchised via `broader`.",
    conceptCount: 13,
    sourceLanguage: "en",
  },
  {
    id: "sch_fuel_tree",
    ontologyId: "ont_cars",
    name: "Fuel type taxonomy",
    description:
      "Drivetrain energy sources grouped by family — Combustion (Gasoline, Diesel), Electric, Hybrid (HEV, PHEV). Concepts typed as `FuelType`.",
    conceptCount: 8,
    sourceLanguage: "en",
  },
  {
    id: "sch_segment_tree",
    ontologyId: "ont_cars",
    name: "Market segments",
    description:
      "Euro-style segment classification (A..F mini → luxury), plus J (SUV) and S (Sports). Used for competitor benchmarking and pricing alignment.",
    conceptCount: 9,
    sourceLanguage: "en",
  },
  {
    id: "sch_geography",
    ontologyId: "ont_cars",
    name: "Manufacturing geography",
    description:
      "Continent → Country hierarchy used to place manufacturer headquarters and production plants. Concepts typed as `Country`.",
    conceptCount: 13,
    sourceLanguage: "en",
  },
];

// -----------------------------------------------------------------------------
// Taxonomy tree seeds (ont_cars)
//
// Each `TreeSeed` is a compact spec for a taxonomy node — enough to materialise
// a real Concept (+ a broader relation to its parent) without writing ~30
// lines per node. The four trees below all live inside the `ont_cars`
// ontology: they reuse its T-Box (BodyStyle / FuelType / Segment / Country
// classes + `broader` relation types) to demonstrate the "one ontology, many
// taxonomies" shape.
// -----------------------------------------------------------------------------
type TreeSeed = {
  id: string;
  en: string;
  fr?: string;
  de?: string;
  altEn?: string[];
  altFr?: string[];
  altDe?: string[];
  defEn?: string;
  defFr?: string;
  defDe?: string;
  deprecated?: boolean;
  children?: TreeSeed[];
};

function expandTree(
  seeds: TreeSeed[],
  schemeId: string,
  ontologyId: string,
  classId: string,
  prefix: string,
  broaderRelationTypeId: string
): { concepts: Concept[]; relations: Relation[] } {
  const conceptsOut: Concept[] = [];
  const relationsOut: Relation[] = [];
  let relCounter = 0;

  function walk(node: TreeSeed, parentId: string | null): void {
    const conceptId = `${prefix}_${node.id}`;
    const altLabel: LangString[] = [
      ...(node.altEn ?? []).map<LangString>((v) => ({ lang: "en", value: v })),
      ...(node.altFr ?? []).map<LangString>((v) => ({ lang: "fr", value: v })),
      ...(node.altDe ?? []).map<LangString>((v) => ({ lang: "de", value: v })),
    ];
    const prefLabel: LangString[] = [{ lang: "en", value: node.en }];
    if (node.fr) prefLabel.push({ lang: "fr", value: node.fr });
    if (node.de) prefLabel.push({ lang: "de", value: node.de });
    const definitions: LangText[] = [];
    if (node.defEn) definitions.push({ lang: "en", value: node.defEn });
    if (node.defFr) definitions.push({ lang: "fr", value: node.defFr });
    if (node.defDe) definitions.push({ lang: "de", value: node.defDe });

    conceptsOut.push({
      id: conceptId,
      name: node.en,
      description: node.defEn ?? "",
      ontologyId,
      schemeId,
      classId,
      x: 0,
      y: 0,
      labels: { prefLabel, altLabel, hiddenLabel: [] },
      definitions,
      properties: [],
      lastChangeId: "ce_t_seed",
      deprecated: node.deprecated,
    });

    if (parentId) {
      relCounter += 1;
      relationsOut.push({
        id: `${prefix}_r_${relCounter}`,
        from: conceptId,
        to: parentId,
        schemeId,
        relationTypeId: broaderRelationTypeId,
        label: "broader",
      });
    }

    node.children?.forEach((child) => walk(child, conceptId));
  }

  seeds.forEach((s) => walk(s, null));
  return { concepts: conceptsOut, relations: relationsOut };
}

// --- Body style taxonomy ------------------------------------------------------
const bodyStyleSeed: TreeSeed[] = [
  {
    id: "vehicle",
    en: "Vehicle",
    fr: "Véhicule",
    defEn: "Root of the body style taxonomy — every shape rolls up here.",
    children: [
      {
        id: "passenger",
        en: "Passenger Vehicle",
        fr: "Véhicule particulier",
        defEn:
          "Cars designed primarily to carry people on paved roads — the bulk of retail volume.",
        children: [
          {
            id: "sedan",
            en: "Sedan",
            fr: "Berline",
            altEn: ["Saloon"],
            defEn:
              "Three-box passenger car with a separate trunk. Four doors; the default body style in most markets.",
          },
          {
            id: "coupe",
            en: "Coupe",
            fr: "Coupé",
            defEn: "Two-door passenger car with a fixed roof and a sporting profile.",
          },
          {
            id: "hatchback",
            en: "Hatchback",
            fr: "Berline compacte à hayon",
            altEn: ["Hatch"],
            defEn:
              "Rear-liftgate passenger car where the cargo area is continuous with the passenger cabin.",
          },
          {
            id: "convertible",
            en: "Convertible",
            fr: "Cabriolet",
            altEn: ["Cabriolet", "Drop-top"],
            defEn: "Passenger car with a roof that can be folded or removed.",
          },
          {
            id: "wagon",
            en: "Wagon",
            fr: "Break",
            altEn: ["Estate"],
            defEn:
              "Sedan variant extended at the rear for additional cargo capacity.",
          },
        ],
      },
      {
        id: "utility",
        en: "Utility Vehicle",
        fr: "Véhicule utilitaire",
        defEn:
          "Higher-riding shapes — larger passenger capacity, cargo bed or off-road credentials.",
        children: [
          {
            id: "suv",
            en: "SUV",
            fr: "SUV",
            altEn: ["Sport Utility Vehicle"],
            defEn:
              "Body-on-frame or unibody utility vehicle with raised ride height. Competes across segments B through E.",
          },
          {
            id: "crossover",
            en: "Crossover",
            fr: "Crossover",
            altEn: ["CUV"],
            defEn:
              "Unibody SUV built on a passenger platform — most modern 'SUVs' are technically crossovers.",
          },
          {
            id: "pickup",
            en: "Pickup Truck",
            fr: "Pick-up",
            altEn: ["Pickup"],
            defEn:
              "Utility vehicle with an open cargo bed at the rear, usually body-on-frame.",
          },
          {
            id: "minivan",
            en: "Minivan",
            fr: "Monospace",
            altEn: ["MPV"],
            defEn:
              "One-box, people-carrier — sliding rear doors, three-row seating.",
          },
        ],
      },
    ],
  },
];

// --- Fuel type taxonomy -------------------------------------------------------
const fuelTypeSeed: TreeSeed[] = [
  {
    id: "fuel_root",
    en: "Fuel type",
    fr: "Type de carburant",
    defEn: "Root of the fuel type taxonomy.",
    children: [
      {
        id: "combustion",
        en: "Combustion",
        fr: "Combustion",
        defEn:
          "Internal combustion engines — emit CO₂ at the tailpipe. Still the majority of new vehicles sold globally.",
        children: [
          {
            id: "gasoline",
            en: "Gasoline",
            fr: "Essence",
            altEn: ["Petrol"],
            defEn:
              "Spark-ignition engine running on gasoline — the default powertrain in most retail markets.",
          },
          {
            id: "diesel",
            en: "Diesel",
            fr: "Diesel",
            defEn:
              "Compression-ignition engine running on diesel fuel. Preferred for towing and long-distance motoring.",
          },
        ],
      },
      {
        id: "electric",
        en: "Electric",
        fr: "Électrique",
        altEn: ["BEV", "Battery Electric"],
        defEn:
          "Fully electric powertrain — energy stored in a battery pack, no tailpipe emissions.",
      },
      {
        id: "hybrid",
        en: "Hybrid",
        fr: "Hybride",
        defEn:
          "Combines a combustion engine with an electric motor + battery.",
        children: [
          {
            id: "hev",
            en: "HEV",
            fr: "Hybride auto-rechargeable",
            altEn: ["Self-charging hybrid", "Full hybrid"],
            defEn:
              "Self-charging hybrid — battery recovers energy during braking; cannot be plugged in.",
          },
          {
            id: "phev",
            en: "PHEV",
            fr: "Hybride rechargeable",
            altEn: ["Plug-in hybrid"],
            defEn:
              "Plug-in hybrid with a larger battery that can be charged from the grid for electric-only driving.",
          },
        ],
      },
    ],
  },
];

// --- Market segments taxonomy -------------------------------------------------
const segmentSeed: TreeSeed[] = [
  {
    id: "a",
    en: "A-segment",
    fr: "Segment A",
    altEn: ["Mini", "City car"],
    defEn: "Mini cars — under ~3.7 m. Fiat 500, Hyundai i10.",
  },
  {
    id: "b",
    en: "B-segment",
    fr: "Segment B",
    altEn: ["Small", "Supermini"],
    defEn: "Small cars — around 4.0 m. Honda Civic (older), VW Polo.",
  },
  {
    id: "c",
    en: "C-segment",
    fr: "Segment C",
    altEn: ["Compact", "Small family"],
    defEn: "Compact family cars — around 4.3–4.6 m. Golf, Focus, 3 Series (entry).",
  },
  {
    id: "d",
    en: "D-segment",
    fr: "Segment D",
    altEn: ["Mid-size", "Large family"],
    defEn: "Mid-size cars — 4.6–4.9 m. Camry, Passat, BMW 3 Series.",
  },
  {
    id: "e",
    en: "E-segment",
    fr: "Segment E",
    altEn: ["Executive"],
    defEn: "Executive cars — 4.9–5.1 m. 5 Series, E-Class, A6.",
  },
  {
    id: "f",
    en: "F-segment",
    fr: "Segment F",
    altEn: ["Luxury", "Full-size luxury"],
    defEn: "Luxury sedans — 7 Series, S-Class.",
  },
  {
    id: "j",
    en: "J-segment",
    fr: "Segment J",
    altEn: ["SUV"],
    defEn: "Catch-all SUV / crossover segment used in European classifications.",
  },
  {
    id: "s",
    en: "S-segment",
    fr: "Segment S",
    altEn: ["Sports"],
    defEn: "Sports cars and performance coupés — 911, GT-R, Corvette.",
  },
  {
    id: "m",
    en: "M-segment",
    fr: "Segment M",
    altEn: ["Multi-purpose"],
    defEn: "Multi-purpose vehicles — minivans, MPVs.",
  },
];

// --- Manufacturing geography taxonomy -----------------------------------------
const geographySeed: TreeSeed[] = [
  {
    id: "europe",
    en: "Europe",
    fr: "Europe",
    de: "Europa",
    defEn:
      "Home of the German big three (BMW, Mercedes, Volkswagen/Porsche/Audi), Volvo, Renault, Stellantis.",
    children: [
      {
        id: "germany",
        en: "Germany",
        fr: "Allemagne",
        de: "Deutschland",
        altEn: ["DE"],
        defEn:
          "Home of BMW (Munich), Volkswagen / Porsche / Audi (Wolfsburg / Stuttgart / Ingolstadt), Mercedes-Benz.",
      },
      { id: "france", en: "France", fr: "France", altEn: ["FR"] },
      {
        id: "sweden",
        en: "Sweden",
        fr: "Suède",
        de: "Schweden",
        altEn: ["SE"],
        defEn: "Home of Volvo Cars (Gothenburg) and Polestar.",
      },
      { id: "italy", en: "Italy", fr: "Italie", altEn: ["IT"] },
      { id: "uk", en: "United Kingdom", fr: "Royaume-Uni", altEn: ["UK", "GB"] },
    ],
  },
  {
    id: "asia",
    en: "Asia",
    fr: "Asie",
    de: "Asien",
    defEn: "Home of Toyota, Honda, Hyundai-Kia, Nissan and the Chinese OEMs.",
    children: [
      {
        id: "japan",
        en: "Japan",
        fr: "Japon",
        de: "Japan",
        altEn: ["JP"],
        defEn: "Home of Toyota (Toyota City), Honda (Tokyo), Nissan, Subaru, Mazda.",
      },
      {
        id: "south_korea",
        en: "South Korea",
        fr: "Corée du Sud",
        de: "Südkorea",
        altEn: ["KR"],
        defEn: "Home of the Hyundai Motor Group (Hyundai, Kia, Genesis).",
      },
    ],
  },
  {
    id: "north_america",
    en: "North America",
    fr: "Amérique du Nord",
    de: "Nordamerika",
    defEn:
      "Home of Ford (Dearborn), General Motors, Stellantis-Americas, Tesla (Austin).",
    children: [
      {
        id: "usa",
        en: "United States",
        fr: "États-Unis",
        de: "USA",
        altEn: ["USA", "US"],
        defEn:
          "Home of Ford, General Motors (Chevrolet, Cadillac, Buick), Tesla, Stellantis North America.",
      },
      { id: "canada", en: "Canada", fr: "Canada", altEn: ["CA"] },
    ],
  },
];

const bodyTreeExp = expandTree(
  bodyStyleSeed,
  "sch_body_tree",
  "ont_cars",
  "cls_body_style",
  "bs",
  "rt_broader_body"
);
const fuelTreeExp = expandTree(
  fuelTypeSeed,
  "sch_fuel_tree",
  "ont_cars",
  "cls_fuel_type",
  "ft",
  "rt_broader_fuel"
);
const segmentTreeExp = expandTree(
  segmentSeed,
  "sch_segment_tree",
  "ont_cars",
  "cls_segment",
  "seg",
  "rt_broader_segment"
);
const geographyExp = expandTree(
  geographySeed,
  "sch_geography",
  "ont_cars",
  "cls_country",
  "geo",
  "rt_broader_country"
);

// -----------------------------------------------------------------------------
// Catalogue — Manufacturers, Models, Engines, Transmissions, DriveTypes.
// Laid out on a rough grid so the canvas has something sensible to show on
// first render (~20 nodes, ~40 relations).
// -----------------------------------------------------------------------------

// Small helpers — keep the seed terse.
const COL = (n: number) => 40 + n * 220;
const ROW = (n: number) => 40 + n * 120;

// Manufacturers (row 0)
const mfrSeed: Array<{
  id: string;
  name: string;
  founded: number;
  website: string;
  country: string; // concept id in the geography scheme
  col: number;
  color?: Concept["color"];
}> = [
  { id: "c_mfr_toyota", name: "Toyota", founded: 1937, website: "toyota.com", country: "geo_japan", col: 0, color: "rose" },
  { id: "c_mfr_honda", name: "Honda", founded: 1948, website: "honda.com", country: "geo_japan", col: 1, color: "rose" },
  { id: "c_mfr_bmw", name: "BMW", founded: 1916, website: "bmw.com", country: "geo_germany", col: 2, color: "sky" },
  { id: "c_mfr_vw", name: "Volkswagen", founded: 1937, website: "vw.com", country: "geo_germany", col: 3, color: "sky" },
  { id: "c_mfr_porsche", name: "Porsche", founded: 1931, website: "porsche.com", country: "geo_germany", col: 4, color: "sky" },
  { id: "c_mfr_ford", name: "Ford", founded: 1903, website: "ford.com", country: "geo_usa", col: 5, color: "amber" },
  { id: "c_mfr_tesla", name: "Tesla", founded: 2003, website: "tesla.com", country: "geo_usa", col: 6, color: "amber" },
  { id: "c_mfr_volvo", name: "Volvo", founded: 1927, website: "volvocars.com", country: "geo_sweden", col: 7, color: "emerald" },
];

// Models — linked to mfr + body style + fuel + engine + segment.
// bs/ft/seg/drive/trans use the expanded tree ids so they line up with the
// broader-tree scheme ids (bs_sedan, ft_gasoline, seg_d, etc.).
const modelSeed: Array<{
  id: string;
  name: string;
  mfrId: string;
  bs: string;
  fuels: string[];
  engines: string[];
  drives: string[];
  transmissions: string[];
  segment: string;
  year: number;
  startYear: number;
  msrp: string;
  taglineEn: string;
  taglineFr: string;
  col: number;
  color?: Concept["color"];
}> = [
  {
    id: "c_model_camry",
    name: "Toyota Camry",
    mfrId: "c_mfr_toyota",
    bs: "bs_sedan",
    fuels: ["ft_gasoline", "ft_hev"],
    engines: ["c_eng_25_hybrid", "c_eng_35_v6"],
    drives: ["c_drive_fwd", "c_drive_awd"],
    transmissions: ["c_trans_8at", "c_trans_cvt"],
    segment: "seg_d",
    year: 2026,
    startYear: 2017,
    msrp: "USD 27,515",
    taglineEn: "Best-selling mid-size sedan in North America.",
    taglineFr: "Berline familiale best-seller en Amérique du Nord.",
    col: 0,
    color: "violet",
  },
  {
    id: "c_model_rav4",
    name: "Toyota RAV4",
    mfrId: "c_mfr_toyota",
    bs: "bs_crossover",
    fuels: ["ft_gasoline", "ft_hev", "ft_phev"],
    engines: ["c_eng_25_hybrid"],
    drives: ["c_drive_fwd", "c_drive_awd"],
    transmissions: ["c_trans_8at"],
    segment: "seg_j",
    year: 2026,
    startYear: 2019,
    msrp: "USD 29,250",
    taglineEn: "Compact crossover, now available as a plug-in hybrid.",
    taglineFr: "SUV compact, désormais proposé en version hybride rechargeable.",
    col: 1,
    color: "violet",
  },
  {
    id: "c_model_civic",
    name: "Honda Civic",
    mfrId: "c_mfr_honda",
    bs: "bs_sedan",
    fuels: ["ft_gasoline", "ft_hev"],
    engines: ["c_eng_20_turbo"],
    drives: ["c_drive_fwd"],
    transmissions: ["c_trans_cvt", "c_trans_manual"],
    segment: "seg_c",
    year: 2026,
    startYear: 2022,
    msrp: "USD 24,950",
    taglineEn: "A compact sedan with segment-leading interior space.",
    taglineFr: "Berline compacte offrant le plus d'espace intérieur de sa catégorie.",
    col: 2,
    color: "violet",
  },
  {
    id: "c_model_bmw_3",
    name: "BMW 3 Series",
    mfrId: "c_mfr_bmw",
    bs: "bs_sedan",
    fuels: ["ft_gasoline", "ft_diesel", "ft_phev"],
    engines: ["c_eng_20_turbo", "c_eng_30_turbo_i6"],
    drives: ["c_drive_rwd", "c_drive_awd"],
    transmissions: ["c_trans_8at"],
    segment: "seg_d",
    year: 2026,
    startYear: 2019,
    msrp: "USD 45,050",
    taglineEn: "The benchmark sports sedan — rear-wheel-drive DNA since 1975.",
    taglineFr: "La berline sportive de référence — ADN propulsion depuis 1975.",
    col: 3,
    color: "violet",
  },
  {
    id: "c_model_bmw_x5",
    name: "BMW X5",
    mfrId: "c_mfr_bmw",
    bs: "bs_suv",
    fuels: ["ft_gasoline", "ft_phev"],
    engines: ["c_eng_30_turbo_i6", "c_eng_50_v8"],
    drives: ["c_drive_awd"],
    transmissions: ["c_trans_8at"],
    segment: "seg_j",
    year: 2026,
    startYear: 2018,
    msrp: "USD 66,900",
    taglineEn: "Mid-size luxury SUV — AWD standard, V8 optional.",
    taglineFr: "SUV de luxe mid-size — transmission intégrale de série, V8 en option.",
    col: 4,
    color: "violet",
  },
  {
    id: "c_model_bmw_i4",
    name: "BMW i4",
    mfrId: "c_mfr_bmw",
    bs: "bs_sedan",
    fuels: ["ft_electric"],
    engines: ["c_eng_ev_84"],
    drives: ["c_drive_rwd", "c_drive_awd"],
    transmissions: ["c_trans_1ev"],
    segment: "seg_d",
    year: 2026,
    startYear: 2022,
    msrp: "USD 52,200",
    taglineEn: "Four-door Gran Coupé, fully electric.",
    taglineFr: "Berline coupé quatre portes, 100 % électrique.",
    col: 5,
    color: "violet",
  },
  {
    id: "c_model_vw_golf",
    name: "Volkswagen Golf",
    mfrId: "c_mfr_vw",
    bs: "bs_hatchback",
    fuels: ["ft_gasoline", "ft_diesel"],
    engines: ["c_eng_20_turbo"],
    drives: ["c_drive_fwd", "c_drive_awd"],
    transmissions: ["c_trans_manual", "c_trans_dct"],
    segment: "seg_c",
    year: 2026,
    startYear: 2019,
    msrp: "EUR 29,480",
    taglineEn: "The definitive hot hatch — eight generations deep.",
    taglineFr: "La référence absolue du segment compact — huit générations.",
    col: 0,
    color: "violet",
  },
  {
    id: "c_model_911",
    name: "Porsche 911",
    mfrId: "c_mfr_porsche",
    bs: "bs_coupe",
    fuels: ["ft_gasoline"],
    engines: ["c_eng_30_turbo_i6"],
    drives: ["c_drive_rwd", "c_drive_awd"],
    transmissions: ["c_trans_dct", "c_trans_manual"],
    segment: "seg_s",
    year: 2026,
    startYear: 2019,
    msrp: "USD 120,900",
    taglineEn: "The sports car blueprint. Rear engine, six cylinders, since 1963.",
    taglineFr: "Le manifeste de la voiture de sport. Moteur arrière six cylindres, depuis 1963.",
    col: 1,
    color: "violet",
  },
  {
    id: "c_model_mustang",
    name: "Ford Mustang",
    mfrId: "c_mfr_ford",
    bs: "bs_coupe",
    fuels: ["ft_gasoline"],
    engines: ["c_eng_50_v8", "c_eng_20_turbo"],
    drives: ["c_drive_rwd"],
    transmissions: ["c_trans_manual", "c_trans_10at"],
    segment: "seg_s",
    year: 2026,
    startYear: 2024,
    msrp: "USD 31,920",
    taglineEn: "The pony car that started a genre.",
    taglineFr: "La pony car qui a inventé un genre.",
    col: 2,
    color: "violet",
  },
  {
    id: "c_model_f150",
    name: "Ford F-150",
    mfrId: "c_mfr_ford",
    bs: "bs_pickup",
    fuels: ["ft_gasoline", "ft_phev", "ft_electric"],
    engines: ["c_eng_50_v8", "c_eng_ev_131"],
    drives: ["c_drive_rwd", "c_drive_4wd"],
    transmissions: ["c_trans_10at"],
    segment: "seg_j",
    year: 2026,
    startYear: 2021,
    msrp: "USD 38,565",
    taglineEn: "America's best-selling truck for 47 years running.",
    taglineFr: "Pick-up le plus vendu aux États-Unis depuis 47 ans.",
    col: 3,
    color: "violet",
  },
  {
    id: "c_model_tesla_3",
    name: "Tesla Model 3",
    mfrId: "c_mfr_tesla",
    bs: "bs_sedan",
    fuels: ["ft_electric"],
    engines: ["c_eng_ev_84"],
    drives: ["c_drive_rwd", "c_drive_awd"],
    transmissions: ["c_trans_1ev"],
    segment: "seg_d",
    year: 2026,
    startYear: 2023,
    msrp: "USD 42,490",
    taglineEn: "The mainstream electric sedan — software-defined, over the air.",
    taglineFr: "La berline électrique grand public — logicielle, mise à jour OTA.",
    col: 4,
    color: "violet",
  },
  {
    id: "c_model_tesla_y",
    name: "Tesla Model Y",
    mfrId: "c_mfr_tesla",
    bs: "bs_crossover",
    fuels: ["ft_electric"],
    engines: ["c_eng_ev_84", "c_eng_ev_131"],
    drives: ["c_drive_rwd", "c_drive_awd"],
    transmissions: ["c_trans_1ev"],
    segment: "seg_j",
    year: 2026,
    startYear: 2020,
    msrp: "USD 47,490",
    taglineEn: "Best-selling vehicle in the world, 2023 — fully electric crossover.",
    taglineFr: "Véhicule le plus vendu au monde en 2023 — crossover 100 % électrique.",
    col: 5,
    color: "violet",
  },
  {
    id: "c_model_xc90",
    name: "Volvo XC90",
    mfrId: "c_mfr_volvo",
    bs: "bs_suv",
    fuels: ["ft_gasoline", "ft_phev"],
    engines: ["c_eng_20_turbo"],
    drives: ["c_drive_awd"],
    transmissions: ["c_trans_8at"],
    segment: "seg_j",
    year: 2026,
    startYear: 2015,
    msrp: "USD 58,695",
    taglineEn: "Three-row luxury SUV with Scandinavian restraint.",
    taglineFr: "SUV de luxe trois rangées — sobriété scandinave.",
    col: 6,
    color: "violet",
  },
];

// Engines
const engineSeed: Array<{
  id: string;
  name: string;
  displacement?: number;
  hp: number;
  cyl?: number;
  defEn: string;
  col: number;
}> = [
  {
    id: "c_eng_25_hybrid",
    name: "2.5L I4 Hybrid",
    displacement: 2.5,
    hp: 219,
    cyl: 4,
    defEn: "Atkinson-cycle 2.5-litre inline-four paired with an electric motor.",
    col: 0,
  },
  {
    id: "c_eng_35_v6",
    name: "3.5L V6",
    displacement: 3.5,
    hp: 301,
    cyl: 6,
    defEn: "Naturally aspirated 3.5-litre V6.",
    col: 1,
  },
  {
    id: "c_eng_20_turbo",
    name: "2.0L Turbo I4",
    displacement: 2.0,
    hp: 255,
    cyl: 4,
    defEn: "Turbocharged 2.0-litre inline-four — the default compact workhorse.",
    col: 2,
  },
  {
    id: "c_eng_30_turbo_i6",
    name: "3.0L Turbo I6",
    displacement: 3.0,
    hp: 382,
    cyl: 6,
    defEn: "Twin-scroll turbocharged 3.0-litre inline-six. BMW's signature powerplant.",
    col: 3,
  },
  {
    id: "c_eng_50_v8",
    name: "5.0L V8",
    displacement: 5.0,
    hp: 480,
    cyl: 8,
    defEn: "Naturally aspirated 5-litre V8 — classic American muscle.",
    col: 4,
  },
  {
    id: "c_eng_ev_84",
    name: "Electric 84 kWh",
    hp: 335,
    defEn: "Dual-motor electric drivetrain with an 84 kWh usable battery.",
    col: 5,
  },
  {
    id: "c_eng_ev_131",
    name: "Electric 131 kWh",
    hp: 580,
    defEn: "Long-range dual-motor electric drivetrain — ~450 mi EPA range.",
    col: 6,
  },
];

// Transmissions
const transSeed: Array<{
  id: string;
  name: string;
  gears: number;
  type: string;
  col: number;
}> = [
  { id: "c_trans_8at", name: "8-speed Automatic", gears: 8, type: "automatic", col: 0 },
  { id: "c_trans_10at", name: "10-speed Automatic", gears: 10, type: "automatic", col: 1 },
  { id: "c_trans_manual", name: "Manual 6-speed", gears: 6, type: "manual", col: 2 },
  { id: "c_trans_cvt", name: "CVT", gears: 1, type: "cvt", col: 3 },
  { id: "c_trans_dct", name: "DCT 7-speed", gears: 7, type: "dct", col: 4 },
  { id: "c_trans_1ev", name: "Single-speed (EV)", gears: 1, type: "single-speed", col: 5 },
];

// Drive types
const driveSeed: Array<{
  id: string;
  name: string;
  abbr: string;
  defEn: string;
  col: number;
}> = [
  { id: "c_drive_fwd", name: "Front-wheel drive", abbr: "FWD", defEn: "Engine drives the front wheels. Cheapest, most space-efficient.", col: 0 },
  { id: "c_drive_rwd", name: "Rear-wheel drive", abbr: "RWD", defEn: "Engine drives the rear wheels. Preferred for sports cars.", col: 1 },
  { id: "c_drive_awd", name: "All-wheel drive", abbr: "AWD", defEn: "Power split between all four wheels, usually on-demand.", col: 2 },
  { id: "c_drive_4wd", name: "Four-wheel drive", abbr: "4WD", defEn: "Mechanical 4WD with low-range transfer case — body-on-frame trucks / off-roaders.", col: 3 },
];

// Build concepts for each of the above seeds.
const manufacturerConcepts: Concept[] = mfrSeed.map((m) => ({
  id: m.id,
  name: m.name,
  description: `${m.name} — ${m.country.replace(/^geo_/, "")} automaker, founded ${m.founded}.`,
  ontologyId: "ont_cars",
  schemeId: "sch_catalogue",
  classId: "cls_manufacturer",
  x: COL(m.col),
  y: ROW(0),
  color: m.color,
  labels: {
    prefLabel: [{ lang: "en", value: m.name }],
    altLabel: [],
    hiddenLabel: [],
  },
  definitions: [
    {
      lang: "en",
      value: `${m.name} is an automobile manufacturer founded in ${m.founded}, headquartered in ${m.country.replace(/^geo_/, "")}.`,
    },
  ],
  properties: [
    { key: "legalName", value: m.name },
    { key: "foundedYear", value: String(m.founded) },
    { key: "website", value: `https://www.${m.website}` },
  ],
  lastChangeId: "ce_t_seed",
}));

const modelConcepts: Concept[] = modelSeed.map((m, idx) => ({
  id: m.id,
  name: m.name,
  description: m.taglineEn,
  ontologyId: "ont_cars",
  schemeId: "sch_catalogue",
  classId: "cls_model",
  x: COL(m.col),
  y: ROW(1 + Math.floor(idx / 6)), // two rows of models to keep the layout readable
  color: m.color,
  labels: {
    prefLabel: [{ lang: "en", value: m.name }],
    altLabel: [],
    hiddenLabel: [],
  },
  definitions: [
    { lang: "en", value: m.taglineEn },
    { lang: "fr", value: m.taglineFr },
  ],
  properties: [
    { key: "modelYear", value: String(m.year) },
    { key: "startYear", value: String(m.startYear) },
    { key: "msrpUsd", value: m.msrp },
    {
      key: "tagline",
      localizedValues: [
        { lang: "en", value: m.taglineEn },
        { lang: "fr", value: m.taglineFr },
      ],
    },
  ],
  lastChangeId: "ce_t_seed",
}));

const engineConcepts: Concept[] = engineSeed.map((e) => ({
  id: e.id,
  name: e.name,
  description: e.defEn,
  ontologyId: "ont_cars",
  schemeId: "sch_catalogue",
  classId: "cls_engine",
  x: COL(e.col),
  y: ROW(3),
  color: "amber",
  labels: {
    prefLabel: [{ lang: "en", value: e.name }],
    altLabel: [],
    hiddenLabel: [],
  },
  definitions: [{ lang: "en", value: e.defEn }],
  properties: [
    ...(e.displacement !== undefined
      ? [{ key: "displacementL", value: String(e.displacement) }]
      : []),
    { key: "horsepower", value: String(e.hp) },
    ...(e.cyl !== undefined ? [{ key: "cylinders", value: String(e.cyl) }] : []),
  ],
  lastChangeId: "ce_t_seed",
}));

const transmissionConcepts: Concept[] = transSeed.map((t) => ({
  id: t.id,
  name: t.name,
  description: `${t.name} — ${t.type}.`,
  ontologyId: "ont_cars",
  schemeId: "sch_catalogue",
  classId: "cls_transmission",
  x: COL(t.col),
  y: ROW(4),
  color: "rose",
  labels: {
    prefLabel: [{ lang: "en", value: t.name }],
    altLabel: [],
    hiddenLabel: [],
  },
  definitions: [{ lang: "en", value: `${t.name} — ${t.type}.` }],
  properties: [
    { key: "gearCount", value: String(t.gears) },
    { key: "type", value: t.type },
  ],
  lastChangeId: "ce_t_seed",
}));

const driveConcepts: Concept[] = driveSeed.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.defEn,
  ontologyId: "ont_cars",
  schemeId: "sch_catalogue",
  classId: "cls_drive_type",
  x: COL(d.col),
  y: ROW(5),
  color: "sky",
  labels: {
    prefLabel: [{ lang: "en", value: d.name }],
    altLabel: [{ lang: "en", value: d.abbr }],
    hiddenLabel: [],
  },
  definitions: [{ lang: "en", value: d.defEn }],
  properties: [{ key: "abbreviation", value: d.abbr }],
  lastChangeId: "ce_t_seed",
}));

export const concepts: Concept[] = [
  ...manufacturerConcepts,
  ...modelConcepts,
  ...engineConcepts,
  ...transmissionConcepts,
  ...driveConcepts,
  // Taxonomy concepts — expanded from the four tree seeds above.
  ...bodyTreeExp.concepts,
  ...fuelTreeExp.concepts,
  ...segmentTreeExp.concepts,
  ...geographyExp.concepts,
];

// -----------------------------------------------------------------------------
// Relations — wire up every model against its manufacturer, body style, fuels,
// engines, drives, transmissions, segment. Plus manufacturer → country.
// -----------------------------------------------------------------------------

let _relCounter = 0;
const rid = () => `r_cat_${++_relCounter}`;

const manufacturerRelations: Relation[] = mfrSeed.map((m) => ({
  id: rid(),
  from: m.id,
  to: m.country,
  schemeId: "sch_catalogue",
  relationTypeId: "rt_headquartered_in",
  label: "headquartered in",
}));

const modelRelations: Relation[] = modelSeed.flatMap((m) => {
  const out: Relation[] = [];
  out.push({
    id: rid(),
    from: m.id,
    to: m.mfrId,
    schemeId: "sch_catalogue",
    relationTypeId: "rt_manufactured_by",
    label: "manufactured by",
  });
  out.push({
    id: rid(),
    from: m.id,
    to: m.bs,
    schemeId: "sch_catalogue",
    relationTypeId: "rt_has_body_style",
    label: "has body style",
  });
  out.push({
    id: rid(),
    from: m.id,
    to: m.segment,
    schemeId: "sch_catalogue",
    relationTypeId: "rt_in_segment",
    label: "in segment",
  });
  m.fuels.forEach((f) =>
    out.push({
      id: rid(),
      from: m.id,
      to: f,
      schemeId: "sch_catalogue",
      relationTypeId: "rt_uses_fuel",
      label: "uses fuel",
    })
  );
  m.engines.forEach((e) =>
    out.push({
      id: rid(),
      from: m.id,
      to: e,
      schemeId: "sch_catalogue",
      relationTypeId: "rt_powered_by",
      label: "powered by",
    })
  );
  m.drives.forEach((d) =>
    out.push({
      id: rid(),
      from: m.id,
      to: d,
      schemeId: "sch_catalogue",
      relationTypeId: "rt_has_drive",
      label: "has drive",
    })
  );
  m.transmissions.forEach((t) =>
    out.push({
      id: rid(),
      from: m.id,
      to: t,
      schemeId: "sch_catalogue",
      relationTypeId: "rt_has_transmission",
      label: "has transmission",
    })
  );
  return out;
});

// A handful of competitor edges — seeds the symmetric competitorOf relation
// so the canvas has some intra-model structure visible too.
const competitorRelations: Relation[] = [
  { from: "c_model_camry", to: "c_model_civic" },
  { from: "c_model_camry", to: "c_model_bmw_3" },
  { from: "c_model_bmw_3", to: "c_model_tesla_3" },
  { from: "c_model_rav4", to: "c_model_tesla_y" },
  { from: "c_model_bmw_x5", to: "c_model_xc90" },
  { from: "c_model_911", to: "c_model_mustang" },
].map(({ from, to }) => ({
  id: rid(),
  from,
  to,
  schemeId: "sch_catalogue",
  relationTypeId: "rt_competitor_of",
  label: "competitor of",
}));

export const relations: Relation[] = [
  ...manufacturerRelations,
  ...modelRelations,
  ...competitorRelations,
  // Taxonomy broader edges — one per parent link in each of the four trees.
  ...bodyTreeExp.relations,
  ...fuelTreeExp.relations,
  ...segmentTreeExp.relations,
  ...geographyExp.relations,
];

export const roles: Role[] = [
  {
    id: "role_ontology_editor",
    workspaceId: "ws_thinkware",
    name: "Ontology Editor",
    description:
      "Can edit the T-Box (classes, relation types) and A-Box of the cars ontology.",
    writeTargets: [{ type: "ontology", id: "ont_cars" }],
    memberInitials: ["VL", "AD"],
  },
  {
    id: "role_catalogue_editor",
    workspaceId: "ws_thinkware",
    name: "Catalogue Editor",
    description:
      "Can edit the A-Box (manufacturers, models and their relations) inside the Model catalogue scheme, but cannot change the ontology's schema.",
    writeTargets: [{ type: "scheme", id: "sch_catalogue" }],
    memberInitials: ["MD"],
  },
  {
    id: "role_taxonomy_curator",
    workspaceId: "ws_thinkware",
    name: "Taxonomy Curator",
    description:
      "Can edit body style, fuel type and market segment taxonomies — SKOS broader / narrower only, no T-Box access.",
    writeTargets: [
      { type: "scheme", id: "sch_body_tree" },
      { type: "scheme", id: "sch_fuel_tree" },
      { type: "scheme", id: "sch_segment_tree" },
    ],
    memberInitials: ["MD"],
  },
];

export const changeEvents: ChangeEvent[] = [
  {
    id: "ce_t_seed",
    kind: "bulk_import",
    entityKind: "ontology",
    entityId: "ont_cars",
    entityName: "Cars ontology",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message:
      "Imported the T-Box and model catalogue from the Cars Reference Dataset v3 — 9 classes, 13 relation types, 5 schemes, ~60 concepts with en/fr/de labels.",
    at: "2026-04-20T09:30:00Z",
    summary:
      "+9 classes, +13 relation types, +5 schemes, ~60 concepts, en/fr/de labels",
  },
  {
    id: "ce_12",
    kind: "update",
    entityKind: "concept",
    entityId: "c_model_tesla_3",
    entityName: "Tesla Model 3",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "2026 refresh — new 84 kWh pack now the base battery",
    at: "2026-04-19T15:42:00Z",
    summary: "Updated poweredBy → Electric 84 kWh",
  },
  {
    id: "ce_11",
    kind: "tag",
    entityKind: "tag",
    entityId: "tag_v1_2",
    entityName: "v1.2",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Pinned for the 2026-Q2 launch",
    at: "2026-04-18T10:14:00Z",
    summary: 'Tagged change event ce_10 as "v1.2"',
  },
  {
    id: "ce_10",
    kind: "create",
    entityKind: "relation_type",
    entityId: "rt_competitor_of",
    entityName: "competitorOf (Model → Model)",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Symmetric head-to-head pointer for pricing / positioning",
    at: "2026-04-18T09:31:00Z",
    summary: "New RelationType competitorOf, symmetric",
  },
  {
    id: "ce_09",
    kind: "create",
    entityKind: "concept",
    entityId: "c_model_bmw_i4",
    entityName: "BMW i4",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "2022+ electric Gran Coupé — competes with Tesla Model 3",
    at: "2026-04-17T14:02:00Z",
    summary: "New concept (class: Model) with 4 properties",
  },
  {
    id: "ce_08b",
    kind: "create",
    entityKind: "relation_type",
    entityId: "rt_has_drive",
    entityName: "hasDrive (Model → DriveType)",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Formalised drive-layout as a first-class relation",
    at: "2026-04-16T17:10:00Z",
    summary: "New RelationType hasDrive, domain Model, range DriveType",
  },
  {
    id: "ce_08",
    kind: "update",
    entityKind: "concept",
    entityId: "c_model_f150",
    entityName: "Ford F-150",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Added electric F-150 Lightning option — poweredBy Electric 131 kWh",
    at: "2026-04-16T11:28:00Z",
    summary: "+1 poweredBy edge, +1 usesFuel edge (Electric)",
  },
  {
    id: "ce_07",
    kind: "revert",
    entityKind: "concept",
    entityId: "c_model_911",
    entityName: "Porsche 911",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Reverting — the 911 is still available with a 7-speed manual",
    at: "2026-04-15T16:00:00Z",
    revertsEventId: "ce_05",
    summary: "Reverted ce_05",
  },
  {
    id: "ce_06b",
    kind: "create",
    entityKind: "concept_class",
    entityId: "cls_drive_type",
    entityName: "DriveType",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Split out DriveType so it can appear as range of hasDrive",
    at: "2026-04-15T10:08:00Z",
    summary: "New ConceptClass DriveType",
  },
  {
    id: "ce_06",
    kind: "create",
    entityKind: "concept",
    entityId: "c_model_xc90",
    entityName: "Volvo XC90",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    at: "2026-04-15T10:11:00Z",
    summary: "New concept (class: Model) with 4 properties",
  },
  {
    id: "ce_05",
    kind: "update",
    entityKind: "concept",
    entityId: "c_model_911",
    entityName: "Porsche 911",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    message: "Dropping manual transmission — latest gen is PDK-only",
    at: "2026-04-14T17:45:00Z",
    summary: "Removed hasTransmission → Manual 6-speed",
  },
  {
    id: "ce_04",
    kind: "bulk_import",
    entityKind: "ontology",
    entityId: "ont_cars",
    entityName: "Cars ontology",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Imported initial manufacturer + model list from the 2025 dataset",
    at: "2026-04-12T09:00:00Z",
    summary: "+8 manufacturers, +13 models, +7 engines, ~40 relations",
  },
  {
    id: "ce_03",
    kind: "create",
    entityKind: "concept",
    entityId: "c_mfr_tesla",
    entityName: "Tesla",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    at: "2026-04-11T14:22:00Z",
    summary: "New concept (class: Manufacturer) with 3 properties",
  },
  {
    id: "ce_02",
    kind: "create",
    entityKind: "concept",
    entityId: "c_mfr_bmw",
    entityName: "BMW",
    author: { name: "Alexandre Delplace", initials: "AD", color: "#059669" },
    at: "2026-04-11T14:20:00Z",
    summary: "New concept (class: Manufacturer) with 3 properties",
  },
  {
    id: "ce_01",
    kind: "create",
    entityKind: "concept",
    entityId: "c_mfr_toyota",
    entityName: "Toyota",
    author: { name: "Valentin Lemort", initials: "VL", color: "#7c56fc" },
    message: "Seed: the first manufacturer in the catalogue",
    at: "2026-04-11T14:15:00Z",
    summary: "New concept (class: Manufacturer) with 3 properties",
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

// -----------------------------------------------------------------------------
// Helpers — multilingual lookups used across the UI
// -----------------------------------------------------------------------------

/** Pick the best LangString-like entry for `preferred`, falling back to
 *  `fallback` and then to the first entry in the bag. Returns undefined if the
 *  bag is empty. */
export function pickLang<T extends { lang: LangTag }>(
  bag: T[],
  preferred: LangTag,
  fallback?: LangTag
): T | undefined {
  if (bag.length === 0) return undefined;
  const hit = bag.find((x) => x.lang === preferred);
  if (hit) return hit;
  if (fallback) {
    const fb = bag.find((x) => x.lang === fallback);
    if (fb) return fb;
  }
  return bag[0];
}

/** Extract a human-readable string for a property value, honouring the
 *  preferred language if the property carries localizedValues. */
export function displayPropertyValue(
  p: ConceptPropertyValue,
  preferred: LangTag = "en",
  fallback?: LangTag
): string {
  if (p.value !== undefined) return p.value;
  if (p.localizedValues && p.localizedValues.length > 0) {
    return pickLang(p.localizedValues, preferred, fallback)?.value ?? "";
  }
  return "";
}

/** Whether a given property value carries per-language translations. */
export function isLocalizedValue(p: ConceptPropertyValue): boolean {
  return !!p.localizedValues && p.localizedValues.length > 0;
}

/** Return the preferred label for a concept in a given language. Falls back to
 *  `fallback`, then to the canonical `concept.name` (authored in the ontology's
 *  default language). */
export function conceptDisplayName(
  concept: Concept,
  preferred: LangTag,
  fallback?: LangTag
): string {
  return (
    pickLang(concept.labels.prefLabel, preferred, fallback)?.value ??
    concept.name
  );
}

/** Return the definition for a concept in a given language, falling back to
 *  `fallback` and then to `concept.description`. */
export function conceptDefinition(
  concept: Concept,
  preferred: LangTag,
  fallback?: LangTag
): string {
  return (
    pickLang(concept.definitions, preferred, fallback)?.value ??
    concept.description
  );
}

// API keys for the API settings screen
export const apiKeys = [
  {
    id: "key_prod",
    name: "Production — RAG pipeline",
    prefix: "ont_live_8f2a",
    createdBy: "Alexandre Delplace",
    createdAt: "2026-04-05",
    lastUsed: "5 minutes ago",
    scopes: ["read:ontology"],
  },
  {
    id: "key_staging",
    name: "Staging — eval runs",
    prefix: "ont_live_2c91",
    createdBy: "Alexandre Delplace",
    createdAt: "2026-04-05",
    lastUsed: "2 hours ago",
    scopes: ["read:ontology"],
  },
  {
    id: "key_taxonomy_bot",
    name: "Taxonomy sync bot",
    prefix: "ont_live_7d44",
    createdBy: "Valentin Lemort",
    createdAt: "2026-04-12",
    lastUsed: "2 days ago",
    scopes: ["read:ontology", "write:instance"],
  },
];
