/*
 * Auth.hpp
 *
 *  Created on: 17.11.2020
 *      Author: ah
 */

#ifndef CMDS_AUTH_HPP_
#define CMDS_AUTH_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <sstream>
#include <string>
#include <iomanip>

namespace Cmd
{
class Auth: public Zvt::Apdu
{
private:
	Zvt::Bmp _amount; 		// bmp 0x04, 6-byte-bcd
	/**
	 * Todo;
	 * Payment type must match with given scenario.
	 *
	 * We must ask Mr Hallmen which setting we need for nfc only transactions
	 *
	 * Default: decision by PT including GeldKarte --> 0x80
	 */
	Zvt::Bmp _payment_type;  // bmp 0x19, 1-byte-binary
public:
	Auth();
	Auth(unsigned long amount);
	Auth(const unsigned long amount, const unsigned char payment_type);
	Auth(const Auth &other);
	virtual ~Auth();

//formatter:off
	inline const Zvt::Bmp amount() const { return this->_amount; }
	inline const Zvt::Bmp payment_type() const { return this->_payment_type; }
//formatter:on
};
}
#endif /* CMDS_AUTH_HPP_ */
