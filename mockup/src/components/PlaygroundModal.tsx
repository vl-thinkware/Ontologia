import { useMemo, useState } from "react";
import clsx from "clsx";
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

// Endpoint shapes the API playground can simulate. Kept small on purpose —
// the real Ontologia API has more surface, but this is enough for a demo
// that covers the distribution story (pull concepts, pull schema, pull
// tagged snapshot, SPARQL passthrough).
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
      { key: "lang", label: "Language", optional: true, values: ["en", "fr", "de"] },
      { key: "scheme", label: "Scheme", optional: true },
      { key: "tag", label: "Tag", optional: true, values: ["v1.2", "v1.3", "latest"] },
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
    description: "The T-Box — Classes + RelationTypes plus their domain / range.",
    params: [],
  },
  {
    id: "get-concept",
    method: "GET",
    path: "/ontologies/:id/concepts/:conceptId",
    description: "Look up one concept by id (or by slug if you prefer names).",
    params: [
      { key: "conceptId", label: "Concept id" },
      { key: "lang", label: "Language", optional: true, values: ["en", "fr", "de"] },
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

  // Interpolate :id, :conceptId etc. and stitch the query string.
  const resolvedUrl = useMemo(() => {
    const base = `https://api.ontologia.dev`;
    let path = endpoint.path.replace(":id", ontology.id);
    if (endpoint.path.includes(":conceptId")) {
      path = path.replace(":conceptId", paramValues.conceptId || "c_model_camry");
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

  // Simulated JSON response — synthesised from the live store so the user
  // sees the same data they edit on the canvas.
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
          prefLabel: c.labels.prefLabel.find(
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
        if (paramValues.scheme && r.schemeId !== paramValues.scheme) return false;
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
        concepts.find((x) => x.id === (paramValues.conceptId || "c_model_camry")) ??
        concepts[0];
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
    // sparql
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

  // Useful options for the Scheme / From / To dropdowns.
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
          <button
            onClick={closePlayground}
            className="btn-ghost py-1.5 px-3"
          >
            Close
          </button>
          <button
            onClick={() => copy(curl, "cURL")}
            className="btn-secondary py-1.5 px-3"
          >
            {copied === "cURL" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Terminal className="h-3.5 w-3.5" />
            )}
            Copy cURL
          </button>
          <button
            onClick={() => copy(fetchSnippet, "fetch()")}
            className="btn-secondary py-1.5 px-3"
          >
            {copied === "fetch()" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Code2 className="h-3.5 w-3.5" />
            )}
            Copy fetch()
          </button>
          <button
            onClick={() => copy(responseBody, "Response")}
            className="btn-primary py-1.5 px-3"
          >
            {copied === "Response" ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Share2 className="h-3.5 w-3.5" />
            )}
            Copy response
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        {/* Endpoint list */}
        <aside className="space-y-1">
          <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Endpoints
          </div>
          {ENDPOINTS.map((e) => {
            const active = e.id === endpointId;
            return (
              <button
                key={e.id}
                onClick={() => setEndpointId(e.id)}
                className={clsx(
                  "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                  active
                    ? "border-brand-500 bg-brand-50"
                    : "border-ink-200 bg-white hover:bg-ink-50"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={clsx(
                      "chip font-mono text-[10px]",
                      e.method === "GET"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {e.method}
                  </span>
                  <span className="truncate font-mono text-[11.5px] font-semibold text-ink-900">
                    {e.path}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-ink-500">
                  {e.description}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Request + response */}
        <div className="flex min-w-0 flex-col gap-3">
          {/* Request URL + params */}
          <div className="rounded-lg border border-ink-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "chip font-mono text-[10px]",
                  endpoint.method === "GET"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {endpoint.method}
              </span>
              <code className="flex-1 truncate rounded-md bg-ink-50 px-2 py-1 text-[11.5px] text-ink-800">
                {resolvedUrl}
              </code>
              <button
                onClick={() => copy(resolvedUrl, "URL")}
                className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                title="Copy URL"
              >
                {copied === "URL" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {endpoint.params.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {endpoint.params.map((p) => {
                  const dynamic = optionListFor(p.key);
                  const values = p.values ?? dynamic ?? null;
                  return (
                    <label key={p.key} className="block">
                      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-500">
                        {p.label}
                        {p.optional && (
                          <span className="ml-1 text-ink-400">· optional</span>
                        )}
                      </span>
                      {values ? (
                        <select
                          value={paramValues[p.key] ?? ""}
                          onChange={(e) =>
                            setParamValues((prev) => ({
                              ...prev,
                              [p.key]: e.target.value,
                            }))
                          }
                          className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        >
                          <option value="">
                            {p.optional ? "— not set —" : "select…"}
                          </option>
                          {values.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : p.key === "query" ? (
                        <textarea
                          value={paramValues[p.key] ?? ""}
                          onChange={(e) =>
                            setParamValues((prev) => ({
                              ...prev,
                              [p.key]: e.target.value,
                            }))
                          }
                          placeholder="SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10"
                          className="mt-0.5 min-h-[60px] w-full resize-y rounded-md border border-ink-200 bg-white px-2 py-1 text-[12px] font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        />
                      ) : (
                        <input
                          value={paramValues[p.key] ?? ""}
                          onChange={(e) =>
                            setParamValues((prev) => ({
                              ...prev,
                              [p.key]: e.target.value,
                            }))
                          }
                          placeholder={p.key === "conceptId" ? "c_model_camry" : ""}
                          className="mt-0.5 w-full rounded-md border border-ink-200 bg-white px-2 py-1 text-[12px] font-mono focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Response */}
          <div className="flex min-h-0 flex-col rounded-lg border border-ink-200 bg-ink-950/95">
            <div className="flex items-center justify-between border-b border-ink-800/40 px-3 py-1.5">
              <div className="flex items-center gap-2 text-[11.5px] font-semibold text-emerald-300">
                <Play className="h-3 w-3" />
                200 OK · application/json
              </div>
              <div className="text-[10.5px] font-mono text-ink-300">
                {responseBody.length.toLocaleString()} chars ·{" "}
                {responseBody.split("\n").length} lines
              </div>
            </div>
            <pre className="max-h-[320px] overflow-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed text-emerald-100">
              {responseBody}
            </pre>
          </div>

          <div className="rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-[11px] text-ink-600">
            {allConceptClasses.filter((c) => c.ontologyId === ontology.id).length}{" "}
            classes · {allRelationTypes.filter((r) => r.ontologyId === ontology.id).length}{" "}
            relation types · data refreshed from the live store on every keystroke.
          </div>
        </div>
      </div>
    </Modal>
  );
}
