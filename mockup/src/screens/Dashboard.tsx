import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Progress,
  Text,
} from "@radix-ui/themes";
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
  {
    label: string;
    icon: typeof BookOpen;
    badgeColor: "violet" | "green" | "sky";
    washBg: string;
    washFg: string;
  }
> = {
  glossary: {
    label: "Glossary",
    icon: BookOpen,
    badgeColor: "violet",
    washBg: "var(--violet-3)",
    washFg: "var(--violet-11)",
  },
  taxonomy: {
    label: "Taxonomy",
    icon: ListTree,
    badgeColor: "green",
    washBg: "var(--green-3)",
    washFg: "var(--green-11)",
  },
  ontology: {
    label: "Ontology",
    icon: Layers,
    badgeColor: "sky",
    washBg: "var(--sky-3)",
    washFg: "var(--sky-11)",
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
    <Box>
      <Flex align="baseline" justify="between">
        <Text size="1" weight="medium" color="gray">
          {label}
        </Text>
        <Text size="1" color="gray">
          {formatNumber(used)} / {formatNumber(limit)}
        </Text>
      </Flex>
      <Box mt="2">
        <Progress value={pct} color="violet" size="1" />
      </Box>
    </Box>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendColor,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  trendColor?: "green" | "gray";
}) {
  const TrendComp = trend ? TrendingUp : null;
  return (
    <Card size="2">
      <Flex align="center" justify="between">
        <Text
          size="1"
          weight="bold"
          color="gray"
          className="uppercase tracking-wider"
        >
          {label}
        </Text>
        <Icon className="h-4 w-4" style={{ color: "var(--gray-9)" }} />
      </Flex>
      <Flex align="baseline" gap="2" mt="2">
        <Heading size="6" weight="bold">
          {value}
        </Heading>
        {trend && (
          <Flex align="center" gap="1">
            {TrendComp && (
              <TrendComp
                className="h-3 w-3"
                style={{
                  color:
                    trendColor === "green"
                      ? "var(--green-11)"
                      : "var(--gray-11)",
                }}
              />
            )}
            <Text
              size="1"
              weight="bold"
              color={trendColor === "green" ? "green" : "gray"}
            >
              {trend}
            </Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

type ActivityFilter =
  | "all"
  | "create"
  | "update"
  | "delete"
  | "tag"
  | "bulk_import";

export default function Dashboard() {
  const { openNewArtefact, tick } = useApp();
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityFilter, tick]);

  const weeklyContributors = useMemo(() => {
    const names = new Set<string>();
    changeEvents
      .slice(0, 50)
      .forEach((e) => names.add(e.author.name));
    return names.size;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  function hrefForEvent(e: (typeof changeEvents)[number]): string {
    if (e.entityKind === "concept") {
      const ont =
        ontologies.find((o) => o.id === "ont_cars") ?? ontologies[0];
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

  function kindBadgeColor(
    k: string
  ): "green" | "sky" | "ruby" | "amber" | "violet" | "gray" {
    if (k === "create" || k === "bulk_import") return "green";
    if (k === "update") return "sky";
    if (k === "delete") return "ruby";
    if (k === "revert") return "amber";
    if (k === "tag") return "violet";
    return "gray";
  }

  return (
    <Box className="mx-auto max-w-7xl" px="8" py="8">
      {/* Header */}
      <Flex align="center" justify="between" gap="4">
        <Box>
          <Heading size="7" weight="bold">
            Welcome back, Valentin
          </Heading>
          <Text as="p" size="2" color="gray" mt="1">
            Here's what's happening in the{" "}
            <strong style={{ color: "var(--gray-12)" }}>Thinkware</strong>{" "}
            workspace.
          </Text>
        </Box>
        <Flex align="center" gap="2">
          <Button asChild variant="surface" color="gray">
            <Link to="/import">
              <Upload className="h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button onClick={openNewArtefact}>
            <Plus className="h-4 w-4" />
            New artefact
          </Button>
        </Flex>
      </Flex>

      {/* Stat cards */}
      <Box mt="6" className="grid grid-cols-4 gap-4">
        <StatCard
          label="Concepts"
          value="397"
          icon={GitCommit}
          trend="+42 this week"
          trendColor="green"
        />
        <StatCard
          label="Change events (7d)"
          value="128"
          icon={Zap}
          trend="across 3 ontologies"
        />
        <StatCard
          label="API calls (30d)"
          value="142k"
          icon={ArrowUpRight}
          trend="of 500k limit"
        />
        <StatCard
          label="Members"
          value={String(members.length)}
          icon={Users}
          trend="· 1 pending invite"
        />
      </Box>

      {/* Main 2-col */}
      <Box mt="6" className="grid grid-cols-3 gap-5">
        <Box className="col-span-2 space-y-5">
          {/* Ontologies */}
          <Card size="3" style={{ padding: 0 }}>
            <Flex
              align="center"
              justify="between"
              px="5"
              py="3"
              style={{ borderBottom: "1px solid var(--gray-a4)" }}
            >
              <Box>
                <Heading size="2" weight="bold">
                  Your ontologies
                </Heading>
                <Text size="1" color="gray">
                  {ontologies.length} active in Thinkware
                </Text>
              </Box>
              <Button variant="ghost" color="gray" size="1">
                View all
              </Button>
            </Flex>
            <Flex direction="column" asChild>
              <ul>
                {ontologies.map((o, i) => {
                  const modeMeta = MODE_META[o.mode];
                  const ModeIcon = modeMeta.icon;
                  return (
                    <Flex
                      asChild
                      align="center"
                      gap="4"
                      px="5"
                      py="4"
                      key={o.id}
                      className="group hover:bg-[var(--gray-a3)]"
                      style={{
                        borderBottom:
                          i !== ontologies.length - 1
                            ? "1px solid var(--gray-a3)"
                            : "none",
                      }}
                    >
                      <li>
                        <Flex
                          align="center"
                          justify="center"
                          className="h-10 w-10 shrink-0 rounded-[var(--radius-3)]"
                          style={{
                            background: modeMeta.washBg,
                            color: modeMeta.washFg,
                          }}
                        >
                          <ModeIcon className="h-5 w-5" />
                        </Flex>
                        <Box className="min-w-0 flex-1">
                          <Flex align="center" gap="2">
                            <Link
                              to={`/ontologies/${o.id}`}
                              className="truncate text-sm font-bold"
                              style={{ color: "var(--gray-12)" }}
                            >
                              {o.name}
                            </Link>
                            <Badge
                              color={modeMeta.badgeColor}
                              variant="soft"
                              size="1"
                            >
                              {modeMeta.label}
                            </Badge>
                            {o.tags.map((t) => (
                              <Badge
                                key={t}
                                color="violet"
                                variant="soft"
                                size="1"
                              >
                                <TagIcon className="h-3 w-3" />
                                {t}
                              </Badge>
                            ))}
                          </Flex>
                          <Text
                            as="p"
                            size="1"
                            color="gray"
                            mt="1"
                            className="truncate"
                          >
                            {o.description}
                          </Text>
                          <Flex align="center" gap="2" mt="1">
                            <Text size="1" color="gray">
                              <Layers
                                className="h-3 w-3 inline mr-1"
                                style={{ color: "var(--gray-9)" }}
                              />
                              {o.classCount} class
                              {o.classCount === 1 ? "" : "es"}
                            </Text>
                            <Text size="1" color="gray">
                              ·
                            </Text>
                            <Text size="1" color="gray">
                              {o.relationTypeCount} relation type
                              {o.relationTypeCount === 1 ? "" : "s"}
                            </Text>
                            <Text size="1" color="gray">
                              ·
                            </Text>
                            <Text size="1" color="gray">
                              {o.schemeCount} scheme
                              {o.schemeCount === 1 ? "" : "s"}
                            </Text>
                          </Flex>
                        </Box>
                        <Box className="hidden text-right md:block">
                          <Text size="1" weight="bold">
                            {formatNumber(o.conceptCount)} concepts
                          </Text>
                          <Text as="div" size="1" color="gray">
                            {formatNumber(o.relationCount)} relations
                          </Text>
                        </Box>
                        <Box width="112px" className="hidden text-right lg:block">
                          <Text size="1" color="gray">
                            {timeAgo(o.lastChange)}
                          </Text>
                          <Text as="div" size="1" color="gray" className="truncate">
                            {o.lastAuthor.split(" ")[0]}
                          </Text>
                        </Box>
                        <IconButton
                          variant="ghost"
                          color="gray"
                          size="1"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </IconButton>
                      </li>
                    </Flex>
                  );
                })}
              </ul>
            </Flex>
          </Card>

          {/* Activity feed */}
          <Card size="3" style={{ padding: 0 }}>
            <Flex
              wrap="wrap"
              align="center"
              justify="between"
              gap="2"
              px="5"
              py="3"
              style={{ borderBottom: "1px solid var(--gray-a4)" }}
            >
              <Box>
                <Heading size="2" weight="bold">
                  Recent activity
                </Heading>
                <Text size="1" color="gray">
                  {weeklyContributors} contributor
                  {weeklyContributors === 1 ? "" : "s"} across every ontology —
                  pulled live from the change log.
                </Text>
              </Box>
              <Button asChild variant="ghost" color="gray" size="1">
                <Link to={`/ontologies/${ontologies[0].id}`}>
                  <History className="h-3.5 w-3.5" />
                  Open history
                </Link>
              </Button>
            </Flex>

            {/* Filter chips */}
            <Flex
              wrap="wrap"
              align="center"
              gap="1"
              px="5"
              py="2"
              style={{
                borderBottom: "1px solid var(--gray-a4)",
                background: "var(--gray-2)",
              }}
            >
              <Filter
                className="h-3 w-3"
                style={{ color: "var(--gray-9)" }}
              />
              {(
                [
                  "all",
                  "create",
                  "update",
                  "delete",
                  "tag",
                  "bulk_import",
                ] as const
              ).map((f) => (
                <Button
                  key={f}
                  size="1"
                  variant={activityFilter === f ? "solid" : "ghost"}
                  color={activityFilter === f ? "violet" : "gray"}
                  onClick={() => setActivityFilter(f)}
                  className="capitalize"
                >
                  {f === "bulk_import" ? "import" : f}
                </Button>
              ))}
            </Flex>

            <Flex direction="column" asChild>
              <ul>
                {recent.length === 0 && (
                  <Box px="5" py="9" style={{ textAlign: "center" }}>
                    <Text size="2" color="gray">
                      No{" "}
                      {activityFilter === "all" ? "" : activityFilter + " "}
                      events yet.
                    </Text>
                  </Box>
                )}
                {recent.map((e, i) => {
                  const Icon = iconForEvent(e);
                  return (
                    <Flex
                      asChild
                      align="start"
                      gap="3"
                      px="5"
                      py="3"
                      key={e.id}
                      onClick={() => navigate(hrefForEvent(e))}
                      className="cursor-pointer hover:bg-[var(--gray-a3)]"
                      style={{
                        borderTop:
                          i !== 0 ? "1px solid var(--gray-a3)" : "none",
                      }}
                    >
                      <li>
                        <Avatar
                          size="2"
                          radius="full"
                          fallback={e.author.initials}
                          style={{
                            background: e.author.color,
                            color: "white",
                          }}
                        />
                        <Box className="min-w-0 flex-1">
                          <Flex
                            align="center"
                            gap="2"
                            className="text-sm"
                          >
                            <Text size="2" weight="bold">
                              {e.author.name}
                            </Text>
                            <Badge
                              color={kindBadgeColor(e.kind)}
                              variant="soft"
                              size="1"
                            >
                              <Icon className="h-2.5 w-2.5" />
                              {e.kind === "bulk_import" ? "import" : e.kind}
                            </Badge>
                            <Text
                              size="2"
                              weight="medium"
                              className="truncate"
                            >
                              {e.entityName}
                            </Text>
                          </Flex>
                          <Text
                            as="div"
                            size="1"
                            color="gray"
                            mt="1"
                            className="truncate"
                          >
                            {e.summary}
                          </Text>
                          {e.message && (
                            <Box
                              mt="2"
                              p="2"
                              style={{
                                background: "var(--color-panel-solid)",
                                border: "1px solid var(--gray-a4)",
                                borderRadius: "var(--radius-2)",
                              }}
                            >
                              <Text size="1" color="gray" className="italic">
                                "{e.message}"
                              </Text>
                            </Box>
                          )}
                          <Flex align="center" gap="2" mt="1">
                            <Text size="1" color="gray">
                              {timeAgo(e.at)}
                            </Text>
                            <Text size="1" color="gray">
                              ·
                            </Text>
                            <Text
                              size="1"
                              color="gray"
                              className="font-mono"
                            >
                              {e.id}
                            </Text>
                            {e.revertsEventId && (
                              <>
                                <Text size="1" color="gray">
                                  ·
                                </Text>
                                <Text
                                  size="1"
                                  color="amber"
                                  className="font-mono"
                                >
                                  reverts {e.revertsEventId}
                                </Text>
                              </>
                            )}
                          </Flex>
                        </Box>
                        <ArrowUpRight
                          className="mt-1 h-3.5 w-3.5 shrink-0"
                          style={{ color: "var(--gray-9)" }}
                        />
                      </li>
                    </Flex>
                  );
                })}
              </ul>
            </Flex>
          </Card>
        </Box>

        {/* Right column */}
        <Flex direction="column" gap="5" asChild>
          <aside>
            <Card size="3">
              <Heading size="2" weight="bold">
                Plan usage
              </Heading>
              <Text size="1" color="gray">
                Team plan · renews May 1, 2026
              </Text>
              <Flex direction="column" gap="3" mt="4">
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
              </Flex>
              <Button
                asChild
                variant="surface"
                color="gray"
                mt="4"
                className="w-full"
              >
                <Link to="/settings/billing">Manage billing</Link>
              </Button>
            </Card>

            <Card size="3">
              <Heading size="2" weight="bold">
                Recent members
              </Heading>
              <Text size="1" color="gray">
                {members.length} active
              </Text>
              <Flex direction="column" gap="2" mt="3" asChild>
                <ul>
                  {members.slice(0, 4).map((m) => (
                    <Flex
                      asChild
                      align="center"
                      gap="2"
                      key={m.email}
                    >
                      <li>
                        <Avatar
                          size="1"
                          radius="full"
                          fallback={m.initials}
                          style={{ background: m.color, color: "white" }}
                        />
                        <Box className="min-w-0 flex-1">
                          <Text size="1" weight="bold" className="block truncate">
                            {m.name}
                          </Text>
                          <Text size="1" color="gray" className="block truncate">
                            {m.role} · {m.lastActive}
                          </Text>
                        </Box>
                      </li>
                    </Flex>
                  ))}
                </ul>
              </Flex>
              <Button
                asChild
                variant="surface"
                color="gray"
                mt="4"
                className="w-full"
              >
                <Link to="/settings/members">Manage members</Link>
              </Button>
            </Card>

            <Card
              size="3"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-2), var(--color-panel-solid))",
                border: "1px solid var(--accent-a5)",
              }}
            >
              <Heading size="2" weight="bold" color="violet">
                Quick start
              </Heading>
              <Text as="p" size="1" mt="1" style={{ color: "var(--accent-11)" }}>
                Build your first ontology or bring in existing data.
              </Text>
              <Flex direction="column" gap="2" mt="3">
                {[
                  { to: "/import", label: "Import CSV or Excel" },
                  { to: "#", label: "Read the API quickstart" },
                  { to: "#", label: "Invite your team" },
                ].map((it) => (
                  <Link
                    key={it.label}
                    to={it.to}
                    className={clsx(
                      "flex items-center justify-between rounded-[var(--radius-3)] px-3 py-2 text-xs font-bold"
                    )}
                    style={{
                      background: "var(--color-panel-solid)",
                      border: "1px solid var(--accent-a5)",
                      color: "var(--accent-11)",
                    }}
                  >
                    {it.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </Flex>
            </Card>
          </aside>
        </Flex>
      </Box>
    </Box>
  );
}
