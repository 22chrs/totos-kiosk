/*
 * Status.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_STATUS_HPP_
#define CMDS_STATUS_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <string>
#include <iostream>
#include <bitset>

namespace Cmd
{

class Status: public Zvt::Apdu
{
private:
	std::string _password;
	std::bitset<8> _service_byte;
	Zvt::Bmp bmp03;
	Zvt::Tlv tlv_container;

public:
	Status();
	Status(const std::bitset<8>);
	Status(const unsigned char);
	Status(const Cmd::Status&);
    Status(const std::bitset<8>, const std::string password);
    Status(const unsigned char, const std::string password);
    Status(const unsigned char, const std::string password, Zvt::Tlv tlv);
	virtual ~Status();
//@formatter:off
	inline Zvt::Tlv tlv() const					{ return this->tlv_container; }
	inline std::bitset<8> service_byte() const	{ return this->_service_byte; }
//@formatter:on
};
}
#endif /* CMDS_STATUS_HPP_ */
