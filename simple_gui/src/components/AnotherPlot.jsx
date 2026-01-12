// https://blog.logrocket.com/using-chart-js-react/
// https://github.com/ludusrusso/rosgraph_web_visualizer

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

function AnotherPlot() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
	chartRef.current = new Chart(canvasRef.current, {
	  type: "line",
	  data: {
		labels: [1, 2, 3, 4, 5, 6],
		datasets: [
		  {
			label: "Temperature",
			data: [12, 19, 3, 5, count, 3],
			borderWidth: 1,
		  },
		],
	  },
	  options: {
		scales: {
		  y: {
			beginAtZero: true,
		  },
		},
	  },
	});

	// cleanup on unmount
	return () => chartRef.current.destroy();
  }, []);

  useEffect(() => {
	if (!chartRef.current) return;

	let len = chartRef.current.data.datasets[0].data.length
	chartRef.current.data.datasets[0].data.push(count);
	chartRef.current.data.labels.push(len + 1)
	chartRef.current.update();

	if (len + 1 > 10){
		// Improve ogic to remove unwanted misses
		chartRef.current.data.datasets[0].data.splice(0, 1);
		chartRef.current.data.labels.splice(0, 1)
		chartRef.current.update();
	}

  }, [count]);

  return (
	<div>
	  <button onClick={() => {setCount(c => c + 1)}}>
		Increment
	  </button>

	  <p>Count: {count}</p>

	  <canvas ref={canvasRef} />
	</div>
  );
}

export default AnotherPlot;
