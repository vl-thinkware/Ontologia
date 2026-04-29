import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://semlify.com");
const $$CtaBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CtaBlock;
  const {
    title = "Stop arguing about what your concepts mean.",
    subtitle = "Start versioning them. Free workspace, no credit card.",
    primaryLabel = "Try free",
    primaryHref = "/access",
    secondaryLabel = "Talk to sales",
    secondaryHref = "mailto:hello@semlify.com"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative overflow-hidden" style="background: var(--marketing-gradient-brand);"> <!-- Subtle grid pattern overlay --> <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.16) 1px, transparent 0); background-size: 28px 28px;"></div> <div class="container-page relative py-12 text-center md:py-24"> <h2 class="mx-auto max-w-3xl text-display" style="color: white; font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);"> ${title} </h2> <p class="mx-auto mt-4 max-w-xl text-lg leading-relaxed" style="color: rgba(255,255,255,0.85);"> ${subtitle} </p> <div class="mt-8 flex flex-wrap items-center justify-center gap-3"> <a${addAttribute(primaryHref, "href")} class="btn-primary" style="background: white; color: var(--violet-11); height: 44px; padding: 0 var(--space-5); font-size: var(--font-size-3);"> ${primaryLabel} </a> <a${addAttribute(secondaryHref, "href")} class="btn-secondary" style="background: transparent; color: white; border-color: rgba(255,255,255,0.3); height: 44px; padding: 0 var(--space-5); font-size: var(--font-size-3);"> ${secondaryLabel} </a> </div> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/CtaBlock.astro", void 0);

export { $$CtaBlock as $ };
