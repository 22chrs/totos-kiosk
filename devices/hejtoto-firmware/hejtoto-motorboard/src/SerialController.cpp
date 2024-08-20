// SerialController.cpp
#include "SerialController.h"

#include "BoardSelect.h"
#include "Movements.h"  // Include the header where moveDevice is declared

SerialController::SerialController()
    : alias("Unknown"),  // Default alias
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(2500) {
}

void SerialController::begin(uint32_t baudRate) {
    Serial.begin(baudRate);
}

void SerialController::setAlias(const String &alias) {
    this->alias = alias;
}

void SerialController::update() {
    if (Serial.available() > 0) {
        String message = Serial.readStringUntil('\n');
        lastReceivedMessage = millis();
        handleReceivedMessage(message);
    }

    // Check if the connection has timed out
    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;  // Mark as disconnected
        Serial.println("Connection lost");
    }
}

bool SerialController::isConnected() {
    return connectionStatus;
}

void SerialController::handleReceivedMessage(const String &message) {
    if (message == "REQUEST_ALIAS") {
        Serial.println(alias);
    } else if (message == "connected") {
        connectionStatus = true;  // Set connection status to true when "connected" message is received
    } else if (message.startsWith("ACK:")) {
        String senderAlias = message.substring(4);
        if (senderAlias == alias) {
            if (!connectionStatus) {
                connectionStatus = true;         // Ensure the device is marked as connected
                Serial.println("ACK:" + alias);  // Send the ACK only if not already connected
            }
        }
    } else if (message.startsWith("moveDevice")) {
        // Process the moveDevice command
        bool success = processMoveDeviceCommand(message);

        // Send back an acknowledgment of the command processing
        if (success) {
            Serial.println("ACK: " + message);  // Send acknowledgment with the original message
        } else {
            Serial.println("ERROR: Failed to execute " + message);  // Send an error message if it failed
        }
    }
}

// Function to process the moveDevice command
bool SerialController::processMoveDeviceCommand(const String &message) {
    // Example: moveDevice("Schleuse", 100, 100, 100)
    // Parse the message to extract the parameters (device name, position, etc.)
    // Assuming the message format is well-formed

    // Extract the parameters (this is a simplistic approach)
    int firstQuote = message.indexOf('"');
    int secondQuote = message.indexOf('"', firstQuote + 1);
    String stepperName = message.substring(firstQuote + 1, secondQuote);

    // Find the positions of the other parameters
    int firstComma = message.indexOf(',', secondQuote);
    int secondComma = message.indexOf(',', firstComma + 1);
    int thirdComma = message.indexOf(',', secondComma + 1);

    // Extract the numeric values
    float position = message.substring(firstComma + 1, secondComma).toFloat();  // Use toFloat instead of toDouble
    int maxSpeedPercentage = message.substring(secondComma + 1, thirdComma).toInt();
    int driveCurrentPercentage = message.substring(thirdComma + 1).toInt();

    // Call the actual moveDevice function from Movements.h
    bool result = moveDevice(stepperName, position, maxSpeedPercentage, driveCurrentPercentage);

    // Return true if the command was successfully processed
    return result;
}