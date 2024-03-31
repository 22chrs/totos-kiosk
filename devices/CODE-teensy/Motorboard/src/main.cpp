

// GP0 = STP1
// GP1 = DIR1
// GP2 = ES1
// GP3 = EN
// GP4 = TX
// GP5 = PDN For communication via UART with Pico/ TMC Stepper driver
// GP6 = STP2
// GP7 = DIR2
// GP8 = ES2
// GP9 = SDA
// GP10 = SCL
// GP11 = STP3
// GP12 = DIR3
// GP13 = ES3
// GP14 = PWM1
// GP15 = PWM2
// GP16 = STP4
// GP17 = DIR4
// GP18 = ES4
// GP19 = STP5
// GP20 = DIR5
// GP21 = ES5
// GP22 = STP6
// GP25 = LED
// GP26 = DIR6
// GP27 = ES6
// GP28 = TS

// https://forum.arduino.cc/t/tmcstepper-arduino-tmc2209/956036/31

#include <Arduino.h>    // TMCstepper library
#include <TMCStepper.h> // TMCstepper library
#include <PicoSoftwareSerial.h>
// #include <SoftwareSerial.h>

int LED_PIN = 25; // Onboard LED on Raspberry Pi Pico

#define TX_PIN 4 // GP4 = TX
#define RX_PIN 5 // GP5 = PDN For communication via UART with Pico/ TMC Stepper driver

#define EN_PIN 3            // GP3 - Enable
#define DIR_PIN 17          // GP17 - Direction for Stepper 4
#define STEP_PIN 16         // GP16 - Step for Stepper 4
#define SERIAL_PORT Serial1 // Assuming you're using UART1 on the Pico
#define DRIVER_ADDRESS 0b00 // TMC2209 Driver address according to MS1 and MS2
#define R_SENSE 0.11f       // Current sensing resistor value (0.11 Ohm)
#define MICROSTEPS 8        // Microsteps; note that MicroPlyer will interpolate to 256

// Global variables
long accel = 10000;
long maxSpeed = 50000;
int speedChangeDelay = 100;
bool dir = false;

// SoftwareSerial SerialDriver1(SW_RX, SW_TX);
// TMC2209Stepper driver1(&SerialDriver1, R_SENSE, DRIVER_ADDRESS1);

TMC2209Stepper TMCdriver(&SERIAL_PORT, R_SENSE, DRIVER_ADDRESS); // Initialize the TMC2209 driver

//== Setup ===============================================================================

void setupLED()
{
  pinMode(LED_PIN, OUTPUT); // wait for a second
}

void ledProgram()
{
  delay(500);
  digitalWrite(LED_PIN, HIGH); // turn the LED on (HIGH is the voltage level)
  delay(500);                  // wait for a second
  digitalWrite(LED_PIN, LOW);  // turn the LED off by making the voltage LOW
  delay(500);                  // wait for a second
}

void readDriverStatus()
{
  uint32_t ioin = TMCdriver.IOIN(); // Read IOIN register
  Serial.print("IOIN register: ");
  Serial.println(ioin, HEX); // Print the result in hexadecimal
}

void setup()
{
  setupLED();
  ledProgram();

  Serial.begin(11520); // initialize hardware serial for debugging

  // Assign UART1 functions to specific pins
  gpio_set_function(TX_PIN, GPIO_FUNC_UART);
  gpio_set_function(RX_PIN, GPIO_FUNC_UART);
  SERIAL_PORT.begin(115200); // Initialize hardware UART for TMC2209

  pinMode(EN_PIN, OUTPUT); // Set pinmodes
  pinMode(STEP_PIN, OUTPUT);
  pinMode(DIR_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW); // Enable TMC2209 board

  TMCdriver.begin();                // UART: Init SW UART (if selected) with default 115200 baudrate
  TMCdriver.toff(5);                // Enables driver in software
  TMCdriver.rms_current(1000);      // Set motor RMS current
  TMCdriver.microsteps(MICROSTEPS); // Set microsteps

  TMCdriver.en_spreadCycle(false);
  TMCdriver.pwm_autoscale(true); // Needed for stealthChop

  // Debug information
  Serial.print("Current RMS: ");
  Serial.println(TMCdriver.rms_current());
  Serial.print("Microsteps: ");
  Serial.println(TMCdriver.microsteps());
  // Serial.print("StealthChop enabled: ");
  // Serial.println(TMCdriver.en_pwm_mode() ? "Yes" : "No");

  readDriverStatus();
}

//== Loop =================================================================================
int32_t curr_speed = 0;
int32_t dest_speed = 1000 * MICROSTEPS;
int32_t acceleration = 10 * MICROSTEPS;

void ramp()
{
  digitalWrite(LED_PIN, dest_speed > 0);
  while ((dest_speed > 0 && curr_speed < dest_speed) || (dest_speed < 0 && curr_speed > dest_speed))
  {
    curr_speed += acceleration;
    TMCdriver.VACTUAL(curr_speed);
    delayMicroseconds(100);
  }
}

void loop()
{
  ramp();
  delay(1000);
  dest_speed *= -1;
  acceleration *= -1;
}