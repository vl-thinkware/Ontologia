import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
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

type Step = 1 | 2 | 3;

const STEPS: { id: Step; title: string; description: string }[] = [
  {
    id: 1,
    title: "Upload",
    description: "Drag in a CSV or Excel sheet",
  },
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
  { sku: "SKU-1001", name: "Oak Coffee Table", category: "Living room", brand: "Nordica", price: "299.00" },
  { sku: "SKU-1002", name: "Linen Sofa 3-seater", category: "Living room", brand: "Nordica", price: "1299.00" },
  { sku: "SKU-1003", name: "Ceramic Vase Midi", category: "Decor", brand: "Studio Vel", price: "49.00" },
  { sku: "SKU-1004", name: "Walnut Shelf", category: "Storage", brand: "Nordica", price: "189.00" },
  { sku: "SKU-1005", name: "Brass Table Lamp", category: "Lighting", brand: "Lumen Co", price: "129.00" },
];

export default function ImportWizard() {
  const [step, setStep] = useState<Step>(1);
  const [filename, setFilename] = useState<string | null>(null);
  const [targetConcept, setTargetConcept] = useState("Product");
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const totalRows = 248;

  function runImport() {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
    }, 1400);
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      {/* Header + stepper */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Import wizard
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-900">
            Bring existing data into Ontologia
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Upload a CSV or Excel file. Ontologia will create one change event
            per row so everything stays revertable.
          </p>
        </div>
        <Link to="/dashboard" className="btn-ghost text-xs">
          <X className="h-3.5 w-3.5" />
          Cancel
        </Link>
      </div>

      <ol className="mt-6 flex items-center gap-2">
        {STEPS.map((s, idx) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                step > s.id
                  ? "bg-brand-600 text-white"
                  : step === s.id
                  ? "bg-brand-600 text-white ring-4 ring-brand-500/20"
                  : "bg-ink-200 text-ink-500"
              )}
            >
              {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={clsx(
                  "text-[13px] font-semibold",
                  step >= s.id ? "text-ink-900" : "text-ink-400"
                )}
              >
                {s.title}
              </div>
              <div className="truncate text-[11px] text-ink-500">
                {s.description}
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={clsx(
                  "h-px w-12 shrink-0",
                  step > s.id ? "bg-brand-500" : "bg-ink-200"
                )}
              />
            )}
          </li>
        ))}
      </ol>

      {/* Card */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        {/* Step 1: upload */}
        {step === 1 && (
          <div className="p-8">
            <label
              className={clsx(
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors",
                filename
                  ? "border-emerald-400 bg-emerald-50/60"
                  : "border-ink-300 hover:border-brand-400 hover:bg-brand-50/50"
              )}
              onClick={(e) => {
                e.preventDefault();
                setFilename("products_catalogue_april_2026.csv");
              }}
            >
              {!filename ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-ink-900">
                    Drop a CSV or Excel file here
                  </div>
                  <div className="mt-1 text-xs text-ink-500">
                    or click to browse · up to 50 MB · UTF-8 recommended
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-500">
                    <span className="chip bg-ink-100 text-ink-600">.csv</span>
                    <span className="chip bg-ink-100 text-ink-600">.tsv</span>
                    <span className="chip bg-ink-100 text-ink-600">.xlsx</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-ink-900">
                    {filename}
                  </div>
                  <div className="mt-1 text-xs text-ink-500">
                    248 rows detected · 5 columns · UTF-8
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setFilename(null);
                    }}
                    className="mt-3 text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Choose a different file
                  </button>
                </>
              )}
            </label>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-4">
                <FileSpreadsheet className="h-5 w-5 text-brand-700" />
                <h3 className="mt-2 text-sm font-semibold text-ink-900">
                  CSV / Excel
                </h3>
                <p className="mt-1 text-xs text-ink-600">
                  One row per concept. Relations can be derived from ID columns.
                </p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-4">
                <Database className="h-5 w-5 text-brand-700" />
                <h3 className="mt-2 text-sm font-semibold text-ink-900">
                  Dry run
                </h3>
                <p className="mt-1 text-xs text-ink-600">
                  We preview every change before writing it. Nothing is committed
                  until you confirm.
                </p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-4">
                <FileText className="h-5 w-5 text-brand-700" />
                <h3 className="mt-2 text-sm font-semibold text-ink-900">
                  Revertable
                </h3>
                <p className="mt-1 text-xs text-ink-600">
                  The import creates a single <code>bulk_import</code> event you
                  can undo in one click.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: mapping */}
        {step === 2 && (
          <div>
            <div className="border-b border-ink-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-semibold text-ink-900">
                  {filename}
                </span>
                <span className="chip bg-ink-100 text-ink-600">
                  248 rows · 5 columns
                </span>
                <div className="ml-auto flex items-center gap-3 text-[12px]">
                  <label className="flex items-center gap-2 text-ink-600">
                    Target concept
                    <select
                      value={targetConcept}
                      onChange={(e) => setTargetConcept(e.target.value)}
                      className="rounded-md border border-ink-200 bg-white px-2 py-1 text-[12px] font-medium text-ink-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                    >
                      <option>Product</option>
                      <option>Category</option>
                      <option>Brand</option>
                      <option>+ Create new concept…</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 p-6">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Column mapping
                </h3>
                <div className="mt-2 overflow-hidden rounded-lg border border-ink-200">
                  {[
                    { csv: "sku", field: "sku", ai: true },
                    { csv: "name", field: "name", ai: true },
                    { csv: "category", field: "→ Category (relation)", ai: true },
                    { csv: "brand", field: "→ Brand (relation)", ai: true },
                    { csv: "price", field: "price", ai: true },
                  ].map((m, i) => (
                    <div
                      key={m.csv}
                      className={clsx(
                        "grid grid-cols-[1fr_auto_1.3fr] items-center gap-3 px-3 py-2 text-[12.5px]",
                        i !== 0 && "border-t border-ink-100"
                      )}
                    >
                      <div className="font-mono font-semibold text-ink-800">
                        {m.csv}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-ink-400" />
                      <div className="flex items-center gap-1.5">
                        <select
                          defaultValue={m.field}
                          className="flex-1 rounded-md border border-ink-200 bg-white px-2 py-1 text-[12px] text-ink-800 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
                        >
                          <option>{m.field}</option>
                          <option>— Skip this column —</option>
                        </select>
                        {m.ai && (
                          <span
                            className="chip bg-brand-50 text-brand-700"
                            title="Auto-matched"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/60 p-3 text-[12px] text-brand-900">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    Auto-mapped 5 of 5 columns
                  </div>
                  <p className="mt-1 text-brand-800/90">
                    We inferred 2 relation columns based on the existing
                    ontology. Review and adjust before continuing.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Preview (first 5 rows)
                </h3>
                <div className="mt-2 overflow-hidden rounded-lg border border-ink-200">
                  <table className="w-full text-[11.5px]">
                    <thead className="bg-ink-50">
                      <tr>
                        {["sku", "name", "category", "brand", "price"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-2 py-1.5 text-left font-mono font-semibold text-ink-600"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {SAMPLE_ROWS.map((r, i) => (
                        <tr
                          key={r.sku}
                          className={clsx(
                            i !== 0 && "border-t border-ink-100",
                            "hover:bg-ink-50/60"
                          )}
                        >
                          <td className="px-2 py-1 font-mono text-ink-700">
                            {r.sku}
                          </td>
                          <td className="px-2 py-1 text-ink-800">{r.name}</td>
                          <td className="px-2 py-1 text-ink-600">
                            {r.category}
                          </td>
                          <td className="px-2 py-1 text-ink-600">{r.brand}</td>
                          <td className="px-2 py-1 font-mono text-ink-600">
                            {r.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-ink-500">
                  <CircleAlert className="h-3 w-3 text-amber-500" />
                  3 rows have missing <span className="font-mono">brand</span> —
                  will be imported without the Brand relation.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: review */}
        {step === 3 && (
          <div className="p-8">
            {!done ? (
              <>
                <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-5">
                  <h3 className="text-sm font-semibold text-ink-900">
                    Ready to import
                  </h3>
                  <p className="mt-1 text-xs text-ink-600">
                    This is a dry-run preview. Nothing has been written yet.
                  </p>
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    <Stat label="New concepts" value="+248" accent="emerald" />
                    <Stat label="Updated concepts" value="0" />
                    <Stat
                      label="New relations"
                      value="+486"
                      accent="emerald"
                    />
                    <Stat label="Warnings" value="3" accent="amber" />
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-ink-200">
                  <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/50 px-3 py-2 text-[12px] font-semibold text-ink-700">
                    <span className="flex items-center gap-1.5">
                      <TableIcon className="h-3.5 w-3.5" />
                      Sample of changes (5 of 248)
                    </span>
                    <span className="text-[11px] font-medium text-ink-500">
                      Will create one <code>bulk_import</code> change event
                    </span>
                  </div>
                  <ul>
                    {SAMPLE_ROWS.map((r, i) => (
                      <li
                        key={r.sku}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2 text-[12px]",
                          i !== 0 && "border-t border-ink-100"
                        )}
                      >
                        <span className="chip bg-emerald-50 text-emerald-700">
                          create
                        </span>
                        <span className="font-mono text-ink-700">
                          {targetConcept}
                        </span>
                        <span className="text-ink-400">·</span>
                        <span className="font-medium text-ink-900">
                          {r.name}
                        </span>
                        <span className="ml-auto font-mono text-[11px] text-ink-500">
                          sku={r.sku}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <label className="mt-6 flex items-start gap-2 rounded-lg border border-ink-200 bg-white p-3 text-[12.5px] text-ink-700">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <span>
                    Create a single{" "}
                    <span className="font-mono font-semibold">bulk_import</span>{" "}
                    change event so this import can be reverted in one click.
                  </span>
                </label>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink-900">
                  Import complete
                </h3>
                <p className="mt-1 text-sm text-ink-600">
                  248 concepts and 486 relations added to{" "}
                  <span className="font-semibold">E-commerce catalogue</span>.
                </p>
                <div className="mt-3 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 font-mono text-[11px] text-ink-600">
                  Change event ce_13 · bulk_import · by Valentin
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => navigate("/ontologies/ont_ecom")}
                    className="btn-primary"
                  >
                    Open ontology
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setStep(1);
                      setFilename(null);
                      setDone(false);
                    }}
                    className="btn-secondary"
                  >
                    Import another file
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer actions */}
      {!done && (
        <div className="mt-5 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="btn-secondary disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          {step < 3 ? (
            <button
              disabled={step === 1 && !filename}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="btn-primary"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              disabled={importing}
              onClick={runImport}
              className="btn-primary"
            >
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
            </button>
          )}
        </div>
      )}
    </div>
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
  const colors =
    accent === "emerald"
      ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
      : accent === "amber"
      ? "border-amber-200 bg-amber-50/60 text-amber-900"
      : "border-ink-200 bg-white text-ink-900";
  return (
    <div className={`rounded-lg border px-3 py-2 ${colors}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
