#ifndef BOARDSELECT_H
#define BOARDSELECT_H

#include <MCP23017.h>
#include <Stepper.h>
#include <_global.h>

// Define board types
extern byte board;  // Declare it as an external variable to be defined in BoardSelect.cpp
#define SERVICE_CUBE 1
#define ROBOCUBE_FRONT 2
#define ROBOCUBE_BACK 3

struct StepperConfig {
    String name;
    const int holdCurrent;                 // mA
    const int driveCurrent;                // mA
    const unsigned long maxSpeed;          // steps/s
    const unsigned long acceleration;      // steps/s^2
    const double ratio;                    // mm/step
    const double maxTravel;                // mm
    const double homeShift;                // mm
    const boolean inverseDirection;        // true/false
    const boolean inverseEndstopPosition;  // true/false
    const double homingSpeedFactor;        // true/false
};

struct BoardConfig {
    const String boardName;
    StepperConfig stepper[6];  // Assuming 6 steppers per board
};

extern BoardConfig *currentBoardConfig;

// Function declaration
void init_BoardSelect();

#endif
