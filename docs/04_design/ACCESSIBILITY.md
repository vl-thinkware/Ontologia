# Accessibility

We target **WCAG 2.2 AA** for the whole product. Accessibility is not a separate track — it is part of shipping.

---

## 1. Principles

- **Equivalent experience.** Keyboard users, screen reader users, users with low vision or motor impairments get the same capabilities.
- **Early, not retrofit.** A11y defects are found in design review, not after release.
- **Test like we mean it.** Automated tools catch only ~30% of issues; we do manual keyboard + screen reader passes.

## 2. Keyboard operability

- Everything that a mouse can do, a keyboard can do.
- Focus ring always visible; never `outline: none` without an explicit replacement.
- Tab order follows reading order.
- Skip-links at the top of each page: "Skip to main", "Skip to navigation".
- Esc closes overlays; `⌘/Ctrl K` opens command palette.
- Canvas:
  - `Tab` moves focus between nodes in visual order.
  - Selected node: arrow keys to navigate neighbours along relations.
  - `Enter` opens the inspector.
  - `Space` starts/stops a drag with arrow-keys (alternative to mouse drag).

## 3. Screen reader support

- Landmarks: `header`, `nav`, `main`, `aside`, `footer`.
- Page titles updated on route change; announced.
- ARIA live regions for async status (`polite` for confirmations, `assertive` for errors).
- Named buttons and links. No "Click here".
- Custom components use Radix primitives, which provide correct roles and keyboard behaviours.
- Canvas: nodes exposed as listitems with an aria-label of the name and type; relations described in the inspector's "Relations" list.

## 4. Color & contrast

- Text contrast ≥ 4.5:1 for Body, ≥ 3:1 for Large text (≥ 18pt / 14pt bold).
- UI components & graphical objects: ≥ 3:1 against adjacent colors.
- Semantic state never conveyed by color alone — pair with icon/text (added / removed / modified have glyphs as well as colors).
- Design tokens validated for contrast at token build time.

## 5. Motion

- Respect `prefers-reduced-motion`.
- No essential information in motion only.
- Parallax and auto-play forbidden.

## 6. Forms

- Every input has a `<label>` programmatically linked.
- Error messages associated via `aria-describedby`.
- Required fields explicit (both visually and via `aria-required`).
- Submit preserves user input on failure.
- Touch targets ≥ 24×24 px, 44×44 where feasible.

## 7. Images & icons

- Decorative images: `alt=""`.
- Functional icons: `aria-label` or visible text.
- SVGs: `role="img"` with `<title>` when informative.

## 8. Media

Not used in-product in v1. Marketing videos on the public site must have captions and transcripts.

## 9. Zoom & reflow

- Layouts reflow to 320 px width without loss.
- 200% zoom supported without horizontal scroll for non-canvas views.
- Canvas has its own zoom; 200% OS zoom must not break controls around it.

## 10. Cognitive load

- Predictable navigation.
- One primary action per view.
- Avoid time-outs without warning; sessions last 30 days and we warn before logout.

## 11. Internationalisation crossovers

- Language attribute on `<html>` matches the active locale.
- `dir="rtl"` support on roadmap post-GA.

## 12. Testing

- Automated: `@axe-core/playwright` on e2e; Storybook a11y addon on component stories.
- Manual: keyboard walkthrough of primary flows every release; VoiceOver (macOS) and NVDA (Windows) + Chrome/Firefox twice per quarter.
- Color contrast audit with Stark at design time.
- Annual third-party audit starting at GA + 6 months.

## 13. Known exceptions

- Canvas visualisations below a reasonable node count are graphical; for very large graphs, we provide:
  - Tree view (fully accessible) as an alternative.
  - List view of changes in diffs.
  - Keyboard navigation as described above.

## 14. Responsibility

- Design: annotates a11y intent in mocks (focus order, labels, keyboard affordances).
- Engineering: executes and tests.
- QA: includes a11y in release smoke.
- Product: treats a11y issues as functional bugs.

## 15. Filing a11y bugs

- Label: `a11y` + priority.
- Include: who's affected, how to reproduce, what was expected, environment (browser + AT).
- SLA: `a11y-sev1` same-day mitigation (e.g. unreachable navigation); `sev2` within a sprint.

## 16. References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components (Heydon Pickering)](https://inclusive-components.design/)

Related: [Design System](DESIGN_SYSTEM.md) · [UI/UX Guidelines](UI_UX_GUIDELINES.md)
