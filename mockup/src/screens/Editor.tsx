import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../app/AppContext";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react";
import clsx from "clsx";
import {
  Circle,
  Plus,
  Tag as TagIcon,
  History,
  Download,
  Search,
  MousePointer2,
  Link2,
  GripVertical,
  Play,
  Info,
  ChevronRight,
  ChevronLeft,
  Undo2,
  Copy,
  Trash2,
  PanelRight,
  Pencil,
  RefreshCw,
  GitCommit,
  Layers,
  Filter,
  FileDown,
} from "lucide-react";
import ConceptNode from "../components/ConceptNode";
import Modal from "../components/Modal";
import {
  concepts as allConcepts,
  relations as allRelations,
  changeEvents,
  ontologies,
  tags,
} from "../data/mock";

type RightPanel = "inspector" | "history";

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

function EditorCanvas({
  selectedId,
  onSelect,
  onNodeDoubleClick,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onNodeDoubleClick: (id: string) => void;
}) {
  const nodes: Node[] = useMemo(
    () =>
      allConcepts.map((c) => ({
        id: c.id,
        type: "concept",
        position: { x: c.x, y: c.y },
        data: { concept: c },
        selected: selectedId === c.id,
      })),
    [selectedId]
  );

  const edges: Edge[] = useMemo(
    () =>
      allRelations.map((r) => ({
        id: r.id,
        source: r.from,
        target: r.to,
        label: r.label,
        type: "smoothstep",
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#94a3b8",
          width: 18,
          height: 18,
        },
        style: { stroke: "#94a3b8" },
        labelStyle: {
          fill: "#475569",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "Inter, system-ui",
        },
        labelBgStyle: {
          fill: "#ffffff",
          stroke: "#e2e8f0",
          strokeWidth: 1,
        },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 6,
      })),
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ concept: ConceptNode }}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      onPaneClick={() => onSelect(null)}
      onNodeClick={(_e, n) => onSelect(n.id)}
      onNodeDoubleClick={(_e, n) => onNodeDoubleClick(n.id)}
      minZoom={0.2}
      maxZoom={2}
      defaultEdgeOptions={{ type: "smoothstep" }}
      proOptions={{ hideAttribution: false }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1.2}
        color="#cbd5e1"
      />
      <Controls
        showInteractive={false}
        position="bottom-right"
        className="!shadow-pop"
      />
      <MiniMap
        className="!rounded-lg !border !border-ink-200 !bg-white shadow-card"
        nodeStrokeColor="#64748b"
        nodeColor={(n) => {
          const c = (n.data as any).concept;
          const map: Record<string, string> = {
            violet: "#c4b5fd",
            emerald: "#6ee7b7",
            amber: "#fcd34d",
            sky: "#7dd3fc",
            rose: "#fda4af",
          };
          return map[c.color] ?? "#c4b5fd";
        }}
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

function Inspector({
  conceptId,
  ontologyId,
  onOpenHistory,
}: {
  conceptId: string;
  ontologyId: string;
  onOpenHistory: () => void;
}) {
  const concept = allConcepts.find((c) => c.id === conceptId)!;
  const lastChange = changeEvents.find((e) => e.id === concept.lastChangeId);
  const outgoing = allRelations.filter((r) => r.from === concept.id);
  const incoming = allRelations.filter((r) => r.to === concept.id);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Circle className="h-4 w-4 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold tracking-tight text-ink-900">
              {concept.name}
            </div>
            <div className="font-mono text-[11px] text-ink-400">
              {concept.id}
            </div>
          </div>
          <Link
            to={`/ontologies/${ontologyId}/concepts/${concept.id}`}
            title="Open full page"
            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink-600">
          {concept.description}
        </p>
        <div className="mt-3 flex items-center gap-1">
          <Link
            to={`/ontologies/${ontologyId}/concepts/${concept.id}`}
            className="btn-primary py-1 px-2 text-[11px]"
          >
            <Pencil className="h-3 w-3" />
            Open full page
          </Link>
          <button className="btn-secondary py-1 px-2 text-[11px]">
            <Copy className="h-3 w-3" />
            Duplicate
          </button>
          <button className="btn-danger py-1 px-2 text-[11px]">
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto scroll-thin">
        {/* Properties */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Properties ({concept.properties.length})
            </h3>
            <button className="text-[11px] font-semibold text-brand-700 hover:text-brand-800">
              + Add
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-ink-200">
            {concept.properties.map((p, i) => (
              <div
                key={p.key}
                className={clsx(
                  "grid grid-cols-[1fr_1.4fr] items-center gap-3 px-3 py-2 text-[12px] font-mono",
                  i !== 0 && "border-t border-ink-100",
                  "hover:bg-ink-50"
                )}
              >
                <span className="truncate font-semibold text-ink-800">
                  {p.key}
                </span>
                <span className="truncate text-ink-500">{p.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Relations */}
        <section className="border-b border-ink-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Relations
            </h3>
            <button className="text-[11px] font-semibold text-brand-700 hover:text-brand-800">
              + New relation
            </button>
          </div>
          <div className="space-y-1">
            {outgoing.map((r) => {
              const to = allConcepts.find((c) => c.id === r.to)!;
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-2.5 py-1.5 text-[12px]"
                >
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10px]">
                    {r.label}
                  </span>
                  <ChevronRight className="h-3 w-3 text-ink-400" />
                  <span className="font-medium text-ink-800">{to.name}</span>
                </div>
              );
            })}
            {incoming.map((r) => {
              const from = allConcepts.find((c) => c.id === r.from)!;
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-2 rounded-md border border-ink-200 bg-ink-50/50 px-2.5 py-1.5 text-[12px]"
                >
                  <span className="font-medium text-ink-800">{from.name}</span>
                  <ChevronRight className="h-3 w-3 text-ink-400" />
                  <span className="chip bg-ink-100 text-ink-700 font-mono text-[10px]">
                    {r.label}
                  </span>
                  <span className="ml-auto text-[10px] italic text-ink-400">
                    inbound
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Last change */}
        {lastChange && (
          <section className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Last change
              </h3>
              <button
                onClick={onOpenHistory}
                className="text-[11px] font-semibold text-brand-700 hover:text-brand-800"
              >
                See history →
              </button>
            </div>
            <div className="rounded-lg border border-ink-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: lastChange.author.color }}
                >
                  {lastChange.author.initials}
                </div>
                <div className="min-w-0 flex-1 text-[12px]">
                  <span className="font-semibold text-ink-800">
                    {lastChange.author.name}
                  </span>
                  <span className="text-ink-500">
                    {" "}
                    · {timeAgo(lastChange.at)}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-ink-400">
                  {lastChange.id}
                </span>
              </div>
              {lastChange.message && (
                <p className="mt-1.5 text-[12px] text-ink-700">
                  {lastChange.message}
                </p>
              )}
              <p className="mt-1 text-[11px] text-ink-500">
                {lastChange.summary}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function HistoryPanel({
  onRevert,
  onTag,
}: {
  onRevert: (id: string) => void;
  onTag: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "concept" | "relation" | "tag">(
    "all"
  );
  const events = changeEvents.filter(
    (e) => filter === "all" || e.entityKind === filter
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-ink-500" />
          <h3 className="text-sm font-semibold text-ink-900">Change history</h3>
          <span className="chip bg-ink-100 text-ink-600">
            {changeEvents.length}
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-ink-500">
          Every operation on this ontology. Click{" "}
          <Undo2 className="inline h-3 w-3" /> to revert.
        </p>
        <div className="mt-3 flex gap-1">
          {(["all", "concept", "relation", "tag"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-md px-2 py-1 text-[11px] font-medium capitalize",
                filter === f
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200"
              )}
            >
              {f}
            </button>
          ))}
          <button className="ml-auto rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ol className="min-h-0 flex-1 overflow-auto scroll-thin">
        {events.map((e, idx) => {
          const tagForEvent = tags.find((t) => t.changeEventId === e.id);
          return (
            <li
              key={e.id}
              className="relative px-4 py-3 hover:bg-ink-50/60"
            >
              {idx !== events.length - 1 && (
                <span className="absolute left-[30px] top-[44px] bottom-[-8px] w-px bg-ink-200" />
              )}
              <div className="flex items-start gap-3">
                <div
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-4 ring-white"
                  style={{ background: e.author.color }}
                >
                  {e.author.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[12.5px]">
                    <span className="font-semibold text-ink-900">
                      {e.author.name.split(" ")[0]}
                    </span>
                    <span
                      className={clsx(
                        "chip text-[10px] font-semibold",
                        e.kind === "create" &&
                          "bg-emerald-50 text-emerald-700",
                        e.kind === "update" && "bg-sky-50 text-sky-700",
                        e.kind === "delete" && "bg-rose-50 text-rose-700",
                        e.kind === "revert" && "bg-amber-50 text-amber-700",
                        e.kind === "tag" && "bg-brand-50 text-brand-700",
                        e.kind === "bulk_import" &&
                          "bg-indigo-50 text-indigo-700"
                      )}
                    >
                      {e.kind === "bulk_import" ? "bulk import" : e.kind}
                    </span>
                    {tagForEvent && (
                      <span className="chip bg-brand-600 text-white">
                        <TagIcon className="h-2.5 w-2.5" />
                        {tagForEvent.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[12.5px] text-ink-800">
                    <span className="text-ink-500">{e.summary}</span>
                  </div>
                  {e.message && (
                    <p className="mt-1 rounded-md border border-ink-100 bg-white px-2 py-1 text-[11.5px] italic text-ink-600">
                      “{e.message}”
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-500">
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
                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        onClick={() => onTag(e.id)}
                        title="Tag this change"
                        className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      >
                        <TagIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onRevert(e.id)}
                        title="Revert"
                        className="rounded-md p-1 text-ink-400 hover:bg-amber-100 hover:text-amber-700"
                      >
                        <Undo2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EmptyInspector() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <MousePointer2 className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-ink-800">
        Select a concept
      </h3>
      <p className="mt-1 max-w-xs text-xs text-ink-500">
        Click any node on the canvas to view its properties, relations, and
        change history.
      </p>
      <div className="mt-4 flex flex-col gap-1 text-[11px] text-ink-500">
        <div className="flex items-center gap-2">
          <kbd className="kbd">C</kbd> new concept
        </div>
        <div className="flex items-center gap-2">
          <kbd className="kbd">R</kbd> new relation
        </div>
        <div className="flex items-center gap-2">
          <kbd className="kbd">/</kbd> search
        </div>
      </div>
    </div>
  );
}

export default function Editor() {
  const { id = "ont_ecom" } = useParams();
  const ontology = ontologies.find((o) => o.id === id) ?? ontologies[0];
  const navigate = useNavigate();
  const { openNewConcept, toast } = useApp();

  const [selectedId, setSelectedId] = useState<string | null>("c_product");
  const [rightPanel, setRightPanel] = useState<RightPanel>("inspector");
  const [rightOpen, setRightOpen] = useState(true);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [taggingId, setTaggingId] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Sub-toolbar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-ink-200 bg-white px-4">
        <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-ink-50 p-0.5">
          <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[11.5px] font-semibold text-ink-900 shadow-sm">
            <Layers className="h-3.5 w-3.5" />
            Canvas
          </button>
          <button className="rounded-md px-2 py-1 text-[11.5px] font-semibold text-ink-500 hover:bg-white hover:text-ink-800">
            Table
          </button>
          <button className="rounded-md px-2 py-1 text-[11.5px] font-semibold text-ink-500 hover:bg-white hover:text-ink-800">
            Schema
          </button>
        </div>
        <div className="mx-2 h-5 w-px bg-ink-200" />
        <button
          onClick={openNewConcept}
          className="btn-ghost py-1 px-2 text-[12px]"
        >
          <Plus className="h-3.5 w-3.5" />
          Concept
        </button>
        <button
          onClick={() =>
            toast({
              kind: "info",
              title: "Click two concepts to link",
              description: "Pick a source, then a target to define the relation.",
            })
          }
          className="btn-ghost py-1 px-2 text-[12px]"
        >
          <Link2 className="h-3.5 w-3.5" />
          Relation
        </button>
        <div className="relative mx-2">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            placeholder="Search concepts…"
            className="w-56 rounded-lg border border-ink-200 bg-ink-50 py-1 pl-7 pr-2 text-[12px] placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="chip bg-emerald-50 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Saved · synced
          </span>
          <div className="flex -space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-semibold text-white">
              AD
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-[10px] font-semibold text-white">
              VL
            </div>
          </div>
          <div className="mx-1 h-5 w-px bg-ink-200" />
          <button
            onClick={() => setTaggingId("ce_12")}
            className="btn-secondary py-1 px-2 text-[12px]"
          >
            <TagIcon className="h-3.5 w-3.5" />
            Tag current state
          </button>
          <button
            onClick={() =>
              toast({
                kind: "success",
                title: "Export queued",
                description: "Your JSON download will be ready in a moment.",
              })
            }
            className="btn-secondary py-1 px-2 text-[12px]"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            onClick={() =>
              toast({
                kind: "info",
                title: "API playground opened",
                description: "Try GET /ontologies/" + ontology.id + "/concepts",
              })
            }
            className="btn-primary py-1 px-2 text-[12px]"
          >
            <Play className="h-3.5 w-3.5" />
            Run API query
          </button>
          <button
            onClick={() => setRightOpen((v) => !v)}
            className="ml-1 rounded-md p-1.5 text-ink-500 hover:bg-ink-100"
            title={rightOpen ? "Hide panel" : "Show panel"}
          >
            {rightOpen ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Canvas + panels */}
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 bg-ink-50">
          {/* Ontology meta strip */}
          <div className="pointer-events-none absolute left-4 top-4 z-10">
            <div className="pointer-events-auto inline-flex items-center gap-3 rounded-xl border border-ink-200 bg-white/90 px-3 py-2 shadow-card backdrop-blur">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-white">
                <GitCommit className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-900">
                  {ontology.name}
                  <span className="chip bg-ink-100 text-ink-600">
                    {ontology.tags[0] ?? "draft"}
                  </span>
                </div>
                <div className="text-[11px] text-ink-500">
                  {ontology.conceptCount} concepts · {ontology.relationCount}{" "}
                  relations · {timeAgo(ontology.lastChange)}
                </div>
              </div>
              <div className="ml-2 flex items-center gap-1">
                <button className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10">
            <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-ink-200 bg-white/90 px-3 py-1.5 text-[11px] shadow-card backdrop-blur">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Root
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Domain
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Attribute
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                Party
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Variant
              </span>
            </div>
          </div>

          <ReactFlowProvider>
            <EditorCanvas
              selectedId={selectedId}
              onSelect={setSelectedId}
              onNodeDoubleClick={(cid) =>
                navigate(`/ontologies/${ontology.id}/concepts/${cid}`)
              }
            />
          </ReactFlowProvider>
        </div>

        {/* Right panel */}
        {rightOpen && (
          <aside className="flex w-[380px] shrink-0 flex-col border-l border-ink-200 bg-white">
            <div className="flex h-10 shrink-0 items-center gap-1 border-b border-ink-100 bg-ink-50/50 px-2">
              <button
                onClick={() => setRightPanel("inspector")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold",
                  rightPanel === "inspector"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <GripVertical className="h-3.5 w-3.5" />
                Inspector
              </button>
              <button
                onClick={() => setRightPanel("history")}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold",
                  rightPanel === "history"
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-ink-500 hover:text-ink-800"
                )}
              >
                <History className="h-3.5 w-3.5" />
                History
                <span className="chip bg-ink-100 text-ink-600 text-[10px]">
                  {changeEvents.length}
                </span>
              </button>
              <button className="ml-auto rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              {rightPanel === "inspector" &&
                (selectedId ? (
                  <Inspector
                    conceptId={selectedId}
                    ontologyId={ontology.id}
                    onOpenHistory={() => setRightPanel("history")}
                  />
                ) : (
                  <EmptyInspector />
                ))}
              {rightPanel === "history" && (
                <HistoryPanel
                  onRevert={(id) => setRevertingId(id)}
                  onTag={(id) => setTaggingId(id)}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Modals */}
      <RevertModal
        eventId={revertingId}
        onClose={() => setRevertingId(null)}
      />
      <TagModal eventId={taggingId} onClose={() => setTaggingId(null)} />
    </div>
  );
}

function RevertModal({
  eventId,
  onClose,
}: {
  eventId: string | null;
  onClose: () => void;
}) {
  const event = changeEvents.find((e) => e.id === eventId);
  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Revert change"
      subtitle="Undo this change by creating a new, opposite change event. The original entry stays in the history for audit."
      width="max-w-lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn-primary">
            <Undo2 className="h-3.5 w-3.5" />
            Revert change
          </button>
        </>
      }
    >
      {event && (
        <>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="h-4 w-4" />
              Reverting is non-destructive
            </div>
            <p className="mt-1 text-amber-800/90">
              Ontologia records a new change event that inverts this one. Both
              will stay visible in the history with the same SHA trail.
            </p>
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              You are reverting
            </div>
            <div className="mt-1.5 rounded-lg border border-ink-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: event.author.color }}
                >
                  {event.author.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink-900">
                    {event.author.name}{" "}
                    <span className="font-normal text-ink-500">
                      · {event.summary}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-500">
                    <span>{timeAgo(event.at)}</span>
                    <span className="text-ink-300">·</span>
                    <span className="font-mono">{event.id}</span>
                  </div>
                </div>
              </div>
              {event.message && (
                <p className="mt-2 text-[12px] italic text-ink-600">
                  “{event.message}”
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Revert message <span className="text-ink-400">(optional)</span>
            </label>
            <textarea
              className="input min-h-[72px] resize-y"
              placeholder="Why are you reverting this change?"
              defaultValue="Restoring Product.price as required — downstream RAG needs it non-null."
            />
          </div>
        </>
      )}
    </Modal>
  );
}

function TagModal({
  eventId,
  onClose,
}: {
  eventId: string | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("v1.3");
  const event = changeEvents.find((e) => e.id === eventId);
  return (
    <Modal
      open={!!event}
      onClose={onClose}
      title="Tag this change"
      subtitle="Name a stable snapshot so downstream services can pin to it."
      width="max-w-md"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn-primary">
            <TagIcon className="h-3.5 w-3.5" />
            Create tag
          </button>
        </>
      }
    >
      {event && (
        <>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Tag name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input font-mono"
              placeholder="v1.3"
            />
            <p className="mt-1 text-[11px] text-ink-500">
              Lowercase, digits, dots and hyphens. Must be unique per ontology.
            </p>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Description <span className="text-ink-400">(optional)</span>
            </label>
            <textarea
              className="input min-h-[64px] resize-y"
              placeholder="What changed since the last tag?"
              defaultValue="Adds Product.status enum and the Collection concept. Ready for the staging RAG pipeline."
            />
          </div>

          <div className="mt-4 rounded-lg border border-ink-200 bg-ink-50 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Pinning to
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ background: event.author.color }}
              >
                {event.author.initials}
              </div>
              <div className="min-w-0 text-[12.5px]">
                <span className="font-semibold text-ink-900">
                  {event.entityName}
                </span>{" "}
                <span className="text-ink-500">· {event.summary}</span>
              </div>
              <span className="ml-auto font-mono text-[11px] text-ink-400">
                {event.id}
              </span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
