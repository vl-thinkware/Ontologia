# Frontend Guide

**Primary owner**: Alexandre · **Contributor**: Valentin · **Status**: Draft v2 (bootstrap-aligned)


Principles, patterns and recipes for the Ontologia web app.

---

## 1. Goals

- **Fast to load.** Interactive in ≤ 2 s on a 4G connection.
- **Fast to use.** No input latency on the canvas. 60 fps on 5k-node graphs.
- **Clear & calm.** Dense information, low visual noise. See [DESIGN_SYSTEM.md](../04_design/DESIGN_SYSTEM.md).
- **Accessible.** WCAG 2.2 AA.

## 2. Project layout (`apps/web`)

```
apps/web/src/
├── app/                # routes, layout shells
│   ├── (auth)/
│   ├── (app)/
│   │   ├── workspaces/$wid/
│   │   ├── ontologies/$oid/
│   │   │   ├── canvas/
│   │   │   ├── tree/
│   │   │   ├── history/
│   │   │   ├── diff/
│   │   │   └── reviews/
│   │   └── settings/
│   └── (marketing)/    # static pages, if served here
├── components/         # design-system consumers
├── features/           # feature-scoped units (canvas, review, import...)
│   ├── canvas/
│   ├── commits/
│   ├── review/
│   └── …
├── hooks/
│   ├── queries/        # TanStack Query hooks
│   └── mutations/
├── stores/             # Zustand stores for local UI state
├── lib/                # api client, utilities, sdk wrapper
├── styles/
└── main.tsx
```

## 3. State management

### Server state
- **TanStack Query only.**
- Query keys: tuples like `['ontology', ontologyId, 'branch', branchId, 'concepts']`.
- Stale time: defaults to 30 s; mutations invalidate precisely.
- Optimistic updates on canvas edits; rollback on failure with toast.

### Client state
- **Zustand** slices scoped by feature.
- Canvas: nodes, edges, selection, pending draft.
- Global UI: theme, sidebar open, command palette.
- Persisted state (drafts) via `zustand/middleware/persist` → IndexedDB adapter.

### Derived state
- Prefer selectors over derived state stored twice.
- Expensive derivations memoised at the slice level.

## 4. Routing

- File-based routing (React Router v6 data routers).
- Loaders prefetch data needed by the route.
- Error boundaries at segment level produce friendly empty states.

## 5. Forms

- React Hook Form + Zod resolver.
- One Zod schema shared between client and server (via `packages/shared`).
- Error messages map to field-level UI.
- Accessible labels, aria-describedby for help text.

## 6. The Canvas

- **React Flow** with custom node and edge components.
- Virtualisation turned on above ~1500 nodes: off-screen nodes skipped.
- Selection and drag handlers debounced via `rAF` for 60 fps.
- Large node count mode ("big mode"): relation lines computed in a Web Worker; nodes rendered as SVG primitives instead of DOM.
- Keyboard shortcuts (see [UI_UX_GUIDELINES.md](../04_design/UI_UX_GUIDELINES.md)):
  - `N` new concept
  - `R` new relation
  - `/` command palette
  - `C` commit changes
  - `?` shortcut help

## 7. API layer

- SDK (`@ontologia/sdk-js`) wraps the REST API.
- Query hooks import the SDK — never `fetch` directly in components.
- Auth token attached by an SDK interceptor.
- Retries: 2 for idempotent ops on 429/503 with backoff; none on 4xx.

## 8. Performance

- Initial bundle target < 180 KB gzipped (not counting React Flow, code-split).
- Route-level code splitting by default.
- `React.lazy` for heavy routes (canvas, diff view, Cypher console).
- Images: WebP/AVIF; responsive `srcset`.
- Prefetch hints for the next likely view (hover intent).
- Web Vitals to Sentry; regressions posted into `#frontend`.

## 9. Styling

- Tailwind with the tokens defined in [DESIGN_SYSTEM.md](../04_design/DESIGN_SYSTEM.md).
- No ad-hoc colors. Use tokens: `bg-brand-500`, `text-success-600`.
- `class-variance-authority` (CVA) for component variants.
- Dark mode: default; light available via system or toggle. Data colors tuned for both.

## 10. Internationalisation

- `i18next` with JSON resources per locale.
- No raw strings in components — all through `t('…')`.
- Locale detection from user profile > browser > URL.
- Numbers and dates through `Intl` APIs.

See [INTERNATIONALIZATION.md](../04_design/UI_UX_GUIDELINES.md#i18n) (section).

## 11. Accessibility

- Keyboard operability tested per PR affecting UI.
- Focus ring visible. Do not remove default outlines without replacement.
- Announcements for async state: `aria-live="polite"` on the commit toolbar, `assertive` for errors.
- Radix primitives for menus, dialogs, popovers.

## 12. Animation

- Framer Motion for purposeful motion.
- Reduce motion respected: `@media (prefers-reduced-motion: reduce)` kills non-essential animations.
- Avoid animating large subtrees on the canvas — FPS > beauty.

## 13. Empty states & errors

- Every list has an empty state with a single clear CTA.
- Error states: what happened, what to do, a link to support.
- No raw error JSON to the user.

## 14. Observability

- Sentry browser SDK. Release tag on every build.
- PostHog for product analytics. Events tracked with a stable naming convention (`verb_object`, e.g. `commit_created`, `review_opened`). No PII in event props.
- Web Vitals exported to Sentry Performance.

## 15. Testing (frontend-specific)

- Component tests: Vitest + Testing Library.
- Storybook for primitives with axe checks.
- Visual regression on critical components via Chromatic (post-GA).
- Cypress or Playwright E2E; Playwright preferred (already used for backend E2E).

## 16. Performance budgets (enforced)

| Route | TTI budget | JS budget |
|---|---|---|
| Landing `/` | 1.5 s | 80 KB |
| Canvas `/ontologies/:id/canvas` | 3 s | 400 KB |
| Review `/reviews/:id` | 2.5 s | 250 KB |
| Diff `/diff/:ref1…:ref2` | 2.5 s | 250 KB |

Enforced by `bundlesize` in CI.

## 17. Things to avoid

- Global singletons.
- Shared mutable state across routes without a store.
- Custom drag/drop when Radix/React Flow covers it.
- Rolling your own dropdown — use Radix Menu.
- Uncontrolled forms, unless trivial.
- Hard-coded colors.

Related: [Design System](../04_design/DESIGN_SYSTEM.md) · [UI/UX Guidelines](../04_design/UI_UX_GUIDELINES.md) · [Coding Standards](CODING_STANDARDS.md)
