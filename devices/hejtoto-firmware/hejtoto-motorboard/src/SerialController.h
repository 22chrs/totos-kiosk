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
    String receivedInitialTimestamp;
    unsigned long timestampMillisOffset;

    // Variables to handle timestamp suffix logic
    String lastSentTimestamp;  // Last sent timestamp
    char timestampSuffix;      // Suffix to append to the timestamp

    // Buffer to store the last 20 timestamps
    String lastTimestamps[20];  // Array to store the last 20 timestamps
    int timestampIndex = 0;     // Index to keep track of the current position in the buffer

    // Data structure to store sent messages for retry mechanism
    struct SentMessage {
        String timestamp;
        String message;
        unsigned long sentTime;
        unsigned long lastRetryTime;
        int retryCount;
    };

    SentMessage sentMessages[10];     // Buffer to store up to 10 sent messages
    int sentMessageCount = 0;         // Count of currently stored messages
    unsigned long ackTimeout = 5000;  // Timeout in milliseconds for ACK

    // Private methods for internal operations
    void handleReceivedMessage(const String &message);
    void processGeneralCommand(const String &message, const String &timestamp);
    void processHomeDeviceCommand(const String &message, const String &timestamp);
    void processMoveDeviceCommand(const String &message, const String &timestamp);
    boolean isValidMessage(const String &message);
    String calculateCRC(const String &message);
    unsigned long getMillisFromTimestamp(const String &timestamp);
    String generateTimestampWithSuffix();  // Method to generate a timestamp with a suffix
    void checkForAckTimeouts();            // Method to check for ACK timeouts and resend messages

    // Methods to check and update the timestamp buffer
    bool isRepeatedTimestamp(const String &timestamp);    // Method to check if a timestamp is repeated
    void updateTimestampBuffer(const String &timestamp);  // Method to update the timestamp buffer

   public:
    SerialController();
    String sendMessage(const String &message);
    void sendAckMessage(const String &timestamp);
    void setAlias(const String &alias);
    void begin(uint32_t baudRate);
    void update(uint32_t baudRate);
    boolean isConnected();
    String getInitialTimestamp() const;              // Method to get the received timestamp
    unsigned long getTimestampMillisOffset() const;  // Method to get the millis offset
    String getCurrentTime();                         // Method to calculate the current exact time
};

extern SerialController serialController;

#endif