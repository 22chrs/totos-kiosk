# main.py (devices)

from websocket.websocket import websocket_main, send_message
import asyncio
from usbserial import UsbSerialManager

# Entry point for the script
if __name__ == '__main__':
    loop = asyncio.get_event_loop()

    # Create a UsbSerialManager instance to handle Teensy devices
    usb_manager = UsbSerialManager()

    # Define a coroutine that periodically sends messages to Teensy devices
    async def send_periodically():
        while True:
            # Send "Hello, World!" to the Teensy devices
            usb_manager.send_message("Motorsteuerung_A", "Hello, World!")
            usb_manager.send_message("Motorsteuerung_B", "Hello, World!")

            # Wait for 15 seconds before sending the next message
            await asyncio.sleep(15)
            #await send_message("kiosk", "Hallo Kiosk! (by devices)")
            #await send_message("orchester", "Hallo Orchester! (by devices)")

    # Run the websocket_main() function in the background
    loop.create_task(websocket_main())

    # Run the send_periodically() coroutine in the background
    loop.create_task(send_periodically())

    # Run the event loop indefinitely
    loop.run_forever()
