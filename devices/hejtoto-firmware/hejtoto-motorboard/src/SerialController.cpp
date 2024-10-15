#include "SerialController.h"

#include <Led.h>
#include <Movements.h>

SerialController serialController;

SerialController::SerialController()
    : alias("Unknown"),
      connectionStatus(false),
      lastReceivedMessage(0),
      connectionTimeout(40),
      receivedInitialTimestamp("0"),
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

    static char buffer[1024];
    static size_t index = 0;
    const size_t MAX_BUFFER_SIZE = sizeof(buffer);  // Set buffer limit

    while (Serial.available() > 0) {
        char incomingChar = Serial.read();

        // Check for buffer overflow before adding new data
        if (index >= MAX_BUFFER_SIZE - 1) {
            index = 0;  // Reset the index (or handle overflow in another way)
            Serial.println("Warning: Buffer overflow. Clearing buffer.");
        }

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
        if (currentMillis - sentMessages[i].lastRetryTime >= 150) {
            // Retry sending the message

            Serial.flush();

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
    String messageTimestamp = generateTimestampWithSuffix();

    // Add STX, ETX, and CRC to the acknowledgment message
    String messageToSend = "<STX>" + messageTimestamp + "|" + ackMessage + "|" + calculateCRC(messageTimestamp + "|" + ackMessage) + "<ETX>";

    // Ensure the serial buffer is clear before sending a new message
    Serial.flush();
    Serial.println(messageToSend);
    Serial.flush();

    // Do not store ACK messages for retries
    // We do not store ACK messages in sentMessages because ACKs are not acknowledged
}

void SerialController::processStatusMessage(const String &message) {
    String statusType = message.substring(0, message.indexOf(':'));
    String originalTimestamp = message.substring(message.indexOf(':') + 1);

    // // Log or handle the status message as needed
    // Serial.print("Received ");
    // Serial.print(statusType);
    // Serial.print(" for timestamp ");
    // Serial.println(originalTimestamp);

    // Optionally, you can remove the original command from any pending lists if necessary
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
                    ackedTimestamp.trim();

                    // Remove the acknowledged message from the retry list
                    bool found = false;
                    for (int i = 0; i < sentMessageCount; ++i) {
                        if (sentMessages[i].timestamp == ackedTimestamp) {
                            // Message found; remove it from the list
                            for (int j = i; j < sentMessageCount - 1; ++j) {
                                sentMessages[j] = sentMessages[j + 1];
                            }
                            --sentMessageCount;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        Serial.println("ACK received for unknown timestamp: " + ackedTimestamp);
                    }

                } else {
                    if (cmdWithoutTimestamp == "REQUEST_ALIAS") {
                        receivedInitialTimestamp = timestamp;
                        timestampMillisOffset = millis();
                        sendMessage(alias);
                    } else {
                        // Send ACK for any message that is not an ACK itself
                        sendAckMessage(timestamp);

                        if (!isRepeatedTimestamp(timestamp)) {
                            if (cmdWithoutTimestamp == "connected") {
                                Serial.println(Version);
                                Neopixel(GREEN);
                                connectionStatus = true;
                            } else if (cmdWithoutTimestamp.startsWith("fireLED")) {
                                processGeneralCommand(cmdWithoutTimestamp, timestamp);
                            } else if (cmdWithoutTimestamp.startsWith("moveDevice")) {
                                processMoveDeviceCommand(cmdWithoutTimestamp, timestamp);
                            } else if (cmdWithoutTimestamp.startsWith("homeDevice")) {
                                processHomeDeviceCommand(cmdWithoutTimestamp, timestamp);
                            } else if (cmdWithoutTimestamp.startsWith("SUCCESS:") || cmdWithoutTimestamp.startsWith("FAIL:")) {
                                processStatusMessage(cmdWithoutTimestamp);
                            }
                        }
                        updateTimestampBuffer(timestamp);
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

void SerialController::processHomeDeviceCommand(const String &message, const String &timestamp) {
    // Extract the stepper name from the command using single quotes
    int firstQuote = message.indexOf('\'');
    int secondQuote = message.indexOf('\'', firstQuote + 1);
    String stepperName = message.substring(firstQuote + 1, secondQuote);

    // Call the homeDevice function with the extracted stepperName
    homeDevice(stepperName, timestamp);

    // Send an acknowledgment message after processing
    // sendAckMessage(timestamp);
}

void SerialController::processMoveDeviceCommand(const String &message, const String &timestamp) {
    // Serial.println("Message: " + message);

    int startParen = message.indexOf('(');
    int endParen = message.indexOf(')', startParen);

    if (startParen == -1 || endParen == -1) {
        Serial.println("Invalid message format: Missing parentheses.");
        return;
    }

    String argsString = message.substring(startParen + 1, endParen);

    const int expectedArgs = 5;
    String args[expectedArgs];
    int currentPos = 0;
    int argIndex = 0;

    while (argIndex < expectedArgs) {
        int commaPos = argsString.indexOf(',', currentPos);
        if (commaPos == -1 && argIndex < expectedArgs - 1) {
            Serial.println("Invalid message format: Not enough arguments.");
            return;
        }
        String arg;
        if (commaPos != -1) {
            arg = argsString.substring(currentPos, commaPos);
            currentPos = commaPos + 1;  // Move past the comma for the next iteration
        } else {
            arg = argsString.substring(currentPos);  // Last argument
        }
        arg.trim();
        if (arg.startsWith("'") && arg.endsWith("'")) {
            arg = arg.substring(1, arg.length() - 1);
        } else {
            Serial.println("Invalid argument format: Missing quotes.");
            return;
        }

        args[argIndex++] = arg;
    }

    String stepperName = args[0];
    double position = args[1].toFloat();
    int maxSpeedPercentage = args[2].toInt();
    int driveCurrentPercentage = args[3].toInt();
    double ringPercentage = args[4].toFloat();

    // // Optional: Confirm the action
    // Serial.print("Moved device ");
    // Serial.print(stepperName);
    // Serial.print(" to position ");
    // Serial.print(position);
    // Serial.print(" with max speed ");
    // Serial.print(maxSpeedPercentage);
    // Serial.print("%, drive current ");
    // Serial.print(driveCurrentPercentage);
    // Serial.print("%, ring percentage ");
    // Serial.print(ringPercentage);
    // Serial.println("%.");

    moveDevice(stepperName, position, maxSpeedPercentage, driveCurrentPercentage, ringPercentage, timestamp);
}

void SerialController::processGeneralCommand(const String &message, const String &timestamp) {
    // int secondQuote = message.indexOf('"', firstQuote + 1);
    // String stepperName = message.substring(firstQuote + 1, secondQuote);

    // int firstComma = message.indexOf(',', secondQuote);
    // int secondComma = message.indexOf(',', firstComma + 1);
    // int thirdComma = message.indexOf(',', secondComma + 1);
    // int fourthComma = message.indexOf(',', thirdComma + 1);

    // float position = message.substring(firstComma + 1, secondComma).toFloat();
    // int maxSpeedPercentage = message.substring(secondComma + 1, thirdComma).toInt();
    // int driveCurrentPercentage = message.substring(thirdComma + 1, fourthComma).toInt();  // Update to extract the correct substring
    // int ringPercentage = message.substring(fourthComma + 1).toInt();                      // Extract the ringPercentage

    boolean hatGeklappt = fireLED();
    if (hatGeklappt == true) {
        sendMessage("SUCCESS:" + timestamp);
    } else if (hatGeklappt == false) {
        sendMessage("FAIL:" + timestamp);
    }
}

String SerialController::sendMessage(const String &message) {
    String messageTimestamp = generateTimestampWithSuffix();  // Use a distinct variable name
    String messageToSend = "<STX>" + messageTimestamp + "|" + message + "|" + calculateCRC(messageTimestamp + "|" + message) + "<ETX>";

    Serial.flush();
    Serial.println(messageToSend);
    Serial.flush();

    // Store the sent message for potential retries
    if (sentMessageCount < 10) {  // Ensure we do not exceed the buffer size
        sentMessages[sentMessageCount++] = {messageTimestamp, messageToSend, millis(), millis(), 0};
    } else {
        Serial.println("Sent message buffer is full. Cannot store more messages.");
    }

    return messageTimestamp;
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

void SerialController::delayButListen(unsigned long delayTime) {
    unsigned long startTime = millis();

    // Continue until the full delay time has passed
    while (millis() - startTime < delayTime) {
        // Update the serial controller (handling serial communication)
        serialController.update(BaudRateSerial);

        // Small non-blocking delay to avoid overwhelming the CPU
        delay(5);
    }
}
