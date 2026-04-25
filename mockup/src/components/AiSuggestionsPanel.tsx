import { useMemo } from "react";
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
  Sparkles,
  Plus,
  Languages,
  Copy,
  Tag as TagIcon,
  Layers,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  concepts as allConcepts,
  conceptClasses as allConceptClasses,
  ontologies as allOntologies,
  type Concept,
  type LangTag,
} from "../data/mock";

const SYNONYM_DICT: Record<string, string[]> = {
  product: ["article", "item", "sku", "good"],
  category: ["taxon", "section", "group", "class"],
  brand: ["maker", "manufacturer", "label", "vendor"],
  material: ["substance", "fabric", "stuff"],
  price: ["cost", "rate"],
  table: ["bureau", "desk"],
  chair: ["seat"],
  vase: ["urn", "pot"],
  lamp: ["light", "luminaire"],
  shelf: ["rack", "ledge"],
  sofa: ["couch", "settee"],
  bed: ["cot", "bunk"],
  wood: ["timber"],
  metal: ["alloy"],
  ceramic: ["pottery", "earthenware"],
  glass: ["crystal"],
  brass: ["copper-alloy"],
};

const FR_TRANSLATIONS: Record<string, string> = {
  Product: "Produit",
  Category: "Catégorie",
  Brand: "Marque",
  Material: "Matériau",
  "Living room": "Salon",
  "Oak Coffee Table": "Table basse en chêne",
  "Linen Sofa 3-seater": "Canapé en lin 3 places",
  "Ceramic Vase Midi": "Vase en céramique Midi",
  "Walnut Shelf": "Étagère en noyer",
  "Brass Table Lamp": "Lampe de table en laiton",
};
const DE_TRANSLATIONS: Record<string, string> = {
  Product: "Produkt",
  Category: "Kategorie",
  Brand: "Marke",
  Material: "Material",
  "Living room": "Wohnzimmer",
};

type Suggestion = {
  id: string;
  kind: "synonym" | "translation" | "duplicate" | "class";
  title: string;
  body: string;
  preview?: string;
  accept: () => void;
};

const TINTS: Record<
  Suggestion["kind"],
  { bg: string; fg: string; color: "green" | "sky" | "amber" | "violet" }
> = {
  synonym: { bg: "var(--green-3)", fg: "var(--green-11)", color: "green" },
  translation: { bg: "var(--sky-3)", fg: "var(--sky-11)", color: "sky" },
  duplicate: { bg: "var(--amber-3)", fg: "var(--amber-11)", color: "amber" },
  class: { bg: "var(--violet-3)", fg: "var(--violet-11)", color: "violet" },
};

export default function AiSuggestionsPanel({
  conceptId,
  ontologyId,
  layout = "embedded",
}: {
  conceptId: string;
  ontologyId: string;
  layout?: "embedded" | "card";
}) {
  const { tick, updateConcept, toast } = useApp();
  void tick;
  const concept = allConcepts.find((c) => c.id === conceptId);
  const ontology =
    allOntologies.find((o) => o.id === ontologyId) ?? allOntologies[0];

  const suggestions: Suggestion[] = useMemo(() => {
    if (!concept) return [];
    const out: Suggestion[] = [];

    const existingAlts = new Set(
      concept.labels.altLabel.map((l) => l.value.toLowerCase())
    );
    const keyWord = concept.name.toLowerCase().split(/\s+/).pop() ?? "";
    const suggestedSynonyms = (SYNONYM_DICT[keyWord] ?? []).filter(
      (s) => !existingAlts.has(s)
    );
    if (suggestedSynonyms.length > 0) {
      out.push({
        id: "syn",
        kind: "synonym",
        title: "Add synonyms",
        body: `Based on "${concept.name}", these altLabels are commonly used synonyms.`,
        preview: suggestedSynonyms.slice(0, 4).join(", "),
        accept: () => {
          const merged = [
            ...concept.labels.altLabel,
            ...suggestedSynonyms.slice(0, 4).map((v) => ({
              lang: "en" as LangTag,
              value: v,
            })),
          ];
          updateConcept({
            id: concept.id,
            patch: {
              labels: { ...concept.labels, altLabel: merged },
            },
            message: `Accepted AI altLabel suggestion: ${suggestedSynonyms
              .slice(0, 4)
              .join(", ")}`,
          });
          toast({
            kind: "success",
            title: `Added ${Math.min(4, suggestedSynonyms.length)} synonyms`,
          });
        },
      });
    }

    const defaultLang = (ontology.defaultLanguage ?? "en") as LangTag;
    const targetLangs = ontology.languages.filter(
      (l) => l !== defaultLang
    );
    targetLangs.forEach((lang) => {
      const alreadyHas = concept.labels.prefLabel.some(
        (l) => l.lang === lang
      );
      if (alreadyHas) return;
      const dict =
        lang === "fr"
          ? FR_TRANSLATIONS
          : lang === "de"
          ? DE_TRANSLATIONS
          : null;
      const hint = dict?.[concept.name];
      if (!hint) return;
      out.push({
        id: `tr-${lang}`,
        kind: "translation",
        title: `Translate to ${lang.toUpperCase()}`,
        body: `Auto-translated prefLabel for ${lang.toUpperCase()}. Review before accepting — machine translation often misses domain jargon.`,
        preview: hint,
        accept: () => {
          const nextPref = [
            ...concept.labels.prefLabel,
            { lang, value: hint },
          ];
          updateConcept({
            id: concept.id,
            patch: {
              labels: { ...concept.labels, prefLabel: nextPref },
            },
            message: `Accepted AI ${lang.toUpperCase()} translation: ${hint}`,
          });
          toast({
            kind: "success",
            title: `Added ${lang.toUpperCase()} prefLabel`,
          });
        },
      });
    });

    const sameOntology = allConcepts.filter(
      (c) => c.ontologyId === concept.ontologyId && c.id !== concept.id
    );
    const myTokens = tokens(concept.name, concept.labels.altLabel);
    const likelyDupes = sameOntology
      .map((c) => ({
        c,
        score: jaccard(myTokens, tokens(c.name, c.labels.altLabel)),
      }))
      .filter((x) => x.score >= 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);
    if (likelyDupes.length > 0) {
      const dupe = likelyDupes[0];
      out.push({
        id: `dup-${dupe.c.id}`,
        kind: "duplicate",
        title: "Possible duplicate",
        body: `Overlap score ${(dupe.score * 100).toFixed(0)}% with "${
          dupe.c.name
        }". Merge them with dct:isReplacedBy if they refer to the same thing.`,
        preview: dupe.c.name,
        accept: () => {
          updateConcept({
            id: concept.id,
            patch: {
              labels: {
                ...concept.labels,
                altLabel: [
                  ...concept.labels.altLabel,
                  { lang: defaultLang, value: dupe.c.name },
                ],
              },
            },
            message: `AI flagged "${dupe.c.name}" as a duplicate — added as altLabel for now.`,
          });
          toast({
            kind: "info",
            title: `Added "${dupe.c.name}" as altLabel`,
            description:
              "To fully merge, deprecate one and set its replacedBy to the other.",
          });
        },
      });
    }

    const hasValidClass =
      !!concept.classId &&
      allConceptClasses.some((c) => c.id === concept.classId);
    if (!hasValidClass) {
      const candidate =
        allConceptClasses.find(
          (c) => c.ontologyId === concept.ontologyId && !c.isImplicit
        ) ??
        allConceptClasses.find((c) => c.ontologyId === concept.ontologyId);
      if (candidate) {
        out.push({
          id: "cls",
          kind: "class",
          title: `Classify as ${candidate.name}`,
          body: `This concept has no class assigned. Based on its labels, the most likely class in ${ontology.name} is "${candidate.name}".`,
          preview: candidate.name,
          accept: () => {
            updateConcept({
              id: concept.id,
              patch: { classId: candidate.id },
              message: `Accepted AI class suggestion: ${candidate.name}`,
            });
            toast({
              kind: "success",
              title: `Classified as ${candidate.name}`,
            });
          },
        });
      }
    }

    return out;
  }, [concept, ontology, updateConcept, toast]);

  if (!concept) {
    return (
      <Box p="4">
        <Text size="1" color="gray">
          Concept not found.
        </Text>
      </Box>
    );
  }

  const wrapperStyle =
    layout === "card"
      ? {
          background: "var(--color-panel-solid)",
          border: "1px solid var(--gray-a4)",
          borderRadius: "var(--radius-4)",
          boxShadow: "var(--shadow-2)",
        }
      : undefined;

  return (
    <Flex direction="column" className="h-full min-h-0" style={wrapperStyle}>
      <Box
        px="4"
        py="3"
        style={{ borderBottom: "1px solid var(--gray-a4)" }}
      >
        <Flex align="center" gap="2">
          <Sparkles
            className="h-4 w-4"
            style={{ color: "var(--violet-11)" }}
          />
          <Heading size="2" weight="bold">
            AI suggestions
          </Heading>
          <Badge color="violet" variant="soft" size="1">
            {suggestions.length}
          </Badge>
        </Flex>
        <Text as="p" size="1" color="gray" mt="1">
          Heuristic suggestions for "{concept.name}". Each accepted suggestion
          records a normal change event — you can revert it from the history.
        </Text>
      </Box>
      <Box className="min-h-0 flex-1 overflow-y-auto">
        {suggestions.length === 0 ? (
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
                background: "var(--violet-3)",
                color: "var(--violet-11)",
              }}
            >
              <Sparkles className="h-5 w-5" />
            </Flex>
            <Heading size="2" weight="bold" mt="3">
              Nothing obvious to suggest
            </Heading>
            <Text size="1" color="gray" mt="1" style={{ maxWidth: 240 }}>
              Try adding altLabels or translations manually, or let editors
              fill in more context for the AI to work with.
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" asChild>
            <ul>
              {suggestions.map((s, i) => {
                const tint = TINTS[s.kind];
                const Icon =
                  s.kind === "synonym"
                    ? Copy
                    : s.kind === "translation"
                    ? Languages
                    : s.kind === "duplicate"
                    ? TagIcon
                    : Layers;
                return (
                  <Box
                    asChild
                    key={s.id}
                    px="4"
                    py="3"
                    style={{
                      borderTop:
                        i !== 0 ? "1px solid var(--gray-a3)" : "none",
                    }}
                  >
                    <li>
                      <Flex align="start" gap="2">
                        <Flex
                          align="center"
                          justify="center"
                          className="mt-0.5 h-6 w-6 shrink-0 rounded-[var(--radius-2)]"
                          style={{
                            background: tint.bg,
                            color: tint.fg,
                          }}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </Flex>
                        <Box className="min-w-0 flex-1">
                          <Text size="1" weight="bold">
                            {s.title}
                          </Text>
                          <Text as="p" size="1" color="gray" mt="1">
                            {s.body}
                          </Text>
                          {s.preview && (
                            <Box mt="2">
                              <Code variant="soft" size="1">
                                {s.preview}
                              </Code>
                            </Box>
                          )}
                          <Box mt="2">
                            <Button size="1" onClick={s.accept}>
                              <Plus className="h-3 w-3" />
                              Accept
                            </Button>
                          </Box>
                        </Box>
                      </Flex>
                    </li>
                  </Box>
                );
              })}
            </ul>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

function tokens(name: string, altLabels: { value: string }[]): Set<string> {
  const s = new Set<string>();
  name
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean)
    .forEach((w) => s.add(w));
  altLabels.forEach((l) => {
    l.value
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean)
      .forEach((w) => s.add(w));
  });
  return s;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const uni = new Set([...a, ...b]);
  if (uni.size === 0) return 0;
  return inter.size / uni.size;
}

void null as unknown as Concept;
