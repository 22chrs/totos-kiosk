// LED, NEOPIXEL
#include "led.h"

// Global variable to store connection status
bool connected = false;

const int neoPixelCount = 3;
const int neoPixelPin = 26;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(neoPixelCount, neoPixelPin, NEO_GRBW + NEO_KHZ800);

const int standardPatternInterval = 20; // time between steps in the patternconst

unsigned long lastUpdate = 0; // for millis() when last update occoured

const uint16_t gedimmt = 20;
const uint16_t maxHelligkeit = 25;

Chrono chronoTimerOff;

// LED build in
void setupLED()
{
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH); // HIGH = off
}

// Neopixel
void setupNeoPixel()
{
    strip.begin();
    strip.setBrightness(maxHelligkeit);
    strip.clear();
    delay(5);
    strip.show(); // Initialize all pixels to 'off'
}

void Colorieren(uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w)
{

    strip.setPixelColor(pixel, r, g, b, w);

    strip.show();
}

void Blinken(uint32_t intervall, uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w) // d = 0 -> unendlich
{
    static uint16_t j = 0;
    if (millis() - lastUpdate > standardPatternInterval) // no delay, aber periodisch wiederholen
    {
        // Serial.println(j);
        if (j == 0)
        {
            Colorieren(pixel, r, g, b, w); // Farbe
        }
        if (j == intervall)
        {
            Colorieren(pixel, 0, 0, 0, 0); // Aus
        }
        if (j >= 2 * intervall)
        {
            j = 0;
            Colorieren(pixel, r, g, b, w); // Farbe
        }
        j++;

        lastUpdate = millis(); // time for next change to the display
    }
}