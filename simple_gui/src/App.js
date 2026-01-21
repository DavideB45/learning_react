import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
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
import ViewButtons from './components/ViewButtons';
import TitleTile from './components/TitleTile';

// Functions import
import { useRos } from "./hooks/useRos";

function ManyViews({ paramClient, setViewSrv, ros }) {

  // load configuration from a json/xml

  return (
    <Container size="xl" py="xl">
      <ToastContainer />
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">

          {/* Camera */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <TitleTile text={'Camera Stream'} />
            <Card.Section inheritPadding py="md" style={{ display: 'flex', justifyContent: 'center' }}>
            <ImageShower paramClient={paramClient} ros={ros} />
            </Card.Section>
          </Card>

          {/* Camera Selection Buttons */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="md">
            <h3 style={{ margin: 0 }}>Camera View</h3>
            </Card.Section>
            <Card.Section inheritPadding py="md">
            <ViewButtons setViewSrv={setViewSrv} />
            </Card.Section>
          </Card>

          {/* Task Status Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="md">
            <h3 style={{ margin: 0 }}>Task Status</h3>
            </Card.Section>
            <Card.Section inheritPadding py="md">
            <TaskCompleted ros={ros} paramClient={paramClient} />
            </Card.Section>
          </Card>

          </Stack>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
              <TitleTile text={'Analytics'} />
              <Card.Section inheritPadding py="md">
                <APlot />
                <TitleTile text={'LINO BANFI'} />
                <AnotherPlot ros={ ros }/>
              </Card.Section>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on the picker page
  if (location.pathname === "/" || location.pathname === "/list") {
    return null;
  }

  const links = [
    { label: 'Select', path: '/', color: 'violet' },
    { label: 'Tasks', path: '/list', color: 'violet' },
    { label: 'Robot', path: '/executing', color: 'cyan' },
    { label: 'Tris', path: '/game', color: 'cyan' },
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

  const { ros, connected, paramClient, setViewSrv, taskStat } = useRos()

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
                  paramClient={paramClient}
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