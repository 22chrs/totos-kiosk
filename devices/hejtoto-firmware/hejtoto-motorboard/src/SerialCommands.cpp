#include <SerialCommands.h>

void processCommand(char* command) {
    // Parse the command
    if (command[0] == 'h') {
        // Home motor command, e.g., h3
        byte motorIndex = command[1] - '0';  // Convert char to integer
        if (homeMotor(motorIndex)) {
            Serial.print("Motor ");
            Serial.print(motorIndex);
            Serial.println(" homed.");
        } else {
            Serial.print("Failed to home motor ");
            Serial.println(motorIndex);
        }
    } else if (command[0] == 'p') {
        // Print current motor position, e.g., p2
        byte motorIndex = command[1] - '0';
        float position = currentMotorPosition(motorIndex);
        Serial.print("Motor ");
        Serial.print(motorIndex);
        Serial.print(" current position: ");
        Serial.println(position);
    } else if (command[0] == 'm') {
        // Move motor to absolute position, e.g., m1to222
        byte motorIndex = command[1] - '0';
        if (command[2] == 't' && command[3] == 'o') {
            float newPosition = atof(&command[4]);  // Convert substring to float
            moveMotorToAbsPosition(motorIndex, newPosition);
            Serial.print("Moving motor ");
            Serial.print(motorIndex);
            Serial.print(" to position ");
            Serial.println(newPosition);
        }
    } else if (command[0] == 's') {
        // Stop motor command, e.g., s2
        byte motorIndex = command[1] - '0';
        stopMotor(motorIndex);
        Serial.print("Motor ");
        Serial.print(motorIndex);
        Serial.println(" stopped.");
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
