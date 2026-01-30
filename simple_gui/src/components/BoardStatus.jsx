import { useState, useEffect, useRef } from "react";
import * as ROSLIB from "roslib";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { Card } from '@mantine/core';
import TitleTile from "./TitleTile";

function BoardStatus({ ros, paramClient, name, onClick }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const color = isCompleted ? "green" : "red";
  const text = isCompleted ? "Task completed" : "Task not completed";
  const taskListenerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Cleanup function that runs when location changes or component unmounts
    return () => {
      if (taskListenerRef.current) {
        taskListenerRef.current.unsubscribe();
        taskListenerRef.current = null;
      }
      // Dismiss the specific toast when leaving the route
      toast.dismiss(1);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!paramClient) return;
    if (location.pathname !== "/executing") return;

    const request = { names: ['task.type', 'task.name'] };
    paramClient.callService(request, function (result) {
      if (taskListenerRef.current) {
        taskListenerRef.current.unsubscribe();
      }

      taskListenerRef.current = new ROSLIB.Topic({ 
        ros: ros,
        name: result.values[1].string_value,
        messageType: result.values[0].string_value
      });

      taskListenerRef.current.subscribe(function (message) {
        setIsCompleted(message.data);
        if (message.data) {
          toast.success("Task completed", { icon: "✅", toastId: 1 });
        }
      });
    });

    return () => {
      if (taskListenerRef.current) {
        taskListenerRef.current.unsubscribe();
        taskListenerRef.current = null;
      }
    };
  }, [paramClient, ros, location.pathname]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
      <TitleTile text={name} onClick={onClick} />
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

export default BoardStatus;