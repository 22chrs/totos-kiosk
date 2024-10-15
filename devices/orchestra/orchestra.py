# orchestra.py

import os
import json
import shutil
import re
import asyncio
import aiofiles
from watchgod import awatch, Change
import portalocker
from websocket.websocket import send_message_from_host  # Ensure this is an async function
from payment.payment_lib import (
    paymentTerminalFront,
    paymentTerminalBack,
    paymentTerminalIP_Front,
    paymentTerminalIP_Back,
)
from usbserial.usbserial import incoming_stamp_futures

def get_terminal_ip(which_terminal):
    if which_terminal.lower() == 'front':
        return paymentTerminalIP_Front
    elif which_terminal.lower() == 'back':
        return paymentTerminalIP_Back
    else:
        raise ValueError(f"Unknown terminal identifier: {which_terminal}")

async def move_file(file_path, target_dir):
    loop = asyncio.get_event_loop()
    try:
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
        await loop.run_in_executor(None, shutil.move, file_path, target_dir)
        print(f"Moved file {file_path} to {target_dir}")
    except Exception as e:
        print(f"Failed to move file {file_path} to {target_dir}: {e}")

async def process_order(file_path, active_orders_file, failed_dir, current_dir):
    print(f"Processing new order file: {file_path}")
    try:
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            content = await f.read()
            order_data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON from {file_path}: {e}")
        await move_file(file_path, failed_dir)
        return
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        await move_file(file_path, failed_dir)
        return

    payment_status = order_data.get('payment', {}).get('status') or order_data.get('reservation', {}).get('status')
    if payment_status != "00":
        print(f"Payment status is not '00' (status: {payment_status}), moving file to failed directory.")
        await move_file(file_path, failed_dir)
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
                function_calls.extend(generate_drink_recipe(
                    product_name,
                    choosen_size,
                    choosen_sugar,
                    choosen_mug,
                    choosen_lid,
                    which_terminal,
                    RoboCube,
                    receipt_number,
                    amount_in_cents,
                    is_last_product=is_last
                ))
        elif product_category == "Snacks":
            for q in range(quantity):
                is_last = is_last_product and (q == quantity - 1)
                function_calls.extend(generate_snack_recipe(
                    product_name,
                    which_terminal,
                    RoboCube,
                    receipt_number,
                    amount_in_cents,
                    is_last_product=is_last
                ))
        else:
            print(f"Unknown product category: {product_category}")
            
    print(f"Receipt Number: {receipt_number}")

    # Append function calls to activeOrders file with file locking
    await update_active_orders(order_data, function_calls, active_orders_file)

def generate_drink_recipe(product_name, choosen_size, choosen_sugar, choosen_mug, choosen_lid, which_terminal, RoboCube, receipt_number, amount_in_cents, is_last_product=False):
    recipe = []
    #! recipe.append(f"ServiceCube: askForCup('{choosen_mug}', '{choosen_size}') => 'initialCupPosition'")
    #! recipe.append(f"{RoboCube}: fireLED()") #! TEMP
    #! recipe.append(f"ServiceCube: provideCup('{choosen_mug}', '{choosen_size}', 'initialCupPosition') => 'minimumLagerbestandCup'")
    recipe.append(f"{RoboCube}:  moveDevice('Becherschubse', '600', '100', '100', '50')")
    recipe.append("RoboCubeBack:  moveDevice('Becherschubse', '600', '100', '100', '100')")
    recipe.append("RoboCubeBack:  moveDevice('Schleuse', '100', '100', '100', '20')")
    recipe.append("RoboCubeFront:  moveDevice('Schleuse', '50', '100', '100', '1')")
    recipe.append("RoboCubeFront:  moveDevice('Shield', '100', '100', '100', '100')")
    recipe.append("RoboCubeFront:  moveDevice('Schleuse', '0', '100', '100', '10')")
    recipe.append("RoboCubeFront:  moveDevice('Shield', '0', '100', '100', '10')")
    recipe.append("RoboCubeFront:  moveDevice('Becherschubse', '0', '100', '100', '10')")
    recipe.append("RoboCubeBack:  moveDevice('Becherschubse', '0', '100', '100', '10')")
    recipe.append("RoboCubeBack:  moveDevice('Shield', '0', '100', '100', '10')")
    recipe.append("RoboCubeBack:  moveDevice('Schleuse', '0', '100', '100', '10')")
    #! recipe.append(f"{RoboCube}:  moveDevice('Becherschubse', '0', '100', '100', '100')")
    #! recipe.append(f"{RoboCube}:  moveDevice('Becherschubse', '600', '100', '100', '100')")
    #! recipe.append(f"{RoboCube}:  moveDevice('Becherschubse', '0', '100', '100', '100')")
    #! recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '?->Becherkarusell('initialCupPosition')')")
    #! recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Close')")
    if choosen_sugar != 'zero':
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Becherkarusell->BecherschubseLiftPosition')")
        recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Open')")
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Becherschubse->BecherschubseLiftPositionNotDisturbing')")
        recipe.append(f"{RoboCube}: moveBecherschubse('SugarPosition')')")
        recipe.append(f"{RoboCube}: insertSugar('{choosen_sugar}')")
        recipe.append(f"{RoboCube}: moveBecherschubse('LiftPosition')")
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', '?->BecherschubseLiftPosition')")
        recipe.append(f"Gripper: moveGripper('{choosen_mug}', '{choosen_size}', 'Close')")
        recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'BecherschubseLiftPosition->Coffeemachine')")
        recipe.append(f"{RoboCube}: waitForBecherschubse('LiftPosition')")
    #! else:
        #! recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', 'ServiceCube('initialCupPosition')->Coffeemachine')")
    #! recipe.append(f"Coffeemachine: prepareDrink('{product_name}', '{choosen_size}')")
    #! recipe.append(f"Toto: moveToto('{choosen_mug}', '{choosen_size}', '{which_terminal}', 'Coffeemachine->BecherschubseLiftPosition')")
    if choosen_lid == 'mitDeckel':
        recipe.append(f"ServiceCube: askForLid('{choosen_lid}', '{choosen_size}') => 'initialLidPosition'")
        recipe.append(f"ServiceCube: provideLid('{choosen_lid}', '{choosen_size}', 'initialLidPosition') => minimumLagerbestandLid")
        recipe.append(f"Toto: moveToto('{choosen_lid}', '{choosen_size}', '?->Becherkarusell('initialLidPosition')')")
        recipe.append(f"Gripper: moveGripper('{choosen_lid}', '{choosen_size}', 'Close')")
        recipe.append(f"Toto: moveToto('{choosen_lid}', '{choosen_size}', 'Becherkarusell('initialLidPosition')->BecherschubseLiftPosition')')")
        recipe.append(f"{RoboCube}: moveBecherschubseAndPressLid('Zuckerposition')")
    #! recipe.append(f"{RoboCube}: moveBecherschubseAndCloseSchleuse('Ausgabepostion') => 'isSensorSuccess'")
    #! recipe.append(f"Coffeemachine: showFinalDisplayMessageOnCoffeemaschine('{which_terminal}', 'isSensorSuccess')")
    #! recipe.append(f"{RoboCube}: openAusgabe('isSensorSuccess')")
    #! recipe.append(f"{RoboCube}: checkAusgabeEmpty() => 'isAusgabeEmpty'")
    if is_last_product:
        recipe.append(f"Payment: BookTotal('{which_terminal}', '{receipt_number}', '{amount_in_cents}', 'isSensorSuccess')")
    return recipe

def generate_snack_recipe(product_name, which_terminal, RoboCube, receipt_number, amount_in_cents, is_last_product=False):
    recipe = []
    recipe.append(f"{RoboCube}:  moveDevice('Becherschubse', '0', '100', '100', '100')")
    #! recipe.append(f"RoboCubeFront: moveSnackbar('{product_name}')')")
    #! recipe.append(f"Toto: moveToto('?->PopelSnackOut')")
    #! recipe.append(f"Gripper: moveGripper('{product_name}', 'Close')")
    #! recipe.append(f"{RoboCube}: moveBecherschubse('LiftPositionSnack')")
    #! recipe.append(f"Toto: moveToto('{which_terminal}', 'PopeledSnackOut->LiftPositionSnack')")
    #! recipe.append(f"Gripper: moveGripper('{product_name}', 'Open')")
    #! recipe.append(f"Toto: moveToto('{which_terminal}', 'LiftPositionSnack->LiftPositionSnackNotDisturbing')")
    #! recipe.append(f"{RoboCube}: moveBecherschubseAndCloseSchleuse('AusgabepostionSnacks') => 'isSensorSuccess'")
    #! recipe.append(f"Coffeemachine: showFinalDisplayMessageOnCoffeemaschine('{which_terminal}', 'isSensorSuccess')")
    #! recipe.append(f"{RoboCube}: openAusgabe('isSensorSuccess')")
    if is_last_product:
        recipe.append(f"Payment: BookTotal('{which_terminal}', '{receipt_number}', '{amount_in_cents}', 'isSensorSuccess')")
    return recipe

async def append_to_locked_file(filename, data, mode='a', encoding='utf-8'):
    loop = asyncio.get_event_loop()
    def write():
        with open(filename, mode, encoding=encoding) as f:
            portalocker.lock(f, portalocker.LOCK_EX)
            f.write(data)
            f.flush()
            portalocker.unlock(f)
    await loop.run_in_executor(None, write)

async def update_active_orders(order_data, function_calls, active_orders_file):
    receipt_number = order_data.get('payment', {}).get('receipt_number') or order_data.get('reservation', {}).get('receipt_number')
    time_stamp_order = order_data.get('Order Details', {}).get('timeStampOrder')
    which_terminal = order_data.get('Order Details', {}).get('whichTerminal')

    data_to_write = f"# receiptNumber: {receipt_number}, Timestamp: {time_stamp_order}, Terminal: {which_terminal}\n"
    for call in function_calls:
        data_to_write += call + '\n'
    data_to_write += '\n'

    await append_to_locked_file(active_orders_file, data_to_write)

async def process_active_orders(active_orders_file, teensy_controller):
    while True:
        try:
            tasks_to_schedule = await process_active_orders_file(active_orders_file)
            for task in tasks_to_schedule:
                if task[0] == 'send_message_via_serial':
                    client_alias, message = task[1], task[2]
                    timestampTask = await teensy_controller.send_gerneral_serial_message(client_alias, message)
                    
                    # Create a Future and store it
                    future = asyncio.get_event_loop().create_future()
                    incoming_stamp_futures[timestampTask] = future
                    
                    # Wait for the acknowledgment
                    try:
                        result = await asyncio.wait_for(future, timeout=60) #! ###
                        if result == "SUCCESS":
                            print(f"Command '{message}' executed successfully.")
                            # Proceed with next steps
                        elif result == "FAIL":
                            print(f"Command '{message}' failed.")
                            # Handle failure accordingly
                    except asyncio.TimeoutError:
                        print(f"Timeout waiting for response to timestamp {timestampTask}")
                        # Handle timeout
                elif task[0] == 'payment':
                    message = task[1]
                    order = task[2]  # Access the order data
                    line_index = task[3]  # Line index in active_orders_file
                    # Start payment processing in the background
                    asyncio.create_task(process_payment_task(message, order, line_index, active_orders_file))
                else:
                    print(f"Unknown task type: {task[0]}")
        except Exception as e:
            print(f"Error processing active orders: {e}")
        await asyncio.sleep(0.05)

async def process_payment_task(message, order, line_index, active_orders_file):
    match = re.match(r"BookTotal\('(\w+)',\s*'(\w+)',\s*'(\d+)',\s*'(\w+)'\)", message)
    if match:
        which_terminal_msg, receipt_no, amount_str, status = match.groups()
        amount = int(amount_str)
        if which_terminal_msg.lower() == 'front':
            payment_terminal = paymentTerminalFront
        elif which_terminal_msg.lower() == 'back':
            payment_terminal = paymentTerminalBack
        else:
            print(f"Unknown terminal identifier: {which_terminal_msg}")
            return
        result = await payment_terminal.book_total(which_terminal_msg, receipt_no, amount)
        if result:
            print(f"Called book_total for terminal: {which_terminal_msg}, receipt_no: {receipt_no}, amount: {amount}")
            #print(f"{result}")
            # Move the order file after successful payment
            receipt_number = order['receipt_number']
            which_terminal = order['which_terminal']
            time_stamp_order = order['timestamp']
            order_filename = f"{time_stamp_order}_{which_terminal}_{receipt_number}.json"
            order_file_path = os.path.join('Orders', 'ActiveOrders', order_filename)
            if os.path.exists(order_file_path):
                target_dir = os.path.join('Orders', 'SucceedOrders')
                if not os.path.exists(target_dir):
                    os.makedirs(target_dir)
                shutil.move(order_file_path, target_dir)
                print(f"Moved file {order_file_path} to {target_dir}")
            #else:
            #    print(f"No order file found: {order_file_path}")
            # Update the line in active_orders_file from '-># ' to '#-># '
            await update_line_marker(active_orders_file, line_index, '-> #', '# -> #')
        else:
            print(f"BookTotal failed for terminal: {which_terminal_msg}, receipt_no: {receipt_no}")
    else:
        print(f"Invalid Payment BookTotal message format: {message}")

async def homeAllDevices(teensy_controller, whichBoard):
    if whichBoard == "RoboCubeFront":
        devices = ["Shield", "Schleuse", "Becherschubse", "Snackbar"]
        print("ToHome: RoboCubeFront")
    elif whichBoard == "RoboCubeBack":
        devices = ["Shield", "Schleuse", "Becherschubse"]
        print("ToHome: RoboCubeBack")
    elif whichBoard == "ServiceCube":
        devices = ["Lift_A", "Rodell_A", "Lift_B", "Rodell_B", "Lift_C", "Rodell_C"]
        print("ToHome: ServiceCube")
    else:
        print(f"Unknown board: {whichBoard}")
        return "FAIL"

    all_homed_successfully = True

    for device in devices:
        message = f"homeDevice('{device}')"
        timestampTask = await teensy_controller.send_gerneral_serial_message(whichBoard, message)

        # Create a Future and store it
        future = asyncio.get_event_loop().create_future()
        incoming_stamp_futures[timestampTask] = future

        # Wait for the acknowledgment with a timeout of 60 seconds
        try:
            result = await asyncio.wait_for(future, timeout=60)
            if result == "SUCCESS":
                print(f"Command '{message}' executed successfully.")
            elif result == "FAIL":
                print(f"Command '{message}' failed.")
                all_homed_successfully = False
                break  # Stop proceeding to next devices
        except asyncio.TimeoutError:
            print(f"Timeout waiting for response to timestamp {timestampTask}")
            all_homed_successfully = False
            break  # Stop proceeding

    if all_homed_successfully:
        return "SUCCESS"
    else:
        return "FAIL"

async def update_line_marker(filename, line_index, old_marker, new_marker):
    loop = asyncio.get_event_loop()
    def update_line():
        with open(filename, 'r+', encoding='utf-8') as f:
            portalocker.lock(f, portalocker.LOCK_EX)
            lines = f.readlines()
            if line_index < len(lines):
                line = lines[line_index]
                if line.startswith(old_marker):
                    lines[line_index] = line.replace(old_marker, new_marker, 1)
                    f.seek(0)
                    f.truncate()
                    f.writelines(lines)
                else:
                    print(f"Line at index {line_index} does not start with '{old_marker}'")
            else:
                print(f"Line index {line_index} out of range")
            portalocker.unlock(f)
    await loop.run_in_executor(None, update_line)

async def process_active_orders_file(active_orders_file):
    loop = asyncio.get_event_loop()
    def process_file():
        tasks_to_schedule = []
        with open(active_orders_file, 'r+', encoding='utf-8') as f:
            portalocker.lock(f, portalocker.LOCK_EX)
            lines = f.readlines()
            orders = []
            current_order = None
            for i, line in enumerate(lines):
                stripped_line = line.strip()
                if stripped_line.startswith('# receiptNumber:'):
                    match = re.match(r'# receiptNumber: (\S+), Timestamp: (\S+), Terminal: (\S+)', stripped_line)
                    if match:
                        receipt_number = match.group(1)
                        time_stamp_order = match.group(2)
                        which_terminal = match.group(3)
                        current_order = {
                            'receipt_number': receipt_number,
                            'timestamp': time_stamp_order,
                            'which_terminal': which_terminal,
                            'lines': [],
                            'line_indices': []
                        }
                        orders.append(current_order)
                elif current_order is not None:
                    current_order['lines'].append(stripped_line)
                    current_order['line_indices'].append(i)
            processed = False
            for order in orders:
                for j, line in enumerate(order['lines']):
                    i = order['line_indices'][j]
                    if line == '':
                        continue
                    if not line.startswith('#') and not line.startswith('-> #'):
                        if 'START' in line:
                            pass
                        else:
                            if ":" in line:
                                client_alias, rest_of_line = line.split(":", 1)
                                client_alias = client_alias.strip()
                                rest_of_line = rest_of_line.lstrip()
                                if " =>" in rest_of_line:
                                    message, _ = rest_of_line.split(" =>", 1)
                                else:
                                    message = rest_of_line
                                if client_alias in ["app_front", "app_back"]: # Websocket
                                    lines[i] = '# ' + lines[i]
                                    tasks_to_schedule.append(('send_message_via_websocket', client_alias, message))
                                elif client_alias in ["RoboCubeFront", "RoboCubeBack", "ServiceCube"]: # USB #! ###
                                    lines[i] = '# ' + lines[i]
                                    tasks_to_schedule.append(('send_message_via_serial', client_alias, message))
                                elif client_alias in ["Toto", "Gripper", "Coffeemachine"]: # RS485
                                    lines[i] = '# ' + lines[i]
                                    print(f"// Noch nicht implementiert: {client_alias}: {message}")
                                elif client_alias in ["Toto"]: # Toto
                                    lines[i] = '# ' + lines[i]
                                    print(f"// Noch nicht implementiert: {client_alias}: {message}")
                                elif client_alias == "Payment":
                                    lines[i] = '-> # ' + lines[i]
                                    tasks_to_schedule.append(('payment', rest_of_line, order, i))  # Include line index
                                else:
                                    lines[i] = '### FAILED // Unknown Client Alias  # ' + lines[i]
                                    print(f"Unknown Client Alias: {client_alias}")
                            else:
                                print(f"Processed line does not contain ':': {line}")
                        processed_line = line
                        processed = True
                        break
                if processed:
                    break
            if processed:
                f.seek(0)
                f.truncate()
                f.writelines(lines)
            # else:
            #     print("No active orders to process.")
            portalocker.unlock(f)
        return tasks_to_schedule
    tasks = await loop.run_in_executor(None, process_file)
    return tasks

async def watch_orders_directory(orders_dir, active_orders_file, failed_dir, current_dir):
    async for changes in awatch(orders_dir):
        for change_type, file_path in changes:
            if change_type == Change.added and file_path.endswith('.json'):
                print(f"Detected new order file: {file_path}")
                await process_order(file_path, active_orders_file, failed_dir, current_dir)

async def start_orchestra(
    orders_dir='Orders/ActiveOrders',
    active_orders_file='Orders/ActiveOrders/activeOrders.log',
    failed_dir='Orders/FailedOrders',
    current_dir='Orders/SucceedOrders',
    teensy_controller=None  
):
    orders_dir = os.path.abspath(orders_dir)
    failed_dir = os.path.abspath(failed_dir)
    current_dir = os.path.abspath(current_dir)

    print(f"Starting Orchestra with:")
    print(f"  Orders Directory: {orders_dir}")
    print(f"  Active Orders File: {active_orders_file}")
    print(f"  Failed Directory: {failed_dir}")
    print(f"  Processed Orders Directory: {current_dir}")

    if not os.path.exists(orders_dir):
        os.makedirs(orders_dir)
        print(f"Created orders directory: {orders_dir}")
    if not os.path.exists(failed_dir):
        os.makedirs(failed_dir)
        print(f"Created failed directory: {failed_dir}")
    if not os.path.exists(current_dir):
        os.makedirs(current_dir)
        print(f"Created processed directory: {current_dir}")

    # Ensure the active_orders_file exists
    if not os.path.exists(active_orders_file):
        async with aiofiles.open(active_orders_file, 'w', encoding='utf-8') as f:
            pass  # Create an empty file
        print(f"Created active orders file: {active_orders_file}")

    print("Orchestra started. Monitoring for new orders...")

    # Start the process_active_orders coroutine and the directory watcher
    try:
        await asyncio.gather(
            process_active_orders(active_orders_file, teensy_controller),
            watch_orders_directory(orders_dir, active_orders_file, failed_dir, current_dir)
        )
    except KeyboardInterrupt:
        print("Stopping Orchestra...")

    print("Orchestra stopped.")

if __name__ == "__main__":
    asyncio.run(start_orchestra())
