import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
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

const AVAILABLE_LANGS: LangTag[] = ["en", "fr", "de", "es", "ja"];

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
          <Button variant="surface" color="gray" onClick={closeNewArtefact}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={handleCreate}>
            Create ontology
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <Flex direction="column" gap="5">
        {/* Identity */}
        <Card
          variant="surface"
          style={{
            background:
              "linear-gradient(135deg, var(--sky-2), var(--color-panel-solid))",
            border: "1px solid var(--sky-a5)",
          }}
        >
          <Flex align="center" gap="3">
            <Flex
              align="center"
              justify="center"
              className="h-10 w-10 shrink-0 rounded-[var(--radius-3)]"
              style={{
                background: "var(--color-panel-solid)",
                color: "var(--sky-11)",
                border: "1px solid var(--sky-a4)",
              }}
            >
              <Network className="h-5 w-5" />
            </Flex>
            <Box className="min-w-0 flex-1">
              <Text size="2" weight="bold">
                Ontology · T-Box + A-Box
              </Text>
              <Text as="p" size="1" color="gray">
                Classes, relation types, and one or more taxonomies (concept
                schemes) — the full modelling stack Ontologia is built around.
              </Text>
            </Box>
            <Badge color="sky" variant="soft">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          </Flex>
        </Card>

        {/* Name + description */}
        <Flex direction="column" gap="3">
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider block"
              mb="1"
            >
              Name
            </Text>
            <TextField.Root
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cars ontology"
              size="2"
            />
          </Box>
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider block"
              mb="1"
            >
              Description{" "}
              <Text size="1" color="gray" className="normal-case font-normal">
                (optional)
              </Text>
            </Text>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this ontology describe? Who will consume it downstream?"
              style={{ minHeight: 72 }}
              size="2"
            />
          </Box>
        </Flex>

        {/* Languages */}
        <Box>
          <Flex align="baseline" justify="between" mb="2">
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Languages
            </Text>
            <Flex align="center" gap="1">
              <Globe
                className="h-3 w-3"
                style={{ color: "var(--gray-9)" }}
              />
              <Text size="1" color="gray">
                Pick a default · enable additional translations
              </Text>
            </Flex>
          </Flex>
          <Flex wrap="wrap" gap="2">
            {AVAILABLE_LANGS.map((lang) => {
              const enabled = languages.includes(lang);
              const isDefault = defaultLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => (isDefault ? undefined : toggleLang(lang))}
                  onDoubleClick={() => handleSelectDefault(lang)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-bold transition-colors"
                  )}
                  style={
                    isDefault
                      ? {
                          background: "var(--accent-9)",
                          color: "var(--accent-contrast)",
                          borderColor: "var(--accent-9)",
                        }
                      : enabled
                      ? {
                          background: "var(--accent-3)",
                          color: "var(--accent-11)",
                          borderColor: "var(--accent-7)",
                        }
                      : {
                          background: "var(--color-panel-solid)",
                          color: "var(--gray-11)",
                          borderColor: "var(--gray-a5)",
                        }
                  }
                  title={
                    isDefault
                      ? "Default language (click a different chip, then double-click to change)"
                      : "Click to toggle · double-click to make default"
                  }
                >
                  <span className="uppercase tracking-wide">{lang}</span>
                  <span style={{ opacity: 0.8 }}>{LANGUAGE_NAMES[lang]}</span>
                  {isDefault && (
                    <span
                      className="rounded-full px-1 text-[9px] uppercase tracking-wider"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      default
                    </span>
                  )}
                </button>
              );
            })}
          </Flex>
        </Box>

        {/* Starter T-Box */}
        <Box>
          <Text
            size="1"
            weight="bold"
            color="gray"
            mb="2"
            className="uppercase tracking-wider block"
          >
            Starter schema
          </Text>
          <Box className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {STARTERS.map((s) => {
              const active = starterId === s.id;
              return (
                <Card
                  asChild
                  key={s.id}
                  variant={active ? "classic" : "surface"}
                  size="2"
                  style={
                    active
                      ? {
                          border: "2px solid var(--accent-9)",
                          background: "var(--accent-2)",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  <button
                    type="button"
                    onClick={() => setStarterId(s.id)}
                    className="text-left"
                  >
                    <Flex align="center" gap="2">
                      <Text size="2" weight="bold">
                        {s.title}
                      </Text>
                      {active && (
                        <Box ml="auto">
                          <Check
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--accent-11)" }}
                          />
                        </Box>
                      )}
                    </Flex>
                    <Text as="p" size="1" color="gray" mt="1">
                      {s.body}
                    </Text>
                    <Box mt="3">
                      <Text size="1" color="gray">
                        <strong className="uppercase tracking-wide">
                          Classes:{" "}
                        </strong>
                        {s.classesHint}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        <strong className="uppercase tracking-wide">
                          Relations:{" "}
                        </strong>
                        {s.relationsHint}
                      </Text>
                    </Box>
                  </button>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
}
