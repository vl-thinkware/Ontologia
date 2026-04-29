import { d as createAstro, c as createComponent, m as maybeRenderHead, a as renderTemplate, b as addAttribute, r as renderComponent, u as unescapeHTML, e as renderSlot, f as renderHead } from './astro/server_Dvld-7Qp.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                             */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, X, Check, Cookie, Settings2 } from 'lucide-react';

const $$Astro$4 = createAstro("https://semlify.com");
const $$Logo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Logo;
  const { compact = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a href="/" class="inline-flex items-center gap-2 no-underline" aria-label="Semlify home"> <span class="flex h-8 w-8 items-center justify-center rounded-[var(--radius-3)] text-white" style="background: var(--marketing-gradient-brand);">  <svg width="20" height="20" viewBox="0 0 64 64" fill="none" aria-hidden="true"> <path d="M14 50 L14 14" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path> <path d="M14 32 C 14 22, 28 22, 36 22" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"></path> <path d="M14 32 C 14 42, 36 42, 44 42" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"></path> <circle cx="14" cy="14" r="4.5" fill="currentColor"></circle> <circle cx="14" cy="50" r="4.5" fill="currentColor"></circle> <circle cx="40" cy="22" r="6" fill="currentColor"></circle> <circle cx="48" cy="42" r="6" fill="currentColor"></circle> </svg> </span> ${!compact && renderTemplate`<span class="text-sm font-bold tracking-tight" style="color: var(--gray-12);">
Semlify
</span>`} </a>`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/Logo.astro", void 0);

const $$Astro$3 = createAstro("https://semlify.com");
const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$MobileNav;
  const { links } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<aside id="mobile-nav" class="mobile-drawer fixed inset-0 z-50 hidden flex-col" aria-label="Mobile navigation" data-astro-cid-37bvxqo4> <!-- Backdrop --> <a href="#" class="absolute inset-0" aria-label="Close menu" style="background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);" data-astro-cid-37bvxqo4></a> <!-- Drawer --> <div class="relative ml-auto flex h-full w-[88%] max-w-sm flex-col" style="background: var(--color-panel-solid); border-left: 1px solid var(--gray-a4);" data-astro-cid-37bvxqo4> <div class="flex h-16 items-center justify-between px-5" style="border-bottom: 1px solid var(--gray-a4);" data-astro-cid-37bvxqo4> <span class="text-[11px] font-bold uppercase tracking-wider" style="color: var(--gray-11);" data-astro-cid-37bvxqo4>Menu</span> <a href="#" aria-label="Close menu" class="flex h-8 w-8 items-center justify-center rounded-md" style="color: var(--gray-11);" data-astro-cid-37bvxqo4> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-37bvxqo4> <path d="M18 6 6 18" data-astro-cid-37bvxqo4></path> <path d="m6 6 12 12" data-astro-cid-37bvxqo4></path> </svg> </a> </div> <nav class="flex-1 overflow-y-auto px-2 py-4" data-astro-cid-37bvxqo4> <ul class="space-y-0.5" role="list" data-astro-cid-37bvxqo4> ${links.map((l) => renderTemplate`<li data-astro-cid-37bvxqo4> <a${addAttribute(l.href, "href")} class="flex items-center justify-between rounded-md px-3 py-2.5 text-[15px] font-medium" style="color: var(--gray-12);"${addAttribute(l.external ? "_blank" : void 0, "target")}${addAttribute(l.external ? "noopener" : void 0, "rel")} data-astro-cid-37bvxqo4> ${l.label} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: var(--gray-9);" data-astro-cid-37bvxqo4> <path d="m9 18 6-6-6-6" data-astro-cid-37bvxqo4></path> </svg> </a> </li>`)} </ul> </nav> <div class="px-5 py-5" style="border-top: 1px solid var(--gray-a4); background: var(--gray-2);" data-astro-cid-37bvxqo4> <a href="/access" class="btn-primary w-full" style="height: 44px;" data-astro-cid-37bvxqo4>
Try free
</a> </div> </div> </aside> `;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/MobileNav.astro", void 0);

const $$Astro$2 = createAstro("https://semlify.com");
const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Nav;
  const { current = "" } = Astro2.props;
  const links = [
    { href: "/product", label: "Product" },
    {
      href: "/use-cases/rag",
      label: "Use cases",
      matchPrefix: "/use-cases"
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/security", label: "Security" }
  ];
  function isActive(link) {
    if (!current) return false;
    if (link.matchPrefix) return current.startsWith(link.matchPrefix);
    return current === link.href || current.startsWith(link.href + "/");
  }
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-40 w-full backdrop-blur" style="background: color-mix(in srgb, var(--color-panel-solid) 80%, transparent); border-bottom: 1px solid var(--gray-a4);" data-astro-cid-dmqpwcec> <nav class="container-page flex h-16 items-center justify-between gap-4" aria-label="Primary" data-astro-cid-dmqpwcec> ${renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-dmqpwcec": true })} <ul class="hidden items-center gap-1 md:flex" role="list" data-astro-cid-dmqpwcec> ${links.map((l) => renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(l.href, "href")} class="rounded-md px-3 py-1.5 text-[13.5px] font-medium transition-colors"${addAttribute(
    isActive(l) ? "color: var(--accent-11); background: var(--accent-3);" : "color: var(--gray-11);",
    "style"
  )}${addAttribute(l.external ? "_blank" : void 0, "target")}${addAttribute(l.external ? "noopener" : void 0, "rel")}${addAttribute(isActive(l) ? "active" : "idle", "data-nav-link")} data-astro-cid-dmqpwcec> ${l.label} ${l.external && renderTemplate`<svg class="ml-1 inline h-3 w-3 align-[-1px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dmqpwcec> <path d="M7 17 17 7" data-astro-cid-dmqpwcec></path> <path d="M7 7h10v10" data-astro-cid-dmqpwcec></path> </svg>`} </a> </li>`)} </ul> <div class="flex items-center gap-2" data-astro-cid-dmqpwcec> <a href="/access" class="btn-primary" style="height: 36px; padding: 0 var(--space-3);" data-astro-cid-dmqpwcec>
Try free
</a> <!-- Mobile menu trigger --> <a href="#mobile-nav" class="flex h-9 w-9 items-center justify-center rounded-md md:hidden" style="color: var(--gray-11); border: 1px solid var(--gray-a4);" aria-label="Open menu" data-astro-cid-dmqpwcec> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dmqpwcec> <line x1="4" y1="6" x2="20" y2="6" data-astro-cid-dmqpwcec></line> <line x1="4" y1="12" x2="20" y2="12" data-astro-cid-dmqpwcec></line> <line x1="4" y1="18" x2="20" y2="18" data-astro-cid-dmqpwcec></line> </svg> </a> </div> </nav> </header> ${renderComponent($$result, "MobileNav", $$MobileNav, { "links": links, "data-astro-cid-dmqpwcec": true })} `;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/Nav.astro", void 0);

const STORAGE_KEY$1 = "semlify.theme";
function getInitial() {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY$1);
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
    window.localStorage.setItem(STORAGE_KEY$1, next);
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

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
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
        { label: "Changelog", href: "/changelog" },
        { label: "Status", href: "https://status.semlify.com", external: true }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/company/about" },
        { label: "Careers", href: "/company/careers" },
        { label: "Security", href: "/security" },
        { label: "Contact", href: "mailto:hello@semlify.com" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/legal/terms" },
        { label: "Privacy", href: "/legal/privacy" },
        { label: "DPA", href: "/legal/dpa" },
        { label: "SLA", href: "/legal/sla" },
        { label: "Sub-processors", href: "/legal/subprocessors" },
        { label: "Cookie preferences", href: "#cookie-prefs", openCookies: true }
      ]
    }
  ];
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<footer class="mt-auto" style="background: var(--gray-2); border-top: 1px solid var(--gray-a4);" data-astro-cid-sz7xmlte> <div class="container-page py-12" data-astro-cid-sz7xmlte> <div class="grid grid-cols-2 gap-10 md:grid-cols-6" data-astro-cid-sz7xmlte> <div class="col-span-2 md:col-span-2" data-astro-cid-sz7xmlte> ', ' <p class="mt-4 max-w-xs text-[13.5px] leading-relaxed" style="color: var(--gray-11);" data-astro-cid-sz7xmlte>\nThe source of truth for your concepts. Design, version and ship the\n          ontology your AI and data pipelines depend on.\n</p> <div class="mt-4 flex items-center gap-2" data-astro-cid-sz7xmlte> <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium" style="background: var(--green-3); color: var(--green-11);" data-astro-cid-sz7xmlte> <span class="h-1.5 w-1.5 rounded-full" style="background: var(--green-9);" data-astro-cid-sz7xmlte></span>\nAll systems operational\n</span> </div> <div class="mt-5 flex items-center gap-2" data-astro-cid-sz7xmlte> <a href="https://www.linkedin.com/company/semlify" target="_blank" rel="noopener" aria-label="Semlify on LinkedIn" class="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-3)] transition-colors" style="border: 1px solid var(--gray-a4); color: var(--gray-11);" data-social-link data-astro-cid-sz7xmlte> <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-astro-cid-sz7xmlte> <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" data-astro-cid-sz7xmlte></path> </svg> </a> </div> </div> ', ' </div> <div class="mt-12 flex flex-col items-start justify-between gap-3 pt-6 md:flex-row md:items-center" style="border-top: 1px solid var(--gray-a4);" data-astro-cid-sz7xmlte> <p class="text-[12px]" style="color: var(--gray-10);" data-astro-cid-sz7xmlte>\n\xA9 ', ' Semlify SAS. All rights reserved.\n</p> <div class="flex items-center gap-4" data-astro-cid-sz7xmlte> <p class="text-[12px]" style="color: var(--gray-10);" data-astro-cid-sz7xmlte>\nCrafted with care in Paris, France.\n</p> ', ' </div> </div> </div> </footer>  <script>\n  // Wire the "Cookie preferences" footer link to re-open the banner.\n  document.addEventListener("click", function (e) {\n    const link = e.target && e.target.closest && e.target.closest("[data-open-cookies]");\n    if (!link) return;\n    e.preventDefault();\n    window.dispatchEvent(new CustomEvent("semlify:open-cookies"));\n  });\n<\/script>'])), maybeRenderHead(), renderComponent($$result, "Logo", $$Logo, { "data-astro-cid-sz7xmlte": true }), cols.map((col) => renderTemplate`<div data-astro-cid-sz7xmlte> <h3 class="mb-3 text-[11px] font-semibold uppercase tracking-wider" style="color: var(--gray-11);" data-astro-cid-sz7xmlte> ${col.title} </h3> <ul class="space-y-2" role="list" data-astro-cid-sz7xmlte> ${col.links.map((link) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(link.href, "href")} class="text-[13.5px] no-underline transition-colors" style="color: var(--gray-11);" data-footer-link${addAttribute(link.openCookies ? "true" : void 0, "data-open-cookies")}${addAttribute(link.external ? "_blank" : void 0, "target")}${addAttribute(link.external ? "noopener" : void 0, "rel")} data-astro-cid-sz7xmlte> ${link.label} </a> </li>`)} </ul> </div>`), year, renderComponent($$result, "ThemeToggle", ThemeToggle, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/ThemeToggle.tsx", "client:component-export": "default", "data-astro-cid-sz7xmlte": true }));
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/Footer.astro", void 0);

const STORAGE_KEY = "semlify.cookies";
function readConsent() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function writeConsent(c) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  window.dispatchEvent(
    new CustomEvent("semlify:consent", { detail: c })
  );
}
function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setOpen(true);
    } else {
      setAnalytics(existing.categories.analytics);
      setMarketing(existing.categories.marketing);
    }
    const reopen = () => {
      setOpen(true);
      setShowPrefs(true);
    };
    window.addEventListener("semlify:open-cookies", reopen);
    return () => window.removeEventListener("semlify:open-cookies", reopen);
  }, []);
  function acceptAll() {
    writeConsent({
      level: "all",
      categories: { essential: true, analytics: true, marketing: true },
      decidedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    setOpen(false);
    setShowPrefs(false);
  }
  function rejectAll() {
    writeConsent({
      level: "essential",
      categories: { essential: true, analytics: false, marketing: false },
      decidedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    setOpen(false);
    setShowPrefs(false);
  }
  function saveCustom() {
    writeConsent({
      level: "custom",
      categories: { essential: true, analytics, marketing },
      decidedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    setOpen(false);
    setShowPrefs(false);
  }
  if (!open) return null;
  return showPrefs ? /* @__PURE__ */ jsx(
    PreferencesModal,
    {
      analytics,
      marketing,
      onToggleAnalytics: setAnalytics,
      onToggleMarketing: setMarketing,
      onSave: saveCustom,
      onAcceptAll: acceptAll,
      onRejectAll: rejectAll,
      onClose: () => setShowPrefs(false)
    }
  ) : /* @__PURE__ */ jsx(
    Banner,
    {
      onAcceptAll: acceptAll,
      onRejectAll: rejectAll,
      onCustomize: () => setShowPrefs(true)
    }
  );
}
function Banner({
  onAcceptAll,
  onRejectAll,
  onCustomize
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed bottom-0 left-0 right-0 z-[55] px-4 pb-4 sm:px-6 sm:pb-6",
      style: { animation: "fadeUp 320ms cubic-bezier(0.25, 1, 0.5, 1) both" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "mx-auto flex max-w-4xl flex-col gap-3 rounded-[var(--radius-5)] p-5 sm:flex-row sm:items-center sm:gap-5",
          style: {
            background: "var(--color-panel-solid)",
            border: "1px solid var(--gray-a5)",
            boxShadow: "var(--shadow-5)"
          },
          role: "dialog",
          "aria-labelledby": "cookie-banner-title",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                style: { background: "var(--accent-3)", color: "var(--accent-11)" },
                children: /* @__PURE__ */ jsx(Cookie, { size: 18, "aria-hidden": true })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  id: "cookie-banner-title",
                  className: "text-[14px] font-bold",
                  style: { color: "var(--gray-12)" },
                  children: "We use cookies, but only the ones we'd want explained to us."
                }
              ),
              /* @__PURE__ */ jsxs(
                "p",
                {
                  className: "mt-1 text-[12.5px] leading-relaxed",
                  style: { color: "var(--gray-11)" },
                  children: [
                    "Essential cookies keep you signed in and the site running. Analytics and marketing cookies are off until you say so.",
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "/legal/privacy",
                        className: "font-medium underline-offset-2 hover:underline",
                        style: { color: "var(--accent-11)" },
                        children: "Privacy policy"
                      }
                    ),
                    "."
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:flex-nowrap", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: onCustomize,
                  className: "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors",
                  style: {
                    color: "var(--gray-11)",
                    background: "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsx(Settings2, { size: 13, "aria-hidden": true }),
                    "Preferences"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onRejectAll,
                  className: "rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors",
                  style: {
                    color: "var(--gray-12)",
                    background: "var(--gray-3)",
                    border: "1px solid var(--gray-a5)"
                  },
                  children: "Reject all"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onAcceptAll,
                  className: "rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors",
                  style: {
                    color: "var(--accent-contrast)",
                    background: "var(--accent-9)"
                  },
                  children: "Accept all"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function PreferencesModal({
  analytics,
  marketing,
  onToggleAnalytics,
  onToggleMarketing,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-[60] flex items-center justify-center px-4 py-6",
      style: { background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" },
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "cookie-prefs-title",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative w-full max-w-md overflow-hidden rounded-[var(--radius-5)]",
          style: {
            background: "var(--color-panel-solid)",
            border: "1px solid var(--gray-a5)",
            boxShadow: "var(--shadow-5)"
          },
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex items-start justify-between gap-4 px-6 py-5",
                style: { borderBottom: "1px solid var(--gray-a4)" },
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx(
                      "h2",
                      {
                        id: "cookie-prefs-title",
                        className: "text-[16px] font-bold",
                        style: { color: "var(--gray-12)" },
                        children: "Cookie preferences"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        className: "mt-1 text-[12.5px] leading-relaxed",
                        style: { color: "var(--gray-11)" },
                        children: "Choose which categories you want to allow. You can change this any time from the footer."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "aria-label": "Close",
                      className: "rounded-md p-1 transition-colors hover:bg-[var(--gray-a3)]",
                      style: { color: "var(--gray-11)" },
                      children: /* @__PURE__ */ jsx(X, { size: 16, "aria-hidden": true })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "px-6 py-5", children: [
              /* @__PURE__ */ jsx(
                CategoryRow,
                {
                  title: "Essential",
                  description: "Required for the site to work — auth, preferences, security. Always on.",
                  value: true,
                  disabled: true
                }
              ),
              /* @__PURE__ */ jsx(
                CategoryRow,
                {
                  title: "Analytics",
                  description: "Aggregated, anonymous usage analytics. Helps us see which pages convert.",
                  value: analytics,
                  onChange: onToggleAnalytics
                }
              ),
              /* @__PURE__ */ jsx(
                CategoryRow,
                {
                  title: "Marketing",
                  description: "Attribution for paid campaigns. Off by default; we don't run paid acquisition yet.",
                  value: marketing,
                  onChange: onToggleMarketing
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-col-reverse items-stretch gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between",
                style: {
                  background: "var(--gray-2)",
                  borderTop: "1px solid var(--gray-a4)"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: onRejectAll,
                      className: "rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors",
                      style: {
                        color: "var(--gray-11)",
                        background: "transparent"
                      },
                      children: "Reject all"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: onAcceptAll,
                        className: "flex-1 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors sm:flex-none",
                        style: {
                          color: "var(--gray-12)",
                          background: "var(--gray-3)",
                          border: "1px solid var(--gray-a5)"
                        },
                        children: "Accept all"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: onSave,
                        className: "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors sm:flex-none",
                        style: {
                          color: "var(--accent-contrast)",
                          background: "var(--accent-9)"
                        },
                        children: [
                          /* @__PURE__ */ jsx(Check, { size: 13, "aria-hidden": true }),
                          "Save preferences"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function CategoryRow({
  title,
  description,
  value,
  disabled = false,
  onChange
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-start gap-4 py-3.5",
      style: { borderBottom: "1px solid var(--gray-a3)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center gap-2 text-[14px] font-bold",
              style: { color: "var(--gray-12)" },
              children: [
                title,
                disabled && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    style: {
                      background: "var(--green-3)",
                      color: "var(--green-11)"
                    },
                    children: "Always on"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-1 text-[12.5px] leading-relaxed",
              style: { color: "var(--gray-11)" },
              children: description
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": value,
            disabled,
            onClick: () => !disabled && onChange?.(!value),
            className: "relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            style: {
              background: value ? "var(--accent-9)" : "var(--gray-5)"
            },
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: "absolute top-0.5 h-5 w-5 rounded-full transition-all",
                style: {
                  background: "white",
                  left: value ? "calc(100% - 22px)" : "2px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.18)"
                }
              }
            )
          }
        )
      ]
    }
  );
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://semlify.com");
const $$JsonLd = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$JsonLd;
  const { data } = Astro2.props;
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  function safeStringify(value) {
    return JSON.stringify(value).replace(/<\/(script)/gi, "<\\/$1");
  }
  return renderTemplate`${items.map((item) => renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(safeStringify(item))))}`;
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/JsonLd.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://semlify.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description,
    ogImage = "/og/default.png",
    current,
    withChrome = true,
    noindex = false,
    jsonLd
  } = Astro2.props;
  const fullTitle = title.includes("Semlify") ? title : `${title} \xB7 Semlify`;
  const siteOrigin = (Astro2.site ?? new URL("https://semlify.com")).toString().replace(/\/$/, "");
  const canonical = new URL(Astro2.url.pathname, Astro2.site ?? "https://semlify.com").toString();
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${siteOrigin}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Semlify",
    url: `${siteOrigin}/`,
    logo: `${siteOrigin}/favicon.svg`,
    description: "Semlify is the source of truth for the concepts your AI and data pipelines depend on \u2014 design, version, and ship knowledge graphs and SKOS / OWL taxonomies through a stable JSON-LD API.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@semlify.com",
        contactType: "customer support",
        areaServed: ["EU", "US"],
        availableLanguage: ["English", "French"]
      }
    ]
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Semlify",
    url: `${siteOrigin}/`
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#5b3df3"><meta name="format-detection" content="telephone=no">', "<title>", '</title><meta name="description"', '><link rel="canonical"', '><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Open Graph --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:image"', '><meta property="og:site_name" content="Semlify"><meta property="og:locale" content="en_US"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', ">", "", "", "", '</head> <body class="radix-themes flex min-h-screen flex-col" data-accent-color="violet" data-gray-color="slate" data-radius="medium" data-scaling="100%" data-panel-background="solid" data-is-root-theme="true">  <script>\n      (function () {\n        try {\n          var stored = window.localStorage.getItem("semlify.theme");\n          var prefersDark =\n            window.matchMedia &&\n            window.matchMedia("(prefers-color-scheme: dark)").matches;\n          var resolved =\n            stored === "light"\n              ? "light"\n              : stored === "dark"\n                ? "dark"\n                : prefersDark\n                  ? "dark"\n                  : "light";\n          document.body.classList.add(resolved);\n          document.body.setAttribute("data-appearance", resolved);\n        } catch (e) {\n          document.body.classList.add("light");\n          document.body.setAttribute("data-appearance", "light");\n        }\n      })();\n    <\/script>  <a href="#main" class="skip-link">Skip to main content</a> ', ' <main id="main" class="flex-1"> ', " </main> ", "  ", '  <script>\n      (function () {\n        if (\n          window.matchMedia &&\n          window.matchMedia("(prefers-reduced-motion: reduce)").matches\n        ) {\n          return;\n        }\n        var io = new IntersectionObserver(\n          function (entries) {\n            entries.forEach(function (entry) {\n              if (entry.isIntersecting) {\n                entry.target.classList.add("is-visible");\n                io.unobserve(entry.target);\n              }\n            });\n          },\n          { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }\n        );\n        document.querySelectorAll("[data-fade-up]").forEach(function (el) {\n          io.observe(el);\n        });\n      })();\n    <\/script> </body> </html>'])), noindex && renderTemplate`<meta name="robots" content="noindex, follow">`, fullTitle, addAttribute(description, "content"), addAttribute(canonical, "href"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(absoluteOgImage, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(absoluteOgImage, "content"), renderComponent($$result, "JsonLd", $$JsonLd, { "data": organizationLd }), renderComponent($$result, "JsonLd", $$JsonLd, { "data": websiteLd }), jsonLd && renderTemplate`${renderComponent($$result, "JsonLd", $$JsonLd, { "data": jsonLd })}`, renderHead(), withChrome && renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "current": current ?? Astro2.url.pathname })}`, renderSlot($$result, $$slots["default"]), withChrome && renderTemplate`${renderComponent($$result, "Footer", $$Footer, {})}`, renderComponent($$result, "CookieBanner", CookieBanner, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/components/CookieBanner.tsx", "client:component-export": "default" }));
}, "/sessions/bold-blissful-hawking/mnt/Ontologia/website/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
