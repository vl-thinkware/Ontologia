import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Badge, Box, Flex, Heading, Text } from "@radix-ui/themes";
import {
  Building2,
  Users,
  KeyRound,
  CreditCard,
  Webhook,
  ShieldCheck,
  BellRing,
  Plug,
} from "lucide-react";

const nav = [
  { to: "/settings", label: "Workspace", icon: Building2, end: true },
  { to: "/settings/members", label: "Members", icon: Users },
  { to: "/settings/api-keys", label: "API keys", icon: KeyRound },
  { to: "/settings/billing", label: "Billing & usage", icon: CreditCard },
  { to: "#", label: "Webhooks", icon: Webhook, soon: true },
  { to: "#", label: "Integrations", icon: Plug, soon: true },
  { to: "#", label: "Security", icon: ShieldCheck, soon: true },
  { to: "#", label: "Notifications", icon: BellRing, soon: true },
];

export default function SettingsLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Flex
      className="mx-auto max-w-7xl"
      gap="8"
      px="8"
      py="8"
    >
      <Box width="220px" className="shrink-0" asChild>
        <nav>
          <Box mb="3" px="2">
            <Text
              size="1"
              color="gray"
              weight="bold"
              className="uppercase tracking-wider"
            >
              Workspace settings
            </Text>
          </Box>
          <Flex direction="column" gap="1" asChild>
            <ul>
              {nav.map((n) => (
                <li key={n.label}>
                  {n.soon ? (
                    <Flex
                      align="center"
                      gap="2"
                      px="2"
                      py="2"
                      style={{ color: "var(--gray-9)" }}
                    >
                      <n.icon className="h-4 w-4" />
                      <Text size="2">{n.label}</Text>
                      <Box ml="auto">
                        <Badge color="gray" variant="soft" size="1">
                          soon
                        </Badge>
                      </Box>
                    </Flex>
                  ) : (
                    <NavLink
                      to={n.to}
                      end={n.end}
                      className={({ isActive }) =>
                        clsx(
                          "flex items-center gap-2 rounded-[var(--radius-3)] px-2.5 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[var(--accent-3)] text-[var(--accent-11)]"
                            : "text-[var(--gray-11)] hover:bg-[var(--gray-a3)] hover:text-[var(--gray-12)]"
                        )
                      }
                    >
                      <n.icon className="h-4 w-4" />
                      {n.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </Flex>
        </nav>
      </Box>

      <Box className="min-w-0 flex-1">
        <Flex align="start" justify="between" gap="4">
          <Box>
            <Heading size="6" weight="bold">
              {title}
            </Heading>
            {description && (
              <Text size="2" color="gray" mt="1" as="p">
                {description}
              </Text>
            )}
          </Box>
          {actions && (
            <Flex align="center" gap="2">
              {actions}
            </Flex>
          )}
        </Flex>
        <Flex direction="column" gap="6" mt="6">
          {children}
        </Flex>
      </Box>
    </Flex>
  );
}
