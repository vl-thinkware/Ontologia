import { useEffect, useState } from "react";
import { X, Cookie, Settings2, Check } from "lucide-react";

type ConsentLevel = "all" | "essential" | "custom";
type Categories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "semlify.cookies";

type StoredConsent = {
  level: ConsentLevel;
  categories: Categories;
  decidedAt: string;
};

function readConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredConsent;
  } catch {
    return null;
  }
}

function writeConsent(c: StoredConsent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  // Surface a custom event so analytics layers can listen and react
  // (PostHog / Plausible wiring goes here in Sprint B).
  window.dispatchEvent(
    new CustomEvent("semlify:consent", { detail: c })
  );
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Decide whether to show the banner on first paint.
  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setOpen(true);
    } else {
      setAnalytics(existing.categories.analytics);
      setMarketing(existing.categories.marketing);
    }

    // Allow other parts of the page to re-open the preferences (e.g. footer link).
    const reopen = () => {
      setOpen(true);
      setShowPrefs(true);
    };
    window.addEventListener("semlify:open-cookies", reopen);
    return () =>
      window.removeEventListener("semlify:open-cookies", reopen);
  }, []);

  function acceptAll() {
    writeConsent({
      level: "all",
      categories: { essential: true, analytics: true, marketing: true },
      decidedAt: new Date().toISOString(),
    });
    setOpen(false);
    setShowPrefs(false);
  }

  function rejectAll() {
    writeConsent({
      level: "essential",
      categories: { essential: true, analytics: false, marketing: false },
      decidedAt: new Date().toISOString(),
    });
    setOpen(false);
    setShowPrefs(false);
  }

  function saveCustom() {
    writeConsent({
      level: "custom",
      categories: { essential: true, analytics, marketing },
      decidedAt: new Date().toISOString(),
    });
    setOpen(false);
    setShowPrefs(false);
  }

  if (!open) return null;

  return showPrefs ? (
    <PreferencesModal
      analytics={analytics}
      marketing={marketing}
      onToggleAnalytics={setAnalytics}
      onToggleMarketing={setMarketing}
      onSave={saveCustom}
      onAcceptAll={acceptAll}
      onRejectAll={rejectAll}
      onClose={() => setShowPrefs(false)}
    />
  ) : (
    <Banner
      onAcceptAll={acceptAll}
      onRejectAll={rejectAll}
      onCustomize={() => setShowPrefs(true)}
    />
  );
}

// -----------------------------------------------------------------------------
// Banner — always docks to bottom, slides up.
// -----------------------------------------------------------------------------

function Banner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[55] px-4 pb-4 sm:px-6 sm:pb-6"
      style={{ animation: "fadeUp 320ms cubic-bezier(0.25, 1, 0.5, 1) both" }}
    >
      <div
        className="mx-auto flex max-w-4xl flex-col gap-3 rounded-[var(--radius-5)] p-5 sm:flex-row sm:items-center sm:gap-5"
        style={{
          background: "var(--color-panel-solid)",
          border: "1px solid var(--gray-a5)",
          boxShadow: "var(--shadow-5)",
        }}
        role="dialog"
        aria-labelledby="cookie-banner-title"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--accent-3)", color: "var(--accent-11)" }}
        >
          <Cookie size={18} aria-hidden />
        </div>
        <div className="flex-1">
          <h2
            id="cookie-banner-title"
            className="text-[14px] font-bold"
            style={{ color: "var(--gray-12)" }}
          >
            We use cookies, but only the ones we'd want explained to us.
          </h2>
          <p
            className="mt-1 text-[12.5px] leading-relaxed"
            style={{ color: "var(--gray-11)" }}
          >
            Essential cookies keep you signed in and the site running.
            Analytics and marketing cookies are off until you say so.{" "}
            <a
              href="/legal/privacy"
              className="font-medium underline-offset-2 hover:underline"
              style={{ color: "var(--accent-11)" }}
            >
              Privacy policy
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <button
            onClick={onCustomize}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors"
            style={{
              color: "var(--gray-11)",
              background: "transparent",
            }}
          >
            <Settings2 size={13} aria-hidden />
            Preferences
          </button>
          <button
            onClick={onRejectAll}
            className="rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors"
            style={{
              color: "var(--gray-12)",
              background: "var(--gray-3)",
              border: "1px solid var(--gray-a5)",
            }}
          >
            Reject all
          </button>
          <button
            onClick={onAcceptAll}
            className="rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors"
            style={{
              color: "var(--accent-contrast)",
              background: "var(--accent-9)",
            }}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Preferences modal — granular toggles per category.
// -----------------------------------------------------------------------------

function PreferencesModal({
  analytics,
  marketing,
  onToggleAnalytics,
  onToggleMarketing,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose,
}: {
  analytics: boolean;
  marketing: boolean;
  onToggleAnalytics: (v: boolean) => void;
  onToggleMarketing: (v: boolean) => void;
  onSave: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-prefs-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[var(--radius-5)]"
        style={{
          background: "var(--color-panel-solid)",
          border: "1px solid var(--gray-a5)",
          boxShadow: "var(--shadow-5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <div>
            <h2
              id="cookie-prefs-title"
              className="text-[16px] font-bold"
              style={{ color: "var(--gray-12)" }}
            >
              Cookie preferences
            </h2>
            <p
              className="mt-1 text-[12.5px] leading-relaxed"
              style={{ color: "var(--gray-11)" }}
            >
              Choose which categories you want to allow. You can change this
              any time from the footer.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 transition-colors hover:bg-[var(--gray-a3)]"
            style={{ color: "var(--gray-11)" }}
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        {/* Categories */}
        <div className="px-6 py-5">
          <CategoryRow
            title="Essential"
            description="Required for the site to work — auth, preferences, security. Always on."
            value
            disabled
          />
          <CategoryRow
            title="Analytics"
            description="Aggregated, anonymous usage analytics. Helps us see which pages convert."
            value={analytics}
            onChange={onToggleAnalytics}
          />
          <CategoryRow
            title="Marketing"
            description="Attribution for paid campaigns. Off by default; we don't run paid acquisition yet."
            value={marketing}
            onChange={onToggleMarketing}
          />
        </div>

        {/* Footer actions */}
        <div
          className="flex flex-col-reverse items-stretch gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "var(--gray-2)",
            borderTop: "1px solid var(--gray-a4)",
          }}
        >
          <button
            onClick={onRejectAll}
            className="rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors"
            style={{
              color: "var(--gray-11)",
              background: "transparent",
            }}
          >
            Reject all
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onAcceptAll}
              className="flex-1 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors sm:flex-none"
              style={{
                color: "var(--gray-12)",
                background: "var(--gray-3)",
                border: "1px solid var(--gray-a5)",
              }}
            >
              Accept all
            </button>
            <button
              onClick={onSave}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors sm:flex-none"
              style={{
                color: "var(--accent-contrast)",
                background: "var(--accent-9)",
              }}
            >
              <Check size={13} aria-hidden />
              Save preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  description,
  value,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-start gap-4 py-3.5"
      style={{ borderBottom: "1px solid var(--gray-a3)" }}
    >
      <div className="flex-1">
        <div
          className="flex items-center gap-2 text-[14px] font-bold"
          style={{ color: "var(--gray-12)" }}
        >
          {title}
          {disabled && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                background: "var(--green-3)",
                color: "var(--green-11)",
              }}
            >
              Always on
            </span>
          )}
        </div>
        <p
          className="mt-1 text-[12.5px] leading-relaxed"
          style={{ color: "var(--gray-11)" }}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!value)}
        className="relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: value ? "var(--accent-9)" : "var(--gray-5)",
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
          style={{
            background: "white",
            left: value ? "calc(100% - 22px)" : "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
          }}
        />
      </button>
    </div>
  );
}
