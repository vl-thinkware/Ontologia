import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MousePointer2, Eye, Pencil } from "lucide-react";
import { usePresence } from "../app/PresenceProvider";

// Absolute-positioned overlay that renders each teammate's cursor inside the
// bounds of the container that hosts it. The parent must be `relative`.
export default function PresenceCursors() {
  const { users } = usePresence();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Track the container's size so we can translate normalised 0..1 cursors
  // into actual pixels even when ReactFlow or the tree rail resizes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const e = entries[0];
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    observer.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden
    >
      {users.map((u) => {
        const x = size.w * u.cursorNx;
        const y = size.h * u.cursorNy;
        return (
          <div
            key={u.id}
            className="absolute transition-[transform] duration-1000 ease-out"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <MousePointer2
              className="h-4 w-4 drop-shadow-sm"
              style={{ color: u.color, fill: u.color }}
            />
            <div
              className="mt-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: u.color }}
            >
              {u.initials}
              <span className="hidden sm:inline">· {u.name.split(" ")[0]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// A little "X is editing this right now" strip. Render it at the top of a
// concept editor — it slides in when a teammate's focus matches the
// concept id and fades back out when they move elsewhere.
export function PresenceEditingBanner({ conceptId }: { conceptId: string }) {
  const { focusedOn } = usePresence();
  const viewers = focusedOn(conceptId);
  if (viewers.length === 0) return null;
  const primary = viewers[0];
  const extra = viewers.length - 1;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-[12px] text-violet-900">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
        style={{ background: primary.color }}
      >
        {primary.initials}
      </div>
      <span className="font-semibold">{primary.name}</span>
      {extra > 0 && (
        <span className="text-violet-700">
          &amp; {extra} other{extra === 1 ? "" : "s"}
        </span>
      )}
      <span className="text-violet-700">
        {viewers.length > 1 ? "are" : "is"} looking at this right now.
      </span>
      <Pencil className="ml-auto h-3 w-3 text-violet-500" />
    </div>
  );
}

// Tiny avatar chip to stack on tree rows / list items that a teammate is
// focused on. Use inline in row markup.
export function PresenceAvatars({
  conceptId,
  size: avatarSize = 5,
}: {
  conceptId: string;
  size?: number; // Tailwind size step (5 → h-5 w-5 via className below)
}) {
  const { focusedOn } = usePresence();
  const viewers = focusedOn(conceptId);
  if (viewers.length === 0) return null;
  return (
    <div className="flex shrink-0 -space-x-1">
      {viewers.slice(0, 3).map((u) => (
        <div
          key={u.id}
          title={`${u.name} is viewing`}
          className={clsx(
            "inline-flex items-center justify-center rounded-full text-[9px] font-semibold text-white ring-2 ring-white",
            avatarSize === 5 ? "h-5 w-5" : "h-4 w-4"
          )}
          style={{ background: u.color }}
        >
          {u.initials}
        </div>
      ))}
      {viewers.length > 3 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-200 px-1 text-[9px] font-semibold text-ink-700 ring-2 ring-white">
          +{viewers.length - 3}
        </span>
      )}
      {viewers.length === 1 && (
        <Eye className="ml-1 h-3 w-3 text-ink-400" aria-hidden />
      )}
    </div>
  );
}
