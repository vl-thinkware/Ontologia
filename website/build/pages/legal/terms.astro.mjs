import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
export { renderers } from '../../renderers.mjs';

const $$Terms = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: "https://semlify.com/legal/terms"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Terms of Service \u2014 Semlify", "description": "Semlify Terms of Service governing your use of the SaaS platform, the API, and any associated documentation.", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="container-page mx-auto max-w-prose py-16 md:py-24"> <p class="text-eyebrow">Legal</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2vw, 3rem);">
Terms of Service
</h1> <p class="mt-4 text-[14px]" style="color: var(--gray-11);">
Last updated: 25 April 2026
</p> <div class="prose-content mt-10" style="color: var(--gray-12); font-size: 16px; line-height: 1.7;"> <p>
These Terms govern your use of Semlify ("the Service"), provided by
        Semlify SAS, registered in France under SIREN&nbsp;[●●●●].
        By creating an account, you agree to these Terms.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">1. The Service</h2> <p class="mt-3">
Semlify is a multi-tenant SaaS for designing, versioning and serving
        ontologies. Features described at
<a href="/product" style="color: var(--accent-11);">semlify.com/product</a>
are provided "as is". The Service evolves continuously; we may add,
        modify or remove features with reasonable notice.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">2. Your account</h2> <p class="mt-3">
You are responsible for safeguarding your credentials and for all
        activity under your account. Notify us immediately at
<a href="mailto:security@semlify.com" style="color: var(--accent-11);">security@semlify.com</a> of any unauthorised use.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
3. Acceptable use
</h2> <p class="mt-3">
You may not use the Service to host content that is illegal, infringing,
        or violates third-party rights. You may not attempt to circumvent rate
        limits, reverse-engineer the Service, or use it to attack other systems.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
4. Subscriptions and billing
</h2> <p class="mt-3">
Plans renew automatically. You may cancel at any time; cancellation
        takes effect at the end of the current billing period. Refunds are
        prorated for downgrades, not for cancellations of paid periods already
        in progress.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
5. Data ownership
</h2> <p class="mt-3">
You retain all rights to ontologies, concepts, relations and other
        content you create on the Service ("Customer Data"). You grant us a
        limited license to host, process and serve Customer Data solely to
        provide the Service.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
6. Service level commitments
</h2> <p class="mt-3">
Service availability targets are set forth in our
<a href="/legal/sla" style="color: var(--accent-11);">SLA</a>. Service
        credits are the exclusive remedy for missed targets.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
7. Limitation of liability
</h2> <p class="mt-3">
To the maximum extent permitted by law, our aggregate liability under
        these Terms is limited to the amounts you paid us in the twelve months
        preceding the event giving rise to the claim. We are not liable for
        indirect, special, incidental or consequential damages.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">8. Termination</h2> <p class="mt-3">
We may suspend or terminate your account for material breach with
        reasonable notice and an opportunity to cure. We may suspend immediately
        for security or legal reasons. On termination you can export your
        Customer Data for 30 days.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">
9. Governing law
</h2> <p class="mt-3">
These Terms are governed by the laws of France. Disputes are subject to
        the exclusive jurisdiction of the courts of Paris, except where local
        consumer-protection law provides otherwise.
</p> <h2 class="mt-10 text-2xl font-bold tracking-tight">10. Changes</h2> <p class="mt-3">
We may update these Terms with at least 30 days' notice for material
        changes. Continued use of the Service after the effective date
        constitutes acceptance.
</p> <p class="mt-10 text-[13.5px]" style="color: var(--gray-10);">
This document is a Phase-0 placeholder. The legally binding terms will
        be reviewed and signed off by counsel before launch. Until then, please
        consider this an indicative draft.
</p> </div> </article> ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/legal/terms.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/legal/terms.astro";
const $$url = "/legal/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
