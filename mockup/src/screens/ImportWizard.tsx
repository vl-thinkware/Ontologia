import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Checkbox,
  Code,
  Flex,
  Heading,
  Select,
  Table,
  Text,
} from "@radix-ui/themes";
import {
  UploadCloud,
  FileSpreadsheet,
  Check,
  ArrowRight,
  ArrowLeft,
  CircleAlert,
  CheckCircle2,
  Sparkles,
  Loader2,
  Database,
  Table as TableIcon,
  FileText,
  X,
} from "lucide-react";
import { useApp } from "../app/AppContext";
import {
  ontologies,
  conceptClasses as allConceptClasses,
  conceptSchemes as allSchemes,
} from "../data/mock";

type Step = 1 | 2 | 3;

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 1, title: "Upload", description: "Drag in a CSV or Excel sheet" },
  {
    id: 2,
    title: "Map columns",
    description: "Match columns to concept fields",
  },
  {
    id: 3,
    title: "Review & import",
    description: "Confirm and create change events",
  },
];

const SAMPLE_ROWS = [
  {
    sku: "SKU-1001",
    name: "Oak Coffee Table",
    category: "Living room",
    brand: "Nordica",
    price: "299.00",
  },
  {
    sku: "SKU-1002",
    name: "Linen Sofa 3-seater",
    category: "Living room",
    brand: "Nordica",
    price: "1299.00",
  },
  {
    sku: "SKU-1003",
    name: "Ceramic Vase Midi",
    category: "Decor",
    brand: "Studio Vel",
    price: "49.00",
  },
  {
    sku: "SKU-1004",
    name: "Walnut Shelf",
    category: "Storage",
    brand: "Nordica",
    price: "189.00",
  },
  {
    sku: "SKU-1005",
    name: "Brass Table Lamp",
    category: "Lighting",
    brand: "Lumen Co",
    price: "129.00",
  },
];

export default function ImportWizard() {
  const [step, setStep] = useState<Step>(1);
  const [filename, setFilename] = useState<string | null>(null);
  const [targetConcept, setTargetConcept] = useState("Product");
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [importedEventId, setImportedEventId] = useState<string | null>(null);
  const [targetOntologyId, setTargetOntologyId] = useState<string>(
    ontologies[0]?.id ?? "ont_cars"
  );
  const navigate = useNavigate();
  const { importConcepts, toast } = useApp();

  const resolvedClass = useMemo(() => {
    const ontClasses = allConceptClasses.filter(
      (c) => c.ontologyId === targetOntologyId
    );
    return (
      ontClasses.find(
        (c) => c.name.toLowerCase() === targetConcept.toLowerCase()
      ) ??
      ontClasses.find((c) => !c.isImplicit) ??
      ontClasses[0]
    );
  }, [targetOntologyId, targetConcept]);

  const resolvedSchemeId = useMemo(
    () => allSchemes.find((s) => s.ontologyId === targetOntologyId)?.id ?? "",
    [targetOntologyId]
  );

  const totalRows = SAMPLE_ROWS.length * 50;

  function runImport() {
    if (!resolvedClass) {
      toast({
        kind: "error",
        title: "No class available",
        description: "Pick an ontology that has at least one concept class.",
      });
      return;
    }
    setImporting(true);
    setTimeout(() => {
      const rows = SAMPLE_ROWS.map((r) => ({
        name: r.name,
        description: `${r.category} · ${r.brand} · ${r.price}`,
        classId: resolvedClass.id,
      }));
      const { concepts, event } = importConcepts({
        ontologyId: targetOntologyId,
        schemeId: resolvedSchemeId,
        rows,
        source: filename ?? "CSV wizard",
      });
      setImportedCount(concepts.length);
      setImportedEventId(event.id);
      setImporting(false);
      setDone(true);
      toast({
        kind: "success",
        title: `Imported ${concepts.length} concepts`,
        description: `One bulk_import change event was recorded.`,
      });
    }, 1400);
  }

  return (
    <Box className="mx-auto max-w-5xl" px="8" py="8">
      {/* Header */}
      <Flex align="start" justify="between" gap="4">
        <Box>
          <Text
            size="1"
            weight="bold"
            color="violet"
            className="uppercase tracking-wider"
          >
            Import wizard
          </Text>
          <Heading size="7" weight="bold" mt="1">
            Bring existing data into Ontologia
          </Heading>
          <Text as="p" size="2" color="gray" mt="1">
            Upload a CSV or Excel file. Ontologia will create one change event
            per row so everything stays revertable.
          </Text>
        </Box>
        <Button asChild variant="ghost" color="gray" size="1">
          <Link to="/dashboard">
            <X className="h-3.5 w-3.5" />
            Cancel
          </Link>
        </Button>
      </Flex>

      {/* Stepper */}
      <Flex align="center" gap="2" mt="6" asChild>
        <ol>
          {STEPS.map((s, idx) => (
            <Flex
              asChild
              key={s.id}
              align="center"
              gap="2"
              className="flex-1"
            >
              <li>
                <Flex
                  align="center"
                  justify="center"
                  className="h-7 w-7 shrink-0 rounded-full"
                  style={{
                    background:
                      step >= s.id ? "var(--accent-9)" : "var(--gray-a4)",
                    color:
                      step >= s.id ? "var(--accent-contrast)" : "var(--gray-11)",
                    fontWeight: 700,
                    fontSize: 11,
                    boxShadow:
                      step === s.id ? "0 0 0 4px var(--accent-a4)" : undefined,
                  }}
                >
                  {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                </Flex>
                <Box className="min-w-0 flex-1">
                  <Text
                    size="2"
                    weight="bold"
                    style={{
                      color:
                        step >= s.id ? "var(--gray-12)" : "var(--gray-9)",
                    }}
                  >
                    {s.title}
                  </Text>
                  <Text as="div" size="1" color="gray" className="truncate">
                    {s.description}
                  </Text>
                </Box>
                {idx < STEPS.length - 1 && (
                  <Box
                    width="48px"
                    style={{
                      height: 1,
                      background:
                        step > s.id ? "var(--accent-9)" : "var(--gray-a4)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </li>
            </Flex>
          ))}
        </ol>
      </Flex>

      {/* Card */}
      <Card mt="6" size="3" style={{ padding: 0, overflow: "hidden" }}>
        {/* Step 1: upload */}
        {step === 1 && (
          <Box p="8">
            <button
              type="button"
              onClick={() => setFilename("products_catalogue_april_2026.csv")}
              className="w-full"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                borderRadius: "var(--radius-4)",
                border: filename
                  ? "2px dashed var(--green-9)"
                  : "2px dashed var(--gray-a6)",
                background: filename
                  ? "var(--green-2)"
                  : "var(--color-panel-solid)",
                cursor: "pointer",
                transition: "background-color 120ms ease",
              }}
            >
              {!filename ? (
                <>
                  <Flex
                    align="center"
                    justify="center"
                    className="h-12 w-12 rounded-full"
                    style={{
                      background: "var(--accent-3)",
                      color: "var(--accent-11)",
                    }}
                  >
                    <UploadCloud className="h-6 w-6" />
                  </Flex>
                  <Heading size="2" weight="bold" mt="4">
                    Drop a CSV or Excel file here
                  </Heading>
                  <Text size="1" color="gray" mt="1">
                    or click to browse · up to 50 MB · UTF-8 recommended
                  </Text>
                  <Flex align="center" gap="2" mt="4">
                    <Badge color="gray" variant="soft" size="1">
                      .csv
                    </Badge>
                    <Badge color="gray" variant="soft" size="1">
                      .tsv
                    </Badge>
                    <Badge color="gray" variant="soft" size="1">
                      .xlsx
                    </Badge>
                  </Flex>
                </>
              ) : (
                <>
                  <Flex
                    align="center"
                    justify="center"
                    className="h-12 w-12 rounded-full"
                    style={{
                      background: "var(--green-3)",
                      color: "var(--green-11)",
                    }}
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </Flex>
                  <Heading size="2" weight="bold" mt="4">
                    {filename}
                  </Heading>
                  <Text size="1" color="gray" mt="1">
                    248 rows detected · 5 columns · UTF-8
                  </Text>
                  <Box mt="3">
                    <Button
                      variant="ghost"
                      size="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilename(null);
                      }}
                    >
                      Choose a different file
                    </Button>
                  </Box>
                </>
              )}
            </button>

            <Box mt="8" className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: FileSpreadsheet,
                  title: "CSV / Excel",
                  body: "One row per concept. Relations can be derived from ID columns.",
                },
                {
                  icon: Database,
                  title: "Dry run",
                  body: "We preview every change before writing it. Nothing is committed until you confirm.",
                },
                {
                  icon: FileText,
                  title: "Revertable",
                  body: "The import creates a single bulk_import event you can undo in one click.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} variant="surface" size="2">
                    <Icon
                      className="h-5 w-5"
                      style={{ color: "var(--accent-11)" }}
                    />
                    <Heading size="2" weight="bold" mt="2">
                      {item.title}
                    </Heading>
                    <Text as="p" size="1" color="gray" mt="1">
                      {item.body}
                    </Text>
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Step 2: mapping */}
        {step === 2 && (
          <Box>
            <Box
              px="6"
              py="4"
              style={{ borderBottom: "1px solid var(--gray-a4)" }}
            >
              <Flex align="center" gap="2" wrap="wrap">
                <FileSpreadsheet
                  className="h-4 w-4"
                  style={{ color: "var(--accent-11)" }}
                />
                <Text size="2" weight="bold">
                  {filename}
                </Text>
                <Badge color="gray" variant="soft" size="1">
                  248 rows · 5 columns
                </Badge>
                <Box ml="auto">
                  <Flex align="center" gap="3">
                    <Flex align="center" gap="2">
                      <Text size="1" color="gray">
                        Target ontology
                      </Text>
                      <Select.Root
                        value={targetOntologyId}
                        onValueChange={setTargetOntologyId}
                        size="1"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          {ontologies.map((o) => (
                            <Select.Item key={o.id} value={o.id}>
                              {o.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Text size="1" color="gray">
                        Target class
                      </Text>
                      <Select.Root
                        value={targetConcept}
                        onValueChange={setTargetConcept}
                        size="1"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          {allConceptClasses
                            .filter((c) => c.ontologyId === targetOntologyId)
                            .map((c) => (
                              <Select.Item key={c.id} value={c.name}>
                                {c.name}
                              </Select.Item>
                            ))}
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            <Box p="6" className="grid grid-cols-2 gap-6">
              <Box>
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider block"
                >
                  Column mapping
                </Text>
                <Box
                  mt="2"
                  style={{
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-3)",
                    overflow: "hidden",
                  }}
                >
                  {[
                    { csv: "sku", field: "sku", ai: true },
                    { csv: "name", field: "name", ai: true },
                    {
                      csv: "category",
                      field: "→ Category (relation)",
                      ai: true,
                    },
                    { csv: "brand", field: "→ Brand (relation)", ai: true },
                    { csv: "price", field: "price", ai: true },
                  ].map((m, i) => (
                    <Flex
                      key={m.csv}
                      align="center"
                      gap="3"
                      px="3"
                      py="2"
                      className="grid grid-cols-[1fr_auto_1.3fr]"
                      style={{
                        borderTop:
                          i !== 0 ? "1px solid var(--gray-a3)" : "none",
                      }}
                    >
                      <Code variant="ghost" weight="bold">
                        {m.csv}
                      </Code>
                      <ArrowRight
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--gray-9)" }}
                      />
                      <Flex align="center" gap="2">
                        <Box className="flex-1">
                          <Select.Root defaultValue={m.field} size="1">
                            <Select.Trigger className="w-full" />
                            <Select.Content>
                              <Select.Item value={m.field}>
                                {m.field}
                              </Select.Item>
                              <Select.Item value="skip">
                                — Skip this column —
                              </Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>
                        {m.ai && (
                          <Badge
                            color="violet"
                            variant="soft"
                            size="1"
                            title="Auto-matched"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            AI
                          </Badge>
                        )}
                      </Flex>
                    </Flex>
                  ))}
                </Box>

                <Box mt="4">
                  <Callout.Root color="violet" variant="surface" size="1">
                    <Callout.Icon>
                      <Sparkles className="h-3.5 w-3.5" />
                    </Callout.Icon>
                    <Callout.Text>
                      <strong>Auto-mapped 5 of 5 columns.</strong> We inferred 2
                      relation columns based on the existing ontology. Review
                      and adjust before continuing.
                    </Callout.Text>
                  </Callout.Root>
                </Box>
              </Box>

              <Box>
                <Text
                  size="1"
                  weight="bold"
                  color="gray"
                  className="uppercase tracking-wider block"
                >
                  Preview (first 5 rows)
                </Text>
                <Box
                  mt="2"
                  style={{
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-3)",
                    overflow: "hidden",
                  }}
                >
                  <Table.Root size="1" variant="ghost">
                    <Table.Header>
                      <Table.Row>
                        {["sku", "name", "category", "brand", "price"].map(
                          (h) => (
                            <Table.ColumnHeaderCell
                              key={h}
                              style={{
                                fontFamily: "var(--code-font-family)",
                              }}
                            >
                              {h}
                            </Table.ColumnHeaderCell>
                          )
                        )}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {SAMPLE_ROWS.map((r) => (
                        <Table.Row key={r.sku}>
                          <Table.Cell
                            style={{
                              fontFamily: "var(--code-font-family)",
                            }}
                          >
                            {r.sku}
                          </Table.Cell>
                          <Table.Cell>{r.name}</Table.Cell>
                          <Table.Cell>
                            <Text size="1" color="gray">
                              {r.category}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text size="1" color="gray">
                              {r.brand}
                            </Text>
                          </Table.Cell>
                          <Table.Cell
                            style={{
                              fontFamily: "var(--code-font-family)",
                            }}
                          >
                            {r.price}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
                <Flex align="center" gap="1" mt="2">
                  <CircleAlert
                    className="h-3 w-3"
                    style={{ color: "var(--amber-9)" }}
                  />
                  <Text size="1" color="gray">
                    3 rows have missing <Code variant="ghost">brand</Code> —
                    will be imported without the Brand relation.
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        )}

        {/* Step 3: review */}
        {step === 3 && (
          <Box p="8">
            {!done ? (
              <>
                <Card variant="surface" size="3">
                  <Heading size="2" weight="bold">
                    Ready to import
                  </Heading>
                  <Text as="p" size="1" color="gray" mt="1">
                    This is a dry-run preview. Nothing has been written yet.
                  </Text>
                  <Box mt="4" className="grid grid-cols-4 gap-3">
                    <Stat
                      label="New concepts"
                      value="+248"
                      accent="emerald"
                    />
                    <Stat label="Updated concepts" value="0" />
                    <Stat
                      label="New relations"
                      value="+486"
                      accent="emerald"
                    />
                    <Stat label="Warnings" value="3" accent="amber" />
                  </Box>
                </Card>

                <Box
                  mt="6"
                  style={{
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-3)",
                    overflow: "hidden",
                  }}
                >
                  <Flex
                    align="center"
                    justify="between"
                    px="3"
                    py="2"
                    style={{
                      background: "var(--gray-2)",
                      borderBottom: "1px solid var(--gray-a4)",
                    }}
                  >
                    <Flex align="center" gap="2">
                      <TableIcon
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--gray-11)" }}
                      />
                      <Text size="1" weight="bold">
                        Sample of changes (5 of 248)
                      </Text>
                    </Flex>
                    <Text size="1" color="gray">
                      Will create one <Code variant="ghost">bulk_import</Code>{" "}
                      change event
                    </Text>
                  </Flex>
                  <Box>
                    {SAMPLE_ROWS.map((r, i) => (
                      <Flex
                        key={r.sku}
                        align="center"
                        gap="3"
                        px="3"
                        py="2"
                        style={{
                          borderTop:
                            i !== 0 ? "1px solid var(--gray-a3)" : "none",
                        }}
                      >
                        <Badge color="green" variant="soft" size="1">
                          create
                        </Badge>
                        <Code variant="ghost">{targetConcept}</Code>
                        <Text size="1" color="gray">
                          ·
                        </Text>
                        <Text size="2" weight="medium">
                          {r.name}
                        </Text>
                        <Box ml="auto">
                          <Code variant="ghost" size="1">
                            sku={r.sku}
                          </Code>
                        </Box>
                      </Flex>
                    ))}
                  </Box>
                </Box>

                <Box
                  mt="6"
                  p="3"
                  style={{
                    border: "1px solid var(--gray-a4)",
                    borderRadius: "var(--radius-3)",
                    background: "var(--color-panel-solid)",
                  }}
                >
                  <Flex asChild align="start" gap="2">
                    <label>
                      <Checkbox defaultChecked mt="1" />
                      <Text size="2">
                        Create a single{" "}
                        <Code variant="soft" weight="bold">
                          bulk_import
                        </Code>{" "}
                        change event so this import can be reverted in one
                        click.
                      </Text>
                    </label>
                  </Flex>
                </Box>
              </>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py="9"
                className="text-center"
              >
                <Flex
                  align="center"
                  justify="center"
                  className="h-14 w-14 rounded-full"
                  style={{
                    background: "var(--green-3)",
                    color: "var(--green-11)",
                  }}
                >
                  <CheckCircle2 className="h-7 w-7" />
                </Flex>
                <Heading size="3" weight="bold" mt="4">
                  Import complete
                </Heading>
                <Text as="p" size="2" color="gray" mt="1">
                  {importedCount} concept{importedCount === 1 ? "" : "s"} added
                  to{" "}
                  <strong style={{ color: "var(--gray-12)" }}>
                    {ontologies.find((o) => o.id === targetOntologyId)?.name ??
                      "this ontology"}
                  </strong>
                  .
                </Text>
                {importedEventId && (
                  <Box mt="3">
                    <Code variant="soft" size="1">
                      Change event {importedEventId} · bulk_import · by Valentin
                    </Code>
                  </Box>
                )}
                <Flex align="center" gap="2" mt="5">
                  <Button
                    onClick={() => navigate(`/ontologies/${targetOntologyId}`)}
                  >
                    Open ontology
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="surface"
                    color="gray"
                    onClick={() => {
                      setStep(1);
                      setFilename(null);
                      setDone(false);
                      setImportedCount(0);
                      setImportedEventId(null);
                    }}
                  >
                    Import another file
                  </Button>
                </Flex>
              </Flex>
            )}
          </Box>
        )}
      </Card>

      {/* Footer actions */}
      {!done && (
        <Flex align="center" justify="between" mt="5">
          <Button
            variant="surface"
            color="gray"
            disabled={step === 1}
            onClick={() => setStep((s) => (s - 1) as Step)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
          {step < 3 ? (
            <Button
              disabled={step === 1 && !filename}
              onClick={() => setStep((s) => (s + 1) as Step)}
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button disabled={importing} onClick={runImport}>
              {importing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Importing {totalRows} rows…
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" />
                  Run import
                </>
              )}
            </Button>
          )}
        </Flex>
      )}
    </Box>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "emerald" | "amber";
}) {
  const tint =
    accent === "emerald"
      ? {
          background: "var(--green-2)",
          border: "1px solid var(--green-a5)",
          color: "var(--green-12)",
        }
      : accent === "amber"
      ? {
          background: "var(--amber-2)",
          border: "1px solid var(--amber-a5)",
          color: "var(--amber-12)",
        }
      : {
          background: "var(--color-panel-solid)",
          border: "1px solid var(--gray-a4)",
          color: "var(--gray-12)",
        };
  return (
    <Box
      px="3"
      py="2"
      style={{ ...tint, borderRadius: "var(--radius-3)" }}
    >
      <Text
        size="1"
        weight="bold"
        className="uppercase tracking-wider"
        style={{ opacity: 0.7 }}
      >
        {label}
      </Text>
      <Heading size="5" weight="bold" mt="1">
        {value}
      </Heading>
    </Box>
  );
}
