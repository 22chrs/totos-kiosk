// Stepper.cpp

#include <Stepper.h>

void enableMotor(byte stepperX, boolean isEnabled) {
    if (isEnabled == false) {
        mcp.digitalWrite(stepperMotors[stepperX - 1].enPin, HIGH);  // Disable driver in hardware
        delay(10);
    }
    if (isEnabled == true) {
        mcp.digitalWrite(stepperMotors[stepperX - 1].enPin, LOW);  // Disable driver in hardware
        delay(30);
    }
}

void changeCurrentStateMotor(byte stepperX, int current) {
    stepperMotors[stepperX - 1].driver->rms_current(current);
    delay(5);
    deactivateDriverViaUART(stepperX);
    delay(5);
}

void changeCurrentStateCombinedMotors(byte stepperX, byte stepperY, int current) {
    stepperMotors[stepperX - 1].driver->rms_current(current);
    stepperMotors[stepperY - 1].driver->rms_current(current);
    delay(5);
}

void init_Stepper() {
    TS4::begin();

    for (int i = 0; i < StepperCount; i++) {
        mcp.pinMode(stepperMotors[i].enPin, OUTPUT);
        pinMode(stepperMotors[i].stepPin, OUTPUT);
        pinMode(stepperMotors[i].dirPin, OUTPUT);
        delay(5);
        enableMotor(i + 1, true);  // Enable Stepper in Hardware
        stepperMotors[i].serialPort->begin(SERIAL_BAUD_RATE);
        delay(50);
        stepperMotors[i].driver->begin();
        delay(10);
        stepperMotors[i].driver->toff(5);
        stepperMotors[i].driver->rms_current(currentBoardConfig->stepper[i].driveCurrent);

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
        deactivateDriverViaUART(i + 1);  // Treiber alle deaktiveren via UART
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
        Serial.println(stallValue);
    }
    Serial.println("");
}

// Helper functions to activate/deactivate a specific driver
void activateDriverViaUART(byte stepperX) {
    // Access the driver for the specific stepper
    TMC2209Stepper &driver = *stepperMotors[stepperX - 1].driver;

    // Enable the driver by clearing the ENABLEDRV bit in the GCONF register
    uint32_t gconf = driver.GCONF();
    gconf &= ~(1 << 4);  // Clear bit 4 to enable driver
    driver.GCONF(gconf);

    // Set the drive current to the desired level
    uint8_t driveCurrent = currentBoardConfig->stepper[stepperX - 1].driveCurrent;
    driver.rms_current(driveCurrent);

    // Set IHOLD to a reasonable standby current if needed
    uint32_t iholdIrun = driver.IHOLD_IRUN();
    iholdIrun &= ~(0b11111);                // Clear IHOLD bits
    iholdIrun |= (driveCurrent & 0b11111);  // Set IRUN to driveCurrent bits
    driver.IHOLD_IRUN(iholdIrun);

    Serial.print("Driver activated with drive current.");
    Serial.println(driveCurrent);
}

void deactivateDriverViaUART(byte stepperX) {
    // Access the driver for the specific stepper
    TMC2209Stepper &driver = *stepperMotors[stepperX - 1].driver;

    // Disable the driver by setting the ENABLEDRV bit in the GCONF register
    uint32_t gconf = driver.GCONF();
    gconf |= (1 << 4);  // Set bit 4 to disable driver
    driver.GCONF(gconf);

    // Set the IHOLD current to zero
    uint32_t iholdIrun = driver.IHOLD_IRUN();
    iholdIrun &= ~(0b11111);  // Clear bits 0-4 to set IHOLD to 0
    driver.IHOLD_IRUN(iholdIrun);

    Serial.println("Driver deactivated via UART.");
}

void moveMotorToAbsPosition(byte stepperX, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX - 1].ratio;
    if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true) {
        newPosition = -newPosition;
    }
    stepperMotors[stepperX - 1].stepper->moveAbsAsync(newPosition);

    // deactivateDriverViaUART(stepperX);
}

boolean moveCombinedMotorsToAbsPosition(byte stepperX, byte stepperY, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX - 1].ratio;
    double newPosition_A = newPosition;
    double newPosition_B = newPosition;
    if (currentBoardConfig->stepper[stepperX - 1].inverseDirection == true) {
        newPosition_A = -newPosition;
    }
    if (currentBoardConfig->stepper[stepperY - 1].inverseDirection == true) {
        newPosition_B = -newPosition;
    }
    stepperMotors[stepperX - 1].stepper->moveAbsAsync(newPosition_A);
    stepperMotors[stepperY - 1].stepper->moveAbsAsync(newPosition_B);

    // Set target positions for each stepper
    // stepperMotors[stepperX - 1].stepper->setTargetAbs(newPosition_A);
    // stepperMotors[stepperY - 1].stepper->setTargetAbs(newPosition_B);
    // Create a stepper group and move synchronously
    // controller = {*stepperMotors[stepperX - 1].stepper, *stepperMotors[stepperY - 1].stepper};
    // StepperGroup{*stepperMotors[stepperX - 1].stepper, *stepperMotors[stepperY - 1].stepper}.move();
    Serial.println("finished.");
    return true;  // Indicate success
}

boolean motorMovingState(byte stepperX) {
    // Ensure stepper indices are within bounds
    if (stepperX < 1 || stepperX > 6)
        return false;
    return stepperMotors[stepperX - 1].stepper->isMoving;
}

void stopMotor(byte stepperX) {
    stepperMotors[stepperX - 1].stepper->stop();
}

void setPositionMotor(byte stepperX, double position) {
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
        Serial.println("Move out of endstop.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
        }
    }

    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.1);             // less% of normal
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 1.2);  // 150% of normal

        setPositionMotor(stepperX, 0);

        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-1));  // Rückwärts fahren

        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            Serial.println("Homing started. Moving backwards.");
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                Serial.println("Endstop triggered. Stop.");
                stopMotor(stepperX);
                break;
            }
        }
        delay(3999);

        Serial.println("Begin slow homing routine.");
        setPositionMotor(stepperX, 0);

        double procentTravelSlow = 0.02;
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration);
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (procentTravelSlow));  // Vorfahren
        Serial.println("Init homing slowly. Drive forward.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);  // Wait for the motor to stop moving
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.05);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 1.5);                        // 300% of normal                                 // 10% of normal Speed
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-procentTravelSlow * 1.5));  // Rückwärts fahren
        while (motorMovingState(stepperX) == true)                                                                           // Motor is moving
        {
            delay(1);
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
        Serial.println("Waiting for move Motor to homeShift");
        while (motorMovingState(stepperX) == true) {  // Wait for the motor to stop moving
            delay(1);
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

boolean homeCombinedMotors(byte stepperX, byte stepperY) {
    if ((check_limitSwitch(stepperX) == true) or (check_limitSwitch(stepperY) == true)) {
        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX - 1].homeShift + currentBoardConfig->stepper[stepperX - 1].maxTravel * 0.05);  // Rückwärts fahren
        Serial.println("Move out of endstop.");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);
        }
    }

    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.5);             // less% of normal
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperY - 1].maxSpeed * 0.5);             // less% of normal
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 1.5);  // 150% of normal
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperY - 1].acceleration * 1.5);  // 150% of normal
        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        //! moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-1));  // Rückwärts fahren
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-1));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY - 1].maxTravel * (-1));

        Serial.println("Homing started. Moving backwards.");

        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                stopMotor(stepperX);
                Serial.println("Endstop X triggered. Stop.");
            }

            if (check_limitSwitch(stepperY) == true) {
                stopMotor(stepperY);
                Serial.println("Endstop Y triggered. Stop.");
            }
        }

        Serial.println("Begin slow homing routine.");
        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        double procentTravelSlow = 0.02;
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration);
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX - 1].acceleration);
        //! moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX - 1].maxTravel * (procentTravelSlow));  // Vorfahren
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (procentTravelSlow));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperX - 1].maxTravel * (procentTravelSlow));
        Serial.println("Init homing slowly. Drive forward.");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);  // Wait for the motor to stop moving
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.05);
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperX - 1].maxSpeed * 0.05);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration * 3);  // 300% of normal                                 // 10% of normal Speed
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX - 1].acceleration * 3);  // 300% of normal                                 // 10% of normal Speed
                                                                                                     //! moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-procentTravelSlow * 1.5));  // Rückwärts fahren
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].maxTravel * (-procentTravelSlow * 1.5));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY - 1].maxTravel * (-procentTravelSlow * 1.5));
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                Serial.println("Endstop X triggered. Stop.");
                stopMotor(stepperX);
            }
            if (check_limitSwitch(stepperY) == true) {
                Serial.println("Endstop Y triggered. Stop.");
                stopMotor(stepperY);
            }
        }

        Serial.println("Both endstops successfully reached.");

        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].maxSpeed);             // normal speed
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperX - 1].maxSpeed);             // normal speed
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX - 1].acceleration);  // normal acceleration
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX - 1].acceleration);  // normal acceleration
        Serial.println("Move Motors to homeShift.");
        //! moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX - 1].homeShift);
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX - 1].homeShift);
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY - 1].homeShift);
        Serial.println("Waiting for move Motor to homeShift");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true)) {
            delay(1);  // Wait for the motor to stop moving
        }

        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        Serial.println("Position saved as 0.");
        Serial.println("Homing Successful.");
        return true;
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed.");  // Optional: add this line if you want to log the failure before returning
    return false;
}

void testSerialCommunication() {
    int i = 1;
    uint16_t msread = stepperMotors[i].driver->microsteps();
    Serial.print(F("Read microsteps via UART to test UART receive : "));
    Serial.println(msread);

    msread = stepperMotors[i].driver->rms_current();
    Serial.print(F("Current : "));
    Serial.println(msread);
}

double currentMotorPosition(byte stepperX) {
    double currentPosition = 0;
    currentPosition = stepperMotors[stepperX - 1].stepper->getPosition();
    Serial.println(currentPosition);
    return currentPosition;
}
