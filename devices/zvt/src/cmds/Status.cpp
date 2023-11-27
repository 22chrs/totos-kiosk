/*
 * Status.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/Status.hpp>

/**
 * CLASS INSTR Length	Data block:
 * 05 01 	   xx
 * 						[<password>[03<service-byte>][06<TLV-container>]]
 *
 * Data block:
 * <password>: See chapter Password.
 * 03<service-byte>:
 *
 * Table 12: Definition of <service-byte>
 *
 * If <service-byte> is sent then <password> must also be sent.
 *
 * Service-byte			Definition
 * xxxx xxx1			The PT service-menu of the PT may not be displayed against the function-key on the PT.
 * xxxx xxx0			The PT service-menu of the PT may be displayed against the function-key on the PT.
 * xxxx xx1x			Do NOT send SW-Version in Completion command
 * xxxx xx0x			Do send SW-Version in Completion command, default if no service-byte sent.
 * xxxx x0xx			Do not send further status information in the completion (TLV-container).
 * xxxx x1xx			Send further status information in the TLV-container of the completion.
 * All other			RFU (reserved futur use)
 *
 */
Cmd::Status::Status() :
		Zvt::Apdu(0x05, 0x01), _password("010203"), _service_byte(0x05), bmp03(Zvt::Bmp(0x03, Zvt::One_Byte_Binary, {0x05})), tlv_container(Zvt::Tlv())
{
	this->addBmp(Zvt::HexToByte(this->_password));
	this->addBmp(this->bmp03);
	this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(std::bitset<8> service_byte) :
				Zvt::Apdu(0x05, 0x01), _password("010203"), _service_byte(service_byte.to_ulong()), bmp03(), tlv_container(Zvt::Tlv())
{
	this->addBmp(Zvt::HexToByte(this->_password));

	std::vector<unsigned char> sb;
	sb.push_back(service_byte.to_ulong());
	this->bmp03.set(0x03, Zvt::One_Byte_Binary,sb);

	this->addBmp(this->bmp03);
	this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(std::bitset<8> service_byte, const std::string password) :
        Zvt::Apdu(0x05, 0x01), _password(password), _service_byte(service_byte.to_ulong()), bmp03(), tlv_container(Zvt::Tlv())
{
    this->addBmp(Zvt::HexToByte(this->_password));

    std::vector<unsigned char> sb;
    sb.push_back(service_byte.to_ulong());
    this->bmp03.set(0x03, Zvt::One_Byte_Binary,sb);

    this->addBmp(this->bmp03);
    this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(const unsigned char service_byte) :
				Zvt::Apdu(0x05, 0x01), _password("010203"), _service_byte(std::bitset<8>(service_byte)), bmp03(Zvt::Bmp(0x03, Zvt::One_Byte_Binary, {service_byte})), tlv_container(Zvt::Tlv())
{
	this->addBmp(Zvt::HexToByte(this->_password));
	this->addBmp(this->bmp03);
	this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(const unsigned char service_byte, const std::string password) :
        Zvt::Apdu(0x05, 0x01), _password(password), _service_byte(std::bitset<8>(service_byte)), bmp03(Zvt::Bmp(0x03, Zvt::One_Byte_Binary, {service_byte})), tlv_container(Zvt::Tlv())
{
    this->addBmp(Zvt::HexToByte(this->_password));
    this->addBmp(this->bmp03);
    this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(const unsigned char service_byte, const std::string password, Zvt::Tlv tlv) :
        Zvt::Apdu(0x05, 0x01), _password(password), _service_byte(std::bitset<8>(service_byte)), bmp03(Zvt::Bmp(0x03, Zvt::One_Byte_Binary, {service_byte})), tlv_container(tlv)
{
    this->addBmp(Zvt::HexToByte(this->_password));
    this->addBmp(this->bmp03);
    this->addBmp(this->tlv_container.all());
}

Cmd::Status::Status(const Cmd::Status& other):
						Zvt::Apdu(0x05, 0x01), _password("010203"), _service_byte(other.service_byte()), bmp03(), tlv_container(other.tlv())
{

}

Cmd::Status::~Status()
{
}

