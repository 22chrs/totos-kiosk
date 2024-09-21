# main.py

import asyncio
import threading
from websocket.websocket import start_websocket_server, clients, HOST_NAME
from payment.payment_management import (
    schedule_payment_jobs, 
    run_scheduled_payment_jobs, 
    handle_order, 
    check_connections_periodically
)

# Import the start_orchestra function from orchestra.py
from orchestra.orchestra import start_orchestra

def run_orchestra():
    start_orchestra(
        orders_dir='Orders',
        active_orders_file='Orders/activeOrders.log',
        handled_dir='Orders/HandledOrders'
    )

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

    # Start the Orchestra in a separate thread
    orchestra_thread = threading.Thread(target=run_orchestra, daemon=True)
    orchestra_thread.start()

    print("Order processing started. Monitoring for new orders and running WebSocket server...")

    try:
        # Run the asyncio event loop
        loop.run_forever()
    except KeyboardInterrupt:
        print("Shutting down gracefully...")
    finally:
        # Perform any necessary cleanup here
        pass