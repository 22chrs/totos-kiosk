// Fan.cpp
#include <Fan.h>

void init_Fan() {
    pinMode(PWM_FAN_1_PIN, OUTPUT);
    // ensure everything is off
    analogWrite(PWM_FAN_1_PIN, 0);
}

void pwmFan(int percent) {
    int value = map(percent, 0, 100, 0, 255);
    analogWrite(PWM_FAN_1_PIN, value);
}
