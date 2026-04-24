import { Handle, NodeProps, Position } from "@xyflow/react";
import clsx from "clsx";
import { Layers } from "lucide-react";
import type { ConceptClass } from "../data/mock";

// Visual-language map — classes carry a class-color property that matches the
// swatch used in chips and tree rows. The canvas class-node mirrors the same
// accent on its header banner so classes feel consistent across the app.
const colorMap: Record<
  NonNullable<ConceptClass["color"]>,
  { banner: string; border: string; text: string; ring: string }
> = {
  violet: {
    banner: "bg-gradient-to-r from-violet-500 to-violet-700",
    border: "border-violet-300",
    text: "text-violet-900",
    ring: "ring-violet-300",
  },
  emerald: {
    banner: "bg-gradient-to-r from-emerald-500 to-emerald-700",
    border: "border-emerald-300",
    text: "text-emerald-900",
    ring: "ring-emerald-300",
  },
  amber: {
    banner: "bg-gradient-to-r from-amber-500 to-amber-700",
    border: "border-amber-300",
    text: "text-amber-900",
    ring: "ring-amber-300",
  },
  sky: {
    banner: "bg-gradient-to-r from-sky-500 to-sky-700",
    border: "border-sky-300",
    text: "text-sky-900",
    ring: "ring-sky-300",
  },
  rose: {
    banner: "bg-gradient-to-r from-rose-500 to-rose-700",
    border: "border-rose-300",
    text: "text-rose-900",
    ring: "ring-rose-300",
  },
  ink: {
    banner: "bg-gradient-to-r from-ink-600 to-ink-800",
    border: "border-ink-300",
    text: "text-ink-900",
    ring: "ring-ink-300",
  },
};

export type ClassNodeData = {
  cls: ConceptClass;
  instanceCount: number;
};

export default function ClassNode({ data, selected }: NodeProps) {
  const d = data as ClassNodeData;
  const cls = d.cls;
  const color = colorMap[cls.color ?? "ink"];
  const props = cls.properties ?? [];

  return (
    <div
      className={clsx(
        "w-60 rounded-xl border-2 bg-white shadow-card transition-all",
        color.border,
        selected
          ? "ring-4 ring-brand-500/30 -translate-y-0.5 shadow-pop"
          : "hover:shadow-pop"
      )}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="target" position={Position.Left} id="l" />

      {/* Header banner — colored by the class accent. */}
      <div
        className={clsx(
          "flex items-center gap-2 rounded-t-[8px] px-3 py-1.5 text-white",
          color.banner
        )}
      >
        <Layers className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate text-[12.5px] font-semibold tracking-tight">
          {cls.name}
        </span>
        <span
          className="ml-auto rounded-full bg-white/25 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider"
          title="owl:Class"
        >
          Class
        </span>
      </div>

      {/* Identity row */}
      <div className="flex items-center justify-between border-b border-black/5 px-3 py-1.5">
        <span className="font-mono text-[10.5px] text-ink-500">{cls.id}</span>
        <span className="text-[10.5px] font-semibold text-ink-600">
          {d.instanceCount} instance{d.instanceCount === 1 ? "" : "s"}
        </span>
      </div>

      {/* Attributes list — shows the custom properties declared on the class. */}
      <ul className="px-3 py-2 text-[11px] font-mono">
        {props.length === 0 && (
          <li className="italic text-ink-400">— no custom attributes —</li>
        )}
        {props.slice(0, 5).map((p) => (
          <li
            key={p.key}
            className="flex items-baseline justify-between gap-2 py-0.5 leading-snug"
            title={p.description}
          >
            <span className="flex items-center gap-1 font-semibold text-ink-700">
              {p.key}
              {p.required && (
                <span
                  className="text-[9px] text-rose-500"
                  title="required"
                >
                  *
                </span>
              )}
              {p.localizable && (
                <span
                  className="rounded bg-brand-50 px-1 text-[9px] font-semibold uppercase tracking-wider text-brand-700"
                  title="localizable — values vary per language"
                >
                  i18n
                </span>
              )}
            </span>
            <span className="truncate text-ink-500">{p.valueType}</span>
          </li>
        ))}
        {props.length > 5 && (
          <li className="pt-0.5 text-[10px] italic text-ink-400">
            +{props.length - 5} more
          </li>
        )}
      </ul>

      {cls.isImplicit && (
        <div className="border-t border-ink-100 bg-ink-50 px-3 py-1 text-[10px] italic text-ink-500">
          Implicit class — auto-provisioned
        </div>
      )}
    </div>
  );
}
