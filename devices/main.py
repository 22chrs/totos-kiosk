import asyncio
import time

from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController
from orchestra.orchestra import homeAllDevices, start_orchestra
from websocket.websocket import start_websocket_server, check_connections_periodically, clients, HOST_NAME
from payment.payment_lib import schedule_end_of_day_job, handle_order

# Serial management
async def manage_usb_serial(usb_manager, command_forwarder):
    # Start the connection manager
    await usb_manager.start()
    asyncio.create_task(command_forwarder.monitor_and_forward())  # Start monitoring and forwarding commands as a background task

# Function to wait until all clients are connected
async def wait_until_all_clients_connected(client_names):
    while True:
        all_connected = True
        for client_name in client_names:
            if client_name not in clients:
                all_connected = False
                print(f"Waiting for client {client_name} to connect...")
        if all_connected:
            print("All specified clients are connected.")
            return
        await asyncio.sleep(1)

async def main():
    # Set debug flag
    debug = False  # Set to True to allow the orchestra to start even if homing failed
    print(f"Debug-Mode = {debug}")

    # Start the WebSocket server as a background task
    print("Starting WebSocket server...")
    websocket_task = asyncio.create_task(
        start_websocket_server(handle_order, clients, HOST_NAME)
    )

    # Wait until all specified clients are connected
    await wait_until_all_clients_connected(["app_front", "app_back"])

    # Serial
    if debug:
        teensys = {'RoboCubeBack'}
    else:
        teensys = {'RoboCubeFront', 'RoboCubeBack', 'ServiceCube'}  # Define the aliases for the boards you want to connect with

    usb_manager = ConnectionManager(
        vid=0x16C0,
        pid=0x0483,
        baudrate=115200,
        timeout=0.2,
        required_aliases=teensys
    )
    command_forwarder = SerialCommandForwarder(usb_manager)
    teensy_controller = TeensyController(usb_manager, command_forwarder)
    asyncio.create_task(manage_usb_serial(usb_manager, command_forwarder))  # Start USB serial management as a separate task

    print("Starting wait_until_all_aliases_connected...")
    await usb_manager.wait_until_all_aliases_connected()  # Wait until all required aliases are connected

    print("Starting to home all devices...")
    for alias in teensys:
        try:
            print(f"Homing {alias}...")
            result = await homeAllDevices(teensy_controller, alias)
            if result != "SUCCESS":
                print(f"{alias} -> Homing failed!")
        except Exception as e:
            print(f"Error homing {alias}: {e}")
   

    payment_job_task = asyncio.create_task(schedule_end_of_day_job())  # Scheduled end-of-day job.

    # Start periodic connection check
    connection_check_task = asyncio.create_task(check_connections_periodically())

    # Orchestra
    orchestra_task = asyncio.create_task(
        start_orchestra(teensy_controller=teensy_controller)
    )

    # Await all tasks concurrently with exception handling
    try:
        await asyncio.gather(
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
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("KeyboardInterrupt received. Shutting down.")
    except Exception as e:
        print(f"An error occurred: {e}")