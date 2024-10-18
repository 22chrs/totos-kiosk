// led.h

#ifndef LED_H
#define LED_H

#include <_global.h>

#define NEOPIXEL_PIN D10
#define NUM_LEDS 3

enum ColorName {
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
void loop_updateLEDs();
void rainbow(uint8_t wait);
void theaterChaseRainbow(uint8_t wait);
void fadeNeopixel(ColorName colorName);
void updateFadeNeopixel();

#endif
