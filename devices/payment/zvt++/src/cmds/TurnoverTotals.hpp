//
// Created by André Heine on 15.01.21.
//

#ifndef ZVT_TURNOVERTOTALS_HPP
#define ZVT_TURNOVERTOTALS_HPP

#include <Apdu.hpp>
#include <Tlv.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class TurnoverTotals
        : public Zvt::Apdu
{
private:
    std::string _password;
public:
    TurnoverTotals();
    TurnoverTotals(std::string password);
    virtual ~TurnoverTotals();

    const string &password() const
    { return _password; }
};

}

#endif //ZVT_TURNOVERTOTALS_HPP
