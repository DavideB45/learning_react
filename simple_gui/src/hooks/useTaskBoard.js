import { useEffect } from "react"

// 1. Create a regular function (not a hook) for the connection logic
function connectWebSocket(deviceIP, onRetry, onTaskboardUpdate, onSystemUpdate, onTaskUpdate) {
  try {
    const taskboard_ws_url = deviceIP ? "ws://" + deviceIP + "/ws" : '/ws';
    const taskboard_ws = new WebSocket(taskboard_ws_url);
    
    taskboard_ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.ws_data_type === "taskboard_status") {
          console.log('taskboard_status received')
        } else if (data.ws_data_type === "system_status") {
          console.log('system_status received')
        } else if (data.ws_data_type === "task_status") {
          console.log('task_status received')
        }
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };
    
    taskboard_ws.onclose = (event) => {
      console.warn("WebSocket closed. Reconnecting in 2 seconds...", event);
      setTimeout(() => onRetry(), 2000);  // Call the retry callback
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

// 2. Create the hook that manages the connection
export function useTaskBoard(deviceIP) {
  useEffect(() => {
    // Create a retry function that can be called from setTimeout
    const retry = () => {
      connectWebSocket(deviceIP, retry);
    };
    
    const ws = connectWebSocket(deviceIP, retry);
    
    // Cleanup: close the connection when component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [deviceIP]);
}