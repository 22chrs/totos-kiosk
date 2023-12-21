/*
 * CompletionForRegister.cpp
 *
 *  Created on: 16.11.2020
 *      Author: ah
 */

#include <cmds/CompletionForRegister.hpp>

Cmd::CompletionForRegister::CompletionForRegister()
        : Apdu(0x06, 0x0F)
          , bmp19(Zvt::Bmp(0x19, Zvt::One_Byte_Binary, {}))
          , bmp29(Zvt::Bmp(0x29, Zvt::Four_Byte_Bcd, {}))
          , bmp49(
                Zvt::Bmp(0x49, Zvt::Two_Byte_Bcd, {}))
          , tlv_container(Zvt::Tlv())
{

}

Cmd::CompletionForRegister::CompletionForRegister(const unsigned char *buffer, int length)
        : Apdu(buffer, length)
          , bmp19(Zvt::Bmp())
          , bmp29(Zvt::Bmp())
          , bmp49(Zvt::Bmp())
          , tlv_container(Zvt::Tlv())
{
    this->parse();
}

Cmd::CompletionForRegister::~CompletionForRegister()
{
    // TODO Auto-generated destructor stub
}

/*
 * 06 0f ff 36 01 (1*256+54 == 310)
 * 19 00
 * 29 52 50 00 68
 * 49 09 78
 * 06 82 01 28 27 03 14 01 fe 12 01 30 26 81 d4 0a 02 05 01 0a 02 06 00 0a 02 06 01 0a 02 06 02 0a 02 06 03 0a 02 06 05 0a 02 06 0a 0a 02 06 0c 0a 02 06 12 0a 02 06 18 0a 02 06 1a 0a 02 06 1b 0a 02 06 20 0a 02 06 21 0a 02 06 22 0a 02 06 23 0a 02 06 24 0a 02 06 25 0a 02 06 26 0a 02 06 30 0a 02 06 31 0a 02 06 50 0a 02 06 70 0a 02 06 85 0a 02 06 86 0a 02 06 87 0a 02 06 88 0a 02 06 93 0a 02 06 b0 0a 02 06 c0 0a 02 06 c1 0a 02 06 c2 0a 02 06 c3 0a 02 06 c4 0a 02 06 c5 0a 02 06 c6 0a 02 06 d1 0a 02 06 d3 0a 02 06 e0 0a 02 06 e1 0a 02 06 e2 0a 02 06 e3 0a 02 06 e5 0a 02 06 e6 0a 02 06 e7 0a 02 08 01 0a 02 08 02 0a 02 08 10 0a 02 08 11 0a 02 08 12 0a 02 08 13 0a 02 08 30 0a 02 08 50 1f 71 46 0f 12 14 1b 1d 25 26 27 2d 40 41 e8 1f 01 1f 02 1f 03 1f 06 1f 0d 1f 15 1f 25 1f 32 1f 33 1f 35 1f 36 1f 46 1f 48 1f 49 1f 4a 1f 4b 1f 4c 1f 5b 1f 60 1f 61 1f 62 1f 63 1f 6b 1f 6d 1f 70 1f 72 1f 76 1f 77 1f 78
 */
std::vector<Zvt::Bmp> Cmd::CompletionForRegister::parse(void)
{
    std::vector<Zvt::Bmp> bmps = Zvt::Apdu::parse();

    for (int idx = this->fmt() == Zvt::ONE ? 3 : 5; idx < size();)
    {
        switch (this->vdata[idx])
        {
            case Zvt::BMP_19:
            {
                bmps.push_back(this->bmp19 = Zvt::Bmp(this->vdata[idx], Zvt::One_Byte_Binary, this->copyRange(idx + 1, idx + 1)));
                idx = idx + 2;
                break;
            }
            case Zvt::BMP_29:
            {
                bmps.push_back(this->bmp29 = Zvt::Bmp(this->vdata[idx], Zvt::Four_Byte_Bcd, this->copyRange(idx + 1, idx + 4)));
                idx = idx + 5;
                break;
            }
            case Zvt::BMP_49:
            {
                bmps.push_back(this->bmp49 = Zvt::Bmp(this->vdata[idx], Zvt::Two_Byte_Bcd, this->copyRange(idx + 1, idx + 2)));
                idx = idx + 3;
                break;
            }
            case Zvt::BMP_06:
            {
                // check if one, two or three byte length
                int offset = Zvt::Tlv::calculateSizeOffset(this->vdata[idx + 1]);
                int length = 0;

                if (offset != 0)
                {
                    length = Zvt::Tlv::calculateSize(this->copyRange(idx + 1, idx + offset));
                    bmps.push_back(this->tlv_container = Zvt::Tlv(this->copyRange(idx, idx + offset + length)));
                    idx = idx + offset + length + 1;
                }
                else
                {
                    // broken length
                    bmps.push_back(Zvt::Tlv());
                    idx = this->vdata.size();
                }
                break;
            }
            default:
            {
                std::cerr << "some BMP is not implemented " << Utils::log_hex_str(this->vdata[idx]) << std::endl;
                std::cerr << "Stopping loop" << std::endl;
                idx = this->vdata.size();
                break;
            }
        }
    }

    return bmps;
}

void Cmd::CompletionForRegister::print(void)
{
    std::cout << "<-PT| from cmd 0600" << std::endl;
    std::cout << "<-PT| tid      --> " << tid() << std::endl;
    std::cout << "<-PT| status   --> " << status() << std::endl;
    std::cout << "<-PT| currency --> " << currencyCode() << std::endl;
    Utils::print_tlv_tags(tlv());
    std::cout << endl;
}
