// ToF.cpp

#include <_global.h>
#include <Adafruit_VL6180X.h>
#include <Adafruit_VL53L0X.h>
#include <TCA9548A.h>

Adafruit_VL6180X vl = Adafruit_VL6180X();

void init_TOF050C(byte ToF_X)
{
    TCA9548ASelectChannel(ToF_X);
    Serial.println("Adafruit VL6180x test!");
    if (!vl.begin())
    {
        Serial.println("Failed to find sensor");
        while (1)
            ;
    }
    Serial.println("Sensor found!");
}

void readTOF050C(byte ToF_X)
{
    TCA9548ASelectChannel(ToF_X);
    float lux = vl.readLux(VL6180X_ALS_GAIN_5);

    Serial.print("Lux: ");
    Serial.println(lux);

    uint8_t range = vl.readRange();
    uint8_t status = vl.readRangeStatus();

    if (status == VL6180X_ERROR_NONE)
    {
        Serial.print("Range: ");
        Serial.println(range);
    }

    // Some error occurred, print it out!

    if ((status >= VL6180X_ERROR_SYSERR_1) && (status <= VL6180X_ERROR_SYSERR_5))
    {
        Serial.println("System error");
    }
    else if (status == VL6180X_ERROR_ECEFAIL)
    {
        Serial.println("ECE failure");
    }
    else if (status == VL6180X_ERROR_NOCONVERGE)
    {
        Serial.println("No convergence");
    }
    else if (status == VL6180X_ERROR_RANGEIGNORE)
    {
        Serial.println("Ignoring range");
    }
    else if (status == VL6180X_ERROR_SNR)
    {
        Serial.println("Signal/Noise error");
    }
    else if (status == VL6180X_ERROR_RAWUFLOW)
    {
        Serial.println("Raw reading underflow");
    }
    else if (status == VL6180X_ERROR_RAWOFLOW)
    {
        Serial.println("Raw reading overflow");
    }
    else if (status == VL6180X_ERROR_RANGEUFLOW)
    {
        Serial.println("Range reading underflow");
    }
    else if (status == VL6180X_ERROR_RANGEOFLOW)
    {
        Serial.println("Range reading overflow");
    }
    delay(50);
}

Adafruit_VL53L0X lox = Adafruit_VL53L0X();

void init_TOF200C(byte ToF_X)
{
    TCA9548ASelectChannel(ToF_X);
    Serial.println("Adafruit VL53L0X test.");
    if (!lox.begin())
    {
        Serial.println(F("Failed to boot VL53L0X"));
        while (1)
            ;
    }
    // power
    Serial.println(F("VL53L0X API Continuous Ranging example\n\n"));
}

void readTOF200C(byte ToF_X)
{
    TCA9548ASelectChannel(ToF_X);
    VL53L0X_RangingMeasurementData_t measure;

    Serial.print("Reading a measurement... ");
    lox.rangingTest(&measure, false); // pass in 'true' to get debug data printout!

    // Assuming 57344 is a default error code for an unconnected sensor, and that the maximum reliable range is, for example, 4000 mm
    if (measure.RangeStatus != 4 && measure.RangeMilliMeter < 4000)
    {
        Serial.print("Distance (mm): ");
        Serial.println(measure.RangeMilliMeter);
    }
    else
    {
        Serial.println(" out of range ");
    }
}