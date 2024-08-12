// SerialController.h
#ifndef SerialController_h
#define SerialController_h

#include <_global.h>

class SerialController {
   private:
    const String alias;
    bool connectionStatus;
    unsigned long lastReceivedMessage;
    const unsigned long connectionTimeout;

    void handleReceivedMessage(const String &message);

   public:
    SerialController(const String &alias);
    void begin(uint32_t baudRate);
    void update();
    bool isConnected();
};

#endif