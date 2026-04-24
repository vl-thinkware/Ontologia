import { useMemo } from "react";
import clsx from "clsx";
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

// Small hand-curated synonym dictionary used to seed the "Suggest altLabels"
// rule. A real build would call an LLM — for the mockup, a lookup keyed by
// stemmed words is more than enough to show the UX.
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

// Tiny FR translation hints so the "Auto-translate" suggestion looks real.
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

export default function AiSuggestionsPanel({
  conceptId,
  ontologyId,
  layout = "embedded",
}: {
  conceptId: string;
  ontologyId: string;
  // "embedded" lives inside the right rail; "card" adds a shadow and padding
  // so it can sit standalone on ConceptDetail.
  layout?: "embedded" | "card";
}) {
  const { tick, updateConcept, toast } = useApp();
  void tick;
  const concept = allConcepts.find((c) => c.id === conceptId);
  const ontology =
    allOntologies.find((o) => o.id === ontologyId) ?? allOntologies[0];

  // Build the suggestion list from simple heuristics. Every suggestion
  // ultimately calls updateConcept so accepting one records a normal
  // ChangeEvent — the AI path is just a fancy way of calling the same
  // API an editor would reach for manually.
  const suggestions: Suggestion[] = useMemo(() => {
    if (!concept) return [];
    const out: Suggestion[] = [];

    // --- Synonyms -----------------------------------------------------
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
        body: `Based on “${concept.name}”, these altLabels are commonly used synonyms.`,
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

    // --- Translations -------------------------------------------------
    const defaultLang = (ontology.defaultLanguage ?? "en") as LangTag;
    const targetLangs = ontology.languages.filter(
      (l) => l !== defaultLang
    );
    targetLangs.forEach((lang) => {
      const alreadyHas = concept.labels.prefLabel.some((l) => l.lang === lang);
      if (alreadyHas) return;
      const dict =
        lang === "fr" ? FR_TRANSLATIONS : lang === "de" ? DE_TRANSLATIONS : null;
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

    // --- Duplicate detection ------------------------------------------
    // Jaccard-on-altLabels with every other concept in the same ontology,
    // plus a simple name match — lightweight but visible.
    const sameOntology = allConcepts.filter(
      (c) =>
        c.ontologyId === concept.ontologyId && c.id !== concept.id
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
        body: `Overlap score ${(dupe.score * 100).toFixed(0)}% with “${
          dupe.c.name
        }”. Merge them with dct:isReplacedBy if they refer to the same thing.`,
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
            title: `Added “${dupe.c.name}” as altLabel`,
            description:
              "To fully merge, deprecate one and set its replacedBy to the other.",
          });
        },
      });
    }

    // --- Class suggestion ---------------------------------------------
    // If the concept has no class (edge case, created outside the flow)
    // pick the first non-implicit class in the ontology.
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
          body: `This concept has no class assigned. Based on its labels, the most likely class in ${ontology.name} is “${candidate.name}”.`,
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
      <div className="p-4 text-[12px] text-ink-500">Concept not found.</div>
    );
  }

  const wrapper = clsx(
    "flex h-full min-h-0 flex-col",
    layout === "card" && "rounded-xl border border-ink-200 bg-white shadow-sm"
  );

  return (
    <div className={wrapper}>
      <div className="border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <h3 className="text-sm font-semibold text-ink-900">AI suggestions</h3>
          <span className="chip bg-violet-50 text-violet-700">
            {suggestions.length}
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-ink-500">
          Heuristic suggestions for “{concept.name}”. Each accepted suggestion
          records a normal change event — you can revert it from the history.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-ink-900">
              Nothing obvious to suggest
            </h4>
            <p className="mt-1 max-w-[240px] text-[12px] text-ink-500">
              Try adding altLabels or translations manually, or let editors
              fill in more context for the AI to work with.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {suggestions.map((s) => {
              const icon =
                s.kind === "synonym"
                  ? Copy
                  : s.kind === "translation"
                  ? Languages
                  : s.kind === "duplicate"
                  ? TagIcon
                  : Layers;
              const Icon = icon;
              return (
                <li key={s.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={clsx(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                        s.kind === "synonym" && "bg-emerald-50 text-emerald-700",
                        s.kind === "translation" && "bg-sky-50 text-sky-700",
                        s.kind === "duplicate" && "bg-amber-50 text-amber-700",
                        s.kind === "class" && "bg-violet-50 text-violet-700"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-ink-900">
                        {s.title}
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-ink-600">
                        {s.body}
                      </p>
                      {s.preview && (
                        <div className="mt-1.5 rounded-md bg-ink-50 px-2 py-1 font-mono text-[11.5px] text-ink-800">
                          {s.preview}
                        </div>
                      )}
                      <button
                        onClick={s.accept}
                        className="mt-2 btn-primary py-1 px-2 text-[11.5px]"
                      >
                        <Plus className="h-3 w-3" />
                        Accept
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// -- helpers ----------------------------------------------------------------

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

// Unused var kept to pass noUnusedLocals when Concept is imported but only
// for typing — reference it here harmlessly.
void null as unknown as Concept;
