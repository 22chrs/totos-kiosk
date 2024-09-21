import os
import json
import time
import shutil
import portalocker
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class OrderHandler(FileSystemEventHandler):
    def __init__(self, orders_dir, active_orders_file, handled_dir):
        self.orders_dir = orders_dir
        self.active_orders_file = active_orders_file
        self.handled_dir = handled_dir

    def on_created(self, event):
        if event.is_directory:
            return None
        else:
            # Wait briefly to ensure the file is fully written
            time.sleep(1)
            self.process_order(event.src_path)

    def process_order(self, file_path):
        print(f"Processing new order file: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as f:
            order_data = json.load(f)

        order_details = order_data.get("Order Details", {})
        products = order_data.get("products", [])

        # Generate function calls based on products
        function_calls = []
        for product in products:
            product_name = product.get("productName")
            product_category = product.get("productCategory")
            quantity = product.get("quantity", 1)
            choosen_size = product.get("choosenSize")
            choosen_sugar = product.get("choosenSugar")
            choosen_mug = product.get("choosenMug")
            choosen_lid = product.get("choosenLid")
            which_terminal = order_details.get("whichTerminal", "front")

            if product_category in ["Kaffee", "Trinkschoki"]:
                for _ in range(quantity):
                    function_calls.extend(self.generate_coffee_recipe(
                        product_name, choosen_size, choosen_sugar, choosen_mug, choosen_lid, which_terminal
                    ))
            elif product_category == "Snacks":
                # Implement snack recipe logic here
                pass
            else:
                print(f"Unknown product category: {product_category}")

        # Append function calls to activeOrders file with file locking
        self.update_active_orders(order_details, function_calls)

        # Move the processed order file to handled directory
        try:
            if not os.path.exists(self.handled_dir):
                os.makedirs(self.handled_dir)
            shutil.move(file_path, self.handled_dir)
            print(f"Moved processed file to {self.handled_dir}")
        except Exception as e:
            print(f"Failed to move file {file_path} to {self.handled_dir}: {e}")

    def generate_coffee_recipe(self, product_name, choosen_size, choosen_sugar, choosen_mug, choosen_lid, which_terminal):
        recipe = []
        recipe.append(f"AskForCup('{choosen_mug}', '{choosen_size}')")
        recipe.append(f"ProvideMug('{choosen_mug}', '{choosen_size}')")
        recipe.append("MoveBecherschubse('LiftPosition')")
        if choosen_sugar != 'zero':
            recipe.append(f"TotoMove('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'CupFromBecherkarusellToBecherschubse')")
            recipe.append(f"MoveBecherschubse('SugarPosition', '{which_terminal}')")
            recipe.append(f"InsertSugar('{choosen_sugar}', '{which_terminal}')")
            recipe.append(f"MoveBecherschubse('LiftPosition', '{which_terminal}')")
            recipe.append(f"TotoMoveCupFromBecherschubseToCoffeemachine('{choosen_mug}', '{choosen_size}', '{which_terminal}')")
        else:
            recipe.append(f"TotoMoveCupFromBecherkarusellToCoffeemachine('{choosen_mug}', '{choosen_size}')")
        recipe.append(f"prepareDrink('{product_name}', '{choosen_size}')")
        recipe.append(f"TotoMoveCupFromCoffeemachineToBecherschubse('{choosen_mug}', '{choosen_size}', '{which_terminal}')")
        if choosen_lid == 'mitDeckel':
            recipe.append("# Additional logic for lid")  # Insert actual logic here
        elif choosen_lid == 'ohneDeckel':
            recipe.append(f"MoveBecherschubseAndCloseSchleuse('Ausgabepostion', '{which_terminal}')")
        recipe.append(f"if SensorCheckAusgabefach('{which_terminal}') == True:")
        recipe.append("    pass  # Open Ausgabe")
        recipe.append("else:")
        recipe.append(f"    ShowErrorAndSayEntschuldigung('{which_terminal}')")
        recipe.append("OpenAusgabe()")
        recipe.append("# All Ausgaben Done: ConfirmPaymentBooking(Receipt ID and Timestamp)")
        return recipe

    def update_active_orders(self, order_details, function_calls):
        order_id = order_details.get("orderID")
        time_stamp_order = order_details.get("timeStampOrder")

        # Use file locking when writing to the active_orders_file
        with open(self.active_orders_file, 'a', encoding='utf-8') as f:
            try:
                portalocker.lock(f, portalocker.LOCK_EX)
                f.write(f"# Order ID: {order_id}, Timestamp: {time_stamp_order}\n")
                for call in function_calls:
                    f.write(call + '\n')
                f.write('\n')
            finally:
                portalocker.unlock(f)

def start_orchestra(orders_dir='Orders', active_orders_file='activeOrders.txt', handled_dir='Orders/HandledOrders'):
    orders_dir = os.path.abspath(orders_dir)
    handled_dir = os.path.abspath(handled_dir)
    active_orders_file = os.path.abspath(active_orders_file)

    print(f"Starting Orchestra with:")
    print(f"  Orders Directory: {orders_dir}")
    print(f"  Active Orders File: {active_orders_file}")
    print(f"  Handled Directory: {handled_dir}")

    if not os.path.exists(orders_dir):
        os.makedirs(orders_dir)
        print(f"Created orders directory: {orders_dir}")
    if not os.path.exists(handled_dir):
        os.makedirs(handled_dir)
        print(f"Created handled directory: {handled_dir}")

    event_handler = OrderHandler(orders_dir, active_orders_file, handled_dir)
    observer = Observer()
    observer.schedule(event_handler, path=orders_dir, recursive=False)
    observer.start()

    print("Orchestra started. Monitoring for new orders...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping Orchestra...")
        observer.stop()
    observer.join()
    print("Orchestra stopped.")
