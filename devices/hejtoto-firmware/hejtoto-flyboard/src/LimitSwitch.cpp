// LimitSwitch.cpp

#include <LimitSwitch.h> // Ensure Arduino.h is included for pinMode, digitalWrite, etc.

void init_LimitSwitch()
{
    pinMode(ES_PIN, INPUT_PULLUP); // Initialize the switch pin as input with pull-up
                                   // attachInterrupt(digitalPinToInterrupt(ES_PIN), ISR_Switch, FALLING); // Attach interrupt
}

boolean check_limitSwitch()
{
    if (digitalRead(ES_PIN) == true)
    {
        Serial.println("CLOSED");
        return true;
    }
    if (digitalRead(ES_PIN) == false)
    {
        Serial.println("OPEN");
        return false;
    }
}
