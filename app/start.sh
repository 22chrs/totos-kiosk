#!/usr/bin/env bash

echo "Running start.sh script..."

# Start the Next.js app with Express (server.js) in the background
echo "Starting server.js..."
npm run startLocal &

# Delay to ensure server starts
sleep 5

echo "server.js has been started."

# Start SSL certificate
echo "Starting SSL proxy..."
npx local-ssl-proxy --key /opt/app-key.pem --cert /opt/app.pem --source 8082 --target 8081 &
echo "SSL certificate proxy started."

# Ensure the /certs directory exists (it should be your mounted shared volume)
mkdir -p /certs
# Copy the rootCA.pem file from its location to the shared volume
cp /root/.local/share/mkcert/rootCA.pem /certs/

# Run balena-idle to keep the container running
echo "Running balena-idle..."
balena-idle
