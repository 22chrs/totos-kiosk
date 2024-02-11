#!/usr/bin/env bash

echo "--- List Input Devices ---"
xinput list
echo "----- End of List --------"

# these two lines remove the "restore pages" popup on chromium. 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /data/chromium/'Local State' > /dev/null 2>&1 || true 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' /data/chromium/Default/Preferences > /dev/null 2>&1 || true 

# Set chromium version into an EnVar for later
export VERSION=`chromium-browser --version`
echo "Installed browser version: $VERSION"

export DISPLAY=:0
xrandr --output HDMI-1 --mode 1280x800 --pos 0x0 --rate 60
xrandr --output HDMI-2 --mode 1280x800 --pos 1280x0 --rate 60
xrandr --fb 3840x800
sleep 2

echo "Point"
echo "Point"
echo "Point"
echo "Point"
echo "Point"
echo "Point"
echo "Point"
echo "PointXX"


# stop the screen blanking
xset s off -dpms

node /usr/src/app/server.js