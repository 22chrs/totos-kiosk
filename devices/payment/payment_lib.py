import asyncio
import os
import subprocess
import re
import json
import datetime
import platform

###
# Fragen
# - Check ob Terminal alles okay ist. Welcher Befehl?
# - Checken ob ich alle richtigen Werte gespeichert habe


class PaymentTerminal:
    def __init__(self, ip_address_terminal, executable_name='zvt++'):
        # Determine the appropriate executable based on the system architecture
        self.executable_path = self.get_executable_path(executable_name)
        self.ip_address_terminal = ip_address_terminal

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
    
    async def printSysConfig(self):
        os.chmod(self.executable_path, 0o755)
        process = await asyncio.create_subprocess_exec(
            self.executable_path, "printSysConfig", self.ip_address_terminal,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )
        await process.wait()
        # Include additional logic as needed
    
    
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
    
    
    
    def book_total(self, receipt_no, amount=None):
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

        # Parse the output and return the result (you can modify this based on your needs)
        return self.save_receipts(output)
    
       
    async def pay(self, payment_style, amount, order_details):
        #! type = reservation or auth for direct payment
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        try:
            # Log start of payment process
            print(f"Starting auth_payment with amount: {amount}")

            # Running the external zvt++ program asynchronously
            process = await asyncio.create_subprocess_exec(
                self.executable_path, payment_style, self.ip_address_terminal, str(amount),
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )

            # Log subprocess execution
            print("Subprocess executed, awaiting response...")

            # Read the output
            stdout, stderr = await process.communicate()

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
            print(f"Full combined output: {output}")

            # Parse the output and return the result
            parsed_output = self.save_receipts(output, payment_style, order_details)


            return parsed_output

        except Exception as e:
            error_message = f"Error during auth_payment: {e}"
            print(error_message)
            self.write_error_file(error_message, self.ip_address_terminal)
            return error_message



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




    def save_receipts(self, output, payment_style, order_details):
        # Split output into lines
        lines = output.split('\n')

        # Initialize variables to hold the receipts, beleg number, and payment status
        receipt_number =""
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

            # Extract other data safely, checking the length of split results
            if "trace" in line:
                trace = line.split()[-1] if len(line.split()) > 0 else ""
            if "status" in line:
                status = line.split()[-1] if len(line.split()) > 0 else ""
            if "expiry_date" in clean_line:
                expiry_date = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            elif "date" in clean_line:  # This ensures we don't confuse expiry_date with date
                date = clean_line.split()[-1].strip() if len(clean_line.split()) > 0 else ""
            if "receipt_number" in line:
                parts = line.split()
                if len(parts) > 1:
                    receipt_number = parts[-1].strip()  # Safely extract the last element
            if "time" in line:
                time_str = line.split()[-1] if len(line.split()) > 0 else ""
                if time_str:
                    time = f"{time_str[:2]}:{time_str[2:4]}:{time_str[4:]} CET"
            if "tid" in line:
                parts = line.split()
                if len(parts) > 1:
                    terminal_id = parts[-1].strip()  # Safely extract the last element
            if "currency" in line:
                parts = line.split()
                if len(parts) > 1:
                    currency_code = parts[-1].strip()  # Get the currency code
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
                        amount_in_cents = int(amount)  # Since the amount is already in cents
                    except ValueError:
                        print(f"Warning: Invalid amount format in line: {line}")
            if "pan" in line:
                parts = line.split()
                if len(parts) > 1:
                    card_id = parts[-1].strip()  # Safely extract the last element
            if "payment_type" in line:
                parts = line.split()
                if len(parts) > 1:
                    payment_type = parts[-1].strip()  # Safely extract the last element

        # Create a dictionary for payment details
        payment_details = {
            'status': status,  # Payment Success/ Error Status
            'receipt_number': receipt_number,  # Belegnummer FEIG Terminal
            'payment_style': payment_style,
            'date': date,  # Datum
            'time': time,  # Zeit
            'amount_in_cents': amount_in_cents,  # gebuchter Betrag
            'currency': currency,
            'card_name': card_name,  # z.B. Mastercard
            'payment_type': payment_type,  # z.B. Kontaktlos
            'card_id': card_id,  # Kreditkartennummer
            'expiry_date': expiry_date,  # Ablaufdatum Kreditkarte
            'terminal_id': terminal_id,  # tid/ Terminal ID
            'trace': trace  # (TA-Nr.)
        }

        # Append payment details to order_details for formatting
        order_details['payment'] = payment_details

        # Now call the save_receipt_to_file function
        self.save_receipt_to_file("StatusBlock", receipt_number, order_details)
        
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
        if 'message' in order_details:
            if isinstance(order_details['message'], str):
                try:
                    order_details['message'] = json.loads(order_details['message'])
                except json.JSONDecodeError:
                    raise ValueError("Invalid JSON string in message details.")

            if 'products' in order_details['message']:
                products = order_details['message'].pop('products')

        
            order_details['message']['orderStatus'] = 'paymentReserved'

        if 'payment' in order_details:
            payment_info = order_details.pop('payment')

        # Reconstruct the order details with products and payment at the same level
        new_order_details = {
            'Order Details': order_details['message'] if 'message' in order_details else {}
        }
        if products is not None:
            new_order_details['products'] = products
        if payment_info is not None:
            new_order_details['payment'] = payment_info

        # Pretty print the JSON with custom formatting (indentation and separators)
        formatted_details = json.dumps(new_order_details, indent=2, separators=(',', ': '))

        return formatted_details




    def save_receipt_to_file(self, receipt_type, beleg_nr, order_details):
        # Define the base directory
        base_dir = "Orders"

        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define the file path for the receipt
        receipt_filename = f"{timestamp}_{receipt_type}_{beleg_nr}.json"
        receipt_path = os.path.join(base_dir, receipt_filename)

        # Check if the base directory exists, if not, create it
        if not os.path.exists(base_dir):
            os.makedirs(base_dir)
            print(f"Created directory: {base_dir}")

        # Append the order details to the receipt
        receipt_content = self.format_order_details(order_details)

        # Write the receipt content to a file in the chosen directory
        with open(receipt_path, "w", encoding="utf-8") as file:
            file.write(receipt_content)
        print(f"Receipt saved to {receipt_path}")



### ! ordner updaten!!!
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
                    if file.endswith('.json') or file.endswith('.txt'):
                        os.remove(file)
                        print(f"Deleted file: {file}")
                print("Receipts uploaded and local files deleted.")
            else:
                print("Failed to push to GitHub.")
        except subprocess.CalledProcessError as e:
            print(f"Git command failed: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
        finally:
            # Revert back to the original directory
            os.chdir(original_dir)
            print(f"Reverted back to directory: {original_dir}")