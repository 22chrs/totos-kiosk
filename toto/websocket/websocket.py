import asyncio
import websockets
import json
import os
import ssl

websocket_global = None

def is_running_in_docker():
    return os.getenv('RUNNING_IN_DOCKER') == 'true'

# Client connection handling function
async def client(uri: str, alias: str):
    global websocket_global
    try:
        ssl_context = None
        if uri.startswith('wss://'):
            # Create an SSL context for secure connections
            ssl_context = ssl.create_default_context()
            # For self-signed certificates (not recommended for production)
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE

        async with websockets.connect(uri, ssl=ssl_context) as websocket:
            websocket_global = websocket
            await websocket.send(alias)
            print(f"Connected to host '{uri}' as '{alias}'")

            # Message receiving loop
            async def receive_loop():
                while True:
                    try:
                        message = await websocket.recv()
                        data = json.loads(message)
                        print(f"{data['from']}: {data['message']}")
                    except websockets.ConnectionClosed:
                        print(f"Disconnected from host '{uri}'")
                        break
                    except Exception as e:
                        print(f"Error receiving message: {e}")
                        break

            # Run receive_loop
            await receive_loop()
    except websockets.ConnectionClosed:
        print(f"Connection to '{uri}' as '{alias}' closed")
    except Exception as e:
        print(f"WebSocket client '{alias}' encountered an error: {e}")
        print("Retrying in 2 seconds...")
        await asyncio.sleep(2)

# Function to send a message
async def send_message(target: str, message: str) -> bool:
    global websocket_global
    if websocket_global:
        try:
            await websocket_global.send(json.dumps({"target": target, "message": message}))
            print(f"Sent to {target}: {message}")
            return True
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
    else:
        print("WebSocket is not connected.")
    return False

# Main function to handle WebSocket connection
async def websocket_main():
    # Determine if running inside Docker
    if is_running_in_docker():
        uri = os.environ.get("WEBSOCKET_SERVER_URI", "wss://localhost:8765")
    else:
        uri = os.environ.get("WEBSOCKET_SERVER_URI", "ws://localhost:8765")
    alias = os.environ.get("CLIENT_ALIAS", "toto")

    while True:
        try:
            print(f"Attempting to connect '{alias}' to {uri}")
            await client(uri, alias)
        except Exception as e:
            print(f"Connection error: {e}")
            print("Retrying in 2 seconds...")
            await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(websocket_main())