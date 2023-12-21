/*
 * Bmp.hpp
 *
 *  Created on: 09.11.2020
 *      Author: ah
 */

#ifndef BMP_HPP_
#define BMP_HPP_

#include <iostream>
#include <vector>
#include <cmath>
#include <string>
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <bitset>

namespace Zvt
{

typedef enum BMP
{
    BMP_UNKNOWN = 0x00, BMP_01 = 0x01,  //1 byte binary
    BMP_02 = 0x02,  // 1 byte binary
    BMP_03 = 0x03,  // 1 byte binary
    BMP_04 = 0x04,  //6 byte BCD
    BMP_05 = 0x05,  //1 byte binary
    BMP_06 = 0x06,  //TLV-encoded
    BMP_0B = 0x0B,  //3 byte BCD
    BMP_0C = 0x0C,  //3 byte BCD
    BMP_0D = 0x0D,  //2 byte BCD
    BMP_0E = 0x0E,  //2 byte BCD
    BMP_17 = 0x17,  //2 byte BCD
    BMP_19 = 0x19,  // 1 byte binary
    BMP_22 = 0x22,  //LL-Var BCD
    BMP_23 = 0x23,  //LL-Var
    BMP_24 = 0x24,  //LLL-Var
    BMP_27 = 0x27,  //1 byte binary
    BMP_29 = 0x29,  //4 byte BCD
    BMP_2A = 0x2A,  //15 byte ASCII
    BMP_2D = 0x2D,  //LL-Var
    BMP_2E = 0x2E,  //LLL-Var
    BMP_37 = 0x37,  //3 byte BCD
    BMP_3A = 0x3A,  //2 byte BCD
    BMP_3B = 0x3B,  //8 byte
    BMP_3C = 0x3C,  //LLL-Var
    BMP_3D = 0x3D,  //3 byte BCD
    BMP_49 = 0x49,  //2 byte BCD
    BMP_60 = 0x60,  //LLL-Var
    BMP_70 = 0x70,  //4 byte integer, Uniquely identifies Display Image request.
    BMP_71 = 0x71,  //4 byte integer, big endian
    BMP_72 = 0x72,  //1 byte integer
    BMP_73 = 0x73,  //1 byte integer
    BMP_74 = 0x74,  //1 byte integer
    BMP_75 = 0x75,  //1 byte integer
    BMP_87 = 0x87,  //2 byte BCD
    BMP_88 = 0x88,  //3 byte BCD
    BMP_8A = 0x8A,  //1 byte binary
    BMP_8B = 0x8B,  //LL-Var
    BMP_8C = 0x8C,  //1 byte binary
    BMP_9A = 0x9A,  //LLL-Var
    BMP_A0 = 0xA0,  //1 byte binary
    BMP_A7 = 0xA7,  // LL-Var
    BMP_AA = 0xAA,  //3 byte BCD
    BMP_AF = 0xAF,  //LLL-Var
    BMP_BA = 0xBA,  //5 byte binary
    BMP_D0 = 0xD0,  //1 byte binary
    BMP_D1 = 0xD1,  //LL-Var
    BMP_D2 = 0xD2,  //	1 byte binary
    BMP_D3 = 0xD3,  //	1 byte binary
    BMP_E0 = 0xE0,  //1 byte binary
    BMP_E1 = 0xE1,  //LL-Var
    BMP_E2 = 0xE2,  //LL-Var
    BMP_E3 = 0xE3,  //LL-Var
    BMP_E4 = 0xE4,  //LL-Var
    BMP_E5 = 0xE5,  //LL-Var
    BMP_E6 = 0xE6,  //LL-Var
    BMP_E7 = 0xE7,  //LL-Var
    BMP_E8 = 0xE8,  //LL-Var
    BMP_E9 = 0xE9,  //1 byte binary
    BMP_EA = 0xEA,  //1 byte binary
    BMP_EB = 0xEB,  //8 byte binary
    BMP_F0 = 0xF0,  //1 byte binary
    BMP_F1 = 0xF1,  //LL-Var
    BMP_F2 = 0xF2,  //LL-Var
    BMP_F3 = 0xF3,  //LL-Var
    BMP_F4 = 0xF4,  //LL-Var
    BMP_F5 = 0xF5,  //LL-Var
    BMP_F6 = 0xF6,  //LL-Var
    BMP_F7 = 0xF7,  //LL-Var
    BMP_F8 = 0xF8,  //LL-Var
    BMP_F9 = 0xF9,  //1 byte binary
    BMP_FA = 0xFA  //1 byte binary
} BMP;

typedef enum BmpFormat
{
    Bmp_Unknown,
    One_Byte_Binary,
    Three_Byte_Binary,
    Five_Byte_Binary,
    Eight_Byte_Binary,
    LL_Var,
    LL_Var_Bcd,
    LLL_Var,
    Two_Byte_Bcd,
    Three_Byte_Bcd,
    Four_Byte_Bcd,
    Six_Byte_Bcd,
    One_Byte_Integer,
    Four_Byte_Integer,
    Fifteen_Byte_Ascii,
    Tlv_Encoded
} BmpFormat;

/**
 * Class to build a simple bitmap.
 *
 * BMP did not have a length in all cases (a BMP could be a simple vector instead)
 *
 * A TLV Container is a BMP but the TLV uses special length calulation.
 *
 * The _data vector can contain length information. But overlying classes can handle it in another way (Tlv class!).
 */
class Bmp
{
protected:
    unsigned char _bmp;
    BmpFormat _format;
    std::vector<unsigned char> _data;

public:
    inline Bmp()
            :
            _bmp(0x00)
            , _format(Bmp_Unknown)
            , _data(std::vector<unsigned char>())
    {
    }

    inline Bmp(unsigned char bmp, unsigned char one_byte_data)
            :
            _bmp(bmp)
            , _format(One_Byte_Binary)
            , _data(std::vector<unsigned char>())
    {
        _data.push_back(one_byte_data);
    }

    // vector contains all bytes. 1-byte is assigned to '_bmp'
    inline Bmp(BmpFormat fmt, std::vector<unsigned char> bytes)
            :
            _bmp(0x00)
            , _format(fmt)
            , _data(std::vector<unsigned char>())
    {
        if (bytes.size() > 0)
        {
            _bmp = bytes[0];
            _data.insert(_data.end(), bytes.begin() + 1, bytes.end());
        }
    }

    Bmp(const Bmp &other);
    // data contains only the data bytes. Not the first (which is the 1. arg!)
    Bmp(unsigned char, BmpFormat, std::vector<unsigned char>);
    virtual ~Bmp();

    virtual void strip_of(std::vector<unsigned char>);

    inline virtual unsigned char bmp(void) const
    {
        return this->_bmp;
    }

    inline virtual BmpFormat fmt(void) const
    {
        return this->_format;
    }

    inline virtual std::vector<unsigned char> all() const
    {
        std::vector<unsigned char> bmp_data = {this->_bmp};
        bmp_data.insert(bmp_data.end(), this->_data.begin(), this->_data.end());
        return bmp_data;
    }

    inline virtual std::vector<unsigned char> get() const
    {
        return this->_data;
    }

    /**
     * Note
     *
     * set(vector) copies the data without any validation (not as TLV encoded)
     *
     * The ZVT BMP06 (Tlv container) is an "primitive" TAG. The data is only interpreted as a simple value!
     *
     * Result is BMP06 with "complete" data of a BMP06 (as primitive value)
     * input : 06 05 9F06 02 AABB
     * output: 06 07 06 05 9F06 02 AABB
     *
     * set only 9F0602AABB and you will receive an ZVT like bmp06 Tlv Container!
     *
     * Consider using ZvT::Tlv(vector data) or the strip_of() method.
     *
     * @param data
     */
    inline virtual void set(std::vector<unsigned char> data)
    {
        this->_data.assign(data.begin(), data.end());
    }

    inline virtual void set(unsigned char bmp)
    {
        this->_bmp = bmp;
    }

    inline virtual void set(BmpFormat format)
    {
        this->_format = format;
    }

    inline virtual void set(unsigned char bmp, BmpFormat format)
    {
        this->_bmp = bmp;
        this->_format = format;
    }

    inline virtual void set(unsigned char bmp, BmpFormat format, std::vector<unsigned char> data)
    {
        this->_bmp = bmp;
        this->_format = format;
        this->set(data);
    }

    inline Zvt::BMP isA() const
    {
        return isA(this->_bmp);
    }

    // Note that this function did not work for masked numbers like 0xeeee
    inline static unsigned long BCDToNumber(std::vector<unsigned char> bytes)
    {
        try {
            return std::stoul(BCDToString(bytes));
        } catch (std::exception &e) {
            std::cerr << "BCDToNumber with BCD as string {" << BCDToString(bytes) << "}" << std::endl;
            std::cerr << "Exception                      {" << e.what() << "}" << std::endl;
        }

        return 0L;
    }

    inline static std::string BCDToString(std::vector<unsigned char> bytes)
    {
        std::ostringstream os;

        for (unsigned char bcd_byte: bytes)
        {
            os << BCDToString(bcd_byte);
        }

        return os.str();//.empty() ? "0" : os.str();
    }

    inline static std::string BytesToString(std::vector<unsigned char> bytes)
    {
        std::stringstream ss;

        for (unsigned char byte: bytes)
        {
            ss << byte;
        }

        return ss.str();
    }

    inline static std::string BytesToHexString(std::vector<unsigned char> bytes)
    {
        std::stringstream ss;
        std::ios oldState(nullptr);
        oldState.copyfmt(std::cout);

        for (unsigned char byte: bytes)
        {
            ss << std::setw(2) << std::setfill('0') << std::right << std::hex << (0xff & byte);
        }
        std::cout.copyfmt(oldState);

        return ss.str();
    }

    /**
     * give number and the needed bytes.
     *
     * number -> 1234 with bytes=2 --> 0x12, 0x34
     * number -> 1234 with bytes=3 --> 0x00, 0x12, 0x34
     *
     *
     * Todo:
     * Check that the number fits into the bytes! That should be handled...
     *
     * number -> 123456 with byte=2 --> error 0x12,0x34 and 0x56 are truncated.
     *
     * 1 bytes -> 0x00 - 0x99
     * 2 bytes -> 0x00,0x00 - 0x99,0x99
     * N bytes ...
     *
     * Negative number are not allowed too...
     */
    inline static std::vector<unsigned char> NumberToBCD(unsigned long number, unsigned int bytes)
    {
        std::vector<unsigned char> bcd;
        std::stringstream ss;

        // number to string...
        ss << number;

        std::string s = ss.str();

        // 3 bytes are 3*2 single values for example
        for (int idx = s.size(); idx < (2 * bytes); ++idx)
        {
            s = "0" + s;
        }

        // loop with a step if 2 (hi/lo)
        for (int idx = 0; idx < s.size(); idx = idx + 2)
        {
            std::bitset<8> hi(s[idx]);     // first bit7-bit4
            std::bitset<8> lo(s[idx + 1]);  // second bit3-bit0
            std::bitset<8> byte;

            //hi
            byte.set(7, hi.test(3));
            byte.set(6, hi.test(2));
            byte.set(5, hi.test(1));
            byte.set(4, hi.test(0));
            //lo
            byte.set(3, lo.test(3));
            byte.set(2, lo.test(2));
            byte.set(1, lo.test(1));
            byte.set(0, lo.test(0));

            bcd.push_back(byte.to_ulong());
        }

        //std::cout << "Number: " << s << " bcd=" << bcd.size() << std::endl;

        return bcd;
    }

    inline static std::string BCDToString(unsigned char bcd_byte)
    {
        std::ostringstream os;

        std::bitset<8> byte(bcd_byte);
        std::bitset<8> high;
        std::bitset<8> low;

        high.set(0, byte.test(4));
        high.set(1, byte.test(5));
        high.set(2, byte.test(6));
        high.set(3, byte.test(7));

        low.set(0, byte.test(0));
        low.set(1, byte.test(1));
        low.set(2, byte.test(2));
        low.set(3, byte.test(3));

        // Example: 0x1F --> must be "1 " or simply "1"
        // The F filles the byte array (1F means „1“), needed in BCD
        // 0x99 is 99; 0x12 is 12; 0x01 is 01 and 1F is 1.
        if (high.to_ulong() < 10)
            os << high.to_ulong();

        if (low.to_ulong() < 10)
            os << low.to_ulong();

        return os.str();
    }

    inline static std::string BCDMaskedToString(std::vector<unsigned char> bytes)
    {
        std::ostringstream os;

        for (unsigned char bcd_byte: bytes)
        {
            os << BCDMaskedToString(bcd_byte);
        }

        return os.str();
    }

    inline static std::string BCDMaskedToString(unsigned char bcd_byte)
    {
        std::ostringstream os;

        std::bitset<8> byte(bcd_byte);
        std::bitset<8> high;
        std::bitset<8> low;

        high.set(0, byte.test(4));
        high.set(1, byte.test(5));
        high.set(2, byte.test(6));
        high.set(3, byte.test(7));

        low.set(0, byte.test(0));
        low.set(1, byte.test(1));
        low.set(2, byte.test(2));
        low.set(3, byte.test(3));

        // Example: 0x1F --> must be "1 " or simply "1"
        // The F filles the byte array (1F means „1“), needed in BCD
        // 0x99 is 99; 0x12 is 12; 0x01 is 01 and 1F is 1.
        if (high.to_ulong() < 10)
            os << high.to_ulong();
        else
            os << "x";

        if (low.to_ulong() < 10)
            os << low.to_ulong();
        else
            os << "x";

        return os.str();
    }

    inline static Zvt::BMP isA(unsigned char bmp_type)
    {
        switch (bmp_type)
        {
            case BMP_01:
                return BMP_01;  //1 byte binary
            case BMP_02:
                return BMP_02;  // 1 byte binary
            case BMP_03:
                return BMP_03;  // 1 byte binary
            case BMP_04:
                return BMP_04;  //6 byte BCD
            case BMP_05:
                return BMP_05;  //1 byte binary
            case BMP_06:
                return BMP_06;  //TLV-encoded
            case BMP_0B:
                return BMP_0B;  //3 byte BCD
            case BMP_0C:
                return BMP_0C;  //3 byte BCD
            case BMP_0D:
                return BMP_0D;  //2 byte BCD
            case BMP_0E:
                return BMP_0E;  //2 byte BCD
            case BMP_17:
                return BMP_17;  //2 byte BCD
            case BMP_19:
                return BMP_19;  // 1 byte binary
            case BMP_22:
                return BMP_22;  //LL-Var BCD
            case BMP_23:
                return BMP_23;  //LL-Var
            case BMP_24:
                return BMP_24;  //LLL-Var
            case BMP_27:
                return BMP_27;  //1 byte binary
            case BMP_29:
                return BMP_29;  //4 byte BCD
            case BMP_2A:
                return BMP_2A;  //15 byte ASCII
            case BMP_2D:
                return BMP_2D;  //LL-Var
            case BMP_2E:
                return BMP_2E;  //LLL-Var
            case BMP_37:
                return BMP_37;  //3 byte BCD
            case BMP_3A:
                return BMP_3A;  //2 byte BCD
            case BMP_3B:
                return BMP_3B;  //8 byte
            case BMP_3C:
                return BMP_3C;  //LLL-Var
            case BMP_3D:
                return BMP_3D;  //3 byte BCD
            case BMP_49:
                return BMP_49;  //2 byte BCD
            case BMP_60:
                return BMP_60;  //LLL-Var
            case BMP_70:
                return BMP_70;  //Uniquely identifies Display Image request.
            case BMP_71:
                return BMP_71;  //big endian
            case BMP_72:
                return BMP_72;  //1 byte integer
            case BMP_73:
                return BMP_73;  //1 byte integer
            case BMP_74:
                return BMP_74;  //1 byte integer
            case BMP_75:
                return BMP_75;  //1 byte integer
            case BMP_87:
                return BMP_87;  //2 byte BCD
            case BMP_88:
                return BMP_88;  //3 byte BCD
            case BMP_8A:
                return BMP_8A;  //1 byte binary
            case BMP_8B:
                return BMP_8B;  //LL-Var
            case BMP_8C:
                return BMP_8C;  //1 byte binary
            case BMP_9A:
                return BMP_9A;  //LLL-Var
            case BMP_A0:
                return BMP_A0;  //1 byte binary
            case BMP_A7:
                return BMP_A7;  // LL-Var
            case BMP_AA:
                return BMP_AA;  //3 byte BCD
            case BMP_AF:
                return BMP_AF;  //LLL-Var
            case BMP_BA:
                return BMP_BA;  //5 byte binary
            case BMP_D0:
                return BMP_D0;  //1 byte binary
            case BMP_D1:
                return BMP_D1;  //LL-Var
            case BMP_D2:
                return BMP_D2;  //	1 byte binary
            case BMP_D3:
                return BMP_D3;  //	1 byte binary
            case BMP_E0:
                return BMP_E0;  //1 byte binary
            case BMP_E1:
                return BMP_E1;  //LL-Var
            case BMP_E2:
                return BMP_E2;  //LL-Var
            case BMP_E3:
                return BMP_E3;  //LL-Var
            case BMP_E4:
                return BMP_E4;  //LL-Var
            case BMP_E5:
                return BMP_E5;  //LL-Var
            case BMP_E6:
                return BMP_E6;  //LL-Var
            case BMP_E7:
                return BMP_E7;  //LL-Var
            case BMP_E8:
                return BMP_E8;  //LL-Var
            case BMP_E9:
                return BMP_E9;  //1 byte binary
            case BMP_EA:
                return BMP_EA;  //1 byte binary
            case BMP_EB:
                return BMP_EB;  //8 byte binary
            case BMP_F0:
                return BMP_F0;  //1 byte binary
            case BMP_F1:
                return BMP_F1;  //LL-Var
            case BMP_F2:
                return BMP_F2;  //LL-Var
            case BMP_F3:
                return BMP_F3;  //LL-Var
            case BMP_F4:
                return BMP_F4;  //LL-Var
            case BMP_F5:
                return BMP_F5;  //LL-Var
            case BMP_F6:
                return BMP_F6;  //LL-Var
            case BMP_F7:
                return BMP_F7;  //LL-Var
            case BMP_F8:
                return BMP_F8;  //LL-Var
            case BMP_F9:
                return BMP_F9;  //1 byte binary
            case BMP_FA:
                return BMP_FA;  //1 byte binary
            default:
                return BMP_UNKNOWN;
        }
    }
};
}

#endif /* BMP_HPP_ */
