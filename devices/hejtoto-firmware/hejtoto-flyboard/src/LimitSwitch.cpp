// LimitSwitch.cpp

#include <LimitSwitch.h> // Ensure Arduino.h is included for pinMode, digitalWrite, etc.

volatile boolean switchFlipped = false; // Tracks flip status of the switch

void flipDirection()
{
    switchFlipped = true; // Mark the switch as flipped
}

void ISR_Switch() { flipDirection(); }

void init_LimitSwitch()
{
    pinMode(ES_PIN, INPUT_PULLUP);                                       // Initialize the switch pin as input with pull-up
    attachInterrupt(digitalPinToInterrupt(ES_PIN), ISR_Switch, FALLING); // Attach interrupt
}

boolean check_limitSwitch()
{
    if (switchFlipped)
    {
        switchFlipped = false; // Reset the flip status after checking
        return true;
    }
    return false;
}
