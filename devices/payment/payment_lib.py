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
    
    ####
    def configuration(self):
        # Ensure the zvt++ executable is executable
        os.chmod(self.executable_path, 0o755)

        # Running the external zvt++ program with the necessary arguments for help line
        # Here, instead of capturing the output, we let it be displayed directly on the terminal
        process = subprocess.Popen([self.executable_path, "printSysConfig", self.ip_address_terminal])

        # Wait for the process to complete and get the exit code
        exit_code = process.wait()

        # Return the exit code (0 for success, non-zero for errors)
        return exit_code
    
    
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
        # Retrieve the Balena device name
        device_name = os.getenv('BALENA_DEVICE_NAME_AT_INIT', 'toto_development')

        # Create a timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Define the base directory and device-specific directory
        base_dir = "payment/receipts"
        device_dir = os.path.join(base_dir, device_name)
        
        # Define file path within the device-specific directory
        err_suffix = "" if payment_successful else "_ERR"
        receipt_filename = f"{timestamp}_{receipt_type}_{beleg_nr}{err_suffix}.txt"
        receipt_path = os.path.join(device_dir, receipt_filename)

        # Check if the device-specific directory exists, if not, create it
        if not os.path.exists(device_dir):
            os.makedirs(device_dir)

        # Write the receipt to a file in the device-specific directory
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