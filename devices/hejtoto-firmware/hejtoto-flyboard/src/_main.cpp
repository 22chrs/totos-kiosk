
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

    init_Stepper();

    init_LimitSwitch();
    init_LEDs();
    Neopixel(BLUE);
    // setupCam();

    // Neopixel(BLUE);
}

void loop()
{
    moveMotorToAbsPosition(1000);
    //  delay(1000);

    //   put your main code here, to run repeatedly:
}
