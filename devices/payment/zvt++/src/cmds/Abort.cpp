/*
 * Ack.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/Abort.hpp>

Cmd::Abort::Abort()
        : Zvt::Apdu(0x06, 0x1e)
          , _resultCode(0)
          , _extendedErrorCode(std::string())
          , _extendedErrorMessage(std::string())
          , _receipt_numbers(std::vector<std::string>())
{
}

#pragma clang diagnostic push
#pragma ide diagnostic ignored "VirtualCallInCtorOrDtor"

Cmd::Abort::Abort(const Zvt::Apdu &apdu)
        : Zvt::Apdu(apdu)
          , _resultCode(0)
          , _extendedErrorCode(std::string())
          , _extendedErrorMessage(std::string())
          , _receipt_numbers(std::vector<std::string>())
{
    parse();
}

#pragma clang diagnostic pop

Cmd::Abort::~Abort()
{
}

std::vector<Zvt::Bmp> Cmd::Abort::parse(void)
{
    std::vector<Zvt::Bmp> bmps = Apdu::parse();

    if (this->dataSize() > 0)
    {
        this->_resultCode = this->data()[0];

        /**
         * May be CC (currency), bmp 87 and/or TLV
         *
         */
        if (this->dataSize() > 1)
        {
            std::vector<unsigned char> bytes = Zvt::copyRange(this->data(), 1, this->dataSize() - 1);

            if (bytes[0] == Zvt::BMP_06)
            {
                Zvt::Tlv tlv;
                tlv.strip_of(Zvt::copyRange(bytes, 0, bytes.size() - 1));

                if (!tlv.get().empty())
                {
                    Utils::print_tlv_tags(tlv);

                    for (Zvt::Tag tag: tlv.tags())
                    {
                        //cout << tag.tag_str() << endl;

                        if (tag.tag_str() == "1F16")
                        {
                            this->_extendedErrorCode = Utils::log_hex_str(tag.data());
                        }
                        else if (tag.tag_str() == "1F17")
                        {
                            this->_extendedErrorMessage = Zvt::Bmp::BytesToString(tag.data());
                        }
                            // 0623 03 87 FFFF for getting open pre_authorizations; if there are more than one receiptNo!
                        else if (tag.tag_str() == "23")
                        {
                            for (auto stag: tag.subtags())
                            {
                                if (stag.tag_str() == "08")
                                {
                                    this->_receipt_numbers.push_back(Zvt::Bmp::BCDToString(stag.data()));
                                }
                            }
                        }
                    }

                    bmps.push_back(tlv);
                }
            }
            // 0623 03 87 FFFF for getting open pre_authorizations; ifg only one exists BMP87 is behind the resultCode!
            else if (bytes[0] == Zvt::BMP_87)
            {
                if (bytes[1] != 0xff)
                {
                    std::string receiptNo = Utils::upper(Zvt::Bmp::BCDToString(Zvt::copyRange(bytes, 1, bytes.size() - 1)));

                    if (receiptNo != "" && receiptNo != "FFFF")
                        this->_receipt_numbers.push_back(receiptNo);
                }
            }
        }
    }

    return bmps;
}

