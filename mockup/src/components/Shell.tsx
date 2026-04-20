import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  Network,
  Upload,
  Settings as SettingsIcon,
  ChevronsUpDown,
  Check,
  Search,
  Bell,
  LogOut,
  HelpCircle,
  BookOpen,
  Sparkles,
  Plus,
} from "lucide-react";
import { currentUser, workspaces, activeWorkspaceId, ontologies } from "../data/mock";
import CommandPalette from "./CommandPalette";
import NewConceptModal from "./NewConceptModal";
import Toaster from "./Toaster";
import { useApp } from "../app/AppContext";

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

export default function Shell() {
  const location = useLocation();
  const { openPalette } = useApp();
  const topbarOntology = location.pathname.startsWith("/ontologies/")
    ? ontologies.find((o) => location.pathname.includes(`/ontologies/${o.id}`))
    : undefined;

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
            <NavLink
              key={o.id}
              to={`/ontologies/${o.id}`}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )
              }
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300 group-hover:bg-brand-500" />
              <span className="truncate">{o.name}</span>
              <span className="ml-auto shrink-0 text-[11px] text-ink-400">
                {o.conceptCount}
              </span>
            </NavLink>
          ))}
          <button className="mt-1 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-ink-500 hover:bg-ink-100 hover:text-ink-900">
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
                <span className="font-semibold text-ink-900">
                  {topbarOntology.name}
                </span>
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
            <button
              type="button"
              onClick={openPalette}
              className="relative hidden md:flex w-72 items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-8 pr-16 text-left text-sm text-ink-400 transition-colors hover:border-ink-300 hover:bg-white focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            >
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              Search concepts, relations…
              <kbd className="kbd absolute right-2 top-1/2 -translate-y-1/2">
                ⌘K
              </kbd>
            </button>
            <button className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
            </button>
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
      <Toaster />
    </div>
  );
}
