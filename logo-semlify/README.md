# Semlify — Logo Assets

Brand color: `brand.500` `#6366F1` · Wordmark: Inter 600, tracking −0.05em.

## Folder structure

```
exports/
├── svg/
│   ├── marks/        6 marks × 3 colors (brand / black / white) = 18 files
│   ├── lockups/      Horizontal & stacked lockups × 3 colors
│   └── wordmark/     Wordmark only × 3 colors
└── png/
    ├── marks/        Each mark in 64 / 128 / 256 / 512 / 1024 px
    ├── lockups/      Horizontal & stacked at 1× / 2× / 4×
    └── wordmark/     Wordmark only at 1× / 2× / 4×
```

## Recommended primary

`mark-a` — branch-node glyph (commits + branches metaphor). All lockups and PNG
lockups use this mark.

## Color tokens

| Token       | Hex       | Usage                              |
|-------------|-----------|------------------------------------|
| brand.500   | `#6366F1` | Primary mark + CTAs                |
| brand.700   | `#4338CA` | Hover / emphasis on light          |
| brand.900   | `#1E1B4B` | Deep accents in dark UI            |
| ink         | `#0B0B14` | Mono on light                      |
| white       | `#FAFAFB` | Mono on dark                       |

## Notes

- **SVGs are the source of truth.** They embed an `@import` for Inter; in design
  tools (Figma / Illustrator) make sure Inter is installed for the wordmark to
  render with the intended metrics.
- **PNG lockups** were rasterized via canvas. If Inter isn't installed on the
  rasterizer, the wordmark falls back through `system-ui → Helvetica → Arial`.
  For production marketing collateral, use the SVGs.
- Clear space: 0.5× mark height on all sides. Minimum size: 24 px.
- Don't recolor outside brand. Don't add shadows, rotate, distort, or
  co-brand inside the lockup.
