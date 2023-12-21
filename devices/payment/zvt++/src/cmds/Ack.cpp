/*
 * Ack.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/Ack.hpp>

Cmd::Ack::Ack() :
		Zvt::Apdu(0x80, 0x00)
{
}

Cmd::Ack::~Ack()
{
}

