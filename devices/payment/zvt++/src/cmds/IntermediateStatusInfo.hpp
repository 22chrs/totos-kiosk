/*
 * IntermediateStatusInfo.hpp
 *
 *  Created on: 18.11.2020
 *      Author: ah
 */

#ifndef CMDS_INTERMEDIATESTATUSINFO_HPP_
#define CMDS_INTERMEDIATESTATUSINFO_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

namespace Cmd
{

class IntermediateStatusInfo : public Zvt::Apdu
{
private:
	unsigned char _status;
	unsigned char _timeout;
	Zvt::Tlv tlv_container;

public:
	IntermediateStatusInfo();
	IntermediateStatusInfo(const unsigned char*, int);
	IntermediateStatusInfo(const std::vector<unsigned char>);
	IntermediateStatusInfo(const IntermediateStatusInfo &other);
	virtual ~IntermediateStatusInfo();

	std::vector<Zvt::Bmp> parse(void);
	void print(void);

	/**
	 * 24 display-texts
	 *
	 * container with an arbitrary list of text lines (tag '07')
	 * Note: each text line is formed in its own line, i.e. no line-return necessary The PT sends the tag 24 in Intermediate Status-Information.
	 */
	std::string display_text(void);

//@formatter::off
	inline unsigned char status() const  { return this->_status; }
	inline unsigned char timeout() const { return this->_timeout; }
	inline Zvt::Tlv tlv() const          { return this->tlv_container; }
//@formatter::on
};
}
#endif /* CMDS_INTERMEDIATESTATUSINFO_HPP_ */
