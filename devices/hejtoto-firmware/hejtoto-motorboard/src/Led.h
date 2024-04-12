// led.h

#ifndef LED_H
#define LED_H

#include <_global.h>

#define BUILD_IN_LED_PIN 13

#define NEOPIXEL_PIN 10
#define NUM_LEDS 1

enum ColorName
{
    RED,
    ORANGE,
    GREEN,
    BLUE,
    YELLOW,
    PURPLE,
    PINK,
    WHITE,
    OFF
};

void init_LEDs();
void Neopixel(ColorName colorName);
void setBuiltInLEDState(bool state);

#endif
