import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$CtaBlock } from '../chunks/CtaBlock_Chml4FMl.mjs';
import { ShieldCheck, Globe2, Bug } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Security = createComponent(($$result, $$props, $$slots) => {
  const sections = [
    {
      icon: ShieldCheck,
      title: "Tenant isolation",
      body: "Each workspace's data is isolated at the database layer. No customer ever sees another customer's IRIs. Authorization is re-checked at the API layer on every read."
    },
    {
      icon: Globe2,
      title: "GDPR posture",
      body: "EU-incorporated. EU sub-processors where possible. DPA available on request. Standard Contractual Clauses cover any non-EU data flows."
    },
    {
      icon: Bug,
      title: "Disclosure",
      body: "Email security@semlify.com with what you found. We answer within one business day."
    }
  ];
  const onTheRoadmap = [
    "SOC 2 Type I \u2014 in scoping with our auditor",
    "First third-party penetration test",
    "SSO (SAML) for Business tier",
    "Audit log export over the API"
  ];
  const notYet = [
    "We don't have a SOC 2 letter yet.",
    "We don't have a published pentest report yet.",
    "We don't have SSO yet.",
    "We don't have a bug-bounty program yet."
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Security & GDPR posture \u2014 Semlify", "description": "Encryption, tenant isolation, GDPR posture, sub-processors, and our disclosure policy \u2014 plus an honest list of certifications we don't have yet.", "current": "/security" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page text-center"> <p class="text-eyebrow">Security</p> <h1 class="text-display mt-3" style="font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);">
Plain-language security.
</h1> <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);">
We're a small team building a multi-tenant SaaS. Below is what we have
        today, what's on the way, and what we don't have yet. The legal
        version lives in our DPA.
</p> </div> </section>  <section class="py-16 md:py-24"> <div class="container-page"> <header class="mx-auto mb-12 max-w-2xl text-center"> <p class="text-eyebrow">What we have today</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
The fundamentals, no theatre.
</h2> </header> <ul class="grid grid-cols-1 gap-5 md:grid-cols-3" role="list"> ${sections.map((s) => {
    const Icon = s.icon;
    return renderTemplate`<li class="marketing-card"> <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-[var(--radius-3)]" style="background: var(--violet-3); color: var(--violet-11);"> ${renderComponent($$result2, "Icon", Icon, { "size": 20, "aria-hidden": "true" })} </div> <h3 class="text-lg font-bold tracking-tight" style="color: var(--gray-12);"> ${s.title} </h3> <p class="mt-2 text-[14.5px] leading-relaxed" style="color: var(--gray-11);"> ${s.body} </p> </li>`;
  })} </ul> </div> </section>  <section class="py-16 md:py-24"> <div class="container-page grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12"> <div> <p class="text-eyebrow">On the way</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
What we're working toward.
</h2> <p class="mt-3 text-[15px] leading-relaxed" style="color: var(--gray-11);">
No committed dates. We'll publish each one when it's live, not
          before.
</p> <ul class="mt-6 space-y-2.5" role="list"> ${onTheRoadmap.map((line) => renderTemplate`<li class="flex items-start gap-2.5 text-[14.5px]" style="color: var(--gray-12);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--violet-11)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 4px; flex-shrink: 0;"> <path d="M20 6 9 17l-5-5"></path> </svg> <span>${line}</span> </li>`)} </ul> </div> <div> <p class="text-eyebrow">Not yet</p> <h2 class="text-headline mt-2" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
What we don't have yet.
</h2> <p class="mt-3 text-[15px] leading-relaxed" style="color: var(--gray-11);">
If procurement requires any of these, tell us — we'll be honest
          about the timeline and you can decide whether to wait.
</p> <ul class="mt-6 space-y-2.5" role="list"> ${notYet.map((line) => renderTemplate`<li class="flex items-start gap-2.5 text-[14.5px]" style="color: var(--gray-12);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 4px; flex-shrink: 0;"> <path d="M18 6 6 18"></path> <path d="m6 6 12 12"></path> </svg> <span>${line}</span> </li>`)} </ul> </div> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Questions about our posture?", "subtitle": "Email security@semlify.com. We answer within a business day.", "primaryLabel": "Email security", "primaryHref": "mailto:security@semlify.com", "secondaryLabel": "Read the SLA", "secondaryHref": "/legal/sla" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/security.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/security.astro";
const $$url = "/security";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Security,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
