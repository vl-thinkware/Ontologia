import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  Network,
  Upload,
  Settings as SettingsIcon,
  ChevronsUpDown,
  ChevronRight,
  Check,
  Search,
  LogOut,
  HelpCircle,
  BookOpen,
  Sparkles,
  Plus,
  Layers,
  ListTree,
  Table as TableIcon,
  GitCommit,
} from "lucide-react";
import {
  currentUser,
  workspaces,
  activeWorkspaceId,
  ontologies,
  type Ontology,
} from "../data/mock";
import CommandPalette from "./CommandPalette";
import NewConceptModal from "./NewConceptModal";
import NewArtefactModal from "./NewArtefactModal";
import DeprecateModal from "./DeprecateModal";
import ExportModal from "./ExportModal";
import RelationPickerModal from "./RelationPickerModal";
import DiffModal from "./DiffModal";
import PlaygroundModal from "./PlaygroundModal";
import NotificationsBell from "./NotificationsBell";
import Toaster from "./Toaster";
import { useApp } from "../app/AppContext";
import { usePresence } from "../app/PresenceProvider";

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const active = workspaces.find((w) => w.id === activeWorkspaceId)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg border border-ink-200 bg-white px-2.5 py-2 text-left shadow-sm hover:bg-ink-50"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
          {active.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink-900">
            {active.name}
          </div>
          <div className="truncate text-[11px] text-ink-500">
            {active.plan === "team"
              ? "Team plan"
              : active.plan === "free"
              ? "Free plan"
              : active.plan === "business"
              ? "Business plan"
              : "Enterprise"}{" "}
            · {active.memberCount} {active.memberCount === 1 ? "member" : "members"}
          </div>
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-pop">
            <div className="border-b border-ink-100 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                Your workspaces
              </div>
            </div>
            <ul className="py-1">
              {workspaces.map((w) => (
                <li key={w.id}>
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-ink-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-semibold text-white">
                      {w.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-ink-900">
                        {w.name}
                      </div>
                      <div className="text-[11px] text-ink-500 capitalize">
                        {w.plan} plan
                      </div>
                    </div>
                    {w.id === activeWorkspaceId && (
                      <Check className="h-4 w-4 text-brand-600" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink-100 p-1">
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
                onClick={() => setOpen(false)}
              >
                <Plus className="h-4 w-4" />
                New workspace
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function OnlineAvatars() {
  const { users } = usePresence();
  return (
    <div
      className="hidden items-center md:flex"
      title="Teammates currently online"
    >
      <div className="flex -space-x-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ring-1 ring-black/5"
            style={{ background: u.color }}
            title={u.name}
          >
            {u.initials}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-ink-100"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ background: currentUser.color }}
        >
          {currentUser.initials}
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-64 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-pop">
            <div className="border-b border-ink-100 px-3 py-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: currentUser.color }}
                >
                  {currentUser.initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink-900">
                    {currentUser.name}
                  </div>
                  <div className="truncate text-xs text-ink-500">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            </div>
            <ul className="py-1 text-sm">
              <li>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-ink-50"
                >
                  <SettingsIcon className="h-4 w-4 text-ink-500" />
                  Account & preferences
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-ink-50"
                >
                  <BookOpen className="h-4 w-4 text-ink-500" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-ink-50"
                >
                  <HelpCircle className="h-4 w-4 text-ink-500" />
                  Help & support
                </a>
              </li>
            </ul>
            <div className="border-t border-ink-100 p-1">
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarLink({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

// -----------------------------------------------------------------------------
// Ontology tree — one row per ontology, expandable into its views.
// -----------------------------------------------------------------------------

// Which view does each mode land on by default? Mirrors MODE_META.defaultView
// in Editor.tsx — duplicated here so Shell stays independent of the Editor.
const MODE_DEFAULT_VIEW: Record<Ontology["mode"], "canvas" | "tree" | "table"> =
  {
    ontology: "canvas",
    taxonomy: "tree",
    glossary: "table",
  };

// Mode decides whether Schema appears as a leaf. Glossary hides it because
// the single implicit class doesn't warrant a schema view.
const MODE_SHOWS_SCHEMA: Record<Ontology["mode"], boolean> = {
  ontology: true,
  taxonomy: true,
  glossary: false,
};

function OntologyLeaf({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx(
          "ml-5 flex items-center gap-2 rounded-md px-2 py-1 text-[12.5px] transition-colors",
          isActive
            ? "bg-brand-50 font-semibold text-brand-700"
            : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
        )
      }
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function OntologyGroup({ ontology }: { ontology: Ontology }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(`/ontologies/${ontology.id}`);

  // Current ontology auto-expands so the active leaf is visible. For the
  // others, the user can click the chevron to peek without leaving where
  // they are — their expanded state is preserved while they keep the tab
  // open (but resets on full reload, which is fine for a mockup).
  const [open, setOpen] = useState(isActive);
  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  const defaultSegment = MODE_DEFAULT_VIEW[ontology.mode];
  const showSchema = MODE_SHOWS_SCHEMA[ontology.mode];

  return (
    <div className="mb-0.5">
      <div
        className={clsx(
          "group flex items-center rounded-lg transition-colors",
          isActive ? "bg-brand-50" : "hover:bg-ink-100"
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse ontology" : "Expand ontology"}
          className="flex h-7 w-6 shrink-0 items-center justify-center rounded-l-lg text-ink-400 hover:text-ink-700"
        >
          <ChevronRight
            className={clsx(
              "h-3.5 w-3.5 transition-transform",
              open && "rotate-90"
            )}
          />
        </button>
        <Link
          to={`/ontologies/${ontology.id}/${defaultSegment}`}
          className={clsx(
            "flex min-w-0 flex-1 items-center gap-1.5 py-1.5 pr-2 text-sm",
            isActive
              ? "font-semibold text-brand-700"
              : "text-ink-700 group-hover:text-ink-900"
          )}
        >
          <span
            className={clsx(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              isActive ? "bg-brand-500" : "bg-ink-300"
            )}
          />
          <span className="truncate">{ontology.name}</span>
          <span className="ml-auto shrink-0 text-[11px] text-ink-400">
            {ontology.conceptCount}
          </span>
        </Link>
      </div>

      {open && (
        <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
          <OntologyLeaf
            to={`/ontologies/${ontology.id}/canvas`}
            icon={Layers}
            label="Canvas"
          />
          <OntologyLeaf
            to={`/ontologies/${ontology.id}/tree`}
            icon={ListTree}
            label="Taxonomies"
          />
          <OntologyLeaf
            to={`/ontologies/${ontology.id}/table`}
            icon={TableIcon}
            label="Tables"
          />
          {showSchema && (
            <OntologyLeaf
              to={`/ontologies/${ontology.id}/schema`}
              icon={GitCommit}
              label="Schema"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function Shell() {
  const location = useLocation();
  const { openPalette, openNewArtefact } = useApp();
  const topbarOntology = location.pathname.startsWith("/ontologies/")
    ? ontologies.find((o) => location.pathname.includes(`/ontologies/${o.id}`))
    : undefined;

  // Last path segment, used to label which view is active in the top-bar
  // breadcrumb. Falls back to "" (blank) for the bare ontology URL.
  const lastSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const viewLabel: Record<string, string> = {
    canvas: "Canvas",
    tree: "Taxonomies",
    table: "Tables",
    schema: "Schema",
  };
  const topbarView = viewLabel[lastSegment];

  return (
    <div className="flex h-full min-h-0 bg-ink-50">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
        <div className="flex items-center gap-2 px-4 pb-3 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold tracking-tight text-ink-900">
              Ontologia
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-ink-400">
              Preview build
            </div>
          </div>
        </div>

        <div className="px-3 pb-3">
          <WorkspaceSwitcher />
        </div>

        <nav className="flex flex-col gap-1 px-3">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <div className="mt-4 px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Ontologies
          </div>
          {ontologies.map((o) => (
            <OntologyGroup key={o.id} ontology={o} />
          ))}
          <button
            onClick={openNewArtefact}
            className="mt-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-ink-500 hover:bg-ink-100 hover:text-ink-900"
          >
            <Plus className="h-3.5 w-3.5" />
            New ontology
          </button>

          <div className="mt-4 px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Workspace
          </div>
          <SidebarLink to="/import" icon={Upload} label="Import data" />
          <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
        </nav>

        <div className="mt-auto px-3 pb-3 pt-4">
          <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Team plan
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-snug text-ink-600">
              397 / 5,000 concepts used. Unlimited seats, 500k API calls / month.
            </p>
            <Link
              to="/settings/billing"
              className="mt-2 block text-[12px] font-semibold text-brand-700 hover:text-brand-800"
            >
              View usage →
            </Link>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-ink-200 bg-white/80 px-5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm">
            {topbarOntology ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-ink-500 hover:text-ink-800"
                >
                  Ontologies
                </Link>
                <span className="text-ink-300">/</span>
                <Link
                  to={`/ontologies/${topbarOntology.id}/${
                    MODE_DEFAULT_VIEW[topbarOntology.mode]
                  }`}
                  className={clsx(
                    topbarView
                      ? "text-ink-500 hover:text-ink-800"
                      : "font-semibold text-ink-900"
                  )}
                >
                  {topbarOntology.name}
                </Link>
                {topbarView && (
                  <>
                    <span className="text-ink-300">/</span>
                    <span className="font-semibold text-ink-900">
                      {topbarView}
                    </span>
                  </>
                )}
                <span className="chip bg-ink-100 text-ink-600">
                  {topbarOntology.tags[0] ?? "draft"}
                </span>
              </>
            ) : location.pathname.startsWith("/settings") ? (
              <>
                <span className="font-semibold text-ink-900">Settings</span>
              </>
            ) : location.pathname.startsWith("/import") ? (
              <span className="font-semibold text-ink-900">Import wizard</span>
            ) : (
              <span className="font-semibold text-ink-900">Dashboard</span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <OnlineAvatars />
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                onFocus={() => openPalette()}
                onChange={(e) => {
                  // Anything the user types flows straight into the palette
                  // with that query pre-filled — prevents the weird two-step
                  // of click → modal opens empty → retype.
                  if (e.target.value) openPalette(e.target.value);
                }}
                value=""
                placeholder="Search concepts, relations…"
                className="w-72 rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-8 pr-16 text-sm placeholder:text-ink-400 transition-colors hover:border-ink-300 hover:bg-white focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
              <kbd className="kbd pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                ⌘K
              </kbd>
            </div>
            <NotificationsBell />
            <div className="mx-1 h-5 w-px bg-ink-200" />
            <UserMenu />
          </div>
        </header>

        {/* Outlet */}
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <NewConceptModal />
      <NewArtefactModal />
      <DeprecateModal />
      <ExportModal />
      <RelationPickerModal />
      <DiffModal />
      <PlaygroundModal />
      <Toaster />
    </div>
  );
}
