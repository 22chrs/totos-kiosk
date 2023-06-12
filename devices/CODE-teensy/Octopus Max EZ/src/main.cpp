#include <Arduino.h>

void setup()
{
  // Start the serial communication with the PC
  Serial.begin(250000);

  // Wait for the serial port to connect - needed for Leonardo only
  while (!Serial)
  {
    ;
  }

  // Print "Hello World!" to the serial monitor
  Serial.println("Hello World!");
}

void loop()
{
  // put your main code here, to run repeatedly:
}
