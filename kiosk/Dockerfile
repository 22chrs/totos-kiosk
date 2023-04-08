# Multi Layer Image // Tauri
# https://www.linuxuprising.com/2021/01/how-to-enable-hardware-accelerated.html
# https://github.com/tauri-apps/tauri/issues/4315 

######################################
## Examples:
# https://docs.balena.io/reference/base-images/base-images/
# https://blog.logrocket.com/containerized-development-nestjs-docker/
# 
######################################

######################################
## Base image
######################################

#:<node-version>-<debian-version>
FROM balenalib/generic-amd64-debian-node:18-bookworm-build AS base_image
#FROM balenalib/generic-amd64-debian-node:16-bullseye-build AS base_image
#FROM balenalib/generic-amd64-debian-node AS base_image

#FROM base_image as interface
WORKDIR /opt/

COPY ./ /opt/

# Install Linux system dependencies
#RUN sudo apt update && sudo apt install -y build-essential \
#    curl \
#    wget 

# install dependencies including devDependencies
RUN npm ci --only=dev

RUN npm run build

######################################
## The finalized container
## Puts it all together
######################################

FROM balenalib/generic-amd64-debian-node:18-bookworm-run

WORKDIR /opt/
COPY --from=base_image /opt/dist/toto-1.0.0.AppImage /opt/
COPY ./start.sh /opt/
RUN dir -s

RUN sudo apt update && sudo apt -y install chromium \ 
    fuse

#RUN sudo add-apt-repository universe
#RUN sudo apt install libfuse2


# Install Linux system dependencies (curl & wget are only needed if install new packages)
RUN sudo apt update && sudo apt install -y gstreamer1.0-vaapi \
    gstreamer1.0-plugins-bad \
    libwebkit2gtk-4.0-dev \
    vdpau-driver-all \
    mesa-va-drivers \
    mesa-vdpau-drivers \
    libvdpau1 \
    vdpauinfo \
    libva-drm2 \
    libva-x11-2 \
    libgl1-mesa-dri \
    libgl1-mesa-glx \
    libglapi-mesa \
    libxcb-glx0 \
    libx11-xcb1 \
    libxcb-dri2-0 \
    libxcb-dri3-0 \
    libxcb-present0 \
    libxcb-sync1 \
    libxshmfence1 \
    libxxf86vm1 \
    mesa-vulkan-drivers \
    libegl1-mesa \
    libgles2-mesa \
    libegl-mesa0 \
    libgles1 \
    libgles2 \
    x11-xkb-utils

# x11-xkb-utils keyboard language

# Configure Vulkan ICD
ENV VK_ICD_FILENAMES /usr/share/vulkan/icd.d/intel_icd.x86_64.json:/usr/share/vulkan/icd.d/radeon_icd.x86_64.json:/usr/share/vulkan/icd.d/nvidia_icd.json

#at-spi2-core

# Clean up to reduce container size
RUN apt clean \
    && rm -rf /var/lib/apt/lists/*

# install hej-toto-kiosk
#RUN dpkg -i hej-toto-kiosk_1.1.0_amd64.deb


ENV NODE_ENV=production \
    # this is specific for balena, to let the startup script know we want to use all udev devices (mouse, keyboard, etc)
    UDEV=1 \
    # this is very important, we need to tell our environment that we are going to talk to display 0, which is hosted by the xserver block
    DISPLAY=:0


# We are running our entrypoint commands through the start.sh script, because we need to do a couple more things outside of just run electron
CMD ["bash", "/opt/start.sh"]



# chrome dev tools
#hardwarebeschleidnung 
#gpu beschleunigung
# tauri linux accel
#wayland
#app get




# # ubuntu image for the hardware acceleration
# FROM balenalib/generic-ubuntu-node:16-jammy-run

# # settings while noninteractive installation
# ENV DEBIAN_FRONTEND=noninteractive
# RUN echo "Europe/Berlin" > /etc/timezone && \
#     ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
#     apt-get update && \
#     apt-get install -y tzdata && \
#     dpkg-reconfigure --frontend noninteractive tzdata



# curl \
#     wget \
#     libwebkit2gtk-4.0-dev \
#     mesa-va-drivers \
#     mesa-vdpau-drivers \
#     libvdpau1 \
#     vdpauinfo \
#     libva-drm2 \
#     libva-x11-2 \
#     libgl1-mesa-dri \
#     libgl1-mesa-glx \
#     libglapi-mesa \
#     libgles2-mesa \
#     libegl1-mesa \
#     libxcb-glx0 \
#     libx11-xcb1 \
#     libxcb-dri2-0 \
#     libxcb-dri3-0 \
#     libxcb-present0 \
#     libxcb-sync1 \
#     libxshmfence1 \
#     libxxf86vm1 