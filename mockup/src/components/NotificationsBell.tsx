import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Bell, Check, CheckCircle2, History, AlertTriangle, MessageSquare } from "lucide-react";
import { useApp } from "../app/AppContext";
import { currentUser, ontologies } from "../data/mock";

// A tiny read/unread tracker — keys off ChangeEvent ids. The set is module-
// scoped so "dismiss" survives closing + reopening the popover within the
// same session. (Full persistence would need the real API.)
const readEventIds = new Set<string>();

type NotificationItem = {
  id: string;
  kind: "change" | "review" | "comment";
  title: string;
  subtitle?: string;
  time: string;
  icon: React.ElementType;
  href?: string;
  meta?: { background: string; initials: string };
};

// A few static non-change notifications to round out the feed. In a real
// build these would come from the server.
const STATIC_ITEMS: NotificationItem[] = [
  {
    id: "nt_review_1",
    kind: "review",
    title: "Review requested on v1.3",
    subtitle: "Alexandre tagged 24 changes — waiting on your sign-off.",
    time: "5m ago",
    icon: CheckCircle2,
    href: "/ontologies/ont_cars/canvas",
    meta: { background: "#10b981", initials: "AD" },
  },
  {
    id: "nt_comment_1",
    kind: "comment",
    title: "Marie commented on Toyota Camry",
    subtitle:
      "“Should we keep hasDrive → AWD here? The AWD trim is US-only in 2026.”",
    time: "1h ago",
    icon: MessageSquare,
    href: "/ontologies/ont_cars/concepts/c_model_camry",
    meta: { background: "#f59e0b", initials: "MD" },
  },
  {
    id: "nt_review_2",
    kind: "review",
    title: "CSV import dry-run ready",
    subtitle: "32 new 2026 model-year rows staged from catalogue.csv — needs approval.",
    time: "2h ago",
    icon: AlertTriangle,
    href: "/import",
  },
];

export default function NotificationsBell() {
  const { events, tick } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // A dummy state to re-render when we dismiss (since readEventIds is a Set).
  const [, forceRerender] = useState(0);
  void tick;

  // Take the most recent 10 events authored by someone else. Filtering out
  // our own entries keeps the feed useful — you don't need to be notified
  // about something you literally just did.
  const items: NotificationItem[] = useMemo(() => {
    const fromEvents: NotificationItem[] = events
      .filter((e) => e.author.initials !== currentUser.initials)
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        kind: "change",
        title: `${e.author.name.split(" ")[0]} · ${e.summary}`,
        subtitle: e.message,
        time: timeAgo(e.at),
        icon: History,
        href: findHrefForEvent(e.entityKind, e.entityId),
        meta: { background: e.author.color, initials: e.author.initials },
      }));
    return [...STATIC_ITEMS, ...fromEvents];
  }, [events]);

  const unreadCount = items.filter((i) => !readEventIds.has(i.id)).length;

  function markRead(id: string) {
    readEventIds.add(id);
    forceRerender((x) => x + 1);
  }

  function markAllRead() {
    items.forEach((i) => readEventIds.add(i.id));
    forceRerender((x) => x + 1);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute right-1 top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full bg-brand-600 px-[3px] text-[9px] font-bold leading-none text-white ring-2 ring-white"
            aria-label={`${unreadCount} unread`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-[calc(100%+6px)] z-20 w-[380px] overflow-hidden rounded-xl border border-ink-200 bg-white shadow-pop">
            <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-3 py-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Notifications
                </div>
                <div className="text-[12.5px] font-semibold text-ink-900">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "You're all caught up"}
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11.5px] font-semibold text-brand-700 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <ul className="max-h-[440px] overflow-y-auto divide-y divide-ink-100">
              {items.length === 0 && (
                <li className="px-4 py-8 text-center text-[12px] text-ink-500">
                  Nothing new.
                </li>
              )}
              {items.map((n) => {
                const unread = !readEventIds.has(n.id);
                const Icon = n.icon;
                return (
                  <li
                    key={n.id}
                    className={clsx(
                      "flex cursor-pointer items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-ink-50",
                      unread && "bg-brand-50/40"
                    )}
                    onClick={() => {
                      markRead(n.id);
                      if (n.href) {
                        setOpen(false);
                        navigate(n.href);
                      }
                    }}
                  >
                    {n.meta ? (
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ background: n.meta.background }}
                      >
                        {n.meta.initials}
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={clsx(
                            "truncate text-[12.5px]",
                            unread
                              ? "font-semibold text-ink-900"
                              : "text-ink-700"
                          )}
                        >
                          {n.title}
                        </span>
                        {unread && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        )}
                      </div>
                      {n.subtitle && (
                        <p className="mt-0.5 line-clamp-2 text-[11.5px] text-ink-500">
                          {n.subtitle}
                        </p>
                      )}
                      <div className="mt-1 text-[10.5px] text-ink-400">
                        {n.time}
                      </div>
                    </div>
                    {unread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(n.id);
                        }}
                        className="mt-0.5 rounded p-1 text-ink-300 hover:bg-ink-200 hover:text-ink-700"
                        title="Mark read"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-ink-100 bg-ink-50/40 px-3 py-2 text-center text-[11px] text-ink-500">
              Notifications pull from the live change log across{" "}
              {ontologies.length} ontolog
              {ontologies.length === 1 ? "y" : "ies"}.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function findHrefForEvent(
  entityKind: string,
  entityId: string
): string | undefined {
  // Point concept events at the detail page under the first ontology we
  // guess the concept lives in — the mock only has a couple so it's usually
  // right. For anything else fall through to the dashboard.
  if (entityKind === "concept") {
    return `/ontologies/ont_cars/concepts/${entityId}`;
  }
  return undefined;
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
