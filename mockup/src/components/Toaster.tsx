import clsx from "clsx";
import { Box, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { useApp, type Toast } from "../app/AppContext";

const iconFor = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
} as const;

const variantFor: Record<Toast["kind"], "surface" | "classic"> = {
  success: "surface",
  info: "surface",
  error: "surface",
};

const accentFor: Record<Toast["kind"], string> = {
  success: "var(--green-11)",
  info: "var(--accent-11)",
  error: "var(--red-11)",
};

const tintFor: Record<Toast["kind"], string> = {
  success: "var(--green-2)",
  info: "var(--color-panel-solid)",
  error: "var(--red-2)",
};

const borderFor: Record<Toast["kind"], string> = {
  success: "var(--green-a5)",
  info: "var(--gray-a4)",
  error: "var(--red-a5)",
};

function ToastCard({ toast }: { toast: Toast }) {
  const { dismissToast } = useApp();
  const Icon = iconFor[toast.kind];
  return (
    <div
      role="status"
      style={{
        animation: "slideIn 250ms cubic-bezier(0.25,1,0.5,1)",
        background: tintFor[toast.kind],
        border: `1px solid ${borderFor[toast.kind]}`,
        borderRadius: "var(--radius-4)",
        boxShadow: "var(--shadow-4)",
        width: 320,
      }}
      className="pointer-events-auto"
    >
      <Card
        variant={variantFor[toast.kind]}
        size="2"
        style={{ background: "transparent", border: "none", boxShadow: "none" }}
      >
        <Flex align="start" gap="2">
          <Icon
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: accentFor[toast.kind] }}
          />
          <Box className="min-w-0 flex-1">
            <Text
              size="2"
              weight="bold"
              className="block leading-tight"
            >
              {toast.title}
            </Text>
            {toast.description && (
              <Text
                as="p"
                size="1"
                color="gray"
                mt="1"
                className="leading-snug"
              >
                {toast.description}
              </Text>
            )}
            {toast.action && (
              <button
                onClick={() => {
                  toast.action!.onClick();
                  dismissToast(toast.id);
                }}
                className={clsx(
                  "mt-1.5 text-[12px] font-semibold underline-offset-2 hover:underline"
                )}
                style={{ color: accentFor[toast.kind] }}
              >
                {toast.action.label}
              </button>
            )}
          </Box>
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </IconButton>
        </Flex>
      </Card>
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
