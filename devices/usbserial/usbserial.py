import asyncio
import serial
import time
from serial.tools import list_ports

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
            board = self.BoardSerial(
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
        # Schedule send_periodic_ack for each board after initial discovery
        # for board in self.boards.values():
        #     asyncio.ensure_future(board.send_periodic_ack())

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

        def preprocess_data(self, data, alias=None):
            processed_data = data.strip()
            alias_to_print = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
            if processed_data.startswith("<STX>") and processed_data.endswith("<ETX>"):
                # Extract the content between <STX> and <ETX>
                processed_data = processed_data[5:-5]  # Remove <STX> and <ETX>
                
                # Validate and extract the message part before the CRC check
                message, crc = processed_data.rsplit("|", 1)
                
                # You might want to add a CRC check here to validate the integrity of the message.
                # For now, we're assuming that if the structure is correct, the message is valid.
                print(f"{alias_to_print} -> {message}")
                return message
            else:
                
                print(f"### {alias_to_print} -> {processed_data} ###")  # Debug messages from teensys serial.print commands
                return ""

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
                            self.disconnect()
                        break
                else:
                    time.sleep(0.1)

        async def wait_for_acknowledgment(self):
            start_time = time.time()
            expected_ack = f"{self.last_command}started"

            print(f"Waiting for acknowledgment from {self.board_info['alias']}")
            while time.time() - start_time < self.timeout:
                if self.serial_connection.in_waiting > 0:
                    raw_data = self.serial_connection.readline().decode().strip()
                    processed_data = self.preprocess_data(raw_data)
                    if processed_data:
                        print(f"Processed Acknowledgment received: {processed_data}")
                        if processed_data == expected_ack:
                            print(f"Correct acknowledgment received: {processed_data}")
                            return processed_data
                await asyncio.sleep(0.05)

            print(f"Error: No acknowledgment received within timeout for {self.board_info['alias']}")
            return None

        async def send_periodic_ack(self):
            while True:
                try:
                    await asyncio.sleep(3)  # Initial delay before sending the first heartbeat and between subsequent heartbeats

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
            except Exception as e:
                print(f"Error during async_connect: {str(e)}")
                self.disconnect()

        async def async_connect(self):
            try:
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, self.connect)
                asyncio.ensure_future(self.send_periodic_ack()) 
              
            except Exception as e:
                print(f"Error during async_connect: {str(e)}")
                self.disconnect()

        def send_data(self, message):
            if self.serial_connection is None:
                print(f"Error: Cannot send data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} - Serial connection is None")
                return
            try:
                message_with_crc = self.add_crc_and_frame(message)
                self.serial_connection.write((message_with_crc + '\n').encode())
                self.last_command = message
                alias = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
                print(f"@{alias} -------> {message}")
            except (serial.SerialException, OSError) as e:
                print(f"Error: Sending data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} failed: {str(e)}")
                self.disconnect()

        def add_crc_and_frame(self, message):
            # Add STX, ETX, and CRC to the message
            crc = self.calculate_crc(message)
            return f"<STX>{message}|{crc}<ETX>"

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


class SerialCommandForwarder:
    def __init__(self, connection_manager):
        self.connection_manager = connection_manager

    async def forward_command(self, alias, message):
        if alias in self.connection_manager.boards:
            board = self.connection_manager.boards[alias]
            board.send_data(message)
            ack = await board.wait_for_acknowledgment()
            expected_ack = f"{message}started"
            print(f"Expected: '{expected_ack}', Received: '{ack}'")

            if ack and ack == expected_ack:
                print(f"Acknowledgment received: {ack}")
            else:
                print(f"Error: No correct acknowledgment received for {message}. Expected: {expected_ack}, Received: {ack if ack else 'None'}")
        else:
            print(f"Error: Alias {alias} not found among connected boards.")

    async def monitor_and_forward(self):
        """Continuously monitor all boards and forward their messages."""
        while True:
            try:
                for alias, board in list(self.connection_manager.boards.items()):
                    try:
                        if board.serial_connection and board.serial_connection.in_waiting > 0:
                            incoming_data = board.serial_connection.readline().decode().strip()
                            processed_data = board.preprocess_data(incoming_data)
                            if processed_data.startswith("CMD:"):
                                print(f"{board.board_info['alias']} -> {processed_data}")
                    except (OSError, serial.SerialException) as e:
                        print(f"Error: {str(e)} - Disconnecting board '{alias}'")
                        board.disconnect()  # Disconnect and cleanup
                        del self.connection_manager.boards[alias]  # Remove the board from the manager
            except Exception as e:
                print(f"Error in monitor_and_forward: {str(e)}")
            await asyncio.sleep(0.01)


class TeensyController:
    def __init__(self, connection_manager, command_forwarder):
        self.connection_manager = connection_manager
        self.command_forwarder = command_forwarder

    async def send_move_device_command(self, alias, stepper_name, position, max_speed_percentage, drive_current_percentage):
        if alias in self.connection_manager.boards:
            command = f'moveDevice("{stepper_name}", {position}, {max_speed_percentage}, {drive_current_percentage})'
            await self.command_forwarder.forward_command(alias, command)
        else:
            print(f"Error: Alias {alias} not found among connected boards.")


# BoardSerial class remains largely the same but without unnecessary methods
class BoardSerial:
    def __init__(self, port, baudrate, timeout, alias_timeout=5, valid_aliases=None):
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.alias_timeout = alias_timeout
        self.board_info = {'port': port, 'alias': None}
        self.serial_connection = None
        self.received_ack = asyncio.Event()
        self.valid_aliases = valid_aliases if valid_aliases is not None else set()
        self.is_heartbeat_sent = False
        self.connected = False
        self.last_command = None

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
                data = self.serial_connection.readline().decode().strip()
                if data:
                    print(f"-> Received: {data}")
                    if data in self.valid_aliases:
                        self.board_info["alias"] = data
                        self.is_heartbeat_sent = False
                        self.send_data("connected")
                    else:
                        print(f"Alias '{data}' is not in the list of valid aliases. Ignoring board.")
                        self.disconnect()
                    break
            else:
                time.sleep(0.1)

    async def wait_for_acknowledgment(self):
        start_time = time.time()
        expected_ack = f"{self.last_command}started"  # Ensuring CMD prefix in expected ack

        print(f"Waiting for acknowledgment from {self.board_info['alias']}")
        while time.time() - start_time < self.timeout:
            if self.serial_connection.in_waiting > 0:
                raw_data = self.serial_connection.readline().decode().strip()
                processed_data = self.preprocess_data(raw_data)
                if processed_data:
                    print(f"Processed data: '{processed_data}'")
                    if processed_data == expected_ack:
                        print(f"Correct acknowledgment received: {processed_data}")
                        return processed_data
                    else:
                        print(f"Ignoring message: {processed_data}")

            await asyncio.sleep(0.01)

        print(f"Error: No acknowledgment received within timeout for {self.board_info['alias']}")
        return None

    async def send_periodic_ack(self):
        while True:
            if self.serial_connection is not None and self.board_info["alias"]:
                if not self.is_heartbeat_sent:
                    self.send_data("heartbeat")
                    self.is_heartbeat_sent = True
            await asyncio.sleep(1)

    async def async_connect(self):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.connect)

    def send_data(self, message):
        if self.serial_connection is None:
            print(f"Error: Cannot send data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} - Serial connection is None")
            return
        try:
            message_with_crc = self.add_crc_and_frame(message)
            self.serial_connection.write((message_with_crc + '\n').encode())
            self.last_command = message
            alias = self.board_info['alias'] if self.board_info['alias'] else 'unknown device'
            print(f"@{alias} -------> {message_with_crc}")
        except (serial.SerialException, OSError) as e:
            print(f"Error: Sending data to {self.board_info['alias'] if self.board_info['alias'] else 'unknown device'} failed: {str(e)}")
            self.disconnect()

    def add_crc_and_frame(self, message):
        # Add STX, ETX, and CRC to the message
        crc = self.calculate_crc(message)
        return f"<STX>{message}|{crc}<ETX>"

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
        return f"{crc:04X}"

    def disconnect(self):
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
        self.connected = False
        self.board_info['alias'] = None
        print(f"Disconnected from board at {self.port}")


# Class to forward serial commands from known aliases to the monitor with special formatting
class SerialCommandForwarder:
    def __init__(self, connection_manager):
        self.connection_manager = connection_manager

    async def forward_command(self, alias, message):
        if alias in self.connection_manager.boards:
            board = self.connection_manager.boards[alias]
            board.send_data(message)
            ack = await board.wait_for_acknowledgment()
            expected_ack = f"{message}started"
            print(f"Expected: '{expected_ack}', Received: '{ack}'")

            if ack and ack == expected_ack:
                print(f"Acknowledgment received: {ack}")
            else:
                print(f"Error: No correct acknowledgment received for {message}. Expected: {expected_ack}, Received: {ack if ack else 'None'}")
        #else:
            #print(f"Error: Alias {alias} not found among connected boards.")

    async def monitor_and_forward(self):
        """Continuously monitor all boards and forward their messages."""
        while True:
            for alias, board in list(self.connection_manager.boards.items()):
                try:
                    if board.serial_connection and board.serial_connection.in_waiting > 0:
                        incoming_data = board.serial_connection.readline().decode().strip()
                        processed_data = board.preprocess_data(incoming_data)
                        if processed_data.startswith("CMD:"):
                            print(f"{board.board_info['alias']} -> {processed_data}")
                except (OSError, serial.SerialException) as e:
                    print(f"Error: {str(e)} - Disconnecting board '{alias}'")
                    board.disconnect()  # Disconnect and cleanup
                    del self.connection_manager.boards[alias]  # Remove the board from the manager
            await asyncio.sleep(0.01)


# Class to handle sending commands to the Teensy and processing acknowledgments
class TeensyController:
    def __init__(self, connection_manager, command_forwarder):
        self.connection_manager = connection_manager
        self.command_forwarder = command_forwarder

    async def send_move_device_command(self, alias, stepper_name, position, max_speed_percentage, drive_current_percentage):
        if alias in self.connection_manager.boards:
            command = f'moveDevice("{stepper_name}", {position}, {max_speed_percentage}, {drive_current_percentage})'
            await self.command_forwarder.forward_command(alias, command)
        #else:
        #    print(f"Error: Alias {alias} not found among connected boards.")