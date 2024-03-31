

#include <_global.h>
#include <MCP23017.h>
#include <BoardSelect.h>
#include <Stepper.h>

void setup()
{
  Serial.begin(9600);    // Start serial communication at 9600 baud
  Wire.begin();          // Initialize I2C
  init_MCP23017();       // Initialize pins of MCP23017 I/O Expander
  init_BoardSelect();    // Check which board this code runs on
  init_StepperDrivers(); // Initialize all 6 stepper motors
}

void loop()
{
  // put your main code here, to run repeatedly:
}
