import asyncio
import os
import json
import datetime
import platform
import glob
import aiofiles

# TID 52500038 Plus #! WICHTIG 
# TID 52500041 PIN #! WICHTIG

class AcquireLockWithTimeout:
    def __init__(self, lock, timeout):
        self.lock = lock
        self.timeout = timeout
        self.acquired = False

    async def __aenter__(self):
        try:
            await asyncio.wait_for(self.lock.acquire(), timeout=self.timeout)
            self.acquired = True
            return self
        except asyncio.TimeoutError:
            self.acquired = False
            return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        if self.acquired:
            self.lock.release()

class PaymentTerminal:
    def __init__(self, ip_address_terminal, executable_name='zvt++'):
        """
        Initialize the PaymentTerminal with the given IP address and executable name.
        """
        self.executable_path = self.get_executable_path(executable_name)
        self.ip_address_terminal = ip_address_terminal
        self.current_process = None
        self._terminal_lock = asyncio.Lock()

    def get_executable_path(self, executable_name):
        """
        Determine the executable path based on system architecture.
        """
        dir_path = os.path.dirname(os.path.abspath(__file__))
        system_arch = platform.machine()
        builds_dir = os.path.join(dir_path, 'zvt++', '_builds')

        if 'arm' in system_arch or 'aarch64' in system_arch:
            suffix = 'mac' if platform.system() == 'Darwin' else 'pi5'
        elif 'x86' in system_arch or 'x86_64' in system_arch:
            suffix = 'x64'
        else:
            raise Exception(f"Unsupported architecture: {system_arch}")

        build_folder = None
        for folder in os.listdir(builds_dir):
            if suffix in folder.lower():
                build_folder = folder
                break

        if build_folder is None:
            raise Exception(f"No suitable build folder found for architecture: {system_arch}")

        executable_path = os.path.join(builds_dir, build_folder, executable_name)
        return executable_path

    async def end_of_day(self):
        """
        Perform end-of-day operation on the payment terminal.
        """
        async with self._terminal_lock:
            os.chmod(self.executable_path, 0o755)
            process = await asyncio.create_subprocess_exec(
                self.executable_path, "endOfDay", self.ip_address_terminal,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            exit_code = process.returncode
            return exit_code

    async def load_order_details(self, which_terminal, receipt_no):
        """
        Load order details from the JSON file.
        """
        base_dir = os.path.join("Orders", "ActiveOrders")
        pattern = f"*_{which_terminal}_{receipt_no}.json"
        full_pattern = os.path.join(base_dir, pattern)
        matching_files = glob.glob(full_pattern)

        if not matching_files:
            print(f"No existing order file found for whichTerminal: {which_terminal}, receipt_no: {receipt_no}")
            return {}, None
        else:
            matching_files.sort()
            order_file = matching_files[-1]
            try:
                async with aiofiles.open(order_file, 'r', encoding='utf-8') as f:
                    content = await f.read()
                    order_details = json.loads(content)
            except Exception as e:
                order_details = {}
            return order_details, order_file

    async def book_total(self, which_terminal, receipt_no, amount=None):
        """
        Book the total amount on the terminal.
        """
        try:
            if not isinstance(receipt_no, str) or not receipt_no:
                raise ValueError("Receipt number must be a non-empty string.")
            if amount is not None and (not isinstance(amount, int) or amount < 0):
                raise ValueError("Amount must be a non-negative integer representing cents.")

            max_retries = 20
            retry_delay = 0.5  # seconds
            retry_count = 0

            async with AcquireLockWithTimeout(self._terminal_lock, timeout=30) as lock:
                if not lock.acquired:
                    print("Timeout while waiting for terminal lock in book_total")
                    return False  # Or raise an exception

                while retry_count < max_retries:
                    try:
                        os.chmod(self.executable_path, 0o755)
                        cmd_args = [self.executable_path, "book_total", self.ip_address_terminal, receipt_no]
                        if amount is not None:
                            cmd_args.append(str(amount))

                        process = await asyncio.create_subprocess_exec(
                            *cmd_args,
                            stdout=asyncio.subprocess.PIPE,
                            stderr=asyncio.subprocess.PIPE
                        )
                        stdout, stderr = await process.communicate()
                        exit_code = process.returncode

                        output = stdout.decode('utf-8') + stderr.decode('utf-8')

                        if 'Nack' in output:
                            print("Received Nack, terminal might be busy. Retrying...")
                            retry_count += 1
                            await asyncio.sleep(retry_delay)
                            continue  # Retry the command
                        elif exit_code != 0:
                            print(f"Process failed with exit code: {exit_code}")
                            print(f"stderr: {stderr.decode('utf-8')}")
                            return False
                        else:
                            # Success, process the output
                            # print(f"book_total received output:\n{output}")
                            order_details, receipt_path = await self.load_order_details(which_terminal, receipt_no)
                            await self.save_receipts(output, payment_style="book_total", order_details=order_details, receipt_path=receipt_path)
                            await self.move_receipt_to_succeeded_orders(receipt_path)
                            return True

                    except Exception as e:
                        print(f"An error occurred during book_total: {e}")
                        return False
                else:
                    print("Max retries reached, failed to execute book_total")
                    return False
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

        
    async def pay(self, payment_style, amount, order_details):
        """
        Perform a payment operation on the terminal.
        """
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")
        os.chmod(self.executable_path, 0o755)

        async with AcquireLockWithTimeout(self._terminal_lock, timeout=5) as lock:
            if not lock.acquired:
                error_message = "Timeout while waiting for terminal lock in pay"
                print(error_message)
                await self.write_error_file(error_message, self.ip_address_terminal)
                return error_message

            try:
                print(f"Starting {payment_style} payment with amount: {amount}")
                process = await asyncio.create_subprocess_exec(
                    self.executable_path, payment_style, self.ip_address_terminal, str(amount),
                    stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
                )
                self.current_process = process

                print("Subprocess executed, awaiting response...")
                stdout, stderr = await process.communicate()
                self.current_process = None
                stdout_str = stdout.decode('utf-8')
                stderr_str = stderr.decode('utf-8')

                if not stdout_str and not stderr_str:
                    error_message = "No output from subprocess."
                    print(error_message)
                    await self.write_error_file(error_message, self.ip_address_terminal)
                    return "Subprocess produced no output"

                output = stdout_str + stderr_str
                parsed_output = await self.save_receipts(output, payment_style, order_details)
                return parsed_output

            except Exception as e:
                error_message = f"Error during {payment_style} payment: {e}"
                print(error_message)
                await self.write_error_file(error_message, self.ip_address_terminal)
                return error_message

    async def abort_payment(self):
        """
        Abort the ongoing payment process.
        """
        if self.current_process and self.current_process.returncode is None:
            print("Aborting payment process by killing the zvt++ binary.")
            self.current_process.kill()
            await self.current_process.wait()
            self.current_process = None
            try:
                os.chmod(self.executable_path, 0o755)
                print("Restarting the zvt++ binary.")
                # Implement restart logic if necessary
            except Exception as e:
                print(f"Failed to restart zvt++ binary: {e}")
        else:
            print("No active payment process to abort.")

    async def reversal_payment_debug(self, receipt_no):
        """
        Perform a reversal of a payment using the receipt number.
        """
        if not isinstance(receipt_no, str) or not receipt_no:
            raise ValueError("Receipt number must be a non-empty string.")

        async with self._terminal_lock:
            os.chmod(self.executable_path, 0o755)
            process = await asyncio.create_subprocess_exec(
                self.executable_path, "reversal", self.ip_address_terminal, receipt_no,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            exit_code = process.returncode
        return exit_code

    async def write_error_file(self, error_message, ip_address):
        """
        Write an error message to a file.
        """
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        base_dir = "Orders"
        error_dir = os.path.join(base_dir, "ERROR")

        os.makedirs(error_dir, exist_ok=True)

        error_filename = f"{timestamp}_ERR.txt"
        error_path = os.path.join(error_dir, error_filename)
        full_error_message = f"Error: {error_message}\nTerminal IP: {ip_address}"

        async with aiofiles.open(error_path, "w", encoding="utf-8") as file:
            await file.write(full_error_message)
        print(f"Error file saved to {error_path}")

    async def save_receipts(self, output, payment_style, order_details=None, receipt_path=None):
        """
        Save the receipt details after payment.
        """
        if order_details is None:
            order_details = {}

        payment_details = self.parse_payment_output(output)
        payment_details['payment_style'] = payment_style  # <-- Added line

        order_details['reservation'] = payment_details

        if 'message' in order_details:
            if isinstance(order_details['message'], str):
                try:
                    order_details['message'] = json.loads(order_details['message'])
                except json.JSONDecodeError:
                    print("Error decoding JSON from 'message'")
                    order_details['message'] = {}
            elif not isinstance(order_details['message'], dict):
                order_details['message'] = {}
        else:
            order_details['message'] = {}

        which_terminal = order_details.get('whichTerminal', order_details['message'].get('whichTerminal', "UnknownTerminal"))

        await self.save_receipt_to_file(which_terminal, payment_details.get('receipt_number', ''), order_details, receipt_path=receipt_path)
        return payment_details.get('status', '')

    def parse_payment_output(self, output):
        """
        Parse the output from the payment process and extract payment details.
        """
        # print(f"parse_payment_output received output:\n{output}")
        lines = output.split('\n')
        payment_details = {}

        operation_queued = False

        for line in lines:
            clean_line = line.replace('<-PT|', '').rstrip('|').strip()

            # Detect if operation was queued
            if "transaction queued" in line.lower():
                operation_queued = True
                payment_details['status'] = "Operation Queued"
                payment_details['message'] = line.strip()
                continue

            # Detect if transaction is approved after waiting
            if "transaction approved" in line.lower():
                payment_details['status'] = "00"
                continue

            # Existing parsing logic...
            if "trace" in line.lower():
                payment_details['trace'] = line.split()[-1] if len(line.split()) > 0 else ""
            if "status" in line.lower():
                payment_details['status'] = line.split()[-1] if len(line.split()) > 0 else ""
            if "expiry_date" in clean_line.lower():
                payment_details['expiry_date'] = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            elif "date" in clean_line.lower() and "expiry_date" not in clean_line.lower():
                payment_details['date'] = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            if "receipt_number" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    payment_details['receipt_number'] = parts[-1].strip()
            if "time" in line.lower():
                time_str = line.split()[-1] if len(line.split()) > 0 else ""
                if time_str:
                    payment_details['time'] = f"{time_str[:2]}:{time_str[2:4]}:{time_str[4:]} CET"
            if "tid" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    payment_details['terminal_id'] = parts[-1].strip()
            if "currency" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    currency_code = parts[-1].strip()
                    payment_details['currency'] = "EUR" if currency_code == "978" else currency_code
            if "card_name" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    payment_details['card_name'] = parts[-1].strip().replace('\u0000', '')
            if "amount in cent" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    amount = parts[-1].strip()
                    try:
                        payment_details['amount_in_cents'] = int(amount)
                    except ValueError:
                        print(f"Warning: Invalid amount format in line: {line}")
            if "pan" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    payment_details['card_id'] = parts[-1].strip()
            if "payment_type" in line.lower():
                parts = line.split()
                if len(parts) > 1:
                    payment_details['payment_type'] = parts[-1].strip()

        # Handle case when operation was queued and then completed
        if operation_queued and 'status' not in payment_details:
            payment_details['status'] = "00"  # Default to success if transaction approved

        # print(f"Parsed payment details: {payment_details}")
        return payment_details


    async def move_receipt_to_succeeded_orders(self, receipt_path):
        """
        Move the receipt file to the succeeded orders directory.
        """
        succeed_orders_dir = os.path.join("Orders", "SucceedOrders")
        os.makedirs(succeed_orders_dir, exist_ok=True)
        filename = os.path.basename(receipt_path)
        new_path = os.path.join(succeed_orders_dir, filename)
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, os.rename, receipt_path, new_path)
        print(f"Moved receipt to {new_path}")

    def format_order_details(self, order_details):
        """
        Format the order details into a JSON string.
        """
        if isinstance(order_details, str):
            try:
                order_details = json.loads(order_details)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON string in order details.")

        products = None
        payment_info = None

        if 'message' in order_details:
            if isinstance(order_details['message'], str):
                try:
                    order_details['message'] = json.loads(order_details['message'])
                except json.JSONDecodeError:
                    raise ValueError("Invalid JSON string in message details.")

            if 'products' in order_details['message']:
                products = order_details['message'].pop('products')

        if 'reservation' in order_details:
            payment_info = order_details['reservation']

        if payment_info and payment_info.get('payment_style') == 'book_total':
            new_order_details = {}
        else:
            new_order_details = {
                'Order Details': order_details.get('message', {})
            }

        if products is not None:
            new_order_details['products'] = products
        if payment_info is not None:
            if payment_info.get('payment_style') == 'book_total':
                for key in ['terminal_id', 'date', 'time', 'currency', 'card_name', 'payment_type', 'card_id', 'expiry_date']:
                    payment_info.pop(key, None)
                new_order_details['book_total'] = payment_info
            else:
                new_order_details['reservation'] = payment_info

        formatted_details = json.dumps(new_order_details, indent=2, separators=(',', ': '))
        return formatted_details

    async def save_receipt_to_file(self, which_terminal, receipt_number, order_details, receipt_path=None):
        """
        Save the formatted order details to a file.
        """
        base_dir = os.path.join("Orders", "ActiveOrders")
        receipt_content = self.format_order_details(order_details)
        receipt_dict = json.loads(receipt_content)

        if receipt_path is None:
            time_stamp_order = receipt_dict.get('Order Details', {}).get('timeStampOrder', "NO_TIMESTAMP")
            receipt_filename = f"{time_stamp_order}_{which_terminal}_{receipt_number}.json"
            receipt_path = os.path.join(base_dir, receipt_filename)

        os.makedirs(base_dir, exist_ok=True)

        loop = asyncio.get_event_loop()
        file_exists = await loop.run_in_executor(None, os.path.exists, receipt_path)
        file_size = await loop.run_in_executor(None, os.path.getsize, receipt_path) if file_exists else 0

        if file_exists and file_size > 0:
            async with aiofiles.open(receipt_path, 'r+', encoding='utf-8') as file:
                content = await file.read()
                data = json.loads(content)
                if isinstance(data, dict):
                    data.update(receipt_dict)
                elif isinstance(data, list):
                    data.append(receipt_dict)
                else:
                    data = receipt_dict
                await file.seek(0)
                await file.truncate()
                await file.write(json.dumps(data, indent=2))
            print(f"Receipt appended to {receipt_path}")
        else:
            async with aiofiles.open(receipt_path, "w", encoding="utf-8") as file:
                await file.write(json.dumps(receipt_dict, indent=2))
            print(f"Receipt written to {receipt_path}")

    async def endOfDay_uploadReceipts(self):
        """
        Perform end-of-day operations and upload receipts.
        """
        result = await self.end_of_day()
        if result != 0:
            print("End of day process failed.")
            return

        base_dir = "Orders"
        try:
            # Git add
            git_add = await asyncio.create_subprocess_exec(
                "git", "add", ".",
                cwd=base_dir,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await git_add.communicate()
            if git_add.returncode != 0:
                print(f"Git add failed: {stderr.decode()}")
                return
            print("Added all files to git staging area.")

            # Git commit
            commit_message = "Upload receipts"
            git_commit = await asyncio.create_subprocess_exec(
                "git", "commit", "-m", commit_message,
                cwd=base_dir,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await git_commit.communicate()
            if git_commit.returncode != 0:
                print(f"Git commit failed: {stderr.decode()}")
                return
            print("Committed changes to git.")

            # Git push
            git_push = await asyncio.create_subprocess_exec(
                "git", "push",
                cwd=base_dir,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await git_push.communicate()
            if git_push.returncode != 0:
                print(f"Git push failed: {stderr.decode()}")
                return
            print("Pushed changes to remote repository.")

            # Delete local files
            files_to_delete = []
            for dirpath, dirnames, filenames in os.walk(base_dir):
                for filename in filenames:
                    if filename.endswith('.json') or filename.endswith('.log'):
                        files_to_delete.append(os.path.join(dirpath, filename))
            loop = asyncio.get_event_loop()
            for file_path in files_to_delete:
                await loop.run_in_executor(None, os.remove, file_path)
                print(f"Deleted file: {file_path}")
            print("Receipts uploaded and local files deleted.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

# The rest of your code remains unchanged

# Global variables
if platform.system() == "Darwin":  # "Darwin" is the system name for macOS
    #paymentTerminalIP_Front = "192.168.68.201"
    #paymentTerminalIP_Back = "192.168.68.202"
    paymentTerminalIP_Front = "192.168.1.201"
    paymentTerminalIP_Back = "192.168.1.202"
else:
    paymentTerminalIP_Front = "192.168.1.201"
    paymentTerminalIP_Back = "192.168.1.202"

paymentTerminalFront = PaymentTerminal(paymentTerminalIP_Front)
paymentTerminalBack = PaymentTerminal(paymentTerminalIP_Back)

paymentTerminalFront_lock = asyncio.Lock()
paymentTerminalBack_lock = asyncio.Lock()


# Payment-related functions
async def end_of_day_job():
    await paymentTerminalFront.endOfDay_uploadReceipts()
    await paymentTerminalBack.endOfDay_uploadReceipts()


async def schedule_end_of_day_job():
    """
    Schedule the end-of-day job to run every day at 23:59.
    """
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
    """
    Handle incoming order messages from clients.
    """
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
    """
    Process the payment asynchronously.
    """
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


async def notify_client_payment_status(client_alias, result, clients, host_name):
    """
    Notify the client of the payment status.
    """
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
