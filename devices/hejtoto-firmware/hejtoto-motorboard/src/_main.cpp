#include <BoardSelect.h>
#include <Fan.h>
#include <Led.h>
#include <LimitSwitch.h>
#include <MCP23017.h>  //0x20
#include <Mosfet.h>
#include <Movements.h>
#include <SerialCommands.h>
#include <Stepper.h>
#include <TCA9548A.h>     //0x70
#include <Temperature.h>  //0x45
#include <ToF.h>          //0x29 (TOF050C)
#include <_global.h>
// #include <USB.h>

Chrono helperChrono;

void setup() {
    init_LEDs();

    Wire.begin();           // Initialize I2C
    Wire.setClock(400000);  // Set I2C speed to 400kHz (Standard 100kHz)

    Serial.begin(115200);  // Start serial communication at 9600 baud
    Serial.println("Serial started.");

    init_TCA9548A();
    init_MCP23017();  // Initialize pins of MCP23017 I/O Expander

    init_BoardSelect();  // Check which board this code runs on
    init_Stepper();      // Initialize stepper motor drivers
    init_LimitSwitch();
    init_doorSensor();
    init_Mosfet();             // Initialize Mosfets
    init_TemperatureSensor();  // Initialize temperature and humidity sensor
    init_Fan();

    // init_TOF200C(3);

    // moveCombinedMotorsToAbsPosition(1, 6, 100);
    //  delay(5000);
    //  moveCombinedMotorsToAbsPosition(1, 6, 0);
    //   moveCombinedMotorsToAbsPosition(1, 6, 0);
    //    moveCombinedMotorsToAbsPosition(1, 6, -100);
    //        moveMotorToAbsPosition(1, 200);
    //        moveMotorToAbsPosition(6, 200);
    //          homeMotor(5);
    //          moveMotorToAbsPosition(2, 1000);

    // pwmFan(3, 0);

    Neopixel(RED);
    // setDriverState("Shield", true);
    // delay(500);

    // homeDevice("Shield");
    // homeDevice("Schleuse");
    homeDevice("Snackbar");
    // homeDevice("Becherschubse");

    //

    // moveDevice("Shield", 192, 50, 50);

    // moveDevice("Shield", 20, 100, 100);
    // delay(20000);

    // moveDevice("Snackbar", 950, 100, 100);
    //   moveDevice("Schleuse", 700, 100, 100);

    buildInLEDBlik();

    // pwmMosfet(1, 20);
    // delay(1000);
    // pwmMosfet(1, 0);

    // moveDevice("Shield", 180);
}

void loop() {
    // if (helperChrono.hasPassed(500)) {
    //     stepperCheckObstruction();  // Call the function

    //     // Reset the Chrono timer
    //     helperChrono.restart();
    // }

    moveDevice("Snackbar", 900, 100, 100);
    delay(10000);
    moveDevice("Snackbar", 0, 100, 100);
    delay(10000);
    //  delay(1000);
    //  moveDevice("Becherschubse", 645);
    //  delay(10000);

    // StepperStatus statusSchleuse, statusBecherschubse, statusSnackbar, statusShield;

    // deviceStatus("Schleuse", statusSchleuse);
    // deviceStatus("Becherschubse", statusBecherschubse);
    // deviceStatus("Snackbar", statusSnackbar);
    // deviceStatus("Shield", statusShield);

    // if (statusSchleuse.position == 0) {
    //     moveDevice("Schleuse", currentBoardConfig->stepper[0].maxTravel, 100, 100);
    // }
    // if (statusBecherschubse.position == 0) {
    //     moveDevice("Becherschubse", currentBoardConfig->stepper[4].maxTravel, 100, 100);
    // }
    // if (statusSnackbar.position == 0) {
    //     moveDevice("Snackbar", currentBoardConfig->stepper[3].maxTravel, 100, 100);
    // }
    // if (statusShield.position == 0) {
    //     moveDevice("Shield", currentBoardConfig->stepper[5].maxTravel, 100, 100);
    // }
    // deviceStatus("Schleuse", statusSchleuse);
    // deviceStatus("Becherschubse", statusBecherschubse);
    // deviceStatus("Snackbar", statusSnackbar);
    // deviceStatus("Shield", statusShield);

    // if (statusSchleuse.position == currentBoardConfig->stepper[0].maxTravel) {
    //     moveDevice("Schleuse", 0, 100, 100);
    // }
    // if (statusBecherschubse.position == currentBoardConfig->stepper[4].maxTravel) {
    //     moveDevice("Becherschubse", 0, 100, 100);
    // }
    // if (statusSnackbar.position == currentBoardConfig->stepper[3].maxTravel) {
    //     moveDevice("Snackbar", 0, 100, 100);
    // }
    // if (statusShield.position == currentBoardConfig->stepper[5].maxTravel) {
    //     moveDevice("Shield", 0, 100, 100);
    // }

    // delay(1000);
    // moveDevice("Becherschubse", 0);
    // delay(10000);

    // loopSerialCommands();
    // testSerialCommunication();
    //   if (motorMovingState(1) == false) {
    //       moveMotorToAbsPosition(1, 0);

    //     // moveMotorToAbsPosition(1, -20000);
    //     //  enableMotor(1, false);
    //     //   moveMotorToAbsPosition(6, 0);
    // }
    // if (motorMovingState(2) == false)
    // {
    //   enableMotor(2, false);
    //   // moveMotorToAbsPosition(6, 0);
    // }

    // check_doorSensor();
    // check_limitSwitches();

    // check_TemperatureSensor();
    // readTOF200C(2);
}
