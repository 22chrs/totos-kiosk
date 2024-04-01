// Temperature.h

#ifndef TEMPERATURE_H
#define TEMPERATURE_H

#include <_global.h>
#include "SHT31.h"

inline SHT31 sht;

float GetTemperature();
float GetHumidity();

void init_TemperatureSensor();
float getTemperature();
float getHumidity();

void check_TemperatureSensor();

#endif
