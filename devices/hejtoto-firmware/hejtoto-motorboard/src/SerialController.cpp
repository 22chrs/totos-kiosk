// SerialController.cpp

#include "SerialController.h"

#include "BoardSelect.h"

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
    }
}