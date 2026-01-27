import React from 'react';
import { Card } from '@mantine/core';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GridLayout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import ImageShower from "./ImageShower";
import BoardStatus from "./BoardStatus";
import APlot from './APlot';
import AnotherPlot from './AnotherPlot';
import ViewButtons from './ViewButtons';

function MainView({ paramClient, setViewSrv, ros }) {
  const [layout, setLayout] = React.useState([
    { x: 0, y: 0, w: 6, h: 4, i: 'camera', static: false },
    { x: 0, y: 4, w: 6, h: 2, i: 'cameraButtons', static: false },
    { x: 0, y: 6, w: 6, h: 3, i: 'boardStatus', static: false },
    { x: 6, y: 0, w: 6, h: 4, i: 'analytics', static: false },
    { x: 6, y: 4, w: 6, h: 4, i: 'temperaturePlot', static: false },
  ]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <div style={{ padding: '16px' }}>
      <ToastContainer />
      <GridLayout
        className="layout"
        layout={layout}
        onLayoutChange={handleLayoutChange}
        cols={12}
        rowHeight={10}
        width={1200}
        isDraggable={true}
        isResizable={false}
        compactType="vertical"
        preventCollision={false}
        containerPadding={[0, 0]}
        margin={[16, 16]}
      >
        {/* Camera */}
        <div key="camera">
        <ImageShower paramClient={paramClient} ros={ros} name={'Camera Stream'} />
        </div>

        {/* Camera Selection Buttons */}
        <div key="cameraButtons">
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
            <Card.Section withBorder inheritPadding py="md">
              <h3 style={{ margin: 0 }}>Camera View</h3>
            </Card.Section>
            <Card.Section inheritPadding py="md">
              <ViewButtons setViewSrv={setViewSrv} />
            </Card.Section>
          </Card>
        </div>

        {/* Task Status Card */}
        <div key="boardStatus">
        <BoardStatus ros={ros} paramClient={paramClient} name={'Task Status'} />
        </div>

        {/* Analytics Plot */}
        <div key="analytics">
        <APlot ros={ros} paramClient={paramClient} name={'Analytics'} />
        </div>

        {/* Temperature Plot */}
        <div key="temperaturePlot">
        <AnotherPlot ros={ros} paramClient={paramClient} name={'Temperature Plot'} />
        </div>
      </GridLayout>
    </div>
  );
}

export default MainView;