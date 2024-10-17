// Fan.h

#ifndef FAN_H
#define FAN_H

#include <_global.h>

#define PWM_FAN_1_PIN D2

void init_Fan();
void pwmFan(int percent);

#endif
