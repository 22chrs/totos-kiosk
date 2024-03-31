// led.cpp

#include <Led.h>

void init_LEDs()
{
    // Initialize FastLED library for the NEOPIXEL strip.
    FastLED.addLeds<WS2812B, NEOPIXEL_PIN, GRB>(MyNeopixel, NUM_LEDS);
    // Set the brightness of the strip (optional, ranges from 0 to 255).
    FastLED.setBrightness(255);
    // Turn off the LED by setting its color to black.
    MyNeopixel[0] = CRGB::Black;
    FastLED.show();

    // Initialize the built-in LED.
    pinMode(BUILD_IN_LED_PIN, OUTPUT);
    digitalWrite(BUILD_IN_LED_PIN, LOW); // Start with the built-in LED off.
}

void Neopixel(ColorName colorName)
{
    CRGB color;

    switch (colorName)
    {
    case RED:
        color = CRGB::Red;
        break;
    case ORANGE:
        color = CRGB::Orange;
        break;
    case GREEN:
        color = CRGB::Green;
        break;
    case BLUE:
        color = CRGB::Blue;
        break;
    case YELLOW:
        color = CRGB::Yellow;
        break;
    case PURPLE:
        color = CRGB::Purple;
        break;
    case PINK:
        color = CRGB(255, 105, 180); // There's no predefined CRGB::Pink, so we use an RGB value for pink.
        break;
    case WHITE:
        color = CRGB::White;
        break;
    case OFF:
        color = CRGB::Black; // Turn the LED off
        break;
    default:
        color = CRGB::Black; // Default or unknown color
    }

    MyNeopixel[0] = color;
    FastLED.show();
}

void setBuiltInLEDState(bool state)
{
    digitalWrite(BUILD_IN_LED_PIN, state ? HIGH : LOW);
}
