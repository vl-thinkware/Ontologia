import { useState } from "react";
import clsx from "clsx";
import {
  Plus,
  Trash2,
  Check,
  Circle,
  Sparkles,
  Link2,
  GripVertical,
  Info,
} from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import { concepts as allConcepts, type Concept } from "../data/mock";

type PropertyType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "date"
  | "reference"
  | "money";

type PropertyDraft = {
  id: string;
  key: string;
  type: PropertyType;
  required: boolean;
  hint?: string;
};

type RelationDraft = {
  id: string;
  targetConceptId: string;
  label: string;
};

const COLORS: NonNullable<Concept["color"]>[] = [
  "violet",
  "emerald",
  "amber",
  "sky",
  "rose",
];

const colorStyles: Record<
  NonNullable<Concept["color"]>,
  { bg: string; border: string; dot: string; text: string }
> = {
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-white",
    border: "border-violet-300",
    dot: "bg-violet-500",
    text: "text-violet-900",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-white",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-900",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-white",
    border: "border-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-900",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-white",
    border: "border-sky-300",
    dot: "bg-sky-500",
    text: "text-sky-900",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-white",
    border: "border-rose-300",
    dot: "bg-rose-500",
    text: "text-rose-900",
  },
};

const typeLabels: Record<PropertyType, string> = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  enum: "Enum",
  date: "Date",
  reference: "Reference",
  money: "Money",
};

const typeHints: Record<PropertyType, string> = {
  string: "text",
  number: "numeric",
  boolean: "true / false",
  enum: "one of …",
  date: "ISO-8601",
  reference: "Concept id",
  money: "amount + currency",
};

function nextId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function NewConceptModal() {
  const { newConceptOpen, closeNewConcept, toast } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<NonNullable<Concept["color"]>>("violet");
  const [properties, setProperties] = useState<PropertyDraft[]>([
    { id: nextId(), key: "name", type: "string", required: true, hint: "required, unique" },
    { id: nextId(), key: "description", type: "string", required: false },
  ]);
  const [relations, setRelations] = useState<RelationDraft[]>([]);

  function reset() {
    setName("");
    setDescription("");
    setColor("violet");
    setProperties([
      { id: nextId(), key: "name", type: "string", required: true, hint: "required, unique" },
      { id: nextId(), key: "description", type: "string", required: false },
    ]);
    setRelations([]);
  }

  function close() {
    closeNewConcept();
    setTimeout(reset, 200);
  }

  function addProperty() {
    setProperties((p) => [
      ...p,
      { id: nextId(), key: "", type: "string", required: false },
    ]);
  }

  function updateProperty(id: string, patch: Partial<PropertyDraft>) {
    setProperties((p) =>
      p.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );
  }

  function removeProperty(id: string) {
    setProperties((p) => p.filter((x) => x.id !== id));
  }

  function addRelation() {
    setRelations((r) => [
      ...r,
      {
        id: nextId(),
        targetConceptId: allConcepts[0]?.id ?? "",
        label: "belongsTo",
      },
    ]);
  }

  function updateRelation(id: string, patch: Partial<RelationDraft>) {
    setRelations((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function removeRelation(id: string) {
    setRelations((r) => r.filter((x) => x.id !== id));
  }

  function submit() {
    const resolvedName = name.trim() || "Untitled concept";
    toast({
      kind: "success",
      title: `Concept "${resolvedName}" created`,
      description: `${properties.length} properties, ${relations.length} relations. Added to E-commerce catalogue.`,
      action: {
        label: "View in history",
        onClick: () => {
          /* mock */
        },
      },
    });
    close();
  }

  const preview = colorStyles[color];

  return (
    <Modal
      open={newConceptOpen}
      onClose={close}
      title="Create a new concept"
      subtitle="Define how this entity shows up in the taxonomy. You can always edit it later."
      width="max-w-4xl"
      footer={
        <>
          <div className="mr-auto flex items-center gap-2 text-[11.5px] text-ink-500">
            <Info className="h-3.5 w-3.5" />
            Creating this concept will add one <code>create</code> change event.
          </div>
          <button onClick={close} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="btn-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Create concept
          </button>
        </>
      }
    >
      <div className="grid grid-cols-[1.4fr_1fr] gap-6">
        {/* Left: editable form */}
        <div className="space-y-5">
          {/* Basics */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Basics
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold text-ink-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Order, Customer, Campaign…"
                  className="input"
                />
                <p className="mt-1 text-[11px] text-ink-500">
                  UpperCamelCase is conventional. Must be unique per ontology.
                </p>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold text-ink-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this concept represent?"
                  className="input min-h-[64px] resize-y"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-semibold text-ink-700">
                  Color
                </label>
                <div className="flex items-center gap-1.5">
                  {COLORS.map((c) => {
                    const st = colorStyles[c];
                    const picked = c === color;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={clsx(
                          "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                          st.border,
                          st.bg,
                          picked
                            ? "ring-4 ring-brand-500/25 scale-105"
                            : "hover:scale-105"
                        )}
                        title={c}
                      >
                        <span className={clsx("h-3 w-3 rounded-full", st.dot)} />
                        {picked && (
                          <Check className="absolute h-3 w-3 text-ink-900 opacity-0" />
                        )}
                      </button>
                    );
                  })}
                  <span className="ml-2 text-[11.5px] text-ink-500 capitalize">
                    {color}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Properties */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Properties ({properties.length})
              </h3>
              <button
                onClick={addProperty}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-700 hover:text-brand-800"
              >
                <Plus className="h-3 w-3" />
                Add property
              </button>
            </div>
            <div className="mt-2 overflow-hidden rounded-lg border border-ink-200">
              <div className="grid grid-cols-[auto_1.3fr_1fr_auto_auto] items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                <span className="w-4" />
                <span>Key</span>
                <span>Type</span>
                <span>Required</span>
                <span className="w-6" />
              </div>
              {properties.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[auto_1.3fr_1fr_auto_auto] items-center gap-2 border-b border-ink-100 px-2 py-1.5 last:border-b-0 hover:bg-ink-50/40"
                >
                  <GripVertical className="h-3.5 w-3.5 cursor-grab text-ink-300" />
                  <input
                    value={p.key}
                    onChange={(e) =>
                      updateProperty(p.id, { key: e.target.value })
                    }
                    placeholder="propertyName"
                    className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 font-mono text-[12px] focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  />
                  <select
                    value={p.type}
                    onChange={(e) =>
                      updateProperty(p.id, {
                        type: e.target.value as PropertyType,
                      })
                    }
                    className="rounded-md border border-ink-200 bg-white px-1.5 py-1 text-[11.5px] focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  >
                    {Object.entries(typeLabels).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <label className="flex cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      checked={p.required}
                      onChange={(e) =>
                        updateProperty(p.id, { required: e.target.checked })
                      }
                      className="h-3.5 w-3.5 accent-brand-600"
                    />
                  </label>
                  <button
                    onClick={() => removeProperty(p.id)}
                    className="rounded-md p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="px-3 py-4 text-center text-[11.5px] text-ink-500">
                  No properties yet.{" "}
                  <button
                    onClick={addProperty}
                    className="font-semibold text-brand-700"
                  >
                    Add one →
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 rounded-md border border-brand-200 bg-brand-50/60 px-3 py-2 text-[11.5px] text-brand-900">
              <span className="inline-flex items-center gap-1 font-semibold">
                <Sparkles className="h-3 w-3" />
                AI suggestion
              </span>{" "}
              Based on the name, we suggest adding{" "}
              <code className="rounded bg-white px-1">status</code>,{" "}
              <code className="rounded bg-white px-1">createdAt</code> — click
              "Add property" to start.
            </div>
          </section>

          {/* Relations */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Relations ({relations.length})
              </h3>
              <button
                onClick={addRelation}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-700 hover:text-brand-800"
              >
                <Plus className="h-3 w-3" />
                Add relation
              </button>
            </div>
            <div className="mt-2 space-y-1.5">
              {relations.length === 0 ? (
                <div className="rounded-lg border border-dashed border-ink-300 bg-ink-50/60 p-4 text-center text-[11.5px] text-ink-500">
                  Connect this concept to others to define the taxonomy graph.
                  <br />
                  <button
                    onClick={addRelation}
                    className="mt-1 font-semibold text-brand-700"
                  >
                    Add your first relation →
                  </button>
                </div>
              ) : (
                relations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-2 py-1.5"
                  >
                    <Link2 className="h-3.5 w-3.5 text-ink-400" />
                    <input
                      value={r.label}
                      onChange={(e) =>
                        updateRelation(r.id, { label: e.target.value })
                      }
                      placeholder="relationName"
                      className="w-28 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 font-mono text-[11.5px] focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    />
                    <span className="text-ink-400">→</span>
                    <select
                      value={r.targetConceptId}
                      onChange={(e) =>
                        updateRelation(r.id, {
                          targetConceptId: e.target.value,
                        })
                      }
                      className="flex-1 rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[11.5px] focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                    >
                      {allConcepts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeRelation(r.id)}
                      className="rounded-md p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right: live preview */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Live preview
          </h3>
          <div className="mt-2 rounded-xl border border-ink-200 bg-ink-50 p-5">
            <div
              className={clsx(
                "mx-auto w-60 rounded-xl border-2 shadow-card",
                preview.bg,
                preview.border
              )}
            >
              <div className="flex items-center gap-2 border-b border-black/5 px-3 py-2">
                <span
                  className={clsx("h-2 w-2 shrink-0 rounded-full", preview.dot)}
                />
                <div
                  className={clsx(
                    "truncate text-[13px] font-semibold tracking-tight",
                    preview.text
                  )}
                >
                  {name.trim() || "Untitled"}
                </div>
                <div className="ml-auto font-mono text-[10px] text-ink-400">
                  new
                </div>
              </div>
              <ul className="px-3 py-2 text-[11px] font-mono">
                {properties.slice(0, 4).map((p) => (
                  <li
                    key={p.id}
                    className="flex items-baseline justify-between gap-2 py-0.5 leading-snug"
                  >
                    <span className="font-semibold text-ink-700">
                      {p.key || "—"}
                      {p.required && (
                        <span className="ml-0.5 text-red-500">*</span>
                      )}
                    </span>
                    <span className="truncate text-ink-500">
                      {typeHints[p.type]}
                    </span>
                  </li>
                ))}
                {properties.length > 4 && (
                  <li className="pt-0.5 text-[10px] italic text-ink-400">
                    +{properties.length - 4} more
                  </li>
                )}
                {properties.length === 0 && (
                  <li className="py-0.5 text-[10px] italic text-ink-400">
                    No properties
                  </li>
                )}
              </ul>
            </div>

            {description && (
              <p className="mt-3 rounded-md border border-ink-200 bg-white p-2 text-[11.5px] leading-snug text-ink-600">
                {description}
              </p>
            )}

            {relations.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
                  Outgoing relations
                </div>
                {relations.map((r) => {
                  const target = allConcepts.find(
                    (c) => c.id === r.targetConceptId
                  );
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-1.5 text-[11.5px]"
                    >
                      <Circle className="h-2 w-2 fill-current text-ink-400" />
                      <span className="font-mono text-ink-600">{r.label}</span>
                      <span className="text-ink-400">→</span>
                      <span className="font-medium text-ink-800">
                        {target?.name ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 rounded-lg border border-ink-200 bg-white p-3 text-[11.5px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink-800">Destination</span>
              <span className="chip bg-ink-100 text-ink-700">
                E-commerce catalogue
              </span>
            </div>
            <div className="mt-1 text-ink-500">
              Change event will be authored by{" "}
              <span className="font-semibold text-ink-700">Valentin Lemort</span>
              .
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
