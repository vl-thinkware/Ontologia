import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  GitCompare,
  ArrowRight,
  FilePlus2,
  FilePenLine,
  FileMinus2,
  Tag as TagIcon,
} from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

type DeltaKind = "added" | "modified" | "removed";

type DeltaRow = {
  kind: DeltaKind;
  entityKind: "concept" | "relation" | "tag";
  entityId: string;
  entityName: string;
  summary: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  at: string;
};

export default function TagDiffModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { events, tags } = useApp();
  // Sorted newest-first already, but we want options oldest-first for the
  // dropdown so v1.0 comes before v1.3.
  const sortedTags = useMemo(() => {
    const byEventAt = tags
      .map((t) => {
        const e = events.find((ev) => ev.id === t.changeEventId);
        return { tag: t, at: e?.at ?? t.createdAt };
      })
      .sort((a, b) => (a.at < b.at ? -1 : 1));
    return byEventAt.map((x) => x.tag);
  }, [tags, events]);

  // Default to oldest vs newest so the diff always shows *something*.
  const defaultFrom = sortedTags[0]?.id ?? "";
  const defaultTo = sortedTags[sortedTags.length - 1]?.id ?? "";
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);

  const fromTag = sortedTags.find((t) => t.id === fromId);
  const toTag = sortedTags.find((t) => t.id === toId);

  const deltas: DeltaRow[] = useMemo(() => {
    if (!fromTag || !toTag) return [];
    const fromEvent = events.find((e) => e.id === fromTag.changeEventId);
    const toEvent = events.find((e) => e.id === toTag.changeEventId);
    if (!fromEvent || !toEvent) return [];
    const lower =
      fromEvent.at < toEvent.at ? fromEvent.at : toEvent.at;
    const upper =
      fromEvent.at < toEvent.at ? toEvent.at : fromEvent.at;
    // All events strictly between the two tag anchors, newest-first.
    const between = events.filter(
      (e) => e.at > lower && e.at <= upper && e.kind !== "tag"
    );
    // Fold update/create/delete events per entity. If a concept was created
    // and then updated within the window we count it as one "added" row.
    const rollup = new Map<string, DeltaRow>();
    for (const e of between.slice().reverse()) {
      const existing = rollup.get(e.entityId);
      const kind: DeltaKind =
        e.kind === "create" || e.kind === "bulk_import"
          ? "added"
          : e.kind === "delete"
          ? "removed"
          : "modified";
      if (!existing) {
        rollup.set(e.entityId, {
          kind,
          entityKind:
            e.entityKind === "concept" ||
            e.entityKind === "relation" ||
            e.entityKind === "tag"
              ? e.entityKind
              : "concept",
          entityId: e.entityId,
          entityName: e.entityName,
          summary: e.summary,
          authorName: e.author.name,
          authorInitials: e.author.initials,
          authorColor: e.author.color,
          at: e.at,
        });
      } else {
        // Later events clobber — but once added, later "modified" shouldn't
        // downgrade to modified; and a deletion trumps an add (net-removed).
        if (kind === "removed") {
          existing.kind = existing.kind === "added" ? "added" : "removed";
          if (existing.kind === "added") {
            // Net zero — concept was added and removed, keep it out of the
            // diff entirely.
            rollup.delete(e.entityId);
            continue;
          }
        }
        existing.summary = e.summary;
        existing.at = e.at;
      }
    }
    return Array.from(rollup.values());
  }, [fromTag, toTag, events]);

  const counts = useMemo(() => {
    const out = { added: 0, modified: 0, removed: 0 };
    deltas.forEach((d) => {
      out[d.kind] += 1;
    });
    return out;
  }, [deltas]);

  const [filter, setFilter] = useState<"all" | DeltaKind>("all");
  const filtered = deltas.filter(
    (d) => filter === "all" || d.kind === filter
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compare tags"
      subtitle="See everything that changed between two tagged snapshots — additions, edits, removals."
      width="max-w-4xl"
      footer={
        <button onClick={onClose} className="btn-secondary py-1.5 px-3">
          Close
        </button>
      }
    >
      <div className="space-y-3">
        {/* Tag pickers */}
        <div className="flex items-center gap-3 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <TagIcon className="h-3.5 w-3.5 text-ink-500" />
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              From
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] font-mono font-semibold text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {sortedTags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <ArrowRight className="h-4 w-4 text-ink-400" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <TagIcon className="h-3.5 w-3.5 text-ink-500" />
            <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              To
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-ink-200 bg-white px-2 py-1 text-[12.5px] font-mono font-semibold text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {sortedTags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stat strip + filter */}
        <div className="flex flex-wrap items-center gap-2">
          <StatPill
            kind="added"
            count={counts.added}
            active={filter === "added" || filter === "all"}
            onClick={() => setFilter(filter === "added" ? "all" : "added")}
          />
          <StatPill
            kind="modified"
            count={counts.modified}
            active={filter === "modified" || filter === "all"}
            onClick={() =>
              setFilter(filter === "modified" ? "all" : "modified")
            }
          />
          <StatPill
            kind="removed"
            count={counts.removed}
            active={filter === "removed" || filter === "all"}
            onClick={() => setFilter(filter === "removed" ? "all" : "removed")}
          />
          <span className="ml-auto text-[11px] text-ink-500">
            {filtered.length} of {deltas.length} change
            {deltas.length === 1 ? "" : "s"} shown
          </span>
        </div>

        {/* Delta list */}
        <div className="overflow-hidden rounded-lg border border-ink-200">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-[12.5px] text-ink-500">
              <GitCompare className="h-4 w-4" />
              {fromId === toId
                ? "Pick two different tags to see the diff."
                : "No structural changes between these two tags."}
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {filtered.map((d) => {
                const tint =
                  d.kind === "added"
                    ? "bg-emerald-50/60 border-l-emerald-500"
                    : d.kind === "removed"
                    ? "bg-rose-50/50 border-l-rose-500"
                    : "bg-sky-50/40 border-l-sky-500";
                const Icon =
                  d.kind === "added"
                    ? FilePlus2
                    : d.kind === "removed"
                    ? FileMinus2
                    : FilePenLine;
                return (
                  <li
                    key={d.entityId + d.at}
                    className={clsx(
                      "flex items-start gap-3 border-l-4 px-3 py-2",
                      tint
                    )}
                  >
                    <Icon
                      className={clsx(
                        "mt-0.5 h-4 w-4 shrink-0",
                        d.kind === "added" && "text-emerald-700",
                        d.kind === "removed" && "text-rose-700",
                        d.kind === "modified" && "text-sky-700"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[12.5px]">
                        <span
                          className={clsx(
                            "chip text-[10px] font-semibold uppercase",
                            d.kind === "added" && "bg-emerald-600 text-white",
                            d.kind === "removed" && "bg-rose-600 text-white",
                            d.kind === "modified" && "bg-sky-600 text-white"
                          )}
                        >
                          {d.kind}
                        </span>
                        <span className="font-semibold text-ink-900">
                          {d.entityName}
                        </span>
                        <span className="font-mono text-[10.5px] text-ink-400">
                          {d.entityId}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-ink-600">
                        {d.summary}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-500">
                        <div
                          className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                          style={{ background: d.authorColor }}
                        >
                          {d.authorInitials}
                        </div>
                        <span>{d.authorName}</span>
                        <span className="text-ink-300">·</span>
                        <span>{new Date(d.at).toLocaleString()}</span>
                      </div>
                    </div>
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

function StatPill({
  kind,
  count,
  active,
  onClick,
}: {
  kind: DeltaKind;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const color =
    kind === "added"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : kind === "removed"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : "bg-sky-50 text-sky-700 ring-sky-200";
  const Icon =
    kind === "added"
      ? FilePlus2
      : kind === "removed"
      ? FileMinus2
      : FilePenLine;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ring-1 transition-opacity",
        color,
        !active && "opacity-40"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {count} {kind}
    </button>
  );
}
