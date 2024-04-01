// Mosfet.h

#ifndef MOSFET_H
#define MOSFET_H

#include <_global.h>

#define PWM_24V_1_PIN 33
#define PWM_24V_2_PIN 36
#define PWM_24V_3_PIN 22
#define PWM_24V_4_PIN 9
#define PWM_24V_5_PIN 6
#define PWM_12V_PIN 37

void init_Mosfet();
void pwmMosfet(int MosfetX, int percent);

#endif
