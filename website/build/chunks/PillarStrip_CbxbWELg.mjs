import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, b as addAttribute, r as renderComponent } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { Zap, GitCommit, Network } from 'lucide-react';

const $$Astro = createAstro("https://ontologia.com");
const $$PillarStrip = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PillarStrip;
  const {
    eyebrow,
    title,
    pillars = [
      {
        icon: "network",
        title: "Graph-native",
        body: "One engine for schema, taxonomy, and instances. SKOS aligned, OWL-exportable, Neo4j underneath. Not three tools stitched together."
      },
      {
        icon: "history",
        title: "Versioned",
        body: "Every change is a reversible, attributable event. Tag a snapshot. Diff two tags. Revert a mistake \u2014 without leaving the editor."
      },
      {
        icon: "api",
        title: "API-first",
        body: "Stable JSON-LD / SKOS / OWL endpoints with version pinning, language negotiation, and a built-in playground."
      }
    ]
  } = Astro2.props;
  const iconMap = {
    network: Network,
    history: GitCommit,
    api: Zap
  };
  return renderTemplate`${maybeRenderHead()}<section class="py-20 md:py-28" style="background: var(--color-background);"> <div class="container-page"> ${(eyebrow || title) && renderTemplate`<header class="mx-auto max-w-2xl text-center mb-14"> ${eyebrow && renderTemplate`<p class="text-eyebrow">${eyebrow}</p>`} ${title && renderTemplate`<h2 class="text-headline mt-3">${title}</h2>`} </header>`} <ul class="grid grid-cols-1 gap-5 md:grid-cols-3" role="list"> ${pillars.map((p, i) => {
    const Icon = iconMap[p.icon] ?? Network;
    return renderTemplate`<li class="marketing-card animate-fade-up"${addAttribute(`animation-delay: ${i * 80}ms;`, "style")}> <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-[var(--radius-3)]" style="background: var(--violet-3); color: var(--violet-11);"> ${renderComponent($$result, "Icon", Icon, { "size": 20, "aria-hidden": "true" })} </div> <h3 class="text-lg font-bold tracking-tight" style="color: var(--gray-12);"> ${p.title} </h3> <p class="mt-2 text-[14.5px] leading-relaxed" style="color: var(--gray-11);"> ${p.body} </p> </li>`;
  })} </ul> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/PillarStrip.astro", void 0);

export { $$PillarStrip as $ };
