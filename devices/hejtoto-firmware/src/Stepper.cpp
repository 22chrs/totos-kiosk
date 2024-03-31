// Stepper.cpp

#include <Stepper.h>

void init_StepperDrivers()
{
    //! Driver 1
    mcp.pinMode(EN1_PIN, OUTPUT);
    mcp.pinMode(DIR1_PIN, OUTPUT);
    mcp.pinMode(DIR1_PIN_DUMMY, OUTPUT);
    pinMode(STP1_PIN, OUTPUT);
    mcp.digitalWrite(EN1_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_1.begin(115200);                                 // HW UART drivers
    TMC_driver_1.toff(5);                                        // Enables driver in software
    TMC_driver_1.rms_current(currentConfig->stepper[0].current); // mA
    TMC_driver_1.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_1.pwm_autoscale(true);                            // Needed for stealthChop

    //! Driver 2
    mcp.pinMode(EN2_PIN, OUTPUT);
    mcp.pinMode(DIR2_PIN, OUTPUT);
    mcp.pinMode(DIR2_PIN_DUMMY, OUTPUT);
    pinMode(STP2_PIN, OUTPUT);
    mcp.digitalWrite(EN2_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_2.begin(115200);                                 // HW UART drivers
    TMC_driver_2.toff(5);                                        // Enables driver in software
    TMC_driver_2.rms_current(currentConfig->stepper[1].current); // mA
    TMC_driver_2.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_2.pwm_autoscale(true);                            // Needed for stealthChop

    //! Driver 3
    mcp.pinMode(EN3_PIN, OUTPUT);
    mcp.pinMode(DIR3_PIN, OUTPUT);
    mcp.pinMode(DIR3_PIN_DUMMY, OUTPUT);
    pinMode(STP3_PIN, OUTPUT);
    mcp.digitalWrite(EN3_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_3.begin(115200);                                 // HW UART drivers
    TMC_driver_3.toff(5);                                        // Enables driver in software
    TMC_driver_3.rms_current(currentConfig->stepper[2].current); // mA
    TMC_driver_3.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_3.pwm_autoscale(true);                            // Needed for stealthChop

    //! Driver 4
    mcp.pinMode(EN4_PIN, OUTPUT);
    mcp.pinMode(DIR4_PIN, OUTPUT);
    mcp.pinMode(DIR4_PIN_DUMMY, OUTPUT);
    pinMode(STP4_PIN, OUTPUT);
    mcp.digitalWrite(EN4_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_4.begin(115200);                                 // HW UART drivers
    TMC_driver_4.toff(5);                                        // Enables driver in software
    TMC_driver_4.rms_current(currentConfig->stepper[3].current); // mA
    TMC_driver_4.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_4.pwm_autoscale(true);                            // Needed for stealthChop

    //! Driver 5
    mcp.pinMode(EN5_PIN, OUTPUT);
    mcp.pinMode(DIR5_PIN, OUTPUT);
    mcp.pinMode(DIR5_PIN_DUMMY, OUTPUT);
    pinMode(STP5_PIN, OUTPUT);
    mcp.digitalWrite(EN5_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_5.begin(115200);                                 // HW UART drivers
    TMC_driver_5.toff(5);                                        // Enables driver in software
    TMC_driver_5.rms_current(currentConfig->stepper[4].current); // mA
    TMC_driver_5.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_5.pwm_autoscale(true);                            // Needed for stealthChop

    //! Driver 6
    mcp.pinMode(EN6_PIN, OUTPUT);
    mcp.pinMode(DIR6_PIN, OUTPUT);
    mcp.pinMode(DIR6_PIN_DUMMY, OUTPUT);
    pinMode(STP6_PIN, OUTPUT);
    mcp.digitalWrite(EN6_PIN, LOW); // Enable driver in hardware

    SERIAL_PORT_6.begin(115200);                                 // HW UART drivers
    TMC_driver_6.toff(5);                                        // Enables driver in software
    TMC_driver_6.rms_current(currentConfig->stepper[5].current); // mA
    TMC_driver_6.microsteps(MICROSTEPS);                         // Set microsteps to 1/16th
    TMC_driver_6.pwm_autoscale(true);                            // Needed for stealthChop
}

void init_Motors()
{
    TS4::begin();

    //! Driver 1
    stepper_1
        .setMaxSpeed(currentConfig->stepper[0].maxSpeed)
        .setAcceleration(currentConfig->stepper[0].acceleration);

    //! Driver 2
    stepper_2
        .setMaxSpeed(currentConfig->stepper[1].maxSpeed)
        .setAcceleration(currentConfig->stepper[1].acceleration);

    //! Driver 3
    stepper_3
        .setMaxSpeed(currentConfig->stepper[2].maxSpeed)
        .setAcceleration(currentConfig->stepper[2].acceleration);

    //! Driver 4
    stepper_4
        .setMaxSpeed(currentConfig->stepper[3].maxSpeed)
        .setAcceleration(currentConfig->stepper[3].acceleration);

    //! Driver 5
    stepper_5
        .setMaxSpeed(currentConfig->stepper[4].maxSpeed)
        .setAcceleration(currentConfig->stepper[4].acceleration);

    //! Driver 6
    stepper_6
        .setMaxSpeed(currentConfig->stepper[5].maxSpeed)
        .setAcceleration(currentConfig->stepper[5].acceleration);
}

void moveMotor(byte stepperNumber, float length)
{
    if (length == 0)
    {
        return; // No movement required
    }
    // Determine the direction pin state and set it
    bool direction = (length > 0);

    switch (stepperNumber)
    {
    case 1:
        mcp.digitalWrite(DIR1_PIN, direction ? HIGH : LOW);
        stepper_1.moveRelAsync(length);
        break;
    case 2:
        mcp.digitalWrite(DIR2_PIN, direction ? HIGH : LOW);
        stepper_2.moveRelAsync(length);
        break;
    case 3:
        mcp.digitalWrite(DIR3_PIN, direction ? HIGH : LOW);
        stepper_3.moveRelAsync(length);
        break;
    case 4:
        mcp.digitalWrite(DIR1_PIN, direction ? HIGH : LOW);
        stepper_1.moveRelAsync(length);
        break;
    case 5:
        mcp.digitalWrite(DIR2_PIN, direction ? HIGH : LOW);
        stepper_2.moveRelAsync(length);
        break;
    case 6:
        mcp.digitalWrite(DIR3_PIN, direction ? HIGH : LOW);
        stepper_3.moveRelAsync(length);
        break;

    default:
        // Handle invalid stepper number if necessary
        break;
    }
}

bool motorMovingState(byte stepperNumber)
{
    switch (stepperNumber)
    {
    case 1:
        return stepper_1.isMoving;
    case 2:
        return stepper_2.isMoving;
    case 3:
        return stepper_3.isMoving;
    case 4:
        return stepper_4.isMoving;
    case 5:
        return stepper_5.isMoving;
    case 6:
        return stepper_6.isMoving;
    default:
        // Handle the case where an invalid stepper number is provided
        return false;
    }
}

void homeMotor(byte stepperNumber)
{
    // stepper_1.setPosition(0);
}