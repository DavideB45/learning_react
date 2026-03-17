import { useEffect } from "react"

function connectWebSocket(deviceIP, onRetry, onNewData) {
  try {
    const taskboard_ws_url = deviceIP ? "ws://" + deviceIP + "/ws" : '/ws';
    const taskboard_ws = new WebSocket(taskboard_ws_url);
    
    taskboard_ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        onNewData(data)
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };
    
    taskboard_ws.onclose = (event) => {
      console.warn("WebSocket closed. Reconnecting in 2 seconds...", event);
      setTimeout(() => onRetry(), 2000);
    };
    
    taskboard_ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      taskboard_ws.close();
    };
    
    return taskboard_ws;
  } catch (error) {
    console.error("WebSocket connection failed:", error);
    setTimeout(() => onRetry(), 2000);
  }
}

export function useTaskBoard(deviceIP, onNewData) {
  useEffect(() => {
    const retry = () => {
      connectWebSocket(deviceIP, retry, onNewData);
    };
    
    const ws = connectWebSocket(deviceIP, retry, onNewData);
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [deviceIP]);
}