import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Subprocessors = createComponent(($$result, $$props, $$slots) => {
  const subprocessors = [
    {
      name: "Neo4j Aura",
      purpose: "Graph database (concepts, relations, schemes)",
      region: "EU (Frankfurt) / US (Virginia)",
      location: "Sweden / United States"
    },
    {
      name: "Render",
      purpose: "Application hosting (web app, API, worker)",
      region: "EU / US",
      location: "United States"
    },
    {
      name: "Clerk",
      purpose: "Authentication and user management",
      region: "Global",
      location: "United States"
    },
    {
      name: "Stripe",
      purpose: "Billing, subscriptions, tax",
      region: "Global",
      location: "United States"
    },
    {
      name: "Resend",
      purpose: "Transactional email",
      region: "EU",
      location: "European Union"
    },
    {
      name: "Cloudflare R2",
      purpose: "Object storage (file uploads, exports)",
      region: "Global",
      location: "United States"
    },
    {
      name: "Cloudflare",
      purpose: "CDN, WAF, bot management",
      region: "Global",
      location: "United States"
    },
    {
      name: "Sentry",
      purpose: "Application error tracking",
      region: "EU available",
      location: "United States"
    },
    {
      name: "Better Stack",
      purpose: "Status page, log aggregation, uptime monitoring",
      region: "EU",
      location: "European Union"
    },
    {
      name: "PostHog",
      purpose: "Product analytics (in-product)",
      region: "EU available",
      location: "United States"
    }
  ];
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sub-processors",
        item: "https://semlify.com/legal/subprocessors"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sub-processors \u2014 Semlify", "description": "The third parties Semlify engages to deliver the Service, with their purpose and processing region. Updated whenever we add or replace one.", "current": "/legal/subprocessors", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="container-page mx-auto max-w-4xl py-16 md:py-24"> <p class="text-eyebrow">Legal · Sub-processors</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2vw, 3rem);">
Sub-processors
</h1> <p class="mt-4 text-[14px]" style="color: var(--gray-11);">
Last updated: 25 April 2026
</p> <p class="mt-8 text-[16px] leading-relaxed" style="color: var(--gray-12);">
Semlify engages the following sub-processors to deliver the Service.
      We give 30 days' notice via email and on this page before adding or
      replacing any sub-processor that touches Customer Data. Procurement teams
      can subscribe to changes by emailing
<a href="mailto:privacy@semlify.com?subject=Subscribe%20to%20sub-processor%20updates" style="color: var(--accent-11);">privacy@semlify.com</a>.
</p> <div class="mt-10 overflow-hidden rounded-[var(--radius-4)]" style="border: 1px solid var(--gray-a4); background: var(--color-panel-solid);"> <div class="overflow-x-auto"> <table class="w-full text-[13.5px]"> <thead style="background: var(--gray-2); border-bottom: 1px solid var(--gray-a4);"> <tr> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11); white-space: nowrap;">Vendor</th> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11);">Purpose</th> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11); white-space: nowrap;">Region(s)</th> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11); white-space: nowrap;">HQ</th> </tr> </thead> <tbody> ${subprocessors.map((s, i) => renderTemplate`<tr${addAttribute(`${i !== 0 ? "border-top: 1px solid var(--gray-a3);" : ""}`, "style")}> <td class="px-4 py-3 font-medium" style="color: var(--gray-12); white-space: nowrap;"> ${s.name} </td> <td class="px-4 py-3" style="color: var(--gray-11);"> ${s.purpose} </td> <td class="px-4 py-3" style="color: var(--gray-11); white-space: nowrap;"> ${s.region} </td> <td class="px-4 py-3" style="color: var(--gray-11); white-space: nowrap;"> ${s.location} </td> </tr>`)} </tbody> </table> </div> </div> <h2 class="mt-12 text-2xl font-bold tracking-tight">Notification policy</h2> <p class="mt-3 text-[16px] leading-relaxed" style="color: var(--gray-12);">
We notify customers via email and update this page at least 30 days
      before adding or replacing any sub-processor that processes Customer
      Data. Customers may object to a new sub-processor on documented data
      protection grounds; in that case we work with the customer to find a
      reasonable resolution within 30 days, failing which the customer may
      terminate the affected service for cause.
</p> <h2 class="mt-12 text-2xl font-bold tracking-tight">International transfers</h2> <p class="mt-3 text-[16px] leading-relaxed" style="color: var(--gray-12);">
Where a sub-processor is located outside the European Economic Area, we
      rely on Standard Contractual Clauses (SCCs) approved by the European
      Commission to authorise the transfer, supplemented by the safeguards
      described in our DPA.
</p> </article> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Procurement evaluating Semlify?", "subtitle": "We respond to security questionnaires and DPA requests within one business day.", "primaryLabel": "Email procurement", "primaryHref": "mailto:hello@semlify.com?subject=Procurement%20evaluation", "secondaryLabel": "Security posture", "secondaryHref": "/security" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/legal/subprocessors.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/legal/subprocessors.astro";
const $$url = "/legal/subprocessors";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Subprocessors,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
