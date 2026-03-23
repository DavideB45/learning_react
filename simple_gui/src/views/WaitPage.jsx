import { useState, useEffect } from "react";
import { Container, Card, Stack, Text, Loader, ThemeIcon, Group } from "@mantine/core";
import { IconCheck, IconX, IconClock } from "@tabler/icons-react";

function StatusItem({ label, status }) {
  let icon;
  let color;

  if (status === "loading") {
    icon = <Loader size="sm" />;
    color = "blue";
  } else if (status === "ready") {
    icon = <IconCheck size={16} />;
    color = "green";
  } else if (status === "error") {
    icon = <IconX size={16} />;
    color = "red";
  } else {
    icon = <IconClock size={16} />;
    color = "gray";
  }

  return (
    <Group>
      <ThemeIcon color={color} variant="light">
        {icon}
      </ThemeIcon>
      <Text>{label}</Text>
    </Group>
  );
}

export default function WaitPage({ rosIP, boardIP }) {
  const [rosStatus, setRosStatus] = useState("idle");
  const [boardStatus, setBoardStatus] = useState("idle");
  const [robotStatus, setRobotStatus] = useState("idle");

  useEffect(() => {
    if (!rosIP) return;
    setRosStatus("loading");

    // TODO: replace with your logic
    setTimeout(() => {
      setRosStatus("ready"); // or "error"
    }, 1000);
  }, [rosIP]);

  useEffect(() => {
    if (!boardIP) return;
    setBoardStatus("loading");

    // TODO: replace with your logic
    setTimeout(() => {
      setBoardStatus("ready");
    }, 1200);
  }, [boardIP]);

  useEffect(() => {
    setRobotStatus("loading");

    // TODO: replace with your logic
    setTimeout(() => {
      setRobotStatus("ready");
    }, 1500);
  }, []);

  return (
    <Container size="sm" mt="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack>
          <Text size="lg" fw={600}>
            System Status
          </Text>

          <StatusItem label={`ROS (${rosIP || "not set"})`} status={rosStatus} />
          <StatusItem label={`Board (${boardIP || "not set"})`} status={boardStatus} />
          <StatusItem label="Robot Connection" status={robotStatus} />
        </Stack>
      </Card>
    </Container>
  );
}