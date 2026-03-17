import asyncio
import json
import random
import websockets
from datetime import datetime

# Store connected clients
connected_clients = set()

async def send_taskboard_status(websocket):
    """Send taskboard status updates"""
    while True:
        # Simulate taskboard data (numbers)
        data = {
            "ws_data_type": "taskboard_status",
            "active_tasks": random.randint(1, 10),
            "completed_tasks": random.randint(0, 20),
            "pending_tasks": random.randint(0, 15),
            "timestamp": datetime.now().isoformat()
        }
        try:
            await websocket.send(json.dumps(data))
            print(f"Sent taskboard_status: {data}")
        except websockets.exceptions.ConnectionClosed:
            break
        await asyncio.sleep(3)  # Send every 3 seconds

async def send_system_status(websocket):
    """Send system status updates"""
    while True:
        # Simulate system data (numbers)
        data = {
            "ws_data_type": "system_status",
            "cpu_usage": round(random.uniform(10, 90), 2),
            "memory_usage": round(random.uniform(20, 80), 2),
            "temperature": round(random.uniform(35, 65), 2),
            "uptime_seconds": random.randint(3600, 86400),
            "timestamp": datetime.now().isoformat()
        }
        try:
            await websocket.send(json.dumps(data))
            print(f"Sent system_status: {data}")
        except websockets.exceptions.ConnectionClosed:
            break
        await asyncio.sleep(5)  # Send every 5 seconds

async def send_task_status(websocket):
    """Send individual task status updates"""
    while True:
        # Simulate task data (numbers)
        data = {
            "ws_data_type": "task_status",
            "task_id": random.randint(1, 100),
            "progress": random.randint(0, 100),
            "status_code": random.choice([0, 1, 2, 3]),  # 0: pending, 1: running, 2: completed, 3: error
            "duration_ms": random.randint(100, 5000),
            "timestamp": datetime.now().isoformat()
        }
        try:
            await websocket.send(json.dumps(data))
            print(f"Sent task_status: {data}")
        except websockets.exceptions.ConnectionClosed:
            break
        await asyncio.sleep(4)  # Send every 4 seconds

async def handler(websocket, path=None):
    """Handle new WebSocket connections"""
    print(f"Client connected from {websocket.remote_address}")
    connected_clients.add(websocket)
    
    try:
        # Create tasks to send different types of data
        tasks = [
            send_taskboard_status(websocket),
            send_system_status(websocket),
            send_task_status(websocket)
        ]
        
        # Run all sending tasks concurrently
        await asyncio.gather(*tasks)
        
    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected from {websocket.remote_address}")
    finally:
        connected_clients.remove(websocket)

async def main():
    """Start the WebSocket server"""
    server = await websockets.serve(handler, "0.0.0.0", 8765)
    print("WebSocket server started on ws://0.0.0.0:8765")
    print("Waiting for connections...")
    await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())