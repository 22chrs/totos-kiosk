
#include <_global.h>
#include <Stepper.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <Cam.h>

void setup()
{

    Serial.begin(115200);
    // while (!Serial)
    //     ;

    Serial.println("Started.");
    SPI.begin();

    // init_Stepper();

    // init_LimitSwitch();
    init_LEDs();
    setupCam();

    // Neopixel(BLUE);
}

void loop()
{
    delay(1000);
    // moveMotorToAbsPosition(10000);
    //  Serial.println("Loop");
    //   put your main code here, to run repeatedly:
}
