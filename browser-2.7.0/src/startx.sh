#!/usr/bin/env bash

echo "--- List Input Devices ---"
xinput list
echo "----- End of List --------"

# Set the default cursor to the standard arrow for the entire X session
xsetroot -cursor_name left_ptr

# these two lines remove the "restore pages" popup on chromium. 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /data/chromium/'Local State' > /dev/null 2>&1 || true 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' /data/chromium/Default/Preferences > /dev/null 2>&1 || true 

# Set chromium version into an EnVar for later
export VERSION=`chromium-browser --version`
echo "Installed browser version: $VERSION"

#export DISPLAY=:0
xrandr --output HDMI-1 --mode 1280x800 --pos 0x0 --rate 60
xrandr --output HDMI-2 --mode 1280x800 --pos 1280x0 --rate 60
xrandr --fb 3840x800
#xrandr --fb 2560x800
sleep 2

# Set the Coordinate Transformation Matrix for each touchscreen
# Assuming id=6 corresponds to HDMI-1 and id=7 to HDMI-2
# For Screen 1 (HDMI-1)
xinput set-prop 6 --type=float "Coordinate Transformation Matrix" 0.333333 0 0 0 1 0 0 0 1
# For Screen 2 (HDMI-2)
xinput set-prop 7 --type=float "Coordinate Transformation Matrix" 0.333333 0 0.333333 0 1 0 0 0 1

# Map touch input devices to their corresponding screens
xinput map-to-output 6 HDMI-1
xinput map-to-output 7 HDMI-2


# stop the screen blanking
xset s off -dpms

node /usr/src/app/server.js