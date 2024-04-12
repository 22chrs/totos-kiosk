// Mosfet.cpp
#include <Mosfet.h>

void init_Mosfet()
{
    pinMode(PWM_24V_1_PIN, OUTPUT);
    pinMode(PWM_24V_2_PIN, OUTPUT);
    pinMode(PWM_24V_3_PIN, OUTPUT);
    pinMode(PWM_24V_4_PIN, OUTPUT);
    pinMode(PWM_24V_5_PIN, OUTPUT);
    pinMode(PWM_12V_PIN, OUTPUT);

    // analogWriteFreq(100); // 100 - 40000

    // ensure everything is off
    analogWrite(PWM_24V_1_PIN, 0);
    analogWrite(PWM_24V_2_PIN, 0);
    analogWrite(PWM_24V_3_PIN, 0);
    analogWrite(PWM_24V_4_PIN, 0);
    analogWrite(PWM_24V_5_PIN, 0);
    analogWrite(PWM_12V_PIN, 0);
}

void pwmMosfet(int MosfetX, int percent)
{
    int pinNumber = 0; // Initialize to an invalid pin number

    // Assuming '1' through '5' map directly to PWM_24V_1_PIN through PWM_24V_5_PIN
    // and 'a' maps to PWM_12V_PIN
    switch (MosfetX)
    {
    case 1:
        pinNumber = PWM_24V_1_PIN;
        break;
    case 2:
        pinNumber = PWM_24V_2_PIN;
        break;
    case 3:
        pinNumber = PWM_24V_3_PIN;
        break;
    case 4:
        pinNumber = PWM_24V_4_PIN;
        break;
    case 5:
        pinNumber = PWM_24V_5_PIN;
        break;
    case 6:
        pinNumber = PWM_12V_PIN;
        break;
    default:
        // Handle invalid MosfetX input, perhaps log an error or use a default pin
        return;
    }

    int value = map(percent, 0, 100, 0, 255);
    Serial.println(percent);
    analogWrite(pinNumber, value);
}
