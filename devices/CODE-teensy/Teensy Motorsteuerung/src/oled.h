// OLED Display
#ifndef OLED_H
#define OLED_H

#include <_global.h>
#include <U8g2lib.h>

extern U8G2_SSD1306_128X64_NONAME_1_HW_I2C u8g2;
extern String oledMessage;

void setupOled();
void oledClear();
void sendOledMessage(String message);

#endif