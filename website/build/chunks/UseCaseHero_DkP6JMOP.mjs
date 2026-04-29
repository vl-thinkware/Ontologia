import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';

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

export { $$UseCaseHero as $ };
