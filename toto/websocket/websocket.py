import asyncio
import websockets
import json
import os
import ssl
import logging

# Configure logging for essential output
logging.basicConfig(
    level=logging.INFO,  # Set to INFO to capture essential logs
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

websocket_global = None

def is_running_in_docker():
    """Check if the code is running inside a Docker container."""
    return os.getenv('RUNNING_IN_DOCKER') == 'true'

# Client connection handling function
async def client(uri: str, alias: str, ssl_context=None):
    global websocket_global

    try:
        logging.info(f"Attempting to connect to WebSocket server at {uri} as '{alias}'")
        async with websockets.connect(uri, ssl=ssl_context) as websocket:
            websocket_global = websocket
            await websocket.send(alias)
            logging.info(f"Connected to host '{uri}' as '{alias}'")

            # Message receiving loop
            async def receive_loop():
                while True:
                    try:
                        message = await websocket.recv()
                        #print(f"Raw incoming message: {message}")

                        if not message:
                            logging.warning("Received an empty message.")
                            continue

                        # Attempt to parse the message as JSON
                        try:
                            data = json.loads(message)
                            sender = data.get('from', 'unknown')
                            content = data.get('message', '')
                            print(f"{sender}: {content}")
                        except json.JSONDecodeError:
                            # Handle non-JSON messages
                            print(f"Server: {message}")

                    except websockets.ConnectionClosed as cc:
                        logging.warning(f"Disconnected from host '{uri}': {cc}")
                        break
                    except Exception as e:
                        logging.error(f"Error receiving message: {e}")
                        break

            # Run receive_loop
            await receive_loop()
    except websockets.ConnectionClosed as cc:
        logging.warning(f"Connection to '{uri}' as '{alias}' closed: {cc}")
    except Exception as e:
        logging.error(f"WebSocket client '{alias}' encountered an error: {e}")
        logging.info("Retrying in 2 seconds...")
        await asyncio.sleep(2)

# Function to send a message
async def send_message(target: str, message: str) -> bool:
    global websocket_global
    if websocket_global:
        try:
            payload = json.dumps({"target": target, "message": message})
            await websocket_global.send(payload)
            print(f"Sent to {target}: {message}")
            return True
        except Exception as e:
            logging.error(f"Error sending message: {e}")
            return False
    else:
        logging.warning("WebSocket is not connected.")
    return False

# Main function to handle WebSocket connection
async def websocket_main():
    # Retrieve server host from environment variable or default to 'localhost'
    server_host = os.getenv('SERVER_HOST', 'localhost')  # Critical: Do not use '0.0.0.0'
    port = int(os.getenv('PORT', 8765))

    alias = os.getenv("CLIENT_ALIAS", "toto")
    logging.info(f"Client alias set to '{alias}'")

    ssl_context = None
    if is_running_in_docker():
        uri = f"wss://{server_host}:{port}"
        ssl_cert_path = '/certs/devices.pem'
        ssl_key_path = '/certs/devices-key.pem'
        ssl_context = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
        try:
            ssl_context.load_cert_chain(ssl_cert_path, ssl_key_path)
            logging.info(f"Loaded SSL certificates from {ssl_cert_path} and {ssl_key_path}")
        except Exception as e:
            logging.error(f"Failed to load SSL certificates: {e}")
            # Depending on your setup, you might want to proceed without SSL or terminate
            return

        # For self-signed certificates (not recommended for production)
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
    else:
        uri = f"ws://{server_host}:{port}"

    logging.info(f"WebSocket URI set to '{uri}'")

    while True:
        try:
            await client(uri, alias, ssl_context)
        except Exception as e:
            logging.error(f"Connection error: {e}. Retrying in 2 seconds...")
            await asyncio.sleep(2)

if __name__ == "__main__":
    try:
        asyncio.run(websocket_main())
    except KeyboardInterrupt:
        logging.info("WebSocket client terminated by user.")
    except Exception as e:
        logging.critical(f"Unhandled exception: {e}")