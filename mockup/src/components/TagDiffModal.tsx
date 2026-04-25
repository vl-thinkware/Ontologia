import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Select,
  Text,
} from "@radix-ui/themes";
import {
  GitCompare,
  ArrowRight,
  FilePlus2,
  FilePenLine,
  FileMinus2,
  Tag as TagIcon,
} from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

type DeltaKind = "added" | "modified" | "removed";

type DeltaRow = {
  kind: DeltaKind;
  entityKind: "concept" | "relation" | "tag";
  entityId: string;
  entityName: string;
  summary: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  at: string;
};

const DELTA_COLOR: Record<DeltaKind, "green" | "ruby" | "sky"> = {
  added: "green",
  modified: "sky",
  removed: "ruby",
};

const DELTA_TINT_BG: Record<DeltaKind, string> = {
  added: "var(--green-2)",
  modified: "var(--sky-2)",
  removed: "var(--ruby-2)",
};

const DELTA_BORDER: Record<DeltaKind, string> = {
  added: "var(--green-9)",
  modified: "var(--sky-9)",
  removed: "var(--ruby-9)",
};

export default function TagDiffModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { events, tags } = useApp();
  const sortedTags = useMemo(() => {
    const byEventAt = tags
      .map((t) => {
        const e = events.find((ev) => ev.id === t.changeEventId);
        return { tag: t, at: e?.at ?? t.createdAt };
      })
      .sort((a, b) => (a.at < b.at ? -1 : 1));
    return byEventAt.map((x) => x.tag);
  }, [tags, events]);

  const defaultFrom = sortedTags[0]?.id ?? "";
  const defaultTo = sortedTags[sortedTags.length - 1]?.id ?? "";
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);

  const fromTag = sortedTags.find((t) => t.id === fromId);
  const toTag = sortedTags.find((t) => t.id === toId);

  const deltas: DeltaRow[] = useMemo(() => {
    if (!fromTag || !toTag) return [];
    const fromEvent = events.find((e) => e.id === fromTag.changeEventId);
    const toEvent = events.find((e) => e.id === toTag.changeEventId);
    if (!fromEvent || !toEvent) return [];
    const lower = fromEvent.at < toEvent.at ? fromEvent.at : toEvent.at;
    const upper = fromEvent.at < toEvent.at ? toEvent.at : fromEvent.at;
    const between = events.filter(
      (e) => e.at > lower && e.at <= upper && e.kind !== "tag"
    );
    const rollup = new Map<string, DeltaRow>();
    for (const e of between.slice().reverse()) {
      const existing = rollup.get(e.entityId);
      const kind: DeltaKind =
        e.kind === "create" || e.kind === "bulk_import"
          ? "added"
          : e.kind === "delete"
          ? "removed"
          : "modified";
      if (!existing) {
        rollup.set(e.entityId, {
          kind,
          entityKind:
            e.entityKind === "concept" ||
            e.entityKind === "relation" ||
            e.entityKind === "tag"
              ? e.entityKind
              : "concept",
          entityId: e.entityId,
          entityName: e.entityName,
          summary: e.summary,
          authorName: e.author.name,
          authorInitials: e.author.initials,
          authorColor: e.author.color,
          at: e.at,
        });
      } else {
        if (kind === "removed") {
          existing.kind = existing.kind === "added" ? "added" : "removed";
          if (existing.kind === "added") {
            rollup.delete(e.entityId);
            continue;
          }
        }
        existing.summary = e.summary;
        existing.at = e.at;
      }
    }
    return Array.from(rollup.values());
  }, [fromTag, toTag, events]);

  const counts = useMemo(() => {
    const out = { added: 0, modified: 0, removed: 0 };
    deltas.forEach((d) => {
      out[d.kind] += 1;
    });
    return out;
  }, [deltas]);

  const [filter, setFilter] = useState<"all" | DeltaKind>("all");
  const filtered = deltas.filter(
    (d) => filter === "all" || d.kind === filter
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compare tags"
      subtitle="See everything that changed between two tagged snapshots — additions, edits, removals."
      width="max-w-4xl"
      footer={
        <Button variant="surface" color="gray" onClick={onClose}>
          Close
        </Button>
      }
    >
      <Flex direction="column" gap="3">
        {/* Tag pickers */}
        <Flex
          align="center"
          gap="3"
          p="2"
          style={{
            background: "var(--gray-2)",
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
          }}
        >
          <Flex align="center" gap="2" className="min-w-0 flex-1">
            <TagIcon
              className="h-3.5 w-3.5"
              style={{ color: "var(--gray-11)" }}
            />
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wide"
            >
              From
            </Text>
            <Box className="min-w-0 flex-1">
              <Select.Root value={fromId} onValueChange={setFromId} size="1">
                <Select.Trigger
                  className="w-full"
                  variant="surface"
                  style={{ fontFamily: "var(--code-font-family)" }}
                />
                <Select.Content>
                  {sortedTags.map((t) => (
                    <Select.Item key={t.id} value={t.id}>
                      {t.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
          <ArrowRight
            className="h-4 w-4"
            style={{ color: "var(--gray-9)" }}
          />
          <Flex align="center" gap="2" className="min-w-0 flex-1">
            <TagIcon
              className="h-3.5 w-3.5"
              style={{ color: "var(--gray-11)" }}
            />
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wide"
            >
              To
            </Text>
            <Box className="min-w-0 flex-1">
              <Select.Root value={toId} onValueChange={setToId} size="1">
                <Select.Trigger
                  className="w-full"
                  variant="surface"
                  style={{ fontFamily: "var(--code-font-family)" }}
                />
                <Select.Content>
                  {sortedTags.map((t) => (
                    <Select.Item key={t.id} value={t.id}>
                      {t.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Flex>

        {/* Stat strip + filter */}
        <Flex wrap="wrap" align="center" gap="2">
          <StatPill
            kind="added"
            count={counts.added}
            active={filter === "added" || filter === "all"}
            onClick={() => setFilter(filter === "added" ? "all" : "added")}
          />
          <StatPill
            kind="modified"
            count={counts.modified}
            active={filter === "modified" || filter === "all"}
            onClick={() =>
              setFilter(filter === "modified" ? "all" : "modified")
            }
          />
          <StatPill
            kind="removed"
            count={counts.removed}
            active={filter === "removed" || filter === "all"}
            onClick={() => setFilter(filter === "removed" ? "all" : "removed")}
          />
          <Text size="1" color="gray" ml="auto">
            {filtered.length} of {deltas.length} change
            {deltas.length === 1 ? "" : "s"} shown
          </Text>
        </Flex>

        {/* Delta list */}
        <Box
          style={{
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
            overflow: "hidden",
          }}
        >
          {filtered.length === 0 ? (
            <Flex align="center" justify="center" gap="2" px="4" py="9">
              <GitCompare
                className="h-4 w-4"
                style={{ color: "var(--gray-9)" }}
              />
              <Text size="2" color="gray">
                {fromId === toId
                  ? "Pick two different tags to see the diff."
                  : "No structural changes between these two tags."}
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" asChild>
              <ul>
                {filtered.map((d, i) => {
                  const Icon =
                    d.kind === "added"
                      ? FilePlus2
                      : d.kind === "removed"
                      ? FileMinus2
                      : FilePenLine;
                  return (
                    <Flex
                      asChild
                      key={d.entityId + d.at}
                      align="start"
                      gap="3"
                      px="3"
                      py="2"
                      style={{
                        background: DELTA_TINT_BG[d.kind],
                        borderLeft: `4px solid ${DELTA_BORDER[d.kind]}`,
                        borderTop:
                          i !== 0 ? "1px solid var(--gray-a3)" : "none",
                      }}
                    >
                      <li>
                        <Icon
                          className="mt-0.5 h-4 w-4 shrink-0"
                          style={{
                            color: `var(--${
                              d.kind === "added"
                                ? "green"
                                : d.kind === "removed"
                                ? "ruby"
                                : "sky"
                            }-11)`,
                          }}
                        />
                        <Box className="min-w-0 flex-1">
                          <Flex align="center" gap="2">
                            <Badge
                              color={DELTA_COLOR[d.kind]}
                              variant="solid"
                              size="1"
                              className="uppercase"
                            >
                              {d.kind}
                            </Badge>
                            <Text size="2" weight="bold">
                              {d.entityName}
                            </Text>
                            <Text
                              size="1"
                              color="gray"
                              className="font-mono"
                            >
                              {d.entityId}
                            </Text>
                          </Flex>
                          <Text
                            as="p"
                            size="1"
                            color="gray"
                            mt="1"
                          >
                            {d.summary}
                          </Text>
                          <Flex align="center" gap="2" mt="2">
                            <Avatar
                              size="1"
                              radius="full"
                              fallback={d.authorInitials}
                              style={{
                                background: d.authorColor,
                                color: "white",
                              }}
                            />
                            <Text size="1" color="gray">
                              {d.authorName}
                            </Text>
                            <Text size="1" color="gray">
                              ·
                            </Text>
                            <Text size="1" color="gray">
                              {new Date(d.at).toLocaleString()}
                            </Text>
                          </Flex>
                        </Box>
                      </li>
                    </Flex>
                  );
                })}
              </ul>
            </Flex>
          )}
        </Box>
      </Flex>
    </Modal>
  );
}

function StatPill({
  kind,
  count,
  active,
  onClick,
}: {
  kind: DeltaKind;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const color = DELTA_COLOR[kind];
  const Icon =
    kind === "added"
      ? FilePlus2
      : kind === "removed"
      ? FileMinus2
      : FilePenLine;
  return (
    <Button
      variant={active ? "soft" : "ghost"}
      color={color}
      size="1"
      onClick={onClick}
      style={{ opacity: active ? 1 : 0.5 }}
      radius="full"
    >
      <Icon className="h-3.5 w-3.5" />
      {count} {kind}
    </Button>
  );
}
