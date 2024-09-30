import asyncio
import os
import subprocess
import json
import datetime
import platform
import glob 


class PaymentTerminal:
    def __init__(self, ip_address_terminal, executable_name='zvt++'):
        # Determine the appropriate executable based on the system architecture
        self.executable_path = self.get_executable_path(executable_name)
        self.ip_address_terminal = ip_address_terminal
        self.current_process = None

    def get_executable_path(self, executable_name):
        # Get the absolute directory path of the current file
        dir_path = os.path.dirname(os.path.abspath(__file__))

        # Determine the system architecture
        system_arch = platform.machine()

        # Define the path to the _builds folder
        builds_dir = os.path.join(dir_path, 'zvt++', '_builds')

        if 'arm' in system_arch or 'aarch64' in system_arch:
            # Use platform.system() to distinguish between macOS and other systems
            if platform.system() == 'Darwin':  # macOS
                suffix = 'mac'
            else:  # Non-macOS ARM systems, potentially Raspberry Pi or others
                suffix = 'pi5'
        elif 'x86' in system_arch or 'x86_64' in system_arch:  # x86 architecture
            suffix = 'x64'
        else:
            raise Exception(f"Unsupported architecture: {system_arch}")

        # Search for the correct build folder
        build_folder = None
        for folder in os.listdir(builds_dir):
            if suffix in folder.lower():
                build_folder = folder
                break

        if build_folder is None:
            raise Exception(f"No suitable build folder found for architecture: {system_arch}")

        # Construct the path to the executable
        executable_path = os.path.join(builds_dir, build_folder, executable_name)

        return executable_path

    def end_of_day(self):
        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments for end of day
        process = subprocess.Popen([self.executable_path, "endOfDay", self.ip_address_terminal])

        # Wait for the process to complete and get the exit code
        exit_code = process.wait()

        # Return the exit code (0 for success, non-zero for errors)
        return exit_code

    def display_text(self, duration, ascii_string):
        # Input validation for duration and ascii_string
        if not isinstance(duration, int) or duration < 0:
            raise ValueError("Duration must be a non-negative integer representing seconds.")
        if not isinstance(ascii_string, str) or not ascii_string:
            raise ValueError("ASCII string must be a non-empty string.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments for displaying text
        process = subprocess.Popen([self.executable_path, "display", self.ip_address_terminal, str(duration), ascii_string])

        # Wait for the process to complete and get the exit code
        exit_code = process.wait()

        # Return the exit code (0 for success, non-zero for errors)
        return exit_code
    
    def load_order_details(self, whichTerminal, receipt_no):
        # Define the base directory to include 'ActiveOrders'
        base_dir = os.path.join("Orders", "ActiveOrders")

        # Search for files matching pattern '*_{whichTerminal}_{receipt_no}.json' in base_dir
        pattern = f"*_{whichTerminal}_{receipt_no}.json"
        full_pattern = os.path.join(base_dir, pattern)

        # Use glob to find matching files
        matching_files = glob.glob(full_pattern)

        if not matching_files:
            print(f"No existing order file found for whichTerminal: {whichTerminal}, receipt_no: {receipt_no}")
            return {}, None
        else:
            # Assuming the latest file is the one we need
            matching_files.sort()
            order_file = matching_files[-1]
            with open(order_file, 'r', encoding='utf-8') as f:
                order_details = json.load(f)
            return order_details, order_file

    def book_total(self, whichTerminal, receipt_no, amount=None):
        # Input validation for receipt number and amount
        if not isinstance(receipt_no, str) or not receipt_no:
            raise ValueError("Receipt number must be a non-empty string.")
        if amount is not None and (not isinstance(amount, int) or amount < 0):
            raise ValueError("Amount must be a non-negative integer representing cents.")
        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)
        # Construct the command arguments
        cmd_args = [self.executable_path, "book_total", self.ip_address_terminal, receipt_no]
        if amount is not None:
            cmd_args.append(str(amount))
        # Running the external zvt++ program with the necessary arguments
        process = subprocess.Popen(cmd_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # Reading the output
        stdout, stderr = process.communicate()
        # Decode output for processing
        output = stdout.decode('utf-8') + stderr.decode('utf-8')
        # Find existing order_details from the receipt file
        order_details, receipt_path = self.load_order_details(whichTerminal, receipt_no)
        # Parse the output and return the result
        return self.save_receipts(output, payment_style="book_total", order_details=order_details, receipt_path=receipt_path)

    async def pay(self, payment_style, amount, order_details):
        #! type = reservation or auth for direct payment
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        try:
            # Log start of payment process
            print(f"Starting {payment_style} payment with amount: {amount}")

            # Running the external zvt++ program asynchronously
            process = await asyncio.create_subprocess_exec(
                self.executable_path, payment_style, self.ip_address_terminal, str(amount),
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )
            self.current_process = process 
            # Log subprocess execution
            print("Subprocess executed, awaiting response...")

            # Read the output
            stdout, stderr = await process.communicate()
            self.current_process = None

            # Log outputs for debugging
            stdout_str = stdout.decode('utf-8')
            stderr_str = stderr.decode('utf-8')
            print(f"Subprocess stdout: {stdout_str}")
            print(f"Subprocess stderr: {stderr_str}")

            # Check for empty output or errors
            if not stdout_str and not stderr_str:
                error_message = "No output from subprocess."
                print(error_message)
                self.write_error_file(error_message, self.ip_address_terminal)
                return "Subprocess produced no output"

            # Decode output for processing
            output = stdout_str + stderr_str
            #print(f"Full combined output: {output}")

            # Parse the output and return the result
            print(f"Order Details1: {order_details}")
            parsed_output = self.save_receipts(output, payment_style, order_details)

            return parsed_output

        except Exception as e:
            error_message = f"Error during {payment_style} payment: {e}"
            print(error_message)
            self.write_error_file(error_message, self.ip_address_terminal)
            return error_message
        
    def abort_payment(self):
        if self.current_process and self.current_process.returncode is None:
            print("Aborting payment process by killing the zvt++ binary.")
            self.current_process.kill()  # Forcefully terminate the subprocess
            self.current_process = None  # Reset the process reference

            # Restart the zvt++ binary (if necessary)
            try:
                # Ensure the zvt++ executable is executable
                os.chmod(self.executable_path, 0o755)

                # Optionally, start a new instance or perform any required initialization
                # For example, if zvt++ needs to be running continuously, start it here
                print("Restarting the zvt++ binary.")
                # Since zvt++ is called per operation, you might not need to start it here
                # If needed, implement the restart logic specific to your application
            except Exception as e:
                print(f"Failed to restart zvt++ binary: {e}")
        else:
            print("No active payment process to abort.")



    def reversal_payment_debug(self, receipt_no):
        # Input validation for receipt number
        if not isinstance(receipt_no, str) or not receipt_no:
            raise ValueError("Receipt number must be a non-empty string.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments for reversal
        # Here, instead of capturing the output, we let it be displayed directly on the terminal
        process = subprocess.Popen([self.executable_path, "reversal", self.ip_address_terminal, receipt_no])

        # Wait for the process to complete and get the exit code
        exit_code = process.wait()

        # Return the exit code (0 for success, non-zero for errors)
        return exit_code

    def write_error_file(self, error_message, ip_address):
        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define the base directory and error sub-directory
        base_dir = "Orders"
        error_dir = os.path.join(base_dir, "ERROR")

        # Check if the base directory exists, if not, create it
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            print(f"Created directory: {base_dir}")

        # Check if the error sub-directory exists, if not, create it
        if not os.path.exists(error_dir):
            os.makedirs(error_dir)
            print(f"Created error directory: {error_dir}")

        # Define the file path for the error file in the error sub-directory
        error_filename = f"{timestamp}_ERR.txt"
        error_path = os.path.join(error_dir, error_filename)

        # Compose the full error message including the IP address
        full_error_message = f"Error: {error_message}\nTerminal IP: {ip_address}"

        # Write the error message to a file in the error sub-directory
        with open(error_path, "w", encoding="utf-8") as file:
            file.write(full_error_message)
        print(f"Error file saved to {error_path}")

    def save_receipts(self, output, payment_style, order_details=None, receipt_path=None):
        if order_details is None:
            order_details = {}

        # Split output into lines
        lines = output.split('\n')

        # Initialize variables to hold the receipts, receipt number, and payment status
        receipt_number = ""
        trace = ""
        expiry_date = ""
        status = ""
        card_name = ""
        date = ""
        time = ""
        terminal_id = ""
        currency = ""
        amount_in_cents = ""
        card_id = ""
        payment_type = ""

        # Process each line
        for line in lines:
            # Remove the "<-PT|" from the start and "|" from the end of the line
            clean_line = line.replace('<-PT|', '').rstrip('|').strip()

            # Extract data safely, checking the length of split results
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

        # Create a dictionary for payment details
        payment_details = {
            'status': status,                # Payment Success/Error Status
            'receipt_number': receipt_number, # Receipt number from terminal
            'payment_style': payment_style,
            'date': date,                    # Date
            'time': time,                    # Time
            'amount_in_cents': amount_in_cents, # Charged amount
            'currency': currency,
            'card_name': card_name,          # e.g., Mastercard
            'payment_type': payment_type,    # e.g., Contactless
            'card_id': card_id,              # Card number
            'expiry_date': expiry_date,      # Card expiry date
            'terminal_id': terminal_id,      # Terminal ID
            'trace': trace                   # Transaction number
        }

        # Append payment details to order_details for formatting
        order_details['payment'] = payment_details

        # Parse 'message' if it's a JSON string
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

        # Extract 'whichTerminal' from order_details or its 'message'
        which_terminal = order_details.get('whichTerminal', 
                            order_details['message'].get('whichTerminal', "UnknownTerminal"))

        # Now call the save_receipt_to_file function with 'which_terminal'
        self.save_receipt_to_file(which_terminal, receipt_number, order_details, receipt_path=receipt_path)

        return status

    def format_order_details(self, order_details):
        # Check if order_details is a string and convert it to a dictionary
        if isinstance(order_details, str):
            try:
                order_details = json.loads(order_details)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON string in order details.")

        # Extract products and payment information from message if present
        products = None
        payment_info = None
        booked_info = None  # New variable to store booked payment details

        if 'message' in order_details:
            if isinstance(order_details['message'], str):
                try:
                    order_details['message'] = json.loads(order_details['message'])
                except json.JSONDecodeError:
                    raise ValueError("Invalid JSON string in message details.")

            if 'products' in order_details['message']:
                products = order_details['message'].pop('products')

        # Extract payment information
        if 'payment' in order_details:
            payment_info = order_details['payment']

        # Extract booked payment information
        if 'book_total' in order_details:
            booked_info = order_details['book_total']

        # Reconstruct the order details with products and payment at the same level
        new_order_details = {
            'Order Details': order_details.get('message', {})
        }
        if products is not None:
            new_order_details['products'] = products
        if payment_info is not None:
            new_order_details['payment'] = payment_info
        if booked_info is not None:
            new_order_details['booked'] = booked_info

        # Pretty print the JSON with custom formatting (indentation and separators)
        formatted_details = json.dumps(new_order_details, indent=2, separators=(',', ': '))

        return formatted_details

    def save_receipt_to_file(self, receipt_type, beleg_nr, order_details, receipt_path=None):
        # Define the base directory to be 'Orders/ActiveOrders'
        base_dir = os.path.join("Orders", "ActiveOrders")

        if receipt_path is None:
            # Create a timestamp
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            # Define the file path for the receipt
            receipt_filename = f"{timestamp}_{receipt_type}_{beleg_nr}.json"
            receipt_path = os.path.join(base_dir, receipt_filename)

        # Ensure the base directory exists
        os.makedirs(base_dir, exist_ok=True)
        print(f"Directory ensured: {base_dir}")

        # Format the order details
        receipt_content = self.format_order_details(order_details)

        # Open the file in append mode
        with open(receipt_path, "a", encoding="utf-8") as file:
            file.write(receipt_content + "\n")  # Add a newline for separation
        print(f"Receipt appended to {receipt_path}")

    def endOfDay_uploadReceipts(self):
        # First, call the end of day process
        if self.end_of_day() != 0:
            print("End of day process failed.")
            return

        # Store the current working directory
        original_dir = os.getcwd()

        try:
            # Define the base directory of your receipts
            base_dir = "Orders"

            # Navigate to the base directory
            os.chdir(base_dir)
            print(f"Changed directory to {base_dir}")

            # Add all new files to the staging area
            subprocess.run(["git", "add", "."], check=True)
            print("Added all files to git staging area.")

            # Commit the changes
            commit_message = "Upload receipts"
            subprocess.run(["git", "commit", "-m", commit_message], check=True)
            print("Committed changes to git.")

            # Push to the remote repository
            push_result = subprocess.run(["git", "push"], check=True)
            print("Pushed changes to remote repository.")

            # Check if push was successful
            if push_result.returncode == 0:
                # If push was successful, delete the files
                for file in os.listdir('.'):
                    if file.endswith('.json') or file.endswith('.log'):
                        os.remove(file)
                        print(f"Deleted file: {file}")
                print("Receipts uploaded and local files deleted.")
            else:
                print("Failed to push to remote repository.")
        except subprocess.CalledProcessError as e:
            print(f"Git command failed: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
        finally:
            # Revert back to the original directory
            os.chdir(original_dir)
            print(f"Reverted back to directory: {original_dir}")
