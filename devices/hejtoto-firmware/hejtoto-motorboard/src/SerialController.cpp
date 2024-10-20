#include "SerialController.h"

#include <Led.h>
#include <Movements.h>

SerialController serialController;

SerialController::SerialController()
    : alias("Unknown"),
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(40),
      receivedInitialTimestamp(""),
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
    if (!Serial) {
        connectionStatus = false;
        Neopixel(RED);
        Serial.end();
        begin(baudRate);
        return;
    }

    static char buffer[256];
    static size_t index = 0;

    while (Serial.available() > 0) {
        char incomingChar = Serial.read();

        if (index < sizeof(buffer) - 1) {
            if (incomingChar == '\n') {
                buffer[index] = '\0';
                if (isValidMessage(buffer)) {
                    handleReceivedMessage(buffer);
                }
                index = 0;
                lastReceivedMessage = millis();
            } else {
                buffer[index++] = incomingChar;
            }
        } else {
            index = 0;
        }
    }

    if (isConnected() && millis() - lastReceivedMessage > connectionTimeout) {
        connectionStatus = false;
        Neopixel(RED);
    }

    checkForAckTimeouts();  // Check for ACK timeouts and retry messages if necessary
}

boolean SerialController::isConnected() {
    return connectionStatus;
}

void SerialController::checkForAckTimeouts() {
    unsigned long currentMillis = millis();

    for (int i = 0; i < sentMessageCount; ++i) {
        if (sentMessages[i].retryCount >= 10) {
            // If the message has been retried 10 times, remove it from the list
            for (int j = i; j < sentMessageCount - 1; ++j) {
                sentMessages[j] = sentMessages[j + 1];
            }
            --sentMessageCount;
            i--;  // Adjust the index to account for the removed message
            continue;
        }

        // Check if enough time has passed since the last retry attempt
        if (currentMillis - sentMessages[i].lastRetryTime >= 50) {
            // Retry sending the message
            Serial.println(sentMessages[i].message);
            Serial.flush();

            // Update the last retry time and increment the retry count
            sentMessages[i].lastRetryTime = currentMillis;
            sentMessages[i].retryCount++;
        }
    }
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

bool SerialController::isRepeatedTimestamp(const String &timestamp) {
    for (int i = 0; i < 20; ++i) {
        if (lastTimestamps[i] == timestamp) {
            // Serial.println("Repeated" + timestamp);
            return true;
        }
    }
    return false;
}

void SerialController::updateTimestampBuffer(const String &timestamp) {
    lastTimestamps[timestampIndex] = timestamp;
    timestampIndex = (timestampIndex + 1) % 20;  // Wrap around to keep within 20 entries
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
            flipBuiltInLED();

            String cmdContent = command.substring(0, crcIndex);
            int firstPipeIndex = cmdContent.indexOf('|');
            if (firstPipeIndex > 0) {
                String timestamp = cmdContent.substring(0, firstPipeIndex);
                String cmdWithoutTimestamp = cmdContent.substring(firstPipeIndex + 1);

                if (cmdWithoutTimestamp.startsWith("ACK:")) {
                    String ackedTimestamp = cmdWithoutTimestamp.substring(4);

                    // Remove the acknowledged message from the retry list
                    for (int i = 0; i < sentMessageCount; ++i) {
                        if (sentMessages[i].timestamp == ackedTimestamp) {
                            // Shift the remaining messages down
                            for (int j = i; j < sentMessageCount - 1; ++j) {
                                sentMessages[j] = sentMessages[j + 1];
                            }
                            --sentMessageCount;
                            break;
                        }
                    }
                }

                if (cmdWithoutTimestamp == "REQUEST_ALIAS") {
                    receivedInitialTimestamp = timestamp;
                    timestampMillisOffset = millis();
                    sendMessage(alias);
                } else {
                    if (!cmdWithoutTimestamp.startsWith("ACK:")) {
                        sendAckMessage(timestamp);
                    }

                    if (!isRepeatedTimestamp(timestamp)) {
                        if (cmdWithoutTimestamp == "connected") {
                            Neopixel(GREEN);
                            connectionStatus = true;
                        } else if (cmdWithoutTimestamp.startsWith("moveDevice")) {
                            processMoveDeviceCommand(cmdWithoutTimestamp, timestamp);
                        } else if (cmdWithoutTimestamp.startsWith("homeDevice")) {
                            processHomeDeviceCommand(cmdWithoutTimestamp, timestamp);
                        }
                    }
                    updateTimestampBuffer(timestamp);
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
    String timestamp = generateTimestampWithSuffix();
    String messageToSend = "<STX>" + timestamp + "|" + message + "|" + calculateCRC(timestamp + "|" + message) + "<ETX>";

    Serial.flush();
    Serial.println(messageToSend);
    Serial.flush();

    // Store the sent message for potential retries
    if (sentMessageCount < 10) {  // Ensure we do not exceed the buffer size
        sentMessages[sentMessageCount++] = {timestamp, messageToSend, millis(), millis(), 0};
    }

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

String SerialController::getInitialTimestamp() const {
    return receivedInitialTimestamp;
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
    unsigned long receivedTimeMillis = getMillisFromTimestamp(receivedInitialTimestamp);
    unsigned long currentMillis = millis();

    // Calculate the elapsed time since the timestamp was synced
    unsigned long elapsedMillis = currentMillis - timestampMillisOffset;

    // Calculate the new current time by adding the elapsed time to the received timestamp
    unsigned long currentTimeMillis = receivedTimeMillis + elapsedMillis;
    currentTimeMillis %= (24UL * 3600UL * 1000UL);  // Ensure it wraps around correctly in a 24-hour format

    unsigned long currentHour = (currentTimeMillis / 3600000UL) % 24;
    unsigned long currentMinute = (currentTimeMillis / 60000UL) % 60;
    unsigned long currentSecond = (currentTimeMillis / 1000UL) % 60;
    unsigned long currentMillisOnly = currentTimeMillis % 1000;

    String yy = receivedInitialTimestamp.substring(0, 2);
    String mm = receivedInitialTimestamp.substring(2, 4);
    String dd = receivedInitialTimestamp.substring(4, 6);

    // Generate the timestamp string including seconds for better resolution
    char currentTimeStr[17];  // Adjust buffer size to accommodate new format
    snprintf(currentTimeStr, sizeof(currentTimeStr), "%s%s%s%02lu%02lu%02lu%03lu",
             yy.c_str(), mm.c_str(), dd.c_str(),
             currentHour, currentMinute, currentSecond, currentMillisOnly);

    // Debug: Print the final generated timestamp
    // Serial.print("Generated Timestamp: ");
    // Serial.println(currentTimeStr);

    return String(currentTimeStr);
}

String SerialController::generateTimestampWithSuffix() {
    String newTimestamp = getCurrentTime();

    // If the new timestamp is the same as the last one, increment the suffix
    if (newTimestamp == lastSentTimestamp) {
        // Increment the suffix (A-Z) and wrap around if needed
        timestampSuffix = (timestampSuffix == 'Z') ? 'A' : (timestampSuffix + 1);
    } else {
        // Reset the suffix and update the lastSentTimestamp
        timestampSuffix = 'A';
        lastSentTimestamp = newTimestamp;
    }

    return newTimestamp + timestampSuffix;
}