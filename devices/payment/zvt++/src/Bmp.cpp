/*
 * Bmp.cpp
 *
 *  Created on: 09.11.2020
 *      Author: ah
 */

#include "Bmp.hpp"
#include "Apdu.hpp"

Zvt::Bmp::Bmp(const Zvt::Bmp &other) :
		_bmp(other.bmp()), _format(other.fmt()), _data(other.get())
{
	//Utils::log(this->get());
}

Zvt::Bmp::Bmp(unsigned char bmp, BmpFormat format, std::vector<unsigned char> data) :
		_bmp(bmp), _format(format), _data(data)
{
	//Utils::log(this->get());
}

Zvt::Bmp::~Bmp()
{
}

void Zvt::Bmp::strip_of(std::vector<unsigned char> bmp_data)
{
	if (bmp_data.size() > 0)
	{
		this->_bmp = bmp_data[0];

		if (bmp_data.size() > 1)
		{
			this->_data = LLVar::copyRange(bmp_data, 1, bmp_data.size() - 1);
		}
	}
}

