/*
 * ConfigFeig.hpp
 *
 *  Created on: 02.12.2020
 *      Author: ah
 */

#ifndef CMDS_CONFIGFEIG_HPP_
#define CMDS_CONFIGFEIG_HPP_

#include <Apdu.hpp>

/**
 * Extended Feig host configuration 0813
 * Tags only for Feig!
 *
 * 08 13	14 (20)
 * 06 		12 (18)
 * E4		10 (16)
 * FF40		03
 * 		528346	(config pass by lavego for feig)
 * FF41		07  (FF41 see CVEND docs chapter 8)
 * 				 4-byte hex -> IP
 * 				 1-byte hex -> PORT
 * 				 1-byte bin8 -> b0 == ssl, b1 == message framing , b2 == DFÜ via Kasse
 * 		D5 B7 13 69 --> 213.183.19.105
 * 		75 95       --> 0x7595 --> 30101
 * 		01          --> b0 == SSL
 *
 */

namespace Cmd
{

class ConfigFeig: public Zvt::Apdu
{
private:
	std::string _password;
	std::string _ip;
	int _port;
	unsigned char _config;

	void init();

public:
	ConfigFeig();
	ConfigFeig(const std::string, const std::string, int, unsigned char);
	virtual ~ConfigFeig();
	ConfigFeig(const ConfigFeig& other);
//@formatter:off
	inline const std::string password() const	{ return this->_password; }
	inline const std::string ip() const 		{ return this->_ip; }
	inline const int port() const 				{ return this->_port; }
	inline const std::bitset<8> config() const 	{ return std::bitset<8>(this->_config); }
//@formatter:on
};
}
#endif /* CMDS_CONFIGFEIG_HPP_ */
