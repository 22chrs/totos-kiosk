# @chatgpt: in this file everything which connectes both websocket communication AND zvt/ payment

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
from payment.payment_lib import PaymentTerminal
from websocket.websocket import check_clients_connected, clients, HOST_NAME

# TID 52500038 Plus 
# TID 52500038 PIN 41 /_


# Global variables
paymentTerminalIP_Front = "192.168.68.201"
paymentTerminalIP_Back = "192.168.68.202"
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
    global order_details
    try:
        outer_data = json.loads(message)
        order_details = outer_data
        
        if "message" in outer_data:
            inner_message = json.loads(outer_data["message"])  # Parse the inner JSON
            if 'whichTerminal' in inner_message and 'totalPrice' in inner_message:
                print("Valid order data found")
                print("Payment started")
                
                # Add the client alias to order details to notify the right client later
                order_details['client_alias'] = client_alias
                
                # Convert totalPrice to cents
                total_price_cents = int(round(inner_message['totalPrice'] * 100))
                terminal = paymentTerminalFront if inner_message['whichTerminal'] == 'front' else paymentTerminalBack
                result = await terminal.auth_payment(total_price_cents, order_details)
                
                # Send the result to the client that sent the order
                await notify_client_payment_status(client_alias, result, clients, host_name)
            else:
                print("Order data is missing 'whichTerminal' or 'totalPrice'")
        else:
            print("Outer data is missing 'message' key")
    except json.JSONDecodeError:
        print("Error: Received message is not valid JSON.")

async def notify_client_payment_status(client_alias, result, clients, host_name):
    if client_alias in clients:
        client = clients[client_alias]
        try:
            # Prepare the result message (success or failure)
            result_message = json.dumps({"from": host_name, "payment_status": result})
            
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