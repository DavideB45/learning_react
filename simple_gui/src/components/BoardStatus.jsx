import { useState, useEffect, useRef } from "react";
import * as ROSLIB from "roslib";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { Card } from '@mantine/core';
import TitleTile from "./TitleTile";

function SingleTask( {name, color} ) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: color, display: "inline-block", }}/>
      <span>{name}</span>
    </div>
  )
}

function BoardStatus({ ros, paramClient, name, onClick }) {
  const [isCompleted, setIsCompleted] = useState(0);
  const taskListenerRef = useRef(null);
  const location = useLocation();
  const [items, setItems] = useState([])

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
        if (message.data > isCompleted) {
          toast.success("Task "+ items[message.data - 1] + " completed", { icon: "✅", toastId: message.data });
        }
        setIsCompleted(message.data);
      });
    });

    return () => {
      if (taskListenerRef.current) {
        taskListenerRef.current.unsubscribe();
        taskListenerRef.current = null;
      }
    };
  }, [items, location.pathname, isCompleted]);

  useEffect(() => {
    if (!paramClient) return;
    paramClient.callService({names:['board.list']}, function (result) {
      setItems(result.values[0].string_array_value)
    });
  }, [paramClient]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
      <TitleTile text={name} onClick={onClick} />
      <Card.Section inheritPadding py="md">
        {items.map((text, index) => (
          <div key={index}>
            <SingleTask name={text} color={isCompleted > index ? 'green' : isCompleted == index ? 'blue' : 'red'} />
          </div>
        ))}
      </Card.Section>
    </Card>
  );
}

export default BoardStatus;