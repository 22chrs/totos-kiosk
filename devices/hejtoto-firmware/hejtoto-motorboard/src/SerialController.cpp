#include "SerialController.h"

#include <Led.h>
#include <Movements.h>

SerialController::SerialController()
    : alias("Unknown"),
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(2500),
      receivedTimestamp(""),
      timestampMillisOffset(0) {
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
    // Ensure that the message starts with <STX> and ends with <ETX>
    if (message.startsWith("<STX>") && message.endsWith("<ETX>")) {
        // Extract command from message, removing <STX> and <ETX>
        String command = message.substring(5, message.length() - 5);  // Extract content inside <STX> and <ETX>

        // Find the index of the CRC separator '|'
        int crcIndex = command.lastIndexOf('|');
        if (crcIndex > 0) {
            // Extract the actual command content before the CRC
            String cmdContent = command.substring(0, crcIndex);

            // Assuming the timestamp is always at the beginning, find the first '|' separator
            int firstPipeIndex = cmdContent.indexOf('|');
            if (firstPipeIndex > 0) {
                // Extract the timestamp and the command without the timestamp
                String timestamp = cmdContent.substring(0, firstPipeIndex);
                String cmdWithoutTimestamp = cmdContent.substring(firstPipeIndex + 1);

                // Check if the command is "REQUEST_ALIAS"
                if (cmdWithoutTimestamp == "REQUEST_ALIAS") {
                    // Store the timestamp and the current millis offset
                    receivedTimestamp = timestamp;
                    timestampMillisOffset = millis();

                    sendMessage(alias);
                    Serial.println(getCurrentTime());
                } else if (cmdWithoutTimestamp == "heartbeat") {
                    sendMessage("heartbeat");
                } else if (cmdWithoutTimestamp == "connected") {
                    Neopixel(GREEN);
                    connectionStatus = true;
                    // Serial.println("connection success");
                } else if (cmdWithoutTimestamp.startsWith("moveDevice")) {
                    sendMessage(cmdWithoutTimestamp + "started");
                    bool success = processMoveDeviceCommand(cmdWithoutTimestamp);
                    if (success) {
                        sendMessage(cmdWithoutTimestamp + "finished");
                    } else {
                        sendMessage(cmdWithoutTimestamp + "failed");
                    }
                }
            } else {
                Serial.println("Invalid message format: Timestamp separator '|' not found");
            }
        } else {
            Serial.println("Invalid message format: CRC separator '|' not found");
        }
    } else {
        Serial.println("Invalid message format: Missing <STX> or <ETX>");
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

String SerialController::getReceivedTimestamp() const {
    return receivedTimestamp;
}

unsigned long SerialController::getTimestampMillisOffset() const {
    return timestampMillisOffset;
}

unsigned long SerialController::getMillisFromTimestamp(const String &timestamp) {
    // Convert the timestamp into milliseconds since midnight (00:00)
    int hour = timestamp.substring(6, 8).toInt();
    int minute = timestamp.substring(8, 10).toInt();
    int second = 0;  // We don't have seconds in the timestamp
    int millis = timestamp.substring(10, 14).toInt();

    return (hour * 3600UL + minute * 60UL) * 1000UL + millis;
}

String SerialController::getCurrentTime() {
    // Calculate the time in milliseconds since midnight based on the received timestamp
    unsigned long receivedTimeMillis = getMillisFromTimestamp(receivedTimestamp);

    // Calculate the time elapsed since the timestamp was received, considering overflow
    unsigned long currentMillis = millis();
    unsigned long elapsedMillis = (currentMillis >= timestampMillisOffset) ? (currentMillis - timestampMillisOffset) : (0xFFFFFFFF - timestampMillisOffset + currentMillis + 1);

    // Total time in milliseconds since midnight
    unsigned long currentTimeMillis = receivedTimeMillis + elapsedMillis;

    // Handle potential overflow in the calculated currentTimeMillis
    currentTimeMillis = currentTimeMillis % (24UL * 3600UL * 1000UL);

    // Calculate the current hour, minute, and millisecond values
    unsigned long currentHour = (currentTimeMillis / 3600000UL) % 24;
    unsigned long currentMinute = (currentTimeMillis / 60000UL) % 60;
    unsigned long currentMillisOnly = currentTimeMillis % 1000;

    // Extract the date part from the received timestamp (yy, mm, dd)
    String yy = receivedTimestamp.substring(0, 2);
    String mm = receivedTimestamp.substring(2, 4);
    String dd = receivedTimestamp.substring(4, 6);

    // Format the current time in the "yymmddhhmmssss" format
    char currentTimeStr[15];
    snprintf(currentTimeStr, sizeof(currentTimeStr), "%02s%02s%02s%02lu%02lu%04lu",
             yy.c_str(), mm.c_str(), dd.c_str(), currentHour, currentMinute, currentMillisOnly);

    return String(currentTimeStr);
}