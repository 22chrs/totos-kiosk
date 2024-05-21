// Stepper.h

#ifndef STEPPER_H
#define STEPPER_H

#include <_global.h>
#include <MCP23017.h>
#include <BoardSelect.h>
#include <TMCStepper.h>
#include <TeensyStep4.h> // https://github.com/luni64/TeensyStep4
#include <LimitSwitch.h>

using namespace TS4;

#define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f       // value for EZ2209 driver

const int MICROSTEPS = 16;
const int RESOLUTION = 200; // Steps/turn

// !Stepper 1
// EN1_PIN @MCP23017    // Enable
// DIR1_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_1 Serial1 // HardwareSerial port
#define DIR1_PIN_DUMMY 48          // For using in TeensyStep4 since mcp is not known here
#define STP1_PIN 30                // Step

// !Stepper 2
// EN2_PIN @MCP23017    // Enable
// DIR2_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_2 Serial2 // HardwareSerial port
#define DIR2_PIN_DUMMY 49          // For using in TeensyStep4 since mcp is not known here
#define STP2_PIN 31                // Step

// !Stepper 3
// EN3_PIN @MCP23017    // Enable
// DIR3_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_3 Serial6 // HardwareSerial port
#define DIR3_PIN_DUMMY 50          // For using in TeensyStep4 since mcp is not known here
#define STP3_PIN 32                // Step

// !Stepper 4
// EN4_PIN @MCP23017    // Enable
// DIR4_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_4 Serial7 // HardwareSerial port
#define DIR4_PIN_DUMMY 51          // For using in TeensyStep4 since mcp is not known here
#define STP4_PIN 38                // Step

// !Stepper 5
// EN5_PIN @MCP23017    // Enable
// DIR5_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_5 Serial8 // HardwareSerial port
#define DIR5_PIN_DUMMY 52          // For using in TeensyStep4 since mcp is not known here
#define STP5_PIN 39                // Step

// !Stepper 6
// EN6_PIN @MCP23017    // Enable
// DIR6_PIN @MCP23017    // Direction
#define USED_SERIAL_PORT_6 Serial5 // HardwareSerial port
#define DIR6_PIN_DUMMY 53          // For using in TeensyStep4 since mcp is not known here
#define STP6_PIN 40                // Step
// inline Stepper stepper_6(STP6_PIN, DIR6_PIN_DUMMY); // (STEP-pin, DIR-pin)

// Stepper motor pin definitions and driver instances
struct StepperMotor
{
    HardwareSerial *serialPort;
    uint8_t enPin, dirPin, stepPin, dirPinDummy;
    TMC2209Stepper *driver;
    Stepper *stepper;
    float position; // mm
};

inline StepperMotor stepperMotors[6] = {
    {&USED_SERIAL_PORT_1, EN1_PIN, DIR1_PIN, STP1_PIN, DIR1_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_1, R_SENSE, DRIVER_ADDRESS), new Stepper(STP1_PIN, DIR1_PIN_DUMMY)},
    {&USED_SERIAL_PORT_2, EN2_PIN, DIR2_PIN, STP2_PIN, DIR2_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_2, R_SENSE, DRIVER_ADDRESS), new Stepper(STP2_PIN, DIR2_PIN_DUMMY)},
    {&USED_SERIAL_PORT_3, EN3_PIN, DIR3_PIN, STP3_PIN, DIR3_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_3, R_SENSE, DRIVER_ADDRESS), new Stepper(STP3_PIN, DIR3_PIN_DUMMY)},
    {&USED_SERIAL_PORT_4, EN4_PIN, DIR4_PIN, STP4_PIN, DIR4_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_4, R_SENSE, DRIVER_ADDRESS), new Stepper(STP4_PIN, DIR4_PIN_DUMMY)},
    {&USED_SERIAL_PORT_5, EN5_PIN, DIR5_PIN, STP5_PIN, DIR5_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_5, R_SENSE, DRIVER_ADDRESS), new Stepper(STP5_PIN, DIR5_PIN_DUMMY)},
    {&USED_SERIAL_PORT_6, EN6_PIN, DIR6_PIN, STP6_PIN, DIR6_PIN_DUMMY, new TMC2209Stepper(&USED_SERIAL_PORT_6, R_SENSE, DRIVER_ADDRESS), new Stepper(STP6_PIN, DIR6_PIN_DUMMY)}};

// Functions
void init_Stepper();

void enableMotor(byte stepperX, boolean isEnabled);
void moveMotorToAbsPosition(byte stepperX, float newPosition);
void moveMotorRel(byte stepperX, float newPosition);
bool motorMovingState(byte stepperX);
void move2MotorsToAbsPosition(byte stepperA, byte stepperB, float newPosition);
void stopMotor(byte stepperX);
boolean homeMotor(byte stepperX);

#endif