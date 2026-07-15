import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, Paper, Text, Center, Group, Badge } from '@mantine/core';
import TitleTile from './TitleTile';
import CloseButton from "./CloseButton";

const STATE_STYLES = {
	normal:   { accent: '#378ADD', value: 'var(--mantine-color-blue-8)' },
	warning:  { accent: '#BA7517', value: 'var(--mantine-color-orange-8)' },
	critical: { accent: '#E24B4A', value: 'var(--mantine-color-red-7)' },
};

export default function TitledCounter( { name, field, onClick, telemetryUpdaters, state = 'normal', unit='clicks' } ) {
	const [lastValue, setLatValue] = useState(0);
	const { accent, value: valueColor } = STATE_STYLES[ name.startsWith('Red') ? 'critical': state];
	useEffect(() => {

		const updateCounter = (json_data) => {
			if( json_data['ws_data_type'] != 'taskboard_status') return;
			for(var i = 0; i < json_data['sensors'].length; i++){
				if(json_data['sensors'][i].id === field){
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
    <Card shadow="sm" padding={0} radius="md" withBorder style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden', }} >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px 12px', minWidth: 0, borderLeft: `4px solid ${accent}` }}>
        {/* header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text size="s" fw={700} tt="capitalize" style={{ letterSpacing: '0.06em' }} truncate >
            {name}
          </Text>
          <CloseButton size="xs" onClick={onClick} />
        </div>

        {/* value */}
        <Center flex={1}>
          <Group align="flex-end" gap={4}>
            <Text style={{ fontSize: 'clamp(1.4rem, 4cqw, 2.4rem)', fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: valueColor, }} >
              {lastValue}
            </Text>
            {unit && ( <Text size="sm" c="dimmed" pb={3}> {unit} </Text> )}
          </Group>
        </Center>
      </div>
    </Card>
  );
	

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