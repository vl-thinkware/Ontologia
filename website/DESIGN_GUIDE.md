# Semlify.com — Design Guide

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v1 · **Last updated**: 25 April 2026

---

This document is the visual companion to [WEBSITE_SPEC.md](WEBSITE_SPEC.md). It locks the type scale, color decisions, hero composition, motion, illustration style, and component vocabulary so that a designer or front-end engineer can start coding `semlify.com` without coming back to ask follow-up questions.

The website's job is to feel like the same product as `app.semlify.com` — the same theme, the same fonts, the same Radix Themes primitives — but at marketing volume: more breathing room, larger type, hero gradients, and the few well-placed illustrations the in-app surface deliberately does without.

Sources of truth:

- `mockup/src/main.tsx` — the live `<Theme>` configuration the app ships with.
- `docs/04_design/DESIGN_SYSTEM.md` — the canonical token table.
- `docs/04_design/BRAND_GUIDELINES.md` — voice, photography, motion rules. Note: the indigo `#6366F1` referenced there is **superseded** by the violet decision below.

---

## 1. Visual principles

Five rules that distinguish marketing-Semlify from app-Semlify, while keeping the same skeleton.

### 1.1 Same theme, more breathing room

The website uses the same Radix Themes tokens as the app — but doubles the vertical rhythm. In-app sections sit on `var(--space-5)` (24 px) padding because every pixel competes with data. Marketing sections sit on `var(--space-9)` (64 px) inside the section, with 96–160 px between sections. **Rule**: never let a marketing section feel as dense as the dashboard.

*Example*: where the in-app `Card size="3"` uses 32 px padding, a marketing feature card uses 40–48 px and clears at least 96 px of vertical air on either side.

### 1.2 Type leads, illustration supports

We are a tool for people who model meaning for a living. They scan headlines and read the proof; they don't need a hero animation to understand what an ontology is. **Rule**: every page leads with a typographic statement. Illustration earns its place by clarifying a concept the words can't carry alone (e.g. the Schema → Taxonomies → API flow).

*Example*: the home hero is 56–72 px display type with a small product schematic; it is **not** a full-bleed product video.

### 1.3 Calm gradients, no glow

The accent gradient is a brand signature — but a tasteful one. We use a single `linear-gradient(135deg, var(--accent-9), var(--accent-11))` across the in-app sidebar logomark and the SignIn marketing panel; the website extends this to closing-CTA backgrounds and OG cards, never to buttons or icons. **Rule**: gradients live on surfaces, not on interactive elements. No glow shadows, no neon outlines.

*Example*: the closing-CTA section has a violet wash background; the buttons sitting on it are flat `<Button variant="solid">`, exactly the same as on a white surface.

### 1.4 Show the actual product

Trust is earned with screenshots of real Cars-ontology data, real diff overlays, real API responses. **Rule**: no stock photography, no placeholder lorem ipsum, no idealised UI that doesn't ship. If a feature isn't in the mockup, we don't show it on the website.

*Example*: the `/product/api` page embeds a real `fetch("…?tag=v1.3&format=jsonld")` snippet with the response that the playground actually returns today.

### 1.5 Dense when it matters

The website is breezier than the app, but the pricing table, security posture, and changelog stay information-dense. **Rule**: when the reader is in evaluation mode, give them the data — comparison rows, sub-processor lists, semver entries — at app-density, not marketing-density. Don't dilute the moments where rigor is the message.

*Example*: `/pricing` uses the same `<Table>` densities as the in-app billing screen, not a four-column hero composition.

### 1.6 One accent, used sparingly

The 60/30/10 ratio from the brand guidelines holds: 60 % neutrals (`--gray-*`), 30 % brand violet, 10 % semantic accents (success / warning / danger / info). **Rule**: the page should read as gray with violet emphasis, not as violet with gray. A page that uses violet on more than one third of its visual area is doing too much.

---

## 2. Color

### 2.1 Resolving the indigo-versus-violet conflict

The brand guidelines (v2) still list `brand.500 = #6366F1` (Tailwind indigo-500). The live app — including this mockup — runs `accentColor="violet"` on Radix Themes, which resolves `--accent-9` to roughly `#8b5cf6` in light mode (Tailwind violet-500 territory). These are visually distinct: indigo is bluer and cooler, violet is redder and warmer.

**Decision: the website uses violet, matching the app.**

The live product is the canonical artefact. A buyer who clicks *Try free* must not see a hue change between the marketing site and the app — that is a tell that the team isn't aligned. The brand guidelines doc will be updated to retire the `#6366F1` swatch in a follow-up; until then, **DESIGN_GUIDE.md overrides BRAND_GUIDELINES.md on color**.

### 2.2 Theme provider — exact configuration

Every page wraps its content in:

```tsx
<Theme
  accentColor="violet"
  grayColor="slate"
  radius="medium"
  scaling="100%"
  panelBackground="solid"
  appearance="inherit"   // see §10 — the marketing site supports both modes
>
  {children}
</Theme>
```

This is byte-for-byte identical to `mockup/src/main.tsx` except `appearance` switches from `"light"` to `"inherit"` so a user toggle (footer) can flip the surface.

### 2.3 Working palette — variables, not hex

Inside the page, **always** address color via CSS variable, never raw hex. This keeps light/dark mode automatic and lets a future theme swap propagate.

| Role | Variable | Example use |
|---|---|---|
| Page background | `var(--gray-1)` | `<body>`, hero base |
| Section wash (subtle) | `var(--gray-2)` | Alternating section backgrounds |
| Panel surface | `var(--color-panel-solid)` | Cards, pricing column, code block frame |
| Panel translucent | `var(--color-panel-translucent)` | Sticky nav with `backdrop-filter: blur(8px)` |
| Border, hairline | `var(--gray-a4)` | Card borders, dividers |
| Border, emphatic | `var(--gray-a6)` | Active tab underline |
| Body text | `var(--gray-11)` | Paragraph copy |
| Heading text | `var(--gray-12)` | H1, H2, eyebrow on dark |
| Muted / caption | `var(--gray-9)` | Eyebrow on light, helper text |
| Accent fill | `var(--accent-9)` | Primary `<Button>`, accent badges |
| Accent fill hover | `var(--accent-10)` | Button hover (Radix handles automatically) |
| Accent text | `var(--accent-11)` | Inline link color, "violet" `<Text color="violet">` |
| Accent emphasis | `var(--accent-12)` | Hero supporting text on dark gradients |
| Accent contrast | `var(--accent-contrast)` | Text laid over `--accent-9` |
| Success | `var(--green-9)` / `--green-11` | "Free tier" badge, valid state |
| Warning | `var(--amber-9)` / `--amber-11` | Deprecation, "rate-limit" callouts |
| Danger | `var(--ruby-9)` / `--ruby-11` | Error state, destructive emphasis |
| Info | `var(--sky-9)` / `--sky-11` | "New" tags, neutral highlights |

### 2.4 Marketing-specific gradients

Three gradient recipes, used everywhere they appear, never improvised:

```css
/* The brand gradient — sidebar logomark, closing-CTA wash, OG cards */
--marketing-gradient-brand:
  linear-gradient(135deg, var(--accent-9) 0%, var(--accent-11) 100%);

/* The hero panel — same family the SignIn marketing panel uses,
   slightly deeper for hero presence */
--marketing-gradient-hero:
  linear-gradient(135deg, var(--violet-10) 0%, var(--violet-12) 70%,
                          var(--violet-12) 100%);

/* The section wash — lifts a section without becoming chrome */
--marketing-gradient-section:
  linear-gradient(180deg, var(--violet-2) 0%, var(--gray-1) 100%);
```

These are the only gradients that appear on the site. Any other gradient is wrong.

### 2.5 Hex anchors for OG cards, social, email

Some surfaces don't resolve CSS variables — Open Graph PNGs, transactional email, Slack unfurl previews. For these, fall back to the **light-mode** values of the variables above:

| Variable | Hex (light) | Used in |
|---|---|---|
| `--accent-9` (violet 9) | `#6E56CF` | OG gradient start, email button background |
| `--accent-11` (violet 11) | `#5746AF` | OG gradient end, email link color |
| `--accent-12` (violet 12) | `#2F265F` | OG headline color when on white card |
| `--gray-1` | `#FCFCFD` | Email canvas background |
| `--gray-12` | `#1B1D1F` | Email body text |
| `--green-9` | `#30A46C` | "Free tier" badge baked into OG cards |
| `--amber-9` | `#FFB224` | Status warning baked into OG cards |
| `--ruby-9` | `#E54666` | Status danger baked into OG cards |
| `--sky-9` | `#0091FF` | "New" baked into OG cards |

These are the Radix `violet`, `slate`, `green`, `amber`, `ruby`, `sky` step-9 values at the time of writing (Radix Colors 3.x). If Radix updates these scales, regenerate the OG card PNGs.

---

## 3. Typography for marketing

Inter for sans, JetBrains Mono for code — same files the app loads. No custom display face, no second sans, no variable-axis flourish.

### 3.1 Marketing scale

The in-app scale caps at `<Heading size="8">` (≈ 36 px). The website extends above that for hero compositions and section headlines. We define five **marketing-only** type roles that live alongside Radix's `<Heading>` and `<Text>` sizes:

| Role | Desktop (≥ 1024 px) | Tablet (768 px) | Mobile (360 px) | Weight | Tracking | Notes |
|---|---|---|---|---|---|---|
| Hero display | 64 / 70 px (`clamp(56,7vw,72)`) | 48 / 54 px | 36 / 42 px | 600 | -0.02em | Home hero, occasional product page |
| Section headline | 44 / 52 px | 36 / 42 px | 28 / 34 px | 600 | -0.015em | "The three pillars", "Pricing", section h2 |
| Page title (H1) | `<Heading size="8">` (36 / 44) | size 7 (28 / 36) | size 7 | 700 | -0.01em | `/security`, `/changelog`, default |
| Sub-section (H2) | `<Heading size="6">` (22 / 30) | size 6 | size 5 (18 / 26) | 600 | -0.005em | Within long pages |
| Eyebrow | 12 px | 12 px | 11 px | 500 | +0.08em | UPPERCASE; "PRODUCT", "WHY ONTOLOGIA" |
| Pull-quote | 26 / 36 px | 22 / 32 px | 20 / 28 px | 500 | -0.005em | Customer quote section |
| Body L | 18 / 28 px | 17 / 26 px | 16 / 24 px | 400 | 0 | Hero sub, marketing paragraphs |
| Body M | 16 / 24 px | 16 / 24 px | 15 / 22 px | 400 | 0 | Default paragraph |
| Body S | 14 / 20 px | 14 / 20 px | 13 / 18 px | 400 | 0 | Captions, footnotes |
| Code | 14 / 22 px (mono) | 14 / 22 | 13 / 20 | 500 | 0 | `<Code>` blocks |

A worked CSS-variable example for the hero display:

```css
.hero-display {
  font-family: var(--default-font-family);
  font-size: clamp(2.25rem, 6.5vw, 4.5rem);   /* 36 → 72 px */
  line-height: 1.08;
  letter-spacing: -0.02em;
  font-weight: 600;
  color: var(--gray-12);
}
```

### 3.2 Weight discipline

- **Inter 600** — every headline (hero, section, H1, H2). No 700-weight headlines; Inter at 600 has the right density.
- **Inter 700** — reserved for the wordmark in the nav and footer logo lockups. Nothing else.
- **Inter 500** — eyebrows, badges, button labels.
- **Inter 400** — all body copy, including the hero sub.
- **JetBrains Mono 500** — `<Code>` and `<Kbd>` content; matches the in-app weight.

### 3.3 Tabular numerals

Pricing, statistics, comparison tables, API rate-limit numbers — anywhere digits line up vertically — use tabular figures:

```css
.tabular { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
```

Apply via a utility class on the `<Text>` or `<th>` element. The pricing table needs this; the hero does not.

### 3.4 Measure (line length)

- Hero sub: max 32em.
- Marketing paragraphs: max 38em.
- Legal pages: 40em (slightly tighter — readers are scanning for clauses, not skimming).
- Code blocks: no max; horizontal scroll if needed, never wrap.

---

## 4. Layout & grid

### 4.1 Page max-width

**1280 px** is the outer max-width of the content column. This is wider than the in-app default `Container size="3"` (1024 px) because marketing pages thrive on horizontal generosity, but narrower than the modern 1440 px trend so the layout doesn't disintegrate on a 14" laptop.

The page itself goes edge-to-edge for full-bleed sections (hero gradient, closing CTA), but the content inside any section is always centered inside a 1280 px max with side gutters.

### 4.2 Side gutters

| Breakpoint | Gutter |
|---|---|
| ≥ 1280 px | 32 px (auto-centered, max-width capped) |
| 1024–1280 px | 32 px |
| 768–1024 px | 24 px |
| < 768 px | 20 px |

### 4.3 12-column grid

Inside the 1280 px container, a 12-column grid with `--space-5` (24 px) gutters at desktop, dropping to `--space-4` (16 px) at tablet, single-column-stacked at mobile. Tailwind's `grid-cols-12 gap-6` is the layout primitive — no custom grid CSS.

### 4.4 Vertical rhythm between sections

Marketing pages stack five to seven sections; the spacing between them sets the pace.

| Context | Spacing |
|---|---|
| Major section to major section | **120 px desktop** / 80 px tablet / 64 px mobile |
| Hero to first section | **160 px desktop** / 96 px tablet / 64 px mobile |
| Between sub-blocks within one section | 64 px / 48 px / 32 px |
| Last section to footer | 96 px / 64 px / 48 px |

Codified as Tailwind utility classes via `tailwind.config.mjs`:

```js
spacing: {
  'section-sm': 'clamp(4rem, 6vw, 6rem)',   //  64 → 96 px
  'section-md': 'clamp(5rem, 8vw, 7.5rem)', //  80 → 120 px
  'section-lg': 'clamp(6rem, 10vw, 10rem)', //  96 → 160 px
}
```

### 4.5 Hero composition: asymmetric, 7/5 split

The home hero is **asymmetric: 7 columns text, 5 columns visual**, on a 12-column grid at desktop. This rhymes with — but does not copy — the SignIn screen's 50/50 split, which works there because the form needs equal weight. On a marketing hero the headline must dominate, so we widen the text column.

At tablet (< 1024 px), the visual stacks below the text, full-width. At mobile, the visual is optionally hidden behind a "See it" button to keep TTI low.

We do **not** invert the SignIn pattern (visual-left, text-right). Reading order is left-to-right, the headline gets the first cell.

Other page heroes (`/product/*`, `/pricing`, `/security`) use a centered single-column hero — text only, max-width 720 px — because they don't need a visual to carry the message. Only `/` and case-study pages get the asymmetric split.

---

## 5. Hero composition rules

### 5.1 The home hero, in pieces

```
┌─────────────────────────────────────────────────────────────────┐
│                          [sticky nav]                            │
│                                                                  │
│   col 1–7                              col 8–12                  │
│                                                                  │
│   PRODUCT (eyebrow)                    ┌─────────────────────┐   │
│                                        │                     │   │
│   The source of truth                  │   Animated SVG      │   │
│   for your concepts.                   │   schematic of      │   │
│                                        │   Schema →          │   │
│   Design, version and ship the         │   Taxonomies →      │   │
│   ontology your AI and data            │   API               │   │
│   pipelines depend on. SKOS-           │                     │   │
│   aligned. Graph-native. Zero          │   (light wash bg)   │   │
│   PhD required.                        │                     │   │
│                                        └─────────────────────┘   │
│   [Try free →]   [Read the docs]                                 │
│                                                                  │
│   Built on Neo4j · SKOS / OWL / JSON-LD · Free tier              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 The hero asset — decision

Three options were on the table:

1. Animated SVG schematic of the **Schema → Taxonomies → API** flow.
2. Lottie loop of the actual canvas, rendering nodes appearing on a graph.
3. Static high-contrast screenshot of the Schema canvas with overlay annotations.

**Decision: option 1 — animated SVG schematic.**

Rationale:
- It carries the product's *idea* (typed graph → versioned exports) more legibly in three seconds than a screenshot of the canvas does.
- SVG is small, accessible, and easy to gate on `prefers-reduced-motion`.
- A canvas Lottie would either be too literal (showing UI chrome that ages with the product) or too abstract (decorative wiggling).
- A static screenshot is acceptable as a fallback when JS fails, but loses too much expressiveness for the headline impression.

The SVG ships three labelled rounded panels — **Schema**, **Taxonomies**, **API** — connected by violet edges. A 6-second loop pulses one edge at a time (Schema → Taxonomies → API → Schema), with concept nodes appearing inside each panel mid-cycle. Total motion: under 12 elements animating, never more than three at once.

When `prefers-reduced-motion: reduce` is set, the SVG ships in its terminal state (all nodes visible, no pulsing). When JS is disabled, the same SVG renders without the keyframes wired up — graceful by default.

### 5.3 Hero asset placement

The schematic sits inside a `<Box>` with a soft violet wash:

```tsx
<Box
  className="rounded-[var(--radius-6)] p-8"
  style={{
    background: 'var(--marketing-gradient-section)',
    border: '1px solid var(--gray-a4)',
  }}
>
  <SchemaTaxonomiesApiSvg />
</Box>
```

It is **not** dropshadowed onto a violet bleed background — that would compete with the hero gradient on the closing CTA further down the page. The violet ramps progressively as the visitor scrolls.

### 5.4 Reduced-motion fallback

Every hero animation respects `prefers-reduced-motion`. The CSS pattern:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-edge { animation: pulse-edge 6s ease-in-out infinite; }
  .hero-node { animation: pop-in 320ms ease-out backwards; }
}
```

No motion outside the `no-preference` block. No JavaScript-driven animation that ignores the media query.

---

## 6. Component vocabulary for marketing

Same package the app uses — `@radix-ui/themes` — same component names, same prop API. No bespoke marketing button, no bespoke marketing card.

### 6.1 Radix Themes primitives, by site usage

| Primitive | Used for |
|---|---|
| `<Button>` | Every CTA. `size="3"` for primary hero, `size="2"` for secondary and in-card. Variants: `solid` (primary), `soft` (secondary on solid backgrounds), `outline` (tertiary). **Never gradient.** |
| `<Card>` | Three-pillar strip, feature card, pricing column, customer-quote card. `variant="surface"` is default; `variant="classic"` for the pricing-table "recommended" column. `size="3"` (32 px padding) for marketing density. |
| `<Badge>` | Trust strip ("Free tier"), changelog version pill, hero eyebrow when colored, "New" labels. Use `radius="full"` for hero-area badges, `radius="medium"` for in-list. |
| `<Heading>` | All H1/H2/H3 except the hero display (which uses raw `<h1>` with the marketing scale class — see §3). |
| `<Text>` | Every paragraph. `as="p"` for prose, `size="3"` for body L, `size="2"` for body M. |
| `<Code>` | Inline code in prose, snippet boxes on `/product/api`. |
| `<Kbd>` | "Press ⌘K" callouts on the docs/changelog. |
| `<Tabs>` | The product walkthrough section (Step 1 / 2 / 3). The pricing add-on group. |
| `<Callout>` | Inline notices on `/pricing` ("17 % off annual"), `/security` ("SOC 2 Type I in progress"), `/changelog` (deprecation warnings). |
| `<Avatar>` | Customer-quote attribution. Founder photos on `/company/about`. |
| `<Separator>` | Section dividers in legal pages, between sub-processor groups on `/security`. |
| `<Table>` | The pricing comparison table. Sub-processors list on `/security`. Changelog index. |
| `<ScrollArea>` | Inside long code blocks on `/product/api` to keep the page chrome stable. |
| `<Tooltip>` | The pricing table's small-print info icons. |

### 6.2 Marketing compositions — six recipes

Each composition is built **only** from the primitives above plus Tailwind layout utilities. No new components introduced just for marketing.

#### a) Hero (`<Hero />`)

Asymmetric 7/5 split, eyebrow + display + body L + dual `<Button>`, optional trust-strip footer. Radix primitives: `<Heading>`, `<Text>`, `<Button>` ×2, `<Badge>` for trust items.

```tsx
<Flex className="grid grid-cols-12 gap-6 items-center py-section-lg">
  <Box className="col-span-12 lg:col-span-7">
    <Text className="eyebrow" color="gray">PRODUCT</Text>
    <h1 className="hero-display mt-3">…</h1>
    <Text size="4" color="gray" className="mt-5 max-w-[32em]">…</Text>
    <Flex gap="3" mt="6">
      <Button size="3">Try free <ArrowRight /></Button>
      <Button size="3" variant="soft" color="gray">Read the docs</Button>
    </Flex>
  </Box>
  <Box className="col-span-12 lg:col-span-5">
    <SchemaTaxonomiesApiSvg />
  </Box>
</Flex>
```

#### b) Three-pillar strip (`<PillarStrip />`)

Three equal `<Card>`s in a `grid-cols-3` (collapses to `grid-cols-1` at mobile). Each card: Lucide icon in a violet pill, `<Heading size="5">`, `<Text size="3">`. No CTA inside the cards — they are read together, not clicked individually.

```tsx
<Box className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {pillars.map(p => (
    <Card variant="surface" size="3" key={p.title}>
      <Flex direction="column" gap="3">
        <Box className="h-10 w-10 rounded-[var(--radius-3)] flex items-center justify-center"
             style={{background: 'var(--accent-3)', color: 'var(--accent-11)'}}>
          <p.Icon size={20} strokeWidth={1.5} />
        </Box>
        <Heading size="5">{p.title}</Heading>
        <Text size="3" color="gray">{p.body}</Text>
      </Flex>
    </Card>
  ))}
</Box>
```

#### c) Feature card (`<FeatureCard />`)

Used on `/product/*` pages. Wider than the pillar card; supports an inline screenshot or code block underneath the prose. Same `<Card variant="surface" size="3">` shell, `<Heading size="6">` headline, optional `<Code>` block child.

#### d) Pricing column (`<PricingColumn />`)

Four columns side-by-side at desktop, accordion-stacked at mobile. The "recommended" column uses `<Card variant="classic">` (Radix's filled variant) plus a violet badge above the title. Tabular numerals on the price. Feature rows use `<Flex gap="2">` with a `<Check>` icon (Lucide stroke 1.5, `--green-11`).

#### e) Customer-quote card (`<QuoteCard />`)

Reuses the SignIn marketing-panel testimonial shape: `<Card variant="surface">`, blockquote with `<Text size="5">` (the pull-quote scale), `<Avatar>` + name + role row at the bottom. **On the home page**, this card sits on a violet gradient section (`--marketing-gradient-hero`); the card itself uses `rgba(255,255,255,0.06)` background with `backdrop-filter: blur(8px)` and a 1 px white-alpha border — exactly the recipe from `SignIn.tsx`. **On `/customers`**, the same card sits on a gray-1 page; the card uses default `<Card variant="surface">` styling, no glassmorphism.

#### f) Code-block-with-copy (`<CodeBlock />`)

`<Card>` shell with a header row (filename + language badge + "Copy" `<IconButton variant="ghost">`) and a `<ScrollArea>` body containing a `<pre><code>`. Uses `var(--code-font-family)` and Radix's `--gray-2` background in light mode, `--gray-3` in dark. Syntax highlighting via Shiki at build time — no client-side highlighter.

---

## 7. Iconography and illustration

### 7.1 Icons — Lucide, stroke 1.5

Same set the app uses. Sizes: 16 (in dense rows), 20 (default in marketing copy), 24 (empty states, large feature-card icons). Stroke width never deviates from 1.5. No filled variants.

```tsx
import { ArrowRight, Check, GitCommit, Network } from 'lucide-react';
<ArrowRight size={20} strokeWidth={1.5} />
```

The icon for each persona / value pillar is fixed — see the home-page content in WEBSITE_SPEC.md §4.1. Don't swap them per page.

### 7.2 Illustration — controlled set, no commission

We do **not** commission a custom illustration set at launch. Phase-0 budget doesn't justify it, and a half-cooked illustration system is worse than none. Instead the website ships:

1. **The Schema → Taxonomies → API SVG** — hand-built once, lives in `public/illustrations/schema-taxonomies-api.svg`. Editable by hand if the metaphor changes.
2. **The geometric shape primitives** — circles, rounded squares, dashed lines, dotted grids — reused as section accents. These are inline `<svg>` snippets, not external assets.
3. **Lucide icons** as the "illustrative" element inside feature cards (icon-in-pill pattern from §6.1.b).

If a section feels visually empty, the answer is more whitespace plus a small product screenshot, not a stock illustration.

### 7.3 Illustration palette

Every illustration uses three colors and three only:

- Violet wash: `var(--violet-3)` (fill), `var(--violet-9)` (stroke / accent).
- Slate: `var(--gray-11)` (text inside SVG), `var(--gray-a4)` (hairline strokes).
- One semantic accent per illustration, picked deliberately: green for success-flavoured (versioning), amber for caution-flavoured (validation), sky for info-flavoured (API).

No illustration uses two semantic accents at once. If a diagram seems to need both green and ruby, redraw it.

### 7.4 Forbidden

- Photoreal renders, 3D blobs, Memphis-style shapes.
- Stock illustration libraries (Storyset, undraw, etc.).
- Hand-drawn / sketchy aesthetics — clashes with the rest of the system.
- Animated GIFs. If it moves, it's an SVG or Lottie with `prefers-reduced-motion` gating.

---

## 8. Motion

### 8.1 Inherit the in-app keyframes

The mockup ships three keyframes in `mockup/src/index.css` — `slideIn`, `fadeIn`, `popIn` — used by toasts, popovers, and the command palette. **Copy these verbatim into `website/src/styles/global.css`** so the website and the app speak the same motion language. Same names, same durations, same easings.

### 8.2 Marketing-only motion

Three additions, gated by `prefers-reduced-motion`:

| Motion | Trigger | Duration | Easing |
|---|---|---|---|
| `fadeUp` on section entry | IntersectionObserver `threshold: 0.15` | 320 ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Hero schematic loop | Always running on `/` only | 6 s loop | linear (loop), ease-in-out (per pulse) |
| Sticky-nav appear | Scroll past 80 px | 220 ms | ease-out |

Codified durations:

```css
--motion-micro: 120ms;     /* hovers, button states */
--motion-section: 220ms;   /* nav appear, dropdown */
--motion-entry: 320ms;     /* fadeUp on section enter */
--motion-hero: 400ms;      /* hero element entry on initial paint */
```

Hero schematic loop is the only continuous motion on the page. Everything else is enter-once.

### 8.3 Reduced motion — exact fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

This is the standard kill-switch. Combined with the per-component `@media (prefers-reduced-motion: no-preference)` guards in §5.4, the page is fully usable with zero motion.

### 8.4 Sticky nav behaviour

The top nav is `position: sticky; top: 0` from the start. On scroll past 80 px, it gains `var(--color-panel-translucent)` with `backdrop-filter: blur(8px)` and a hairline `var(--gray-a4)` bottom border — exactly the in-app topbar treatment from `Shell.tsx`. The transition is on `background-color` and `box-shadow`, 220 ms ease-out.

---

## 9. Imagery — product screenshots

### 9.1 Capture rules

- **Real Cars-ontology data only.** No lorem ipsum, no demo concepts named "Foo / Bar". The Cars seed in `mockup/src/data/mock.ts` is the canonical content.
- **Light mode at launch.** Dark variants captured for V1 (post-GA), stored alongside the light versions with a `-dark` suffix.
- **2× retina capture.** Viewport at 1440 × 900 logical (2880 × 1800 actual). Saved as WebP with PNG fallback for OG cards.
- **Cropped to feature.** Don't ship a full app chrome screenshot when only the canvas matters. Crop to the rectangle that proves the point, leaving 16 px of breathing room on each side.
- **Rounded corners**: `var(--radius-5)` (12 px) on the screenshot itself, applied via CSS `overflow: hidden; border-radius: var(--radius-5);` on the wrapping `<Box>`.

### 9.2 Annotation style

When a screenshot needs callouts (e.g. "1. Add a class. 2. Wire a relation. 3. Tag a snapshot"):

- Numbered violet circles, 28 px diameter, `--accent-9` background, `--accent-contrast` text, Inter 600.
- Positioned absolute over the screenshot, aligned to the relevant UI element.
- A 1 px `--accent-9` line connects the number to a labelled callout block sitting in the page margin (not over the screenshot).
- At mobile, callouts collapse into a numbered list below the screenshot — never overlay the screenshot at narrow widths.

### 9.3 Drop-shadow recipe

Subtle, never glowy:

```css
.product-screenshot {
  border-radius: var(--radius-5);
  border: 1px solid var(--gray-a4);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.08);
}
```

In dark mode the shadow drops to `rgba(0, 0, 0, 0.5)` with a 1 px `var(--gray-a3)` outer border instead — shadows lose contrast on dark surfaces, so we add a hairline.

### 9.4 File naming

```
public/screenshots/
  schema-canvas--cars.webp
  schema-canvas--cars@2x.png
  schema-canvas--cars-dark.webp
  taxonomies-tree--cars.webp
  api-playground--cars.webp
```

One screenshot per feature, one variant per mode. Don't proliferate.

---

## 10. Dark mode

### 10.1 The decision

The mockup is light-mode-only (`appearance="light"` in main.tsx). The website **supports both** modes:

- `<Theme appearance="inherit">` at the root, which respects the OS `prefers-color-scheme`.
- A manual toggle in the footer (sun/moon `<IconButton variant="ghost">`) that flips the `data-theme` attribute on `<html>` and persists in `localStorage`.

We don't put the toggle in the top nav at launch — it's a refinement, not a primary action. The OS setting is honoured by default; visitors who want to override do so once.

### 10.2 Hero gradient in dark mode

The light-mode hero gradient — `linear-gradient(135deg, var(--violet-10), var(--violet-12) 70%)` — does **not** simply invert in dark mode. Two transforms apply:

- **Violet becomes richer.** In dark mode, `--violet-10` and `--violet-12` resolve to deeper-saturation values automatically (Radix handles this). The gradient stays violet but reads as a deeper midnight rather than a pastel.
- **Slate drops to near-black.** The page background (`--gray-1`) goes from `#FCFCFD` to roughly `#111113`. The contrast between the hero panel and the page increases — the gradient panel feels lifted, not flush.

Two extra adjustments:

```css
[data-theme='dark'] .hero-gradient-panel {
  /* Add a 1px inner highlight so the gradient doesn't bleed into the page */
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 64px rgba(0, 0, 0, 0.4);
}
```

### 10.3 Glassmorphism testimonial card in dark mode

The customer-quote card on the home page uses `rgba(255,255,255,0.06)` over the violet gradient in light mode. In dark mode, the base is already deeper; the same recipe still works because the alpha-white sits over an even darker surface. **Do not invert to `rgba(0,0,0,0.06)`** — that drops the card into the gradient instead of lifting it. The glassmorphism rule: alpha-white over gradient, in either mode.

### 10.4 Screenshots in dark mode

When the page is in dark mode, swap to the `-dark` screenshot variant. The Astro pattern:

```astro
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/screenshots/schema-canvas--cars-dark.webp">
  <img src="/screenshots/schema-canvas--cars.webp" alt="Schema canvas, Cars ontology">
</picture>
```

Manual toggle overrides the media query via a runtime swap on the `<source>` `media` attribute — handled inside the dark-mode toggle React island.

---

## 11. Accessibility floor

### 11.1 WCAG 2.2 AA, no excuses

Every page meets WCAG 2.2 AA. No "we'll fix it post-launch" exemptions.

### 11.2 Contrast ratios

Radix Themes scales are calibrated such that:

- `--gray-12` text on `--gray-1` background → > 14:1 (AAA).
- `--gray-11` text on `--gray-1` background → > 7:1 (AAA).
- `--accent-11` text on `--gray-1` background → > 4.5:1 (AA).
- `--accent-contrast` text on `--accent-9` background → > 4.5:1 (AA, both modes).

Use the variables as documented; don't compose new pairings (e.g. `--gray-9` text on `--gray-3` background — that's well below AA). When in doubt, test with axe-core, which is wired into the Storybook setup the mockup already uses.

### 11.3 Focus rings

Every interactive element gets the Radix focus ring out of the box:

```css
:focus-visible {
  outline: 2px solid var(--accent-a8);
  outline-offset: 2px;
}
```

Already applied globally in `mockup/src/index.css` `.btn` block — copy the same `:focus-visible` rule into the website's `global.css` and apply it to every actionable element (anchors included). **Never** suppress the focus ring with `outline: none` without a `:focus-visible` replacement.

### 11.4 Tab order on the home page

Specified explicitly so it doesn't drift:

1. Skip link ("Skip to main content").
2. Logo (links to `/`).
3. Nav items (Product → Use cases → Pricing → Customers → Docs).
4. "Sign in" link.
5. "Try free" primary CTA in nav.
6. Hero "Try free" CTA.
7. Hero "Read the docs" CTA.
8. Pillar cards in reading order.
9. Walkthrough tabs.
10. Quote (no interactive elements unless the customer's name links out).
11. Closing CTA buttons.
12. Footer links (left to right, top to bottom).

The dark-mode toggle in the footer is reachable via tab. The hero animation has no tabbable elements.

### 11.5 Skip-link

```html
<a href="#main" class="sr-only focus:not-sr-only ...">Skip to main content</a>
<main id="main" tabindex="-1">…</main>
```

Standard pattern — invisible until focused, then renders as a fixed-position pill in the top-left.

### 11.6 prefers-reduced-motion + prefers-color-scheme

Both honoured by default (§8.3, §10.1). The dark-mode toggle and any motion preference inside the site never override OS-level user preferences — they extend them.

### 11.7 Captions and transcripts

If a `/product/*` page ever embeds a video walkthrough (post-Phase 0), it ships with WebVTT captions and a text transcript on the same page. No video is shipped without both.

---

## 12. OG / social card recipe

### 12.1 Spec

- **Dimensions**: 1200 × 630 px, exported as PNG (some platforms still don't render WebP OG).
- **Background**: full-bleed `--marketing-gradient-brand` at 135°. Hex anchors: `#6E56CF` (top-left) → `#5746AF` (bottom-right).
- **Logomark**: top-left, 56 × 56 px, white-on-violet (the in-app sidebar logomark recipe).
- **Wordmark**: immediately right of the logomark, Inter 700, 28 px, white.
- **Headline**: page-specific, Inter 600, 64 px, max two lines, white. Left-aligned, vertically centered (top-aligned to a 48 px baseline grid from the logo lockup).
- **Sub-headline**: optional. Inter 400, 24 px, `--violet-3` (light pastel violet, ≈ `#E5DEFC`), one line.
- **Footer corner mark**: bottom-right, "semlify.com", Inter 500, 18 px, `--violet-3`.
- **No stock photography. No product screenshot cropped in. No emoji.**

### 12.2 Per-page variants

| Page | Headline | Sub |
|---|---|---|
| `/` | "The source of truth for your concepts." | "Design, version, ship the ontology your AI depends on." |
| `/pricing` | "Honest pricing for serious ontologies." | "Free for makers. Linear with usage. No surprises." |
| `/product` | "One graph. Schema. Taxonomies. API." | "Built on Neo4j. Versioned by design." |
| `/customers` | "Teams shipping ontology-grounded AI." | "Three case studies, more on the way." |
| `/security` | "Built for procurement, designed for engineers." | "Encryption, regional residency, SOC 2 in motion." |
| `/changelog` | "What we shipped." | "Reverse-chronological. Linkable. Honest." |
| `/use-cases/rag` | "Ground your RAG in a versioned ontology." | "Pin to a tag. Diff revisions. Deploy with confidence." |

The headline lives in the page front-matter (`og.headline`), the gradient and lockup are baked into the OG renderer (Astro endpoint that returns a PNG via Satori or @vercel/og).

### 12.3 Generation pipeline

OG cards are **generated at build time**, not authored manually in Figma. `astro.config.mjs` exposes an endpoint `/og/[slug].png` that reads the page front-matter, composes the layout, and returns a PNG. This keeps every page's OG card consistent and updatable in code.

---

## 13. Implementation notes

### 13.1 Astro layout — the root wrapper

Single `Layout.astro` wraps every page. It owns:

- The `<html lang="en" data-theme="…">` element.
- The `<Theme>` provider with the exact prop set from §2.2.
- The Inter + JetBrains Mono `<link rel="preconnect">` + `<link rel="stylesheet">` to Google Fonts (or `@fontsource` packages, equivalent — pick one).
- The skip link, the sticky nav, the footer, the Astro `<slot>` for page content.

```astro
---
// src/components/Layout.astro
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '../styles/global.css';
import '../styles/tokens.css';
import Nav from './Nav.astro';
import Footer from './Footer.astro';

const { title, description, ogHeadline, ogSub } = Astro.props;
---
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:image" content={`/og/${Astro.url.pathname}.png`} />
    <!-- … -->
  </head>
  <body class="radix-themes">
    <a href="#main" class="skip-link">Skip to main content</a>
    <Theme accentColor="violet" grayColor="slate" radius="medium" scaling="100%"
           panelBackground="solid" appearance="inherit">
      <Nav />
      <main id="main" tabindex="-1"><slot /></main>
      <Footer />
    </Theme>
  </body>
</html>
```

### 13.2 Inter override on `.radix-themes`

Verbatim from `mockup/src/index.css`, copied into `website/src/styles/global.css`:

```css
:root,
.radix-themes {
  --default-font-family:
    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --heading-font-family: var(--default-font-family);
  --code-font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --strong-font-family: var(--default-font-family);
  --em-font-family: var(--default-font-family);
  --quote-font-family: var(--default-font-family);
}
```

This is non-negotiable — without it, Radix falls back to system UI, the website drifts from the app, and the type scale we specified in §3 doesn't render.

### 13.3 Marketing-only token additions

`src/styles/tokens.css` — short file, only what Radix doesn't ship:

```css
:root {
  /* Gradients (§2.4) */
  --marketing-gradient-brand:
    linear-gradient(135deg, var(--accent-9) 0%, var(--accent-11) 100%);
  --marketing-gradient-hero:
    linear-gradient(135deg, var(--violet-10) 0%, var(--violet-12) 70%, var(--violet-12) 100%);
  --marketing-gradient-section:
    linear-gradient(180deg, var(--violet-2) 0%, var(--gray-1) 100%);

  /* Marketing motion durations (§8.2) */
  --motion-micro: 120ms;
  --motion-section: 220ms;
  --motion-entry: 320ms;
  --motion-hero: 400ms;
}

[data-theme='dark'] {
  /* Dark-mode gradient — relies on Radix's auto-swap of --violet-10/12 */
  --marketing-gradient-section:
    linear-gradient(180deg, var(--violet-3) 0%, var(--gray-1) 100%);
}
```

That's the entire file. Resist the urge to add more.

### 13.4 Tailwind boundary — layout only

Tailwind handles **layout** (grid, flex, gap, padding, max-width, sticky, hidden-on-breakpoint). Radix component props handle **everything inside the layout cells** (variant, color, size, radius). The boundary:

| Concern | Tool |
|---|---|
| Page max-width, side gutters | Tailwind utility class on `<main>` |
| 12-column section grid | `grid grid-cols-12 gap-6` |
| Card-internal layout | `<Flex direction="column" gap="3">` (Radix prop) |
| Card surface, padding, radius | `<Card variant="surface" size="3">` (Radix prop) |
| Button color, variant, size | `<Button variant="solid" size="3">` (Radix prop) |
| Vertical rhythm between sections | Tailwind `py-section-md` utility |
| Color of inline text | `<Text color="gray">` (Radix prop) |

If you find yourself writing a Tailwind class for a Radix-prop concern (`text-[var(--accent-11)]` instead of `<Text color="violet">`), it's a smell — you're working around the system.

### 13.5 Build-time concerns

- **Font loading**: `font-display: swap`, preconnect to the font origin, inline a `<link rel="preload">` for Inter 400 and 600 (the two weights above the fold). JetBrains Mono is loaded async — code blocks below the fold can wait.
- **Critical CSS**: Astro inlines per-page critical CSS automatically. Verify `@radix-ui/themes/styles.css` is split — it's ~80 KB minified, not all needed on every page.
- **Image budgets**: Hero schematic SVG ≤ 12 KB. Each product screenshot ≤ 60 KB (WebP, AVIF as `<source>`). OG cards ≤ 80 KB.

---

## 14. What to avoid

Six concrete don'ts. Every one of these has been seen in the wild on otherwise good marketing sites; every one would visibly break coherence with the app.

1. **Hero stock photography.** No people-in-an-office, no abstract gradient blobs from undraw, no Unsplash. The hero is type + product schematic, full stop.
2. **Gradient buttons.** Buttons are flat `<Button variant="solid">` with `--accent-9` background. The gradient is a *surface* treatment (hero panels, OG cards, closing CTA backgrounds), never an interactive element. A gradient button signals "I'm a marketing site that doesn't ship a product," which is the opposite of our message.
3. **Glow shadows.** No `box-shadow: 0 0 40px var(--accent-9)`, no neon-on-dark. Shadows are subtle and grounded (§9.3). The brand is calm, not gamer-aesthetic.
4. **All-caps body copy.** Eyebrows are uppercase at 12 px with +0.08em tracking (one rule, applied everywhere). Body copy is sentence case. Headline is sentence case. We don't yell.
5. **Custom font files.** Inter and JetBrains Mono only. No Display Display Sans, no Söhne lookalike, no Cabinet Grotesk for "personality". The product uses Inter; the website uses Inter; same file, same weight, same fallback stack.
6. **Color values not in the Radix scales.** Every color is a `var(--…)`. No hand-picked hex outside the OG/email anchors in §2.5. If a designer brings a Figma file with `#7C3AED` on a card, the answer is "that's `var(--violet-9)`, please re-spec."

Bonus seventh: **don't rebuild Radix Themes primitives in the marketing codebase.** If `<Tabs>` doesn't do what the product walkthrough needs, file a Radix issue or compose around it — don't fork the API. Forks here drift, and drift breaks the consistency that this whole guide is designed to enforce.

---

## 15. Open questions

Decisions explicitly deferred. Each has a recommendation but lives outside Phase 0.

- **Custom illustration system (V1+).** §7.2 punts on a commissioned set. By GA + 6 months, if `/use-cases/*` and `/customers` proliferate, we may want a small illustration vocabulary (5–8 hero illustrations on a violet wash, isometric or flat-geometric). Owner: design lead. Trigger: when a third use-case page is queued.
- **Animated hero asset format.** §5.2 commits to "animated SVG schematic." If after the first three months of analytics the hero conversion is flat, we should A/B against a Lottie loop of the actual canvas. Trigger: 12 weeks of `/` analytics post-launch.
- **Localised typography.** §3 assumes English-only. When French is added (post-GA), we revisit measure (French averages ~15 % longer than English) and may shorten the hero display by one step on `:lang(fr)`. Owner: design lead.
- **Pricing OG card variants per currency.** §12.2 specs USD-only. If we add EUR, we need a `/og/pricing-eur.png` variant. Trivial to add at build time, just not until the first French customer asks.
- **Status-page styling.** `status.semlify.com` is a third-party page (Statuspage / Better Stack — TBD). When we pick the vendor, we apply our brand violet + Inter; until then, the link in the footer drops the visitor onto the vendor's default chrome, which is acceptable but inconsistent.

Everything else in this document is decided. A front-end engineer can scaffold the home page, hero, and three-pillar strip from §3, §4, §5, §6, and §13 alone — without coming back.

---

Related: [WEBSITE_SPEC.md](WEBSITE_SPEC.md) · [BRAND_GUIDELINES.md](../docs/04_design/BRAND_GUIDELINES.md) · [DESIGN_SYSTEM.md](../docs/04_design/DESIGN_SYSTEM.md) · [VISION.md](VISION%20(imported%20to%20notion).md)
