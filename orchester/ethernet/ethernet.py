# ethernet.py

import socket
import logging  # Add this import
from zeroconf import ServiceBrowser, Zeroconf, ServiceStateChange

class MyListener:

    def __init__(self):
        self.devices = {}
    
    def __call__(self, zeroconf, service_type, name, state_change):
        if state_change == ServiceStateChange.Added:
            self.add_service(zeroconf, service_type, name)
        elif state_change == ServiceStateChange.Removed:
            self.remove_service(zeroconf, service_type, name)
        elif state_change == ServiceStateChange.Updated:
            self.update_service(zeroconf, service_type, name)

    def remove_service(self, zeroconf, type, name):
        logging.info(f"Service {name} removed")
        if name in self.devices:
            del self.devices[name]

    def add_service(self, zeroconf, type, name):
        if type == "_services._dns-sd._udp.local.":
            logging.info(f"Service type {name} discovered")
        else:
            info = zeroconf.get_service_info(type, name)
            logging.info(f"Service {name} added, service info: {info}")
            if info:
                address = socket.inet_ntoa(info.addresses[0])
                port = info.port
                self.devices[name] = (address, port)
                logging.info(f"Found device at {address}:{port}")
                # Add your code to connect to the device here

    def update_service(self, zeroconf, type, name):
        pass

    def list_devices(self):
        print("Connected devices:")
        for name, (address, port) in self.devices.items():
            print(f"{name}: {address}:{port}")

def discover_devices(service_type="_services._dns-sd._udp.local."):
    logging.info(f"Discovering devices with service type '{service_type}'")
    zeroconf = Zeroconf()
    listener = MyListener()
    browser = ServiceBrowser(zeroconf, service_type, [listener])  # Wrap the listener object in a list
    return zeroconf, listener
