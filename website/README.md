# Semlify.com — Marketing site

Astro 4 + React islands + Radix Themes + Tailwind (layout-only). Built per [WEBSITE_SPEC.md](WEBSITE_SPEC.md) and styled per [DESIGN_GUIDE.md](DESIGN_GUIDE.md).

## Phase 0 pages shipped

- **`/`** — Home with hero, three-pillar value strip, three-step walkthrough, customer quote, closing CTA.
- **`/pricing`** — four-tier comparison with monthly/annual toggle, add-ons, FAQ.
- **`/product`** — overview hero, value pillars, six feature cards.
- **`/security`** — posture grid, sub-processors table, disclosure block.
- **`/legal/terms`**, **`/legal/privacy`** — placeholder long-form prose.
- **`/404`** — friendly not-found.

Phase 1 (deferred): `/use-cases/*`, `/customers`, `/changelog`, `/company/about`, `/product/{schema,taxonomies,api,governance,ai}`, additional legal pages.

## Stack

- **Astro 4.16** — static-site generation with React island support.
- **Radix Themes 3.3** — same component library and theme tokens as the in-app mockup (`accentColor="violet"`, `grayColor="slate"`, `radius="medium"`, Inter via `--default-font-family` override).
- **Tailwind 3.4** — layout utilities only (`flex`, `grid`, `gap`, padding, sizing). All visual tokens come from Radix CSS variables.
- **Lucide React** — same icon set as the app.

## Run locally

```bash
cd website
npm install
npm run dev          # http://localhost:4321
```

## Build for production

```bash
npm run build        # outputs to dist/
npm run preview      # serve dist/ at http://localhost:4321
```

## Deploy to Netlify

The repo includes `netlify.toml` with the right defaults:

- Build command: `npm run build`
- Publish directory: `dist`
- Node 20

In Netlify: **Add new site → Import from Git** → point at this folder. The first build runs automatically. Custom domain → connect `semlify.com` and let Netlify manage TLS via Let's Encrypt.

## File layout

```
website/
├── astro.config.mjs           Astro + React + Tailwind + sitemap
├── tailwind.config.mjs        Layout-only utilities, no theme tokens
├── tsconfig.json
├── netlify.toml               Build + cache headers
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── layouts/
    │   └── Layout.astro       <Theme>-equivalent body data attrs + Inter
    ├── components/
    │   ├── Logo.astro         Logomark + wordmark
    │   ├── Nav.astro          Sticky top nav
    │   ├── Footer.astro       4-column footer
    │   ├── Hero.astro         7/5 split hero with illustration
    │   ├── SchemaIllustration.astro   T-Box → A-Box → API SVG
    │   ├── PillarStrip.astro  Three-card value strip
    │   ├── WalkthroughStep.astro      Numbered step with media slot
    │   ├── QuoteCard.astro    Testimonial composition
    │   ├── CodeBlock.astro    Dark code snippet
    │   ├── CtaBlock.astro     Violet-wash closing CTA
    │   └── PricingTable.tsx   React island for monthly/annual toggle
    ├── pages/
    │   ├── index.astro        Home
    │   ├── pricing.astro
    │   ├── product/index.astro
    │   ├── security.astro
    │   ├── legal/{terms,privacy}.astro
    │   └── 404.astro
    └── styles/
        └── global.css         Radix Themes import + Inter override + marketing tokens
```

## What's intentionally stubbed

- `/customers`, `/changelog`, `/company/*`, `/use-cases/*`, `/product/{schema,taxonomies,api,governance,ai}`, `/legal/{dpa,sla,subprocessors}` — links exist in nav/footer but pages aren't built. Phase 1.
- Sign-in / sign-up CTAs deep-link to `app.semlify.com/{signin,signup}`. The app side handles auth; the marketing site only drives traffic.
- OG image at `/og/default.png` — needs designing. Until then social previews fall back to the favicon.
- Analytics — PostHog wrapper is stubbed (`src/lib/analytics.ts`); wire when the PostHog project is provisioned.

## Editing the site

- **Copy changes**: edit the relevant `.astro` page directly. No build step needed for content.
- **Adding a page**: drop a new file in `src/pages/`. Routing is file-based.
- **Adding a section to home**: import the composition you need from `src/components/`, drop it into `index.astro`. Components compose; resist the urge to one-off-style.
- **Color tweaks**: change the Theme prop or override the relevant CSS variable in `global.css`. Don't introduce hex codes — see `DESIGN_GUIDE.md`.
