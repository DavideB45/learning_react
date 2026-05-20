import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, Paper, Text, Center } from '@mantine/core';
import TitleTile from './TitleTile';


export default function TitledCounter( { name, field, onClick, telemetryUpdaters } ) {
	const [lastValue, setLatValue] = useState(0);

	useEffect(() => {

		const updateCounter = (json_data) => {
			if( json_data['ws_data_type'] != 'taskboard_status') return;
			for(var i = 0; i < json_data['sensors'].length; i++){
				if(json_data['sensors'][i].id === field){
					if(json_data['sensors'][i].value > lastValue)
						toast.success("Task press button completed", { icon: "✅", toastId: i });
					setLatValue(json_data['sensors'][i].value)
				}
			}
		}

		telemetryUpdaters[field] = updateCounter

		return () => {
			delete telemetryUpdaters[field]
		}

	}, [telemetryUpdaters, lastValue]);

	return (
	<Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
		<TitleTile text={name} onClick={onClick} />
		<Center flex={1} mt="6px">
		<Paper radius="md" px="md" py="md" bg="blue.2" withBorder={false} shadow="none" >
			<Text size="2rem" fw={600} c="dark.8" ta="center" >
			{lastValue}
			</Text>
		</Paper>
		</Center>
	</Card>
	);
}