import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://ontologia.com");
const $$QuoteCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$QuoteCard;
  const {
    quote,
    author,
    role,
    initials = author.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    avatarColor = "var(--violet-9)"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-14 md:py-28"> <div class="container-page"> <figure class="mx-auto max-w-3xl rounded-[var(--radius-5)] p-6 sm:p-10 md:p-14" style="background: var(--marketing-gradient-section); border: 1px solid var(--gray-a4);"> <svg class="mb-6" width="36" height="36" viewBox="0 0 24 24" fill="var(--violet-9)" aria-hidden="true"> <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"></path> </svg> <blockquote class="text-pull" style="color: var(--gray-12);"> ${quote} </blockquote> <figcaption class="mt-6 flex items-center gap-3"> <span class="flex h-10 w-10 items-center justify-center rounded-full text-[12px] font-bold text-white"${addAttribute(`background: ${avatarColor};`, "style")}> ${initials} </span> <div> <div class="text-[14px] font-semibold" style="color: var(--gray-12);"> ${author} </div> <div class="text-[12.5px]" style="color: var(--gray-11);"> ${role} </div> </div> </figcaption> </figure> </div> </section>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/QuoteCard.astro", void 0);

export { $$QuoteCard as $ };
