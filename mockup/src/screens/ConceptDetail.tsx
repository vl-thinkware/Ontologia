import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  ChevronRight,
  Copy,
  Trash2,
  Pencil,
  Check,
  Plus,
  Tag as TagIcon,
  History,
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
  Layers,
  Folder,
  Languages as LanguagesIcon,
  Globe,
  Type,
  FileText,
  EyeOff,
} from "lucide-react";
import {
  concepts as allConcepts,
  relations as allRelations,
  changeEvents,
  ontologies,
  conceptClasses as allConceptClasses,
  conceptSchemes as allSchemes,
  LANGUAGE_NAMES,
  pickLang,
  isLocalizedValue,
  type Concept,
  type ArtefactMode,
  type ClassProperty,
  type ConceptPropertyValue,
  type LangTag,
} from "../data/mock";
import { useApp } from "../app/AppContext";
import AiSuggestionsPanel from "../components/AiSuggestionsPanel";
import { PresenceEditingBanner } from "../components/PresenceOverlay";

// Mirrors Editor / Dashboard visual language for artefact modes.
const MODE_PILL: Record<ArtefactMode, string> = {
  glossary: "bg-violet-100 text-violet-700",
  taxonomy: "bg-emerald-100 text-emerald-700",
  ontology: "bg-sky-100 text-sky-700",
};
const MODE_LABEL: Record<ArtefactMode, string> = {
  glossary: "Glossary",
  taxonomy: "Taxonomy",
  ontology: "Ontology",
};

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

type Tab =
  | "overview"
  | "properties"
  | "relations"
  | "history"
  | "usage"
  | "ai";

// Optional props let ConceptDetail be embedded (e.g. inside the Taxonomies
// tree's center pane) without changing the URL. When absent, we fall back to
// the route params — the route use-case stays identical to before.
type ConceptDetailProps = {
  ontologyId?: string;
  conceptId?: string;
};

export default function ConceptDetail({
  ontologyId: ontologyIdProp,
  conceptId: conceptIdProp,
}: ConceptDetailProps = {}) {
  const params = useParams();
  const ontologyId = ontologyIdProp ?? params.id ?? "ont_cars";
  const conceptId = conceptIdProp ?? params.conceptId ?? "c_model_camry";
  const {
    toast,
    tick,
    updateConcept,
    openDeprecate,
    reactivateConcept,
    openExport,
  } = useApp();
  void tick; // re-read concept after mutations

  const ontology = ontologies.find((o) => o.id === ontologyId) ?? ontologies[0];
  const concept =
    allConcepts.find((c) => c.id === conceptId) ?? allConcepts[0];
  const color = colorStyles[concept.color ?? "violet"];
  const conceptClass = allConceptClasses.find((c) => c.id === concept.classId);
  const scheme = allSchemes.find((s) => s.id === concept.schemeId);

  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(concept.name);
  const [description, setDescription] = useState(concept.description);

  // Languages currently visible in the side-by-side view. Defaults to every
  // language configured on the ontology, but the user can narrow via chips.
  const [visibleLangs, setVisibleLangs] = useState<LangTag[]>(
    ontology.languages
  );

  type PropRow = ConceptPropertyValue & { id: string };
  const [properties, setProperties] = useState<PropRow[]>(
    concept.properties.map((p, i) => ({ ...p, id: `p_${i}` }))
  );

  // When embedded inside the Taxonomies tree, the same ConceptDetail instance
  // is reused across different concepts — the route version doesn't hit this
  // because React Router remounts on URL changes. Reset the draft state and
  // close any in-progress edit whenever the concept id changes.
  useEffect(() => {
    setEditing(false);
    setName(concept.name);
    setDescription(concept.description);
    setProperties(
      concept.properties.map((p, i) => ({ ...p, id: `p_${i}` }))
    );
    setVisibleLangs(ontology.languages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concept.id]);

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
    // Persist the canonical name + description into the store and record a
    // ChangeEvent. We also sync the primary prefLabel in the ontology's
    // default language so SKOS export matches what taxonomists typed.
    const defaultLang = ontology.defaultLanguage ?? "en";
    const nextPref = concept.labels.prefLabel.slice();
    const prefIdx = nextPref.findIndex((l) => l.lang === defaultLang);
    if (prefIdx >= 0) {
      nextPref[prefIdx] = { ...nextPref[prefIdx], value: name };
    } else {
      nextPref.push({ lang: defaultLang, value: name });
    }
    const nextDefs = concept.definitions.slice();
    const defIdx = nextDefs.findIndex((d) => d.lang === defaultLang);
    if (defIdx >= 0) {
      nextDefs[defIdx] = { ...nextDefs[defIdx], value: description };
    } else if (nextDefs.length > 0) {
      nextDefs[0] = { ...nextDefs[0], value: description };
    } else {
      nextDefs.push({ lang: defaultLang, value: description });
    }
    updateConcept({
      id: concept.id,
      patch: {
        name,
        description,
        labels: { ...concept.labels, prefLabel: nextPref },
        definitions: nextDefs,
      },
      message: `Edited ${name}`,
    });
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
      { id: `p_${Date.now()}`, key: "", value: "" },
    ]);
    setEditing(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-ink-200 bg-white">
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
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-ink-900">
                    {name}
                  </h1>
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10.5px]">
                    {concept.id}
                  </span>
                  {conceptClass && (
                    <span
                      className={clsx("chip font-semibold", color.soft)}
                      title={conceptClass.description}
                    >
                      class · {conceptClass.name}
                      {conceptClass.isImplicit && (
                        <span className="ml-0.5 text-[9px] uppercase tracking-wider opacity-70">
                          implicit
                        </span>
                      )}
                    </span>
                  )}
                  <span
                    className={clsx("chip", MODE_PILL[ontology.mode])}
                    title={`This concept lives in a ${MODE_LABEL[ontology.mode].toLowerCase()} artefact.`}
                  >
                    {MODE_LABEL[ontology.mode]}
                  </span>
                  {scheme && (
                    <span
                      className="chip bg-ink-100 text-ink-600"
                      title={scheme.description}
                    >
                      {scheme.name}
                    </span>
                  )}
                </div>
                {concept.labels.altLabel.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-ink-500">
                    <span className="font-semibold uppercase tracking-wider text-ink-400">
                      Also known as
                    </span>
                    {concept.labels.altLabel
                      .filter((alt) => alt.lang === ontology.defaultLanguage)
                      .slice(0, 6)
                      .map((alt) => (
                        <span
                          key={`${alt.lang}:${alt.value}`}
                          className="chip bg-ink-50 text-ink-600"
                          title={`Alternative label · ${LANGUAGE_NAMES[alt.lang]}`}
                        >
                          {alt.value}
                        </span>
                      ))}
                    {ontology.languages.length > 1 && (
                      <span
                        className="chip bg-brand-50 text-brand-700 font-semibold"
                        title="Switch to the Overview tab for the side-by-side multilingual view."
                      >
                        <LanguagesIcon className="h-2.5 w-2.5" />
                        {ontology.languages.length} languages
                      </span>
                    )}
                  </div>
                )}
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

          <div className="flex shrink-0 items-center gap-1">
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
              <>
                <button
                  onClick={copyId}
                  className="btn-ghost py-1.5 px-2 text-[11.5px]"
                  title="Copy concept id"
                >
                  <Copy className="h-3 w-3" />
                  Copy ID
                </button>
                <button
                  onClick={() => openExport(ontology.id)}
                  className="btn-ghost py-1.5 px-2 text-[11.5px]"
                  title="Open the export format picker — this concept is part of the ontology export"
                >
                  <FileDown className="h-3 w-3" />
                  Export
                </button>
                <button
                  onClick={duplicate}
                  className="btn-secondary py-1.5 px-2 text-[11.5px]"
                >
                  <Copy className="h-3 w-3" />
                  Duplicate
                </button>
                {concept.deprecated ? (
                  <button
                    onClick={() => {
                      reactivateConcept(concept.id);
                      toast({
                        kind: "success",
                        title: `Reactivated "${concept.name}"`,
                      });
                    }}
                    className="btn-secondary py-1.5 px-2 text-[11.5px]"
                    title="Bring this concept back to active status"
                  >
                    <Undo2 className="h-3 w-3" />
                    Reactivate
                  </button>
                ) : (
                  <button
                    onClick={() => openDeprecate(concept.id)}
                    className="btn-danger py-1.5 px-2 text-[11.5px]"
                    title="Mark as deprecated with optional replacement concept"
                  >
                    <Trash2 className="h-3 w-3" />
                    Deprecate
                  </button>
                )}
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Presence banner */}
        <div className="mx-6 mb-3">
          <PresenceEditingBanner conceptId={concept.id} />
        </div>

        {/* Deprecation banner */}
        {concept.deprecated && (
          <div className="mx-6 mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-900">
            <div className="flex flex-wrap items-center gap-1.5 font-semibold">
              <Info className="h-3.5 w-3.5" />
              This concept is deprecated.
              {concept.replacedBy && (
                <>
                  <span className="text-amber-700">Use</span>
                  <Link
                    to={`/ontologies/${ontology.id}/concepts/${concept.replacedBy}`}
                    className="font-semibold underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
                  >
                    {allConcepts.find((c) => c.id === concept.replacedBy)?.name ??
                      concept.replacedBy}
                  </Link>
                  <span className="text-amber-700">instead.</span>
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

        {/* tabs */}
        <nav className="flex items-center gap-1 border-t border-ink-100 px-4">
          {([
            { id: "overview", label: "Overview", icon: Eye },
            { id: "properties", label: "Properties", icon: Hash, count: properties.length },
            { id: "relations", label: "Relations", icon: Link2, count: outgoing.length + incoming.length },
            { id: "history", label: "History", icon: History, count: localHistory.length },
            { id: "usage", label: "Usage", icon: Eye },
            { id: "ai", label: "AI", icon: Sparkles },
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
              conceptClass={conceptClass}
              properties={properties}
              outgoing={outgoing}
              incoming={incoming}
              localHistory={localHistory}
              color={color}
              setTab={setTab}
              ontologyName={ontology.name}
              ontologyLanguages={ontology.languages}
              defaultLanguage={ontology.defaultLanguage}
              visibleLangs={visibleLangs}
              setVisibleLangs={setVisibleLangs}
              className={conceptClass?.name ?? "—"}
              schemeName={scheme?.name ?? "—"}
            />
          )}
          {tab === "properties" && (
            <PropertiesTab
              properties={properties}
              setProperties={setProperties}
              addProperty={addProperty}
              conceptClass={conceptClass}
              ontologyLanguages={ontology.languages}
              defaultLanguage={ontology.defaultLanguage}
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
          {tab === "ai" && (
            <AiSuggestionsPanel
              conceptId={concept.id}
              ontologyId={ontology.id}
              layout="card"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  concept,
  conceptClass,
  properties,
  outgoing,
  incoming,
  localHistory,
  color,
  setTab,
  ontologyName,
  ontologyLanguages,
  defaultLanguage,
  visibleLangs,
  setVisibleLangs,
  className,
  schemeName,
}: {
  concept: Concept;
  conceptClass: ReturnType<typeof allConceptClasses.find>;
  properties: Array<ConceptPropertyValue & { id: string }>;
  outgoing: Array<{ id: string; from: string; to: string; label: string }>;
  incoming: Array<{ id: string; from: string; to: string; label: string }>;
  localHistory: typeof changeEvents;
  color: (typeof colorStyles)[NonNullable<Concept["color"]>];
  setTab: (t: Tab) => void;
  ontologyName: string;
  ontologyLanguages: LangTag[];
  defaultLanguage: LangTag;
  visibleLangs: LangTag[];
  setVisibleLangs: (l: LangTag[]) => void;
  className: string;
  schemeName: string;
}) {
  const lastChange = localHistory[0];
  const localizableProps = (conceptClass?.properties ?? []).filter(
    (p) => p.localizable
  );
  const plainProps = (conceptClass?.properties ?? []).filter(
    (p) => !p.localizable
  );
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

        {/* Side-by-side multilingual content: SKOS labels + definition + localizable attributes */}
        <MultilingualCard
          concept={concept}
          properties={properties}
          localizableProps={localizableProps}
          ontologyLanguages={ontologyLanguages}
          defaultLanguage={defaultLanguage}
          visibleLangs={visibleLangs}
          setVisibleLangs={setVisibleLangs}
        />

        {/* Market-agnostic attributes — plain values that don't vary per country */}
        {plainProps.length > 0 && (
          <section className="card">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">
                  Market-agnostic attributes
                </h3>
                <p className="text-xs text-ink-500">
                  Custom properties that stay the same across every language.
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
              {plainProps.map((schema, i) => {
                const val = properties.find((p) => p.key === schema.key);
                return (
                  <div
                    key={schema.key}
                    className={clsx(
                      "grid grid-cols-[1.1fr_1.4fr_auto] items-center gap-3 px-5 py-2.5 text-[12.5px]",
                      i !== 0 && "border-t border-ink-100"
                    )}
                  >
                    <span className="font-mono font-semibold text-ink-800">
                      {schema.key}
                    </span>
                    <span className="font-mono text-ink-600">
                      {val?.value ?? (
                        <span className="italic text-ink-400">—</span>
                      )}
                    </span>
                    <span
                      className={clsx(
                        "chip text-[10px]",
                        schema.required
                          ? "bg-red-50 text-red-700"
                          : "bg-ink-100 text-ink-600"
                      )}
                    >
                      {schema.required ? "required" : "optional"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
                    to={`/ontologies/${r.to === concept.id ? "ont_cars" : "ont_cars"}/concepts/${to.id}`}
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
            <MetaRow icon={GitCommit} label="Ontology" value={ontologyName} />
            <MetaRow icon={Layers} label="Class (T-Box)" value={className} />
            <MetaRow icon={Folder} label="Scheme (A-Box)" value={schemeName} />
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
  conceptClass,
  ontologyLanguages,
  defaultLanguage,
  toast,
}: {
  properties: Array<ConceptPropertyValue & { id: string }>;
  setProperties: React.Dispatch<
    React.SetStateAction<Array<ConceptPropertyValue & { id: string }>>
  >;
  addProperty: () => void;
  conceptClass: ReturnType<typeof allConceptClasses.find>;
  ontologyLanguages: LangTag[];
  defaultLanguage: LangTag;
  toast: (t: { kind: "success" | "info" | "error"; title: string; description?: string }) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Build a schema-first row list: one row per ClassProperty in the T-Box,
  // carrying the instance value (if any) so the tab always shows the full
  // expected shape, even for unset properties.
  const schema: ClassProperty[] = conceptClass?.properties ?? [];
  const rows = useMemo(() => {
    const byKey = new Map(properties.map((p) => [p.key, p] as const));
    const schemaRows = schema.map((s) => ({
      schema: s,
      value: byKey.get(s.key),
    }));
    // Ad-hoc properties not present in the schema (e.g. authored with "Add
    // property") still show up at the bottom.
    const extras = properties
      .filter((p) => !schema.find((s) => s.key === p.key))
      .map((p) => ({ schema: null as ClassProperty | null, value: p }));
    return [...schemaRows, ...extras];
  }, [properties, schema]);

  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">
            Custom attributes
          </h3>
          <p className="text-xs text-ink-500">
            Values authored against the {conceptClass?.name ?? "concept"} class
            schema.{" "}
            {ontologyLanguages.length > 1 && (
              <span className="text-ink-600">
                Localizable attributes carry one value per language.
              </span>
            )}
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
            <th className="px-5 py-2 text-left">Type</th>
            <th className="px-5 py-2 text-left">Value</th>
            <th className="px-5 py-2 text-left">Required</th>
            <th className="w-0 px-5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const { schema: s, value: v } = row;
            const key = s?.key ?? v?.key ?? "";
            const id = v?.id ?? `schema_${key}`;
            const req = s?.required ?? false;
            const localizable = s?.localizable ?? isLocalizedValue(v ?? { key });
            return (
              <tr
                key={id}
                className={clsx(
                  i !== 0 && "border-t border-ink-100",
                  "hover:bg-ink-50/40"
                )}
              >
                <td className="px-5 py-2.5 align-top">
                  {editingId === id && v ? (
                    <input
                      autoFocus
                      value={v.key}
                      onChange={(e) =>
                        setProperties((props) =>
                          props.map((x) =>
                            x.id === v.id ? { ...x, key: e.target.value } : x
                          )
                        )
                      }
                      className="w-full rounded-md border border-brand-300 bg-white px-2 py-1 font-mono text-[12.5px] focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                    />
                  ) : (
                    <button
                      onClick={() => v && setEditingId(id)}
                      className="inline-flex items-center gap-1.5 font-mono text-[12.5px] font-semibold text-ink-900"
                    >
                      {key}
                      {localizable && (
                        <span
                          className="rounded bg-brand-50 px-1 text-[9px] font-semibold uppercase tracking-wider text-brand-700"
                          title="Localizable — one value per language"
                        >
                          i18n
                        </span>
                      )}
                    </button>
                  )}
                </td>
                <td className="px-5 py-2.5 align-top font-mono text-[11px] text-ink-500">
                  {s?.hint ?? s?.valueType ?? "—"}
                </td>
                <td className="px-5 py-2.5 align-top font-mono text-[11.5px] text-ink-700">
                  {renderValueCell(v, localizable, ontologyLanguages, defaultLanguage)}
                </td>
                <td className="px-5 py-2.5 align-top">
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
                <td className="px-5 py-2.5 text-right align-top">
                  <div className="flex items-center justify-end gap-0.5">
                    <button
                      onClick={() => {
                        if (!v) return;
                        if (editingId === id) {
                          setEditingId(null);
                          toast({
                            kind: "success",
                            title: `Property "${v.key}" updated`,
                          });
                        } else {
                          setEditingId(id);
                        }
                      }}
                      className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      disabled={!v}
                    >
                      {editingId === id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Pencil className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (!v) return;
                        setProperties((props) =>
                          props.filter((x) => x.id !== v.id)
                        );
                        toast({
                          kind: "info",
                          title: `Property "${v.key}" removed`,
                        });
                      }}
                      className="rounded-md p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                      disabled={!v}
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

function renderValueCell(
  v: (ConceptPropertyValue & { id: string }) | undefined,
  localizable: boolean,
  ontologyLanguages: LangTag[],
  defaultLanguage: LangTag
) {
  if (!v) {
    return <span className="italic text-ink-400">unset</span>;
  }
  if (localizable) {
    const langs =
      ontologyLanguages.length > 0 ? ontologyLanguages : ([defaultLanguage] as LangTag[]);
    return (
      <div className="space-y-1">
        {langs.map((lang) => {
          const hit = v.localizedValues?.find((l) => l.lang === lang);
          return (
            <div key={lang} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 min-w-[20px] items-center justify-center rounded bg-ink-100 px-1 text-[9px] font-bold uppercase text-ink-600">
                {lang}
              </span>
              <span
                className={clsx(
                  "flex-1",
                  hit ? "text-ink-800" : "italic text-ink-400"
                )}
              >
                {hit?.value ?? "not translated"}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return <span>{v.value ?? <span className="italic text-ink-400">unset</span>}</span>;
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
                to={`/ontologies/ont_cars/concepts/${r.other.id}`}
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
  const { openDiff, revertEvent } = useApp();
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
          <li
            key={e.id}
            onClick={() => openDiff(e.id)}
            className="flex cursor-pointer items-start gap-3 px-5 py-4 hover:bg-ink-50/60"
            title="Click to view diff"
          >
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
                  onClick={(ev) => {
                    ev.stopPropagation();
                    revertEvent(e.id);
                    toast({
                      kind: "success",
                      title: `Change ${e.id} reverted`,
                      description: "A new revert event was recorded.",
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-ink-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  <Undo2 className="h-3 w-3" />
                  Revert
                </button>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toast({
                      kind: "success",
                      title: "Tag created",
                      description: `Pinned to change event ${e.id}.`,
                    });
                  }}
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

// -----------------------------------------------------------------------------
// MultilingualCard — side-by-side view of SKOS labels, definition, and
// localizable custom attributes. This is the hero surface on ConceptDetail:
// translators and multi-country business users land on this card to see every
// variant of the concept in parallel columns, one per language.
// -----------------------------------------------------------------------------

function MultilingualCard({
  concept,
  properties,
  localizableProps,
  ontologyLanguages,
  defaultLanguage,
  visibleLangs,
  setVisibleLangs,
}: {
  concept: Concept;
  properties: Array<ConceptPropertyValue & { id: string }>;
  localizableProps: ClassProperty[];
  ontologyLanguages: LangTag[];
  defaultLanguage: LangTag;
  visibleLangs: LangTag[];
  setVisibleLangs: (l: LangTag[]) => void;
}) {
  const langs =
    visibleLangs.length > 0
      ? ontologyLanguages.filter((l) => visibleLangs.includes(l))
      : ontologyLanguages;

  // Helper: return the value list for a label bag scoped to a language.
  const altByLang = (lang: LangTag) =>
    concept.labels.altLabel.filter((l) => l.lang === lang);
  const hiddenByLang = (lang: LangTag) =>
    concept.labels.hiddenLabel.filter((l) => l.lang === lang);
  const prefByLang = (lang: LangTag) =>
    pickLang(concept.labels.prefLabel, lang);
  const defByLang = (lang: LangTag) =>
    pickLang(concept.definitions, lang);

  function toggleLang(lang: LangTag) {
    if (visibleLangs.includes(lang)) {
      if (visibleLangs.length === 1) return; // keep at least one
      setVisibleLangs(visibleLangs.filter((l) => l !== lang));
    } else {
      // Preserve ontology order when re-adding
      setVisibleLangs(
        ontologyLanguages.filter(
          (l) => visibleLangs.includes(l) || l === lang
        )
      );
    }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
            <LanguagesIcon className="h-4 w-4 text-brand-600" />
            Labels & translations
          </h3>
          <p className="text-xs text-ink-500">
            SKOS labels, definition, and localizable custom attributes —
            side-by-side across {ontologyLanguages.length} language
            {ontologyLanguages.length === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {ontologyLanguages.map((lang) => {
            const on = visibleLangs.includes(lang);
            const isDefault = lang === defaultLanguage;
            return (
              <button
                key={lang}
                onClick={() => toggleLang(lang)}
                className={clsx(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-semibold transition-colors",
                  on
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-ink-100 text-ink-500 hover:bg-ink-200 hover:text-ink-800"
                )}
                title={`${LANGUAGE_NAMES[lang]}${isDefault ? " · default" : ""}`}
              >
                <span className="font-mono uppercase">{lang}</span>
                {isDefault && (
                  <span
                    className={clsx(
                      "text-[9px] uppercase tracking-wider",
                      on ? "text-brand-100" : "text-ink-400"
                    )}
                  >
                    default
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Column headers — one per visible language */}
      <div
        className="grid items-stretch border-b border-ink-100 bg-ink-50/60"
        style={{
          gridTemplateColumns: `160px repeat(${langs.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="px-5 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          Field
        </div>
        {langs.map((lang) => (
          <div
            key={lang}
            className="flex items-center gap-1.5 border-l border-ink-100 px-4 py-2 text-[11.5px] font-semibold text-ink-700"
          >
            <Globe className="h-3 w-3 text-ink-400" />
            {LANGUAGE_NAMES[lang]}
            <span className="font-mono text-[10px] uppercase text-ink-400">
              · {lang}
            </span>
            {lang === defaultLanguage && (
              <span className="chip bg-brand-50 text-brand-700 text-[9px] font-semibold">
                default
              </span>
            )}
          </div>
        ))}
      </div>

      {/* prefLabel row */}
      <MultilingualRow
        label="Preferred label"
        sublabel="skos:prefLabel · 1 per language"
        icon={Type}
        langs={langs}
      >
        {(lang) => {
          const v = prefByLang(lang);
          return v ? (
            <span className="text-[14px] font-semibold text-ink-900">
              {v.value}
            </span>
          ) : (
            <MissingTranslation />
          );
        }}
      </MultilingualRow>

      {/* altLabel row */}
      <MultilingualRow
        label="Alternative labels"
        sublabel="skos:altLabel · synonyms visible in search"
        icon={LanguagesIcon}
        langs={langs}
      >
        {(lang) => {
          const alts = altByLang(lang);
          if (alts.length === 0) return <MissingTranslation />;
          return (
            <div className="flex flex-wrap gap-1">
              {alts.map((a) => (
                <span
                  key={`${a.lang}:${a.value}`}
                  className="chip bg-ink-100 text-ink-700"
                >
                  {a.value}
                </span>
              ))}
            </div>
          );
        }}
      </MultilingualRow>

      {/* hiddenLabel row */}
      <MultilingualRow
        label="Hidden labels"
        sublabel="skos:hiddenLabel · search-only (misspellings, legacy codes)"
        icon={EyeOff}
        langs={langs}
      >
        {(lang) => {
          const hidden = hiddenByLang(lang);
          if (hidden.length === 0) return <MissingTranslation />;
          return (
            <div className="flex flex-wrap gap-1">
              {hidden.map((h) => (
                <span
                  key={`${h.lang}:${h.value}`}
                  className="chip bg-ink-50 text-ink-500 font-mono text-[10.5px]"
                >
                  {h.value}
                </span>
              ))}
            </div>
          );
        }}
      </MultilingualRow>

      {/* Definition row */}
      <MultilingualRow
        label="Definition"
        sublabel="skos:definition"
        icon={FileText}
        langs={langs}
      >
        {(lang) => {
          const def = defByLang(lang);
          return def ? (
            <p className="text-[13px] leading-relaxed text-ink-700">
              {def.value}
            </p>
          ) : (
            <MissingTranslation />
          );
        }}
      </MultilingualRow>

      {/* Localizable custom attributes — one row per localizable schema property */}
      {localizableProps.map((schema) => {
        const v = properties.find((p) => p.key === schema.key);
        return (
          <MultilingualRow
            key={schema.key}
            label={schema.key}
            sublabel={
              schema.description
                ? `custom · localizable${
                    schema.required ? " · required" : ""
                  }`
                : `custom · localizable`
            }
            mono
            langs={langs}
          >
            {(lang) => {
              const hit = v?.localizedValues?.find((l) => l.lang === lang);
              return hit ? (
                <span className="text-[13px] text-ink-700">{hit.value}</span>
              ) : (
                <MissingTranslation />
              );
            }}
          </MultilingualRow>
        );
      })}

      {/* Footer explainer */}
      <div className="flex items-start gap-2 border-t border-ink-100 bg-ink-50/40 px-5 py-3 text-[11.5px] text-ink-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
        <span>
          Missing translations fall back to the default language (
          <span className="font-mono uppercase">{defaultLanguage}</span>) via{" "}
          <code className="rounded bg-white px-1 py-0.5 text-[10.5px]">
            Accept-Language
          </code>{" "}
          on the API. Add more languages in{" "}
          <span className="font-semibold">Ontology settings → Languages</span>.
        </span>
      </div>
    </section>
  );
}

function MultilingualRow({
  label,
  sublabel,
  icon: Icon,
  langs,
  mono,
  children,
}: {
  label: string;
  sublabel?: string;
  icon?: React.ElementType;
  langs: LangTag[];
  mono?: boolean;
  children: (lang: LangTag) => React.ReactNode;
}) {
  return (
    <div
      className="grid items-start border-t border-ink-100"
      style={{
        gridTemplateColumns: `160px repeat(${langs.length}, minmax(0, 1fr))`,
      }}
    >
      <div className="flex items-start gap-1.5 px-5 py-3">
        {Icon && <Icon className="mt-0.5 h-3 w-3 shrink-0 text-ink-400" />}
        <div className="min-w-0">
          <div
            className={clsx(
              "truncate text-[12px] font-semibold text-ink-800",
              mono && "font-mono"
            )}
          >
            {label}
          </div>
          {sublabel && (
            <div className="mt-0.5 text-[10px] leading-snug text-ink-400">
              {sublabel}
            </div>
          )}
        </div>
      </div>
      {langs.map((lang) => (
        <div
          key={lang}
          className="border-l border-ink-100 px-4 py-3"
          lang={lang}
        >
          {children(lang)}
        </div>
      ))}
    </div>
  );
}

function MissingTranslation() {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] italic text-ink-400">
      <span className="h-1 w-1 rounded-full bg-ink-300" />
      not translated
    </span>
  );
}
