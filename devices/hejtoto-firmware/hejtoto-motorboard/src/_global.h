#ifndef _MAIN_H
#define _MAIN_H

#include <Arduino.h>
#include <Chrono.h>
#include <Wire.h>  // I2C

inline uint32_t BaudRateSerial = 115200;

// Simulate a Testboard
inline String TestBoard = "RoboCubeFront";  // make RoboCubeFront, RoboCubeBack, ServiceCube // MCP has to be unconnected // nude Teensys only

#endif