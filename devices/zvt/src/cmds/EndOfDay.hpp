/*
 * EndOfDay.hpp
 *
 *  Created on: 24.11.2020
 *      Author: ah
 */

#ifndef CMDS_ENDOFDAY_HPP_
#define CMDS_ENDOFDAY_HPP_

#include <Apdu.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class EndOfDay
        : public Zvt::Apdu
{
private:
    std::string _password;
    unsigned char _mode;

    void init();

public:
    inline static const unsigned char NORMAL = 0x00;
    inline static const unsigned char FORCE = 0x01;
    inline static const unsigned char AUTO = 0x02;

    EndOfDay();
    EndOfDay(const std::string);
    EndOfDay(const unsigned char mode);
    EndOfDay(const std::string, const unsigned char mode);
    virtual ~EndOfDay();
    EndOfDay(const EndOfDay &other);

    inline const std::string password() const
    { return this->_password; }

    inline const unsigned char mode() const
    { return this->_mode; }
};
}
#endif /* CMDS_ENDOFDAY_HPP_ */
