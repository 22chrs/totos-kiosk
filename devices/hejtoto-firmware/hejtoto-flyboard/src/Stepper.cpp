// Stepper.cpp

#include <Stepper.h>

SoftwareSerial SoftSerial(SW_RX_PIN, SW_TX_PIN); // Be sure to connect RX to TX and TX to RX between both devices
TMC2209Stepper TMCdriver(&SoftSerial, R_SENSE, DRIVER_ADDRESS);

Stepper motor(DIR_PIN, STP_PIN);
StepControl controller;

void init_Stepper()
{
    SoftSerial.begin(11520);
    // TMCdriver.beginSerial(11520); // Initialize UART

    pinMode(EN_PIN, OUTPUT);
    pinMode(STP_PIN, OUTPUT);
    pinMode(DIR_PIN, OUTPUT);
    // pinMode(DIAG_PIN, INPUT);
    digitalWrite(EN_PIN, LOW); // Enable driver in hardware

    TMCdriver.begin();                // UART: Init SW UART (if selected) with default 115200 baudrate
    TMCdriver.toff(5);                // Enables driver in software
    TMCdriver.rms_current(400);       // Set motor RMS current
    TMCdriver.microsteps(MICROSTEPS); // Set microsteps

    motor.setMaxSpeed(maxSpeed);         // stp/s
    motor.setAcceleration(acceleration); // stp/s^2
}

void moveMotorToAbsPosition(float newPosition)
{
    motor.setTargetAbs(newPosition);
    controller.move(motor);
}

void moveMotorRel(float newPosition)
{
    motor.setTargetRel(newPosition);
    controller.move(motor);
}

bool motorMovingState()
{
    return (controller.isRunning());
}

void stopMotor()
{
    controller.stop();
}

void setPositionMotor(float position)
{
    motor.setPosition(position);
}

void setSpeedMotor(long speed)
{
    motor.setMaxSpeed(speed);
}

boolean homeMotor()
{
    if (check_limitSwitch() == 1)
    {
        for (int attempt = 0; attempt < 3 && check_limitSwitch() == 1; attempt++)
        {
            Serial.println("Endstop is triggered. Move Motor a bit out.");
            moveMotorRel(maxTravel * (-0.03)); // Move 3% back

            while (motorMovingState() == 1)
            { // Wait for the motor to stop moving
                delay(1);
            }
        }
        if (check_limitSwitch() == 1)
        {
            Serial.println("Homing Error. Endstop initally and still triggered after 3 attempts.");
            return false;
        }
    }

    if (check_limitSwitch() == 0) // Endstop is not triggered
    {
        Serial.println("Endstop is not triggered. Begin homing routine.");
        setPositionMotor(0);
        moveMotorToAbsPosition(maxTravel * (-1)); // Rückwärts fahren

        while (motorMovingState() == 1) // Motor is moving
        {
            if (check_limitSwitch() == 1)
            {
                Serial.println("Endstop triggered. Stop.");
                stopMotor();
                break;
            }
        }
        setSpeedMotor(maxSpeed * 0.1); // 3% of normal Speed
        for (int attempt = 0; attempt < 3 && check_limitSwitch() == 1; attempt++)
        {
            Serial.println("Endstop is triggered. Move Motor a bit out.");
            moveMotorRel(maxTravel * (-0.03)); // Move 3% back

            while (motorMovingState() == 1)
            { // Wait for the motor to stop moving
                delay(1);
            }
        }
        if (check_limitSwitch() == 1)
        {
            Serial.println("Homing Error. Endstop still triggered after 3 attempts, check for persistent issues.");
            return false;
        }
        else
        {
            Serial.println("Endstop cleared.");
        }
        Serial.println("Homing slow...");
        moveMotorToAbsPosition(0);
        while (motorMovingState() == 1)
        {
            if (check_limitSwitch() == 1)
            {
                stopMotor();
                Serial.println("Endstop successfully reached.");
                setSpeedMotor(maxSpeed); // normal Speed
                Serial.println("Move Motor to homeShift.");
                moveMotorToAbsPosition(homeShift);
                setPositionMotor(0);
                Serial.println("Position saved as 0.");
                Serial.println("Homing Successful.");
                return true;
            }
            else
            {
                Serial.println("X: Homing failed.");
                return false;
            }
        }
    }
    // If none of the conditions for a successful homing are met, return false
    Serial.println("Homing failed."); // Optional: add this line if you want to log the failure before returning
    return false;
}