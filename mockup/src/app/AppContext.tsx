import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type ToastKind = "success" | "info" | "error";

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

type AppContextValue = {
  // Command palette
  paletteOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;

  // New concept modal
  newConceptOpen: boolean;
  openNewConcept: () => void;
  closeNewConcept: () => void;

  // Toasts
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newConceptOpen, setNewConceptOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), []);
  const openNewConcept = useCallback(() => setNewConceptOpen(true), []);
  const closeNewConcept = useCallback(() => setNewConceptOpen(false), []);

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
      openPalette,
      closePalette,
      togglePalette,
      newConceptOpen,
      openNewConcept,
      closeNewConcept,
      toasts,
      toast,
      dismissToast,
    }),
    [
      paletteOpen,
      openPalette,
      closePalette,
      togglePalette,
      newConceptOpen,
      openNewConcept,
      closeNewConcept,
      toasts,
      toast,
      dismissToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be called inside <AppProvider>");
  return ctx;
}
