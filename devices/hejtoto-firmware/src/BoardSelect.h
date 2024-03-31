#ifndef BOARDSELECT_H
#define BOARDSELECT_H

#include <_global.h>
#include <MCP23017.h>

// Define board types
extern byte board; // Declare it as an external variable to be defined in BoardSelect.cpp
#define SERVICE_CUBE 1
#define ROBOCUBE_FRONT 2
#define ROBOCUBE_BACK 3

struct StepperConfig
{
    int current;      // mA
    int maxSpeed;     // steps/s
    int acceleration; // steps/s^2
    float ratio;      // mm/step
    float maxLength;  // mm
};

struct BoardConfig
{
    StepperConfig stepper[6]; // Assuming 6 steppers per board
};

extern const BoardConfig *currentBoardConfig;

// Function declaration
void init_BoardSelect();

#endif
