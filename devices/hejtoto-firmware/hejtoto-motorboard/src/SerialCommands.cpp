#include <SerialCommands.h>
void processCommand(char* command) {
    // Parse the command
    if (command[0] == 'h') {
        // Home motor command, e.g., h3
        byte motorIndex = command[1] - '0';  // Convert char to integer
        if (motorIndex >= 1 && motorIndex <= 6) {
            homeMotor(motorIndex);
            Serial.print("Motor ");
            Serial.print(motorIndex);
            Serial.println(" homed.");
        } else {
            Serial.println("Invalid motor index for homing.");
        }
    } else if (command[0] == 'p') {
        // Print current motor position, e.g., p2
        byte motorIndex = command[1] - '0';
        if (motorIndex >= 1 && motorIndex <= 6) {
            float position = currentMotorPosition(motorIndex);
            Serial.print("Motor ");
            Serial.print(motorIndex);
            Serial.print(" current position: ");
            Serial.println(position);
        } else {
            Serial.println("Invalid motor index for position query.");
        }
    } else if (command[0] == 'm') {
        // Move motor to absolute position, e.g., m1to222
        byte motorIndex = command[1] - '0';
        if (motorIndex >= 1 && motorIndex <= 6 && command[2] == 't' && command[3] == 'o') {
            float newPosition = atof(&command[4]);  // Convert substring to float
            moveMotorToAbsPosition(motorIndex, newPosition);
            Serial.print("Moving motor ");
            Serial.print(motorIndex);
            Serial.print(" to position ");
            Serial.println(newPosition);
        } else {
            Serial.println("Invalid move command.");
        }
    } else if (command[0] == 's') {
        // Stop motor command, e.g., s2
        byte motorIndex = command[1] - '0';
        if (motorIndex >= 1 && motorIndex <= 6) {
            stopMotor(motorIndex);
            Serial.print("Motor ");
            Serial.print(motorIndex);
            Serial.println(" stopped.");
        } else {
            Serial.println("Invalid motor index for stopping.");
        }
    } else if (command[0] == 'e') {
        // Move motor to endpoint position, e.g., e2
        byte motorIndex = command[1] - '0';
        if (motorIndex >= 1 && motorIndex <= 6) {
            float maxTravel = currentBoardConfig->stepper[motorIndex - 1].maxTravel;
            moveMotorToAbsPosition(motorIndex, maxTravel);
            Serial.print("Moving motor ");
            Serial.print(motorIndex);
            Serial.print(" to end position ");
            Serial.println(maxTravel);
        } else {
            Serial.println("Invalid motor index for end position.");
        }

    } else if (command[0] == 'o') {
        // Move motor to endpoint position, e.g., o2
        byte motorIndex = command[1] - '0';

        float position = 0;
        moveMotorToAbsPosition(motorIndex, position);
        Serial.print("Moving motor ");
        Serial.print(motorIndex);
        Serial.print(" to start position ");
        Serial.println(position);

    } else {
        Serial.println("Unknown command.");
    }
}

void loopSerialCommands() {
    while (Serial.available() > 0) {
        char received = Serial.read();

        // Check for newline (end of command)
        if (received == '\n' || received == '\r') {
            inputBuffer[bufferIndex] = '\0';  // Null-terminate the string
            processCommand(inputBuffer);
            bufferIndex = 0;  // Reset buffer for the next command
        } else {
            // Add character to buffer if there's space
            if (bufferIndex < bufferSize - 1) {
                inputBuffer[bufferIndex++] = received;
            }
        }
    }
}
