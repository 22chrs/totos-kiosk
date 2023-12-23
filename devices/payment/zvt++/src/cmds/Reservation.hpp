//
// Created by André Heine on 22.12.23.
//

#ifndef ZVT_RESERVATION_HPP
#define ZVT_RESERVATION_HPP


#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <sstream>
#include <string>
#include <iomanip>

namespace Cmd
{

class Reservation
        : public Zvt::Apdu
{
private:
    Zvt::Bmp _amount;
public:
    Reservation();
    Reservation(std::string amount);
    Reservation(unsigned long amount);
    Reservation(std::vector<unsigned char> amount);
    virtual ~Reservation();

//formatter:off
    inline const Zvt::Bmp amount() const
    { return this->_amount; }

//formatter:on
};
}



#endif //ZVT_RESERVATION_HPP
