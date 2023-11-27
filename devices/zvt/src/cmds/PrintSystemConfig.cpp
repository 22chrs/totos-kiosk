/*
 * Ack.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/PrintSystemConfig.hpp>

Cmd::PrintSystemConfig::PrintSystemConfig()
        : Zvt::Apdu(0x06, 0x1A)
{
}

Cmd::PrintSystemConfig::~PrintSystemConfig()
{
}

