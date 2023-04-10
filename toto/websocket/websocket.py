# websocket.py (toto)

import asyncio
import websockets
import json

websocket_global = None

# Client connection handling function
async def client(uri: str, alias: str):
    global websocket_global
    try:
        async with websockets.connect(uri) as websocket:
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

            # Run receive_loop
            await receive_loop()
    except websockets.ConnectionClosed:
        print(f"Connection to '{uri}' as '{alias}' closed")
    except Exception as e:
        print(f"WebSocket client '{alias}' encountered an error: {e}")
        raise

# Function to send a message
async def send_message(target: str, message: str) -> bool:
    global websocket_global
    if websocket_global:
        try:
            await websocket_global.send(json.dumps({"target": target, "message": message}))
            print(f"{target}: {message}")
            return True
        except Exception as e:
            print(f"Error sending message: {e}")
            return False
    return False



# Main function to handle WebSocket connection
async def websocket_main():
    uri = "ws://localhost:8765"
    alias = "toto"

    while True:
        try:
            print(f"Attempting to connect '{alias}' to {uri}")
            await client(uri, alias)
        except Exception as e:
            print("Retrying in 2 seconds...")
            await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(websocket_main())
