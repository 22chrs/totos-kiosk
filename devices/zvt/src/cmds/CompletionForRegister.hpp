/*
 * Completion4Register.hpp
 *
 *  Created on: 16.11.2020
 *      Author: ah
 */

#ifndef CMDS_COMPLETIONFORREGISTER_HPP_
#define CMDS_COMPLETIONFORREGISTER_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <sstream>
#include <string>
#include <iomanip>

namespace Cmd
{

class CompletionForRegister: public Zvt::Apdu
{
private:
	Zvt::Bmp bmp19;
	Zvt::Bmp bmp29;
	Zvt::Bmp bmp49;
	Zvt::Tlv tlv_container;

public:
	CompletionForRegister();
	CompletionForRegister(const unsigned char*, int);
	virtual ~CompletionForRegister();

	std::vector<Zvt::Bmp> parse(void);
	void print(void);

	inline Zvt::Tlv tlv()
	{
		return this->tlv_container;
	}

	inline int currencyCode()
	{
		return Zvt::Bmp::BCDToNumber(this->bmp49.get());
	}

	inline std::bitset<8> status()
	{
		std::bitset<8> byte;

		if (bmp19.get().size() > 0)
		{
			byte = this->bmp19.get().at(0);
		}

		return byte;
	}

	inline std::string tid()
	{
		return Zvt::Bmp::BCDToString(this->bmp29.get());
	}
};

}
#endif /* CMDS_COMPLETIONFORREGISTER_HPP_ */
