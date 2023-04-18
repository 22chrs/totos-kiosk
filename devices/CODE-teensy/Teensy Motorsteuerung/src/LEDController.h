#ifndef LEDCONTROLLER_H
#define LEDCONTROLLER_H

#include <Adafruit_NeoPixel.h>
#include <Chrono.h>

class LEDController
{
private:
    const int neoPixelCount;
    const int neoPixelPin;
    Adafruit_NeoPixel strip;

    const int standardPatternInterval;
    unsigned long lastUpdate;

    const uint16_t gedimmt;
    const uint16_t maxHelligkeit;

    Chrono chronoTimerOff;

public:
    LEDController(int neoPixelCount = 3, int neoPixelPin = 26, int standardPatternInterval = 20,
                  uint16_t gedimmt = 20, uint16_t maxHelligkeit = 25);

    void setupLED();
    void setupNeoPixel();
    void Colorieren(uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w);
    void Blinken(uint32_t intervall, uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w);
};

#endif // LEDCONTROLLER_H
