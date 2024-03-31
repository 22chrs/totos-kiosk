// Stepper.cpp

#include <Stepper.h>

void init_Stepper()
{
    TS4::begin();
    for (int i = 0; i < 6; i++)
    {
        mcp.pinMode(stepperMotors[i].enPin, OUTPUT);
        mcp.pinMode(stepperMotors[i].dirPin, OUTPUT);
        mcp.pinMode(stepperMotors[i].dirPinDummy, OUTPUT); // If needed
        pinMode(stepperMotors[i].stepPin, OUTPUT);
        mcp.digitalWrite(stepperMotors[i].enPin, LOW); // Enable driver in hardware

        stepperMotors[i].serialPort->begin(115200);
        stepperMotors[i].driver->toff(5);
        stepperMotors[i].driver->rms_current(currentBoardConfig->stepper[i].current); // Assuming currentConfig is available
        stepperMotors[i].driver->microsteps(MICROSTEPS);
        stepperMotors[i].driver->pwm_autoscale(true);

        stepperMotors[i].stepper->setMaxSpeed(currentBoardConfig->stepper[i].maxSpeed).setAcceleration(currentBoardConfig->stepper[i].acceleration);
    }
}

void moveMotorToPosition(byte stepperX, float length)
{
    if (length == 0 || stepperX < 1 || stepperX > 6)
        return;

    StepperMotor &motor = stepperMotors[stepperX - 1];
    bool direction = (length > 0);
    mcp.digitalWrite(motor.dirPin, direction ? HIGH : LOW);
    motor.stepper->moveAbsAsync(length);
}

bool motorMovingState(byte stepperX)
{
    // Ensure stepper indices are within bounds
    if (stepperX < 1 || stepperX > 6)
        return false;

    // Ensure stepper indices are within bounds
    StepperMotor &motorX = stepperMotors[stepperX - 1];
    return motorX.stepper->isMoving;
}

void move2MotorsToPosition(byte stepperA, byte stepperB, float length)
{
    // Ensure stepper indices are within bounds
    if (stepperA < 1 || stepperA > 6 || stepperB < 1 || stepperB > 6 || stepperA == stepperB)
        return;

    StepperMotor &motorA = stepperMotors[stepperA - 1];
    StepperMotor &motorB = stepperMotors[stepperB - 1];

    // Set target positions for each stepper
    motorA.stepper->setTargetAbs(length);
    motorB.stepper->setTargetAbs(length);

    // Create a stepper group and move synchronously
    StepperGroup group = {*motorA.stepper, *motorB.stepper};
    group.move();
}

void homeMotor(byte stepperNumber)
{
    // stepper_1.setPosition(0);
}