// Stepper.cpp

#include <Stepper.h>
#define StepperCount 6

void enableMotor(byte stepperX, boolean isEnabled) {
    if (isEnabled == false) {
        mcp.digitalWrite(stepperMotors[stepperX - 1].enPin, HIGH);  // Disable driver in hardware
    }
    if (isEnabled == true) {
        mcp.digitalWrite(stepperMotors[stepperX - 1].enPin, LOW);  // Disable driver in hardware
    }
}

void init_Stepper() {
    TS4::begin();

    for (int i = 0; i < StepperCount; i++) {
        mcp.pinMode(stepperMotors[i].enPin, OUTPUT);
        pinMode(stepperMotors[i].stepPin, OUTPUT);
        pinMode(stepperMotors[i].dirPin, OUTPUT);
        enableMotor(i, true);  // Enable Stepper in Hardware

        stepperMotors[0].driver->setup(USED_SERIAL_PORT_1, SERIAL_BAUD_RATE);
        stepperMotors[1].driver->setup(USED_SERIAL_PORT_2, SERIAL_BAUD_RATE);
        stepperMotors[2].driver->setup(USED_SERIAL_PORT_3, SERIAL_BAUD_RATE);
        stepperMotors[3].driver->setup(USED_SERIAL_PORT_4, SERIAL_BAUD_RATE);
        stepperMotors[4].driver->setup(USED_SERIAL_PORT_5, SERIAL_BAUD_RATE);
        stepperMotors[5].driver->setup(USED_SERIAL_PORT_6, SERIAL_BAUD_RATE);

        stepperMotors[i].driver->setRunCurrent(RUN_CURRENT_PERCENT);
        stepperMotors[i].driver->setHoldCurrent(0);
        // stepperMotors[i].driver->enableAutomaticCurrentScaling();
        // stepperMotors[i].driver->enableAutomaticGradientAdaptation();
        stepperMotors[i].driver->enable();
        stepperMotors[i].driver->setMicrostepsPerStep(MICROSTEPS);

        stepperMotors[i].stepper->setMaxSpeed(currentBoardConfig->stepper[i].maxSpeed);
        stepperMotors[i].stepper->setAcceleration(currentBoardConfig->stepper[i].acceleration);
    }
}

void moveMotorToAbsPosition(byte stepperX, float newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX - 1].ratio;

    if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true) {
        newPosition = -newPosition;
    }
    stepperMotors[stepperX - 1].stepper->moveAbsAsync(newPosition);
}

void moveMotorRel(byte stepperX, float newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX - 1].ratio;
    if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true) {
        newPosition = -newPosition;
    }
    if (stepperMotors[stepperX - 1].stepper->isMoving == false)  // nur wenn Motor nicht in Bewegung
    {
        stepperMotors[stepperX - 1].stepper->moveRelAsync(newPosition);
    }
}

boolean motorMovingState(byte stepperX) {
    // Ensure stepper indices are within bounds
    if (stepperX < 1 || stepperX > 6)
        return false;
    return stepperMotors[stepperX - 1].stepper->isMoving;
}

void move2MotorsToAbsPosition(byte stepperA, byte stepperB, float newPosition) {
    if (currentBoardConfig->stepper[stepperA - 1].inverseDirection == true) {
        newPosition = -newPosition;
    }
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperA - 1].ratio;
    float newPositionA = newPosition;
    float newPositionB = newPosition;

    // Set target positions for each stepper
    stepperMotors[stepperA - 1].stepper->setTargetAbs(newPositionA);
    stepperMotors[stepperB - 1].stepper->setTargetAbs(newPositionB);

    // Create a stepper group and move synchronously
    StepperGroup group = {*stepperMotors[stepperA - 1].stepper, *stepperMotors[stepperB - 1].stepper};
    group.move();
}

void stopMotor(byte stepperX) {
    stepperMotors[stepperX - 1].stepper->stop();
}

void setPositionMotor(byte stepperX, float position) {
    stepperMotors[stepperX - 1].stepper->setPosition(position);
    delay(5);
}

void setSpeedMotor(byte stepperX, long speed) {
    stepperMotors[stepperX - 1].stepper->setMaxSpeed(speed);
}

void setAccelerationMotor(byte stepperX, long acceleration) {
    stepperMotors[stepperX - 1].stepper->setAcceleration(acceleration);
}

boolean homeMotor(byte stepperX) {
    if (check_limitSwitch(stepperX) == true) {
        setPositionMotor(stepperX, 0);

        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].homeShift + currentBoardConfig->stepper[stepperX - 1].maxTravel * 0.05);  // Rückwärts fahren
        while (motorMovingState(stepperX) == true)                                                                                                           // Motor is moving
        {
            Serial.println("Move out of endstop.");
        }
    }

    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.8);             // less% of normal
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 1.5);  // 150% of normal

        setPositionMotor(stepperX, 0);

        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-1));  // Rückwärts fahren

        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            Serial.println("Homing started. Moving backwards.");
            if (check_limitSwitch(stepperX) == true) {
                Serial.println("Endstop triggered. Stop.");
                stopMotor(stepperX);
                break;
            }
        }

        Serial.println("Begin slow homing routine.");
        setPositionMotor(stepperX, 0);

        float procentTravelSlow = 0.02;
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration);
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (procentTravelSlow));  // Vorfahren

        while (motorMovingState(stepperX) == true)  // Motor is moving
        {                                           // Wait for the motor to stop moving
            Serial.println("Init homing slowly. Drive forward.");
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.05);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 3);                          // 300% of normal                                 // 10% of normal Speed
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-procentTravelSlow * 1.5));  // Rückwärts fahren
        while (motorMovingState(stepperX) == true)                                                                           // Motor is moving
        {
            if (check_limitSwitch(stepperX) == true) {
                Serial.println("Endstop triggered. Stop.");
                Serial.println("Endstop slowly cleared.");
                stopMotor(stepperX);
                break;
            }
        }

        Serial.println("Endstop successfully reached.");

        setPositionMotor(stepperX, 0);
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed);             // normal speed
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration);  // normal acceleration
        Serial.println("Move Motor to homeShift.");
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].homeShift);
        while (motorMovingState(stepperX) == true) {  // Wait for the motor to stop moving
            Serial.println("Waiting for move Motor to homeShift");
        }

        setPositionMotor(stepperX, 0);

        Serial.println("Position saved as 0.");
        Serial.println("Homing Successful.");
        return true;
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed.");  // Optional: add this line if you want to log the failure before returning
    return false;
}

void testSerialCommunication() {
    for (int i = 0; i < StepperCount; i++) {
        if (stepperMotors[i].driver->isSetupAndCommunicating()) {
            Serial.println("Stepper 1 driver is setup and communicating!");
            Serial.println("Try turning driver power off to see what happens.");
        } else if (stepperMotors[i].driver->isCommunicatingButNotSetup()) {
            Serial.println("Stepper 1 driver is communicating but not setup!");
        } else {
            Serial.println("Stepper 1 driver is not communicating!");
            Serial.println("Try turning driver power on to see what happens.");
        }

        Serial.println();
        delay(100);
    }
}

float currentMotorPosition(byte stepperX) {
    float currentPosition = 0;
    currentPosition = stepperMotors[stepperX - 1].stepper->getPosition();
    Serial.println(currentPosition);
    return currentPosition;
}
