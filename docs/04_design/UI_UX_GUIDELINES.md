# UI/UX Guidelines

Opinions that keep the product coherent across features.

---

## 1. Voice & tone

- Clear, short, plain English. No jargon unless we define it.
- Confident, not smug.
- Warm but not chatty. This is a professional tool.
- Never condescending; never apologise for the user.

Examples:
- "You don't have permission to edit this branch." ✅
- "Oops! Looks like you can't do that silly thing!" ❌

## 2. Information architecture

Three consistent regions across the app:

```
┌────────────┬──────────────────────────────────────────┬────────────┐
│ Sidebar    │ Canvas / Main view                       │ Inspector  │
│ (nav)      │ (the current object)                     │ (details)  │
├────────────┴──────────────────────────────────────────┴────────────┤
│ Status bar: branch · commits · members online                     │
└───────────────────────────────────────────────────────────────────┘
```

- **Sidebar.** Workspace switcher, ontologies, branches, search, history.
- **Main.** Canvas by default. Tree, diff, history, review, settings toggle the same area.
- **Inspector.** Context-specific panel on the right. Always showing the selected object's details + history + comments.
- **Status bar.** Branch name, #commits, active members, sync state.

## 3. Navigation

- URL is the source of truth. Deep-linkable everywhere.
- Breadcrumb in the header: `Org / Workspace / Ontology / Branch / View`.
- Cmd-K / Ctrl-K command palette for all navigation and most actions.

## 4. Keyboard shortcuts

Global:
- `⌘K` command palette
- `?` shortcut overlay
- `⌘Z` / `⌘⇧Z` undo / redo (session-scoped)
- `⌘S` commit pending (opens commit modal)

Canvas:
- `N` new concept
- `R` new relation
- `E` edit selected
- `Delete` / `⌫` soft-delete selected
- `F` fit to screen
- `Space + drag` pan
- `⌘+` / `⌘-` zoom

Tree:
- Arrow keys navigate
- `Enter` open concept
- `Cmd + arrow` reparent

Review:
- `J` / `K` next / previous concept in the diff
- `⌘Enter` approve
- `⌘B` leave comment

## 5. Commit UX

- Pending changes surface as a pill in the status bar and inline indicators on nodes.
- "Commit changes" opens a drawer with:
  - Stats summary (X added, Y modified, Z deleted).
  - Multi-line message (first line = short summary, conventional format optional).
  - Branch selector (in case the user is somehow on a different branch).
  - Commit button.
- On submit: optimistic UI, toast on success with "Undo" for 10 s.

## 6. Review UX

Three panes:

- Left: list of changed concepts/relations, grouped by type.
- Center: the selected change (graph or list view).
- Right: comments and activity.

Reviewers can:
- Comment per concept / relation / file.
- Approve or request changes.
- Resolve conversations.
- Mark the review ready to merge.

## 7. Conflict resolution UX

- Enter the conflict UI from the review page.
- Per conflict, three columns: ancestor · ours · theirs.
- Field-level toggles; "apply to all" when bulk action makes sense.
- Preview panel at the bottom shows the merged state.
- "Save resolution" creates a resolution commit.

## 8. Empty states

Every list has:
- An illustration (subtle, not cutesy).
- One-line summary of what goes here.
- A single primary CTA.

## 9. Errors

- Errors describe what happened + what to do.
- Provide a next step: retry, contact support, link to docs.
- Preserve user work. Never lose a draft because the server hiccuped.

## 10. Loading

- Skeletons for structured content.
- Spinners only for short, opaque operations.
- For async operations > 2 s, show progress.
- Long operations (import, export) move to the Jobs drawer; user can navigate away.

## 11. Selection & multi-select

- Click to select one, `⌘`-click to add, drag to box-select on canvas.
- Batch actions appear in a floating action bar.
- Delete, set status, change type on selection.

## 12. Undo & redo

- Session-scoped for canvas interactions.
- Saved drafts persisted so closing a tab doesn't lose work.
- Once committed, the only "undo" is a revert commit.

## 13. Notifications

- In-app bell with unread count.
- Email digests with per-user preferences.
- Critical events (review requested, merge conflict) pushed immediately; digest for everything else.

## 14. Accessibility baseline

- Full keyboard operability.
- Skip links at top.
- Focus ring never removed.
- Screen reader announcements for commit status, review state, job progress.

Detail: [ACCESSIBILITY.md](ACCESSIBILITY.md).

## 15. Internationalisation

**i18n**
- English + French at GA.
- All strings externalised.
- Support RTL planned for post-GA (Hebrew, Arabic).
- Date / number formatting through `Intl`.
- Do not concatenate translated strings; use parameterised messages.

## 16. Mobile & tablet

v1 is desktop-first; the canvas is not usable on phones.

On mobile:
- Read-only views of ontologies and reviews.
- Approve/request changes and comment are fully supported.
- Canvas falls back to tree view.

## 17. Localization of UI microcopy

- Always pass pluralisation through i18n.
- Always use `relativeTimeFormat` for "2 hours ago".
- Avoid idioms that don't translate.

## 18. Style of writing in the UI

- Buttons: verbs, sentence case. "Commit changes", "Open review request".
- Titles: sentence case.
- Tooltips: short, complete thoughts.
- No emojis in the product UI. (Changelogs on the blog are fine.)

## 19. Dark vs light

- Both first-class.
- Default follows OS setting.
- User override stored on their profile.

## 20. Things we don't do

- No modal cascades. One modal at a time.
- No marketing nags in-app.
- No ambiguous destructive actions. "Delete" and "Archive" mean different things and we say which.
- No irreversible actions without a 7-day soft window (billing, workspace delete).

Related: [Design System](DESIGN_SYSTEM.md) · [Accessibility](ACCESSIBILITY.md) · [Frontend Guide](../03_engineering/FRONTEND_GUIDE.md)
