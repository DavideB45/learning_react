// https://blog.logrocket.com/using-chart-js-react/
// https://github.com/ludusrusso/rosgraph_web_visualizer

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

function APlot() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
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

    chartRef.current.data.datasets[0].data[4] = count;
    chartRef.current.update();
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

export default APlot;
