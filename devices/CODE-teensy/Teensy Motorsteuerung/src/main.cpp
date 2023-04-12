#include <Arduino.h>

const String alias = "Motorsteuerung_A"; // Replace with the unique alias for each Teensy
const int ledPin = 13;                   // Built-in LED pin on Teensy

void setup()
{
  // Initialize the serial communication with a baud rate of 9600
  Serial.begin(9600);
  // Send the alias after the connection is established
  Serial.println(alias);
  // Set the LED pin as an output
  pinMode(ledPin, OUTPUT);
}

void loop()
{
  // Check if data is available in the serial buffer
  if (Serial.available() > 0)
  {
    // Read the incoming data
    String data = Serial.readStringUntil('\n');

    // Print the received data to the Teensy's serial monitor
    Serial.print("Received data: ");
    Serial.println(data);

    // Blink the LED
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);

    // Send a response back to the Python script
    String response = "ACK:" + alias;
    Serial.println(response);
  }
}
