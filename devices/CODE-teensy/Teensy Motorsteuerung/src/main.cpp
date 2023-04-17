#include <Arduino.h>

const String alias = "Motorsteuerung_B"; // Replace with the unique alias for each Teensy
const int ledPin = 13;                   // Built-in LED pin on Teensy

void setup()
{
  // Initialize the serial communication with a baud rate of 115200
  Serial.begin(115200);
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

    // If the received command is "REQUEST_ALIAS", send the alias
    if (data == "REQUEST_ALIAS")
    {
      Serial.println(alias);
      // Blink the LED
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);
      delay(100);
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);
      delay(100);
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);
      delay(100);
    }
    else
    {
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

  // Add a delay to allow the Python script to read the alias properly
  delay(10);
}