import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Select,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import { UserPlus, MoreHorizontal, Mail } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { members } from "../data/mock";

export default function Members() {
  return (
    <SettingsLayout
      title="Members"
      description="Unlimited seats on the Team plan. Invite anyone on your team."
      actions={
        <Button>
          <UserPlus className="h-3.5 w-3.5" />
          Invite people
        </Button>
      }
    >
      <Card size="3">
        <Flex align="center" gap="2">
          <Flex
            align="center"
            justify="center"
            className="h-9 w-9 rounded-[var(--radius-3)]"
            style={{
              background: "var(--accent-3)",
              color: "var(--accent-11)",
            }}
          >
            <Mail className="h-4 w-4" />
          </Flex>
          <Box>
            <Text size="2" weight="bold">
              Invite by email
            </Text>
            <Text as="p" size="1" color="gray">
              New teammates receive an email to join <strong>Thinkware</strong>.
            </Text>
          </Box>
        </Flex>
        <Flex align="center" gap="2" mt="4">
          <Box className="flex-1">
            <TextField.Root
              placeholder="name@company.com, another@company.com…"
              size="2"
            />
          </Box>
          <Box width="160px">
            <Select.Root defaultValue="editor" size="2">
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="editor">Editor</Select.Item>
                <Select.Item value="viewer">Viewer</Select.Item>
                <Select.Item value="owner">Owner</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Button>Send invites</Button>
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
              {members.length} members
            </Heading>
            <Text size="1" color="gray">
              Includes 1 pending invitation
            </Text>
          </Box>
          <Flex align="center" gap="2">
            <Box width="140px">
              <Select.Root defaultValue="all" size="1">
                <Select.Trigger className="w-full" />
                <Select.Content>
                  <Select.Item value="all">All roles</Select.Item>
                  <Select.Item value="owners">Owners</Select.Item>
                  <Select.Item value="editors">Editors</Select.Item>
                  <Select.Item value="viewers">Viewers</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            <Box width="180px">
              <TextField.Root placeholder="Search…" size="1" />
            </Box>
          </Flex>
        </Flex>
        <Table.Root size="2" variant="ghost">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Member</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last active</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Invited</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.map((m) => (
              <Table.Row key={m.email}>
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Avatar
                      size="2"
                      radius="full"
                      fallback={m.initials}
                      style={{ background: m.color, color: "white" }}
                    />
                    <Box className="min-w-0">
                      <Text size="2" weight="bold" className="block truncate">
                        {m.name}
                      </Text>
                      <Text size="1" color="gray" className="block truncate">
                        {m.email}
                      </Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    defaultValue={m.role.toLowerCase()}
                    size="1"
                  >
                    <Select.Trigger
                      variant={m.role === "Owner" ? "soft" : "surface"}
                      color={m.role === "Owner" ? "violet" : "gray"}
                    />
                    <Select.Content>
                      <Select.Item value="owner">Owner</Select.Item>
                      <Select.Item value="editor">Editor</Select.Item>
                      <Select.Item value="viewer">Viewer</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" color="gray">
                    {m.lastActive}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="1" color="gray">
                    {m.invitedAt}
                  </Text>
                </Table.Cell>
                <Table.Cell justify="end">
                  <IconButton variant="ghost" color="gray" size="1">
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell>
                <Flex align="center" gap="3">
                  <Avatar
                    size="2"
                    radius="full"
                    fallback="?"
                    color="gray"
                  />
                  <Box>
                    <Text size="2" weight="bold">
                      sofia@thinkware.fr
                    </Text>
                    <Text as="div" size="1" color="gray">
                      Invitation sent · awaiting acceptance
                    </Text>
                  </Box>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge color="amber" variant="soft">
                  Pending
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text size="1" color="gray">
                  —
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text size="1" color="gray">
                  2026-04-19
                </Text>
              </Table.Cell>
              <Table.Cell justify="end">
                <Button variant="ghost" size="1">
                  Resend
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </SettingsLayout>
  );
}
