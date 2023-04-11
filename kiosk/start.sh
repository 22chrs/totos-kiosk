#start.sh

# We are going to wait for the UNIX socket to be mounted before trying to start the application. This will prevent us from going into a crash loop before xserver is ready. See more info here: https://github.com/balenablocks/xserver#waiting-for-xserver-to-start
while [ ! -e /tmp/.X11-unix/X${DISPLAY#*:} ]; do sleep 0.5; done

# Run balena base image entrypoint script. We also specified UDEV=1 in the Dockerfile. This will allow udev devices (mouse, etc) to be mounted
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

# Set the keyboard layout
setxkbmap de

# Add a 5-second delay before starting the app for the xserver to start
sleep 10

# Start D-Bus system message bus
#dbus-daemon --system

# This stops the CPU performance scaling down
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 


#chromium --no-sandbox

# Install and start the electron application
#chmod +x /opt/toto-1.0.0.AppImage
#sudo -u appuser /opt/toto-1.0.0.AppImage --no-sandbox --use-gl=desktop

chmod +x /opt/toto-1.0.0.AppImage
/opt/toto-1.0.0.AppImage --disable-gpu --no-sandbox 
#—use-gl=desktop


# --disable-software-rasterizer