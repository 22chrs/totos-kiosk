/*
 * BlockReceipt.hpp
 *
 *  Created on: 20.11.2020
 *      Author: ah
 */

#ifndef CMDS_BLOCKRECEIPT_HPP_
#define CMDS_BLOCKRECEIPT_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

namespace Cmd
{
/**
 * 06 d3 ff 14 03 	--> 3-byte length FF LO HI
 * 					--> LO=20, HI=3 (3*256 + 20 == 788)
 * Tlv:
 * 06 82 03 10      --> 0x82, HI LO (3x356 + 16 == 784)
 *
 * 1f 07 01 01
 * 25 82 03 08 		--> 0x82, HI LO (3x256 + 8  == 776)
 * 09 01 00
 * 07 1f  	20 20 20 48 2d c3 84 2d 4e 2d 44 2d 4c 2d 45 2d 52 2d 42 2d 45 2d 4c 2d 45 2d 47 20 20 20
 * 			20
 * 07 1e  	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e  	4c 41 56 45 47 4f 20 54 45 53 54 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 *
 * 07 1e	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e  	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	20 20 20 20 4b 61 72 74 65 6e 7a 61 68 6c 75 6e 67 20 67 69 72 6f 63 61 72 64 20 20 20 20
 * 07 1e 	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	42 65 74 72 61 67 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 31 2c 30 30 20 45 55 52
 * 07 1e 	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	31 39 2e 31 31 2e 32 30 32 30 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 31 39 3a 33 38
 * 07 1e 	54 65 72 6d 69 6e 61 6c 2d 49 44 20 20 20 20 20 20 20 20 20 20 20 35 32 35 30 30 30 36 38
 * 07 1e 	54 41 2d 4e 72 2e 20 30 30 30 34 36 34 20 20 20 42 65 6c 65 67 2d 4e 72 2e 20 30 31 36 32
 * 07 1e 	4b 61 72 74 65 6e 6e 72 2e 20 20 36 38 30 35 39 30 34 34 31 31 30 30 30 30 32 35 30 35 38
 * 07 1e 	4b 2e 66 6f 6c 67 2e 4e 72 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 30 30 30 31
 * 07 1f 	67 c3 bc 6c 74 69 67 20 62 69 73 20 28 4d 4d 2f 4a 4a 29 20 20 20 20 20 20 20 30 33 2f 32
 * 			34
 * 07 1e 	4b 6f 6e 74 61 6b 74 6c 6f 73 20 43 68 69 70 20 20 20 20 20 20 20 20 20 4f 6e 6c 69 6e 65
 * 07 1e 	56 55 2d 4e 75 6d 6d 65 72 20 20 20 20 20 20 31 34 36 39 38 30 30 34 20 20 20 20 20 20 20
 * 07 1e 	41 75 74 6f 72 69 73 69 65 72 75 6e 67 73 6e 75 6d 6d 65 72 20 20 20 20 38 37 30 30 33 39
 * 07 1e 	41 75 74 6f 72 69 73 69 65 72 75 6e 67 73 61 6e 74 77 6f 72 74 63 6f 64 65 20 20 20 30 30
 * 07 1e 	20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20
 * 07 1e 	2a 2a 20 20 20 20 20 5a 61 68 6c 75 6e 67 20 65 72 66 6f 6c 67 74 20 20 20 20 20 20 2a 2a
 *
 * 09 01 ff
 */
class BlockReceipt: public Zvt::Apdu
{
private:
	Zvt::Tlv tlv_container;
	/**
	 * 0x00 unknown/not set
	 * 0x01 merchant
	 * 0x02 customer
	 * 0x03 administration
	 */
	unsigned char receipt_type;
	std::string receipt_text;

public:
	BlockReceipt();
	virtual ~BlockReceipt();
	BlockReceipt(const std::vector<unsigned char>);
	BlockReceipt(const BlockReceipt&);

	std::vector<Zvt::Bmp> parse(void);
	void print(void);
    void write_to_cwd(void);
//@formatter:off
	inline bool is_merchant()			{ return this->receipt_type == 0x01; }
	inline bool is_customer()			{ return this->receipt_type == 0x02; }
	inline bool is_administration()		{ return this->receipt_type == 0x03; }
	inline bool type() const			{ return this->receipt_type; }
	inline Zvt::Tlv tlv() const			{ return this->tlv_container; }
	inline std::string receipt() const	{ return this->receipt_text; }
//@formatter:on
};
}
#endif /* CMDS_BLOCKRECEIPT_HPP_ */
