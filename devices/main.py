import asyncio

# USB Serial Imports
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController

# WebSocket Imports
from websocket.websocket import start_websocket_server, clients, HOST_NAME

# Payment Management Imports
from payment.payment_management import (
    schedule_end_of_day_job,
    handle_order,
    check_connections_periodically
)

# Orchestra Import
from orchestra.orchestra import start_orchestra

async def manage_usb_serial():
    """
    Manages USB serial connections and forwards commands asynchronously.
    """
    # Define the aliases for the boards you want to test with
    teensys = {'RoboCubeFront', 'RoboCubeBack'}   # Example set of board aliases

    # Instantiate the ConnectionManager with the specified parameters
    usb_manager = ConnectionManager(
        vid=0x16C0, 
        pid=0x0483, 
        baudrate=115200,
        timeout=0.2, 
        required_aliases=teensys
    )

    # Instantiate the SerialCommandForwarder and TeensyController
    command_forwarder = SerialCommandForwarder(usb_manager)

    # Start the connection manager
    await usb_manager.start()
    print("USB Connection Manager started.")

    # Start monitoring and forwarding commands
    await command_forwarder.monitor_and_forward()
    print("Serial Command Forwarder is monitoring and forwarding commands.")

async def main():
    """
    The main coroutine that orchestrates all asynchronous tasks.
    """
    # Start USB serial management as a separate task
    #usb_task = asyncio.create_task(manage_usb_serial())

    # Schedule the end-of-day job
    payment_job_task = asyncio.create_task(schedule_end_of_day_job())
    print("Scheduled end-of-day job.")

    # Schedule periodic connection checks
    connection_check_task = asyncio.create_task(check_connections_periodically())
    print("Scheduled periodic connection checks.")

    # Start the WebSocket server
    websocket_task = asyncio.create_task(
        start_websocket_server(handle_order, clients, HOST_NAME)
    )
    print("WebSocket server started.")

    # Start the Orchestra component as an asyncio task
    orchestra_task = asyncio.create_task(start_orchestra())
    print("Orchestra component started.")

    # Await all tasks concurrently
    await asyncio.gather(
        #usb_task,
        payment_job_task,
        connection_check_task,
        websocket_task,
        orchestra_task
    )

if __name__ == '__main__':
    print("Starting the integrated application.")

    # Run the main asyncio event loop
    asyncio.run(main())