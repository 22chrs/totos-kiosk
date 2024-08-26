import asyncio
import serial
import time
import threading

from serial.tools import list_ports
class BoardSerial:
    def __init__(self, port, baudrate, timeout, alias_timeout=5, valid_aliases=None):
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.alias_timeout = alias_timeout
        self.board_info = {'port': port, 'alias': None}
        self.serial_connection = None
        self.valid_aliases = valid_aliases if valid_aliases is not None else set()
        self.is_heartbeat_sent = False
        self.connected = False
        self.last_command = None
        self.last_timestamp = 0
        self.received_timestamps = {}  
        self.sent_messages = []
        self.read_buffer = ""
        self.lock = threading.Lock()

    def read_from_serial(self):
        """Read from the serial port and handle incomplete data."""
        try:
            while self.serial_connection.in_waiting > 0:
                incoming_data = self.serial_connection.read(self.serial_connection.in_waiting).decode()
                self.read_buffer += incoming_data

                # Get the alias of the device, or use 'unknown device' if it's not set
                alias_to_print = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'

                # Process and print incomplete data whenever a newline is encountered
                while '\n' in self.read_buffer:
                    # Split the buffer on the first newline to separate the data to be processed
                    line, self.read_buffer = self.read_buffer.split('\n', 1)
                    line = line.strip()

                    # Check if the line contains a complete message
                    if "<STX>" in line and "<ETX>" in line:
                        # Process complete message
                        self.preprocess_data(line)
                    else:
                        # If it's not a complete message, treat it as incomplete/stray data
                        if line:
                            print(f"### {alias_to_print} -> {line} ###")

                # Now handle any remaining complete messages in the buffer
                while "<STX>" in self.read_buffer and "<ETX>" in self.read_buffer:
                    start_index = self.read_buffer.index("<STX>")
                    end_index = self.read_buffer.index("<ETX>") + len("<ETX>")

                    # Extract the full message
                    full_message = self.read_buffer[start_index:end_index]
                    
                    # Process the complete message
                    self.preprocess_data(full_message)
                    
                    # Update the buffer by removing the processed message
                    self.read_buffer = self.read_buffer[end_index:]

                # If there is any leftover incomplete data, print it
                if self.read_buffer:
                    print(f"### {alias_to_print} -> {self.read_buffer.strip()} ###")

        except Exception as e:
            print(f"Error reading from serial: {str(e)}")

    def preprocess_data(self, data, alias=None):
        processed_data = data.strip()
        alias_to_print = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
        
        if processed_data.startswith("<STX>") and processed_data.endswith("<ETX>"):
            # Extract the content between <STX> and <ETX>
            processed_data = processed_data[5:-5]  # Remove <STX> and <ETX>
            
            # Validate and extract the message part before the CRC check
            try:
                message, crc = processed_data.rsplit("|", 1)
                
                # Now, remove the timestamp from the start of the message and store it
                if '|' in message:
                    timestamp, message = message.split('|', 1)
                    self.received_timestamps[timestamp] = message  # Store the timestamp and message

                # Print for debugging
                print(f"{alias_to_print} -> {message}")

                # Check if the message is an acknowledgment
                if message.startswith("ACK:"):
                    ack_timestamp = message.split("ACK:")[1].strip()
                    self.check_acknowledgment(ack_timestamp)

                return message
            except ValueError:
                print(f"### {alias_to_print} -> Malformed message: {processed_data} ###")
                return ""
        else:
            print(f"### {alias_to_print} -> {processed_data} ###")  # Debug messages from Teensy's serial.print commands
            return ""

    def check_acknowledgment(self, ack_timestamp):
        """Check if the acknowledgment timestamp is in the list of sent messages and remove it if found."""
        with self.lock:  # Use lock to synchronize access
            found_index = None
            for i, (_, msg) in enumerate(self.sent_messages):  # Unpack the tuple (send_time, message)
                if msg.startswith(ack_timestamp):
                    found_index = i
                    break

            if found_index is not None:
                print(f"ACK received for timestamp {ack_timestamp}")
                del self.sent_messages[found_index]  # Remove the message from the list
            else:
                print(f"ACK received for timestamp {ack_timestamp}: !!!!!!!!!!! NOT FOUND in sent messages.")

    async def check_old_ack_messages(self):
            while True:
                try:
                    current_time = time.time()
                    with self.lock:  # Use lock to synchronize access
                        # Create a copy of the list to iterate over while modifying the original list
                        for i in range(len(self.sent_messages) - 1, -1, -1):  # Iterate backwards for safe pop
                            send_time, message = self.sent_messages[i]
                            if current_time - send_time > 5:
                                print(f"WARNING: Message '{message}' has not been acknowledged in over 5 seconds.")
                                self.sent_messages.pop(i)  # Use pop() to remove the element safely
                    await asyncio.sleep(1)  # Check every second
                except Exception as e:
                    print(f"Error in check_old_ack_messages: {str(e)}")
                    break

        
    def connect(self):
        try:
            self.serial_connection = serial.Serial(self.board_info['port'], self.baudrate, timeout=self.timeout)
            print(f"Connected to board at {self.board_info['port']}")
            self.connected = True
            if not self.board_info['alias']:
                self.send_data("REQUEST_ALIAS")
                self.receive_initial_alias()
        except Exception as e:
            print(f"Error connecting to {self.board_info['port']}: {str(e)}")
            self.connected = False

    def is_connected(self):
        if self.serial_connection:
            try:
                self.serial_connection.write(b'\n')
                return True
            except Exception:
                self.connected = False
                return False
        return False

    def receive_initial_alias(self):
        start_time = time.time()
        while True:
            current_time = time.time()
            if current_time - start_time > self.alias_timeout:
                print("Alias timeout reached.")
                break

            if self.serial_connection.in_waiting > 0:
                raw_data = self.serial_connection.readline().decode().strip()
                processed_data = self.preprocess_data(raw_data)
                if processed_data:
                    if processed_data in self.valid_aliases:
                        self.board_info["alias"] = processed_data
                        self.is_heartbeat_sent = False
                        self.send_data("connected")
                    else:
                        print(f"Alias '{processed_data}' is not in the list of valid aliases. Ignoring board.")
                        #self.disconnect()
                    break
            else:
                time.sleep(0.1)

    async def send_periodic_ack(self):
        while True:
            try:
                await asyncio.sleep(2)  # Initial delay before sending the first heartbeat and between subsequent heartbeats

                if self.serial_connection is not None and self.board_info["alias"]:
                    if not self.is_heartbeat_sent:
                        self.send_data("heartbeat")
                        self.is_heartbeat_sent = True

                self.is_heartbeat_sent = False  # Reset flag to ensure periodic sending
            except Exception as e:
                print(f"Error in send_periodic_ack: {str(e)}")
                break  # Break the loop if there's a critical error

    async def async_connect(self):
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.connect)
            asyncio.ensure_future(self.send_periodic_ack()) 
            asyncio.ensure_future(self.check_old_ack_messages())  # Start checking for old ACK messages
        except Exception as e:
            print(f"Error during async_connect: {str(e)}")
            self.disconnect()

    def generate_timestamp(self):
        current_time = time.localtime()  # Get the current local time
        millis = int((time.time() % 1) * 1000)  # Get the current milliseconds

        # Extract the relevant parts of the timestamp
        year = current_time.tm_year % 100  # Last two digits of the year
        month = current_time.tm_mon  # Month as a two-digit number
        day = current_time.tm_mday  # Day of the month as a two-digit number
        hour = current_time.tm_hour  # Hour as a two-digit number
        minutes = current_time.tm_min  # Minutes as a two-digit number

        # Format the timestamp as yymmddhhmmssss with ssss as milliseconds
        new_timestamp = f"{year:02}{month:02}{day:02}{hour:02}{minutes:02}{millis:04}"

        # Check if this timestamp is the same as the last one
        if new_timestamp == self.last_timestamp:
            # Increment the suffix if the timestamp is the same
            self.timestamp_suffix = chr(ord(self.timestamp_suffix) + 1)
            if self.timestamp_suffix > 'Z':  # Reset if we go past 'Z'
                self.timestamp_suffix = 'A'
        else:
            # Reset suffix if the timestamp is new
            self.timestamp_suffix = 'A'
            self.last_timestamp = new_timestamp

        # Return the timestamp with the suffix
        return new_timestamp + self.timestamp_suffix

    def send_data(self, message):
        if self.serial_connection is None:
            print(f"Error: Cannot send data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} - Serial connection is None")
            return
        try:
            timestamp = self.generate_timestamp()
            message_with_crc = self.add_crc_and_frame(message, timestamp)
            self.serial_connection.write((message_with_crc + '\n').encode())
            self.last_command = message
            alias = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
            print(f"@{alias} -------> {timestamp}|{message}")

            # Exclude certain messages from acknowledgment tracking
            if "REQUEST_ALIAS" not in message:
                # Store the sent message with its timestamp (store as a tuple: (send_time, message_with_timestamp))
                self.sent_messages.append((time.time(), f"{timestamp}|{message}"))

        except (serial.SerialException, OSError) as e:
            print(f"Error: Sending data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} failed: {str(e)}")
            self.disconnect()

    def add_crc_and_frame(self, message, timestamp):
        # Add STX, ETX, and CRC to the message
        message_with_timestamp = f"{timestamp}|{message}"
        crc = self.calculate_crc(message_with_timestamp)
        return f"<STX>{message_with_timestamp}|{crc}<ETX>"

    def calculate_crc(self, message):
        # CRC-16-CCITT calculation
        crc = 0xFFFF
        for char in message:
            crc ^= ord(char)
            for _ in range(8):
                if crc & 1:
                    crc = (crc >> 1) ^ 0x8408
                else:
                    crc >>= 1
        return f"{crc:04X}".lower()  # Convert the CRC to lowercase

    def disconnect(self):
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
        self.connected = False
        self.board_info['alias'] = None
        print(f"Disconnected from board at {self.port}")

        
class ConnectionManager:
    def __init__(self, vid, pid, baudrate, timeout, required_aliases):
        self.vid = vid
        self.pid = pid
        self.baudrate = baudrate
        self.timeout = timeout
        self.required_aliases = required_aliases
        self.boards = {}

    def print_object_properties(self):
        print(f"VID: {self.vid}")
        print(f"PID: {self.pid}")
        print(f"Baudrate: {self.baudrate}")
        print(f"Timeout: {self.timeout}")
        print(f"Boards: {self.boards}")

    async def check_required_aliases(self):
        missing_aliases = [alias for alias in self.required_aliases if alias not in self.boards]
        if missing_aliases:
            print(f"Error: The following required aliases are not connected: {', '.join(missing_aliases)}")
        else:
            print("All required aliases are connected.")

    def all_required_aliases_connected(self):
        return all(alias in self.boards for alias in self.required_aliases)

    def check_board_connections(self):
        disconnected_aliases = []
        for alias, board in list(self.boards.items()):
            if not board.is_connected():
                disconnected_aliases.append(alias)
                print(f"Board '{alias}' has been disconnected.")
                del self.boards[alias]

    async def reconnect_boards(self):
        last_log_time = time.time()
        log_interval = 10

        while True:
            try:
                self.check_board_connections()
                if not self.all_required_aliases_connected():
                    missing_aliases = [alias for alias in self.required_aliases if alias not in self.boards]
                    current_time = time.time()
                    if current_time - last_log_time >= log_interval:
                        print(f"Attempting to reconnect to missing boards: {', '.join(missing_aliases)}")
                        last_log_time = current_time
                    await self.discover_boards()
            except Exception as e:
                print(f"Error in reconnect_boards: {str(e)}")
            await asyncio.sleep(0.5)

    async def discover_boards(self):
        available_ports = self._get_ports_with_pid_and_vid(self.vid, self.pid)
        for port_info in available_ports:
            # Skip the port only if it is actively being used by a connected board
            if any(board.port == port_info.device for board in self.boards.values()):
                continue
            
            # Attempt to reconnect
            board = BoardSerial(
                port_info.device, self.baudrate, self.timeout, valid_aliases=self.required_aliases
            )
            await board.async_connect()
            if board.board_info['alias']:
                self.boards[board.board_info['alias']] = board

    def _get_ports_with_pid_and_vid(self, vid, pid):
        return [port_info for port_info in list_ports.comports() if (port_info.vid == vid and port_info.pid == pid)]

    async def start(self):
        await self.discover_boards()
        await self.check_required_aliases()
        asyncio.ensure_future(self.reconnect_boards())

class SerialCommandForwarder:
    def __init__(self, connection_manager):
        self.connection_manager = connection_manager

    async def forward_command(self, alias, message):
        if alias in self.connection_manager.boards:
            board = self.connection_manager.boards[alias]
            board.send_data(message)
        else:
            print(f"Error: Alias {alias} not found among connected boards.")

    async def monitor_and_forward(self):
            while True:
                try:
                    for alias, board in list(self.connection_manager.boards.items()):
                        try:
                            if board.serial_connection:
                                board.read_from_serial()
                        except (OSError, serial.SerialException) as e:
                            print(f"Error: {str(e)} - Disconnecting board '{alias}'")
                            board.disconnect()  # Disconnect and cleanup
                            del self.connection_manager.boards[alias]  # Remove the board from the manager
                except Exception as e:
                    print(f"Error in monitor_and_forward: {str(e)}")
                await asyncio.sleep(0.01)


# Class to handle sending commands to the Teensy and processing acknowledgments
class TeensyController:
    def __init__(self, connection_manager, command_forwarder):
        self.connection_manager = connection_manager
        self.command_forwarder = command_forwarder

    async def send_move_device_command(self, alias, stepper_name, position, max_speed_percentage, drive_current_percentage, desiredRingPercentage):
        if alias in self.connection_manager.boards:
            command = f'moveDevice("{stepper_name}", {position}, {max_speed_percentage}, {drive_current_percentage}, {desiredRingPercentage})'
            await self.command_forwarder.forward_command(alias, command)

    async def send_home_device_command(self, alias, stepper_name):
        if alias in self.connection_manager.boards:
            command = f'homeDevice("{stepper_name}")'
            await self.command_forwarder.forward_command(alias, command)
        #else:
        #    print(f"Error: Alias {alias} not found among connected boards.")