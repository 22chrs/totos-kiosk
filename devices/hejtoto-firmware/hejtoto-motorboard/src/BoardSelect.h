#ifndef BOARDSELECT_H
#define BOARDSELECT_H

#include <MCP23017.h>
#include <_global.h>

// Define board types
extern byte board;  // Declare it as an external variable to be defined in BoardSelect.cpp
#define SERVICE_CUBE 1
#define ROBOCUBE_FRONT 2
#define ROBOCUBE_BACK 3

struct StepperConfig {
    String name;
    int holdCurrent;             // mA
    int driveCurrent;            // mA
    unsigned long maxSpeed;      // steps/s
    unsigned long acceleration;  // steps/s^2
    double ratio;                // mm/step
    double maxTravel;            // mm
    double homeShift;            // mm
    boolean inverseDirection;    // mm
    boolean isCombined;          // Indicates if the motor is part of a combined system
    int combinedGroupId;         // Group ID for combined motors
};

struct BoardConfig {
    String boardName;
    StepperConfig stepper[6];  // Assuming 6 steppers per board
};

extern const BoardConfig *currentBoardConfig;

// Function declaration
void init_BoardSelect();

#endif
