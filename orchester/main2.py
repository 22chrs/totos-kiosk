# main.py

import logging
import time
from ethernet.ethernet import discover_devices  # Modify the import statement

# Configure logging
logging.basicConfig(level=logging.INFO)

# Discover devices using Zeroconf
logging.info("Starting device discovery...")
zeroconf, listener = discover_devices()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nListing connected devices:")
    listener.list_devices()
finally:
    zeroconf.close()
