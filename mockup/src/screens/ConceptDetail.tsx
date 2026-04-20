import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  Pencil,
  Check,
  Plus,
  Tag as TagIcon,
  History,
  Share2,
  Undo2,
  FileDown,
  Link2,
  MoreHorizontal,
  Sparkles,
  Eye,
  Hash,
  CalendarClock,
  Clock,
  UserCircle2,
  GitCommit,
  Info,
  X,
} from "lucide-react";
import {
  concepts as allConcepts,
  relations as allRelations,
  changeEvents,
  ontologies,
  type Concept,
} from "../data/mock";
import { useApp } from "../app/AppContext";

const colorStyles: Record<
  NonNullable<Concept["color"]>,
  { bg: string; border: string; dot: string; text: string; soft: string }
> = {
  violet: {
    bg: "bg-gradient-to-br from-violet-100 to-violet-50",
    border: "border-violet-300",
    dot: "bg-violet-500",
    text: "text-violet-900",
    soft: "bg-violet-50 text-violet-700",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-100 to-emerald-50",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-900",
    soft: "bg-emerald-50 text-emerald-700",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-100 to-amber-50",
    border: "border-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-900",
    soft: "bg-amber-50 text-amber-700",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-100 to-sky-50",
    border: "border-sky-300",
    dot: "bg-sky-500",
    text: "text-sky-900",
    soft: "bg-sky-50 text-sky-700",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-100 to-rose-50",
    border: "border-rose-300",
    dot: "bg-rose-500",
    text: "text-rose-900",
    soft: "bg-rose-50 text-rose-700",
  },
};

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

type Tab = "overview" | "properties" | "relations" | "history" | "usage";

export default function ConceptDetail() {
  const { id: ontologyId = "ont_ecom", conceptId = "c_product" } = useParams();
  const navigate = useNavigate();
  const { toast } = useApp();

  const ontology = ontologies.find((o) => o.id === ontologyId) ?? ontologies[0];
  const concept =
    allConcepts.find((c) => c.id === conceptId) ?? allConcepts[0];
  const color = colorStyles[concept.color ?? "violet"];

  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(concept.name);
  const [description, setDescription] = useState(concept.description);

  const [properties, setProperties] = useState(
    concept.properties.map((p, i) => ({ ...p, id: `p_${i}` }))
  );

  const outgoing = allRelations.filter((r) => r.from === concept.id);
  const incoming = allRelations.filter((r) => r.to === concept.id);
  const localHistory = useMemo(
    () =>
      changeEvents.filter(
        (e) => e.entityId === concept.id || e.entityName === concept.name
      ),
    [concept.id, concept.name]
  );

  function saveEdits() {
    setEditing(false);
    toast({
      kind: "success",
      title: "Concept updated",
      description: `Saved changes to "${name}". One change event recorded.`,
    });
  }

  function duplicate() {
    toast({
      kind: "success",
      title: `Duplicated as "${concept.name} copy"`,
      description: "All properties and relations copied.",
    });
  }

  function deleteConcept() {
    toast({
      kind: "info",
      title: `"${concept.name}" deleted`,
      description: "You can restore it from the change history.",
      action: {
        label: "Undo",
        onClick: () => {
          toast({
            kind: "success",
            title: "Deletion reverted",
            description: "Concept restored at its last state.",
          });
        },
      },
    });
    navigate(`/ontologies/${ontologyId}`);
  }

  function copyId() {
    navigator.clipboard?.writeText(concept.id).catch(() => {});
    toast({
      kind: "success",
      title: "Concept ID copied",
      description: concept.id,
    });
  }

  function addProperty() {
    setProperties((p) => [
      ...p,
      { id: `p_${Date.now()}`, key: "", value: "string" },
    ]);
    setEditing(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-ink-200 bg-white">
        {/* breadcrumbs + actions row */}
        <div className="flex items-center gap-2 border-b border-ink-100 px-6 py-2 text-xs">
          <Link
            to={`/ontologies/${ontology.id}`}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to canvas
          </Link>
          <span className="text-ink-300">/</span>
          <Link
            to="/dashboard"
            className="text-ink-500 hover:text-ink-800"
          >
            Ontologies
          </Link>
          <ChevronRight className="h-3 w-3 text-ink-300" />
          <Link
            to={`/ontologies/${ontology.id}`}
            className="text-ink-500 hover:text-ink-800"
          >
            {ontology.name}
          </Link>
          <ChevronRight className="h-3 w-3 text-ink-300" />
          <span className="font-semibold text-ink-900">{concept.name}</span>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={copyId}
              className="btn-ghost py-1 px-2 text-[11.5px]"
            >
              <Copy className="h-3 w-3" />
              Copy ID
            </button>
            <button className="btn-ghost py-1 px-2 text-[11.5px]">
              <Share2 className="h-3 w-3" />
              Share
            </button>
            <button className="btn-ghost py-1 px-2 text-[11.5px]">
              <FileDown className="h-3 w-3" />
              Export
            </button>
            <button
              onClick={duplicate}
              className="btn-secondary py-1 px-2 text-[11.5px]"
            >
              <Copy className="h-3 w-3" />
              Duplicate
            </button>
            <button
              onClick={deleteConcept}
              className="btn-danger py-1 px-2 text-[11.5px]"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>

        {/* title row */}
        <div className="flex items-start gap-4 px-6 pb-4 pt-5">
          <div
            className={clsx(
              "flex h-14 w-14 items-center justify-center rounded-xl border-2",
              color.bg,
              color.border
            )}
          >
            <span className={clsx("h-3 w-3 rounded-full", color.dot)} />
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-brand-300 bg-brand-50/30 px-2 py-1 text-2xl font-bold tracking-tight text-ink-900 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input min-h-[60px] resize-y text-sm"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-ink-900">
                    {name}
                  </h1>
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10.5px]">
                    {concept.id}
                  </span>
                  <span className={clsx("chip", color.soft)}>
                    {concept.color}
                  </span>
                </div>
                <p className="mt-1.5 max-w-3xl text-sm text-ink-600">
                  {description}
                </p>
              </>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-ink-500">
              <span className="inline-flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {properties.length} properties
              </span>
              <span className="inline-flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                {outgoing.length + incoming.length} relations ({outgoing.length}{" "}
                out / {incoming.length} in)
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {timeAgo(concept.lastChangeId === "ce_10" ? "2026-04-19T15:42:00Z" : "2026-04-15T10:11:00Z")}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Referenced by 3 API consumers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(concept.name);
                    setDescription(concept.description);
                  }}
                  className="btn-secondary"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button onClick={saveEdits} className="btn-primary">
                  <Check className="h-3.5 w-3.5" />
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="btn-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* tabs */}
        <nav className="flex items-center gap-1 border-t border-ink-100 px-4">
          {([
            { id: "overview", label: "Overview", icon: Eye },
            { id: "properties", label: "Properties", icon: Hash, count: properties.length },
            { id: "relations", label: "Relations", icon: Link2, count: outgoing.length + incoming.length },
            { id: "history", label: "History", icon: History, count: localHistory.length },
            { id: "usage", label: "Usage", icon: Sparkles },
          ] as const).map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsx(
                  "relative flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "text-brand-700"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
                {"count" in t && t.count !== undefined && (
                  <span
                    className={clsx(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      active
                        ? "bg-brand-100 text-brand-700"
                        : "bg-ink-100 text-ink-500"
                    )}
                  >
                    {t.count}
                  </span>
                )}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-auto bg-ink-50">
        <div className="mx-auto max-w-6xl px-6 py-6">
          {tab === "overview" && (
            <OverviewTab
              concept={concept}
              properties={properties}
              outgoing={outgoing}
              incoming={incoming}
              localHistory={localHistory}
              color={color}
              setTab={setTab}
            />
          )}
          {tab === "properties" && (
            <PropertiesTab
              properties={properties}
              setProperties={setProperties}
              addProperty={addProperty}
              toast={toast}
            />
          )}
          {tab === "relations" && (
            <RelationsTab
              outgoing={outgoing}
              incoming={incoming}
              concept={concept}
              toast={toast}
            />
          )}
          {tab === "history" && (
            <HistoryTab localHistory={localHistory} toast={toast} />
          )}
          {tab === "usage" && <UsageTab concept={concept} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  concept,
  properties,
  outgoing,
  incoming,
  localHistory,
  color,
  setTab,
}: {
  concept: Concept;
  properties: Array<{ id: string; key: string; value: string }>;
  outgoing: Array<{ id: string; from: string; to: string; label: string }>;
  incoming: Array<{ id: string; from: string; to: string; label: string }>;
  localHistory: typeof changeEvents;
  color: (typeof colorStyles)[NonNullable<Concept["color"]>];
  setTab: (t: Tab) => void;
}) {
  const lastChange = localHistory[0];
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        {/* Key stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Properties"
            value={properties.length.toString()}
            icon={Hash}
          />
          <StatCard
            label="Outgoing relations"
            value={outgoing.length.toString()}
            icon={Link2}
          />
          <StatCard
            label="Incoming relations"
            value={incoming.length.toString()}
            icon={Link2}
          />
          <StatCard
            label="Change events"
            value={localHistory.length.toString()}
            icon={History}
          />
        </div>

        {/* Properties preview */}
        <section className="card">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Properties</h3>
              <p className="text-xs text-ink-500">
                Top {Math.min(4, properties.length)} of {properties.length}
              </p>
            </div>
            <button
              onClick={() => setTab("properties")}
              className="btn-ghost py-1 px-2 text-[11.5px]"
            >
              Manage all
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div>
            {properties.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className={clsx(
                  "grid grid-cols-[1fr_1.4fr_auto] items-center gap-3 px-5 py-2.5 text-[12.5px]",
                  i !== 0 && "border-t border-ink-100"
                )}
              >
                <span className="font-mono font-semibold text-ink-800">
                  {p.key}
                </span>
                <span className="font-mono text-ink-500">{p.value}</span>
                <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                  {p.value.includes("required") ? "required" : "optional"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Relations preview */}
        <section className="card">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <div>
              <h3 className="text-sm font-semibold text-ink-900">Relations</h3>
              <p className="text-xs text-ink-500">
                {outgoing.length} outgoing · {incoming.length} incoming
              </p>
            </div>
            <button
              onClick={() => setTab("relations")}
              className="btn-ghost py-1 px-2 text-[11.5px]"
            >
              Manage all
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              {outgoing.slice(0, 5).map((r) => {
                const to = allConcepts.find((c) => c.id === r.to)!;
                return (
                  <Link
                    key={r.id}
                    to={`/ontologies/${r.to === concept.id ? "ont_ecom" : "ont_ecom"}/concepts/${to.id}`}
                    className="group flex items-center gap-1.5 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3 text-[12px] transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span
                      className={clsx(
                        "flex h-5 w-5 items-center justify-center rounded-full",
                        color.soft
                      )}
                    >
                      <span className={clsx("h-1.5 w-1.5 rounded-full", color.dot)} />
                    </span>
                    <span className="font-mono text-[10.5px] text-ink-500 group-hover:text-brand-700">
                      {r.label}
                    </span>
                    <ChevronRight className="h-3 w-3 text-ink-400" />
                    <span className="font-semibold text-ink-800 group-hover:text-brand-800">
                      {to.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-ink-900">Details</h3>
          <dl className="mt-3 space-y-2 text-[12px]">
            <MetaRow icon={Hash} label="ID" value={concept.id} mono />
            <MetaRow icon={GitCommit} label="Ontology" value="E-commerce catalogue" />
            <MetaRow
              icon={UserCircle2}
              label="Created by"
              value="Valentin Lemort"
            />
            <MetaRow
              icon={CalendarClock}
              label="Created"
              value="April 11, 2026"
            />
            <MetaRow
              icon={Clock}
              label="Last updated"
              value={lastChange ? timeAgo(lastChange.at) : "—"}
            />
          </dl>
        </div>

        {lastChange && (
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">Last change</h3>
              <button
                onClick={() => setTab("history")}
                className="text-[11.5px] font-semibold text-brand-700 hover:text-brand-800"
              >
                See all →
              </button>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ background: lastChange.author.color }}
              >
                {lastChange.author.initials}
              </div>
              <div className="min-w-0 flex-1 text-[12.5px]">
                <span className="font-semibold text-ink-800">
                  {lastChange.author.name}
                </span>
                <p className="text-[11.5px] text-ink-500">
                  {lastChange.summary} · {timeAgo(lastChange.at)}
                </p>
                {lastChange.message && (
                  <p className="mt-1 rounded-md border border-ink-100 bg-ink-50 px-2 py-1 text-[11.5px] italic text-ink-700">
                    "{lastChange.message}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-brand-900">
            <Sparkles className="h-3.5 w-3.5" />
            AI suggestions
          </h3>
          <ul className="mt-2 space-y-2 text-[11.5px] text-brand-900/90">
            <li className="flex items-start gap-1.5">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
              Consider adding a <code className="rounded bg-white px-1">createdAt</code>{" "}
              timestamp property for audit trails.
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
              9 other ontologies reference a similar concept — want to link?
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-ink-400" />
      </div>
      <div className="mt-1.5 text-xl font-bold tracking-tight text-ink-900">
        {value}
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 shrink-0 text-ink-400" />
      <dt className="w-24 shrink-0 text-[11.5px] text-ink-500">{label}</dt>
      <dd
        className={clsx(
          "min-w-0 flex-1 truncate text-[12.5px] text-ink-800",
          mono && "font-mono"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function PropertiesTab({
  properties,
  setProperties,
  addProperty,
  toast,
}: {
  properties: Array<{ id: string; key: string; value: string }>;
  setProperties: React.Dispatch<
    React.SetStateAction<Array<{ id: string; key: string; value: string }>>
  >;
  addProperty: () => void;
  toast: (t: { kind: "success" | "info" | "error"; title: string; description?: string }) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">Properties</h3>
          <p className="text-xs text-ink-500">
            Schema for every instance of this concept.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn-ghost text-[11.5px]">
            <FileDown className="h-3 w-3" />
            Export schema
          </button>
          <button onClick={addProperty} className="btn-primary text-[11.5px]">
            <Plus className="h-3 w-3" />
            Add property
          </button>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-ink-50/60 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          <tr>
            <th className="px-5 py-2 text-left">Key</th>
            <th className="px-5 py-2 text-left">Definition</th>
            <th className="px-5 py-2 text-left">Required</th>
            <th className="px-5 py-2 text-left">Default</th>
            <th className="w-0 px-5" />
          </tr>
        </thead>
        <tbody>
          {properties.map((p, i) => {
            const req = p.value.includes("required");
            return (
              <tr
                key={p.id}
                className={clsx(
                  i !== 0 && "border-t border-ink-100",
                  "hover:bg-ink-50/40"
                )}
              >
                <td className="px-5 py-2.5">
                  {editingId === p.id ? (
                    <input
                      autoFocus
                      value={p.key}
                      onChange={(e) =>
                        setProperties((props) =>
                          props.map((x) =>
                            x.id === p.id ? { ...x, key: e.target.value } : x
                          )
                        )
                      }
                      className="w-full rounded-md border border-brand-300 bg-white px-2 py-1 font-mono text-[12.5px] focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="font-mono text-[12.5px] font-semibold text-ink-900"
                    >
                      {p.key}
                    </button>
                  )}
                </td>
                <td className="px-5 py-2.5 font-mono text-[11.5px] text-ink-600">
                  {p.value}
                </td>
                <td className="px-5 py-2.5">
                  <span
                    className={clsx(
                      "chip text-[10px]",
                      req
                        ? "bg-red-50 text-red-700"
                        : "bg-ink-100 text-ink-600"
                    )}
                  >
                    {req ? "required" : "optional"}
                  </span>
                </td>
                <td className="px-5 py-2.5 font-mono text-[11.5px] text-ink-500">
                  —
                </td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <button
                      onClick={() => {
                        if (editingId === p.id) {
                          setEditingId(null);
                          toast({
                            kind: "success",
                            title: `Property "${p.key}" updated`,
                          });
                        } else {
                          setEditingId(p.id);
                        }
                      }}
                      className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    >
                      {editingId === p.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Pencil className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setProperties((props) =>
                          props.filter((x) => x.id !== p.id)
                        );
                        toast({
                          kind: "info",
                          title: `Property "${p.key}" removed`,
                        });
                      }}
                      className="rounded-md p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function RelationsTab({
  outgoing,
  incoming,
  concept,
  toast,
}: {
  outgoing: Array<{ id: string; from: string; to: string; label: string }>;
  incoming: Array<{ id: string; from: string; to: string; label: string }>;
  concept: Concept;
  toast: (t: { kind: "success" | "info" | "error"; title: string; description?: string }) => void;
}) {
  const [newLabel, setNewLabel] = useState("ownedBy");
  const [newTarget, setNewTarget] = useState(
    allConcepts.find((c) => c.id !== concept.id)?.id ?? ""
  );

  return (
    <div className="space-y-5">
      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">
              Add a relation
            </h3>
            <p className="text-xs text-ink-500">
              Connect <strong>{concept.name}</strong> to another concept in this
              ontology.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto_1.4fr_auto] items-center gap-3 p-5">
          <span className="rounded-md border border-ink-200 bg-ink-50 px-3 py-1.5 text-[12.5px] font-semibold text-ink-800">
            {concept.name}
          </span>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="relationName"
            className="input font-mono text-[12.5px]"
          />
          <ChevronRight className="h-4 w-4 text-ink-400" />
          <select
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            className="input text-[12.5px]"
          >
            {allConcepts
              .filter((c) => c.id !== concept.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          <button
            onClick={() => {
              const target = allConcepts.find((c) => c.id === newTarget);
              toast({
                kind: "success",
                title: `Relation added`,
                description: `${concept.name} -[${newLabel}]-> ${target?.name ?? "?"}`,
              });
            }}
            className="btn-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-ink-900">
            Outgoing ({outgoing.length})
          </h3>
          <span className="text-[11px] text-ink-500">
            Relations from{" "}
            <span className="font-semibold text-ink-700">{concept.name}</span>
          </span>
        </div>
        <RelationTable
          rows={outgoing.map((r) => ({
            id: r.id,
            label: r.label,
            other: allConcepts.find((c) => c.id === r.to)!,
            direction: "out" as const,
          }))}
          toast={toast}
        />
      </section>

      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-ink-900">
            Incoming ({incoming.length})
          </h3>
          <span className="text-[11px] text-ink-500">
            Other concepts pointing at{" "}
            <span className="font-semibold text-ink-700">{concept.name}</span>
          </span>
        </div>
        <RelationTable
          rows={incoming.map((r) => ({
            id: r.id,
            label: r.label,
            other: allConcepts.find((c) => c.id === r.from)!,
            direction: "in" as const,
          }))}
          toast={toast}
        />
      </section>
    </div>
  );
}

function RelationTable({
  rows,
  toast,
}: {
  rows: Array<{
    id: string;
    label: string;
    other: Concept;
    direction: "in" | "out";
  }>;
  toast: (t: { kind: "success" | "info" | "error"; title: string; description?: string }) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="px-5 py-6 text-center text-[12.5px] text-ink-500">
        No relations in this direction yet.
      </div>
    );
  }
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={r.id}
            className={clsx(
              i !== 0 && "border-t border-ink-100",
              "hover:bg-ink-50/40"
            )}
          >
            <td className="px-5 py-2.5">
              <span className="chip bg-ink-100 text-ink-700 font-mono text-[10.5px]">
                {r.label}
              </span>
            </td>
            <td className="px-5 py-2.5">
              <Link
                to={`/ontologies/ont_ecom/concepts/${r.other.id}`}
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-900 hover:text-brand-700"
              >
                <span
                  className={clsx(
                    "h-2 w-2 rounded-full",
                    colorStyles[r.other.color ?? "violet"].dot
                  )}
                />
                {r.other.name}
              </Link>
            </td>
            <td className="px-5 py-2.5 text-[11.5px] text-ink-500">
              {r.direction === "out" ? "Outgoing" : "Incoming"}
            </td>
            <td className="px-5 py-2.5 text-right">
              <button
                onClick={() =>
                  toast({
                    kind: "info",
                    title: "Relation removed",
                    description: `${r.label} no longer connects these concepts.`,
                  })
                }
                className="rounded-md p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HistoryTab({
  localHistory,
  toast,
}: {
  localHistory: typeof changeEvents;
  toast: (t: { kind: "success" | "info" | "error"; title: string; description?: string; action?: { label: string; onClick: () => void } }) => void;
}) {
  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">
            Change history for this concept
          </h3>
          <p className="text-xs text-ink-500">
            {localHistory.length} events — newest first
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              toast({
                kind: "success",
                title: "Tag created",
                description: "v1.3 pinned to the latest change event.",
              })
            }
            className="btn-secondary text-[11.5px]"
          >
            <TagIcon className="h-3 w-3" />
            Tag current state
          </button>
        </div>
      </div>
      <ol className="divide-y divide-ink-100">
        {localHistory.map((e) => (
          <li key={e.id} className="flex items-start gap-3 px-5 py-4">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
              style={{ background: e.author.color }}
            >
              {e.author.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[13px]">
                <span className="font-semibold text-ink-900">
                  {e.author.name}
                </span>
                <span
                  className={clsx(
                    "chip text-[10px]",
                    e.kind === "create" && "bg-emerald-50 text-emerald-700",
                    e.kind === "update" && "bg-sky-50 text-sky-700",
                    e.kind === "delete" && "bg-rose-50 text-rose-700",
                    e.kind === "revert" && "bg-amber-50 text-amber-700",
                    e.kind === "tag" && "bg-brand-50 text-brand-700",
                    e.kind === "bulk_import" && "bg-indigo-50 text-indigo-700"
                  )}
                >
                  {e.kind === "bulk_import" ? "bulk import" : e.kind}
                </span>
                <span className="font-mono text-[10.5px] text-ink-400">
                  {e.id}
                </span>
                <span className="ml-auto text-[11.5px] text-ink-500">
                  {timeAgo(e.at)}
                </span>
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-700">
                {e.summary}
              </div>
              {e.message && (
                <p className="mt-1.5 rounded-md border border-ink-100 bg-ink-50/70 px-3 py-1.5 text-[12px] italic text-ink-700">
                  "{e.message}"
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() =>
                    toast({
                      kind: "success",
                      title: `Change ${e.id} reverted`,
                      description: "A new revert event was recorded.",
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-ink-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  <Undo2 className="h-3 w-3" />
                  Revert
                </button>
                <button
                  onClick={() =>
                    toast({
                      kind: "success",
                      title: "Tag created",
                      description: `Pinned to change event ${e.id}.`,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                >
                  <TagIcon className="h-3 w-3" />
                  Tag
                </button>
                <button className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-800">
                  <MoreHorizontal className="h-3 w-3" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function UsageTab({ concept }: { concept: Concept }) {
  const downstream = [
    {
      id: "cons_rag",
      name: "RAG pipeline (production)",
      type: "Service",
      lastSync: "5 minutes ago",
      references: 1248,
      owner: "Alexandre Delplace",
    },
    {
      id: "cons_dash",
      name: "Analytics dashboard",
      type: "Service",
      lastSync: "1 hour ago",
      references: 842,
      owner: "Marie Dupont",
    },
    {
      id: "cons_sales",
      name: "Sales agent prompt",
      type: "Prompt template",
      lastSync: "3 hours ago",
      references: 17,
      owner: "Valentin Lemort",
    },
  ];
  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900">
              {concept.name} is referenced by 3 downstream consumers
            </h3>
            <p className="mt-0.5 text-xs text-ink-600">
              Ontologia tracks every API consumer pulling this concept so you
              know the blast radius before making breaking changes.
            </p>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-ink-900">
            Downstream consumers
          </h3>
          <button className="btn-ghost text-[11.5px]">
            <FileDown className="h-3 w-3" />
            Export list
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-ink-50/60 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-2 text-left">Consumer</th>
              <th className="px-5 py-2 text-left">Type</th>
              <th className="px-5 py-2 text-left">Owner</th>
              <th className="px-5 py-2 text-left">References</th>
              <th className="px-5 py-2 text-left">Last sync</th>
            </tr>
          </thead>
          <tbody>
            {downstream.map((d, i) => (
              <tr
                key={d.id}
                className={i !== 0 ? "border-t border-ink-100" : ""}
              >
                <td className="px-5 py-3 text-[12.5px] font-semibold text-ink-900">
                  {d.name}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {d.type}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {d.owner}
                </td>
                <td className="px-5 py-3 font-mono text-[12px] text-ink-800">
                  {d.references.toLocaleString()}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {d.lastSync}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-5">
        <h3 className="text-sm font-semibold text-ink-900">
          Recent API queries
        </h3>
        <p className="mt-0.5 text-xs text-ink-500">
          Last 7 days, via server-side API keys.
        </p>
        <div className="mt-4 space-y-1.5">
          {[
            { verb: "GET", path: `/v1/concepts/${concept.id}`, count: 4218, pct: 88 },
            { verb: "GET", path: `/v1/concepts/${concept.id}/relations`, count: 892, pct: 34 },
            { verb: "PATCH", path: `/v1/concepts/${concept.id}`, count: 14, pct: 4 },
          ].map((row) => (
            <div
              key={row.path}
              className="rounded-lg border border-ink-200 bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "chip font-mono text-[10.5px]",
                    row.verb === "GET"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  )}
                >
                  {row.verb}
                </span>
                <code className="font-mono text-[12px] text-ink-800">
                  {row.path}
                </code>
                <span className="ml-auto font-mono text-[11.5px] text-ink-600">
                  {row.count.toLocaleString()} calls
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
