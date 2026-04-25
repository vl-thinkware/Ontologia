import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  Text,
} from "@radix-ui/themes";
import {
  Bell,
  Check,
  CheckCircle2,
  History,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";
import { useApp } from "../app/AppContext";
import { currentUser, ontologies } from "../data/mock";

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
      '"Should we keep hasDrive → AWD here? The AWD trim is US-only in 2026."',
    time: "1h ago",
    icon: MessageSquare,
    href: "/ontologies/ont_cars/concepts/c_model_camry",
    meta: { background: "#f59e0b", initials: "MD" },
  },
  {
    id: "nt_review_2",
    kind: "review",
    title: "CSV import dry-run ready",
    subtitle:
      "32 new 2026 model-year rows staged from catalogue.csv — needs approval.",
    time: "2h ago",
    icon: AlertTriangle,
    href: "/import",
  },
];

export default function NotificationsBell() {
  const { events, tick } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [, forceRerender] = useState(0);
  void tick;

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
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <IconButton
          variant="ghost"
          color="gray"
          size="2"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className="absolute right-0 top-0 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-[3px] text-[9px] font-bold leading-none text-white"
              style={{
                background: "var(--accent-9)",
                boxShadow: "0 0 0 2px var(--color-panel-solid)",
              }}
              aria-label={`${unreadCount} unread`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        size="2"
        align="end"
        sideOffset={6}
        style={{ width: 380, padding: 0 }}
      >
        <Flex
          align="center"
          justify="between"
          px="3"
          py="2"
          style={{
            borderBottom: "1px solid var(--gray-a4)",
            background: "var(--gray-2)",
          }}
        >
          <Box>
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Notifications
            </Text>
            <Text as="div" size="2" weight="bold">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </Text>
          </Box>
          {unreadCount > 0 && (
            <Button variant="ghost" size="1" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </Flex>

        <Box style={{ maxHeight: 440, overflowY: "auto" }}>
          {items.length === 0 && (
            <Box px="4" py="9" style={{ textAlign: "center" }}>
              <Text size="1" color="gray">
                Nothing new.
              </Text>
            </Box>
          )}
          {items.map((n, i) => {
            const unread = !readEventIds.has(n.id);
            const Icon = n.icon;
            return (
              <Flex
                key={n.id}
                align="start"
                gap="2"
                px="3"
                py="2"
                onClick={() => {
                  markRead(n.id);
                  if (n.href) {
                    setOpen(false);
                    navigate(n.href);
                  }
                }}
                className={clsx("cursor-pointer hover:bg-[var(--gray-a3)]")}
                style={{
                  borderTop: i !== 0 ? "1px solid var(--gray-a3)" : "none",
                  background: unread ? "var(--accent-2)" : "transparent",
                }}
              >
                {n.meta ? (
                  <Avatar
                    size="1"
                    radius="full"
                    fallback={n.meta.initials}
                    style={{ background: n.meta.background, color: "white" }}
                  />
                ) : (
                  <Flex
                    align="center"
                    justify="center"
                    className="h-7 w-7 shrink-0 rounded-full"
                    style={{
                      background: "var(--gray-a3)",
                      color: "var(--gray-11)",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Flex>
                )}
                <Box className="min-w-0 flex-1">
                  <Flex align="center" gap="2">
                    <Text
                      size="1"
                      weight={unread ? "bold" : "regular"}
                      className="truncate"
                    >
                      {n.title}
                    </Text>
                    {unread && (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: "var(--accent-9)" }}
                      />
                    )}
                  </Flex>
                  {n.subtitle && (
                    <Text
                      as="p"
                      size="1"
                      color="gray"
                      mt="1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {n.subtitle}
                    </Text>
                  )}
                  <Text size="1" color="gray" mt="1" className="block">
                    {n.time}
                  </Text>
                </Box>
                {unread && (
                  <IconButton
                    variant="ghost"
                    color="gray"
                    size="1"
                    onClick={(e) => {
                      e.stopPropagation();
                      markRead(n.id);
                    }}
                    title="Mark read"
                  >
                    <Check className="h-3 w-3" />
                  </IconButton>
                )}
              </Flex>
            );
          })}
        </Box>

        <Box
          px="3"
          py="2"
          style={{
            borderTop: "1px solid var(--gray-a4)",
            background: "var(--gray-2)",
            textAlign: "center",
          }}
        >
          <Text size="1" color="gray">
            Notifications pull from the live change log across{" "}
            {ontologies.length} ontolog
            {ontologies.length === 1 ? "y" : "ies"}.
          </Text>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
}

function findHrefForEvent(
  entityKind: string,
  entityId: string
): string | undefined {
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
