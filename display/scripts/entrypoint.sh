#!/usr/bin/env bash

## Hosts
echo "127.0.0.1 $HOSTNAME" >> /etc/hosts

export DEBIAN_FRONTEND=noninteractive


## XServer Configuration
mkdir -p /tmp/.X11-unix
chown root:root /tmp/.X11-unix
chmod 1777 /tmp/.X11-unix

sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
sudo dpkg-reconfigure xserver-xorg-legacy


echo "allowed_users=anybody" | sudo tee /etc/X11/Xwrapper.config
echo "needs_root_rights=yes" | sudo tee -a /etc/X11/Xwrapper.config



#sudo usermod -a -G tty pi





## Disable CPU Throttling
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

## Show Cursor
if [[ -n $SHOW_CURSOR ]] && [[ $SHOW_CURSOR -eq 1 ]]; then
  export CURSOR=''
  echo "Enabling cursor"
else
  export CURSOR='-- -nocursor'
  echo "Disabling cursor"
fi


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
        # Switch to the chromium user to ensure proper permissions and deleate old certs
        # su - chromium -c "
        #     # List all certificates, extract full nicknames, and delete each one
        #     certutil -d sql:$NSSDB -L | awk -F '  ' '/^[a-zA-Z0-9]/ {print \$1}' | while read CERT; do
        #         certutil -d sql:$NSSDB -D -n \"\$CERT\"
        #         if [ \$? -eq 0 ]; then
        #             echo \"Deleted certificate: \$CERT\"
        #         else
        #             echo \"Failed to delete certificate: \$CERT\"
        #         fi
        #     done
        # "
        update_certificate
        # Kill existing Chromium process
        pkill chromium || true
        # Wait for a moment to ensure the process has been terminated
        sleep 2
        #su -w $environment -c "export DISPLAY=:$DISPLAY_NUM && startx /usr/src/app/startx.sh $CURSOR" - chromium
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





## Pass Environment Variables to New Session
environment=$(env | grep -v -w '_' | awk -F= '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
environment="${environment::-1}"

## Change User to "chromium" and startx with start_server.sh
su -w $environment -c "export DISPLAY=:0 && startx /app/scripts/start_server.sh $CURSOR" - chromium
balena-idle
