import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "semlify.theme";

function getInitial(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const body = document.body;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved =
    choice === "system" ? (prefersDark ? "dark" : "light") : choice;

  body.setAttribute("data-appearance", resolved);
  body.classList.toggle("dark", resolved === "dark");
  body.classList.toggle("light", resolved === "light");
}

const OPTIONS: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  // Hydrate from localStorage on mount + listen to system changes when on
  // "system".
  useEffect(() => {
    const initial = getInitial();
    setChoice(initial);
    applyTheme(initial);

    if (initial !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function pick(next: ThemeChoice) {
    setChoice(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex items-center rounded-full p-0.5"
      style={{
        background: "var(--gray-3)",
        border: "1px solid var(--gray-a4)",
      }}
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = choice === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => pick(opt.value)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            style={{
              background: active
                ? "var(--color-panel-solid)"
                : "transparent",
              color: active ? "var(--gray-12)" : "var(--gray-10)",
              boxShadow: active ? "var(--shadow-1)" : "none",
            }}
          >
            <Icon size={13} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
