#!/usr/bin/env bash

# this allows chromium sandbox to run, see https://github.com/balena-os/meta-balena/issues/2319
sysctl -w user.max_user_namespaces=10000

# Run balena base image entrypoint script
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket

sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" >> /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy

echo "balenaLabs browser version: $(<VERSION)"

# this stops the CPU performance scaling down
echo "Setting CPU Scaling Governor to 'performance'"
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor 

# check if display number envar was set
if [[ -z "$DISPLAY_NUM" ]]
  then
    export DISPLAY_NUM=0
fi

# set whether to show a cursor or not
if [[ ! -z $SHOW_CURSOR ]] && [[ "$SHOW_CURSOR" -eq "1" ]]
  then
    export CURSOR=''
    echo "Enabling cursor"
  else
    export CURSOR='-- -nocursor'
    echo "Disabling cursor"
fi

# If the vcgencmd is supported (i.e. RPi device) - check enough GPU memory is allocated
if command -v vcgencmd &> /dev/null
then
	echo "Checking GPU memory"
    if [ "$(vcgencmd get_mem gpu | grep -o '[0-9]\+')" -lt 128 ]
	then
	echo -e "\033[91mWARNING: GPU MEMORY TOO LOW"
	fi
fi

# Inject X11 config on the RPi 5 as the defaults do not work
# We do this in the startup script and only for the RPi 5 because
# we build the images per-architecture and we do not want to break
# other aarch64-based device types
if [ "${BALENA_DEVICE_TYPE}" = "raspberrypi5" ]
then
    echo "Raspberry Pi 5 detected, injecting X.org config"
    cp -a "/usr/src/build/rpi/99-vc4.conf" "/etc/X11/xorg.conf.d/"
fi

# set up the user data area
mkdir -p /data/chromium
chown -R chromium:chromium /data
rm -f /data/chromium/SingletonLock



# Define paths for the certificates
SHARED_CERT="/certs/rootCA.pem"
BROWSER_CERT="/usr/local/share/ca-certificates/rootCA.crt"
NSSDB="/home/chromium/.pki/nssdb"

# Function to update the certificate
update_certificate() {
    echo "Updating certificate..."
    cp "$SHARED_CERT" "$BROWSER_CERT"
    update-ca-certificates
    # Ensure the NSSDB directory exists and is owned by the 'chromium' user
    mkdir -p "$NSSDB"
    chown -R chromium:chromium "$NSSDB"
    su - chromium -c "certutil -d sql:$NSSDB --empty-password -N -f /dev/null 2> /dev/null"
    su - chromium -c "certutil -d sql:$NSSDB -A -t 'CT,C,C' -n rootCA -i $SHARED_CERT"
}


# Check if the shared certificate is available and different from the browser's certificate, then update
if [ -f "$SHARED_CERT" ]; then
    if [ ! -f "$BROWSER_CERT" ] || ! cmp -s "$SHARED_CERT" "$BROWSER_CERT"; then
        su - chromium -c "certutil -d sql:$NSSDB -D -n rootCA" #delete old one
        update_certificate
        # Kill existing Chromium process
        pkill chromium || true
        # Wait for a moment to ensure the process has been terminated
        sleep 2
        su -w $environment -c "export DISPLAY=:$DISPLAY_NUM && startx /usr/src/app/startx.sh $CURSOR" - chromium
    fi
else
    echo "Shared certificate not found."
fi

# Background process to periodically check for certificate updates
(
    while true; do
        sleep 10  # Check every hour
        if [ -f "$SHARED_CERT" ] && [ ! -f "$BROWSER_CERT" ] || ! cmp -s "$SHARED_CERT" "$BROWSER_CERT"; then
            update_certificate
        fi
    done
) &




# we can't maintain the environment with su, because we are logging in to a new session
# so we need to manually pass in the environment variables to maintain, in a whitelist
# This gets the current environment, as a comma-separated string
environment=$(env | grep -v -w '_' | awk -F= '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
# remove the last comma
environment="${environment::-1}"

# launch Chromium and whitelist the enVars so that they pass through to the su session
su -w $environment -c "export DISPLAY=:$DISPLAY_NUM && startx /usr/src/app/startx.sh $CURSOR" - chromium


echo "changed"
balena-idle


