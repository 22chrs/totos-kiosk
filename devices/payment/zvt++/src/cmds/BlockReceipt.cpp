/*
 * BlockReceipt.cpp
 *
 *  Created on: 20.11.2020
 *      Author: ah
 */

#include <cmds/BlockReceipt.hpp>
#include <fstream>

Cmd::BlockReceipt::BlockReceipt() :
		Zvt::Apdu(0x06, 0xD3), tlv_container(Zvt::Tlv()), receipt_type(0x00)
{
}

Cmd::BlockReceipt::~BlockReceipt()
{
}

Cmd::BlockReceipt::BlockReceipt(const std::vector<unsigned char> data) :
		Zvt::Apdu(data.data(), data.size()), tlv_container(Zvt::Tlv()), receipt_type(0x00)
{
	this->parse();
}

Cmd::BlockReceipt::BlockReceipt(const BlockReceipt& other) :
		Zvt::Apdu(other.cmd(), other.size()), tlv_container(other.tlv()), receipt_type(other.type())
{
	this->parse();
}

std::vector<Zvt::Bmp> Cmd::BlockReceipt::parse(void)
{
	this->tlv_container = Zvt::Tlv(this->data());

	for (Zvt::Tag tag : this->tlv().tags())
	{
		if (tag.tag_str() == "1F07")
		{
			if (tag.data().size() > 0)
			{
				this->receipt_type = tag.data()[0];
			}
		}
		else if (tag.tag_str() == "25")
		{
			std::stringstream ss;
			for (Zvt::Tag stag : tag.subtags())
			{
				if (stag.tag_str() == "07")
				{
					ss << "<-PT|";
					for (unsigned char byte : stag.data())
					{
						ss << byte;
					}
					ss << "|" << std::endl;
				}
				else if (stag.tag_str() == "09")
				{
				}
			}
			this->receipt_text = ss.str();
		}
	}

	return std::vector<Zvt::Bmp>( {this->tlv_container});
}

void Cmd::BlockReceipt::print()
{
	std::cout << "<-PT: BlockReceipt (06D3)" << std::endl;
	std::cout << "<-PT: is_merchant      : " << is_merchant() << std::endl;
	std::cout << "<-PT: is_customer      : " << is_customer() << std::endl;
	std::cout << "<-PT: is_administration: " << is_administration() << std::endl;
	std::cout << "<-PT:" << endl;
	std::cout << receipt() << endl;
    write_to_cwd();
}

void Cmd::BlockReceipt::write_to_cwd(void)
{
    std::ofstream file;
    file.open("receipt.txt",std::ios::app);
    file << this->receipt();
    file << "----------------" << std::endl;
    file.close();
}
