#include <_global.h>

#include <MCP23017.h> //0x20
#include <BoardSelect.h>
#include <Stepper.h>
#include <Led.h>
#include <Temperature.h> //0x45
#include <Mosfet.h>
#include <LimitSwitch.h>
#include <TCA9548A.h> //0x70
#include <ToF.h>      //0x29 (TOF050C)
#include <Fan.h>
// #include <USB.h>

void setup()
{
  init_LEDs();
  setBuiltInLEDState(HIGH);

  Wire.begin();          // Initialize I2C
  Wire.setClock(400000); // Set I2C speed to 400kHz (Standard 100kHz)

  Serial.begin(115200); // Start serial communication at 9600 baud

  Serial.println("Begin.");

  init_TCA9548A();
  init_MCP23017(); // Initialize pins of MCP23017 I/O Expander

  init_BoardSelect(); // Check which board this code runs on

  init_Stepper(); // Initialize stepper motor drivers

  init_Mosfet();            // Initialize Mosfets
  init_TemperatureSensor(); // Initialize temperature and humidity sensor
  init_Fan();

  init_LimitSwitch();
  init_doorSensor();

  init_TOF200C(2);
  enableMotor(1, true);
  enableMotor(2, true);
  moveMotorToAbsPosition(1, -5000);
  moveMotorToAbsPosition(2, 1000);

  pwmFan(1, 150);

  setBuiltInLEDState(HIGH);
  delay(100);
  setBuiltInLEDState(LOW);
  delay(100);
  setBuiltInLEDState(HIGH);
  delay(100);
  setBuiltInLEDState(LOW);
  delay(100);
  setBuiltInLEDState(HIGH);
  delay(100);
  setBuiltInLEDState(LOW);
  delay(100);
  Serial.println("End.");
  Neopixel(BLUE);
}

void loop()
{

  // if (motorMovingState(1) == false)
  // {
  //   enableMotor(1, false);
  //   // moveMotorToAbsPosition(6, 0);
  // }
  // if (motorMovingState(2) == false)
  // {
  //   enableMotor(2, false);
  //   // moveMotorToAbsPosition(6, 0);
  // }

  check_doorSensor();
  check_limitSwitch1();

  check_TemperatureSensor();
  // readTOF200C(2);
}
