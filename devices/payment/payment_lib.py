import asyncio
import os
import json
import datetime
import platform
import glob
import aiofiles

# TID 52500038 Plus #! WICHTIG
# TID 52500041 PIN #! WICHTIG


class PaymentTerminal:
    def __init__(self, ip_address_terminal, executable_name='zvt++'):
        self.executable_path = self.get_executable_path(executable_name)
        self.ip_address_terminal = ip_address_terminal
        self.current_process = None
        self._terminal_lock = asyncio.Lock()

    def get_executable_path(self, executable_name):
        dir_path = os.path.dirname(os.path.abspath(__file__))
        system_arch = platform.machine()
        builds_dir = os.path.join(dir_path, 'zvt++', '_builds')

        if 'arm' in system_arch or 'aarch64' in system_arch:
            if platform.system() == 'Darwin':
                suffix = 'mac'
            else:
                suffix = 'pi5'
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

    async def load_order_details(self, whichTerminal, receipt_no):
        base_dir = os.path.join("Orders", "ActiveOrders")
        pattern = f"*_{whichTerminal}_{receipt_no}.json"
        full_pattern = os.path.join(base_dir, pattern)
        matching_files = glob.glob(full_pattern)

        if not matching_files:
            print(f"No existing order file found for whichTerminal: {whichTerminal}, receipt_no: {receipt_no}")
            return {}, None
        else:
            matching_files.sort()
            order_file = matching_files[-1]
            async with aiofiles.open(order_file, 'r', encoding='utf-8') as f:
                content = await f.read()
                order_details = json.loads(content)
            return order_details, order_file

    async def book_total(self, which_terminal, receipt_no, amount=None):
        try:
            if not isinstance(receipt_no, str) or not receipt_no:
                raise ValueError("Receipt number must be a non-empty string.")
            if amount is not None and (not isinstance(amount, int) or amount < 0):
                raise ValueError("Amount must be a non-negative integer representing cents.")

            async with self._terminal_lock:
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

                if exit_code != 0:
                    print(f"Process failed with exit code: {exit_code}")
                    print(f"stderr: {stderr.decode('utf-8')}")
                    return False

                output = stdout.decode('utf-8') + stderr.decode('utf-8')
                order_details, receipt_path = await self.load_order_details(which_terminal, receipt_no)
                await self.save_receipts(output, payment_style="book_total", order_details=order_details, receipt_path=receipt_path)
                await self.move_receipt_to_succeeded_orders(receipt_path)
                return True
        except Exception as e:
            print(f"An error occurred: {e}")
            return False

    async def pay(self, payment_style, amount, order_details):
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")
        os.chmod(self.executable_path, 0o755)
        async with self._terminal_lock:
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
                print(f"Subprocess stdout: {stdout_str}")
                print(f"Subprocess stderr: {stderr_str}")

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
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        base_dir = "Orders"
        error_dir = os.path.join(base_dir, "ERROR")

        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            print(f"Created directory: {base_dir}")

        if not os.path.exists(error_dir):
            os.makedirs(error_dir)
            print(f"Created error directory: {error_dir}")

        error_filename = f"{timestamp}_ERR.txt"
        error_path = os.path.join(error_dir, error_filename)
        full_error_message = f"Error: {error_message}\nTerminal IP: {ip_address}"

        async with aiofiles.open(error_path, "w", encoding="utf-8") as file:
            await file.write(full_error_message)
        print(f"Error file saved to {error_path}")

    async def save_receipts(self, output, payment_style, order_details=None, receipt_path=None):
        if order_details is None:
            order_details = {}

        lines = output.split('\n')
        receipt_number = ""
        trace = ""
        expiry_date = ""
        status = ""
        card_name = ""
        date = ""
        time_str = ""
        terminal_id = ""
        currency = ""
        amount_in_cents = ""
        card_id = ""
        payment_type = ""

        for line in lines:
            clean_line = line.replace('<-PT|', '').rstrip('|').strip()
            if "trace" in line:
                trace = line.split()[-1] if len(line.split()) > 0 else ""
            if "status" in line:
                status = line.split()[-1] if len(line.split()) > 0 else ""
            if "expiry_date" in clean_line:
                expiry_date = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            elif "date" in clean_line and "expiry_date" not in clean_line:
                date = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            if "receipt_number" in line:
                parts = line.split()
                if len(parts) > 1:
                    receipt_number = parts[-1].strip()
            if "time" in line:
                time_str = line.split()[-1] if len(line.split()) > 0 else ""
                if time_str:
                    time = f"{time_str[:2]}:{time_str[2:4]}:{time_str[4:]} CET"
            if "tid" in line:
                parts = line.split()
                if len(parts) > 1:
                    terminal_id = parts[-1].strip()
            if "currency" in line:
                parts = line.split()
                if len(parts) > 1:
                    currency_code = parts[-1].strip()
                    currency = "EUR" if currency_code == "978" else currency_code
            if "card_name" in line:
                parts = line.split()
                if len(parts) > 1:
                    card_name = parts[-1].strip().replace('\u0000', '')
            if "amount in cent" in line:
                parts = line.split()
                if len(parts) > 1:
                    amount = parts[-1].strip()
                    try:
                        amount_in_cents = int(amount)
                    except ValueError:
                        print(f"Warning: Invalid amount format in line: {line}")
            if "pan" in line:
                parts = line.split()
                if len(parts) > 1:
                    card_id = parts[-1].strip()
            if "payment_type" in line:
                parts = line.split()
                if len(parts) > 1:
                    payment_type = parts[-1].strip()

        payment_details = {
            'status': status,
            'receipt_number': receipt_number,
            'payment_style': payment_style,
            'date': date,
            'time': time_str,
            'amount_in_cents': amount_in_cents,
            'currency': currency,
            'card_name': card_name,
            'payment_type': payment_type,
            'card_id': card_id,
            'expiry_date': expiry_date,
            'terminal_id': terminal_id,
            'trace': trace
        }

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

        which_terminal = order_details.get('whichTerminal',
                            order_details['message'].get('whichTerminal', "UnknownTerminal"))

        await self.save_receipt_to_file(which_terminal, receipt_number, order_details, receipt_path=receipt_path)
        return status

    async def move_receipt_to_succeeded_orders(self, receipt_path):
        succeed_orders_dir = os.path.join("Orders", "SucceedOrders")
        os.makedirs(succeed_orders_dir, exist_ok=True)
        filename = os.path.basename(receipt_path)
        new_path = os.path.join(succeed_orders_dir, filename)
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, os.rename, receipt_path, new_path)
        print(f"Moved receipt to {new_path}")

    def format_order_details(self, order_details):
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

        if payment_info.get('payment_style') == 'book_total':
            new_order_details = {}
        else:
            new_order_details = {
                'Order Details': order_details.get('message', {})
            }

        if products is not None:
            new_order_details['products'] = products
        if payment_info is not None:
            if payment_info.get('payment_style') == 'book_total':
                payment_info.pop('terminal_id', None)
                payment_info.pop('date', None)
                payment_info.pop('time', None)
                payment_info.pop('currency', None)
                payment_info.pop('card_name', None)
                payment_info.pop('payment_type', None)
                payment_info.pop('card_id', None)
                payment_info.pop('expiry_date', None)
                new_order_details['book_total'] = payment_info
            else:
                new_order_details['reservation'] = payment_info

        formatted_details = json.dumps(new_order_details, indent=2, separators=(',', ': '))
        print(formatted_details)
        return formatted_details

    async def save_receipt_to_file(self, which_terminal, receipt_number, order_details, receipt_path=None):
        base_dir = os.path.join("Orders", "ActiveOrders")
        receipt_content = self.format_order_details(order_details)
        receipt_dict = json.loads(receipt_content)

        if receipt_path is None:
            time_stamp_order = receipt_dict.get('Order Details', {}).get('timeStampOrder')
            if not time_stamp_order:
                time_stamp_order = "NO_TIMESTAMP"
            receipt_filename = f"{time_stamp_order}_{which_terminal}_{receipt_number}.json"
            receipt_path = os.path.join(base_dir, receipt_filename)

        os.makedirs(base_dir, exist_ok=True)
        print(f"Directory ensured: {base_dir}")

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
        result = await self.end_of_day()
        if result != 0:
            print("End of day process failed.")
            return

        base_dir = "Orders"
        try:
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