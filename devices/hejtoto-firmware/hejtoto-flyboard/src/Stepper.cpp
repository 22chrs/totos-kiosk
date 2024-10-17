// Stepper.cpp

#include <HardwareSerial.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <Stepper.h>
HardwareSerial MySerial0(0);

// #include <SoftwareSerial.h>

#define DRIVER_ADDRESS 0b00  // EZ2209 driver address according to MS1 and MS2
#define R_SENSE 0.11f        // value for EZ2209 driver 110mOhm

// SoftwareSerial SoftSerial(D6, D7); // RX, TX
HardwareSerial MySerial1(1);
TMC2209Stepper TMCdriver(&MySerial1, R_SENSE, DRIVER_ADDRESS);

// !driver
#define DIR_PIN D1  // Direction
#define STP_PIN D0  // Step
#define EN_PIN D3   // Enable
#define DIAG_PIN D8
#define POSITIVE_DIRECTION HIGH  // invert direction
#define NEGATIVE_DIRECTION LOW   // invert direction

const int MICROSTEPS = 128;

// !stepper
const int RESOLUTION = 200;               // Steps/turn
const float RATIO = (20.0 / 32.0) * 4.0;  // geometry
const int SPEED_IN_STEPS_PER_SECOND = 5 * RESOLUTION * MICROSTEPS;
const int ACCELERATION_IN_STEPS_PER_SECOND = 800 * MICROSTEPS;
const int DECELERATION_IN_STEPS_PER_SECOND = 800 * MICROSTEPS;
const float maxDistanceToMoveInMillimeters = 80;

// #define RXD1 D6 // <<<<<<<<
// #define TXD1 D7 // <<<<<<<<<

void init_Stepper() {
    // SoftSerial.begin(115200);
    MySerial1.begin(115200, SERIAL_8N1, D6, D7);

    delay(500);
    // TMCdriver.beginSerial(11520); // Initialize UART

    pinMode(EN_PIN, OUTPUT);
    pinMode(STP_PIN, OUTPUT);
    pinMode(DIR_PIN, OUTPUT);
    //! pinMode(DIAG_PIN, INPUT);
    digitalWrite(EN_PIN, LOW);  // Enable driver in hardware

    TMCdriver.begin();                 // UART: Init SW UART (if selected) with default 115200 baudrate
    TMCdriver.toff(3);                 // Enables driver in software
    TMCdriver.rms_current(400);        // Set motor RMS current
    TMCdriver.microsteps(MICROSTEPS);  // Set microsteps
    delay(100);

    stepper.connectToPins(STP_PIN, DIR_PIN);
    stepper.setDirectionToHome(1);  // tell the ESP_flexystepper in which direction to move when homing is required (only works with a homing / limit switch connected)
    stepper.setSpeedInStepsPerSecond(SPEED_IN_STEPS_PER_SECOND);
    stepper.setAccelerationInStepsPerSecondPerSecond(ACCELERATION_IN_STEPS_PER_SECOND);
    stepper.setDecelerationInStepsPerSecondPerSecond(DECELERATION_IN_STEPS_PER_SECOND);

    stepper.setStepsPerMillimeter(200 * MICROSTEPS / RATIO);
    stepper.registerTargetPositionReachedCallback(targetPositionReachedCallback);
    stepper.startAsService(1);  // you might get away with starting the service on core 0, if you experience jitter, start it on core 1

    // Ask for the current setting
    // uint16_t current = TMCdriver.rms_current();
    // Serial.print("Current RMS set inside the driver: ");
    // Serial.println(current);
}

void targetPositionReachedCallback(long position) {
    Neopixel(GREEN);
    // Serial.printf("Stepper reached target position %ld\n", position);
}

void moveMotorAbs(float absolutePositionToMoveToInMillimeters) {
    Neopixel(BLUE);
    stepper.setTargetPositionInMillimeters(absolutePositionToMoveToInMillimeters * (-1));
}

boolean homeMotor() {
    // langsamer
    stepper.setSpeedInStepsPerSecond(SPEED_IN_STEPS_PER_SECOND * 0.5);
    stepper.setAccelerationInStepsPerSecondPerSecond(ACCELERATION_IN_STEPS_PER_SECOND * 0.5);
    stepper.setDecelerationInStepsPerSecondPerSecond(DECELERATION_IN_STEPS_PER_SECOND * 0.5);

    // Optional -> Fall 1: Limit switch triggered -> Rausfahren
    if (check_limitSwitch() == true) {
        stepper.setCurrentPositionAsHomeAndStop();
        stepper.moveToPositionInMillimeters(-10);
        while (stepper.motionComplete() == false) {
            delay(1);
        }
    }

    // Fall 2: Limit switch not triggered -> Einfahren
    if (check_limitSwitch() == false) {
        stepper.moveToHomeInMillimeters(-1, SPEED_IN_STEPS_PER_SECOND, maxDistanceToMoveInMillimeters + 5.0, ES_PIN);
        while (stepper.motionComplete() == false) {
            delay(1);
        }
        stepper.setCurrentPositionAsHomeAndStop();
        stepper.moveToPositionInMillimeters(5);
        while (stepper.motionComplete() == false) {
            delay(1);
        }
        stepper.setCurrentPositionAsHomeAndStop();

        // Geschwindigkeiten normal machen
        stepper.setSpeedInStepsPerSecond(SPEED_IN_STEPS_PER_SECOND);
        stepper.setAccelerationInStepsPerSecondPerSecond(ACCELERATION_IN_STEPS_PER_SECOND);
        stepper.setDecelerationInStepsPerSecondPerSecond(DECELERATION_IN_STEPS_PER_SECOND);

        Neopixel(GREEN);
    }
    return true;
}