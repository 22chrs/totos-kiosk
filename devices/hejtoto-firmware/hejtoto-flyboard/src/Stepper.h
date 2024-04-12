// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <_global.h>
#include <TMC2130Stepper.h>
// #include <TMCStepper.h>

#include <TeensyStep.h>
#include <LimitSwitch.h>

// #define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
// #define R_SENSE 0.11f       // value for EZ2209 driver

bool dir = true;

const int MICROSTEPS = 16;
const int RESOLUTION = 200; // Steps/turn

const float maxTravel = 100;      // mm //! geraten
extern long maxSpeed;             // stp/s
const long Acceleration = 150000; // stp/s^2
const float homeShift = 3;

// !driver
#define EN_PIN D3    // Enable
#define CS_PIN D2    //! Muss raus da immer an.
#define MOSI_PIN D10 // SPI-MOSI pin
#define MISO_PIN D9  // SPI-MISO pin
#define SCK_PIN D8   // SPI-SCK pin

// !stepper
#define DIR_PIN D1 // Direction
#define STP_PIN D0 // Step

extern Stepper motor;
extern StepControl controller;

// Functions
void init_Stepper();

void moveMotorToAbsPosition(float newPosition);
void moveMotorRel(float newPosition);
bool motorMovingState();
void stopMotor();
boolean homeMotor();

#endif