// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <_global.h>
#include <MCP23017.h>
#include <BoardSelect.h>
#include <TMCStepper.h>
#include <TeensyStep4.h>
using namespace TS4;

#define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f       // value for EZ2209 driver

const int MICROSTEPS = 16;
const int RESOLUTION = 200; // Steps/turn

// !Stepper 1
#define SERIAL_PORT_1 Serial1 // HardwareSerial port
inline TMC2208Stepper TMC_driver_1(&SERIAL_PORT_1, R_SENSE);

// EN1_PIN @MCP23017    // Enable
// DIR1_PIN @MCP23017    // Direction
#define DIR1_PIN_DUMMY 48                           // For using in TeensyStep4 since mcp is not known here
#define STP1_PIN 30                                 // Step
inline Stepper stepper_1(STP1_PIN, DIR1_PIN_DUMMY); // (STEP-pin, DIR-pin)

// !Stepper 2
#define SERIAL_PORT_2 Serial2 // HardwareSerial port
inline TMC2208Stepper TMC_driver_2(&SERIAL_PORT_2, R_SENSE);

// EN2_PIN @MCP23017    // Enable
// DIR2_PIN @MCP23017    // Direction
#define DIR2_PIN_DUMMY 49                           // For using in TeensyStep4 since mcp is not known here
#define STP2_PIN 31                                 // Step
inline Stepper stepper_2(STP2_PIN, DIR2_PIN_DUMMY); // (STEP-pin, DIR-pin)

// !Stepper 3
#define SERIAL_PORT_3 Serial6 // HardwareSerial port
inline TMC2208Stepper TMC_driver_3(&SERIAL_PORT_3, R_SENSE);

// EN3_PIN @MCP23017    // Enable
// DIR3_PIN @MCP23017    // Direction
#define DIR3_PIN_DUMMY 50                           // For using in TeensyStep4 since mcp is not known here
#define STP3_PIN 32                                 // Step
inline Stepper stepper_3(STP3_PIN, DIR3_PIN_DUMMY); // (STEP-pin, DIR-pin)

// !Stepper 4
#define SERIAL_PORT_4 Serial7 // HardwareSerial port
inline TMC2208Stepper TMC_driver_4(&SERIAL_PORT_4, R_SENSE);

// EN4_PIN @MCP23017    // Enable
// DIR4_PIN @MCP23017    // Direction
#define DIR4_PIN_DUMMY 51                           // For using in TeensyStep4 since mcp is not known here
#define STP4_PIN 38                                 // Step
inline Stepper stepper_4(STP4_PIN, DIR4_PIN_DUMMY); // (STEP-pin, DIR-pin)

// !Stepper 5
#define SERIAL_PORT_5 Serial8 // HardwareSerial port
inline TMC2208Stepper TMC_driver_5(&SERIAL_PORT_5, R_SENSE);

// EN5_PIN @MCP23017    // Enable
// DIR5_PIN @MCP23017    // Direction
#define DIR5_PIN_DUMMY 52                           // For using in TeensyStep4 since mcp is not known here
#define STP5_PIN 39                                 // Step
inline Stepper stepper_5(STP5_PIN, DIR5_PIN_DUMMY); // (STEP-pin, DIR-pin)

// !Stepper 6
#define SERIAL_PORT_6 Serial5 // HardwareSerial port
inline TMC2208Stepper TMC_driver_6(&SERIAL_PORT_6, R_SENSE);

// EN6_PIN @MCP23017    // Enable
// DIR6_PIN @MCP23017    // Direction
#define DIR6_PIN_DUMMY 53                           // For using in TeensyStep4 since mcp is not known here
#define STP6_PIN 40                                 // Step
inline Stepper stepper_6(STP6_PIN, DIR6_PIN_DUMMY); // (STEP-pin, DIR-pin)

// Functions
void init_StepperDrivers();
void init_Motors();

void moveMotor(byte stepperNumber, float length);
bool motorMovingState(byte stepperNumber);
void homeMotor(byte stepperNumber);

#endif