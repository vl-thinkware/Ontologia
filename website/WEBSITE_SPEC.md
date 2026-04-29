# Semlify.com — Website Specification

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v1

---

This document defines what `semlify.com` should contain — the marketing site that introduces, positions and converts visitors into trial users. It is a sibling to (not a replacement for) `app.semlify.com` (the product), `docs.semlify.com` (the documentation), and `status.semlify.com` (the status page).

For the visual rules and component vocabulary that make the site feel like the product, see [DESIGN_GUIDE.md](DESIGN_GUIDE.md).

---

## 1. Goals

The website has four jobs, in priority order:

1. **Activate.** Get a qualified visitor to start a free workspace. Target: 4% landing → sign-up conversion within 6 months of launch.
2. **Position.** Make Semlify legible in 8 seconds — what it is, what makes it different, who it's for.
3. **Disarm objections.** Pricing, security, integrations, "why not just use X" — all answered without a sales call.
4. **Recruit & evangelise.** Be the artefact a prospective design partner, journalist or hire reads to decide we're serious.

Non-goals:

- A marketing-automation funnel. No lead-gen forms, gated content, or email capture before the user has tried the product.
- A blog launchpad. We will publish, but the first version of the site doesn't depend on a content-marketing engine.
- Multi-language. English at launch. French as a fast-follow if a francophone customer asks.

## 2. Audience

Three primary personas in priority order, mirroring [PERSONAS.md](PERSONAS%20(imported%20to%20notion).md):

1. **AI / Platform engineer** — runs RAG, search, agent tooling. Reads the docs first, the pricing second. Wants: clean exports, stable API, version pinning, TypeScript SDK. Skeptical of "AI marketing" copy.
2. **Data architect / ontologist** — designs T-Boxes for a living. Wants: T-Box / A-Box separation, SKOS / OWL fidelity, multi-taxonomy support, validation rigour. Allergic to "no-code" framing.
3. **Head of AI / Head of Data** — buys the seat the engineer asks for. Wants: pricing transparency, security posture, compliance roadmap, customer logos.

We optimise the home page for persona 1 and persona 2 reading it together. Persona 3 reads `/pricing`, `/security`, and `/customers`.

## 3. Information architecture

```
semlify.com
├── /                            Home — hero + product story
├── /product                     Product overview (long-form features)
│   ├── /product/schema          T-Box editor + canvas + SKOS attributes
│   ├── /product/taxonomies      Taxonomies tree + drag-drop reparenting
│   ├── /product/api             API + version pinning + playground
│   ├── /product/governance      Change log, revert, tags, validation
│   └── /product/ai              AI helpers (alt-labels, translations, dupes)
├── /use-cases
│   ├── /use-cases/rag           "Ground your RAG in a versioned ontology"
│   ├── /use-cases/catalog       "Product catalogues with multi-taxonomies"
│   └── /use-cases/governance    "Glossary + taxonomy in one tool"
├── /pricing                     Four-tier table + FAQ
├── /customers                   Logos, case studies (3 at GA)
├── /security                    Security posture, sub-processors, SOC 2 plan
├── /docs                        ⤴ external link to docs.semlify.com
├── /changelog                   Released features (rendered from product changelog)
├── /company
│   ├── /about                   Founders, story, principles
│   └── /careers                 Roles (empty until first hire)
├── /legal
│   ├── /legal/terms
│   ├── /legal/privacy
│   ├── /legal/dpa
│   ├── /legal/sla               (rendered from docs/05_operations/SLA.md)
│   └── /legal/subprocessors
├── /signin                      ⤴ to app.semlify.com
└── /signup                      ⤴ to app.semlify.com (or inline if Clerk allows)
```

Sitemap depth is deliberately shallow — every page is at most two clicks from the home page.

## 4. Page-by-page content

### 4.1 Home (`/`)

The single most important page. Five sections, each one screen tall on a 14" laptop.

1. **Hero.** Headline + sub + dual CTA + one hero asset.
   - Headline: *"The source of truth for your concepts."* (working — design pass may refine.)
   - Sub: *"Design, version and ship the ontology your AI and data pipelines depend on. SKOS-aligned. Graph-native. Zero PhD required."*
   - Primary CTA: *Try free* → `app.semlify.com/signup`
   - Secondary CTA: *Read the docs* → `docs.semlify.com`
   - Hero asset: an animated SVG schematic of Schema → Taxonomies → API, or a tasteful loop of the actual canvas. **Not** a stock illustration. **Not** a hero video.
   - Trust strip below: *"Built on Neo4j · SKOS / OWL / JSON-LD exports · Free tier"*.

2. **Three-pillar value strip.** Three cards, equal weight.
   - **Graph-native.** "One engine for schema, taxonomy, and instances. Not three tools stitched together."
   - **Versioned.** "Every change is a reversible, attributable event. Tag a snapshot. Diff two tags. Revert a mistake."
   - **API-first.** "Stable JSON-LD / SKOS / OWL endpoints with version pinning. Your RAG pipeline ships against a tag."

3. **Product walkthrough.** A 3-step interactive scrollytelling section.
   - Step 1: *Design your T-Box.* Screenshot of the Schema canvas with classes + relation types.
   - Step 2: *Curate your taxonomies.* Screenshot of the tree view with concept detail.
   - Step 3: *Ship to your stack.* Code snippet of `fetch("…?tag=v1.3&format=jsonld")` next to the API Playground screenshot.

4. **Quote / social proof.** One real customer quote (or a strong design-partner quote pre-GA). Card uses the same `<Card variant="surface">` styling as the in-app testimonial card on the sign-in screen.

5. **Closing CTA.** Repeats the hero CTA pair on a violet wash background. Footer below.

### 4.2 Product (`/product` and children)

Long-form feature pages. Each follows the same template:

- **Hero**: feature name, one-line value prop, screenshot of the actual mockup screen.
- **Three "what it does" cards** with a Lucide icon and 60-word descriptions.
- **Live demo or code block** where applicable (e.g. `/product/api` shows real cURL).
- **Cross-links** to neighbouring product pages.
- **CTA**: *Try this in your workspace* → signup deep-linked into the relevant template.

### 4.3 Use cases (`/use-cases/*`)

Each use case page is a structured argument:

- **The problem.** Two paragraphs naming the customer's pain in their own words.
- **How Semlify solves it.** A specific reference shape (T-Box outline + sample schemes) with a screenshot.
- **What you'd do in week one.** A numbered list of concrete first actions.
- **Reference customer or design partner.** Logo + 2-line quote when available.
- **CTA**: *Start with this template* → signup with the relevant starter pre-selected.

### 4.4 Pricing (`/pricing`)

Mirrors `/settings/billing` in the app, but framed for buyers:

- **Four-column comparison table** for Free / Team / Business / Enterprise — same caps and inclusions as `PRICING_MODEL.md`.
- **Annual / monthly toggle** showing the 17 % annual discount.
- **Add-on row**: extra concepts, extra API calls, AI pack.
- **FAQ** — at minimum: "Can I self-host?", "What happens at the concept ceiling?", "Do you offer a startup discount?", "How do you handle GDPR?", "What's covered by the SLA?".

### 4.5 Customers (`/customers`)

Three slots at GA. Each customer card opens to a longer story page if the customer agrees. Otherwise: logo + one-paragraph use-case + role of the buyer.

### 4.6 Security (`/security`)

Single page covering:

- Posture: encryption at rest / in transit, RLS, regional data residency.
- Compliance roadmap: SOC 2 Type I within 12 months, Type II within 24 months.
- Sub-processors list (linkable, copy-pastable for procurement).
- Bug bounty contact.
- Direct excerpt from the [SECURITY.md](../docs/06_security_compliance/SECURITY.md) doc — the source of truth lives in the repo, the website renders the public-friendly subset.

### 4.7 Changelog (`/changelog`)

Rendered from the same source the in-app changelog uses. Reverse chronological. Every entry has: date, semver tag, two-line summary, link to the relevant docs page.

### 4.8 About (`/company/about`)

- Founders' photo + names + roles (Alexandre, Valentin).
- One-paragraph origin story (from VISION.md).
- Three guiding principles excerpted from VISION.md.
- Investor / advisor logos when applicable.

### 4.9 Legal pages

Plain prose. Same Inter typography as the rest of the site, slightly tighter measure (640px). Each renders from a markdown source under `legal/` so legal review can edit without touching the codebase.

## 5. Visual & brand consistency

The website must feel like the same product as the app. Concretely:

- **Same theme tokens.** Radix Themes `accentColor="violet"`, `grayColor="slate"`, `radius="medium"`, `scaling="100%"`. The website imports `@radix-ui/themes/styles.css` and wraps content in `<Theme>` exactly like the app.
- **Same fonts.** Inter via `--default-font-family`, JetBrains Mono via `--code-font-family`.
- **Same component vocabulary.** `<Button>`, `<Card>`, `<Heading>`, `<Text>`, `<Badge>`, `<Code>`, `<Kbd>` from Radix Themes. No bespoke marketing button styles.
- **Same iconography.** Lucide stroke 1.5, sized 16/20/24 like the app.
- **Same brand chrome.** Logomark + wordmark in the same lockup as the in-app sidebar header. Sign-in screen marketing panel reused as a hero pattern.

Differences from the app — explicitly allowed and expected:

- Wider type scale (the app caps at `<Heading size="8">` ≈ 36 px; the website's hero may go to 56–72 px).
- More vertical rhythm — generous whitespace between sections, more breathing room than the dense in-app data UI.
- Marketing illustrations and gradient washes that wouldn't appear in the product surface.
- Light-mode-first hero, dark-mode-supported throughout (toggle in the footer).

The companion [DESIGN_GUIDE.md](DESIGN_GUIDE.md) locks the specifics — type scale, hero composition, illustration style, motion rules.

## 6. Tech stack

Recommended:

- **Astro 4.x** for the site framework.
  - Static-site generation by default → fast page loads, perfect SEO.
  - React islands (`client:load`, `client:visible`) for the few interactive bits (pricing toggle, scrollytelling, dark-mode switch).
  - First-class MDX support so legal, changelog and case-study pages stay close to the source markdown.
- **Radix Themes 3.x** as the component library — same package the mockup uses, so visual tokens come for free.
- **Tailwind CSS 3.x** layout-only, same boundary as the app.
- **Vercel** for hosting (preview-per-PR, edge cache, image optimisation).
- **Cloudflare** in front for WAF and bot management.

Why not Next.js? We don't need server components, API routes or middleware on the marketing site — Astro's lighter ceiling matches what we're building. The app already runs Next-or-Vite-equivalent; keeping the website lean is a virtue, not a duplication.

Why not pure HTML / Eleventy? We want React islands so we can drop the actual mockup `Toaster`, `Tabs`, `Card` components into hero demos without re-implementing them.

## 7. Performance & SEO budgets

| Page | TTI budget | JS shipped (gzipped) | Lighthouse target |
|---|---|---|---|
| `/` | ≤ 1.5 s on 4G | ≤ 60 KB | 95+ on all four scores |
| `/pricing` | ≤ 1.0 s | ≤ 30 KB | 100/100 |
| `/product/*` | ≤ 1.5 s | ≤ 80 KB (incl. demos) | 95+ |
| `/legal/*` | ≤ 0.8 s | ≤ 0 KB JS | 100/100 |

- Every page has hand-authored `<title>`, `<meta name="description">`, OG image (1200×630), Twitter card tags.
- Structured data (`Organization`, `Product`, `FAQPage`, `BreadcrumbList`) on the relevant pages.
- Sitemap.xml + robots.txt generated at build.
- Canonical URLs to avoid duplicate-content penalties from `?utm_*` tracking.

## 8. Conversion paths

Three primary conversion paths the site is designed around:

1. **Engineer self-serve.** Lands on `/`, scans hero, jumps to `/docs` or `/product/api`, reads enough to be convinced, hits *Try free* → signs up with the **Catalog with multi-taxonomies** starter pre-loaded → 5 minutes later runs the API Playground against their own data. Target: 6 minutes from landing to first API call.
2. **Architect deep-dive.** Lands on `/`, reads `/product/schema` and `/product/governance`, checks `/pricing` and `/security`, signs up with the **Blank** starter to design their T-Box from scratch. Target: 12 minutes from landing to first ConceptClass created.
3. **Buyer evaluation.** Lands on `/customers` or `/pricing`, opens `/security`, downloads the SLA, schedules a call (form on `/pricing` Enterprise tier). Target: 1 booked call per 200 buyer-segment visitors.

Every CTA is instrumented (PostHog event `cta_clicked` with `placement` + `target`). We measure each path's funnel and iterate.

## 9. Trust signals

In rough order of weight, the site surfaces:

- **Product screenshots** — real Cars-ontology data, not lorem ipsum.
- **Customer logos** — three at GA, growing thereafter. Always with permission and a backing case study.
- **Open standards** — SKOS / OWL / JSON-LD logos in the footer; "interoperable by design" framing.
- **Neo4j partnership** — "Built on Neo4j Aura" badge in the hero trust strip.
- **Founders' bylines** — link to their LinkedIn profiles in the footer.
- **Public changelog** — proves we ship.
- **Public status page** — proves we keep things running.
- **SLA + sub-processors** — proves we're enterprise-ready.

What we deliberately don't lean on at launch: testimonials we don't have, awards we haven't won, customer counts we haven't earned. If a section isn't ready, we cut it rather than fluff it.

## 10. Repository layout

```
website/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── public/
│   ├── og/                   # Open Graph cards per page
│   ├── illustrations/        # SVG hero / section art
│   ├── screenshots/          # PNG / WebP product screenshots
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Layout.astro      # Theme provider + nav + footer
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── PricingTable.tsx  # React island
│   │   ├── ProductWalkthrough.tsx
│   │   └── …
│   ├── content/
│   │   ├── pages/            # MDX for each marketing page
│   │   ├── changelog/        # Per-release MDX entries
│   │   ├── customers/        # Per-customer MDX entries
│   │   └── legal/            # MDX for terms / privacy / DPA
│   ├── pages/                # Astro routing
│   │   ├── index.astro
│   │   ├── pricing.astro
│   │   ├── product/
│   │   ├── use-cases/
│   │   ├── customers/
│   │   ├── security.astro
│   │   ├── changelog.astro
│   │   ├── company/
│   │   └── legal/
│   ├── styles/
│   │   ├── global.css        # Radix Themes import + Inter override
│   │   └── tokens.css        # Marketing-only token additions
│   └── lib/
│       └── analytics.ts      # PostHog wrapper
├── DESIGN_GUIDE.md           # Companion to this spec, owned by design
└── README.md                 # How to run + deploy
```

## 11. Launch checklist

Before flipping `semlify.com` live:

- [ ] All copy reviewed by Valentin (positioning) and Alexandre (technical accuracy)
- [ ] OG cards rendered for every page
- [ ] Lighthouse 95+ across the board on `/`, `/pricing`, `/product`, `/security`
- [ ] PostHog events firing on every CTA
- [ ] Sitemap submitted to Google Search Console
- [ ] Cookie banner (EU) — minimal, dismiss-only, no tracking by default
- [ ] Cold cache load tested from Paris, NYC, São Paulo, Singapore
- [ ] 404 page designed (uses the same Theme + a friendly empty state)
- [ ] Status page link in the footer points at `status.semlify.com`
- [ ] Legal pages signed off by counsel
- [ ] DNS, TLS, and Cloudflare WAF rules configured
- [ ] `robots.txt` correct for staging vs production

## 12. Open questions

- **Marketing-site vs in-app sign-up.** Does the *Try free* CTA jump to `app.semlify.com/signup` (full-page redirect) or open a Clerk widget inline? Inline is smoother but adds a JS dependency to the home page. Recommendation: full-page redirect at launch, inline once Lighthouse-budget headroom allows.
- **Animated hero asset.** SVG loop, MP4 with poster, or scroll-driven canvas? Decided in the design pass. Whichever option respects `prefers-reduced-motion`.
- **AI tone calibration.** The brand guidelines forbid "revolutionary / unprecedented" hype. The home page hero must thread the needle of being confident without flirting with that vocabulary.
- **Pricing currency.** USD-only at launch, or USD + EUR? French-speaking founders, but most prospects are US/UK. Recommendation: USD-only at launch, EUR added when the first French customer asks for it.
- **Blog — yes / no at launch.** A blog needs ongoing input we can't yet promise. Recommendation: ship `/changelog` only, defer `/blog` to V1.

## 13. Phasing

We don't try to ship every page at once.

- **Phase 0 (1 week)** — Home, Pricing, Product overview, Security (excerpt), Legal pages. Enough to point a prospect at.
- **Phase 1 (1 week)** — Use cases (one page), three Customer stories (or three logos with one-paragraph quotes), Changelog, About, all four `/product/*` deep dives.
- **Phase 2 (post-GA)** — Two more use case pages, careers (when hiring opens), expanded changelog with filtering, French translation if a customer asks.

---

Related: [BRAND_GUIDELINES.md](../docs/04_design/BRAND_GUIDELINES.md) · [DESIGN_SYSTEM.md](../docs/04_design/DESIGN_SYSTEM.md) · [VISION.md](VISION%20(imported%20to%20notion).md) · [PRICING_MODEL.md](../docs/08_finance/PRICING_MODEL.md) · [DESIGN_GUIDE.md](DESIGN_GUIDE.md) (companion document)
