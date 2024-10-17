
#include <RS485.h>

// Initialize SoftwareSerial for RS485

SoftwareSerial rs485Serial(RS485_RX, RS485_TX);

void init_RS485() {
    // Start the hardware serial (for debugging via USB)

    // Start the SoftwareSerial for RS485 communication
    rs485Serial.begin(9600);  // Set baud rate to match RS485 communication rate
}

void loop_RS485() {
    // Sending data to the RS485 line
    String message = "Loopback Test!";
    rs485Serial.write(message.c_str());
    Serial.println("Data sent: " + message);

    delay(100);  // Allow some time for data to loop back

    // Checking for received data (loopback)
    if (rs485Serial.available()) {
        String receivedData = "";
        while (rs485Serial.available()) {
            char c = rs485Serial.read();
            receivedData += c;
        }
        Serial.print("Received data: ");
        Serial.println(receivedData);

        // Check if the received data matches what was sent
        if (receivedData == message) {
            Serial.println("Loopback test successful!");
        } else {
            Serial.println("Loopback test failed!");
        }
    }

    delay(1000);  // Send the next message after 1 second
}