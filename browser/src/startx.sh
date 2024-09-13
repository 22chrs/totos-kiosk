#!/usr/bin/env bash

echo "--- List Input Devices ---"
xinput list
echo "----- End of List --------"

function reverse_window_coordinates () {
  local INPUT=$1

  IFS=', ' read -a coords <<< $INPUT
  if [ ${#coords[@]} -eq 2 ]; then
    echo "${coords[1]},${coords[0]}"
  else
    echo "Screen coordinates not set correctly, so cannot reverse them."
  fi 
}

function rotate_touch () {
  echo "Rotating Input ($1): $2"
  local TRANSFORM='Coordinate Transformation Matrix'

  case "$2" in
    normal)   xinput set-prop "$1" "$TRANSFORM" 1 0 0 0 1 0 0 0 1;;
    inverted) xinput set-prop "$1" "$TRANSFORM" -1 0 1 0 -1 1 0 0 1;;
    left)     xinput set-prop "$1" "$TRANSFORM" 0 -1 1 1 0 0 0 0 1;;
    right)    xinput set-prop "$1" "$TRANSFORM" 0 1 0 -1 0 1 0 0 1;;
  esac
}

if [[ -z "$WINDOW_SIZE" ]]; then
  # detect the window size from the framebuffer file
  echo "Detecting window size from framebuffer"
  export WINDOW_SIZE=$( cat /sys/class/graphics/fb0/virtual_size )
  echo "Window size detected as $WINDOW_SIZE"
else
  echo "Window size set by environment variable to $WINDOW_SIZE"
fi

# rotate screen if env variable is set [normal, inverted, left or right]
if [[ ! -z "$ROTATE_DISPLAY" ]]; then
  sleep 3 && xrandr -o $ROTATE_DISPLAY

  #If the display is rotated to left or right, we need to reverse the size and position coords
  if [[ "$ROTATE_DISPLAY" == "left" ]] || [[ "$ROTATE_DISPLAY" == "right" ]]; then
    
    echo "Display rotated to portait. Reversing screen coordinates"
    
    #window size
    REVERSED_SIZE="$(reverse_window_coordinates $WINDOW_SIZE)"
    WINDOW_SIZE=$REVERSED_SIZE
    echo "Reversed window size: $WINDOW_SIZE"
    
    #window position, if set
    if [[ "$WINDOW_POSITION" -ne "0,0" ]]
    then
      REVERSED_POSITION="$(reverse_window_coordinates $WINDOW_POSITION)"
      export WINDOW_POSITION=$REVERSED_POSITION
      echo "Reversed window position: $WINDOW_POSITION"
    fi
  fi

  echo "Rotate Touch Inputs"
  if [[ ! -z "$TOUCHSCREEN" ]]; then
    rotate_touch "$TOUCHSCREEN" "$ROTATE_DISPLAY"
  else
    devices=$( xinput --list | fgrep Touch | sed -E 's/^.*id=([0-9]+).*$/\1/' )
    for device in ${devices} ;do
        rotate_touch $device $ROTATE_DISPLAY
    done
  fi
fi

# these two lines remove the "restore pages" popup on chromium. 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /data/chromium/'Local State' > /dev/null 2>&1 || true 
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/; s/"exit_type":"[^"]\+"/"exit_type":"Normal"/' /data/chromium/Default/Preferences > /dev/null 2>&1 || true 



# Set chromium version into an EnVar for later
export VERSION=`chromium-browser --version`
echo "Installed browser version: $VERSION"

# stop the screen blanking
xset s off -dpms

#! NEU START

# #! beamer präsentation full hd
#xrandr --fb 1920x1080
# xinput set-prop 10 "Coordinate Transformation Matrix" 1 0 0 0 1 0 0 0 1
# # For Screen 2 (HDMI-2)
# xinput set-prop 11 "Coordinate Transformation Matrix" 1 0 -1 0 1 0 0 0 1
# # Map touch input devices to their corresponding screens
# xinput map-to-output 10 HDMI-2
# xinput map-to-output 11 HDMI-1




# #! working hej toto kiosk

# Detect touch devices (filter by 'Atmel', adjust if necessary)
TOUCH_DEVICES=$(xinput list | grep -i 'Atmel' | grep -o 'id=[0-9]*' | grep -o '[0-9]*')

# Detect HDMI outputs (adjust if you need to match other types of displays)
HDMI_OUTPUTS=$(xrandr | grep -w connected | grep HDMI | cut -d ' ' -f 1)

# Initialize index for HDMI outputs
OUTPUT_INDEX=0

# Loop through each detected touch device and map it to the HDMI output
for TOUCH_ID in $TOUCH_DEVICES; do
    # Get the current HDMI output for this touch device
    HDMI_OUTPUT=$(echo $HDMI_OUTPUTS | cut -d ' ' -f $((OUTPUT_INDEX + 1)))

    if [ -z "$HDMI_OUTPUT" ]; then
        echo "No more HDMI outputs available to map. Exiting."
        #continue
    fi

# Apply the Coordinate Transformation Matrix
    if [[ $OUTPUT_INDEX -eq 0 ]]; then
        # First screen, no translation
        echo "Applying Coordinate Transformation Matrix for $TOUCH_ID on the first screen:"
        echo "xinput set-prop $TOUCH_ID 'Coordinate Transformation Matrix' 2 0 0 0 1 0 0 0 1"
        
        xinput set-prop $TOUCH_ID "Coordinate Transformation Matrix" 0.5 0 0 0 1 0 0 0 1
        # xinput set-prop $TOUCH_ID "Coordinate Transformation Matrix" 0.5 0 0 0 1 0 0 0 1 #! working intel
    else
        # Second screen, apply translation on the X axis
        echo "Applying Coordinate Transformation Matrix for $TOUCH_ID on the second screen:"
        echo "xinput set-prop $TOUCH_ID 'Coordinate Transformation Matrix' 2 0 0.5 0 1 0 0 0 1"
        
        xinput set-prop $TOUCH_ID "Coordinate Transformation Matrix" 0.5 0 0.5 0 1 0 0 0 1
        # xinput set-prop $TOUCH_ID "Coordinate Transformation Matrix" 0.5 0 0.5 0 1 0 0 0 1 #! working intel
    fi
        # Map the touch device to the corresponding HDMI output
        echo "Mapping touch device $TOUCH_ID to $HDMI_OUTPUT"
        xinput map-to-output $TOUCH_ID $HDMI_OUTPUT

    # Increment the output index for the next device
    OUTPUT_INDEX=$((OUTPUT_INDEX + 1))
done

# a b c d e f 0 0 1
	# •	a: Horizontal scaling (X axis) — Shrinks/expands the touch input horizontally. 1 = no scaling, 0.5 = half-width.
	# •	b: X-axis skew/rotation — Typically 0 unless rotating or skewing.
	# •	c: Horizontal translation — Moves touch input left/right. 0.5 moves halfway to the right.
	# •	d: Y-axis skew/rotation — Typically 0 unless rotating or skewing.
	# •	e: Vertical scaling (Y axis) — Shrinks/expands the touch input vertically. 1 = no scaling, 0.5 = half-height.
	# •	f: Vertical translation — Moves touch input up/down. 0.5 moves halfway down the screen.
	# •	g h 1: Always 0 0 1.



#! Pi 5
# xrandr --fb 2559x800
# xinput set-prop 6 "Coordinate Transformation Matrix" 1 0 0 0 1 0 0 0 1
# # For Screen 2 (HDMI-2)
# xinput set-prop 7 "Coordinate Transformation Matrix" 1 0 -1 0 1 0 0 0 1
# # Map touch input devices to their corresponding screens
# xinput map-to-output 6 HDMI-1
# xinput map-to-output 7 HDMI-2

#! NEU ENDE

node /usr/src/app/server.js