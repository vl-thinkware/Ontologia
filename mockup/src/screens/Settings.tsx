import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Switch,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { Globe2, Trash2 } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { workspaces, activeWorkspaceId } from "../data/mock";

export default function Settings() {
  const ws = workspaces.find((w) => w.id === activeWorkspaceId)!;
  return (
    <SettingsLayout
      title="Workspace"
      description="General settings for the Thinkware workspace."
      actions={<Button>Save changes</Button>}
    >
      <Card size="3">
        <Heading size="3" weight="bold">
          General
        </Heading>
        <Text as="p" size="1" color="gray" mt="1">
          Shown to members across Ontologia, the API and exports.
        </Text>

        <Box mt="5" className="grid grid-cols-2 gap-5">
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              mb="1"
              className="block"
            >
              Workspace name
            </Text>
            <TextField.Root defaultValue={ws.name} size="2" />
          </Box>
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              mb="1"
              className="block"
            >
              Slug
            </Text>
            <TextField.Root defaultValue="thinkware" size="2">
              <TextField.Slot>
                <Text size="1" color="gray">
                  ontologia.app/
                </Text>
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Box className="col-span-2">
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              mb="1"
              className="block"
            >
              Description
            </Text>
            <TextArea
              size="2"
              defaultValue="Internal workspace for Ontologia product development. Houses the Cars reference ontology."
              style={{ minHeight: 64 }}
            />
          </Box>
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              mb="1"
              className="block"
            >
              Default locale
            </Text>
            <Select.Root defaultValue="en-US" size="2">
              <Select.Trigger className="w-full">
                <Flex align="center" gap="2">
                  <Globe2 className="h-4 w-4" />
                  <Select.Trigger />
                </Flex>
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="en-US">English — US</Select.Item>
                <Select.Item value="en-GB">English — GB</Select.Item>
                <Select.Item value="fr">Français</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box>
            <Text
              as="label"
              size="1"
              weight="bold"
              color="gray"
              mb="1"
              className="block"
            >
              Time zone
            </Text>
            <Select.Root defaultValue="paris" size="2">
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="paris">
                  Europe/Paris (UTC+02:00)
                </Select.Item>
                <Select.Item value="utc">UTC</Select.Item>
                <Select.Item value="ny">America/New_York</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Box>
      </Card>

      <Card size="3">
        <Heading size="3" weight="bold">
          Defaults
        </Heading>
        <Text as="p" size="1" color="gray" mt="1">
          Applied to new ontologies created in this workspace.
        </Text>
        <Flex direction="column" gap="3" mt="4">
          <ToggleRow
            title="Require message on every change"
            description="Ask editors to describe the change when they save."
            defaultChecked
          />
          <ToggleRow
            title="Enable revert protection"
            description="Admins must approve reverts of tagged change events."
            defaultChecked
          />
          <ToggleRow
            title="Auto-tag weekly snapshots"
            description="Create a dated tag every Monday at 09:00 UTC."
          />
        </Flex>
      </Card>

      <Card
        size="3"
        style={{
          background: "var(--red-2)",
          border: "1px solid var(--red-a5)",
        }}
      >
        <Heading size="3" weight="bold" style={{ color: "var(--red-11)" }}>
          Danger zone
        </Heading>
        <Text as="p" size="1" mt="1" style={{ color: "var(--red-11)" }}>
          Irreversible actions. Please be careful.
        </Text>
        <Flex
          align="center"
          justify="between"
          mt="4"
          p="4"
          style={{
            background: "var(--color-panel-solid)",
            border: "1px solid var(--red-a5)",
            borderRadius: "var(--radius-3)",
          }}
        >
          <Box>
            <Text size="2" weight="bold">
              Delete workspace
            </Text>
            <Text as="p" size="1" color="gray">
              Removes every ontology, change event and tag. There is no undo.
            </Text>
          </Box>
          <Button color="red" variant="surface">
            <Trash2 className="h-3.5 w-3.5" />
            Delete workspace
          </Button>
        </Flex>
      </Card>
    </SettingsLayout>
  );
}

function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <Flex
      asChild
      align="start"
      justify="between"
      gap="4"
      p="3"
      style={{
        background: "var(--color-panel-solid)",
        border: "1px solid var(--gray-a4)",
        borderRadius: "var(--radius-3)",
        cursor: "pointer",
      }}
    >
      <label>
        <Box>
          <Text size="2" weight="bold">
            {title}
          </Text>
          <Text as="p" size="1" color="gray">
            {description}
          </Text>
        </Box>
        <Switch defaultChecked={defaultChecked} mt="1" />
      </label>
    </Flex>
  );
}
