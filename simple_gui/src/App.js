import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import { AppShell, Container, Card, Grid, Button, Group, Stack} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

// Components import
import ImageShower from "./components/ImageShower";
import TaskCompleted from "./components/TaskCompleted";
import Game from "./components/TrisBoard";
import RobotSetup from "./components/RobotSetup";
import TaskSelector from './components/TaskSelector';
import APlot from './components/APlot';
import AnotherPlot from './components/AnotherPlot';
import ThemeToggle from './components/ThemeToggle';

// Functions import
import { useRos } from "./hooks/useRos";

function ViewButton({ lable, onClick }) {
  return (
    <Button onClick={onClick} variant="light" size="sm">{lable}</Button>
  );
}

function ManyViews({ imageUrl, taskStat, setViewSrv, ros }) {

  function sendNumber(num) {
    setViewSrv.callService({ data: num }, (result) => { })
    toast.info("Changing to camera " + ["Front", "Above", "Side"][num])
  }

  return (
    <Container size="xl" py="xl">
      <ToastContainer />
      <Grid gutter="lg">
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            {/* Camera Stream Card */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="md">
                <Group justify="space-between" align="center">
                  <h2 style={{ margin: 0 }}>Camera Stream</h2>
                </Group>
              </Card.Section>
              <Card.Section inheritPadding py="md" style={{ display: 'flex', justifyContent: 'center' }}>
                <ImageShower imageSrc={imageUrl} />
              </Card.Section>
            </Card>

            {/* Camera Selection Buttons */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="md">
                <h3 style={{ margin: 0 }}>Camera View</h3>
              </Card.Section>
              <Card.Section inheritPadding py="md">
                <Group grow>
                  <ViewButton onClick={() => sendNumber(0)} lable={"Front"} />
                  <ViewButton onClick={() => sendNumber(1)} lable={"Above"} />
                  <ViewButton onClick={() => sendNumber(2)} lable={"Side"} />
                </Group>
              </Card.Section>
            </Card>

            {/* Task Status Card */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="md">
                <h3 style={{ margin: 0 }}>Task Status</h3>
              </Card.Section>
              <Card.Section inheritPadding py="md">
                <TaskCompleted state={taskStat} />
              </Card.Section>
            </Card>

          </Stack>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
            <Card.Section withBorder inheritPadding py="md">
              <h3 style={{ margin: 0 }}>Analytics</h3>
            </Card.Section>
            <Card.Section inheritPadding py="md">
              <APlot />
              <AnotherPlot ros={ ros }/>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on the picker page
  if (location.pathname === "/") {
    return null;
  }

  const links = [
    { label: 'Select', path: '/', color: 'violet' },
    { label: 'Robot', path: '/executing', color: 'cyan' },
    { label: 'Tris', path: '/game', color: 'cyan' },
    { label: 'Tasks', path: '/list', color: 'cyan' }
  ];

  return (
    <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Group gap="md">
        {links.map((link) => (
          <Button
            key={link.path}
            variant={location.pathname === link.path ? 'filled' : 'light'}
            color={link.color}
            onClick={() => navigate(link.path)}
            size="md"
          >
            {link.label}
          </Button>
        ))}
      </Group>
    </Container>
  );
}


export default function All() {

  const { ros, connected, imageUrl, setViewSrv, taskStat } = useRos()

  return (
    <BrowserRouter>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 0,
          breakpoint: 'sm',
          collapsed: { mobile: true },
        }}
      >
        <AppShell.Header withBorder>
          <Container size="xl" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Group gap='lg'>
              <Navigation />
              <ThemeToggle />
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route path="/" element={<RobotSetup />} />
            <Route
              path="/executing"
              element={
                <ManyViews
                  imageUrl={imageUrl}
                  taskStat={taskStat}
                  setViewSrv={setViewSrv}
                  ros={ros}
                />
              }
            />
            <Route path="/game" element={<Game />} />
            <Route path="/list" element={<TaskSelector ros={ros} />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  )
}