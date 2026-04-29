import { d as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from './Layout_Bq7kBENc.mjs';
import { $ as $$CtaBlock } from './CtaBlock_Chml4FMl.mjs';

const $$Astro = createAstro("https://semlify.com");
const $$ComingSoon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ComingSoon;
  const {
    title,
    description,
    eyebrow = "On the way",
    whenLabel = "Shipping with GA \xB7 Q3 2026",
    current,
    body,
    bullets = [],
    ctaTitle = "Want to be first to know?",
    ctaSubtitle = "We email when this page goes live. No marketing fluff in between."
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "current": current }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-page py-20 md:py-32"> <div class="mx-auto max-w-2xl text-center"> <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium" style="background: var(--violet-3); color: var(--violet-11);"> <span class="h-1.5 w-1.5 rounded-full" style="background: var(--violet-9);"></span> ${eyebrow} </span> <h1 class="text-display mt-6" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3.25rem);"> ${title} </h1> <p class="mx-auto mt-4 max-w-xl text-lg leading-relaxed md:text-xl" style="color: var(--gray-11);"> ${body} </p> ${bullets.length > 0 && renderTemplate`<ul class="mx-auto mt-8 max-w-md space-y-2.5 text-left" role="list"> ${bullets.map((b) => renderTemplate`<li class="flex items-start gap-2.5 text-[14px]" style="color: var(--gray-12);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 4px; flex-shrink: 0;"> <path d="M20 6 9 17l-5-5"></path> </svg> <span>${b}</span> </li>`)} </ul>`} <div class="mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2" style="background: var(--gray-2); border: 1px solid var(--gray-a4);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--gray-11);"> <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> </svg> <span class="text-[12.5px]" style="color: var(--gray-11);"> ${whenLabel} </span> </div> </div> </section> ${renderComponent($$result2, "CtaBlock", $$CtaBlock, { "title": ctaTitle, "subtitle": ctaSubtitle, "primaryLabel": "Email me when it ships", "primaryHref": `mailto:hello@semlify.com?subject=${encodeURIComponent(`Heads up when ${title} ships`)}`, "secondaryLabel": "Back to home", "secondaryHref": "/" })} ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/ComingSoon.astro", void 0);

export { $$ComingSoon as $ };
