// Movements.h

#ifndef MOVEMENTS_H
#define MOVEMENTS_H

#include <BoardSelect.h>
#include <LimitSwitch.h>
#include <SerialController.h>
#include <Stepper.h>
#include <_global.h>

boolean homeDevice(const String &stepperName, String timestamp);
boolean moveDevice(const String &stepperName, double position, int maxSpeedPercentage, int driveCurrentPercentage, double desiredRingPercentage, String timestamp);

#endif