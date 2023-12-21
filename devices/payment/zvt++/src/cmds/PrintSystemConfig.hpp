/*
 * Ack.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_PRINTSYSTEMCONFIG_HPP_
#define CMDS_PRINTSYSTEMCONFIG_HPP_

#include <Apdu.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class PrintSystemConfig
        : public Zvt::Apdu
{
public:
    PrintSystemConfig();
    virtual ~PrintSystemConfig();
};

}

#endif /* CMDS_PRINTSYSTEMCONFIG_HPP_ */
