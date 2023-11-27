/*
 * Initialisation.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_INITIALISATION_HPP_
#define CMDS_INITIALISATION_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <string>
#include <iostream>
#include <bitset>

namespace Cmd
{

class Initialisation: public Zvt::Apdu
{
private:
	std::string _password;

public:
	Initialisation();
	Initialisation(const std::string);
	Initialisation(const Cmd::Initialisation&);
	virtual ~Initialisation();
};
}
#endif /* CMDS_STATUS_HPP_ */
