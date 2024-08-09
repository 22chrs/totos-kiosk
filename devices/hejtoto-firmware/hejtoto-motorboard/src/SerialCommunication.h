// // SerialController.h
// #ifndef SerialCommunication_h
// #define SerialCommunication_h

// #include <Arduino.h>

// class SerialController {
//    private:
//     const String alias;
//     bool connectionStatus;
//     unsigned long lastReceivedMessage;
//     const unsigned long connectionTimeout;

//     void handleReceivedMessage(const String &message);

//    public:
//     SerialController(const String &alias);
//     void begin(uint32_t baudRate);
//     void update();
//     bool isConnected();
// };

// #endif