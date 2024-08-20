import asyncio
from usbserial.usbserial import UsbSerialManager

#teensys = {"RoboCubeFront", "ServiceCube", "RoboCubeBack"}  # Set the boards you want to test with
teensys = {"RoboCubeFront"}  # Set the boards you want to test with

if __name__ == '__main__':
    print("Starting event loop")
    loop = asyncio.get_event_loop()

    usb_manager = UsbSerialManager(vid=0x16C0, pid=0x0483, baudrate=115200, timeout=0.1, required_aliases=teensys)

    async def send_periodically():
        while True:
            # Example commands
            if "RoboCubeFront" in usb_manager.boards:
                usb_manager.send_move_device_command("RoboCubeFront", "Schleuse", 100, 100, 100)
            if "ServiceCube" in usb_manager.boards:
                usb_manager.send_move_device_command("ServiceCube", "Lift_A", 100, 100, 100)
            if "RoboCubeBack" in usb_manager.boards:
                usb_manager.send_move_device_command("RoboCubeBack", "Rodell_C", 10, 100, 100)
            
            await asyncio.sleep(3)

    async def main():
        await usb_manager.start()
        asyncio.create_task(send_periodically())
        while True:
            await asyncio.sleep(1)

    loop.run_until_complete(main())