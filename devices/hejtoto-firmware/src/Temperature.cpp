// Temperature.cpp

#include <Temperature.h>

void init_TemperatureSensor()
{
    sht.begin();

    uint16_t stat = sht.readStatus();
    Serial.print(stat, HEX);
    Serial.println();
}

float getTemperature()
{
    float Temperature = 0;
    sht.read();
    Temperature = sht.getTemperature();
    Serial.println(Temperature);
    return Temperature;
}

float getHumidity()
{
    float Humidity = 0;
    sht.read();
    Humidity = sht.getHumidity();
    Serial.println(Humidity);
    return Humidity;
}

Chrono chronoTemerature;

void check_TemperatureSensor()
{
    if (chronoTemerature.hasPassed(10000))
    { // returns true if it passed 250 ms since it was started
        chronoTemerature.restart();

        Serial.print("Temperatur = ");
        Serial.println(getTemperature());

        Serial.print("Luftfeuchtigkeit = ");
        Serial.println(getHumidity());
    }
}
