#ifndef PINOUT_H
#define PINOUT_H

// I2C
constexpr int PIN_SDA = 5;
constexpr int PIN_SCL = 4;

// RS485
constexpr int PIN_RS485_RX = 3;
constexpr int PIN_RS485_TX = 1;

// Steper motor
constexpr int PIN_STP = 14;

// Servo vaccum
constexpr int PIN_SERVO_PWM = 12;

// Neopixel
constexpr int PIN_NEOPIXEL = 13;

// Endstops
constexpr int PIN_ENDSTOP_INTERRUPT = 2;

// Light sensor
constexpr int PIN_LIGHTSENSOR = A0; // ADC

// MCP23017
// '0b0100000' = 0x20 (A0=GND, A1=GND, A2=GND)
// '0b0100001' = 0x21 (A0=VCC, A1=GND, A2=GND)
// '0b0100010' = 0x22 (A0=GND, A1=VCC, A2=GND)
// '0b0100011' = 0x23 (A0=VCC, A1=VCC, A2=GND)
// '0b0100100' = 0x24 (A0=GND, A1=GND, A2=VCC)
// '0b0100101' = 0x25 (A0=VCC, A1=GND, A2=VCC)
// '0b0100110' = 0x26 (A0=GND, A1=VCC, A2=VCC)
// '0b0100111' = 0x27 (A0=VCC, A1=VCC, A2=VCC)

constexpr int MCP23017_ADDRESS = 0x20;
constexpr int PIN_MCP23017_EN = 0;      // GPB0
constexpr int PIN_MCP23017_DIR = 1;     // GPB1
constexpr int PIN_MCP23017_PDN = 2;     // GPB2
constexpr int PIN_MCP23017_ENDSTOP = 3; // GPB3
constexpr int PIN_MCP23017_DIAG = 4;    // GPB4
                                        // Interrupt on INTA

#endif // PINOUT_H
