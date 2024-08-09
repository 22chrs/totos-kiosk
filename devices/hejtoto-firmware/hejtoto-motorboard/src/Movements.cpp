// Movements.cpp
#include <Movements.h>

boolean homeDevice(const String &stepperName) {
    if (currentBoardConfig == nullptr) {
        Serial.println("Error: Board configuration not initialized.");
        return false;
    }

    // Find the index of the stepper by friendly name
    for (int i = 0; i < 6; ++i) {
        if (currentBoardConfig->stepper[i].name == stepperName) {
            Serial.print("Homing ");
            Serial.println(stepperName);

            // Check if there are any other motors with the same name
            for (int j = 0; j < 6; ++j) {
                if (i != j && currentBoardConfig->stepper[j].name == stepperName) {
                    Serial.print("Homing combined motors: ");
                    Serial.print(currentBoardConfig->stepper[i].name);
                    Serial.print(" and ");
                    Serial.println(currentBoardConfig->stepper[j].name);

                    // Call the function to home combined motors
                    return homeCombinedMotors(i, j);  // Use indices of combined motors
                }
            }

            // If no combined motors, home single motor
            return homeMotor(i);  // Pass the index as a byte (or unsigned char)
        }
    }

    Serial.print("Error: Stepper with name ");
    Serial.print(stepperName);
    Serial.println(" not found.");
    return false;
}

boolean moveDevice(const String &stepperName, double position, int maxSpeedPercentage, int driveCurrentPercentage) {
    if (currentBoardConfig == nullptr) {
        Serial.println("Error: Board configuration not initialized.");
        return false;
    }

    // Validate percentage inputs
    if (driveCurrentPercentage < 0 || driveCurrentPercentage > 100) {
        Serial.println("Error: Drive current percentage must be between 0 and 100.");
        return false;
    }

    if (maxSpeedPercentage < 0 || maxSpeedPercentage > 100) {
        Serial.println("Error: Max speed percentage must be between 0 and 100.");
        return false;
    }

    // Find the index of the stepper by friendly name
    for (int i = 0; i < 6; ++i) {
        if (currentBoardConfig->stepper[i].name == stepperName) {
            Serial.print("Attempting to move ");
            Serial.print(stepperName);
            Serial.print(" to position ");
            Serial.println(position);

            const StepperConfig &config = currentBoardConfig->stepper[i];

            // Calculate actual drive current and speed based on percentages
            int driveCurrent = static_cast<int>(config.driveCurrent * (driveCurrentPercentage / 100.0));
            unsigned long maxSpeed = static_cast<unsigned long>(config.maxSpeed * (maxSpeedPercentage / 100.0));

            Serial.print("Drive Current set to: ");
            Serial.print(driveCurrent);
            Serial.print(" mA (");
            Serial.print(driveCurrentPercentage);
            Serial.println("%)");

            Serial.print("Max Speed set to: ");
            Serial.print(maxSpeed);
            Serial.print(" steps/s (");
            Serial.print(maxSpeedPercentage);
            Serial.println("%)");

            // Check if the requested position exceeds the maximum travel
            if (position < 0 || position > config.maxTravel) {
                Serial.print("Error: Requested position ");
                Serial.print(position);
                Serial.print(" exceeds max travel of ");
                Serial.print(config.maxTravel);
                Serial.println(" mm.");
                return false;
            }

            // Set the drive current and speed before moving the motor
            changeCurrentStateMotor(i, driveCurrent);
            setSpeedMotor(i, maxSpeed);

            // Check for combined motors by name
            for (int j = 0; j < 6; ++j) {
                if (i != j && currentBoardConfig->stepper[j].name == stepperName) {
                    Serial.print("Moving combined motors: ");
                    Serial.print(currentBoardConfig->stepper[i].name);
                    Serial.print(" and ");
                    Serial.println(currentBoardConfig->stepper[j].name);

                    changeCurrentStateMotor(j, driveCurrent);
                    setSpeedMotor(j, maxSpeed);

                    // Move combined motors to the specified position
                    moveCombinedMotorsToAbsPosition(i, j, position);
                    return true;
                }
            }

            // If no combined motors, move single motor
            moveMotorToAbsPosition(i, position);
            return true;
        }
    }

    Serial.print("Error: Stepper with name ");
    Serial.print(stepperName);
    Serial.println(" not found.");
    return false;
}

void deviceStatus(const String &stepperName) {
    Serial.println("");
    Serial.println("--- ");
    Serial.print(stepperName);
    Serial.print(" ---");

    // Find the index of the stepper by friendly name
    for (int i = 0; i < 6; ++i) {
        if (currentBoardConfig->stepper[i].name == stepperName) {
            currentBoardConfig->stepper[i].currentPosition = currentMotorPosition(i);
            currentBoardConfig->stepper[i].isMoving = motorMovingState(i);

            Serial.println("isHomed: ");
            Serial.print(currentBoardConfig->stepper[i].isHomed);
            Serial.println("currentPosition: ");
            Serial.print(currentBoardConfig->stepper[i].currentPosition);
            Serial.println("isMoving: ");
            Serial.print(currentBoardConfig->stepper[i].isMoving);

            return;  // falls Dual Motor Betrieb wird der erste Motor nur erfasst.
        }
    }

    Serial.println("--- --- --- ");
}