/*
 * ConfigFeig.cpp
 *
 *  Created on: 02.12.2020
 *      Author: ah
 */

#include <cmds/ConfigFeig.hpp>

Cmd::ConfigFeig::ConfigFeig() :
		Zvt::Apdu(0x08, 0x13), _password("010203"), _ip("213.183.19.105"), _port(30101), _config(0x01)
{
	this->init();
}

Cmd::ConfigFeig::ConfigFeig(const std::string pass, const std::string ip, int port, unsigned char config) :
		Zvt::Apdu(0x08, 0x13), _password(pass), _ip(ip), _port(port), _config(config)
{
	this->init();
}

Cmd::ConfigFeig::~ConfigFeig()
{
}

Cmd::ConfigFeig::ConfigFeig(const ConfigFeig& other) :
		Zvt::Apdu(0x08, 0x13), _password(other.password()), _ip("213.183.19.105"), _port(30101), _config(0x01)
{
	this->init();
}

// 081314
// 0612		E410	FF40 03 528346
//					FF41 07 D5B71369 7595 01
void Cmd::ConfigFeig::init()
{
	std::vector<unsigned char> bytes = Zvt::Bmp::NumberToBCD(std::stoi(this->password()), 3);

	bytes.insert(bytes.begin(), 0x03);
	bytes.insert(bytes.begin(), 0x40);
	bytes.insert(bytes.begin(), 0xFF);

	bytes.push_back(0xFF);
	bytes.push_back(0x41);
	bytes.push_back(0x07);

	std::istringstream f(this->ip());
	std::string s;

	while (std::getline(f, s, '.'))
	{
		bytes.push_back(std::stoi(s));
	}

	bytes.push_back(((this->port() & 0x0000ff00) >> 8));
	bytes.push_back((this->port() & 0x000000ff));
	bytes.push_back(this->config().to_ulong());

	bytes.insert(bytes.begin(),bytes.size());
	bytes.insert(bytes.begin(),0xE4);
	bytes.insert(bytes.begin(),bytes.size());
	bytes.insert(bytes.begin(),0x06);

	this->addBmp(bytes);
}

