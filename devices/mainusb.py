import asyncio
from usbserial.usbserial import UsbSerialManager, DeviceSerial

# Entry point for the script
if __name__ == '__main__':
    print("Starting event loop")
    loop = asyncio.get_event_loop()

    # Create a UsbSerialManager instance to handle Teensy devices
    usb_manager = UsbSerialManager(vid=0x16C0, pid=0x0483, baudrate=115200, timeout=0.1)

    # Define a coroutine that periodically sends messages to Teensy devices
    async def send_periodically():
        while True:
            print("send_periodically() called")
            #print(f"Device alias: {DeviceSerial.device_info['alias']}")
            # Send "Hello, World!" to the Teensy devices
            usb_manager.send_message("Motorsteuerung_A", "Hello, World!")
            #usb_manager.send_message("Motorsteuerung_B", "Hello, World!")

            # Wait for 5 seconds before sending the next message
            await asyncio.sleep(5)

    async def main():
        await usb_manager.discover_devices()
        await send_periodically()

    loop.run_until_complete(main())