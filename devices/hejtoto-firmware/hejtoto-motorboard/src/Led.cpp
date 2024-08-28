// led.cpp
// Adafruit_NeoPixel(neoPixelCount, neoPixelPin, NEO_GRBW + NEO_KHZ800);
#include <Led.h>
// led.cpp

#include <Adafruit_NeoPixel.h>

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, NEOPIXEL_PIN, NEO_GRBW + NEO_KHZ800);

void Neopixel(ColorName colorName) {
    uint32_t color;

    switch (colorName) {
        case RED:
            color = strip.Color(255, 0, 0);  // Red
            break;
        case ORANGE:
            color = strip.Color(255, 165, 0);  // Orange
            break;
        case GREEN:
            color = strip.Color(0, 255, 0);  // Green
            break;
        case BLUE:
            color = strip.Color(0, 0, 255);  // Blue
            break;
        case YELLOW:
            color = strip.Color(255, 255, 0);  // Yellow
            break;
        case PURPLE:
            color = strip.Color(160, 32, 240);  // Purple
            break;
        case PINK:
            color = strip.Color(255, 105, 180);  // Pink
            break;
        case WHITE:
            color = strip.Color(255, 255, 255);  // White
            break;
        case OFF:
            color = strip.Color(0, 0, 0);  // Off
            break;
        default:
            color = strip.Color(0, 0, 0);  // Default to off if color is unknown
    }

    strip.setPixelColor(0, color);  // Set color of the first pixel
    strip.show();                   // Update the strip to show the color change
}

void init_LEDs() {
    strip.begin();  // Initialize the NeoPixel strip
    strip.setPixelColor(0, strip.Color(0, 0, 0));
    strip.setBrightness(10);  // Set the brightness (optional, ranges from 0 to 255)
    strip.show();             // Initialize all pixels to 'off'
    Neopixel(OFF);

    pinMode(BUILD_IN_LED_PIN, OUTPUT);    // Initialize the built-in LED
    digitalWrite(BUILD_IN_LED_PIN, LOW);  // Start with the built-in LED off
}

void buildInLEDBlik() {
    setBuiltInLEDState(HIGH);
    delay(100);
    setBuiltInLEDState(LOW);
    delay(100);
    setBuiltInLEDState(HIGH);
    delay(100);
    setBuiltInLEDState(LOW);
}

unsigned long previousMillis = 0;  // Stores the last time the LED was updated
const long interval = 100;         // Interval at which to blink (in milliseconds)
bool ledState = LOW;               // Stores the current state of the built-in LED

void flipBuiltInLED() {
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;  // Save the last time the LED was updated

        // If the LED is off, turn it on, and vice-versa
        ledState = !ledState;

        // Set the LED with the ledState of the variable
        setBuiltInLEDState(ledState);
    }
}

void setBuiltInLEDState(bool state) {
    digitalWrite(BUILD_IN_LED_PIN, state ? HIGH : LOW);  // Set the state of the built-in LED
}
