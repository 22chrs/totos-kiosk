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

        stepperMotors[i].stepper->setMaxSpeed(currentBoardConfig->stepper[i].maxSpeed);
        stepperMotors[i].stepper->setAcceleration(currentBoardConfig->stepper[i].acceleration);
        stepperMotors[i].position = -33;
    }
}

void moveMotorToAbsPosition(byte stepperX, float newPosition)
{
    if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true)
    {
        newPosition = -newPosition;
    }

    if (stepperX < 1 || stepperX > 6)
        return;

    bool direction;
    if (newPosition >= stepperMotors[stepperX - 1].position)
    {
        direction = 1;
    }
    else
    {
        direction = 0;
    }

    mcp.digitalWrite(stepperMotors[stepperX - 1].dirPin, direction ? HIGH : LOW);
    stepperMotors[stepperX - 1].stepper->moveAbsAsync(newPosition);
    stepperMotors[stepperX - 1].position = newPosition;
}

void moveMotorRel(byte stepperX, float newPosition)
{
    if (stepperMotors[stepperX - 1].stepper->isMoving == false) // nur wenn Motor nicht in Bewegung
    {
        if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true)
        {
            newPosition = -newPosition;
        }

        if (stepperX < 1 || stepperX > 6)
            return;

        bool direction;
        if (newPosition >= stepperMotors[stepperX - 1].position)
        {
            direction = 1;
        }
        else
        {
            direction = 0;
        }

        mcp.digitalWrite(stepperMotors[stepperX - 1].dirPin, direction ? HIGH : LOW);
        stepperMotors[stepperX - 1].stepper->moveRelAsync(newPosition);
        stepperMotors[stepperX - 1].position = newPosition;
    }
}

bool motorMovingState(byte stepperX)
{
    // Ensure stepper indices are within bounds
    if (stepperX < 1 || stepperX > 6)
        return false;
    return stepperMotors[stepperX - 1].stepper->isMoving;
}

void move2MotorsToAbsPosition(byte stepperA, byte stepperB, float newPosition)
{
    float newPositionA = newPosition;
    float newPositionB = newPosition;

    if (currentBoardConfig->stepper[stepperA - 1].inverseDirection == true)
    {
        newPositionA = -newPositionA;
    }
    if (currentBoardConfig->stepper[stepperB - 1].inverseDirection == true)
    {
        newPositionB = -newPositionB;
    }

    // Ensure stepper indices are within bounds
    if (stepperA < 1 || stepperA > 6 || stepperB < 1 || stepperB > 6 || stepperA == stepperB)
        return;

    bool directionStepperA;
    if (newPositionA >= stepperMotors[stepperA - 1].position)
    {
        directionStepperA = 1;
    }
    else
    {
        directionStepperA = 0;
    }
    mcp.digitalWrite(stepperMotors[stepperA - 1].dirPin, directionStepperA ? HIGH : LOW);

    bool directionStepperB;
    if (newPositionB >= stepperMotors[stepperB - 1].position)
    {
        directionStepperB = 1;
    }
    else
    {
        directionStepperB = 0;
    }
    mcp.digitalWrite(stepperMotors[stepperB - 1].dirPin, directionStepperB ? HIGH : LOW);

    // Set target positions for each stepper
    stepperMotors[stepperA - 1].stepper->setTargetAbs(newPositionA);
    stepperMotors[stepperB - 1].stepper->setTargetAbs(newPositionB);

    // Create a stepper group and move synchronously
    StepperGroup group = {*stepperMotors[stepperA - 1].stepper, *stepperMotors[stepperB - 1].stepper};
    group.move();

    stepperMotors[stepperA - 1].position = newPosition;
    stepperMotors[stepperB - 1].position = newPosition;
}

void stopMotor(byte stepperX)
{
    stepperMotors[stepperX - 1].stepper->stop();
}

void setPositionMotor(byte stepperX, float position)
{
    stepperMotors[stepperX - 1].stepper->setPosition(position);
}

void setSpeedMotor(byte stepperX, long speed)
{
    stepperMotors[stepperX - 1].stepper->setMaxSpeed(speed);
}

boolean homeMotor(byte stepperX)
{
    if (check_limitSwitch(stepperX) == 1)
    {
        for (int attempt = 0; attempt < 3 && check_limitSwitch(stepperX) == 1; attempt++)
        {
            Serial.println("Endstop is triggered. Move Motor a bit out.");
            moveMotorRel(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-0.03)); // Move 3% back

            while (motorMovingState(stepperX) == 1)
            { // Wait for the motor to stop moving
                delay(1);
            }
        }
        if (check_limitSwitch(stepperX) == 1)
        {
            Serial.println("Homing Error. Endstop initally and still triggered after 3 attempts.");
            return false;
        }
    }

    if (check_limitSwitch(stepperX) == 0) // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setPositionMotor(stepperX, 0);
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-1)); // Rückwärts fahren

        while (motorMovingState(stepperX) == 1) // Motor is moving
        {
            if (check_limitSwitch(stepperX) == 1)
            {
                Serial.println("Endstop triggered. Stop.");
                stopMotor(stepperX);
                break;
            }
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.1); // 3% of normal Speed
        for (int attempt = 0; attempt < 3 && check_limitSwitch(stepperX) == 1; attempt++)
        {
            Serial.println("Endstop is triggered. Move Motor a bit out.");
            moveMotorRel(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-0.03)); // Move 3% back

            while (motorMovingState(stepperX) == 1)
            { // Wait for the motor to stop moving
                delay(1);
            }
        }
        if (check_limitSwitch(stepperX) == 1)
        {
            Serial.println("Homing Error. Endstop still triggered after 3 attempts, check for persistent issues.");
            return false;
        }
        else
        {
            Serial.println("Endstop cleared.");
        }
        Serial.println("Homing slow...");
        moveMotorToAbsPosition(stepperX, 0);
        while (motorMovingState(stepperX) == 1)
        {
            if (check_limitSwitch(stepperX) == 1)
            {
                stopMotor(stepperX);
                Serial.println("Endstop successfully reached.");
                setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed); // normal Speed
                Serial.println("Move Motor to homeShift.");
                moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].homeShift);
                setPositionMotor(stepperX, 0);
                Serial.println("Position saved as 0.");
                Serial.println("Homing Successful.");
                return true;
            }
            else
            {
                Serial.println("X: Homing failed.");
                return false;
            }
        }
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed."); // Optional: add this line if you want to log the failure before returning
    return false;
}