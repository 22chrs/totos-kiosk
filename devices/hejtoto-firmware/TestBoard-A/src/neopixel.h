#include <Adafruit_NeoPixel.h>

#define PIXEL_COUNT 1
#define PIXEL_PIN 10

// WS2812B (for RGB) or SK6812 (for RGBW) chips
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, NEO_GRBW + NEO_KHZ800);

void setup()
{
    strip.begin();
    strip.show(); // Initialize all pixels to 'off'

    // Set color to less red. Assuming "less red" means reducing the red component value.
    // For example, full red is (255, 0, 0). To make it less red, reduce the 255 value.
    // Here, we use (155, 0, 0) as an example of "less red".
    uint32_t lessRedColor = strip.Color(0, 0, 255); // Adjust the first parameter to decrease red intensity

    for (int i = 0; i < strip.numPixels(); i++)
    {
        strip.setPixelColor(i, lessRedColor);
    }
    strip.show();

    delay(2000);
    lessRedColor = strip.Color(0, 0, 0); // Adjust the first parameter to decrease red intensity

    for (int i = 0; i < strip.numPixels(); i++)
    {
        strip.setPixelColor(i, lessRedColor);
    }
    strip.show();
}

void loop()
{
    // Nothing to do here
}
