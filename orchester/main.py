import asyncio
import websockets
import os

clients = set()

async def echo(websocket, path):
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")
    
    try:
        async for message in websocket:
            await websocket.send(message)
    except websockets.ConnectionClosed:
        print("Connection closed gracefully")
    finally:
        clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")

if __name__ == '__main__':
    host = 'localhost'
    port = int(os.environ.get('PORT', 8765))

    print(f"WebSocket server starting on {host}:{port}")

    start_server = websockets.serve(echo, host, port)

    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        print(f"WebSocket server successfully started on {host}:{port}")
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        print(f"WebSocket server failed to start: {e}")
