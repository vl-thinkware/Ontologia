import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_irxFjrx1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_DmN7icRB.mjs';
export { renderers } from '../../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy Policy \u2014 Ontologia", "description": "How Ontologia collects, processes and protects personal data." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="container-page mx-auto max-w-prose py-16 md:py-24"> <p class="text-eyebrow">Legal</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2vw, 3rem);">
Privacy Policy
</h1> <p class="mt-4 text-[14px]" style="color: var(--gray-11);">
Last updated: 25 April 2026
</p> <div style="color: var(--gray-12); font-size: 16px; line-height: 1.7;"> <p class="mt-10">
Ontologia is a product of Thinkware SAS ("we", "us"), registered in
        France. This Policy describes the personal data we collect, why we
        collect it, and your rights under the GDPR.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">1. What we collect</h2> <ul class="mt-3 list-disc pl-6 space-y-2"> <li> <strong>Account data</strong>: name, email, organisation, password
          hash. Provided by you or your IdP.
</li> <li> <strong>Usage data</strong>: pages visited, actions taken, error
          reports. Captured for product analytics and support.
</li> <li> <strong>Customer Data</strong>: the ontologies, concepts and
          relations you create. We process these on your behalf to provide
          the Service.
</li> <li> <strong>Billing data</strong>: card last 4, billing address. Held
          by Stripe; we never see card numbers.
</li> </ul> <h2 class="mt-10 text-2xl font-bold tracking-tight">2. Why we process</h2> <p class="mt-3">
Lawful bases under GDPR Article 6:
<strong>contract</strong> (provide and bill the Service),
<strong>legitimate interest</strong> (product analytics, security
        monitoring, fraud prevention), and
<strong>consent</strong> (marketing emails &mdash; opt-in only).
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
3. Sub-processors
</h2> <p class="mt-3">
Our sub-processors are listed at
<a href="/legal/subprocessors" style="color: var(--accent-11);">ontologia.com/legal/subprocessors</a>. We give 30 days' notice before adding or replacing any.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
4. International transfers
</h2> <p class="mt-3">
EU customer data stays in EU regions for the application stack. Where
        a sub-processor is outside the EU, we rely on Standard Contractual
        Clauses (SCCs) to authorise the transfer.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
5. Retention
</h2> <p class="mt-3">
Customer Data is retained as long as your account is active. After
        termination, you have 30 days to export. We then delete within
        90 days, except where law requires longer (billing records: 7 years).
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">6. Your rights</h2> <p class="mt-3">
Under GDPR you may request access, correction, erasure, portability,
        and restriction of processing. Email
<a href="mailto:privacy@ontologia.com" style="color: var(--accent-11);">privacy@ontologia.com</a>; we respond within one month.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">7. Cookies</h2> <p class="mt-3">
We use only first-party essential cookies for authentication.
        PostHog (analytics) is configured cookieless on the marketing site.
        No third-party tracking, no advertising cookies.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">8. Contact</h2> <p class="mt-3">
Data Protection Contact: privacy@ontologia.com.<br>
Postal: Thinkware SAS &mdash; 75001 Paris, France.
</p> <p class="mt-10 text-[13.5px]" style="color: var(--gray-10);">
This document is a Phase-0 placeholder. The final policy will be
        reviewed and signed off by counsel before launch.
</p> </div> </article> ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/legal/privacy.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/legal/privacy.astro";
const $$url = "/legal/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
