#include <Arduino.h>
#include <oled.h>
#include <led.h>

#include "SerialController.h"
SerialController serialController("Motorsteuerung_B");

const int ledPin = 13; // Built-in LED pin on Teensy

void setup()
{
  // Initialize the serial communication with a baud rate of 115200

  serialController.begin(115200);
  // Set the LED pin as an output
  pinMode(ledPin, OUTPUT);
  setupOled();
}

void loop()
{
  serialController.update();
  if (serialController.isConnected())
  {
    digitalWrite(ledPin, HIGH);
  }
  else
  {
    digitalWrite(ledPin, LOW);
  }
}
// sendOledMessage(data);
