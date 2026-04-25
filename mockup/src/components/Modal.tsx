import { Dialog, Flex, Heading, Text } from "@radix-ui/themes";

/**
 * Backward-compatible Modal wrapper around Radix Themes Dialog.
 *
 * Keeps the legacy {open, onClose, title, subtitle, children, footer, width}
 * API so every existing modal continues to work, while inheriting Radix
 * Themes' a11y (focus trap, ESC, restore focus, portal, scroll lock).
 */
const widthMap: Record<string, string> = {
  "max-w-sm": "420px",
  "max-w-md": "480px",
  "max-w-lg": "560px",
  "max-w-xl": "640px",
  "max-w-2xl": "720px",
  "max-w-3xl": "880px",
  "max-w-4xl": "1024px",
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  // Caller may pass either a tailwind max-w-* token (legacy) or a raw px/% value.
  const maxWidth = widthMap[width] ?? width;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Content
        maxWidth={maxWidth}
        className="overflow-hidden p-0"
        style={{ padding: 0 }}
      >
        {/* Header */}
        <Flex
          align="start"
          justify="between"
          gap="4"
          px="5"
          py="4"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <div>
            <Dialog.Title size="3" weight="bold" mb="0">
              <Heading size="3" weight="bold" as="h2">
                {title}
              </Heading>
            </Dialog.Title>
            {subtitle && (
              <Dialog.Description size="1" color="gray" mt="1">
                <Text as="p" size="1" color="gray">
                  {subtitle}
                </Text>
              </Dialog.Description>
            )}
          </div>
        </Flex>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <Flex
            align="center"
            justify="end"
            gap="2"
            px="5"
            py="3"
            style={{
              borderTop: "1px solid var(--gray-a4)",
              background: "var(--gray-2)",
            }}
          >
            {footer}
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
