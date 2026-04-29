import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_irxFjrx1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DmN7icRB.mjs';
import { $ as $$CtaBlock } from '../chunks/CtaBlock_CYpundBb.mjs';
import { Lock, Globe2, ShieldCheck, Server, FileCheck2, Bug } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Security = createComponent(($$result, $$props, $$slots) => {
  const sections = [
    {
      icon: Lock,
      title: "Encryption",
      body: "TLS 1.3 in transit. AES-256 at rest. Customer secrets (API keys, OAuth tokens) sealed in a per-org KMS envelope. Postgres TDE optional on Business+."
    },
    {
      icon: Globe2,
      title: "Data residency",
      body: "Pro and above pick their region at workspace creation: EU (Frankfurt) or US (Virginia). Enterprise can pin to a dedicated single-region Neo4j cluster."
    },
    {
      icon: ShieldCheck,
      title: "Tenant isolation",
      body: "Postgres row-level security on every tenant-scoped table. Neo4j databases dedicated per Enterprise customer; logical isolation by org_id below that."
    },
    {
      icon: Server,
      title: "Compliance roadmap",
      body: "SOC 2 Type I within 12 months of GA. Type II within 24 months. ISO 27001 once we cross 25 paying workspaces. GDPR-aligned from day one (EU-incorporated, EU sub-processors)."
    },
    {
      icon: FileCheck2,
      title: "Audit & logging",
      body: "Every privileged operation lands in the audit log. Customers on Business+ can export the audit log via API. Read replicas of the log retained for 13 months."
    },
    {
      icon: Bug,
      title: "Disclosure",
      body: "We respond to security reports within one business day. Bounty program launches with the first paid pentest. Responsible disclosure: security@ontologia.com."
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Security \u2014 Ontologia", "description": "Encryption, tenant isolation, regional data residency, audit logs, SOC 2 roadmap, and our security disclosure policy.", "current": "/security" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page text-center"> <p class="text-eyebrow">Security</p> <h1 class="text-display mt-3" style="font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);">
Built for the people procurement audits.
</h1> <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);">
We're a small team that takes security seriously. This page is the
        plain-language version; the technical posture lives in our DPA.
</p> </div> </section>  <section class="py-16 md:py-24"> <div class="container-page"> <ul class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" role="list"> ${sections.map((s) => {
    const Icon = s.icon;
    return renderTemplate`<li class="marketing-card"> <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-[var(--radius-3)]" style="background: var(--violet-3); color: var(--violet-11);"> ${renderComponent($$result2, "Icon", Icon, { "size": 20, "aria-hidden": "true" })} </div> <h3 class="text-lg font-bold tracking-tight" style="color: var(--gray-12);"> ${s.title} </h3> <p class="mt-2 text-[14.5px] leading-relaxed" style="color: var(--gray-11);"> ${s.body} </p> </li>`;
  })} </ul> </div> </section>  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Sub-processors</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
Who we trust with your data.
</h2> <p class="mt-3 text-[15px] leading-relaxed" style="color: var(--gray-11);">
We give 30 days' notice before adding or replacing a sub-processor.
        The full list lives at
<a href="/legal/subprocessors" style="color: var(--accent-11); font-weight: 500;">ontologia.com/legal/subprocessors</a>.
</p> <div class="mt-6 overflow-hidden rounded-[var(--radius-4)]" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4);"> <table class="w-full text-[13.5px]"> <thead> <tr style="border-bottom: 1px solid var(--gray-a4); background: var(--gray-2);"> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11);">Vendor</th> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11);">Purpose</th> <th class="px-4 py-3 text-left font-semibold" style="color: var(--gray-11);">Region</th> </tr> </thead> <tbody> ${[
    ["Neo4j Aura", "Graph database", "EU / US"],
    ["Render", "Application hosting", "EU / US"],
    ["Clerk", "Authentication", "US"],
    ["Stripe", "Billing", "Global"],
    ["Resend", "Transactional email", "EU"],
    ["Cloudflare R2", "Object storage", "Global"],
    ["Sentry", "Error tracking", "US"]
  ].map((row, i) => renderTemplate`<tr${addAttribute(`${i !== 0 ? "border-top: 1px solid var(--gray-a3);" : ""}`, "style")}> <td class="px-4 py-3 font-medium" style="color: var(--gray-12);"> ${row[0]} </td> <td class="px-4 py-3" style="color: var(--gray-11);"> ${row[1]} </td> <td class="px-4 py-3" style="color: var(--gray-11);"> ${row[2]} </td> </tr>`)} </tbody> </table> </div> </div> </section>  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl rounded-[var(--radius-5)] p-10 md:p-14" style="background: var(--marketing-gradient-section); border: 1px solid var(--gray-a4);"> <h2 class="text-headline" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
Found something?
</h2> <p class="mt-3 text-[15px] leading-relaxed" style="color: var(--gray-11);">
Email
<a href="mailto:security@ontologia.com" style="color: var(--accent-11); font-weight: 500;">security@ontologia.com</a>
with your finding. PGP key fingerprint and bounty terms published
        when the bounty program goes live. We respond within one business day.
</p> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Need our DPA, SOC 2 letter, or pentest report?", "subtitle": "Email hello@ontologia.com \u2014 we'll send what we have, and a roadmap for what we don't yet.", "primaryLabel": "Request documents", "primaryHref": "mailto:hello@ontologia.com?subject=Security%20documents", "secondaryLabel": "Read the SLA", "secondaryHref": "/legal/sla" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/security.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/security.astro";
const $$url = "/security";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Security,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
