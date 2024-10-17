// LimitSwitch.cpp

#include <LimitSwitch.h>  // Ensure Arduino.h is included for pinMode, digitalWrite, etc.

unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 100;  // the minimum delay in milliseconds to check for bouncing of the switch. Increase this slighlty if you switches tend to bounce a lot
bool buttonStateChangeDetected = false;
byte limitSwitchState = 0;
byte oldConfirmedLimitSwitchState = 0;

void limitSwitchHandler() {
    limitSwitchState = digitalRead(ES_PIN);
    lastDebounceTime = millis();
}

void init_LimitSwitch() {
    pinMode(ES_PIN, INPUT_PULLUP);  // Initialize the switch pin as input with pull-up
                                    // attachInterrupt(digitalPinToInterrupt(ES_PIN), ISR_Switch, FALLING); // Attach interrupt
    attachInterrupt(digitalPinToInterrupt(ES_PIN), limitSwitchHandler, CHANGE);
}

boolean check_limitSwitch() {
    if (digitalRead(ES_PIN) == true) {
        Serial.println("CLOSED");
        Neopixel(RED);
        return true;
    }
    if (digitalRead(ES_PIN) == false) {
        Serial.println("OPEN");
        Neopixel(GREEN);
        return false;
    }
}

void loop_endstopDetected() {
    if (limitSwitchState != oldConfirmedLimitSwitchState && (millis() - lastDebounceTime) > debounceDelay) {
        oldConfirmedLimitSwitchState = limitSwitchState;
        // Serial.printf("Limit switch change detected. New state is %i\n", limitSwitchState);
        //  active high switch configuration (NC connection with internal pull up)
        if (limitSwitchState == HIGH) {
            stepper.setLimitSwitchActive(stepper.LIMIT_SWITCH_COMBINED_BEGIN_AND_END);  // this will cause to stop any motion that is currently going on and block further movement in the same direction as long as the switch is agtive
        } else {
            stepper.clearLimitSwitchActive();  // clear the limit switch flag to allow movement in both directions again
        }
    }
}