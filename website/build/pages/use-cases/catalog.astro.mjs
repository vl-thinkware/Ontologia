import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$UseCasePageNav, a as $$UseCaseHero } from '../../chunks/UseCaseHero_CkUIn6k0.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$TaxonomyTreeIllustration } from '../../chunks/TaxonomyTreeIllustration_Cc9FdzBG.mjs';
import { $ as $$SchemaCanvasIllustration } from '../../chunks/SchemaCanvasIllustration_p2M0w-dw.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Catalog = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Use cases", item: "https://semlify.com/use-cases/rag" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Multi-taxonomy catalogues",
        item: "https://semlify.com/use-cases/catalog"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Multi-taxonomy product catalogues \u2014 Semlify", "description": "One ontology, many taxonomies. Body styles, fuel types, segments, geographies \u2014 all sharing one T-Box. Stop fighting your CMS to model what's really a graph.", "current": "/use-cases/catalog", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "UseCasePageNav", $$UseCasePageNav, { "current": "/use-cases/catalog" })} ${renderComponent($$result2, "UseCaseHero", $$UseCaseHero, { "eyebrow": "Use case \xB7 Product catalogues", "title": "One T-Box, many taxonomies.", "subtitle": "The reference example: a Cars catalogue with five schemes \u2014 body styles, fuel types, market segments, manufacturing geography \u2014 all sharing the same classes. Built for retail, automotive, telecom, life sciences." })} ${maybeRenderHead()}<section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">The problem</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Your catalogue lives in three tools and none of them know it.
</h2> <p class="mt-5 text-[16px] leading-relaxed" style="color: var(--gray-11);">
Product information sits in your PIM. Categories sit in your CMS.
        Marketing facets sit in a Google Sheet. Each tool models part of the
        catalogue; none has the typed graph that connects them. Adding a new
        body style means three change requests across three vendors and two
        weeks of cross-checking.
</p> <p class="mt-4 text-[16px] leading-relaxed" style="color: var(--gray-11);">
The fix isn't a fourth tool. It's a single typed graph that hosts every
        taxonomy your team needs, all sharing the same classes — so when a
        Manufacturer is added, every scheme that uses Manufacturers can
        reference it without a migration.
</p> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "The shape", "title": "One T-Box, every scheme.", "body": "The Cars-style ontology defines nine classes once: Manufacturer, Model, Engine, BodyStyle, FuelType, DriveType, Segment, Country, Transmission. Five schemes layer on top, each curated independently \u2014 model catalogue, body-style taxonomy, fuel-type taxonomy, market segments, manufacturing geography.", "bullets": [
    "Each scheme has its own broader/narrower hierarchy",
    "Cross-scheme relations stay intact (a Model belongs to a Manufacturer in any scheme)",
    "Switching schemes in the UI is one click",
    "Search and bulk actions stay scoped to the active scheme"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "SchemaCanvasIllustration", $$SchemaCanvasIllustration, {})} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "In the editor", "title": "Curate every taxonomy from one place.", "body": "The Taxonomies tree shows every scheme in the same workspace. Drag-drop reparenting works inside a scheme. Cross-scheme moves are deliberately blocked \u2014 they'd imply a semantic redefinition, not a hierarchy tweak. The change history is shared across schemes so a single tag captures every edit.", "reverse": true, "bullets": [
    "Scheme switcher in the left rail \xB7 keyboard accessible",
    "Per-scheme breadcrumbs and counts",
    "Tag once, capture every scheme's state",
    "Export per scheme (SKOS Turtle) or full ontology (OWL XML)"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "TaxonomyTreeIllustration", $$TaxonomyTreeIllustration, {})} ` })}  <section class="py-16 md:py-20" style="background: var(--gray-2);"> <div class="container-page mx-auto max-w-5xl"> <header class="mx-auto mb-10 max-w-2xl text-center"> <p class="text-eyebrow">Industries that fit</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
The shape repeats everywhere.
</h2> </header> <div class="grid grid-cols-1 gap-5 md:grid-cols-3"> ${[
    {
      title: "Retail",
      body: "Products by department, by season, by sustainability tier, by price segment. Same SKUs; four scheme views."
    },
    {
      title: "Automotive",
      body: "Models by manufacturer, by body style, by fuel type, by market segment. Five schemes, one T-Box (the reference example we ship)."
    },
    {
      title: "Telecom",
      body: "Plans by tier, by family, by region, by use case. The cross-scheme relations are the value \u2014 a Plan's Family applies in every market view."
    },
    {
      title: "Pharma",
      body: "Compounds by therapeutic area, by mechanism, by trial phase, by molecule class. Curators specialise; the T-Box is shared."
    },
    {
      title: "Media",
      body: "Content by genre, by audience, by mood, by editorial framing. The same library, four entry points for downstream apps."
    },
    {
      title: "Insurance",
      body: "Risks by line of business, by jurisdiction, by perils, by reinsurance tier. Underwriters work in their scheme; portfolio managers see the union."
    }
  ].map((it, i) => renderTemplate`<div class="marketing-card" data-fade-up${addAttribute(String(Math.min(Math.floor(i / 3), 3)), "data-delay")}> <h3 class="text-[15px] font-bold" style="color: var(--gray-12);"> ${it.title} </h3> <p class="mt-2 text-[13.5px] leading-relaxed" style="color: var(--gray-11);"> ${it.body} </p> </div>`)} </div> </div> </section>  <section class="py-16 md:py-20"> <div class="container-page mx-auto max-w-3xl"> <p class="text-eyebrow">Your first week</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Catalogue → ontology → API.
</h2> <ol class="mt-8 space-y-6"> ${[
    {
      h: "Day 1 \xB7 Import your master catalogue",
      p: "CSV wizard maps your existing columns to ConceptClass attributes. The dry-run preview catches missing required fields before anything writes."
    },
    {
      h: "Day 2 \xB7 Build your first scheme",
      p: "Create a hierarchy from your data. Drag-drop reparenting on the tree view. Tag v0.1 once it stabilises."
    },
    {
      h: "Day 3 \xB7 Add a second scheme",
      p: "Same T-Box. New scheme. The Concepts already exist \u2014 you're just curating a different view of them."
    },
    {
      h: "Day 4\u20135 \xB7 Wire downstream",
      p: "Ship the API call to your e-commerce, search, BI, or LLM pipeline. SKOS Turtle for search, JSON-LD for RAG, CSV for analysis."
    },
    {
      h: "Day 6\u20137 \xB7 Invite the curators",
      p: "Per-scheme curators get edit rights. The validation panel keeps everyone honest. Tags continue to roll forward."
    }
  ].map((step, i) => renderTemplate`<li class="flex gap-4" data-fade-up${addAttribute(String(Math.min(i, 3)), "data-delay")}> <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold" style="background: var(--accent-9); color: var(--accent-contrast);"> ${i + 1} </span> <div> <h3 class="text-[15px] font-bold" style="color: var(--gray-12);"> ${step.h} </h3> <p class="mt-1 text-[14px] leading-relaxed" style="color: var(--gray-11);"> ${step.p} </p> </div> </li>`)} </ol> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Catalogue. Curate. Connect.", "subtitle": "The Cars starter is loaded by default \u2014 clone it, rename it, replace the data." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/use-cases/catalog.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/use-cases/catalog.astro";
const $$url = "/use-cases/catalog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catalog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
