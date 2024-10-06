# main.py

import asyncio

from usbserial.usbserial import ConnectionManager, SerialCommandForwarder, TeensyController
from orchestra.orchestra import homeAllDevices, start_orchestra
from websocket.websocket import start_websocket_server, check_connections_periodically, clients, HOST_NAME
from payment.payment_lib import schedule_end_of_day_job, handle_order

# Serial management
async def manage_usb_serial(usb_manager, command_forwarder):
    # Start the connection manager
    await usb_manager.start()
    asyncio.create_task(command_forwarder.monitor_and_forward()) # Start monitoring and forwarding commands as a background task

async def main():
    teensys = {'RoboCubeBack'}  # Define the aliases for the boards you want to connect with

    #! Serial
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
    await usb_manager.wait_until_all_aliases_connected() # Wait until all required aliases are connected
    # Home all devices for each alias
    for alias in teensys:
        await homeAllDevices(teensy_controller, alias)

    #! Payment
    payment_job_task = asyncio.create_task(schedule_end_of_day_job()) # print("Scheduled end-of-day job.")

    #! Websocket
    connection_check_task = asyncio.create_task(check_connections_periodically()) 
    websocket_task = asyncio.create_task(
        start_websocket_server(handle_order, clients, HOST_NAME)
    )

    #! Orchestra
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

