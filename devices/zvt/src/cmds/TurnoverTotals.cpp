//
// Created by André Heine on 15.01.21.
//
#include <cmds/TurnoverTotals.hpp>

Cmd::TurnoverTotals::TurnoverTotals()
        : Zvt::Apdu(0x06, 0x10), _password("010203")
{
    this->addBmp(Zvt::HexToByte(password()));
}

Cmd::TurnoverTotals::TurnoverTotals(std::string pass)
        : Zvt::Apdu(0x06, 0x10), _password(pass)
{
    this->addBmp(Zvt::HexToByte(password()));
}

Cmd::TurnoverTotals::~TurnoverTotals()
{
}

