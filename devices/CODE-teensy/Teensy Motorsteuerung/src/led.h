#ifndef NEOPIXEL_H
#define NEOPIXEL_H

#include <_global.h>
#include <Adafruit_NeoPixel.h>

void setupLED();
void setupNeoPixel();
void Colorieren(uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w);
void Blinken(uint32_t intervall, uint8_t pixel, uint8_t r, uint8_t g, uint8_t b, uint8_t w);

#endif