#ifndef SERIALCONTROLLER_H
#define SERIALCONTROLLER_H

#include <_global.h>

class SerialController {
   private:
    String alias;
    bool connectionStatus;
    unsigned long lastReceivedMessage;
    const unsigned long connectionTimeout;

    // Variables to store the timestamp and millis offset
    String receivedTimestamp;
    unsigned long timestampMillisOffset;

    void handleReceivedMessage(const String &message);
    bool processMoveDeviceCommand(const String &message);
    void sendMessage(const String &message);
    bool isValidMessage(const String &message);
    String calculateCRC(const String &message);
    unsigned long getMillisFromTimestamp(const String &timestamp);

   public:
    SerialController();
    void setAlias(const String &alias);
    void begin(uint32_t baudRate);
    void update();
    bool isConnected();
    String getReceivedTimestamp() const;             // Method to get the received timestamp
    unsigned long getTimestampMillisOffset() const;  // Method to get the millis offset
    String getCurrentTime();                         // Method to calculate the current exact time
};

#endif