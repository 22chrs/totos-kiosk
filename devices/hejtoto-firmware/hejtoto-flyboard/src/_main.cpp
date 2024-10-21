
// #include <Cam.h>
#include <Fan.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <RS485.h>
#include <Stepper.h>
#include <_global.h>

void setup() {
    delay(15000);
    // Serial.begin(9600);
    SPI.begin();
    init_LEDs();
    Neopixel(RED);

    init_Fan();
    init_Stepper();
    init_LimitSwitch();
    init_RS485();

    // setupCam();

    homeMotor();

    // fadeNeopixel(RED);
    //   loop_endstopDetected();
    moveMotorAbs(71.0);
}

void loop() {
    // rainbow(200);
    //  theaterChaseRainbow(200);
    //   loop_endstopDetected();
    //    Neopixel(GREEN);
    //      moveMotorAbs(0);
    //       loop_endstopDetected();
    //        loop_RS485();
    //         check_limitSwitch();
    //     delay(1000);
    //     Neopixel(RED);
    //     delay(1000);

    loop_RS485();
    // updateFadeNeopixel();
}
