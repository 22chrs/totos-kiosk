// Stepper.cpp

#include <SerialController.h>
#include <Stepper.h>

void enableMotor(byte stepperX, boolean isEnabled) {
    if (isEnabled == false) {
        mcp.digitalWrite(stepperMotors[stepperX].enPin, HIGH);  // Disable driver in hardware
        delay(10);
    }
    if (isEnabled == true) {
        mcp.digitalWrite(stepperMotors[stepperX].enPin, LOW);  // Disable driver in hardware
        delay(30);
    }
}

void changeCurrentStateMotor(byte stepperX, int current) {
    stepperMotors[stepperX].driver->rms_current(current);
    delay(5);
    deactivateDriverViaUART(stepperX);
    delay(5);
}

void changeCurrentStateCombinedMotors(byte stepperX, byte stepperY, int current) {
    stepperMotors[stepperX].driver->rms_current(current);
    stepperMotors[stepperY].driver->rms_current(current);
    delay(5);
}

void moveMotorToAbsPosition(byte stepperX, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;
    stepperMotors[stepperX].state.startPosition = stepperMotors[stepperX].stepper->getPosition();
    stepperMotors[stepperX].state.destinationPosition = newPosition;
    stepperMotors[stepperX].state.isActivated = true;
    stepperMotors[stepperX].stepper->moveAbsAsync(newPosition);
}

void init_Stepper() {
    TS4::begin();

    for (int i = 0; i < StepperCount; i++) {
        mcp.pinMode(stepperMotors[i].enPin, OUTPUT);
        pinMode(stepperMotors[i].stepPin, OUTPUT);
        pinMode(stepperMotors[i].dirPin, OUTPUT);
        delay(5);
        enableMotor(i, true);  // Enable Stepper in Hardware
        stepperMotors[i].serialPort->begin(SERIAL_BAUD_RATE);
        delay(50);
        stepperMotors[i].driver->begin();
        delay(10);
        stepperMotors[i].driver->toff(5);
        stepperMotors[i].driver->rms_current(currentBoardConfig->stepper[i].driveCurrent);
        stepperMotors[i].driver->shaft(currentBoardConfig->stepper[i].inverseDirection);  // Set direction inversion based on configuration

        stepperMotors[i].state.isActivated = false;  // Initialize

        if (currentBoardConfig->stepper[i].name == "Leer") {
            stepperMotors[i].state.isHomed = true;
        } else {
            stepperMotors[i].state.isHomed = false;
        }

        stepperMotors[i].state.startPosition = 0.0;            // Initialize
        stepperMotors[i].state.destinationPosition = 0.0;      // Initialize
        stepperMotors[i].state.desiredRingPercentage = 100.0;  // Initialize
        stepperMotors[i].state.messageID = 'null';             // Initialize

        //! new
        // stepperMotors[i].driver->pdn_disable(true);      // Use UART
        // stepperMotors[i].driver->I_scale_analog(false);  // Set current scaling
        // stepperMotors[i].driver->en_spreadCycle(false);  // StealthChop mode
        // stepperMotors[i].driver->pwm_autoscale(true);    // Enable autoscaling for smooth operation
        // stepperMotors[i].driver->TCOOLTHRS(0xFFFFF);     // Set cooling threshold
        // stepperMotors[i].driver->SGTHRS(10);             // Set StallGuard threshold
        //! new

        // stepperMotors[i].driver->pwm_autoscale(true);
        delay(5);
        stepperMotors[i].driver->microsteps(MICROSTEPS);
        stepperMotors[i].stepper->setMaxSpeed(currentBoardConfig->stepper[i].maxSpeed);
        stepperMotors[i].stepper->setAcceleration(currentBoardConfig->stepper[i].acceleration);
        stepperMotors[i].stepper->setPosition(0);
        deactivateDriverViaUART(i);  // Treiber alle deaktiveren via UART
        delay(5);
    }
}

void stepperCheckObstruction() {
    // Check for stall detection
    int stallValue = 0;
    for (int i = 0; i < StepperCount; i++) {
        // Print stall value for debugging
        stallValue = stepperMotors[i].driver->SG_RESULT();
        // Check for a stall condition
        // Serial.println(stallValue);
    }
}

// Helper functions to activate/deactivate a specific driver
void activateDriverViaUART(byte stepperX) {
    // Access the driver for the specific stepper
    TMC2209Stepper &driver = *stepperMotors[stepperX].driver;

    // Enable the driver by clearing the ENABLEDRV bit in the GCONF register
    uint32_t gconf = driver.GCONF();
    gconf &= ~(1 << 4);  // Clear bit 4 to enable driver
    driver.GCONF(gconf);

    // Set the drive current to the desired level
    uint8_t driveCurrent = currentBoardConfig->stepper[stepperX].driveCurrent;
    driver.rms_current(driveCurrent);

    // Set IHOLD to a reasonable standby current if needed
    uint32_t iholdIrun = driver.IHOLD_IRUN();
    iholdIrun &= ~(0b11111);                // Clear IHOLD bits
    iholdIrun |= (driveCurrent & 0b11111);  // Set IRUN to driveCurrent bits
    driver.IHOLD_IRUN(iholdIrun);

    // Serial.print("Driver activated with drive current.");
    // Serial.println(driveCurrent);
}

void deactivateDriverViaUART(byte stepperX) {
    // Access the driver for the specific stepper
    TMC2209Stepper &driver = *stepperMotors[stepperX].driver;

    // Disable the driver by setting the ENABLEDRV bit in the GCONF register
    // uint32_t gconf = driver.GCONF();
    // gconf |= (1 << 4);  // Set bit 4 to disable driver
    // driver.GCONF(gconf);

    // Set the IHOLD current to zero
    uint32_t iholdIrun = driver.IHOLD_IRUN();
    iholdIrun &= ~(0b11111);  // Clear bits 0-4 to set IHOLD to 0
    driver.IHOLD_IRUN(iholdIrun);

    // Serial.println("Driver deactivated via UART.");
}

void moveMotorToRelPosition(byte stepperX, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;
    stepperMotors[stepperX].stepper->moveRelAsync(newPosition);
}

boolean moveCombinedMotorsToAbsPosition(byte stepperX, byte stepperY, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;

    stepperMotors[stepperX].state.startPosition = stepperMotors[stepperX].stepper->getPosition();
    stepperMotors[stepperY].state.startPosition = stepperMotors[stepperY].stepper->getPosition();
    stepperMotors[stepperX].state.destinationPosition = newPosition;
    stepperMotors[stepperY].state.destinationPosition = newPosition;
    stepperMotors[stepperX].state.isActivated = true;
    stepperMotors[stepperY].state.isActivated = true;

    stepperMotors[stepperX].stepper->moveAbsAsync(newPosition);
    stepperMotors[stepperY].stepper->moveAbsAsync(newPosition);

    // Set target positions for each stepper
    // stepperMotors[stepperX ].stepper->setTargetAbs(newPosition_A);
    // stepperMotors[stepperY ].stepper->setTargetAbs(newPosition_B);
    // Create a stepper group and move synchronously
    // controller = {*stepperMotors[stepperX ].stepper, *stepperMotors[stepperY ].stepper};
    // StepperGroup{*stepperMotors[stepperX ].stepper, *stepperMotors[stepperY ].stepper}.move();
    // Serial.println("finished.");
    return true;  // Indicate success
}

boolean motorMovingState(byte stepperX) {
    return stepperMotors[stepperX].stepper->isMoving;
}

void stopMotor(byte stepperX) {
    stepperMotors[stepperX].state.isActivated = true;  // that the status will be checked next time
    stepperMotors[stepperX].stepper->stop();
}

void setPositionMotor(byte stepperX, double position) {
    stepperMotors[stepperX].stepper->setPosition(position);
    delay(5);
}

void setSpeedMotor(byte stepperX, long speed) {
    stepperMotors[stepperX].stepper->setMaxSpeed(speed);
}

void setAccelerationMotor(byte stepperX, long acceleration) {
    stepperMotors[stepperX].stepper->setAcceleration(acceleration);
}

boolean homeMotor(byte stepperX) {
    setPositionMotor(stepperX, 0);

    boolean failedHoming = false;
    boolean startedWithEndstopTriggered = false;

    int inverseEndstopPosition = 1;
    if (currentBoardConfig->stepper[stepperX].homeShift == true) {
        inverseEndstopPosition = -1;
    }

    setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * currentBoardConfig->stepper[stepperX].homingSpeedFactor);
    setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 2.0);

    //! Fall 1: Endstop ist bereits getriggert
    if (check_limitSwitch(stepperX) == true) {
        // Serial.println("Fall 1: Endstop ist bereits getriggert");
        startedWithEndstopTriggered = true;

        //! aus dem Endstop raus fahren bis dieser just nicht mehr getriggert ist
        moveMotorToRelPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * 0.1 * inverseEndstopPosition);
        failedHoming = true;
        // Serial.println("Move out of endstop.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == false) {
                stopMotor(stepperX);
                failedHoming = false;
            }
        }
        // Serial.println("Endstop reverse triggered. Stop.");
        if (failedHoming == true) {
            // Serial.println("Endstop not reached. Homing failed.");
            stepperMotors[stepperX].state.isHomed = false;
            return false;
        }

        //! ein kleines Stück weiter aus dem bereits enttriggerten Endstop rausfahren
        moveMotorToRelPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * 0.01 * inverseEndstopPosition);
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
        }
    }

    //! Fall 2: Endstop nicht getriggert
    // Serial.println(check_limitSwitch(stepperX));
    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        setPositionMotor(stepperX, 0);
        // Serial.println("Fall 2: Endstop nicht getriggert.");

        //! in den Entstop reinfahren, bis dieser getriggert wird
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (-1) * inverseEndstopPosition);  // In Endstop fahren
        failedHoming = true;
        // Serial.println("Homing started. Moving inside endstop.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                stopMotor(stepperX);
                failedHoming = false;
            }
        }
        if (failedHoming == true) {
            Serial.println("Endstop not cleared. Homing failed.");
            stepperMotors[stepperX].state.isHomed = false;
            return false;
        }
        // Serial.println("Endstop triggered. Stop.");
        setPositionMotor(stepperX, 0);

        //! SLOWER nun weil Präzision:

        //! ein kleines Stück weiter aus dem bereits enttriggerten Endstop rausfahren, falls nicht startedWithEndstopTriggered
        if (startedWithEndstopTriggered == false) {
            moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * 0.0 * inverseEndstopPosition);
            // Serial.println("Was not startedWithEndstopTriggered.");
            while (motorMovingState(stepperX) == true) {
                delay(1);
            }
        }

        // Serial.println("Begin slow homing routine.");

        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * 0.05);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 2.0);  // schnellere Beschleunigung, um schnellen Stop zu haben

        //! in den Endstop rein fahren, bis dieser final getriggert wird
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * -0.02 * inverseEndstopPosition);  // Rückwärts fahren
        failedHoming = true;
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                stopMotor(stepperX);

                failedHoming = false;
            }
        }
        // Serial.println("Endstop slowly cleared.");

        if (failedHoming == true) {
            // Serial.println("Endstop not cleared. Homing failed.");
            stepperMotors[stepperX].state.isHomed = false;
            return false;
        }

        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
        //! Motor zu homeShift bewegen
        // Serial.println("Move Motor to homeShift.");
        moveMotorToAbsPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift));
        // Serial.println("Waiting for move Motor to homeShift");
        while (motorMovingState(stepperX) == true) {  // Wait for the motor to stop moving
            delay(1);
        }

        setPositionMotor(stepperX, 0);
        // Serial.println("Position saved as 0");
        // Serial.println("Homing Successful.");
        stepperMotors[stepperX].state.isHomed = true;

        stepperMotors[stepperX].state.isActivated = false;
        stepperMotors[stepperX].state.startPosition = 0;
        stepperMotors[stepperX].state.destinationPosition = 0;

        checkAndSendAllSteppersHomed();
        return true;
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed.");  // Optional: add this line if you want to log the failure before returning
    stepperMotors[stepperX].state.isHomed = false;
    return false;
}

boolean homeCombinedMotors(byte stepperX, byte stepperY) {
    boolean failedHoming = false;
    boolean startedWithEndstopTriggered = false;
    setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * currentBoardConfig->stepper[stepperX].homingSpeedFactor);  // less% of normal
    setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperY].maxSpeed * currentBoardConfig->stepper[stepperY].homingSpeedFactor);  // less% of normal
    setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 1.5);                                           // 150% of normal
    setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperY].acceleration * 1.5);                                           // 150% of normal

    if ((check_limitSwitch(stepperX) == true) or (check_limitSwitch(stepperY) == true)) {
        startedWithEndstopTriggered = true;
        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * 0.1);
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].maxTravel * 0.1);
        // moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX].homeShift + currentBoardConfig->stepper[stepperX].maxTravel * 0.1);  // Rückwärts fahren
        // Serial.println("Move out of endstop.");
        failedHoming = true;
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            if ((check_limitSwitch(stepperX) == false) and (check_limitSwitch(stepperY) == false)) {
                stopMotor(stepperX);
                stopMotor(stepperY);
                failedHoming = false;
            }
            delay(1);
        }
        if (failedHoming == true) {
            Serial.println("Homing failed");
            stepperMotors[stepperX].state.isHomed = false;
            stepperMotors[stepperY].state.isHomed = false;
            return false;
        }
    }

    setPositionMotor(stepperX, 0);
    setPositionMotor(stepperY, 0);

    moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (-1));
    moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].maxTravel * (-1));

    // Serial.println("Homing started. Moving backwards.");

    while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
    {
        if (check_limitSwitch(stepperX) == true) {
            stopMotor(stepperX);
            // Serial.println("Endstop X triggered. Stop.");
        }

        if (check_limitSwitch(stepperY) == true) {
            stopMotor(stepperY);
            // Serial.println("Endstop Y triggered. Stop.");
        }
        delay(1);
    }

    // Serial.println("Begin slow homing routine.");
    setPositionMotor(stepperX, 0);
    setPositionMotor(stepperY, 0);

    //! ein kleines Stück weiter aus dem bereits enttriggerten Endstop rausfahren, falls nicht startedWithEndstopTriggered
    if (startedWithEndstopTriggered == false) {
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * 0.1);
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].maxTravel * 0.1);
        // Serial.println("Was not startedWithEndstopTriggered.");
        failedHoming = true;
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            if ((check_limitSwitch(stepperX) == false) and (check_limitSwitch(stepperY) == false)) {
                stopMotor(stepperX);
                stopMotor(stepperY);
                failedHoming = false;
            }
            delay(1);
        }
        if (failedHoming == true) {
            Serial.println("Homing failed");
            stepperMotors[stepperX].state.isHomed = false;
            stepperMotors[stepperY].state.isHomed = false;
            return false;
        }
    }

    setPositionMotor(stepperX, 0);
    setPositionMotor(stepperY, 0);
    setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
    setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
    setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
    setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
    // Serial.println("Move Motors to homeShift.");
    moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].homeShift);
    moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].homeShift);
    // Serial.println("Waiting for move Motor to homeShift");
    while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true)) {
        delay(1);  // Wait for the motor to stop moving
    }

    setPositionMotor(stepperX, 0);
    setPositionMotor(stepperY, 0);

    // Serial.println("Position saved as 0.");
    // Serial.println("Homing Successful.");
    stepperMotors[stepperX].state.isHomed = true;
    stepperMotors[stepperY].state.isHomed = true;

    stepperMotors[stepperX].state.isActivated = false;
    stepperMotors[stepperY].state.isActivated = false;
    stepperMotors[stepperX].state.startPosition = 0;
    stepperMotors[stepperY].state.startPosition = 0;
    stepperMotors[stepperX].state.destinationPosition = 0;
    stepperMotors[stepperY].state.destinationPosition = 0;

    checkAndSendAllSteppersHomed();

    return true;

    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed.");  // Optional: add this line if you want to log the failure before returning
    stepperMotors[stepperX].state.isHomed = false;
    stepperMotors[stepperY].state.isHomed = false;
    return false;
}

void testSerialCommunication() {
    // int i = 1;
    // uint16_t msread = stepperMotors[i].driver->microsteps();
    // Serial.print(F("Read microsteps via UART to test UART receive : "));
    // Serial.println(msread);

    // msread = stepperMotors[i].driver->rms_current();
    // Serial.print(F("Current : "));
    // Serial.println(msread);
}

double stepperMovementPercentageCompleted(byte stepperX) {
    double currentPosition = stepperMotors[stepperX].stepper->getPosition();
    double destinationPosition = stepperMotors[stepperX].state.destinationPosition;

    if (stepperMotors[stepperX].state.isActivated == true) {
        double totalDistance = abs(destinationPosition - stepperMotors[stepperX].state.startPosition);

        if (totalDistance == 0) {
            // If totalDistance is zero, it means start and destination are the same.
            stepperMotors[stepperX].state.isActivated = false;
            return 100.0;
        }

        if (motorMovingState(stepperX) == true) {
            // Calculate the absolute difference between current and destination positions
            double distanceToCover = abs(destinationPosition - currentPosition);

            // Calculate the percentage completion
            double percentageCompleted = ((totalDistance - distanceToCover) / totalDistance) * 100.0;

            return percentageCompleted;
        } else {
            // If the motor has stopped, assume the destination has been reached
            stepperMotors[stepperX].state.destinationPosition = stepperMotors[stepperX].stepper->getPosition();
            stepperMotors[stepperX].state.isActivated = false;
            return 100.0;
        }
    } else {
        return 100.0;
    }
}

Chrono checkIntervalChrono;

void loop_StepperReachedDesiredRingPercentage() {
    // Check if 500 milliseconds have passed since the last check
    if (checkIntervalChrono.hasPassed(500)) {
        for (int i = 0; i < StepperCount; i++) {                                     // Loop over all stepper motors
            if (stepperMotors[i].state.isActivated) {                                // Check if the stepper is currently activated
                double percentageCompleted = stepperMovementPercentageCompleted(i);  // Calculate the percentage completed

                // Check if the stepper has reached or exceeded the desired ring percentage
                if (percentageCompleted >= stepperMotors[i].state.desiredRingPercentage) {
                    Serial.print("Stepper ");
                    Serial.print(i);
                    Serial.println(" has reached the desired ring percentage.");
                    serialController.sendMessage(stepperMotors[i].state.messageID + "Ring");

                    // Optionally, you might want to deactivate further checks for this stepper
                    // stepperMotors[i].state.isActivated = false;
                }
            }
        }
        // Restart the chrono for the next interval
        checkIntervalChrono.restart();
    }
}

void checkAndSendAllSteppersHomed() {
    bool allSteppersHomed = true;
    String homedState = "";  // String to accumulate the isHomed states

    for (int i = 0; i < StepperCount; i++) {
        if (stepperMotors[i].state.isHomed) {
            homedState += "1";  // Append '1' if the stepper is homed
        } else {
            homedState += "0";         // Append '0' if the stepper is not homed
            allSteppersHomed = false;  // Set the flag to false if any stepper is not homed
        }
    }

    // Serial print the homed state string
    Serial.print("Steppers homed state: ");
    Serial.println(homedState);

    if (allSteppersHomed) {  // Only send the message if all steppers are homed
        String timestamp = serialController.sendMessage("allhomed");
        // Optionally, you could implement logic to wait and retry for ACK if needed
        //! wait and retry for ACK
    }
}