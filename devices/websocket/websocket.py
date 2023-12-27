import websockets
import os
import json
from datetime import datetime

HOST_NAME = 'devices'  # Define a constant for the host name

# Define a custom WebSocket class for clients
class WebSocketClient:
    def __init__(self, websocket):
        self.websocket = websocket

    async def send(self, message):
        await self.websocket.send(message)

# Store WebSocket clients with their aliases
clients = {}

# Asynchronous function to handle WebSocket connections and messages
async def echo(websocket, path):
    client_alias = await websocket.recv()
    clients[client_alias] = WebSocketClient(websocket)
    print(f"New client connected: {client_alias}")

    try:
        async for message in websocket:
            print(f"Message received from {client_alias}: {message}")
            try:
                data = json.loads(message)
                target_alias = data["target"]

                if target_alias in clients:
                    # Forward the message to the specified client
                    target = clients[target_alias]
                    await target.send(json.dumps({"from": client_alias, "message": data["message"]}))
                    print(f"Message from {client_alias} to {target_alias}: {data['message']}")

            except json.JSONDecodeError:
                print(f"Invalid JSON received from {client_alias}")

            # Call handle_order regardless of target alias
            handle_order(message)

    except websockets.ConnectionClosed:
        print("Connection closed gracefully")
    except Exception as e:
        print(f"Exception in message handling: {e}")
    finally:
        if client_alias in clients:
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

def handle_order(received_message):
    try:
        # Parse the outer JSON layer
        outer_data = json.loads(received_message)
        if "message" in outer_data:
            # Parse the inner JSON message
            order_data = json.loads(outer_data["message"])
            
            # Check if the message is an order (additional checks can be added here)
            if "orderID" in order_data and "timeStampOrder" in order_data:
                # Create the orders directory if it doesn't exist
                os.makedirs('orders', exist_ok=True)

                # Generate a filename based on the timestamp
                timestamp = order_data["timeStampOrder"].replace(':', '-').replace('.', '-')
                filename = f'orders/order_{timestamp}.json'

                # Save the order data to a file
                with open(filename, 'w') as file:
                    json.dump(order_data, file, indent=4)
                print(f"Order saved to {filename}")

    except json.JSONDecodeError as e:
        # Not a JSON message or not an order
        print("Received message is not a valid JSON order:", e)



# Entry point for the script
if __name__ == '__main__':
    # Call the function to start the WebSocket server
    start_websocket_server()
