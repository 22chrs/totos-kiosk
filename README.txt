


modify balena browser:
# Todo: 


// add to dockerfile.template before audio things

# Install locale and keyboard configuration packages
RUN apt-get update && apt-get install -y locales console-data

# Generate locale for German
RUN sed -i '/de_DE.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen

# Set environment variables for German locale
ENV LANG de_DE.UTF-8
ENV LANGUAGE de_DE:de
ENV LC_ALL de_DE.UTF-8

# Set the keyboard layout to German
RUN echo "XKBLAYOUT=de" > /etc/default/keyboard


RUN apt-get update && apt-get install -y \
    libnss3-tools \
    lsb-release 



// add to start.sh after setting up user data; after the 2 sec sleep look that the start chromium code is still the same chromium starting code than some lines after this code


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
