# Ontologia — App Mockup

A high-fidelity, clickable design mockup of the Ontologia MVP. Nothing is wired to a real backend — every screen reads from hard-coded data in `src/data/mock.ts`. The goal is to feel like a production app so we can evaluate the MVP's look, flow, and information density before writing any real code.

## What's inside

Nine screens, all reachable from the sidebar and topbar:

| Route                   | Screen               | Purpose                                                                 |
| ----------------------- | -------------------- | ----------------------------------------------------------------------- |
| `/signin`               | Sign-in              | Split-screen auth with Google / GitHub / email; brand marketing panel.  |
| `/dashboard`            | Workspace dashboard  | Stat cards, ontology list, activity feed, plan usage, member list.      |
| `/ontologies/:id`       | Ontology editor      | Canvas, Taxonomies, Tables, Schema views — driven by URL segments.      |
| `/ontologies/:id/concepts/:conceptId` | Concept detail | Full multi-tab concept editor (overview, properties, relations, history, usage, AI). |
| `/import`               | Import wizard        | Three-step CSV import (upload → map columns → review & confirm).        |
| `/settings`             | Workspace settings   | Name/slug/locale, defaults, danger zone.                                |
| `/settings/members`     | Members              | Invite form + role table, including pending invite.                     |
| `/settings/api-keys`    | API keys             | Key list with scopes + webhooks placeholder.                            |
| `/settings/billing`     | Billing & usage      | Current plan, 4-tier pricing grid, payment method, invoices.            |

Modal overlays (all rendered through Radix Themes `<Dialog>`):

- **New ontology**, **New concept** — creation flows with starter schemas.
- **Deprecate** — retire a concept with optional `dct:isReplacedBy` redirect.
- **Export** — JSON-LD / SKOS Turtle / OWL-XML / CSV preview + download.
- **Relation picker** — pick a typed relation when drawing an edge on the canvas.
- **Diff** — single change-event diff with revert.
- **Tag diff** — compare two tagged snapshots.
- **API playground** — try every read endpoint with live in-memory data.
- **Command palette** (`⌘K`) — fuzzy search across concepts, ontologies, actions, members.

## Tech

- **Vite 5 + React 18 + TypeScript 5.6** (strict mode)
- **[Radix Themes 3.3](https://www.radix-ui.com/themes/docs/overview/getting-started)** as the component library — `<Theme accentColor="violet" grayColor="slate" radius="medium" scaling="100%">` wraps the app
- **Tailwind CSS 3.4** retained for layout utilities only (`flex`, `grid`, `gap-*`, padding, sizing)
- **Inter** preserved as the product font via `--default-font-family` override on `.radix-themes`
- **@xyflow/react 12** for the Canvas and Schema graph views
- **react-router-dom 6** for routing
- **lucide-react** for icons
- No backend, no persistence — intentional.

### Styling architecture

- **Component primitives**: every Button, Card, Dialog, DropdownMenu, Popover, Tooltip, TextField, Select, Switch, Checkbox, Tabs, Callout, Badge, Avatar, Separator, ScrollArea, Table, Code, Heading, Text, IconButton, Kbd, Spinner, Progress, SegmentedControl is a Radix Themes component.
- **Tokens**: colors / radii / shadows / spacing come from Radix's CSS variables (`var(--accent-9)`, `var(--gray-a4)`, `var(--radius-3)`, `var(--shadow-2)`, …) — light mode only at the moment; switching to dark is a one-prop change.
- **Shim layer**: `Editor.tsx` and `ConceptDetail.tsx` still use semantic class names (`.btn-primary`, `.input`, `.card`, `.surface`, `.chip`, `.kbd`) defined in `src/index.css`. Those classes are rebuilt on top of Radix tokens, so the look is identical to native components — kept this way to avoid risky rewrites of the two heaviest files (3.5k + 1.9k lines).

## Run it locally

```bash
cd mockup
npm install
npm run dev
```

Vite opens [http://localhost:5173](http://localhost:5173) automatically. Sign-in accepts any credentials — clicking **Sign in** routes to `/dashboard`.

## Build for review

```bash
npm run build     # tsc -b && vite build → build/
npm run preview   # serve build/ at http://localhost:4173
```

> **Note**: build output goes to `build/` (not `dist/`) — Vite's `emptyOutDir` was failing against a cloud-sync-locked `dist/` folder, so the output dir was renamed. The legacy `dist/` directory at the repo root is safe to delete manually.

The production bundle is roughly 90 KB gzipped CSS + 265 KB gzipped JS — Radix Themes' base stylesheet is the bulk of the CSS; React Flow + d3 dominate the JS.

## File layout

```
mockup/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx              # Router + <Theme> provider
    ├── index.css             # Radix font override + shim component classes
    ├── app/
    │   ├── AppContext.tsx    # Global store (events, mutations, modals)
    │   └── PresenceProvider.tsx
    ├── components/
    │   ├── Shell.tsx         # Sidebar + topbar (Radix DropdownMenu / Avatar / TextField)
    │   ├── CommandPalette.tsx
    │   ├── Toaster.tsx
    │   ├── Modal.tsx         # Wrapper around Radix Themes <Dialog>
    │   ├── NewConceptModal.tsx, NewArtefactModal.tsx, DeprecateModal.tsx,
    │   ├── ExportModal.tsx, RelationPickerModal.tsx, DiffModal.tsx,
    │   ├── PlaygroundModal.tsx, TagDiffModal.tsx
    │   ├── NotificationsBell.tsx, ValidationPanel.tsx, AiSuggestionsPanel.tsx,
    │   ├── ClassInspector.tsx, ClassAttributesEditor.tsx
    │   ├── ConceptNode.tsx, ClassNode.tsx   # Custom React Flow nodes
    │   ├── PresenceOverlay.tsx
    │   └── SettingsLayout.tsx
    ├── data/
    │   └── mock.ts           # All mock data in one place
    └── screens/
        ├── SignIn.tsx
        ├── Dashboard.tsx
        ├── Editor.tsx        # Canvas / Tree / Table / Schema views
        ├── ConceptDetail.tsx # Full concept editor
        ├── ImportWizard.tsx
        ├── Settings.tsx, Members.tsx, ApiKeys.tsx, Billing.tsx
```

## What's deliberately out of scope

This mockup reflects the MVP scope only — **no branches, no merge requests, no review workflow**. Those belong in S1/S2 ("when two paying customers need it") per the refined roadmap. The Editor shows a flat history of change events with revert + tag, which is the actual MVP feature set.

Per-seat pricing is also absent on purpose — the Billing screen shows the four workspace-based tiers (Free / Team $499/mo / Business $1,990/mo / Enterprise $40k+/yr) exactly as described in `docs/06_finance/PRICING_MODEL.md`.

## What to look at first

1. **`/dashboard`** for the overall hierarchy: workspace → ontologies → change events → plan usage.
2. **`/ontologies/ont_cars`** for the centerpiece experience. Click any concept to fill the inspector, then flip the right-side tab to **History** to see the change-event timeline and the revert / tag affordances.
3. **`/import`** to step through the three-step wizard — all transitions work client-side.
4. **`/settings/billing`** to see the four-tier pricing grid applied to the in-app plan switcher.
5. Press **`⌘K`** anywhere to open the command palette.

## Next steps (not yet done)

- Responsive breakpoints below `lg` (sidebar needs to collapse to an icon rail).
- **Dark mode**: trivially enabled by switching `appearance="light"` to `appearance="inherit"` (or `"dark"`) on `<Theme>` in `src/main.tsx`. Token-driven custom CSS already handles dark variants.
- Keyboard shortcuts (⌘K for search, C for new concept, R for new relation) — chrome is in place but unbound.
- Animation polish on the canvas node hover states.
- Pure-Radix migration of `Editor.tsx` and `ConceptDetail.tsx` (currently shim-class-based but visually identical to Radix Themes).
