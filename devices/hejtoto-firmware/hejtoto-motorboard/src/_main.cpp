#include <BoardSelect.h>
#include <Fan.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <MCP23017.h>  //0x20
#include <Mosfet.h>
#include <Stepper.h>
#include <TCA9548A.h>     //0x70
#include <Temperature.h>  //0x45
#include <ToF.h>          //0x29 (TOF050C)
#include <_global.h>
// #include <USB.h>

void setup() {
    init_LEDs();

    Wire.begin();           // Initialize I2C
    Wire.setClock(400000);  // Set I2C speed to 400kHz (Standard 100kHz)

    Serial.begin(115200);  // Start serial communication at 9600 baud
    Serial.println("Serial started.");

    init_TCA9548A();
    init_MCP23017();  // Initialize pins of MCP23017 I/O Expander

    init_BoardSelect();  // Check which board this code runs on

    init_Stepper();  // Initialize stepper motor drivers

    init_Mosfet();             // Initialize Mosfets
    init_TemperatureSensor();  // Initialize temperature and humidity sensor
    init_Fan();

    init_LimitSwitch();
    init_doorSensor();

    // init_TOF200C(3);
    enableMotor(1, true);
    enableMotor(2, true);
    moveMotorToAbsPosition(1, 25000);
    moveMotorToAbsPosition(2, 25000);
    // moveMotorToAbsPosition(2, 1000);

    pwmFan(3, 0);

    Neopixel(GREEN);

    buildInLEDBlik();

    // pwmMosfet(1, 20);
    // delay(1000);
    // pwmMosfet(1, 0);
}

void loop() {
    testSerialCommunication();
    delay(1000);

    if (motorMovingState(1) == false) {
        moveMotorToAbsPosition(1, 0);
        moveMotorToAbsPosition(2, 0);

        // moveMotorToAbsPosition(1, -20000);
        //  enableMotor(1, false);
        //   moveMotorToAbsPosition(6, 0);
    }
    // if (motorMovingState(2) == false)
    // {
    //   enableMotor(2, false);
    //   // moveMotorToAbsPosition(6, 0);
    // }

    // check_doorSensor();
    // check_limitSwitch1();

    // check_TemperatureSensor();
    // readTOF200C(2);
}
