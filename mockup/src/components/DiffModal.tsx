import { useMemo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Text,
} from "@radix-ui/themes";
import { ArrowLeftRight, History, RotateCcw } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

type FieldDiff = {
  label: string;
  before: string;
  after: string;
};

type EventKind =
  | "create"
  | "update"
  | "delete"
  | "revert"
  | "tag"
  | "bulk_import";

const KIND_COLOR: Record<
  EventKind,
  "green" | "sky" | "ruby" | "amber" | "violet" | "gray"
> = {
  create: "green",
  update: "sky",
  delete: "ruby",
  revert: "amber",
  tag: "violet",
  bulk_import: "gray",
};

/**
 * Diff viewer for a single ChangeEvent.
 */
export default function DiffModal() {
  const {
    diffEventId,
    closeDiff,
    events,
    concepts,
    relations,
    revertEvent,
    toast,
  } = useApp();

  const event = useMemo(
    () => events.find((e) => e.id === diffEventId) ?? null,
    [events, diffEventId]
  );

  const previous = useMemo(() => {
    if (!event) return null;
    const siblings = events.filter(
      (e) => e.entityId === event.entityId && e.at < event.at
    );
    return siblings.sort((a, b) => (a.at < b.at ? 1 : -1))[0] ?? null;
  }, [events, event]);

  const snapshot = useMemo(() => {
    if (!event) return null;
    if (event.entityKind === "concept") {
      const c = concepts.find((x) => x.id === event.entityId);
      if (!c) return null;
      const prefEn =
        c.labels.prefLabel.find((l) => l.lang === "en")?.value ?? c.name;
      const prefFr =
        c.labels.prefLabel.find((l) => l.lang === "fr")?.value ?? "";
      const defEn =
        c.definitions.find((l) => l.lang === "en")?.value ??
        c.description ??
        "";
      return {
        kind: "concept" as const,
        fields: [
          { label: "Name", value: c.name },
          { label: "prefLabel (en)", value: prefEn },
          { label: "prefLabel (fr)", value: prefFr },
          { label: "Definition (en)", value: defEn },
          {
            label: "Deprecated",
            value: c.deprecated ? "true" : "false",
          },
          {
            label: "Replaced by",
            value: c.replacedBy
              ? concepts.find((x) => x.id === c.replacedBy)?.name ??
                c.replacedBy
              : "—",
          },
        ],
      };
    }
    if (event.entityKind === "relation") {
      const r = relations.find((x) => x.id === event.entityId);
      if (!r) return null;
      const from = concepts.find((x) => x.id === r.from);
      const to = concepts.find((x) => x.id === r.to);
      return {
        kind: "relation" as const,
        fields: [
          { label: "From", value: from?.name ?? r.from },
          { label: "Label", value: r.label },
          { label: "To", value: to?.name ?? r.to },
        ],
      };
    }
    return null;
  }, [event, concepts, relations]);

  const diff: FieldDiff[] = useMemo(() => {
    if (!event || !snapshot) return [];
    if (event.kind === "create") {
      return snapshot.fields.map((f) => ({
        label: f.label,
        before: "—",
        after: f.value,
      }));
    }
    if (event.kind === "delete") {
      return snapshot.fields.map((f) => ({
        label: f.label,
        before: f.value,
        after: "—",
      }));
    }
    if (event.kind === "revert" && event.revertsEventId) {
      return [
        {
          label: "Action",
          before: `Reverted ${event.revertsEventId}`,
          after: "Current state restored",
        },
      ];
    }
    return snapshot.fields.map((f) => ({
      label: f.label,
      before: previous?.summary.includes(f.label)
        ? "(previous)"
        : "(unchanged)",
      after: f.value,
    }));
  }, [event, snapshot, previous]);

  if (!event) {
    return (
      <Modal open={!!diffEventId} onClose={closeDiff} title="Change detail">
        <Text size="2" color="gray">
          Event not found.
        </Text>
      </Modal>
    );
  }

  return (
    <Modal
      open={!!diffEventId}
      onClose={closeDiff}
      title={event.summary}
      subtitle={`${event.entityKind} · ${event.kind} · ${timeAgo(event.at)}`}
      width="max-w-3xl"
      footer={
        <>
          <Button variant="ghost" color="gray" onClick={closeDiff}>
            Close
          </Button>
          {event.kind !== "revert" && (
            <Button
              variant="surface"
              color="gray"
              onClick={() => {
                revertEvent(event.id);
                toast({
                  kind: "info",
                  title: "Change reverted",
                  description: `A new revert event was recorded.`,
                });
                closeDiff();
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Revert this change
            </Button>
          )}
        </>
      }
    >
      <Flex direction="column" gap="3">
        {/* Author bar */}
        <Flex
          align="center"
          gap="2"
          p="2"
          style={{
            background: "var(--gray-2)",
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
          }}
        >
          <Avatar
            size="1"
            radius="full"
            fallback={event.author.initials}
            style={{ background: event.author.color, color: "white" }}
          />
          <Box className="min-w-0 flex-1">
            <Text size="2" weight="bold" className="block truncate">
              {event.author.name}
            </Text>
            <Text size="1" color="gray" className="block truncate">
              {new Date(event.at).toLocaleString()}
              {event.message ? ` · ${event.message}` : ""}
            </Text>
          </Box>
          <Badge
            color={KIND_COLOR[event.kind as EventKind] ?? "gray"}
            variant="soft"
            size="1"
          >
            {event.kind}
          </Badge>
        </Flex>

        {/* Diff table */}
        <Box
          style={{
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
            overflow: "hidden",
          }}
        >
          <Flex
            style={{
              background: "var(--gray-2)",
              borderBottom: "1px solid var(--gray-a4)",
              fontSize: 11,
            }}
          >
            <Box
              px="3"
              py="2"
              style={{
                width: "max-content",
                borderRight: "1px solid var(--gray-a4)",
              }}
            >
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wide"
              >
                Field
              </Text>
            </Box>
            <Box
              px="3"
              py="2"
              className="flex-1"
              style={{ borderRight: "1px solid var(--gray-a4)" }}
            >
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wide"
              >
                Before
              </Text>
            </Box>
            <Flex
              align="center"
              px="2"
              style={{ borderRight: "1px solid var(--gray-a4)" }}
            >
              <ArrowLeftRight
                className="h-3.5 w-3.5"
                style={{ color: "var(--gray-9)" }}
              />
            </Flex>
            <Box px="3" py="2" className="flex-1">
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wide"
              >
                After
              </Text>
            </Box>
          </Flex>
          {diff.length === 0 ? (
            <Flex align="center" gap="2" px="3" py="4">
              <History
                className="h-4 w-4"
                style={{ color: "var(--gray-9)" }}
              />
              <Text size="2" color="gray">
                No structured diff available — treat the summary above as the
                source of truth.
              </Text>
            </Flex>
          ) : (
            <Box>
              {diff.map((d, i) => {
                const changed = d.before !== d.after;
                return (
                  <Flex
                    key={i}
                    style={{
                      borderTop:
                        i !== 0 ? "1px solid var(--gray-a3)" : "none",
                    }}
                  >
                    <Box
                      px="3"
                      py="2"
                      style={{
                        width: "max-content",
                        borderRight: "1px solid var(--gray-a3)",
                      }}
                    >
                      <Text size="1" color="gray" weight="medium">
                        {d.label}
                      </Text>
                    </Box>
                    <Box
                      px="3"
                      py="2"
                      className="flex-1"
                      style={{
                        borderRight: "1px solid var(--gray-a3)",
                        background: changed
                          ? "var(--ruby-2)"
                          : "transparent",
                        color: changed
                          ? "var(--ruby-12)"
                          : "var(--gray-11)",
                      }}
                    >
                      <Text size="1" className="break-words">
                        {d.before || "—"}
                      </Text>
                    </Box>
                    <Box
                      style={{
                        borderRight: "1px solid var(--gray-a3)",
                      }}
                    />
                    <Box
                      px="3"
                      py="2"
                      className="flex-1"
                      style={{
                        background: changed
                          ? "var(--green-2)"
                          : "transparent",
                        color: changed
                          ? "var(--green-12)"
                          : "var(--gray-11)",
                      }}
                    >
                      <Text size="1" className="break-words">
                        {d.after || "—"}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          )}
        </Box>

        {previous && (
          <Text size="1" color="gray">
            Previous touch on this entity:{" "}
            <strong style={{ color: "var(--gray-12)" }}>
              {previous.summary}
            </strong>{" "}
            · {timeAgo(previous.at)}
          </Text>
        )}
      </Flex>
    </Modal>
  );
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
