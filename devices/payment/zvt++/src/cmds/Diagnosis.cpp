/*
 * EndOfDay.cpp
 *
 *  Created on: 24.11.2020
 *      Author: ah
 */

#include <cmds/Diagnosis.hpp>

Cmd::Diagnosis::Diagnosis() :
		Zvt::Apdu(0x06, 0x70), _type(Zvt::LineDiagnosis)
{
	this->addBmp(Zvt::Bmp(Zvt::Tlv_Encoded, {0x06, 0x03, 0x1B, 0x01, static_cast<unsigned char>(this->type())}));
}

Cmd::Diagnosis::Diagnosis(Zvt::DiagnosisType type) :
		Zvt::Apdu(0x06, 0x70), _type(type)
{
	this->addBmp(Zvt::Bmp(Zvt::Tlv_Encoded, {0x06, 0x03, 0x1B, 0x01, static_cast<unsigned char>(this->type())}));
}

Cmd::Diagnosis::~Diagnosis()
{
}

Cmd::Diagnosis::Diagnosis(const Cmd::Diagnosis& other) :
		Zvt::Apdu(other.ccrc(), other.aprc()), _type(other.type())
{
	this->addBmp(Zvt::Bmp(Zvt::Tlv_Encoded, {0x06, 0x03, 0x1B, 0x01, static_cast<unsigned char>(this->type())}));
}

