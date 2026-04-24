import { useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowRight, Check, Link2, Plus } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import { relationTypes, conceptClasses } from "../data/mock";

/**
 * Shown when the user drags from one node's handle to another on the
 * canvas. Narrows applicable RelationTypes to those whose
 * domain/range classes match the selected endpoints, with a fallback
 * to "show all" when nothing fits.
 */
export default function RelationPickerModal() {
  const {
    relationDraft,
    closeRelationDraft,
    concepts,
    addRelation,
    toast,
  } = useApp();

  const fromConcept = useMemo(
    () => concepts.find((c) => c.id === relationDraft?.from) ?? null,
    [concepts, relationDraft]
  );
  const toConcept = useMemo(
    () => concepts.find((c) => c.id === relationDraft?.to) ?? null,
    [concepts, relationDraft]
  );

  // Relation types from the same ontology whose domain/range line up.
  const applicable = useMemo(() => {
    if (!fromConcept || !toConcept) return [];
    return relationTypes.filter((rt) => {
      if (rt.ontologyId !== fromConcept.ontologyId) return false;
      const domainOk =
        !rt.domainClassId || rt.domainClassId === fromConcept.classId;
      const rangeOk = !rt.rangeClassId || rt.rangeClassId === toConcept.classId;
      return domainOk && rangeOk;
    });
  }, [fromConcept, toConcept]);

  const fallback = useMemo(() => {
    if (!fromConcept) return [];
    return relationTypes.filter((rt) => rt.ontologyId === fromConcept.ontologyId);
  }, [fromConcept]);

  const list = applicable.length > 0 ? applicable : fallback;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  // When the modal opens with a new draft, the first applicable RT is a
  // sensible default. Reset selection by comparing ids.
  const draftKey = relationDraft
    ? `${relationDraft.from}->${relationDraft.to}`
    : null;
  if (draftKey && selectedId && !list.some((rt) => rt.id === selectedId)) {
    // If user switches draft, clear stale selection.
    setSelectedId(null);
  }

  if (!relationDraft || !fromConcept || !toConcept) {
    return (
      <Modal
        open={!!relationDraft}
        onClose={closeRelationDraft}
        title="Create relation"
      >
        <p className="text-sm text-ink-500">Endpoints not found.</p>
      </Modal>
    );
  }

  const effectiveId = selectedId ?? list[0]?.id ?? null;

  function getClassName(id?: string) {
    return id ? conceptClasses.find((c) => c.id === id)?.name : undefined;
  }

  function confirm() {
    if (!effectiveId || !fromConcept || !toConcept || !relationDraft) return;
    const rt = relationTypes.find((x) => x.id === effectiveId);
    if (!rt) return;
    const { relation } = addRelation({
      from: fromConcept.id,
      to: toConcept.id,
      schemeId: relationDraft.schemeId,
      relationTypeId: rt.id,
      label: rt.name,
    });
    toast({
      kind: "success",
      title: `Relation created`,
      description: `${fromConcept.name} —[${rt.name}]→ ${toConcept.name}`,
    });
    closeRelationDraft();
    setSelectedId(null);
    void relation;
  }

  return (
    <Modal
      open={!!relationDraft}
      onClose={() => {
        closeRelationDraft();
        setSelectedId(null);
      }}
      title="Create relation"
      subtitle={
        applicable.length > 0
          ? `Relation types valid for ${getClassName(
              fromConcept.classId
            )} → ${getClassName(toConcept.classId)}`
          : "No direct domain/range match — pick any relation type in this ontology."
      }
      width="max-w-xl"
      footer={
        <>
          <button
            onClick={closeRelationDraft}
            className="btn-ghost py-1.5 px-3"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!effectiveId}
            className={clsx(
              "btn-primary py-1.5 px-3",
              !effectiveId && "cursor-not-allowed opacity-60"
            )}
          >
            <Link2 className="h-3.5 w-3.5" />
            Create relation
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {/* From / To summary */}
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-[13px]">
          <div className="min-w-0 flex-1 truncate">
            <div className="truncate font-semibold text-ink-900">
              {fromConcept.name}
            </div>
            <div className="truncate text-[11px] text-ink-500">
              {getClassName(fromConcept.classId) ?? "Concept"}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
          <div className="min-w-0 flex-1 truncate text-right">
            <div className="truncate font-semibold text-ink-900">
              {toConcept.name}
            </div>
            <div className="truncate text-[11px] text-ink-500">
              {getClassName(toConcept.classId) ?? "Concept"}
            </div>
          </div>
        </div>

        {/* Relation type list */}
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Relation type
          </div>
          {list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink-300 bg-white px-3 py-6 text-center text-[12.5px] text-ink-500">
              <Plus className="mx-auto mb-1 h-4 w-4 text-ink-400" />
              No relation types defined for this ontology yet — add one from
              the Schema view.
            </div>
          ) : (
            <ul className="max-h-64 space-y-1 overflow-y-auto">
              {list.map((rt) => {
                const active = effectiveId === rt.id;
                return (
                  <li key={rt.id}>
                    <button
                      onClick={() => setSelectedId(rt.id)}
                      className={clsx(
                        "flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                        active
                          ? "border-brand-500 bg-brand-50"
                          : "border-ink-200 bg-white hover:bg-ink-50"
                      )}
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                        {active ? (
                          <Check className="h-4 w-4 text-brand-600" />
                        ) : (
                          <Link2 className="h-3.5 w-3.5 text-ink-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[13px] font-semibold text-ink-900">
                            {rt.name}
                          </span>
                          {rt.isBuiltIn && (
                            <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                              built-in
                            </span>
                          )}
                          {rt.isTransitive && (
                            <span className="chip bg-sky-50 text-sky-700 text-[10px]">
                              transitive
                            </span>
                          )}
                          {rt.isSymmetric && (
                            <span className="chip bg-violet-50 text-violet-700 text-[10px]">
                              symmetric
                            </span>
                          )}
                        </div>
                        <div className="truncate text-[11px] text-ink-500">
                          {getClassName(rt.domainClassId) ?? "any"} →{" "}
                          {getClassName(rt.rangeClassId) ?? "any"}
                          {rt.description ? ` · ${rt.description}` : ""}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
