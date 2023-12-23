//
// Created by André Heine on 22.12.23.
//

#include "Reservation.hpp"


Cmd::Reservation::Reservation()
        : Zvt::Apdu(0x06, 0x22)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(0, 6)))
{
    this->addBmp(this->_amount);
}
// if no amount is set we can cancel the pre_auth
Cmd::Reservation::Reservation(std::string amount)
        : Zvt::Apdu(0x06, 0x22)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(std::stoul(amount), 6)))
{
    this->addBmp(this->_amount);
}

Cmd::Reservation::Reservation(unsigned long amount)
        : Zvt::Apdu(0x06, 0x22)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amount, 6)))
{
    this->addBmp(this->_amount);
}

Cmd::Reservation::Reservation(std::vector<unsigned char> amount)
        : Zvt::Apdu(0x06, 0x22)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, amount))
{
    this->addBmp(this->_amount);
}

Cmd::Reservation::~Reservation()
{

}
