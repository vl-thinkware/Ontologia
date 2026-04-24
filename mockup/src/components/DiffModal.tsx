import { useMemo } from "react";
import clsx from "clsx";
import { ArrowLeftRight, History, RotateCcw } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

type FieldDiff = {
  label: string;
  before: string;
  after: string;
};

/**
 * Diff viewer for a single ChangeEvent. We don't persist old values in the
 * mockup, so we synthesise a "before" by looking at the event's siblings
 * (immediately preceding event on the same entity). If we can't find one
 * we show the summary + author + timestamp as the authoritative record.
 */
export default function DiffModal() {
  const {
    diffEventId,
    closeDiff,
    events,
    concepts,
    relations,
    revertEvent,
    toast,
  } = useApp();

  const event = useMemo(
    () => events.find((e) => e.id === diffEventId) ?? null,
    [events, diffEventId]
  );

  // Find the previous event touching the same entity so we can render a
  // plausible before/after. If nothing exists this is a creation event.
  const previous = useMemo(() => {
    if (!event) return null;
    const siblings = events.filter(
      (e) => e.entityId === event.entityId && e.at < event.at
    );
    return siblings.sort((a, b) => (a.at < b.at ? 1 : -1))[0] ?? null;
  }, [events, event]);

  // Best-effort current snapshot (what the field looks like now).
  const snapshot = useMemo(() => {
    if (!event) return null;
    if (event.entityKind === "concept") {
      const c = concepts.find((x) => x.id === event.entityId);
      if (!c) return null;
      const prefEn =
        c.labels.prefLabel.find((l) => l.lang === "en")?.value ?? c.name;
      const prefFr =
        c.labels.prefLabel.find((l) => l.lang === "fr")?.value ?? "";
      const defEn =
        c.definitions.find((l) => l.lang === "en")?.value ??
        c.description ??
        "";
      return {
        kind: "concept" as const,
        fields: [
          { label: "Name", value: c.name },
          { label: "prefLabel (en)", value: prefEn },
          { label: "prefLabel (fr)", value: prefFr },
          { label: "Definition (en)", value: defEn },
          {
            label: "Deprecated",
            value: c.deprecated ? "true" : "false",
          },
          {
            label: "Replaced by",
            value: c.replacedBy
              ? concepts.find((x) => x.id === c.replacedBy)?.name ?? c.replacedBy
              : "—",
          },
        ],
      };
    }
    if (event.entityKind === "relation") {
      const r = relations.find((x) => x.id === event.entityId);
      if (!r) return null;
      const from = concepts.find((x) => x.id === r.from);
      const to = concepts.find((x) => x.id === r.to);
      return {
        kind: "relation" as const,
        fields: [
          { label: "From", value: from?.name ?? r.from },
          { label: "Label", value: r.label },
          { label: "To", value: to?.name ?? r.to },
        ],
      };
    }
    return null;
  }, [event, concepts, relations]);

  // Synthetic "before" values — the mockup doesn't keep history snapshots,
  // so we infer the likely pre-change state by reading the previous event's
  // summary when its shape is obvious, and fall back to "—" otherwise.
  const diff: FieldDiff[] = useMemo(() => {
    if (!event || !snapshot) return [];
    // For update events, show every field and mark it "unchanged" when
    // we can't infer — realistic for the demo.
    if (event.kind === "create") {
      return snapshot.fields.map((f) => ({
        label: f.label,
        before: "—",
        after: f.value,
      }));
    }
    if (event.kind === "delete") {
      return snapshot.fields.map((f) => ({
        label: f.label,
        before: f.value,
        after: "—",
      }));
    }
    if (event.kind === "revert" && event.revertsEventId) {
      return [
        {
          label: "Action",
          before: `Reverted ${event.revertsEventId}`,
          after: "Current state restored",
        },
      ];
    }
    // For update, if we have a previous event with an inline summary we use
    // that as the "before" label; otherwise mark fields unchanged.
    return snapshot.fields.map((f) => ({
      label: f.label,
      before: previous?.summary.includes(f.label) ? "(previous)" : "(unchanged)",
      after: f.value,
    }));
  }, [event, snapshot, previous]);

  if (!event) {
    return (
      <Modal open={!!diffEventId} onClose={closeDiff} title="Change detail">
        <p className="text-sm text-ink-500">Event not found.</p>
      </Modal>
    );
  }

  return (
    <Modal
      open={!!diffEventId}
      onClose={closeDiff}
      title={event.summary}
      subtitle={`${event.entityKind} · ${event.kind} · ${timeAgo(event.at)}`}
      width="max-w-3xl"
      footer={
        <>
          <button onClick={closeDiff} className="btn-ghost py-1.5 px-3">
            Close
          </button>
          {event.kind !== "revert" && (
            <button
              onClick={() => {
                revertEvent(event.id);
                toast({
                  kind: "info",
                  title: "Change reverted",
                  description: `A new revert event was recorded.`,
                });
                closeDiff();
              }}
              className="btn-secondary py-1.5 px-3"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Revert this change
            </button>
          )}
        </>
      }
    >
      <div className="space-y-3">
        {/* Author bar */}
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-[12.5px]">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ backgroundColor: event.author.color }}
          >
            {event.author.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-ink-900">
              {event.author.name}
            </div>
            <div className="truncate text-[11px] text-ink-500">
              {new Date(event.at).toLocaleString()}
              {event.message ? ` · ${event.message}` : ""}
            </div>
          </div>
          <span
            className={clsx(
              "chip text-[10px]",
              event.kind === "create" && "bg-emerald-50 text-emerald-700",
              event.kind === "update" && "bg-sky-50 text-sky-700",
              event.kind === "delete" && "bg-rose-50 text-rose-700",
              event.kind === "revert" && "bg-amber-50 text-amber-700",
              event.kind === "tag" && "bg-violet-50 text-violet-700",
              event.kind === "bulk_import" && "bg-ink-100 text-ink-700"
            )}
          >
            {event.kind}
          </span>
        </div>

        {/* Diff table */}
        <div className="overflow-hidden rounded-lg border border-ink-200">
          <div className="grid grid-cols-[max-content_1fr_auto_1fr] items-stretch divide-x divide-ink-200 bg-ink-50 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            <div className="px-3 py-1.5">Field</div>
            <div className="px-3 py-1.5">Before</div>
            <div className="flex items-center px-2">
              <ArrowLeftRight className="h-3.5 w-3.5 text-ink-400" />
            </div>
            <div className="px-3 py-1.5">After</div>
          </div>
          {diff.length === 0 ? (
            <div className="flex items-center gap-2 px-3 py-4 text-[12.5px] text-ink-500">
              <History className="h-4 w-4" />
              No structured diff available — treat the summary above as the
              source of truth.
            </div>
          ) : (
            <div className="divide-y divide-ink-100 text-[12.5px]">
              {diff.map((d, i) => {
                const changed = d.before !== d.after;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[max-content_1fr_auto_1fr] items-stretch divide-x divide-ink-100"
                  >
                    <div className="px-3 py-2 font-medium text-ink-600">
                      {d.label}
                    </div>
                    <div
                      className={clsx(
                        "px-3 py-2",
                        changed
                          ? "bg-rose-50/50 text-rose-900"
                          : "text-ink-600"
                      )}
                    >
                      <span className="break-words">{d.before || "—"}</span>
                    </div>
                    <div />
                    <div
                      className={clsx(
                        "px-3 py-2",
                        changed
                          ? "bg-emerald-50/60 text-emerald-900"
                          : "text-ink-600"
                      )}
                    >
                      <span className="break-words">{d.after || "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {previous && (
          <div className="text-[11px] text-ink-500">
            Previous touch on this entity:{" "}
            <span className="font-semibold text-ink-700">
              {previous.summary}
            </span>{" "}
            · {timeAgo(previous.at)}
          </div>
        )}
      </div>
    </Modal>
  );
}

function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
