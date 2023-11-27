/*
 * StatusInfo.hpp
 *
 *  Created on: 18.11.2020
 *      Author: ah
 */

#ifndef CMDS_STATUSINFO_HPP_
#define CMDS_STATUSINFO_HPP_

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <bmps/IndividualTotals.hpp>

namespace Cmd
{
/**
 * 04 0f b7		---> 183
 * 27 			00 (0x00 no error)
 * 29 			52 50 00 68
 * 04 			00 00 00 00 01 00 	(100cent amount)
 * 0b 			00 04 85 			(3-byte bcd)
 * 0c 			18 59 29	HHMMSS
 * 0d 			11 21 		MMDD
 * 0e 			24 03 		(expiry-date)
 * 17 			00 01 		()
 * 19 			60
 * 22 			f1 f0 68 05 90 ee ee ee ee e5 05 8f (LLVAR)
 * 87 			01 75
 * 3b 			36 34 30 39 30 30 00 00
 * 2a 			31 34 36 39 38 30 30 34 20 20 20 20 20 20 20
 * 8b 			f0 f9 67 69 72 6f 63 61 72 64 00 (LLVAR)
 * 8a			05
 *
 * 06 5d 		---> 93 TLV
 * 		41 01 	05
 * 		45 04 	21 00 00 00
 * 		46 10 	2f 30 30 30 30 30 30 30 30 30 30 2f 30 30 30 30
 * 		47 10 	2f 30 30 30 30 30 30 30 30 30 30 2f 30 30 30 30
 * 		60 20 	43 0a a0 00 00 03 59 10 10 02 80 01 42 08 67 69 72 6f 63 61 72 64 4a 08 67 69 72 6f 63 61 72 64
 * 		2f 0c 	1f 10 01 00 1f 11 01 01 1f 12 01 02
 */
class StatusInfo: public Zvt::Apdu
{
private:
	unsigned char _status;
	Zvt::Tlv tlv_container;
	int _tid;
	int _amount;
	int _trace;
	int _original_trace; //reversal
	std::string _time;
	std::string _date;
	std::string _expiry_date;
	int _sequence_number;
	unsigned char _payment_type;
	int _receipt_number;
	std::string _aid;
	int _iso_currency;
	unsigned char _card_type;
	std::string _card_name;
	std::string _pan;
	unsigned char _card_type_net_op;
	unsigned char _result_code;
	std::string _vu_number;
	std::string _additional_text;
	Bmp::IndividualTotals _individual_totals;

public:
	StatusInfo();
	virtual ~StatusInfo();
	StatusInfo(const unsigned char*, int);
	StatusInfo(const std::vector<unsigned char>);
	StatusInfo(const StatusInfo &other);

	std::vector<Zvt::Bmp> parse(void);
	void print();
	void print_totals_per_card();

//@formatter:off
	inline unsigned char status() const 							{ return this->_status; }
	inline Zvt::Tlv tlv() const         							{ return this->tlv_container; }
	inline const std::string& aid() const							{ return this->_aid; }
	inline int amount() const										{ return this->_amount; }
	inline const std::string& card_name() const 					{ return this->_card_name; }
	inline unsigned char card_type() const							{ return this->_card_type; }
	inline const std::string& date() const							{ return this->_date; }
	inline const std::string& expiry_date() const					{ return this->_expiry_date; }
	inline int currency() const										{ return this->_iso_currency; }
	inline int original_trace() const								{ return this->_original_trace; }
	inline unsigned char payment_type() const						{ return this->_payment_type; }
	inline int receipt_number() const								{ return this->_receipt_number; }
	inline int sequence_number() const								{ return this->_sequence_number; }
	inline int tid() const											{ return this->_tid; }
	inline const std::string& time() const							{ return this->_time; }
	inline int trace() const										{ return this->_trace; }
	inline const std::string& pan() const 							{ return this->_pan; }
	inline unsigned char network_operator_card_type() const			{ return this->_card_type_net_op; }
	inline unsigned char result_code() const						{ return this->_result_code; }
	inline const std::string& vu_number() const						{ return this->_vu_number; }
	inline const std::string& additional_text() const				{ return this->_additional_text; }
	inline const Bmp::IndividualTotals& individual_totals() const	{ return this->_individual_totals; }
//@formatter:on
};
}
#endif /* CMDS_STATUSINFO_HPP_ */
