import { d as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                      */

const $$Astro = createAstro("https://ontologia.com");
const $$ProductPageNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductPageNav;
  const { current } = Astro2.props;
  const links = [
    { href: "/product", label: "Overview" },
    { href: "/product/schema", label: "Schema" },
    { href: "/product/taxonomies", label: "Taxonomies" },
    { href: "/product/api", label: "API" },
    { href: "/product/governance", label: "Governance" },
    { href: "/product/rbac", label: "Roles" },
    { href: "/product/ai", label: "AI" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="sticky z-30" style="top: 64px; background: color-mix(in srgb, var(--color-panel-solid) 88%, transparent); border-bottom: 1px solid var(--gray-a4); backdrop-filter: blur(8px);" aria-label="Product sections" data-astro-cid-afwvfish> <ul class="container-page flex gap-1 overflow-x-auto py-3 text-[13px]" role="list" style="scrollbar-width: none;" data-astro-cid-afwvfish> ${links.map((l) => {
    const active = current === l.href;
    return renderTemplate`<li class="shrink-0" data-astro-cid-afwvfish> <a${addAttribute(l.href, "href")} class="rounded-full px-3 py-1.5 font-medium transition-colors"${addAttribute(
      active ? "color: var(--accent-12); background: var(--accent-3); border: 1px solid var(--accent-7);" : "color: var(--gray-11); border: 1px solid transparent;",
      "style"
    )}${addAttribute(active ? "active" : "idle", "data-product-link")} data-astro-cid-afwvfish> ${l.label} </a> </li>`;
  })} </ul> </nav> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/ProductPageNav.astro", void 0);

export { $$ProductPageNav as $ };
