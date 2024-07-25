// Fan.h

#ifndef FAN_H
#define FAN_H

#include <_global.h>

#define PWM_FAN_1_PIN 2
#define PWM_FAN_2_PIN 3
#define PWM_FAN_3_PIN 4

#define RPM_FAN_1_PIN 23
#define RPM_FAN_2_PIN 26
#define RPM_FAN_3_PIN 15

void init_Fan();
void pwmFan(byte FanX, int percent);
int getRpmFan(byte FanX);

#endif
