import os
import subprocess
import re
import time
import datetime

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

    def auth_payment_debug(self, amount):
        # Input validation
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments
        # Here, instead of capturing the output, we let it be displayed directly on the terminal
        process = subprocess.Popen([self.executable_path, "auth", self.ip_address_terminal, str(amount)])

        # Wait for the process to complete and get the exit code
        exit_code = process.wait()

        # Return the exit code (0 for success, non-zero for errors)
        return exit_code
    

    def auth_payment(self, amount):
        # Input validation
        if not isinstance(amount, int) or amount < 0:
            raise ValueError("Amount must be a non-negative integer representing cents.")

        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program
        process = subprocess.Popen([self.executable_path, "auth", self.ip_address_terminal, str(amount)],
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE)

        # Start the timer right before reading the output
        start_time = time.time()

        # Reading the output
        stdout, stderr = process.communicate()

        # Decode output for processing
        output = stdout.decode('utf-8') + stderr.decode('utf-8')

        # Check if more than 3 seconds have elapsed and the specific message is not in the output
        if time.time() - start_time > 3 and "Bitte Karte vorhalten" not in output:
            self.write_error_file("-2 Terminal nicht erreichbar", self.ip_address_terminal)
            return "-2 Terminal nicht erreichbar"

        # Parse the output and return the result
        return self.parse_terminal_output(output)

    def write_error_file(self, error_message, ip_address):
        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define directory and file path for the error file
        error_dir = "payment/receipts"  # Change to 'payment/errors' if you want to separate error logs
        error_path = os.path.join(error_dir, f"{timestamp}_ERR.txt")

        # Check if the directory exists, if not, create it
        if not os.path.exists(error_dir):
            os.makedirs(error_dir)

        # Compose the full error message including the IP address
        full_error_message = f"Error: {error_message}\nTerminal IP: {ip_address}"

        # Write the error message to a file
        with open(error_path, "w", encoding="utf-8") as file:
            file.write(full_error_message)

    

    def parse_terminal_output(self, output):
        # Split and save the receipts
        self.save_receipts(output)

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
    
    def save_receipts(self, output):
        # Split output into lines
        lines = output.split('\n')

        # Initialize variables to hold the receipts, beleg number, and payment status
        kundenbeleg = ""
        haendlerbeleg = ""
        beleg_nr = ""
        payment_successful = False

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

        # Save the receipts if they exist
        if kundenbeleg:
            self.save_receipt_to_file(kundenbeleg, "Kundenbeleg", beleg_nr, payment_successful)
        if haendlerbeleg:
            self.save_receipt_to_file(haendlerbeleg, "Händlerbeleg", beleg_nr, payment_successful)

    def save_receipt_to_file(self, receipt, receipt_type, beleg_nr, payment_successful):
        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define directory and file path
        receipt_dir = "payment/receipts"
        err_suffix = "" if payment_successful else "_ERR"
        receipt_filename = f"{timestamp}_{receipt_type}_{beleg_nr}{err_suffix}.txt"
        receipt_path = os.path.join(receipt_dir, receipt_filename)

        # Check if the directory exists, if not, create it
        if not os.path.exists(receipt_dir):
            os.makedirs(receipt_dir)

        # Write the receipt to a file
        with open(receipt_path, "w", encoding="utf-8") as file:
            file.write(receipt)
