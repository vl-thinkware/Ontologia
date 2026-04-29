import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate, e as renderSlot } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://semlify.com");
const $$ProductFeatureBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductFeatureBlock;
  const { eyebrow, title, body, reverse = false, bullets = [] } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-16 md:py-24"> <div class="container-page"> <div${addAttribute(`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>:first-child]:order-2" : ""}`, "class")}> <div data-fade-up> ${eyebrow && renderTemplate`<p class="text-eyebrow">${eyebrow}</p>`} <h2 class="text-headline mt-2" style="font-size: clamp(1.5rem, 1rem + 1.5vw, 2rem);"> ${title} </h2> <p class="mt-4 max-w-md text-[15.5px] leading-relaxed" style="color: var(--gray-11);"> ${body} </p> ${bullets.length > 0 && renderTemplate`<ul class="mt-5 space-y-2.5" role="list"> ${bullets.map((b) => renderTemplate`<li class="flex items-start gap-2.5 text-[14px]" style="color: var(--gray-12);"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-top: 4px; flex-shrink: 0;"> <path d="M20 6 9 17l-5-5"></path> </svg> <span>${b}</span> </li>`)} </ul>`} </div> <div data-fade-up data-delay="1"> ${renderSlot($$result, $$slots["default"])} </div> </div> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/ProductFeatureBlock.astro", void 0);

export { $$ProductFeatureBlock as $ };
