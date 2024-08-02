// Stepper.h

#ifndef SERIALCOMMANDS_H
#define SERIALCOMMANDS_H

#include <LimitSwitch.h>
#include <Stepper.h>
#include <_global.h>

// Serial input buffer
const int bufferSize = 32;
inline char inputBuffer[bufferSize];
inline int bufferIndex = 0;

void loopSerialCommands();
void processCommand();

#endif