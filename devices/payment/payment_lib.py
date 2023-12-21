import os
import subprocess
import re

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

        # Running the external zvt++ program with the necessary arguments and capturing output
        process = subprocess.Popen([self.executable_path, "auth", self.ip_address_terminal, str(amount)],
                                   stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()

        # Decode output for processing
        output = stdout.decode('utf-8') + stderr.decode('utf-8')

        # Parse the output and return the result
        return self.parse_terminal_output(output)

    def parse_terminal_output(self, output):
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