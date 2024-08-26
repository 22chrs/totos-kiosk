#ifndef SERIALCONTROLLER_H
#define SERIALCONTROLLER_H

#include <_global.h>

class SerialController {
   private:
    String alias;
    boolean connectionStatus;
    unsigned long lastReceivedMessage;
    const unsigned long connectionTimeout;

    // Variables to store the timestamp and millis offset
    String receivedTimestamp;
    unsigned long timestampMillisOffset;

    // Variables to handle timestamp suffix logic
    String lastSentTimestamp;  // Last sent timestamp
    char timestampSuffix;      // Suffix to append to the timestamp
    void sendAckMessage(const String &timestamp);
    void handleReceivedMessage(const String &message);
    void processHomeDeviceCommand(const String &message, const String &timestamp);
    void processMoveDeviceCommand(const String &message, const String &timestamp);
    boolean isValidMessage(const String &message);
    String calculateCRC(const String &message);
    unsigned long getMillisFromTimestamp(const String &timestamp);

    String generateTimestampWithSuffix();  // Method to generate a timestamp with a suffix

   public:
    SerialController();
    void sendMessage(const String &message);
    void setAlias(const String &alias);
    void begin(uint32_t baudRate);
    void update();
    boolean isConnected();
    String getReceivedTimestamp() const;             // Method to get the received timestamp
    unsigned long getTimestampMillisOffset() const;  // Method to get the millis offset
    String getCurrentTime();                         // Method to calculate the current exact time
};

extern SerialController serialController;

#endif