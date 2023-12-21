/*
 * IndividualTotals.hpp
 *
 *  Created on: 25.11.2020
 *      Author: ah
 */

#ifndef BMPS_INDIVIDUALTOTALS_HPP_
#define BMPS_INDIVIDUALTOTALS_HPP_

#include <Bmp.hpp>

namespace Bmp
{

class IndividualTotals: public Zvt::Bmp
{
private:
	unsigned int _receipt_from;
	unsigned int _receipt_to;
	unsigned int _number_girocard;
	unsigned long _total_girocard_in_cent;
	unsigned int _number_jcb;
	unsigned long _total_jcb_in_cent;
	unsigned int _number_eurocard;
	unsigned long _total_eurocard_in_cent;
	unsigned int _number_amex;
	unsigned long _total_amex_in_cent;
	unsigned int _number_visa;
	unsigned long _total_visa_in_cent;
	unsigned int _number_diners;
	unsigned long _total_diners_in_cent;
	unsigned int _number_others;
	unsigned long _total_others_in_cent;

public:
	IndividualTotals();
	virtual ~IndividualTotals();
	IndividualTotals(const IndividualTotals& other);

	virtual void strip_of(const std::vector<unsigned char>);
	void print(void) const;

//@formatter:off
	inline unsigned int receipt_from() const 			{ return this->_receipt_from; }
	inline unsigned int receipt_to() const 				{ return this->_receipt_to; }
	inline unsigned int number_girocard() const 		{ return this->_number_girocard; }
	inline unsigned long total_girocard_in_cent() const	{ return this->_total_girocard_in_cent; }
	inline unsigned int number_jcb() const 				{ return this->_number_jcb; }
	inline unsigned long total_jcb_in_cent() const 		{ return this->_total_jcb_in_cent; }
	inline unsigned int number_eurocard() const 		{ return this->_number_eurocard; }
	inline unsigned long total_eurocard_in_cent() const { return this->_total_eurocard_in_cent; }
	inline unsigned int number_amex() const 			{ return this->_number_amex; }
	inline unsigned long total_amex_in_cent() const 	{ return this->_total_amex_in_cent; }
	inline unsigned int number_visa() const 			{ return this->_number_visa; }
	inline unsigned long total_visa_in_cent() const 	{ return this->_total_visa_in_cent; }
	inline unsigned int number_diners() const 			{ return this->_number_diners; }
	inline unsigned long total_diners_in_cent() const 	{ return this->_total_diners_in_cent; }
	inline unsigned int number_others() const 			{ return this->_number_others; }
	inline unsigned long total_others_in_cent() const 	{ return this->_total_others_in_cent; }
//@formatter:on
};
}
#endif /* BMPS_INDIVIDUALTOTALS_HPP_ */
