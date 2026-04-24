import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";
import { useApp } from "../app/AppContext";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import clsx from "clsx";
import {
  Circle,
  Plus,
  Tag as TagIcon,
  History,
  Download,
  Search,
  MousePointer2,
  Link2,
  GripVertical,
  Play,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Undo2,
  Copy,
  Trash2,
  PanelRight,
  Pencil,
  RefreshCw,
  GitCommit,
  Layers,
  ListTree,
  Filter,
  FileDown,
  MoreHorizontal,
  CornerDownRight,
  ShieldCheck,
  GitCompare,
} from "lucide-react";
import ConceptNode from "../components/ConceptNode";
import ClassNode from "../components/ClassNode";
import ClassAttributesEditor from "../components/ClassAttributesEditor";
import ClassInspector from "../components/ClassInspector";
import ConceptDetail from "./ConceptDetail";
import Modal from "../components/Modal";
import ValidationPanel from "../components/ValidationPanel";
import TagDiffModal from "../components/TagDiffModal";
import {
  PresenceAvatars,
  PresenceEditingBanner,
} from "../components/PresenceOverlay";
import {
  concepts as allConcepts,
  relations as allRelations,
  changeEvents,
  ontologies,
  tags,
  conceptClasses as allConceptClasses,
  relationTypes as allRelationTypes,
  conceptSchemes as allSchemes,
  displayPropertyValue,
  type ArtefactMode,
  type Concept,
  type ConceptClass,
} from "../data/mock";

type RightPanel = "inspector" | "history" | "validation";
type EditorView = "canvas" | "tree" | "table" | "schema";

// -----------------------------------------------------------------------------
// Mode → what to show
// -----------------------------------------------------------------------------

const MODE_META: Record<
  ArtefactMode,
  {
    label: string;
    tagline: string;
    accent: string;
    ring: string;
    showSchemaTab: boolean;
    schemaTabReadOnly: boolean;
    defaultView: EditorView;
  }
> = {
  glossary: {
    label: "Glossary",
    tagline: "One class · synonym / seeAlso relations",
    accent: "bg-violet-100 text-violet-700",
    ring: "ring-violet-500",
    showSchemaTab: false,
    schemaTabReadOnly: true,
    defaultView: "table",
  },
  taxonomy: {
    label: "Taxonomy",
    tagline: "One class · broader / narrower",
    accent: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-500",
    showSchemaTab: true,
    schemaTabReadOnly: true,
    defaultView: "tree",
  },
  ontology: {
    label: "Ontology",
    tagline: "Full T-Box · classes + typed relations",
    accent: "bg-sky-100 text-sky-700",
    ring: "ring-sky-500",
    showSchemaTab: true,
    schemaTabReadOnly: false,
    defaultView: "canvas",
  },
};

const CLASS_SWATCH: Record<NonNullable<ConceptClass["color"]>, string> = {
  violet: "bg-violet-100 text-violet-700 ring-violet-300",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-300",
  amber: "bg-amber-100 text-amber-700 ring-amber-300",
  sky: "bg-sky-100 text-sky-700 ring-sky-300",
  rose: "bg-rose-100 text-rose-700 ring-rose-300",
  ink: "bg-ink-100 text-ink-700 ring-ink-300",
};

// Solid dot variants of the same palette, used in the canvas legend so that
// the swatch has enough contrast to read at 8px.
const CLASS_DOT: Record<NonNullable<ConceptClass["color"]>, string> = {
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  ink: "bg-ink-500",
};

// Small helper — safe lookup of a class swatch.
function classSwatch(c?: ConceptClass) {
  return c?.color ? CLASS_SWATCH[c.color] : CLASS_SWATCH.ink;
}

// -----------------------------------------------------------------------------
// SchemaView — T-Box visualiser
// -----------------------------------------------------------------------------

function SchemaView({
  ontologyId,
  mode,
  conceptCountByClass,
  onDismiss,
}: {
  ontologyId: string;
  mode: ArtefactMode;
  conceptCountByClass: Record<string, number>;
  onDismiss: () => void;
}) {
  const {
    tick,
    addConceptClass,
    deleteConceptClass,
    addRelationType,
    deleteRelationType,
    toast,
  } = useApp();
  void tick;
  const classes = allConceptClasses.filter((c) => c.ontologyId === ontologyId);
  const relTypes = allRelationTypes.filter((r) => r.ontologyId === ontologyId);
  const meta = MODE_META[mode];
  const readOnly = meta.schemaTabReadOnly;
  // Local UI state — which inline form is open. We keep these as simple
  // booleans rather than spinning up a whole modal because the schema view
  // has plenty of vertical room to drop a form in-flow.
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [relFormOpen, setRelFormOpen] = useState(false);
  // Which class is expanded with its full attribute editor? Accordion-style:
  // only one expanded at a time so the page doesn't turn into a stack of
  // long forms. Clicking the same row again closes it.
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const classById = useMemo(
    () => Object.fromEntries(classes.map((c) => [c.id, c])) as Record<string, ConceptClass>,
    [classes]
  );

  function handleDeleteClass(id: string, name: string) {
    const event = deleteConceptClass(id);
    if (!event) {
      toast({
        kind: "error",
        title: `Can't remove "${name}"`,
        description:
          "Concepts still reference this class. Move them first or pick a different class.",
      });
      return;
    }
    toast({
      kind: "success",
      title: `Removed class "${name}"`,
    });
  }

  function handleDeleteRelType(id: string, name: string, isBuiltIn?: boolean) {
    if (isBuiltIn) {
      toast({
        kind: "info",
        title: `"${name}" is built-in`,
        description: "Built-in relation types can't be removed.",
      });
      return;
    }
    const event = deleteRelationType(id);
    if (!event) {
      toast({
        kind: "error",
        title: `Can't remove "${name}"`,
        description: "Relations still use this type. Delete them first.",
      });
      return;
    }
    toast({
      kind: "success",
      title: `Removed relation type "${name}"`,
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header strip */}
      <div className="flex shrink-0 items-center gap-3 border-b border-ink-200 bg-white px-5 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-ink-900 to-ink-700 text-white">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            Schema (T-Box)
            <span className={clsx("chip", meta.accent)}>{meta.label} mode</span>
            {readOnly && (
              <span className="chip bg-ink-100 text-ink-600">Read-only</span>
            )}
          </div>
          <div className="text-[11.5px] text-ink-500">
            {classes.length} class{classes.length === 1 ? "" : "es"} ·{" "}
            {relTypes.length} relation type{relTypes.length === 1 ? "" : "s"}
            {mode === "glossary" && " · auto-provisioned for glossary mode"}
            {mode === "taxonomy" && " · broader / narrower built-in"}
          </div>
        </div>
        {mode === "ontology" && (
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => {
                setClassFormOpen((v) => !v);
                setRelFormOpen(false);
              }}
              className={clsx(
                "btn-ghost py-1 px-2 text-[12px]",
                classFormOpen && "bg-brand-50 text-brand-700"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Class
            </button>
            <button
              onClick={() => {
                setRelFormOpen((v) => !v);
                setClassFormOpen(false);
              }}
              className={clsx(
                "btn-secondary py-1 px-2 text-[12px]",
                relFormOpen && "bg-brand-600 text-white"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Relation type
            </button>
          </div>
        )}
        {mode !== "ontology" && (
          <button
            onClick={onDismiss}
            className="ml-auto btn-ghost py-1 px-2 text-[12px]"
          >
            Back to {meta.defaultView}
          </button>
        )}
      </div>

      {/* Inline forms — drop down from the toolbar when open. */}
      {(classFormOpen || relFormOpen) && mode === "ontology" && (
        <div className="shrink-0 border-b border-ink-200 bg-brand-50/50 px-5 py-3">
          <div className="mx-auto max-w-5xl">
            {classFormOpen && (
              <NewClassForm
                ontologyId={ontologyId}
                onCancel={() => setClassFormOpen(false)}
                onCreate={(payload) => {
                  const cls = addConceptClass(payload);
                  toast({
                    kind: "success",
                    title: `Class "${cls.name}" created`,
                  });
                  setClassFormOpen(false);
                }}
              />
            )}
            {relFormOpen && (
              <NewRelationTypeForm
                ontologyId={ontologyId}
                classes={classes}
                onCancel={() => setRelFormOpen(false)}
                onCreate={(payload) => {
                  const rt = addRelationType(payload);
                  toast({
                    kind: "success",
                    title: `Relation type "${rt.name}" created`,
                  });
                  setRelFormOpen(false);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Two-column content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Classes */}
          <section className="rounded-xl border border-ink-200 bg-white">
            <header className="flex items-center justify-between border-b border-ink-200 bg-ink-50/50 px-4 py-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Concept classes
                </div>
                <div className="text-[13px] font-semibold text-ink-900">
                  owl:Class · click to edit attributes
                </div>
              </div>
              <span className="chip bg-ink-100 text-ink-600">
                {classes.length}
              </span>
            </header>
            <ul className="divide-y divide-ink-100">
              {classes.map((c) => {
                const count = conceptCountByClass[c.id] ?? 0;
                const expanded = expandedClassId === c.id;
                return (
                  <li key={c.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setExpandedClassId(expanded ? null : c.id)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpandedClassId(expanded ? null : c.id);
                        }
                      }}
                      className={clsx(
                        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors",
                        expanded
                          ? "bg-brand-50/60"
                          : "hover:bg-ink-50"
                      )}
                    >
                      <span
                        className={clsx(
                          "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ring-1",
                          classSwatch(c)
                        )}
                      >
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-semibold text-ink-900">
                            {c.name}
                          </span>
                          {c.isImplicit && (
                            <span className="chip bg-ink-100 text-ink-600">
                              implicit
                            </span>
                          )}
                          <span
                            className="chip bg-ink-100 text-ink-600 text-[10px]"
                            title="custom attributes defined on this class"
                          >
                            {(c.properties ?? []).length} attr
                          </span>
                          <span className="ml-auto text-[11px] text-ink-500">
                            {count} concept{count === 1 ? "" : "s"}
                          </span>
                        </div>
                        {c.description && (
                          <p className="mt-0.5 text-[12px] leading-snug text-ink-600">
                            {c.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <ChevronDown
                          className={clsx(
                            "h-4 w-4 text-ink-400 transition-transform",
                            expanded && "rotate-180"
                          )}
                        />
                        {!readOnly && !c.isImplicit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(c.id, c.name);
                            }}
                            className="rounded-md p-1 text-ink-400 hover:bg-rose-50 hover:text-rose-700"
                            title="Remove class"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {expanded && (
                      <div className="border-t border-ink-100 bg-ink-50/40 p-4">
                        <ClassAttributesEditor
                          cls={c}
                          onClose={() => setExpandedClassId(null)}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
              {classes.length === 0 && (
                <li className="px-4 py-6 text-center text-[12px] text-ink-500">
                  No classes yet.
                </li>
              )}
            </ul>
          </section>

          {/* Relation types */}
          <section className="rounded-xl border border-ink-200 bg-white">
            <header className="flex items-center justify-between border-b border-ink-200 bg-ink-50/50 px-4 py-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Relation types
                </div>
                <div className="text-[13px] font-semibold text-ink-900">
                  owl:ObjectProperty · domain → range
                </div>
              </div>
              <span className="chip bg-ink-100 text-ink-600">
                {relTypes.length}
              </span>
            </header>
            <ul className="divide-y divide-ink-100">
              {relTypes.map((rt) => {
                const dom = classById[rt.domainClassId];
                const rng = classById[rt.rangeClassId];
                return (
                  <li key={rt.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-ink-900">
                        {rt.name}
                      </span>
                      {rt.isBuiltIn && (
                        <span className="chip bg-ink-100 text-ink-600">
                          built-in
                        </span>
                      )}
                      {rt.strict && (
                        <span className="chip bg-rose-50 text-rose-700">
                          strict
                        </span>
                      )}
                      {rt.isTransitive && (
                        <span className="chip bg-sky-50 text-sky-700">
                          transitive
                        </span>
                      )}
                      {rt.isSymmetric && (
                        <span className="chip bg-emerald-50 text-emerald-700">
                          symmetric
                        </span>
                      )}
                      {!readOnly && !rt.isBuiltIn && (
                        <button
                          onClick={() =>
                            handleDeleteRelType(rt.id, rt.name, rt.isBuiltIn)
                          }
                          className="ml-auto rounded-md p-1 text-ink-400 hover:bg-rose-50 hover:text-rose-700"
                          title="Remove relation type"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    {rt.description && (
                      <p className="mt-0.5 text-[12px] leading-snug text-ink-600">
                        {rt.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11.5px]">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold ring-1",
                          classSwatch(dom)
                        )}
                      >
                        {dom?.name ?? "—"}
                      </span>
                      <span className="text-ink-400">→</span>
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold ring-1",
                          classSwatch(rng)
                        )}
                      >
                        {rng?.name ?? "—"}
                      </span>
                      <span className="ml-auto text-[10.5px] uppercase tracking-wider text-ink-400">
                        IS_SUBJECT_OF → IS_TARGET_OF
                      </span>
                    </div>
                  </li>
                );
              })}
              {relTypes.length === 0 && (
                <li className="px-4 py-6 text-center text-[12px] text-ink-500">
                  No relation types yet.
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Standards footnote */}
        <div className="mx-auto mt-4 max-w-5xl rounded-xl border border-dashed border-ink-200 bg-ink-50/40 px-4 py-3 text-[12px] text-ink-600">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            <div>
              <span className="font-semibold text-ink-800">
                T-Box ≈ the schema layer.
              </span>{" "}
              Classes map to{" "}
              <code className="rounded bg-white px-1 py-0.5 text-[11px]">
                owl:Class
              </code>
              ; relation types to{" "}
              <code className="rounded bg-white px-1 py-0.5 text-[11px]">
                owl:ObjectProperty
              </code>{" "}
              with <code className="rounded bg-white px-1 py-0.5 text-[11px]">
                rdfs:domain
              </code>{" "}
              and{" "}
              <code className="rounded bg-white px-1 py-0.5 text-[11px]">
                rdfs:range
              </code>
              . In glossary and taxonomy modes these surfaces are auto-provisioned
              and hidden — switch the workspace to ontology mode to edit them.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline form — add a new ConceptClass. Kept small on purpose: the full
// property editor lives on each Concept, T-Box classes only need a name +
// description + color to be useful on day one.
function NewClassForm({
  ontologyId,
  onCancel,
  onCreate,
}: {
  ontologyId: string;
  onCancel: () => void;
  onCreate: (payload: {
    ontologyId: string;
    name: string;
    label: string;
    description: string;
    color: NonNullable<ConceptClass["color"]>;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] =
    useState<NonNullable<ConceptClass["color"]>>("violet");
  const valid = name.trim().length > 0;
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-ink-500" />
        <div className="text-[13px] font-semibold text-ink-900">
          New concept class
        </div>
        <span className="chip bg-ink-100 text-ink-600">owl:Class</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Name
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Material"
            className="mt-1 w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Colour
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            {(["violet", "emerald", "amber", "sky", "rose", "ink"] as const).map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={clsx(
                    "h-6 w-6 rounded-full border-2 transition-transform",
                    color === c
                      ? "border-ink-900 scale-110"
                      : "border-transparent",
                    CLASS_DOT[c]
                  )}
                  title={c}
                />
              )
            )}
          </div>
        </label>
        <label className="block md:col-span-2">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What kind of thing is this class?"
            className="mt-1 min-h-[60px] w-full resize-y rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost py-1 px-2 text-[12px]">
          Cancel
        </button>
        <button
          disabled={!valid}
          onClick={() =>
            onCreate({
              ontologyId,
              name: name.trim(),
              label: name.trim(),
              description: description.trim(),
              color,
            })
          }
          className={clsx(
            "btn-primary py-1 px-2 text-[12px]",
            !valid && "cursor-not-allowed opacity-60"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Create class
        </button>
      </div>
    </div>
  );
}

// Inline form — add a new RelationType. Needs domain + range Class ids so
// the RelationPickerModal can narrow suggestions later.
function NewRelationTypeForm({
  ontologyId,
  classes,
  onCancel,
  onCreate,
}: {
  ontologyId: string;
  classes: ConceptClass[];
  onCancel: () => void;
  onCreate: (payload: {
    ontologyId: string;
    name: string;
    label: string;
    description: string;
    domainClassId: string;
    rangeClassId: string;
    isTransitive?: boolean;
    isSymmetric?: boolean;
  }) => void;
}) {
  const first = classes[0]?.id ?? "";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domainClassId, setDomainClassId] = useState(first);
  const [rangeClassId, setRangeClassId] = useState(first);
  const [transitive, setTransitive] = useState(false);
  const [symmetric, setSymmetric] = useState(false);
  const valid = name.trim().length > 0 && domainClassId && rangeClassId;

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-ink-500" />
        <div className="text-[13px] font-semibold text-ink-900">
          New relation type
        </div>
        <span className="chip bg-ink-100 text-ink-600">
          owl:ObjectProperty
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Name
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. madeOf"
            className="mt-1 w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Domain (from)
          </span>
          <select
            value={domainClassId}
            onChange={(e) => setDomainClassId(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Range (to)
          </span>
          <select
            value={rangeClassId}
            onChange={(e) => setRangeClassId(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How should editors know when to pick this type?"
            className="mt-1 min-h-[50px] w-full resize-y rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <div className="md:col-span-3 flex items-center gap-3 text-[12px] text-ink-600">
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={transitive}
              onChange={(e) => setTransitive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Transitive
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={symmetric}
              onChange={(e) => setSymmetric(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Symmetric
          </label>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost py-1 px-2 text-[12px]">
          Cancel
        </button>
        <button
          disabled={!valid}
          onClick={() =>
            onCreate({
              ontologyId,
              name: name.trim(),
              label: name.trim(),
              description: description.trim(),
              domainClassId,
              rangeClassId,
              isTransitive: transitive,
              isSymmetric: symmetric,
            })
          }
          className={clsx(
            "btn-primary py-1 px-2 text-[12px]",
            !valid && "cursor-not-allowed opacity-60"
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          Create relation type
        </button>
      </div>
    </div>
  );
}

// Tree row shape. Built at runtime from real concepts + broader/narrower
// relations by `buildTaxonomyFromScheme` — the old hard-coded sample tree is
// gone. Keeping the shape small so the row renderer stays dumb.
type TaxonomyNode = {
  id: string; // concept id (so a click can route straight to the detail page)
  label: string; // default-language prefLabel (mirrored on Concept.name)
  altLabels?: string[]; // up to a couple altLabels in the default language
  count?: number; // direct-child count — shown as a subtle right-aligned hint
  deprecated?: boolean;
  children?: TaxonomyNode[];
};

// Relation types we treat as "is child of" edges when building the tree.
// Derived from the real T-Box so any ontology whose author called the
// hierarchy edge `broader` (or marked it as the broader built-in) gets the
// tree view for free — no hard-coded relation-type id list to maintain.
// Covers the SKOS convention of `child -[broader]-> parent`.
const BROADER_RELATION_TYPE_IDS: Set<string> = new Set(
  allRelationTypes
    .filter(
      (rt) =>
        rt.name === "broader" ||
        rt.label === "broader" ||
        rt.id.startsWith("rt_broader_")
    )
    .map((rt) => rt.id)
);

// Build a `TaxonomyNode[]` (roots) from the subset of concepts + relations
// scoped to a given ConceptScheme. Walks broader edges to assemble the tree
// and sorts siblings alphabetically so the rendering is stable. Works with
// any scheme — not just product categories — which is the whole point of the
// refactor.
function buildTaxonomyFromScheme(
  schemeId: string,
  sourceLanguage: string
): TaxonomyNode[] {
  const scopedConcepts = allConcepts.filter((c) => c.schemeId === schemeId);
  if (scopedConcepts.length === 0) return [];
  const scopedRelations = allRelations.filter(
    (r) =>
      r.schemeId === schemeId &&
      BROADER_RELATION_TYPE_IDS.has(r.relationTypeId)
  );

  // parent → [childIds], child → parent
  const childrenByParent: Record<string, string[]> = {};
  const parentOf: Record<string, string> = {};
  for (const r of scopedRelations) {
    // r.from = child, r.to = parent (skos:broader semantics)
    if (!childrenByParent[r.to]) childrenByParent[r.to] = [];
    childrenByParent[r.to].push(r.from);
    parentOf[r.from] = r.to;
  }

  const conceptById: Record<string, (typeof scopedConcepts)[number]> = {};
  scopedConcepts.forEach((c) => {
    conceptById[c.id] = c;
  });

  function toNode(id: string): TaxonomyNode {
    const c = conceptById[id];
    if (!c) return { id, label: id };
    const childIds = childrenByParent[id] ?? [];
    const children = childIds
      .map(toNode)
      .sort((a, b) => a.label.localeCompare(b.label));
    // Pull altLabels in the ontology's default language, cap to 2 so the row
    // doesn't balloon.
    const altLabels = (c.labels.altLabel ?? [])
      .filter((l) => l.lang === sourceLanguage)
      .slice(0, 2)
      .map((l) => l.value);
    return {
      id: c.id,
      label: c.name,
      altLabels: altLabels.length > 0 ? altLabels : undefined,
      deprecated: c.deprecated,
      count: childIds.length > 0 ? childIds.length : undefined,
      children: children.length > 0 ? children : undefined,
    };
  }

  return scopedConcepts
    .filter((c) => !parentOf[c.id])
    .map((c) => toNode(c.id))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Walk the tree and return {total, deprecated, depth} — powers the "N concepts
// · X levels deep · Y deprecated" strip.
function taxonomyStats(nodes: TaxonomyNode[]): {
  total: number;
  deprecated: number;
  depth: number;
} {
  let total = 0;
  let deprecated = 0;
  let depth = 0;
  function walk(n: TaxonomyNode, d: number) {
    total++;
    if (n.deprecated) deprecated++;
    if (d > depth) depth = d;
    n.children?.forEach((c) => walk(c, d + 1));
  }
  nodes.forEach((n) => walk(n, 0));
  return { total, deprecated, depth: depth + 1 };
}

function TaxonomyTreeNode({
  node,
  depth,
  expanded,
  onToggle,
  onSelect,
  selectedId,
  onDropReparent,
  dragState,
  setDragState,
}: {
  node: TaxonomyNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string, wasOpen: boolean) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  onDropReparent: (sourceId: string, targetId: string) => void;
  dragState: { sourceId: string | null; overId: string | null };
  setDragState: (s: {
    sourceId: string | null;
    overId: string | null;
  }) => void;
}) {
  const hasChildren = !!node.children?.length;
  // Only roots are implicitly visible — any deeper node stays collapsed until
  // the user opens it. Combined with the scheme-accordion above, this keeps
  // the "all taxonomies at once" view compact.
  const isOpen = expanded[node.id] ?? false;
  const isSelected = selectedId === node.id;
  const isDragSource = dragState.sourceId === node.id;
  const isDropTarget =
    dragState.overId === node.id &&
    dragState.sourceId !== null &&
    dragState.sourceId !== node.id;
  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", node.id);
          setDragState({ sourceId: node.id, overId: null });
        }}
        onDragEnd={() => setDragState({ sourceId: null, overId: null })}
        onDragOver={(e) => {
          if (dragState.sourceId && dragState.sourceId !== node.id) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (dragState.overId !== node.id) {
              setDragState({ sourceId: dragState.sourceId, overId: node.id });
            }
          }
        }}
        onDragLeave={() => {
          if (dragState.overId === node.id) {
            setDragState({ sourceId: dragState.sourceId, overId: null });
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          const srcId = e.dataTransfer.getData("text/plain");
          if (srcId && srcId !== node.id) {
            onDropReparent(srcId, node.id);
          }
          setDragState({ sourceId: null, overId: null });
        }}
        className={clsx(
          "group flex items-center gap-1.5 rounded-md py-1 pr-2 text-[13px] transition-colors",
          isSelected ? "bg-brand-50 text-brand-800" : "hover:bg-ink-100",
          isDragSource && "opacity-50",
          isDropTarget &&
            "bg-brand-100 ring-2 ring-brand-500 ring-inset"
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        <button
          onClick={() => hasChildren && onToggle(node.id, isOpen)}
          className={clsx(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-ink-400",
            hasChildren ? "hover:bg-ink-200 hover:text-ink-700" : "opacity-0"
          )}
        >
          {hasChildren &&
            (isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            ))}
        </button>
        {depth === 0 ? (
          <ListTree className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
        ) : hasChildren ? (
          <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-ink-300" />
        ) : (
          <span className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
        )}
        <button
          onClick={() => onSelect(node.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          <span
            className={clsx(
              "truncate font-medium",
              node.deprecated && "text-ink-400 line-through",
              !node.deprecated && "text-ink-800"
            )}
          >
            {node.label}
          </span>
          {node.altLabels?.map((alt) => (
            <span
              key={alt}
              className="chip bg-ink-100 text-ink-500 text-[10px]"
            >
              {alt}
            </span>
          ))}
          {node.deprecated && (
            <span className="chip bg-amber-50 text-amber-700 text-[10px]">
              deprecated
            </span>
          )}
          {typeof node.count === "number" && (
            <span className="ml-auto text-[11px] text-ink-400">
              {node.count}
            </span>
          )}
        </button>
        <PresenceAvatars conceptId={node.id} size={4} />
        <button
          className="rounded p-0.5 text-ink-400 opacity-0 hover:bg-ink-200 hover:text-ink-700 group-hover:opacity-100"
          title="More"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
      {hasChildren && isOpen && (
        <>
          {node.children!.map((child) => (
            <TaxonomyTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
              onDropReparent={onDropReparent}
              dragState={dragState}
              setDragState={setDragState}
            />
          ))}
        </>
      )}
    </>
  );
}


function TaxonomyTreeView({ ontologyId }: { ontologyId: string }) {
  // Every scheme that hangs off this ontology becomes a collapsible section.
  const schemes = useMemo(
    () => allSchemes.filter((s) => s.ontologyId === ontologyId),
    [ontologyId]
  );
  const ontology = useMemo(
    () => ontologies.find((o) => o.id === ontologyId),
    [ontologyId]
  );
  const sourceLanguage = ontology?.defaultLanguage ?? "en";

  // Pre-build each scheme's tree once per render — cheap for the mock data
  // sizes we have, and memoised so expanding / collapsing doesn't rebuild.
  const treesByScheme = useMemo(() => {
    const map: Record<
      string,
      { tree: TaxonomyNode[]; stats: ReturnType<typeof taxonomyStats> }
    > = {};
    for (const s of schemes) {
      const tree = buildTaxonomyFromScheme(
        s.id,
        s.sourceLanguage ?? sourceLanguage
      );
      map[s.id] = { tree, stats: taxonomyStats(tree) };
    }
    return map;
  }, [schemes, sourceLanguage]);

  // Per-scheme accordion open state — default closed per user request.
  const [schemeOpen, setSchemeOpen] = useState<Record<string, boolean>>({});
  // Per-scheme per-node expansion. Only roots are shown when a scheme first
  // opens (the change to TaxonomyTreeNode.isOpen handles the default).
  const [expandedByScheme, setExpandedByScheme] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // Currently-selected concept — drives the right-rail inspector. We keep it
  // local so the trees stay visible no matter how deep the user drills.
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );

  // Drag-drop state — the id of the row being dragged + the id it's currently
  // hovering over. Shared across every TaxonomyTreeNode in this view so visual
  // feedback (opacity on source, highlight on target) stays in sync.
  const [dragState, setDragState] = useState<{
    sourceId: string | null;
    overId: string | null;
  }>({ sourceId: null, overId: null });

  const { moveConcept, toast, tick: moveTick } = useApp();
  void moveTick;

  function handleDropReparent(sourceId: string, targetId: string) {
    // Pick the first broader-style relation type defined in this ontology
    // — every seed ontology has one. We could let the user pick but for a
    // drag-drop flow that would feel intrusive.
    const broaderRt = allRelationTypes.find(
      (rt) =>
        rt.ontologyId === ontologyId &&
        BROADER_RELATION_TYPE_IDS.has(rt.id)
    );
    if (!broaderRt) {
      toast({
        kind: "error",
        title: "No broader relation type",
        description: "Define a broader-style relation in the schema first.",
      });
      return;
    }
    const event = moveConcept({
      conceptId: sourceId,
      newParentId: targetId,
      broaderRelationTypeId: broaderRt.id,
    });
    if (!event) {
      toast({
        kind: "error",
        title: "Can't move this concept there",
        description: "It would create a cycle with an existing broader chain.",
      });
      return;
    }
    toast({
      kind: "success",
      title: "Reparented",
      description: event.summary,
    });
  }

  const toggleScheme = (id: string) =>
    setSchemeOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleNode = (schemeId: string, nodeId: string, wasOpen: boolean) =>
    setExpandedByScheme((prev) => ({
      ...prev,
      [schemeId]: {
        ...(prev[schemeId] ?? {}),
        [nodeId]: !wasOpen,
      },
    }));

  // When selecting a concept we make sure its scheme is expanded (and its
  // ancestor chain too) so the highlighted row is actually visible.
  const selectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    const concept = allConcepts.find((c) => c.id === conceptId);
    if (!concept) return;
    setSchemeOpen((prev) => ({ ...prev, [concept.schemeId]: true }));
    // Walk broader edges up to the root and open every ancestor node.
    const ancestors: string[] = [];
    let cursor: string | null = concept.id;
    const guard = new Set<string>();
    while (cursor && !guard.has(cursor)) {
      guard.add(cursor);
      const up = allRelations.find(
        (r) =>
          r.from === cursor &&
          BROADER_RELATION_TYPE_IDS.has(r.relationTypeId)
      );
      if (!up) break;
      ancestors.push(up.to);
      cursor = up.to;
    }
    if (ancestors.length > 0) {
      setExpandedByScheme((prev) => ({
        ...prev,
        [concept.schemeId]: {
          ...(prev[concept.schemeId] ?? {}),
          ...Object.fromEntries(ancestors.map((a) => [a, true])),
        },
      }));
    }
  };

  return (
    <div className="flex h-full min-h-0">
      {/* ---- Left rail: compact list of every taxonomy (scheme) ---- */}
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-ink-200 bg-white">
        <div className="flex shrink-0 items-center gap-2 border-b border-ink-200 px-3 py-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <ListTree className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-semibold text-ink-900">
              Taxonomies
            </div>
            <div className="truncate text-[10.5px] text-ink-500">
              {schemes.length} scheme{schemes.length === 1 ? "" : "s"} · SKOS
            </div>
          </div>
          <button
            className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            title="New taxonomy"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            title="Filter"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {schemes.length === 0 && (
            <div className="m-2 rounded-lg border border-dashed border-ink-300 px-3 py-6 text-center text-[11px] text-ink-500">
              No taxonomies yet. Create a scheme to group related concepts
              into a tree.
            </div>
          )}
          {schemes.map((s) => {
            const { tree, stats } = treesByScheme[s.id];
            const open = schemeOpen[s.id] ?? false;
            const expanded = expandedByScheme[s.id] ?? {};
            return (
              <section key={s.id} className="mb-1">
                <button
                  onClick={() => toggleScheme(s.id)}
                  className={clsx(
                    "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors",
                    open ? "bg-emerald-50" : "hover:bg-ink-50"
                  )}
                >
                  <ChevronRight
                    className={clsx(
                      "h-3.5 w-3.5 shrink-0 text-ink-400 transition-transform",
                      open && "rotate-90"
                    )}
                  />
                  <ListTree
                    className={clsx(
                      "h-3.5 w-3.5 shrink-0",
                      open ? "text-emerald-600" : "text-ink-400"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-ink-900">
                      {s.name}
                    </div>
                    <div className="truncate text-[10px] text-ink-500">
                      {stats.total} concepts · {stats.depth} deep
                      {stats.deprecated > 0 && ` · ${stats.deprecated} dep.`}
                    </div>
                  </div>
                  <span className="chip bg-ink-100 text-ink-600 text-[9.5px]">
                    {stats.total}
                  </span>
                </button>
                {open && (
                  <div className="ml-1.5 mt-0.5 border-l border-ink-100 pl-1">
                    {tree.length > 0 ? (
                      tree.map((n) => (
                        <TaxonomyTreeNode
                          key={n.id}
                          node={n}
                          depth={0}
                          expanded={expanded}
                          onToggle={(id, wasOpen) =>
                            toggleNode(s.id, id, wasOpen)
                          }
                          onSelect={selectConcept}
                          selectedId={selectedConceptId}
                          onDropReparent={handleDropReparent}
                          dragState={dragState}
                          setDragState={setDragState}
                        />
                      ))
                    ) : (
                      <div className="px-2 py-3 text-center text-[11px] text-ink-500">
                        Empty scheme.
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </aside>

      {/* ---- Center pane: the full concept detail (tabs + all panels) ---- */}
      <div className="min-w-0 flex-1">
        {selectedConceptId ? (
          <ConceptDetail
            conceptId={selectedConceptId}
            ontologyId={ontologyId}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-ink-50 p-8">
            <div className="max-w-md rounded-xl border border-dashed border-ink-300 bg-white/70 px-6 py-10 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <ListTree className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-ink-900">
                Pick a concept to start editing
              </div>
              <div className="mt-1 text-xs leading-relaxed text-ink-500">
                Expand a taxonomy on the left, then click any concept. Its
                definition, labels, hierarchy and properties will open here —
                the trees stay visible so you don't lose context.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const now = new Date("2026-04-20T10:00:00Z").getTime();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// -----------------------------------------------------------------------------
// Table view — datagrid with sort, search, multi-select and a bulk action bar.
// Reads from the live concept store scoped to the active ontology / scheme.
// -----------------------------------------------------------------------------
type TableSortKey =
  | "name"
  | "class"
  | "scheme"
  | "relations"
  | "language"
  | "lastChange"
  | "status";

function TableView({
  ontologyId,
  selectedSchemeId,
  onSchemeChange,
  onOpenConcept,
}: {
  ontologyId: string;
  selectedSchemeId: string | null;
  onSchemeChange: (id: string | null) => void;
  onOpenConcept: (conceptId: string) => void;
}) {
  const { tick, openDeprecate, openExport, reactivateConcept, toast } =
    useApp();
  void tick;
  const ontology = ontologies.find((o) => o.id === ontologyId) ?? ontologies[0];
  const schemes = useMemo(
    () => allSchemes.filter((s) => s.ontologyId === ontologyId),
    [ontologyId]
  );
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<TableSortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "deprecated">(
    "all"
  );

  const rows = useMemo(() => {
    const base = allConcepts.filter((c) => {
      if (c.ontologyId !== ontologyId) return false;
      if (selectedSchemeId && c.schemeId !== selectedSchemeId) return false;
      if (statusFilter === "active" && c.deprecated) return false;
      if (statusFilter === "deprecated" && !c.deprecated) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.labels.altLabel.some((a) => a.value.toLowerCase().includes(q))
      );
    });
    const sorted = base.slice().sort((a, b) => {
      const cls = (c: Concept) =>
        allConceptClasses.find((x) => x.id === c.classId)?.name ?? "";
      const sch = (c: Concept) =>
        allSchemes.find((x) => x.id === c.schemeId)?.name ?? "";
      const relCount = (c: Concept) =>
        allRelations.filter((r) => r.from === c.id || r.to === c.id).length;
      const lastChange = (c: Concept) =>
        changeEvents.find((e) => e.id === c.lastChangeId)?.at ?? "";
      const langs = (c: Concept) => c.labels.prefLabel.length;
      const status = (c: Concept) => (c.deprecated ? 1 : 0);

      let av: string | number = "";
      let bv: string | number = "";
      switch (sortKey) {
        case "name":
          av = a.name;
          bv = b.name;
          break;
        case "class":
          av = cls(a);
          bv = cls(b);
          break;
        case "scheme":
          av = sch(a);
          bv = sch(b);
          break;
        case "relations":
          av = relCount(a);
          bv = relCount(b);
          break;
        case "language":
          av = langs(a);
          bv = langs(b);
          break;
        case "lastChange":
          av = lastChange(a);
          bv = lastChange(b);
          break;
        case "status":
          av = status(a);
          bv = status(b);
          break;
      }
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [ontologyId, selectedSchemeId, query, sortKey, sortDir, statusFilter, tick]);

  function toggleSort(key: TableSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleAll() {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  }

  function deprecateSelected() {
    const ids = Array.from(selected);
    ids.forEach((id) => openDeprecate(id));
    // Opening multiple modals stacks isn't great; fall back to just firing
    // a deprecation with no reason for each once the first modal commits.
    // The simpler path here is a toast letting the user know we only open
    // the first — they can chain the others.
    if (ids.length > 1) {
      toast({
        kind: "info",
        title: `Deprecating ${ids.length} concepts`,
        description: "We'll open the deprecation dialog for each in turn.",
      });
    }
  }

  const allRowsSelected = selected.size > 0 && selected.size === rows.length;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-ink-200 bg-ink-50/40 px-4 py-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter concepts…"
            className="w-72 rounded-lg border border-ink-200 bg-white py-1 pl-7 pr-2 text-[12px] placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-1 py-0.5">
          {(["all", "active", "deprecated"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize",
                statusFilter === f
                  ? "bg-brand-600 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        {schemes.length > 0 && (
          <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-1 py-0.5">
            <button
              onClick={() => onSchemeChange(null)}
              className={clsx(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                !selectedSchemeId
                  ? "bg-ink-800 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              )}
            >
              All schemes
            </button>
            {schemes.map((s) => (
              <button
                key={s.id}
                onClick={() => onSchemeChange(s.id)}
                className={clsx(
                  "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                  selectedSchemeId === s.id
                    ? "bg-ink-800 text-white"
                    : "text-ink-600 hover:bg-ink-100"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        <span className="ml-1 text-[11px] text-ink-500">
          {rows.length} {rows.length === 1 ? "concept" : "concepts"}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => openExport(ontology.id)}
            className="btn-ghost py-1 px-2 text-[12px]"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk action bar — slides down when at least one row is selected. */}
      {selected.size > 0 && (
        <div className="flex shrink-0 items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px]">
          <span className="font-semibold text-amber-900">
            {selected.size} selected
          </span>
          <span className="text-amber-700">
            · bulk actions apply to every checked row
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={deprecateSelected}
              className="btn-secondary py-1 px-2 text-[11.5px]"
            >
              <Trash2 className="h-3 w-3" />
              Deprecate
            </button>
            <button
              onClick={() => {
                toast({
                  kind: "success",
                  title: `Tagged ${selected.size} concepts`,
                  description: "A new tag was created from the selection.",
                });
                setSelected(new Set());
              }}
              className="btn-secondary py-1 px-2 text-[11.5px]"
            >
              <TagIcon className="h-3 w-3" />
              Tag
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="btn-ghost py-1 px-2 text-[11.5px]"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[900px] text-[12.5px]">
          <thead className="sticky top-0 z-10 bg-white text-[11px] font-semibold uppercase tracking-wide text-ink-500 shadow-[0_1px_0_#e2e8f0]">
            <tr>
              <th className="w-9 px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={allRowsSelected}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
              <SortableTH
                label="Name"
                active={sortKey === "name"}
                dir={sortDir}
                onClick={() => toggleSort("name")}
              />
              <SortableTH
                label="Class"
                active={sortKey === "class"}
                dir={sortDir}
                onClick={() => toggleSort("class")}
              />
              <SortableTH
                label="Scheme"
                active={sortKey === "scheme"}
                dir={sortDir}
                onClick={() => toggleSort("scheme")}
              />
              <SortableTH
                label="Languages"
                active={sortKey === "language"}
                dir={sortDir}
                onClick={() => toggleSort("language")}
              />
              <SortableTH
                label="Relations"
                active={sortKey === "relations"}
                dir={sortDir}
                onClick={() => toggleSort("relations")}
              />
              <SortableTH
                label="Status"
                active={sortKey === "status"}
                dir={sortDir}
                onClick={() => toggleSort("status")}
              />
              <SortableTH
                label="Last change"
                active={sortKey === "lastChange"}
                dir={sortDir}
                onClick={() => toggleSort("lastChange")}
              />
              <th className="w-10 px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-ink-500">
                  No concepts match the current filter.
                </td>
              </tr>
            )}
            {rows.map((c) => {
              const cls = allConceptClasses.find((x) => x.id === c.classId);
              const sch = allSchemes.find((x) => x.id === c.schemeId);
              const lastEvent = changeEvents.find(
                (e) => e.id === c.lastChangeId
              );
              const rel = allRelations.filter(
                (r) => r.from === c.id || r.to === c.id
              ).length;
              const isSelected = selected.has(c.id);
              return (
                <tr
                  key={c.id}
                  onClick={() => onOpenConcept(c.id)}
                  className={clsx(
                    "cursor-pointer border-t border-ink-100 hover:bg-brand-50/30",
                    isSelected && "bg-brand-50/50",
                    c.deprecated && "text-ink-400"
                  )}
                >
                  <td
                    className="px-3 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(c.id)}
                      className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div
                      className={clsx(
                        "font-semibold",
                        c.deprecated
                          ? "text-ink-400 line-through"
                          : "text-ink-900"
                      )}
                    >
                      {c.name}
                    </div>
                    <div className="font-mono text-[10.5px] text-ink-400">
                      {c.id}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {cls ? (
                      <span
                        className={clsx(
                          "chip text-[10.5px] ring-1",
                          classSwatch(cls)
                        )}
                      >
                        {cls.name}
                      </span>
                    ) : (
                      <span className="text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {sch ? (
                      <span className="chip bg-ink-100 text-ink-700 text-[10.5px]">
                        {sch.name}
                      </span>
                    ) : (
                      <span className="text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap items-center gap-1">
                      {c.labels.prefLabel.slice(0, 4).map((l) => (
                        <span
                          key={l.lang}
                          className="chip bg-ink-50 text-ink-600 text-[10px] uppercase"
                          title={l.value}
                        >
                          {l.lang}
                        </span>
                      ))}
                      {c.labels.prefLabel.length > 4 && (
                        <span className="text-[10px] italic text-ink-400">
                          +{c.labels.prefLabel.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{rel}</td>
                  <td className="px-3 py-2">
                    {c.deprecated ? (
                      <span className="chip bg-amber-50 text-amber-700 text-[10.5px]">
                        deprecated
                      </span>
                    ) : (
                      <span className="chip bg-emerald-50 text-emerald-700 text-[10.5px]">
                        active
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[11.5px] text-ink-500">
                    {lastEvent ? timeAgo(lastEvent.at) : "—"}
                  </td>
                  <td
                    className="px-3 py-2 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.deprecated ? (
                      <button
                        onClick={() => {
                          reactivateConcept(c.id);
                          toast({
                            kind: "success",
                            title: `Reactivated ${c.name}`,
                          });
                        }}
                        title="Reactivate"
                        className="rounded-md p-1 text-ink-400 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => openDeprecate(c.id)}
                        title="Deprecate"
                        className="rounded-md p-1 text-ink-400 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableTH({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="cursor-pointer select-none px-3 py-2 text-left hover:text-ink-800"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          <ChevronDown
            className={clsx(
              "h-3 w-3 transition-transform",
              dir === "asc" && "rotate-180"
            )}
          />
        ) : (
          <ChevronDown className="h-3 w-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

// -----------------------------------------------------------------------------
// SchemaCanvas — the T-Box rendering of the ontology. Each ConceptClass shows
// up as a ClassNode (with its attributes); each RelationType becomes an edge
// between the class it points from (domain) to the class it points to (range).
// This is the canvas view users see first when they open an ontology — the
// "instances" canvas lives one toggle away and drills into the A-Box.
// -----------------------------------------------------------------------------
function SchemaCanvas({
  ontologyId,
  selectedClassId,
  onSelect,
}: {
  ontologyId: string;
  selectedClassId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { tick } = useApp();

  const classes = useMemo(() => {
    void tick;
    return allConceptClasses.filter((c) => c.ontologyId === ontologyId);
  }, [ontologyId, tick]);

  const relTypes = useMemo(() => {
    void tick;
    return allRelationTypes.filter((r) => r.ontologyId === ontologyId);
  }, [ontologyId, tick]);

  // Count instances per class so the ClassNode can show "12 instances".
  const instanceCountByClass = useMemo(() => {
    const map = new Map<string, number>();
    allConcepts.forEach((c) => {
      if (c.ontologyId !== ontologyId) return;
      map.set(c.classId, (map.get(c.classId) ?? 0) + 1);
    });
    return map;
    // tick drives recomputes when concepts are added via import / new concept.
  }, [ontologyId, tick]);

  // Hub-and-spoke layout.
  // The class with the most outgoing + incoming edges becomes the hub and gets
  // placed at the origin; everything else arranges itself in a ring around it.
  // This keeps the initial diagram readable (edges radiate outward so labels
  // rarely overlap the other nodes). Users can still drag nodes freely once
  // they've landed — ReactFlow tracks position in its own internal state.
  const positioned = useMemo(() => {
    const NODE_W = 240;
    const NODE_H = 220;
    // Degree count (incoming + outgoing) per class — used to pick the hub.
    const degree = new Map<string, number>();
    relTypes.forEach((rt) => {
      degree.set(rt.domainClassId, (degree.get(rt.domainClassId) ?? 0) + 1);
      if (rt.rangeClassId !== rt.domainClassId) {
        degree.set(rt.rangeClassId, (degree.get(rt.rangeClassId) ?? 0) + 1);
      }
    });
    const sorted = classes
      .slice()
      .sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0));
    const hub = sorted[0];
    const spokes = sorted.slice(1);

    // Place the hub at the origin. Spokes go around it at a fixed radius —
    // radius grows with the number of spokes so each node gets enough room.
    const R_X = Math.max(420, 110 * Math.ceil(spokes.length / 2));
    const R_Y = Math.max(320, 90 * Math.ceil(spokes.length / 2));

    const positioned: { cls: ConceptClass; x: number; y: number }[] = [];
    if (hub) {
      positioned.push({ cls: hub, x: 0, y: 0 });
    }
    const count = spokes.length;
    spokes.forEach((cls, idx) => {
      // Start at 12 o'clock and walk clockwise so the first spoke lands above
      // the hub — visually highlights the "root" connection.
      const angle = -Math.PI / 2 + (2 * Math.PI * idx) / Math.max(1, count);
      positioned.push({
        cls,
        x: R_X * Math.cos(angle) - NODE_W / 2,
        y: R_Y * Math.sin(angle) - NODE_H / 2,
      });
    });
    // Shift everything so the hub lands at a stable on-screen coordinate.
    // ReactFlow's fitView will handle the final centring.
    return positioned;
  }, [classes, relTypes]);

  // --- initial node / edge shape ----------------------------------------
  // We derive an initial nodes array from the hub-and-spoke layout above,
  // and then hand it to useNodesState so ReactFlow can own the position +
  // selection state going forward. Without this hook, every parent re-render
  // would rebuild `nodes` and wipe any drag the user just performed.
  const initialNodes: Node[] = useMemo(
    () =>
      positioned.map((p) => ({
        id: p.cls.id,
        type: "class",
        position: { x: p.x, y: p.y },
        data: {
          cls: p.cls,
          instanceCount: instanceCountByClass.get(p.cls.id) ?? 0,
        },
      })),
    // Deliberately *not* in deps: instanceCountByClass — we patch that via
    // effect below so a live mutation doesn't reset the user's drags.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positioned]
  );

  // Colors to visually separate the three edge "families" — broader (SKOS
  // hierarchy), built-in core, and user-defined. In the Cars ontology the
  // broader relations don't clutter the main ER diagram because they're
  // class-scoped and we deliberately skip them (same-class self-loops).
  //
  // Edge type = "default" (bezier) so the curve bows outward between hub and
  // spokes — labels land clearly outside either node instead of sliding
  // behind them the way smoothstep L-paths did.
  const initialEdges: Edge[] = useMemo(() => {
    return relTypes
      .filter((rt) => rt.domainClassId !== rt.rangeClassId || !rt.isBuiltIn)
      .map((rt) => ({
        id: rt.id,
        source: rt.domainClassId,
        target: rt.rangeClassId,
        label: rt.name,
        type: "default",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: rt.isBuiltIn ? "#94a3b8" : "#7c56fc",
          width: 18,
          height: 18,
        },
        style: {
          stroke: rt.isBuiltIn ? "#94a3b8" : "#7c56fc",
          strokeWidth: rt.isBuiltIn ? 1.5 : 2,
          strokeDasharray: rt.isBuiltIn ? "6 4" : undefined,
        },
        labelStyle: {
          fill: rt.isBuiltIn ? "#475569" : "#6d28d9",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "Inter, system-ui",
        },
        labelBgStyle: {
          fill: "#ffffff",
          stroke: rt.isBuiltIn ? "#e2e8f0" : "#ddd6fe",
          strokeWidth: 1,
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 6,
        labelShowBg: true,
      }));
  }, [relTypes]);

  // ReactFlow-owned state. Positions persist across re-renders; when the
  // underlying class list changes (new class added) or instance count shifts,
  // we reconcile by merging in new nodes / patching data but preserving
  // existing positions for untouched ids.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync node additions/removals + data refresh, while keeping user-dragged
  // positions. Only runs when the initial shape changes (class list, counts).
  useEffect(() => {
    setNodes((current) => {
      const byId = new Map(current.map((n) => [n.id, n]));
      return initialNodes.map((n) => {
        const existing = byId.get(n.id);
        return existing
          ? { ...n, position: existing.position, selected: existing.selected }
          : n;
      });
    });
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Mirror the externally-controlled selectedClassId into the ReactFlow
  // selection state so clicking the right-rail class inspector highlights
  // the matching node on the canvas.
  useEffect(() => {
    setNodes((current) =>
      current.map((n) => ({
        ...n,
        selected: n.id === selectedClassId,
      }))
    );
  }, [selectedClassId, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{ class: ClassNode }}
      fitView
      fitViewOptions={{ padding: 0.25 }}
      onPaneClick={() => onSelect(null)}
      onNodeClick={(_e, n) => onSelect(n.id)}
      // Nodes are draggable by default; being explicit here so the intent is
      // clear — users can reposition class cards to reveal crowded labels.
      nodesDraggable
      nodesConnectable={false}
      edgesFocusable
      minZoom={0.2}
      maxZoom={2}
      defaultEdgeOptions={{ type: "default" }}
      proOptions={{ hideAttribution: false }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1.2}
        color="#cbd5e1"
      />
      <Controls
        showInteractive={false}
        position="bottom-right"
        className="!shadow-pop"
      />
    </ReactFlow>
  );
}

function EditorCanvas({
  ontologyId,
  schemeId,
  selectedId,
  onSelect,
  onNodeDoubleClick,
}: {
  ontologyId: string;
  schemeId: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onNodeDoubleClick: (id: string) => void;
}) {
  const { tick, openRelationDraft, deleteRelation, toast } = useApp();
  // Scope the canvas to the concepts that belong to the active scheme.
  // Falling back to ontology-wide is only used if there are no schemes at all
  // (never happens in the seed) — otherwise the canvas would pile concepts
  // from different taxonomies on top of each other.
  const scopedConcepts = useMemo(() => {
    if (schemeId) {
      return allConcepts.filter((c) => c.schemeId === schemeId);
    }
    return allConcepts.filter((c) => c.ontologyId === ontologyId);
    // tick is included so newly-created concepts (via mutations) show up.
  }, [ontologyId, schemeId, tick]);

  // Auto-layout concepts that were seeded without explicit coordinates
  // (the generated taxonomy trees all ship with x:0,y:0 which would stack
  // every node on top of one another). We drop them into a light grid so
  // the canvas still feels alive when switching to those schemes.
  const positionedConcepts = useMemo(() => {
    const stacked = scopedConcepts.filter((c) => c.x === 0 && c.y === 0);
    const needsLayout = stacked.length === scopedConcepts.length && stacked.length > 0;
    if (!needsLayout) return scopedConcepts;

    const COLS = 6;
    const GAP_X = 220;
    const GAP_Y = 120;
    return scopedConcepts.map((c, i) => ({
      ...c,
      x: (i % COLS) * GAP_X,
      y: Math.floor(i / COLS) * GAP_Y,
    }));
  }, [scopedConcepts]);

  const visibleIds = useMemo(
    () => new Set(positionedConcepts.map((c) => c.id)),
    [positionedConcepts]
  );

  const initialNodes: Node[] = useMemo(
    () =>
      positionedConcepts.map((c) => ({
        id: c.id,
        type: "concept",
        position: { x: c.x, y: c.y },
        data: { concept: c },
      })),
    [positionedConcepts]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      allRelations
        .filter((r) => visibleIds.has(r.from) && visibleIds.has(r.to))
        .map((r) => ({
          id: r.id,
          source: r.from,
          target: r.to,
          label: r.label,
          type: "smoothstep",
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#94a3b8",
            width: 18,
            height: 18,
          },
          style: { stroke: "#94a3b8" },
          labelStyle: {
            fill: "#475569",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "Inter, system-ui",
          },
          labelBgStyle: {
            fill: "#ffffff",
            stroke: "#e2e8f0",
            strokeWidth: 1,
          },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 6,
        })),
    // tick is included so edges created via addRelation re-render immediately.
    [visibleIds, tick]
  );

  // ReactFlow-owned node/edge state so drag positions stick across renders.
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Reconcile when the scheme changes or the scoped concept set shifts — keep
  // existing positions for ids that were already present so users don't lose
  // their manual arrangement on every tick bump.
  useEffect(() => {
    setNodes((current) => {
      const byId = new Map(current.map((n) => [n.id, n]));
      return initialNodes.map((n) => {
        const existing = byId.get(n.id);
        return existing
          ? { ...n, position: existing.position, selected: existing.selected }
          : n;
      });
    });
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Keep the ReactFlow selection in sync with the externally-controlled
  // selectedId (driven by the parent Editor + table / palette actions).
  useEffect(() => {
    setNodes((current) =>
      current.map((n) => ({ ...n, selected: n.id === selectedId }))
    );
  }, [selectedId, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={{ concept: ConceptNode }}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      onPaneClick={() => onSelect(null)}
      onNodeClick={(_e, n) => onSelect(n.id)}
      onNodeDoubleClick={(_e, n) => onNodeDoubleClick(n.id)}
      nodesDraggable
      onConnect={(conn) => {
        // Dragging from a node handle to another concept opens the relation
        // picker modal — which, on confirm, calls addRelation() in context
        // and the edge shows up on the canvas via the tick dep above.
        if (!conn.source || !conn.target) return;
        if (conn.source === conn.target) {
          toast({
            kind: "info",
            title: "Pick two different concepts",
            description: "Self-relations aren't supported yet.",
          });
          return;
        }
        if (!schemeId) {
          toast({
            kind: "info",
            title: "Select a scheme first",
            description:
              "Relations in Ontologia live inside a ConceptScheme (A-Box).",
          });
          return;
        }
        openRelationDraft({
          from: conn.source,
          to: conn.target,
          schemeId,
        });
      }}
      onEdgesDelete={(eds) => {
        // ReactFlow already removed them from its local state; mirror the
        // removal into our store and record one ChangeEvent per relation.
        eds.forEach((e) => {
          const event = deleteRelation(e.id);
          if (event) {
            toast({
              kind: "info",
              title: "Relation removed",
              description: String(e.label ?? event.summary),
            });
          }
        });
      }}
      // Selected edges are deletable via the Backspace / Delete key (xyflow
      // default). We could add a context menu later for discoverability.
      edgesFocusable
      edgesReconnectable={false}
      minZoom={0.2}
      maxZoom={2}
      defaultEdgeOptions={{ type: "smoothstep" }}
      proOptions={{ hideAttribution: false }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1.2}
        color="#cbd5e1"
      />
      <Controls
        showInteractive={false}
        position="bottom-right"
        className="!shadow-pop"
      />
    </ReactFlow>
  );
}

function Inspector({
  conceptId,
  ontologyId,
  onOpenHistory,
}: {
  conceptId: string;
  ontologyId: string;
  onOpenHistory: () => void;
}) {
  const { tick, openDeprecate, reactivateConcept, toast } = useApp();
  // Re-reading by id on every tick so mutations (deprecate, update, …) are
  // reflected — useMemo would memoise against the stale concept reference.
  void tick;
  const concept = allConcepts.find((c) => c.id === conceptId)!;
  const ontology = ontologies.find((o) => o.id === ontologyId) ?? ontologies[0];
  const conceptClass = allConceptClasses.find((c) => c.id === concept.classId);
  const scheme = allSchemes.find((s) => s.id === concept.schemeId);
  const lastChange = changeEvents.find((e) => e.id === concept.lastChangeId);
  const outgoing = allRelations.filter((r) => r.from === concept.id);
  const incoming = allRelations.filter((r) => r.to === concept.id);
  const replacedByConcept = concept.replacedBy
    ? allConcepts.find((c) => c.id === concept.replacedBy)
    : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-ink-100 px-4 py-3">
        {/* If a fake teammate is parked on this concept, surface a quick
            banner before the identity row so the user knows to coordinate. */}
        <div className="mb-2">
          <PresenceEditingBanner conceptId={concept.id} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Circle className="h-4 w-4 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold tracking-tight text-ink-900">
              {concept.name}
            </div>
            <div className="font-mono text-[11px] text-ink-400">
              {concept.id}
            </div>
          </div>
          <Link
            to={`/ontologies/${ontologyId}/concepts/${concept.id}`}
            title="Open full page"
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>
        {/* Class + scheme chips — what T-Box and A-Box this concept lives in */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {conceptClass && (
            <span
              className={clsx(
                "chip font-semibold ring-1",
                classSwatch(conceptClass)
              )}
              title={conceptClass.description}
            >
              <Layers className="h-2.5 w-2.5" />
              {conceptClass.name}
              {conceptClass.isImplicit && (
                <span className="ml-0.5 text-[9px] uppercase tracking-wider opacity-70">
                  implicit
                </span>
              )}
            </span>
          )}
          {scheme && (
            <span className="chip bg-ink-100 text-ink-600" title={scheme.description}>
              {scheme.name}
            </span>
          )}
          {concept.labels.altLabel.slice(0, 4).map((alt) => (
            <span
              key={`${alt.lang}:${alt.value}`}
              className="chip bg-ink-50 text-ink-500 text-[10px]"
              title={`Alternative label · ${alt.lang}`}
            >
              {alt.value}
              <span className="ml-0.5 text-[9px] uppercase tracking-wider opacity-60">
                {alt.lang}
              </span>
            </span>
          ))}
          {concept.labels.altLabel.length > 4 && (
            <span className="text-[10px] italic text-ink-400">
              +{concept.labels.altLabel.length - 4} more
            </span>
          )}
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-600">
          {concept.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1">
          <Link
            to={`/ontologies/${ontologyId}/concepts/${concept.id}`}
            className="btn-primary py-1 px-2 text-[11px]"
          >
            <Pencil className="h-3 w-3" />
            Open full page
          </Link>
          <button className="btn-secondary py-1 px-2 text-[11px]">
            <Copy className="h-3 w-3" />
            Duplicate
          </button>
          {concept.deprecated ? (
            <button
              onClick={() => {
                reactivateConcept(concept.id);
                toast({
                  kind: "success",
                  title: `Reactivated ${concept.name}`,
                });
              }}
              className="btn-secondary py-1 px-2 text-[11px]"
            >
              <RefreshCw className="h-3 w-3" />
              Reactivate
            </button>
          ) : (
            <button
              onClick={() => openDeprecate(concept.id)}
              className="btn-secondary py-1 px-2 text-[11px]"
              title="Mark as deprecated with optional replacement"
            >
              <Trash2 className="h-3 w-3" />
              Deprecate
            </button>
          )}
        </div>
        {/* Deprecation banner — surfaces the dct:isReplacedBy link and the
            human reason so downstream consumers know where to migrate. */}
        {concept.deprecated && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold">
              <Info className="h-3.5 w-3.5" />
              Deprecated
              {replacedByConcept && (
                <>
                  <span className="text-amber-700">· replaced by</span>
                  <Link
                    to={`/ontologies/${ontologyId}/concepts/${replacedByConcept.id}`}
                    className="font-semibold underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
                  >
                    {replacedByConcept.name}
                  </Link>
                </>
              )}
            </div>
            {concept.deprecationReason && (
              <p className="mt-1 italic text-amber-800/90">
                “{concept.deprecationReason}”
              </p>
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto scroll-thin">
        {/* Properties */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Properties ({concept.properties.length})
            </h3>
            <button className="text-[11px] font-semibold text-brand-700 hover:text-brand-800">
              + Add
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-ink-200">
            {concept.properties.map((p, i) => {
              const localized =
                !!p.localizedValues && p.localizedValues.length > 0;
              return (
                <div
                  key={p.key}
                  className={clsx(
                    "grid grid-cols-[1fr_1.4fr] items-center gap-3 px-3 py-2 text-[12px] font-mono",
                    i !== 0 && "border-t border-ink-100",
                    "hover:bg-ink-50"
                  )}
                  title={
                    localized
                      ? `${p.localizedValues!.length} language${
                          p.localizedValues!.length === 1 ? "" : "s"
                        }`
                      : undefined
                  }
                >
                  <span className="truncate font-semibold text-ink-800">
                    {p.key}
                    {localized && (
                      <span className="ml-1 rounded bg-brand-50 px-1 text-[9px] font-semibold uppercase tracking-wider text-brand-700">
                        i18n
                      </span>
                    )}
                  </span>
                  <span className="truncate text-ink-500">
                    {displayPropertyValue(
                      p,
                      ontology.defaultLanguage,
                      "en"
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Relations */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Relations
            </h3>
            <button className="text-[11px] font-semibold text-brand-700 hover:text-brand-800">
              + New relation
            </button>
          </div>
          <div className="space-y-1">
            {outgoing.map((r) => {
              const to = allConcepts.find((c) => c.id === r.to)!;
              const toClass = allConceptClasses.find((c) => c.id === to.classId);
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-[12px]"
                >
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10px]">
                    {r.label}
                  </span>
                  <ChevronRight className="h-3 w-3 text-ink-400" />
                  <span className="font-medium text-ink-800">{to.name}</span>
                  {toClass && (
                    <span
                      className={clsx(
                        "ml-auto chip text-[9.5px] ring-1",
                        classSwatch(toClass)
                      )}
                    >
                      {toClass.name}
                    </span>
                  )}
                </div>
              );
            })}
            {incoming.map((r) => {
              const from = allConcepts.find((c) => c.id === r.from)!;
              const fromClass = allConceptClasses.find(
                (c) => c.id === from.classId
              );
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-md border border-ink-200 bg-ink-50/50 px-2.5 py-1.5 text-[12px]"
                >
                  <span className="font-medium text-ink-800">{from.name}</span>
                  {fromClass && (
                    <span
                      className={clsx(
                        "chip text-[9.5px] ring-1",
                        classSwatch(fromClass)
                      )}
                    >
                      {fromClass.name}
                    </span>
                  )}
                  <ChevronRight className="h-3 w-3 text-ink-400" />
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10px]">
                    {r.label}
                  </span>
                  <span className="ml-auto text-[10px] italic text-ink-400">
                    inbound
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Last change */}
        {lastChange && (
          <section className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Last change
              </h3>
              <button
                onClick={onOpenHistory}
                className="text-[11px] font-semibold text-brand-700 hover:text-brand-800"
              >
                See history →
              </button>
            </div>
            <div className="rounded-lg border border-ink-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: lastChange.author.color }}
                >
                  {lastChange.author.initials}
                </div>
                <div className="min-w-0 flex-1 text-[12px]">
                  <span className="font-semibold text-ink-800">
                    {lastChange.author.name}
                  </span>
                  <span className="text-ink-500">
                    {" "}
                    · {timeAgo(lastChange.at)}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-ink-400">
                  {lastChange.id}
                </span>
              </div>
              {lastChange.message && (
                <p className="mt-1.5 text-[12px] text-ink-700">
                  {lastChange.message}
                </p>
              )}
              <p className="mt-1 text-[11px] text-ink-500">
                {lastChange.summary}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function HistoryPanel({
  onRevert,
  onTag,
}: {
  onRevert: (id: string) => void;
  onTag: (id: string) => void;
}) {
  const { tick, openDiff } = useApp();
  const [filter, setFilter] = useState<"all" | "concept" | "relation" | "tag">(
    "all"
  );
  const [tagDiffOpen, setTagDiffOpen] = useState(false);
  // Re-read events from the module-level store whenever tick bumps so newly
  // recorded events (create relation, deprecate, revert, …) show up live.
  const events = useMemo(
    () =>
      changeEvents.filter((e) => filter === "all" || e.entityKind === filter),
    [filter, tick]
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-ink-500" />
          <h3 className="text-sm font-semibold text-ink-900">Change history</h3>
          <span className="chip bg-ink-100 text-ink-600">
            {changeEvents.length}
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-ink-500">
          Every operation on this ontology. Click{" "}
          <Undo2 className="inline h-3 w-3" /> to revert.
        </p>
        <div className="mt-3 flex gap-1">
          {(["all", "concept", "relation", "tag"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-md px-2 py-1 text-[11px] font-medium capitalize",
                filter === f
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              )}
            >
              {f}
            </button>
          ))}
          <button className="ml-auto rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          onClick={() => setTagDiffOpen(true)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-ink-300 bg-white px-2 py-1.5 text-[11.5px] font-semibold text-ink-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
        >
          <GitCompare className="h-3 w-3" />
          Compare tags…
        </button>
      </div>

      <TagDiffModal open={tagDiffOpen} onClose={() => setTagDiffOpen(false)} />

      <ol className="min-h-0 flex-1 overflow-auto scroll-thin">
        {events.map((e, idx) => {
          const tagForEvent = tags.find((t) => t.changeEventId === e.id);
          return (
            <li
              key={e.id}
              onClick={() => openDiff(e.id)}
              className="group relative cursor-pointer px-4 py-3 hover:bg-ink-50/60"
              title="Click to view diff"
            >
              {idx !== events.length - 1 && (
                <span className="absolute left-[30px] top-[44px] bottom-[-8px] w-px bg-ink-200" />
              )}
              <div className="flex items-start gap-3">
                <div
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-4 ring-white"
                  style={{ background: e.author.color }}
                >
                  {e.author.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[12.5px]">
                    <span className="font-semibold text-ink-900">
                      {e.author.name.split(" ")[0]}
                    </span>
                    <span
                      className={clsx(
                        "chip text-[10px] font-semibold",
                        e.kind === "create" &&
                          "bg-emerald-50 text-emerald-700",
                        e.kind === "update" && "bg-sky-50 text-sky-700",
                        e.kind === "delete" && "bg-rose-50 text-rose-700",
                        e.kind === "revert" && "bg-amber-50 text-amber-700",
                        e.kind === "tag" && "bg-brand-50 text-brand-700",
                        e.kind === "bulk_import" &&
                          "bg-indigo-50 text-indigo-700"
                      )}
                    >
                      {e.kind === "bulk_import" ? "bulk import" : e.kind}
                    </span>
                    {tagForEvent && (
                      <span className="chip bg-brand-600 text-white">
                        <TagIcon className="h-2.5 w-2.5" />
                        {tagForEvent.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[12.5px] text-ink-800">
                    <span className="text-ink-500">{e.summary}</span>
                  </div>
                  {e.message && (
                    <p className="mt-1 rounded-md border border-ink-100 bg-white px-2 py-1 text-[11.5px] italic text-ink-600">
                      “{e.message}”
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-500">
                    <span>{timeAgo(e.at)}</span>
                    <span className="text-ink-300">·</span>
                    <span className="font-mono">{e.id}</span>
                    {e.revertsEventId && (
                      <>
                        <span className="text-ink-300">·</span>
                        <span className="font-mono text-amber-700">
                          reverts {e.revertsEventId}
                        </span>
                      </>
                    )}
                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onTag(e.id);
                        }}
                        title="Tag this change"
                        className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      >
                        <TagIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onRevert(e.id);
                        }}
                        title="Revert"
                        className="rounded-md p-1 text-ink-400 hover:bg-amber-100 hover:text-amber-700"
                      >
                        <Undo2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EmptyInspector() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <MousePointer2 className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink-800">
        Select a concept
      </h3>
      <p className="mt-1 max-w-xs text-xs text-ink-500">
        Click any node on the canvas to view its properties, relations, and
        change history.
      </p>
      <div className="mt-4 flex flex-col gap-1 text-[11px] text-ink-500">
        <div className="flex items-center gap-2">
          <kbd className="kbd">C</kbd> new concept
        </div>
        <div className="flex items-center gap-2">
          <kbd className="kbd">R</kbd> new relation
        </div>
        <div className="flex items-center gap-2">
          <kbd className="kbd">/</kbd> search
        </div>
      </div>
    </div>
  );
}

// Maps URL path segments to internal view identifiers. The sidebar uses
// plural "taxonomies"/"tables" for human readability, so translate those
// here when the user lands on one of those routes.
const URL_TO_VIEW: Record<string, EditorView> = {
  canvas: "canvas",
  tree: "tree",
  taxonomies: "tree",
  table: "table",
  tables: "table",
  schema: "schema",
};

export default function Editor() {
  const { id = "ont_cars" } = useParams();
  const ontology = ontologies.find((o) => o.id === id) ?? ontologies[0];
  const navigate = useNavigate();
  const location = useLocation();
  const { openExport, openPlayground } = useApp();

  // The view is the last path segment — "/ontologies/ont_cars/canvas" → "canvas".
  // If the user lands on the bare ontology URL we send them to the mode's
  // default view so the sidebar leaf highlights correctly.
  const lastSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const viewFromUrl = URL_TO_VIEW[lastSegment];
  const view: EditorView = viewFromUrl ?? MODE_META[ontology.mode].defaultView;

  const [selectedId, setSelectedId] = useState<string | null>("c_model_camry");
  const [rightPanel, setRightPanel] = useState<RightPanel>("inspector");
  const [rightOpen, setRightOpen] = useState(true);
  // Canvas mode — the user opens an ontology on the Schema view by default
  // (shows the T-Box as an ER-style diagram), and can flip to "Taxonomies" to
  // see concrete concepts inside the selected scheme (A-Box).
  const [canvasMode, setCanvasMode] = useState<"schema" | "taxonomies">(
    "schema"
  );
  const [selectedCanvasClassId, setSelectedCanvasClassId] =
    useState<string | null>(null);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [taggingId, setTaggingId] = useState<string | null>(null);
  // Selected taxonomy scheme for the tree view — defaults to the first scheme
  // that belongs to this ontology so the tree has something to show on open.
  const firstSchemeId = useMemo(
    () => allSchemes.find((s) => s.ontologyId === ontology.id)?.id ?? null,
    [ontology.id]
  );
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(
    firstSchemeId
  );

  // Count concepts per T-Box class, scoped to this ontology — used by the Schema view.
  const conceptCountByClass = useMemo(() => {
    const out: Record<string, number> = {};
    for (const c of allConcepts) {
      if (c.ontologyId !== ontology.id) continue;
      out[c.classId] = (out[c.classId] ?? 0) + 1;
    }
    return out;
  }, [ontology.id]);

  // Every scheme that hangs off this ontology — powers the canvas scheme
  // switcher so a taxonomist can flip between Model catalogue, Body styles,
  // Fuel types, Market segments and Manufacturing geography without leaving
  // the view.
  const schemesForCanvas = useMemo(
    () => allSchemes.filter((s) => s.ontologyId === ontology.id),
    [ontology.id]
  );

  // Legend on the canvas shows only the classes whose concepts are actually
  // visible in the selected scheme, so the chips match what's rendered.
  const legendClasses = useMemo(() => {
    const classesInOntology = allConceptClasses.filter(
      (c) => c.ontologyId === ontology.id
    );
    const usedClassIds = new Set(
      allConcepts
        .filter((c) =>
          selectedSchemeId
            ? c.schemeId === selectedSchemeId
            : c.ontologyId === ontology.id
        )
        .map((c) => c.classId)
    );
    return classesInOntology.filter((c) => usedClassIds.has(c.id));
  }, [ontology.id, selectedSchemeId]);

  // If someone lands on the bare "/ontologies/:id" URL, redirect them to the
  // explicit view route so the sidebar leaf highlights and the URL reflects
  // what's actually on screen.
  if (!viewFromUrl) {
    const defaultView = MODE_META[ontology.mode].defaultView;
    const defaultSegment = defaultView === "tree" ? "tree" : defaultView;
    return (
      <Navigate to={`/ontologies/${ontology.id}/${defaultSegment}`} replace />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Sub-toolbar — the view switcher that used to live here moved into
          the sidebar (sidebar tree: ontology → Canvas / Taxonomies / Tables
          / Schema). The New Concept / New Relation quick-actions also moved
          — concepts are created from the canvas (drag handle) or the "+"
          inside each taxonomy scheme, relations via drag-between-nodes. */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-ink-200 bg-white px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            placeholder="Search concepts…"
            className="w-56 rounded-lg border border-ink-200 bg-ink-50 py-1 pl-7 pr-2 text-[12px] placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="chip bg-emerald-50 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Saved · synced
          </span>
          <div className="flex -space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-semibold text-white">
              AD
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-[10px] font-semibold text-white">
              VL
            </div>
          </div>
          <div className="mx-1 h-5 w-px bg-ink-200" />
          <button
            onClick={() => setTaggingId("ce_12")}
            className="btn-secondary py-1 px-2 text-[12px]"
          >
            <TagIcon className="h-3.5 w-3.5" />
            Tag current state
          </button>
          <button
            onClick={() => openExport(ontology.id)}
            className="btn-secondary py-1 px-2 text-[12px]"
            title="Preview and download JSON-LD / SKOS / OWL / CSV"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => openPlayground(ontology.id)}
            className="btn-primary py-1 px-2 text-[12px]"
          >
            <Play className="h-3.5 w-3.5" />
            Run API query
          </button>
          {view !== "tree" && view !== "schema" && (
            <button
              onClick={() => setRightOpen((v) => !v)}
              className="ml-1 rounded-md p-1.5 text-ink-500 hover:bg-ink-100"
              title={rightOpen ? "Hide panel" : "Show panel"}
            >
              {rightOpen ? (
                <PanelRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Canvas + panels */}
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 bg-ink-50">
          {view === "tree" ? (
            <TaxonomyTreeView ontologyId={ontology.id} />
          ) : view === "schema" ? (
            <SchemaView
              ontologyId={ontology.id}
              mode={ontology.mode}
              conceptCountByClass={conceptCountByClass}
              onDismiss={() => {
                const d = MODE_META[ontology.mode].defaultView;
                navigate(`/ontologies/${ontology.id}/${d}`);
              }}
            />
          ) : view === "table" ? (
            <TableView
              ontologyId={ontology.id}
              selectedSchemeId={selectedSchemeId}
              onSchemeChange={setSelectedSchemeId}
              onOpenConcept={(cid) =>
                navigate(`/ontologies/${ontology.id}/concepts/${cid}`)
              }
            />
          ) : (
            <>
          {/* Ontology meta strip + scheme switcher */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
            <div className="pointer-events-auto inline-flex items-center gap-3 rounded-xl border border-ink-200 bg-white/90 px-3 py-2 shadow-card backdrop-blur">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-white">
                <GitCommit className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-900">
                  {ontology.name}
                  <span className="chip bg-ink-100 text-ink-600">
                    {ontology.tags[0] ?? "draft"}
                  </span>
                </div>
                <div className="text-[11px] text-ink-500">
                  {ontology.conceptCount} concepts · {ontology.relationCount}{" "}
                  relations · {timeAgo(ontology.lastChange)}
                </div>
              </div>
              <div className="ml-2 flex items-center gap-1">
                <button className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Scheme switcher — one ontology can hold many taxonomies, so the
                canvas always renders concepts from a single scheme at a time.
                Only shown in Taxonomies mode. */}
            {canvasMode === "taxonomies" && schemesForCanvas.length > 0 && (
              <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-xl border border-ink-200 bg-white/90 px-2 py-1.5 shadow-card backdrop-blur">
                <span className="px-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
                  Scheme
                </span>
                {schemesForCanvas.map((s) => {
                  const isActive = s.id === selectedSchemeId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSchemeId(s.id)}
                      className={clsx(
                        "rounded-md px-2 py-0.5 text-[11.5px] font-semibold transition-colors",
                        isActive
                          ? "bg-brand-600 text-white"
                          : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                      )}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Canvas mode toggle — Schema (T-Box, default) / Taxonomies (A-Box,
              scheme-scoped). Anchored top-right so it doesn't fight for space
              with the ontology meta strip on the top-left. */}
          <div className="pointer-events-none absolute right-4 top-4 z-10">
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white/90 px-2 py-1.5 shadow-card backdrop-blur">
              <span className="px-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
                View
              </span>
              <button
                onClick={() => setCanvasMode("schema")}
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-semibold transition-colors",
                  canvasMode === "schema"
                    ? "bg-ink-900 text-white"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
                title="T-Box — classes and relation types"
              >
                <Layers className="h-3 w-3" />
                Schema
              </button>
              <button
                onClick={() => setCanvasMode("taxonomies")}
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-semibold transition-colors",
                  canvasMode === "taxonomies"
                    ? "bg-ink-900 text-white"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
                title="A-Box — concrete concepts inside a scheme"
              >
                <ListTree className="h-3 w-3" />
                Taxonomies
              </button>
            </div>
          </div>

          {/* Legend — driven by the real ConceptClasses that are visible in
              the current scheme so the swatches match what's on the canvas.
              Taxonomies-mode only; the schema canvas shows class banners that
              are already colour-coded. */}
          {canvasMode === "taxonomies" && legendClasses.length > 0 && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10">
              <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-lg border border-ink-200 bg-white/90 px-3 py-1.5 text-[11px] shadow-card backdrop-blur">
                {legendClasses.map((c) => (
                  <span key={c.id} className="flex items-center gap-1.5">
                    <span
                      className={clsx(
                        "h-2 w-2 rounded-full",
                        CLASS_DOT[c.color ?? "ink"]
                      )}
                    />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schema-mode legend — explains the edge-style convention: built-in
              SKOS broader relations are dashed grey, user-defined relation
              types are solid purple. Also a small nudge that class cards are
              draggable so users reach for them to declutter the diagram. */}
          {canvasMode === "schema" && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10">
              <div className="pointer-events-auto flex flex-wrap items-center gap-4 rounded-lg border border-ink-200 bg-white/90 px-3 py-1.5 text-[11px] shadow-card backdrop-blur">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-5 bg-[#7c56fc]" />
                  User-defined relation
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-0 w-5 border-t border-dashed"
                    style={{ borderColor: "#94a3b8" }}
                  />
                  Built-in (SKOS broader)
                </span>
                <span className="text-ink-400">·</span>
                <span className="italic text-ink-500">
                  Drag class cards to reposition
                </span>
              </div>
            </div>
          )}

          {/* Keyed on canvasMode so flipping between Schema / Taxonomies
              cleanly unmounts the previous ReactFlow instance (with its
              stale node shape) instead of trying to reuse internal state. */}
          <ReactFlowProvider key={canvasMode}>
            {canvasMode === "schema" ? (
              <SchemaCanvas
                ontologyId={ontology.id}
                selectedClassId={selectedCanvasClassId}
                onSelect={setSelectedCanvasClassId}
              />
            ) : (
              <EditorCanvas
                ontologyId={ontology.id}
                schemeId={selectedSchemeId}
                selectedId={selectedId}
                // Single-click selects the concept and populates the
                // right-rail Inspector. Double-click opens the full detail
                // page for users who want the Overview / Properties /
                // Relations / History / Usage / AI tabs.
                onSelect={setSelectedId}
                onNodeDoubleClick={(cid) =>
                  navigate(`/ontologies/${ontology.id}/concepts/${cid}`)
                }
              />
            )}
          </ReactFlowProvider>
            </>
          )}
        </div>

        {/* Right panel — hidden in the Tree and Schema views, which have
            their own editor layout and don't want a second inspector
            (the schema view is pure T-Box editing, no selected concept). */}
        {rightOpen && view !== "tree" && view !== "schema" && (
          <aside className="flex w-[380px] shrink-0 flex-col border-l border-ink-200 bg-white">
            <div className="flex h-10 shrink-0 items-center gap-1 border-b border-ink-100 bg-ink-50/50 px-2">
              <button
                onClick={() => setRightPanel("inspector")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold",
                  rightPanel === "inspector"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <GripVertical className="h-3.5 w-3.5" />
                Inspector
              </button>
              <button
                onClick={() => setRightPanel("history")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold",
                  rightPanel === "history"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <History className="h-3.5 w-3.5" />
                History
                <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                  {changeEvents.length}
                </span>
              </button>
              <button
                onClick={() => setRightPanel("validation")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold",
                  rightPanel === "validation"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Validation
              </button>
              <button className="ml-auto rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {rightPanel === "inspector" &&
                // On the canvas in Schema mode we inspect the selected class
                // (T-Box). In Taxonomies mode (or any other view) we inspect
                // the selected concept (A-Box), same as before.
                (view === "canvas" && canvasMode === "schema" ? (
                  <ClassInspector
                    classId={selectedCanvasClassId}
                    ontologyId={ontology.id}
                  />
                ) : selectedId ? (
                  <Inspector
                    conceptId={selectedId}
                    ontologyId={ontology.id}
                    onOpenHistory={() => setRightPanel("history")}
                  />
                ) : (
                  <EmptyInspector />
                ))}
              {rightPanel === "history" && (
                <HistoryPanel
                  onRevert={(id) => setRevertingId(id)}
                  onTag={(id) => setTaggingId(id)}
                />
              )}
              {rightPanel === "validation" && (
                <ValidationPanel ontologyId={ontology.id} />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Modals */}
      <RevertModal
        eventId={revertingId}
        onClose={() => setRevertingId(null)}
      />
      <TagModal eventId={taggingId} onClose={() => setTaggingId(null)} />
    </div>
  );
}

function RevertModal({
  eventId,
  onClose,
}: {
  eventId: string | null;
  onClose: () => void;
}) {
  const event = changeEvents.find((e) => e.id === eventId);
  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Revert change"
      subtitle="Undo this change by creating a new, opposite change event. The original entry stays in the history for audit."
      width="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn-primary">
            <Undo2 className="h-3.5 w-3.5" />
            Revert change
          </button>
        </>
      }
    >
      {event && (
        <>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4" />
              Reverting is non-destructive
            </div>
            <p className="mt-1 text-amber-800/90">
              Ontologia records a new change event that inverts this one. Both
              will stay visible in the history with the same SHA trail.
            </p>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              You are reverting
            </div>
            <div className="mt-1.5 rounded-lg border border-ink-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: event.author.color }}
                >
                  {event.author.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink-900">
                    {event.author.name}{" "}
                    <span className="font-normal text-ink-500">
                      · {event.summary}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-500">
                    <span>{timeAgo(event.at)}</span>
                    <span className="text-ink-300">·</span>
                    <span className="font-mono">{event.id}</span>
                  </div>
                </div>
              </div>
              {event.message && (
                <p className="mt-2 text-[12px] italic text-ink-600">
                  “{event.message}”
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Revert message <span className="text-ink-400">(optional)</span>
            </label>
            <textarea
              className="input min-h-[72px] resize-y"
              placeholder="Why are you reverting this change?"
              defaultValue="Restoring Product.price as required — downstream RAG needs it non-null."
            />
          </div>
        </>
      )}
    </Modal>
  );
}

function TagModal({
  eventId,
  onClose,
}: {
  eventId: string | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("v1.3");
  const event = changeEvents.find((e) => e.id === eventId);
  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Tag this change"
      subtitle="Name a stable snapshot so downstream services can pin to it."
      width="max-w-md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn-primary">
            <TagIcon className="h-3.5 w-3.5" />
            Create tag
          </button>
        </>
      }
    >
      {event && (
        <>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Tag name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input font-mono"
              placeholder="v1.3"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Lowercase, digits, dots and hyphens. Must be unique per ontology.
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Description <span className="text-ink-400">(optional)</span>
            </label>
            <textarea
              className="input min-h-[64px] resize-y"
              placeholder="What changed since the last tag?"
              defaultValue="Adds Product.status enum and the Collection concept. Ready for the staging RAG pipeline."
            />
          </div>

          <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Pinning to
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ background: event.author.color }}
              >
                {event.author.initials}
              </div>
              <div className="min-w-0 text-[12.5px]">
                <span className="font-semibold text-ink-900">
                  {event.entityName}
                </span>{" "}
                <span className="text-ink-500">· {event.summary}</span>
              </div>
              <span className="ml-auto font-mono text-[11px] text-ink-400">
                {event.id}
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
