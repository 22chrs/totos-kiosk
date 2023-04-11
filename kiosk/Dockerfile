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

FROM balenalib/generic-amd64-debian-node:18-bullseye-run

WORKDIR /opt/
COPY --from=base_image /opt/dist/toto-1.0.0.AppImage /opt/
COPY ./start.sh /opt/
COPY ./keyboard_preseed.cfg /tmp/
#RUN dir -s

#RUN echo "keyboard-configuration keyboard-configuration/layoutcode select de" | debconf-set-selections
# fuse (use AppImage)
# x11-xkb-utils (German keyboard layout)
# tzdata (set UTC Time Zone)
# apt-rdepends (dependency list maker)
RUN sudo apt update && sudo apt install -y fuse \
    tzdata \
    x11-xkb-utils \
    chromium \
    apt-rdepends

#RUN apt-rdepends chromium | grep -v "^ " | grep -v -E '(debconf-2.0|gsettings-backend|dbus-session-bus|xdg-desktop-portal-backend)' > dependencies-chromium.list
#RUN sudo xargs -a dependencies-chromium.list apt install -y


# # Create a new user
# RUN useradd -m appuser
# # Set ownership and permissions for the new user
# RUN chown -R appuser:appuser /opt/
# # Set USER environment variable to the new user
# ENV USER=appuser

# RUN sudo apt update && sudo apt install -y \
#     libgtk-3-0 \
#     libnss3 \
#     libxss1 \
#     libasound2 \
#     libx11-xcb1 \
#     libdrm2 \
#     libgbm1 \
#     libxtst6 \
#     libxrandr2 \
#     libatk1.0-0 \
#     libdbus-1-3 \
#     libglib2.0-0 \
#     libexpat1 \
#     fuse \
#     tzdata \
#     dbus \
#     dbus-x11 \
#     x11-xkb-utils  \
#     libgl1-mesa-glx \
#     libgl1-mesa-dri 

#RUN sudo apt install -y chromium

# # Install debconf-utils and apply the preseed configuration
# RUN apt-get update && \
#     apt-get install -y debconf-utils && \
#     cat /tmp/keyboard_preseed.cfg | debconf-set-selections && \
#     rm /tmp/keyboard_preseed.cfg

# RUN sudo apt-get install -y \
#     xserver-xorg-input-evdev 

# Clean up to reduce container size
RUN apt clean \
    && rm -rf /var/lib/apt/lists/*


# Set timezone to Berlin (tzdata required, x11-xkb-utils
ENV TZ=Europe/Berlin
# Create symbolic link
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV=production \
    # this is specific for balena, to let the startup script know we want to use all udev devices (mouse, keyboard, etc)
    UDEV=1 \
    # this is very important, we need to tell our environment that we are going to talk to display 0, which is hosted by the xserver block
    DISPLAY=:0

# We are running our entrypoint commands through the start.sh script, because we need to do a couple more things outside of just run electron
CMD ["bash", "/opt/start.sh"]