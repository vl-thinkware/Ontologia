import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_irxFjrx1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DmN7icRB.mjs';
import { $ as $$PillarStrip } from '../chunks/PillarStrip_RRdgAroV.mjs';
import { $ as $$CtaBlock } from '../chunks/CtaBlock_CYpundBb.mjs';
import { Layers, ListTree, Table, Code2, ShieldCheck, Sparkles } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const features = [
    {
      icon: Layers,
      title: "Schema canvas",
      body: "An ER-style diagram of your T-Box. Drag classes, draw relations, edit attributes inline. SKOS slots are always present, custom attributes are typed and validated.",
      href: "/product/schema"
    },
    {
      icon: ListTree,
      title: "Taxonomies tree",
      body: "Per-scheme broader/narrower hierarchies with drag-drop reparenting. Cycle-safe, embedded with the full concept editor on the right.",
      href: "/product/taxonomies"
    },
    {
      icon: Table,
      title: "Tables view",
      body: "A sortable, filterable datagrid of every concept in a scheme. Bulk select to deprecate or tag. Backlinks and a live count of incoming relations on every row.",
      href: "/product/taxonomies"
    },
    {
      icon: Code2,
      title: "API + playground",
      body: "Five clean endpoints. Tag pinning, language negotiation, format negotiation. Try every call from the in-app playground before you write a line of integration code.",
      href: "/product/api"
    },
    {
      icon: ShieldCheck,
      title: "Governance & validation",
      body: "Live checks on every edit: orphan concepts, domain/range violations, duplicate prefLabels, deprecated-but-still-referenced. Click to jump to the offender.",
      href: "/product/governance"
    },
    {
      icon: Sparkles,
      title: "AI helpers",
      body: "Synonyms, translations, duplicate detection, class suggestion. All AI suggestions land as ordinary change events \u2014 accept, reject, or revert.",
      href: "/product/ai"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Product \u2014 Ontologia", "description": "Schema canvas, taxonomies tree, tables view, governed change history, validation panel, AI helpers, and a clean JSON-LD API. Everything you need to model a domain in one tool.", "current": "/product" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page text-center"> <p class="text-eyebrow">Product</p> <h1 class="text-display mt-3" style="font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);">
One graph. Every view you need.
</h1> <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);">
Schema, taxonomies, tables, history, validation, exports, API — all
        backed by the same versioned graph. Edit it from any side; ship it
        through the same endpoint.
</p> </div> </section> ${renderComponent($$result2, "PillarStrip", $$PillarStrip, { "eyebrow": "Why teams pick Ontologia", "title": "Built for the people who actually model meaning." })}  <section class="py-20 md:py-28" style="background: var(--gray-2);"> <div class="container-page"> <header class="mx-auto mb-14 max-w-2xl text-center"> <p class="text-eyebrow">Surfaces</p> <h2 class="text-headline mt-3" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);">
Every view of the same graph.
</h2> </header> <ul class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" role="list"> ${features.map((f) => {
    const Icon = f.icon;
    return renderTemplate`<li> <a${addAttribute(f.href, "href")} class="marketing-card group block h-full no-underline"> <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-[var(--radius-3)]" style="background: var(--violet-3); color: var(--violet-11);"> ${renderComponent($$result2, "Icon", Icon, { "size": 20, "aria-hidden": "true" })} </div> <h3 class="text-lg font-bold tracking-tight" style="color: var(--gray-12);"> ${f.title} </h3> <p class="mt-2 text-[14.5px] leading-relaxed" style="color: var(--gray-11);"> ${f.body} </p> <div class="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold transition-colors" style="color: var(--accent-11);">
Learn more
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="transition-transform group-hover:translate-x-1"> <path d="M5 12h14"></path> <path d="m12 5 7 7-7 7"></path> </svg> </div> </a> </li>`;
  })} </ul> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": "See it on your own data.", "subtitle": "Free workspace. Cars-style starter pre-loaded. No credit card.", "primaryLabel": "Try free" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/product/index.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/product/index.astro";
const $$url = "/product";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
