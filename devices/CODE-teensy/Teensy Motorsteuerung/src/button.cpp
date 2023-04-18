#include <button.h>

const byte buttonPin = 14;

const int debounceValue = 250;            // millis
const int timeButtonMediumPressed = 1750; // millis
const int timeButtonLongPressed = 2500;   // millis

struct Button
{
    const uint8_t PIN;

    // variables to keep track of the timing of recent interrupts
    bool released = false;
    unsigned long buttonTime = 0;
    unsigned long lastButtonTime = 0;
    unsigned long buttonStartTime = 0;
    unsigned long duration;
    bool toogled = false;
    uint32_t counter = 0;
};

Button button1 = {buttonPin};

void setupButton()
{
    pinMode(button1.PIN, INPUT);
    button1.counter = 0;
}

bool watcherButtonPressed()
{
    if (button1.released == true)
    {
        // Serial.printf("Button counter: %u \n", button1.counter);

        button1.released = false;

        // Ausführen:
        // chronoHeaterOszillieren.restart(); // Ozillierintervallzeit resetten

        return true;
    }
    else // keep possible buttonStartTime up to Date
    {
        if (digitalRead(buttonPin) == false) // Button nicht gedrückt
        {
            {
                button1.buttonStartTime = millis();
            }
        }
        return false;
    }
}