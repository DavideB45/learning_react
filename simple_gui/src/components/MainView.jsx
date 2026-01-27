import { Container, Card, Grid, Stack} from '@mantine/core';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImageShower from "./ImageShower";
import BoardStatus from "./BoardStatus";
import APlot from './APlot';
import AnotherPlot from './AnotherPlot';
import ViewButtons from './ViewButtons';

function MainView({ paramClient, setViewSrv, ros }) {

  return (
    <Container size="xl" py="xl">
      <ToastContainer />
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">

          {/* Camera */}
          <ImageShower paramClient={paramClient} ros={ros} name={'Camera Stream'} />

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
          <BoardStatus ros={ros} paramClient={paramClient} name={'Task Status'} />

          </Stack>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg">

            <APlot ros={ros} paramClient={paramClient} name={'Analytics'} />
          
            <AnotherPlot ros={ros} paramClient={paramClient} name={'Temperature Plot'} />
          
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default MainView;