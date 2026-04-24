import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Network,
  ArrowRight,
  Globe,
  Check,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import {
  ontologies,
  LANGUAGE_NAMES,
  type LangTag,
} from "../data/mock";

// Workspace-level languages the user can enable on the new ontology. Matches
// the LangTag union in mock.ts. If we ever add more, bump both places.
const AVAILABLE_LANGS: LangTag[] = ["en", "fr", "de", "es", "ja"];

// Starter presets — give the user a head start by pre-filling a T-Box shape.
// None of them currently seed concepts in the mockup; the copy makes clear
// what the generated schema will contain.
type Starter = {
  id: string;
  title: string;
  body: string;
  classesHint: string;
  relationsHint: string;
};

const STARTERS: Starter[] = [
  {
    id: "blank",
    title: "Blank ontology",
    body: "Zero classes. Zero relation types. Start from scratch and build your T-Box as you go.",
    classesHint: "— (none)",
    relationsHint: "— (none)",
  },
  {
    id: "reference",
    title: "Product-reference shape",
    body: "Classic domain model with a root entity, a couple of classifier classes, and broader/narrower ready to host a taxonomy tree.",
    classesHint: "Entity · Category · Attribute",
    relationsHint: "belongsTo · hasAttribute · broader",
  },
  {
    id: "catalog",
    title: "Catalog / multi-taxonomy",
    body: "Preconfigured for artefacts that host several taxonomies side-by-side — think body styles + fuel types + markets.",
    classesHint: "Item · Classifier · Country",
    relationsHint: "classifiedAs · headquarteredIn · broader ×3",
  },
];

export default function NewArtefactModal() {
  const { newArtefactOpen, closeNewArtefact, toast } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultLang, setDefaultLang] = useState<LangTag>("en");
  const [languages, setLanguages] = useState<LangTag[]>(["en"]);
  const [starterId, setStarterId] = useState<string>("blank");
  const navigate = useNavigate();

  function toggleLang(lang: LangTag) {
    // The default language is always enabled — don't let the user remove it
    // without first picking a different default.
    if (lang === defaultLang) return;
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  function handleSelectDefault(lang: LangTag) {
    setDefaultLang(lang);
    if (!languages.includes(lang)) {
      setLanguages((prev) => [...prev, lang]);
    }
  }

  function handleCreate() {
    const finalName = name.trim() || "New ontology";
    const starter = STARTERS.find((s) => s.id === starterId) ?? STARTERS[0];
    toast({
      kind: "success",
      title: `Ontology "${finalName}" created`,
      description: `Starter: ${starter.title}. Opening the canvas…`,
    });
    closeNewArtefact();
    setName("");
    setDescription("");
    setStarterId("blank");
    setDefaultLang("en");
    setLanguages(["en"]);
    // Route into the first ontology as a stand-in — the mockup doesn't yet
    // persist new workspaces.
    navigate(`/ontologies/${ontologies[0]?.id ?? "ont_cars"}`);
  }

  const valid = name.trim().length > 0;

  return (
    <Modal
      open={newArtefactOpen}
      onClose={closeNewArtefact}
      title="Create a new ontology"
      subtitle="Taxonomies live inside an ontology — create the ontology first, then add taxonomies from its Taxonomies view."
      width="max-w-2xl"
      footer={
        <>
          <button className="btn-secondary" onClick={closeNewArtefact}>
            Cancel
          </button>
          <button
            className={clsx(
              "btn-primary",
              !valid && "cursor-not-allowed opacity-60"
            )}
            disabled={!valid}
            onClick={handleCreate}
          >
            Create ontology
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Identity */}
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sky-700 ring-1 ring-black/5">
            <Network className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink-900">
              Ontology · T-Box + A-Box
            </div>
            <div className="text-[11.5px] text-ink-600">
              Classes, relation types, and one or more taxonomies (concept
              schemes) — the full modelling stack Ontologia is built around.
            </div>
          </div>
          <span className="chip bg-sky-100 text-sky-700">
            <Sparkles className="h-3 w-3" />
            Recommended
          </span>
        </div>

        {/* Name + description */}
        <div className="grid grid-cols-1 gap-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Name
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cars ontology"
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Description <span className="text-ink-400">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this ontology describe? Who will consume it downstream?"
              className="min-h-[72px] w-full resize-y rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>

        {/* Languages */}
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Languages
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-500">
              <Globe className="h-3 w-3" />
              Pick a default · enable additional translations
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_LANGS.map((lang) => {
              const enabled = languages.includes(lang);
              const isDefault = defaultLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() =>
                    isDefault ? undefined : toggleLang(lang)
                  }
                  onDoubleClick={() => handleSelectDefault(lang)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                    isDefault
                      ? "border-brand-600 bg-brand-600 text-white"
                      : enabled
                      ? "border-brand-300 bg-brand-50 text-brand-800"
                      : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                  )}
                  title={
                    isDefault
                      ? "Default language (click a different chip, then double-click to change)"
                      : "Click to toggle · double-click to make default"
                  }
                >
                  <span className="uppercase tracking-wide">{lang}</span>
                  <span
                    className={clsx(
                      isDefault ? "text-white/80" : "text-ink-500"
                    )}
                  >
                    {LANGUAGE_NAMES[lang]}
                  </span>
                  {isDefault && (
                    <span className="rounded-full bg-white/20 px-1 text-[9px] uppercase tracking-wider">
                      default
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Starter T-Box */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Starter schema
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {STARTERS.map((s) => {
              const active = starterId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStarterId(s.id)}
                  className={clsx(
                    "flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
                    active
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                      : "border-ink-200 bg-white hover:bg-ink-50"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-ink-900">
                      {s.title}
                    </span>
                    {active && (
                      <Check className="ml-auto h-3.5 w-3.5 text-brand-600" />
                    )}
                  </div>
                  <p className="text-[11.5px] text-ink-600">{s.body}</p>
                  <div className="mt-auto space-y-0.5 text-[10.5px] text-ink-500">
                    <div>
                      <span className="font-semibold uppercase tracking-wide text-ink-400">
                        Classes:{" "}
                      </span>
                      {s.classesHint}
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-wide text-ink-400">
                        Relations:{" "}
                      </span>
                      {s.relationsHint}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
