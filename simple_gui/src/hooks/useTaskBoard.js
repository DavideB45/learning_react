import { use, useEffect, useState } from "react"

export function connectWebSocket(deviceIP, onRetry, setBoardStatus) {
  try {
    setBoardStatus("loading")
    const taskboard_ws_url = deviceIP ? "ws://" + deviceIP + "/ws" : '/ws';
    const taskboard_ws = new WebSocket(taskboard_ws_url);
    
    taskboard_ws.onclose = (event) => {
      console.warn("WebSocket closed.", event);
      setBoardStatus("error")
    };
    
    taskboard_ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      taskboard_ws.close();
      setBoardStatus("error")
    };

    taskboard_ws.onopen = (event) => {
      console.log("WebSocket connected to:", deviceIP);
      setBoardStatus("ready")
    };
    return taskboard_ws;
  } catch (error) {
    setBoardStatus("error")
    console.error("WebSocket connection failed:", error);
    //setTimeout(() => onRetry(), 2000);
  }
}

export function useTaskBoard(deviceIP) {
  const [boardStatus, setBoardStatus] = useState('idle');
  const [ws, setWs] = useState(null)

  useEffect( () => {
    if (!deviceIP) {
      setBoardStatus('idle');
      return;
    }

    const retry = () => {
      connectWebSocket(deviceIP, retry, setBoardStatus);
    };
    
    const newWs = connectWebSocket(deviceIP, retry, setBoardStatus);
    setWs(newWs)
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [deviceIP]);

  return { ws, boardStatus }
}