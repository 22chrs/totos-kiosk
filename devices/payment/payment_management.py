# payment_management.py

import asyncio
import json
import socket
import platform
import datetime
from payment.payment_lib import PaymentTerminal
from websocket.websocket import check_clients_connected, clients, HOST_NAME

# TID 52500038 Plus #! WICHTIG
# TID 52500041 PIN #! WICHTIG

# # Global variables
if platform.system() == "Darwin":  # "Darwin" is the system name for macOS
    paymentTerminalIP_Front = "192.168.68.201"
    paymentTerminalIP_Back = "192.168.68.202"
else:
    paymentTerminalIP_Front = "192.168.1.201"
    paymentTerminalIP_Back = "192.168.1.202"

paymentTerminalFront = PaymentTerminal(paymentTerminalIP_Front)
paymentTerminalBack = PaymentTerminal(paymentTerminalIP_Back)

paymentTerminalFront_lock = asyncio.Lock()
paymentTerminalBack_lock = asyncio.Lock()

order_details = None

# Payment-related functions
async def end_of_day_job():
    await paymentTerminalFront.endOfDay_uploadReceipts()
    await paymentTerminalBack.endOfDay_uploadReceipts()

async def schedule_end_of_day_job():
    while True:
        now = datetime.datetime.now()
        target_time = now.replace(hour=23, minute=59, second=0, microsecond=0)
        if now >= target_time:
            target_time += datetime.timedelta(days=1)
        time_to_sleep = (target_time - now).total_seconds()
        await asyncio.sleep(time_to_sleep)
        await end_of_day_job()

# WebSocket message handler
async def handle_order(websocket, message, client_alias, clients, host_name):
    payment_style = "reservation"  # "reservation" for reservation or "auth" for direct pay
    global order_details
    try:
        outer_data = json.loads(message)
        order_details = outer_data

        if "message" in outer_data:
            inner_message = outer_data["message"]
            try:
                inner_message_json = json.loads(inner_message)
                if 'whichTerminal' in inner_message_json and 'totalPrice' in inner_message_json:
                    print("Valid order data found")
                    print("Payment started")

                    order_details['client_alias'] = client_alias

                    total_price_cents = int(round(inner_message_json['totalPrice'] * 100))
                    terminal = paymentTerminalFront if inner_message_json['whichTerminal'] == 'front' else paymentTerminalBack

                    # Start the payment process as a background task
                    asyncio.create_task(process_payment(terminal, payment_style, total_price_cents, order_details, client_alias, clients, host_name))
                else:
                    print("Received a message with 'message' key but missing 'whichTerminal' or 'totalPrice'")
            except json.JSONDecodeError:
                if inner_message == "abort_payment":
                    print(f"Abort payment command received from {client_alias}")
                    if client_alias == 'app_front':
                        terminal = paymentTerminalFront
                    elif client_alias == 'app_back':
                        terminal = paymentTerminalBack
                    else:
                        print(f"Unknown client alias: {client_alias}")
                        return

                    # Abort the payment process
                    await terminal.abort_payment()
                else:
                    print(f"Unknown message received from {client_alias}: {inner_message}")
        else:
            print("Outer data is missing 'message' key")
    except json.JSONDecodeError:
        print("Error: Received message is not valid JSON.")

async def process_payment(terminal, payment_style, total_price_cents, order_details, client_alias, clients, host_name):
    if terminal == paymentTerminalFront:
        lock = paymentTerminalFront_lock
    elif terminal == paymentTerminalBack:
        lock = paymentTerminalBack_lock
    else:
        raise ValueError("Unknown terminal")

    try:
        # Perform the network operation without holding the lock
        result = await asyncio.wait_for(
            terminal.pay(payment_style, total_price_cents, order_details),
            timeout=30
        )
    except asyncio.TimeoutError:
        result = "Payment operation timed out"
    except Exception as e:
        result = f"Payment encountered an exception: {e}"

    # Now acquire the lock to update shared resources if needed
    async with lock:
        # Update shared resources here
        pass  # Replace with actual code

    await notify_client_payment_status(client_alias, result, clients, host_name)

async def book_total(which_terminal, receipt_no, amount):
    try:
        if which_terminal.lower() == 'front':
            terminal = paymentTerminalFront
            lock = paymentTerminalFront_lock
        elif which_terminal.lower() == 'back':
            terminal = paymentTerminalBack
            lock = paymentTerminalBack_lock
        else:
            raise ValueError(f"Unknown terminal identifier: {which_terminal}")

        async with lock:
            try:
                # Add a timeout to the book_total operation
                result = await asyncio.wait_for(
                    terminal.book_total(which_terminal, receipt_no, amount),
                    timeout=15  # Timeout after 15 seconds
                )
            except asyncio.TimeoutError:
                result = f"BookTotal operation timed out for terminal: {which_terminal}"
            except Exception as e:
                result = f"BookTotal encountered an exception: {e}"

        return result
    except Exception as e:
        return f"BookTotal encountered an exception: {e}"

async def notify_client_payment_status(client_alias, result, clients, host_name):
    if client_alias in clients:
        client = clients[client_alias]
        try:
            result_message = json.dumps({"Payment": result})
            await client.send(result_message)
            print(f"Payment result sent to {client_alias}: {result_message}")
        except Exception as e:
            print(f"Error sending payment result to {client_alias}: {e}")
    else:
        print(f"Client {client_alias} not found")

# WebSocket-related functions
async def check_connections_periodically():
    while True:
        message = await check_clients_connected(["app_front", "app_back"])
        if message:
            print(message)
        await asyncio.sleep(3)