// BoardSelect.cpp

#include <BoardSelect.h>
#include <Stepper.h>

// Define the board variable
byte board = 0;

// Configurations for each board type
const BoardConfig ServiceCubeConfig = {
    "ServiceCube",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection
        //! ratio = (PULLY_MOTOR / PULLY_SCREW) * LEAD_SCREW / (RESOLUTION * MICROSTEPS)

        // Rodell A (Zähnezahl 20 -> Zähnezahl ###) => ### 20/### mm/U //! ###
        {"Rodell_A", 0, 1500, 1000, 1000, (1), 555, 5, false},
        // Lift A (Zähnezahl 20 -> Zähnezahl 38, Pitch 2) => 20/38*2 mm/U = 20/19 mm/U
        {"Lift_A", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false},

        // Rodell B (Zähnezahl 20 -> Zähnezahl ###) //! ###
        {"Rodell_B", 0, 1500, 1000, 1000, (1), 555, 5, false},
        // Lift B (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_B", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false},

        // Rodell C (Zähnezahl 20 -> Zähnezahl ###) //! ###
        {"Rodell_C", 0, 1500, 1000, 1000, (1), 555, 5, false},
        // Lift C (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_C", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false},
    }};

const BoardConfig RoboCubeFrontConfig = {
    "RoboCubeFront",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield", 1700, 1700, 7000, 8000, 8, 192, 0.2, false},

        // Schleuse (Pitch 8)
        {"Schleuse", 1700, 1700, 7000, 8000, 8, 193, -3, false},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false},

        // Snackbar (Zähnezahl 20) => 2*20 mm/U = 40mm/U
        {"Snackbar", 0, 1800, 6000, 1500, 40, 950, -5, false},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 1500, 1500, 9000, 5000, 40, 645, -10, false},

        // Shield B (Pitch 8)
        {"Shield", 1700, 1700, 7000, 8000, 8, 192, -0.2, false},

    }};

const BoardConfig RoboCubeBackConfig = {
    "RoboCubeBack",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield", 1700, 1700, 7000, 8000, 8, 192, 0.2, false},

        // Schleuse (Pitch 8)
        {"Schleuse", 1700, 1700, 7000, 8000, 8, 193, -3, false},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 1500, 1500, 9000, 5000, 40, 645, -10, true},

        // Shield B (Pitch 8)
        {"Shield", 1700, 1700, 7000, 8000, 8, 192, -0.2, false},
    }};

const BoardConfig *currentBoardConfig = nullptr;

void init_BoardSelect() {
    mcp.pinMode(J1_PIN, INPUT);
    mcp.pinMode(J2_PIN, INPUT);

    bool J1 = mcp.digitalRead(J1_PIN);
    bool J2 = mcp.digitalRead(J2_PIN);

    if ((J1 == LOW) && (J2 == LOW)) {
        currentBoardConfig = &ServiceCubeConfig;
        Serial.println("Board = ServiceCube");
        board = SERVICE_CUBE;
    } else if ((J1 == HIGH) && (J2 == LOW)) {
        currentBoardConfig = &RoboCubeFrontConfig;
        Serial.println("Board = RoboCube Front");
        board = ROBOCUBE_FRONT;
    } else if ((J1 == LOW) && (J2 == HIGH)) {
        currentBoardConfig = &RoboCubeBackConfig;
        Serial.println("Board = RoboCube Back");
        board = ROBOCUBE_BACK;
    }
}
