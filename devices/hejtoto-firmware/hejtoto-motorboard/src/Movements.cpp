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
            // Check if there are any other motors with the same name
            for (int j = 0; j < 6; ++j) {
                if (i != j && currentBoardConfig->stepper[j].name == stepperName) {
                    // Serial.print("Homing combined motors: ");
                    // Serial.print(currentBoardConfig->stepper[i].name);
                    // Serial.print(" and ");
                    // Serial.println(currentBoardConfig->stepper[j].name);
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

boolean moveDevice(const String &stepperName, double position, int maxSpeedPercentage, int driveCurrentPercentage, double desiredRingPercentage, String messageID) {
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
            stepperMotors[i].state.desiredRingPercentage = desiredRingPercentage;
            stepperMotors[i].state.messageID = messageID;

            const StepperConfig &config = currentBoardConfig->stepper[i];  //! ?? why const

            // Calculate actual drive current and speed based on percentages
            int driveCurrent = static_cast<int>(config.driveCurrent * (driveCurrentPercentage / 100.0));
            unsigned long maxSpeed = static_cast<unsigned long>(config.maxSpeed * (maxSpeedPercentage / 100.0));

            changeCurrentStateMotor(i, driveCurrent);
            setSpeedMotor(i, maxSpeed);
            // Check for combined motors by name
            for (int j = 0; j < 6; ++j) {
                if (i != j && currentBoardConfig->stepper[j].name == stepperName) {
                    stepperMotors[j].state.desiredRingPercentage = desiredRingPercentage;
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