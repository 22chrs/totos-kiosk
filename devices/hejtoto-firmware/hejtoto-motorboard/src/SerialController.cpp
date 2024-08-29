#include "SerialController.h"

#include <Led.h>
#include <Movements.h>

SerialController serialController;

SerialController::SerialController()
    : alias("Unknown"),
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(40),
      receivedTimestamp(""),
      timestampMillisOffset(0),
      lastSentTimestamp(""),
      timestampSuffix('A') {
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

void SerialController::update(uint32_t baudRate) {
    if (!Serial) {  // Check if the Serial connection is still active
        connectionStatus = false;
        Neopixel(RED);
        Serial.end();
        begin(baudRate);  // Attempt to reinitialize with the default baud rate
        return;
    }

    // Use a static buffer to reduce memory allocation overhead
    static char buffer[256];  // Adjust size as needed
    static size_t index = 0;

    while (Serial.available() > 0) {
        char incomingChar = Serial.read();  // Read a single character

        // Process only if not exceeding buffer size
        if (index < sizeof(buffer) - 1) {
            if (incomingChar == '\n') {  // Check if the end of the message is reached
                buffer[index] = '\0';    // Null-terminate the string
                if (isValidMessage(buffer)) {
                    handleReceivedMessage(buffer);
                }
                index = 0;                       // Reset the buffer index for the next message
                lastReceivedMessage = millis();  // Reset the last received message time
            } else {
                buffer[index++] = incomingChar;  // Append to the buffer
            }
        } else {
            // Buffer overflow; reset and ignore the message
            index = 0;
        }
    }

    // Check if the connection has timed out
    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;
        Neopixel(RED);
        //! ToDo sent alias or wait and do nothing
    }
}

boolean SerialController::isConnected() {
    return connectionStatus;
}

boolean SerialController::isValidMessage(const String &message) {
    // Check if the message starts with <STX> and ends with <ETX>
    if (message.startsWith("<STX>") && message.endsWith("<ETX>")) {
        String command = message.substring(5, message.length() - 5);

        // Extract CRC from the end of the message
        int crcIndex = command.lastIndexOf('|');
        if (crcIndex == -1) {
            return false;
        }

        String receivedCrc = command.substring(crcIndex + 1);
        String commandWithoutCrc = command.substring(0, crcIndex);

        // Calculate CRC and compare (case-insensitive)
        String calculatedCrc = calculateCRC(commandWithoutCrc);

        if (receivedCrc.equalsIgnoreCase(calculatedCrc)) {
            return true;
        } else {
            return false;
        }
    }

    return false;
}

void SerialController::sendAckMessage(const String &timestamp) {
    String ackMessage = "ACK:" + timestamp;

    // Generate the current timestamp with a unique letter suffix
    String timestampToSend = generateTimestampWithSuffix();

    // Add STX, ETX, and CRC to the acknowledgment message
    String messageToSend = "<STX>" + timestampToSend + "|" + ackMessage + "|" + calculateCRC(timestampToSend + "|" + ackMessage) + "<ETX>";

    // Ensure the serial buffer is clear before sending a new message
    Serial.flush();

    // Send the message
    Serial.println(messageToSend);

    // Ensure the data is fully sent
    Serial.flush();
}

void SerialController::handleReceivedMessage(const String &message) {
    if (message.startsWith("<STX>") && message.endsWith("<ETX>")) {
        String command = message.substring(5, message.length() - 5);

        int crcIndex = command.lastIndexOf('|');
        if (crcIndex > 0) {
            // flip the led

            flipBuiltInLED();
            String cmdContent = command.substring(0, crcIndex);
            int firstPipeIndex = cmdContent.indexOf('|');
            if (firstPipeIndex > 0) {
                String timestamp = cmdContent.substring(0, firstPipeIndex);
                String cmdWithoutTimestamp = cmdContent.substring(firstPipeIndex + 1);

                if (cmdWithoutTimestamp == "REQUEST_ALIAS") {
                    receivedTimestamp = timestamp;
                    timestampMillisOffset = millis();
                    // sendAckMessage(timestamp); //! here not: REQUEST_ALIAS
                    sendMessage(alias);

                    //  Serial.println(getCurrentTime());
                    //   } else if (cmdWithoutTimestamp == "heartbeat") {
                    //       sendMessage("heartbeat");
                } else {
                    sendAckMessage(timestamp);
                }

                if (cmdWithoutTimestamp == "connected") {
                    Neopixel(GREEN);
                    connectionStatus = true;
                } else if (cmdWithoutTimestamp.startsWith("moveDevice")) {
                    processMoveDeviceCommand(cmdWithoutTimestamp, timestamp);
                } else if (cmdWithoutTimestamp.startsWith("homeDevice")) {
                    processHomeDeviceCommand(cmdWithoutTimestamp, timestamp);
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

void SerialController::processHomeDeviceCommand(const String &message, const String &timestamp) {
    // Extract the stepper name from the command
    int firstQuote = message.indexOf('"');
    int secondQuote = message.indexOf('"', firstQuote + 1);
    String stepperName = message.substring(firstQuote + 1, secondQuote);

    // Call the homeDevice function with the extracted stepperName
    homeDevice(stepperName, timestamp);

    // Send an acknowledgment message after processing
    // sendAckMessage(timestamp);
}

void SerialController::processMoveDeviceCommand(const String &message, const String &timestamp) {
    int firstQuote = message.indexOf('"');
    int secondQuote = message.indexOf('"', firstQuote + 1);
    String stepperName = message.substring(firstQuote + 1, secondQuote);

    int firstComma = message.indexOf(',', secondQuote);
    int secondComma = message.indexOf(',', firstComma + 1);
    int thirdComma = message.indexOf(',', secondComma + 1);
    int fourthComma = message.indexOf(',', thirdComma + 1);  // Add this line to get the index of the fourth comma

    float position = message.substring(firstComma + 1, secondComma).toFloat();
    int maxSpeedPercentage = message.substring(secondComma + 1, thirdComma).toInt();
    int driveCurrentPercentage = message.substring(thirdComma + 1, fourthComma).toInt();  // Update to extract the correct substring
    int ringPercentage = message.substring(fourthComma + 1).toInt();                      // Extract the ringPercentage

    moveDevice(stepperName, position, maxSpeedPercentage, driveCurrentPercentage, ringPercentage, timestamp);  // Pass the ringPercentage to moveDevice
}

String SerialController::sendMessage(const String &message) {
    // Generate the current timestamp with a unique letter suffix
    String timestamp = generateTimestampWithSuffix();
    // Add STX, ETX, and CRC to the message
    String messageToSend = "<STX>" + timestamp + "|" + message + "|" + calculateCRC(timestamp + "|" + message) + "<ETX>";

    // Ensure the serial buffer is clear before sending a new message
    Serial.flush();

    // Send the message
    Serial.println(messageToSend);

    // Ensure the data is fully sent
    Serial.flush();

    return timestamp;
}

String SerialController::calculateCRC(const String &message) {
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
    int hour = timestamp.substring(6, 8).toInt();
    int minute = timestamp.substring(8, 10).toInt();
    int millis = timestamp.substring(10, 14).toInt();

    return (hour * 3600UL + minute * 60UL) * 1000UL + millis;
}

String SerialController::getCurrentTime() {
    unsigned long receivedTimeMillis = getMillisFromTimestamp(receivedTimestamp);
    unsigned long currentMillis = millis();
    unsigned long elapsedMillis = (currentMillis >= timestampMillisOffset) ? (currentMillis - timestampMillisOffset) : (0xFFFFFFFF - timestampMillisOffset + currentMillis + 1);

    unsigned long currentTimeMillis = receivedTimeMillis + elapsedMillis;
    currentTimeMillis = currentTimeMillis % (24UL * 3600UL * 1000UL);

    unsigned long currentHour = (currentTimeMillis / 3600000UL) % 24;
    unsigned long currentMinute = (currentTimeMillis / 60000UL) % 60;
    unsigned long currentMillisOnly = currentTimeMillis % 1000;

    String yy = receivedTimestamp.substring(0, 2);
    String mm = receivedTimestamp.substring(2, 4);
    String dd = receivedTimestamp.substring(4, 6);

    char currentTimeStr[15];
    snprintf(currentTimeStr, sizeof(currentTimeStr), "%s%s%s%02lu%02lu%04lu", yy.c_str(), mm.c_str(), dd.c_str(), currentHour, currentMinute, currentMillisOnly);

    return String(currentTimeStr);
}

String SerialController::generateTimestampWithSuffix() {
    String newTimestamp = getCurrentTime();

    if (newTimestamp == lastSentTimestamp) {
        timestampSuffix = (timestampSuffix == 'Z') ? 'A' : (timestampSuffix + 1);
    } else {
        timestampSuffix = 'A';
        lastSentTimestamp = newTimestamp;
    }

    return newTimestamp + timestampSuffix;
}

// https://github.com/brenner-tobias/addon-cloudflared/wiki/How-tos#how-to-configure-remote-tunnels