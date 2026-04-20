import clsx from "clsx";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useApp, type Toast } from "../app/AppContext";

const iconFor = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
} as const;

const styleFor = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  info: "border-ink-200 bg-white text-ink-900",
  error: "border-red-200 bg-red-50 text-red-900",
} as const;

const accentFor = {
  success: "text-emerald-600",
  info: "text-brand-600",
  error: "text-red-600",
} as const;

function ToastCard({ toast }: { toast: Toast }) {
  const { dismissToast } = useApp();
  const Icon = iconFor[toast.kind];
  return (
    <div
      className={clsx(
        "pointer-events-auto flex w-80 items-start gap-2.5 rounded-xl border px-3.5 py-3 shadow-pop backdrop-blur-sm",
        styleFor[toast.kind],
        "animate-[slideIn_250ms_cubic-bezier(0.25,1,0.5,1)]"
      )}
      role="status"
    >
      <Icon className={clsx("mt-0.5 h-4 w-4 shrink-0", accentFor[toast.kind])} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-tight">
          {toast.title}
        </div>
        {toast.description && (
          <p className="mt-0.5 text-[12px] leading-snug opacity-80">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              dismissToast(toast.id);
            }}
            className={clsx(
              "mt-1.5 text-[12px] font-semibold underline-offset-2 hover:underline",
              accentFor[toast.kind]
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function Toaster() {
  const { toasts } = useApp();
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}
