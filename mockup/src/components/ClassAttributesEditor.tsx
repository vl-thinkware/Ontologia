import { useState } from "react";
import clsx from "clsx";
import {
  Languages,
  BookOpen,
  Tag as TagIcon,
  EyeOff,
  Hash,
  Plus,
  Trash2,
  Info,
  Check,
  X,
  ChevronDown,
  Type,
  FileText,
  ListChecks,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import type { ClassProperty, ConceptClass } from "../data/mock";

// -----------------------------------------------------------------------------
// ClassAttributesEditor — shows everything that an instance of this class will
// carry. Top section documents the SKOS-inspired built-in attributes that
// every concept gets for free; bottom section is the editable custom
// properties array stored on the ConceptClass.
// -----------------------------------------------------------------------------

// The six built-in attribute slots that every Concept has by virtue of being
// a SKOS Concept — not stored on the class but always rendered in the editor
// so users understand what their instances will carry.
const SKOS_BUILTINS: Array<{
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  cardinality: string;
  languageAware: boolean;
}> = [
  {
    key: "prefLabel",
    label: "Preferred label",
    description:
      "The canonical display name. At most one per language — it's what shows in trees, chips and exports.",
    icon: TagIcon,
    cardinality: "1 per language",
    languageAware: true,
  },
  {
    key: "altLabel",
    label: "Alternative labels",
    description:
      "Synonyms, acronyms, variant spellings surfaced in search and side-by-side views.",
    icon: Languages,
    cardinality: "many per language",
    languageAware: true,
  },
  {
    key: "hiddenLabel",
    label: "Hidden labels",
    description:
      "Search-only matches (misspellings, legacy codes, internal names). Never shown as a display label.",
    icon: EyeOff,
    cardinality: "many per language",
    languageAware: true,
  },
  {
    key: "definition",
    label: "Definition",
    description:
      "The authoritative meaning of the concept. Multilingual — one entry per language.",
    icon: BookOpen,
    cardinality: "1 per language",
    languageAware: true,
  },
  {
    key: "notation",
    label: "Notation",
    description:
      "A stable machine-friendly code (SKU, ISO code, enum value). Language-neutral.",
    icon: Hash,
    cardinality: "0..1",
    languageAware: false,
  },
  {
    key: "example",
    label: "Example",
    description:
      "Free-text illustrative usage, surfaced in the concept detail page next to the definition.",
    icon: FileText,
    cardinality: "0..many",
    languageAware: true,
  },
];

const VALUE_TYPES: Array<{
  id: ClassProperty["valueType"];
  label: string;
  hint: string;
}> = [
  { id: "string", label: "string", hint: "free text" },
  { id: "number", label: "number", hint: "integer or decimal" },
  { id: "boolean", label: "boolean", hint: "true / false" },
  { id: "enum", label: "enum", hint: "pick from a list" },
  { id: "date", label: "date", hint: "ISO 8601" },
  { id: "reference", label: "reference", hint: "pointer to another concept" },
  { id: "money", label: "money", hint: "amount + currency" },
];

export default function ClassAttributesEditor({
  cls,
  onClose,
}: {
  cls: ConceptClass;
  onClose?: () => void;
}) {
  const { updateConceptClass, toast } = useApp();
  const props = cls.properties ?? [];
  const [adding, setAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  function persistProperties(next: ClassProperty[], summary: string) {
    updateConceptClass({
      id: cls.id,
      patch: { properties: next },
      message: summary,
    });
  }

  function removeProperty(key: string) {
    const next = props.filter((p) => p.key !== key);
    persistProperties(next, `Removed attribute "${key}"`);
    toast({
      kind: "info",
      title: `Attribute removed`,
      description: `"${key}" is no longer part of ${cls.name}.`,
    });
  }

  function saveProperty(draft: ClassProperty, originalKey?: string) {
    if (!draft.key.trim()) {
      toast({
        kind: "error",
        title: "Attribute key is required",
      });
      return;
    }
    const keyExists = props.some(
      (p) => p.key === draft.key && p.key !== originalKey
    );
    if (keyExists) {
      toast({
        kind: "error",
        title: `Key "${draft.key}" already exists on ${cls.name}`,
      });
      return;
    }
    let next: ClassProperty[];
    if (originalKey) {
      next = props.map((p) => (p.key === originalKey ? draft : p));
      persistProperties(next, `Edited attribute "${draft.key}"`);
    } else {
      next = [...props, draft];
      persistProperties(next, `Added attribute "${draft.key}"`);
    }
    toast({
      kind: "success",
      title: originalKey ? `Attribute updated` : `Attribute created`,
      description: `${draft.key} · ${draft.valueType}`,
    });
    setAdding(false);
    setEditingKey(null);
  }

  return (
    <div className="space-y-5">
      {onClose && (
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Editing class
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            title="Collapse"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Class identity — name + description inline editable */}
      <ClassIdentityForm cls={cls} />

      {/* Built-in SKOS attributes */}
      <section>
        <header className="mb-2 flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Built-in attributes
          </div>
          <span
            className="chip bg-violet-50 text-violet-700"
            title="Every SKOS Concept carries these out of the box."
          >
            SKOS-aligned
          </span>
          <Info className="h-3 w-3 text-ink-400" />
          <span className="text-[11px] text-ink-500">
            Present on every instance of <code>{cls.name}</code>
          </span>
        </header>
        <ul className="overflow-hidden rounded-lg border border-ink-200">
          {SKOS_BUILTINS.map((b, i) => {
            const Icon = b.icon;
            return (
              <li
                key={b.key}
                className={clsx(
                  "flex items-start gap-3 px-3 py-2.5",
                  i !== 0 && "border-t border-ink-100",
                  "bg-gradient-to-r from-violet-50/40 to-white"
                )}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <code className="text-[12.5px] font-semibold text-ink-900">
                      {b.key}
                    </code>
                    <span className="text-[12px] text-ink-600">
                      — {b.label}
                    </span>
                    <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                      {b.cardinality}
                    </span>
                    {b.languageAware && (
                      <span className="chip bg-brand-50 text-brand-700 text-[10px]">
                        <Languages className="h-2.5 w-2.5" />
                        per language
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-ink-600">
                    {b.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Custom attributes */}
      <section>
        <header className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Custom attributes
            </div>
            <span className="chip bg-ink-100 text-ink-600">{props.length}</span>
          </div>
          <button
            onClick={() => {
              setAdding(true);
              setEditingKey(null);
            }}
            className="btn-secondary py-1 px-2 text-[11.5px]"
          >
            <Plus className="h-3 w-3" />
            Add attribute
          </button>
        </header>

        <ul className="space-y-1.5">
          {props.length === 0 && !adding && (
            <li className="rounded-lg border border-dashed border-ink-300 bg-white px-3 py-4 text-center text-[12px] text-ink-500">
              No custom attributes yet — add fields specific to{" "}
              <span className="font-semibold">{cls.name}</span> (e.g. SKU, ISO
              code, rating).
            </li>
          )}
          {props.map((p) => {
            const isEditing = editingKey === p.key;
            return (
              <li key={p.key}>
                {isEditing ? (
                  <PropertyForm
                    initial={p}
                    onCancel={() => setEditingKey(null)}
                    onSave={(d) => saveProperty(d, p.key)}
                  />
                ) : (
                  <PropertyRow
                    p={p}
                    onEdit={() => {
                      setEditingKey(p.key);
                      setAdding(false);
                    }}
                    onDelete={() => removeProperty(p.key)}
                  />
                )}
              </li>
            );
          })}
          {adding && (
            <li>
              <PropertyForm
                initial={{
                  key: "",
                  valueType: "string",
                  required: false,
                  localizable: false,
                }}
                onCancel={() => setAdding(false)}
                onSave={(d) => saveProperty(d)}
              />
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

// -- Class identity (name + description) ---------------------------------------

function ClassIdentityForm({ cls }: { cls: ConceptClass }) {
  const { updateConceptClass, toast } = useApp();
  const [name, setName] = useState(cls.name);
  const [description, setDescription] = useState(cls.description ?? "");
  const [color, setColor] = useState<NonNullable<ConceptClass["color"]>>(
    cls.color ?? "ink"
  );

  const dirty =
    name.trim() !== cls.name ||
    description.trim() !== (cls.description ?? "") ||
    color !== (cls.color ?? "ink");

  function save() {
    if (!name.trim()) {
      toast({ kind: "error", title: "Class name is required" });
      return;
    }
    updateConceptClass({
      id: cls.id,
      patch: {
        name: name.trim(),
        label: name.trim(),
        description: description.trim(),
        color,
      },
      message: `Edited class "${name.trim()}"`,
    });
    toast({ kind: "success", title: `Class "${name.trim()}" saved` });
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_max-content]">
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Class name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[13px] font-semibold focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Colour
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            {(
              ["violet", "emerald", "amber", "sky", "rose", "ink"] as const
            ).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={clsx(
                  "h-6 w-6 rounded-full border-2 transition-transform",
                  color === c
                    ? "border-ink-900 scale-110"
                    : "border-transparent",
                  c === "violet" && "bg-violet-500",
                  c === "emerald" && "bg-emerald-500",
                  c === "amber" && "bg-amber-500",
                  c === "sky" && "bg-sky-500",
                  c === "rose" && "bg-rose-500",
                  c === "ink" && "bg-ink-500"
                )}
                title={c}
              />
            ))}
          </div>
        </label>
      </div>
      <label className="mt-3 block">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-500">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What kind of thing is this class? How will it be used?"
          className="mt-1 min-h-[60px] w-full resize-y rounded-md border border-ink-200 bg-white px-2 py-1.5 text-[12.5px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </label>
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="text-[11px] text-ink-500">
          <code>{cls.id}</code>
        </span>
        <button
          disabled={!dirty}
          onClick={save}
          className={clsx(
            "btn-primary py-1 px-2 text-[11.5px]",
            !dirty && "cursor-not-allowed opacity-60"
          )}
        >
          <Check className="h-3 w-3" />
          Save identity
        </button>
      </div>
    </div>
  );
}

// -- Single property row (read-only display) ----------------------------------

function PropertyRow({
  p,
  onEdit,
  onDelete,
}: {
  p: ClassProperty;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-200 bg-white px-3 py-2.5 hover:border-brand-300 hover:bg-brand-50/30">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-600">
        <Type className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <code className="text-[12.5px] font-semibold text-ink-900">
            {p.key}
          </code>
          <span className="chip bg-ink-100 text-ink-700 font-mono text-[10px]">
            {p.valueType}
          </span>
          {p.required && (
            <span className="chip bg-rose-50 text-rose-700 text-[10px]">
              required
            </span>
          )}
          {p.localizable && (
            <span className="chip bg-brand-50 text-brand-700 text-[10px]">
              <Languages className="h-2.5 w-2.5" />
              i18n
            </span>
          )}
          {p.hint && (
            <span className="text-[10.5px] italic text-ink-400">
              {p.hint}
            </span>
          )}
        </div>
        {p.description && (
          <p className="mt-0.5 text-[11.5px] text-ink-600">{p.description}</p>
        )}
        {p.valueType === "enum" && p.enumValues && p.enumValues.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <ListChecks className="h-3 w-3 text-ink-400" />
            {p.enumValues.map((v) => (
              <span
                key={v}
                className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-700"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onEdit}
          className="rounded-md px-2 py-1 text-[11px] font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1 text-ink-400 hover:bg-rose-50 hover:text-rose-700"
          title="Remove attribute"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// -- Property form (add + edit) -----------------------------------------------

function PropertyForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ClassProperty;
  onSave: (p: ClassProperty) => void;
  onCancel: () => void;
}) {
  const [key, setKey] = useState(initial.key);
  const [valueType, setValueType] = useState<ClassProperty["valueType"]>(
    initial.valueType
  );
  const [required, setRequired] = useState(initial.required);
  const [localizable, setLocalizable] = useState(initial.localizable);
  const [description, setDescription] = useState(initial.description ?? "");
  const [hint, setHint] = useState(initial.hint ?? "");
  const [enumValuesRaw, setEnumValuesRaw] = useState(
    (initial.enumValues ?? []).join(", ")
  );

  return (
    <div className="rounded-lg border-2 border-brand-400 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_max-content_max-content]">
        <label className="block">
          <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
            Key
          </span>
          <input
            autoFocus
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. horsepower"
            className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block">
          <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
            Type
          </span>
          <div className="relative mt-0.5">
            <select
              value={valueType}
              onChange={(e) =>
                setValueType(e.target.value as ClassProperty["valueType"])
              }
              className="appearance-none rounded-md border border-ink-200 bg-white px-2 py-1 pr-7 text-[12.5px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {VALUE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-400" />
          </div>
        </label>
        <div className="flex items-end gap-3 pb-1 text-[11.5px] text-ink-600">
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            Required
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={localizable}
              onChange={(e) => setLocalizable(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <Languages className="h-3 w-3" />
            Localizable
          </label>
        </div>
      </div>

      <label className="mt-2 block">
        <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
          Description
        </span>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional — what does this attribute capture?"
          className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <label className="mt-2 block">
        <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
          Hint
        </span>
        <input
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional — e.g. “HP”, “ISO 4217”, “integer, required”"
          className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </label>

      {valueType === "enum" && (
        <label className="mt-2 block">
          <span className="block text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
            Enum values
          </span>
          <input
            value={enumValuesRaw}
            onChange={(e) => setEnumValuesRaw(e.target.value)}
            placeholder="comma-separated, e.g. active, draft, archived"
            className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        <button onClick={onCancel} className="btn-ghost py-1 px-2 text-[11.5px]">
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              key: key.trim(),
              valueType,
              required,
              localizable,
              description: description.trim() || undefined,
              hint: hint.trim() || undefined,
              enumValues:
                valueType === "enum"
                  ? enumValuesRaw
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  : undefined,
            })
          }
          className="btn-primary py-1 px-2 text-[11.5px]"
        >
          <Check className="h-3 w-3" />
          Save attribute
        </button>
      </div>
    </div>
  );
}
