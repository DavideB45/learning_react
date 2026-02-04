import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import { AppShell, Container, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"

// Components import
import Game from "./components/TrisBoard";
import RobotSetup from "./components/RobotSetup";
import TaskSelector from './components/TaskSelector';
import ThemeToggle from './components/ThemeToggle';
import MainView from './components/MainView';

// Functions import
import { useRos } from "./hooks/useRos";


function Navigation( {isRunning} ) {
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
   // { label: 'Tris', path: '/game', color: 'cyan' },
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
            disabled={isRunning}
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
  const [isRunning, setIsRunning] = useState(false)

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
              <Navigation isRunning={isRunning}/>
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
                <MainView
                  paramClient={paramClient}
                  setViewSrv={setViewSrv}
                  ros={ros}
                  toggleRunning={ () => setIsRunning(!isRunning)}
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