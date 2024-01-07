######################################
## Base image
######################################

# base image
#FROM node:19-bookworm AS base_image
FROM balenalib/generic-amd64-debian-node:19.6-bookworm-build AS base_image 

WORKDIR /opt/

# copy file system (without the files listed in the .dockerigonre)
COPY ./hejtoto.com /opt/
#RUN ls -la

# install dependencies including devDependencies
RUN npm ci 

# build electron app
RUN npm run build

######################################
## The finalized container
## Puts it all together
######################################

#FROM node:19-bookworm-slim
FROM balenalib/generic-amd64-debian-node:19.6-bookworm-run

WORKDIR /opt/

# copy the nextjs app
COPY --from=base_image /opt/next.config.mjs /opt/
COPY --from=base_image /opt/package.json /opt/
COPY --from=base_image /opt/package-lock.json /opt/
COPY --from=base_image /opt/.next /opt/.next
COPY --from=base_image /opt/public /opt/public
COPY --from=base_image /opt/server.js /opt/
COPY --from=base_image /opt/.env.production /opt/



# copy the start skript and other stuff
COPY ./start.sh /opt/
#RUN dir -s

# Install production dependencies only
RUN npm ci --omit=dev

ENV NODE_ENV=production 
# this is specific for balena, to let the startup script know we want to use all udev devices (mouse, keyboard, etc)
#UDEV=1 \
# this is very important, we need to tell our environment that we are going to talk to display 0, which is hosted by the xserver block
#DISPLAY=:0

# We are running our entrypoint commands through the start.sh script, because we need to do a couple more things outside of just run electron
CMD ["bash", "/opt/start.sh"]