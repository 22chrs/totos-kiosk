// Fan.cpp
#include <Fan.h>

void init_Fans()
{
    pinMode(PWM_FAN_1_PIN, OUTPUT);
    pinMode(PWM_FAN_2_PIN, OUTPUT);
    pinMode(PWM_FAN_3_PIN, OUTPUT);
    pinMode(RPM_FAN_1_PIN, INPUT);
    pinMode(RPM_FAN_2_PIN, INPUT);
    pinMode(RPM_FAN_3_PIN, INPUT);

    // analogWriteFreq(100); // 100 - 40000

    // ensure everything is off
    analogWrite(PWM_FAN_1_PIN, 0);
    analogWrite(PWM_FAN_2_PIN, 0);
    analogWrite(PWM_FAN_3_PIN, 0);
}

void pwmFan(int FanX, int percent)
{
    int pinNumber = 0; // Initialize to an invalid pin number

    // Assuming '1' through '5' map directly to PWM_24V_1_PIN through PWM_24V_5_PIN
    // and 'a' maps to PWM_12V_PIN
    switch (FanX)
    {
    case 1:
        pinNumber = PWM_FAN_1_PIN;
        break;
    case 2:
        pinNumber = PWM_FAN_2_PIN;
        break;
    case 3:
        pinNumber = PWM_FAN_3_PIN;
        break;
    default:
        // Handle invalid MosfetX input, perhaps log an error or use a default pin
        return;
    }

    int value = map(percent, 0, 100, 0, 255);
    analogWrite(pinNumber, value);
}

int getRpmFan(char FanX)
{
}
