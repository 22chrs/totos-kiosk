#include "LEDController.h"

LEDController::LEDController(int neoPixelCount, int neoPixelPin, int standardPatternInterval, uint16_t gedimmt, uint16_t maxHelligkeit)
    : neoPixelCount(neoPixelCount), neoPixelPin(neoPixelPin), strip(Adafruit_NeoPixel(neoPixelCount, neoPixelPin, NEO_GRBW + NEO_KHZ800)), standardPatternInterval(standardPatternInterval), lastUpdate(0),
      gedimmt(gedimmt), maxHelligkeit(maxHelligkeit) {}

void LEDController::setupLED()
{
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
}

void LEDController::setupNeoPixel()
{
    strip.begin();
    strip.setBrightness(maxHelligkeit);
    strip.clear();
    delay(5);
    strip.show();
}

void LEDController::Colorieren(uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w)
{
    strip.setPixelColor(pixel, r, g, b, w);
    strip.show();
}

void LEDController::Blinken(uint32_t intervall, uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w)
{
    static uint16_t j = 0;
    static uint8_t blinkCount = 0;

    if (millis() - lastUpdate > intervall)
    {
        // non-blocking,
    }
}
