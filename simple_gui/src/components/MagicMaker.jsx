//import "react-toastify/dist/ReactToastify.css";
//import "./toast.css";
import { AppShell, Container, Card, Grid, Button, Group, Stack} from '@mantine/core';

// Components import
import ImageShower from "./ImageShower";
import TaskCompleted from "./TaskCompleted";
import APlot from './APlot';
import AnotherPlot from './AnotherPlot';
import ViewButtons from './ViewButtons';
import TitleTile from './TitleTile';


function MakeCard({ cardElements, paramClient, taskStat, setViewSrv, ros }){
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<TitleTile text={cardElements.title} />
			<Card.Section inheritPadding py="md" style={{ display: 'flex', justifyContent: 'center' }}>
			<ImageShower paramClient={paramClient} ros={ros} />
			</Card.Section>
		</Card>
	)
}

export default function MagicMaker({ componentsList, paramClient, taskStat, setViewSrv, ros }) {

  return (
	<Grid.Col span={{ base: 12, md: 6 }}>
		<Stack gap="lg">

		<MakeCard cardElements={componentsList[0]}
		paramClient={paramClient}
		taskStat={taskStat}
		setViewSrv={setViewSrv}
		ros={ros}/>

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
			<TaskCompleted state={taskStat} />
			</Card.Section>
		</Card>

		</Stack>
	</Grid.Col>
  );
}