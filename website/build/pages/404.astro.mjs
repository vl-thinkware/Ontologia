import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYDX0w6H.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page not found \u2014 Semlify", "description": "The Semlify page you're looking for moved or never existed. Head back to the home page or the product tour.", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center"> <p class="text-[12px] font-bold uppercase tracking-wider" style="color: var(--gray-11);">
404
</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2vw, 3rem);">
That concept isn't in our taxonomy.
</h1> <p class="mt-4 max-w-md text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
The page you're looking for moved or never existed. Let's get you back
      to something useful.
</p> <div class="mt-7 flex flex-wrap items-center justify-center gap-3"> <a href="/" class="btn-primary">Back to home</a> <a href="/product" class="btn-secondary">See the product</a> </div> </section> ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/404.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
