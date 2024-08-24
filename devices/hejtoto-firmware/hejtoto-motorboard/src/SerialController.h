#ifndef SERIALCONTROLLER_H
#define SERIALCONTROLLER_H

#include <Arduino.h>

class SerialController {
   private:
    String alias;
    bool connectionStatus;
    unsigned long lastReceivedMessage;
    const unsigned long connectionTimeout;

    void handleReceivedMessage(const String &message);
    bool processMoveDeviceCommand(const String &message);
    void sendMessage(const String &message);
    bool isValidMessage(const String &message);
    String calculateCRC(const String &message);

   public:
    SerialController();
    void setAlias(const String &alias);
    void begin(uint32_t baudRate);
    void update();
    bool isConnected();
};

#endif