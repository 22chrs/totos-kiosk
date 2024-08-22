import asyncio
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController  # Import necessary classes

# Define the aliases for the boards you want to test with
#teensys = {"RoboCubeFront", "RoboCubeBack", "ServiceCube"}  # Example set of board aliases
teensys = {"RoboCubeBack"}  # Example set of board aliases

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
        counter = 0  # Initialize a counter to track the number of iterations
        while True:
            await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 0, 100, 100)

            # if counter % 2 == 0:
            #     # Execute the "move back to 0" commands every 2nd iteration
            #     if "RoboCubeFront" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Schleuse", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Becherschubse", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Shield", 0, 100, 100)
            #         #await teensy_controller.send_move_device_command("RoboCubeFront", "Snackbar", 0, 100, 100)
            #     if "RoboCubeBack" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Becherschubse", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Shield", 0, 100, 100)
            #     if "ServiceCube" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_A", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_B", 0, 100, 100)
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_C", 0, 100, 100)
            # else:
            #     # Execute the other commands every 1st iteration
            #     if "RoboCubeFront" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Schleuse", 150, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Becherschubse", 500, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeFront", "Shield", 120, 100, 100)
            #         #await teensy_controller.send_move_device_command("RoboCubeFront", "Snackbar", 400, 100, 100)
            #     if "RoboCubeBack" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 150, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Becherschubse", 500, 100, 100)
            #         await teensy_controller.send_move_device_command("RoboCubeBack", "Shield", 120, 100, 100)
            #     if "ServiceCube" in usb_manager.boards:
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_A", 0.5, 100, 100)
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_B", 0.5, 100, 100)
            #         await teensy_controller.send_move_device_command("ServiceCube", "Rodell_C", 0.5, 100, 100)

            counter += 1  # Increment the counter after each iteration
            await asyncio.sleep(10)  # Wait 10 seconds before sending the next round of commands

    async def main():
        await usb_manager.start()  # Start the connection manager
        asyncio.create_task(send_periodically())  # Start the periodic command sender
        await command_forwarder.monitor_and_forward()  # Start monitoring and forwarding commands

    loop.run_until_complete(main())  # Run the main loop