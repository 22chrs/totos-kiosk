
#include <_global.h>
#include <Stepper.h>
#include <Led.h>
// #include <WLAN.h>
#include <LimitSwitch.h>

void setup()
{
  Serial.begin(115200);
  while (!Serial)
    ;
  Serial.setDebugOutput(true);
  Serial.println();

  init_Stepper();
  init_LimitSwitch();
  init_LEDs();
  // init_WLAN();
}

void loop()
{
  // put your main code here, to run repeatedly:
}
