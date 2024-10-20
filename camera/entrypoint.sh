#!/bin/sh

# Start the main application using Gunicorn
exec gunicorn --bind 0.0.0.0:${STREAM_PORT} --workers 1 --threads 2 stream:app