import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$ProductPageNav } from '../../chunks/ProductPageNav_CFwaH2pY.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$ApiPlaygroundIllustration } from '../../chunks/ApiPlaygroundIllustration_BVCoAUtE.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useMemo } from 'react';
import { Check, Copy, Play, Terminal, Code2 } from 'lucide-react';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const ENDPOINTS = [
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
          { value: "v1.2", label: "v1.2" }
        ]
      },
      {
        key: "lang",
        label: "Language",
        values: [
          { value: "en", label: "en" },
          { value: "fr", label: "fr" },
          { value: "ja", label: "ja" }
        ]
      },
      {
        key: "format",
        label: "Format",
        values: [
          { value: "json", label: "json" },
          { value: "jsonld", label: "jsonld" },
          { value: "skos", label: "skos" },
          { value: "csv", label: "csv" }
        ]
      }
    ],
    respond: ({ tag, lang, format }) => {
      const labels = {
        en: { camry: "Toyota Camry", corolla: "Toyota Corolla" },
        fr: { camry: "Toyota Camry", corolla: "Toyota Corolla" },
        ja: { camry: "トヨタ・カムリ", corolla: "トヨタ・カローラ" }
      };
      const baseConcepts = [
        {
          id: "c_camry",
          prefLabel: labels[lang].camry,
          manufacturer: "c_toyota",
          tag
        },
        {
          id: "c_corolla",
          prefLabel: labels[lang].corolla,
          manufacturer: "c_toyota",
          tag
        }
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
            "skos:prefLabel": { "@value": c.prefLabel, "@language": lang }
          }))
        };
      }
      if (format === "skos") {
        return `@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
` + baseConcepts.map(
          (c) => `:${c.id} a skos:Concept ;
  skos:prefLabel "${c.prefLabel}"@${lang} .`
        ).join("\n");
      }
      if (format === "csv") {
        return `id,prefLabel_${lang},manufacturer
` + baseConcepts.map((c) => `${c.id},${c.prefLabel},${c.manufacturer}`).join("\n");
      }
      return {
        ontology: "cars",
        tag,
        lang,
        total: 397,
        returned: baseConcepts.length,
        truncated: true,
        data: baseConcepts
      };
    }
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
          { value: "ja", label: "ja" }
        ]
      },
      {
        key: "tag",
        label: "Tag",
        defaultIndex: 1,
        values: [
          { value: "latest", label: "latest" },
          { value: "v1.3", label: "v1.3" }
        ]
      }
    ],
    respond: ({ lang, tag }) => {
      const labels = {
        en: {
          pref: "Toyota Camry",
          def: "A mid-size sedan manufactured by Toyota since 1982."
        },
        fr: {
          pref: "Toyota Camry",
          def: "Berline intermédiaire fabriquée par Toyota depuis 1982."
        },
        ja: { pref: "トヨタ・カムリ", def: "1982年からトヨタが製造する中型セダン。" }
      };
      return {
        id: "c_camry",
        tag,
        skos: {
          prefLabel: { lang, value: labels[lang].pref },
          definition: { lang, value: labels[lang].def }
        },
        properties: { msrp: 28400, year: 2026 },
        relations: { manufacturer: "c_toyota", bodyStyle: "c_sedan" }
      };
    }
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
          { value: "owl", label: "owl" }
        ]
      }
    ],
    respond: ({ format }) => {
      if (format === "owl") {
        return `<?xml version="1.0"?>
<rdf:RDF xmlns:owl="http://www.w3.org/2002/07/owl#"
         xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">
  <owl:Class rdf:about="#Manufacturer"/>
  <owl:Class rdf:about="#Model"/>
  <owl:ObjectProperty rdf:about="#manufactures">
    <rdfs:domain rdf:resource="#Manufacturer"/>
    <rdfs:range rdf:resource="#Model"/>
  </owl:ObjectProperty>
</rdf:RDF>`;
      }
      return {
        ontology: "cars",
        format,
        classes: [
          { id: "cc_manufacturer", name: "Manufacturer", attributes: 4 },
          { id: "cc_model", name: "Model", attributes: 5 },
          { id: "cc_engine", name: "Engine", attributes: 5 },
          { id: "cc_bodystyle", name: "BodyStyle", attributes: 3 }
        ],
        relationTypes: [
          { id: "rt_manufactures", name: "manufactures", domain: "Manufacturer", range: "Model" },
          { id: "rt_powered_by", name: "poweredBy", domain: "Model", range: "Engine" }
        ]
      };
    }
  }
];
const BASE_URL = "https://api.semlify.com";
function InteractivePlayground() {
  const [endpointId, setEndpointId] = useState(ENDPOINTS[0].id);
  const endpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === endpointId) ?? ENDPOINTS[0],
    [endpointId]
  );
  const [selections, setSelections] = useState(() => {
    const initial = {};
    ENDPOINTS.forEach((e) => {
      initial[e.id] = {};
      e.params.forEach((p) => {
        initial[e.id][p.key] = p.values[p.defaultIndex ?? 0].value;
      });
    });
    return initial;
  });
  const selected = selections[endpoint.id];
  function setParam(key, value) {
    setSelections((prev) => ({
      ...prev,
      [endpoint.id]: { ...prev[endpoint.id], [key]: value }
    }));
  }
  const url = useMemo(() => {
    const qs = new URLSearchParams(selected).toString();
    return `${BASE_URL}${endpoint.path}${qs ? "?" + qs : ""}`;
  }, [endpoint, selected]);
  const response = useMemo(() => endpoint.respond(selected), [endpoint, selected]);
  const responseText = useMemo(
    () => typeof response === "string" ? response : JSON.stringify(response, null, 2),
    [response]
  );
  const [copied, setCopied] = useState(null);
  function copy(label, text) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
      });
    }
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  }
  const curl = `curl -X ${endpoint.method} "${url}" \\
  -H "Authorization: Bearer $ONTOLOGIA_TOKEN"`;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "overflow-hidden rounded-[var(--radius-5)]",
      style: {
        background: "var(--color-panel-solid)",
        border: "1px solid var(--gray-a5)",
        boxShadow: "var(--shadow-2)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex flex-wrap items-center gap-1 px-3 py-2",
            style: {
              background: "var(--gray-2)",
              borderBottom: "1px solid var(--gray-a4)"
            },
            children: ENDPOINTS.map((e) => {
              const active = e.id === endpoint.id;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setEndpointId(e.id),
                  className: "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                  style: {
                    background: active ? "var(--color-panel-solid)" : "transparent",
                    color: active ? "var(--gray-12)" : "var(--gray-11)",
                    boxShadow: active ? "var(--shadow-1)" : "none",
                    border: active ? "1px solid var(--gray-a5)" : "1px solid transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "rounded-sm px-1 py-0.5 font-mono text-[10px] font-bold",
                        style: {
                          background: e.method === "GET" ? "var(--green-3)" : "var(--amber-3)",
                          color: e.method === "GET" ? "var(--green-11)" : "var(--amber-11)"
                        },
                        children: e.method
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { style: { fontFamily: "var(--code-font-family)" }, children: e.path.split("/").slice(-1)[0] || "/" })
                  ]
                },
                e.id
              );
            })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "px-5 py-3",
            style: { borderBottom: "1px solid var(--gray-a4)" },
            children: /* @__PURE__ */ jsx("p", { className: "text-[13px]", style: { color: "var(--gray-11)" }, children: endpoint.description })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex flex-wrap items-center gap-2 px-5 py-3",
            style: { borderBottom: "1px solid var(--gray-a4)" },
            children: endpoint.params.map((p) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "inline-flex items-center gap-1.5 rounded-md py-1 pl-2 pr-1",
                style: {
                  background: "var(--gray-2)",
                  border: "1px solid var(--gray-a4)"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-[11px] font-medium",
                      style: { color: "var(--gray-11)" },
                      children: p.label
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-0.5", children: p.values.map((v) => {
                    const active = selected[p.key] === v.value;
                    return /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setParam(p.key, v.value),
                        className: "rounded-[4px] px-2 py-0.5 text-[11px] font-medium transition-colors",
                        style: {
                          background: active ? "var(--accent-9)" : "transparent",
                          color: active ? "var(--accent-contrast)" : "var(--gray-11)",
                          fontFamily: "var(--code-font-family)"
                        },
                        children: v.label
                      },
                      v.value
                    );
                  }) })
                ]
              },
              p.key
            ))
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-5 py-3",
            style: { borderBottom: "1px solid var(--gray-a4)" },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold",
                  style: {
                    background: endpoint.method === "GET" ? "var(--green-3)" : "var(--amber-3)",
                    color: endpoint.method === "GET" ? "var(--green-11)" : "var(--amber-11)"
                  },
                  children: endpoint.method
                }
              ),
              /* @__PURE__ */ jsx(
                "code",
                {
                  className: "flex-1 truncate rounded-md px-2 py-1 text-[12px]",
                  style: {
                    background: "var(--gray-2)",
                    color: "var(--gray-12)",
                    fontFamily: "var(--code-font-family)"
                  },
                  children: url
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => copy("URL", url),
                  className: "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-[var(--gray-a3)]",
                  style: { color: "var(--gray-11)" },
                  title: "Copy URL",
                  "aria-label": "Copy URL",
                  children: copied === "URL" ? /* @__PURE__ */ jsx(Check, { size: 13 }) : /* @__PURE__ */ jsx(Copy, { size: 13 })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              background: "rgb(2,6,23)",
              borderBottom: "1px solid var(--gray-a4)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-4 py-2",
                  style: { borderBottom: "1px solid rgba(255,255,255,0.08)" },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "inline-flex items-center gap-2 text-[11.5px] font-medium",
                        style: { color: "rgb(74,222,128)" },
                        children: [
                          /* @__PURE__ */ jsx(Play, { size: 11, "aria-hidden": true }),
                          "200 OK · ",
                          endpoint.params.find((p) => p.key === "format") ? selected.format === "skos" ? "text/turtle" : selected.format === "owl" ? "application/rdf+xml" : selected.format === "csv" ? "text/csv" : selected.format === "jsonld" ? "application/ld+json" : "application/json" : "application/json"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "text-[10.5px]",
                        style: {
                          color: "rgb(148,163,184)",
                          fontFamily: "var(--code-font-family)"
                        },
                        children: [
                          responseText.split("\n").length,
                          " lines · ",
                          responseText.length,
                          " ",
                          "chars"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "pre",
                {
                  style: {
                    maxHeight: 320,
                    overflow: "auto",
                    padding: "12px 16px",
                    fontFamily: "var(--code-font-family)",
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    color: "rgb(226,232,240)",
                    margin: 0
                  },
                  children: /* @__PURE__ */ jsx("code", { children: responseText })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex flex-wrap items-center justify-between gap-2 px-4 py-3",
            style: { background: "var(--gray-2)" },
            children: [
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "text-[11.5px]",
                  style: { color: "var(--gray-10)" },
                  children: "Response computed live from your selections — no real network call."
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => copy("cURL", curl),
                    className: "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    style: {
                      background: "var(--color-panel-solid)",
                      border: "1px solid var(--gray-a5)",
                      color: "var(--gray-12)"
                    },
                    children: [
                      copied === "cURL" ? /* @__PURE__ */ jsx(Check, { size: 12, "aria-hidden": true }) : /* @__PURE__ */ jsx(Terminal, { size: 12, "aria-hidden": true }),
                      "cURL"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => copy("Response", responseText),
                    className: "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    style: {
                      background: "var(--color-panel-solid)",
                      border: "1px solid var(--gray-a5)",
                      color: "var(--gray-12)"
                    },
                    children: [
                      copied === "Response" ? /* @__PURE__ */ jsx(Check, { size: 12, "aria-hidden": true }) : /* @__PURE__ */ jsx(Code2, { size: 12, "aria-hidden": true }),
                      "Response"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}

const $$Api = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Product", item: "https://semlify.com/product" },
      {
        "@type": "ListItem",
        position: 3,
        name: "API & Playground",
        item: "https://semlify.com/product/api"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "JSON-LD API & playground \u2014 Semlify", "description": "Five clean REST endpoints with tag pinning, language negotiation, and JSON-LD / SKOS / OWL output. Try every call in the in-app playground before you integrate.", "current": "/product/api", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductPageNav", $$ProductPageNav, { "current": "/product/api" })} ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"> <div class="md:col-span-6" data-fade-up> <p class="text-eyebrow">Product · API & Playground</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);">
Ship to your stack on day one.
</h1> <p class="mt-5 max-w-xl text-lg leading-relaxed" style="color: var(--gray-11);">
Five endpoints. Five output formats. Tag pinning, language
          negotiation, scheme scoping. The Playground in the app generates
          every call — copy as cURL or fetch and paste into your codebase.
</p> <div class="mt-7 flex flex-wrap gap-3"> <a href="/access" class="btn-primary">Try free</a> <a href="/product" class="btn-secondary">All product features</a> </div> </div> <div class="md:col-span-6" data-fade-up data-delay="1"> ${renderComponent($$result2, "ApiPlaygroundIllustration", $$ApiPlaygroundIllustration, {})} </div> </div> </section>  <section class="py-20 md:py-28"> <div class="container-page"> <header class="mx-auto mb-10 max-w-2xl text-center"> <p class="text-eyebrow">Endpoints</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Five endpoints, no more, no less.
</h2> <p class="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
We resisted the urge to ship twenty. Most consumer pipelines call
          three of these.
</p> </header> <div class="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-5)]" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4); box-shadow: var(--shadow-2);" data-fade-up> <table class="w-full text-[13.5px]"> <thead> <tr style="border-bottom: 1px solid var(--gray-a4); background: var(--gray-2);"> <th class="px-5 py-3 text-left" style="color: var(--gray-11); width: 8%;">Verb</th> <th class="px-5 py-3 text-left" style="color: var(--gray-11); width: 38%;">Path</th> <th class="px-5 py-3 text-left" style="color: var(--gray-11);">Returns</th> </tr> </thead> <tbody> ${[
    {
      verb: "GET",
      path: "/v1/ontologies/:id/concepts",
      ret: "Every concept in an ontology, optionally scoped to a scheme."
    },
    {
      verb: "GET",
      path: "/v1/ontologies/:id/relations",
      ret: "All relations with their typed endpoints and relation type."
    },
    {
      verb: "GET",
      path: "/v1/ontologies/:id/schema",
      ret: "The T-Box \u2014 every class with attributes plus relation types with domain / range."
    },
    {
      verb: "GET",
      path: "/v1/ontologies/:id/concepts/:conceptId",
      ret: "One concept \u2014 full SKOS labels, definitions, properties, deprecation pointer."
    },
    {
      verb: "POST",
      path: "/v1/ontologies/:id/sparql",
      ret: "SPARQL query against the ontology (read-only).",
      postlike: true
    }
  ].map((row, i) => renderTemplate`<tr${addAttribute(`${i !== 0 ? "border-top: 1px solid var(--gray-a3);" : ""}`, "style")}> <td class="px-5 py-4"> <span class="rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold"${addAttribute(
    row.postlike ? "background: var(--amber-3); color: var(--amber-11);" : "background: var(--green-3); color: var(--green-11);",
    "style"
  )}> ${row.verb} </span> </td> <td class="px-5 py-4 font-mono text-[12.5px]" style="color: var(--gray-12);"> ${row.path} </td> <td class="px-5 py-4" style="color: var(--gray-11);"> ${row.ret} </td> </tr>`)} </tbody> </table> </div> </div> </section>  <section class="py-16 md:py-24" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-5xl"> <header class="mx-auto mb-8 max-w-2xl text-center md:mb-10" data-fade-up> <p class="text-eyebrow">Try it</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
The playground, right here.
</h2> <p class="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
Switch endpoints. Toggle parameters. The URL and JSON response update
          live — no signup, no auth, no real network call. Copy as cURL when
          you're ready.
</p> </header> <div data-fade-up data-delay="1"> ${renderComponent($$result2, "InteractivePlayground", InteractivePlayground, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/InteractivePlayground.tsx", "client:component-export": "default" })} </div> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Tag pinning", "title": "Pin your pipeline to a known-good state.", "body": "Add `?tag=v1.3` to any read endpoint. Your RAG pipeline gets a stable snapshot \u2014 no behavior shifts when a maintainer adds a concept, no surprise breakage on Monday morning. Re-index when you choose to, on `tag.created` webhooks." }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "bash", "filename": "Pinned read", "code": `# Pin to a tagged snapshot
curl https://api.semlify.com/v1/ontologies/cars/concepts \\
  ?tag=v1.3 \\
  &lang=en \\
  &format=jsonld \\
  -H "Authorization: Bearer $TOKEN"

# Roll forward by changing one query param
curl ".../concepts?tag=v1.4&lang=en&format=jsonld"` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Format negotiation", "title": "JSON, JSON-LD, SKOS Turtle, OWL XML, CSV.", "body": "One endpoint, five outputs. Pick whichever your downstream tool consumes natively. The full ontology export round-trips OWL \u2014 your architects can open the same artefact in Prot\xE9g\xE9.", "reverse": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "bash", "filename": "Format selection", "code": `# JSON-LD for a RAG pipeline
curl ".../concepts?format=jsonld"

# SKOS Turtle for a search index
curl ".../concepts?format=skos"

# OWL RDF/XML for Prot\xE9g\xE9 / Stardog
curl ".../schema?format=owl"

# CSV for ad-hoc analysis
curl ".../concepts?format=csv"` })} ` })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Try the playground.", "subtitle": "Generate every call against your own data. Copy as cURL, fetch, or Python." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/api.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/api.astro";
const $$url = "/product/api";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Api,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
