import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

const $$Astro$1 = createAstro("https://ontologia.com");
const $$UseCasePageNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$UseCasePageNav;
  const { current } = Astro2.props;
  const links = [
    { href: "/use-cases/rag", label: "RAG" },
    { href: "/use-cases/catalog", label: "Catalog" },
    { href: "/use-cases/governance", label: "Governance" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="sticky z-30" style="top: 64px; background: color-mix(in srgb, var(--color-panel-solid) 88%, transparent); border-bottom: 1px solid var(--gray-a4); backdrop-filter: blur(8px);" aria-label="Use case sections" data-astro-cid-7oa7zsj5> <ul class="container-page flex gap-1 overflow-x-auto py-3 text-[13px]" role="list" style="scrollbar-width: none;" data-astro-cid-7oa7zsj5> ${links.map((l) => {
    const active = current === l.href;
    return renderTemplate`<li class="shrink-0" data-astro-cid-7oa7zsj5> <a${addAttribute(l.href, "href")} class="rounded-full px-3 py-1.5 font-medium transition-colors"${addAttribute(
      active ? "color: var(--accent-12); background: var(--accent-3); border: 1px solid var(--accent-7);" : "color: var(--gray-11); border: 1px solid transparent;",
      "style"
    )}${addAttribute(active ? "active" : "idle", "data-usecase-link")} data-astro-cid-7oa7zsj5> ${l.label} </a> </li>`;
  })} </ul> </nav> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/UseCasePageNav.astro", void 0);

const $$Astro = createAstro("https://ontologia.com");
const $$UseCaseHero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UseCaseHero;
  const {
    eyebrow,
    title,
    subtitle,
    primaryCtaLabel = "Try this template",
    primaryCtaHref = "https://app.ontologia.com/signup"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-16 md:py-24" style="background: var(--marketing-gradient-hero);"> <div class="container-page text-center"> <p class="text-eyebrow">${eyebrow}</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);"> ${title} </h1> <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);"> ${subtitle} </p> <div class="mt-7 flex flex-wrap items-center justify-center gap-3"> <a${addAttribute(primaryCtaHref, "href")} class="btn-primary">${primaryCtaLabel}</a> <a href="/product" class="btn-secondary">See the product</a> </div> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/UseCaseHero.astro", void 0);

export { $$UseCasePageNav as $, $$UseCaseHero as a };
