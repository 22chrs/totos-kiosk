#include "SerialController.h"

#include <Led.h>
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
        if (isValidMessage(message)) {
            handleReceivedMessage(message);
        } else {
            // Serial.print("Not valid message: ");
            // Serial.println(message);
        }
    }

    // Check if the connection has timed out
    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;
        Neopixel(RED);
        //! ToDo sent alias or wait and do nothing
    }
}

bool SerialController::isConnected() {
    return connectionStatus;
}

bool SerialController::isValidMessage(const String &message) {
    // Serial.println("Debug: Starting message validation...");
    // Serial.println("Debug: Received message: " + message);

    // Check if the message starts with <STX> and ends with <ETX>
    if (message.startsWith("<STX>") && message.endsWith("<ETX>")) {
        String command = message.substring(5, message.length() - 5);
        // Serial.println("Debug: Extracted command: " + command);

        // Extract CRC from the end of the message
        int crcIndex = command.lastIndexOf('|');
        if (crcIndex == -1) {
            // Serial.println("Debug: CRC delimiter '|' not found.");
            return false;
        }

        String receivedCrc = command.substring(crcIndex + 1);
        String commandWithoutCrc = command.substring(0, crcIndex);
        // Serial.println("Debug: Command without CRC: " + commandWithoutCrc);
        // Serial.println("Debug: Received CRC: " + receivedCrc);

        // Calculate CRC and compare (case-insensitive)
        String calculatedCrc = calculateCRC(commandWithoutCrc);
        // Serial.println("Debug: Calculated CRC: " + calculatedCrc);

        if (receivedCrc.equalsIgnoreCase(calculatedCrc)) {
            // Serial.println("Debug: Message VALID.");
            return true;
        } else {
            // Serial.println("Debug: CRC mismatch. Message is invalid.");
            return false;
        }
    } else {
        // Serial.println("Debug: Message does not start with <STX> and/or end with <ETX>.");
    }

    return false;
}

void SerialController::handleReceivedMessage(const String &message) {
    // Extract command from message
    String command = message.substring(5, message.length() - 5);  // Removing <STX> and <ETX>

    if (command.startsWith("CMD:")) {
        int crcIndex = command.lastIndexOf('|');
        String cmdContent = command.substring(4, crcIndex);  // Extract content before the CRC

        if (cmdContent == "heartbeat") {
            sendMessage("heartbeat");
        }

        if (cmdContent == "REQUEST_ALIAS") {
            sendMessage(alias);
            // Process the specific command
        }

        else if (cmdContent == "connected") {
            Neopixel(GREEN);
            connectionStatus = true;
            // Serial.println("connection success");
        }

        else if (cmdContent.startsWith("moveDevice")) {
            sendMessage(cmdContent + "started");
            bool success = processMoveDeviceCommand(cmdContent);
            if (success) {
                sendMessage(cmdContent + "finished");
            } else {
                sendMessage(cmdContent + "failed");
            }
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
    // Add STX, ETX, and CRC to the message
    String messageToSend = "<STX>" + message + "|" + calculateCRC(message) + "<ETX>";
    Serial.println(messageToSend);
}

String SerialController::calculateCRC(const String &message) {
    // Placeholder for CRC calculation (CRC-16-CCITT or another algorithm)
    uint16_t crc = 0xFFFF;
    for (size_t i = 0; i < message.length(); i++) {
        crc ^= message[i];
        for (int j = 0; j < 8; j++) {
            if (crc & 1) {
                crc = (crc >> 1) ^ 0x8408;
            } else {
                crc >>= 1;
            }
        }
    }
    return String(crc, HEX);
}