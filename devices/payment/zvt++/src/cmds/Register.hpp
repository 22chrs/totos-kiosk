/*
 * Apdu0600.h
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_REGISTER_HPP_
#define CMDS_REGISTER_HPP_

#include <Apdu.hpp>
#include <Tlv.hpp>
#include <HexToByte.hpp>
#include <Tag.hpp>
#include <Bmp.hpp>
#include <Utils.hpp>

#include <iostream>
#include <bitset>

namespace Cmd
{
/*
 * 06 00 16
 * 01 02 03
 * 9E
 * 09 78
 * 03 01
 *
 * 06 0C 12 01 30 27 03 14 01 01 40 02 B0 B0
 */
class Register
        : public Zvt::Apdu
{
private:
    std::string _password;
    /*
     * 		 Config-byte	Definition
     * 		 0000 000x		RFU
     *
     * 		 0000 0010		ECR assumes receipt-printout for payment functions (see also “ECR Printing – ECR print-type”)
     * 		 				0: payment receipt not printed by ECR
     * 		 				1: payment receipt printed by ECR
     * 		 				Payment functions are:
     * 		 				Payments, Reversal, Refund, Pre-Authorisation, Partial-Reversal, Book Total, Tele- phonic Authorisation, Prepaid Charge-up, Repeat-Receipt
     *
     * 		 0000 0100		ECR assumes receipt-printout for administration functions (see also “ECR print-type”)
     * 		 				0: administration receipt not printed by ECR
     * 		 				1: administration receipt printed by ECR
     *
     * 		 				Administration functions are:
     * 		 				All other functions which are not payment functions.
     * 		 0000 1000		ECR requires intermediate status-Information. The PT sends no intermediate status- information if not logged-on.
     *
     * 		 0001 0000		ECR controls payment function
     * 		 				0: Amount input on PT possible
     * 		 				1: Amount input on PT not possible
     * 		 0010 0000		ECR controls administration function
     * 		 				0: Start of administration function on PT possible
     * 		 				1: Start of administration function on PT not possible
     *
     * 		 0100 0000		RFU
     * 		 1000 0000		ECR print-type (see also “ECR assumes receipt-printout for payment functions” and “
     * 		 				ECR assumes receipt-printout for administration functions “):
     *
     * 		 				0: ECR compiles receipts itself from the status-information data
     * 		 				1: Receipt-printout via ECR using command *Print Lines” (06D1)
     * 		 				This field is only used if the option “ECR assumes receipt-printout for payment func- tions”
     * 		 				and/or “ECR assumes receipt-printout for administration functions” is set.
     * 		 				Receipts which are not printed by the ECR must be printed by the PT’s own printer.
     */
    std::bitset<8> _config_byte;

    /*
     * currency codehttps://www.iso.org/iso-4217-currency-codes.html
     * EUR -> 978 -> 0x09 0x78
     */
    std::vector<unsigned char> _currency_code;

    /*
     * BMP-03 (03 01 xx)
     *
     * Service-byte		Definition
     * xxxx xxx1		The PT service-menu may not be assigned to PT function-key.
     * Xxxx xxx0		The PT service-menu may be assigned to PT function-key (= default if BMP03 omitted).
     * Xxxx xx1x		The display texts for the Commands Authorisation, Pre-initialisation and Reversal will be dis- played in capitals.
     * Xxxx xx0x 		The display texts for the Commands Authorisation, Pre-initialisation and Reversal will be dis- played in standard font (= default if BMP03 omitted).
     * Remainder		RFU
     */
    std::bitset<8> _service_byte;
    Zvt::Bmp _bmp03;
    Zvt::Tlv tlv_container;

public:
    Register();
    Register(unsigned char config);
    Register(unsigned char config, std::string password);
    Register(std::string, unsigned char, std::vector<unsigned char>, unsigned char, Zvt::Tlv);
    virtual ~Register();

//@formatter:off
    inline unsigned char config_byte() const
    { return this->_config_byte.to_ulong(); }

    inline unsigned char service_byte() const
    { return this->_service_byte.to_ulong(); }

    inline std::bitset<8> config() const
    { return this->_config_byte; }

    inline std::bitset<8> service() const
    { return this->_service_byte; }

    inline const Zvt::Tlv tlv() const
    { return this->tlv_container; }

    inline const std::string password() const
    { return this->_password; }
//@formatter:on

};
}
#endif /* CMDS_REGISTER_HPP_ */
