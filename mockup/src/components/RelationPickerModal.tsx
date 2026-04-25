import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
} from "@radix-ui/themes";
import { ArrowRight, Check, Link2, Plus } from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import { relationTypes, conceptClasses } from "../data/mock";

/**
 * Shown when the user drags from one node's handle to another on the
 * canvas. Narrows applicable RelationTypes to those whose
 * domain/range classes match the selected endpoints, with a fallback
 * to "show all" when nothing fits.
 */
export default function RelationPickerModal() {
  const {
    relationDraft,
    closeRelationDraft,
    concepts,
    addRelation,
    toast,
  } = useApp();

  const fromConcept = useMemo(
    () => concepts.find((c) => c.id === relationDraft?.from) ?? null,
    [concepts, relationDraft]
  );
  const toConcept = useMemo(
    () => concepts.find((c) => c.id === relationDraft?.to) ?? null,
    [concepts, relationDraft]
  );

  const applicable = useMemo(() => {
    if (!fromConcept || !toConcept) return [];
    return relationTypes.filter((rt) => {
      if (rt.ontologyId !== fromConcept.ontologyId) return false;
      const domainOk =
        !rt.domainClassId || rt.domainClassId === fromConcept.classId;
      const rangeOk =
        !rt.rangeClassId || rt.rangeClassId === toConcept.classId;
      return domainOk && rangeOk;
    });
  }, [fromConcept, toConcept]);

  const fallback = useMemo(() => {
    if (!fromConcept) return [];
    return relationTypes.filter(
      (rt) => rt.ontologyId === fromConcept.ontologyId
    );
  }, [fromConcept]);

  const list = applicable.length > 0 ? applicable : fallback;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const draftKey = relationDraft
    ? `${relationDraft.from}->${relationDraft.to}`
    : null;
  if (draftKey && selectedId && !list.some((rt) => rt.id === selectedId)) {
    setSelectedId(null);
  }

  if (!relationDraft || !fromConcept || !toConcept) {
    return (
      <Modal
        open={!!relationDraft}
        onClose={closeRelationDraft}
        title="Create relation"
      >
        <Text size="2" color="gray">
          Endpoints not found.
        </Text>
      </Modal>
    );
  }

  const effectiveId = selectedId ?? list[0]?.id ?? null;

  function getClassName(id?: string) {
    return id ? conceptClasses.find((c) => c.id === id)?.name : undefined;
  }

  function confirm() {
    if (!effectiveId || !fromConcept || !toConcept || !relationDraft) return;
    const rt = relationTypes.find((x) => x.id === effectiveId);
    if (!rt) return;
    const { relation } = addRelation({
      from: fromConcept.id,
      to: toConcept.id,
      schemeId: relationDraft.schemeId,
      relationTypeId: rt.id,
      label: rt.name,
    });
    toast({
      kind: "success",
      title: `Relation created`,
      description: `${fromConcept.name} —[${rt.name}]→ ${toConcept.name}`,
    });
    closeRelationDraft();
    setSelectedId(null);
    void relation;
  }

  return (
    <Modal
      open={!!relationDraft}
      onClose={() => {
        closeRelationDraft();
        setSelectedId(null);
      }}
      title="Create relation"
      subtitle={
        applicable.length > 0
          ? `Relation types valid for ${getClassName(
              fromConcept.classId
            )} → ${getClassName(toConcept.classId)}`
          : "No direct domain/range match — pick any relation type in this ontology."
      }
      width="max-w-xl"
      footer={
        <>
          <Button variant="ghost" color="gray" onClick={closeRelationDraft}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={!effectiveId}>
            <Link2 className="h-3.5 w-3.5" />
            Create relation
          </Button>
        </>
      }
    >
      <Flex direction="column" gap="3">
        {/* From / To summary */}
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
          <Box className="min-w-0 flex-1 truncate">
            <Text size="2" weight="bold" className="block truncate">
              {fromConcept.name}
            </Text>
            <Text size="1" color="gray" className="block truncate">
              {getClassName(fromConcept.classId) ?? "Concept"}
            </Text>
          </Box>
          <ArrowRight
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--gray-9)" }}
          />
          <Box className="min-w-0 flex-1 truncate text-right">
            <Text size="2" weight="bold" className="block truncate">
              {toConcept.name}
            </Text>
            <Text size="1" color="gray" className="block truncate">
              {getClassName(toConcept.classId) ?? "Concept"}
            </Text>
          </Box>
        </Flex>

        {/* Relation type list */}
        <Box>
          <Text
            size="1"
            weight="bold"
            color="gray"
            mb="2"
            className="uppercase tracking-wide block"
          >
            Relation type
          </Text>
          {list.length === 0 ? (
            <Box
              p="6"
              style={{
                border: "1px dashed var(--gray-a6)",
                background: "var(--color-panel-solid)",
                borderRadius: "var(--radius-3)",
                textAlign: "center",
              }}
            >
              <Plus
                className="mx-auto mb-1 h-4 w-4"
                style={{ color: "var(--gray-9)" }}
              />
              <Text size="2" color="gray">
                No relation types defined for this ontology yet — add one from
                the Schema view.
              </Text>
            </Box>
          ) : (
            <Flex
              direction="column"
              gap="1"
              style={{ maxHeight: 256, overflowY: "auto" }}
            >
              {list.map((rt) => {
                const active = effectiveId === rt.id;
                return (
                  <button
                    key={rt.id}
                    onClick={() => setSelectedId(rt.id)}
                    className="text-left"
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: "var(--radius-3)",
                      border: active
                        ? "2px solid var(--accent-9)"
                        : "1px solid var(--gray-a4)",
                      background: active
                        ? "var(--accent-3)"
                        : "var(--color-panel-solid)",
                      cursor: "pointer",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      className="h-5 w-5 shrink-0"
                    >
                      {active ? (
                        <Check
                          className="h-4 w-4"
                          style={{ color: "var(--accent-11)" }}
                        />
                      ) : (
                        <Link2
                          className="h-3.5 w-3.5"
                          style={{ color: "var(--gray-9)" }}
                        />
                      )}
                    </Flex>
                    <Box className="min-w-0 flex-1">
                      <Flex align="center" gap="2" wrap="wrap">
                        <Text
                          size="2"
                          weight="bold"
                          className="truncate"
                        >
                          {rt.name}
                        </Text>
                        {rt.isBuiltIn && (
                          <Badge color="gray" variant="soft" size="1">
                            built-in
                          </Badge>
                        )}
                        {rt.isTransitive && (
                          <Badge color="sky" variant="soft" size="1">
                            transitive
                          </Badge>
                        )}
                        {rt.isSymmetric && (
                          <Badge color="violet" variant="soft" size="1">
                            symmetric
                          </Badge>
                        )}
                      </Flex>
                      <Text
                        size="1"
                        color="gray"
                        className="truncate block"
                      >
                        {getClassName(rt.domainClassId) ?? "any"} →{" "}
                        {getClassName(rt.rangeClassId) ?? "any"}
                        {rt.description ? ` · ${rt.description}` : ""}
                      </Text>
                    </Box>
                  </button>
                );
              })}
            </Flex>
          )}
        </Box>
      </Flex>
    </Modal>
  );
}
