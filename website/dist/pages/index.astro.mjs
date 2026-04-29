import { c as createComponent, m as maybeRenderHead, a as renderTemplate, d as createAstro, b as addAttribute, r as renderComponent, e as renderSlot } from '../chunks/astro/server_irxFjrx1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DmN7icRB.mjs';
import 'clsx';
/* empty css                                 */
import { $ as $$PillarStrip } from '../chunks/PillarStrip_RRdgAroV.mjs';
import { $ as $$CtaBlock } from '../chunks/CtaBlock_CYpundBb.mjs';
export { renderers } from '../renderers.mjs';

const $$SchemaIllustration = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="relative mx-auto w-full max-w-[520px]" role="img" aria-label="Diagram showing how an Ontologia schema flows into taxonomies and is served via API" data-astro-cid-7lpzixgh> <svg viewBox="0 0 520 460" xmlns="http://www.w3.org/2000/svg" class="h-auto w-full" data-astro-cid-7lpzixgh> <defs data-astro-cid-7lpzixgh> <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1" data-astro-cid-7lpzixgh> <stop offset="0" stop-color="var(--color-panel-solid)" data-astro-cid-7lpzixgh></stop> <stop offset="1" stop-color="var(--gray-2)" data-astro-cid-7lpzixgh></stop> </linearGradient> <linearGradient id="violetGrad" x1="0" y1="0" x2="1" y2="1" data-astro-cid-7lpzixgh> <stop offset="0" stop-color="var(--violet-9)" data-astro-cid-7lpzixgh></stop> <stop offset="1" stop-color="var(--violet-11)" data-astro-cid-7lpzixgh></stop> </linearGradient> <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%" data-astro-cid-7lpzixgh> <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgb(15 23 42)" flood-opacity="0.06" data-astro-cid-7lpzixgh></feDropShadow> </filter> </defs> <!-- Background dots, very subtle --> <g style="opacity: 0.35;" data-astro-cid-7lpzixgh> <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" data-astro-cid-7lpzixgh> <circle cx="1" cy="1" r="1" fill="var(--gray-a4)" data-astro-cid-7lpzixgh></circle> </pattern> <rect width="520" height="460" fill="url(#dots)" data-astro-cid-7lpzixgh></rect> </g> <!-- Card 1: T-Box (Schema) --> <g class="card card-1" filter="url(#cardShadow)" data-astro-cid-7lpzixgh> <rect x="20" y="40" width="180" height="160" rx="12" fill="url(#cardGrad)" stroke="var(--gray-a5)" stroke-width="1" data-astro-cid-7lpzixgh></rect> <text x="36" y="62" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="var(--violet-11)" letter-spacing="0.12em" data-astro-cid-7lpzixgh>T-BOX · SCHEMA</text> <text x="36" y="84" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="var(--gray-12)" data-astro-cid-7lpzixgh>Manufacturer</text> <line x1="36" y1="92" x2="184" y2="92" stroke="var(--gray-a4)" stroke-width="1" data-astro-cid-7lpzixgh></line> <text x="36" y="108" font-family="ui-monospace, monospace" font-size="10" fill="var(--gray-11)" data-astro-cid-7lpzixgh>name : string</text> <text x="36" y="124" font-family="ui-monospace, monospace" font-size="10" fill="var(--gray-11)" data-astro-cid-7lpzixgh>country : reference</text> <text x="36" y="140" font-family="ui-monospace, monospace" font-size="10" fill="var(--gray-11)" data-astro-cid-7lpzixgh>founded : date</text> <!-- Relation pill --> <rect x="36" y="156" width="148" height="22" rx="4" fill="var(--violet-3)" data-astro-cid-7lpzixgh></rect> <text x="44" y="171" font-family="ui-monospace, monospace" font-size="10" fill="var(--violet-11)" font-weight="600" data-astro-cid-7lpzixgh>manufactures → Model</text> </g> <!-- Card 2: A-Box (Taxonomies) --> <g class="card card-2" filter="url(#cardShadow)" transform="translate(0,0)" data-astro-cid-7lpzixgh> <rect x="170" y="160" width="180" height="160" rx="12" fill="url(#cardGrad)" stroke="var(--gray-a5)" stroke-width="1" data-astro-cid-7lpzixgh></rect> <text x="186" y="182" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="var(--green-11)" letter-spacing="0.12em" data-astro-cid-7lpzixgh>A-BOX · TAXONOMY</text> <text x="186" y="204" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="var(--gray-12)" data-astro-cid-7lpzixgh>Model catalogue</text> <line x1="186" y1="212" x2="334" y2="212" stroke="var(--gray-a4)" stroke-width="1" data-astro-cid-7lpzixgh></line> <!-- Tree items --> <g font-family="Inter, sans-serif" font-size="11" fill="var(--gray-12)" data-astro-cid-7lpzixgh> <circle cx="194" cy="232" r="3" fill="var(--violet-9)" data-astro-cid-7lpzixgh></circle> <text x="204" y="236" data-astro-cid-7lpzixgh>Toyota</text> <circle cx="208" cy="252" r="3" fill="var(--green-9)" data-astro-cid-7lpzixgh></circle> <text x="218" y="256" fill="var(--gray-11)" data-astro-cid-7lpzixgh>Camry</text> <circle cx="208" cy="272" r="3" fill="var(--green-9)" data-astro-cid-7lpzixgh></circle> <text x="218" y="276" fill="var(--gray-11)" data-astro-cid-7lpzixgh>Corolla</text> <circle cx="194" cy="292" r="3" fill="var(--violet-9)" data-astro-cid-7lpzixgh></circle> <text x="204" y="296" data-astro-cid-7lpzixgh>Honda</text> </g> <!-- Connector lines between tree --> <path d="M 194 235 L 194 252 L 205 252" stroke="var(--gray-a6)" stroke-width="1" fill="none" data-astro-cid-7lpzixgh></path> <path d="M 194 252 L 194 272 L 205 272" stroke="var(--gray-a6)" stroke-width="1" fill="none" data-astro-cid-7lpzixgh></path> </g> <!-- Card 3: API --> <g class="card card-3" filter="url(#cardShadow)" data-astro-cid-7lpzixgh> <rect x="320" y="280" width="180" height="140" rx="12" fill="var(--gray-12)" stroke="var(--gray-a6)" stroke-width="1" data-astro-cid-7lpzixgh></rect> <text x="336" y="302" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="var(--violet-7)" letter-spacing="0.12em" data-astro-cid-7lpzixgh>API · JSON-LD</text> <g font-family="ui-monospace, monospace" font-size="10" fill="var(--gray-3)" data-astro-cid-7lpzixgh> <text x="336" y="322" data-astro-cid-7lpzixgh>GET /v1/concepts</text> <text x="336" y="338" fill="var(--gray-7)" data-astro-cid-7lpzixgh> ?tag=v1.3</text> <text x="336" y="354" fill="var(--gray-7)" data-astro-cid-7lpzixgh> &amp;lang=en</text> <text x="336" y="378" fill="var(--green-7)" data-astro-cid-7lpzixgh>200 OK</text> <text x="336" y="394" fill="var(--gray-5)" data-astro-cid-7lpzixgh>${'{ "data": [...] }'}</text> </g> </g> <!-- Connector arrows (T-Box → A-Box → API) --> <g stroke="var(--violet-9)" stroke-width="1.75" fill="none" stroke-linecap="round" stroke-dasharray="0" data-astro-cid-7lpzixgh> <path d="M 200 130 C 230 130, 230 200, 220 220" opacity="0.55" data-astro-cid-7lpzixgh></path> <path d="M 350 240 C 380 240, 380 290, 380 300" opacity="0.55" data-astro-cid-7lpzixgh></path> </g> <g fill="var(--violet-9)" style="opacity: 0.65;" data-astro-cid-7lpzixgh> <circle cx="220" cy="220" r="3" data-astro-cid-7lpzixgh></circle> <circle cx="380" cy="300" r="3" data-astro-cid-7lpzixgh></circle> </g> </svg> </div> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/SchemaIllustration.astro", void 0);

const $$Astro$3 = createAstro("https://ontologia.com");
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Hero;
  const {
    eyebrow = "Private beta \xB7 April 2026",
    title,
    subtitle,
    primaryCtaLabel = "Try free",
    primaryCtaHref = "https://app.ontologia.com/signup",
    secondaryCtaLabel = "Read the docs",
    secondaryCtaHref = "https://docs.ontologia.com",
    trustItems = [
      "Built on Neo4j",
      "SKOS / OWL / JSON-LD exports",
      "Free tier, no credit card"
    ]
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative overflow-hidden" style="background: var(--marketing-gradient-hero);"> <div class="container-page grid grid-cols-1 items-center gap-10 py-20 md:grid-cols-12 md:gap-12 md:py-28 lg:py-32"> <div class="md:col-span-7 animate-fade-up"> <div class="flex items-center gap-2"> <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium" style="background: var(--green-3); color: var(--green-11);"> <span class="h-1.5 w-1.5 rounded-full" style="background: var(--green-9);"></span> ${eyebrow} </span> </div> <h1 class="text-display mt-5">${title}</h1> <p class="mt-5 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);"> ${subtitle} </p> <div class="mt-7 flex flex-wrap items-center gap-3"> <a${addAttribute(primaryCtaHref, "href")} class="btn-primary" style="height: 44px; padding: 0 var(--space-5); font-size: var(--font-size-3);"> ${primaryCtaLabel} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <path d="M5 12h14"></path> <path d="m12 5 7 7-7 7"></path> </svg> </a> <a${addAttribute(secondaryCtaHref, "href")} class="btn-secondary" style="height: 44px; padding: 0 var(--space-5); font-size: var(--font-size-3);"> ${secondaryCtaLabel} </a> </div> <ul class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px]" style="color: var(--gray-10);" role="list"> ${trustItems.map((item) => renderTemplate`<li class="inline-flex items-center gap-1.5"> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <path d="M20 6 9 17l-5-5"></path> </svg> ${item} </li>`)} </ul> </div> <div class="md:col-span-5 animate-fade-up" style="animation-delay: 80ms;"> ${renderComponent($$result, "SchemaIllustration", $$SchemaIllustration, {})} </div> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Hero.astro", void 0);

const $$Astro$2 = createAstro("https://ontologia.com");
const $$WalkthroughStep = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$WalkthroughStep;
  const { step, title, body, reverse = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>:first-child]:order-2" : ""}`, "class")}> <div> <p class="text-eyebrow">Step ${step}</p> <h3 class="text-headline mt-2" style="font-size: clamp(1.75rem, 1rem + 2vw, 2.5rem);"> ${title} </h3> <p class="mt-4 max-w-md text-[15.5px] leading-relaxed" style="color: var(--gray-11);"> ${body} </p> </div> <div> ${renderSlot($$result, $$slots["default"])} </div> </div>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/WalkthroughStep.astro", void 0);

const $$Astro$1 = createAstro("https://ontologia.com");
const $$QuoteCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$QuoteCard;
  const {
    quote,
    author,
    role,
    initials = author.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    avatarColor = "var(--violet-9)"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-28"> <div class="container-page"> <figure class="mx-auto max-w-3xl rounded-[var(--radius-5)] p-10 md:p-14" style="background: var(--marketing-gradient-section); border: 1px solid var(--gray-a4);"> <svg class="mb-6" width="36" height="36" viewBox="0 0 24 24" fill="var(--violet-9)" aria-hidden="true"> <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"></path> </svg> <blockquote class="text-pull" style="color: var(--gray-12);"> ${quote} </blockquote> <figcaption class="mt-6 flex items-center gap-3"> <span class="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-white"${addAttribute(`background: ${avatarColor};`, "style")}> ${initials} </span> <div> <div class="text-[14px] font-semibold" style="color: var(--gray-12);"> ${author} </div> <div class="text-[12.5px]" style="color: var(--gray-11);"> ${role} </div> </div> </figcaption> </figure> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/QuoteCard.astro", void 0);

const $$Astro = createAstro("https://ontologia.com");
const $$CodeBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CodeBlock;
  const { language = "bash", code, filename } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="overflow-hidden rounded-[var(--radius-4)]" style="background: var(--gray-12); border: 1px solid var(--gray-a6);"> ${filename && renderTemplate`<div class="flex items-center justify-between px-4 py-2" style="background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.08);"> <span class="font-mono text-[11px]" style="color: var(--gray-3);"> ${filename} </span> <span class="rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style="background: rgba(255,255,255,0.08); color: var(--gray-5);"> ${language} </span> </div>`} <pre class="overflow-x-auto px-4 py-4" style="margin: 0; font-family: var(--code-font-family); font-size: 13px; line-height: 1.7; color: var(--gray-2);"><code>${code}</code></pre> </div>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/CodeBlock.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Ontologia \u2014 The source of truth for your concepts", "description": "Design, version and ship the ontology your AI and data pipelines depend on. SKOS-aligned, graph-native, with revertable change history and a stable JSON-LD API." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "title": "The source of truth for your concepts.", "subtitle": "Design, version and ship the ontology your AI and data pipelines depend on. SKOS-aligned. Graph-native. Zero PhD required." })} ${renderComponent($$result2, "PillarStrip", $$PillarStrip, {})}  ${maybeRenderHead()}<section class="py-20 md:py-28" style="background: var(--gray-2);"> <div class="container-page"> <header class="mx-auto mb-16 max-w-2xl text-center"> <p class="text-eyebrow">How it works</p> <h2 class="text-headline mt-3">From schema to API in three moves.</h2> <p class="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
One graph behind every view. Edit it from any side &mdash; canvas,
          tree, table &mdash; and ship it through the same versioned API.
</p> </header> <div class="space-y-20 md:space-y-28"> ${renderComponent($$result2, "WalkthroughStep", $$WalkthroughStep, { "step": 1, "title": "Design your T-Box.", "body": "Classes, attributes, and relation types \u2014 the schema your concepts will conform to. Every class gets the six SKOS slots for free, plus typed attributes you define." }, { "default": ($$result3) => renderTemplate` <div class="rounded-[var(--radius-4)] p-6" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4); box-shadow: var(--shadow-2);"> <div class="mb-4 flex items-center gap-2"> <span class="text-[10px] font-semibold uppercase tracking-wider" style="color: var(--violet-11);">SCHEMA</span> <span class="text-[12px]" style="color: var(--gray-11);">·</span> <span class="text-[12px]" style="color: var(--gray-11);">9 classes · 13 relation types</span> </div> <div class="grid grid-cols-2 gap-3"> ${["Manufacturer", "Model", "Engine", "BodyStyle"].map(
    (cls, i) => renderTemplate`<div class="rounded-[var(--radius-3)] p-3"${addAttribute(`background: var(--violet-${i % 2 === 0 ? 2 : 3}); border: 1px solid var(--violet-a4);`, "style")}> <div class="text-[12px] font-bold" style="color: var(--violet-12);"> ${cls} </div> <div class="mt-1 font-mono text-[10px]" style="color: var(--violet-11);">
+ 4 attributes
</div> </div>`
  )} </div> </div> ` })} ${renderComponent($$result2, "WalkthroughStep", $$WalkthroughStep, { "step": 2, "title": "Curate your taxonomies.", "body": "Concepts live in schemes. One ontology can host as many schemes as you need \u2014 Cars catalogue, body-style taxonomy, market segments \u2014 all sharing the same T-Box.", "reverse": true }, { "default": ($$result3) => renderTemplate` <div class="rounded-[var(--radius-4)] p-6" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4); box-shadow: var(--shadow-2);"> <div class="mb-3 flex items-center gap-2"> <span class="text-[10px] font-semibold uppercase tracking-wider" style="color: var(--green-11);">TAXONOMIES TREE</span> </div> <ul class="space-y-1.5 font-mono text-[12px]" role="list"> ${[
    { label: "Toyota", depth: 0, type: "violet" },
    { label: "Camry", depth: 1, type: "green" },
    { label: "Corolla", depth: 1, type: "green" },
    { label: "Honda", depth: 0, type: "violet" },
    { label: "Civic", depth: 1, type: "green" },
    { label: "CR-V", depth: 1, type: "green" }
  ].map((row) => renderTemplate`<li class="flex items-center gap-2 rounded px-2 py-1"${addAttribute(`padding-left: ${row.depth * 16 + 8}px; ${row.depth === 0 ? "background: var(--gray-a3);" : ""}`, "style")}> <span class="h-1.5 w-1.5 rounded-full"${addAttribute(`background: var(--${row.type}-9);`, "style")}></span> <span style="color: var(--gray-12);">${row.label}</span> </li>`)} </ul> </div> ` })} ${renderComponent($$result2, "WalkthroughStep", $$WalkthroughStep, { "step": 3, "title": "Ship to your stack.", "body": "Pin your RAG pipeline to a tagged snapshot. Negotiate language. Pick JSON-LD, SKOS Turtle, OWL XML, or CSV \u2014 every export is faithful to what's in the editor." }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CodeBlock", $$CodeBlock, { "language": "bash", "filename": "GET /v1/ontologies/cars/concepts", "code": `curl -X GET "https://api.ontologia.com/v1/ontologies/cars/concepts \\
  ?tag=v1.3 \\
  &lang=en \\
  &format=jsonld" \\
  -H "Authorization: Bearer $ONTOLOGIA_TOKEN"

# 200 OK \xB7 application/ld+json
{
  "@context": "https://ontologia.com/ctx/v1",
  "ontology": "cars",
  "tag": "v1.3",
  "data": [
    {
      "id": "c_model_camry",
      "skos:prefLabel": "Toyota Camry",
      "manufacturer": "c_mfg_toyota"
    }
  ]
}` })} ` })} </div> </div> </section> ${renderComponent($$result2, "QuoteCard", $$QuoteCard, { "quote": "We consolidated four scattered Google Sheets into a single source of truth for our product taxonomy. Ontologia is the first tool that feels built for AI teams, not database admins.", "author": "Claire Moreau", "role": "Head of AI \xB7 Aurelia Retail", "initials": "CM", "avatarColor": "var(--green-9)" })} ${renderComponent($$result2, "CtaBlock", $$CtaBlock, {})} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/index.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
