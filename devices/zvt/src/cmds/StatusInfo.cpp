/*
 * StatusInfo.cpp
 *
 *  Created on: 18.11.2020
 *      Author: ah
 */

#include <cmds/StatusInfo.hpp>

Cmd::StatusInfo::StatusInfo()
        :
        Zvt::Apdu(0x04, 0x0F)
        , _status(0xFF)
        , tlv_container(Zvt::Tlv())
        , _tid(0)
        , _amount(0)
        , _trace(0)
        , _original_trace(0)
        , _time(std::string())
        , _date(std::string())
        , _expiry_date(std::string())
        , _sequence_number(0)
        , _payment_type(0x00)
        , _receipt_number(0)
        , _aid(std::string())
        , _iso_currency(978)
        , _card_type(0x00)
        , _card_name(std::string())
        , _card_type_net_op(0x00)
        , _result_code(0xFF)
        , _vu_number(std::string())
        , _additional_text(std::string())
{
}

Cmd::StatusInfo::~StatusInfo()
{
}

Cmd::StatusInfo::StatusInfo(const unsigned char *data, int length)
        :
        Zvt::Apdu(data, length)
        , _status(0xFF)
        , tlv_container(Zvt::Tlv())
        , _tid(0)
        , _amount(0)
        , _trace(0)
        , _original_trace(0)
        , _time(std::string())
        , _date(
        std::string())
        , _expiry_date(std::string())
        , _sequence_number(0)
        , _payment_type(0x00)
        , _receipt_number(0)
        , _aid(std::string())
        , _iso_currency(
        978)
        , _card_type(0x00)
        , _card_name(std::string())
        , _pan(std::string())
        , _card_type_net_op(0x00)
        , _result_code(0xFF)
        , _vu_number(std::string())
        , _additional_text(
        std::string())
        , _individual_totals(Bmp::IndividualTotals())
{
    this->parse();
}

Cmd::StatusInfo::StatusInfo(const std::vector<unsigned char> data)
        :
        Zvt::Apdu(data)
        , _status(0xFF)
        , tlv_container(Zvt::Tlv())
        , _tid(0)
        , _amount(0)
        , _trace(0)
        , _original_trace(0)
        , _time(std::string())
        , _date(
        std::string())
        , _expiry_date(std::string())
        , _sequence_number(0)
        , _payment_type(0x00)
        , _receipt_number(0)
        , _aid(std::string())
        , _iso_currency(
        978)
        , _card_type(0x00)
        , _card_name(std::string())
        , _pan(std::string())
        , _card_type_net_op(0x00)
        , _result_code(0xFF)
        , _vu_number(std::string())
        , _additional_text(
        std::string())
        , _individual_totals(Bmp::IndividualTotals())
{
    this->parse();
}

Cmd::StatusInfo::StatusInfo(const StatusInfo &other)
        :
        Zvt::Apdu(other.vdata)
        , _status(other.status())
        , tlv_container(other.tlv())
        , _tid(0)
        , _amount(0)
        , _trace(0)
        , _original_trace(0)
        , _time(std::string())
        , _date(
        std::string())
        , _expiry_date(std::string())
        , _sequence_number(0)
        , _payment_type(0x00)
        , _receipt_number(0)
        , _aid(std::string())
        , _iso_currency(
        978)
        , _card_type(0x00)
        , _card_name(std::string())
        , _pan(std::string())
        , _card_type_net_op(0x00)
        , _result_code(0xFF)
        , _vu_number(std::string())
        , _additional_text(
        std::string())
        , _individual_totals(Bmp::IndividualTotals())
{
    this->parse();
}

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
std::vector<Zvt::Bmp> Cmd::StatusInfo::parse(void)
{
    std::vector<Zvt::Bmp> bmps;

    for (int idx = 0; idx < this->data().size();)
    {
        int sidx = idx;

        //std::cout << "<-PT: BMP_" << Utils::log_hex_str(this->data()[idx]) << std::endl;

        switch (this->data()[idx])
        {
            case Zvt::BMP_04:
            {
                //Utils::log("04: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 6));
                this->_amount = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 6));
                idx = sidx + 7;
                break;
            }
            case Zvt::BMP_27:
            {
                this->_status = this->data()[sidx + 1];
                //Utils::log("27: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 1));
                idx = sidx + 2;
                break;
            }
            case Zvt::BMP_29:
            {
                //Utils::log("29: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 4));
                this->_tid = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 4));
                idx = sidx + 5;
                break;
            }
            case Zvt::BMP_0B:
            {
                //Utils::log("0B: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                this->_trace = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                idx = sidx + 4;
                break;
            }
            case Zvt::BMP_37:
            {
                //Utils::log("37: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                this->_original_trace = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                idx = sidx + 4;
                break;
            }
            case Zvt::BMP_0C:
            {
                //Utils::log("0C: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                this->_time = Zvt::Bmp::BCDToString(Zvt::copyRange(this->data(), sidx + 1, sidx + 3));
                idx = sidx + 4;
                break;
            }
            case Zvt::BMP_0D:
            {
                //Utils::log("0D: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                _date = Zvt::Bmp::BCDToString(Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                idx = sidx + 3;
                break;
            }
            case Zvt::BMP_0E:
            {
                //Utils::log("0E: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                this->_expiry_date = Zvt::Bmp::BCDToString(Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                idx = sidx + 3;
                break;
            }
            case Zvt::BMP_49:
            {
                //Utils::log("49: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                this->_iso_currency = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                idx = sidx + 3;
                break;
            }
            case Zvt::BMP_17:
            {
                //Utils::log("17: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                this->_sequence_number = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                idx = sidx + 3;
                break;
            }
            case Zvt::BMP_19:
            {
                this->_payment_type = this->data()[sidx + 1];
                //Utils::log("19: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 1));
                idx = sidx + 2;
                break;
            }
            case Zvt::BMP_22:
            {
                std::vector<unsigned char> ldata = Zvt::llvar_data(Zvt::copyRange(this->data(), sidx + 1, this->data().size() - 1));
                //Utils::log("22: ", ldata);
                this->_pan = Zvt::Bmp::BytesToHexString(ldata);
                idx = sidx + ldata.size() + 3;
                break;
            }
            case Zvt::BMP_87:
            {
                //Utils::log("87: ", Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                this->_receipt_number = Zvt::Bmp::BCDToNumber(Zvt::copyRange(this->data(), sidx + 1, sidx + 2));
                idx = sidx + 3;
                break;
            }
            case Zvt::BMP_2A:
            {
                std::vector<unsigned char> adata = Zvt::copyRange(this->data(), sidx + 1, sidx + 15);
                //Utils::log("2A: ", adata);
                this->_vu_number = Zvt::Bmp::BytesToString(adata);
                idx = sidx + 16;
                break;
            }
            case Zvt::BMP_3B:
            {
                std::vector<unsigned char> adata = Zvt::copyRange(this->data(), sidx + 1, sidx + 8);
                //Utils::log("3B: ", adata);
                this->_aid = Zvt::Bmp::BytesToString(adata);
                idx = sidx + 9;
                break;
            }
            case Zvt::BMP_3C:
            {
                /**
                 * 3c 	f0f6f3
                 * 41 49 44 20 20 20 20 20 20 20
                 * 20 20 3a 20 36 35 34 33 32 31
                 * 2f 43 61 70 74 2e 2d 52 65 66
                 * 2e 20 20 3a 20 30 30 30 30 2f
                 * 53 65 72 69 65 6e 2d 4e 72 2e
                 * 20 20 3a 20 30 30 20 30 35 33
                 * 20 30 30
                 */
                std::vector<unsigned char> ldata = Zvt::lllvar_data(Zvt::copyRange(this->data(), sidx + 1, this->data().size() - 1));
                this->_additional_text = Zvt::Bmp::BytesToString(ldata);
                idx = sidx + ldata.size() + 4;
                break;
            }
            case Zvt::BMP_8A:
            {
                this->_card_type = this->data()[sidx + 1];
                //Utils::log("8A: ", _card_type);
                idx = sidx + 2;
                break;
            }
            case Zvt::BMP_8C:
            {
                this->_card_type_net_op = this->data()[sidx + 1];
                //Utils::log("8A: ", _card_type);
                idx = sidx + 2;
                break;
            }
            case Zvt::BMP_A0:
            {
                this->_result_code = this->data()[sidx + 1];
                //Utils::log("8A: ", _card_type);
                idx = sidx + 2;
                break;
            }
            case Zvt::BMP_8B:
            {
                std::vector<unsigned char> ldata = Zvt::llvar_data(Zvt::copyRange(this->data(), sidx + 1, this->data().size() - 1));
                //Utils::log("8B: ", ldata);
                this->_card_name = Zvt::Bmp::BytesToString(ldata);
                idx = sidx + ldata.size() + 3;
                break;
            }
            case Zvt::BMP_9A:
            {
                /**
                 * 9A		<total-record Geldkarte>
                 * 			LLLVAR 100 byte (ref. “Schnittstellenspezifikation für die ZKA-Chipkarte - GeldKarte Version 5.2”)
                 *
                 * Note:
                 * - only sent if Geldkarte-turnover available
                 */
                std::vector<unsigned char> ldata = Zvt::lllvar_data(Zvt::copyRange(this->data(), sidx + 1, this->data().size() - 1));
                //this->_individual_totals = Zvt::Bmp::BytesToHexString(ldata);

                std::cout << "<-PT| WARN" << std::endl;
                std::cout << "<-PT| Todo: BMP_9A not fully implemented (no member in Cmd::StatusInfo" << std::endl;
                idx = sidx + ldata.size() + 4;
                break;
            }
            case Zvt::BMP_60:
            {
                /*
                 * Individual totals
                 *
                 *
                 * LLLVAR BCD packed:
                 * 2 byte BCD receipt-number start (N4)
                 * 2 byte BCD receipt-number end (N4)
                 *
                 * 1 byte binary number of Girocard
                 * 6 byte BCD, total turnover Girocard
                 *
                 * 1 byte binary number of JCB
                 * 6 byte BCD, total turnover JCB
                 *
                 * 1 byte binary number of Eurocard
                 * 6 byte BCD, total turnover Eurocard
                 *
                 * 1 byte binary number of Amex
                 * 6 byte BCD, total turnover Amex
                 *
                 * 1 byte binary number of VISA
                 * 6 byte BCD, total turnover VISA
                 *
                 * 1 byte binary number of Diners
                 * 6 byte BCD, total turnover Diners
                 *
                 * 1 byte binary number of remaining cards
                 * 6 byte BCD, total turnover remaining cards
                 */
                std::vector<unsigned char> ldata = Zvt::lllvar_data(Zvt::copyRange(this->data(), sidx + 1, this->data().size() - 1));

                this->_individual_totals = Bmp::IndividualTotals();
                this->_individual_totals.strip_of(Zvt::copyRange(this->data(), sidx, sidx + 3 + ldata.size()));

                idx = sidx + ldata.size() + 4;
                break;
            }
            case Zvt::BMP_06:
            {
                int offset = Zvt::Tlv::calculateSizeOffset(this->data()[sidx + 1]);
                int length = Zvt::Tlv::calculateSize(Zvt::copyRange(this->data(), sidx + 1, sidx + offset));
                this->tlv_container = Zvt::Tlv(Zvt::copyRange(this->data(), sidx, sidx + offset + length));
                idx = sidx + offset + length + 1;
                break;
            }
            default:
                Utils::log("Not implemented yet", Zvt::copyRange(this->data(), idx, this->data().size() - 1));
                idx = this->data().size();
                break;
        }
    }

    return bmps;
}

void Cmd::StatusInfo::print_totals_per_card()
{

}

void Cmd::StatusInfo::print()
{
    int width = 25;

    std::ios oldState(nullptr);
    oldState.copyfmt(std::cout);

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "status";
    std::cout << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xFF & status()) << std::endl;

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "payment_type";
    std::cout << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xFF & payment_type()) << std::endl;

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "card_type";
    std::cout << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xFF & card_type()) << std::endl;

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "card_type_net_op";
    std::cout << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xFF & network_operator_card_type()) << std::endl;

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "result_code";
    std::cout << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xFF & result_code()) << std::endl;

    std::cout.copyfmt(oldState);

    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "currency" << currency() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "aid" << aid() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "amount in cent" << amount() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "card_name" << card_name() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "date" << date() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "expiry_date" << expiry_date() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "original_trace" << original_trace() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "receipt_number" << receipt_number() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "sequence_number" << sequence_number() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "tid" << tid() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "time" << time() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "trace" << trace() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "pan" << pan() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "vu_number" << vu_number() << std::endl;
    std::cout << "<-PT| " << std::setw(width) << std::setfill(' ') << std::left << "additional_text" << additional_text() << std::endl;

    individual_totals().print();

    for (Zvt::Tag tag: this->tlv().tags())
    {
        std::cout << "<-PT| "
                  << std::setw(width) << std::setfill(' ') << std::left << "tlv_tag"
                  << std::setw(4) << std::setfill(' ') << std::left << tag.tag_str() << " --> " << std::right
                  << Utils::log_hex_str(tag.data()) << std::endl;

        if (tag.isContructed())
        {
            for (Zvt::Tag stag: tag.subtags())
            {
                std::cout << "<-PT| "
                          << std::setw(width + 4) << std::setfill(' ') << std::left << "tlv_subtag"
                          << std::setw(4) << std::setfill(' ') << std::left << stag.tag_str() << " --> " << std::right
                          << Utils::log_hex_str(stag.data()) << std::endl;

                if (stag.isContructed())
                {
                    for (Zvt::Tag sstag: stag.subtags())
                    {
                        std::cout << "<-PT| "
                                  << std::setw(width + 8) << std::setfill(' ') << std::left << "tlv_subtag"
                                  << std::setw(4) << std::setfill(' ') << std::left << sstag.tag_str() << " --> " << std::right
                                  << Utils::log_hex_str(sstag.data()) << std::endl;
                        if (sstag.isContructed())
                        {
                            std::cout << "<-PT| sstag isContructed --> " << sstag.tag_str() << std::endl;
                        }
                        else if (sstag.isAscii())
                        {
                            std::cout << "<-PT| "
                                      << std::setw(width + 8) << std::setfill(' ') << std::left << "          "
                                      << std::setw(4) << std::setfill(' ') << std::left << " " << "     " << std::right
                                      << sstag.data_str() << std::endl;
                        }
                    }
                }
                else if (stag.isAscii())
                {
                    std::cout << "<-PT| "
                              << std::setw(width + 4) << std::setfill(' ') << std::left << "          "
                              << std::setw(4) << std::setfill(' ') << std::left << " " << "     " << std::right
                              << stag.data_str() << std::endl;
                }
            }
        }
        else if (tag.isAscii())
        {
            std::cout << "<-PT| "
                      << std::setw(width) << std::setfill(' ') << std::left << "          "
                      << std::setw(4) << std::setfill(' ') << std::left << " " << "     " << std::right
                      << tag.data_str() << std::endl;
        }
    }

    std::cout.copyfmt(oldState);
}
