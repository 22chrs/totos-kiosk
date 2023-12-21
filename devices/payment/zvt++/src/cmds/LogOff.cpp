/*
 * Status.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/LogOff.hpp>

/**
 * CLASS INSTR Length	Data block:
 * 05 01 	   xx
 * 						[<password>[03<service-byte>][06<TLV-container>]]
 *
 * Data block:
 * <password>: See chapter Password.
 * 03<service-byte>:
 *
 * Table 12: Definition of <service-byte>
 *
 * If <service-byte> is sent then <password> must also be sent.
 *
 * Service-byte			Definition
 * xxxx xxx1			The PT service-menu of the PT may not be displayed against the function-key on the PT.
 * xxxx xxx0			The PT service-menu of the PT may be displayed against the function-key on the PT.
 * xxxx xx1x			Do NOT send SW-Version in Completion command
 * xxxx xx0x			Do send SW-Version in Completion command, default if no service-byte sent.
 * xxxx x0xx			Do not send further status information in the completion (TLV-container).
 * xxxx x1xx			Send further status information in the TLV-container of the completion.
 * All other			RFU (reserved futur use)
 *
 */
Cmd::LogOff::LogOff() :
		Zvt::Apdu(0x06, 0x02), _password("010203")
{
	this->addBmp(Zvt::HexToByte(this->_password));
}

Cmd::LogOff::LogOff(std::string password) :
        Zvt::Apdu(0x06, 0x02), _password(password)
{
    this->addBmp(Zvt::HexToByte(this->_password));
}

Cmd::LogOff::~LogOff()
{
}

