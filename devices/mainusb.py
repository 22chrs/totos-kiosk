import asyncio
from usbserial.usbserial import UsbSerialManager, DeviceSerial

teensys = {"Motorsteuerung_A", "Motorsteuerung_B"}

# Entry point for the script
if __name__ == '__main__':
    print("Starting event loop")
    loop = asyncio.get_event_loop()

    # Create a UsbSerialManager instance to handle Teensy devices
    usb_manager = UsbSerialManager(vid=0x16C0, pid=0x0483, baudrate=115200, timeout=0.1, required_aliases=teensys)

    # Define a coroutine that periodically sends messages to Teensy devices
    async def send_periodically():
        while True:
            #print(f"Device alias: {DeviceSerial.device_info['alias']}")
            # Send "Hello, World!" to the Teensy devices
            usb_manager.send_message("Motorsteuerung_A", "Hello, World!")

            #usb_manager.print_object_properties()
            #usb_manager.send_message("Motorsteuerung_B", "Hello, World!")

            await asyncio.sleep(3)

    async def main():
        await usb_manager.start()
        await send_periodically()

    loop.run_until_complete(main())