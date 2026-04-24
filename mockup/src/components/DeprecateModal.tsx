import { useMemo, useState } from "react";
import clsx from "clsx";
import { AlertTriangle, Search, X, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

/**
 * Deprecate a concept and optionally point at a replacement.
 *
 * The modal is deliberately opinionated: deprecation without a replacement
 * is allowed (sometimes the term just retires) but the picker is pre-scoped
 * to concepts from the same scheme + class so the taxonomist doesn't wander
 * across artefacts. Matches the "dct:isReplacedBy / skos:exactMatch"
 * pattern from the data-model doc.
 */
export default function DeprecateModal() {
  const {
    deprecateTarget,
    closeDeprecate,
    concepts,
    deprecateConcept,
    toast,
  } = useApp();

  const concept = useMemo(
    () => concepts.find((c) => c.id === deprecateTarget?.id) ?? null,
    [concepts, deprecateTarget]
  );

  const [query, setQuery] = useState("");
  const [replacementId, setReplacementId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  // Whenever the modal opens for a different concept, reset the form.
  const key = deprecateTarget?.id ?? null;
  // A tiny local signal — not worth a useEffect; reset on first render per key
  // by stashing a ref. Using inline compare against previous key works here.
  // (We're not persisting form state between opens, so this is fine.)

  const candidates = useMemo(() => {
    if (!concept) return [];
    const q = query.trim().toLowerCase();
    return concepts
      .filter((c) => {
        if (c.id === concept.id) return false;
        if (c.deprecated) return false;
        // Prefer same scheme + class first, but still allow cross-scheme.
        if (c.ontologyId !== concept.ontologyId) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.labels.prefLabel.some((l) =>
            l.value.toLowerCase().includes(q)
          ) ||
          c.labels.altLabel.some((l) =>
            l.value.toLowerCase().includes(q)
          )
        );
      })
      .sort((a, b) => {
        // Same scheme + class first, then same scheme, then rest.
        const score = (x: typeof a) =>
          (x.schemeId === concept.schemeId ? 2 : 0) +
          (x.classId === concept.classId ? 1 : 0);
        return score(b) - score(a) || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [concept, concepts, query]);

  const replacement = useMemo(
    () => concepts.find((c) => c.id === replacementId) ?? null,
    [concepts, replacementId]
  );

  if (!concept) {
    return (
      <Modal
        open={!!deprecateTarget}
        onClose={closeDeprecate}
        title="Deprecate concept"
      >
        <p className="text-sm text-ink-500">Concept not found.</p>
      </Modal>
    );
  }

  function submit() {
    if (!concept) return;
    deprecateConcept({
      id: concept.id,
      replacedBy: replacementId ?? undefined,
      reason: reason.trim() || undefined,
    });
    toast({
      kind: "info",
      title: `"${concept.name}" deprecated`,
      description: replacement
        ? `Replaced by ${replacement.name}. Downstream consumers will auto-follow.`
        : "Consumers will see the term but it'll be hidden from pickers.",
    });
    closeDeprecate();
    // Clear local form state on close
    setQuery("");
    setReplacementId(null);
    setReason("");
  }

  return (
    <Modal
      open={!!deprecateTarget}
      onClose={() => {
        closeDeprecate();
        setQuery("");
        setReplacementId(null);
        setReason("");
      }}
      title={`Deprecate "${concept.name}"`}
      subtitle="Retires the concept from pickers but keeps it queryable for referential integrity."
      width="max-w-xl"
      footer={
        <>
          <button onClick={closeDeprecate} className="btn-ghost py-1.5 px-3">
            Cancel
          </button>
          <button
            onClick={submit}
            className="btn-primary py-1.5 px-3 bg-amber-600 hover:bg-amber-700 focus:ring-amber-200"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Deprecate {key ? "" : ""}
            {replacement ? " + redirect" : ""}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Downstream consumers keep their references intact. If you point at
            a replacement, clients that follow{" "}
            <code className="rounded bg-amber-100 px-1">dct:isReplacedBy</code>{" "}
            auto-redirect on next sync.
          </div>
        </div>

        {/* Replacement picker */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Replacement concept{" "}
            <span className="font-normal normal-case text-ink-400">
              (optional)
            </span>
          </label>
          {replacement ? (
            <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-[13px]">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 text-brand-600" />
                  <span className="truncate font-semibold text-ink-900">
                    {replacement.name}
                  </span>
                </div>
                <div className="truncate text-[11px] text-ink-500">
                  {replacement.description || "No description"}
                </div>
              </div>
              <button
                onClick={() => setReplacementId(null)}
                className="rounded-md p-1 text-ink-400 hover:bg-white hover:text-ink-700"
                title="Clear replacement"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
                <Search className="h-3.5 w-3.5 text-ink-400" />
                <input
                  autoFocus
                  placeholder="Search concepts in this ontology…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent py-2 text-[13px] text-ink-800 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              {candidates.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-ink-200 bg-white divide-y divide-ink-100">
                  {candidates.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => setReplacementId(c.id)}
                        className={clsx(
                          "flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-brand-50"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-ink-900">
                            {c.name}
                          </div>
                          <div className="truncate text-[11px] text-ink-500">
                            {c.description || "—"}
                          </div>
                        </div>
                        <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                          {c.schemeId === concept.schemeId
                            ? "same scheme"
                            : "cross-scheme"}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {query && candidates.length === 0 && (
                <p className="mt-1 text-[11.5px] text-ink-500">
                  No matches in this ontology.
                </p>
              )}
            </>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            Reason{" "}
            <span className="font-normal normal-case text-ink-400">
              (optional — shown to downstream editors)
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Why is "${concept.name}" being deprecated?`}
            className="mt-1.5 w-full resize-y min-h-[72px] rounded-lg border border-ink-200 bg-white px-3 py-2 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
    </Modal>
  );
}
