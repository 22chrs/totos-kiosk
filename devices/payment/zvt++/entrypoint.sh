#!/bin/bash

mount -t vfat /dev/sda1 /mnt/usb
cp build.zip /mnt/usb
umount /mnt/usb

echo "Build complete. You can copy the binary using from the USB Stick."

# Keep the container running indefinitely (optional)
tail -f /dev/null


