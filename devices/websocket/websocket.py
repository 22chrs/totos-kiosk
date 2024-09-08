# @chatgpt: in this file everything about the websocket communication but nothing which is about the payment.

import websockets
import os
import json
import ssl

HOST_NAME = 'devices'

class WebSocketClient:
    def __init__(self, websocket):
        self.websocket = websocket

    async def send(self, message):
        await self.websocket.send(message)

clients = {}

async def echo(websocket, path, callback, clients, host_name):
    client_alias = await websocket.recv()
    clients[client_alias] = WebSocketClient(websocket)
    print(f"New client connected: {client_alias}")

    try:
        async for message in websocket:
            print(f"Message received from {client_alias}: {message}")
            try:
                data = json.loads(message)
                await callback(websocket, message, client_alias, clients, host_name)  # Pass clients and host_name
            except json.JSONDecodeError:
                print(f"Invalid JSON received from {client_alias}")
    except websockets.ConnectionClosed:
        print(f"Connection closed gracefully for {client_alias}")
    finally:
        if client_alias in clients:
            del clients[client_alias]
            print(f"Client disconnected: {client_alias}")
            

async def start_websocket_server(callback, clients, host_name):
    host = '0.0.0.0'
    port = int(os.environ.get('PORT', 8765))

    # Check if running inside Docker
    def is_running_in_docker():
        print("Running in Docker env")
        return os.getenv('RUNNING_IN_DOCKER') == 'true'
     

    # Initialize ssl_context only if running in Docker
    ssl_context = None
    if is_running_in_docker():
        ssl_cert_path = '/certs/devices.pem'
        ssl_key_path = '/certs/devices-key.pem'
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ssl_context.load_cert_chain(ssl_cert_path, ssl_key_path)
        print(f"WebSocket server starting on wss://{host}:{port}")
    else:
        print(f"WebSocket server starting on ws://{host}:{port}")

    # Start the server with or without SSL context based on environment
    start_server = websockets.serve(
        lambda ws, path: echo(ws, path, callback, clients, host_name), 
        host, 
        port, 
        ssl=ssl_context  # Pass the ssl_context here
    )

    try:
        await start_server
        print(f"WebSocket server successfully started on {'wss' if ssl_context else 'ws'}://{host}:{port}")
    except Exception as e:
        print(f"WebSocket server failed to start: {e}")


# Function to send a message from the host
async def send_message_from_host(client_alias, message):
    if client_alias in clients:
        target = clients[client_alias]
        try:
            await target.send(json.dumps({"from": HOST_NAME, "message": message}))
            print(f"Message sent to {client_alias} from {HOST_NAME}: {message}")
        except Exception as e:
            print(f"Error sending message: {e}")
    else:
        print(f"No client found with alias: {client_alias}")

# Global flag to track whether the 'all connected' message has been displayed
all_connected_displayed = False

async def check_clients_connected(client_names):
    global all_connected_displayed
    disconnected_clients = []
    for client_name in client_names:
        if client_name not in clients:
            disconnected_clients.append(client_name)

    if disconnected_clients:
        # Reset the flag since not all clients are connected
        all_connected_displayed = False
        return f"Error: The following clients are not connected: {', '.join(disconnected_clients)}"
    else:
        if not all_connected_displayed:
            all_connected_displayed = True  # Set the flag to prevent repeated messages
            return "All specified clients are connected."
        return ""