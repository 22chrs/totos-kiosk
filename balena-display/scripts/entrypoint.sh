#!/usr/bin/env bash

## Hosts
echo "127.0.0.1 $HOSTNAME" >> /etc/hosts

## XServer Configuration
if [ "${BALENA_DEVICE_TYPE}" = "raspberrypi5" ]
then
    echo "Raspberry Pi 5 detected, injecting X.org config"
    cp -a "/app/RPI5/99-vc4.conf" "/etc/X11/xorg.conf.d/"
fi


sed -i -e 's/console/anybody/g' /etc/X11/Xwrapper.config
dpkg-reconfigure xserver-xorg-legacy


## Disable CPU Throttling
echo 'performance' > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor




## Show Cursor
if [[ -n $SHOW_CURSOR ]] && [[ $SHOW_CURSOR -eq 1 ]]; then
  export CURSOR=''
  echo "Enabling cursor"
else
  export CURSOR='-- -nocursor'
  echo "Disabling cursor"
fi

## Pass Environment Variables to New Session
environment=$(env | grep -v -w '_' | awk -F= '{ st = index($0,"=");print substr($1,0,st) ","}' | tr -d "\n")
environment="${environment::-1}"

## Change User to "chromium" and startx with start_server.sh
su -w $environment -c "export DISPLAY=:0 && startx /app/scripts/start_server.sh $CURSOR" - chromium
balena-idle
