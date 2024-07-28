// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <BoardSelect.h>
#include <LimitSwitch.h>
#include <MCP23017.h>
#include <TMC2209.h>
#include <TeensyStep4.h>  // https://github.com/luni64/TeensyStep4
#include <_global.h>

using namespace TS4;

const int MICROSTEPS = 256;
const int RESOLUTION = 200;  // Steps/tur
const uint8_t RUN_CURRENT_PERCENT = 100;

const long SERIAL_BAUD_RATE = 500000;

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

// Stepper motor pin definitions and driver instances
struct StepperMotor {
    // HardwareSerial *serialPort;
    uint8_t enPin, dirPin, stepPin;
    TMC2209 *driver;
    Stepper *stepper;
};

inline StepperMotor stepperMotors[6] = {
    {EN1_PIN, DIR1_PIN, STP1_PIN, new TMC2209, new Stepper(STP1_PIN, DIR1_PIN)},
    {EN2_PIN, DIR2_PIN, STP2_PIN, new TMC2209, new Stepper(STP2_PIN, DIR2_PIN)},
    {EN3_PIN, DIR3_PIN, STP3_PIN, new TMC2209, new Stepper(STP3_PIN, DIR3_PIN)},
    {EN4_PIN, DIR4_PIN, STP4_PIN, new TMC2209, new Stepper(STP4_PIN, DIR4_PIN)},
    {EN5_PIN, DIR5_PIN, STP5_PIN, new TMC2209, new Stepper(STP5_PIN, DIR5_PIN)},
    {EN6_PIN, DIR6_PIN, STP6_PIN, new TMC2209, new Stepper(STP6_PIN, DIR6_PIN)}};

// Functions

void init_Stepper();
void testSerialCommunication();
void enableMotor(byte stepperX, boolean isEnabled);
void moveMotorToAbsPosition(byte stepperX, float newPosition);
void moveMotorRel(byte stepperX, float newPosition);
bool motorMovingState(byte stepperX);
void move2MotorsToAbsPosition(byte stepperA, byte stepperB, float newPosition);
void stopMotor(byte stepperX);
boolean homeMotor(byte stepperX);

#endif