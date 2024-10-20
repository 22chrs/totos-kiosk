#!/bin/sh

# Start cloudflared in the background
# cloudflared tunnel run eyJhIjoiNzkxOWI0ODU3NGI2MjU3ZWFlYjQzMzgyZjhkNGZkMGIiLCJ0IjoiZjYxMDYzOGUtNWYwNC00ZTM3LWJlNDQtNmQ0MjgwZGVjYThjIiwicyI6Ik9UTXlZMkZqWTJFdE56QmlaQzAwTUdObExUaGlNak10TkRrNU1qVXlPRGMxTmpVMCJ9s &

# Start the main application using Gunicorn
exec gunicorn --bind 0.0.0.0:${STREAM_PORT} --workers 1 --threads 2 stream:app