import asyncio
import serial
import time
from serial.tools import list_ports

class DeviceSerial:
    def __init__(self, port, baudrate, timeout, alias_timeout=5):
        # Initialize the DeviceSerial object with given parameters
        self.port = port
        self.baudrate = baudrate
        self.timeout = timeout
        self.alias_timeout = alias_timeout
        self.device_info = {'port': port, 'alias': None}
        self.serial_connection = None
        self.received_ack = asyncio.Event()

    async def connect(self):
        # Connect to the serial device and request its alias
        try:
            self.serial_connection = serial.Serial(self.device_info['port'], self.baudrate, timeout=self.timeout)
            print(f"Connected to device at {self.device_info['port']}")
            self.serial_connection.write("REQUEST_ALIAS\n".encode())  # Send REQUEST_ALIAS command
        except Exception as e:
            print(f"Error connecting to {self.device_info['port']}: {str(e)}")
            return

        await self.receive_initial_alias()

    async def receive_initial_alias(self):
        # Receive the initial alias from the serial device
        start_time = time.time()
        while True:
            current_time = time.time()
            if current_time - start_time > self.alias_timeout:
                print("Alias timeout reached.")
                break

            if self.serial_connection.in_waiting > 0:
                data = self.serial_connection.readline().decode().strip()
                if data:
                    print(f"Received alias: {data}")
                    self.device_info["alias"] = data
                    
                    break
            else:
                print("Waiting for alias ...")
                await asyncio.sleep(0.1)

    def send_data(self, message):
        # Send data to the serial device
        try:
            self.serial_connection.write((message + '\n').encode())
        except Exception as e:
            print(f"Error sending data to {self.device_info['alias']}: {str(e)}")

class UsbSerialManager:
    def __init__(self, vid, pid, baudrate, timeout):
        # Initialize the UsbSerialManager object with given parameters
        self.vid = vid
        self.pid = pid
        self.baudrate = baudrate
        self.timeout = timeout
        self.devices = {}

    async def discover_devices(self):
        # Discover devices with the specified VID and PID and establish a connection
        available_ports = self._get_ports_with_pid_and_vid(self.vid, self.pid)
        for port_info in available_ports:
            device = DeviceSerial(port_info.device, self.baudrate, self.timeout)
            await device.connect()

    def _get_ports_with_pid_and_vid(self, vid, pid):
        # Return a list of port_info objects for all devices with the given VID and PID
        return [port_info for port_info in list_ports.comports() if (port_info.vid == vid and port_info.pid == pid)]

    async def wait_for_acknowledgments(self):
        # Wait for acknowledgments from devices
        for device in self.devices.values():
            device_ack_alias = await device.wait_for_acknowledgment()
            print(f"Received acknowledgment from {device_ack_alias}")

    def send_message(self, alias, message):
        # Send a message to the specified device alias
        if alias in self.devices:
            print(f"{alias}: {message}")
            self.devices[alias].send_data(message)

    async def start(self):
        # Start the main tasks: waiting for acknowledgments and sending messages periodically
        wait_for_ack_task = asyncio