// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <_global.h>
#include <TMCStepper.h>
#include <HardwareSerial.h>

#include <TeensyStep.h>
#include <LimitSwitch.h>

#define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f       // value for EZ2209 driver

// !driver
#define DIR_PIN D1 // Direction
#define STP_PIN D0 // Step
#define EN_PIN D3  // Enable
#define DIAG_PIN D10;

#define SW_RX_PIN D8
#define SW_TX_PIN D9

extern Stepper motor;
extern StepControl controller;

const int MICROSTEPS = 1;

// !stepper
const int RESOLUTION = 200; // Steps/turn

const float maxTravel = 10000;   // mm //! geraten
const long maxSpeed = 8000;      // stp/s
const long acceleration = 15000; // stp/s^2
const float homeShift = 3;

// const float gearRatio = (20.0 / 32.0) / (2.0 * RESOLUTION);

// Functions
void init_Stepper();

void moveMotorToAbsPosition(float newPosition);
void moveMotorRel(float newPosition);
bool motorMovingState();
void stopMotor();

boolean homeMotor();

#endif