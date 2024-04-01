// MCP23017.cpp

#include <MCP23017.h>

void init_MCP23017()
{
    if (!mcp.begin_I2C(0x20)) // A0,A1,A2=GND
    {
        Serial.println("Error: MCP23017");
        while (1)
            ;
    }
}
