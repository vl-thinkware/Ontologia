# Ontologia — App Mockup

A high-fidelity, clickable design mockup of the Ontologia MVP. Nothing is wired to a real backend — every screen reads from hard-coded data in `src/data/mock.ts`. The goal is to feel like a production app so we can evaluate the MVP's look, flow, and information density before writing any real code.

## What's inside

Nine screens, all reachable from the sidebar and topbar:

| Route                   | Screen               | Purpose                                                                 |
| ----------------------- | -------------------- | ----------------------------------------------------------------------- |
| `/signin`               | Sign-in              | Split-screen auth with Google / GitHub / email; brand marketing panel.  |
| `/dashboard`            | Workspace dashboard  | Stat cards, ontology list, activity feed, plan usage, member list.      |
| `/ontologies/:id`       | Canvas editor        | React Flow graph canvas, concept inspector, change history timeline.    |
| `/import`               | Import wizard        | Three-step CSV import (upload → map columns → review & confirm).        |
| `/settings`             | Workspace settings   | Name/slug/locale, defaults, danger zone.                                |
| `/settings/members`     | Members              | Invite form + role table, including pending invite.                     |
| `/settings/api-keys`    | API keys             | Key list with scopes + webhooks placeholder.                            |
| `/settings/billing`     | Billing & usage      | Current plan, 4-tier pricing grid, payment method, invoices.            |

Modal overlays:

- **Revert change** — explains revert as a non-destructive opposite change event, with a message field.
- **Tag this change** — names a stable snapshot that downstream services can pin to.

## Tech

- **Vite 5 + React 18 + TypeScript 5.6** (strict mode)
- **Tailwind CSS 3.4** with a custom `brand` / `accent` / `ink` palette
- **@xyflow/react 12** for the canvas
- **react-router-dom 6** for routing
- **lucide-react** for icons
- No backend, no persistence — intentional.

## Run it locally

```bash
cd mockup
npm install
npm run dev
```

Vite opens [http://localhost:5173](http://localhost:5173) automatically. Sign-in accepts any credentials — clicking **Sign in** routes to `/dashboard`.

## Build for review

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve dist/ at http://localhost:4173
```

The production bundle is about 510 KB gzipped (152 KB) — the React Flow + d3 footprint dominates.

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
    ├── main.tsx              # Router wiring
    ├── index.css             # Tailwind layers + component classes
    ├── components/
    │   ├── Shell.tsx         # Sidebar + topbar + outlet
    │   ├── ConceptNode.tsx   # Custom React Flow node
    │   ├── Modal.tsx         # Shared modal
    │   └── SettingsLayout.tsx
    ├── data/
    │   └── mock.ts           # All mock data in one place
    └── screens/
        ├── SignIn.tsx
        ├── Dashboard.tsx
        ├── Editor.tsx        # Canvas, inspector, history, modals
        ├── ImportWizard.tsx  # 3-step CSV import
        ├── Settings.tsx
        ├── Members.tsx
        ├── ApiKeys.tsx
        └── Billing.tsx
```

## What's deliberately out of scope

This mockup reflects the MVP scope only — **no branches, no merge requests, no review workflow**. Those belong in S1/S2 ("when two paying customers need it") per the refined roadmap. The Editor shows a flat history of change events with revert + tag, which is the actual MVP feature set.

Per-seat pricing is also absent on purpose — the Billing screen shows the four workspace-based tiers (Free / Team $499/mo / Business $1,990/mo / Enterprise $40k+/yr) exactly as described in `docs/06_finance/PRICING_MODEL.md`.

## What to look at first

1. **`/dashboard`** for the overall hierarchy: workspace → ontologies → change events → plan usage.
2. **`/ontologies/ont_ecom`** for the centerpiece experience. Click any concept to fill the inspector, then flip the right-side tab to **History** to see the change-event timeline and the revert / tag affordances.
3. **`/import`** to step through the three-step wizard — all transitions work client-side.
4. **`/settings/billing`** to see the four-tier pricing grid applied to the in-app plan switcher.

## Next steps (not yet done)

- Responsive breakpoints below `lg` (sidebar needs to collapse to an icon rail).
- Dark mode palette (Tailwind tokens are ready; no `dark:` classes are applied yet).
- Keyboard shortcuts (⌘K for search, C for new concept, R for new relation) — chrome is in place but unbound.
- Animation polish on the canvas node hover states.
