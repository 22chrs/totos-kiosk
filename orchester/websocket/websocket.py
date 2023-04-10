import asyncio
import websockets
import os
import json

# Define a custom WebSocket class for the host (orchester)
class HostWebSocket:
    async def send(self, message):
        pass

# Store WebSocket clients with their aliases
clients = {
    "orchester": HostWebSocket(),
}

# Asynchronous function to handle WebSocket connections and messages
async def echo(websocket, path):
    # Receive the client's alias and store it with the WebSocket connection
    client_alias = await websocket.recv()
    clients[client_alias] = websocket
    print(f"New client connected: {client_alias}")

    try:
        # Iterate over incoming messages from the client
        async for message in websocket:
            data = json.loads(message)
            print(f"{client_alias}: {data['message']}")
            target_alias = data["target"]

            if target_alias in clients:
                target = clients[target_alias]
                await target.send(data["message"])
            else:
                print(f"No client found with alias: {target_alias}")
    except websockets.ConnectionClosed:
        print("Connection closed gracefully")
    finally:
        # Remove the client from the clients dictionary and log the disconnection
        del clients[client_alias]
        print(f"Client disconnected: {client_alias}")

# Function to start the WebSocket server as host
def start_websocket_server():
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 8765))

    print(f"WebSocket server starting on {host}:{port}")

    start_server = websockets.serve(echo, host, port)

    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        print(f"WebSocket server successfully started on {host}:{port}")
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        print(f"WebSocket server failed to start: {e}")
