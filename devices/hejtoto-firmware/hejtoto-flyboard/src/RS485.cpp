
#include <RS485.h>

// Initialize SoftwareSerial for RS485 communication
SoftwareSerial rs485Serial(RS485_RX, RS485_TX);

// Define response message
const char* RESPONSE_MESSAGE = "Hello rs485 port from ash";

// Define interval for periodic sending (in milliseconds)
const unsigned long SEND_INTERVAL = 5000;  // 5 seconds

// Variable to track the last send time
unsigned long lastSendTime = 0;

// Function to initialize RS485 communication
void init_RS485() {
    // Start the hardware serial for debugging via USB
    Serial.begin(9600);
    while (!Serial) {
        ;  // Wait for Serial to be ready (only necessary for some boards)
    }
    Serial.println("Initializing RS485 communication...");

    // Start the SoftwareSerial for RS485 communication
    rs485Serial.begin(9600);  // Ensure baud rate matches Python script
    Serial.println("RS485 communication started.");
}

// Function to send a message over RS485
void sendRS485Message(const char* message) {
    // Send the message
    rs485Serial.write(message);
    Serial.print("Sent RS485 message: ");
    Serial.println(message);
}

// Function to listen for incoming RS485 messages
void listenRS485() {
    // Check if data is available
    if (rs485Serial.available()) {
        String receivedData = "";
        // Read all available bytes
        while (rs485Serial.available()) {
            char c = rs485Serial.read();
            receivedData += c;
            delay(1);  // Small delay to ensure all data is received
        }
        // Print the received data to Serial Monitor
        Serial.print("Received: ");
        Serial.println(receivedData);

        // Optionally, send a response back
        // sendRS485Message(RESPONSE_MESSAGE);
    }
}

// Main loop function runs repeatedly
void loop_RS485() {
    // Listen for incoming RS485 messages
    listenRS485();

    // Handle periodic sending
    unsigned long currentMillis = millis();
    if (currentMillis - lastSendTime >= SEND_INTERVAL) {
        // Time to send a periodic message
        const char* periodicMessage = "Periodic Message from Arduino";
        sendRS485Message(periodicMessage);
        lastSendTime = currentMillis;
    }

    // Small delay to prevent overwhelming the CPU
    delay(10);
}