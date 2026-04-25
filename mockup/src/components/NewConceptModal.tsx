import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Callout,
  Checkbox,
  Code,
  Flex,
  IconButton,
  Select,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import {
  Plus,
  Trash2,
  Circle,
  Sparkles,
  Link2,
  GripVertical,
  Info,
} from "lucide-react";
import clsx from "clsx";
import Modal from "./Modal";
import { useApp } from "../app/AppContext";
import { concepts as allConcepts, type Concept } from "../data/mock";

type PropertyType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "date"
  | "reference"
  | "money";

type PropertyDraft = {
  id: string;
  key: string;
  type: PropertyType;
  required: boolean;
  hint?: string;
};

type RelationDraft = {
  id: string;
  targetConceptId: string;
  label: string;
};

const COLORS: NonNullable<Concept["color"]>[] = [
  "violet",
  "emerald",
  "amber",
  "sky",
  "rose",
];

const colorTokens: Record<
  NonNullable<Concept["color"]>,
  { bg: string; border: string; dot: string; text: string }
> = {
  violet: {
    bg: "linear-gradient(135deg, var(--violet-2), var(--color-panel-solid))",
    border: "var(--violet-7)",
    dot: "var(--violet-9)",
    text: "var(--violet-12)",
  },
  emerald: {
    bg: "linear-gradient(135deg, var(--green-2), var(--color-panel-solid))",
    border: "var(--green-7)",
    dot: "var(--green-9)",
    text: "var(--green-12)",
  },
  amber: {
    bg: "linear-gradient(135deg, var(--amber-2), var(--color-panel-solid))",
    border: "var(--amber-7)",
    dot: "var(--amber-9)",
    text: "var(--amber-12)",
  },
  sky: {
    bg: "linear-gradient(135deg, var(--sky-2), var(--color-panel-solid))",
    border: "var(--sky-7)",
    dot: "var(--sky-9)",
    text: "var(--sky-12)",
  },
  rose: {
    bg: "linear-gradient(135deg, var(--ruby-2), var(--color-panel-solid))",
    border: "var(--ruby-7)",
    dot: "var(--ruby-9)",
    text: "var(--ruby-12)",
  },
};

const typeLabels: Record<PropertyType, string> = {
  string: "String",
  number: "Number",
  boolean: "Boolean",
  enum: "Enum",
  date: "Date",
  reference: "Reference",
  money: "Money",
};

const typeHints: Record<PropertyType, string> = {
  string: "text",
  number: "numeric",
  boolean: "true / false",
  enum: "one of …",
  date: "ISO-8601",
  reference: "Concept id",
  money: "amount + currency",
};

function nextId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function NewConceptModal() {
  const { newConceptOpen, closeNewConcept, toast } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<NonNullable<Concept["color"]>>("violet");
  const [properties, setProperties] = useState<PropertyDraft[]>([
    {
      id: nextId(),
      key: "name",
      type: "string",
      required: true,
      hint: "required, unique",
    },
    { id: nextId(), key: "description", type: "string", required: false },
  ]);
  const [relations, setRelations] = useState<RelationDraft[]>([]);

  function reset() {
    setName("");
    setDescription("");
    setColor("violet");
    setProperties([
      {
        id: nextId(),
        key: "name",
        type: "string",
        required: true,
        hint: "required, unique",
      },
      { id: nextId(), key: "description", type: "string", required: false },
    ]);
    setRelations([]);
  }

  function close() {
    closeNewConcept();
    setTimeout(reset, 200);
  }

  function addProperty() {
    setProperties((p) => [
      ...p,
      { id: nextId(), key: "", type: "string", required: false },
    ]);
  }

  function updateProperty(id: string, patch: Partial<PropertyDraft>) {
    setProperties((p) =>
      p.map((x) => (x.id === id ? { ...x, ...patch } : x))
    );
  }

  function removeProperty(id: string) {
    setProperties((p) => p.filter((x) => x.id !== id));
  }

  function addRelation() {
    setRelations((r) => [
      ...r,
      {
        id: nextId(),
        targetConceptId: allConcepts[0]?.id ?? "",
        label: "belongsTo",
      },
    ]);
  }

  function updateRelation(id: string, patch: Partial<RelationDraft>) {
    setRelations((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function removeRelation(id: string) {
    setRelations((r) => r.filter((x) => x.id !== id));
  }

  function submit() {
    const resolvedName = name.trim() || "Untitled concept";
    toast({
      kind: "success",
      title: `Concept "${resolvedName}" created`,
      description: `${properties.length} properties, ${relations.length} relations. Added to the Cars ontology.`,
      action: {
        label: "View in history",
        onClick: () => {},
      },
    });
    close();
  }

  const preview = colorTokens[color];

  return (
    <Modal
      open={newConceptOpen}
      onClose={close}
      title="Create a new concept"
      subtitle="Define how this entity shows up in the taxonomy. You can always edit it later."
      width="max-w-4xl"
      footer={
        <>
          <Flex
            align="center"
            gap="2"
            mr="auto"
          >
            <Info
              className="h-3.5 w-3.5"
              style={{ color: "var(--gray-9)" }}
            />
            <Text size="1" color="gray">
              Creating this concept will add one{" "}
              <Code variant="ghost" size="1">
                create
              </Code>{" "}
              change event.
            </Text>
          </Flex>
          <Button variant="surface" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            <Plus className="h-3.5 w-3.5" />
            Create concept
          </Button>
        </>
      }
    >
      <Box className="grid grid-cols-[1.4fr_1fr] gap-6">
        {/* Left: editable form */}
        <Flex direction="column" gap="5">
          {/* Basics */}
          <Box>
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider block"
              mb="2"
            >
              Basics
            </Text>
            <Flex direction="column" gap="3">
              <Box>
                <Text
                  as="label"
                  size="1"
                  weight="bold"
                  color="gray"
                  mb="1"
                  className="block"
                >
                  Name <Text style={{ color: "var(--red-9)" }}>*</Text>
                </Text>
                <TextField.Root
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Order, Customer, Campaign…"
                  size="2"
                />
                <Text as="p" size="1" color="gray" mt="1">
                  UpperCamelCase is conventional. Must be unique per ontology.
                </Text>
              </Box>
              <Box>
                <Text
                  as="label"
                  size="1"
                  weight="bold"
                  color="gray"
                  mb="1"
                  className="block"
                >
                  Description
                </Text>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this concept represent?"
                  size="2"
                  style={{ minHeight: 64 }}
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  size="1"
                  weight="bold"
                  color="gray"
                  mb="1"
                  className="block"
                >
                  Color
                </Text>
                <Flex align="center" gap="2">
                  {COLORS.map((c) => {
                    const st = colorTokens[c];
                    const picked = c === color;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        title={c}
                        className={clsx(
                          "flex h-8 w-8 items-center justify-center rounded-[var(--radius-3)] border transition-all"
                        )}
                        style={{
                          background: st.bg,
                          borderColor: st.border,
                          boxShadow: picked
                            ? "0 0 0 3px var(--accent-a4)"
                            : undefined,
                          transform: picked ? "scale(1.05)" : "none",
                        }}
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: st.dot }}
                        />
                      </button>
                    );
                  })}
                  <Text size="1" color="gray" ml="2" className="capitalize">
                    {color}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>

          {/* Properties */}
          <Box>
            <Flex align="center" justify="between">
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wider"
              >
                Properties ({properties.length})
              </Text>
              <Button variant="ghost" size="1" onClick={addProperty}>
                <Plus className="h-3 w-3" />
                Add property
              </Button>
            </Flex>
            <Box
              mt="2"
              style={{
                border: "1px solid var(--gray-a4)",
                borderRadius: "var(--radius-3)",
                overflow: "hidden",
              }}
            >
              <Box
                px="2"
                py="2"
                style={{
                  borderBottom: "1px solid var(--gray-a3)",
                  background: "var(--gray-2)",
                }}
                className="grid grid-cols-[auto_1.3fr_1fr_auto_auto] items-center gap-2"
              >
                <span className="w-4" />
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider"
                >
                  Key
                </Text>
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider"
                >
                  Type
                </Text>
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider"
                >
                  Required
                </Text>
                <span className="w-6" />
              </Box>
              {properties.map((p, i) => (
                <Box
                  key={p.id}
                  px="2"
                  py="2"
                  style={{
                    borderTop: i !== 0 ? "1px solid var(--gray-a3)" : "none",
                  }}
                  className="grid grid-cols-[auto_1.3fr_1fr_auto_auto] items-center gap-2 hover:bg-[var(--gray-a2)]"
                >
                  <GripVertical
                    className="h-3.5 w-3.5 cursor-grab"
                    style={{ color: "var(--gray-9)" }}
                  />
                  <TextField.Root
                    value={p.key}
                    onChange={(e) =>
                      updateProperty(p.id, { key: e.target.value })
                    }
                    placeholder="propertyName"
                    size="1"
                    variant="soft"
                    style={{ fontFamily: "var(--code-font-family)" }}
                  />
                  <Select.Root
                    value={p.type}
                    onValueChange={(v) =>
                      updateProperty(p.id, { type: v as PropertyType })
                    }
                    size="1"
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {Object.entries(typeLabels).map(([v, l]) => (
                        <Select.Item key={v} value={v}>
                          {l}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Flex align="center" justify="center">
                    <Checkbox
                      checked={p.required}
                      onCheckedChange={(v) =>
                        updateProperty(p.id, { required: !!v })
                      }
                    />
                  </Flex>
                  <IconButton
                    variant="ghost"
                    color="red"
                    size="1"
                    onClick={() => removeProperty(p.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </IconButton>
                </Box>
              ))}
              {properties.length === 0 && (
                <Box px="3" py="4" style={{ textAlign: "center" }}>
                  <Text size="1" color="gray">
                    No properties yet.{" "}
                  </Text>
                  <Button variant="ghost" size="1" onClick={addProperty}>
                    Add one →
                  </Button>
                </Box>
              )}
            </Box>
            <Box mt="2">
              <Callout.Root color="violet" variant="surface" size="1">
                <Callout.Icon>
                  <Sparkles className="h-3 w-3" />
                </Callout.Icon>
                <Callout.Text>
                  <strong>AI suggestion:</strong> Based on the name, we suggest
                  adding <Code>status</Code>, <Code>createdAt</Code> — click
                  "Add property" to start.
                </Callout.Text>
              </Callout.Root>
            </Box>
          </Box>

          {/* Relations */}
          <Box>
            <Flex align="center" justify="between">
              <Text
                size="1"
                weight="bold"
                color="gray"
                className="uppercase tracking-wider"
              >
                Relations ({relations.length})
              </Text>
              <Button variant="ghost" size="1" onClick={addRelation}>
                <Plus className="h-3 w-3" />
                Add relation
              </Button>
            </Flex>
            <Flex direction="column" gap="2" mt="2">
              {relations.length === 0 ? (
                <Box
                  p="4"
                  style={{
                    border: "1px dashed var(--gray-a6)",
                    background: "var(--gray-2)",
                    borderRadius: "var(--radius-3)",
                    textAlign: "center",
                  }}
                >
                  <Text as="p" size="1" color="gray">
                    Connect this concept to others to define the taxonomy graph.
                  </Text>
                  <Button
                    variant="ghost"
                    size="1"
                    onClick={addRelation}
                    mt="1"
                  >
                    Add your first relation →
                  </Button>
                </Box>
              ) : (
                relations.map((r) => (
                  <Flex
                    key={r.id}
                    align="center"
                    gap="2"
                    px="2"
                    py="2"
                    style={{
                      background: "var(--color-panel-solid)",
                      border: "1px solid var(--gray-a4)",
                      borderRadius: "var(--radius-3)",
                    }}
                  >
                    <Link2
                      className="h-3.5 w-3.5"
                      style={{ color: "var(--gray-9)" }}
                    />
                    <Box width="120px">
                      <TextField.Root
                        value={r.label}
                        onChange={(e) =>
                          updateRelation(r.id, { label: e.target.value })
                        }
                        placeholder="relationName"
                        size="1"
                        variant="soft"
                        style={{ fontFamily: "var(--code-font-family)" }}
                      />
                    </Box>
                    <Text color="gray">→</Text>
                    <Box className="flex-1 min-w-0">
                      <Select.Root
                        value={r.targetConceptId}
                        onValueChange={(v) =>
                          updateRelation(r.id, { targetConceptId: v })
                        }
                        size="1"
                      >
                        <Select.Trigger className="w-full" />
                        <Select.Content>
                          {allConcepts.map((c) => (
                            <Select.Item key={c.id} value={c.id}>
                              {c.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>
                    <IconButton
                      variant="ghost"
                      color="red"
                      size="1"
                      onClick={() => removeRelation(r.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </IconButton>
                  </Flex>
                ))
              )}
            </Flex>
          </Box>
        </Flex>

        {/* Right: live preview */}
        <Box>
          <Text
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wider block"
            mb="2"
          >
            Live preview
          </Text>
          <Box
            p="5"
            style={{
              background: "var(--gray-2)",
              border: "1px solid var(--gray-a4)",
              borderRadius: "var(--radius-4)",
            }}
          >
            <Box
              className="mx-auto"
              style={{
                width: 240,
                background: preview.bg,
                border: `2px solid ${preview.border}`,
                borderRadius: "var(--radius-4)",
                boxShadow: "var(--shadow-2)",
              }}
            >
              <Flex
                align="center"
                gap="2"
                px="3"
                py="2"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: preview.dot }}
                />
                <Text
                  size="2"
                  weight="bold"
                  className="truncate"
                  style={{ color: preview.text, letterSpacing: "-0.01em" }}
                >
                  {name.trim() || "Untitled"}
                </Text>
                <Box
                  ml="auto"
                  style={{
                    fontFamily: "var(--code-font-family)",
                    fontSize: 10,
                    color: "var(--gray-9)",
                  }}
                >
                  new
                </Box>
              </Flex>
              <Box px="3" py="2">
                {properties.slice(0, 4).map((p) => (
                  <Flex
                    key={p.id}
                    align="baseline"
                    justify="between"
                    gap="2"
                    style={{
                      fontFamily: "var(--code-font-family)",
                      fontSize: 11,
                    }}
                  >
                    <Text
                      size="1"
                      weight="bold"
                      style={{
                        color: "var(--gray-12)",
                        fontFamily: "var(--code-font-family)",
                      }}
                    >
                      {p.key || "—"}
                      {p.required && (
                        <Text style={{ color: "var(--red-9)" }}>*</Text>
                      )}
                    </Text>
                    <Text
                      size="1"
                      color="gray"
                      className="truncate"
                      style={{ fontFamily: "var(--code-font-family)" }}
                    >
                      {typeHints[p.type]}
                    </Text>
                  </Flex>
                ))}
                {properties.length > 4 && (
                  <Text
                    size="1"
                    color="gray"
                    className="italic"
                    style={{ fontSize: 10 }}
                  >
                    +{properties.length - 4} more
                  </Text>
                )}
                {properties.length === 0 && (
                  <Text size="1" color="gray" className="italic">
                    No properties
                  </Text>
                )}
              </Box>
            </Box>

            {description && (
              <Box
                mt="3"
                p="2"
                style={{
                  background: "var(--color-panel-solid)",
                  border: "1px solid var(--gray-a4)",
                  borderRadius: "var(--radius-2)",
                }}
              >
                <Text size="1" color="gray">
                  {description}
                </Text>
              </Box>
            )}

            {relations.length > 0 && (
              <Box mt="3">
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider block"
                  mb="1"
                >
                  Outgoing relations
                </Text>
                <Flex direction="column" gap="1">
                  {relations.map((r) => {
                    const target = allConcepts.find(
                      (c) => c.id === r.targetConceptId
                    );
                    return (
                      <Flex key={r.id} align="center" gap="2">
                        <Circle
                          className="h-2 w-2"
                          style={{
                            color: "var(--gray-9)",
                            fill: "currentColor",
                          }}
                        />
                        <Text
                          size="1"
                          color="gray"
                          style={{ fontFamily: "var(--code-font-family)" }}
                        >
                          {r.label}
                        </Text>
                        <Text size="1" color="gray">
                          →
                        </Text>
                        <Text size="1" weight="medium">
                          {target?.name ?? "—"}
                        </Text>
                      </Flex>
                    );
                  })}
                </Flex>
              </Box>
            )}
          </Box>

          <Box
            mt="3"
            p="3"
            style={{
              background: "var(--color-panel-solid)",
              border: "1px solid var(--gray-a4)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Flex align="center" justify="between">
              <Text size="1" weight="bold">
                Destination
              </Text>
              <Badge color="gray" variant="soft" size="1">
                Cars ontology
              </Badge>
            </Flex>
            <Text as="div" size="1" color="gray" mt="1">
              Change event will be authored by{" "}
              <strong style={{ color: "var(--gray-12)" }}>
                Valentin Lemort
              </strong>
              .
            </Text>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
