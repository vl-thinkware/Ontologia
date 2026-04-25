import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
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
  Languages,
  BookOpen,
  Tag as TagIcon,
  EyeOff,
  Hash,
  Plus,
  Trash2,
  Info,
  Check,
  X,
  Type,
  FileText,
  ListChecks,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import type { ClassProperty, ConceptClass } from "../data/mock";

const SKOS_BUILTINS: Array<{
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  cardinality: string;
  languageAware: boolean;
}> = [
  {
    key: "prefLabel",
    label: "Preferred label",
    description:
      "The canonical display name. At most one per language — it's what shows in trees, chips and exports.",
    icon: TagIcon,
    cardinality: "1 per language",
    languageAware: true,
  },
  {
    key: "altLabel",
    label: "Alternative labels",
    description:
      "Synonyms, acronyms, variant spellings surfaced in search and side-by-side views.",
    icon: Languages,
    cardinality: "many per language",
    languageAware: true,
  },
  {
    key: "hiddenLabel",
    label: "Hidden labels",
    description:
      "Search-only matches (misspellings, legacy codes, internal names). Never shown as a display label.",
    icon: EyeOff,
    cardinality: "many per language",
    languageAware: true,
  },
  {
    key: "definition",
    label: "Definition",
    description:
      "The authoritative meaning of the concept. Multilingual — one entry per language.",
    icon: BookOpen,
    cardinality: "1 per language",
    languageAware: true,
  },
  {
    key: "notation",
    label: "Notation",
    description:
      "A stable machine-friendly code (SKU, ISO code, enum value). Language-neutral.",
    icon: Hash,
    cardinality: "0..1",
    languageAware: false,
  },
  {
    key: "example",
    label: "Example",
    description:
      "Free-text illustrative usage, surfaced in the concept detail page next to the definition.",
    icon: FileText,
    cardinality: "0..many",
    languageAware: true,
  },
];

const VALUE_TYPES: Array<{
  id: ClassProperty["valueType"];
  label: string;
  hint: string;
}> = [
  { id: "string", label: "string", hint: "free text" },
  { id: "number", label: "number", hint: "integer or decimal" },
  { id: "boolean", label: "boolean", hint: "true / false" },
  { id: "enum", label: "enum", hint: "pick from a list" },
  { id: "date", label: "date", hint: "ISO 8601" },
  { id: "reference", label: "reference", hint: "pointer to another concept" },
  { id: "money", label: "money", hint: "amount + currency" },
];

const CLASS_COLORS: Array<{
  id: NonNullable<ConceptClass["color"]>;
  bg: string;
}> = [
  { id: "violet", bg: "var(--violet-9)" },
  { id: "emerald", bg: "var(--green-9)" },
  { id: "amber", bg: "var(--amber-9)" },
  { id: "sky", bg: "var(--sky-9)" },
  { id: "rose", bg: "var(--ruby-9)" },
  { id: "ink", bg: "var(--gray-11)" },
];

export default function ClassAttributesEditor({
  cls,
  onClose,
}: {
  cls: ConceptClass;
  onClose?: () => void;
}) {
  const { updateConceptClass, toast } = useApp();
  const props = cls.properties ?? [];
  const [adding, setAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  function persistProperties(next: ClassProperty[], summary: string) {
    updateConceptClass({
      id: cls.id,
      patch: { properties: next },
      message: summary,
    });
  }

  function removeProperty(key: string) {
    const next = props.filter((p) => p.key !== key);
    persistProperties(next, `Removed attribute "${key}"`);
    toast({
      kind: "info",
      title: `Attribute removed`,
      description: `"${key}" is no longer part of ${cls.name}.`,
    });
  }

  function saveProperty(draft: ClassProperty, originalKey?: string) {
    if (!draft.key.trim()) {
      toast({ kind: "error", title: "Attribute key is required" });
      return;
    }
    const keyExists = props.some(
      (p) => p.key === draft.key && p.key !== originalKey
    );
    if (keyExists) {
      toast({
        kind: "error",
        title: `Key "${draft.key}" already exists on ${cls.name}`,
      });
      return;
    }
    let next: ClassProperty[];
    if (originalKey) {
      next = props.map((p) => (p.key === originalKey ? draft : p));
      persistProperties(next, `Edited attribute "${draft.key}"`);
    } else {
      next = [...props, draft];
      persistProperties(next, `Added attribute "${draft.key}"`);
    }
    toast({
      kind: "success",
      title: originalKey ? `Attribute updated` : `Attribute created`,
      description: `${draft.key} · ${draft.valueType}`,
    });
    setAdding(false);
    setEditingKey(null);
  }

  return (
    <Flex direction="column" gap="5">
      {onClose && (
        <Flex align="center" justify="between">
          <Text
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wider"
          >
            Editing class
          </Text>
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            onClick={onClose}
            title="Collapse"
          >
            <X className="h-3.5 w-3.5" />
          </IconButton>
        </Flex>
      )}

      <ClassIdentityForm cls={cls} />

      {/* Built-in SKOS attributes */}
      <Box>
        <Flex align="center" gap="2" mb="2">
          <Text
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wider"
          >
            Built-in attributes
          </Text>
          <Badge color="violet" variant="soft" size="1">
            SKOS-aligned
          </Badge>
          <Info
            className="h-3 w-3"
            style={{ color: "var(--gray-9)" }}
          />
          <Text size="1" color="gray">
            Present on every instance of <Code>{cls.name}</Code>
          </Text>
        </Flex>
        <Box
          style={{
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
            overflow: "hidden",
          }}
        >
          {SKOS_BUILTINS.map((b, i) => {
            const Icon = b.icon;
            return (
              <Flex
                key={b.key}
                align="start"
                gap="3"
                px="3"
                py="2"
                style={{
                  borderTop: i !== 0 ? "1px solid var(--gray-a3)" : "none",
                  background:
                    "linear-gradient(90deg, var(--violet-2), var(--color-panel-solid))",
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-[var(--radius-2)]"
                  style={{
                    background: "var(--violet-3)",
                    color: "var(--violet-11)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Flex>
                <Box className="min-w-0 flex-1">
                  <Flex wrap="wrap" align="center" gap="2">
                    <Code size="1" variant="ghost" weight="bold">
                      {b.key}
                    </Code>
                    <Text size="1" color="gray">
                      — {b.label}
                    </Text>
                    <Badge color="gray" variant="soft" size="1">
                      {b.cardinality}
                    </Badge>
                    {b.languageAware && (
                      <Badge color="violet" variant="soft" size="1">
                        <Languages className="h-2.5 w-2.5" />
                        per language
                      </Badge>
                    )}
                  </Flex>
                  <Text as="p" size="1" color="gray" mt="1">
                    {b.description}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Box>
      </Box>

      {/* Custom attributes */}
      <Box>
        <Flex align="center" justify="between" mb="2">
          <Flex align="center" gap="2">
            <Text
              size="1"
              weight="bold"
              color="gray"
              className="uppercase tracking-wider"
            >
              Custom attributes
            </Text>
            <Badge color="gray" variant="soft" size="1">
              {props.length}
            </Badge>
          </Flex>
          <Button
            variant="surface"
            color="gray"
            size="1"
            onClick={() => {
              setAdding(true);
              setEditingKey(null);
            }}
          >
            <Plus className="h-3 w-3" />
            Add attribute
          </Button>
        </Flex>

        <Flex direction="column" gap="2">
          {props.length === 0 && !adding && (
            <Box
              px="3"
              py="4"
              style={{
                border: "1px dashed var(--gray-a5)",
                background: "var(--color-panel-solid)",
                borderRadius: "var(--radius-3)",
                textAlign: "center",
              }}
            >
              <Text size="1" color="gray">
                No custom attributes yet — add fields specific to{" "}
                <strong style={{ color: "var(--gray-12)" }}>
                  {cls.name}
                </strong>{" "}
                (e.g. SKU, ISO code, rating).
              </Text>
            </Box>
          )}
          {props.map((p) => {
            const isEditing = editingKey === p.key;
            return (
              <Box key={p.key}>
                {isEditing ? (
                  <PropertyForm
                    initial={p}
                    onCancel={() => setEditingKey(null)}
                    onSave={(d) => saveProperty(d, p.key)}
                  />
                ) : (
                  <PropertyRow
                    p={p}
                    onEdit={() => {
                      setEditingKey(p.key);
                      setAdding(false);
                    }}
                    onDelete={() => removeProperty(p.key)}
                  />
                )}
              </Box>
            );
          })}
          {adding && (
            <PropertyForm
              initial={{
                key: "",
                valueType: "string",
                required: false,
                localizable: false,
              }}
              onCancel={() => setAdding(false)}
              onSave={(d) => saveProperty(d)}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
}

// -- Class identity (name + description) ---------------------------------------

function ClassIdentityForm({ cls }: { cls: ConceptClass }) {
  const { updateConceptClass, toast } = useApp();
  const [name, setName] = useState(cls.name);
  const [description, setDescription] = useState(cls.description ?? "");
  const [color, setColor] = useState<NonNullable<ConceptClass["color"]>>(
    cls.color ?? "ink"
  );

  const dirty =
    name.trim() !== cls.name ||
    description.trim() !== (cls.description ?? "") ||
    color !== (cls.color ?? "ink");

  function save() {
    if (!name.trim()) {
      toast({ kind: "error", title: "Class name is required" });
      return;
    }
    updateConceptClass({
      id: cls.id,
      patch: {
        name: name.trim(),
        label: name.trim(),
        description: description.trim(),
        color,
      },
      message: `Edited class "${name.trim()}"`,
    });
    toast({ kind: "success", title: `Class "${name.trim()}" saved` });
  }

  return (
    <Card size="2">
      <Box className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_max-content]">
        <Box>
          <Text
            as="label"
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Class name
          </Text>
          <Box mt="1">
            <TextField.Root
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="2"
            />
          </Box>
        </Box>
        <Box>
          <Text
            as="label"
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Colour
          </Text>
          <Flex align="center" gap="2" mt="1">
            {CLASS_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                title={c.id}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: c.bg,
                  border:
                    color === c.id
                      ? "2px solid var(--gray-12)"
                      : "2px solid transparent",
                  transform: color === c.id ? "scale(1.10)" : "none",
                  transition: "transform 120ms ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </Flex>
        </Box>
      </Box>
      <Box mt="3">
        <Text
          as="label"
          size="1"
          weight="bold"
          color="gray"
          className="uppercase tracking-wide block"
        >
          Description
        </Text>
        <Box mt="1">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What kind of thing is this class? How will it be used?"
            size="2"
            style={{ minHeight: 60 }}
          />
        </Box>
      </Box>
      <Flex align="center" justify="end" gap="2" mt="3">
        <Code variant="ghost" size="1">
          {cls.id}
        </Code>
        <Button disabled={!dirty} onClick={save} size="1">
          <Check className="h-3 w-3" />
          Save identity
        </Button>
      </Flex>
    </Card>
  );
}

// -- Single property row (read-only display) ----------------------------------

function PropertyRow({
  p,
  onEdit,
  onDelete,
}: {
  p: ClassProperty;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Flex
      align="start"
      gap="3"
      px="3"
      py="2"
      className="hover:bg-[var(--accent-2)]"
      style={{
        background: "var(--color-panel-solid)",
        border: "1px solid var(--gray-a4)",
        borderRadius: "var(--radius-3)",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="mt-0.5 h-6 w-6 shrink-0 rounded-[var(--radius-2)]"
        style={{ background: "var(--gray-a3)", color: "var(--gray-11)" }}
      >
        <Type className="h-3.5 w-3.5" />
      </Flex>
      <Box className="min-w-0 flex-1">
        <Flex wrap="wrap" align="center" gap="2">
          <Code size="1" variant="ghost" weight="bold">
            {p.key}
          </Code>
          <Badge color="gray" variant="soft" size="1">
            {p.valueType}
          </Badge>
          {p.required && (
            <Badge color="ruby" variant="soft" size="1">
              required
            </Badge>
          )}
          {p.localizable && (
            <Badge color="violet" variant="soft" size="1">
              <Languages className="h-2.5 w-2.5" />
              i18n
            </Badge>
          )}
          {p.hint && (
            <Text size="1" color="gray" className="italic">
              {p.hint}
            </Text>
          )}
        </Flex>
        {p.description && (
          <Text as="p" size="1" color="gray" mt="1">
            {p.description}
          </Text>
        )}
        {p.valueType === "enum" &&
          p.enumValues &&
          p.enumValues.length > 0 && (
            <Flex wrap="wrap" align="center" gap="1" mt="2">
              <ListChecks
                className="h-3 w-3"
                style={{ color: "var(--gray-9)" }}
              />
              {p.enumValues.map((v) => (
                <Code key={v} size="1" variant="soft">
                  {v}
                </Code>
              ))}
            </Flex>
          )}
      </Box>
      <Flex align="center" gap="1" className="shrink-0">
        <Button variant="ghost" color="gray" size="1" onClick={onEdit}>
          Edit
        </Button>
        <IconButton
          variant="ghost"
          color="red"
          size="1"
          onClick={onDelete}
          title="Remove attribute"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </Flex>
    </Flex>
  );
}

// -- Property form (add + edit) -----------------------------------------------

function PropertyForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ClassProperty;
  onSave: (p: ClassProperty) => void;
  onCancel: () => void;
}) {
  const [key, setKey] = useState(initial.key);
  const [valueType, setValueType] = useState<ClassProperty["valueType"]>(
    initial.valueType
  );
  const [required, setRequired] = useState(initial.required);
  const [localizable, setLocalizable] = useState(initial.localizable);
  const [description, setDescription] = useState(initial.description ?? "");
  const [hint, setHint] = useState(initial.hint ?? "");
  const [enumValuesRaw, setEnumValuesRaw] = useState(
    (initial.enumValues ?? []).join(", ")
  );

  return (
    <Card
      size="2"
      style={{
        border: "2px solid var(--accent-9)",
      }}
    >
      <Box className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_max-content_max-content]">
        <Box>
          <Text
            as="label"
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Key
          </Text>
          <Box mt="1">
            <TextField.Root
              autoFocus
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. horsepower"
              size="1"
              style={{ fontFamily: "var(--code-font-family)" }}
            />
          </Box>
        </Box>
        <Box>
          <Text
            as="label"
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Type
          </Text>
          <Box mt="1">
            <Select.Root
              value={valueType}
              onValueChange={(v) =>
                setValueType(v as ClassProperty["valueType"])
              }
              size="1"
            >
              <Select.Trigger />
              <Select.Content>
                {VALUE_TYPES.map((t) => (
                  <Select.Item key={t.id} value={t.id}>
                    {t.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
        </Box>
        <Flex align="end" gap="3" pb="1">
          <Flex asChild align="center" gap="2">
            <label>
              <Checkbox
                checked={required}
                onCheckedChange={(v) => setRequired(!!v)}
              />
              <Text size="1" color="gray">
                Required
              </Text>
            </label>
          </Flex>
          <Flex asChild align="center" gap="2">
            <label>
              <Checkbox
                checked={localizable}
                onCheckedChange={(v) => setLocalizable(!!v)}
              />
              <Languages className="h-3 w-3" />
              <Text size="1" color="gray">
                Localizable
              </Text>
            </label>
          </Flex>
        </Flex>
      </Box>

      <Box mt="2">
        <Text
          as="label"
          size="1"
          weight="bold"
          color="gray"
          className="uppercase tracking-wide block"
        >
          Description
        </Text>
        <Box mt="1">
          <TextField.Root
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional — what does this attribute capture?"
            size="1"
          />
        </Box>
      </Box>

      <Box mt="2">
        <Text
          as="label"
          size="1"
          weight="bold"
          color="gray"
          className="uppercase tracking-wide block"
        >
          Hint
        </Text>
        <Box mt="1">
          <TextField.Root
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder='Optional — e.g. "HP", "ISO 4217", "integer, required"'
            size="1"
          />
        </Box>
      </Box>

      {valueType === "enum" && (
        <Box mt="2">
          <Text
            as="label"
            size="1"
            weight="bold"
            color="gray"
            className="uppercase tracking-wide block"
          >
            Enum values
          </Text>
          <Box mt="1">
            <TextField.Root
              value={enumValuesRaw}
              onChange={(e) => setEnumValuesRaw(e.target.value)}
              placeholder="comma-separated, e.g. active, draft, archived"
              size="1"
              style={{ fontFamily: "var(--code-font-family)" }}
            />
          </Box>
        </Box>
      )}

      <Flex align="center" justify="end" gap="2" mt="3">
        <Button variant="ghost" color="gray" size="1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="1"
          onClick={() =>
            onSave({
              key: key.trim(),
              valueType,
              required,
              localizable,
              description: description.trim() || undefined,
              hint: hint.trim() || undefined,
              enumValues:
                valueType === "enum"
                  ? enumValuesRaw
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean)
                  : undefined,
            })
          }
        >
          <Check className="h-3 w-3" />
          Save attribute
        </Button>
      </Flex>
    </Card>
  );
}
