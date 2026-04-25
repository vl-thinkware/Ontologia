import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  ShieldCheck,
  AlertTriangle,
  CircleAlert,
  CircleDashed,
  Languages,
  Link2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  concepts as allConcepts,
  relations as allRelations,
  conceptClasses as allConceptClasses,
  relationTypes as allRelationTypes,
  conceptSchemes as allSchemes,
} from "../data/mock";

type Issue = {
  id: string;
  severity: "error" | "warn";
  rule: string;
  title: string;
  description: string;
  conceptId?: string;
  relationId?: string;
};

function computeIssues(ontologyId: string, tick: number): Issue[] {
  void tick;
  const issues: Issue[] = [];
  const scopedConcepts = allConcepts.filter((c) => c.ontologyId === ontologyId);
  const scopedRelations = allRelations.filter((r) => {
    const from = allConcepts.find((c) => c.id === r.from);
    return from?.ontologyId === ontologyId;
  });
  const scopedSchemes = allSchemes.filter((s) => s.ontologyId === ontologyId);
  const classById = new Map(
    allConceptClasses
      .filter((c) => c.ontologyId === ontologyId)
      .map((c) => [c.id, c])
  );
  const relTypeById = new Map(
    allRelationTypes
      .filter((r) => r.ontologyId === ontologyId)
      .map((r) => [r.id, r])
  );

  scopedConcepts.forEach((c) => {
    if (!c.classId || !classById.has(c.classId)) {
      issues.push({
        id: `class-${c.id}`,
        severity: "error",
        rule: "Missing class",
        title: `"${c.name}" has no valid ConceptClass`,
        description:
          "Every concept must point at a class defined in the ontology's T-Box.",
        conceptId: c.id,
      });
    }
  });

  scopedSchemes.forEach((scheme) => {
    const inScheme = scopedConcepts.filter((c) => c.schemeId === scheme.id);
    const seen = new Map<string, string>();
    inScheme.forEach((c) => {
      c.labels.prefLabel.forEach((l) => {
        const key = `${l.lang}::${l.value.trim().toLowerCase()}`;
        const first = seen.get(key);
        if (first && first !== c.id) {
          issues.push({
            id: `dup-${c.id}-${l.lang}`,
            severity: "warn",
            rule: "Duplicate prefLabel",
            title: `Two concepts share the prefLabel "${l.value}"`,
            description: `Both "${first}" and "${c.id}" carry this label in ${l.lang} within "${scheme.name}".`,
            conceptId: c.id,
          });
        } else if (!first) {
          seen.set(key, c.id);
        }
      });
    });
  });

  scopedRelations.forEach((r) => {
    const rt = relTypeById.get(r.relationTypeId);
    if (!rt) return;
    const from = allConcepts.find((c) => c.id === r.from);
    const to = allConcepts.find((c) => c.id === r.to);
    if (!from || !to) return;
    if (rt.domainClassId && from.classId !== rt.domainClassId) {
      const expected =
        classById.get(rt.domainClassId)?.name ?? rt.domainClassId;
      const got = classById.get(from.classId)?.name ?? from.classId;
      issues.push({
        id: `dom-${r.id}`,
        severity: "error",
        rule: "Domain violation",
        title: `${rt.name}: "${from.name}" isn't a ${expected}`,
        description: `Expected domain "${expected}" but got "${got}". Either move the source into the right class or relax the relation type.`,
        relationId: r.id,
        conceptId: from.id,
      });
    }
    if (rt.rangeClassId && to.classId !== rt.rangeClassId) {
      const expected =
        classById.get(rt.rangeClassId)?.name ?? rt.rangeClassId;
      const got = classById.get(to.classId)?.name ?? to.classId;
      issues.push({
        id: `rng-${r.id}`,
        severity: "error",
        rule: "Range violation",
        title: `${rt.name}: "${to.name}" isn't a ${expected}`,
        description: `Expected range "${expected}" but got "${got}".`,
        relationId: r.id,
        conceptId: to.id,
      });
    }
  });

  scopedConcepts
    .filter((c) => c.deprecated)
    .forEach((c) => {
      const refs = scopedRelations.filter(
        (r) => r.from === c.id || r.to === c.id
      );
      if (refs.length > 0) {
        issues.push({
          id: `deprec-${c.id}`,
          severity: "warn",
          rule: "Deprecated still in use",
          title: `"${c.name}" is deprecated but referenced ${refs.length} time${
            refs.length === 1 ? "" : "s"
          }`,
          description:
            "Consider rewriting those relations to point at the replacement concept.",
          conceptId: c.id,
        });
      }
    });

  scopedConcepts.forEach((c) => {
    if (c.deprecated) return;
    const anyRel = scopedRelations.some(
      (r) => r.from === c.id || r.to === c.id
    );
    if (!anyRel) {
      issues.push({
        id: `orph-${c.id}`,
        severity: "warn",
        rule: "Orphan concept",
        title: `"${c.name}" is not connected to anything`,
        description:
          "Orphans don't appear in the tree view. Add a broader/narrower relation or reclassify.",
        conceptId: c.id,
      });
    }
  });

  return issues;
}

export default function ValidationPanel({
  ontologyId,
}: {
  ontologyId: string;
}) {
  const { tick } = useApp();
  const navigate = useNavigate();

  const issues = useMemo(
    () => computeIssues(ontologyId, tick),
    [ontologyId, tick]
  );

  const byRule = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    issues.forEach((i) => {
      if (!groups[i.rule]) groups[i.rule] = [];
      groups[i.rule].push(i);
    });
    return groups;
  }, [issues]);

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warn").length;

  return (
    <Flex direction="column" className="h-full min-h-0">
      <Box
        px="4"
        py="3"
        style={{ borderBottom: "1px solid var(--gray-a4)" }}
      >
        <Flex align="center" gap="2">
          <ShieldCheck
            className="h-4 w-4"
            style={{ color: "var(--gray-11)" }}
          />
          <Heading size="2" weight="bold">
            Validation
          </Heading>
          {issues.length === 0 ? (
            <Badge color="green" variant="soft" size="1">
              <CheckCircle2 className="h-3 w-3" />
              All clear
            </Badge>
          ) : (
            <>
              {errorCount > 0 && (
                <Badge color="ruby" variant="soft" size="1">
                  <CircleAlert className="h-3 w-3" />
                  {errorCount}
                </Badge>
              )}
              {warnCount > 0 && (
                <Badge color="amber" variant="soft" size="1">
                  <AlertTriangle className="h-3 w-3" />
                  {warnCount}
                </Badge>
              )}
            </>
          )}
        </Flex>
        <Text as="p" size="1" color="gray" mt="1">
          Live checks that run on every edit. Click an issue to jump to the
          offending concept.
        </Text>
      </Box>

      <Box className="min-h-0 flex-1 overflow-y-auto">
        {issues.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            px="6"
            className="h-full text-center"
          >
            <Flex
              align="center"
              justify="center"
              className="h-12 w-12 rounded-full"
              style={{
                background: "var(--green-3)",
                color: "var(--green-11)",
              }}
            >
              <CheckCircle2 className="h-6 w-6" />
            </Flex>
            <Heading size="2" weight="bold" mt="3">
              Everything checks out
            </Heading>
            <Text
              size="1"
              color="gray"
              mt="1"
              style={{ maxWidth: 220 }}
            >
              No orphans, duplicates, or domain/range violations in this
              ontology.
            </Text>
          </Flex>
        )}
        {Object.entries(byRule).map(([rule, items]) => {
          const firstSeverity = items[0].severity;
          const Icon = iconForRule(rule);
          return (
            <Box
              key={rule}
              style={{ borderBottom: "1px solid var(--gray-a4)" }}
            >
              <Flex
                align="center"
                gap="2"
                px="4"
                py="2"
                style={{ background: "var(--gray-2)" }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--gray-11)" }}
                />
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wide"
                >
                  {rule}
                </Text>
                <Box ml="auto">
                  <Badge
                    color={firstSeverity === "error" ? "ruby" : "amber"}
                    variant="soft"
                    size="1"
                  >
                    {items.length}
                  </Badge>
                </Box>
              </Flex>
              <Flex direction="column" asChild>
                <ul>
                  {items.map((issue) => (
                    <Flex
                      asChild
                      key={issue.id}
                      align="start"
                      gap="2"
                      px="4"
                      py="2"
                      onClick={() => {
                        if (issue.conceptId) {
                          navigate(
                            `/ontologies/${ontologyId}/concepts/${issue.conceptId}`
                          );
                        }
                      }}
                      className="cursor-pointer hover:bg-[var(--gray-a3)]"
                      style={{
                        borderLeft: `2px solid ${
                          issue.severity === "error"
                            ? "var(--ruby-9)"
                            : "var(--amber-9)"
                        }`,
                      }}
                    >
                      <li>
                        <Box className="min-w-0 flex-1">
                          <Text size="1" weight="bold">
                            {issue.title}
                          </Text>
                          <Text as="p" size="1" color="gray" mt="1">
                            {issue.description}
                          </Text>
                        </Box>
                        <ArrowRight
                          className="mt-1 h-3.5 w-3.5 shrink-0"
                          style={{ color: "var(--gray-9)" }}
                        />
                      </li>
                    </Flex>
                  ))}
                </ul>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}

function iconForRule(rule: string): React.ElementType {
  switch (rule) {
    case "Missing class":
      return CircleDashed;
    case "Duplicate prefLabel":
      return Languages;
    case "Domain violation":
    case "Range violation":
      return Link2;
    case "Deprecated still in use":
      return AlertTriangle;
    case "Orphan concept":
      return CircleDashed;
    default:
      return CircleAlert;
  }
}
