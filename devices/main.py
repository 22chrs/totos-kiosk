import asyncio
from websocket.websocket import start_websocket_server, clients, HOST_NAME
from payment.payment_management import schedule_payment_jobs, run_scheduled_payment_jobs, handle_order, check_connections_periodically

# Entry point
if __name__ == '__main__':
    # Initialize asyncio event loop
    loop = asyncio.get_event_loop()

    # Schedule and run payment jobs
    schedule_payment_jobs()
    asyncio.ensure_future(run_scheduled_payment_jobs())

    # Schedule and run WebSocket checks
    asyncio.ensure_future(check_connections_periodically())

    # Start WebSocket server with handle_order as callback, passing clients and HOST_NAME
    loop.create_task(start_websocket_server(handle_order, clients, HOST_NAME))

    # Run the asyncio event loop
    loop.run_forever()