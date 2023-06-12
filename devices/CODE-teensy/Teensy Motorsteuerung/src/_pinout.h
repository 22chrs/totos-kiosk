#ifndef PINOUT_H
#define PINOUT_H

// Here, define all your pins
constexpr int PIN_LED = 13;
constexpr int PIN_BUTTON = 12;

// I2C
constexpr int PIN_SDA = 18;
constexpr int PIN_SCL = 19;

// Steper motor
constexpr int PIN_STP_1 = 38;
constexpr int PIN_STP_2 = 39;
constexpr int PIN_STP_3 = 34;
constexpr int PIN_STP_4 = 35;

constexpr int PIN_STP_5 = 15;
constexpr int PIN_STP_6 = 16;
constexpr int PIN_STP_7 = 17;
constexpr int PIN_STP_8 = 20;

constexpr int PIN_STP_9 = 21;
constexpr int PIN_STP_10 = 22;
constexpr int PIN_STP_11 = 23;
constexpr int PIN_STP_12 = 24;

constexpr int PIN_STP_13 = 2;
constexpr int PIN_STP_14 = 6;
constexpr int PIN_STP_15 = 9;
constexpr int PIN_STP_16 = 10;

constexpr int PIN_STP_17 = 31;
constexpr int PIN_STP_18 = 3;
constexpr int PIN_STP_19 = 4;
constexpr int PIN_STP_20 = 5;

constexpr int PIN_STEPPER_MISO = 41;
constexpr int PIN_STEPPER_MOSI = 26;
constexpr int PIN_STEPPER_SCK = 27;

// Endstops
constexpr int PIN_ENDSTOP_INTERRUPT = 40;

// MCP23S17
constexpr int PIN_MCP23S17_MOSI = 11;
constexpr int PIN_MCP23S17_MISO = 12;
constexpr int PIN_MCP23S17_SCK = 14;
// '0b0100000' = 0x20 (A0=GND, A1=GND, A2=GND)
// '0b0100001' = 0x21 (A0=VCC, A1=GND, A2=GND)
// '0b0100010' = 0x22 (A0=GND, A1=VCC, A2=GND)
// '0b0100011' = 0x23 (A0=VCC, A1=VCC, A2=GND)
// '0b0100100' = 0x24 (A0=GND, A1=GND, A2=VCC)
// '0b0100101' = 0x25 (A0=VCC, A1=GND, A2=VCC)
// '0b0100110' = 0x26 (A0=GND, A1=VCC, A2=VCC)
// '0b0100111' = 0x27 (A0=VCC, A1=VCC, A2=VCC)
constexpr int MCP23S17_ADDRESS_MOSFETBOARD = 0x20;
constexpr int PIN_MCP23S17_MOSFETBOARD_S0 = 0; // GPB0
constexpr int PIN_MCP23S17_MOSFETBOARD_S1 = 1; // GPB1
constexpr int PIN_MCP23S17_MOSFETBOARD_S2 = 2; // GPB2
constexpr int PIN_MCP23S17_MOSFETBOARD_S3 = 3; // GPB3

constexpr int MCP23S17_ADDRESS_STEPPERBOARD_A = 0x21;
constexpr int MCP23S17_ADDRESS_STEPPERBOARD_B = 0x22;
constexpr int MCP23S17_ADDRESS_STEPPERBOARD_C = 0x23;
constexpr int MCP23S17_ADDRESS_STEPPERBOARD_D = 0x24;
constexpr int MCP23S17_ADDRESS_STEPPERBOARD_E = 0x25;
constexpr int PIN_MCP23S17_STEPPERBOARD_DIR_1 = 8;      // GPB0
constexpr int PIN_MCP23S17_STEPPERBOARD_PDN_1 = 9;      // GPB1
constexpr int PIN_MCP23S17_STEPPERBOARD_EN_1 = 10;      // GPB2
constexpr int PIN_MCP23S17_STEPPERBOARD_DIR_2 = 11;     // GPB3
constexpr int PIN_MCP23S17_STEPPERBOARD_PDN_2 = 12;     // GPB4
constexpr int PIN_MCP23S17_STEPPERBOARD_EN_2 = 13;      // GPB5
constexpr int PIN_MCP23S17_STEPPERBOARD_ENDSTOP_1 = 14; // GPB6
constexpr int PIN_MCP23S17_STEPPERBOARD_ENDSTOP_2 = 15; // GPB7
constexpr int PIN_MCP23S17_STEPPERBOARD_DIR_3 = 0;      // GPA0
constexpr int PIN_MCP23S17_STEPPERBOARD_PDN_3 = 1;      // GPA1
constexpr int PIN_MCP23S17_STEPPERBOARD_EN_3 = 2;       // GPA2
constexpr int PIN_MCP23S17_STEPPERBOARD_DIR_4 = 3;      // GPA3
constexpr int PIN_MCP23S17_STEPPERBOARD_PDN_4 = 4;      // GPA4
constexpr int PIN_MCP23S17_STEPPERBOARD_EN_4 = 5;       // GPA5
constexpr int PIN_MCP23S17_STEPPERBOARD_ENDSTOP_3 = 6;  // GPA6
constexpr int PIN_MCP23S17_STEPPERBOARD_ENDSTOP_4 = 7;  // GPA7
                                                        // Interrupt on INTA

// RS485
constexpr int PIN_RS485_RX = 0;
constexpr int PIN_RS485_TX = 1;

// NeoPixel
constexpr int PIN_NEOPIXEL_1 = 36;
constexpr int PIN_NEOPIXEL_2 = 37;

// PCA9685PW
// 0x40 (A0=A1=A2=A3=A4=A5=GND)
// 0x41 (A0=VCC, A1=A2=A3=A4=A5=GND)
// 0x42 (A1=VCC, A0=A2=A3=A4=A5=GND)
// 0x43 (A0=A1=VCC, A2=A3=A4=A5=GND)
// 0x44 (A2=VCC, A0=A1=A3=A4=A5=GND)
// 0x45 (A0=A2=VCC, A1=A3=A4=A5=GND)
// ...
// 0x7F (A0=A1=A2=A3=A4=A5=VCC)
constexpr int PCA9685PW_ADDRESS_MOSFETBOARD = 0x50;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_1 = 0;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_2 = 1;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_3 = 2;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_4 = 3;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_5 = 4;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_6 = 5;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_7 = 6;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_8 = 7;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_9 = 8;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_10 = 9;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_FAN_1 = 10;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_FAN_2 = 11;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_FAN_3 = 12;
constexpr int PIN_PCA9685PW_MOSFETBOARD_PWM_FAN_4 = 13;

// TCA9548A
constexpr int PTCA9548A_ADDRESS_MAINBOARD = 0x70;

// CD74HC4067SM96
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_TH1_1 = 1;      // I1
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_TH1_2 = 0;      // I0
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_TH1_3 = 2;      // I2
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_TH1_4 = 3;      // I3
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_FAN_RPM_1 = 8;  // I8
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_FAN_RPM_2 = 9;  // I9
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_FAN_RPM_3 = 10; // I10
constexpr int PIN_CD74HC4067SM96_MOSFETBOARD_FAN_RPM_4 = 11; // I11

#endif // PINOUT_H
