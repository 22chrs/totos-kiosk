import asyncio
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController  # Import necessary classes

# Define the aliases for the boards you want to test with
teensys = {"RoboCubeFront", "RoboCubeBack"}  # Example set of board aliases

if __name__ == '__main__':
    print("Starting event loop")
    loop = asyncio.get_event_loop()

    # Instantiate the ConnectionManager with the specified parameters
    usb_manager = ConnectionManager(
        vid=0x16C0, 
        pid=0x0483, 
        baudrate=500000, 
        timeout=0.1, 
        required_aliases=teensys
    )

    # Instantiate the SerialCommandForwarder and TeensyController
    command_forwarder = SerialCommandForwarder(usb_manager)
    teensy_controller = TeensyController(usb_manager, command_forwarder)

    async def send_periodically():
        # while True:
        #     if "RoboCubeFront" in usb_manager.boards:
        #         await teensy_controller.send_move_device_command("RoboCubeFront", "Schleuse", 100, 100, 100)
        #     if "ServiceCube" in usb_manager.boards:
        #         await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 120, 100, 100)
        #     if "RoboCubeBack" in usb_manager.boards:
        #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_C", 10, 100, 100)

            await asyncio.sleep(3)  # Wait 3 seconds before sending the next round of commands

    async def main():
        await usb_manager.start()  # Start the connection manager
        asyncio.create_task(send_periodically())  # Start the periodic command sender
        await command_forwarder.monitor_and_forward()  # Start monitoring and forwarding commands

    loop.run_until_complete(main())  # Run the main loop