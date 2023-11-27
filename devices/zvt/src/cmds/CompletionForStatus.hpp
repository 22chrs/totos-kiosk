/*
 * CompletionForStatus.hpp
 *
 *  Created on: 16.11.2020
 *      Author: ah
 */

#ifndef CMDS_COMPLETIONFORSTATUS_HPP_
#define CMDS_COMPLETIONFORSTATUS_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <sstream>
#include <string>
#include <iomanip>

namespace Cmd
{
class CompletionForStatus: public Zvt::Apdu
{
private:
	std::string _version;  // LLLVAR
	Zvt::TerminalStatusCode _status;
	Zvt::Tlv tlv_container;

public:
	CompletionForStatus();
	CompletionForStatus(const unsigned char*, int);
	virtual ~CompletionForStatus();

	std::vector<Zvt::Bmp> parse(void);
	void print(void);

//@formatter:off
	inline Zvt::TerminalStatusCode status() { return this->_status;	}
	inline std::string version()	        { return this->_version; }
	inline Zvt::Tlv tlv()                   { return this->tlv_container; }
//@formatter:on
};
}
#endif /* CMDS_COMPLETIONFORSTATUS_HPP_ */
