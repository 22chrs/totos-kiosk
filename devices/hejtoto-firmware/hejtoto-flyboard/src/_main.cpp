
#include <_global.h>
#include <Stepper.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <Cam.h>

void setup()
{

    Serial.begin(115200);
    init_LEDs();
    Neopixel(OFF);
    // while (!Serial)
    //     ;

    SPI.begin();

    init_Stepper();

    // init_LimitSwitch();

    Neopixel(PURPLE);
    // setupCam();

    delay(3000);
    Serial.println("Started.");

    Neopixel(GREEN);
    // moveMotorAbs(-10);
    // homeMotor();
}

void loop()
{
    moveMotorAbs(-105);
    // delay(60 * 1000);
    // moveMotorAbs(0);
    // delay(60 * 1000);

    // moveMotorAbs(-20);
    // delay(5000);
    // moveMotorAbs(0);
    // delay(5000);

    // loopStepper();
    // moveMotorToAbsPosition(10);
    // delay(2000);
    // stopMotor();
    // delay(2000);
    // delay(1000);

    //   put your main code here, to run repeatedly:
}
