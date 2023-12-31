import asyncio
import os
import subprocess
import re
import json
import datetime

###
# Fragen
# - Check ob Terminal alles okay ist. Welcher Befehl?
# - Checken ob ich alle richtigen Werte gespeichert habe


class PaymentTerminal:
    def __init__(self, ip_address_terminal, executable_name='zvt++'):
        # Initialize the PaymentTerminal with the path to the zvt++ executable
        self.executable_path = self.get_executable_path(executable_name)
        self.ip_address_terminal = ip_address_terminal

    def get_executable_path(self, executable_name):
        # Get the absolute directory path of the current file (payment_lib.py)
        dir_path = os.path.dirname(os.path.abspath(__file__))
        # Construct the absolute path to the executable
        return os.path.join(dir_path, executable_name, executable_name)
    
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
    
    def reservation_payment_debug(self, amount):
        # Input validation
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments
        # Here, instead of capturing the output, we let it be displayed directly on the terminal
        process = subprocess.Popen([self.executable_path, "reservation", self.ip_address_terminal, str(amount)])

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

        # Split and save the receipts
        self.save_receipts(output)

        # Parse the output and return the result (you can modify this based on your needs)
        return self.parse_terminal_output(output)
    
       
       
    async def auth_payment(self, amount, order_details):
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        try:
            # Log start of payment process
            print(f"Starting auth_payment with amount: {amount}")

            # Running the external zvt++ program asynchronously
            process = await asyncio.create_subprocess_exec(
                self.executable_path, "auth", self.ip_address_terminal, str(amount),
                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )

            # Log subprocess execution
            print("Subprocess executed, awaiting response...")

            # Read the output
            stdout, stderr = await process.communicate()

            # Log outputs for debugging
            print(f"Subprocess stdout: {stdout.decode('utf-8')}")
            print(f"Subprocess stderr: {stderr.decode('utf-8')}")

            # Decode output for processing
            output = stdout.decode('utf-8') + stderr.decode('utf-8')

            # Check for timeout error
            if "Zeit zum Kartenlesen überschritten" in output:
                error_message = "Timeout: No card presented"
                self.write_error_file(error_message, self.ip_address_terminal)
                return "Timeout Error"

            # Parse the output and return the result
            parsed_output = self.save_receipts(output, order_details)
            print(f"Parsed output: {parsed_output}")
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

        # Retrieve the Balena device name
        device_name = os.getenv('BALENA_DEVICE_NAME_AT_INIT', 'Testumgebung')

        # Define the base directory, device-specific directory, and error sub-directory
        base_dir = "payment/receipts"
        device_dir = os.path.join(base_dir, device_name)
        error_dir = os.path.join(device_dir, "ERROR")

        # Check if the device-specific directory exists, if not, create it
        if not os.path.exists(device_dir):
            os.makedirs(device_dir)

        # Check if the error sub-directory exists, if not, create it
        if not os.path.exists(error_dir):
            os.makedirs(error_dir)

        # Define the file path for the error file in the error sub-directory
        error_filename = f"{timestamp}_ERR.txt"
        error_path = os.path.join(error_dir, error_filename)

        # Compose the full error message including the IP address
        full_error_message = f"Error: {error_message}\nTerminal IP: {ip_address}"

        # Write the error message to a file in the error sub-directory
        with open(error_path, "w", encoding="utf-8") as file:
            file.write(full_error_message)



    

    def parse_terminal_output(self, output, order_details):
        # Split and save the receipts
        self.save_receipts(output, order_details)

        # Check for success message
        if "Zahlung erfolgt" in output:
            return "00 Zahlung erfolgreich"  # Success code

        # Check for "Zeit zum Kartenlesen überschritten" error
        if "Zeit zum Kartenlesen überschritten" in output:
            return "-1 Zeit zum Kartenlesen überschritten"  # Specific error message

        # Search for the Händlerbeleg section
        haendlerbeleg_start = output.find("** Händlerbeleg **")
        if haendlerbeleg_start != -1:
            # Extract the section after Händlerbeleg
            haendlerbeleg_section = output[haendlerbeleg_start:]

            # Locate the line after the specified pattern
            pattern = "<-PT|          ####################          |"
            pattern_start = haendlerbeleg_section.find(pattern)
            if pattern_start != -1:
                # Find the newline character after the pattern
                newline_index = haendlerbeleg_section.find('\n', pattern_start)
                if newline_index != -1:
                    # Get the line after the pattern
                    error_line_start = newline_index + 1
                    error_line_end = haendlerbeleg_section.find('\n', error_line_start)
                    error_line = haendlerbeleg_section[error_line_start:error_line_end].strip()

                    # Use regular expression to extract the error code and message
                    match = re.search(r'(\d+\s[\w\s]+)\s{2,}', error_line)
                    if match:
                        return match.group(1)  # Return the matched group containing the error code and message

        # Default return if no specific pattern is matched
        return "Unknown Error"
    
   
    def save_receipts(self, output, order_details):
        # Split output into lines
        lines = output.split('\n')

        # Initialize variables to hold the receipts, beleg number, and payment status
        kundenbeleg = ""
        haendlerbeleg = ""
        beleg_nr = ""
        payment_successful = False
        trace = ""
        expiry_date = ""  # Added for expiry date
        status = ""

        # Flags to identify which section we're currently reading
        in_kundenbeleg = False
        in_haendlerbeleg = False

        # Process each line
        for line in lines:
            # Remove the "<-PT|" from the start and "|" from the end of the line
            clean_line = line.replace('<-PT|', '').rstrip('|').strip()

            # Extract Beleg-Nr. when it is encountered
            if "Beleg-Nr.:" in clean_line:
                beleg_nr = clean_line.split(":")[1].strip()

            # Detect sections for Kundenbeleg and Haendlerbeleg
            if "** Kundenbeleg **" in clean_line:
                kundenbeleg += clean_line + '\n'
                in_kundenbeleg = True
                in_haendlerbeleg = False
                continue
            elif "** Händlerbeleg **" in clean_line:
                haendlerbeleg += clean_line + '\n'
                in_haendlerbeleg = True
                in_kundenbeleg = False
                continue

            # Extract trace, expiry_date, and status
            if "trace" in line:
                trace = line.split()[-1]  # Assuming trace value is the last word in the line
            if "expiry_date" in line:  # Extract expiry_date when encountered
                expiry_date = line.split()[-1]  # Assuming expiry_date value is the last word in the line
            if "status" in line:
                status = line.split()[-1]  # Assuming status value is the last word in the line

            if in_kundenbeleg or in_haendlerbeleg:
                # Add the clean line to the respective receipt
                if in_kundenbeleg:
                    kundenbeleg += clean_line + '\n'
                    if "Zahlung erfolgt" in clean_line:
                        payment_successful = True
                        in_kundenbeleg = False
                elif in_haendlerbeleg:
                    haendlerbeleg += clean_line + '\n'
                    if "Zahlung erfolgt" in clean_line:
                        payment_successful = True
                        in_haendlerbeleg = False

        # Append trace, expiry_date, and status to the receipts if they exist
        additional_info = ""
        if trace:
            additional_info += f"\nTrace: {trace}\n"
        if expiry_date:  # Append expiry_date to additional info
            additional_info += f"Expiry Date: {expiry_date}\n"
        if status:
            additional_info += f"Status: {status}\n"

        if additional_info:
            kundenbeleg += additional_info
            haendlerbeleg += additional_info

        # Save the receipts if they exist
        if kundenbeleg:
            self.save_receipt_to_file(kundenbeleg, "Kundenbeleg", beleg_nr, payment_successful, order_details)
        if haendlerbeleg:
            self.save_receipt_to_file(haendlerbeleg, "Händlerbeleg", beleg_nr, payment_successful, order_details)





    def format_order_details(self, order_details):
        # Check if order_details is a string and convert it to a dictionary
        if isinstance(order_details, str):
            try:
                order_details = json.loads(order_details)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON string in order details.")

        # Set automatenID based on Balena device name or default to 'Testumgebung'
        device_name = os.getenv('BALENA_DEVICE_NAME_AT_INIT', 'Testumgebung')

        # Process the nested 'message' dictionary
        if 'message' in order_details:
            if isinstance(order_details['message'], str):
                try:
                    message_dict = json.loads(order_details['message'])
                except json.JSONDecodeError:
                    print("Warning: 'message' key contains invalid JSON. Leaving as is.")
                    return json.dumps(order_details, indent=4, separators=(',', ': '))
            elif isinstance(order_details['message'], dict):
                message_dict = order_details['message']
            else:
                print("Error: 'message' key is neither a string nor a dictionary.")
                return json.dumps(order_details, indent=4, separators=(',', ': '))

            # Update the automatenID and orderStatus in the message dictionary
            message_dict['automatenID'] = device_name
            message_dict['orderStatus'] = 'paymentReserved'
            order_details['message'] = message_dict

        # Pretty print the JSON with custom formatting for better readability
        formatted_details = json.dumps(order_details, indent=4, separators=(',', ': '))

        return f"\nOrder Details:\n{formatted_details}\n"




    def save_receipt_to_file(self, receipt, receipt_type, beleg_nr, payment_successful, order_details):
        # Retrieve the Balena device name
        device_name = os.getenv('BALENA_DEVICE_NAME_AT_INIT', 'Testumgebung')

        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define the base directory, device-specific directory, and error sub-directory
        base_dir = "payment/receipts"
        device_dir = os.path.join(base_dir, device_name)
        error_dir = os.path.join(device_dir, "ERROR")  # Subdirectory for error files

        # Check if the device-specific directory exists, if not, create it
        if not os.path.exists(device_dir):
            os.makedirs(device_dir)

        # Check if the error sub-directory exists, if not, create it
        if not os.path.exists(error_dir):
            os.makedirs(error_dir)

        # Define the file path based on whether the transaction was successful
        err_suffix = "" if payment_successful else "_ERR"
        folder_to_use = device_dir if payment_successful else error_dir  # Choose the correct directory
        receipt_filename = f"{timestamp}_{receipt_type}_{beleg_nr}{err_suffix}.txt"
        receipt_path = os.path.join(folder_to_use, receipt_filename)

        # Append the order details to the receipt
        if order_details:
            receipt += self.format_order_details(order_details)

        # Write the receipt to a file in the chosen directory
        with open(receipt_path, "w", encoding="utf-8") as file:
            file.write(receipt)



### Sperre Zahlungsfreigabe bzw sage der automat macht gerade einen Kassenschluss und kann Ihre Bestellung in 1 Minute abwickeln.
    def endOfDay_uploadReceipts(self):
        # First, call the end of day process
        if self.end_of_day() != 0:
            print("End of day process failed.")
            return
        
        # Store the current working directory
        original_dir = os.getcwd()

        try:
            # Define the base directory of your receipts
            base_dir = "payment/receipts"

            # Navigate to the base directory
            os.chdir(base_dir)

            # Add all new files to the staging area
            subprocess.run(["git", "add", "."], check=True)

            # Commit the changes
            commit_message = "Upload receipts"
            subprocess.run(["git", "commit", "-m", commit_message], check=True)

            # Push to the remote repository
            push_result = subprocess.run(["git", "push"], check=True)

            # Check if push was successful
            if push_result.returncode == 0:
                # If push was successful, delete the files
                for file in os.listdir('.'):
                    if file.endswith('.txt'):
                        os.remove(file)
                print("Receipts uploaded and local files deleted.")
            else:
                print("Failed to push to GitHub.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            # Revert back to the original directory
            os.chdir(original_dir)