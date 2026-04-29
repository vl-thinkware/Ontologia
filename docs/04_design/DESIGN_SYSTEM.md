# Design System

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v2 (bootstrap-aligned)


Design tokens, components and rules that keep Semlify's UI consistent, accessible and fast to build for.

---

## 1. Principles

- **Clarity over decoration.** We are a tool; legibility wins.
- **Calm by default.** Dense information without visual noise.
- **Familiar surfaces.** We lean on the visual language of Linear, Figma and GitHub.
- **Accessible always.** WCAG 2.2 AA is a baseline, not an aspiration.
- **Dark-mode-native.** Designed in dark first; light mode is equally first-class.

## 2. Color system — Radix Themes

The product runs on **Radix Themes** with `<Theme accentColor="violet" grayColor="slate" radius="medium" scaling="100%">`. We do not maintain bespoke hex tables — every color is one of Radix's twelve-step scales, addressed by CSS variable.

### Accent — `violet`
The brand. Use `var(--accent-*)` rather than `var(--violet-*)` directly so a future theme swap is one prop change.

| Variable | Use |
|---|---|
| `var(--accent-1)` … `--accent-2` | App backgrounds, subtle wash |
| `var(--accent-3)` … `--accent-5` | Hover surfaces, soft chips |
| `var(--accent-6)` … `--accent-8` | Borders, separators on accent surfaces |
| `var(--accent-9)` | **Primary** fill (Buttons, badges) |
| `var(--accent-10)` | Hover state for `--accent-9` |
| `var(--accent-11)` | Accent text (links, "violet" Text/Heading) |
| `var(--accent-12)` | High-emphasis accent text |
| `var(--accent-contrast)` | Text on `--accent-9` |
| `var(--accent-a*)` | Alpha variants of the same scale, for overlay use |

### Gray — `slate`
The neutral scale. `var(--gray-*)` mirrors the structure above. We use:

| Variable | Use |
|---|---|
| `var(--gray-1)` / `--gray-2` | Page background, subtle surfaces |
| `var(--color-panel-solid)` | Card / panel surface (alias) |
| `var(--gray-a3)` / `--gray-a4` | Hover states, soft borders |
| `var(--gray-a5)` / `--gray-a6` | Default borders, dividers |
| `var(--gray-9)` | Disabled / placeholder text |
| `var(--gray-11)` | Body text |
| `var(--gray-12)` | High-emphasis headings |

### Semantic colors (Radix scales)
We map each semantic role to a Radix scale and address it identically.

| Role | Radix scale | Used as |
|---|---|---|
| Success | `green` | "create" badges, success toasts, valid validation |
| Warning | `amber` | Deprecation, dirty state, validation warnings |
| Danger | `ruby` | Destructive actions, errors, "delete" badges |
| Info | `sky` | "update" badges, info toasts, neutral highlights |
| Tag | `violet` | "tag" badges, AI-suggestion accents |

A `Badge color="green" variant="soft"` resolves to `--green-3` background + `--green-11` text — the contrast pair is Radix's responsibility, not ours.

### Diff semantic colors
- Added: `var(--green-3)` background, `var(--green-9)` left border.
- Removed: `var(--ruby-3)` background, `var(--ruby-9)` left border, strikethrough in list view.
- Modified: `var(--sky-3)` background, `var(--sky-9)` left border.
- Unchanged: `var(--gray-11)` at 60% opacity.

## 3. Typography

- **Sans.** Inter — wired in by overriding Radix's `--default-font-family` on `.radix-themes` so every Radix component picks it up automatically. System fallback stack: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`.
- **Mono.** JetBrains Mono via `--code-font-family`; used by `<Code>`, `<Kbd>`, IDs, Cypher snippets.

Scale — we use Radix Themes' typographic primitives (`<Heading>`, `<Text>`, `<Code>`) instead of raw Tailwind classes. Sizes map as follows:

| Role | Radix component | Size prop | Resolved px / line-height |
|---|---|---|---|
| Display / hero | `<Heading size="8">` | — | 36 / 44 |
| H1 | `<Heading size="7">` | — | 28 / 36 |
| H2 | `<Heading size="6">` | — | 22 / 30 |
| H3 | `<Heading size="3">` weight="bold" | — | 18 / 26 |
| Body L | `<Text size="3">` | — | 16 / 24 |
| Body M | `<Text size="2">` | — | 14 / 20 |
| Body S | `<Text size="1">` | — | 13 / 18 |
| Code | `<Code>` | — | 13 / 20, mono |

- Numerics use `font-variant-numeric: tabular-nums` in data-heavy UI (apply via inline style or a utility class).

## 4. Spacing

We use Radix Themes' 9-step spacing scale via CSS variables; same 4-pt grid as before but addressed by token.

| Variable | px | Common use |
|---|---|---|
| `var(--space-1)` | 4 | Tight inline gaps |
| `var(--space-2)` | 8 | Icon + label gap, list-row gap |
| `var(--space-3)` | 12 | Compact card padding |
| `var(--space-4)` | 16 | Default card padding |
| `var(--space-5)` | 24 | Section padding |
| `var(--space-6)` | 32 | Large card padding (`Card size="3"`) |
| `var(--space-7)` | 40 | Section spacing |
| `var(--space-8)` | 48 | Hero spacing |
| `var(--space-9)` | 64 | Marketing spacing |

Most components take a numeric prop (`p="4"`, `gap="2"`, `mt="3"`) that maps directly to this scale — prefer that over raw CSS.

## 5. Radius

The Theme is configured with `radius="medium"`, which resolves the scale to:

```
var(--radius-1)  = 3px        small chips, inline pills
var(--radius-2)  = 4px        Badge default
var(--radius-3)  = 6px        Buttons, TextField, Select
var(--radius-4)  = 8px        Cards, panels
var(--radius-5)  = 12px       Modals, large surfaces
var(--radius-6)  = 16px       Feature surfaces
var(--radius-full) = 9999px   Avatars, pill buttons
```

Increasing `radius="full"` on the Theme bumps the whole product to a softer look without code changes.

## 6. Elevation

Six-step shadow scale from Radix; we lean on the lower end.

```
var(--shadow-1)  Hairline borders / soft depth
var(--shadow-2)  Cards, surfaces (default)
var(--shadow-3)  Hover lift, dropdown surfaces
var(--shadow-4)  Popovers, dialogs (raised)
var(--shadow-5)  Modal content
var(--shadow-6)  Top-of-stack overlays
```

Dark mode uses the same scale; Radix already swaps the alpha values internally.

## 7. Iconography

- `lucide-react` as the base icon set.
- 20×20 default; 16 on dense UI; 24 on empty states.
- Stroke 1.5 px; do not fill unless adding semantic emphasis.

## 8. Motion

- 120 ms for micro-interactions.
- 200 ms for panels / drawers.
- `ease-out` for entrances, `ease-in` for exits.
- Skipped when `prefers-reduced-motion: reduce`.

## 9. Core components

The component library is **Radix Themes**, imported directly from `@radix-ui/themes`. We do not maintain a fork in `packages/ui`; that package is reserved for Semlify-specific compositions on top of Radix.

### From Radix Themes (no wrapping)
- `Button` (variants: `solid`, `soft`, `surface`, `outline`, `ghost`, `classic`; sizes 1–4; with `color` prop for semantic tints)
- `IconButton`
- `TextField.Root` (+ `TextField.Slot`), `TextArea`, `Select` (`Root` / `Trigger` / `Content` / `Item`)
- `Checkbox`, `RadioGroup`, `Switch`, `Slider`
- `Badge` (replaces our old `Chip` / `Tag` concepts), `Code`, `Kbd`
- `Tooltip`
- `Popover`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Dialog`, `AlertDialog`
- `Tabs`, `SegmentedControl`
- `Callout` (replaces our `EmptyState` for inline notices)
- `Table` (`Root` / `Header` / `Row` / `Cell`)
- `Avatar` (use `<Flex className="-space-x-2">` for AvatarGroup behavior)
- `ScrollArea`, `Separator`, `Spinner`, `Progress`, `Skeleton`
- `Heading`, `Text`, `Link`, `Em`, `Strong`, `Quote`, `Blockquote`, `Reset`

### Semlify compositions (in `apps/web/src/components` for the mockup, `packages/ui` once we have a real app)
- `Modal` — thin wrapper around Radix `<Dialog>` that keeps the legacy `{open, onClose, title, subtitle, footer, width}` API for in-app forms.
- `Toaster` — bottom-right toast queue using `Card` + `IconButton`.
- `CommandPalette` — `⌘K` overlay using Radix `TextField` + custom list (Radix doesn't ship a command-palette primitive).
- `NotificationsBell` — Radix `Popover` with the unread-feed list.
- `ValidationPanel`, `AiSuggestionsPanel`, `ClassInspector`, `ClassAttributesEditor` — domain-specific right-rail panels using Radix primitives.
- Canvas-specific (still hand-rolled, will live in `packages/ui` later):
  - `ConceptNode`
  - `ClassNode`
  - `RelationEdge` (planned)
  - `DiffNode` / `DiffEdge` (planned)

Each Semlify composition ships with Storybook stories and an axe check.

## 10. Canvas specifics

### Concept node
- Width: 240 px default, auto on long labels up to 320 px.
- Background: `bg.surface`.
- Top-left chip: type color (8% tint).
- Name: Body L, weight 600.
- Description: Body S, 2 lines clamp.
- Badges: status pill + relation count.

### Relation edge
- Color: `text.secondary` by default; relation type accent on hover.
- Label pill floating mid-edge, clamp 28 chars.

### Diff overlays
- Pill on the node header shows change type.
- Border: 2 px in the change color.
- Tooltip: what changed.

## 11. Forms

- Labels always visible; placeholders are hints, not labels.
- Errors inline, red with icon.
- Auto-save where possible; show "saved" affordance.

## 12. Data density modes

Three density levels:

- **Cozy.** Defaults.
- **Compact.** Reduces vertical padding by 25%. Toggle in settings.
- **Comfortable.** Slightly larger, for onboarding and accessibility.

Canvas has its own density via zoom.

## 13. Naming & tokens on the wire

Tokens come from **Radix Themes** at runtime via CSS custom properties (`--accent-9`, `--gray-a4`, `--radius-3`, `--space-4`, `--shadow-2`, …). We don't maintain a parallel JSON token file — Radix ships its scales as a stylesheet and that's the source of truth.

The Figma library mirrors the **Radix Themes Figma kit** (Radix publishes one), with our accent + gray choices applied. When code and design disagree, code wins; the Figma file is updated from a fresh export of the Radix stylesheet.

For the few values not covered by Radix (presence avatar colors, mode pills for Glossary / Taxonomy / Ontology), tokens live in `apps/web/src/styles/local-tokens.css` and are documented in this file's §2.

## 14. Contribution

- PRs touching `packages/ui` require a design review.
- New components must ship with: story, a11y test, variant matrix.
- No copy-pasting from elsewhere; every component exists because we needed it, not because it's fashionable.

Related: [UI/UX Guidelines](UI_UX_GUIDELINES.md) · [Accessibility](ACCESSIBILITY.md) · [Brand Guidelines](BRAND_GUIDELINES.md)
