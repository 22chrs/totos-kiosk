// Stepper.cpp

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
        // Set direction inversion based on configuration
        stepperMotors[i].driver->shaft(currentBoardConfig->stepper[i].inverseDirection);

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
        Serial.println(stallValue);
    }
    Serial.println("");
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

    Serial.print("Driver activated with drive current.");
    Serial.println(driveCurrent);
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

void moveMotorToAbsPosition(byte stepperX, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;
    stepperMotors[stepperX].stepper->moveAbsAsync(newPosition);
}

void moveMotorToRelPosition(byte stepperX, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;
    stepperMotors[stepperX].stepper->moveRelAsync(newPosition);
}

boolean moveCombinedMotorsToAbsPosition(byte stepperX, byte stepperY, double newPosition) {
    newPosition = newPosition * MICROSTEPS * RESOLUTION / currentBoardConfig->stepper[stepperX].ratio;
    double newPosition_A = newPosition;
    double newPosition_B = newPosition;
    stepperMotors[stepperX].stepper->moveAbsAsync(newPosition_A);
    stepperMotors[stepperY].stepper->moveAbsAsync(newPosition_B);

    // Set target positions for each stepper
    // stepperMotors[stepperX ].stepper->setTargetAbs(newPosition_A);
    // stepperMotors[stepperY ].stepper->setTargetAbs(newPosition_B);
    // Create a stepper group and move synchronously
    // controller = {*stepperMotors[stepperX ].stepper, *stepperMotors[stepperY ].stepper};
    // StepperGroup{*stepperMotors[stepperX ].stepper, *stepperMotors[stepperY ].stepper}.move();
    Serial.println("finished.");
    return true;  // Indicate success
}

boolean motorMovingState(byte stepperX) {
    return stepperMotors[stepperX].stepper->isMoving;
}

void stopMotor(byte stepperX) {
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
    if (check_limitSwitch(stepperX) == true) {
        setPositionMotor(stepperX, 0);

        // moveMotorToAbsPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift * (-1) + 3) * sign);
        // Weg vom Endstop fahren

        moveMotorToRelPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift + currentBoardConfig->stepper[stepperX].maxTravel * 0.2));  // Rückwärts fahren
        Serial.println("Move out of endstop.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == false) {
                Serial.println("Endstop reverse triggered. Stop.");
                stopMotor(stepperX);
                break;
            }
        }
    }

    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * 0.5);             //! * 0.1
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 1.5);  //! * 1.2

        setPositionMotor(stepperX, 0);
        // moveMotorToAbsPosition(stepperX, 200);

        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (-1));  // In Endstop fahren
        Serial.println("Homing started. Moving inside endstop.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);
            if (check_limitSwitch(stepperX) == true) {
                Serial.println("Endstop triggered. Stop.");
                stopMotor(stepperX);
                break;
            }
        }

        Serial.println("Begin slow homing routine.");
        setPositionMotor(stepperX, 0);

        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);
        moveMotorToAbsPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift * (-1) + 1.5));  // Weg vom Endstop fahren
        Serial.println("Init homing slowly. Drive forward.");
        while (motorMovingState(stepperX) == true)  // Motor is moving
        {
            delay(1);  // Wait for the motor to stop moving
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * 0.1);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 1.5);  // 300% of normal                                 // 10% of normal Speed
        moveMotorToAbsPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift - 5));   // Rückwärts fahren
        while (motorMovingState(stepperX) == true)                                                 // Motor is moving
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
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
        Serial.println("Move Motor to homeShift.");
        moveMotorToAbsPosition(stepperX, (currentBoardConfig->stepper[stepperX].homeShift));
        Serial.println("Waiting for move Motor to homeShift");
        while (motorMovingState(stepperX) == true) {  // Wait for the motor to stop moving
            delay(1);
        }

        setPositionMotor(stepperX, 0);

        Serial.println("Position saved as 0");
        Serial.println("Homing Successful.");
        currentBoardConfig->stepper[stepperX].isHomed = true;
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

        moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX].homeShift + currentBoardConfig->stepper[stepperX].maxTravel * 0.05);  // Rückwärts fahren
        Serial.println("Move out of endstop.");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);
        }
    }

    if (check_limitSwitch(stepperX) == false)  // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * 0.5);             // less% of normal
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperY].maxSpeed * 0.5);             // less% of normal
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 1.5);  // 150% of normal
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperY].acceleration * 1.5);  // 150% of normal
        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        //! moveCombinedMotorsToAbsPosition(stepperX, stepperY, currentBoardConfig->stepper[stepperX ].maxTravel * (-1));  // Rückwärts fahren
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (-1));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].maxTravel * (-1));

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
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX].acceleration);
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (procentTravelSlow));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperX].maxTravel * (procentTravelSlow));
        Serial.println("Init homing slowly. Drive forward.");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true))  // Motor is moving
        {
            delay(1);  // Wait for the motor to stop moving
        }
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed * 0.05);
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperX].maxSpeed * 0.05);
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration * 3);  // 300% of normal
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX].acceleration * 3);  // 300% of normal
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].maxTravel * (-procentTravelSlow * 1.5));
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].maxTravel * (-procentTravelSlow * 1.5));
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
        setSpeedMotor(stepperX, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
        setSpeedMotor(stepperY, currentBoardConfig->stepper[stepperX].maxSpeed);             // normal speed
        setAccelerationMotor(stepperX, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
        setAccelerationMotor(stepperY, currentBoardConfig->stepper[stepperX].acceleration);  // normal acceleration
        Serial.println("Move Motors to homeShift.");
        moveMotorToAbsPosition(stepperX, currentBoardConfig->stepper[stepperX].homeShift);
        moveMotorToAbsPosition(stepperY, currentBoardConfig->stepper[stepperY].homeShift);
        Serial.println("Waiting for move Motor to homeShift");
        while ((motorMovingState(stepperX) == true) or (motorMovingState(stepperY) == true)) {
            delay(1);  // Wait for the motor to stop moving
        }

        setPositionMotor(stepperX, 0);
        setPositionMotor(stepperY, 0);

        Serial.println("Position saved as 0.");
        Serial.println("Homing Successful.");
        currentBoardConfig->stepper[stepperX].isHomed = true;
        currentBoardConfig->stepper[stepperY].isHomed = true;
        return true;
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed.");  // Optional: add this line if you want to log the failure before returning
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

double currentMotorPosition(byte stepperX) {
    double currentPosition = 0;
    currentPosition = stepperMotors[stepperX].stepper->getPosition();
    Serial.println(currentPosition);
    return currentPosition;
}
