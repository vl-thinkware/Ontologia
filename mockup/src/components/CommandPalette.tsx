import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Search,
  GitCommit,
  Circle,
  Tag as TagIcon,
  Upload,
  LayoutDashboard,
  Settings as SettingsIcon,
  Users,
  KeyRound,
  CreditCard,
  Plus,
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  FileDown,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  ontologies,
  concepts,
  changeEvents,
  members,
} from "../data/mock";

type Item = {
  id: string;
  label: string;
  sublabel?: string;
  group: string;
  icon: React.ElementType;
  tint?: "violet" | "emerald" | "amber" | "sky" | "rose" | "ink";
  action: () => void;
  keywords?: string;
  shortcut?: string[];
};

const tintStyles: Record<NonNullable<Item["tint"]>, string> = {
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-700",
  ink: "bg-ink-100 text-ink-700",
};

export default function CommandPalette() {
  const {
    paletteOpen,
    paletteInitialQuery,
    closePalette,
    openNewConcept,
    toast,
  } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset on open. The initial query is supplied by `openPalette("foo")` —
  // e.g. the topbar search forwards whatever the user started typing so the
  // palette opens already filtering.
  useEffect(() => {
    if (paletteOpen) {
      setQuery(paletteInitialQuery ?? "");
      setActive(0);
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        // Drop the caret at the end so the user can keep typing.
        const len = el.value.length;
        el.setSelectionRange(len, len);
      });
    }
  }, [paletteOpen, paletteInitialQuery]);

  // Build the full item list
  const allItems: Item[] = useMemo(() => {
    const items: Item[] = [];

    // Actions
    items.push({
      id: "action_new_concept",
      label: "Create new concept",
      sublabel: "Open the rich concept editor",
      group: "Actions",
      icon: Plus,
      tint: "violet",
      action: () => {
        closePalette();
        openNewConcept();
      },
      keywords: "create add concept new entity taxonomy",
      shortcut: ["C"],
    });
    items.push({
      id: "action_import",
      label: "Import CSV or Excel",
      sublabel: "Bulk-import data into an ontology",
      group: "Actions",
      icon: Upload,
      tint: "sky",
      action: () => {
        closePalette();
        navigate("/import");
      },
      keywords: "import csv excel upload bulk",
    });
    items.push({
      id: "action_export",
      label: "Export active ontology",
      sublabel: "Download as JSON, CSV or Turtle",
      group: "Actions",
      icon: FileDown,
      tint: "ink",
      action: () => {
        closePalette();
        toast({
          kind: "success",
          title: "Export queued",
          description: "We'll email you a download link in a minute.",
        });
      },
      keywords: "export download json csv turtle",
    });
    items.push({
      id: "action_tag",
      label: "Tag current state as new release",
      sublabel: "Pin a snapshot for downstream services",
      group: "Actions",
      icon: TagIcon,
      tint: "violet",
      action: () => {
        closePalette();
        toast({
          kind: "info",
          title: "Opening tag dialog",
          description: "Navigate to the ontology editor first.",
        });
        navigate(`/ontologies/${ontologies[0].id}`);
      },
      keywords: "tag snapshot release version pin",
    });

    // Pages
    const pages: Array<Omit<Item, "group" | "action"> & { path: string }> = [
      {
        id: "page_dashboard",
        label: "Go to Dashboard",
        sublabel: "Workspace overview",
        icon: LayoutDashboard,
        tint: "ink",
        path: "/dashboard",
      },
      {
        id: "page_settings",
        label: "Workspace settings",
        icon: SettingsIcon,
        tint: "ink",
        path: "/settings",
      },
      {
        id: "page_members",
        label: "Members",
        icon: Users,
        tint: "ink",
        path: "/settings/members",
      },
      {
        id: "page_api_keys",
        label: "API keys",
        icon: KeyRound,
        tint: "ink",
        path: "/settings/api-keys",
      },
      {
        id: "page_billing",
        label: "Billing & usage",
        icon: CreditCard,
        tint: "ink",
        path: "/settings/billing",
      },
    ];
    pages.forEach((p) => {
      items.push({
        ...p,
        group: "Go to",
        action: () => {
          closePalette();
          navigate(p.path);
        },
      });
    });

    // Ontologies
    ontologies.forEach((o) => {
      items.push({
        id: `ont_${o.id}`,
        label: o.name,
        sublabel: `${o.conceptCount} concepts · ${o.relationCount} relations`,
        group: "Ontologies",
        icon: GitCommit,
        tint: "violet",
        action: () => {
          closePalette();
          navigate(`/ontologies/${o.id}`);
        },
        keywords: o.description,
      });
    });

    // Concepts
    concepts.forEach((c) => {
      items.push({
        id: `c_${c.id}`,
        label: c.name,
        sublabel: c.description,
        group: "Concepts",
        icon: Circle,
        tint: c.color,
        action: () => {
          closePalette();
          navigate(`/ontologies/${ontologies[0].id}/concepts/${c.id}`);
        },
        keywords: c.properties.map((p) => p.key).join(" "),
      });
    });

    // Recent change events (top 5)
    changeEvents.slice(0, 5).forEach((e) => {
      items.push({
        id: `ev_${e.id}`,
        label: e.summary,
        sublabel: `${e.author.name} · ${e.entityName}`,
        group: "Recent changes",
        icon: TagIcon,
        tint: "amber",
        action: () => {
          closePalette();
          navigate(`/ontologies/${ontologies[0].id}`);
          toast({
            kind: "info",
            title: "Jumped to ontology",
            description: `Event ${e.id} highlighted in the history panel.`,
          });
        },
        keywords: `${e.kind} ${e.entityName} ${e.message ?? ""}`,
      });
    });

    // Members
    members.slice(0, 4).forEach((m) => {
      items.push({
        id: `m_${m.email}`,
        label: `Invite teammate — ${m.name.split(" ")[0]}`,
        sublabel: m.email,
        group: "People",
        icon: Users,
        tint: "ink",
        action: () => {
          closePalette();
          navigate("/settings/members");
        },
        keywords: `${m.name} ${m.email} member invite`,
      });
    });

    return items;
  }, [closePalette, navigate, openNewConcept, toast]);

  // Filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((it) => {
      const haystack =
        `${it.label} ${it.sublabel ?? ""} ${it.keywords ?? ""} ${it.group}`.toLowerCase();
      return q
        .split(/\s+/)
        .every((tok) => haystack.includes(tok));
    });
  }, [allItems, query]);

  // Group
  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    filtered.forEach((it) => {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Keep active index in range
  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [active, filtered.length]);

  // Keyboard nav
  useEffect(() => {
    if (!paletteOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = filtered[active];
        if (chosen) chosen.action();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, filtered, active, closePalette]);

  // Auto-scroll active into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-idx="${active}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!paletteOpen) return null;

  let flatIdx = -1;

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center pt-[10vh]">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 180ms ease" }}
        onClick={closePalette}
      />
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-pop"
        style={{ animation: "popIn 220ms cubic-bezier(0.25, 1, 0.5, 1)" }}
      >
        {/* Input */}
        <div className="flex items-center gap-2 border-b border-ink-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search concepts, ontologies, actions…"
            className="w-full border-0 bg-transparent py-3.5 text-[14px] placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto scroll-thin py-1"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-ink-500">
              <Sparkles className="mx-auto mb-2 h-4 w-4 text-ink-300" />
              No results for{" "}
              <span className="font-mono font-semibold text-ink-700">
                "{query}"
              </span>
              <div className="mt-1 text-[11px] text-ink-400">
                Try "product", "v1.2", "invite" or press ESC.
              </div>
            </div>
          ) : (
            grouped.map(([groupName, items]) => (
              <div key={groupName} className="py-1">
                <div className="px-4 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-ink-400">
                  {groupName}
                </div>
                {items.map((it) => {
                  flatIdx += 1;
                  const thisIdx = flatIdx;
                  const isActive = thisIdx === active;
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.id}
                      data-idx={thisIdx}
                      onMouseEnter={() => setActive(thisIdx)}
                      onClick={it.action}
                      className={clsx(
                        "flex w-full items-center gap-3 px-4 py-2 text-left",
                        isActive ? "bg-brand-50" : "hover:bg-ink-50"
                      )}
                    >
                      <div
                        className={clsx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          tintStyles[it.tint ?? "ink"]
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={clsx(
                            "truncate text-[13px] font-semibold",
                            isActive ? "text-brand-800" : "text-ink-900"
                          )}
                        >
                          {it.label}
                        </div>
                        {it.sublabel && (
                          <div className="truncate text-[11.5px] text-ink-500">
                            {it.sublabel}
                          </div>
                        )}
                      </div>
                      {it.shortcut && (
                        <div className="flex items-center gap-1">
                          {it.shortcut.map((k) => (
                            <kbd key={k} className="kbd">
                              {k}
                            </kbd>
                          ))}
                        </div>
                      )}
                      {isActive && (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/70 px-4 py-2 text-[11px] text-ink-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="kbd">↑</kbd>
              <kbd className="kbd">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="kbd">ESC</kbd>
              close
            </span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
