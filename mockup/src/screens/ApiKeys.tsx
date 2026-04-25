import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  Heading,
  IconButton,
  Table,
  Text,
} from "@radix-ui/themes";
import { Plus, Copy, Trash2, BookOpen } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { apiKeys } from "../data/mock";

export default function ApiKeys() {
  return (
    <SettingsLayout
      title="API keys"
      description="Server-side keys for reading and writing ontologies from your pipelines."
      actions={
        <Button>
          <Plus className="h-3.5 w-3.5" />
          Create key
        </Button>
      }
    >
      <Card size="3">
        <Flex align="start" gap="3">
          <Flex
            align="center"
            justify="center"
            className="h-9 w-9 rounded-[var(--radius-3)]"
            style={{
              background: "var(--accent-3)",
              color: "var(--accent-11)",
            }}
          >
            <BookOpen className="h-4 w-4" />
          </Flex>
          <Box className="flex-1">
            <Heading size="2" weight="bold">
              Authenticate requests
            </Heading>
            <Text as="p" size="1" color="gray" mt="1">
              Pass the key in the <Code>Authorization</Code> header. Keys are
              scoped per workspace and never expire unless revoked.
            </Text>
            <Box
              mt="3"
              p="3"
              style={{
                background: "var(--gray-12)",
                color: "var(--gray-1)",
                borderRadius: "var(--radius-3)",
                fontFamily: "var(--code-font-family)",
                fontSize: 11.5,
                lineHeight: 1.5,
                overflowX: "auto",
              }}
            >
              <pre style={{ margin: 0 }}>
{`curl https://api.ontologia.app/v1/ontologies \\
  -H "Authorization: Bearer ont_live_8f2a…"`}
              </pre>
            </Box>
          </Box>
        </Flex>
      </Card>

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
              Active keys ({apiKeys.length})
            </Heading>
            <Text size="1" color="gray">
              Rotate keys at least every 90 days.
            </Text>
          </Box>
        </Flex>
        <Table.Root size="2" variant="ghost">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Key</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Scopes</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last used</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {apiKeys.map((k) => (
              <Table.Row key={k.id}>
                <Table.Cell>
                  <Text size="2" weight="bold">
                    {k.name}
                  </Text>
                  <Text as="div" size="1" color="gray">
                    by {k.createdBy}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Code variant="soft" size="1">
                      {k.prefix}••••••••
                    </Code>
                    <IconButton
                      variant="ghost"
                      color="gray"
                      size="1"
                      title="Copy prefix"
                    >
                      <Copy className="h-3 w-3" />
                    </IconButton>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex wrap="wrap" gap="1">
                    {k.scopes.map((s) => (
                      <Badge
                        key={s}
                        color="gray"
                        variant="soft"
                        size="1"
                        style={{ fontFamily: "var(--code-font-family)" }}
                      >
                        {s}
                      </Badge>
                    ))}
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" color="gray">
                    {k.lastUsed}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" color="gray">
                    {k.createdAt}
                  </Text>
                </Table.Cell>
                <Table.Cell justify="end">
                  <IconButton variant="ghost" color="red" size="1">
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Card size="3">
        <Heading size="2" weight="bold">
          Webhooks
        </Heading>
        <Text as="p" size="1" color="gray" mt="1">
          Push change events to your own infrastructure.
        </Text>
        <Box
          mt="4"
          p="6"
          style={{
            border: "1px dashed var(--gray-a6)",
            background: "var(--gray-2)",
            borderRadius: "var(--radius-3)",
            textAlign: "center",
          }}
        >
          <Text size="2" color="gray">
            No webhooks configured yet.{" "}
            <a
              href="#"
              style={{ color: "var(--accent-11)", fontWeight: 600 }}
            >
              Add your first endpoint →
            </a>
          </Text>
        </Box>
      </Card>
    </SettingsLayout>
  );
}
