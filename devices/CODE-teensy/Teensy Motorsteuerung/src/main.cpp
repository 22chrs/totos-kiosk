#include <Arduino.h>

const String alias = "Motorsteuerung_A"; // Replace with the unique alias for each Teensy

void setup()
{
  // Initialize the serial communication with a baud rate of 9600
  Serial.begin(9600);
  // Send the alias after the connection is established
  Serial.println(alias);
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

    // Send a response back to the Python script
    String response = "Hello from " + data + "!";
    Serial.println(response);
  }
}
