import asyncio
import serial
import time
from serial.tools import list_ports

# Class to manage connection, reconnection, alias management, and serial communication
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
            self.check_board_connections()
            if not self.all_required_aliases_connected():
                missing_aliases = [alias for alias in self.required_aliases if alias not in self.boards]
                current_time = time.time()
                if current_time - last_log_time >= log_interval:
                    print(f"Attempting to reconnect to missing boards: {', '.join(missing_aliases)}")
                    last_log_time = current_time
                await self.discover_boards()
            await asyncio.sleep(0.5)

    async def discover_boards(self):
        available_ports = self._get_ports_with_pid_and_vid(self.vid, self.pid)
        for port_info in available_ports:
            if any(board.port == port_info.device for board in self.boards.values()):
                continue
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
        for board in self.boards.values():
            asyncio.ensure_future(board.send_periodic_ack())

    class BoardSerial:
        def __init__(self, port, baudrate, timeout, alias_timeout=5, valid_aliases=None):
            self.port = port
            self.baudrate = baudrate
            self.timeout = timeout
            self.alias_timeout = alias_timeout
            self.board_info = {'port': port, 'alias': None}
            self.serial_connection = None
            self.valid_aliases = valid_aliases if valid_aliases is not None else set()
            self.is_ack_sent = False
            self.connected = False

        def connect(self):
            try:
                self.serial_connection = serial.Serial(self.board_info['port'], self.baudrate, timeout=self.timeout)
                print(f"Connected to board at {self.board_info['port']}")
                self.connected = True
                if not self.board_info['alias']:
                    self.send_data("REQUEST_ALIAS", formatted=False)
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
                        print(f"Unknown device -> {data}")
                        if data in self.valid_aliases:
                            self.board_info["alias"] = data
                            self.is_ack_sent = False
                            self.send_data("connected", formatted=False)
                            return  # Alias successfully received, exit the function
                        else:
                            print(f"Alias '{data}' is not in the list of valid aliases. Ignoring invalid alias.")
                else:
                    time.sleep(0.1)

            # If we reached this point, it means alias was not set within timeout
            if not self.board_info["alias"]:
                print("Failed to receive a valid alias within the timeout. Disconnecting.")
                self.disconnect()

        async def wait_for_acknowledgment(self):
            start_time = time.time()
            while time.time() - start_time < self.timeout:
                if self.serial_connection.in_waiting > 0:
                    ack = self.serial_connection.readline().decode().strip()
                    if ack:
                        print(f"Acknowledgment received: {ack}")
                        return ack
                await asyncio.sleep(0.01)
            print(f"Error: No acknowledgment received within timeout for {self.board_info['alias']}")
            return None

        async def send_periodic_ack(self):
            while True:
                if self.serial_connection is not None and self.board_info["alias"]:
                    if not self.is_ack_sent:
                        self.send_data(f"ACK:{self.board_info['alias']}", formatted=True)
                        self.is_ack_sent = True
                await asyncio.sleep(1)

        async def async_connect(self):
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self.connect)

        def send_data(self, message, formatted=True):
            if self.serial_connection is None:
                print(f"Error: Cannot send data to {self.board_info['alias']} - Serial connection is None")
                return
            try:
                self.serial_connection.write((message + '\n').encode())
                if formatted:
                    print(f"Sent2: {message}")
                else:
                    print(f"Sent3: {message}")
            except serial.SerialException as e:
                print(f"Error: Sending data to {self.board_info['alias']} failed: {str(e)}")
                self.disconnect()

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
            if ack and ack.startswith("ACK: moveDevice"):
                print(f"Acknowledgment received: {ack}")
            else:
                print(f"Error: No acknowledgment received for {message}")
        else:
            print(f"Error: Alias {alias} not found among connected boards.")

    async def monitor_and_forward(self):
        """Continuously monitor all boards and forward their messages."""
        while True:
            for board in self.connection_manager.boards.values():
                if board.serial_connection and board.serial_connection.in_waiting > 0:
                    incoming_data = board.serial_connection.readline().decode().strip()
                    if incoming_data:
                        print(f"{board.board_info['alias']} -> {incoming_data}")
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
        self.is_ack_sent = False
        self.connected = False

    def connect(self):
        try:
            self.serial_connection = serial.Serial(self.board_info['port'], self.baudrate, timeout=self.timeout)
            print(f"Connected to board at {self.board_info['port']}")
            self.connected = True
            if not self.board_info['alias']:
                self.send_data("REQUEST_ALIAS", formatted=False)
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
                        self.is_ack_sent = False
                        self.send_data("connected", formatted=False)
                    else:
                        print(f"Alias '{data}' is not in the list of valid aliases. Ignoring board.")
                        self.disconnect()
                    break
            else:
                time.sleep(0.1)

    async def wait_for_acknowledgment(self):
        start_time = time.time()
        print(f"Waiting for acknowledgment from {self.board_info['alias']}")
        while time.time() - start_time < self.timeout:  # You may increase self.timeout here
            if self.serial_connection.in_waiting > 0:
                ack = self.serial_connection.readline().decode().strip()
                if ack:
                    print(f"Acknowledgment received: {ack}")
                    return ack
            await asyncio.sleep(0.01)
        print(f"Error: No acknowledgment received within timeout for {self.board_info['alias']}")
        return None

    async def send_periodic_ack(self):
        while True:
            if self.serial_connection is not None and self.board_info["alias"]:
                if not self.is_ack_sent:
                    self.send_data(f"ACK:{self.board_info['alias']}", formatted=True)
                    self.is_ack_sent = True
            await asyncio.sleep(1)

    async def async_connect(self):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.connect)

    def send_data(self, message, formatted=True):
        if self.serial_connection is None:
            print(f"Error: Cannot send data to {self.board_info['alias']} - Serial connection is None")
            return
        try:
            self.serial_connection.write((message + '\n').encode())
            if formatted:
                print(f"Sent: {message}")
            else:
                print(f"Sent2: {message}")
        except serial.SerialException as e:
            print(f"Error: Sending data to {self.board_info['alias']} failed: {str(e)}")
            self.disconnect()

    def disconnect(self):
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
        self.connected = False
        self.board_info['alias'] = None
        print(f"Disconnected from board at {self.port}")

