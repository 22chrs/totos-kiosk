// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <_global.h>
#include <TMCStepper.h>
#include <SPI.h>
#include <TeensyStep.h>
#include <LimitSwitch.h>

#define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f       // value for EZ2209 driver

const int MICROSTEPS = 16;
const int RESOLUTION = 200; // Steps/turn

const float maxTravel = 100;      // mm //! geraten
extern long maxSpeed;             // stp/s
const long Acceleration = 150000; // stp/s^2
const float homeShift = 3;

// !driver
#define EN_PIN D3    // Enable
#define CS_PIN D2    // SPI-CS pin
#define MOSI_PIN D10 // SPI-MOSI pin
#define MISO_PIN D9  // SPI-MISO pin
#define SCK_PIN D8   // SPI-SCK pin

extern TMC2130Stepper driver;

// !stepper
#define DIR_PIN 2 // Direction
#define STP_PIN 1 // Step

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