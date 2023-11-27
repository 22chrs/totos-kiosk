/*
 * Ack.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_ACK_HPP_
#define CMDS_ACK_HPP_


#include <Apdu.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{

class Ack: public Zvt::Apdu
{
public:
	Ack();
	virtual ~Ack();
};

}

#endif /* CMDS_ACK_HPP_ */
