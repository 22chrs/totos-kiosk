//
// Created by André Heine on 26.08.22.
//

#include "BookTotal.hpp"

Cmd::BookTotal::BookTotal()
        : Zvt::Apdu(0x06, 0x24)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(0, 6)))
          , _receipt_no(Zvt::BMP_87, Zvt::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(0, 2))
{
    this->addBmp(this->_receipt_no);
    this->addBmp(this->_amount);
}
// if no amount is set we can cancel the pre_auth
Cmd::BookTotal::BookTotal(unsigned int receiptNo)
        : Zvt::Apdu(0x06, 0x24)
          , _receipt_no(Zvt::BMP_87, Zvt::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(receiptNo, 2))
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(0, 6)))
{
    this->addBmp(this->_receipt_no);
    this->addBmp(this->_amount);
}

Cmd::BookTotal::BookTotal(unsigned int receiptNo, unsigned long amount)
        : Zvt::Apdu(0x06, 0x24)
          , _receipt_no(Zvt::BMP_87, Zvt::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(receiptNo, 2))
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amount, 6)))
{
    this->addBmp(this->_receipt_no);
    this->addBmp(this->_amount);
}

Cmd::BookTotal::BookTotal(std::vector<unsigned char> receiptNo, std::vector<unsigned char> amount)
        : Zvt::Apdu(0x06, 0x24)
          , _receipt_no(Zvt::BMP_87, Zvt::Two_Byte_Bcd, receiptNo)
          , _amount(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, amount))
{
    this->addBmp(this->_receipt_no);
    this->addBmp(this->_amount);
}

Cmd::BookTotal::~BookTotal()
{

}
