// MCP23017.h

#ifndef MCP23017_H
#define MCP23017_H

#include <_global.h>
#include <Adafruit_MCP23X17.h>

// https://github.com/adafruit/Adafruit-MCP23017-Arduino-Library
// GPA0	0
// GPA0	1
// ..
// GPA7	7
// GPB0	8
// GPB1	9
// ..
// GPB7	15

// MCP23017 PINOUT
// MCP23017 address: 0x20
#define J1_PIN 0
#define J2_PIN 1
#define DIR1_PIN 2
#define DIR2_PIN 3
#define DIR3_PIN 4
#define EN1_PIN 5
#define EN2_PIN 6
#define EN3_PIN 7
#define DES1_PIN 8 //! Pullup
#define DES2_PIN 9 //! Pullup
#define DIR6_PIN 10
#define DIR5_PIN 11
#define DIR4_PIN 12
#define EN6_PIN 13
#define EN5_PIN 14
#define EN4_PIN 15

inline Adafruit_MCP23X17 mcp;

void init_MCP23017();

#endif