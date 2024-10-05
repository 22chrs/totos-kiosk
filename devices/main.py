# main.py

import asyncio

# USB Serial Imports
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController

# WebSocket Imports
from websocket.websocket import (start_websocket_server, check_connections_periodically, clients, HOST_NAME)

# Payment Management Imports
from payment.payment_lib import (
    schedule_end_of_day_job,
    handle_order
)

# Orchestra Import
from orchestra.orchestra import start_orchestra

async def manage_usb_serial(usb_manager, command_forwarder):
    """
    Manages USB serial connections and forwards commands asynchronously.
    """
    # Start the connection manager
    await usb_manager.start()
    print("USB Connection Manager started.")

    # Start monitoring and forwarding commands as a background task
    asyncio.create_task(command_forwarder.monitor_and_forward())
    print("Serial Command Forwarder is monitoring and forwarding commands.")

async def main():
    """
    The main coroutine that orchestrates all asynchronous tasks.
    """
    # Define the aliases for the boards you want to connect with
    teensys = {'RoboCubeFront', 'RoboCubeBack', 'ServiceCube'}
    # If you have multiple Teensy devices, include their aliases
    # teensys = {'RoboCubeFront', 'RoboCubeBack'}

    # Instantiate the ConnectionManager, CommandForwarder, and TeensyController
    usb_manager = ConnectionManager(
        vid=0x16C0,
        pid=0x0483,
        baudrate=115200,
        timeout=0.2,
        required_aliases=teensys
    )
    command_forwarder = SerialCommandForwarder(usb_manager)
    teensy_controller = TeensyController(usb_manager, command_forwarder)

    # Start USB serial management as a separate task
    usb_task = asyncio.create_task(manage_usb_serial(usb_manager, command_forwarder))

    # Schedule the end-of-day job
    payment_job_task = asyncio.create_task(schedule_end_of_day_job())
    print("Scheduled end-of-day job.")

    # Schedule periodic connection checks for WebSocket clients
    connection_check_task = asyncio.create_task(check_connections_periodically())
    print("Scheduled periodic connection checks.")

    # Start the WebSocket server
    websocket_task = asyncio.create_task(
        start_websocket_server(handle_order, clients, HOST_NAME)
    )
    print("WebSocket server started.")

    # Start the Orchestra component as an asyncio task, passing teensy_controller
    orchestra_task = asyncio.create_task(
        start_orchestra(teensy_controller=teensy_controller)
    )
    print("Orchestra component started.")

    # Await all tasks concurrently with exception handling
    try:
        await asyncio.gather(
            usb_task,
            payment_job_task,
            connection_check_task,
            websocket_task,
            orchestra_task
        )
    except asyncio.CancelledError:
        print("Main tasks have been cancelled.")
    except Exception as e:
        print(f"An error occurred in the async tasks: {e}")

if __name__ == '__main__':
    print("Starting the integrated application.")

    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(main())
    except KeyboardInterrupt:
        print("KeyboardInterrupt received. Shutting down.")
    finally:
        # Cancel all running tasks
        tasks = [t for t in asyncio.all_tasks(loop) if not t.done()]
        for task in tasks:
            task.cancel()
        loop.run_until_complete(asyncio.gather(*tasks, return_exceptions=True))
        loop.close()
