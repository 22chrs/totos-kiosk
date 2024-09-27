import asyncio
import threading

# USB Serial Imports
from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController

# WebSocket Imports
from websocket.websocket import start_websocket_server, clients, HOST_NAME

# Payment Management Imports
from payment.payment_management import (
    schedule_payment_jobs, 
    run_scheduled_payment_jobs, 
    handle_order, 
    check_connections_periodically
)

# Orchestra Import
from orchestra.orchestra import start_orchestra

def run_orchestra():
    """
    Starts the Orchestra component in a separate thread.
    """
    start_orchestra(
        orders_dir='Orders',
        active_orders_file='Orders/activeOrders.log',
        handled_dir='Orders/HandledOrders'
    )

async def manage_usb_serial():
    """
    Manages USB serial connections and forwards commands asynchronously.
    """
    # Define the aliases for the boards you want to test with
    teensys = {"RoboCubeBack"}  # Example set of board aliases

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
    teensy_controller = TeensyController(usb_manager, command_forwarder)

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
    usb_task = asyncio.create_task(manage_usb_serial())

    # Schedule payment jobs
    schedule_payment_jobs()
    payment_job_task = asyncio.create_task(run_scheduled_payment_jobs())
    print("Scheduled payment jobs.")

    # Schedule periodic connection checks
    connection_check_task = asyncio.create_task(check_connections_periodically())
    print("Scheduled periodic connection checks.")

    # Start the WebSocket server
    websocket_task = asyncio.create_task(
        start_websocket_server(handle_order, clients, HOST_NAME)
    )
    print("WebSocket server started.")

    # Await all tasks concurrently
    await asyncio.gather(
        usb_task,
        payment_job_task,
        connection_check_task,
        websocket_task
    )

if __name__ == '__main__':
    print("Starting the integrated application...")

    # Start the Orchestra component in a separate daemon thread
    orchestra_thread = threading.Thread(target=run_orchestra, daemon=True)
    orchestra_thread.start()
    print("Orchestra component started in a separate thread.")

    try:
        # Run the main asyncio event loop
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nReceived exit signal. Shutting down gracefully...")
    finally:
        # Add any necessary cleanup here
        print("Application has been shut down.")