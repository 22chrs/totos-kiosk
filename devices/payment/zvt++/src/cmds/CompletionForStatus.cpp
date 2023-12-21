/*
 * CompletionForStatus.cpp
 *
 *  Created on: 16.11.2020
 *      Author: ah
 */

#include <cmds/CompletionForStatus.hpp>

#include <sstream>
#include <string>
#include <bitset>
#include <iostream>

#include <Utils.hpp>

Cmd::CompletionForStatus::CompletionForStatus() :
		Apdu(0x06, 0x0F), _version(std::string()), _status(Zvt::TSC_Unknown), tlv_container(Zvt::Tlv())
{

}

Cmd::CompletionForStatus::CompletionForStatus(const unsigned char* buffer, int length) :
		Apdu(buffer, length), _version(std::string()), _status(Zvt::TSC_Unknown), tlv_container(Zvt::Tlv())
{
	this->parse();
}

Cmd::CompletionForStatus::~CompletionForStatus()
{
	// TODO Auto-generated destructor stub
}

/**
 * Attention!
 *
 * This parse() method will only work if the service_byte for 0501 prints the version before the terminal_status_code.
 * Otherwise the behavior is undefined.
 *
 * See PA00P015 doc chapter 2.56 Status-Enquiry 0501 for controlling the behavior via service_byte BMP 0x03!
 */
std::vector<Zvt::Bmp> Cmd::CompletionForStatus::parse(void)
{
	std::vector<Zvt::Bmp> bmps = Zvt::Apdu::parse();
	std::vector<unsigned char> data = this->data();
	std::stringstream ss;
	int lllvar_length = 0;

	for (int idx = 0; idx < data.size(); ++idx)
	{
		// first three bytes are the length (1F2F3F --> 123)
		std::bitset<8> byte(data[idx]);

		switch (idx)
		{
		case 0:
		case 1:
		case 2:
			// set bit7-bit4 to 0 (bit 0..7)
			byte.set(7, 0);
			byte.set(6, 0);
			byte.set(5, 0);
			byte.set(4, 0);
			ss << byte.to_ulong();
			lllvar_length = std::stoi(ss.str());
			break;
		case 3:
			// first lllvar data byte
			ss.str(std::string());

			for (; idx < lllvar_length + 3; ++idx)
			{
				ss << data[idx];
			}

			this->_version = ss.str();
			// next byte is the status_code
			this->_status = Zvt::statusCode(data[idx]);
			// rest is a TLV container or nothing

			// print only a error is somthing with the data or broken length. We ignore zero length because 0501 works without TLV
			if (idx < data.size() - 1)
			{
				this->tlv_container.strip_of(Zvt::copyRange(data, ++idx, data.size() - 1));
				bmps.push_back(tlv_container);
			}
			idx = data.size();
			break;
		default:
			Utils::log("Not implemented, check 0501 status command ", byte.to_ulong());
			break;
		}
	}

	return bmps;
}

void Cmd::CompletionForStatus::print(void)
{
	std::cout << "<-PT| from cmd 0501" << std::endl;
	std::cout << "<-PT| tid      --> " << version() << endl;
	std::cout << "<-PT| status   --> " << status() << endl;
	std::cout << "<-PT: tlv tags --> " << std::endl;
	Utils::print_tlv_tags(tlv());
	std::cout << endl;
}
