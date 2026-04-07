import { Button, Card, Modal, Select } from "@mantine/core";
import { useState } from 'react';
import ImageShower from "../components/ImageShower";
import BoardStatus from "../components/BoardStatus";
import APlot from '../components/APlot';
import AnotherPlot from '../components/AnotherPlot';
import ViewButtons from '../components/ViewButtons';
import Timer from "../components/Timer";
import CloseButton from "../components/CloseButton";
import TelemetryPlot from "../components/TelemetryPlot";
import { ChatToBaby } from "./chat";

const validSensors = ['FADER', 'DOOR_ANGLE', 'PROBE_GOAL_ANALOG', 'TEMPERATURE', 'FADER_BLUE_BUTTON']
//const telemetryModules = validSensors.map((sensor) => {return 'telemetry+' + sensor})
const all_modules = [ 'camera', 'cameraButtons', 'boardStatus', 'analytics', 'temperaturePlot', 'timer', 'telemetry', 'chat']


const defaultLayout = [
    { x: 0, y: 0, w: 6, h: 4, i: 'camera', static: false, isResizable: true },
    { x: 0, y: 4, w: 6, h: 1, i: 'cameraButtons', static: false },
    { x: 0, y: 6, w: 6, h: 2, i: 'boardStatus', static: false, minH:2 },
    { x: 6, y: 0, w: 3, h: 3, i: 'analytics', static: false },
    { x: 6, y: 4, w: 6, h: 3, i: 'temperaturePlot', static: false },
	{ x: 9, y: 0, w: 3, h: 2, i: 'timer', static: false, minW: 3, maxH:3, minH:2 },
];

export { all_modules, defaultLayout, getNamedModule}

function getNamedModule({name, ros, paramClient, setViewSrv, onClose, toggleIsRunning, telemetryUpdaters}) {
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
		case 'timer':
			return (
				<Timer ros={ros} paramClient={paramClient} name={'Execution Time'} onClick={onClose} toggleIsRunning={toggleIsRunning} />
			)
		case 'chat':
			return (
				<ChatToBaby name={'FrankChat'} onClick={onClose} ros={ros}/>
			)
		default:
			if(name.includes('telemetry')){
				var sensor = name.split('+')[1]
				var min = 0
				var max = 1
				if(name.includes('TEMPERATURE')){
					max = 70
					min = 20
				}
				return (
					<TelemetryPlot 
						name={sensor.charAt(0) + sensor.substring(1).toLowerCase().replace(/_/g, ' ')} 
						onClick={onClose} 
						telemetryUpdaters={telemetryUpdaters} 
						field={sensor}
						min_show={min}
						max_show={max}
					/>
				)
			} else {
				return (
					<div>unknown {name} element</div>
				)
			}
		}
}


export function AddModule({name, addElement, layout}){

	const [opened, setOpened] = useState(false);
	const [selectedSensor, setSelectedSensor] = useState(null);

	const usedSensors = layout
		.filter(item => item.i.startsWith('telemetry+'))
		.map(item => item.i.replace('telemetry+', ''));
	const availableSensors = validSensors.filter(sensor => !usedSensors.includes(sensor));

	const handleAddClick = () => {
		if (name === "telemetry") {
			setOpened(true);
		} else {
			addElement(name);
		}
	};

	const handleConfirm = () => {
		if (selectedSensor) {
			addElement(`telemetry+${selectedSensor}`);
			setSelectedSensor(null);
			setOpened(false);
		}
	};

	return (
		<>
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Card.Section withBorder inheritPadding py="md">
			<h3 style={{ margin: 0 }}>{name}</h3>
			</Card.Section>
			<Card.Section inheritPadding py="md">
			<Button 
				onClick={handleAddClick} 
				fullWidth
				disabled={name === "telemetry" && availableSensors.length === 0}
			> 
				ADD
			</Button>
			</Card.Section>
		</Card>

		<Modal opened={opened} onClose={() => setOpened(false)} title="Select Sensor" centered>
			<Select label="Sensor Type" placeholder="Choose a sensor" 
				data={availableSensors} value={selectedSensor}
				onChange={setSelectedSensor} searchable clearable
			/>
			<Button onClick={handleConfirm} fullWidth mt="md" disabled={!selectedSensor} >
				Confirm
			</Button>
		</Modal>
		</>

	)
}
