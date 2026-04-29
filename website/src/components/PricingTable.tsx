import { useState } from "react";

type BillingCycle = "monthly" | "annual";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthlyUsd: number | null; // null → "Custom"
  /** Display when annual is picked (already discounted). */
  annualUsdPerMonth: number | null;
  highlights: string[];
  cta: { label: string; href: string };
  emphasis?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For evaluation and hobby projects.",
    monthlyUsd: 0,
    annualUsdPerMonth: 0,
    highlights: [
      "1 workspace · 1 ontology",
      "Up to 500 concepts",
      "Community support",
      "All export formats",
    ],
    cta: { label: "Start free", href: "/access" },
  },
  {
    id: "team",
    name: "Team",
    tagline: "For AI teams shipping to production.",
    monthlyUsd: 499,
    annualUsdPerMonth: 415,
    highlights: [
      "Unlimited seats · 3 workspaces",
      "5,000 concepts · 500k API calls/mo",
      "Change history + revert + tags",
      "Email support, 1-business-day SLA",
    ],
    cta: { label: "Start trial", href: "/access" },
    emphasis: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "For teams with compliance needs.",
    monthlyUsd: 1990,
    annualUsdPerMonth: 1655,
    highlights: [
      "Unlimited concepts · 5M API calls/mo",
      "SSO (SAML) · audit log export",
      "99.9% SLA · priority support",
      "Quarterly business review",
    ],
    cta: { label: "Start trial", href: "/access" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For regulated industries.",
    monthlyUsd: null,
    annualUsdPerMonth: null,
    highlights: [
      "Dedicated Neo4j cluster or self-host",
      "Custom DPA · procurement review",
      "Named success manager",
      "24×7 P1 support",
    ],
    cta: { label: "Talk to sales", href: "mailto:hello@semlify.com" },
  },
];

export default function PricingTable() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  function priceFor(plan: Plan): { display: string; sub: string } {
    if (plan.monthlyUsd === null) {
      return { display: "Custom", sub: "Contact us for a quote" };
    }
    if (plan.monthlyUsd === 0) {
      return { display: "$0", sub: "Always free" };
    }
    if (cycle === "annual") {
      const perMonth = plan.annualUsdPerMonth ?? plan.monthlyUsd;
      return {
        display: `$${perMonth.toLocaleString("en-US")}`,
        sub: "per month, billed annually",
      };
    }
    return {
      display: `$${plan.monthlyUsd.toLocaleString("en-US")}`,
      sub: "per month, billed monthly",
    };
  }

  return (
    <div>
      {/* Cycle toggle */}
        <div className="flex justify-center">
          <div
            role="radiogroup"
            aria-label="Billing cycle"
            className="inline-flex items-center rounded-full p-1"
            style={{
              background: "var(--gray-3)",
              border: "1px solid var(--gray-a4)",
            }}
          >
            <button
              type="button"
              role="radio"
              aria-checked={cycle === "monthly"}
              onClick={() => setCycle("monthly")}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                background:
                  cycle === "monthly" ? "var(--color-panel-solid)" : "transparent",
                color:
                  cycle === "monthly" ? "var(--gray-12)" : "var(--gray-11)",
                boxShadow:
                  cycle === "monthly" ? "var(--shadow-1)" : "none",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={cycle === "annual"}
              onClick={() => setCycle("annual")}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                background:
                  cycle === "annual" ? "var(--color-panel-solid)" : "transparent",
                color: cycle === "annual" ? "var(--gray-12)" : "var(--gray-11)",
                boxShadow: cycle === "annual" ? "var(--shadow-1)" : "none",
              }}
            >
              Annual
              <span
                className="ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px]"
                style={{
                  background: "var(--green-3)",
                  color: "var(--green-11)",
                }}
              >
                −17%
              </span>
            </button>
          </div>
        </div>

        {/* Plan grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const price = priceFor(plan);
            return (
              <div
                key={plan.id}
                className="flex flex-col rounded-[var(--radius-5)] p-7"
                style={{
                  background: "var(--color-panel-solid)",
                  border: plan.emphasis
                    ? "2px solid var(--violet-9)"
                    : "1px solid var(--gray-a4)",
                  boxShadow: plan.emphasis ? "var(--shadow-3)" : "none",
                  position: "relative",
                }}
              >
                {plan.emphasis && (
                  <span
                    className="absolute -top-3 left-7 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider"
                    style={{
                      background: "var(--violet-9)",
                      color: "white",
                    }}
                  >
                    Most popular
                  </span>
                )}

                <div>
                  <h3
                    className="text-[20px] font-bold tracking-tight"
                    style={{ color: "var(--gray-12)" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="mt-1 text-[13px]"
                    style={{ color: "var(--gray-11)" }}
                  >
                    {plan.tagline}
                  </p>
                </div>

                <div className="mt-6">
                  <div
                    className="text-[36px] font-bold leading-none tracking-tight"
                    style={{
                      color: "var(--gray-12)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {price.display}
                  </div>
                  <div
                    className="mt-1 text-[12px]"
                    style={{ color: "var(--gray-10)" }}
                  >
                    {price.sub}
                  </div>
                </div>

                <ul
                  className="mt-6 flex-1 space-y-2.5"
                  role="list"
                >
                  {plan.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-[13.5px]"
                      style={{ color: "var(--gray-12)" }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--green-9)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ marginTop: 4, flexShrink: 0 }}
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.cta.href}
                  className="btn-primary mt-7 w-full"
                  style={
                    plan.emphasis
                      ? undefined
                      : {
                          background: "var(--gray-12)",
                          color: "var(--color-panel-solid)",
                        }
                  }
                >
                  {plan.cta.label}
                </a>
              </div>
            );
          })}
      </div>
    </div>
  );
}
