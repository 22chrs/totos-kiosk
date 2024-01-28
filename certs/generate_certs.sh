#!/bin/bash
set -e

echo "Starting certificate generation process..."

# Set the directory where you want to store your certificates and keys
CERT_DIR=./
cd $CERT_DIR

echo "Installing the local CA in the system trust store..."
ROOT_CA_PATH=$(mkcert -CAROOT)
echo "Root CA Path: $ROOT_CA_PATH"

echo "Copying root CA files to $CERT_DIR..."
cp "$ROOT_CA_PATH"/rootCA.pem .
cp "$ROOT_CA_PATH"/rootCA-key.pem .

echo "Generating certificate and key for 'devices'..."
mkcert -key-file devices-key.pem -cert-file devices.pem "devices" "*.devices"

echo "Certificates and keys generated in $CERT_DIR"
