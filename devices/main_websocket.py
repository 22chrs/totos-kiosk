from websocket.websocket import start_websocket_server, check_clients_connected, clients
import asyncio

# Entry point for the script
if __name__ == '__main__':
    loop = asyncio.get_event_loop()

    async def check_connections_periodically():
        while True:
            # Check if specific clients are connected
            message = await check_clients_connected(["app_front", "app_back"])
            if message:  # Only print if there's a message
                print(message)
            # Here you can add additional logic based on the connection status
            await asyncio.sleep(5)  # Check every 5 seconds, adjust as needed


    # Schedule the check_connections_periodically to run periodically
    asyncio.ensure_future(check_connections_periodically())

    # Start the WebSocket server
    loop.create_task(start_websocket_server())
    loop.run_forever()
