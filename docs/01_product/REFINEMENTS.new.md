# Product refinements

**Primary owner**: Valentin · **Contributor**: Alexandre · **Status**: Draft v3 (ontology-only product)
**Last updated**: April 2026 · **Scope**: Running list of UX refinements — micro-decisions that didn't warrant their own spec but shape how the product feels. Organised by surface, with a clear acceptance bar and links into FEATURES.md for the bigger picture.

---

## How to read this page

Each refinement carries:

- **Surface** — where it lives in the product
- **Current behaviour** — what the built mockup does today
- **Target behaviour** — what we want at launch (or next review cycle)
- **Acceptance** — how we know we're done

Refinements that have landed move to the **Shipped** section at the bottom so the history is preserved.

---

## Canvas

### Default view on opening an ontology

- **Surface**: Canvas
- **Current**: Opens on Schema mode by default — T-Box as an ER diagram with classes as hubs and relation types as edges.
- **Target**: Keep Schema as default; this correctly signals that an ontology *is* a schema. Remember the user's last choice per ontology (localStorage) so returning to a Taxonomies-heavy artefact doesn't land them on the Schema view twice.
- **Acceptance**: Second visit to an ontology where the user last saw Taxonomies mode opens on Taxonomies.

### View toggle placement

- **Surface**: Canvas
- **Current**: Top-right overlay chip. Pointer-events on the chip only so the overlay doesn't block the canvas.
- **Target**: Keep top-right for desktop; at tablet widths (< 900px) collapse to an icon-only pill that expands on hover.
- **Acceptance**: Overlay never overlaps the ontology meta strip on narrow viewports.

### Hub-and-spoke initial layout

- **Surface**: Canvas · Schema mode
- **Current**: The most-connected class becomes the hub (origin); other classes radiate in a ring, starting 12 o'clock and walking clockwise. Edge labels land in empty space.
- **Target**: Cache user-dragged positions per ontology so revisits open with the diagram the user arranged, not a re-laid-out one.
- **Acceptance**: Dragging a class card then refreshing brings it back where the user left it.

### Edge labels

- **Surface**: Canvas · Schema mode
- **Current**: Bezier curves; label backgrounds are opaque white rounded rectangles.
- **Target**: On hover over an edge, lift the curve one z-index so crossing edges become readable. Dim all other edges to 30% opacity.
- **Acceptance**: Pointing at any edge makes it visibly primary without moving it.

---

## Taxonomies tree

### Center pane rendering

- **Surface**: `/tree`
- **Current**: Center pane renders the full `<ConceptDetail />` component inline (Overview, Properties, Relations, History, Usage, AI tabs).
- **Target**: Keep the embedded behaviour. Persist the selected tab across concept switches (user browsing Properties stays on Properties).
- **Acceptance**: Clicking five concepts in a row while on Properties keeps Properties active; switching to Overview once persists until the user changes it again.

### Drag-drop reparenting

- **Surface**: `/tree`
- **Current**: Drop a tree row onto another to rewrite its `broader` relation. Cycle-safe. One ChangeEvent per move.
- **Target**: Add a drop zone *between* siblings so the user can reorder as well as reparent (currently reorder is implicit — sort alphabetically). Surface a subtle blue line indicator at the drop point.
- **Acceptance**: Drop between two sibling rows visibly shifts the ordering without changing the parent.

### Empty-state copy

- **Surface**: `/tree` with no concept selected
- **Current**: "Pick a concept to start editing" card in the center pane.
- **Target**: Tighten copy to "Pick a concept on the left." Remove the subtitle — the sidebar trees are already visible, no instructions needed.
- **Acceptance**: Empty state is one sentence.

---

## Schema view

### Class accordion

- **Surface**: `/schema`
- **Current**: Click a class row to expand the full ClassAttributesEditor (identity form + six SKOS built-ins + custom attributes list).
- **Target**: Preserve the expanded class across tab switches and page refreshes (localStorage, keyed on ontology id).
- **Acceptance**: Opening a class, going to Canvas, returning to Schema — the same class is expanded.

### Built-in attributes section

- **Surface**: Schema · expanded class
- **Current**: Six SKOS slots rendered as a read-only list with cardinality + "per language" chips.
- **Target**: Add a one-line tooltip per slot with a link to the relevant SKOS spec section.
- **Acceptance**: Hovering `prefLabel` shows "One preferred label per language. Maps to skos:prefLabel. Read docs →".

### Relation type removal

- **Surface**: `/schema` · right column
- **Current**: Delete button refuses removal when (a) the type is `isBuiltIn` or (b) any Relation still references it.
- **Target**: Error toast currently reads "Relations still use this type. Delete them first." Change to offer a "Show me" link that navigates to the affected relations in Tables view filtered by relation type.
- **Acceptance**: Toast action takes the user to a pre-filtered table.

---

## Right rail

### Inspector vs ClassInspector routing

- **Surface**: Right rail on Canvas
- **Current**: Inspector swaps based on `canvasMode` — `ClassInspector` in Schema, `Inspector` (concept) in Taxonomies.
- **Target**: Keep the split. Add a tiny breadcrumb at the top ("Class · Manufacturer" or "Concept · Toyota Camry") so the user always knows what the right rail is showing.
- **Acceptance**: The top of the inspector always names the thing being inspected.

### Validation tab

- **Surface**: Right rail
- **Current**: Lists issues grouped by rule (Missing class, Duplicate prefLabel, Domain/Range violation, Orphan, Deprecated-still-referenced).
- **Target**: Surface the issue count on the Validation tab itself (`Validation · 3`). Colour the badge rose when there's an error, amber when warnings only.
- **Acceptance**: Tab label reflects real-time count without opening the panel.

---

## Concept detail

### Breadcrumb removal

- **Surface**: `/ontologies/:id/concepts/:conceptId`
- **Current**: Breadcrumb row ("Back to canvas · Ontologies · Cars / Concept") is **removed** — actions moved onto the title row.
- **Target**: Shipped. Keep monitoring for confusion in user tests.

### Action buttons on the title row

- **Surface**: Concept detail header
- **Current**: Copy ID / Export / Duplicate / Deprecate / Edit sit together on the right of the title row. During an edit, only Cancel + Save are shown.
- **Target**: At narrow widths (< 900px) collapse the non-primary actions into a `…` kebab menu.
- **Acceptance**: Header never wraps to two lines.

### AI tab

- **Surface**: Concept detail · AI
- **Current**: Four heuristic suggestions: altLabels, translation, duplicate detection, class classifier. Each Accept fires `updateConcept` and records a normal ChangeEvent.
- **Target**: Suppress suggestions that would be no-ops for the current concept (e.g. "Translate to fr" when all languages already have a prefLabel). Show an empty-state with "No obvious suggestions right now."
- **Acceptance**: A fully-populated concept shows an empty AI tab, not a stack of meaningless cards.

---

## Tables view

### Row click

- **Surface**: `/table`
- **Current**: Clicking a row navigates to the concept's full detail page.
- **Target**: Keep behaviour for single rows. When one or more rows are selected via the checkbox, row click instead *toggles* selection (doesn't navigate), so the user can build a multi-selection by click-dragging the checkboxes.
- **Acceptance**: Ctrl/Cmd-click extends selection without navigating.

### Bulk deprecate

- **Surface**: `/table` · bulk action bar
- **Current**: Opens the Deprecate modal for the first selected concept; toast notes the rest "will open in turn".
- **Target**: Open a **BulkDeprecateModal** that takes one reason + one replacement target (or "none") and applies it to every selected concept. Records one ChangeEvent per concept but all sharing the same message + timestamp.
- **Acceptance**: Selecting ten concepts and clicking Deprecate opens one modal, not ten.

---

## New ontology flow

### Starter templates

- **Surface**: NewArtefactModal (now NewOntologyModal)
- **Current**: Three starters: Blank · Product reference · Catalog with multi-taxonomies.
- **Target**: Add a fourth: **Cars (demo)** — imports the full seed so new workspaces can explore the product without starting empty.
- **Acceptance**: Picking "Cars (demo)" seeds an ontology identical to the default one.

### Language chip UX

- **Surface**: NewOntologyModal
- **Current**: Click a chip to toggle; double-click to promote to default. Title attribute on each chip explains.
- **Target**: Replace double-click with a right-click contextual menu: "Toggle · Set as default". Discoverable on desktop, touch-friendly on tablet.
- **Acceptance**: User finds the set-as-default action without reading the title.

---

## Notifications center

### Copy tone

- **Surface**: Bell icon · popover
- **Current**: Mix of concrete ChangeEvent summaries and three static prompts ("Review requested on v1.3", "Marie commented on Camry", "CSV import dry-run ready").
- **Target**: When real data is sparse, keep the static prompts. When the workspace has > 25 ChangeEvents, hide the static items so the user isn't confused about their origin.
- **Acceptance**: Mature workspaces see real events only.

---

## Dashboard

### Activity feed filters

- **Surface**: `/dashboard`
- **Current**: Filter chips for `all / create / update / delete / tag / bulk_import` along the top of the feed.
- **Target**: Persist the selected filter in the URL (`?activity=update`) so links to the dashboard can highlight a specific slice.
- **Acceptance**: Copying the dashboard URL while on Update reproduces the filter on reload.

---

## Validation panel

### Severity split

- **Surface**: Right rail · Validation tab
- **Current**: Two severities: `error` (missing class, domain/range violation) and `warn` (duplicate prefLabel, orphan, deprecated-still-referenced).
- **Target**: Add a third, `info`, for style issues we'd like to surface but not gate on (inconsistent casing in prefLabel, missing `example`, untranslated prefLabel).
- **Acceptance**: `info`-severity items render grey with a low-key chip, separate from errors and warnings.

---

## Accessibility

### Focus rings

- **Surface**: All interactive surfaces
- **Current**: Default Tailwind focus-visible ring on most controls; colour matches brand.
- **Target**: Audit every custom control (tree row, canvas node, deprecation banner close button) to make sure focus-visible ring is present and contrast-AAA.
- **Acceptance**: Keyboard-only navigation through Canvas → Tree → Tables → Concept detail reveals no missing focus state.

### Colour-blind safety

- **Surface**: Class colour palette
- **Current**: Violet / Emerald / Amber / Sky / Rose / Ink. Relies on hue + icon + label.
- **Target**: Run the palette through a deuteranopia simulator and swap any pair that becomes ambiguous. Publish the simulation images in BRAND_GUIDELINES.
- **Acceptance**: The palette passes Apple's Accessibility Inspector colour-blind presets.

---

## Shipped

(Refinements that have landed; kept here so the decision trail is visible.)

- **Breadcrumb row on Concept detail removed** (Apr 2026) — actions moved onto the title row.
- **Drag-drop reparenting in tree** (Apr 2026) — HTML5 native DnD with cycle-safe moveConcept mutation.
- **Canvas view toggle moved top-right** (Apr 2026) — freed up the top-left overlay for the ontology meta strip.
- **"New artefact" renamed to "New ontology"** (Apr 2026) — mirrors the ontology-only product model.
- **Class inspector in right rail (Schema mode)** (Apr 2026) — right rail now follows canvas mode.
- **MiniMap removed** (Apr 2026) — didn't pay its way.
- **Presence cursors removed** (Apr 2026) — kept the banner + avatar signals only.
- **Canvas Taxonomies click revert-to-drawer** (Apr 2026) — single click selects into the inspector; double click navigates to concept detail.
- **Taxonomies tree center pane uses full ConceptDetail** (Apr 2026) — no more narrower editor; users never need to click "Full detail" to see the rich tabs.
