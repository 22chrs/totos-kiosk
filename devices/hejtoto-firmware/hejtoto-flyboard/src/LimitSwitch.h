// LimitSwitch.h

#ifndef LIMITSWITCH_H
#define LIMITSWITCH_H

#include <Led.h>
#include <Stepper.h>
#include <_global.h>

#define ES_PIN D9

void init_LimitSwitch();
boolean check_limitSwitch();

#endif
