// LimitSwitch.cpp
#include <LimitSwitch.h>
#include <MCP23017.h>
// https://curiousscientist.tech/blog/ping-pong-with-the-accelstepper-library-and-two-limit-switches-polling-and-interrupts

#define NUMBER_OF_SWITCHES 6

// const int switchPins[NUMBER_OF_SWITCHES] = {ES_1_PIN, ES_2_PIN, ES_3_PIN, ES_4_PIN, ES_5_PIN, ES_6_PIN};
// volatile boolean switchFlipped[NUMBER_OF_SWITCHES] = {false};  // Tracks flip status of each switch

void init_LimitSwitch() {
    mcp.pinMode(ES1_PIN, INPUT_PULLUP);
    mcp.pinMode(ES2_PIN, INPUT_PULLUP);
    mcp.pinMode(ES3_PIN, INPUT_PULLUP);
    mcp.pinMode(ES4_PIN, INPUT_PULLUP);
    mcp.pinMode(ES5_PIN, INPUT_PULLUP);
    mcp.pinMode(ES6_PIN, INPUT_PULLUP);
}

boolean check_limitSwitch(byte limitSwitchNumber) {
    if (limitSwitchNumber == 1) {
        limitSwitchNumber = ES1_PIN;
    } else if (limitSwitchNumber == 2) {
        limitSwitchNumber = ES2_PIN;
    } else if (limitSwitchNumber == 3) {
        limitSwitchNumber = ES4_PIN;
    } else if (limitSwitchNumber == 4) {
        limitSwitchNumber = ES4_PIN;
    } else if (limitSwitchNumber == 5) {
        limitSwitchNumber = ES5_PIN;
    } else if (limitSwitchNumber == 6) {
        limitSwitchNumber = ES6_PIN;
    }

    if (mcp.digitalRead(limitSwitchNumber) == HIGH) {
        return true;
    } else {
        return false;
    }
}

// Chrono objects for debouncing
Chrono chronoLimitSwitch;

void check_limitSwitches() {
    if (chronoLimitSwitch.hasPassed(200)) {  // Adjust debounce time as necessary
        chronoLimitSwitch.restart();

        if (mcp.digitalRead(ES1_PIN) == LOW) {
            Serial.println("Endstop 1 open");
        } else {
            Serial.println("Endstop 1 closed");
        }

        if (mcp.digitalRead(ES2_PIN) == LOW) {
            Serial.println("Endstop 2 open");
        } else {
            Serial.println("Endstop 2 closed");
        }

        if (mcp.digitalRead(ES3_PIN) == LOW) {
            Serial.println("Endstop 3 open");
        } else {
            Serial.println("Endstop 3 closed");
        }

        if (mcp.digitalRead(ES4_PIN) == LOW) {
            Serial.println("Endstop 4 open");
        } else {
            Serial.println("Endstop 4 closed");
        }

        if (mcp.digitalRead(ES5_PIN) == LOW) {
            Serial.println("Endstop 5 open");
        } else {
            Serial.println("Endstop 5 closed");
        }

        if (mcp.digitalRead(ES6_PIN) == LOW) {
            Serial.println("Endstop 6 open");
        } else {
            Serial.println("Endstop 6 closed");
        }

        Serial.println();
    }
}

void init_doorSensor() {
    mcp.pinMode(DES1_PIN, INPUT_PULLUP);
    mcp.pinMode(DES2_PIN, INPUT_PULLUP);
}

Chrono chronoDoorSensors;

void check_doorSensor() {
    if (chronoDoorSensors.hasPassed(500)) {
        chronoDoorSensors.restart();
        // Example door sensor checking logic
        // Adjust according to your specific hardware setup and requirements
        if (mcp.digitalRead(DES1_PIN) == LOW) {
            Serial.println("Door 1 open.");
        }
        if (mcp.digitalRead(DES1_PIN) == HIGH) {
            Serial.println("Door 1 closed.");
        }
        if (mcp.digitalRead(DES2_PIN) == LOW) {
            Serial.println("Door 2 open.");
        }
        if (mcp.digitalRead(DES2_PIN) == HIGH) {
            Serial.println("Door 2 closed.");
        }
    }
}
