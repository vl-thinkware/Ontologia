# Design System

Design tokens, components and rules that keep Ontologia's UI consistent, accessible and fast to build for.

---

## 1. Principles

- **Clarity over decoration.** We are a tool; legibility wins.
- **Calm by default.** Dense information without visual noise.
- **Familiar surfaces.** We lean on the visual language of Linear, Figma and GitHub.
- **Accessible always.** WCAG 2.2 AA is a baseline, not an aspiration.
- **Dark-mode-native.** Designed in dark first; light mode is equally first-class.

## 2. Brand palette

From the v1 spec, with extended scales.

### Primary — Indigo (brand)
| Token | Hex | Use |
|---|---|---|
| `brand.50` | `#EEF0FF` | subtle backgrounds, hover surfaces (light) |
| `brand.100` | `#DDE1FF` | |
| `brand.300` | `#A2ABFF` | |
| `brand.500` | `#6366F1` | primary buttons, key accents |
| `brand.600` | `#4F46E5` | hover state |
| `brand.700` | `#4338CA` | active |
| `brand.900` | `#1E1B4B` | deep accents in dark UI |

### Success — Emerald
| Token | Hex |
|---|---|
| `success.500` | `#10B981` |
| `success.600` | `#059669` |
| `success.700` | `#047857` |

### Warning — Amber
| Token | Hex |
|---|---|
| `warning.400` | `#FBBF24` |
| `warning.500` | `#F59E0B` |
| `warning.600` | `#D97706` |

### Danger — Red
| Token | Hex |
|---|---|
| `danger.500` | `#EF4444` |
| `danger.600` | `#DC2626` |
| `danger.700` | `#B91C1C` |

### Neutrals
Light mode:
| Token | Hex |
|---|---|
| `bg.canvas` | `#F8F9FC` |
| `bg.surface` | `#FFFFFF` |
| `bg.subtle` | `#F1F3F8` |
| `text.primary` | `#1E293B` |
| `text.secondary` | `#475569` |
| `border.subtle` | `#E2E8F0` |
| `border.default` | `#CBD5E1` |

Dark mode:
| Token | Hex |
|---|---|
| `bg.canvas` | `#0F0F17` |
| `bg.surface` | `#1C1C2E` |
| `bg.subtle` | `#16161F` |
| `text.primary` | `#E2E8F0` |
| `text.secondary` | `#94A3B8` |
| `border.subtle` | `#23233A` |
| `border.default` | `#2E2E47` |

### Diff semantic colors
- Added: `success.500` backgrounds with 8% alpha for tiles; solid for borders.
- Removed: `danger.500` 8% alpha; strikethrough label in list view.
- Modified: `warning.500` 8% alpha.
- Unchanged: `text.secondary` at 60% opacity.

## 3. Typography

- **Sans.** Inter (system fallback stack `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`).
- **Mono.** JetBrains Mono, for IDs, Cypher, code.

Scale (Tailwind mapping):

| Role | Size | Line-height | Weight |
|---|---|---|---|
| Display / hero | 36px | 44px | 600 |
| H1 | 28px | 36px | 600 |
| H2 | 22px | 30px | 600 |
| H3 | 18px | 26px | 600 |
| Body L | 16px | 24px | 400 |
| Body M | 14px | 20px | 400 |
| Body S | 13px | 18px | 400 |
| Caption | 12px | 16px | 500 |
| Code | 13px | 20px | 500 (mono) |

- Numerics use `font-variant-numeric: tabular-nums` in data-heavy UI.

## 4. Spacing

4-pt scale. Use tokens:

```
space.1 = 4
space.2 = 8
space.3 = 12
space.4 = 16
space.5 = 20
space.6 = 24
space.8 = 32
space.10 = 40
space.12 = 48
```

- Card padding: `space.4` mobile, `space.6` desktop.
- Section spacing: `space.10` to `space.12`.

## 5. Radius

```
radius.sm = 4
radius.md = 6       (default buttons, inputs)
radius.lg = 10      (cards, modals)
radius.xl = 16      (feature surfaces)
radius.full = 9999
```

## 6. Elevation

We keep shadows subtle. Two layers.

```
shadow.sm  = 0 1px 2px rgba(15,23,42,.08)
shadow.md  = 0 4px 12px rgba(15,23,42,.10)
shadow.lg  = 0 12px 32px rgba(15,23,42,.14)
```

Dark mode: use equivalent rgba on a mostly-transparent border instead of heavy shadows.

## 7. Iconography

- `lucide-react` as the base icon set.
- 20×20 default; 16 on dense UI; 24 on empty states.
- Stroke 1.5 px; do not fill unless adding semantic emphasis.

## 8. Motion

- 120 ms for micro-interactions.
- 200 ms for panels / drawers.
- `ease-out` for entrances, `ease-in` for exits.
- Skipped when `prefers-reduced-motion: reduce`.

## 9. Core components (design system package `packages/ui`)

- `Button` (variants: primary, secondary, ghost, danger; sizes: sm, md, lg; icon-only).
- `IconButton`
- `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Radio`, `Switch`, `Slider`
- `Badge`, `Chip`, `Tag`
- `Tooltip` (Radix)
- `Popover`, `Menu`, `Dialog`, `Drawer`
- `Tabs`, `Accordion`
- `Toast` (via Radix Toast)
- `Table` (virtualised variant)
- `EmptyState`
- `Avatar`, `AvatarGroup`
- `Breadcrumb`
- `CommandPalette` (`cmdk` under the hood)
- `StatusPill` (`success | warning | danger | neutral | brand`)
- Canvas-specific:
  - `ConceptNode`
  - `RelationEdge`
  - `MiniMap`
  - `DiffNode` / `DiffEdge`
  - `Inspector`

Each component lives with Storybook stories and a11y checks.

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

Tokens are exported by `packages/ui/tokens` as both Tailwind theme config and a JSON file consumable by designers (Figma).

Figma Library mirrors the code tokens. When they disagree, code wins; designer files are updated from the JSON.

## 14. Contribution

- PRs touching `packages/ui` require a design review.
- New components must ship with: story, a11y test, variant matrix.
- No copy-pasting from elsewhere; every component exists because we needed it, not because it's fashionable.

Related: [UI/UX Guidelines](UI_UX_GUIDELINES.md) · [Accessibility](ACCESSIBILITY.md) · [Brand Guidelines](BRAND_GUIDELINES.md)
