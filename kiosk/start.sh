#!/bin/sh

# https://github.com/balena-labs-projects/xserver
# We are going to wait for the UNIX socket to be mounted before trying to start the application. This will prevent us from going into a crash loop before xserver is ready. See more info here: https://github.com/balenablocks/xserver#waiting-for-xserver-to-start
while ! xset -q; do sleep 0.5; done

# Run balena base image entrypoint script. We also specified UDEV=1 in the Dockerfile. This will allow udev devices (mouse, etc) to be mounted
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

# Set the keyboard layout
setxkbmap de

# dbus
rm -f /run/dbus/pid
# Create the /run/dbus directory if it does not exist
mkdir -p /run/dbus
# Start the system D-Bus daemon
dbus-daemon --system --fork
# Use dbus-launch
export $(dbus-launch)

# This stops the CPU performance scaling down
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 

npm run startLocal
while ! nc -z localhost 3000; do sleep 1; done

exec chromium --kiosk --no-sandbox --disable-dev-shm-usage http://localhost:3000 
#chromium --kiosk --no-sandbox --disable-dev-shm-usage --disable-infobars --incognito http://localhost:3000 