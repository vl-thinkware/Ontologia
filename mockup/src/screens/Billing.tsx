import clsx from "clsx";
import { Check, Download, CreditCard, Sparkles } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { usage } from "../data/mock";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    tagline: "For evaluation and hobby projects.",
    highlights: [
      "1 workspace · 1 ontology",
      "Up to 500 concepts",
      "Community support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$499",
    unit: "/month",
    tagline: "For AI teams shipping to production.",
    current: true,
    highlights: [
      "Unlimited seats · 3 workspaces",
      "5,000 concepts · 500k API calls",
      "Change history + revert + tags",
      "Email support, 1-business-day SLA",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$1,990",
    unit: "/month",
    tagline: "For teams with compliance needs.",
    highlights: [
      "Unlimited concepts · 5M API calls",
      "SSO (SAML) · audit log export",
      "99.9% SLA · priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$40k+",
    unit: "/year",
    tagline: "For regulated industries & self-hosted.",
    highlights: [
      "Dedicated Neo4j instance or self-host",
      "Custom DPA · procurement review",
      "Named success manager",
    ],
  },
];

const INVOICES = [
  { id: "INV-2026-04", date: "2026-04-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-03", date: "2026-03-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-02", date: "2026-02-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-01", date: "2026-01-01", amount: "$499.00", status: "Paid" },
];

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function Meter({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-ink-700">{label}</span>
        <span className="text-[11px] text-ink-500">
          {formatNumber(used)} / {formatNumber(limit)} {unit}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className={clsx(
            "h-full rounded-full",
            pct > 80
              ? "bg-gradient-to-r from-amber-500 to-red-500"
              : "bg-gradient-to-r from-brand-500 to-brand-700"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 text-[10.5px] font-medium text-ink-500">
        {pct}% used · resets May 1
      </div>
    </div>
  );
}

export default function Billing() {
  return (
    <SettingsLayout
      title="Billing & usage"
      description="Manage your plan, payment method, and download invoices."
    >
      {/* Current plan */}
      <section className="card overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 bg-gradient-to-br from-brand-50 to-white px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Current plan
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-ink-900">
                Team
              </span>
              <span className="text-sm text-ink-600">· $499/month</span>
            </div>
            <p className="mt-1 text-xs text-ink-600">
              Renews on <strong>May 1, 2026</strong> · Billed to Visa ••••4242
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary">Change plan</button>
            <button className="btn-ghost">Cancel subscription</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 p-6">
          <Meter
            label="Concepts"
            used={usage.concepts.used}
            limit={usage.concepts.limit}
          />
          <Meter
            label="API calls (this month)"
            used={usage.apiCalls.used}
            limit={usage.apiCalls.limit}
          />
          <Meter
            label="Workspaces"
            used={usage.workspaces.used}
            limit={usage.workspaces.limit}
          />
          <Meter
            label="Webhook endpoints"
            used={usage.webhooks.used}
            limit={usage.webhooks.limit}
          />
        </div>
      </section>

      {/* Plans */}
      <section>
        <h2 className="text-sm font-semibold text-ink-900">Available plans</h2>
        <p className="text-xs text-ink-500">
          Every plan is workspace-based — no per-seat tax.
        </p>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={clsx(
                "flex flex-col rounded-xl border bg-white p-4",
                p.current
                  ? "border-brand-400 shadow-pop ring-4 ring-brand-500/10"
                  : "border-ink-200"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink-900">
                  {p.name}
                </div>
                {p.current && (
                  <span className="chip bg-brand-600 text-white text-[10px]">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-xl font-bold tracking-tight text-ink-900">
                  {p.price}
                </span>
                <span className="ml-1 text-[11px] text-ink-500">{p.unit}</span>
              </div>
              <p className="mt-1 text-[11.5px] text-ink-600">{p.tagline}</p>
              <ul className="mt-3 space-y-1.5 text-[11.5px] text-ink-700">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={p.current}
                className={clsx(
                  "mt-4 w-full rounded-lg py-1.5 text-[12px] font-semibold",
                  p.current
                    ? "cursor-default bg-ink-100 text-ink-500"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                )}
              >
                {p.current ? "Current plan" : "Switch to " + p.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Payment method */}
      <section className="card p-5">
        <h2 className="text-sm font-semibold text-ink-900">Payment method</h2>
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-ink-200 bg-white p-4">
          <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-ink-900">
              Visa ending in 4242
            </div>
            <div className="text-[11.5px] text-ink-500">
              Expires 08/2028 · Valentin Lemort
            </div>
          </div>
          <button className="btn-ghost text-xs">Update</button>
        </div>
      </section>

      {/* Invoices */}
      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">
              Invoice history
            </h2>
            <p className="text-xs text-ink-500">
              Download past invoices as PDF.
            </p>
          </div>
          <button className="btn-ghost text-xs">
            <Download className="h-3.5 w-3.5" />
            Export all
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-ink-50/60 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-2.5 text-left">Invoice</th>
              <th className="px-5 py-2.5 text-left">Date</th>
              <th className="px-5 py-2.5 text-left">Amount</th>
              <th className="px-5 py-2.5 text-left">Status</th>
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => (
              <tr
                key={inv.id}
                className={i !== 0 ? "border-t border-ink-100" : ""}
              >
                <td className="px-5 py-3 font-mono text-[12px] text-ink-800">
                  {inv.id}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {inv.date}
                </td>
                <td className="px-5 py-3 text-[12px] font-semibold text-ink-900">
                  {inv.amount}
                </td>
                <td className="px-5 py-3">
                  <span className="chip bg-emerald-50 text-emerald-700">
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SettingsLayout>
  );
}
