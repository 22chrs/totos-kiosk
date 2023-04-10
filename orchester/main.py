import asyncio
import websockets
import os

# Set to store WebSocket clients
clients = set()

# Asynchronous function to handle WebSocket connections and messages
async def echo(websocket, path):
    # Add the client to the clients set
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")

    try:
        # Iterate over incoming messages from the client
        async for message in websocket:
            print(f"Received message: {message}")
            # Create a response message
            response = f"Server response: {message}"
            # Send the response message back to the client
            await websocket.send(response)
    except websockets.ConnectionClosed:
        print("Connection closed gracefully")
    finally:
        # Remove the client from the clients set and log the disconnection
        clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")

# Entry point for the script
if __name__ == '__main__':
    host = '0.0.0.0'
    # Get the port from the environment variable, default to 8765 if not set
    port = int(os.environ.get('PORT', 8765))

    print(f"WebSocket server starting on {host}:{port}")

    # Create a WebSocket server and bind the echo function as the handler
    start_server = websockets.serve(echo, host, port)

    try:
        # Start the WebSocket server and block the event loop
        asyncio.get_event_loop().run_until_complete(start_server)
        print(f"WebSocket server successfully started on {host}:{port}")
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        print(f"WebSocket server failed to start: {e}")
