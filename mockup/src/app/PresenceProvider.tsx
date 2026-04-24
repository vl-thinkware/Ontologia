import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  concepts as allConcepts,
  currentUser,
  type Concept,
} from "../data/mock";

// Mock teammate. In a real build these would come from a websocket feed.
export type PresenceUser = {
  id: string;
  name: string;
  initials: string;
  color: string;
  // Normalised cursor position (0 → 1) across the viewport. Every consumer
  // translates to screen coords locally so resizes don't confuse things.
  cursorNx: number;
  cursorNy: number;
  // Which concept are they "focused on" right now? Drives the editing banner
  // + tree row chips.
  focusedConceptId: string | null;
};

const FAKE_TEAMMATES: Omit<
  PresenceUser,
  "cursorNx" | "cursorNy" | "focusedConceptId"
>[] = [
  {
    id: "u_alex",
    name: "Alexandre Delplace",
    initials: "AD",
    color: "#10b981",
  },
  {
    id: "u_marie",
    name: "Marie Dupont",
    initials: "MD",
    color: "#f59e0b",
  },
];

type PresenceContextValue = {
  users: PresenceUser[];
  // Convenience lookup — who is focused on this concept (excluding me)?
  focusedOn: (conceptId: string) => PresenceUser[];
};

const PresenceContext = createContext<PresenceContextValue | null>(null);

export function PresenceProvider({ children }: { children: ReactNode }) {
  // Seed each teammate with a stable starting cursor position + a concept
  // they're "looking at" — picked from the real concept store so the banner
  // has something to render.
  const startingPool = allConcepts.slice(0, 10);
  const [users, setUsers] = useState<PresenceUser[]>(() =>
    FAKE_TEAMMATES.map((t, idx) => ({
      ...t,
      cursorNx: 0.25 + idx * 0.3,
      cursorNy: 0.35 + idx * 0.2,
      focusedConceptId:
        startingPool[idx % Math.max(1, startingPool.length)]?.id ?? null,
    }))
  );

  // Light per-second jitter so cursors look alive without thrashing renders.
  // Every few ticks a teammate switches focus to a new concept, which makes
  // the banner on ConceptDetail / Taxonomies pop in and out convincingly.
  useEffect(() => {
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      setUsers((prev) =>
        prev.map((u, idx) => {
          // Cursor drift: small random walk, clamped to [0.05, 0.95].
          const dx = (Math.random() - 0.5) * 0.08;
          const dy = (Math.random() - 0.5) * 0.08;
          const nx = clamp(u.cursorNx + dx, 0.05, 0.95);
          const ny = clamp(u.cursorNy + dy, 0.05, 0.95);
          // Roughly every 8 seconds rotate the focus to a different concept.
          const switchFocus = (step + idx) % 8 === 0;
          const focusedConceptId = switchFocus
            ? pickConceptId(u.focusedConceptId)
            : u.focusedConceptId;
          return { ...u, cursorNx: nx, cursorNy: ny, focusedConceptId };
        })
      );
    }, 1200);
    return () => window.clearInterval(interval);
  }, []);

  const value: PresenceContextValue = useMemo(
    () => ({
      users,
      focusedOn: (conceptId: string) =>
        users.filter(
          (u) =>
            u.focusedConceptId === conceptId &&
            u.initials !== currentUser.initials
        ),
    }),
    [users]
  );

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence(): PresenceContextValue {
  const ctx = useContext(PresenceContext);
  if (!ctx)
    throw new Error("usePresence must be called inside <PresenceProvider>");
  return ctx;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickConceptId(current: string | null): string | null {
  // Pick any concept other than the current one — gives the impression of
  // the teammate moving around the workspace.
  const pool: Concept[] = allConcepts;
  if (pool.length === 0) return null;
  const next = pool[Math.floor(Math.random() * pool.length)];
  if (next.id === current && pool.length > 1) {
    // Try one more time to avoid a no-op.
    return pool[Math.floor(Math.random() * pool.length)].id;
  }
  return next.id;
}
