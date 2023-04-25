import os
import re
import sys
import socket
import subprocess

def get_local_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        local_ip = s.getsockname()[0]
    except:
        local_ip = '127.0.0.1'
    finally:
        s.close()
    return local_ip

def find_ip_address(mac_address):
    # Get your local IP address
    local_ip = get_local_ip_address()
    network_prefix = ".".join(local_ip.split(".")[:-1])

    # Run nmap to scan the local network for connected devices
    nmap_output = subprocess.check_output(["nmap", "-sn", f"{network_prefix}.0/24"]).decode("utf-8")

    # Regular expression to match IP and MAC addresses
    ip_mac_regex = re.compile(r"Nmap scan report for ([\d\.]+)\nHost is up.*\nMAC Address: ([\w:]+)")

    # Search for IP and MAC addresses in the nmap output
    for match in ip_mac_regex.finditer(nmap_output):
        ip, mac = match.groups()

        # Check if the current MAC address matches the given one
        if mac.lower() == mac_address.lower():
            return ip

    return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <MAC-Address>")
        sys.exit(1)

    mac_address = sys.argv[1]
    ip_address = find_ip_address(mac_address)

    if ip_address:
        print(f"The IP address associated with the MAC address {mac_address} is {ip_address}.")
    else:
        print(f"No IP address found for the MAC address {mac_address}.")
