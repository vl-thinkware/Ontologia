import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BYDX0w6H.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Try Semlify free \u2014 Get your workspace", "description": "Get your free Semlify workspace in minutes. Fill in a few details and we'll email your access link. No credit card required.", "current": "/access", "data-astro-cid-du7fittg": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 md:py-20" style="background: var(--marketing-gradient-hero);" data-astro-cid-du7fittg> <div class="container-page text-center" data-astro-cid-du7fittg> <p class="text-eyebrow" data-astro-cid-du7fittg>Free tier</p> <h1 class="text-display mt-3" style="font-size: clamp(2rem, 1.5rem + 2.5vw, 3rem);" data-astro-cid-du7fittg>
Start free.
</h1> <p class="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed md:text-lg" style="color: var(--gray-11);" data-astro-cid-du7fittg>
Fill in a few details and we'll email your workspace link. No credit
        card. Takes a minute.
</p> </div> </section>  <section class="py-12 md:py-16" data-astro-cid-du7fittg> <div class="container-page mx-auto max-w-xl" data-astro-cid-du7fittg> <form name="early-access" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/access/thanks" class="space-y-5 rounded-[var(--radius-5)] p-6 md:p-8" style="background: var(--color-panel-solid); border: 1px solid var(--gray-a4);" data-astro-cid-du7fittg> <input type="hidden" name="form-name" value="early-access" data-astro-cid-du7fittg>  <p class="hidden" aria-hidden="true" data-astro-cid-du7fittg> <label data-astro-cid-du7fittg>
Don't fill this out:
<input name="bot-field" tabindex="-1" autocomplete="off" data-astro-cid-du7fittg> </label> </p> <div data-astro-cid-du7fittg> <label for="name" class="block text-[13.5px] font-semibold" style="color: var(--gray-12);" data-astro-cid-du7fittg>
Your name
</label> <input type="text" name="name" id="name" required autocomplete="name" class="form-field mt-1.5" data-astro-cid-du7fittg> </div> <div data-astro-cid-du7fittg> <label for="email" class="block text-[13.5px] font-semibold" style="color: var(--gray-12);" data-astro-cid-du7fittg>
Work email
</label> <input type="email" name="email" id="email" required autocomplete="email" class="form-field mt-1.5" data-astro-cid-du7fittg> </div> <div data-astro-cid-du7fittg> <label for="phone" class="block text-[13.5px] font-semibold" style="color: var(--gray-12);" data-astro-cid-du7fittg>
Phone number
</label> <input type="tel" name="phone" id="phone" required autocomplete="tel" inputmode="tel" placeholder="+1 (415) 555-0172" pattern="[+0-9\s().\-]{6,}" class="form-field mt-1.5" data-astro-cid-du7fittg> </div> <div data-astro-cid-du7fittg> <label for="company" class="block text-[13.5px] font-semibold" style="color: var(--gray-12);" data-astro-cid-du7fittg>
Company or project
<span class="font-normal" style="color: var(--gray-10);" data-astro-cid-du7fittg>
(optional)
</span> </label> <input type="text" name="company" id="company" autocomplete="organization" class="form-field mt-1.5" data-astro-cid-du7fittg> </div> <div data-astro-cid-du7fittg> <label for="usecase" class="block text-[13.5px] font-semibold" style="color: var(--gray-12);" data-astro-cid-du7fittg>
What are you building?
<span class="font-normal" style="color: var(--gray-10);" data-astro-cid-du7fittg>
(optional)
</span> </label> <textarea name="usecase" id="usecase" rows="4" placeholder="A RAG pipeline, a product catalog, a glossary — a couple of sentences is plenty." class="form-field mt-1.5" style="resize: vertical; min-height: 110px;" data-astro-cid-du7fittg></textarea> </div> <button type="submit" class="btn-primary w-full" style="height: 44px;" data-astro-cid-du7fittg>
Get my free workspace
</button> <p class="text-[12.5px]" style="color: var(--gray-10);" data-astro-cid-du7fittg>
We'll email your access link in a few minutes. No marketing list.
</p> </form> </div> </section> ` })} `;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/access/index.astro", void 0);

const $$file = "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/pages/access/index.astro";
const $$url = "/access";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
