/*
 * IndividualTotals.cpp
 *
 *  Created on: 25.11.2020
 *      Author: ah
 */

#include <bmps/IndividualTotals.hpp>

#include <Apdu.hpp>

Bmp::IndividualTotals::IndividualTotals() :
		Zvt::Bmp(Zvt::LLL_Var, {0x60, 0xf0, 0xf0, 0xf0}), _receipt_from(0x00), _receipt_to(0x00), _number_girocard(0x00), _total_girocard_in_cent(0x00), _number_jcb(
				0x00), _total_jcb_in_cent(0x00), _number_eurocard(0x00), _total_eurocard_in_cent(0x00), _number_amex(0x00), _total_amex_in_cent(0x00), _number_visa(
				0x00), _total_visa_in_cent(0x00), _number_diners(0x00), _total_diners_in_cent(0x00), _number_others(0x00), _total_others_in_cent(0x00)
{
	this->strip_of(this->all());
}

Bmp::IndividualTotals::~IndividualTotals()
{
}

Bmp::IndividualTotals::IndividualTotals(const IndividualTotals& other) :
		Zvt::Bmp(other.fmt(), other.all()), _receipt_from(0x00), _receipt_to(0x00), _number_girocard(0x00), _total_girocard_in_cent(0x00), _number_jcb(0x00), _total_jcb_in_cent(
				0x00), _number_eurocard(0x00), _total_eurocard_in_cent(0x00), _number_amex(0x00), _total_amex_in_cent(0x00), _number_visa(0x00), _total_visa_in_cent(
				0x00), _number_diners(0x00), _total_diners_in_cent(0x00), _number_others(0x00), _total_others_in_cent(0x00)
{
	this->strip_of(this->all());
}

void Bmp::IndividualTotals::strip_of(const std::vector<unsigned char> bmp)
{
	// use the default implementation
	this->Bmp::strip_of(bmp);

	// we expect lllvar with 3-byte length) + 53-byte follows
	if (this->get().size() == 56 && this->bmp() == 0x60)
	{
		std::vector<unsigned char> bmp60 = Zvt::lllvar_data(Zvt::copyRange(this->get(), 0, this->get().size() - 1));

		this->_receipt_from = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 0, 1));
		this->_receipt_to = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 2, 3));

		this->_number_girocard = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 4, 4));
		this->_total_girocard_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 5, 10));

		this->_number_jcb = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 11, 11));
		this->_total_jcb_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 12, 17));

		this->_number_eurocard = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 18, 18));
		this->_total_eurocard_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 19, 24));

		this->_number_amex = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 25, 25));
		this->_total_amex_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 26, 31));

		this->_number_visa = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 32, 32));
		this->_total_visa_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 33, 38));

		this->_number_diners = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 39, 39));
		this->_total_diners_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 40, 45));
		this->_number_others = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 46, 46));
		this->_total_others_in_cent = Zvt::Bmp::BCDToNumber(Zvt::copyRange(bmp60, 47, 52));
	}
	else if (this->get().size() == 3 && this->get()[0] == 0xf0 && this->get()[1] == 0xf0 && this->get()[2] == 0xf0)
	{
		// empty lllvar but 60f0f0f0 is a correct BMP
	}
	else std::cerr << "Error: Vector did not contain BMP_60 data!" << std::endl << "Error: " << Utils::log_hex_str(bmp) << std::endl;
}

void Bmp::IndividualTotals::print(void) const
{
	if (this->receipt_from() != 0 && this->receipt_to() != 0)
	{
		int width = 25;

		std::ios oldState(nullptr);
		oldState.copyfmt(std::cout);
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "receipt_from" << receipt_from() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "receipt_to" << receipt_to() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_girocard" << number_girocard() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_girocard_in_cent" << total_girocard_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_jcb" << number_jcb() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_jcb_in_cent" << total_jcb_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_eurocard" << number_eurocard() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_eurocard_in_cent" << total_eurocard_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_amex" << number_amex() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_amex_in_cent" << total_amex_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_visa" << number_visa() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_visa_in_cent" << total_visa_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_diners" << number_diners() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_diners_in_cent" << total_diners_in_cent() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "number_others" << number_others() << std::endl;
		std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "total_others_in_cent" << total_others_in_cent() << std::endl;
		std::cout.copyfmt(oldState);
	}
}
