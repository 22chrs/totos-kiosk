// Stepper.cpp

#include <Stepper.h>
#include <LimitSwitch.h>
#include <Led.h>
#include <HardwareSerial.h>
HardwareSerial MySerial0(0);

// #include <SoftwareSerial.h>

#define DRIVER_ADDRESS 0b00 // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f       // value for EZ2209 driver 110mOhm

// SoftwareSerial SoftSerial(D6, D7); // RX, TX
HardwareSerial MySerial1(1);
TMC2209Stepper TMCdriver(&MySerial1, R_SENSE, DRIVER_ADDRESS);

// !driver
#define DIR_PIN D1 // Direction
#define STP_PIN D0 // Step
#define EN_PIN D3  // Enable
#define DIAG_PIN D10;

const int MICROSTEPS = 16;

// !stepper
ESP_FlexyStepper stepper;
const int RESOLUTION = 200; // Steps/turn

const int SPEED_IN_STEPS_PER_SECOND = 2 * RESOLUTION * MICROSTEPS;
const int ACCELERATION_IN_STEPS_PER_SECOND = 800 * MICROSTEPS;
const int DECELERATION_IN_STEPS_PER_SECOND = 800 * MICROSTEPS;

// !geometry
const float RATIO = (20.0 / 32.0) * 2.0;

// #define RXD1 D6 // <<<<<<<<
// #define TXD1 D7 // <<<<<<<<<

void init_Stepper()
{

    // SoftSerial.begin(115200);
    MySerial1.begin(115200, SERIAL_8N1, D6, D7);

    delay(500);
    // TMCdriver.beginSerial(11520); // Initialize UART

    pinMode(EN_PIN, OUTPUT);
    pinMode(STP_PIN, OUTPUT);
    pinMode(DIR_PIN, OUTPUT);
    // pinMode(DIAG_PIN, INPUT);
    digitalWrite(EN_PIN, LOW); // Enable driver in hardware

    TMCdriver.begin();                // UART: Init SW UART (if selected) with default 115200 baudrate
    TMCdriver.toff(3);                // Enables driver in software
    TMCdriver.rms_current(500);       // Set motor RMS current
    TMCdriver.microsteps(MICROSTEPS); // Set microsteps
    delay(100);

    stepper.connectToPins(STP_PIN, DIR_PIN);
    stepper.setSpeedInStepsPerSecond(SPEED_IN_STEPS_PER_SECOND);
    stepper.setAccelerationInStepsPerSecondPerSecond(ACCELERATION_IN_STEPS_PER_SECOND);
    stepper.setDecelerationInStepsPerSecondPerSecond(DECELERATION_IN_STEPS_PER_SECOND);

    stepper.setStepsPerMillimeter(200 * MICROSTEPS / RATIO);

    stepper.startAsService(1); // you might get away with starting the service on core 0, if you experience jitter, start it on core 1

    // Ask for the current setting
    uint16_t current = TMCdriver.rms_current();
    Serial.print("Current RMS set inside the driver: ");
    Serial.println(current);
}

void moveMotorAbs(float absolutePositionToMoveToInMillimeters)
{

    TMCdriver.rms_current(400);
    TMCdriver.microsteps(256); // Set microsteps  to 2
    Serial.print(F("Read microsteps via UART to test UART receive : "));
    Serial.println(TMCdriver.microsteps()); // check if reads 2

    stepper.moveToPositionInMillimeters(absolutePositionToMoveToInMillimeters);

    delay(1000);
}

void homeMotor()
{
    if (check_limitSwitch() == true)
    {
        stepper.setCurrentPositionAsHomeAndStop();
        stepper.moveToPositionInMillimeters(-10);
        while (stepper.motionComplete() == false)
        {
            delay(1);
        }
    }

    if (check_limitSwitch() == false)
    {
        stepper.moveToHomeInRevolutions(-1, SPEED_IN_STEPS_PER_SECOND, 20 * MICROSTEPS, ES_PIN);
        while (stepper.motionComplete() == false)
        {
            delay(1);
        }
        stepper.setCurrentPositionAsHomeAndStop();
        stepper.moveToPositionInMillimeters(5);
        while (stepper.motionComplete() == false)
        {
            delay(1);
        }
        stepper.setCurrentPositionAsHomeAndStop();
    }
}