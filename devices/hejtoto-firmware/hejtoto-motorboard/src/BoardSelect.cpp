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
        {"Rodell_A", 0, 1500, 1000, 1000, (1), 555, 5, false, false, 0},
        // Lift A (Zähnezahl 20 -> Zähnezahl 38, Pitch 2) => 20/38*2 mm/U = 20/19 mm/U
        {"Lift_A", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false, false, 0},

        // Rodell B (Zähnezahl 20 -> Zähnezahl ###) //! ###
        {"Rodell_B", 0, 1500, 1000, 1000, (1), 555, 5, false, false, 0},
        // Lift B (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_B", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false, false, 0},

        // Rodell C (Zähnezahl 20 -> Zähnezahl ###) //! ###
        {"Rodell_C", 0, 1500, 1000, 1000, (1), 555, 5, false, false, 0},
        // Lift C (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_C", 0, 1500, 9000, 10000, (20 / 19), 700, 5, false, false, 0},
    }};

const BoardConfig RoboCubeFrontConfig = {
    "RoboCubeFront",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield_A", 0, 1700, 9000, 10000, 8, 333, 5, false, true, 1},

        // Schleuse (Pitch 8)
        {"Schleuse", 0, 1700, 9000, 10000, 8, 193, -3, false, false, 0},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0},

        // Snackbar (Zähnezahl 20) => 2*20 mm/U = 40mm/U
        {"Snackbar", 0, 1800, 7000, 3000, 40, 1000, 5, false, false, 0},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 300, 1500, 1000, 10000, 40, 645, -12, false, false, 0},

        // Shield B (Pitch 8)
        {"Shield_B", 0, 0, 0, 0, 0, 0, 0, false, true, 1},

    }};

const BoardConfig RoboCubeBackConfig = {
    "RoboCubeBack",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/step], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield_A", 0, 1700, 9000, 10000, 8, 333, 5, false, true, 1},

        // Schleuse (Pitch 8)
        {"Schleuse", 0, 1700, 9000, 10000, 8, 193, -3, false, false, 0},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 0, 1500, 9000, 10000, 40, 645, -12, false, false, 0},

        // Shield B (Pitch 8)
        {"Shield_B", 0, 0, 0, 0, 0, 0, 0, false, true, 1},
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
