// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <ESP_FlexyStepper.h>
#include <HardwareSerial.h>
#include <LimitSwitch.h>
#include <TMCStepper.h>
#include <_global.h>

inline ESP_FlexyStepper stepper;

// const float maxTravel = 10000;  // mm //! geraten
// const long maxSpeed = 6000;     // stp/s
// const long acceleration = 1500; // stp/s^2
// const float homeShift = 3;

// const float gearRatio = (20.0 / 32.0) / (2.0 * RESOLUTION);

// Functions
void init_Stepper();

void loopStepper();
void moveMotorAbs(float absolutePositionToMoveToInMillimeters);
boolean homeMotor();
void loop_endstopDetected();
void targetPositionReachedCallback(long position);

#endif