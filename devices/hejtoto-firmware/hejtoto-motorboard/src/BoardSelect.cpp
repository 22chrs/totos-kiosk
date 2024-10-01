// BoardSelect.cpp

#include <BoardSelect.h>

// Define the board variable
byte board = 0;

// Configurations for each board type
BoardConfig ServiceCubeConfig = {
    "ServiceCube",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/rotation], maxTravel [mm], homeShift [mm], inverseDirection
        //! ratio = (PULLY_MOTOR / PULLY_SCREW) * LEAD_SCREW / (RESOLUTION * MICROSTEPS)

        // Lift A (Zähnezahl 20 -> Zähnezahl 38, Pitch 2) => 20/38*2 mm/U = 20/19 mm/U
        {"Lift_A", 1500, 1500, 8500, 5000, ((20.0 * 8.0) / 32.0), 629, -2.0, false, false, 0.3},
        // Rodell A (Zähnezahl 20 -> Zähnezahl ###) => ### 20/### mm/U
        {"Rodell_A", 1500, 1500, 1000, 1500, (20.0 / 130.0), 1.0, -0.011, false, false, 0.8},

        // Lift B (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_B", 1500, 1500, 8500, 5000, ((20.0 * 8.0) / 32.0), 629, -2.0, false, false, 0.3},
        // Rodell B (Zähnezahl 20 -> Zähnezahl ###)
        {"Rodell_B", 1500, 1500, 1000, 1500, (20.0 / 130.0), 1.0, -0.011, true, false, 0.8},

        // Lift C (Zähnezahl 20 -> Zähnezahl 38, Pitch 2)
        {"Lift_C", 1500, 1500, 8500, 5000, ((20.0 * 8.0) / 32.0), 629, -2.0, false, false, 0.3},
        // Rodell C (Zähnezahl 20 -> Zähnezahl ###)
        {"Rodell_C", 1500, 1500, 1000, 1500, (20.0 / 130.0), 1.0, -0.011, false, false, 0.8},

    }};

BoardConfig RoboCubeFrontConfig = {
    "RoboCubeFront",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/rotation], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield", 1700, 1700, 7000, 8000, 8.0, 192, -0.3, false, false, 0.5},

        // Schleuse (Pitch 8)
        {"Schleuse", 1700, 1700, 6500, 5000, 8.0, 193, -3, false, false, 0.25},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0.15},

        // Snackbar (Zähnezahl 20) => 2*20 mm/U = 40mm/U
        {"Snackbar", 0, 1800, 5000, 1500, 40.0, 950, -5, false, false, 0.2},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 1500, 1500, 9000, 5000, 40.0, 645, -6, false, false, 0.15},

        // Shield B (Pitch 8)
        {"Shield", 1700, 1700, 7000, 8000, 8.0, 192, -0.3, false, false, 0.5},

    }};

BoardConfig RoboCubeBackConfig = {
    "RoboCubeBack",
    {
        // holdCurrent [mA], driveCurrent [mA], maxSpeed [steps/s], acceleration [steps/s^2], ratio [mm/rotation], maxTravel [mm], homeShift [mm], inverseDirection

        // Shield A (Pitch 8)  => 8 mm/U
        {"Shield", 1700, 1700, 7000, 8000, 8.0, 192, -0.3, false, false, 0.5},

        // Schleuse (Pitch 8)
        {"Schleuse", 1700, 1700, 6500, 5000, 8.0, 193, -3, false, false, 0.25},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0.15},

        // Leer
        {"Leer", 0, 0, 0, 0, 0, 0, 0, false, false, 0.15},

        // Becherschubse (Zähnezahl 20) 12.73
        {"Becherschubse", 1500, 1500, 9000, 5000, 40.0, 645, -6, true, false, 0.15},

        // Shield B (Pitch 8)
        {"Shield", 1700, 1700, 7000, 8000, 8.0, 192, -0.3, false, false, 0.5},
    }};

BoardConfig *currentBoardConfig = nullptr;

void init_BoardSelect() {
    if (!mcp.begin_I2C(0x20))  // A0,A1,A2=GND
    {
        if (TestBoard == "RoboCubeFront") {
            currentBoardConfig = &RoboCubeFrontConfig;
            Serial.println("Board = RoboCubeFront");
            board = ROBOCUBE_FRONT;
        }
        if (TestBoard == "RoboCubeBack") {
            currentBoardConfig = &RoboCubeBackConfig;
            Serial.println("Board = RoboCubeBack");
            board = ROBOCUBE_BACK;
        }
        if (TestBoard == "ServiceCube") {
            currentBoardConfig = &ServiceCubeConfig;
            Serial.println("Board = ServiceCube");
            board = SERVICE_CUBE;
        }
    } else {
        mcp.pinMode(J1_PIN, INPUT);
        mcp.pinMode(J2_PIN, INPUT);

        bool J1 = mcp.digitalRead(J1_PIN);
        bool J2 = mcp.digitalRead(J2_PIN);
        Serial.println("init Boardselect doing");

        if ((J1 == LOW) && (J2 == LOW)) {
            currentBoardConfig = &ServiceCubeConfig;
            Serial.println("Board = ServiceCube");
            board = SERVICE_CUBE;
        } else if ((J1 == HIGH) && (J2 == LOW)) {
            currentBoardConfig = &RoboCubeFrontConfig;
            Serial.println("Board = RoboCubeFront");
            board = ROBOCUBE_FRONT;
        } else if ((J1 == LOW) && (J2 == HIGH)) {
            currentBoardConfig = &RoboCubeBackConfig;
            Serial.println("Board = RoboCubeBack");
            board = ROBOCUBE_BACK;
        } else {
            Serial.println("Boardselect Jumper not readable.");
        }
    }
}
