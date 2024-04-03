#!/usr/bin/env bash

echo "--- List Input Devices ---"
xinput list
xrandr --query
lspci
echo "----- End of List --------"

#export DISPLAY=:0
#xrandr --output HDMI-1 --mode 1280x800 --pos 0x0 --rate 60 --primary
#xrandr --output HDMI-2 --mode 1280x800 --pos 1280x0 --rate 60 
#xrandr --fb 3840x800
#xrandr --fb 2560x800
sleep 2

## Display Size
display_size=$( xrandr | grep connected | grep -oP '\d+x\d+\+\d+\+\d' )
export DISPLAY_1=$(echo "$display_size" | sed -n '1p')
export DISPLAY_2=$(echo "$display_size" | sed -n '2p')



# these two lines remove the "restore pages" popup on chromium. 
# sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /data/chromium/'Local State' > /dev/null 2>&1 || true 
# sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' /data/chromium/Default/Preferences > /dev/null 2>&1 || true 

## Disable Screen Blank
xset s off -dpms

cd /app
npm run start