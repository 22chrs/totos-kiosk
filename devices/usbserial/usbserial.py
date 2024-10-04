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
        self.need_to_send_ack = False
        self.last_unacknowledged_message_and_timestamp = None  #! include the orginally timestamp of that message pls -> timestamp|message
        self.retry_count = 0

    def read_from_serial(self):
        """Read from the serial port and handle incomplete data."""
        try:
            #print(f"[DEBUG] Starting read_from_serial for {self.port}.")
            while self.serial_connection.in_waiting > 0:
                incoming_data = self.serial_connection.read(self.serial_connection.in_waiting).decode()
                self.read_buffer += incoming_data

                #print(f"[DEBUG] Read data from {self.port}: {incoming_data}")
                #print(f"[DEBUG] Current read_buffer: {self.read_buffer}")

                alias_to_print = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'

                while '\n' in self.read_buffer:
                    line, self.read_buffer = self.read_buffer.split('\n', 1)
                    line = line.strip()

                    if "<STX>" in line and "<ETX>" in line:
                        self.preprocess_data(line)
                    else:
                        if line:
                            print(f"### {alias_to_print} -> {line} ###")

                while "<STX>" in self.read_buffer and "<ETX>" in self.read_buffer:
                    start_index = self.read_buffer.index("<STX>")
                    end_index = self.read_buffer.index("<ETX>") + len("<ETX>")
                    full_message = self.read_buffer[start_index:end_index]

                    self.preprocess_data(full_message)
                    self.read_buffer = self.read_buffer[end_index:]

                if self.read_buffer:
                    print(f"### {alias_to_print} -> {self.read_buffer.strip()} ###")
                    
            #print(f"[DEBUG] Finished reading from serial for {self.port}.")
        except Exception as e:
            print(f"Error reading from serial: {str(e)}")

    def send_ack_retry(self):
        if self.serial_connection is not None and self.board_info["alias"]:
            if self.need_to_send_ack and self.last_unacknowledged_message_and_timestamp:
                if self.retry_count >= 10:
                    print(f"Maximum retry limit reached for message: {self.last_unacknowledged_message_and_timestamp}")
                    self.need_to_send_ack = False  # Stop retrying after reaching the limit
                    return

                self.retry_count += 1  # Increment the retry count

                # Append the retry count to the original message
                retry_message = f"{self.last_unacknowledged_message_and_timestamp}|{self.retry_count + 1}"
                #print(f"ACK retry {self.retry_count}")  # Debug: Show the retry count
                self.send_data(retry_message)
                self.need_to_send_ack = False  # Reset the flag after sending

    def check_acknowledgment(self, ack_timestamp):
        with self.lock:
            found_index = None
            original_message = None
            for i, (send_time, msg) in enumerate(self.sent_messages):
                if msg.startswith(ack_timestamp):
                    found_index = i
                    original_message = msg  # Store the entire message (timestamp|message)
                    self.last_unacknowledged_message_and_timestamp = original_message  # Store the last unacknowledged message
                    break

            if found_index is not None:
                del self.sent_messages[found_index]
                self.retry_count = 0  # Reset the retry count on acknowledgment

            if self.last_unacknowledged_message_and_timestamp:
                self.send_ack_retry()

    async def check_old_ack_messages(self):
        while True:
            try:
                current_time = time.time()
                with self.lock:
                    to_remove = []
                    for i in range(len(self.sent_messages)):
                        send_time, message = self.sent_messages[i]
                        if current_time - send_time > 0.05:
                            self.need_to_send_ack = True
                            self.last_unacknowledged_message_and_timestamp = message  # Store the entire message (timestamp|message) for retry
                            to_remove.append(i)
                            break

                    for index in to_remove:
                        removed_message = self.sent_messages.pop(index)

                self.send_ack_retry()

                await asyncio.sleep(0.01)
            except Exception as e:
                print(f"Error in check_old_ack_messages: {str(e)}")
                break

    async def check_old_ack_messages(self):
        while True:
            try:
                current_time = time.time()
                with self.lock:
                    to_remove = []
                    for i in range(len(self.sent_messages)):
                        send_time, message = self.sent_messages[i]
                        if current_time - send_time > 0.05:
                            self.need_to_send_ack = True
                            self.last_unacknowledged_message_and_timestamp = message  # Store the entire message (timestamp|message) for retry
                            to_remove.append(i)
                            break

                    for index in to_remove:
                        removed_message = self.sent_messages.pop(index)
                        #print(f"[DEBUG] Removing message '{removed_message}' from sent_messages.")

                self.send_ack_retry()

                await asyncio.sleep(0.01)
            except Exception as e:
                print(f"Error in check_old_ack_messages: {str(e)}")
                break

    # The new function to send an acknowledgment message
    def send_acknowledgment(self, timestamp_received):
        ack_message = f"ACK:{timestamp_received}"
        self.send_data(ack_message)

    # The updated preprocess_data function with the conditional call to send_acknowledgment
    def preprocess_data(self, data, alias=None):
        processed_data = data.strip()
        alias_to_print = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
        
        if processed_data.startswith("<STX>") and processed_data.endswith("<ETX>"):
            try:
                message, crc = processed_data[5:-5].rsplit("|", 1)

                if '|' in message:
                    timestamp_received, message_content = message.split('|', 1)
                    self.received_timestamps[timestamp_received] = message_content

                print(f"{alias_to_print} -> {timestamp_received}|{message_content}")
                
                # Call send_acknowledgment only if message_content does not start with "ACK:"
                if not message_content.startswith("ACK:"):
                    self.send_acknowledgment(timestamp_received)

                # Additional logging for ACKs
                if message_content.startswith("ACK:"):
                    ack_timestamp = message_content.split("ACK:")[1].strip()
                    self.check_acknowledgment(ack_timestamp)

                return message_content
            except ValueError:
                print(f"### {alias_to_print} -> Malformed message: {processed_data} ###")
                return ""
        else:
            print(f"### {alias_to_print} -> {processed_data} ###")
            return ""

    def connect(self):
        try:
            print(f"[DEBUG] Attempting to connect to {self.port}.")
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
                        print(f"[DEBUG] Alias set to: {processed_data}")
                        self.is_heartbeat_sent = False
                        self.send_data("connected")
                    else:
                        print(f"Alias '{processed_data}' is not in the list of valid aliases. Ignoring board.")
                    break
            else:
                time.sleep(0.1)

    async def send_periodic_ack(self):
        while True:
            try:
                await asyncio.sleep(30)

                if self.serial_connection is not None and self.board_info["alias"]:
                    if not self.is_heartbeat_sent:
                        self.send_data("heartbeat")
                        self.is_heartbeat_sent = True

                self.is_heartbeat_sent = False

                # Trigger the immediate ACK sending if needed
                self.send_ack_retry()

            except Exception as e:
                print(f"Error in send_periodic_ack: {str(e)}")
                break

    async def async_connect(self):
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.connect)
            asyncio.ensure_future(self.send_periodic_ack())
            asyncio.ensure_future(self.check_old_ack_messages())
        except Exception as e:
            print(f"Error during async_connect: {str(e)}")
            self.disconnect()

    def generate_timestamp(self):
        current_time = time.time()  # Get current time in seconds (with sub-second precision)
        local_time = time.localtime(current_time)  # Convert to local time tuple
        millis = int((current_time % 1) * 1000)  # Extract milliseconds

        # Format timestamp as YYMMDDHHMMSSmmm
        new_timestamp = f"{local_time.tm_year % 100:02}{local_time.tm_mon:02}{local_time.tm_mday:02}"
        new_timestamp += f"{local_time.tm_hour:02}{local_time.tm_min:02}{local_time.tm_sec:02}{millis:03}"

        with self.lock:  # Lock to ensure this operation is thread-safe
            if new_timestamp == self.last_timestamp:
                self.timestamp_suffix = chr(ord(self.timestamp_suffix) + 1)
                if self.timestamp_suffix > 'Z':  # Reset if it exceeds 'Z'
                    self.timestamp_suffix = 'A'
            else:
                self.timestamp_suffix = 'A'
                self.last_timestamp = new_timestamp

            # Return the final timestamp with suffix
            return new_timestamp + self.timestamp_suffix
        
    def send_data(self, message):
        if self.serial_connection is None:
            print(f"Error: Cannot send data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} - Serial connection is None")
            return

        timestamp = self.generate_timestamp()
        
        try:
            # Check if the message is a retry message
            if '|' in message and len(message.split('|')[0]) == 16 and message[:15].isdigit():
                retry_timestamp, retry_message = message.split('|', 1)
                message = retry_message  # Use the part after | as the actual message
                timestamp = retry_timestamp  # Use the part after | as the actual message

            message_with_crc = self.add_crc_and_frame(message, timestamp)
            self.serial_connection.write((message_with_crc + '\n').encode())
            self.last_command = message
            alias = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
            print(f"@{alias} -------> {timestamp}|{message}")

            # Skip adding to sent_messages if the message contains "ACK:"
            if "REQUEST_ALIAS" not in message and "ACK:" not in message:
                with self.lock:
                    self.sent_messages.append((time.time(), f"{timestamp}|{message}"))

        except (serial.SerialException, OSError) as e:
            print(f"Error: Sending data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} failed: {str(e)}")
            self.disconnect()

    def add_crc_and_frame(self, message, timestamp):
        message_with_timestamp = f"{timestamp}|{message}"
        crc = self.calculate_crc(message_with_timestamp)
        framed_message = f"<STX>{message_with_timestamp}|{crc}<ETX>"
        return framed_message

    def calculate_crc(self, message):
        crc = 0xFFFF
        for char in message:
            crc ^= ord(char)
            for _ in range(8):
                if crc & 1:
                    crc = (crc >> 1) ^ 0x8408
                else:
                    crc >>= 1
        return f"{crc:04X}".lower()

    def disconnect(self):
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
        self.connected = False
        self.board_info['alias'] = None
        print(f"[DEBUG] Disconnected from port: {self.port}")


class ConnectionManager:
    def __init__(self, vid, pid, baudrate, timeout, required_aliases):
        self.vid = vid
        self.pid = pid
        self.baudrate = baudrate
        self.timeout = timeout
        self.required_aliases = required_aliases
        self.boards = {}
        self.all_aliases_connected_flag = False  


    def print_object_properties(self):
        print(f"[DEBUG] ConnectionManager properties: VID={self.vid}, PID={self.pid}, Baudrate={self.baudrate}, Timeout={self.timeout}")

    async def check_required_aliases(self):
        missing_aliases = [alias for alias in self.required_aliases if alias not in self.boards]
        if missing_aliases:
            print(f"Error: The following required aliases are not connected: {', '.join(missing_aliases)}")
            self.all_aliases_connected_flag = False  # Update flag
        else:
            if not self.all_aliases_connected_flag:
                print("All required aliases are connected.")
                self.all_aliases_connected_flag = True  # Update flag
        print(f"[DEBUG] Checked required aliases: {missing_aliases if missing_aliases else 'None missing'}")

    def all_required_aliases_connected(self):
        result = all(alias in self.boards for alias in self.required_aliases)
        if result != self.all_aliases_connected_flag:  # Only log if the status changes
            print(f"[DEBUG] All required aliases connected: {result}")
            self.all_aliases_connected_flag = result  # Update flag
        return result

    def check_board_connections(self):
        disconnected_aliases = []
        for alias, board in list(self.boards.items()):
            if not board.is_connected():
                disconnected_aliases.append(alias)
                print(f"Board '{alias}' has been disconnected.")
                del self.boards[alias]
                self.all_aliases_connected_flag = False  # Update flag

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
        print(f"[DEBUG] Available ports for VID={self.vid}, PID={self.pid}: {available_ports}")
        for port_info in available_ports:
            if any(board.port == port_info.device for board in self.boards.values()):
                continue

            board = BoardSerial(
                port_info.device, self.baudrate, self.timeout, valid_aliases=self.required_aliases
            )
            await board.async_connect()
            if board.board_info['alias']:
                self.boards[board.board_info['alias']] = board

    def _get_ports_with_pid_and_vid(self, vid, pid):
        ports = [port_info for port_info in list_ports.comports() if (port_info.vid == vid and port_info.pid == pid)]
        return ports

    async def start(self):
        await self.discover_boards()
        await self.check_required_aliases()
        asyncio.ensure_future(self.reconnect_boards())


class SerialCommandForwarder:
    def __init__(self, connection_manager):
        self.connection_manager = connection_manager

    async def forward_command(self, alias, message):
        #print(f"[DEBUG] Forwarding command to alias '{alias}': {message}")
        if alias in self.connection_manager.boards:
            board = self.connection_manager.boards[alias]
            board.send_data(message)
        else:
            print(f"[DEBUG] Failed to forward command. Alias '{alias}' not found.")

    async def monitor_and_forward(self):
        while True:
            try:
                for alias, board in list(self.connection_manager.boards.items()):
                    try:
                        if board.serial_connection:
                            board.read_from_serial()
                            #print(f"[DEBUG] Monitoring and reading serial data from board '{alias}'.")
                    except (OSError, serial.SerialException) as e:
                        print(f"[DEBUG] Exception while monitoring board '{alias}': {str(e)}")
                        board.disconnect()
                        del self.connection_manager.boards[alias]
                        print(f"[DEBUG] Board '{alias}' disconnected and removed from manager.")
            except Exception as e:
                print(f"[DEBUG] Exception in monitor_and_forward: {str(e)}")
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
        else:
            print(f"[DEBUG] Failed to send moveDevice command. Alias '{alias}' not found.")

    async def send_home_device_command(self, alias, stepper_name):
        if alias in self.connection_manager.boards:
            command = f'homeDevice("{stepper_name}")'
            await self.command_forwarder.forward_command(alias, command)
        else:
            print(f"[DEBUG] Failed to send homeDevice command. Alias '{alias}' not found.")

