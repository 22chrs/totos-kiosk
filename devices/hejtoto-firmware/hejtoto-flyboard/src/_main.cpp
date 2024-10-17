
// #include <Cam.h>
#include <Fan.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <RS485.h>
#include <Stepper.h>
#include <_global.h>

void setup() {
    Serial.begin(9600);
    SPI.begin();
    init_LEDs();

    init_Fan();
    init_Stepper();
    init_LimitSwitch();
    init_RS485();

    Neopixel(BLUE);
    // setupCam();

    // moveMotorAbs(100);
    // moveMotorAbs(0);
    pwmFan(0);
    // homeMotor();
}

void loop() {
    // loop_RS485();
    //  check_limitSwitch();
    delay(100);
}
