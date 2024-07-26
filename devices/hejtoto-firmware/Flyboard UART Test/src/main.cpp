#include <Arduino.h>
#include <TMC2209.h> //https://github.com/janelia-arduino/TMC2209

#include <HardwareSerial.h>
HardwareSerial MySerial0(0);
#define RX_PIN D7 // = RX1
#define TX_PIN D6 // = TX1

TMC2209 stepper_driver;
// !driver
#define EN_PIN D3 // Enable
const uint8_t STEP_PIN = D0;
const uint8_t DIR_PIN = D1;

const int DELAY = 2000;
const int32_t VELOCITY = 10000;
const int32_t VELOCITY_STOPPED = 0;
const uint8_t PERCENT_MIN = 0;
const uint8_t PERCENT_MAX = 100;
const uint8_t PERCENT_INC = 10;
// current values may need to be reduced to prevent overheating depending on
// specific motor and power supply voltage
const uint8_t RUN_CURRENT_PERCENT = 100;

uint8_t hold_current_percent = PERCENT_INC;

void setup()
{
  // Enable Stepper
  pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW); // Enable driver in hardware

  Serial.begin(115200);
  MySerial0.begin(9600, SERIAL_8N1, -1, -1); // Configure MySerial0 on pins TX=D6 and RX=D7 (-1, -1 means use the default)

  stepper_driver.setup(MySerial0);
  delay(1000);

  stepper_driver.disable();
  stepper_driver.setRunCurrent(RUN_CURRENT_PERCENT);
}
void loop()
{
  if (not stepper_driver.isSetupAndCommunicating())
  {
    Serial.println("Stepper driver not setup and communicating!");
    return;
  }

  Serial.println("enable and run");
  stepper_driver.enable();
  stepper_driver.moveAtVelocity(VELOCITY);

  Serial.print("setHoldCurrent(");
  Serial.print(hold_current_percent);
  Serial.println(")");
  stepper_driver.setHoldCurrent(hold_current_percent);
  delay(DELAY);

  Serial.println("stop");
  stepper_driver.moveAtVelocity(VELOCITY_STOPPED);
  delay(DELAY);

  uint8_t pwm_scale_sum = stepper_driver.getPwmScaleSum();
  Serial.print("pwm_scale_sum = ");
  Serial.println(pwm_scale_sum);
  delay(DELAY);

  stepper_driver.disable();
  Serial.println("disable");
  Serial.println();
  delay(DELAY);

  if (hold_current_percent == PERCENT_MAX)
  {
    hold_current_percent = PERCENT_MIN;
  }
  hold_current_percent += PERCENT_INC;
}