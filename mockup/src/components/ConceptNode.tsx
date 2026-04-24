import { Handle, NodeProps, Position } from "@xyflow/react";
import clsx from "clsx";
import { displayPropertyValue, type Concept } from "../data/mock";

const colorMap: Record<NonNullable<Concept["color"]>, { bg: string; border: string; dot: string; text: string }> = {
  violet: {
    bg: "bg-gradient-to-br from-violet-50 to-white",
    border: "border-violet-300",
    dot: "bg-violet-500",
    text: "text-violet-900",
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-50 to-white",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-900",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-50 to-white",
    border: "border-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-900",
  },
  sky: {
    bg: "bg-gradient-to-br from-sky-50 to-white",
    border: "border-sky-300",
    dot: "bg-sky-500",
    text: "text-sky-900",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-50 to-white",
    border: "border-rose-300",
    dot: "bg-rose-500",
    text: "text-rose-900",
  },
};

export type ConceptNodeData = {
  concept: Concept;
  selected?: boolean;
};

export default function ConceptNode({ data, selected }: NodeProps) {
  const concept = (data as ConceptNodeData).concept;
  const c = colorMap[concept.color ?? "violet"];

  return (
    <div
      className={clsx(
        "w-60 rounded-xl border-2 shadow-card transition-all",
        c.bg,
        c.border,
        selected ? "ring-4 ring-brand-500/30 -translate-y-0.5 shadow-pop" : "hover:shadow-pop"
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />

      <div className="flex items-center gap-2 border-b border-black/5 px-3 py-2">
        <span className={clsx("h-2 w-2 shrink-0 rounded-full", c.dot)} />
        <div className={clsx("text-[13px] font-semibold tracking-tight", c.text)}>
          {concept.name}
        </div>
        <div className="ml-auto font-mono text-[10px] text-ink-400">
          {concept.id.slice(2)}
        </div>
      </div>

      <ul className="px-3 py-2 text-[11px] font-mono">
        {concept.properties.slice(0, 4).map((p) => (
          <li
            key={p.key}
            className="flex items-baseline justify-between gap-2 py-0.5 leading-snug"
          >
            <span className="font-semibold text-ink-700">{p.key}</span>
            <span className="truncate text-ink-500">
              {displayPropertyValue(p, "en")}
            </span>
          </li>
        ))}
        {concept.properties.length > 4 && (
          <li className="pt-0.5 text-[10px] italic text-ink-400">
            +{concept.properties.length - 4} more
          </li>
        )}
      </ul>
    </div>
  );
}
