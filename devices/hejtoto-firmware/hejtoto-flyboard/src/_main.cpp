
#include <_global.h>
#include <Stepper.h>
#include <Led.h>
// #include <WLAN.h>
#include <LimitSwitch.h>
#include <Cam.h>

void setup()
{
  SPI.begin();
  Serial.begin(115200);
  while (!Serial)
    ;

  Serial.println("Started.");

  init_Stepper();

  // init_LimitSwitch();
  init_LEDs();
  // init_Cam();
  // init_WLAN();
  // Neopixel(BLUE);
}

void loop()
{
  moveMotorToAbsPosition(10000);
  // Serial.println("Loop");
  //  put your main code here, to run repeatedly:
}
