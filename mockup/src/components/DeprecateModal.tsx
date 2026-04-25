import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Callout,
  Code,
  Flex,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { AlertTriangle, Search, X, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";

/**
 * Deprecate a concept and optionally point at a replacement.
 *
 * The modal is deliberately opinionated: deprecation without a replacement
 * is allowed (sometimes the term just retires) but the picker is pre-scoped
 * to concepts from the same ontology so the taxonomist doesn't wander
 * across artefacts. Matches the "dct:isReplacedBy / skos:exactMatch"
 * pattern from the data-model doc.
 */
export default function DeprecateModal() {
  const {
    deprecateTarget,
    closeDeprecate,
    concepts,
    deprecateConcept,
    toast,
  } = useApp();

  const concept = useMemo(
    () => concepts.find((c) => c.id === deprecateTarget?.id) ?? null,
    [concepts, deprecateTarget]
  );

  const [query, setQuery] = useState("");
  const [replacementId, setReplacementId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const candidates = useMemo(() => {
    if (!concept) return [];
    const q = query.trim().toLowerCase();
    return concepts
      .filter((c) => {
        if (c.id === concept.id) return false;
        if (c.deprecated) return false;
        if (c.ontologyId !== concept.ontologyId) return false;
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.labels.prefLabel.some((l) => l.value.toLowerCase().includes(q)) ||
          c.labels.altLabel.some((l) => l.value.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const score = (x: typeof a) =>
          (x.schemeId === concept.schemeId ? 2 : 0) +
          (x.classId === concept.classId ? 1 : 0);
        return score(b) - score(a) || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [concept, concepts, query]);

  const replacement = useMemo(
    () => concepts.find((c) => c.id === replacementId) ?? null,
    [concepts, replacementId]
  );

  if (!concept) {
    return (
      <Modal
        open={!!deprecateTarget}
        onClose={closeDeprecate}
        title="Deprecate concept"
      >
        <Text size="2" color="gray">
          Concept not found.
        </Text>
      </Modal>
    );
  }

  function submit() {
    if (!concept) return;
    deprecateConcept({
      id: concept.id,
      replacedBy: replacementId ?? undefined,
      reason: reason.trim() || undefined,
    });
    toast({
      kind: "info",
      title: `"${concept.name}" deprecated`,
      description: replacement
        ? `Replaced by ${replacement.name}. Downstream consumers will auto-follow.`
        : "Consumers will see the term but it'll be hidden from pickers.",
    });
    closeDeprecate();
    setQuery("");
    setReplacementId(null);
    setReason("");
  }

  function reset() {
    closeDeprecate();
    setQuery("");
    setReplacementId(null);
    setReason("");
  }

  return (
    <Modal
      open={!!deprecateTarget}
      onClose={reset}
      title={`Deprecate "${concept.name}"`}
      subtitle="Retires the concept from pickers but keeps it queryable for referential integrity."
      width="max-w-xl"
      footer={
        <>
          <Button variant="ghost" color="gray" onClick={closeDeprecate}>
            Cancel
          </Button>
          <Button color="amber" onClick={submit}>
            <AlertTriangle className="h-3.5 w-3.5" />
            Deprecate{replacement ? " + redirect" : ""}
          </Button>
        </>
      }
    >
      <Flex direction="column" gap="4">
        {/* Summary */}
        <Callout.Root color="amber" variant="surface">
          <Callout.Icon>
            <AlertTriangle className="h-4 w-4" />
          </Callout.Icon>
          <Callout.Text>
            Downstream consumers keep their references intact. If you point at
            a replacement, clients that follow{" "}
            <Code variant="ghost">dct:isReplacedBy</Code> auto-redirect on next
            sync.
          </Callout.Text>
        </Callout.Root>

        {/* Replacement picker */}
        <Box>
          <Text
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Replacement concept{" "}
            <Text size="1" color="gray" className="normal-case font-normal">
              (optional)
            </Text>
          </Text>
          {replacement ? (
            <Flex
              align="center"
              justify="between"
              gap="2"
              mt="2"
              p="2"
              style={{
                background: "var(--accent-3)",
                border: "1px solid var(--accent-7)",
                borderRadius: "var(--radius-3)",
              }}
            >
              <Box className="min-w-0">
                <Flex align="center" gap="2">
                  <ArrowRight
                    className="h-3.5 w-3.5"
                    style={{ color: "var(--accent-11)" }}
                  />
                  <Text size="2" weight="bold" className="truncate">
                    {replacement.name}
                  </Text>
                </Flex>
                <Text size="1" color="gray" className="truncate block">
                  {replacement.description || "No description"}
                </Text>
              </Box>
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={() => setReplacementId(null)}
                title="Clear replacement"
              >
                <X className="h-3.5 w-3.5" />
              </IconButton>
            </Flex>
          ) : (
            <>
              <Box mt="2">
                <TextField.Root
                  placeholder="Search concepts in this ontology…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  size="2"
                  autoFocus
                >
                  <TextField.Slot>
                    <Search className="h-3.5 w-3.5" />
                  </TextField.Slot>
                </TextField.Root>
              </Box>
              {candidates.length > 0 && (
                <Box
                  mt="2"
                  style={{
                    background: "var(--color-panel-solid)",
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-3)",
                    maxHeight: 224,
                    overflowY: "auto",
                  }}
                >
                  {candidates.map((c, i) => (
                    <Flex
                      asChild
                      key={c.id}
                      align="center"
                      justify="between"
                      gap="2"
                      px="3"
                      py="2"
                      onClick={() => setReplacementId(c.id)}
                      className="cursor-pointer hover:bg-[var(--accent-3)]"
                      style={{
                        borderTop:
                          i !== 0 ? "1px solid var(--gray-a3)" : "none",
                      }}
                    >
                      <button>
                        <Box className="min-w-0">
                          <Text
                            size="2"
                            weight="medium"
                            className="block truncate"
                          >
                            {c.name}
                          </Text>
                          <Text
                            size="1"
                            color="gray"
                            className="block truncate"
                          >
                            {c.description || "—"}
                          </Text>
                        </Box>
                        <Badge color="gray" variant="soft" size="1">
                          {c.schemeId === concept.schemeId
                            ? "same scheme"
                            : "cross-scheme"}
                        </Badge>
                      </button>
                    </Flex>
                  ))}
                </Box>
              )}
              {query && candidates.length === 0 && (
                <Text size="1" color="gray" mt="2" as="p">
                  No matches in this ontology.
                </Text>
              )}
            </>
          )}
        </Box>

        {/* Reason */}
        <Box>
          <Text
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Reason{" "}
            <Text size="1" color="gray" className="normal-case font-normal">
              (optional — shown to downstream editors)
            </Text>
          </Text>
          <Box mt="2">
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Why is "${concept.name}" being deprecated?`}
              size="2"
              style={{ minHeight: 72 }}
            />
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
}
