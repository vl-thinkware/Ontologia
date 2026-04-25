import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Code,
  Flex,
  IconButton,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import {
  Play,
  Terminal,
  Copy,
  Check,
  Code2,
  Share2,
} from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import {
  ontologies,
  conceptClasses as allConceptClasses,
  relationTypes as allRelationTypes,
  conceptSchemes as allSchemes,
} from "../data/mock";

type Endpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  params: Array<{
    key: string;
    label: string;
    optional?: boolean;
    values?: string[];
  }>;
};

const ENDPOINTS: Endpoint[] = [
  {
    id: "list-concepts",
    method: "GET",
    path: "/ontologies/:id/concepts",
    description:
      "List every concept in an ontology. Supports language, scheme and tag filters.",
    params: [
      {
        key: "lang",
        label: "Language",
        optional: true,
        values: ["en", "fr", "de"],
      },
      { key: "scheme", label: "Scheme", optional: true },
      {
        key: "tag",
        label: "Tag",
        optional: true,
        values: ["v1.2", "v1.3", "latest"],
      },
      {
        key: "format",
        label: "Format",
        optional: true,
        values: ["json", "jsonld", "skos"],
      },
    ],
  },
  {
    id: "list-relations",
    method: "GET",
    path: "/ontologies/:id/relations",
    description: "All relations — with scheme, relationType and endpoint ids.",
    params: [
      { key: "scheme", label: "Scheme", optional: true },
      { key: "from", label: "From concept", optional: true },
      { key: "to", label: "To concept", optional: true },
    ],
  },
  {
    id: "schema",
    method: "GET",
    path: "/ontologies/:id/schema",
    description:
      "The T-Box — Classes + RelationTypes plus their domain / range.",
    params: [],
  },
  {
    id: "get-concept",
    method: "GET",
    path: "/ontologies/:id/concepts/:conceptId",
    description: "Look up one concept by id (or by slug if you prefer names).",
    params: [
      { key: "conceptId", label: "Concept id" },
      {
        key: "lang",
        label: "Language",
        optional: true,
        values: ["en", "fr", "de"],
      },
    ],
  },
  {
    id: "sparql",
    method: "POST",
    path: "/ontologies/:id/sparql",
    description: "Run a SPARQL query against the ontology (read-only).",
    params: [{ key: "query", label: "Query body" }],
  },
];

export default function PlaygroundModal() {
  const {
    playgroundTarget,
    closePlayground,
    concepts,
    relations,
    conceptClasses,
    relationTypes,
    toast,
  } = useApp();
  const [endpointId, setEndpointId] = useState<string>(ENDPOINTS[0].id);
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    lang: "en",
    format: "json",
  });
  const [copied, setCopied] = useState<string | null>(null);

  const ontology = useMemo(
    () =>
      ontologies.find((o) => o.id === playgroundTarget?.ontologyId) ??
      ontologies[0],
    [playgroundTarget]
  );

  const endpoint =
    ENDPOINTS.find((e) => e.id === endpointId) ?? ENDPOINTS[0];

  const resolvedUrl = useMemo(() => {
    const base = `https://api.ontologia.dev`;
    let path = endpoint.path.replace(":id", ontology.id);
    if (endpoint.path.includes(":conceptId")) {
      path = path.replace(
        ":conceptId",
        paramValues.conceptId || "c_model_camry"
      );
    }
    const qs = new URLSearchParams();
    endpoint.params.forEach((p) => {
      const v = paramValues[p.key];
      if (!v || p.key === "conceptId" || p.key === "query") return;
      qs.set(p.key, v);
    });
    const qsStr = qs.toString();
    return `${base}${path}${qsStr ? "?" + qsStr : ""}`;
  }, [endpoint, ontology, paramValues]);

  const responseBody = useMemo(() => {
    const scoped = (items: any[]) =>
      items.filter((x: any) => x.ontologyId === ontology.id);

    if (endpoint.id === "list-concepts") {
      const scopeMatch = scoped(concepts)
        .filter((c) =>
          paramValues.scheme ? c.schemeId === paramValues.scheme : true
        )
        .slice(0, 8)
        .map((c) => ({
          id: c.id,
          name: c.name,
          prefLabel:
            c.labels.prefLabel.find(
              (l: any) => l.lang === (paramValues.lang || "en")
            )?.value ?? c.name,
          definition:
            c.definitions.find(
              (l: any) => l.lang === (paramValues.lang || "en")
            )?.value ?? c.description,
          classId: c.classId,
          schemeId: c.schemeId,
          deprecated: c.deprecated ?? false,
        }));
      return JSON.stringify(
        {
          ontology: ontology.id,
          total: scoped(concepts).length,
          returned: scopeMatch.length,
          truncated: scoped(concepts).length > scopeMatch.length,
          data: scopeMatch,
        },
        null,
        2
      );
    }
    if (endpoint.id === "list-relations") {
      const scopedR = relations.filter((r) => {
        const from = concepts.find((c) => c.id === r.from);
        if (!from || from.ontologyId !== ontology.id) return false;
        if (paramValues.from && r.from !== paramValues.from) return false;
        if (paramValues.to && r.to !== paramValues.to) return false;
        if (paramValues.scheme && r.schemeId !== paramValues.scheme)
          return false;
        return true;
      });
      return JSON.stringify(
        {
          ontology: ontology.id,
          total: scopedR.length,
          data: scopedR.slice(0, 8).map((r) => ({
            id: r.id,
            from: r.from,
            to: r.to,
            relationTypeId: r.relationTypeId,
            label: r.label,
            schemeId: r.schemeId,
          })),
        },
        null,
        2
      );
    }
    if (endpoint.id === "schema") {
      return JSON.stringify(
        {
          ontology: ontology.id,
          mode: ontology.mode,
          classes: conceptClasses
            .filter((c) => c.ontologyId === ontology.id)
            .map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              isImplicit: c.isImplicit ?? false,
            })),
          relationTypes: relationTypes
            .filter((r) => r.ontologyId === ontology.id)
            .map((r) => ({
              id: r.id,
              name: r.name,
              domainClassId: r.domainClassId,
              rangeClassId: r.rangeClassId,
              isBuiltIn: r.isBuiltIn ?? false,
              isTransitive: r.isTransitive ?? false,
              isSymmetric: r.isSymmetric ?? false,
            })),
        },
        null,
        2
      );
    }
    if (endpoint.id === "get-concept") {
      const c =
        concepts.find(
          (x) => x.id === (paramValues.conceptId || "c_model_camry")
        ) ?? concepts[0];
      if (!c) return "{}";
      return JSON.stringify(
        {
          id: c.id,
          name: c.name,
          description: c.description,
          classId: c.classId,
          schemeId: c.schemeId,
          labels: c.labels,
          definitions: c.definitions,
          properties: c.properties,
          deprecated: c.deprecated ?? false,
          replacedBy: c.replacedBy,
          _links: {
            self: `/ontologies/${ontology.id}/concepts/${c.id}`,
            relations: `/ontologies/${ontology.id}/concepts/${c.id}/relations`,
          },
        },
        null,
        2
      );
    }
    return JSON.stringify(
      {
        status: "stubbed",
        note: "SPARQL execution is a preview-only stub in this mock.",
        query:
          paramValues.query ||
          "SELECT ?concept ?label WHERE { ?concept skos:prefLabel ?label } LIMIT 10",
      },
      null,
      2
    );
  }, [
    endpoint,
    ontology,
    paramValues,
    concepts,
    relations,
    conceptClasses,
    relationTypes,
  ]);

  function copy(text: string, label: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(label);
    toast({ kind: "success", title: `${label} copied` });
    window.setTimeout(() => setCopied(null), 1500);
  }

  const schemesForOntology = useMemo(
    () => allSchemes.filter((s) => s.ontologyId === ontology.id),
    [ontology]
  );
  const conceptsForOntology = useMemo(
    () => concepts.filter((c) => c.ontologyId === ontology.id),
    [concepts, ontology]
  );

  function optionListFor(key: string): string[] | null {
    if (key === "scheme") return schemesForOntology.map((s) => s.id);
    if (key === "from" || key === "to") {
      return conceptsForOntology.map((c) => c.id);
    }
    return null;
  }

  const curl = `curl -X ${endpoint.method} "${resolvedUrl}" -H "Authorization: Bearer $ONTOLOGIA_TOKEN"`;
  const fetchSnippet = `await fetch("${resolvedUrl}", {
  method: "${endpoint.method}",
  headers: { Authorization: ${"`Bearer ${ONTOLOGIA_TOKEN}`"} },
}).then(r => r.json())`;

  return (
    <Modal
      open={!!playgroundTarget}
      onClose={closePlayground}
      title="API playground"
      subtitle={`Try the ${ontology.name} API with live data — responses are rendered from the in-memory store.`}
      width="max-w-5xl"
      footer={
        <>
          <Button variant="ghost" color="gray" onClick={closePlayground}>
            Close
          </Button>
          <Button
            variant="surface"
            color="gray"
            onClick={() => copy(curl, "cURL")}
          >
            {copied === "cURL" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Terminal className="h-3.5 w-3.5" />
            )}
            Copy cURL
          </Button>
          <Button
            variant="surface"
            color="gray"
            onClick={() => copy(fetchSnippet, "fetch()")}
          >
            {copied === "fetch()" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Code2 className="h-3.5 w-3.5" />
            )}
            Copy fetch()
          </Button>
          <Button onClick={() => copy(responseBody, "Response")}>
            {copied === "Response" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            Copy response
          </Button>
        </>
      }
    >
      <Box className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        {/* Endpoint list */}
        <Flex direction="column" gap="2" asChild>
          <aside>
            <Box px="1">
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wider"
              >
                Endpoints
              </Text>
            </Box>
            {ENDPOINTS.map((e) => {
              const active = e.id === endpointId;
              return (
                <button
                  key={e.id}
                  onClick={() => setEndpointId(e.id)}
                  className="w-full text-left"
                  style={{
                    border: active
                      ? "2px solid var(--accent-9)"
                      : "1px solid var(--gray-a4)",
                    background: active
                      ? "var(--accent-2)"
                      : "var(--color-panel-solid)",
                    borderRadius: "var(--radius-3)",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  <Flex align="center" gap="2">
                    <Badge
                      color={e.method === "GET" ? "green" : "amber"}
                      variant="soft"
                      size="1"
                      style={{ fontFamily: "var(--code-font-family)" }}
                    >
                      {e.method}
                    </Badge>
                    <Text
                      size="1"
                      weight="bold"
                      className="truncate"
                      style={{ fontFamily: "var(--code-font-family)" }}
                    >
                      {e.path}
                    </Text>
                  </Flex>
                  <Text as="p" size="1" color="gray" mt="1">
                    {e.description}
                  </Text>
                </button>
              );
            })}
          </aside>
        </Flex>

        {/* Request + response */}
        <Flex direction="column" gap="3" className="min-w-0">
          {/* Request URL + params */}
          <Box
            p="3"
            style={{
              background: "var(--color-panel-solid)",
              border: "1px solid var(--gray-a4)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Flex align="center" gap="2">
              <Badge
                color={endpoint.method === "GET" ? "green" : "amber"}
                variant="soft"
                size="1"
                style={{ fontFamily: "var(--code-font-family)" }}
              >
                {endpoint.method}
              </Badge>
              <Box className="flex-1 min-w-0">
                <Code
                  variant="soft"
                  size="1"
                  className="block truncate"
                  style={{ width: "100%" }}
                >
                  {resolvedUrl}
                </Code>
              </Box>
              <IconButton
                variant="ghost"
                color="gray"
                size="1"
                onClick={() => copy(resolvedUrl, "URL")}
                title="Copy URL"
              >
                {copied === "URL" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </IconButton>
            </Flex>

            {endpoint.params.length > 0 && (
              <Box mt="3" className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {endpoint.params.map((p) => {
                  const dynamic = optionListFor(p.key);
                  const values = p.values ?? dynamic ?? null;
                  return (
                    <Box key={p.key}>
                      <Text
                        as="label"
                        size="1"
                        weight="bold"
                        color="gray"
                        className="uppercase tracking-wide block"
                      >
                        {p.label}
                        {p.optional && (
                          <Text size="1" color="gray" ml="1">
                            · optional
                          </Text>
                        )}
                      </Text>
                      <Box mt="1">
                        {values ? (
                          <Select.Root
                            value={paramValues[p.key] ?? ""}
                            onValueChange={(v) =>
                              setParamValues((prev) => ({
                                ...prev,
                                [p.key]: v,
                              }))
                            }
                            size="1"
                          >
                            <Select.Trigger
                              className="w-full"
                              placeholder={
                                p.optional ? "— not set —" : "select…"
                              }
                            />
                            <Select.Content>
                              {values.map((v) => (
                                <Select.Item key={v} value={v}>
                                  {v}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        ) : p.key === "query" ? (
                          <TextArea
                            value={paramValues[p.key] ?? ""}
                            onChange={(e) =>
                              setParamValues((prev) => ({
                                ...prev,
                                [p.key]: e.target.value,
                              }))
                            }
                            placeholder="SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10"
                            size="1"
                            style={{
                              minHeight: 60,
                              fontFamily: "var(--code-font-family)",
                            }}
                          />
                        ) : (
                          <TextField.Root
                            value={paramValues[p.key] ?? ""}
                            onChange={(e) =>
                              setParamValues((prev) => ({
                                ...prev,
                                [p.key]: e.target.value,
                              }))
                            }
                            placeholder={
                              p.key === "conceptId" ? "c_model_camry" : ""
                            }
                            size="1"
                            style={{
                              fontFamily: "var(--code-font-family)",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Response */}
          <Flex
            direction="column"
            className="min-h-0"
            style={{
              background: "rgba(2,6,23,0.95)",
              border: "1px solid var(--gray-a4)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Flex
              align="center"
              justify="between"
              px="3"
              py="2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}
            >
              <Flex
                align="center"
                gap="2"
                style={{ color: "var(--green-5)" }}
              >
                <Play className="h-3 w-3" />
                <Text
                  size="1"
                  weight="bold"
                  style={{ color: "var(--green-5)" }}
                >
                  200 OK · application/json
                </Text>
              </Flex>
              <Text
                size="1"
                style={{
                  fontFamily: "var(--code-font-family)",
                  color: "var(--gray-3)",
                }}
              >
                {responseBody.length.toLocaleString()} chars ·{" "}
                {responseBody.split("\n").length} lines
              </Text>
            </Flex>
            <pre
              style={{
                maxHeight: 320,
                overflow: "auto",
                padding: "12px 16px",
                fontFamily: "var(--code-font-family)",
                fontSize: 11.5,
                lineHeight: 1.6,
                color: "var(--green-3)",
                margin: 0,
              }}
            >
              {responseBody}
            </pre>
          </Flex>

          <Box
            px="3"
            py="2"
            style={{
              background: "var(--gray-2)",
              border: "1px solid var(--gray-a4)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Text size="1" color="gray">
              {
                allConceptClasses.filter((c) => c.ontologyId === ontology.id)
                  .length
              }{" "}
              classes ·{" "}
              {
                allRelationTypes.filter((r) => r.ontologyId === ontology.id)
                  .length
              }{" "}
              relation types · data refreshed from the live store on every
              keystroke.
            </Text>
          </Box>
        </Flex>
      </Box>
    </Modal>
  );
}
