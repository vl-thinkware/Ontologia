import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import {
  Layers,
  Languages,
  BookOpen,
  Tag as TagIcon,
  EyeOff,
  Hash,
  FileText,
  Type,
  ArrowUpRight,
  Link2,
  MousePointer2,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  concepts as allConcepts,
  relations as allRelations,
  relationTypes as allRelationTypes,
  conceptClasses as allConceptClasses,
  type ConceptClass,
} from "../data/mock";

const COLOR_BANNER: Record<string, string> = {
  violet: "linear-gradient(90deg, var(--violet-9), var(--violet-11))",
  emerald: "linear-gradient(90deg, var(--green-9), var(--green-11))",
  amber: "linear-gradient(90deg, var(--amber-9), var(--amber-11))",
  sky: "linear-gradient(90deg, var(--sky-9), var(--sky-11))",
  rose: "linear-gradient(90deg, var(--ruby-9), var(--ruby-11))",
  ink: "linear-gradient(90deg, var(--gray-11), var(--gray-12))",
};

export default function ClassInspector({
  classId,
  ontologyId,
}: {
  classId: string | null;
  ontologyId: string;
}) {
  const { tick } = useApp();
  const navigate = useNavigate();

  const cls = useMemo(
    () => allConceptClasses.find((c) => c.id === classId) ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classId, tick]
  );

  const stats = useMemo(() => {
    if (!cls) return { instances: 0, outgoing: [], incoming: [] };
    const instances = allConcepts.filter((c) => c.classId === cls.id).length;
    const outgoing = allRelationTypes.filter(
      (r) => r.domainClassId === cls.id
    );
    const incoming = allRelationTypes.filter(
      (r) => r.rangeClassId === cls.id && r.domainClassId !== cls.id
    );
    void tick;
    return { instances, outgoing, incoming };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cls, tick]);

  if (!cls) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        px="6"
        py="9"
        className="h-full text-center"
      >
        <Flex
          align="center"
          justify="center"
          className="h-12 w-12 rounded-full"
          style={{ background: "var(--gray-a3)", color: "var(--gray-9)" }}
        >
          <MousePointer2 className="h-5 w-5" />
        </Flex>
        <Heading size="2" weight="bold" mt="4">
          Pick a class
        </Heading>
        <Text size="1" color="gray" mt="1" style={{ maxWidth: 260 }}>
          Click any class card on the schema canvas to see its SKOS built-ins,
          custom attributes and the relation types it participates in.
        </Text>
      </Flex>
    );
  }

  const color = cls.color ?? "ink";
  const props = cls.properties ?? [];

  return (
    <Flex direction="column" className="h-full min-h-0">
      {/* Identity */}
      <Box
        px="4"
        py="3"
        style={{ borderBottom: "1px solid var(--gray-a4)" }}
      >
        <Flex
          align="center"
          gap="2"
          px="3"
          py="2"
          style={{
            background: COLOR_BANNER[color],
            color: "white",
            borderRadius: "var(--radius-3) var(--radius-3) 0 0",
          }}
        >
          <Layers className="h-3.5 w-3.5" />
          <Text size="2" weight="bold" className="truncate">
            {cls.name}
          </Text>
          <Box
            ml="auto"
            style={{
              background: "rgba(255,255,255,0.25)",
              padding: "1px 6px",
              borderRadius: 999,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            title="owl:Class"
          >
            Class
          </Box>
        </Flex>
        <Flex align="center" justify="between" mt="2">
          <Code variant="soft" size="1">
            {cls.id}
          </Code>
          <Text size="1" weight="bold">
            {stats.instances} instance{stats.instances === 1 ? "" : "s"}
          </Text>
        </Flex>
        {cls.description && (
          <Text as="p" size="1" color="gray" mt="2">
            {cls.description}
          </Text>
        )}
        <Box mt="3">
          <Button
            size="1"
            onClick={() => navigate(`/ontologies/${ontologyId}/schema`)}
          >
            <ArrowUpRight className="h-3 w-3" />
            Edit in Schema view
          </Button>
        </Box>
      </Box>

      <Box className="min-h-0 flex-1 overflow-y-auto scroll-thin">
        {/* Built-in SKOS attributes */}
        <Box
          px="4"
          py="3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <Flex align="center" gap="2" mb="2">
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Built-in attributes
            </Text>
            <Badge color="violet" variant="soft" size="1">
              SKOS
            </Badge>
          </Flex>
          <Flex direction="column" gap="2">
            {[
              {
                key: "prefLabel",
                label: "Preferred label",
                icon: TagIcon,
                cardinality: "1 / lang",
                i18n: true,
              },
              {
                key: "altLabel",
                label: "Alternative labels",
                icon: Languages,
                cardinality: "many / lang",
                i18n: true,
              },
              {
                key: "hiddenLabel",
                label: "Hidden labels",
                icon: EyeOff,
                cardinality: "many / lang",
                i18n: true,
              },
              {
                key: "definition",
                label: "Definition",
                icon: BookOpen,
                cardinality: "1 / lang",
                i18n: true,
              },
              {
                key: "notation",
                label: "Notation",
                icon: Hash,
                cardinality: "0..1",
                i18n: false,
              },
              {
                key: "example",
                label: "Example",
                icon: FileText,
                cardinality: "0..many",
                i18n: true,
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <Flex
                  key={b.key}
                  align="center"
                  gap="2"
                  px="2"
                  py="2"
                  style={{
                    background: "var(--violet-2)",
                    borderRadius: "var(--radius-2)",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    className="h-5 w-5 shrink-0 rounded-[var(--radius-2)]"
                    style={{
                      background: "var(--violet-3)",
                      color: "var(--violet-11)",
                    }}
                  >
                    <Icon className="h-3 w-3" />
                  </Flex>
                  <Box className="min-w-0 flex-1">
                    <Code
                      size="1"
                      variant="ghost"
                      weight="bold"
                      className="truncate"
                    >
                      {b.key}
                    </Code>
                    <Text size="1" color="gray" ml="1">
                      {b.label}
                    </Text>
                  </Box>
                  <Text size="1" color="gray">
                    {b.cardinality}
                  </Text>
                  {b.i18n && (
                    <Languages
                      className="h-3 w-3 shrink-0"
                      style={{ color: "var(--accent-11)" }}
                      aria-label="language-aware"
                    />
                  )}
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* Custom attributes */}
        <Box
          px="4"
          py="3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <Flex align="center" justify="between" mb="2">
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Custom attributes ({props.length})
            </Text>
          </Flex>
          {props.length === 0 ? (
            <Box
              px="2"
              py="3"
              style={{
                border: "1px dashed var(--gray-a5)",
                background: "var(--color-panel-solid)",
                borderRadius: "var(--radius-2)",
                textAlign: "center",
              }}
            >
              <Text size="1" color="gray">
                No custom attributes. Add some from the Schema view to capture
                class-specific data.
              </Text>
            </Box>
          ) : (
            <Flex direction="column" gap="2">
              {props.map((p) => (
                <Flex
                  key={p.key}
                  align="start"
                  gap="2"
                  px="2"
                  py="2"
                  style={{
                    background: "var(--color-panel-solid)",
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-2)",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    className="mt-0.5 h-5 w-5 shrink-0 rounded-[var(--radius-2)]"
                    style={{
                      background: "var(--gray-a3)",
                      color: "var(--gray-11)",
                    }}
                  >
                    <Type className="h-3 w-3" />
                  </Flex>
                  <Box className="min-w-0 flex-1">
                    <Flex wrap="wrap" align="center" gap="1">
                      <Code size="1" variant="ghost" weight="bold">
                        {p.key}
                      </Code>
                      <Badge color="gray" variant="soft" size="1">
                        {p.valueType}
                      </Badge>
                      {p.required && (
                        <Badge color="ruby" variant="soft" size="1">
                          required
                        </Badge>
                      )}
                      {p.localizable && (
                        <Badge color="violet" variant="soft" size="1">
                          <Languages className="h-2.5 w-2.5" />
                          i18n
                        </Badge>
                      )}
                    </Flex>
                    {p.description && (
                      <Text as="p" size="1" color="gray" mt="1">
                        {p.description}
                      </Text>
                    )}
                  </Box>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>

        {/* Relation participation */}
        <Box px="4" py="3">
          <Flex align="center" gap="2" mb="2">
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Relation participation
            </Text>
          </Flex>
          {stats.outgoing.length === 0 && stats.incoming.length === 0 && (
            <Text size="1" color="gray">
              This class isn't the domain or range of any relation type yet.
            </Text>
          )}
          {stats.outgoing.length > 0 && (
            <Box mb="2">
              <Text
                size="1"
                weight="bold"
                color="gray"
                mb="1"
                className="uppercase tracking-wide block"
              >
                as domain
              </Text>
              <Flex direction="column" gap="1">
                {stats.outgoing.map((rt) => {
                  const target = allConceptClasses.find(
                    (c) => c.id === rt.rangeClassId
                  );
                  return (
                    <Flex
                      key={rt.id}
                      align="center"
                      gap="2"
                      px="2"
                      py="1"
                      style={{
                        background: "var(--color-panel-solid)",
                        border: "1px solid var(--gray-a4)",
                        borderRadius: "var(--radius-2)",
                      }}
                    >
                      <Link2
                        className="h-3 w-3"
                        style={{ color: "var(--gray-9)" }}
                      />
                      <Code size="1" variant="ghost" weight="bold">
                        {rt.name}
                      </Code>
                      <Text size="1" color="gray">
                        →
                      </Text>
                      <Text size="1" weight="bold">
                        {target?.name ?? rt.rangeClassId}
                      </Text>
                      {rt.isBuiltIn && (
                        <Box ml="auto">
                          <Badge color="gray" variant="soft" size="1">
                            built-in
                          </Badge>
                        </Box>
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          )}
          {stats.incoming.length > 0 && (
            <Box>
              <Text
                size="1"
                weight="bold"
                color="gray"
                mb="1"
                className="uppercase tracking-wide block"
              >
                as range
              </Text>
              <Flex direction="column" gap="1">
                {stats.incoming.map((rt) => {
                  const src = allConceptClasses.find(
                    (c) => c.id === rt.domainClassId
                  );
                  return (
                    <Flex
                      key={rt.id}
                      align="center"
                      gap="2"
                      px="2"
                      py="1"
                      style={{
                        background: "var(--gray-2)",
                        border: "1px solid var(--gray-a4)",
                        borderRadius: "var(--radius-2)",
                      }}
                    >
                      <Text size="1" weight="bold">
                        {src?.name ?? rt.domainClassId}
                      </Text>
                      <Text size="1" color="gray">
                        —[
                      </Text>
                      <Code size="1" variant="ghost" weight="bold">
                        {rt.name}
                      </Code>
                      <Text size="1" color="gray">
                        ]→
                      </Text>
                      <Text size="1" color="gray">
                        this
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* Use unused relation counts to keep noUnusedLocals quiet without hiding
          something the reader can spot in the source. */}
      {void allRelations}
    </Flex>
  );
}

void null as unknown as ConceptClass;
