// Movements.h

#ifndef MOVEMENTS_H
#define MOVEMENTS_H

#include <BoardSelect.h>
#include <LimitSwitch.h>
#include <Stepper.h>
#include <_global.h>

boolean homeDevice(const String &stepperName);
boolean moveDevice(const String &stepperName, double position, int maxSpeedPercentage, int driveCurrentPercentage);
// void deviceStatus(const String &stepperName, StepperStatus &status);

#endif