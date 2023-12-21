//
// Created by André Heine on 20.05.21.
//

#include <cmds/Reversal.hpp>

Cmd::Reversal::Reversal(const int receipt_no)
        : Zvt::Apdu(0x06, 0x30)
          , _password("010203")
          , _receipt_no(receipt_no)
{
    //std::cout << "default: |" << this->_password << "|" << endl;
    this->addBmp(Zvt::HexToByte(this->_password));
    this->addBmp(Zvt::Bmp(0x87, Zvt::BmpFormat::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(this->_receipt_no, 2)));
}

Cmd::Reversal::Reversal(const int receipt_no, const std::string pass)
        :
        Zvt::Apdu(0x06, 0x30)
        , _password(pass)
        , _receipt_no(receipt_no)
{
    //std::cout << "pass: |" << this->_password << "|" << endl;
    this->addBmp(Zvt::HexToByte(this->_password));
    this->addBmp(Zvt::Bmp(0x87, Zvt::BmpFormat::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(this->_receipt_no, 2)));
}

Cmd::Reversal::Reversal(const Cmd::Reversal &other)
        : Zvt::Apdu(0x06, 0x30)
          , _password(other._password)
          , _receipt_no(other._receipt_no)
{

    //std::cout << "copy: |" << this->_password << "|" << endl;
    this->addBmp(Zvt::HexToByte(this->_password));
    this->addBmp(Zvt::Bmp(0x87, Zvt::BmpFormat::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(this->_receipt_no, 2)));
}

Cmd::Reversal::~Reversal()
{
}
