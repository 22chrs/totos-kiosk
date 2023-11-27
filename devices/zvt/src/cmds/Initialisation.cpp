/*
 * Initialisation.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/Initialisation.hpp>

Cmd::Initialisation::Initialisation() :
		Zvt::Apdu(0x06, 0x93), _password("010203")
{
    //std::cout << "default: |" << this->_password << "|" << endl;
	this->addBmp(Zvt::HexToByte(this->_password));
}

Cmd::Initialisation::Initialisation(const std::string pass) :
		Zvt::Apdu(0x06, 0x93), _password(pass)
{
    //std::cout << "pass: |" << this->_password << "|" << endl;
	this->addBmp(Zvt::HexToByte(this->_password));
}

Cmd::Initialisation::Initialisation(const Cmd::Initialisation& other) :
		Zvt::Apdu(0x06, 0x93), _password(other._password)
{

    //std::cout << "copy: |" << this->_password << "|" << endl;
    this->addBmp(Zvt::HexToByte(this->_password));
}

Cmd::Initialisation::~Initialisation()
{
}

