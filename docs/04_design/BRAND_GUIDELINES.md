# Brand Guidelines

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


Rules for presenting Semlify in public. Covers logo, palette usage in marketing, typography, voice, photography, motion and partner co-branding.

---

## 1. Brand positioning

> **Semlify — Version-controlled knowledge graphs for modern data teams.**

Elevator pitch:
"Semlify is the GitHub + Notion of enterprise ontologies. Teams design, govern and ship their domain models with commits, branches, reviews and a native graph — so AI and data pipelines downstream can trust what they see."

Pillars:
- **Graph-native.** Powered by Neo4j, built for graphs from the inside.
- **Governed.** Every change is reviewed, attributed and reversible.
- **Collaborative.** Architects, experts and engineers work on the same artefact.
- **Open & integrated.** API, webhooks, SDKs, connectors on day one.

## 2. Logo

### Logomark
- A single stylised node-and-edge glyph (to be finalised by design).
- Minimum size: 24 px.
- Clear space: 0.5× the height of the mark on all sides.

### Logotype
- Inter 600, letter spacing −0.5, slight ligature between "o" and "n".

### Lockups
- Horizontal: logomark + wordmark side by side.
- Stacked: logomark centered above the wordmark.
- Monochrome: black, white, brand.500.

### Don'ts
- Don't re-color the logomark in non-brand colors.
- Don't outline, add drop shadows, rotate, or distort.
- Don't combine with another logo inside a single lockup (always use co-branding patterns).

## 3. Primary palette (brand)

| Token | Hex | Usage |
|---|---|---|
| `brand.500` | `#6366F1` | primary — CTAs, logotype accents |
| `brand.700` | `#4338CA` | hover, emphasis on light |
| `brand.900` | `#1E1B4B` | deep accents in dark UI |

Secondary & accent usage in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). For marketing, 60% neutrals / 30% brand / 10% accent is a reasonable ratio.

## 4. Typography (marketing)

- **Headlines:** Inter 600, tight tracking, sentence case.
- **Body:** Inter 400, 16–18 px.
- **Code / product voice:** JetBrains Mono.
- Avoid all-caps except for tiny labels.

## 5. Voice & tone

### Product voice
Clear, direct, factual. Helps users accomplish tasks without fanfare.

### Marketing voice
- **Confident and specific.** We say what we do, not what we aspire to be.
- **Technical, not impenetrable.** Respect the reader's intelligence; define terms on first use.
- **Zero hype adjectives.** No "revolutionary", "world-class", "unprecedented".
- **Comfort with rigor.** Show a diff. Show a graph. Show code.

Examples:

- "Review the diff before it lands on main." ✅
- "Unleash the power of your ontologies." ❌

## 6. Photography & illustration

- Illustrations are flat, geometric, and use the brand accents sparingly.
- Photography used only for team / customer stories; natural, daylit, no stock.
- Diagrams are first-class marketing assets — we're a data product. Use our own canvas screenshots wherever possible.

## 7. Iconography (marketing)

Matches the product: Lucide stroke icons, stroke 1.5. Avoid mixing styles.

## 8. Social cards & favicons

- OG cards 1200×630, brand gradient, logomark top-left, short tagline.
- Favicon: monochrome logomark on transparent; 32, 16, SVG.
- Apple touch icon: 180×180, brand background.

## 9. Motion

- Subtle. No bouncing letters.
- Page hero: gentle parallax on the graph, disabled for `prefers-reduced-motion`.
- Loading animations: continuous, not punchy.

## 10. Naming conventions

- Product: **Semlify** (always capitalised; never "Semlify").
- Noun forms: an *ontology*, a *workspace*, a *commit*, a *review request*.
- Avoid "schema" outside engineering contexts — it connotes rigidity to buyers.

## 11. Partner & ecosystem co-branding

- Partner logos rendered monochrome where possible; maintain clear space equal to the partner logo height.
- Sentence structure: "Semlify + Neo4j" (no slashes, no "&" in titles).
- Certified integration badges (L2 partners) are issued from the design system; do not modify.

## 12. Writing the Semlify name in prose

- First mention on a page: "Semlify — the version-controlled knowledge graph platform…"
- Subsequent: "Semlify".
- Never "Semlify.io" or "Semlify, Inc." in body copy (reserved for legal contexts).

## 13. Do / Don't summary

Do:
- Use official logo files and color tokens.
- Keep backgrounds calm; let the product and diagrams speak.
- Ship screenshots that show real data, not lorem ipsum.

Don't:
- Rewrite the logomark or tagline.
- Add gradients over logos.
- Use colors outside the approved palette.
- Use the name as a verb ("Semlify it!") — just don't.

Related: [Design System](DESIGN_SYSTEM.md) · [Marketing Strategy](../07_business/MARKETING_STRATEGY.md)
