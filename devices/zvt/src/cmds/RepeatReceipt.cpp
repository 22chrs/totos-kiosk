//
// Created by André Heine on 15.01.21.
//
#include <cmds/RepeatReceipt.hpp>

#include <Bmp.hpp>

Cmd::RepeatReceipt::RepeatReceipt()
        : Zvt::Apdu(0x06, 0x20), _password("010203"), _service_byte(0x01), _tlv(Zvt::Tlv())
{
    this->addBmp(Zvt::HexToByte(password()));
    this->addBmp(Zvt::Bmp(Zvt::BMP_03,0x1));
}

Cmd::RepeatReceipt::~RepeatReceipt()
{
}

