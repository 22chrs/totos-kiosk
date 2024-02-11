



#!/usr/bin/env bash

# Increase the namespace limit for the Chromium sandbox
sysctl -w user.max_user_namespaces=10000

# Run Balena base image entrypoint script
/usr/bin/entry.sh echo "Running Balena base image entrypoint..."

# Set DBUS system bus address
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

# Configure X11 permissions
sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy

# Announce script version
echo "BalenaLabs browser version: $(<VERSION)"

# Set CPU performance
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Check and export DISPLAY_NUM
if [[ -z "$DISPLAY_NUM" ]]; then
    export DISPLAY_NUM=0
fi

# Cursor configuration
if [[ ! -z $SHOW_CURSOR ]] && [[ "$SHOW_CURSOR" -eq "1" ]]; then
    export CURSOR=''
    echo "Enabling cursor"
else
    export CURSOR='-- -nocursor'
    echo "Disabling cursor"
fi

# GPU memory check for Raspberry Pi devices
if command -v vcgencmd &> /dev/null; then
    echo "Checking GPU memory"
    if [ "$(vcgencmd get_mem gpu | grep -o '[0-9]\+')" -lt 128 ]; then
        echo -e "\033[91mWARNING: GPU MEMORY TOO LOW"
    fi
fi

# Raspberry Pi 5 specific configuration
if [ "${BALENA_DEVICE_TYPE}" = "raspberrypi5" ]; then
    echo "Raspberry Pi 5 detected, injecting X.org config"
    cp -a "/usr/src/build/rpi/99-vc4.conf" "/etc/X11/xorg.conf.d/"
fi

# Set up user data area for chromium
mkdir -p /data/chromium
chown -R chromium:chromium /data
rm -f /data/chromium/SingletonLock

# Function to update the certificate for both root and chromium users
update_certificate_for_user() {
    local user=$1
    local cert_path="/certs/rootCA.pem"

    if [ "$user" = "root" ]; then
        local cert_dir="/usr/local/share/ca-certificates"
        local nssdb_dir="/root/.pki/nssdb"
    else
        local cert_dir="/home/$user/.local/share/ca-certificates"
        local nssdb_dir="/home/$user/.pki/nssdb"
    fi

    # Ensure the certificate directory exists
    mkdir -p "$cert_dir"
    cp "$cert_path" "$cert_dir/rootCA.crt"

    # Update CA certificates
    update-ca-certificates

    # Ensure the NSS database directory exists
    mkdir -p "$nssdb_dir"
    chown -R $user:$user "$(dirname "$nssdb_dir")"

    # Initialize and update the NSS database
    su - $user -c "certutil -d sql:$nssdb_dir --empty-password -N -f /dev/null 2> /dev/null"
    su - $user -c "certutil -d sql:$nssdb_dir -A -t 'C,,' -n rootCA -i $cert_path"
}

# Update certificate for root and chromium users
update_certificate_for_user "root"
update_certificate_for_user "chromium"

# Start the X Server and configure it
# startx -- :0 &
# echo "Starting xServer and waiting..."
# sleep 10
# echo "Done waiting. Configuring xServers."
# xset s off -dpms
# export DISPLAY=:0
# xrandr --output HDMI-1 --mode 1280x800 --pos 0x0 --rate 60
# xrandr --output HDMI-2 --mode 1280x800 --pos 1280x0 --rate 60
# xrandr --fb 3840x800
# sleep 5


#service dbus start
#xhost +si:localuser:$USER &

# export DISPLAY=:0
# if ! xset q &>/dev/null; then
#     echo "Starting X Server..."
#     startx &
#     sleep 10  # Wait for X server to become ready
# fi



# we can't maintain the environment with su, because we are logging in to a new session
# so we need to manually pass in the environment variables to maintain, in a whitelist
# This gets the current environment, as a comma-separated string
echo "Point A"
environment=$(env | grep -v -w '_' | awk -F= '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
# remove the last comma
environment="${environment::-1}"

# launch Chromium and whitelist the enVars so that they pass through to the su session
su -w $environment -c "export DISPLAY=:0 && startx /usr/src/app/startx.sh $CURSOR" - chromium
echo "Point BBC"


#su - chromium -w $environment -c 'chromium-browser --kiosk --new-window --user-data-dir=/tmp/browser-1 --window-size=1280,800 --window-position="0,0" --start-fullscreen --kiosk --touch-events=enabled --disable-pinch --noerrdialogs --disable-session-crashed-bubble --disable-component-update --overscroll-history-navigation=0 --disable-translate --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null --no-sandbox https://app:8082?display=1 &'
#su - chromium -w $environment -c 'chromium-browser --kiosk --new-window --user-data-dir=/tmp/browser-2 --window-size=1280,800 --window-position="2560,0" --start-fullscreen --kiosk --touch-events=enabled --disable-pinch --noerrdialogs --disable-session-crashed-bubble --disable-component-update --overscroll-history-navigation=0 --disable-translate --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null --no-sandbox https://app:8082?display=2 &'

#chromium-browser --app=https://app:8082?display=1 --window-size=1280,800 --window-position=0,0 --kiosk --user-data-dir=/var/tmp/display1 --no-sandbox&
#chromium-browser --app=https:/google.com --window-size=1280,800 --window-position=2560,0 --kiosk --user-data-dir=/var/tmp/display2 --no-sandbox&


balena-idle

