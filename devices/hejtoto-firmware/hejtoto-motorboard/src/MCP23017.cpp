// MCP23017.cpp

#include <MCP23017.h>

void init_MCP23017() {
    unsigned long startTime = millis();  // Record the start time

    while (!mcp.begin_I2C(0x20))  // A0, A1, A2 = GND
    {
        if (millis() - startTime >= 3000) {  // Check if 3 seconds have passed
            Serial.println("Error: MCP23017 timeout");
            return;  // Exit the function after timeout
        }
    }
    // Serial.println("MCP23017 initialized successfully");
}