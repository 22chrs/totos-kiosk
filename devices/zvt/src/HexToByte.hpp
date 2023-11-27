/*
 * Command.hpp
 *
 *  Created on: 27.10.2020
 *      Author: ah
 */

#ifndef HEXTOBYTE_HPP_
#define HEXTOBYTE_HPP_

#include <iostream>
#include <iterator>
#include <vector>

namespace Zvt
{

class HexToByte
{
private:
	std::string cmd;
	unsigned char *buf;
	void create_unhex_buffer(void);
	size_t length;

	std::string assert_check(std::string);

public:
	HexToByte(const std::string);
	HexToByte(const HexToByte &other);
	virtual ~HexToByte();

	const unsigned char* buffer(void) const
	{
		return buf;
	}
//@formatter:off
	inline const int	size		( ) const	{	return this->length;}
	inline const std::string& asStr(void) const	{	return cmd;}
//@formatter:on

	inline std::vector<unsigned char> vector() const
    {
		unsigned char array[this->length];
		for (int idx = 0; idx < this->length; ++idx)
		{
			array[idx] = buf[idx];
		}
		return std::vector<unsigned char>(array, array + this->length);
	}

	void set(const std::string &cmd);
};

}

#endif /* HEXTOBYTE_HPP_ */
