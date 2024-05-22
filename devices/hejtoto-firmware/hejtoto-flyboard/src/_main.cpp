
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

    Serial.println("Started.");
    SPI.begin();

    init_Stepper();

    init_LimitSwitch();

    Neopixel(BLUE);
    setupCam();

    // Neopixel(BLUE);
}

void loop()
{
    // moveMotorToAbsPosition(100);
    // delay(2000);
    // stopMotor();
    // delay(2000);
    //   delay(1000);

    //   put your main code here, to run repeatedly:
}
