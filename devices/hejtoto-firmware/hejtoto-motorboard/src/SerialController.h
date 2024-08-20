// SerialController.h
#ifndef SerialController_h
#define SerialController_h

#include <_global.h>

class SerialController {
   private:
    String alias;
    bool connectionStatus;
    unsigned long lastReceivedMessage;
    const unsigned long connectionTimeout;

    void handleReceivedMessage(const String &message);

   public:
    SerialController();
    void setAlias(const String &alias);
    void begin(uint32_t baudRate);
    void update();
    bool isConnected();
};

#endif