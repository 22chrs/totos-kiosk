import asyncio
import serial
import time
from serial.tools import list_ports

class DeviceSerial:
    def __init__(self, port, baudrate, timeout, alias_timeout=5, valid_aliases=None):
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.alias_timeout = alias_timeout
        self.device_info = {'port': port, 'alias': None}
        self.serial_connection = None
        self.received_ack = asyncio.Event()
        self.valid_aliases = valid_aliases if valid_aliases is not None else set()
        self.is_ack_sent = False  # Track if ACK has been sent after connection

    def connect(self):
        try:
            self.serial_connection = serial.Serial(self.device_info['port'], self.baudrate, timeout=self.timeout)
            print(f"Connected to device at {self.device_info['port']}")
            self.send_data("REQUEST_ALIAS", formatted=False)  # Send REQUEST_ALIAS command without ### prefix
        except Exception as e:
            print(f"Error connecting to {self.device_info['port']}: {str(e)}")
            return
        self.receive_initial_alias()

    def is_connected(self):
        if self.serial_connection:
            try:
                self.serial_connection.write(b'\n')
                return True
            except Exception as e:
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
                    print(f"### Received: {data}")  # Prefix with ### because it's from the Teensy
                    if data in self.valid_aliases:
                        self.device_info["alias"] = data
                        self.is_ack_sent = False  # Reset ACK sent status
                        self.send_data("connected", formatted=False)  # Send "connected" without ### prefix
                    else:
                        print(f"Alias '{data}' is not in the list of valid aliases. Ignoring device.")
                        self.serial_connection.close()
                    break
            else:
                print("Waiting for alias ...")
                time.sleep(0.1)

    async def send_periodic_ack(self):
        while True:
            if self.serial_connection is not None and self.device_info["alias"]:
                if not self.is_ack_sent:  # Send ACK only if it hasn't been sent
                    self.send_data("ACK:" + self.device_info["alias"], formatted=True)  # Send ACK with ### prefix
                    self.is_ack_sent = True  # Set ACK sent status to True
            await asyncio.sleep(1)

    async def async_connect(self):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, self.connect)

    def send_data(self, message, formatted=True):
        if self.serial_connection is None:
            print(f"Error sending data to {self.device_info['alias']}: Serial connection is None")
            return
        try:
            self.serial_connection.write((message + '\n').encode())
            if formatted:
                print(f"### Sent: {message}")  # Prefix with ### if it is serial output
            else:
                print(f"Sent: {message}")  # No prefix for internal Python output
        except serial.SerialException as e:
            print(f"Error sending data to {self.device_info['alias']}: {str(e)}")
            self.serial_connection = None

class UsbSerialManager:
    def __init__(self, vid, pid, baudrate, timeout, required_aliases):
        # Initialize the UsbSerialManager object with given parameters
        self.vid = vid
        self.pid = pid
        self.baudrate = baudrate
        self.timeout = timeout
        self.required_aliases = required_aliases
        self.devices = {}
    
    def print_object_properties(self):
        # Print the UsbSerialManager object's properties
        print(f"VID: {self.vid}")
        print(f"PID: {self.pid}")
        print(f"Baudrate: {self.baudrate}")
        print(f"Timeout: {self.timeout}")
        print(f"Devices: {self.devices}")
    
    async def check_required_aliases(self):
        missing_aliases = [alias for alias in self.required_aliases if alias not in self.devices]
        if missing_aliases:
            print(f"Error: The following required aliases are not connected: {', '.join(missing_aliases)}")
        else:
            print("All required aliases are connected.")

    def all_required_aliases_connected(self):
        return all(alias in self.devices for alias in self.required_aliases)
    
    def check_device_connections(self):
        disconnected_aliases = []
        for alias, device in self.devices.items():
            if not device.is_connected():
                disconnected_aliases.append(alias)
        for alias in disconnected_aliases:
            print(f"Device '{alias}' has been disconnected.")
            del self.devices[alias]

    async def reconnect_devices(self):
        # Continuously check for and attempt to reconnect to missing devices
        all_connected = self.all_required_aliases_connected()
        last_log_time = time.time()  # Track the last time we logged the missing devices
        log_interval = 10  # Interval to log missing devices in seconds

        while True:
            self.check_device_connections()
            if not self.all_required_aliases_connected():
                missing_aliases = [alias for alias in self.required_aliases if alias not in self.devices]

                current_time = time.time()
                if current_time - last_log_time >= log_interval:
                    print(f"Attempting to reconnect to missing devices: {', '.join(missing_aliases)}")
                    last_log_time = current_time

                await self.discover_devices()
                all_connected = False
            else:
                if not all_connected:
                    print("All required devices are connected back again.")
                    all_connected = True

            await asyncio.sleep(0.5)  # Try to reconnect every 0.5 seconds

    async def discover_devices(self):
        # Discover devices with the specified VID and PID and establish a connection
        available_ports = self._get_ports_with_pid_and_vid(self.vid, self.pid)
        for port_info in available_ports:
            # Skip devices that are already connected
            if any(device.device_info['port'] == port_info.device for device in self.devices.values()):
                continue
            device = DeviceSerial(port_info.device, self.baudrate, self.timeout, valid_aliases=self.required_aliases)
            await device.async_connect()
            if device.device_info['alias']:
                self.devices[device.device_info['alias']] = device

    def _get_ports_with_pid_and_vid(self, vid, pid):
        # Return a list of port_info objects for all devices with the given VID and PID
        return [port_info for port_info in list_ports.comports() if (port_info.vid == vid and port_info.pid == pid)]

    async def wait_for_acknowledgments(self):
        # Wait for acknowledgments from devices
        for device in self.devices.values():
            device_ack_alias = await device.wait_for_acknowledgment()
            print(f"Received acknowledgment from {device_ack_alias}")

    def send_message(self, alias, message):
        # Send a message to the specified device alias only if all required aliases are connected
        if not self.all_required_aliases_connected():
            print("Error: Cannot send message, not all required aliases are connected.")
            return
        if alias in self.devices:
            print(f"{alias}: {message}")
            self.devices[alias].send_data(message)
        else:
            print(f"Error: Alias {alias} not found among connected devices.")

    async def start(self):
        # Start the main tasks
        await self.discover_devices()
        await self.check_required_aliases()

        # Start the reconnect_devices task concurrently
        asyncio.ensure_future(self.reconnect_devices())

        # Start the send_periodic_ack task concurrently for each connected device
        for device in self.devices.values():
            asyncio.ensure_future(device.send_periodic_ack())