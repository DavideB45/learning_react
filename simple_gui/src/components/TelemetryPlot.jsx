import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Card } from '@mantine/core';
import TitleTile from './TitleTile';

export default function TelemetryPlot( { name, data_type, field, onClick } ) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const updateCallbackRef = useRef(null);

	useEffect(() => {

		chartRef.current = new Chart(canvasRef.current, {
		type: "line",
		data: {
			labels: [],
			datasets: [{
				label: "",
				data: [],
				borderWidth: 1,
			},],
		},
		options: {
			animation: false,
			scales: { y: {beginAtZero: true,},},
			},
		});

		const updateChart = (json_data) => {
			if (!chartRef.current) return;
			if( json_data[data_type] != data_type) return;
			let len = chartRef.current.data.datasets[0].data.length;
			let lastidx = chartRef.current.data.labels[len -1];
			chartRef.current.data.datasets[0].data.push(json_data[field]);
			chartRef.current.data.labels.push(lastidx + 1);
			if (len + 1 > 50){
				chartRef.current.data.datasets[0].data.splice(0, 1);
				chartRef.current.data.labels.splice(0, 1);
			}
			chartRef.current.update('none');
		}

		updateCallbackRef.current = updateChart;

		return () => {
			chartRef.current.destroy();
		}
	}, []);

	useEffect(() => {
		updateCallbackRef.current = updateCallbackRef.current || (() => {});
  	}, []);

  return (
	<Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
	<TitleTile text={name} onClick={onClick}/>
	<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 0, width: '100%' }}>
		<canvas ref={canvasRef} />
	</div>
	</Card>
  );
}

export function getTelemetryUpdater(ref) {
  return ref?.current?.updateCallbackRef?.current;
}