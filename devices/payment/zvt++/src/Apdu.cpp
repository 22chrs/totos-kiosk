/*
 * Apdu.cpp
 *
 *  Created on: 29.10.2020
 *      Author: ah
 */

#include "Apdu.hpp"
#include "Tlv.hpp"

#include <iostream>
#include <algorithm>

using std::copy;
using std::vector;

Zvt::Apdu::Apdu(const unsigned char b1, const unsigned char b2)
        :
        _ccrc(b1)
        , _aprc(b2)
        , lf(ONE)
        , vdata(std::vector<unsigned char>())
        , _flow(CMD_UNKNOWN)
{
    this->init();
}

Zvt::Apdu::Apdu(const unsigned char b1, const unsigned char b2, Zvt::LengthFormat lf)
        :
        _ccrc(b1)
        , _aprc(b2)
        , lf(lf)
        , vdata(std::vector<unsigned char>())
        , _flow(CMD_UNKNOWN)
{
    this->init();
}

Zvt::Apdu::Apdu(const unsigned char *buffer, const int length)
        :
        _ccrc(0x00)
        , _aprc(0x00)
        , lf(ONE)
        , vdata(std::vector<unsigned char>(buffer, buffer + length))
        , _flow(CMD_UNKNOWN)
{
    this->_ccrc = vdata.at(0);
    this->_aprc = vdata.at(1);
    this->lf = vdata.at(2) == 0xFF ? THREE : ONE;
}

Zvt::Apdu::Apdu(const std::vector<unsigned char> data)
        :
        _ccrc(0x00)
        , _aprc(0x00)
        , lf(ONE)
        , vdata(data)
        , _flow(CMD_UNKNOWN)
{
    this->_ccrc = vdata.at(0);
    this->_aprc = vdata.at(1);
    this->lf = vdata.at(2) == 0xFF ? THREE : ONE;
}

Zvt::Apdu::Apdu(const Zvt::Apdu &apdu)
        :
        _ccrc(apdu.ccrc())
        , _aprc(apdu.aprc())
        , lf(apdu.fmt())
        , vdata(apdu.cmd(), apdu.cmd() + apdu.size())
        , _flow(apdu.flow())
{
}

Zvt::Apdu::~Apdu()
{

}

void Zvt::Apdu::init(void)
{
    this->vdata.push_back(ccrc());
    this->vdata.push_back(aprc());
    this->vdata.push_back(0x00);
}
/*
 * 06 0f ff 36 01
 * 19 00
 * 29 52 50 00 68
 * 49 09 78 06 82 01 28 27 03 14 01 01 12 01 30 26 81 d4 0a 02 05 01 0a 02 06 00 0a 02 06 01 0a 02 06 02 0a 02 06 03 0a 02 06 05 0a 02 06 0a 0a 02 06 0c 0a 02 06 12 0a 02 06 18 0a 02 06 1a 0a 02 06 1b 0a 02 06 20 0a 02 06 21 0a 02 06 22 0a 02 06 23 0a 02 06 24 0a 02 06 25 0a 02 06 26 0a 02 06 30 0a 02 06 31 0a 02 06 50 0a 02 06 70 0a 02 06 85 0a 02 06 86 0a 02 06 87 0a 02 06 88 0a 02 06 93 0a 02 06 b0 0a 02 06 c0 0a 02 06 c1 0a 02 06 c2 0a 02 06 c3 0a 02 06 c4 0a 02 06 c5 0a 02 06 c6 0a 02 06 d1 0a 02 06 d3 0a 02 06 e0 0a 02 06 e1 0a 02 06 e2 0a 02 06 e3 0a 02 06 e5 0a 02 06 e6 0a 02 06 e7 0a 02 08 01 0a 02 08 02 0a 02 08 10 0a 02 08 11 0a 02 08 12 0a 02 08 13 0a 02 08 30 0a 02 08 50 1f 71 46 0f 12 14 1b 1d 25 26 27 2d 40 41 e8 1f 01 1f 02 1f 03 1f 06 1f 0d 1f 15 1f 25 1f 32 1f 33 1f 35 1f 36 1f 46 1f 48 1f 49 1f 4a 1f 4b 1f 4c 1f 5b 1f 60 1f 61 1f 62 1f 63 1f 6b 1f 6d 1f 70 1f 72 1f 76 1f 77 1f 78
 */
// Default implementation return an empty vector...
std::vector<Zvt::Bmp> Zvt::Apdu::parse(void)
{
    return std::vector<Zvt::Bmp>();
}

std::vector<Zvt::Bmp> Zvt::Apdu::parse(Zvt::Command initial_command)
{
    std::vector<Zvt::Bmp> bmps;

    switch (this->isA())
    {
        case CMD_060F:
        {
            switch (initial_command)
            {
                case CMD_0600:
                    return this->parse();
                default:
                    return bmps;
            }
        }
        default:
            return bmps;
    }
}

std::vector<unsigned char> Zvt::Apdu::lengthBuffer()
{
    switch (this->lf)
    {
        case THREE:
        {
            std::vector<unsigned char> lbuff(3);
            lbuff[0] = this->vdata.at(2);
            lbuff[1] = this->vdata.at(3);
            lbuff[2] = this->vdata.at(4);

            return lbuff;
        }
        case ONE:
        default:
        {
            std::vector<unsigned char> lbuff(1);
            lbuff[0] = this->vdata.at(2);

            return lbuff;
        }
    }
}

void Zvt::Apdu::addBmp(const unsigned char byte)
{
    int newSize = this->dataSize() + 1;

    //check if extended size is needed
    if (newSize > 254 && this->lf == ONE)
    {
        const unsigned char lb[1] = {byte};
        this->extendOneToThree(lb, 1);
    }

    switch (this->lf)
    {
        case THREE:
        {
            std::vector<unsigned char> apduSize = calculateApduSize(newSize);

            this->vdata[2] = apduSize[0];
            this->vdata[3] = apduSize[1];
            this->vdata[4] = apduSize[2];
            break;
        }
        case ONE:
        default:
        {
            this->vdata[2] = this->vdata[2] + 1;
            break;
        }
    }

    this->vdata.push_back(byte);
}

void Zvt::Apdu::extendOneToThree(const unsigned char *buffer, const int length)
{
    int newSize = this->dataSize() + length;

    std::vector<unsigned char> newData;
    std::vector<unsigned char> apduSize = calculateApduSize(newSize);

    newData[0] = this->ccrc();
    newData[1] = this->aprc();
    newData[2] = apduSize[0];
    newData[3] = apduSize[1];
    newData[4] = apduSize[2];

    this->lf = THREE;

    for (int idx = 3; idx < this->vdata.size(); ++idx)
    {
        newData.push_back(this->vdata[idx]);
    }

    this->vdata = newData;
}

void Zvt::Apdu::addBmp(const unsigned char *buffer, int length)
{
    int newSize = this->dataSize() + length;

    //check if extended size is needed
    if (newSize > 254 && this->lf == ONE)
    {
        this->extendOneToThree(buffer, length);
    }

    switch (this->lf)
    {
        case THREE:
        {
            std::vector<unsigned char> apduSize = calculateApduSize(newSize);

            this->vdata[2] = apduSize[0];
            this->vdata[3] = apduSize[1];
            this->vdata[4] = apduSize[2];
            break;
        }
        case ONE:
        default:
        {
            this->vdata[2] = newSize;
            break;
        }
    }

    for (int idx = 0; idx < length; ++idx)
    {
        this->vdata.push_back(buffer[idx]);
    }
}

void Zvt::Apdu::addBmp(const std::vector<unsigned char> data)
{
    int newSize = this->dataSize() + data.size();

    //check if extended size is needed
    if (newSize > 254 && this->lf == ONE)
    {
        this->extendOneToThree(data.data(), data.size());
    }

    switch (this->lf)
    {
        case THREE:
        {
            std::vector<unsigned char> apduSize = calculateApduSize(newSize);

            this->vdata[2] = apduSize[0];
            this->vdata[3] = apduSize[1];
            this->vdata[4] = apduSize[2];
            break;
        }
        case ONE:
        default:
        {
            this->vdata[2] = newSize;
            break;
        }
    }

    this->vdata.insert(this->vdata.end(), data.begin(), data.end());
}

void Zvt::Apdu::addBmp(const HexToByte bmp)
{
    addBmp(bmp.buffer(), bmp.size());
}

void Zvt::Apdu::addBmp(Zvt::Bmp bmp)
{
    addBmp(bmp.all());
}


void Zvt::Apdu::print()
{
    std::string shortname = "CMD_UNKNOWN";
    switch (isA())
    {
        case Zvt::CMD_8000:
            shortname = "Ack";
            break;
        case Zvt::CMD_060F:
            shortname = "Completion";
            break;
        case Zvt::CMD_061E:
            shortname = "Abort";
            break;
        case Zvt::CMD_04FF:
            shortname = "IntermdiateStatusInfo";
            break;
        case Zvt::CMD_040F:
            shortname = "StatusInfo";
            break;
        case Zvt::CMD_06D3:
            shortname = "BlockReceipt";
            break;
        case Zvt::CMD_06D1:
            shortname = "PrintLine";
            break;
        case Zvt::CMD_0601:
            shortname = "Authorisation/Payment";
            break;
        case Zvt::CMD_8400:
        case Zvt::CMD_849A:
        case Zvt::CMD_849C:
        case Zvt::CMD_84xx:
            shortname = "NAck";
            break;
        default:
            shortname = "Unknown Command";
            break;
    }
    std::cout << "<-PT* " << shortname << " (" << Utils::log_hex_str(ccrc()) << Utils::log_hex_str(aprc()) << ") size (" << size() << ")"
              << endl;
    Utils::log("<-PT$ ", cmd(), size());
}


Zvt::Command Zvt::Apdu::isA(void)
{
    switch (ccrc())
    {
        case 0x04:
        {
            switch (aprc())
            {
                case 0x01:
                    return CMD_0401;
                case 0x0D:
                    return CMD_040D;
                case 0x0E:
                    return CMD_040E;
                case 0x0F:
                    return CMD_040F;
                case 0xFF:
                    return CMD_04FF;
            }
            break;
        }
        case 0x05:
        {
            switch (aprc())
            {
                case 0x01:
                    return CMD_0501;
            }
            break;
        }
        case 0x06:
        {
            switch (aprc())
            {
                case 0x00:
                    return CMD_0600;
                case 0x01:
                    return CMD_0601;
                case 0x02:
                    return CMD_0602;
                case 0x03:
                    return CMD_0603;
                case 0x04:
                    return CMD_0604;
                case 0x05:
                    return CMD_0605;
                case 0x09:
                    return CMD_0609;
                case 0x0A:
                    return CMD_060A;
                case 0x0B:
                    return CMD_060B;
                case 0x0C:
                    return CMD_060C;
                case 0x0F:
                    return CMD_060F;
                case 0x10:
                    return CMD_0610;
                case 0x11:
                    return CMD_0611;
                case 0x12:
                    return CMD_0612;
                case 0x18:
                    return CMD_0618;
                case 0x1A:
                    return CMD_061A;
                case 0x1B:
                    return CMD_061B;
                case 0x1E:
                    return CMD_061E;
                case 0x20:
                    return CMD_0620;
                case 0x21:
                    return CMD_0621;
                case 0x22:
                    return CMD_0622;
                case 0x23:
                    return CMD_0623;
                case 0x24:
                    return CMD_0624;
                case 0x25:
                    return CMD_0625;
                case 0x26:
                    return CMD_0626;
                case 0x30:
                    return CMD_0630;
                case 0x31:
                    return CMD_0631;
                case 0x50:
                    return CMD_0650;
                case 0x51:
                    return CMD_0651;
                case 0x70:
                    return CMD_0670;
                case 0x79:
                    return CMD_0679;
                case 0x82:
                    return CMD_0682;
                case 0x85:
                    return CMD_0685;
                case 0x86:
                    return CMD_0686;
                case 0x87:
                    return CMD_0687;
                case 0x88:
                    return CMD_0688;
                case 0x90:
                    return CMD_0690;
                case 0x91:
                    return CMD_0691;
                case 0x93:
                    return CMD_0693;
                case 0x95:
                    return CMD_0695;
                case 0xB0:
                    return CMD_06B0;
                case 0xC0:
                    return CMD_06C0;
                case 0xC1:
                    return CMD_06C1;
                case 0xC2:
                    return CMD_06C2;
                case 0xC3:
                    return CMD_06C3;
                case 0xC4:
                    return CMD_06C4;
                case 0xC5:
                    return CMD_06C5;
                case 0xC6:
                    return CMD_06C6;
                case 0xCE:
                    return CMD_06CE;
                case 0xD1:
                    return CMD_06D1;
                case 0xD3:
                    return CMD_06D3;
                case 0xD4:
                    return CMD_06D4;
                case 0xD8:
                    return CMD_06D8;
                case 0xD9:
                    return CMD_06D9;
                case 0xDA:
                    return CMD_06DA;
                case 0xDB:
                    return CMD_06DB;
                case 0xDD:
                    return CMD_06DD;
                case 0xE0:
                    return CMD_06E0;
                case 0xE1:
                    return CMD_06E1;
                case 0xE2:
                    return CMD_06E2;
                case 0xE3:
                    return CMD_06E3;
                case 0xE4:
                    return CMD_06E4;
                case 0xE5:
                    return CMD_06E5;
                case 0xE6:
                    return CMD_06E6;
                case 0xE8:
                    return CMD_06E8;
                case 0xE9:
                    return CMD_06E9;
            }
            break;
        }
        case 0x08:
        {
            switch (aprc())
            {
                case 0x01:
                    return CMD_0801;
                case 0x02:
                    return CMD_0802;
                case 0x10:
                    return CMD_0810;
                case 0x11:
                    return CMD_0811;
                case 0x12:
                    return CMD_0812;
                case 0x13:
                    return CMD_0813;
                case 0x20:
                    return CMD_0820;
                case 0x21:
                    return CMD_0821;
                case 0x22:
                    return CMD_0822;
                case 0x23:
                    return CMD_0823;
                case 0x24:
                    return CMD_0824;
                case 0x30:
                    return CMD_0830;
                case 0x40:
                    return CMD_0840;
                case 0x50:
                    return CMD_0850;
            }
            break;
        }
        case 0x80:
        {
            switch (aprc())
            {
                case 0x00:
                    return CMD_8000;
            }
            break;
        }
        case 0x84:
        {
            switch (aprc())
            {
                case 0x00:
                    return CMD_8400;
                case 0x9C:
                    return CMD_849C;
                case 0x9A:
                    return CMD_849A;
                default:
                    return CMD_84xx;
            }
            break;
        }
    }

    return Zvt::CMD_UNKNOWN;
}
