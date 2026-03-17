import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Card } from '@mantine/core';
import TitleTile from './TitleTile';

export default function TelemetryPlot( { name, data_type, field, onClick, telemetryUpdaters} ) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

	useEffect(() => {
		const ctx = canvasRef.current?.getContext('2d');
		let gradient;
		if (ctx) {
			gradient = ctx.createLinearGradient(0, 0, 0, 200);
			gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
			gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
		}

		chartRef.current = new Chart(canvasRef.current, {
			type: "line",
			data: {
				datasets: [{
					label: "",
					data: [],
					borderWidth: 2,
					borderColor: '#3b82f6',
					backgroundColor: gradient,
					fill: true,
					tension: 0.4,
					pointBackgroundColor: '#3b82f6',
					pointBorderColor: '#fff',
					pointRadius: 4,
					pointHoverRadius: 6,
					pointBorderWidth: 2,
				},],
			},
			options: {
				animation: false,
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					legend: {
						display: false,  // Hide the blue square legend
					},
					tooltip: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						padding: 12,
						titleColor: '#fff',
						bodyColor: '#fff',
						borderColor: '#3b82f6',
						borderWidth: 1,
					},
				},
			},
			scales: {
			y: {
				beginAtZero: true,
				grid: {
				color: 'rgba(0, 0, 0, 0.05)',
				},
			},
			x: {
				display: false,  // Hide the x-axis labels (timestamps)
				grid: {
				display: false,
				},
			},
			},
		});

		const updateChart = (json_data) => {
			if (!chartRef.current) return;
			if( json_data['ws_data_type'] != data_type) return;
			let len = chartRef.current.data.datasets[0].data.length;
			let lastidx = chartRef.current.data.labels[len -1];
			if(len == 0){
				lastidx = 0
			}
			chartRef.current.data.datasets[0].data.push(json_data[field]);
			chartRef.current.data.labels.push(lastidx + 1);
			if (len + 1 > 50){
				chartRef.current.data.datasets[0].data.splice(0, 1);
				chartRef.current.data.labels.splice(0, 1);
			}
			chartRef.current.update();
		}

		telemetryUpdaters[data_type + field] = updateChart

		return () => {
			chartRef.current.destroy();
			delete telemetryUpdaters[data_type+field]
		}
	}, [telemetryUpdaters]);

  return (
	<Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
	<TitleTile text={name} onClick={onClick}/>
	<div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: 0, width: '100%' }}>
		<canvas ref={canvasRef} />
	</div>
	</Card>
  );
}