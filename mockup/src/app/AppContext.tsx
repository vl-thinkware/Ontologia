import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  concepts as seedConcepts,
  relations as seedRelations,
  changeEvents as seedEvents,
  tags as seedTags,
  conceptClasses as seedConceptClasses,
  relationTypes as seedRelationTypes,
  currentUser,
  type Concept,
  type ConceptClass,
  type Relation,
  type RelationType,
  type ChangeEvent,
  type Tag,
} from "../data/mock";

export type ToastKind = "success" | "info" | "error";

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

// Mutation helpers accept a "message" so we can thread it through into
// the ChangeEvent summary — matches the commit-message vibe from the PRD.
export type UpdateConceptArgs = {
  id: string;
  patch: Partial<Omit<Concept, "id">>;
  message?: string;
};

export type DeprecateArgs = {
  id: string;
  replacedBy?: string;
  reason?: string;
};

export type AddRelationArgs = {
  from: string;
  to: string;
  schemeId: string;
  relationTypeId: string;
  label: string;
};

// Bulk-import args accept a minimal payload; we fill in ids + defaults.
export type BulkImportArgs = {
  ontologyId: string;
  schemeId?: string;
  rows: Array<{
    name: string;
    description?: string;
    classId: string;
  }>;
  source?: string; // "CSV · file.csv" etc., shown in the summary
};

export type AddConceptClassArgs = Omit<ConceptClass, "id">;
export type AddRelationTypeArgs = Omit<RelationType, "id">;

type AppContextValue = {
  // Command palette
  paletteOpen: boolean;
  paletteInitialQuery: string;
  openPalette: (initialQuery?: string) => void;
  closePalette: () => void;
  togglePalette: () => void;

  // New concept modal
  newConceptOpen: boolean;
  openNewConcept: () => void;
  closeNewConcept: () => void;

  // New artefact modal (starter-template picker)
  newArtefactOpen: boolean;
  openNewArtefact: () => void;
  closeNewArtefact: () => void;

  // Export modal (ontology-level export format picker)
  exportTarget: { ontologyId: string } | null;
  openExport: (ontologyId: string) => void;
  closeExport: () => void;

  // Relation picker modal (canvas edge creation)
  relationDraft: { from: string; to: string; schemeId: string } | null;
  openRelationDraft: (args: {
    from: string;
    to: string;
    schemeId: string;
  }) => void;
  closeRelationDraft: () => void;

  // Diff viewer modal
  diffEventId: string | null;
  openDiff: (eventId: string) => void;
  closeDiff: () => void;

  // Deprecation modal
  deprecateTarget: { id: string } | null;
  openDeprecate: (id: string) => void;
  closeDeprecate: () => void;

  // API playground modal
  playgroundTarget: { ontologyId: string } | null;
  openPlayground: (ontologyId: string) => void;
  closePlayground: () => void;

  // Toasts
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // Data stores — same references as the mock.ts exports; we mutate in
  // place and bump `tick` to trigger re-renders across the tree.
  concepts: Concept[];
  relations: Relation[];
  events: ChangeEvent[];
  tags: Tag[];
  conceptClasses: ConceptClass[];
  relationTypes: RelationType[];
  tick: number;

  // Mutations. Each records a ChangeEvent so the History tab and
  // per-concept lastChangeId stay in sync.
  updateConcept: (args: UpdateConceptArgs) => ChangeEvent | undefined;
  deprecateConcept: (args: DeprecateArgs) => ChangeEvent | undefined;
  reactivateConcept: (id: string) => ChangeEvent | undefined;
  addRelation: (args: AddRelationArgs) => {
    relation: Relation;
    event: ChangeEvent;
  };
  deleteRelation: (id: string) => ChangeEvent | undefined;
  recordTag: (eventId: string, name: string) => Tag | undefined;
  revertEvent: (eventId: string, note?: string) => ChangeEvent | undefined;
  // Bulk import — CSV wizard feeds us a list of rows, we create concepts
  // and record one bulk_import ChangeEvent covering all of them.
  importConcepts: (args: BulkImportArgs) => {
    concepts: Concept[];
    event: ChangeEvent;
  };
  // T-Box mutations — add/remove ConceptClasses and RelationTypes.
  addConceptClass: (args: AddConceptClassArgs) => ConceptClass;
  updateConceptClass: (args: {
    id: string;
    patch: Partial<Omit<ConceptClass, "id" | "ontologyId">>;
    message?: string;
  }) => ChangeEvent | undefined;
  deleteConceptClass: (id: string) => ChangeEvent | undefined;
  addRelationType: (args: AddRelationTypeArgs) => RelationType;
  deleteRelationType: (id: string) => ChangeEvent | undefined;
  // Re-parent a concept in a taxonomy by rewriting its broader relation.
  // Returns undefined if the move would create a cycle (dropping a parent
  // under its own descendant) or if we can't find a broader relation type.
  moveConcept: (args: {
    conceptId: string;
    newParentId: string | null; // null = make it a root
    broaderRelationTypeId: string;
  }) => ChangeEvent | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

// Module-level mutable stores — the imports from mock.ts are arrays so we
// mutate in place (push / splice / replace) and keep the same reference.
// Keeping the reference stable means `import { concepts } from mock` still
// sees fresh values; the tick state variable is what actually triggers
// React to re-render.
const conceptStore: Concept[] = seedConcepts;
const relationStore: Relation[] = seedRelations;
const eventStore: ChangeEvent[] = seedEvents;
const tagStore: Tag[] = seedTags;
const conceptClassStore: ConceptClass[] = seedConceptClasses;
const relationTypeStore: RelationType[] = seedRelationTypes;

const author = {
  name: currentUser.name,
  initials: currentUser.initials,
  color: currentUser.color,
};

function shortId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteInitialQuery, setPaletteInitialQuery] = useState("");
  const [newConceptOpen, setNewConceptOpen] = useState(false);
  const [newArtefactOpen, setNewArtefactOpen] = useState(false);
  const [exportTarget, setExportTarget] =
    useState<AppContextValue["exportTarget"]>(null);
  const [relationDraft, setRelationDraft] =
    useState<AppContextValue["relationDraft"]>(null);
  const [diffEventId, setDiffEventId] = useState<string | null>(null);
  const [deprecateTarget, setDeprecateTarget] =
    useState<AppContextValue["deprecateTarget"]>(null);
  const [playgroundTarget, setPlaygroundTarget] =
    useState<AppContextValue["playgroundTarget"]>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  // `tick` increments on every mutation — cheap and ensures consumers of
  // useApp() re-render even though the store arrays keep identity.
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick((t) => t + 1), []);
  // Ref for the most-recent-event id so revert can look it up synchronously.
  const latestEventRef = useRef<ChangeEvent | null>(null);

  const openPalette = useCallback((initialQuery?: string) => {
    setPaletteInitialQuery(initialQuery ?? "");
    setPaletteOpen(true);
  }, []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), []);
  const openNewConcept = useCallback(() => setNewConceptOpen(true), []);
  const closeNewConcept = useCallback(() => setNewConceptOpen(false), []);
  const openNewArtefact = useCallback(() => setNewArtefactOpen(true), []);
  const closeNewArtefact = useCallback(() => setNewArtefactOpen(false), []);
  const openExport = useCallback(
    (ontologyId: string) => setExportTarget({ ontologyId }),
    []
  );
  const closeExport = useCallback(() => setExportTarget(null), []);
  const openRelationDraft = useCallback(
    (args: { from: string; to: string; schemeId: string }) =>
      setRelationDraft(args),
    []
  );
  const closeRelationDraft = useCallback(() => setRelationDraft(null), []);
  const openDiff = useCallback((eventId: string) => setDiffEventId(eventId), []);
  const closeDiff = useCallback(() => setDiffEventId(null), []);
  const openDeprecate = useCallback(
    (id: string) => setDeprecateTarget({ id }),
    []
  );
  const closeDeprecate = useCallback(() => setDeprecateTarget(null), []);
  const openPlayground = useCallback(
    (ontologyId: string) => setPlaygroundTarget({ ontologyId }),
    []
  );
  const closePlayground = useCallback(() => setPlaygroundTarget(null), []);

  const dismissToast = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = `t_${Math.random().toString(36).slice(2, 9)}`;
      setToasts((ts) => [...ts, { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  // ---- Data mutations ---------------------------------------------------

  const recordEvent = useCallback(
    (e: Omit<ChangeEvent, "id" | "at" | "author">): ChangeEvent => {
      const event: ChangeEvent = {
        ...e,
        id: shortId("ce"),
        at: new Date().toISOString(),
        author,
      };
      eventStore.unshift(event);
      latestEventRef.current = event;
      return event;
    },
    []
  );

  const updateConcept = useCallback(
    ({ id, patch, message }: UpdateConceptArgs) => {
      const idx = conceptStore.findIndex((c) => c.id === id);
      if (idx === -1) return undefined;
      const before = conceptStore[idx];
      const after: Concept = { ...before, ...patch };
      conceptStore[idx] = after;
      // Keep canonical name/description in sync with the primary prefLabel /
      // default-lang definition when those are in the patch.
      const changedFields = Object.keys(patch) as Array<keyof Concept>;
      const event = recordEvent({
        kind: "update",
        entityKind: "concept",
        entityId: id,
        entityName: after.name,
        message,
        summary:
          message ||
          `Updated ${after.name} · ${changedFields.join(", ")}`,
      });
      conceptStore[idx] = { ...after, lastChangeId: event.id };
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const deprecateConcept = useCallback(
    ({ id, replacedBy, reason }: DeprecateArgs) => {
      const idx = conceptStore.findIndex((c) => c.id === id);
      if (idx === -1) return undefined;
      const before = conceptStore[idx];
      const replacement = replacedBy
        ? conceptStore.find((c) => c.id === replacedBy)
        : undefined;
      const event = recordEvent({
        kind: "update",
        entityKind: "concept",
        entityId: id,
        entityName: before.name,
        summary: replacement
          ? `Deprecated "${before.name}" → replaced by "${replacement.name}"`
          : `Deprecated "${before.name}"`,
        message: reason,
      });
      conceptStore[idx] = {
        ...before,
        deprecated: true,
        replacedBy: replacedBy,
        deprecationReason: reason,
        lastChangeId: event.id,
      };
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const reactivateConcept = useCallback(
    (id: string) => {
      const idx = conceptStore.findIndex((c) => c.id === id);
      if (idx === -1) return undefined;
      const before = conceptStore[idx];
      const event = recordEvent({
        kind: "update",
        entityKind: "concept",
        entityId: id,
        entityName: before.name,
        summary: `Reactivated "${before.name}"`,
      });
      conceptStore[idx] = {
        ...before,
        deprecated: false,
        replacedBy: undefined,
        deprecationReason: undefined,
        lastChangeId: event.id,
      };
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const addRelation = useCallback(
    (args: AddRelationArgs) => {
      const relation: Relation = { ...args, id: shortId("r") };
      relationStore.push(relation);
      const from = conceptStore.find((c) => c.id === args.from);
      const to = conceptStore.find((c) => c.id === args.to);
      const event = recordEvent({
        kind: "create",
        entityKind: "relation",
        entityId: relation.id,
        entityName: args.label,
        summary: `${from?.name ?? args.from} —[${args.label}]→ ${
          to?.name ?? args.to
        }`,
      });
      bump();
      return { relation, event };
    },
    [bump, recordEvent]
  );

  const deleteRelation = useCallback(
    (id: string) => {
      const idx = relationStore.findIndex((r) => r.id === id);
      if (idx === -1) return undefined;
      const rel = relationStore[idx];
      relationStore.splice(idx, 1);
      const from = conceptStore.find((c) => c.id === rel.from);
      const to = conceptStore.find((c) => c.id === rel.to);
      const event = recordEvent({
        kind: "delete",
        entityKind: "relation",
        entityId: id,
        entityName: rel.label,
        summary: `Removed ${from?.name ?? rel.from} —[${rel.label}]→ ${
          to?.name ?? rel.to
        }`,
      });
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const recordTag = useCallback(
    (eventId: string, name: string) => {
      const tag: Tag = {
        id: shortId("tag"),
        name,
        changeEventId: eventId,
        createdBy: currentUser.name,
        createdAt: new Date().toISOString(),
      };
      tagStore.unshift(tag);
      const pinned = eventStore.find((e) => e.id === eventId);
      recordEvent({
        kind: "tag",
        entityKind: "tag",
        entityId: tag.id,
        entityName: name,
        summary: pinned
          ? `Tagged ${pinned.entityName} as "${name}"`
          : `Created tag "${name}"`,
      });
      bump();
      return tag;
    },
    [bump, recordEvent]
  );

  const revertEvent = useCallback(
    (eventId: string, note?: string) => {
      const target = eventStore.find((e) => e.id === eventId);
      if (!target) return undefined;
      const event = recordEvent({
        kind: "revert",
        entityKind: target.entityKind,
        entityId: target.entityId,
        entityName: target.entityName,
        revertsEventId: eventId,
        message: note,
        summary: `Reverted "${target.summary}"`,
      });
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const importConcepts = useCallback(
    (args: BulkImportArgs) => {
      // Record the bulk-import event up front so we can stamp lastChangeId
      // on every freshly created row without a second pass.
      const event = recordEvent({
        kind: "bulk_import",
        entityKind: "concept",
        entityId: args.ontologyId,
        entityName: args.source ?? "CSV import",
        summary: `Imported ${args.rows.length} concepts${
          args.source ? ` from ${args.source}` : ""
        }`,
      });
      // Create a fresh Concept for every row. The mock's Concept type has
      // more fields than the CSV wizard captures, so we backfill defaults.
      const created: Concept[] = args.rows.map((row, idx) => {
        const id = shortId("c");
        return {
          id,
          ontologyId: args.ontologyId,
          schemeId: args.schemeId ?? "",
          classId: row.classId,
          name: row.name,
          description: row.description ?? "",
          labels: {
            prefLabel: [{ lang: "en", value: row.name }],
            altLabel: [],
            hiddenLabel: [],
          },
          definitions: row.description
            ? [{ lang: "en", value: row.description }]
            : [],
          properties: [],
          color: "violet",
          x: (idx % 6) * 220,
          y: Math.floor(idx / 6) * 120,
          lastChangeId: event.id,
        };
      });
      conceptStore.push(...created);
      bump();
      return { concepts: created, event };
    },
    [bump, recordEvent]
  );

  // -- T-Box mutations ---------------------------------------------------

  const addConceptClass = useCallback(
    (args: AddConceptClassArgs) => {
      const cls: ConceptClass = { ...args, id: shortId("cls") };
      conceptClassStore.push(cls);
      recordEvent({
        kind: "create",
        entityKind: "concept",
        entityId: cls.id,
        entityName: cls.name,
        summary: `Added class "${cls.name}"`,
      });
      bump();
      return cls;
    },
    [bump, recordEvent]
  );

  const updateConceptClass = useCallback(
    ({
      id,
      patch,
      message,
    }: {
      id: string;
      patch: Partial<Omit<ConceptClass, "id" | "ontologyId">>;
      message?: string;
    }) => {
      const idx = conceptClassStore.findIndex((c) => c.id === id);
      if (idx === -1) return undefined;
      const before = conceptClassStore[idx];
      const after: ConceptClass = { ...before, ...patch };
      conceptClassStore[idx] = after;
      const changed = Object.keys(patch) as Array<keyof ConceptClass>;
      const event = recordEvent({
        kind: "update",
        entityKind: "concept_class",
        entityId: id,
        entityName: after.name,
        message,
        summary:
          message ||
          `Updated class "${after.name}" · ${changed.join(", ")}`,
      });
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const deleteConceptClass = useCallback(
    (id: string) => {
      const idx = conceptClassStore.findIndex((c) => c.id === id);
      if (idx === -1) return undefined;
      const cls = conceptClassStore[idx];
      // Refuse to delete a class that still has concepts — surface the
      // consistency problem to the caller via undefined return + a toast.
      const stillUsed = conceptStore.some((c) => c.classId === id);
      if (stillUsed) return undefined;
      conceptClassStore.splice(idx, 1);
      const event = recordEvent({
        kind: "delete",
        entityKind: "concept",
        entityId: id,
        entityName: cls.name,
        summary: `Removed class "${cls.name}"`,
      });
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const addRelationType = useCallback(
    (args: AddRelationTypeArgs) => {
      const rt: RelationType = { ...args, id: shortId("rt") };
      relationTypeStore.push(rt);
      recordEvent({
        kind: "create",
        entityKind: "relation",
        entityId: rt.id,
        entityName: rt.name,
        summary: `Added relation type "${rt.name}"`,
      });
      bump();
      return rt;
    },
    [bump, recordEvent]
  );

  const moveConcept = useCallback(
    ({
      conceptId,
      newParentId,
      broaderRelationTypeId,
    }: {
      conceptId: string;
      newParentId: string | null;
      broaderRelationTypeId: string;
    }) => {
      const concept = conceptStore.find((c) => c.id === conceptId);
      if (!concept) return undefined;

      // Cycle check: walking up from newParentId via existing broader
      // relations must not land back on conceptId.
      if (newParentId) {
        const visited = new Set<string>();
        let cursor: string | null = newParentId;
        while (cursor && !visited.has(cursor)) {
          if (cursor === conceptId) return undefined; // cycle
          visited.add(cursor);
          const up = relationStore.find(
            (r) => r.from === cursor && r.relationTypeId === broaderRelationTypeId
          );
          cursor = up ? up.to : null;
        }
      }

      // Remove the current broader edge (if any).
      const existingIdx = relationStore.findIndex(
        (r) => r.from === conceptId && r.relationTypeId === broaderRelationTypeId
      );
      const oldParentId =
        existingIdx === -1 ? null : relationStore[existingIdx].to;
      if (existingIdx !== -1) {
        relationStore.splice(existingIdx, 1);
      }

      // Add the new broader edge if we have a parent.
      if (newParentId) {
        relationStore.push({
          id: shortId("r"),
          from: conceptId,
          to: newParentId,
          schemeId: concept.schemeId,
          relationTypeId: broaderRelationTypeId,
          label: "broader",
        });
      }

      const oldParent = oldParentId
        ? conceptStore.find((c) => c.id === oldParentId)
        : null;
      const newParent = newParentId
        ? conceptStore.find((c) => c.id === newParentId)
        : null;

      const event = recordEvent({
        kind: "update",
        entityKind: "concept",
        entityId: conceptId,
        entityName: concept.name,
        summary: `Moved ${concept.name} ${
          oldParent ? `from under ${oldParent.name}` : "from root"
        } to ${newParent ? `under ${newParent.name}` : "root"}`,
      });
      // Keep the concept's lastChangeId in sync.
      const cIdx = conceptStore.findIndex((c) => c.id === conceptId);
      if (cIdx !== -1) {
        conceptStore[cIdx] = { ...conceptStore[cIdx], lastChangeId: event.id };
      }
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  const deleteRelationType = useCallback(
    (id: string) => {
      const idx = relationTypeStore.findIndex((r) => r.id === id);
      if (idx === -1) return undefined;
      const rt = relationTypeStore[idx];
      if (rt.isBuiltIn) return undefined; // can't remove broader/narrower
      const stillUsed = relationStore.some((r) => r.relationTypeId === id);
      if (stillUsed) return undefined;
      relationTypeStore.splice(idx, 1);
      const event = recordEvent({
        kind: "delete",
        entityKind: "relation",
        entityId: id,
        entityName: rt.name,
        summary: `Removed relation type "${rt.name}"`,
      });
      bump();
      return event;
    },
    [bump, recordEvent]
  );

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typingInField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (!typingInField && e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      paletteOpen,
      paletteInitialQuery,
      openPalette,
      closePalette,
      togglePalette,
      newConceptOpen,
      openNewConcept,
      closeNewConcept,
      newArtefactOpen,
      openNewArtefact,
      closeNewArtefact,
      exportTarget,
      openExport,
      closeExport,
      relationDraft,
      openRelationDraft,
      closeRelationDraft,
      diffEventId,
      openDiff,
      closeDiff,
      deprecateTarget,
      openDeprecate,
      closeDeprecate,
      playgroundTarget,
      openPlayground,
      closePlayground,
      toasts,
      toast,
      dismissToast,
      concepts: conceptStore,
      relations: relationStore,
      events: eventStore,
      tags: tagStore,
      conceptClasses: conceptClassStore,
      relationTypes: relationTypeStore,
      tick,
      updateConcept,
      deprecateConcept,
      reactivateConcept,
      addRelation,
      deleteRelation,
      recordTag,
      revertEvent,
      importConcepts,
      addConceptClass,
      updateConceptClass,
      deleteConceptClass,
      addRelationType,
      deleteRelationType,
      moveConcept,
    }),
    [
      paletteOpen,
      paletteInitialQuery,
      openPalette,
      closePalette,
      togglePalette,
      newConceptOpen,
      openNewConcept,
      closeNewConcept,
      newArtefactOpen,
      openNewArtefact,
      closeNewArtefact,
      exportTarget,
      openExport,
      closeExport,
      relationDraft,
      openRelationDraft,
      closeRelationDraft,
      diffEventId,
      openDiff,
      closeDiff,
      deprecateTarget,
      openDeprecate,
      closeDeprecate,
      playgroundTarget,
      openPlayground,
      closePlayground,
      toasts,
      toast,
      dismissToast,
      tick,
      updateConcept,
      deprecateConcept,
      reactivateConcept,
      addRelation,
      deleteRelation,
      recordTag,
      revertEvent,
      importConcepts,
      addConceptClass,
      updateConceptClass,
      deleteConceptClass,
      addRelationType,
      deleteRelationType,
      moveConcept,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be called inside <AppProvider>");
  return ctx;
}
