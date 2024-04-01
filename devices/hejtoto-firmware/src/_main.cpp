

#include <_global.h>
#include <MCP23017.h>
#include <BoardSelect.h>
#include <Stepper.h>
#include <Led.h>
#include <Temperature.h>
#include <Mosfet.h>
#include <LimitSwitch.h>

void setup()
{
  Serial.begin(9600);       // Start serial communication at 9600 baud
  Wire.begin();             // Initialize I2C
  init_MCP23017();          // Initialize pins of MCP23017 I/O Expander
  init_BoardSelect();       // Check which board this code runs on
  init_Stepper();           // Initialize stepper motor drivers
  init_LEDs();              // Initialize LEDs
  init_Mosfet();            // Initialize Mosfets
  init_TemperatureSensor(); // Initialize temperature and humidity sensor
  init_doorSensor();
  init_LimitSwitch();

  Wire.setClock(400000); // Set I2C speed to 400kHz (Standard 100kHz)

  Neopixel(GREEN);
}

void loop()
{
  // Check routines
  check_doorSensor();
  check_TemperatureSensor();
}
