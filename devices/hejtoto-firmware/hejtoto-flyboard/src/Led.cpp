// led.cpp
// Adafruit_NeoPixel(neoPixelCount, neoPixelPin, NEO_GRBW + NEO_KHZ800);
#include <Led.h>
// led.cpp

#include <Adafruit_NeoPixel.h>

// Declare our NeoPixel strip object:
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, NEOPIXEL_PIN, NEO_GRBW + NEO_KHZ800);

void init_LEDs() {
    strip.begin();  // Initialize the NeoPixel strip
    strip.setPixelColor(0, strip.Color(0, 0, 0));
    strip.setBrightness(255);  // Set the brightness (optional, ranges from 0 to 255)
    strip.show();              // Initialize all pixels to 'off'
    Neopixel(OFF);

    pinMode(BUILTIN_LED, OUTPUT);  // Initialize the built-in LED

    for (int i = 0; i < 3; i++) {
        digitalWrite(BUILTIN_LED, LOW);  // Turn the LED on
        delay(100);
        digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off
        delay(100);                       // Wait
    }
}

void setBuiltInLEDState(bool state) {
    digitalWrite(BUILTIN_LED, state ? HIGH : LOW);  // Set the state of the built-in LED
}

unsigned long pixelPrevious = 0;    // Previous Pixel Millis
unsigned long patternPrevious = 0;  // Previous Pattern Millis
int patternCurrent = 0;             // Current Pattern Number
int patternInterval = 5000;         // Pattern Interval (ms)
bool patternComplete = false;

int pixelInterval = 10;           // Pixel Interval (ms)
int pixelQueue = 0;               // Pattern Pixel Queue
int pixelCycle = 0;               // Pattern Pixel Cycle
uint16_t pixelNumber = NUM_LEDS;  // Total Number of Pixels

uint32_t Wheel(byte WheelPos) {
    WheelPos = 255 - WheelPos;
    if (WheelPos < 85) {
        return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
    }
    if (WheelPos < 170) {
        WheelPos -= 85;
        return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
    }
    WheelPos -= 170;
    return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

void colorWipe(uint32_t color, int wait) {
    static uint16_t current_pixel = 0;
    pixelInterval = wait;                         //  Update delay time
    strip.setPixelColor(current_pixel++, color);  //  Set pixel's color (in RAM)
    strip.show();                                 //  Update strip to match
    if (current_pixel >= pixelNumber) {           //  Loop the pattern from the first LED
        current_pixel = 0;
        patternComplete = true;
    }
}

// Theater-marquee-style chasing lights. Pass in a color (32-bit value,
// a la strip.Color(r,g,b) as mentioned above), and a delay time (in ms)
// between frames.
void theaterChase(uint32_t color, int wait) {
    static uint32_t loop_count = 0;
    static uint16_t current_pixel = 0;

    pixelInterval = wait;  //  Update delay time

    strip.clear();

    for (int c = current_pixel; c < pixelNumber; c += 3) {
        strip.setPixelColor(c, color);
    }
    strip.show();

    current_pixel++;
    if (current_pixel >= 3) {
        current_pixel = 0;
        loop_count++;
    }

    if (loop_count >= 10) {
        current_pixel = 0;
        loop_count = 0;
        patternComplete = true;
    }
}

// Rainbow cycle along whole strip. Pass delay time (in ms) between frames.
void rainbow(uint8_t wait) {
    if (pixelInterval != wait)
        pixelInterval = wait;
    for (uint16_t i = 0; i < pixelNumber; i++) {
        strip.setPixelColor(i, Wheel((i + pixelCycle) & 255));  //  Update delay time
    }
    strip.show();  //  Update strip to match
    pixelCycle++;  //  Advance current cycle
    if (pixelCycle >= 256)
        pixelCycle = 0;  //  Loop the cycle back to the begining
}

// Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(uint8_t wait) {
    if (pixelInterval != wait)
        pixelInterval = wait;  //  Update delay time
    for (int i = 0; i < pixelNumber; i += 3) {
        strip.setPixelColor(i + pixelQueue, Wheel((i + pixelCycle) % 255));  //  Update delay time
    }
    strip.show();
    for (int i = 0; i < pixelNumber; i += 3) {
        strip.setPixelColor(i + pixelQueue, strip.Color(0, 0, 0));  //  Update delay time
    }
    pixelQueue++;  //  Advance current queue
    pixelCycle++;  //  Advance current cycle
    if (pixelQueue >= 3)
        pixelQueue = 0;  //  Loop
    if (pixelCycle >= 256)
        pixelCycle = 0;  //  Loop
}

void loop_updateLEDs() {
    unsigned long currentMillis = millis();                                         //  Update current time
    if (patternComplete || (currentMillis - patternPrevious) >= patternInterval) {  //  Check for expired time
        patternComplete = false;
        patternPrevious = currentMillis;
        patternCurrent++;  //  Advance to next pattern
        if (patternCurrent >= 4)
            patternCurrent = 0;
    }

    if (currentMillis - pixelPrevious >= pixelInterval) {  //  Check for expired time
        pixelPrevious = currentMillis;                     //  Run current frame
        switch (patternCurrent) {
            case 4:
                theaterChaseRainbow(50);  // Rainbow-enhanced theaterChase variant
                break;
            case 3:
                rainbow(10);  // Flowing rainbow cycle along the whole strip
                break;
            case 2:
                colorWipe(strip.Color(0, 0, 255), 50);  // Blue
                break;
            case 1:
                colorWipe(strip.Color(0, 255, 0), 50);  // Green
                break;
            default:
                colorWipe(strip.Color(255, 0, 0), 50);  // Red
                break;
        }
    }
}

void Neopixel(ColorName colorName) {
    uint32_t color;

    switch (colorName) {
        case RED:
            colorWipe(strip.Color(255, 0, 0), 50);  // Red
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
    strip.setPixelColor(1, color);  // Set color of the first pixel
    strip.setPixelColor(2, color);  // Set color of the first pixel
    strip.show();                   // Update the strip to show the color change
}