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

            // Check if the stepper is part of a combined setup
            int groupId = currentBoardConfig->stepper[i].combinedGroupId;
            if (currentBoardConfig->stepper[i].isCombined && groupId != 0) {
                // Find the other motor(s) in the same group
                for (int j = 0; j < 6; ++j) {
                    if (i != j && currentBoardConfig->stepper[j].combinedGroupId == groupId) {
                        Serial.print("Homing combined motors: ");
                        Serial.println(currentBoardConfig->stepper[j].name);
                        return homeCombinedMotors(i + 1, j + 1); // Use indices of combined motors
                    }
                }
            } else {
                // Pass the index to homeMotor
                return homeMotor(i + 1);  // Pass the index as a byte (or unsigned char)
            }
        }
    }

    Serial.print("Error: Stepper with name ");
    Serial.print(stepperName);
    Serial.println(" not found.");
    return false;
}