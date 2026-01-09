import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Stack, Select, Button, Title, Loader, Group, Alert} from "@mantine/core";

const API_URL = "http://localhost:3001/api/config";

function RobotSetup() {
  const [robotType, setRobotType] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved configuration on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(API_URL);
        const config = await response.json();
        setRobotType(config.robotType || "");
        setAlgorithm(config.algorithm || "");
      } catch (error) {
        console.log("Could not load configuration:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Save configuration whenever it changes
  useEffect(() => {
    async function saveConfig() {
      if (!isLoading && (robotType || algorithm)) {
        try {
          await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ robotType, algorithm })
          });
        } catch (error) {
          console.error("Failed to save configuration:", error);
        }
      }
    }
    saveConfig();
  }, [robotType, algorithm, isLoading]);

  const canExecute = robotType && algorithm;

  if (isLoading) {
    return (
      <Container size="md" py="xl">
        <Group justify="center" py="xl">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="md">
          <Title order={1} size="h2">
            Robot Setup
          </Title>
        </Card.Section>

        <Card.Section inheritPadding py="xl">
          <Stack gap="lg">
            {/* Robot type selection */}
            <Select
              label="Robot Type"
              placeholder="Select a robot"
              searchable
              clearable
              value={robotType}
              onChange={(value) => setRobotType(value || "")}
              data={[
                { value: "ur5", label: "UR5" },
                { value: "franka", label: "Franka" },
              ]}
              size="md"
            />

            {/* Algorithm selection */}
            <Select
              label="Algorithm"
              placeholder="Select an algorithm"
              searchable
              clearable
              value={algorithm}
              onChange={(value) => setAlgorithm(value || "")}
              data={[
                { value: "pick_place", label: "Pick & Place" },
                { value: "navigation", label: "Navigation" },
                { value: "inspection", label: "Inspection" },
              ]}
              size="md"
            />

            {/* Info alert */}
            {robotType && algorithm && (
              <Alert
                title="Configuration Ready"
                color="green"
                icon={null}
              >
                Robot: <strong>{robotType.toUpperCase()}</strong> | Algorithm: <strong>{algorithm.replace(/_/g, " ")}</strong>
              </Alert>
            )}

            {/* Execute button */}
            <Group justify="flex-start" pt="lg">
              <Link to="/executing" style={{ textDecoration: "none" }}>
                <Button
                  disabled={!canExecute}
                  variant="gradient"
                  gradient={{ from: 'green', to: 'teal', deg: 90 }}
                  size="lg"
                  radius="md"
                  fw={600}
                >
                  Execute
                </Button>
              </Link>
            </Group>
          </Stack>
        </Card.Section>
      </Card>
    </Container>
  );
}

export default RobotSetup;
