# orchestra.py

import os
import json
import time
import shutil
import portalocker
import re  
import asyncio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from websocket.websocket import send_message_from_host  # Import send_message_from_host function
from payment.payment_management import book_total

# TOTO / GREIFER
# KAFFEEMASCHINE
# BECHERKARUSELL
# ROBO CUBE FRONT
# ROBO CUBE FRONT
# SCNACKBAR

class OrderHandler(FileSystemEventHandler):
    def __init__(self, orders_dir, active_orders_file, failed_dir, current_dir):
        self.orders_dir = orders_dir
        self.active_orders_file = active_orders_file
        self.failed_dir = failed_dir
        self.current_dir = current_dir  # Add this line

    def on_created(self, event):
        if event.is_directory:
            return None
        else:
            # Only process files ending with '.json'
            if not event.src_path.endswith('.json'):
                return
            # Wait briefly to ensure the file is fully written
            time.sleep(1)
            self.process_order(event.src_path)

    def process_order(self, file_path):
        print(f"Processing new order file: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                order_data = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Failed to decode JSON from {file_path}: {e}")
                self.move_file(file_path, self.failed_dir)
                return

        payment_status = order_data.get('payment', {}).get('status') or order_data.get('reservation', {}).get('status')
        if payment_status != "00":
            print(f"Payment status is not '00' (status: {payment_status}), moving file to failed directory.")
            self.move_file(file_path, self.failed_dir)
            return  # Do not process further

        payment_status = order_data.get('payment', {}).get('status') or order_data.get('reservation', {}).get('status')
        if payment_status != "00":
            print(f"Payment status is not '00' (status: {payment_status}), moving file to failed directory.")
            self.move_file(file_path, self.failed_dir)
            return  # Do not process further

        order_details = order_data.get("Order Details", {})
        products = order_data.get("products", [])

        # Extract the receipt_number from the payment section
        receipt_number = order_data.get("payment", {}).get("receipt_number") or order_data.get("reservation", {}).get("receipt_number")
        amount_in_cents = order_data.get("payment", {}).get("amount_in_cents") or order_data.get("reservation", {}).get("amount_in_cents")

        # Generate function calls based on products
        function_calls = []

        for index, product in enumerate(products):
            product_name = product.get("productName")
            product_category = product.get("productCategory")
            quantity = product.get("quantity", 1)
            choosen_size = product.get("choosenSize")
            choosen_sugar = product.get("choosenSugar")
            choosen_mug = product.get("choosenMug")
            choosen_lid = product.get("choosenLid")

            which_terminal = order_details.get("whichTerminal")
            if which_terminal == "front":
                RoboCube = "RoboCubeFront"
            elif which_terminal == "back":
                RoboCube = "RoboCubeBack"
            else:
                RoboCube = "Error"

            # Determine if this is the last product in the list
            is_last_product = (index == len(products) - 1)

            if product_category in ["Kaffee", "Trinkschoki"]:
                for q in range(quantity):
                    # Determine if this is the last quantity of the last product
                    is_last = is_last_product and (q == quantity - 1)
                    function_calls.extend(self.generate_drink_recipe(
                        product_name,
                        choosen_size,
                        choosen_sugar,
                        choosen_mug,
                        choosen_lid,
                        which_terminal,
                        RoboCube,
                        receipt_number,
                        amount_in_cents,
                        is_last_product=is_last  # Pass the flag here
                    ))
            elif product_category == "Snacks":
                for q in range(quantity):
                    # Determine if this is the last quantity of the last product
                    is_last = is_last_product and (q == quantity - 1)
                    function_calls.extend(self.generate_snack_recipe(
                        product_name,
                        which_terminal,
                        RoboCube,
                        receipt_number,
                        amount_in_cents,
                        is_last_product=is_last  # Pass the flag here
                    ))
            else:
                print(f"Unknown product category: {product_category}")
                
        # You can now use the receipt_number in your function calls or logging
        print(f"Receipt Number: {receipt_number}")  # Example of how to use it

        # Append function calls to activeOrders file with file locking
        self.update_active_orders(order_data, function_calls)

    #! REZEPT GETRÄNK
    def generate_drink_recipe(self, product_name, choosen_size, choosen_sugar, choosen_mug, choosen_lid, which_terminal, RoboCube, receipt_number, amount_in_cents, is_last_product=False):
        recipe = []
        recipe.append(f"ServiceCube: askForCup('{choosen_mug}', '{choosen_size}') => 'initialCupPosition'") # Fragen ob und wo ein Becher ist
        recipe.append(f"ServiceCube: provideCup('{choosen_mug}', '{choosen_size}', 'initialCupPosition') => 'minimumLagerbestandCup'") # Becher hochfahren und freigeben
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '?->Becherkarusell('initialCupPosition')')") # Toto zur entsprechenden Becherposition fahren
        recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Close')") # Becher greifen
        if choosen_sugar != 'zero':
            recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Becherkarusell->BecherschubseLiftPosition')")
            recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Open')") # Becher loslassen
            recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Becherschubse->BecherschubseLiftPositionNotDisturbing')")
            recipe.append(f"{RoboCube}: moveBecherschubse('SugarPosition')')")
            recipe.append(f"{RoboCube}: insertSugar('{choosen_sugar}')")
            recipe.append(f"{RoboCube}: moveBecherschubse('LiftPosition')") # Becherschubse zur Becheraufnahme bereitstellen #! nicht warten bis diese dort ist
            recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', '?->BecherschubseLiftPosition')")
            recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Close')") # Becher greifen
            recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'BecherschubseLiftPosition->Coffeemachine')")
            recipe.append(f"{RoboCube}: waitForBecherschubse('LiftPosition')") # check ob Becherschubse beretisteht und ggf. warten bis
        else:
            recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', 'ServiceCube('initialCupPosition')->Coffeemachine')")
        recipe.append(f"Coffeemachine: prepareDrink('{product_name}', '{choosen_size}')")
        #recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Open')") # Becher greifen
        #recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Coffeemachine->CoffeemachineNotDisturbing')")
        #recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Open')") # Becher öffnen
        #recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', '?->Coffeemachine')")
        #recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Close')") # Becher greifen
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Coffeemachine->BecherschubseLiftPosition')")
        if choosen_lid == 'mitDeckel':
            recipe.append(f"ServiceCube: askForLid('{choosen_lid}', '{choosen_size}') => 'initialLidPosition'") # Fragen ob und wo ein Deckel ist
            recipe.append(f"ServiceCube: provideLid('{choosen_lid}', '{choosen_size}', 'initialLidPosition') => minimumLagerbestandLid") # Deckel hochfahren und freigeben
            recipe.append(f"Toto: moveToto('{choosen_lid}', '{choosen_size}', '?->Becherkarusell('initialLidPosition')')") # Toto zur entsprechenden Becherposition fahren
            recipe.append(f"Gripper: moveGripper('{choosen_lid}', '{choosen_size}', 'Close')") # Becher greifen
            recipe.append(f"Toto: moveToto('{choosen_lid}', '{choosen_size}', 'Becherkarusell('initialLidPosition')->BecherschubseLiftPosition')')") # Toto zur entsprechenden Becherposition fahren
            recipe.append(f"{RoboCube}: moveBecherschubseAndPressLid('Zuckerposition')")
        recipe.append(f"{RoboCube}: moveBecherschubseAndCloseSchleuse('Ausgabepostion') => 'isSensorSuccess'")
        recipe.append(f"Coffeemachine: showFinalDisplayMessageOnCoffeemaschine('{which_terminal}', 'isSensorSuccess')")
        recipe.append(f"{RoboCube}: openAusgabe('isSensorSuccess')")
        recipe.append(f"{RoboCube}: checkAusgabeEmpty() => 'isAusgabeEmpty'") #! Not Waiting but checking periodically
        if is_last_product:
            recipe.append(f"Payment: BookTotal('{which_terminal}', '{receipt_number}', '{amount_in_cents}', 'isSensorSuccess')")
        return recipe
    

    #! REZEPT SNACK
    def generate_snack_recipe(self, product_name, which_terminal, RoboCube, receipt_number, amount_in_cents, is_last_product=False):
        recipe = []
        recipe.append(f"RoboCubeFront: moveSnackbar('{product_name}')')")
        recipe.append(f"Toto: moveToto('?->PopelSnackOut')") # Toto zur entsprechenden Becherposition fahren
        recipe.append(f"Gripper: moveGripper('{product_name}', 'Close')") # Becher greifen
        recipe.append(f"{RoboCube}: moveBecherschubse('LiftPositionSnack')") # Becherschubse zur Becheraufnahme bereitstellen #! nicht warten bis diese dort ist
        recipe.append(f"Toto: moveToto('{which_terminal}', 'PopeledSnackOut->LiftPositionSnack')")
        recipe.append(f"Gripper: moveGripper('{product_name}', 'Open')") # Becher greifen
        recipe.append(f"Toto: moveToto('{which_terminal}', 'LiftPositionSnack->LiftPositionSnackNotDisturbing')")
        recipe.append(f"{RoboCube}: moveBecherschubseAndCloseSchleuse('AusgabepostionSnacks') => 'isSensorSuccess'")
        recipe.append(f"Coffeemachine: showFinalDisplayMessageOnCoffeemaschine('{which_terminal}', 'isSensorSuccess')")
        recipe.append(f"{RoboCube}: openAusgabe('isSensorSuccess')")
        if is_last_product:
             recipe.append(f"Payment: BookTotal('{which_terminal}', '{receipt_number}', '{amount_in_cents}', 'isSensorSuccess')")
        return recipe
    #! ENDE REZEPT COFFEE !#

    def update_active_orders(self, order_data, function_calls):
        receipt_number = order_data.get('payment', {}).get('status') or order_data.get('reservation', {}).get('status')
        time_stamp_order = order_data.get('Order Details', {}).get('timeStampOrder')

        # Use file locking when writing to the active_orders_file
        with open(self.active_orders_file, 'a', encoding='utf-8') as f:
            try:
                portalocker.lock(f, portalocker.LOCK_EX)
                f.write(f"# receiptNumber: {receipt_number}, Timestamp: {time_stamp_order}\n")
                for call in function_calls:
                    f.write(call + '\n')
                f.write('\n')
            finally:
                portalocker.unlock(f)

    def move_file(self, file_path, target_dir):
        try:
            if not os.path.exists(target_dir):
                os.makedirs(target_dir)
            shutil.move(file_path, target_dir)
            print(f"Moved file {file_path} to {target_dir}")
        except Exception as e:
            print(f"Failed to move file {file_path} to {target_dir}: {e}")

async def process_active_orders(active_orders_file):
    """
    Periodically scans the active_orders_file, finds the first unprocessed line,
    marks it as processed, and sends the line via websocket.
    """
    while True:
        # Initialize variables at the start of each loop
        processed_line = None
        client_alias = None
        message = None
        try:
            # Acquire exclusive lock for reading and writing
            with open(active_orders_file, 'r+', encoding='utf-8') as f:
                portalocker.lock(f, portalocker.LOCK_EX)
                lines = f.readlines()
                processed = False
                for i, line in enumerate(lines):
                    stripped_line = line.strip()
                    if stripped_line == '':
                        continue
                    if not stripped_line.startswith('#'):
                        # Mark line as processed
                        lines[i] = '# ' + line
                        processed_line = stripped_line
                        processed = True
                        break
                if processed:
                    # Move file pointer to the beginning
                    f.seek(0)
                    f.truncate()
                    f.writelines(lines)
                # No need to unlock; 'with' statement handles it

            if processed:
                try:
                    print(f"Processed line: {processed_line}")
                    # Determine the client alias from the line
                    if ":" in processed_line:
                        client_alias, rest_of_line = processed_line.split(":", 1)
                        client_alias = client_alias.strip()
                        rest_of_line = rest_of_line.lstrip()
                        # Extract the message to send
                        if " =>" in rest_of_line:
                            message, _ = rest_of_line.split(" =>", 1)
                        else:
                            message = rest_of_line
                        # Send the message asynchronously
                        if client_alias in ["RoboCubeFront", "RoboCubeBack", "ServiceCube", "app_front", "app_back"]:
                            await send_message_from_host(client_alias, message)
                        elif client_alias == "Coffeemachine":
                            print("Kommunikation Kaffeemaschine noch nicht ready")
                        elif client_alias == "Toto":
                            print("Kommunikation Toto noch nicht ready")
                        elif client_alias == "Gripper":
                            print("Kommunikation Greifer noch nicht ready")
                        elif client_alias == "Payment":
                            # Expected message format: BookTotal('front', '30', '501', 'isSensorSuccess')
                            match = re.match(r"BookTotal\('(\w+)',\s*'(\w+)',\s*'(\d+)',\s*'(\w+)'\)", message)
                            if match:
                                which_terminal, receipt_no, amount_str, status = match.groups()
                                amount = int(amount_str)

                                # Call the book_total function from payment_management
                                result = book_total(which_terminal, receipt_no, amount)

                                # Notify the client about the BookTotal result
                                #await notify_client_payment_status(client_alias, result, clients, host_name)
                                print(f"Called book_total for terminal: {which_terminal}, receipt_no: {receipt_no}, amount: {amount}")
                                print(f"{result}")
                            else:
                                print(f"Invalid Payment BookTotal message format: {message}")
                                print(f"{result}")
                                #await notify_client_payment_status(client_alias, "Invalid BookTotal message format", clients, host_name)
                        else:
                            print(f"Unknown Client Alias: {client_alias}")
                    else:
                        print(f"Processed line does not contain ':': {processed_line}")
                except Exception as e:
                    print(f"Error processing line: {e}")
            else:
                print("No active orders to process.")
        except Exception as e:
            print(f"Error reading active orders: {e}")

        # Wait before next check
        await asyncio.sleep(1)

async def start_orchestra(orders_dir='Orders/ActiveOrders', active_orders_file='Orders/ActiveOrders/activeOrders.log', failed_dir='Orders/FailedOrders', current_dir='Orders/ProcessedOrders'):
    orders_dir = os.path.abspath(orders_dir)
    failed_dir = os.path.abspath(failed_dir)
    current_dir = os.path.abspath(current_dir)  # Add this line

    print(f"Starting Orchestra with:")
    print(f"  Orders Directory: {orders_dir}")
    print(f"  Active Orders File: {active_orders_file}")
    print(f"  Failed Directory: {failed_dir}")
    print(f"  Processed Orders Directory: {current_dir}")  # Add this line

    if not os.path.exists(orders_dir):
        os.makedirs(orders_dir)
        print(f"Created orders directory: {orders_dir}")
    if not os.path.exists(failed_dir):
        os.makedirs(failed_dir)
        print(f"Created failed directory: {failed_dir}")
    if not os.path.exists(current_dir):  # Add this check
        os.makedirs(current_dir)
        print(f"Created processed directory: {current_dir}")

    event_handler = OrderHandler(orders_dir, active_orders_file, failed_dir, current_dir)  # Pass current_dir
    observer = Observer()
    observer.schedule(event_handler, path=orders_dir, recursive=False)
    observer.start()

    print("Orchestra started. Monitoring for new orders...")

    try:
        # Start the process_active_orders coroutine
        await process_active_orders(active_orders_file)
    except KeyboardInterrupt:
        print("Stopping Orchestra...")
        observer.stop()
    observer.join()
    print("Orchestra stopped.")

if __name__ == "__main__":
    asyncio.run(start_orchestra())