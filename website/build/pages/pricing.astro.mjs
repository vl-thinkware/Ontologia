import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYDX0w6H.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { $ as $$CtaBlock } from '../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../renderers.mjs';

const PLANS = [
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
      "All export formats"
    ],
    cta: { label: "Start free", href: "/access" }
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
      "Email support, 1-business-day SLA"
    ],
    cta: { label: "Start trial", href: "/access" },
    emphasis: true
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
      "Quarterly business review"
    ],
    cta: { label: "Start trial", href: "/access" }
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
      "24×7 P1 support"
    ],
    cta: { label: "Talk to sales", href: "mailto:hello@semlify.com" }
  }
];
function PricingTable() {
  const [cycle, setCycle] = useState("annual");
  function priceFor(plan) {
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
        sub: "per month, billed annually"
      };
    }
    return {
      display: `$${plan.monthlyUsd.toLocaleString("en-US")}`,
      sub: "per month, billed monthly"
    };
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
      "div",
      {
        role: "radiogroup",
        "aria-label": "Billing cycle",
        className: "inline-flex items-center rounded-full p-1",
        style: {
          background: "var(--gray-3)",
          border: "1px solid var(--gray-a4)"
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": cycle === "monthly",
              onClick: () => setCycle("monthly"),
              className: "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              style: {
                background: cycle === "monthly" ? "var(--color-panel-solid)" : "transparent",
                color: cycle === "monthly" ? "var(--gray-12)" : "var(--gray-11)",
                boxShadow: cycle === "monthly" ? "var(--shadow-1)" : "none"
              },
              children: "Monthly"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "radio",
              "aria-checked": cycle === "annual",
              onClick: () => setCycle("annual"),
              className: "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
              style: {
                background: cycle === "annual" ? "var(--color-panel-solid)" : "transparent",
                color: cycle === "annual" ? "var(--gray-12)" : "var(--gray-11)",
                boxShadow: cycle === "annual" ? "var(--shadow-1)" : "none"
              },
              children: [
                "Annual",
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "ml-1.5 inline-block rounded-full px-1.5 py-0.5 text-[10px]",
                    style: {
                      background: "var(--green-3)",
                      color: "var(--green-11)"
                    },
                    children: "−17%"
                  }
                )
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: PLANS.map((plan) => {
      const price = priceFor(plan);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex flex-col rounded-[var(--radius-5)] p-7",
          style: {
            background: "var(--color-panel-solid)",
            border: plan.emphasis ? "2px solid var(--violet-9)" : "1px solid var(--gray-a4)",
            boxShadow: plan.emphasis ? "var(--shadow-3)" : "none",
            position: "relative"
          },
          children: [
            plan.emphasis && /* @__PURE__ */ jsx(
              "span",
              {
                className: "absolute -top-3 left-7 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider",
                style: {
                  background: "var(--violet-9)",
                  color: "white"
                },
                children: "Most popular"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: "text-[20px] font-bold tracking-tight",
                  style: { color: "var(--gray-12)" },
                  children: plan.name
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: "mt-1 text-[13px]",
                  style: { color: "var(--gray-11)" },
                  children: plan.tagline
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "text-[36px] font-bold leading-none tracking-tight",
                  style: {
                    color: "var(--gray-12)",
                    fontVariantNumeric: "tabular-nums"
                  },
                  children: price.display
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "mt-1 text-[12px]",
                  style: { color: "var(--gray-10)" },
                  children: price.sub
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "ul",
              {
                className: "mt-6 flex-1 space-y-2.5",
                role: "list",
                children: plan.highlights.map((h) => /* @__PURE__ */ jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2 text-[13.5px]",
                    style: { color: "var(--gray-12)" },
                    children: [
                      /* @__PURE__ */ jsx(
                        "svg",
                        {
                          width: "14",
                          height: "14",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "var(--green-9)",
                          strokeWidth: "2.5",
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          "aria-hidden": "true",
                          style: { marginTop: 4, flexShrink: 0 },
                          children: /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5" })
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: h })
                    ]
                  },
                  h
                ))
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: plan.cta.href,
                className: "btn-primary mt-7 w-full",
                style: plan.emphasis ? void 0 : {
                  background: "var(--gray-12)",
                  color: "var(--color-panel-solid)"
                },
                children: plan.cta.label
              }
            )
          ]
        },
        plan.id
      );
    }) })
  ] });
}

const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      q: "Can I self-host Semlify?",
      a: "On Enterprise only. We ship a Docker Compose bundle with Postgres, Neo4j and the API for customers with strict data-residency requirements. Get in touch to see the deployment guide."
    },
    {
      q: "What happens at the concept ceiling?",
      a: "We surface a soft block at 100% \u2014 the editor stays read-write, but creating new concepts shows an inline upgrade prompt. Existing data stays intact. No silent failures."
    },
    {
      q: "Do you offer a startup discount?",
      a: "Yes \u2014 50% off the Team plan for two years for companies under $5M ARR or 10 employees. Apply via hello@semlify.com with a one-line description of what you're building."
    },
    {
      q: "How do you handle GDPR?",
      a: "Semlify is hosted in EU regions for European customers (Pro and above). We sign DPAs, maintain a public sub-processors list, and our Standard Contractual Clauses cover non-EU data flows. See /security for the full posture."
    },
    {
      q: "What's covered by the SLA?",
      a: "Team: 99.5% monthly uptime, credit on next invoice up to 5%. Business: 99.9%, up to 10%. Enterprise: 99.95% (negotiable higher), up to 20% or as contracted. Full terms at /legal/sla."
    },
    {
      q: "Can I switch tiers?",
      a: "Up at any time, prorated to the current billing cycle. Down at the end of the cycle, with a usage check \u2014 if you're above the lower tier's limits, the UI walks you through what to archive first."
    }
  ];
  const pricingJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://semlify.com/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing",
          item: "https://semlify.com/pricing"
        }
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pricing \u2014 Semlify", "description": "Workspace-based pricing with no per-seat tax. Free tier to evaluate, Team for production AI, Business for compliance, Enterprise for self-host and custom contracts.", "current": "/pricing", "jsonLd": pricingJsonLd }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page text-center"> <p class="text-eyebrow">Pricing</p> <h1 class="text-display mt-3" style="font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);">
One workspace, one fair price.
</h1> <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);">
No per-seat tax. Invite your whole team. Pay for what you store and
        how often you read it.
</p> </div> </section>  <section class="py-12 md:py-24"> <div class="container-page"> ${renderComponent($$result2, "PricingTable", PricingTable, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/PricingTable.tsx", "client:component-export": "default" })} </div> </section>  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page"> <header class="mx-auto mb-10 max-w-2xl text-center"> <p class="text-eyebrow">Add-ons</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Top up what you need, when you need it.
</h2> </header> <div class="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"> ${[
    {
      title: "+5,000 concepts",
      price: "$99/mo",
      body: "Stack up to four for an extra 20,000 concepts on Team."
    },
    {
      title: "+1M API calls",
      price: "$49/mo",
      body: "Heavy RAG pipelines that re-index daily can attach as many as needed."
    },
    {
      title: "AI pack",
      price: "$199/mo",
      body: "Higher rate limits on alt-label, translation and duplicate detection AI helpers."
    }
  ].map((a) => renderTemplate`<div class="marketing-card"> <div class="text-[13px] font-bold uppercase tracking-wider" style="color: var(--violet-11);"> ${a.title} </div> <div class="mt-2 text-[28px] font-bold tracking-tight" style="color: var(--gray-12); font-variant-numeric: tabular-nums;"> ${a.price} </div> <p class="mt-2 text-[13.5px] leading-relaxed" style="color: var(--gray-11);"> ${a.body} </p> </div>`)} </div> </div> </section>  <section class="py-20 md:py-28"> <div class="container-page"> <header class="mx-auto mb-12 max-w-2xl text-center"> <p class="text-eyebrow">Frequently asked</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Common questions, direct answers.
</h2> </header> <div class="mx-auto max-w-3xl space-y-3"> ${faqs.map((faq) => renderTemplate`<details class="group rounded-[var(--radius-4)] p-5 transition-colors" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4);"> <summary class="cursor-pointer list-none text-[15px] font-semibold" style="color: var(--gray-12);"> <span class="flex items-start justify-between gap-4"> <span>${faq.q}</span> <span class="shrink-0 transition-transform group-open:rotate-45" style="color: var(--gray-9); font-size: 22px; line-height: 1;">
+
</span> </span> </summary> <p class="mt-3 text-[14px] leading-relaxed" style="color: var(--gray-11);"> ${faq.a} </p> </details>`)} </div> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Ready to ship a versioned ontology?", "subtitle": "Start with the Free tier. Upgrade when your RAG pipeline outgrows it.", "primaryLabel": "Start free", "secondaryLabel": "See enterprise plans", "secondaryHref": "mailto:hello@semlify.com?subject=Enterprise%20pricing" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/pricing.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
