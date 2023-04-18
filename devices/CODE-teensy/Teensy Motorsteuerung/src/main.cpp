#include <Arduino.h>
#include <_global.h>
#include <oled.h>
#include <led.h>

const String alias = "Motorsteuerung_B";      // Replace with the unique alias for each Teensy
const int ledPin = 13;                        // Built-in LED pin on Teensy
const unsigned long connectionTimeout = 5000; // Timeout in milliseconds to consider the device disconnected

unsigned long lastHeartbeatTime = 0;

void setup()
{
  // Initialize the serial communication with a baud rate of 115200
  Serial.begin(115200);
  // Set the LED pin as an output
  pinMode(ledPin, OUTPUT);
  setupNeoPixel();
  // Set the NeoPixel LED 0 to red (not connected)
  Colorieren(0, 255, 0, 0, 0);
}

void loop()
{
  // Check if data is available in the serial buffer
  if (Serial.available() > 0)
  {
    // Read the incoming data
    String data = Serial.readStringUntil('\n');
    lastHeartbeatTime = millis(); // Update the last heartbeat time

    // If the received command is "REQUEST_ALIAS", send the alias
    if (data == "REQUEST_ALIAS")
    {
      Serial.println(alias);
      // Add a delay to allow the Python script to read the alias properly
      delay(10);
      // Set the NeoPixel LED 0 to yellow (sent alias)
      Colorieren(0, 255, 255, 0, 0);
    }
    else if (data == "connected")
    {
      // Set the NeoPixel LED 0 to green (received "connected" message)
      Colorieren(0, 0, 255, 0, 0);
    }
    else
    {
      // Print the received data to the Teensy's serial monitor
      Serial.print("Received data: ");
      Serial.println(data);

      // Update the OLED message
      updateOledMessage(data);
      oledPrint(false); // Update the OLED display

      // Blink the LED
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);

      // Send a response back to the Python script
      String response = "ACK:" + alias;
      Serial.println(response);
    }
  }

  // Check for connection timeout
  if (millis() - lastHeartbeatTime > connectionTimeout)
  {
    // Set the NeoPixel LED 0 to red (not connected)
    Colorieren(0, 255, 0, 0, 0);
  }
}
