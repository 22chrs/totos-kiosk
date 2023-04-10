######################################
## Base image
######################################

# base image
FROM balenalib/generic-amd64-debian-node:18-bullseye-build AS base_image

WORKDIR /opt/

# copy file system (without .dockerigonre files)
COPY ./ /opt/

# install dependencies including devDependencies
RUN npm ci --only=dev

# build electron app
RUN npm run build

######################################
## The finalized container
## Puts it all together
######################################

FROM balenalib/generic-amd64-debian-node:18-bullseye-build

WORKDIR /opt/
COPY --from=base_image /opt/dist/toto-1.0.0.AppImage /opt/
COPY ./start.sh /opt/
#RUN dir -s

#RUN echo "keyboard-configuration keyboard-configuration/layoutcode select de" | debconf-set-selections
# fuse (use AppImage)
# x11-xkb-utils (German keyboard layout)
# tzdata (set UTC Time Zone)
RUN sudo apt update && sudo apt -y install fuse \ 
    chromium \ 
    tzdata \ 
    x11-xkb-utils 

# Set timezone to Berlin (tzdata required, x11-xkb-utils
ENV TZ=Europe/Berlin
# Create symbolic link
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Clean up to reduce container size
RUN apt clean \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    # this is specific for balena, to let the startup script know we want to use all udev devices (mouse, keyboard, etc)
    UDEV=1 \
    # this is very important, we need to tell our environment that we are going to talk to display 0, which is hosted by the xserver block
    DISPLAY=:0

# We are running our entrypoint commands through the start.sh script, because we need to do a couple more things outside of just run electron
CMD ["bash", "/opt/start.sh"]