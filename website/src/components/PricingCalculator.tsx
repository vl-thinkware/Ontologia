import { useMemo, useState } from "react";
import { Theme } from "@radix-ui/themes";
import { Check, Sparkles, ArrowRight } from "lucide-react";

type Tier = "free" | "team" | "business" | "enterprise";

const TIER_META: Record<
  Tier,
  {
    name: string;
    monthly: number | null;
    color: string;
    bg: string;
    blurb: string;
    cta: { label: string; href: string };
  }
> = {
  free: {
    name: "Free",
    monthly: 0,
    color: "var(--gray-12)",
    bg: "var(--gray-3)",
    blurb: "Evaluation, hobby projects, learning the product.",
    cta: { label: "Start free", href: "https://app.semlify.com/signup" },
  },
  team: {
    name: "Team",
    monthly: 499,
    color: "var(--accent-12)",
    bg: "var(--accent-3)",
    blurb: "Production AI teams shipping versioned ontologies.",
    cta: {
      label: "Start Team trial",
      href: "https://app.semlify.com/signup?plan=team",
    },
  },
  business: {
    name: "Business",
    monthly: 1990,
    color: "var(--violet-12)",
    bg: "var(--violet-3)",
    blurb: "SSO, audit log export, 99.9% SLA, priority support.",
    cta: {
      label: "Start Business trial",
      href: "https://app.semlify.com/signup?plan=business",
    },
  },
  enterprise: {
    name: "Enterprise",
    monthly: null,
    color: "var(--gray-12)",
    bg: "var(--amber-3)",
    blurb: "Self-host, dedicated cluster, custom DPA, named CSM.",
    cta: { label: "Talk to sales", href: "mailto:hello@semlify.com" },
  },
};

// Tier ceilings from FEATURES.md / PRICING_MODEL.md.
const CEILINGS: Record<Tier, { concepts: number; apiCalls: number }> = {
  free: { concepts: 500, apiCalls: 5_000 },
  team: { concepts: 5_000, apiCalls: 500_000 },
  business: { concepts: 1_000_000, apiCalls: 5_000_000 },
  enterprise: { concepts: Infinity, apiCalls: Infinity },
};

function recommend(concepts: number, apiCalls: number): {
  tier: Tier;
  reason: string;
  fits: Tier[];
  outgrowing?: { metric: string; ceiling: number };
} {
  // Find the lowest tier where both metrics fit.
  const order: Tier[] = ["free", "team", "business", "enterprise"];
  const fits = order.filter(
    (t) => concepts <= CEILINGS[t].concepts && apiCalls <= CEILINGS[t].apiCalls
  );
  const tier = fits[0] ?? "enterprise";

  // Reason: identify the binding constraint of the next-lower tier.
  let reason = "";
  let outgrowing: { metric: string; ceiling: number } | undefined;
  if (tier === "free") {
    reason = "You fit the Free tier ceiling on both metrics.";
  } else {
    const lower = order[order.indexOf(tier) - 1];
    const lowerC = CEILINGS[lower];
    if (concepts > lowerC.concepts) {
      reason = `Concepts (${concepts.toLocaleString("en-US")}) exceed the ${TIER_META[lower].name} ceiling of ${lowerC.concepts.toLocaleString("en-US")}.`;
      outgrowing = { metric: "concepts", ceiling: lowerC.concepts };
    } else if (apiCalls > lowerC.apiCalls) {
      reason = `API calls (${apiCalls.toLocaleString("en-US")}/mo) exceed the ${TIER_META[lower].name} ceiling of ${lowerC.apiCalls.toLocaleString("en-US")}.`;
      outgrowing = { metric: "apiCalls", ceiling: lowerC.apiCalls };
    } else {
      reason = `${TIER_META[tier].name} fits both your metrics with headroom.`;
    }
  }

  return { tier, reason, fits, outgrowing };
}

// Slider config — log-ish scale via discrete stops so concept count picks
// are sensible (200, 500, 1k, 2k, 5k, 10k, 50k, 200k, 1M, 5M).
const CONCEPT_STOPS = [
  100, 200, 500, 1_000, 2_000, 5_000, 10_000, 50_000, 200_000, 1_000_000, 5_000_000,
];
const API_STOPS = [
  1_000, 5_000, 50_000, 100_000, 500_000, 1_000_000, 2_000_000, 5_000_000,
  20_000_000,
];

function fmt(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return n.toString();
}

export default function PricingCalculator() {
  // Default to a Team-fitting starting point.
  const [conceptIdx, setConceptIdx] = useState(5); // 5_000
  const [apiIdx, setApiIdx] = useState(4); // 500k

  const concepts = CONCEPT_STOPS[conceptIdx];
  const apiCalls = API_STOPS[apiIdx];
  const rec = useMemo(() => recommend(concepts, apiCalls), [concepts, apiCalls]);
  const meta = TIER_META[rec.tier];

  return (
    <Theme
      accentColor="violet"
      grayColor="slate"
      radius="medium"
      scaling="100%"
      panelBackground="solid"
      hasBackground={false}
    >
      <div
        className="overflow-hidden rounded-[var(--radius-5)]"
        style={{
          background: "var(--color-panel-solid)",
          border: "1px solid var(--gray-a5)",
          boxShadow: "var(--shadow-2)",
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col items-start gap-2 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-6"
          style={{
            background: "var(--gray-2)",
            borderBottom: "1px solid var(--gray-a4)",
          }}
        >
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--accent-11)" }}
            >
              Estimator
            </p>
            <h3
              className="mt-1 text-[18px] font-bold"
              style={{ color: "var(--gray-12)" }}
            >
              Find your tier in 10 seconds.
            </h3>
          </div>
          <p className="text-[12.5px]" style={{ color: "var(--gray-11)" }}>
            Pick the closest match — the recommendation updates live.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
          {/* Sliders */}
          <div
            className="px-6 py-6 md:col-span-7"
            style={{ borderRight: "1px solid var(--gray-a4)" }}
          >
            <SliderRow
              label="Concepts you'll model"
              value={fmt(concepts)}
              hint="Count includes every taxonomy and scheme."
              min={0}
              max={CONCEPT_STOPS.length - 1}
              currentIdx={conceptIdx}
              onChange={setConceptIdx}
              ticks={CONCEPT_STOPS.map(fmt)}
            />
            <div className="my-6 h-px" style={{ background: "var(--gray-a3)" }} />
            <SliderRow
              label="API calls per month"
              value={fmt(apiCalls)}
              hint="Reads from your RAG / search / catalog pipeline."
              min={0}
              max={API_STOPS.length - 1}
              currentIdx={apiIdx}
              onChange={setApiIdx}
              ticks={API_STOPS.map(fmt)}
            />
          </div>

          {/* Recommendation */}
          <div
            className="px-6 py-6 md:col-span-5"
            style={{ background: "var(--gray-2)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles
                size={14}
                style={{ color: "var(--accent-11)" }}
                aria-hidden
              />
              <p
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--accent-11)" }}
              >
                Recommended
              </p>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <h4
                className="text-[28px] font-bold tracking-tight"
                style={{ color: "var(--gray-12)" }}
              >
                {meta.name}
              </h4>
              {meta.monthly !== null ? (
                <p
                  className="text-[14px]"
                  style={{ color: "var(--gray-11)" }}
                >
                  {meta.monthly === 0
                    ? "Free"
                    : `$${meta.monthly.toLocaleString("en-US")}/mo`}
                </p>
              ) : (
                <p className="text-[14px]" style={{ color: "var(--gray-11)" }}>
                  Custom
                </p>
              )}
            </div>

            <p
              className="mt-2 text-[13px] leading-relaxed"
              style={{ color: "var(--gray-11)" }}
            >
              {meta.blurb}
            </p>

            <div
              className="mt-4 rounded-[var(--radius-3)] p-3"
              style={{
                background: meta.bg,
                border: "1px solid var(--gray-a4)",
              }}
            >
              <p
                className="flex items-start gap-2 text-[12.5px] leading-relaxed"
                style={{ color: meta.color }}
              >
                <Check
                  size={14}
                  style={{ marginTop: 2, flexShrink: 0 }}
                  aria-hidden
                />
                <span>{rec.reason}</span>
              </p>
            </div>

            <a
              href={meta.cta.href}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-3)] px-4 py-2.5 text-[13px] font-medium transition-colors"
              style={{
                background: "var(--accent-9)",
                color: "var(--accent-contrast)",
              }}
            >
              {meta.cta.label}
              <ArrowRight size={13} aria-hidden />
            </a>
          </div>
        </div>
      </div>

      <p
        className="mt-3 text-center text-[12px]"
        style={{ color: "var(--gray-10)" }}
      >
        Add-ons let you top up either metric without changing tier.{" "}
        <a
          href="#addons"
          style={{ color: "var(--accent-11)", fontWeight: 500 }}
        >
          See add-ons
        </a>{" "}
        below.
      </p>
    </Theme>
  );
}

function SliderRow({
  label,
  value,
  hint,
  min,
  max,
  currentIdx,
  onChange,
  ticks,
}: {
  label: string;
  value: string;
  hint: string;
  min: number;
  max: number;
  currentIdx: number;
  onChange: (i: number) => void;
  ticks: string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--gray-11)" }}
        >
          {label}
        </label>
        <span
          className="text-[20px] font-bold tracking-tight"
          style={{ color: "var(--gray-12)", fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={currentIdx}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="custom-range mt-3 w-full"
        aria-label={label}
        aria-valuetext={value}
      />
      <p
        className="mt-1 text-[11.5px]"
        style={{ color: "var(--gray-10)" }}
      >
        {hint}
      </p>

      <style>{`
        .custom-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--accent-9) 0%,
            var(--accent-9) ${((currentIdx - min) / (max - min)) * 100}%,
            var(--gray-5) ${((currentIdx - min) / (max - min)) * 100}%,
            var(--gray-5) 100%
          );
          outline: none;
          cursor: pointer;
        }
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--accent-9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          cursor: pointer;
          transition: transform 100ms ease;
        }
        .custom-range::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .custom-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--accent-9);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
          cursor: pointer;
        }
        .custom-range:focus-visible {
          outline: 2px solid var(--accent-a8);
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}</style>

      {/* Tick scale */}
      <div className="mt-2 flex justify-between" aria-hidden>
        {ticks.map((t, i) => (
          <span
            key={i}
            className="text-[10px]"
            style={{
              color: i === currentIdx ? "var(--accent-11)" : "var(--gray-9)",
              fontWeight: i === currentIdx ? 600 : 400,
            }}
          >
            {/* Show only every other tick on small viewports */}
            <span className={i % 2 === 0 ? "" : "hidden sm:inline"}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
