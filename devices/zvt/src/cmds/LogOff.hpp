/*
 * Status.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_LOGOFF_HPP_
#define CMDS_LOGOFF_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <string>
#include <iostream>
#include <bitset>

namespace Cmd
{

class LogOff
        : public Zvt::Apdu
{
private:
    std::string _password;

public:
    LogOff();
    LogOff(const std::string password);
    virtual ~LogOff();

    inline std::string password()
    {
        return this->_password;
    }

    inline void password(std::string password)
    {
        this->clear();
        this->addBmp(Zvt::HexToByte(this->_password = password));
    }
};
}
#endif /* CMDS_LOGOFF_HPP_ */
