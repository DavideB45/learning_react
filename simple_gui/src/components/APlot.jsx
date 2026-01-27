// https://blog.logrocket.com/using-chart-js-react/
// https://github.com/ludusrusso/rosgraph_web_visualizer

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Card, Container } from '@mantine/core';
import TitleTile from './TitleTile';

function APlot({ ros, paramClient, name }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Press red button", "Press blue button", "Remove batteries", "Check batteries", "Order Cable", "Slide"],
        datasets: [
          {
            label: "# of Successes",
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
      <TitleTile text={name} />
      <Card.Section inheritPadding py="md">
        <Container>
          <button onClick={() => {setCount(c => c + 1)}}>
            Increment
          </button>

          <p>Count: {count}</p>

          <canvas ref={canvasRef} />
        </Container>
      </Card.Section>
    </Card>
  );
}

export default APlot;
