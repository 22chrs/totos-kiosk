# main.py (toto)

from websocket.websocket import websocket_main, send_message
import asyncio

# Entry point for the script
if __name__ == '__main__':
    loop = asyncio.get_event_loop()

    async def send_periodically():
        while True:
            await asyncio.sleep(55)
            await send_message("kiosk", "Hallo Kiosk! (by toto)")
            #await send_message("orchester", "Hallo Orchester! (by devices)")
 
    loop.create_task(websocket_main())
    loop.create_task(send_periodically())
    loop.run_forever()
