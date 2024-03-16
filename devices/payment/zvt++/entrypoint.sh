#!/bin/bash

# Echo a message that the build is ready and provide an SSH command example
echo "Build complete. You can copy the binary using SSH with the following command:"
echo "scp pi@<your-device-ip>:/opt/zvt++/build/zvt++ /local/destination/path"

# Keep the container running indefinitely (optional)
tail -f /dev/null
