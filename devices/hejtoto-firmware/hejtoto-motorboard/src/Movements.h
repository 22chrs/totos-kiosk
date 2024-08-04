// Movements.h

#ifndef MOVEMENTS_H
#define MOVEMENTS_H

#include <BoardSelect.h>
#include <LimitSwitch.h>
#include <Stepper.h>
#include <_global.h>

void setDriverState(const String &stepperName, bool activate);
boolean homeDevice(const String &stepperName);
boolean moveDevice(const String &stepperName, double postion);

#endif