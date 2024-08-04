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
                    return homeCombinedMotors(i + 1, j + 1);  // Use indices of combined motors
                }
            }

            // If no combined motors, home single motor
            return homeMotor(i + 1);  // Pass the index as a byte (or unsigned char)
        }
    }

    Serial.print("Error: Stepper with name ");
    Serial.print(stepperName);
    Serial.println(" not found.");
    return false;
}

boolean moveDevice(const String &stepperName, double position) {
    if (currentBoardConfig == nullptr) {
        Serial.println("Error: Board configuration not initialized.");
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

            // Check if the requested position exceeds the maximum travel
            if (position < 0 || position > config.maxTravel) {
                Serial.print("Error: Requested position ");
                Serial.print(position);
                Serial.print(" exceeds max travel of ");
                Serial.print(config.maxTravel);
                Serial.println(" mm.");
                return false;
            }

            // Check for combined motors by name
            for (int j = 0; j < 6; ++j) {
                if (i != j && currentBoardConfig->stepper[j].name == stepperName) {
                    Serial.print("Moving combined motors: ");
                    Serial.print(currentBoardConfig->stepper[i].name);
                    Serial.print(" and ");
                    Serial.println(currentBoardConfig->stepper[j].name);

                    // Move combined motors to the specified position
                    moveCombinedMotorsToAbsPosition(i + 1, j + 1, position);
                    return true;
                }
            }

            // If no combined motors, move single motor
            moveMotorToAbsPosition(i + 1, position);
            return true;
        }
    }

    Serial.print("Error: Stepper with name ");
    Serial.print(stepperName);
    Serial.println(" not found.");
    return false;
}