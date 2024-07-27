#include <Arduino.h>
#include <TMC2209.h>

// This example will not work on Arduino boards without HardwareSerial ports,
// such as the Uno, Nano, and Mini.
//
// See this reference for more details:
// https://www.arduino.cc/reference/en/language/functions/communication/serial/

HardwareSerial& serial_stream_1 = Serial1;
HardwareSerial& serial_stream_2 = Serial2;

const long SERIAL_BAUD_RATE = 115200;
const int DELAY = 3000;

// Instantiate TMC2209
TMC2209 stepper_driver_1;
TMC2209 stepper_driver_2;

void setup() {
    Serial.begin(SERIAL_BAUD_RATE);

    stepper_driver_1.setup(serial_stream_1);
    stepper_driver_2.setup(serial_stream_2);
}

void loop() {
    if (stepper_driver_1.isSetupAndCommunicating()) {
        Serial.println("Stepper 1 driver is setup and communicating!");
        Serial.println("Try turning driver power off to see what happens.");
    } else if (stepper_driver_1.isCommunicatingButNotSetup()) {
        Serial.println("Stepper 1 driver is communicating but not setup!");
        Serial.println("Running setup again...");
        stepper_driver_1.setup(serial_stream_1);
    } else {
        Serial.println("Stepper 1 driver is not communicating!");
        Serial.println("Try turning driver power on to see what happens.");
    }

    if (stepper_driver_2.isSetupAndCommunicating()) {
        Serial.println("Stepper 2 driver is setup and communicating!");
        Serial.println("Try turning driver power off to see what happens.");
    } else if (stepper_driver_2.isCommunicatingButNotSetup()) {
        Serial.println("Stepper 2 driver is communicating but not setup!");
        Serial.println("Running setup again...");
        stepper_driver_2.setup(serial_stream_2);
    } else {
        Serial.println("Stepper 2 driver is not communicating!");
        Serial.println("Try turning driver power on to see what happens.");
    }
    Serial.println();
    delay(DELAY);
}