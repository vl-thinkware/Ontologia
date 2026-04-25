import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  IconButton,
  Progress,
  Table,
  Text,
} from "@radix-ui/themes";
import { Check, Download, CreditCard, Sparkles } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { usage } from "../data/mock";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    tagline: "For evaluation and hobby projects.",
    highlights: [
      "1 workspace · 1 ontology",
      "Up to 500 concepts",
      "Community support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$499",
    unit: "/month",
    tagline: "For AI teams shipping to production.",
    current: true,
    highlights: [
      "Unlimited seats · 3 workspaces",
      "5,000 concepts · 500k API calls",
      "Change history + revert + tags",
      "Email support, 1-business-day SLA",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$1,990",
    unit: "/month",
    tagline: "For teams with compliance needs.",
    highlights: [
      "Unlimited concepts · 5M API calls",
      "SSO (SAML) · audit log export",
      "99.9% SLA · priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$40k+",
    unit: "/year",
    tagline: "For regulated industries & self-hosted.",
    highlights: [
      "Dedicated Neo4j instance or self-host",
      "Custom DPA · procurement review",
      "Named success manager",
    ],
  },
];

const INVOICES = [
  { id: "INV-2026-04", date: "2026-04-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-03", date: "2026-03-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-02", date: "2026-02-01", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-01", date: "2026-01-01", amount: "$499.00", status: "Paid" },
];

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function Meter({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <Card variant="surface" size="2">
      <Flex align="baseline" justify="between">
        <Text size="1" weight="bold">
          {label}
        </Text>
        <Text size="1" color="gray">
          {formatNumber(used)} / {formatNumber(limit)} {unit}
        </Text>
      </Flex>
      <Box mt="2">
        <Progress
          value={pct}
          color={pct > 80 ? "amber" : "violet"}
          size="1"
        />
      </Box>
      <Text size="1" color="gray" mt="2" as="p">
        {pct}% used · resets May 1
      </Text>
    </Card>
  );
}

export default function Billing() {
  return (
    <SettingsLayout
      title="Billing & usage"
      description="Manage your plan, payment method, and download invoices."
    >
      {/* Current plan */}
      <Card size="3" style={{ padding: 0, overflow: "hidden" }}>
        <Flex
          align="start"
          justify="between"
          gap="4"
          px="6"
          py="5"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-2), var(--color-panel-solid))",
            borderBottom: "1px solid var(--gray-a4)",
          }}
        >
          <Box>
            <Flex align="center" gap="2">
              <Sparkles
                className="h-4 w-4"
                style={{ color: "var(--accent-11)" }}
              />
              <Text
                size="1"
                weight="bold"
                color="violet"
                className="uppercase tracking-wider"
              >
                Current plan
              </Text>
            </Flex>
            <Flex align="baseline" gap="2" mt="1">
              <Heading size="6" weight="bold">
                Team
              </Heading>
              <Text size="2" color="gray">
                · $499/month
              </Text>
            </Flex>
            <Text as="p" size="1" color="gray" mt="1">
              Renews on <strong>May 1, 2026</strong> · Billed to Visa ••••4242
            </Text>
          </Box>
          <Flex align="center" gap="2">
            <Button variant="surface" color="gray">
              Change plan
            </Button>
            <Button variant="ghost" color="gray">
              Cancel subscription
            </Button>
          </Flex>
        </Flex>

        <Box p="6" className="grid grid-cols-4 gap-4">
          <Meter
            label="Concepts"
            used={usage.concepts.used}
            limit={usage.concepts.limit}
          />
          <Meter
            label="API calls (this month)"
            used={usage.apiCalls.used}
            limit={usage.apiCalls.limit}
          />
          <Meter
            label="Workspaces"
            used={usage.workspaces.used}
            limit={usage.workspaces.limit}
          />
          <Meter
            label="Webhook endpoints"
            used={usage.webhooks.used}
            limit={usage.webhooks.limit}
          />
        </Box>
      </Card>

      {/* Plans */}
      <Box>
        <Heading size="2" weight="bold">
          Available plans
        </Heading>
        <Text size="1" color="gray">
          Every plan is workspace-based — no per-seat tax.
        </Text>
        <Box mt="3" className="grid grid-cols-4 gap-3">
          {PLANS.map((p) => (
            <Card
              key={p.id}
              variant={p.current ? "classic" : "surface"}
              size="2"
              style={
                p.current
                  ? {
                      border: "2px solid var(--accent-9)",
                      boxShadow: "var(--shadow-4)",
                    }
                  : undefined
              }
            >
              <Flex align="center" justify="between">
                <Text size="2" weight="bold">
                  {p.name}
                </Text>
                {p.current && (
                  <Badge color="violet" variant="solid" size="1">
                    Current
                  </Badge>
                )}
              </Flex>
              <Flex align="baseline" mt="2">
                <Heading size="5" weight="bold">
                  {p.price}
                </Heading>
                <Text size="1" color="gray" ml="1">
                  {p.unit}
                </Text>
              </Flex>
              <Text as="p" size="1" color="gray" mt="1">
                {p.tagline}
              </Text>
              <Flex direction="column" gap="2" mt="3" asChild>
                <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                  {p.highlights.map((h) => (
                    <Flex key={h} align="start" gap="2" asChild>
                      <li>
                        <Check
                          className="mt-0.5 h-3 w-3 shrink-0"
                          style={{ color: "var(--green-9)" }}
                        />
                        <Text size="1">{h}</Text>
                      </li>
                    </Flex>
                  ))}
                </ul>
              </Flex>
              <Button
                disabled={p.current}
                variant={p.current ? "soft" : "solid"}
                color={p.current ? "gray" : "violet"}
                mt="4"
                className="w-full"
              >
                {p.current ? "Current plan" : "Switch to " + p.name}
              </Button>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Payment method */}
      <Card size="3">
        <Heading size="2" weight="bold">
          Payment method
        </Heading>
        <Flex
          align="center"
          gap="4"
          mt="4"
          p="4"
          style={{
            background: "var(--color-panel-solid)",
            border: "1px solid var(--gray-a4)",
            borderRadius: "var(--radius-3)",
          }}
        >
          <Flex
            align="center"
            justify="center"
            className="h-10 w-14 rounded-md text-white"
            style={{
              background: "linear-gradient(135deg, var(--gray-12), #000)",
            }}
          >
            <CreditCard className="h-4 w-4" />
          </Flex>
          <Box className="flex-1 min-w-0">
            <Text size="2" weight="bold">
              Visa ending in 4242
            </Text>
            <Text as="div" size="1" color="gray">
              Expires 08/2028 · Valentin Lemort
            </Text>
          </Box>
          <Button variant="ghost" color="gray" size="1">
            Update
          </Button>
        </Flex>
      </Card>

      {/* Invoices */}
      <Card size="3" style={{ padding: 0 }}>
        <Flex
          align="center"
          justify="between"
          px="5"
          py="3"
          style={{ borderBottom: "1px solid var(--gray-a4)" }}
        >
          <Box>
            <Heading size="2" weight="bold">
              Invoice history
            </Heading>
            <Text size="1" color="gray">
              Download past invoices as PDF.
            </Text>
          </Box>
          <Button variant="ghost" color="gray" size="1">
            <Download className="h-3.5 w-3.5" />
            Export all
          </Button>
        </Flex>
        <Table.Root size="2" variant="ghost">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Invoice</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {INVOICES.map((inv) => (
              <Table.Row key={inv.id}>
                <Table.Cell>
                  <Code variant="ghost" size="1">
                    {inv.id}
                  </Code>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" color="gray">
                    {inv.date}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" weight="bold">
                    {inv.amount}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="green" variant="soft">
                    {inv.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell justify="end">
                  <IconButton variant="ghost" color="gray" size="1">
                    <Download className="h-4 w-4" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </SettingsLayout>
  );
}
