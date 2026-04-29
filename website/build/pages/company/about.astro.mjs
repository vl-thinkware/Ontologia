import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const principles = [
    {
      title: "The graph is sacred.",
      body: "Every change is auditable, reversible and attributable. We append; we don't destroy."
    },
    {
      title: "One engine, any depth.",
      body: "Three classes or three hundred \u2014 same product, same storage, same API. Users don't grow out of a 'simple mode'; they just model more."
    },
    {
      title: "Make the hard thing visible.",
      body: "Hierarchy cycles, conflicting definitions, broken references, orphan concepts \u2014 the validation panel surfaces them. We don't hide complexity behind a friendly emoji."
    },
    {
      title: "Respect both sides of the keyboard.",
      body: "Same product must feel natural to a non-technical curator and to a staff data engineer consuming the API. Two audiences, one tool."
    },
    {
      title: "Interoperate with standards.",
      body: "SKOS, OWL, RDF, JSON-LD. We speak them so customers don't get locked in. The export is faithful enough to round-trip in Prot\xE9g\xE9."
    },
    {
      title: "Boring tech where it doesn't matter.",
      body: "React, Postgres, Node.js, Neo4j \u2014 well-understood pieces. The magic lives in the model, the versioning, and the UX. Not in stack novelty."
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
        name: "About",
        item: "https://semlify.com/company/about"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About Semlify \u2014 Built in Paris by Semlify SAS", "description": "Two founders, one bet: concepts will be managed like code, but by people who don't write code. Meet the team and principles behind Semlify.", "current": "/company/about", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page mx-auto max-w-3xl text-center"> <p class="text-eyebrow">About</p> <h1 class="text-display mt-3" style="font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);">
We're two founders who got tired of arguing about what a concept means.
</h1> <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);">
Semlify is a product of <strong style="color: var(--gray-12);">Semlify SAS</strong>, a French company building software that helps teams agree on
        meaning. Founded in 2025. Bootstrapped. Based in Paris.
</p> </div> </section>  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">The bet</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Concepts will be managed like code &mdash; but by people who don't
        write code.
</h2> <p class="mt-5 text-[16px] leading-relaxed" style="color: var(--gray-11);">
For five years, every team we worked with had the same problem. The
        glossary lived in a Confluence page nobody updated. The taxonomy lived
        in a Google Sheet nobody owned. The ontology &mdash; if anyone said
        the word &mdash; lived in a Protégé file two senior architects
        protected like a relic.
</p> <p class="mt-4 text-[16px] leading-relaxed" style="color: var(--gray-11);">
Meanwhile every engineer on the team was happily versioning, reviewing,
        tagging, and reverting code on a daily basis. The same primitives that
        made software collaboration work since 2008 had simply never made it
        across the aisle to the people modelling meaning.
</p> <p class="mt-4 text-[16px] leading-relaxed" style="color: var(--gray-11);">
Semlify is what happens when you take the muscle memory of GitHub
        and apply it to a typed graph of concepts &mdash; with a UI that a
        non-engineer can use without ever seeing a \`git diff\`.
</p> </div> </section>  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-4xl"> <p class="text-eyebrow">Founders</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Two people, complementary backgrounds.
</h2> <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"> ${[
    {
      name: "Alexandre Delplace",
      role: "Co-founder \xB7 Engineering & Architecture",
      body: "15 years building backend systems for data-heavy products. Previously: data architect at two scale-ups, contributor to open-source SKOS tooling. Lives in the Schema view.",
      initials: "AD",
      color: "var(--violet-9)"
    },
    {
      name: "Valentin Lemort",
      role: "Co-founder \xB7 Product & Design",
      body: "10 years shipping B2B SaaS with a deep bias for craft. Previously: product lead on three enterprise products. Lives in the Taxonomies tree.",
      initials: "VL",
      color: "var(--green-9)"
    }
  ].map((f) => renderTemplate`<div class="marketing-card" data-fade-up> <div class="flex items-center gap-3"> <span class="flex h-12 w-12 items-center justify-center rounded-full text-[15px] font-bold text-white"${addAttribute(`background: ${f.color};`, "style")}> ${f.initials} </span> <div> <h3 class="text-[15px] font-bold" style="color: var(--gray-12);"> ${f.name} </h3> <p class="text-[12.5px]" style="color: var(--gray-11);"> ${f.role} </p> </div> </div> <p class="mt-4 text-[14px] leading-relaxed" style="color: var(--gray-11);"> ${f.body} </p> </div>`)} </div> </div> </section>  <section class="py-16 md:py-24"> <div class="container-page mx-auto max-w-5xl"> <header class="mx-auto mb-12 max-w-2xl text-center"> <p class="text-eyebrow">Guiding principles</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
What we ship and what we don't.
</h2> </header> <ol class="grid grid-cols-1 gap-5 md:grid-cols-2" role="list"> ${principles.map((p, i) => renderTemplate`<li class="marketing-card" data-fade-up${addAttribute(String(Math.min(Math.floor(i / 2), 3)), "data-delay")}> <div class="flex items-start gap-3"> <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold" style="background: var(--accent-3); color: var(--accent-11);"> ${i + 1} </span> <div> <h3 class="text-[15px] font-bold" style="color: var(--gray-12);"> ${p.title} </h3> <p class="mt-2 text-[13.5px] leading-relaxed" style="color: var(--gray-11);"> ${p.body} </p> </div> </div> </li>`)} </ol> </div> </section>  <section class="py-16 md:py-20" style="background: var(--marketing-gradient-section); border-block: 1px solid var(--gray-a4);"> <div class="container-page mx-auto max-w-3xl text-center"> <p class="text-eyebrow">How we work</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);">
Bootstrapped, profitable, customer-led.
</h2> <p class="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
Three design partners. Profitable since month four. We ship every
        Friday and answer customer email ourselves. Want to talk?${" "} <a href="mailto:hello@semlify.com" style="color: var(--accent-11); font-weight: 500;">
hello@semlify.com
</a>.
</p> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Want to be a design partner?", "subtitle": "We open one workspace at a time. The earlier you start, the more your feedback shapes the product.", "primaryLabel": "Request access", "primaryHref": "mailto:hello@semlify.com?subject=Design%20partner%20interest", "secondaryLabel": "Read the vision", "secondaryHref": "/product" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/company/about.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/company/about.astro";
const $$url = "/company/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
