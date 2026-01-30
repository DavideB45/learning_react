import { Button, Card } from "@mantine/core";

import ImageShower from "../components/ImageShower";
import BoardStatus from "../components/BoardStatus";
import APlot from '../components/APlot';
import AnotherPlot from '../components/AnotherPlot';
import ViewButtons from '../components/ViewButtons';
import CloseButton from "../components/CloseButton";

const all_modules = [ 'camera', 'cameraButtons', 'boardStatus', 'analytics', 'temperaturePlot' ]

const defaultLayout = [
    { x: 0, y: 0, w: 6, h: 4, i: 'camera', static: false, isResizable: true },
    { x: 0, y: 4, w: 6, h: 1, i: 'cameraButtons', static: false },
    { x: 0, y: 6, w: 6, h: 1, i: 'boardStatus', static: false },
    { x: 6, y: 0, w: 6, h: 3, i: 'analytics', static: false },
    { x: 6, y: 4, w: 6, h: 3, i: 'temperaturePlot', static: false },
];

const currentLayout = [
	{ x: 0, y: 0, w: 6, h: 4, i: 'camera', static: false, isResizable: true },
	{ x: 0, y: 4, w: 6, h: 1, i: 'cameraButtons', static: false },
]

export { all_modules, defaultLayout, currentLayout, getNamedModule, getAddModule}

function getNamedModule({name, ros, paramClient, setViewSrv, onClose}) {
	switch(name) {
		case 'camera':
			return (
				<ImageShower paramClient={paramClient} ros={ros} name={'Camera Stream'} onClick={onClose}/>
			);
		case 'cameraButtons':
			return (
				<Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
				<Card.Section withBorder inheritPadding py="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h3 style={{ margin: 0 }}>Camera View</h3>
					<CloseButton onClick={onClose} />
				</Card.Section>
				<Card.Section inheritPadding py="md">
					<ViewButtons setViewSrv={setViewSrv} />
				</Card.Section>
				</Card>
			);
		case 'boardStatus':
			return (
				<BoardStatus ros={ros} paramClient={paramClient} name={'Task Status'} onClick={onClose} />
			)
		case 'analytics':
			return (
				<APlot ros={ros} paramClient={paramClient} name={'Analytics'} onClick={onClose}/>
			)
		case 'temperaturePlot':
			return (
				<AnotherPlot ros={ros} paramClient={paramClient} name={'Temperature Plot'} onClick={onClose}/>
			)
		default:
			return (
				<div>unknown {name} element</div>
			)
		}
}

function getAddModule(name, onClick){
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Card.Section withBorder inheritPadding py="md">
				<h3 style={{ margin: 0 }}>{name}</h3>
			</Card.Section>
			<Card.Section inheritPadding py="md">
				<Button onClick={onClick} fullWidth>ADD</Button>
			</Card.Section>
		</Card>
	)
}
