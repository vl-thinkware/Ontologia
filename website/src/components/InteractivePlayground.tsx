import { useMemo, useState } from "react";
import { Check, Copy, Play, Terminal, Code2 } from "lucide-react";

// -----------------------------------------------------------------------------
// Static endpoint catalogue. All responses are pre-canned per param combination.
// This is a *demo* of the in-app playground — no real network calls.
// -----------------------------------------------------------------------------

type ParamSpec = {
  key: string;
  label: string;
  values: { value: string; label: string }[];
  /** Default index into values[]. */
  defaultIndex?: number;
};

type Endpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  params: ParamSpec[];
  /** Compute response from selected param values. */
  respond: (selected: Record<string, string>) => unknown;
};

const ENDPOINTS: Endpoint[] = [
  {
    id: "list-concepts",
    method: "GET",
    path: "/v1/ontologies/cars/concepts",
    description: "List concepts in the Cars ontology, scoped by scheme + tag + language.",
    params: [
      {
        key: "tag",
        label: "Tag",
        defaultIndex: 1,
        values: [
          { value: "latest", label: "latest" },
          { value: "v1.3", label: "v1.3" },
          { value: "v1.2", label: "v1.2" },
        ],
      },
      {
        key: "lang",
        label: "Language",
        values: [
          { value: "en", label: "en" },
          { value: "fr", label: "fr" },
          { value: "ja", label: "ja" },
        ],
      },
      {
        key: "format",
        label: "Format",
        values: [
          { value: "json", label: "json" },
          { value: "jsonld", label: "jsonld" },
          { value: "skos", label: "skos" },
          { value: "csv", label: "csv" },
        ],
      },
    ],
    respond: ({ tag, lang, format }) => {
      const labels: Record<string, { camry: string; corolla: string }> = {
        en: { camry: "Toyota Camry", corolla: "Toyota Corolla" },
        fr: { camry: "Toyota Camry", corolla: "Toyota Corolla" },
        ja: { camry: "トヨタ・カムリ", corolla: "トヨタ・カローラ" },
      };
      const baseConcepts = [
        {
          id: "c_camry",
          prefLabel: labels[lang].camry,
          manufacturer: "c_toyota",
          tag,
        },
        {
          id: "c_corolla",
          prefLabel: labels[lang].corolla,
          manufacturer: "c_toyota",
          tag,
        },
      ];

      if (format === "jsonld") {
        return {
          "@context": "https://semlify.com/ctx/v1",
          ontology: "cars",
          tag,
          lang,
          "@graph": baseConcepts.map((c) => ({
            "@id": c.id,
            "@type": "skos:Concept",
            "skos:prefLabel": { "@value": c.prefLabel, "@language": lang },
          })),
        };
      }
      if (format === "skos") {
        return (
          `@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n` +
          baseConcepts
            .map(
              (c) =>
                `:${c.id} a skos:Concept ;\n  skos:prefLabel "${c.prefLabel}"@${lang} .`
            )
            .join("\n")
        );
      }
      if (format === "csv") {
        return (
          `id,prefLabel_${lang},manufacturer\n` +
          baseConcepts.map((c) => `${c.id},${c.prefLabel},${c.manufacturer}`).join("\n")
        );
      }
      return {
        ontology: "cars",
        tag,
        lang,
        total: 397,
        returned: baseConcepts.length,
        truncated: true,
        data: baseConcepts,
      };
    },
  },
  {
    id: "get-concept",
    method: "GET",
    path: "/v1/ontologies/cars/concepts/c_camry",
    description: "Fetch a single concept with full SKOS labels and properties.",
    params: [
      {
        key: "lang",
        label: "Language",
        values: [
          { value: "en", label: "en" },
          { value: "fr", label: "fr" },
          { value: "ja", label: "ja" },
        ],
      },
      {
        key: "tag",
        label: "Tag",
        defaultIndex: 1,
        values: [
          { value: "latest", label: "latest" },
          { value: "v1.3", label: "v1.3" },
        ],
      },
    ],
    respond: ({ lang, tag }) => {
      const labels: Record<string, { pref: string; def: string }> = {
        en: {
          pref: "Toyota Camry",
          def: "A mid-size sedan manufactured by Toyota since 1982.",
        },
        fr: {
          pref: "Toyota Camry",
          def: "Berline intermédiaire fabriquée par Toyota depuis 1982.",
        },
        ja: { pref: "トヨタ・カムリ", def: "1982年からトヨタが製造する中型セダン。" },
      };
      return {
        id: "c_camry",
        tag,
        skos: {
          prefLabel: { lang, value: labels[lang].pref },
          definition: { lang, value: labels[lang].def },
        },
        properties: { msrp: 28400, year: 2026 },
        relations: { manufacturer: "c_toyota", bodyStyle: "c_sedan" },
      };
    },
  },
  {
    id: "schema",
    method: "GET",
    path: "/v1/ontologies/cars/schema",
    description: "The T-Box — every class with attributes plus relation types with domain / range.",
    params: [
      {
        key: "format",
        label: "Format",
        values: [
          { value: "json", label: "json" },
          { value: "jsonld", label: "jsonld" },
          { value: "owl", label: "owl" },
        ],
      },
    ],
    respond: ({ format }) => {
      if (format === "owl") {
        return (
          `<?xml version="1.0"?>\n` +
          `<rdf:RDF xmlns:owl="http://www.w3.org/2002/07/owl#"\n` +
          `         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">\n` +
          `  <owl:Class rdf:about="#Manufacturer"/>\n` +
          `  <owl:Class rdf:about="#Model"/>\n` +
          `  <owl:ObjectProperty rdf:about="#manufactures">\n` +
          `    <rdfs:domain rdf:resource="#Manufacturer"/>\n` +
          `    <rdfs:range rdf:resource="#Model"/>\n` +
          `  </owl:ObjectProperty>\n` +
          `</rdf:RDF>`
        );
      }
      return {
        ontology: "cars",
        format,
        classes: [
          { id: "cc_manufacturer", name: "Manufacturer", attributes: 4 },
          { id: "cc_model", name: "Model", attributes: 5 },
          { id: "cc_engine", name: "Engine", attributes: 5 },
          { id: "cc_bodystyle", name: "BodyStyle", attributes: 3 },
        ],
        relationTypes: [
          { id: "rt_manufactures", name: "manufactures", domain: "Manufacturer", range: "Model" },
          { id: "rt_powered_by", name: "poweredBy", domain: "Model", range: "Engine" },
        ],
      };
    },
  },
];

const BASE_URL = "https://api.semlify.com";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function InteractivePlayground() {
  const [endpointId, setEndpointId] = useState(ENDPOINTS[0].id);
  const endpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === endpointId) ?? ENDPOINTS[0],
    [endpointId]
  );

  // Store selected value per (endpointId, paramKey) so switching endpoints
  // remembers what the user picked previously.
  const [selections, setSelections] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const initial: Record<string, Record<string, string>> = {};
    ENDPOINTS.forEach((e) => {
      initial[e.id] = {};
      e.params.forEach((p) => {
        initial[e.id][p.key] = p.values[p.defaultIndex ?? 0].value;
      });
    });
    return initial;
  });

  const selected = selections[endpoint.id];

  function setParam(key: string, value: string) {
    setSelections((prev) => ({
      ...prev,
      [endpoint.id]: { ...prev[endpoint.id], [key]: value },
    }));
  }

  // Build URL with query string from current selections.
  const url = useMemo(() => {
    const qs = new URLSearchParams(selected).toString();
    return `${BASE_URL}${endpoint.path}${qs ? "?" + qs : ""}`;
  }, [endpoint, selected]);

  // Compute the response body.
  const response = useMemo(() => endpoint.respond(selected), [endpoint, selected]);
  const responseText = useMemo(
    () =>
      typeof response === "string" ? response : JSON.stringify(response, null, 2),
    [response]
  );

  // Copy state per target.
  const [copied, setCopied] = useState<string | null>(null);
  function copy(label: string, text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  }

  const curl = `curl -X ${endpoint.method} "${url}" \\\n  -H "Authorization: Bearer $ONTOLOGIA_TOKEN"`;

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-5)]"
      style={{
        background: "var(--color-panel-solid)",
        border: "1px solid var(--gray-a5)",
        boxShadow: "var(--shadow-2)",
      }}
    >
        {/* Endpoint tabs */}
        <div
          className="flex flex-wrap items-center gap-1 px-3 py-2"
          style={{
            background: "var(--gray-2)",
            borderBottom: "1px solid var(--gray-a4)",
          }}
        >
          {ENDPOINTS.map((e) => {
            const active = e.id === endpoint.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => setEndpointId(e.id)}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors"
                style={{
                  background: active ? "var(--color-panel-solid)" : "transparent",
                  color: active ? "var(--gray-12)" : "var(--gray-11)",
                  boxShadow: active ? "var(--shadow-1)" : "none",
                  border: active
                    ? "1px solid var(--gray-a5)"
                    : "1px solid transparent",
                }}
              >
                <span
                  className="rounded-sm px-1 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    background:
                      e.method === "GET" ? "var(--green-3)" : "var(--amber-3)",
                    color:
                      e.method === "GET"
                        ? "var(--green-11)"
                        : "var(--amber-11)",
                  }}
                >
                  {e.method}
                </span>
                <span style={{ fontFamily: "var(--code-font-family)" }}>
                  {e.path.split("/").slice(-1)[0] || "/"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--gray-11)" }}>
            {endpoint.description}
          </p>
        </div>

        {/* Params row */}
        <div
          className="flex flex-wrap items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          {endpoint.params.map((p) => (
            <div
              key={p.key}
              className="inline-flex items-center gap-1.5 rounded-md py-1 pl-2 pr-1"
              style={{
                background: "var(--gray-2)",
                border: "1px solid var(--gray-a4)",
              }}
            >
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--gray-11)" }}
              >
                {p.label}
              </span>
              <div className="flex items-center gap-0.5">
                {p.values.map((v) => {
                  const active = selected[p.key] === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => setParam(p.key, v.value)}
                      className="rounded-[4px] px-2 py-0.5 text-[11px] font-medium transition-colors"
                      style={{
                        background: active
                          ? "var(--accent-9)"
                          : "transparent",
                        color: active
                          ? "var(--accent-contrast)"
                          : "var(--gray-11)",
                        fontFamily: "var(--code-font-family)",
                      }}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* URL bar */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <span
            className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold"
            style={{
              background:
                endpoint.method === "GET"
                  ? "var(--green-3)"
                  : "var(--amber-3)",
              color:
                endpoint.method === "GET"
                  ? "var(--green-11)"
                  : "var(--amber-11)",
            }}
          >
            {endpoint.method}
          </span>
          <code
            className="flex-1 truncate rounded-md px-2 py-1 text-[12px]"
            style={{
              background: "var(--gray-2)",
              color: "var(--gray-12)",
              fontFamily: "var(--code-font-family)",
            }}
          >
            {url}
          </code>
          <button
            type="button"
            onClick={() => copy("URL", url)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--gray-a3)]"
            style={{ color: "var(--gray-11)" }}
            title="Copy URL"
            aria-label="Copy URL"
          >
            {copied === "URL" ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Response */}
        <div
          style={{
            background: "rgb(2,6,23)",
            borderBottom: "1px solid var(--gray-a4)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="inline-flex items-center gap-2 text-[11.5px] font-medium"
              style={{ color: "rgb(74,222,128)" }}
            >
              <Play size={11} aria-hidden />
              200 OK · {endpoint.params.find((p) => p.key === "format")
                ? selected.format === "skos"
                  ? "text/turtle"
                  : selected.format === "owl"
                  ? "application/rdf+xml"
                  : selected.format === "csv"
                  ? "text/csv"
                  : selected.format === "jsonld"
                  ? "application/ld+json"
                  : "application/json"
                : "application/json"}
            </div>
            <div
              className="text-[10.5px]"
              style={{
                color: "rgb(148,163,184)",
                fontFamily: "var(--code-font-family)",
              }}
            >
              {responseText.split("\n").length} lines · {responseText.length}{" "}
              chars
            </div>
          </div>
          <pre
            style={{
              maxHeight: 320,
              overflow: "auto",
              padding: "12px 16px",
              fontFamily: "var(--code-font-family)",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "rgb(226,232,240)",
              margin: 0,
            }}
          >
            <code>{responseText}</code>
          </pre>
        </div>

        {/* Footer actions */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
          style={{ background: "var(--gray-2)" }}
        >
          <p
            className="text-[11.5px]"
            style={{ color: "var(--gray-10)" }}
          >
            Response computed live from your selections — no real network call.
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => copy("cURL", curl)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                background: "var(--color-panel-solid)",
                border: "1px solid var(--gray-a5)",
                color: "var(--gray-12)",
              }}
            >
              {copied === "cURL" ? (
                <Check size={12} aria-hidden />
              ) : (
                <Terminal size={12} aria-hidden />
              )}
              cURL
            </button>
            <button
              type="button"
              onClick={() => copy("Response", responseText)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors"
              style={{
                background: "var(--color-panel-solid)",
                border: "1px solid var(--gray-a5)",
                color: "var(--gray-12)",
              }}
            >
              {copied === "Response" ? (
                <Check size={12} aria-hidden />
              ) : (
                <Code2 size={12} aria-hidden />
              )}
              Response
            </button>
          </div>
        </div>
      </div>
  );
}
