//
// Created by André Heine on 20.05.21.
//

#ifndef ZVT_REVERSAL_HPP
#define ZVT_REVERSAL_HPP

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <string>
#include <iostream>
#include <bitset>

namespace Cmd
{

class Reversal
        : public Zvt::Apdu
{
private:
    inline Reversal()
    {};
    std::string _password;
    int _receipt_no;

public:
    Reversal(const int);
    Reversal(const int, const std::string);
    Reversal(const Cmd::Reversal &);
    virtual ~Reversal();
};

}
#endif //ZVT_REVERSAL_HPP
