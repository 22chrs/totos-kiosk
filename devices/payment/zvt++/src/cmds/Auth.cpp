/*
 * Auth.cpp
 *
 *  Created on: 17.11.2020
 *      Author: ah
 */

#include <cmds/Auth.hpp>

Cmd::Auth::Auth()
        : Zvt::Apdu(0x06, 0x01)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(0, 6)))
          , _payment_type(Zvt::Bmp(0x19, Zvt::One_Byte_Binary, {0x44}))
{
    this->addBmp(_amount);
    this->addBmp(_payment_type);
}

Cmd::Auth::Auth(unsigned long amount)
        : Zvt::Apdu(0x06, 0x01)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amount, 6)))
          , _payment_type(Zvt::Bmp(0x19, Zvt::One_Byte_Binary, {0x44}))
{
    this->addBmp(_amount);
    this->addBmp(_payment_type);
}

Cmd::Auth::Auth(const unsigned long amount, const unsigned char payment_type)
        : Zvt::Apdu(0x06, 0x01)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amount, 6)))
          , _payment_type(Zvt::Bmp(0x19, Zvt::One_Byte_Binary, {payment_type}))
{
    this->addBmp(_amount);
    this->addBmp(_payment_type);
}

Cmd::Auth::Auth(const Cmd::Auth &other)
        : Zvt::Apdu(0x06, 0x01)
          , _amount(other.amount())
          , _payment_type(other.payment_type())
{
    this->addBmp(_amount);
    this->addBmp(_payment_type);
}

Cmd::Auth::~Auth()
{
    // TODO Auto-generated destructor stub
}

