

#ifndef RS485_H
#define RS485_H

#include <SoftwareSerial.h>
#include <_global.h>

#define RS485_RX D5  // ESP Xiao Sense S3 RX pin
#define RS485_TX D4  // ESP Xiao Sense S3 TX pin

void init_RS485();
void loop_RS485();

#endif
