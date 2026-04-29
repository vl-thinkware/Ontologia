import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, r as renderComponent, b as addAttribute, f as renderHead, e as renderSlot } from './astro/server_irxFjrx1.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                         */

const $$Astro$2 = createAstro("https://ontologia.com");
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Logo;
  const { compact = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a href="/" class="inline-flex items-center gap-2 no-underline" aria-label="Ontologia home"> <span class="flex h-8 w-8 items-center justify-center rounded-[var(--radius-3)] text-white" style="background: var(--marketing-gradient-brand);"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <circle cx="12" cy="5" r="2"></circle> <circle cx="5" cy="19" r="2"></circle> <circle cx="19" cy="19" r="2"></circle> <line x1="12" y1="7" x2="6" y2="17"></line> <line x1="12" y1="7" x2="18" y2="17"></line> <line x1="7" y1="19" x2="17" y2="19"></line> </svg> </span> ${!compact && renderTemplate`<span class="text-sm font-bold tracking-tight" style="color: var(--gray-12);">
Ontologia
</span>`} </a>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Logo.astro", void 0);

const $$Astro$1 = createAstro("https://ontologia.com");
const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Nav;
  const { current = "" } = Astro2.props;
  const links = [
    { href: "/product", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/customers", label: "Customers" },
    { href: "/security", label: "Security" },
    { href: "https://docs.ontologia.com", label: "Docs", external: true }
  ];
  function isActive(href) {
    if (!current) return false;
    return current === href || current.startsWith(href + "/");
  }
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 w-full backdrop-blur" style="background: color-mix(in srgb, var(--color-panel-solid) 80%, transparent); border-bottom: 1px solid var(--gray-a4);" data-astro-cid-dmqpwcec> <nav class="container-page flex h-16 items-center justify-between gap-4" aria-label="Primary" data-astro-cid-dmqpwcec> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-dmqpwcec": true })} <ul class="hidden items-center gap-1 md:flex" role="list" data-astro-cid-dmqpwcec> ${links.map((l) => renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(l.href, "href")}${addAttribute([
    "rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors"
  ], "class:list")}${addAttribute(
    isActive(l.href) ? "color: var(--accent-11); background: var(--accent-3);" : "color: var(--gray-11);",
    "style"
  )}${addAttribute(l.external ? "_blank" : void 0, "data-target")}${addAttribute(l.external ? "noopener" : void 0, "rel")} data-astro-cid-dmqpwcec> ${l.label} ${l.external && renderTemplate`<svg class="ml-1 inline h-3 w-3 align-[-1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dmqpwcec> <path d="M7 17 17 7" data-astro-cid-dmqpwcec></path> <path d="M7 7h10v10" data-astro-cid-dmqpwcec></path> </svg>`} </a> </li>`)} </ul> <div class="flex items-center gap-2" data-astro-cid-dmqpwcec> <a href="https://app.ontologia.com/signin" class="hidden text-[13.5px] font-medium md:inline-block" style="color: var(--gray-11);" data-astro-cid-dmqpwcec>
Sign in
</a> <a href="https://app.ontologia.com/signup" class="btn-primary" style="height: 36px; padding: 0 var(--space-3);" data-astro-cid-dmqpwcec>
Try free
</a> </div> </nav> </header> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Nav.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Overview", href: "/product" },
        { label: "Schema editor", href: "/product/schema" },
        { label: "Taxonomies", href: "/product/taxonomies" },
        { label: "API", href: "/product/api" },
        { label: "Governance", href: "/product/governance" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Customers", href: "/customers" },
        { label: "Changelog", href: "/changelog" },
        { label: "Documentation", href: "https://docs.ontologia.com", external: true },
        { label: "Status", href: "https://status.ontologia.com", external: true }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/company/about" },
        { label: "Careers", href: "/company/careers" },
        { label: "Security", href: "/security" },
        { label: "Contact", href: "mailto:hello@ontologia.com" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/legal/terms" },
        { label: "Privacy", href: "/legal/privacy" },
        { label: "DPA", href: "/legal/dpa" },
        { label: "SLA", href: "/legal/sla" },
        { label: "Sub-processors", href: "/legal/subprocessors" }
      ]
    }
  ];
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="mt-auto" style="background: var(--gray-2); border-top: 1px solid var(--gray-a4);" data-astro-cid-sz7xmlte> <div class="container-page py-12" data-astro-cid-sz7xmlte> <div class="grid grid-cols-2 gap-10 md:grid-cols-6" data-astro-cid-sz7xmlte> <div class="col-span-2 md:col-span-2" data-astro-cid-sz7xmlte> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-sz7xmlte": true })} <p class="mt-4 max-w-xs text-[13.5px] leading-relaxed" style="color: var(--gray-11);" data-astro-cid-sz7xmlte>
The source of truth for your concepts. Design, version and ship the
          ontology your AI and data pipelines depend on.
</p> <div class="mt-4 flex items-center gap-2" data-astro-cid-sz7xmlte> <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium" style="background: var(--green-3); color: var(--green-11);" data-astro-cid-sz7xmlte> <span class="h-1.5 w-1.5 rounded-full" style="background: var(--green-9);" data-astro-cid-sz7xmlte></span>
All systems operational
</span> </div> </div> ${cols.map((col) => renderTemplate`<div data-astro-cid-sz7xmlte> <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-wider" style="color: var(--gray-11);" data-astro-cid-sz7xmlte> ${col.title} </h3> <ul class="space-y-2" role="list" data-astro-cid-sz7xmlte> ${col.links.map((link) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(link.href, "href")} class="text-[13.5px] no-underline transition-colors" style="color: var(--gray-11);" data-footer-link${addAttribute(link.external ? "_blank" : void 0, "target")}${addAttribute(link.external ? "noopener" : void 0, "rel")} data-astro-cid-sz7xmlte> ${link.label} </a> </li>`)} </ul> </div>`)} </div> <div class="mt-12 flex flex-col items-start justify-between gap-3 pt-6 md:flex-row md:items-center" style="border-top: 1px solid var(--gray-a4);" data-astro-cid-sz7xmlte> <p class="text-[12px]" style="color: var(--gray-10);" data-astro-cid-sz7xmlte>
© ${year} Thinkware SAS. All rights reserved.
</p> <p class="text-[12px]" style="color: var(--gray-10);" data-astro-cid-sz7xmlte>
Crafted with care in Paris, France.
</p> </div> </div> </footer> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Footer.astro", void 0);

const $$Astro = createAstro("https://ontologia.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description,
    ogImage = "/og/default.png",
    current,
    withChrome = true
  } = Astro2.props;
  const fullTitle = title.includes("Ontologia") ? title : `${title} \xB7 Ontologia`;
  const canonical = new URL(Astro2.url.pathname, Astro2.site ?? "https://ontologia.com").toString();
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${fullTitle}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(fullTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:site_name" content="Ontologia"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(fullTitle, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><!-- Fonts: Inter + JetBrains Mono --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">${renderHead()}</head> <body class="radix-themes flex min-h-screen flex-col" data-accent-color="violet" data-gray-color="slate" data-radius="medium" data-scaling="100%" data-panel-background="solid" data-is-root-theme="true"> ${withChrome && renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "current": current ?? Astro2.url.pathname })}`} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${withChrome && renderTemplate`${renderComponent($$result, "Footer", $$Footer, {})}`} </body></html>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
