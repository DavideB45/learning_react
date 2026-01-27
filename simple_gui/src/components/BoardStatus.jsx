import { useState, useEffect } from "react";
import * as ROSLIB from "roslib";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { Card } from '@mantine/core';


function BoardStatus({ ros, paramClient, name }) {
  const [isCompleted, setIsCompleted] = useState(false)
  const location = useLocation();
  const color = isCompleted ? "green" : "red";
  const text = isCompleted ? "Task completed" : "Task not completed";

  useEffect(() => {
    if (!paramClient) return;

    const request = {
      names: ['task.type', 'task.name']
    };
    let taskListener = null;
    paramClient.callService(request, function (result) {
      taskListener = new ROSLIB.Topic({ 
        ros: ros,
        name: result.values[1].string_value,
        messageType: result.values[0].string_value
      });

      taskListener.subscribe(function (message) {
        if (location.pathname !== "/executing") return;
        setIsCompleted(message.data)
        if (message.data)
          toast.success("Task completed", { icon: "✅" , toastId: 1},
        );
      })
    });
    return () => {
      if (taskListener) {
        taskListener.unsubscribe();
      }
    };
  }, [paramClient]);

  return (
	<Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
		<Card.Section withBorder inheritPadding py="md">
			<h3 style={{ margin: 0 }}>{name}</h3>
		</Card.Section>
		<Card.Section inheritPadding py="md">
			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<span
				style={{
				width: "12px",
				height: "12px",
				borderRadius: "50%",
				backgroundColor: color,
				display: "inline-block",
				}}
			/>
			<span>{text}</span>
			</div>
		</Card.Section>
	</Card>
  );
}

export default BoardStatus