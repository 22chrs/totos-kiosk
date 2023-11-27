/*
 * EndOfDay.cpp
 *
 *  Created on: 24.11.2020
 *      Author: ah
 */

#include <cmds/EndOfDay.hpp>

Cmd::EndOfDay::EndOfDay() :
		Zvt::Apdu(0x06, 0x50), _password("010203"), _mode(Cmd::EndOfDay::NORMAL)
{
    this->init();
}

Cmd::EndOfDay::EndOfDay(const std::string password) :
        Zvt::Apdu(0x06, 0x50), _password(password), _mode(Cmd::EndOfDay::NORMAL)
{
    this->init();
}

Cmd::EndOfDay::EndOfDay(const unsigned char mode) :
        Zvt::Apdu(0x06, 0x50), _password("010203"), _mode(mode >= 0x00 && mode <=  0x03 ? mode : NORMAL)
{
    this->init();
}

Cmd::EndOfDay::EndOfDay(const std::string password, const unsigned char mode) :
        Zvt::Apdu(0x06, 0x50), _password(password), _mode(mode >= 0x00 && mode <=  0x03 ? mode : NORMAL)
{
    this->init();
}

Cmd::EndOfDay::~EndOfDay()
{
}

Cmd::EndOfDay::EndOfDay(const Cmd::EndOfDay& other) :
		Zvt::Apdu(other.ccrc(), other.aprc()), _password(other.password()), _mode(other.mode())
{
    this->init();
}

void Cmd::EndOfDay::init()
{
    Zvt::Tlv tlv;
    Zvt::Tag tag1f26(0x1f,0x26,{mode()});

    tlv.add(tag1f26);

    this->addBmp(Zvt::HexToByte(password()));
    this->addBmp(tlv.all());
}

