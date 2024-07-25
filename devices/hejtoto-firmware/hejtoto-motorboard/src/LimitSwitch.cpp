// LimitSwitch.cpp
#include <LimitSwitch.h>
#include <MCP23017.h>
// https://curiousscientist.tech/blog/ping-pong-with-the-accelstepper-library-and-two-limit-switches-polling-and-interrupts

#define NUMBER_OF_SWITCHES 6

const int switchPins[NUMBER_OF_SWITCHES] = {ES_1_PIN, ES_2_PIN, ES_3_PIN, ES_4_PIN, ES_5_PIN, ES_6_PIN};
volatile boolean switchFlipped[NUMBER_OF_SWITCHES] = {false}; // Tracks flip status of each switch

void flipDirection(int switchId)
{
    switchFlipped[switchId] = true; // Mark the switch as flipped
}

void ISR_Switch1() { flipDirection(0); }
void ISR_Switch2() { flipDirection(1); }
void ISR_Switch3() { flipDirection(2); }
void ISR_Switch4() { flipDirection(3); }
void ISR_Switch5() { flipDirection(4); }
void ISR_Switch6() { flipDirection(5); }

void init_LimitSwitch()
{
    mcp.pinMode(ES1_PIN, INPUT_PULLUP);
    mcp.pinMode(ES2_PIN, INPUT_PULLUP);
    mcp.pinMode(ES3_PIN, INPUT_PULLUP);
    mcp.pinMode(ES4_PIN, INPUT_PULLUP);
    mcp.pinMode(ES5_PIN, INPUT_PULLUP);
    mcp.pinMode(ES6_PIN, INPUT_PULLUP);
}

boolean check_limitSwitch(byte limitSwitchNumber)
{
    if (limitSwitchNumber >= NUMBER_OF_SWITCHES)
    {
        return false; // Invalid switch number
    }

    if (switchFlipped[limitSwitchNumber])
    {
        switchFlipped[limitSwitchNumber] = false; // Reset the flag
        return true;                              // Switch was flipped
    }

    return false; // Switch was not flipped
}

Chrono chronoLimitSwitch;

void check_limitSwitch1()
{
    if (chronoLimitSwitch.hasPassed(500))
    {
        chronoLimitSwitch.restart();
        // Example door sensor checking logic
        // Adjust according to your specific hardware setup and requirements
        if (digitalRead(ES_1_PIN) == LOW)
        {
            Serial.println("ES_1_PIN 1 open.");
        }
        if (digitalRead(ES_1_PIN) == HIGH)
        {
            Serial.println("ES_1_PIN 1 closed.");
        }
    }
}

void init_doorSensor()
{
    mcp.pinMode(DES1_PIN, INPUT_PULLUP);
    mcp.pinMode(DES2_PIN, INPUT_PULLUP);
}

Chrono chronoDoorSensors;

void check_doorSensor()
{
    if (chronoDoorSensors.hasPassed(500))
    {
        chronoDoorSensors.restart();
        // Example door sensor checking logic
        // Adjust according to your specific hardware setup and requirements
        if (mcp.digitalRead(DES1_PIN) == LOW)
        {
            Serial.println("Door 1 open.");
        }
        if (mcp.digitalRead(DES1_PIN) == HIGH)
        {
            Serial.println("Door 1 closed.");
        }
        if (mcp.digitalRead(DES2_PIN) == LOW)
        {
            Serial.println("Door 2 open.");
        }
        if (mcp.digitalRead(DES2_PIN) == HIGH)
        {
            Serial.println("Door 2 closed.");
        }
    }
}
