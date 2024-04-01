// LimitSwitch.h

#ifndef LIMITSWITCH_H
#define LIMITSWITCH_H

#include <_global.h>

#define ES_1_PIN 11
#define ES_2_PIN 12
#define ES_3_PIN 5
#define ES_4_PIN 27
#define ES_5_PIN 16
#define ES_6_PIN 17

#define ES_5_PIN 16
#define ES_6_PIN 17

void init_LimitSwitch();
boolean check_limitSwitch(byte limitSwitchNumber);

void init_doorSensor();
void check_doorSensor();

#endif
