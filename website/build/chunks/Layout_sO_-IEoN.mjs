import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, b as addAttribute, r as renderComponent, e as renderSlot, f as renderHead } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */
import { jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

const $$Astro$3 = createAstro("https://ontologia.com");
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Logo;
  const { compact = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a href="/" class="inline-flex items-center gap-2 no-underline" aria-label="Ontologia home"> <span class="flex h-8 w-8 items-center justify-center rounded-[var(--radius-3)] text-white" style="background: var(--marketing-gradient-brand);"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <circle cx="12" cy="5" r="2"></circle> <circle cx="5" cy="19" r="2"></circle> <circle cx="19" cy="19" r="2"></circle> <line x1="12" y1="7" x2="6" y2="17"></line> <line x1="12" y1="7" x2="18" y2="17"></line> <line x1="7" y1="19" x2="17" y2="19"></line> </svg> </span> ${!compact && renderTemplate`<span class="text-sm font-bold tracking-tight" style="color: var(--gray-12);">
Ontologia
</span>`} </a>`;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Logo.astro", void 0);

const $$Astro$2 = createAstro("https://ontologia.com");
const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MobileNav;
  const { links } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<aside id="mobile-nav" class="mobile-drawer fixed inset-0 z-50 hidden flex-col" aria-label="Mobile navigation" data-astro-cid-37bvxqo4> <!-- Backdrop --> <a href="#" class="absolute inset-0" aria-label="Close menu" style="background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);" data-astro-cid-37bvxqo4></a> <!-- Drawer --> <div class="relative ml-auto flex h-full w-[88%] max-w-sm flex-col" style="background: var(--color-panel-solid); border-left: 1px solid var(--gray-a4);" data-astro-cid-37bvxqo4> <div class="flex h-16 items-center justify-between px-5" style="border-bottom: 1px solid var(--gray-a4);" data-astro-cid-37bvxqo4> <span class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--gray-11);" data-astro-cid-37bvxqo4>Menu</span> <a href="#" aria-label="Close menu" class="flex h-8 w-8 items-center justify-center rounded-md" style="color: var(--gray-11);" data-astro-cid-37bvxqo4> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-37bvxqo4> <path d="M18 6 6 18" data-astro-cid-37bvxqo4></path> <path d="m6 6 12 12" data-astro-cid-37bvxqo4></path> </svg> </a> </div> <nav class="flex-1 overflow-y-auto px-2 py-4" data-astro-cid-37bvxqo4> <ul class="space-y-0.5" role="list" data-astro-cid-37bvxqo4> ${links.map((l) => renderTemplate`<li data-astro-cid-37bvxqo4> <a${addAttribute(l.href, "href")} class="flex items-center justify-between rounded-md px-3 py-2.5 text-[15px] font-medium" style="color: var(--gray-12);"${addAttribute(l.external ? "_blank" : void 0, "target")}${addAttribute(l.external ? "noopener" : void 0, "rel")} data-astro-cid-37bvxqo4> ${l.label} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--gray-9);" data-astro-cid-37bvxqo4> <path d="m9 18 6-6-6-6" data-astro-cid-37bvxqo4></path> </svg> </a> </li>`)} </ul> </nav> <div class="px-5 py-5" style="border-top: 1px solid var(--gray-a4); background: var(--gray-2);" data-astro-cid-37bvxqo4> <a href="https://app.ontologia.com/signup" class="btn-primary w-full" style="height: 44px;" data-astro-cid-37bvxqo4>
Try free
</a> <a href="https://app.ontologia.com/signin" class="mt-2 block text-center text-[13.5px] font-medium" style="color: var(--gray-11);" data-astro-cid-37bvxqo4>
Sign in
</a> </div> </div> </aside> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/MobileNav.astro", void 0);

const $$Astro$1 = createAstro("https://ontologia.com");
const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Nav;
  const { current = "" } = Astro2.props;
  const links = [
    { href: "/product", label: "Product" },
    { href: "/use-cases/rag", label: "Use cases" },
    { href: "/pricing", label: "Pricing" },
    { href: "/customers", label: "Customers" },
    { href: "/security", label: "Security" },
    { href: "https://docs.ontologia.com", label: "Docs", external: true }
  ];
  function isActive(href) {
    if (!current) return false;
    if (href === "/use-cases/rag")
      return current.startsWith("/use-cases");
    return current === href || current.startsWith(href + "/");
  }
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 w-full backdrop-blur" style="background: color-mix(in srgb, var(--color-panel-solid) 80%, transparent); border-bottom: 1px solid var(--gray-a4);" data-astro-cid-dmqpwcec> <nav class="container-page flex h-16 items-center justify-between gap-4" aria-label="Primary" data-astro-cid-dmqpwcec> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-dmqpwcec": true })} <ul class="hidden items-center gap-1 md:flex" role="list" data-astro-cid-dmqpwcec> ${links.map((l) => renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(l.href, "href")} class="rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors"${addAttribute(
    isActive(l.href) ? "color: var(--accent-11); background: var(--accent-3);" : "color: var(--gray-11);",
    "style"
  )}${addAttribute(l.external ? "_blank" : void 0, "target")}${addAttribute(l.external ? "noopener" : void 0, "rel")}${addAttribute(isActive(l.href) ? "active" : "idle", "data-nav-link")} data-astro-cid-dmqpwcec> ${l.label} ${l.external && renderTemplate`<svg class="ml-1 inline h-3 w-3 align-[-1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dmqpwcec> <path d="M7 17 17 7" data-astro-cid-dmqpwcec></path> <path d="M7 7h10v10" data-astro-cid-dmqpwcec></path> </svg>`} </a> </li>`)} </ul> <div class="flex items-center gap-2" data-astro-cid-dmqpwcec> <a href="https://app.ontologia.com/signin" class="hidden text-[13.5px] font-medium md:inline-block" style="color: var(--gray-11);" data-astro-cid-dmqpwcec>
Sign in
</a> <a href="https://app.ontologia.com/signup" class="btn-primary" style="height: 36px; padding: 0 var(--space-3);" data-astro-cid-dmqpwcec>
Try free
</a> <!-- Mobile menu trigger --> <a href="#mobile-nav" class="flex h-9 w-9 items-center justify-center rounded-md md:hidden" style="color: var(--gray-11); border: 1px solid var(--gray-a4);" aria-label="Open menu" data-astro-cid-dmqpwcec> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dmqpwcec> <line x1="4" y1="6" x2="20" y2="6" data-astro-cid-dmqpwcec></line> <line x1="4" y1="12" x2="20" y2="12" data-astro-cid-dmqpwcec></line> <line x1="4" y1="18" x2="20" y2="18" data-astro-cid-dmqpwcec></line> </svg> </a> </div> </nav> </header> ${renderComponent($$result, "MobileNav", $$MobileNav, { "links": links, "data-astro-cid-dmqpwcec": true })} `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Nav.astro", void 0);

const STORAGE_KEY = "ontologia.theme";
function getInitial() {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}
function applyTheme(choice) {
  if (typeof document === "undefined") return;
  const body = document.body;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = choice === "system" ? prefersDark ? "dark" : "light" : choice;
  body.setAttribute("data-appearance", resolved);
  body.classList.toggle("dark", resolved === "dark");
  body.classList.toggle("light", resolved === "light");
}
const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor }
];
function ThemeToggle() {
  const [choice, setChoice] = useState("system");
  useEffect(() => {
    const initial = getInitial();
    setChoice(initial);
    applyTheme(initial);
    if (initial !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  function pick(next) {
    setChoice(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "radiogroup",
      "aria-label": "Color theme",
      className: "inline-flex items-center rounded-full p-0.5",
      style: {
        background: "var(--gray-3)",
        border: "1px solid var(--gray-a4)"
      },
      children: OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = choice === opt.value;
        return /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": active,
            "aria-label": opt.label,
            title: opt.label,
            onClick: () => pick(opt.value),
            className: "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
            style: {
              background: active ? "var(--color-panel-solid)" : "transparent",
              color: active ? "var(--gray-12)" : "var(--gray-10)",
              boxShadow: active ? "var(--shadow-1)" : "none"
            },
            children: /* @__PURE__ */ jsx(Icon, { size: 13, "aria-hidden": "true" })
          },
          opt.value
        );
      })
    }
  );
}

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
</p> <div class="flex items-center gap-4" data-astro-cid-sz7xmlte> <p class="text-[12px]" style="color: var(--gray-10);" data-astro-cid-sz7xmlte>
Crafted with care in Paris, France.
</p> ${renderComponent($$result, "ThemeToggle", ThemeToggle, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/ThemeToggle.tsx", "client:component-export": "default", "data-astro-cid-sz7xmlte": true })} </div> </div> </div> </footer> `;
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
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
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><link rel="canonical"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta property="og:site_name" content="Ontologia"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Fonts: Inter + JetBrains Mono --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap">', '</head> <body class="radix-themes flex min-h-screen flex-col" data-accent-color="violet" data-gray-color="slate" data-radius="medium" data-scaling="100%" data-panel-background="solid" data-is-root-theme="true">  <script>\n      (function () {\n        try {\n          var stored = window.localStorage.getItem("ontologia.theme");\n          var prefersDark =\n            window.matchMedia &&\n            window.matchMedia("(prefers-color-scheme: dark)").matches;\n          var resolved =\n            stored === "light"\n              ? "light"\n              : stored === "dark"\n                ? "dark"\n                : prefersDark\n                  ? "dark"\n                  : "light";\n          document.body.classList.add(resolved);\n          document.body.setAttribute("data-appearance", resolved);\n        } catch (e) {\n          document.body.classList.add("light");\n          document.body.setAttribute("data-appearance", "light");\n        }\n      })();\n    <\/script> ', ' <main class="flex-1"> ', " </main> ", '  <script>\n      (function () {\n        if (\n          window.matchMedia &&\n          window.matchMedia("(prefers-reduced-motion: reduce)").matches\n        ) {\n          return;\n        }\n        var io = new IntersectionObserver(\n          function (entries) {\n            entries.forEach(function (entry) {\n              if (entry.isIntersecting) {\n                entry.target.classList.add("is-visible");\n                io.unobserve(entry.target);\n              }\n            });\n          },\n          { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }\n        );\n        document.querySelectorAll("[data-fade-up]").forEach(function (el) {\n          io.observe(el);\n        });\n      })();\n    <\/script> </body> </html>'])), fullTitle, addAttribute(description, "content"), addAttribute(canonical, "href"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(ogImage, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), renderHead(), withChrome && renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "current": current ?? Astro2.url.pathname })}`, renderSlot($$result, $$slots["default"]), withChrome && renderTemplate`${renderComponent($$result, "Footer", $$Footer, {})}`);
}, "/sessions/bold-blissful-hawking/mnt/Desktop--Ontologia/website/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
