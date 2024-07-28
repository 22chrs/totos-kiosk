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
    float current;             // mA
    float maxSpeed;            // steps/s
    float acceleration;        // steps/s^2
    float ratio;               // mm/step
    float maxTravel;           // mm
    float homeShift;           // mm
    boolean inverseDirection;  // mm
};

// struct BoardInfo
// {
//     String boardName; // RoboCube, ServiceCubeFront, ServiceCubeBack
// };

struct BoardConfig {
    String boardName;
    StepperConfig stepper[6];  // Assuming 6 steppers per board
};

extern const BoardConfig *currentBoardConfig;

// Function declaration
void init_BoardSelect();

#endif
