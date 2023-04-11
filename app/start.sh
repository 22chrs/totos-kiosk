#!/usr/bin/env bash

# Run balena base image entrypoint script
/usr/bin/entry.sh echo "Running balena base image entrypoint..."

#start express server with nextjs files
npm run startLocal

#balena-idle