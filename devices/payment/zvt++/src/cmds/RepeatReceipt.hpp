//
// Created by André Heine on 15.01.21.
//

#ifndef ZVT_REPEATRECEIPT_HPP
#define ZVT_REPEATRECEIPT_HPP

#include <Apdu.hpp>
#include <Tlv.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class RepeatReceipt
        : public Zvt::Apdu
{
private:
    std::string _password;
    std::bitset<8> _service_byte;
    Zvt::Tlv _tlv;
public:
    RepeatReceipt();
    virtual ~RepeatReceipt();

    const string &password() const
    { return _password; }

    const bitset<8> &serviceByte() const
    { return _service_byte; }

    const Zvt::Tlv &tlv() const
    { return _tlv; }
};

}

#endif //ZVT_REPEATRECEIPT_HPP
