#include "SerialController.h"

#include <Movements.h>

SerialController::SerialController()
    : alias("Unknown"),
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(2500) {
}

void SerialController::begin(uint32_t baudRate) {
    Serial.begin(baudRate);
    while (!Serial) {
        // Wait for the serial port to connect.
    }
}

void SerialController::setAlias(const String &alias) {
    this->alias = alias;
}

void SerialController::update() {
    while (Serial.available() > 0) {
        String message = Serial.readStringUntil('\n');
        lastReceivedMessage = millis();
        handleReceivedMessage(message);
    }

    // Check if the connection has timed out
    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;
        sendMessage("Connection lost");
    }
}

bool SerialController::isConnected() {
    return connectionStatus;
}

void SerialController::handleReceivedMessage(const String &message) {
    if (message == "REQUEST_ALIAS") {
        // Serial.println("AAAAALIAS");
        sendMessage(alias);
    } else if (message == "connected") {
        connectionStatus = true;
    } else if (message.startsWith("ACK:")) {
        String senderAlias = message.substring(4);
        if (senderAlias == alias) {
            if (!connectionStatus) {
                connectionStatus = true;
                sendMessage("ACK:" + alias);
            }
        }
    } else if (message.startsWith("moveDevice")) {
        bool success = processMoveDeviceCommand(message);
        if (success) {
            sendMessage("ACK: moveDevice");
        } else {
            sendMessage("ERROR: Failed to execute moveDevice");
        }
    }
}

bool SerialController::processMoveDeviceCommand(const String &message) {
    int firstQuote = message.indexOf('"');
    int secondQuote = message.indexOf('"', firstQuote + 1);
    String stepperName = message.substring(firstQuote + 1, secondQuote);

    int firstComma = message.indexOf(',', secondQuote);
    int secondComma = message.indexOf(',', firstComma + 1);
    int thirdComma = message.indexOf(',', secondComma + 1);

    float position = message.substring(firstComma + 1, secondComma).toFloat();
    int maxSpeedPercentage = message.substring(secondComma + 1, thirdComma).toInt();
    int driveCurrentPercentage = message.substring(thirdComma + 1).toInt();

    bool result = moveDevice(stepperName, position, maxSpeedPercentage, driveCurrentPercentage);
    return result;
}

void SerialController::sendMessage(const String &message) {
    Serial.println("->" + message);
}