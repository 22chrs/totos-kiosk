import asyncio
import serial
from serial.tools import list_ports

class DeviceSerial:
    # Constructor: initializes the serial device with the given device information
    def __init__(self, device_info, timeout=1):
        self.port = self._get_device_port(device_info)
        self.alias = device_info["alias"]
        self.baudrate = device_info["baudrate"]
        self.timeout = timeout
        self.serial_connection = None

    @staticmethod
    def _get_device_port(device_info):
        vid, pid = device_info["vid"], device_info["pid"]

        for port_info in list_ports.comports():
            if (port_info.vid, port_info.pid) == (vid, pid):
                return port_info.device

        raise ValueError(f"{device_info['name']} device not found")

    def connect(self):
        try:
            self.serial_connection = serial.Serial(self.port, self.baudrate, timeout=self.timeout)
            print(f"Connected to {self.alias} on port {self.port}")
        except Exception as e:
            print(f"Error connecting to {self.alias}: {e}")

    def disconnect(self):
        if self.serial_connection:
            self.serial_connection.close()
            print(f"Disconnected from {self.alias}")

    def send_data(self, data):
        if self.serial_connection:
            try:
                self.serial_connection.write(data.encode())
            except Exception as e:
                print(f"Error sending data to {self.alias}: {e}")

    def read_data(self):
        if self.serial_connection:
            try:
                data = self.serial_connection.readline().decode().strip()
                return data
            except Exception as e:
                print(f"Error reading data from {self.alias}: {e}")
        return None
    
    async def wait_for_acknowledgment(self):
        if self.serial_connection:
            while True:
                data = self.read_data()
                if data and data.startswith("ACK:"):
                    return data[4:]
                await asyncio.sleep(0.1)  # Add sleep to avoid blocking the event loop

# List of supported devices with their VID, PID, baud rate, and alias values
devices = [
    {
        "name": "Teensy 4.1",
        "vid": 0x16C0,
        "pid": 0x0483,
        "baudrate": 9600,
        "alias": "Motorsteuerung_A",
    },
    {
        "name": "Teensy 4.1",
        "vid": 0x16C0,
        "pid": 0x0483,
        "baudrate": 9600,
        "alias": "Motorsteuerung_B",
    },
]

class UsbSerialManager:
    def __init__(self):
        self.devices = {}
        for device_info in devices:
            alias = device_info["alias"]
            self.devices[alias] = DeviceSerial(device_info)
            self.devices[alias].connect()
        asyncio.get_event_loop().create_task(self.wait_for_acknowledgments())

    async def wait_for_acknowledgments(self):
        for device in self.devices.values():
            device_ack_alias = await device.wait_for_acknowledgment()
            print(f"Received acknowledgment from {device_ack_alias}")

    def send_message(self, alias, message):
        if alias in self.devices:
            print(f"{alias}: {message}")
            self.devices[alias].send_data(message)
        else:
            print(f"Device with alias '{alias}' not found.")