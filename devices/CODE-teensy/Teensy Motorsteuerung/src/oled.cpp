#include <oled.h>

#define U8LOG_WIDTH 16
#define U8LOG_HEIGHT 8
uint8_t u8log_buffer[U8LOG_WIDTH * U8LOG_HEIGHT];
U8X8LOG u8x8log;

U8G2_SSD1306_128X64_NONAME_1_HW_I2C u8g2(U8G2_R2, /* reset=*/U8X8_PIN_NONE);

Chrono chromoOled;

String oledMessage = "";

void setupOled()
{
    // OLED
    u8g2.begin();
    u8g2.setPowerSave(true);
    delay(100);
    u8g2.setPowerSave(false);
    delay(50);
    u8g2.clear();
    u8g2.setFont(u8g2_font_6x13_tf);
    u8g2.setFont(u8g2_font_8x13_t_symbols);
}

void oledClear()
{
    u8g2.clear();
    u8g2.clearBuffer();
}

void updateOledMessage(String message)
{
    oledMessage = message;
}

void oledPrint(bool nextPage)
{
    if (nextPage)
    {
        if (!u8g2.nextPage())
            return;
        u8g2.firstPage();
    }
    // Show the incoming message
    u8g2.drawStr(0, 10, oledMessage.c_str());
}