import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Tag as TagIcon,
  GitCommit,
  Users,
  Upload,
  Zap,
  TrendingUp,
  BookOpen,
  ListTree,
  Layers,
  FilePlus2,
  FilePenLine,
  FileMinus2,
  Undo2,
  Filter,
  History,
} from "lucide-react";
import clsx from "clsx";
import {
  ontologies,
  changeEvents,
  usage,
  members,
  type ArtefactMode,
} from "../data/mock";
import { useApp } from "../app/AppContext";

// Visual language per artefact mode — mirrors Editor.tsx.
const MODE_META: Record<
  ArtefactMode,
  { label: string; icon: typeof BookOpen; pill: string; wash: string }
> = {
  glossary: {
    label: "Glossary",
    icon: BookOpen,
    pill: "bg-violet-100 text-violet-700",
    wash: "from-violet-100 to-violet-200 text-violet-700",
  },
  taxonomy: {
    label: "Taxonomy",
    icon: ListTree,
    pill: "bg-emerald-100 text-emerald-700",
    wash: "from-emerald-100 to-emerald-200 text-emerald-700",
  },
  ontology: {
    label: "Ontology",
    icon: Layers,
    pill: "bg-sky-100 text-sky-700",
    wash: "from-sky-100 to-sky-200 text-sky-700",
  },
};

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

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

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-ink-600">{label}</span>
        <span className="text-[11px] text-ink-500">
          {formatNumber(used)} / {formatNumber(limit)}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type ActivityFilter = "all" | "create" | "update" | "delete" | "tag" | "bulk_import";

export default function Dashboard() {
  const { openNewArtefact, tick } = useApp();
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  // Re-read events whenever the store mutates — imports, edits, deprecations
  // all flow through here so the feed feels live.
  const recent = useMemo(() => {
    return changeEvents
      .filter((e) =>
        activityFilter === "all"
          ? true
          : activityFilter === "delete"
          ? e.kind === "delete" || e.kind === "revert"
          : e.kind === activityFilter
      )
      .slice(0, 10);
  }, [activityFilter, tick]);

  // Count unique contributors in the last 50 events — powers the "X people
  // contributed this week" strip below the stats.
  const weeklyContributors = useMemo(() => {
    const names = new Set<string>();
    changeEvents
      .slice(0, 50)
      .forEach((e) => names.add(e.author.name));
    return names.size;
  }, [tick]);

  function hrefForEvent(e: (typeof changeEvents)[number]): string {
    // Concept events land on the detail page inside the first ontology we
    // find — good enough for the mock.
    if (e.entityKind === "concept") {
      const ont = ontologies.find((o) => o.id === "ont_cars") ?? ontologies[0];
      return `/ontologies/${ont.id}/concepts/${e.entityId}`;
    }
    return `/ontologies/${ontologies[0].id}`;
  }

  function iconForEvent(e: (typeof changeEvents)[number]) {
    switch (e.kind) {
      case "create":
        return FilePlus2;
      case "update":
        return FilePenLine;
      case "delete":
        return FileMinus2;
      case "revert":
        return Undo2;
      case "tag":
        return TagIcon;
      case "bulk_import":
        return Upload;
      default:
        return History;
    }
  }

  function kindColor(k: string): string {
    if (k === "create" || k === "bulk_import")
      return "bg-emerald-100 text-emerald-700";
    if (k === "update") return "bg-sky-100 text-sky-700";
    if (k === "delete") return "bg-rose-100 text-rose-700";
    if (k === "revert") return "bg-amber-100 text-amber-700";
    if (k === "tag") return "bg-violet-100 text-violet-700";
    return "bg-ink-100 text-ink-700";
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            Welcome back, Valentin
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Here's what's happening in the{" "}
            <span className="font-medium text-ink-800">Thinkware</span>{" "}
            workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/import" className="btn-secondary">
            <Upload className="h-4 w-4" />
            Import
          </Link>
          <button className="btn-primary" onClick={openNewArtefact}>
            <Plus className="h-4 w-4" />
            New artefact
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Concepts
            </span>
            <GitCommit className="h-4 w-4 text-ink-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-ink-900">
              397
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +42 this week
            </span>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Change events (7d)
            </span>
            <Zap className="h-4 w-4 text-ink-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-ink-900">
              128
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-ink-500">
              across 3 ontologies
            </span>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              API calls (30d)
            </span>
            <ArrowUpRight className="h-4 w-4 text-ink-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-ink-900">
              142k
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-ink-500">
              of 500k limit
            </span>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Members
            </span>
            <Users className="h-4 w-4 text-ink-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-ink-900">
              {members.length}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-ink-500">
              · 1 pending invite
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-col */}
      <div className="mt-6 grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          {/* Ontologies */}
          <section className="card">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold text-ink-900">
                  Your ontologies
                </h2>
                <p className="text-xs text-ink-500">
                  {ontologies.length} active in Thinkware
                </p>
              </div>
              <button className="btn-ghost text-xs">View all</button>
            </div>
            <ul>
              {ontologies.map((o) => {
                const modeMeta = MODE_META[o.mode];
                const ModeIcon = modeMeta.icon;
                return (
                  <li
                    key={o.id}
                    className="group flex items-center gap-4 border-b border-ink-100 px-5 py-4 last:border-b-0 hover:bg-ink-50/60"
                  >
                    <div
                      className={clsx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                        modeMeta.wash
                      )}
                    >
                      <ModeIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/ontologies/${o.id}`}
                          className="truncate text-sm font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {o.name}
                        </Link>
                        <span
                          className={clsx("chip font-semibold", modeMeta.pill)}
                        >
                          {modeMeta.label}
                        </span>
                        {o.tags.map((t) => (
                          <span
                            key={t}
                            className="chip bg-brand-50 text-brand-700"
                          >
                            <TagIcon className="h-3 w-3" />
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-500">
                        {o.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-500">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="h-3 w-3 text-ink-400" />
                          {o.classCount} class{o.classCount === 1 ? "" : "es"}
                        </span>
                        <span className="text-ink-300">·</span>
                        <span>
                          {o.relationTypeCount} relation type
                          {o.relationTypeCount === 1 ? "" : "s"}
                        </span>
                        <span className="text-ink-300">·</span>
                        <span>
                          {o.schemeCount} scheme{o.schemeCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                    <div className="hidden shrink-0 text-right md:block">
                      <div className="text-xs font-semibold text-ink-800">
                        {formatNumber(o.conceptCount)} concepts
                      </div>
                      <div className="text-[11px] text-ink-500">
                        {formatNumber(o.relationCount)} relations
                      </div>
                    </div>
                    <div className="hidden w-28 shrink-0 text-right lg:block">
                      <div className="text-[11px] text-ink-500">
                        {timeAgo(o.lastChange)}
                      </div>
                      <div className="truncate text-[11px] text-ink-400">
                        {o.lastAuthor.split(" ")[0]}
                      </div>
                    </div>
                    <button className="rounded-md p-1.5 text-ink-400 opacity-0 transition-opacity hover:bg-ink-100 hover:text-ink-700 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Activity feed */}
          <section className="card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold text-ink-900">
                  Recent activity
                </h2>
                <p className="text-xs text-ink-500">
                  {weeklyContributors} contributor
                  {weeklyContributors === 1 ? "" : "s"} across every ontology —
                  pulled live from the change log.
                </p>
              </div>
              <Link
                to={`/ontologies/${ontologies[0].id}`}
                className="btn-ghost text-xs"
              >
                <History className="h-3.5 w-3.5" />
                Open history
              </Link>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-1 border-b border-ink-100 bg-ink-50/50 px-5 py-2 text-[11px]">
              <Filter className="h-3 w-3 text-ink-400" />
              {(
                ["all", "create", "update", "delete", "tag", "bulk_import"] as const
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setActivityFilter(f)}
                  className={clsx(
                    "rounded-md px-2 py-0.5 font-semibold capitalize transition-colors",
                    activityFilter === f
                      ? "bg-brand-600 text-white"
                      : "bg-white text-ink-600 hover:bg-ink-100"
                  )}
                >
                  {f === "bulk_import" ? "import" : f}
                </button>
              ))}
            </div>

            <ul className="divide-y divide-ink-100">
              {recent.length === 0 && (
                <li className="px-5 py-8 text-center text-[12.5px] text-ink-500">
                  No {activityFilter === "all" ? "" : activityFilter + " "}
                  events yet.
                </li>
              )}
              {recent.map((e) => {
                const Icon = iconForEvent(e);
                return (
                  <li
                    key={e.id}
                    onClick={() => navigate(hrefForEvent(e))}
                    className="flex cursor-pointer items-start gap-3 px-5 py-3 transition-colors hover:bg-ink-50"
                  >
                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ background: e.author.color }}
                    >
                      {e.author.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm text-ink-800">
                        <span className="font-semibold">{e.author.name}</span>
                        <span
                          className={clsx(
                            "chip text-[10px]",
                            kindColor(e.kind)
                          )}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {e.kind === "bulk_import" ? "import" : e.kind}
                        </span>
                        <span className="truncate font-medium text-ink-900">
                          {e.entityName}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-xs text-ink-600">
                        {e.summary}
                      </div>
                      {e.message && (
                        <div className="mt-1 rounded-md border border-ink-100 bg-white px-2 py-1 text-[11.5px] italic text-ink-600">
                          “{e.message}”
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-500">
                        <span>{timeAgo(e.at)}</span>
                        <span className="text-ink-300">·</span>
                        <span className="font-mono">{e.id}</span>
                        {e.revertsEventId && (
                          <>
                            <span className="text-ink-300">·</span>
                            <span className="font-mono text-amber-700">
                              reverts {e.revertsEventId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-900">Plan usage</h3>
            <p className="text-xs text-ink-500">
              Team plan · renews May 1, 2026
            </p>
            <div className="mt-4 space-y-3">
              <UsageBar
                label="Concepts"
                used={usage.concepts.used}
                limit={usage.concepts.limit}
              />
              <UsageBar
                label="API calls"
                used={usage.apiCalls.used}
                limit={usage.apiCalls.limit}
              />
              <UsageBar
                label="Workspaces"
                used={usage.workspaces.used}
                limit={usage.workspaces.limit}
              />
              <UsageBar
                label="Webhooks"
                used={usage.webhooks.used}
                limit={usage.webhooks.limit}
              />
            </div>
            <Link
              to="/settings/billing"
              className="mt-4 block w-full rounded-lg border border-ink-200 bg-white py-2 text-center text-xs font-semibold text-ink-700 hover:bg-ink-50"
            >
              Manage billing
            </Link>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-900">
              Recent members
            </h3>
            <p className="text-xs text-ink-500">{members.length} active</p>
            <ul className="mt-3 space-y-2.5">
              {members.slice(0, 4).map((m) => (
                <li key={m.email} className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-ink-800">
                      {m.name}
                    </div>
                    <div className="truncate text-[11px] text-ink-500">
                      {m.role} · {m.lastActive}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/settings/members"
              className="mt-4 block w-full rounded-lg border border-ink-200 bg-white py-2 text-center text-xs font-semibold text-ink-700 hover:bg-ink-50"
            >
              Manage members
            </Link>
          </div>

          <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-5">
            <h3 className="text-sm font-semibold text-brand-900">
              Quick start
            </h3>
            <p className="mt-1 text-xs text-brand-800/80">
              Build your first ontology or bring in existing data.
            </p>
            <div className="mt-3 space-y-1.5">
              <Link
                to="/import"
                className="flex items-center justify-between rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-800 hover:border-brand-400"
              >
                Import CSV or Excel
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#"
                className="flex items-center justify-between rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-800 hover:border-brand-400"
              >
                Read the API quickstart
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-800 hover:border-brand-400"
              >
                Invite your team
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
