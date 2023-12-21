/*
 * IntermediateStatusInfo.cpp
 *
 *  Created on: 18.11.2020
 *      Author: ah
 */

#include <cmds/IntermediateStatusInfo.hpp>

Cmd::IntermediateStatusInfo::IntermediateStatusInfo() :
		Zvt::Apdu(0x04, 0xFF), _status(0xff), _timeout(0x03), tlv_container(Zvt::Tlv())
{
}

Cmd::IntermediateStatusInfo::IntermediateStatusInfo(const unsigned char* data, int length) :
		Zvt::Apdu(data, length), _status(0xff), _timeout(0x03), tlv_container(Zvt::Tlv())
{
	this->parse();
}

Cmd::IntermediateStatusInfo::IntermediateStatusInfo(const std::vector<unsigned char> data) :
		Zvt::Apdu(data.data(), data.size()), _status(0xff), _timeout(0x03), tlv_container(Zvt::Tlv())
{
	this->parse();
}

Cmd::IntermediateStatusInfo::IntermediateStatusInfo(const IntermediateStatusInfo& other) :
		Zvt::Apdu(other), _status(other.status()), _timeout(other.timeout()), tlv_container(other.tlv())
{
	this->parse();
}

Cmd::IntermediateStatusInfo::~IntermediateStatusInfo()
{
}

/*
 * 40 ff 30 ---> 48
 * ff
 * 30 60 2c 24 2a 70 f0 5a 61 68 6c 75 6e 67 20 65 72 66 6f 6c 67 74 70 00 70 15 42 69 74 74 65 20 4b 61 72 74 65 20 65 6e 74 6e 65 68 6d 65 6e

 <-PT:
 <-PT: Error copy sub-vector with args from=20, to=87, data.size=42
 Error: 70 f0 5a 61 68 6c 75 6e 67 20 65 72 66 6f 6c 67 74 70 00 70 15 42 69 74 74 65 20 4b 61 72 74 65 20 65 6e 74 6e 65 68 6d 65 6e
 */

std::vector<Zvt::Bmp> Cmd::IntermediateStatusInfo::parse(void)
{
	std::vector<Zvt::Bmp> bmps = Zvt::Apdu::parse();
	std::vector<unsigned char> data = this->data();
	std::stringstream ss;

	for (int idx = 0; idx < this->data().size(); ++idx)
	{
		// first three bytes are the length (1F2F3F --> 123)
		std::bitset<8> byte(this->data()[idx]);

		//first byte is the status byte
		if (idx == 0)
		{
			this->_status = this->data()[idx];  // debugme
		}
		/*
		 * NOTE:
		 *
		 * Starting from the intitial command the timeout is set or not. Byte on index=! could be the timeout OR the begin of a TLV container.
		 *
		 * 0x06 can theoretically be a timeout ( 6 min. we do not know this). If the byte the timeout than is the next byte a 0x06 (or nothing!)
		 */
		else if (idx == 1 && ((this->data().size() > 2 && this->data()[idx + 1] == 0x06) || this->data().size() == 2))
		{
			this->_timeout = this->data()[idx];
		}
		else if (this->data()[idx] == Zvt::BMP_06)
		{
			// must be the first size byte
			this->tlv_container.strip_of(Zvt::copyRange(this->data(), idx, this->data().size() - 1));
			bmps.push_back(tlv_container);
			// jump to the end...
			idx = this->data().size();
		}
		else Utils::log("Not implemented, check 04FF intermediate status command ", Zvt::copyRange(this->data(), idx, this->data().size()));
	}

	return bmps;
}

std::string Cmd::IntermediateStatusInfo::display_text(void)
{
	std::stringstream ss;

	for (Zvt::Tag tag : this->tlv().tags())
	{
		if (tag.tag_str() == "24")
		{
			for (Zvt::Tag stag : tag.subtags())
			{
				if (stag.tag_str() == "07")
				{
					//std::cout << stag.tag_str() << std::endl;
					if (stag.data().size() != 0)
					{
						for (unsigned char byte : stag.data())
							ss << byte;
					}
					else ss << "  ";
				}
			}
		}
	}
	return ss.str();
}

void Cmd::IntermediateStatusInfo::print(void)
{
	//Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
	if (!display_text().empty()) std::cout << "<-PTλ " << display_text() << std::endl;
}
