#!/usr/bin/env bash


#! NEU START (Intnernet connected check)
while ! ping -c 1 8.8.8.8 > /dev/null 2>&1; do
  echo "Waiting for internet connection..."
  sleep 2
done
echo "Internet is now connected."
#! NEU ENDE (Intnernet connected check)

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



#! NEU START

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

#! NEU ENDE

# we can't maintain the environment with su, because we are logging in to a new session
# so we need to manually pass in the environment variables to maintain, in a whitelist
# This gets the current environment, as a comma-separated string
environment=$(env | grep -v -w '_' | awk -F= '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
# remove the last comma
environment="${environment::-1}"

echo "Waiting for 10 seconds before starting Chromium..."
sleep 10

# launch Chromium and whitelist the enVars so that they pass through to the su session
su -w $environment -c "export DISPLAY=:$DISPLAY_NUM && startx /usr/src/app/startx.sh $CURSOR" - chromium

balena-idle
