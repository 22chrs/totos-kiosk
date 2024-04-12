// BoardSelect.cpp

#include <BoardSelect.h>
#include <Stepper.h>

// Define the board variable
byte board = 0;

// Configurations for each board type
const BoardConfig ServiceCubeConfig = {
    "ServiceCube",
    {
        // current [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection
        //! ratio = (PULLY_MOTOR / PULLY_SCREW) * LEAD_SCREW / (RESOLUTION * MICROSTEPS)

        {1000, 5000, 5000, 2 / (RESOLUTION / MICROSTEPS), 555, 5, false},          // Stepper 1 //! geraten! Lift_1
        {1000, 5000, 5000, (20 / 80) / (RESOLUTION / MICROSTEPS), 333, 5, false},  // Stepper 2 //! geraten! Karusell_1
        {1000, 10000, 5000, 2 / (RESOLUTION / MICROSTEPS), 555, 5, false},         // Stepper 3 //! geraten! Lift_2
        {1000, 10000, 5000, (20 / 80) / (RESOLUTION / MICROSTEPS), 333, 5, false}, // Stepper 4 //! geraten! Karusell_2
        {1000, 10000, 5000, 2 / (RESOLUTION / MICROSTEPS), 555, 5, false},         // Stepper 5 //! geraten! Lift_3
        {1000, 10000, 5000, (20 / 80) / (RESOLUTION / MICROSTEPS), 333, 5, false}, // Stepper 6 //! geraten! Karusell_3
    }};

const BoardConfig RoboCubeFrontConfig = {
    "RoboCubeFront",
    {
        // current [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection
        {1000, 10000, 50000, 1 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 1 //! geraten! Becherschubser_front
        {1000, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 2 //! geraten! Schleuse_front
        {1500, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 3 //! geraten! Terminal_A_front
        {1500, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 4 //! geraten! Terminal_B_front
        {1500, 10000, 50000, (1 / 5) / (RESOLUTION / MICROSTEPS), 333, 5, false}, // Stepper 5 //! geraten! Zucker_front
        {1500, 10000, 50000, 1 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 6 //! geraten! Snacks
    }};

const BoardConfig RoboCubeBackConfig = {
    "RoboCubeBack",
    {
        // current [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection
        {1000, 10000, 50000, 1 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 1 //! geraten! Becherschubser_back
        {1000, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 2 //! geraten! Schleuse_back
        {1500, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 3 //! geraten! Terminal_A_back
        {1500, 10000, 50000, 8 / (RESOLUTION / MICROSTEPS), 333, 5, false},       // Stepper 4 //! geraten! Terminal_B_back
        {1500, 10000, 50000, (1 / 5) / (RESOLUTION / MICROSTEPS), 333, 5, false}, // Stepper 5 //! geraten! Zucker_back
        {1500, 10000, 50000, 1 / (RESOLUTION / MICROSTEPS), 0, 5, false},         // Stepper 6 //! not connected
    }};

const BoardConfig *currentBoardConfig = nullptr;

void init_BoardSelect()
{
    mcp.pinMode(J1_PIN, INPUT);
    mcp.pinMode(J2_PIN, INPUT);

    bool J1 = mcp.digitalRead(J1_PIN);
    bool J2 = mcp.digitalRead(J2_PIN);

    if ((J1 == LOW) && (J2 == LOW))
    {
        currentBoardConfig = &ServiceCubeConfig;
        Serial.println("Board = ServiceCube");
        board = SERVICE_CUBE;
    }
    else if ((J1 == HIGH) && (J2 == LOW))
    {
        currentBoardConfig = &RoboCubeFrontConfig;
        Serial.println("Board = RoboCube Front");
        board = ROBOCUBE_FRONT;
    }
    else if ((J1 == LOW) && (J2 == HIGH))
    {
        currentBoardConfig = &RoboCubeBackConfig;
        Serial.println("Board = RoboCube Back");
        board = ROBOCUBE_BACK;
    }
}
