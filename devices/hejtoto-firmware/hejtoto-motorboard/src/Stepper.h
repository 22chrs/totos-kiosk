// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <BoardSelect.h>
#include <LimitSwitch.h>
#include <MCP23017.h>
// #include <TMC2209.h>
#include <TMCStepper.h>
#include <TeensyStep4.h>  // https://github.com/luni64/TeensyStep4
#include <_global.h>

const int MICROSTEPS = 8;
const int RESOLUTION = 200;

// TeensyStep
using namespace TS4;

// Driver
const long SERIAL_BAUD_RATE = 500000;
// inline uint8_t RUN_CURRENT_PERCENT = 100;  // Max Current Stepper Driver
#define DRIVER_ADDRESS 0b00  // TMC2209 Driver address according to MS1 and MS2
#define R_SENSE 0.11f        // Match to your driver

// !Stepper 1
inline HardwareSerial &USED_SERIAL_PORT_1 = Serial1;
#define DIR1_PIN 11  // For using in TeensyStep4 since mcp is not known here
#define STP1_PIN 30  // Step

// !Stepper 2
inline HardwareSerial &USED_SERIAL_PORT_2 = Serial2;
#define DIR2_PIN 12  // For using in TeensyStep4 since mcp is not known here
#define STP2_PIN 31  // Step

// !Stepper 3
inline HardwareSerial &USED_SERIAL_PORT_3 = Serial6;
#define DIR3_PIN 5   // For using in TeensyStep4 since mcp is not known here
#define STP3_PIN 32  // Step

// !Stepper 4
inline HardwareSerial &USED_SERIAL_PORT_4 = Serial7;
#define DIR4_PIN 27  // For using in TeensyStep4 since mcp is not known here
#define STP4_PIN 38  // Step

// !Stepper 5
inline HardwareSerial &USED_SERIAL_PORT_5 = Serial8;
#define DIR5_PIN 16  // For using in TeensyStep4 since mcp is not known here
#define STP5_PIN 39  // Step

// !Stepper 6
inline HardwareSerial &USED_SERIAL_PORT_6 = Serial5;
#define DIR6_PIN 17  // For using in TeensyStep4 since mcp is not known here
#define STP6_PIN 40  // Step

const byte StepperCount = 6;

// Stepper motor pin definitions and driver instances
struct StepperMotor {
    HardwareSerial *serialPort;
    uint8_t enPin, dirPin, stepPin;
    TMC2209Stepper *driver;
    Stepper *stepper;
};

inline StepperMotor stepperMotors[6] = {
    {&USED_SERIAL_PORT_1, EN1_PIN, DIR1_PIN, STP1_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_1, R_SENSE, DRIVER_ADDRESS), new Stepper(STP1_PIN, DIR1_PIN)},
    {&USED_SERIAL_PORT_2, EN2_PIN, DIR2_PIN, STP2_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_2, R_SENSE, DRIVER_ADDRESS), new Stepper(STP2_PIN, DIR2_PIN)},
    {&USED_SERIAL_PORT_3, EN3_PIN, DIR3_PIN, STP3_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_3, R_SENSE, DRIVER_ADDRESS), new Stepper(STP3_PIN, DIR3_PIN)},
    {&USED_SERIAL_PORT_4, EN4_PIN, DIR4_PIN, STP4_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_4, R_SENSE, DRIVER_ADDRESS), new Stepper(STP4_PIN, DIR4_PIN)},
    {&USED_SERIAL_PORT_5, EN5_PIN, DIR5_PIN, STP5_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_5, R_SENSE, DRIVER_ADDRESS), new Stepper(STP5_PIN, DIR5_PIN)},
    {&USED_SERIAL_PORT_6, EN6_PIN, DIR6_PIN, STP6_PIN, new TMC2209Stepper(&USED_SERIAL_PORT_6, R_SENSE, DRIVER_ADDRESS), new Stepper(STP6_PIN, DIR6_PIN)}};

// Functions
void init_Stepper();
void testSerialCommunication();
void activateDriverViaUART(byte stepperX);
void deactivateDriverViaUART(byte stepperX);
void enableMotor(byte stepperX, boolean isEnabled);
void changeCurrentStateMotor(byte stepperX, int current);
void changeCurrentStateCombinedMotors(byte stepperX, byte stepperY, int current);
void moveMotorToAbsPosition(byte stepperX, double newPosition);
void moveCombinedMotorsToAbsPosition(byte stepperX, byte stepperY, double newPosition);
void stopMotor(byte stepperX);
double currentMotorPosition(byte stepperX);
boolean motorMovingState(byte stepperX);
boolean homeMotor(byte stepperX);
boolean homeCombinedMotors(byte stepperX, byte stepperY);

#endif