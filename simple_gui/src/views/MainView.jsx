import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button } from '@mantine/core';

import { defaultLayout, currentLayout, getNamedModule, all_modules, getAddModule } from '../modularInterface/modules';
import { useTaskBoard } from '../hooks/useTaskBoard';

const telemetryRegister = {}

function MainView({ paramClient, setViewSrv, ros, toggleRunning, boardIP }) {
  // Reshape the layout 
  const [layout, setLayout] = React.useState(currentLayout);
  let additionalModules = all_modules.filter(name => !layout.some(item => item.i === name))
  // Reshape the window
  const [width, setWidth] = React.useState(window.innerWidth - 64);
  // show/hide the menu
  const [opened, { open, close }] = useDisclosure(false);
  // an array of function to call when there is an update from the taskboard

  function addElement(name){
    const defaultElement = defaultLayout.find(item => item.i === name);
    const newElement = defaultElement ? { ...defaultElement, static: false } : { x: 0, y: 0, w:3, h: 2, i: name, static: false, isResizable: true };
    setLayout([...layout, newElement])
  }

  function updateTelemetry(json_data){
    for(var key in telemetryRegister){
      telemetryRegister[key](json_data)
    }
  }

  useTaskBoard(boardIP, updateTelemetry)

  function removeElement(name) {
    setLayout(layout.filter(item => item.i !== name));
  }

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - 64);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <div style={{ padding: '16px', width: '100vw', height: '100vh' }}>
      <ToastContainer />
      <Drawer offset={8} radius="md" opened={opened} onClose={close} title="Additional Elements">
        {
          additionalModules.map((name) => (
            <div key={name} style={{ marginBottom: '12px' }}>
              {getAddModule(name, () => addElement(name))}
            </div>
          ))
        }
      </Drawer>
      <Button variant="default" onClick={open}>
        Open Drawer
      </Button>
      <GridLayout
        className="layout"
        layout={layout}
        onLayoutChange={handleLayoutChange}
        cols={12}
        rowHeight={30}
        width={width}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        preventCollision={false}
        containerPadding={[0, 0]}
        margin={[0, 16]}
      >
        {layout.map((moduleName) => (
          <div key={moduleName['i']}>
            {
              getNamedModule({
                name: moduleName['i'],
                ros: ros,
                paramClient: paramClient,
                setViewSrv: setViewSrv,
                toggleIsRunning: toggleRunning,
                onClose: () => removeElement(moduleName['i']),
                telemetryUpdaters: telemetryRegister
              })
            }
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

export default MainView;