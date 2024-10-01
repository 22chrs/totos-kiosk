# @chatgpt: in this file everything which connectes both websocket communication AND zvt/ payment
# payment_management.py

#! ToDo: 

#! - Zahlung reservieren statt sofort buchen -> Welcher Befehl?
#! - HIER: Fall A erfolgreich. Welcher Befehl um Zahlung jetzt auszuführen?
#! - HIER: Fall A erfolgreich. Welcher Befehl um Zahlung zu stornieren?

#! - Warten auf Karte Präsentieren stoppen, Zahlung abbrechen. Gibt es hier einen Befehl innerhalb der ZVT++?

#! - End of Day Buchungen durchführen. Implementieren.
#! - Testprotokoll alles buchen.

import asyncio
import schedule
import json
import socket
from payment.payment_lib import PaymentTerminal
from websocket.websocket import check_clients_connected, clients, HOST_NAME


# TID 52500038 Plus #! WICHTIG
# TID 52500041 PIN #! WICHTIG


def check_ip(ip):
    try:
        socket.gethostbyname(ip)
        return True
    except socket.error:
        return False

# Global variables
paymentTerminalIP_Front = "192.168.68.201" if check_ip("192.168.68.201") else "192.168.1.201"
paymentTerminalIP_Back = "192.168.68.202" if check_ip("192.168.68.202") else "192.168.1.202"
#paymentTerminalIP_Front = "192.168.1.201"
#paymentTerminalIP_Back = "192.168.1.202"

paymentTerminalFront = PaymentTerminal(paymentTerminalIP_Front)
paymentTerminalBack = PaymentTerminal(paymentTerminalIP_Back)

order_details = None

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
async def handle_order(websocket, message, client_alias, clients, host_name):
    payment_style = "reservation"  # "reservation" for reservation or "auth" for direct pay
    global order_details
    try:
        outer_data = json.loads(message)
        order_details = outer_data

        if "message" in outer_data:
            # Check if the message is a JSON string or a simple command
            inner_message = outer_data["message"]
            try:
                # Try parsing the inner message as JSON
                inner_message_json = json.loads(inner_message)
                # Now process the inner JSON message as an order
                if 'whichTerminal' in inner_message_json and 'totalPrice' in inner_message_json:
                    print("Valid order data found")
                    print("Payment started")

                    # Add the client alias to order details to notify the right client later
                    order_details['client_alias'] = client_alias

                    # Convert totalPrice to cents
                    total_price_cents = int(round(inner_message_json['totalPrice'] * 100))
                    terminal = paymentTerminalFront if inner_message_json['whichTerminal'] == 'front' else paymentTerminalBack

                    # Start the payment process as a background task
                    asyncio.create_task(process_payment(terminal, payment_style, total_price_cents, order_details, client_alias, clients, host_name))
                else:
                    print("Received a message with 'message' key but missing 'whichTerminal' or 'totalPrice'")
            except json.JSONDecodeError:
                # If inner message is not JSON, handle it as a command
                if inner_message == "abort_payment":
                    print(f"Abort payment command received from {client_alias}")
                    # Determine which terminal to abort based on the client alias
                    if client_alias == 'app_front':
                        terminal = paymentTerminalFront
                    elif client_alias == 'app_back':
                        terminal = paymentTerminalBack
                    else:
                        print(f"Unknown client alias: {client_alias}")
                        return

                    # Abort the payment process
                    terminal.abort_payment()
                else:
                    print(f"Unknown message received from {client_alias}: {inner_message}")
        else:
            print("Outer data is missing 'message' key")
    except json.JSONDecodeError:
        print("Error: Received message is not valid JSON.")


async def process_payment(terminal, payment_style, total_price_cents, order_details, client_alias, clients, host_name):
    result = await terminal.pay(payment_style, total_price_cents, order_details)
    # Send the result to the client that sent the order
    await notify_client_payment_status(client_alias, result, clients, host_name)

async def book_total(which_terminal, receipt_no, amount):
    try:
        if which_terminal.lower() == 'front':
            terminal = paymentTerminalFront
        elif which_terminal.lower() == 'back':
            terminal = paymentTerminalBack
        else:
            raise ValueError(f"Unknown terminal identifier: {which_terminal}")

        result = await terminal.book_total(which_terminal, receipt_no, amount)
        if result:
            return result  # Return the actual result
        else:
            return f"BookTotal failed for terminal: {which_terminal}"
    except Exception as e:
        return f"BookTotal encountered an exception: {e}"

async def notify_client_payment_status(client_alias, result, clients, host_name):
    if client_alias in clients:
        client = clients[client_alias]
        try:
            # Prepare the result message (success or failure)
            result_message = json.dumps({"Payment": result})
            
            # Send the result message to the client
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

