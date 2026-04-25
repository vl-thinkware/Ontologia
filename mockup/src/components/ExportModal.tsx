import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  SegmentedControl,
  Text,
} from "@radix-ui/themes";
import {
  Download,
  Copy,
  FileCode,
  FileJson,
  FileText,
  FileCog,
  Check,
} from "lucide-react";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import {
  ontologies,
  conceptClasses,
  relationTypes,
  conceptSchemes,
} from "../data/mock";

type Format = "jsonld" | "skos" | "owl" | "csv";

export default function ExportModal() {
  const { exportTarget, closeExport, concepts, relations, toast } = useApp();
  const [format, setFormat] = useState<Format>("jsonld");
  const [copied, setCopied] = useState(false);
  const [scope, setScope] = useState<"ontology" | "scheme">("ontology");
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  const ontologyId = exportTarget?.ontologyId ?? null;
  const ontology = useMemo(
    () => ontologies.find((o) => o.id === ontologyId),
    [ontologyId]
  );
  const schemesForOntology = useMemo(
    () => conceptSchemes.filter((s) => s.ontologyId === ontologyId),
    [ontologyId]
  );

  const scopedConcepts = useMemo(() => {
    if (!ontologyId) return [];
    return concepts.filter(
      (c) =>
        c.ontologyId === ontologyId &&
        (scope === "ontology" || c.schemeId === selectedSchemeId)
    );
  }, [ontologyId, concepts, scope, selectedSchemeId]);

  const scopedRelations = useMemo(() => {
    const ids = new Set(scopedConcepts.map((c) => c.id));
    return relations.filter((r) => ids.has(r.from) && ids.has(r.to));
  }, [scopedConcepts, relations]);

  const payload = useMemo(() => {
    if (!ontology) return "";
    switch (format) {
      case "jsonld":
        return renderJsonLd(ontology, scopedConcepts, scopedRelations);
      case "skos":
        return renderSkosTurtle(ontology, scopedConcepts, scopedRelations);
      case "owl":
        return renderOwlXml(ontology, scopedConcepts, scopedRelations);
      case "csv":
        return renderCsv(scopedConcepts, scopedRelations);
    }
  }, [format, ontology, scopedConcepts, scopedRelations]);

  const formatMeta: Record<
    Format,
    { label: string; icon: typeof FileJson; ext: string; lang: string }
  > = {
    jsonld: {
      label: "JSON-LD",
      icon: FileJson,
      ext: "jsonld",
      lang: "application/ld+json",
    },
    skos: {
      label: "SKOS Turtle",
      icon: FileText,
      ext: "ttl",
      lang: "text/turtle",
    },
    owl: {
      label: "OWL / XML",
      icon: FileCode,
      ext: "owl",
      lang: "application/rdf+xml",
    },
    csv: { label: "CSV", icon: FileCog, ext: "csv", lang: "text/csv" },
  };

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast({
        kind: "error",
        title: "Copy failed",
        description: "Clipboard access was blocked by the browser.",
      });
    }
  }

  function download() {
    if (!ontology) return;
    const meta = formatMeta[format];
    const blob = new Blob([payload], { type: meta.lang });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ontology.id}.${meta.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      kind: "success",
      title: `Downloaded ${a.download}`,
      description: `${scopedConcepts.length} concepts · ${scopedRelations.length} relations`,
    });
  }

  if (!ontology) {
    return (
      <Modal
        open={!!exportTarget}
        onClose={closeExport}
        title="Export ontology"
      >
        <Text size="2" color="gray">
          Ontology not found.
        </Text>
      </Modal>
    );
  }

  return (
    <Modal
      open={!!exportTarget}
      onClose={closeExport}
      title={`Export — ${ontology.name}`}
      subtitle={`${scopedConcepts.length} concepts · ${scopedRelations.length} relations · ${ontology.mode} mode`}
      width="max-w-4xl"
      footer={
        <>
          <Button variant="ghost" color="gray" onClick={closeExport}>
            Close
          </Button>
          <Button variant="surface" color="gray" onClick={copyToClipboard}>
            {copied ? (
              <Check
                className="h-3.5 w-3.5"
                style={{ color: "var(--green-11)" }}
              />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={download}>
            <Download className="h-3.5 w-3.5" />
            Download .{formatMeta[format].ext}
          </Button>
        </>
      }
    >
      <Flex direction="column" gap="3">
        {/* Format tabs */}
        <SegmentedControl.Root
          value={format}
          onValueChange={(v) => setFormat(v as Format)}
          size="2"
        >
          {(Object.keys(formatMeta) as Format[]).map((f) => {
            const Icon = formatMeta[f].icon;
            return (
              <SegmentedControl.Item key={f} value={f}>
                <Flex align="center" gap="2">
                  <Icon className="h-3.5 w-3.5" />
                  {formatMeta[f].label}
                </Flex>
              </SegmentedControl.Item>
            );
          })}
        </SegmentedControl.Root>

        {/* Scope */}
        <Flex wrap="wrap" align="center" gap="2">
          <Text size="1" weight="bold" color="gray">
            Scope
          </Text>
          <Button
            variant={scope === "ontology" ? "soft" : "surface"}
            color={scope === "ontology" ? "violet" : "gray"}
            size="1"
            onClick={() => setScope("ontology")}
          >
            Full ontology (
            {concepts.filter((c) => c.ontologyId === ontologyId).length})
          </Button>
          {schemesForOntology.length > 0 && (
            <>
              <Text size="1" color="gray">
                ·
              </Text>
              <Text size="1" weight="bold" color="gray">
                Scheme
              </Text>
              {schemesForOntology.map((s) => {
                const active =
                  scope === "scheme" && selectedSchemeId === s.id;
                return (
                  <Button
                    key={s.id}
                    variant={active ? "soft" : "surface"}
                    color={active ? "violet" : "gray"}
                    size="1"
                    onClick={() => {
                      setScope("scheme");
                      setSelectedSchemeId(s.id);
                    }}
                  >
                    {s.name}
                  </Button>
                );
              })}
            </>
          )}
        </Flex>

        {/* Preview */}
        <Box
          style={{
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
            overflow: "hidden",
            background: "var(--gray-12)",
          }}
        >
          <Flex
            align="center"
            justify="between"
            gap="2"
            px="3"
            py="2"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              color: "var(--gray-3)",
            }}
          >
            <Text
              size="1"
              className="font-mono"
              style={{ color: "var(--gray-3)" }}
            >
              {ontology.id}.{formatMeta[format].ext}
            </Text>
            <Text size="1" style={{ color: "var(--gray-3)" }}>
              {payload.split("\n").length} lines · {payload.length} chars
            </Text>
          </Flex>
          <pre
            style={{
              maxHeight: 360,
              overflow: "auto",
              padding: 12,
              fontSize: 11.5,
              lineHeight: 1.55,
              color: "var(--gray-1)",
              fontFamily: "var(--code-font-family)",
            }}
          >
            <code>{payload}</code>
          </pre>
        </Box>

        <Text size="1" color="gray">
          Preview is generated from the live workspace — any deprecations,
          edits, or new relations you've made in this session are already
          reflected above.
        </Text>
      </Flex>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Serializers — same as before; quick-and-readable rather than spec-perfect.
// -----------------------------------------------------------------------------

function lang(l: { lang: string; value: string }): string {
  return `"${escapeStr(l.value)}"@${l.lang}`;
}

function escapeStr(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function renderJsonLd(
  ontology: (typeof ontologies)[number],
  c: Parameters<typeof renderSkosTurtle>[1],
  r: Parameters<typeof renderSkosTurtle>[2]
): string {
  const graph = {
    "@context": {
      "@vocab": `https://ontologia.app/${ontology.id}/`,
      skos: "http://www.w3.org/2004/02/skos/core#",
      dct: "http://purl.org/dc/terms/",
      owl: "http://www.w3.org/2002/07/owl#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    },
    "@id": `https://ontologia.app/${ontology.id}`,
    "@type": "owl:Ontology",
    "rdfs:label": ontology.name,
    "dct:description": ontology.description,
    "@graph": [
      ...c.map((concept) => ({
        "@id": concept.id,
        "@type": "skos:Concept",
        "skos:inScheme": concept.schemeId,
        "skos:prefLabel": concept.labels.prefLabel.map((l) => ({
          "@value": l.value,
          "@language": l.lang,
        })),
        ...(concept.labels.altLabel.length > 0
          ? {
              "skos:altLabel": concept.labels.altLabel.map((l) => ({
                "@value": l.value,
                "@language": l.lang,
              })),
            }
          : {}),
        ...(concept.definitions.length > 0
          ? {
              "skos:definition": concept.definitions.map((l) => ({
                "@value": l.value,
                "@language": l.lang,
              })),
            }
          : {}),
        ...(concept.deprecated
          ? {
              "owl:deprecated": true,
              ...(concept.replacedBy
                ? { "dct:isReplacedBy": { "@id": concept.replacedBy } }
                : {}),
            }
          : {}),
      })),
      ...r.map((rel) => ({
        "@id": rel.id,
        "@type": "skos:semanticRelation",
        "skos:broader": { "@id": rel.to },
        "skos:narrower": { "@id": rel.from },
        "dct:type": rel.label,
      })),
    ],
  };
  return JSON.stringify(graph, null, 2);
}

function renderSkosTurtle(
  ontology: (typeof ontologies)[number],
  c: Array<{
    id: string;
    name: string;
    schemeId: string;
    labels: {
      prefLabel: Array<{ lang: string; value: string }>;
      altLabel: Array<{ lang: string; value: string }>;
      hiddenLabel: Array<{ lang: string; value: string }>;
    };
    definitions: Array<{ lang: string; value: string }>;
    deprecated?: boolean;
    replacedBy?: string;
  }>,
  r: Array<{
    id: string;
    from: string;
    to: string;
    label: string;
    relationTypeId: string;
  }>
): string {
  const lines: string[] = [
    `@prefix skos: <http://www.w3.org/2004/02/skos/core#> .`,
    `@prefix dct:  <http://purl.org/dc/terms/> .`,
    `@prefix owl:  <http://www.w3.org/2002/07/owl#> .`,
    `@prefix :     <https://ontologia.app/${ontology.id}/> .`,
    ``,
    `: a owl:Ontology ;`,
    `  dct:title "${escapeStr(ontology.name)}" ;`,
    `  dct:description "${escapeStr(ontology.description)}" .`,
    ``,
  ];
  for (const concept of c) {
    const pref = concept.labels.prefLabel.map(lang).join(" , ");
    const alt = concept.labels.altLabel.map(lang).join(" , ");
    const defs = concept.definitions.map(lang).join(" , ");
    lines.push(`:${concept.id} a skos:Concept ;`);
    lines.push(`  skos:inScheme :${concept.schemeId} ;`);
    if (pref) lines.push(`  skos:prefLabel ${pref} ;`);
    if (alt) lines.push(`  skos:altLabel ${alt} ;`);
    if (defs) lines.push(`  skos:definition ${defs} ;`);
    if (concept.deprecated) {
      lines.push(`  owl:deprecated true ;`);
      if (concept.replacedBy) {
        lines.push(`  dct:isReplacedBy :${concept.replacedBy} ;`);
      }
    }
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.replace(/;\s*$/, ".");
    lines.push("");
  }
  for (const rel of r) {
    lines.push(`:${rel.from} skos:broader :${rel.to} .`);
  }
  return lines.join("\n");
}

function renderOwlXml(
  ontology: (typeof ontologies)[number],
  c: Parameters<typeof renderSkosTurtle>[1],
  r: Parameters<typeof renderSkosTurtle>[2]
): string {
  const base = `https://ontologia.app/${ontology.id}`;
  const out: string[] = [
    `<?xml version="1.0"?>`,
    `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"`,
    `         xmlns:owl="http://www.w3.org/2002/07/owl#"`,
    `         xmlns:skos="http://www.w3.org/2004/02/skos/core#"`,
    `         xmlns:dct="http://purl.org/dc/terms/"`,
    `         xml:base="${base}">`,
    `  <owl:Ontology rdf:about="${base}">`,
    `    <dct:title>${escapeXml(ontology.name)}</dct:title>`,
    `    <dct:description>${escapeXml(ontology.description)}</dct:description>`,
    `  </owl:Ontology>`,
    ``,
  ];
  for (const concept of c) {
    out.push(`  <owl:NamedIndividual rdf:about="${base}/${concept.id}">`);
    out.push(
      `    <rdf:type rdf:resource="http://www.w3.org/2004/02/skos/core#Concept"/>`
    );
    out.push(
      `    <skos:inScheme rdf:resource="${base}/${concept.schemeId}"/>`
    );
    for (const l of concept.labels.prefLabel) {
      out.push(
        `    <skos:prefLabel xml:lang="${l.lang}">${escapeXml(
          l.value
        )}</skos:prefLabel>`
      );
    }
    for (const l of concept.labels.altLabel) {
      out.push(
        `    <skos:altLabel xml:lang="${l.lang}">${escapeXml(
          l.value
        )}</skos:altLabel>`
      );
    }
    for (const l of concept.definitions) {
      out.push(
        `    <skos:definition xml:lang="${l.lang}">${escapeXml(
          l.value
        )}</skos:definition>`
      );
    }
    if (concept.deprecated) {
      out.push(
        `    <owl:deprecated rdf:datatype="http://www.w3.org/2001/XMLSchema#boolean">true</owl:deprecated>`
      );
      if (concept.replacedBy) {
        out.push(
          `    <dct:isReplacedBy rdf:resource="${base}/${concept.replacedBy}"/>`
        );
      }
    }
    out.push(`  </owl:NamedIndividual>`);
  }
  for (const rel of r) {
    out.push(
      `  <rdf:Description rdf:about="${base}/${rel.from}"><skos:broader rdf:resource="${base}/${rel.to}"/></rdf:Description>`
    );
  }
  out.push(`</rdf:RDF>`);
  return out.join("\n");
}

function renderCsv(
  c: Parameters<typeof renderSkosTurtle>[1],
  r: Parameters<typeof renderSkosTurtle>[2]
): string {
  const rows: string[] = [
    `"id","scheme","prefLabel_en","prefLabel_fr","altLabel_en","altLabel_fr","definition_en","deprecated","replacedBy","broaderIds"`,
  ];
  for (const concept of c) {
    const broader = r
      .filter((rel) => rel.from === concept.id)
      .map((rel) => rel.to)
      .join("|");
    const prefEn =
      concept.labels.prefLabel.find((l) => l.lang === "en")?.value ?? "";
    const prefFr =
      concept.labels.prefLabel.find((l) => l.lang === "fr")?.value ?? "";
    const altEn = concept.labels.altLabel
      .filter((l) => l.lang === "en")
      .map((l) => l.value)
      .join("|");
    const altFr = concept.labels.altLabel
      .filter((l) => l.lang === "fr")
      .map((l) => l.value)
      .join("|");
    const defEn =
      concept.definitions.find((l) => l.lang === "en")?.value ?? "";
    rows.push(
      [
        concept.id,
        concept.schemeId,
        prefEn,
        prefFr,
        altEn,
        altFr,
        defEn,
        concept.deprecated ? "true" : "false",
        concept.replacedBy ?? "",
        broader,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
  }
  return rows.join("\n");
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

void conceptClasses;
void relationTypes;
