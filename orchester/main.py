# main.py (orchester)

from websocket.websocket import start_websocket_server, send_message_from_host, clients
import asyncio

# Entry point for the script
if __name__ == '__main__':
    loop = asyncio.get_event_loop()

    async def send_periodically():
        while True:
            await asyncio.sleep(3)
            #await send_message_from_host("toto", "Hej Toto!")
            #await send_message_from_host("kiosk", "Hallo du Kiosk!")

    loop.create_task(send_periodically())  # Changed this line
    loop.create_task(start_websocket_server())  # Changed this line
    loop.run_forever()
