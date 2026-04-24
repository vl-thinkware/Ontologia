import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  ShieldCheck,
  AlertTriangle,
  CircleAlert,
  CircleDashed,
  Languages,
  Link2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  concepts as allConcepts,
  relations as allRelations,
  conceptClasses as allConceptClasses,
  relationTypes as allRelationTypes,
  conceptSchemes as allSchemes,
} from "../data/mock";

type Issue = {
  id: string;
  severity: "error" | "warn";
  rule: string;
  title: string;
  description: string;
  conceptId?: string;
  relationId?: string;
};

// Analysis helpers — kept as pure functions so they're easy to unit-test later.
function computeIssues(ontologyId: string, tick: number): Issue[] {
  void tick;
  const issues: Issue[] = [];
  const scopedConcepts = allConcepts.filter((c) => c.ontologyId === ontologyId);
  const scopedRelations = allRelations.filter((r) => {
    const from = allConcepts.find((c) => c.id === r.from);
    return from?.ontologyId === ontologyId;
  });
  const scopedSchemes = allSchemes.filter((s) => s.ontologyId === ontologyId);
  const classById = new Map(
    allConceptClasses
      .filter((c) => c.ontologyId === ontologyId)
      .map((c) => [c.id, c])
  );
  const relTypeById = new Map(
    allRelationTypes
      .filter((r) => r.ontologyId === ontologyId)
      .map((r) => [r.id, r])
  );

  // Rule 1: concept has no class assigned.
  scopedConcepts.forEach((c) => {
    if (!c.classId || !classById.has(c.classId)) {
      issues.push({
        id: `class-${c.id}`,
        severity: "error",
        rule: "Missing class",
        title: `"${c.name}" has no valid ConceptClass`,
        description:
          "Every concept must point at a class defined in the ontology's T-Box.",
        conceptId: c.id,
      });
    }
  });

  // Rule 2: duplicate prefLabels within a scheme (case-insensitive, per lang).
  scopedSchemes.forEach((scheme) => {
    const inScheme = scopedConcepts.filter((c) => c.schemeId === scheme.id);
    const seen = new Map<string, string>(); // `${lang}::${value.toLowerCase()}` → firstConceptId
    inScheme.forEach((c) => {
      c.labels.prefLabel.forEach((l) => {
        const key = `${l.lang}::${l.value.trim().toLowerCase()}`;
        const first = seen.get(key);
        if (first && first !== c.id) {
          issues.push({
            id: `dup-${c.id}-${l.lang}`,
            severity: "warn",
            rule: "Duplicate prefLabel",
            title: `Two concepts share the prefLabel "${l.value}"`,
            description: `Both "${first}" and "${c.id}" carry this label in ${l.lang} within "${scheme.name}".`,
            conceptId: c.id,
          });
        } else if (!first) {
          seen.set(key, c.id);
        }
      });
    });
  });

  // Rule 3: domain/range violation on relations.
  scopedRelations.forEach((r) => {
    const rt = relTypeById.get(r.relationTypeId);
    if (!rt) return; // handled separately
    const from = allConcepts.find((c) => c.id === r.from);
    const to = allConcepts.find((c) => c.id === r.to);
    if (!from || !to) return;
    if (rt.domainClassId && from.classId !== rt.domainClassId) {
      const expected = classById.get(rt.domainClassId)?.name ?? rt.domainClassId;
      const got = classById.get(from.classId)?.name ?? from.classId;
      issues.push({
        id: `dom-${r.id}`,
        severity: "error",
        rule: "Domain violation",
        title: `${rt.name}: "${from.name}" isn't a ${expected}`,
        description: `Expected domain "${expected}" but got "${got}". Either move the source into the right class or relax the relation type.`,
        relationId: r.id,
        conceptId: from.id,
      });
    }
    if (rt.rangeClassId && to.classId !== rt.rangeClassId) {
      const expected = classById.get(rt.rangeClassId)?.name ?? rt.rangeClassId;
      const got = classById.get(to.classId)?.name ?? to.classId;
      issues.push({
        id: `rng-${r.id}`,
        severity: "error",
        rule: "Range violation",
        title: `${rt.name}: "${to.name}" isn't a ${expected}`,
        description: `Expected range "${expected}" but got "${got}".`,
        relationId: r.id,
        conceptId: to.id,
      });
    }
  });

  // Rule 4: deprecated concept still referenced by an active relation.
  scopedConcepts
    .filter((c) => c.deprecated)
    .forEach((c) => {
      const refs = scopedRelations.filter(
        (r) => r.from === c.id || r.to === c.id
      );
      if (refs.length > 0) {
        issues.push({
          id: `deprec-${c.id}`,
          severity: "warn",
          rule: "Deprecated still in use",
          title: `"${c.name}" is deprecated but referenced ${refs.length} time${
            refs.length === 1 ? "" : "s"
          }`,
          description:
            "Consider rewriting those relations to point at the replacement concept.",
          conceptId: c.id,
        });
      }
    });

  // Rule 5: orphan concepts (no relations at all) in taxonomy-style schemes.
  scopedConcepts.forEach((c) => {
    if (c.deprecated) return;
    const anyRel = scopedRelations.some(
      (r) => r.from === c.id || r.to === c.id
    );
    if (!anyRel) {
      issues.push({
        id: `orph-${c.id}`,
        severity: "warn",
        rule: "Orphan concept",
        title: `"${c.name}" is not connected to anything`,
        description:
          "Orphans don't appear in the tree view. Add a broader/narrower relation or reclassify.",
        conceptId: c.id,
      });
    }
  });

  return issues;
}

export default function ValidationPanel({
  ontologyId,
}: {
  ontologyId: string;
}) {
  const { tick } = useApp();
  const navigate = useNavigate();

  const issues = useMemo(
    () => computeIssues(ontologyId, tick),
    [ontologyId, tick]
  );

  const byRule = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    issues.forEach((i) => {
      if (!groups[i.rule]) groups[i.rule] = [];
      groups[i.rule].push(i);
    });
    return groups;
  }, [issues]);

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warn").length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-ink-500" />
          <h3 className="text-sm font-semibold text-ink-900">Validation</h3>
          {issues.length === 0 ? (
            <span className="chip bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              All clear
            </span>
          ) : (
            <>
              {errorCount > 0 && (
                <span className="chip bg-rose-50 text-rose-700">
                  <CircleAlert className="h-3 w-3" />
                  {errorCount}
                </span>
              )}
              {warnCount > 0 && (
                <span className="chip bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  {warnCount}
                </span>
              )}
            </>
          )}
        </div>
        <p className="mt-1 text-[11.5px] text-ink-500">
          Live checks that run on every edit. Click an issue to jump to the
          offending concept.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {issues.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-ink-900">
              Everything checks out
            </h4>
            <p className="mt-1 max-w-[220px] text-[12px] text-ink-500">
              No orphans, duplicates, or domain/range violations in this
              ontology.
            </p>
          </div>
        )}
        {Object.entries(byRule).map(([rule, items]) => {
          const firstSeverity = items[0].severity;
          const Icon = iconForRule(rule);
          return (
            <section key={rule} className="border-b border-ink-100">
              <header className="flex items-center gap-2 bg-ink-50/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-600">
                <Icon className="h-3.5 w-3.5" />
                {rule}
                <span
                  className={clsx(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[10px]",
                    firstSeverity === "error"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {items.length}
                </span>
              </header>
              <ul>
                {items.map((issue) => (
                  <li
                    key={issue.id}
                    onClick={() => {
                      if (issue.conceptId) {
                        navigate(
                          `/ontologies/${ontologyId}/concepts/${issue.conceptId}`
                        );
                      }
                    }}
                    className={clsx(
                      "flex cursor-pointer items-start gap-2 px-4 py-2.5 transition-colors hover:bg-ink-50",
                      issue.severity === "error"
                        ? "border-l-2 border-rose-500"
                        : "border-l-2 border-amber-500"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-ink-900">
                        {issue.title}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-ink-500">
                        {issue.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-300 group-hover:text-ink-600" />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function iconForRule(rule: string): React.ElementType {
  switch (rule) {
    case "Missing class":
      return CircleDashed;
    case "Duplicate prefLabel":
      return Languages;
    case "Domain violation":
    case "Range violation":
      return Link2;
    case "Deprecated still in use":
      return AlertTriangle;
    case "Orphan concept":
      return CircleDashed;
    default:
      return CircleAlert;
  }
}
