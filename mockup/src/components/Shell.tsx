import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Kbd,
  Separator,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
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

// -----------------------------------------------------------------------------
// Workspace switcher — sidebar dropdown with the active org + a list to swap.
// -----------------------------------------------------------------------------

function WorkspaceSwitcher() {
  const active = workspaces.find((w) => w.id === activeWorkspaceId)!;
  const planLabel =
    active.plan === "team"
      ? "Team plan"
      : active.plan === "free"
      ? "Free plan"
      : active.plan === "business"
      ? "Business plan"
      : "Enterprise";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-[var(--radius-3)] border border-[var(--gray-a5)] bg-[var(--color-panel-solid)] px-2.5 py-2 text-left transition-colors hover:bg-[var(--gray-a3)]"
        >
          <Avatar
            size="1"
            radius="medium"
            color="violet"
            variant="solid"
            fallback={active.name.slice(0, 1)}
          />
          <Box className="min-w-0 flex-1">
            <Text
              size="2"
              weight="bold"
              className="block truncate"
            >
              {active.name}
            </Text>
            <Text size="1" color="gray" className="block truncate">
              {planLabel} · {active.memberCount}{" "}
              {active.memberCount === 1 ? "member" : "members"}
            </Text>
          </Box>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--gray-9)]" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="2" align="start" sideOffset={6} style={{ minWidth: 240 }}>
        <DropdownMenu.Label>Your workspaces</DropdownMenu.Label>
        {workspaces.map((w) => (
          <DropdownMenu.Item key={w.id}>
            <Flex gap="2" align="center" width="100%">
              <Avatar
                size="1"
                radius="medium"
                color="violet"
                variant="solid"
                fallback={w.name.slice(0, 1)}
              />
              <Box className="min-w-0 flex-1">
                <Text size="2" weight="medium" className="block truncate">
                  {w.name}
                </Text>
                <Text
                  size="1"
                  color="gray"
                  className="block truncate capitalize"
                >
                  {w.plan} plan
                </Text>
              </Box>
              {w.id === activeWorkspaceId && (
                <Check className="h-4 w-4 text-[var(--accent-11)]" />
              )}
            </Flex>
          </DropdownMenu.Item>
        ))}
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Plus className="h-4 w-4" />
          New workspace
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

// -----------------------------------------------------------------------------
// Online presence avatars (top-right of topbar). Uses our presence provider.
// -----------------------------------------------------------------------------

function OnlineAvatars() {
  const { users } = usePresence();
  if (users.length === 0) return null;
  return (
    <Flex align="center" gap="0" className="hidden md:flex">
      <Flex className="-space-x-2">
        {users.map((u) => (
          <Tooltip key={u.id} content={u.name}>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-panel-solid)] text-[10px] font-semibold text-white ring-1 ring-black/5"
              style={{ background: u.color }}
            >
              {u.initials}
            </div>
          </Tooltip>
        ))}
      </Flex>
    </Flex>
  );
}

// -----------------------------------------------------------------------------
// User menu — avatar dropdown.
// -----------------------------------------------------------------------------

function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          className="flex items-center rounded-full p-0.5 transition-colors hover:bg-[var(--gray-a3)]"
          aria-label="Open user menu"
        >
          <Avatar
            size="2"
            radius="full"
            fallback={currentUser.initials}
            style={{ background: currentUser.color, color: "white" }}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="2" align="end" sideOffset={6} style={{ minWidth: 240 }}>
        <Box px="3" py="2">
          <Flex gap="2" align="center">
            <Avatar
              size="3"
              radius="full"
              fallback={currentUser.initials}
              style={{ background: currentUser.color, color: "white" }}
            />
            <Box className="min-w-0">
              <Text size="2" weight="bold" className="block truncate">
                {currentUser.name}
              </Text>
              <Text size="1" color="gray" className="block truncate">
                {currentUser.email}
              </Text>
            </Box>
          </Flex>
        </Box>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link to="/settings">
            <SettingsIcon className="h-4 w-4" />
            Account & preferences
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <BookOpen className="h-4 w-4" />
          Documentation
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <HelpCircle className="h-4 w-4" />
          Help & support
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild color="red">
          <Link to="/signin">
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

// -----------------------------------------------------------------------------
// Sidebar primary nav — Dashboard, Import, Settings.
// -----------------------------------------------------------------------------

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
          "flex items-center gap-2.5 rounded-[var(--radius-3)] px-2.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[var(--accent-3)] text-[var(--accent-11)]"
            : "text-[var(--gray-11)] hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]"
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

const MODE_DEFAULT_VIEW: Record<Ontology["mode"], "canvas" | "tree" | "table"> =
  {
    ontology: "canvas",
    taxonomy: "tree",
    glossary: "table",
  };

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
            ? "bg-[var(--accent-3)] font-semibold text-[var(--accent-11)]"
            : "text-[var(--gray-11)] hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]"
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

  // Current ontology auto-expands so the active leaf is visible.
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
          "group flex items-center rounded-[var(--radius-3)] transition-colors",
          isActive ? "bg-[var(--accent-3)]" : "hover:bg-[var(--gray-a3)]"
        )}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse ontology" : "Expand ontology"}
          className="flex h-7 w-6 shrink-0 items-center justify-center rounded-l-[var(--radius-3)] text-[var(--gray-9)] hover:text-[var(--gray-12)]"
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
              ? "font-semibold text-[var(--accent-11)]"
              : "text-[var(--gray-11)] group-hover:text-[var(--gray-12)]"
          )}
        >
          <span
            className={clsx(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              isActive ? "bg-[var(--accent-9)]" : "bg-[var(--gray-7)]"
            )}
          />
          <span className="truncate">{ontology.name}</span>
          <span className="ml-auto shrink-0 text-[11px] text-[var(--gray-9)]">
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

// -----------------------------------------------------------------------------
// Plan-status card at the bottom of the sidebar.
// -----------------------------------------------------------------------------

function PlanStatusCard() {
  return (
    <Card variant="surface" size="1">
      <Flex align="center" gap="2">
        <Flex
          align="center"
          justify="center"
          className="h-7 w-7 rounded-md"
          style={{
            background: "var(--accent-9)",
            color: "var(--accent-contrast)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </Flex>
        <Text
          size="1"
          weight="bold"
          color="violet"
          className="uppercase tracking-wider"
        >
          Team plan
        </Text>
      </Flex>
      <Text size="1" color="gray" mt="2" as="p">
        397 / 5,000 concepts used. Unlimited seats, 500k API calls / month.
      </Text>
      <Box mt="2">
        <Link
          to="/settings/billing"
          className="text-[12px] font-semibold text-[var(--accent-11)] hover:text-[var(--accent-12)]"
        >
          View usage →
        </Link>
      </Box>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Topbar breadcrumb + search.
// -----------------------------------------------------------------------------

function TopbarBreadcrumb() {
  const location = useLocation();
  const topbarOntology = location.pathname.startsWith("/ontologies/")
    ? ontologies.find((o) => location.pathname.includes(`/ontologies/${o.id}`))
    : undefined;

  const lastSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const viewLabel: Record<string, string> = {
    canvas: "Canvas",
    tree: "Taxonomies",
    table: "Tables",
    schema: "Schema",
  };
  const topbarView = viewLabel[lastSegment];

  if (topbarOntology) {
    return (
      <Flex align="center" gap="2">
        <Link
          to="/dashboard"
          className="text-sm text-[var(--gray-11)] hover:text-[var(--gray-12)]"
        >
          Ontologies
        </Link>
        <Text size="2" color="gray">
          /
        </Text>
        <Link
          to={`/ontologies/${topbarOntology.id}/${
            MODE_DEFAULT_VIEW[topbarOntology.mode]
          }`}
          className={clsx(
            "text-sm",
            topbarView
              ? "text-[var(--gray-11)] hover:text-[var(--gray-12)]"
              : "font-semibold text-[var(--gray-12)]"
          )}
        >
          {topbarOntology.name}
        </Link>
        {topbarView && (
          <>
            <Text size="2" color="gray">
              /
            </Text>
            <Text size="2" weight="bold">
              {topbarView}
            </Text>
          </>
        )}
        <Badge color="gray" variant="soft" radius="medium">
          {topbarOntology.tags[0] ?? "draft"}
        </Badge>
      </Flex>
    );
  }
  if (location.pathname.startsWith("/settings")) {
    return (
      <Heading size="3" weight="bold">
        Settings
      </Heading>
    );
  }
  if (location.pathname.startsWith("/import")) {
    return (
      <Heading size="3" weight="bold">
        Import wizard
      </Heading>
    );
  }
  return (
    <Heading size="3" weight="bold">
      Dashboard
    </Heading>
  );
}

function TopbarSearch() {
  const { openPalette } = useApp();
  return (
    <Box className="hidden md:block">
      <TextField.Root
        placeholder="Search concepts, relations…"
        size="2"
        readOnly
        value=""
        onFocus={() => openPalette()}
        onClick={() => openPalette()}
        className="w-72 cursor-pointer"
      >
        <TextField.Slot>
          <Search className="h-4 w-4" />
        </TextField.Slot>
        <TextField.Slot side="right">
          <Kbd>⌘K</Kbd>
        </TextField.Slot>
      </TextField.Root>
    </Box>
  );
}

// -----------------------------------------------------------------------------
// Shell — root layout: sidebar + topbar + outlet + global overlays.
// -----------------------------------------------------------------------------

export default function Shell() {
  const { openNewArtefact } = useApp();

  return (
    <Flex
      className="h-full min-h-0"
      style={{ background: "var(--gray-2)" }}
    >
      {/* Sidebar */}
      <Box
        asChild
        width="256px"
        className="shrink-0"
      >
        <aside
          className="flex flex-col border-r"
          style={{
            background: "var(--color-panel-solid)",
            borderColor: "var(--gray-a4)",
          }}
        >
          <Flex align="center" gap="2" px="4" pt="4" pb="3">
            <Flex
              align="center"
              justify="center"
              className="h-8 w-8 rounded-[var(--radius-3)] text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-9), var(--accent-11))",
              }}
            >
              <Network className="h-4 w-4" />
            </Flex>
            <Box className="flex-1">
              <Text size="2" weight="bold" className="block tracking-tight">
                Ontologia
              </Text>
              <Text
                size="1"
                color="gray"
                className="block uppercase tracking-wider"
                style={{ fontSize: 10 }}
              >
                Preview build
              </Text>
            </Box>
          </Flex>

          <Box px="3" pb="3">
            <WorkspaceSwitcher />
          </Box>

          <nav className="flex flex-col gap-1 px-3">
            <SidebarLink
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <Box mt="3" px="2" pb="1">
              <Text
                size="1"
                color="gray"
                weight="bold"
                className="block uppercase tracking-wider"
              >
                Ontologies
              </Text>
            </Box>
            {ontologies.map((o) => (
              <OntologyGroup key={o.id} ontology={o} />
            ))}
            <button
              onClick={openNewArtefact}
              className="mt-1 flex items-center gap-2 rounded-[var(--radius-3)] px-2.5 py-1.5 text-sm text-[var(--gray-10)] transition-colors hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New ontology
            </button>

            <Box mt="3" px="2" pb="1">
              <Text
                size="1"
                color="gray"
                weight="bold"
                className="block uppercase tracking-wider"
              >
                Workspace
              </Text>
            </Box>
            <SidebarLink to="/import" icon={Upload} label="Import data" />
            <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" />
          </nav>

          <Box mt="auto" px="3" pb="3" pt="4">
            <PlanStatusCard />
          </Box>
        </aside>
      </Box>

      {/* Main column */}
      <Flex direction="column" className="min-w-0 flex-1">
        {/* Top bar */}
        <Flex
          asChild
          align="center"
          gap="3"
          px="5"
          className="h-14 shrink-0 border-b"
        >
          <header
            style={{
              background: "var(--color-panel-translucent)",
              backdropFilter: "blur(8px)",
              borderColor: "var(--gray-a4)",
            }}
          >
            <TopbarBreadcrumb />
            <Flex align="center" gap="2" ml="auto">
              <OnlineAvatars />
              <TopbarSearch />
              <NotificationsBell />
              <Separator orientation="vertical" size="1" />
              <UserMenu />
            </Flex>
          </header>
        </Flex>

        {/* Outlet */}
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </Flex>

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
    </Flex>
  );
}

// Suppress unused import warnings for components not yet referenced in this file.
void IconButton;
void Button;
