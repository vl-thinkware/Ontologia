import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
import { $ as $$ProductPageNav } from '../../chunks/ProductPageNav_CFwaH2pY.mjs';
import { $ as $$ProductFeatureBlock } from '../../chunks/ProductFeatureBlock_DS6uqNcp.mjs';
import { $ as $$SchemaCanvasIllustration } from '../../chunks/SchemaCanvasIllustration_p2M0w-dw.mjs';
import { $ as $$CodeBlock } from '../../chunks/CodeBlock_B5DGfVJN.mjs';
import { $ as $$CtaBlock } from '../../chunks/CtaBlock_Chml4FMl.mjs';
export { renderers } from '../../renderers.mjs';

const $$Schema = createComponent(($$result, $$props, $$slots) => {
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://semlify.com/" },
      { "@type": "ListItem", position: 2, name: "Product", item: "https://semlify.com/product" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Schema editor",
        item: "https://semlify.com/product/schema"
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Schema editor \u2014 Semlify", "description": "Design your T-Box visually: classes with typed attributes, relation types with domain and range, six SKOS slots on every class, and an ER-style canvas of the whole shape.", "current": "/product/schema", "jsonLd": breadcrumbsLd }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProductPageNav", $$ProductPageNav, { "current": "/product/schema" })}  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-12"> <div class="md:col-span-6" data-fade-up> <p class="text-eyebrow">Product · Schema editor</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);">
The T-Box, designed visually.
</h1> <p class="mt-5 max-w-xl text-lg leading-relaxed" style="color: var(--gray-11);">
Classes with typed attributes. Relation types with explicit domain and
          range. The six SKOS slots — prefLabel, altLabel, hiddenLabel,
          definition, notation, example — present on every class without
          configuration.
</p> <div class="mt-7 flex flex-wrap gap-3"> <a href="/access" class="btn-primary">
Try free
</a> <a href="/product" class="btn-secondary">All product features</a> </div> </div> <div class="md:col-span-6" data-fade-up data-delay="1"> ${renderComponent($$result2, "SchemaCanvasIllustration", $$SchemaCanvasIllustration, {})} </div> </div> </section> ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Classes", "title": "Type-safe by default.", "body": "A ConceptClass is more than a label. It carries typed attributes (string, number, boolean, enum, date, reference, money), required and localizable flags, and the SKOS slots that downstream consumers expect. Add a class and your schema is the spec.", "bullets": [
    "Seven attribute types covering most real-world domains",
    "Required + localizable flags wired into validation",
    "SKOS-aligned built-ins \u2014 never re-declare them",
    "Color-coded so the canvas stays readable at scale"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "ConceptClass \xB7 Manufacturer", "code": `{
  "id": "cc_manufacturer",
  "name": "Manufacturer",
  "color": "violet",
  "properties": [
    { "key": "name",     "type": "string",    "required": true,  "localizable": true },
    { "key": "country",  "type": "reference", "required": true },
    { "key": "founded",  "type": "date" },
    { "key": "website",  "type": "string" }
  ]
}` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "Relations", "title": "Domain and range, enforced.", "body": "Every relation type points at a domain class and a range class. The Validation panel surfaces the moment a concept slips out of bounds. The Canvas honors them when you draw a new edge \u2014 the picker only shows relation types the endpoints can carry.", "reverse": true, "bullets": [
    "Filtered relation picker on canvas drag-to-connect",
    "Live domain / range violation warnings",
    "Built-in transitive `broader` for hierarchical schemes",
    "Symmetric flag for relations like `relatedTo`"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "json", "filename": "RelationType \xB7 poweredBy", "code": `{
  "id": "rt_powered_by",
  "name": "poweredBy",
  "domainClassId": "cc_model",
  "rangeClassId":  "cc_engine",
  "isTransitive": false,
  "isSymmetric":  false,
  "isBuiltIn":    false
}` })} ` })} ${renderComponent($$result2, "ProductFeatureBlock", $$ProductFeatureBlock, { "eyebrow": "The canvas", "title": "See the whole shape at once.", "body": "A hub-and-spoke ER layout you can drag freely. Built-in `broader` edges dashed. User-defined edges solid violet. Clicking a class opens the inspector with instance counts, custom attributes, and every relation type the class participates in \u2014 as domain and as range.", "bullets": [
    "Single-click selection \xB7 double-click to deep-edit",
    "Click an edge to surface its domain \u2192 range pair",
    "Auto-fit to viewport, manual zoom, no minimap clutter",
    "Reduced-motion friendly \u2014 animations gate on `prefers-reduced-motion`"
  ] }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "SchemaCanvasIllustration", $$SchemaCanvasIllustration, {})} ` })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "Design the T-Box you've always wanted.", "subtitle": "Free workspace. Cars-style starter pre-loaded. Ten minutes to your first class." })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/schema.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/product/schema.astro";
const $$url = "/product/schema";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Schema,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
