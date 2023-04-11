# websocket.py (orchestor)

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
            target_alias = data["target"]

            if target_alias in clients:
                target = clients[target_alias]
                await target.send(json.dumps({"from": client_alias, "message": data["message"]}))
                if target_alias == "orchester":
                    print(f"{client_alias}: {data['message']}")
                else:
                    print(f"Message from {client_alias} to {target_alias}: {data['message']}")
            else:
                print(f"No client found with alias: {target_alias}")
    except websockets.ConnectionClosed:
        print("Connection closed gracefully")
    finally:
        # Remove the client from the clients dictionary and log the disconnection
        del clients[client_alias]
        print(f"Client disconnected: {client_alias}")

# Function to start the WebSocket server as host
async def start_websocket_server():
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 8765))

    print(f"WebSocket server starting on {host}:{port}")

    start_server = websockets.serve(echo, host, port)

    try:
        await start_server
        print(f"WebSocket server successfully started on {host}:{port}")
    except Exception as e:
        print(f"WebSocket server failed to start: {e}")

# Function to send a message from the host
async def send_message_from_host(client_alias, message):
    if client_alias in clients:
        target = clients[client_alias]
        if isinstance(target, HostWebSocket):
            print("Cannot send message to the host itself")
        else:
            try:
                await target.send(json.dumps({"from": "orchester", "message": message}))
                print(f"{client_alias}: {message}")
            except Exception as e:
                print(f"Error sending message: {e}")
    else:
        print(f"No client found with alias: {client_alias}")

# Entry point for the script
if __name__ == '__main__':
    # Call the function to start the WebSocket server
    start_websocket_server()
