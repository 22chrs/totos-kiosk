#!/usr/bin/env bash

echo "Running start.sh script..."

# Start the Next.js app with Express (server.js) in the background
echo "Starting server.js..."
npm run startLocal &

# Delay to ensure server starts
sleep 3

echo "server.js has been started."

# Start SSL certificate
echo "Starting SSL proxy..."
npx local-ssl-proxy --key /certs/app-key.pem --cert /certs/app.pem --source 8082 --target 8081 &
echo "SSL certificate proxy started."

# Run balena-idle to keep the container running
echo "Running balena-idle..."
balena-idle
