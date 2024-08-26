import asyncio
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController  # Import necessary classes

# Define the aliases for the boards you want to test with
teensys = {"RoboCubeFront"}  # Example set of board aliases

if __name__ == '__main__':
    print("Starting event loop")
    loop = asyncio.get_event_loop()

    # Instantiate the ConnectionManager with the specified parameters
    usb_manager = ConnectionManager(
        vid=0x16C0, 
        pid=0x0483, 
        baudrate=9600,
        timeout=0.2, 
        required_aliases=teensys
    )

    # Instantiate the SerialCommandForwarder and TeensyController
    command_forwarder = SerialCommandForwarder(usb_manager)
    teensy_controller = TeensyController(usb_manager, command_forwarder)

    async def main():
        await usb_manager.start()  # Start the connection manager

        # Wait until all required aliases are connected
        while not usb_manager.all_required_aliases_connected():
            print("Waiting for all required aliases to connect...")
            await asyncio.sleep(1)  # Check every second

        # Now send the home command to the "RoboCubeFront"
        await teensy_controller.send_home_device_command("RoboCubeFront", "Schleuse")

        # Start monitoring and forwarding commands
        await command_forwarder.monitor_and_forward()

    loop.run_until_complete(main())  # Run the main loop



    # if "RoboCubeFront" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Schleuse", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Becherschubse", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Shield", 0, 100, 10, 1000)
    #                 #await teensy_controller.send_move_device_command("RoboCubeFront", "Snackbar", 0, 100, 100, 100)
    #             if "RoboCubeBack" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Becherschubse", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Shield", 0, 100, 100, 100)
    #             if "ServiceCube" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_A", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_B", 0, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_C", 0, 100, 100, 100)
    #         else:
    #             # Execute the other commands every 1st iteration
    #             if "RoboCubeFront" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Schleuse", 150, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Becherschubse", 500, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeFront", "Shield", 120, 100, 100, 100)
    #                 #await teensy_controller.send_move_device_command("RoboCubeFront", "Snackbar", 400, 100, 100, 100)
    #             if "RoboCubeBack" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Schleuse", 150, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Becherschubse", 500, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("RoboCubeBack", "Shield", 120, 100, 100, 100)
    #             if "ServiceCube" in usb_manager.boards:
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_A", 0.5, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_B", 0.5, 100, 100, 100)
    #                 await teensy_controller.send_move_device_command("ServiceCube", "Rodell_C", 0.5, 100, 100, 100)
