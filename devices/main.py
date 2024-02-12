# main.py

import asyncio
import schedule
import json
from payment.payment_lib import PaymentTerminal
from websocket.websocket import start_websocket_server, check_clients_connected

# Global variables
paymentTerminalIP_Front = "192.168.188.21"
paymentTerminalIP_Back = "192.168.188.22"
order_details = None

# Payment Terminal Initialization
paymentTerminalFront = PaymentTerminal(paymentTerminalIP_Front)
paymentTerminalBack = PaymentTerminal(paymentTerminalIP_Back)

# Payment-related functions
def end_of_day_job():
    paymentTerminalFront.endOfDay_uploadReceipts()
    paymentTerminalBack.endOfDay_uploadReceipts()

def schedule_payment_jobs():
    # Schedule the end-of-day job
    schedule.every().day.at("23:59").do(end_of_day_job)

async def run_scheduled_payment_jobs():
    while True:
        schedule.run_pending()
        await asyncio.sleep(1)

# WebSocket message handler
async def handle_order(websocket, message):
    global order_details
    try:
        outer_data = json.loads(message)
        order_details = outer_data
        #print(f"order_details updated in handle_order: {order_details}")  # Diagnostic print
        if "message" in outer_data:
            inner_message = json.loads(outer_data["message"])  # Parse the inner JSON
            if 'whichTerminal' in inner_message and 'totalPrice' in inner_message:
                print("Valid order data found")
                print("Payment started")
                # Convert totalPrice to cents
                total_price_cents = int(round(inner_message['totalPrice'] * 100))
                terminal = paymentTerminalFront if inner_message['whichTerminal'] == 'front' else paymentTerminalBack
                await terminal.auth_payment(total_price_cents, order_details)
            else:
                print("Order data is missing 'whichTerminal' or 'totalPrice'")
        else:
            print("Outer data is missing 'message' key")
    except json.JSONDecodeError:
        print("Error: Received message is not valid JSON.")

# WebSocket-related functions
async def check_connections_periodically():
    while True:
        message = await check_clients_connected(["app_1", "app_2"])
        if message:
            print(message)
        await asyncio.sleep(10)

# Entry point
if __name__ == '__main__':
    # Initialize asyncio event loop
    loop = asyncio.get_event_loop()

    # Schedule and run payment jobs
    schedule_payment_jobs()
    asyncio.ensure_future(run_scheduled_payment_jobs())

    # Schedule and run WebSocket checks
    asyncio.ensure_future(check_connections_periodically())

    # Start WebSocket server with handle_order as callback
    loop.create_task(start_websocket_server(handle_order))

    # Run the asyncio event loop
    loop.run_forever()
