import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$ProductPageNav } from '../../chunks/ProductPageNav_CFwaH2pY.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$TaxonomyTreeIllustration } from '../../chunks/TaxonomyTreeIllustration_Cc9FdzBG.mjs';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Taxonomies = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Product", item: "https://semlify.com/product" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Taxonomies",
        item: "https://semlify.com/product/taxonomies"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Taxonomies \u2014 SKOS-aligned trees \xB7 Semlify", "description": "Build hierarchical concept schemes with SKOS broader/narrower, drag-drop reparenting, multilingual labels, and a tree view designed for day-to-day curators.", "current": "/product/taxonomies", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductPageNav", $$ProductPageNav, { "current": "/product/taxonomies" })} ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"> <div class="md:col-span-6" data-fade-up> <p class="text-eyebrow">Product · Taxonomies</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);">
Curate at the speed of thought.
</h1> <p class="mt-5 max-w-xl text-lg leading-relaxed" style="color: var(--gray-11);">
Each ConceptScheme is a SKOS-aligned tree. Drag a row to reparent it.
          Edit a concept inline. Switch language and see every label for every
          locale side by side. The keyboard works. The cycle detector works.
          The merge conflict dialog won't ever surprise you, because there is
          no merge — every change is a sequential, attributable event.
</p> <div class="mt-7 flex flex-wrap gap-3"> <a href="/access" class="btn-primary">Try free</a> <a href="/use-cases/catalog" class="btn-secondary">See multi-taxonomy use case</a> </div> </div> <div class="md:col-span-6" data-fade-up data-delay="1"> ${renderComponent($$result2, "TaxonomyTreeIllustration", $$TaxonomyTreeIllustration, {})} </div> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Schemes", "title": "Many trees, one ontology.", "body": "A single ontology can host as many ConceptSchemes as the team needs \u2014 Cars catalogue, body-style taxonomy, market segments, manufacturing geography \u2014 all sharing the same T-Box. Cross-scheme relations are first-class. Cross-scheme drag is intentionally blocked.", "bullets": [
    "Per-scheme breadcrumbs and tree views",
    "Switch schemes without leaving the page",
    "Search scoped to the active scheme by default",
    "Tag a scheme independently \u2014 pin one for production while another is in review"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "Scheme \xB7 Body Style Taxonomy", "code": `{
  "id": "cs_body_styles",
  "name": "Body style taxonomy",
  "ontologyId": "ont_cars",
  "defaultLanguage": "en",
  "languages": ["en", "fr", "de"],
  "rootConceptIds": ["c_passenger", "c_commercial"]
}` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Drag-drop", "title": "Reparent without breaking.", "body": "Drop a concept onto another to rewrite its `broader` relation. The drop is rejected if it would create a cycle, and the reason is shown in a toast. The move records exactly one ChangeEvent \u2014 easy to revert if you change your mind.", "reverse": true, "bullets": [
    "Cycle detection on every drop",
    "Cross-scheme moves blocked with a friendly explanation",
    "One ChangeEvent per reparent, even on multi-level moves",
    "Undo / redo within the session before the change commits"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "TaxonomyTreeIllustration", $$TaxonomyTreeIllustration, {})} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Multilingual", "title": "Every label, in every language.", "body": "prefLabel, altLabel, and hiddenLabel are language-tagged at the concept level. Edit them side by side in the Concept detail's multilingual view, or one at a time from the inspector. The downstream API negotiates language via `?lang=`.", "bullets": [
    "Side-by-side editor for every workspace language",
    "Auto-translate suggestions in the AI tab (review before accepting)",
    "Default language fallback on missing translations",
    "Notation field is language-neutral by SKOS convention"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "Concept \xB7 Toyota Camry \u2014 multilingual", "code": `{
  "id": "c_camry",
  "labels": {
    "prefLabel": [
      { "lang": "en", "value": "Toyota Camry" },
      { "lang": "fr", "value": "Toyota Camry" },
      { "lang": "ja", "value": "\u30C8\u30E8\u30BF\u30FB\u30AB\u30E0\u30EA" }
    ],
    "altLabel": [
      { "lang": "en", "value": "Camry XSE" },
      { "lang": "en", "value": "2026 Toyota Camry" }
    ]
  }
}` })} ` })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Stop fighting your taxonomy.", "subtitle": "Free workspace. Drag-drop tree. Real multilingual support." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/taxonomies.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/taxonomies.astro";
const $$url = "/product/taxonomies";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Taxonomies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
