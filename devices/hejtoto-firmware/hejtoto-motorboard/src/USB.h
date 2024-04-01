// SerialController.h
#ifndef USB_H
#define USB_H

#include <Arduino.h>
#include <Led.h>
#include <BoardSelect.h>

class SerialController
{
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

void init_USB();
void check_USB();

#endif
