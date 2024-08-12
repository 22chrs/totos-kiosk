// SerialController.cpp
#include "SerialController.h"

SerialController::SerialController(const String &alias)
    : alias(alias), connectionStatus(false), lastReceivedMessage(0), connectionTimeout(2500) {
}

void SerialController::begin(uint32_t baudRate) {
    Serial.begin(baudRate);
}

void SerialController::update() {
    if (Serial.available() > 0) {
        String message = Serial.readStringUntil('\n');
        lastReceivedMessage = millis();
        handleReceivedMessage(message);
    }

    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;
    }
}

bool SerialController::isConnected() {
    return connectionStatus;
}

void SerialController::handleReceivedMessage(const String &message) {
    if (message == "REQUEST_ALIAS") {
        Serial.println(alias);
    } else if (message == "connected") {
        connectionStatus = true;
    } else if (message.startsWith("ACK:")) {
        String senderAlias = message.substring(4);
        if (senderAlias == alias) {
            Serial.println("ACK:" + alias);
        }
    }
}