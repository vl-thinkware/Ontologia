import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Layers,
  Languages,
  BookOpen,
  Tag as TagIcon,
  EyeOff,
  Hash,
  FileText,
  Type,
  ArrowUpRight,
  Link2,
  MousePointer2,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  concepts as allConcepts,
  relations as allRelations,
  relationTypes as allRelationTypes,
  conceptClasses as allConceptClasses,
  type ConceptClass,
} from "../data/mock";

// Right-rail inspector for the Schema canvas mode. Lighter than
// ClassAttributesEditor: read-only, compact enough for the 380px panel,
// and deep-links into the Schema view for the full editor.
export default function ClassInspector({
  classId,
  ontologyId,
}: {
  classId: string | null;
  ontologyId: string;
}) {
  const { tick } = useApp();
  const navigate = useNavigate();

  const cls = useMemo(
    () => allConceptClasses.find((c) => c.id === classId) ?? null,
    // tick so live-edits in the Schema view are reflected here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classId, tick]
  );

  // Count instances + count relation types that reference this class on either
  // side. Gives the user a sense of how load-bearing the class is.
  const stats = useMemo(() => {
    if (!cls)
      return { instances: 0, outgoing: [], incoming: [] };
    const instances = allConcepts.filter((c) => c.classId === cls.id).length;
    const outgoing = allRelationTypes.filter((r) => r.domainClassId === cls.id);
    const incoming = allRelationTypes.filter(
      (r) => r.rangeClassId === cls.id && r.domainClassId !== cls.id
    );
    void tick;
    return { instances, outgoing, incoming };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, tick]);

  if (!cls) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
          <MousePointer2 className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-ink-800">
          Pick a class
        </h3>
        <p className="mt-1 max-w-xs text-xs text-ink-500">
          Click any class card on the schema canvas to see its SKOS built-ins,
          custom attributes and the relation types it participates in.
        </p>
      </div>
    );
  }

  const color = cls.color ?? "ink";
  const colorBanner: Record<string, string> = {
    violet: "bg-gradient-to-r from-violet-500 to-violet-700",
    emerald: "bg-gradient-to-r from-emerald-500 to-emerald-700",
    amber: "bg-gradient-to-r from-amber-500 to-amber-700",
    sky: "bg-gradient-to-r from-sky-500 to-sky-700",
    rose: "bg-gradient-to-r from-rose-500 to-rose-700",
    ink: "bg-gradient-to-r from-ink-600 to-ink-800",
  };
  const props = cls.properties ?? [];

  const outgoingRels = allRelations.filter((r) => {
    const from = allConcepts.find((c) => c.id === r.from);
    return from?.classId === cls.id;
  }).length;
  const incomingRels = allRelations.filter((r) => {
    const to = allConcepts.find((c) => c.id === r.to);
    return to?.classId === cls.id;
  }).length;
  void outgoingRels;
  void incomingRels;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Identity */}
      <div className="border-b border-ink-100 px-4 py-3">
        <div
          className={clsx(
            "flex items-center gap-2 rounded-t-lg px-3 py-1.5 text-white",
            colorBanner[color]
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          <span className="truncate text-[13px] font-semibold tracking-tight">
            {cls.name}
          </span>
          <span
            className="ml-auto rounded-full bg-white/25 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider"
            title="owl:Class"
          >
            Class
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
          <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10.5px] text-ink-700">
            {cls.id}
          </code>
          <span className="font-semibold text-ink-700">
            {stats.instances} instance{stats.instances === 1 ? "" : "s"}
          </span>
        </div>
        {cls.description && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">
            {cls.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/ontologies/${ontologyId}/schema`)}
            className="btn-primary py-1 px-2 text-[11px]"
          >
            <ArrowUpRight className="h-3 w-3" />
            Edit in Schema view
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin">
        {/* Built-in SKOS attributes */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Built-in attributes
            </h3>
            <span className="chip bg-violet-50 text-violet-700 text-[10px]">
              SKOS
            </span>
          </div>
          <ul className="space-y-1.5">
            {[
              { key: "prefLabel", label: "Preferred label", icon: TagIcon, cardinality: "1 / lang", i18n: true },
              { key: "altLabel", label: "Alternative labels", icon: Languages, cardinality: "many / lang", i18n: true },
              { key: "hiddenLabel", label: "Hidden labels", icon: EyeOff, cardinality: "many / lang", i18n: true },
              { key: "definition", label: "Definition", icon: BookOpen, cardinality: "1 / lang", i18n: true },
              { key: "notation", label: "Notation", icon: Hash, cardinality: "0..1", i18n: false },
              { key: "example", label: "Example", icon: FileText, cardinality: "0..many", i18n: true },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.key}
                  className="flex items-center gap-2 rounded-md bg-violet-50/40 px-2 py-1.5"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-violet-100 text-violet-700">
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <code className="truncate text-[12px] font-semibold text-ink-900">
                      {b.key}
                    </code>
                    <span className="ml-1 text-[11px] text-ink-600">
                      {b.label}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10.5px] text-ink-500">
                    {b.cardinality}
                  </span>
                  {b.i18n && (
                    <Languages
                      className="h-3 w-3 shrink-0 text-brand-600"
                      aria-label="language-aware"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Custom attributes */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Custom attributes ({props.length})
            </h3>
          </div>
          {props.length === 0 ? (
            <p className="rounded-md border border-dashed border-ink-200 bg-white px-2 py-3 text-center text-[11.5px] text-ink-500">
              No custom attributes. Add some from the Schema view to capture
              class-specific data.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {props.map((p) => (
                <li
                  key={p.key}
                  className="flex items-start gap-2 rounded-md border border-ink-200 bg-white px-2 py-1.5"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-ink-100 text-ink-600">
                    <Type className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1">
                      <code className="text-[12px] font-semibold text-ink-900">
                        {p.key}
                      </code>
                      <span className="chip bg-ink-100 text-ink-700 font-mono text-[9.5px]">
                        {p.valueType}
                      </span>
                      {p.required && (
                        <span className="chip bg-rose-50 text-rose-700 text-[9.5px]">
                          required
                        </span>
                      )}
                      {p.localizable && (
                        <span className="chip bg-brand-50 text-brand-700 text-[9.5px]">
                          <Languages className="h-2.5 w-2.5" />
                          i18n
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-500">
                        {p.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Relation participation */}
        <section className="px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Relation participation
            </h3>
          </div>
          {stats.outgoing.length === 0 && stats.incoming.length === 0 && (
            <p className="text-[11.5px] text-ink-500">
              This class isn't the domain or range of any relation type yet.
            </p>
          )}
          {stats.outgoing.length > 0 && (
            <div className="mb-2">
              <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                as domain
              </div>
              <ul className="space-y-1">
                {stats.outgoing.map((rt) => {
                  const target = allConceptClasses.find(
                    (c) => c.id === rt.rangeClassId
                  );
                  return (
                    <li
                      key={rt.id}
                      className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-white px-2 py-1 text-[11.5px]"
                    >
                      <Link2 className="h-3 w-3 text-ink-400" />
                      <code className="font-semibold text-ink-900">
                        {rt.name}
                      </code>
                      <span className="text-ink-400">→</span>
                      <span className="font-semibold text-ink-700">
                        {target?.name ?? rt.rangeClassId}
                      </span>
                      {rt.isBuiltIn && (
                        <span className="ml-auto chip bg-ink-100 text-ink-600 text-[9.5px]">
                          built-in
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {stats.incoming.length > 0 && (
            <div>
              <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                as range
              </div>
              <ul className="space-y-1">
                {stats.incoming.map((rt) => {
                  const src = allConceptClasses.find(
                    (c) => c.id === rt.domainClassId
                  );
                  return (
                    <li
                      key={rt.id}
                      className="flex items-center gap-1.5 rounded-md border border-ink-200 bg-ink-50/50 px-2 py-1 text-[11.5px]"
                    >
                      <span className="font-semibold text-ink-700">
                        {src?.name ?? rt.domainClassId}
                      </span>
                      <span className="text-ink-400">—[</span>
                      <code className="font-semibold text-ink-900">
                        {rt.name}
                      </code>
                      <span className="text-ink-400">]→</span>
                      <span className="text-ink-500">this</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ConceptClass is re-exported here purely to preserve the noUnusedLocals
// discipline — TypeScript flags imports that are only used in type position.
void null as unknown as ConceptClass;
