# Python base image
FROM balenalib/generic-amd64-debian-python:3.7-bullseye-run

WORKDIR /opt/

# This will copy all files in our root to the working directory in the container
COPY . .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Clean up to reduce container size
RUN apt clean \
    && rm -rf /var/lib/apt/lists/*

# Enable udevd so that plugged dynamic hardware devices show up in our container.
ENV UDEV=1

# main.py will run when container starts up on the device
CMD ["python","-u","main.py"]