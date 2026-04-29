import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BYDX0w6H.mjs';
export { renderers } from '../../renderers.mjs';

const $$Thanks = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Check your email \u2014 Semlify", "description": "Your Semlify workspace link is on its way.", "current": "/access", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-24 md:py-32"> <div class="container-page mx-auto max-w-xl text-center"> <p class="text-eyebrow">All set</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem);">
Check your email.
</h1> <p class="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed" style="color: var(--gray-11);">
Your workspace link is on its way. Look for an email from
        hello@semlify.com in the next few minutes. While you wait, the
<a href="/product" style="color: var(--accent-11); font-weight: 500;">product tour</a> is the best place to see what's there.
</p> <div class="mt-8 flex flex-wrap items-center justify-center gap-3"> <a href="/product" class="btn-primary" style="height: 44px; padding: 0 var(--space-5);">
See the product
</a> <a href="/" class="rounded-[var(--radius-3)] px-5 text-[14px] font-medium" style="height: 44px; line-height: 44px; color: var(--gray-12); border: 1px solid var(--gray-a6);">
Back home
</a> </div> </div> </section> ` })}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/access/thanks.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/access/thanks.astro";
const $$url = "/access/thanks";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Thanks,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
