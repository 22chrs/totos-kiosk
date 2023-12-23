/*
 * Utils.hpp
 *
 *  Created on: 30.10.2020
 *      Author: ah
 */

#ifndef UTILS_HPP_
#define UTILS_HPP_

#include "Tlv.hpp"
#include "Tag.hpp"
#include <converter/TagValueConverter.hpp>

#include <iostream>
#include <iomanip>
#include <string>
#include <iterator>
#include <algorithm>
#include <array>
#include <sstream>
#include <algorithm>
#include <cassert>
//boost
#include <boost/algorithm/hex.hpp>
#include <boost/algorithm/string.hpp>
//#include <boost/array.hpp>
#include <boost/asio.hpp>
#include <boost/beast/core/detail/base64.hpp>
#include <boost/archive/iterators/base64_from_binary.hpp>
#include <boost/archive/iterators/binary_from_base64.hpp>
#include <boost/archive/iterators/insert_linebreaks.hpp>
#include <boost/archive/iterators/transform_width.hpp>

using namespace std;

using boost::asio::ip::tcp;
using boost::asio::ip::address;
using boost::algorithm::hex;
using boost::algorithm::unhex;
using boost::algorithm::replace_all;

namespace Utils
{

static void log(const std::string, const std::string, const unsigned char);
static void lognl(std::vector<unsigned char>);
static std::string log_hex_str(std::vector<unsigned char>);
static std::string log_hex_str(unsigned char);
static void log(const unsigned char);
static void log(const std::string, const unsigned char *, size_t);
static void log(const unsigned char *, size_t);
static void log(const std::vector<unsigned char>);
static void log(const std::string, const std::vector<unsigned char>);
static void log(const char *, size_t);
static void log(const std::string);
static void print_tlv_tags(Zvt::Tlv);
static void print_tlv_tags(Zvt::Tag);
static std::string trim(std::string);
static void crawl_tlv_tags(Zvt::Tlv, TagValueConverter &);
static void crawl_tlv_tags(Zvt::Tag, int, TagValueConverter &);
static const std::string intToAmountBmp04(int cents);
static const std::string strToAmountBmp04(std::string cents);
static std::string upper(const std::string s);
static std::string lower(const std::string s);
static std::vector<unsigned char> hex2bytes(std::string hex);
static std::vector<unsigned char> stringToHexAsLLVar(const std::string tag, const std::string s);
static std::vector<unsigned char> stringToHexAsLLLVar(const std::string tag, const std::string s);
static std::string mask_pan(std::vector<unsigned char> pan, std::vector<unsigned char> mask);
static std::string base64_decode(const std::string &val);
static std::vector<unsigned char> base64_decode_vector(const std::string &val);
static std::string base64_encode(const std::string &val);
static std::string base64_encode_vector(const std::vector<unsigned char> &val);


inline static std::string base64_decode(const std::string &val)
{
    std::string ret;
    ret.resize(boost::beast::detail::base64::decoded_size(val.size()));

    std::size_t read = boost::beast::detail::base64::decode(&ret.front(), val.c_str(), val.size()).first;

    ret.resize(read);
    return ret;
}

inline static std::vector<unsigned char> base64_decode_vector(const std::string &val)
{
    std::vector<unsigned char> ret;
    ret.resize(boost::beast::detail::base64::decoded_size(val.size()));

    std::size_t read = boost::beast::detail::base64::decode(ret.data(), val.c_str(), val.size()).first;

    ret.resize(read);
    return ret;
}

inline static std::string base64_encode(const std::string &val)
{
    std::string ret;
    ret.resize(boost::beast::detail::base64::encoded_size(val.size()));

    std::size_t read = boost::beast::detail::base64::encode(&ret.front(), val.data(), val.size());

    ret.resize(read);
    return ret;
}

inline static std::string base64_encode_vector(const std::vector<unsigned char> &val)
{
    std::string ret;
    ret.resize(boost::beast::detail::base64::encoded_size(val.size()));

    std::size_t read = boost::beast::detail::base64::encode(&ret.front(), val.data(), val.size());

    ret.resize(read);
    return ret;
}

inline static void log(const std::string prefix, const std::string suffix, const unsigned char byte)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    cout << prefix << std::hex << std::setw(2) << std::setfill('0') << (0xff & byte) << suffix;
    cout.copyfmt(oldState);
}

inline static void lognl(std::vector<unsigned char> data)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    for (unsigned char byte: data)
    {
        log("", " ", byte);
    }

    cout.copyfmt(oldState);
}

inline static std::string log_hex_str(std::vector<unsigned char> data)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    std::stringstream ss;

    for (unsigned char byte: data)
    {
        ss << std::setw(2) << std::setfill('0') << std::hex << std::uppercase << (0xff & byte) << " ";
    }

    cout.copyfmt(oldState);
    return Utils::trim(ss.str());
}

inline static std::string hex_str_short(std::vector<unsigned char> data)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    std::stringstream ss;

    for (unsigned char byte: data)
    {
        ss << std::setw(2) << std::setfill('0') << std::hex << std::uppercase << (0xff & byte);
    }

    cout.copyfmt(oldState);
    return Utils::trim(ss.str());
}

inline static std::string log_hex_str(unsigned char byte)
{
    std::stringstream ss;
    ios oldState(nullptr);

    oldState.copyfmt(cout);
    ss << std::setw(2) << std::setfill('0') << std::hex << std::uppercase << (0xff & byte) << " ";
    cout.copyfmt(oldState);

    return Utils::trim(ss.str());
}

inline static void log(const unsigned char byte)
{
    log("", "", byte);
}

inline static void log(const std::string prefix, const unsigned char *buffer, size_t length)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << prefix;

    for (int idx = 0; idx < length; ++idx)
    {
        log(buffer[idx]);
        cout << (idx == length - 1 ? "" : " ");
    }

    cout << endl;
    cout.copyfmt(oldState);
}

inline static void log(const std::string prefix, const std::string message)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << prefix;
    cout << message;
    cout << endl;
    cout.copyfmt(oldState);
}

inline static void log_int(const std::string prefix, const int message)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << prefix;
    cout << message;
    cout << endl;
    cout.copyfmt(oldState);
}

inline static void log_int(const std::string prefix, const int message, const std::string suffix)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << prefix;
    cout << message;
    cout << suffix;
    cout.copyfmt(oldState);
}

inline static void log_bool(const std::string prefix, const bool message)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << prefix;
    cout << message;
    cout << endl;
    cout.copyfmt(oldState);
}

inline static void log(const unsigned char *buffer, size_t length)
{
    log("log : ", buffer, length);
}

inline static void log(const std::vector<unsigned char> data)
{
    log(data.data(), data.size());
}

inline static void log(const std::string prefix, const std::vector<unsigned char> data)
{
    log(prefix, data.data(), data.size());
}

inline static void log(const char *buffer, size_t length)
{
    log(reinterpret_cast<const unsigned char *>(buffer), length);
}

inline static void log(const std::string msg)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);
    cout << msg << endl;
    cout.copyfmt(oldState);
}

inline static void print_tlv_tags(Zvt::Tlv tlv)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    for (Zvt::Tag tag: tlv.tags())
    {
        cout << "Tag: " << setw(4) << setfill('_') << left << tag.tag_str() << right << "  λ " << setw(4) << setfill('.') << tag.data().size() << "   ";
        Utils::lognl(tag.data());
        cout << endl;

        for (Zvt::Tag stag: tag.subtags())
        {
            cout << "     " << setw(4) << setfill('_') << left << stag.tag_str() << right << "  λ " << setw(4) << setfill('.') << stag.data().size() << "   ";
            Utils::lognl(stag.data());
            cout << endl;
        }
    }

    cout.copyfmt(oldState);
}

inline static void print_tlv_tags(Zvt::Tag tag)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    cout << "Tag: " << setw(4) << setfill('_') << left << tag.tag_str() << right << "  λ " << setw(4) << setfill('.') << tag.data().size() << "   ";
    Utils::lognl(tag.data());
    cout << endl;

    for (Zvt::Tag stag: tag.subtags())
    {
        print_tlv_tags(stag);
    }

    cout.copyfmt(oldState);
}

inline static void print_tlv_tags(std::vector<Zvt::Tag> tags)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    for (Zvt::Tag stag: tags)
    {
        print_tlv_tags(stag);
    }

    cout.copyfmt(oldState);
}

inline static void crawl_tlv_tags(Zvt::Tlv tlv, TagValueConverter &converter)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    for (Zvt::Tag tag: tlv.tags())
    {
        cout << "Tag: " << setw(6) << setfill('_') << left
             << tag.tag_str() << right << "  λ "
             << setw(4) << setfill('.') << tag.data().size() << endl;

        crawl_tlv_tags(tag, 0, converter);
    }

    cout.copyfmt(oldState);
}

inline static void crawl_tlv_tags(Zvt::Tag tlv_tag, int level, TagValueConverter &converter)
{
    std::string tabs = "\t";
    std::string lvl = string();

    level++;

    switch (level)
    {
        case 1:
            lvl = "1  ";
            break;
        case 2:
            lvl = " 2 ";
            break;
        default:
            lvl = "  " + to_string(level);
            break;
    }

    if (tlv_tag.subtags().empty())
    {
        cout << tabs << "Data: " << log_hex_str(tlv_tag.data()) << std::endl;
    }
    else
    {
        for (Zvt::Tag tag: tlv_tag.subtags())
        {
            cout << tabs << "Tag (" << setw(3) << setfill(' ') << left << lvl << "): "
                 << setw(6) << setfill('_') << left << tag.tag_str() << right << " "
                 << setw(4) << setfill('.') << tag.data().size()
                 << "  λ " << setw(50) << setfill(' ') << left << log_hex_str(tag.data())
                 << " (" << converter.map(tag.tag_str()) << ")" << endl;

            crawl_tlv_tags(tag, level, converter);
        }
    }
}

inline static std::string trim(const std::string to_trim)
{
    size_t first = to_trim.find_first_not_of(' ');
    if (string::npos == first)
    {
        return to_trim;
    }
    size_t last = to_trim.find_last_not_of(' ');
    return to_trim.substr(first, (last - first + 1));
}

inline static std::string upper(const std::string s)
{
    std::string str = s;
    std::transform(str.begin(), str.end(), str.begin(), ::toupper);
    return str;
}

inline static std::string lower(const std::string s)
{
    std::string str = s;
    std::transform(str.begin(), str.end(), str.begin(), ::tolower);
    return str;
}

inline static const std::string intToAmountBmp04(int cents)
{
    try
    {
        std::string istr = std::to_string(cents);
        std::ostringstream s;

        s << "04";

        // 1-byte == 00
        // 6-byte == 00 00 00 00 00 00 == 12 x zero's
        for (int idx = istr.length(); idx < 12; ++idx)
            s << "0";
        s << istr;
        return s.str();
    }
    catch (exception e)
    {
        std::cerr << e.what() << std::endl;
        std::cerr << "Return default of 04000000000000" << std::endl;
        return "04000000000000";
    }
}

inline static const std::string strToAmountBmp04(std::string cents)
{
    return intToAmountBmp04(std::stoi(cents));
}

inline static std::vector<unsigned char> hex2bytes(std::string hex)
{
    std::vector<unsigned char> out;

    if (!hex.empty())
    {
        boost::algorithm::replace_all(hex, " ", "");
        boost::algorithm::replace_all(hex, "\n", "");
        boost::algorithm::replace_all(hex, "\r", "");
        boost::algorithm::unhex(hex.begin(), hex.end(), std::back_inserter(out));
    }

    return out;
}

// returns LLVar or zero if the data is to long
// The tag must be HEX encoded. Data is ascii and is converted to hex
inline static std::vector<unsigned char> stringToHexAsLLVar(const std::string tag, const std::string s)
{
    std::string hex = boost::algorithm::hex(s);
    std::vector<unsigned char> data = hex2bytes(hex);

    // LL VAR
    if (data.size() <= 99)
    {
        std::stringstream ss;

        ss << data.size();
        std::string size = ss.str();
        ss.str("");

        if (data.size() < 10)
            ss << "F0F" << data.size();
        else
            ss << "F" << size[0] << "F" << size[1];

        std::vector<unsigned char> lengthData = hex2bytes(ss.str());
        std::vector<unsigned char> tagData = hex2bytes(tag);
        data.insert(data.begin(), lengthData.begin(), lengthData.end());
        data.insert(data.begin(), tagData.begin(), tagData.end());

        return data;
    }
    else std::cerr << "input cannot converted into LL VAR {" << log_hex_str(data) << "}" << endl;

    return std::vector<unsigned char>();
}

// returns LLLVar or zero if the data is to long
// The tag must be HEX encoded. Data is ascii and is converted to hex
inline static std::vector<unsigned char> stringToHexAsLLLVar(const std::string tag, const std::string s)
{
    std::string hex = boost::algorithm::hex(s);
    std::vector<unsigned char> data = hex2bytes(hex);

    // LL VAR
    if (data.size() <= 999)
    {
        std::stringstream ss;

        ss << data.size();
        std::string size = ss.str();
        ss.str("");

        if (data.size() < 10)
            ss << "F0F0F" << data.size();
        else if (data.size() < 100)
            ss << "F0F" << size[0] << "F" << size[1];
        else
            ss << "F" << size[0] << "F" << size[1] << "F" << size[2];

        std::vector<unsigned char> lengthData = hex2bytes(ss.str());
        std::vector<unsigned char> tagData = hex2bytes(tag);
        data.insert(data.begin(), lengthData.begin(), lengthData.end());
        data.insert(data.begin(), tagData.begin(), tagData.end());

        return data;
    }
    else std::cerr << "input cannot converted into LLL VAR {" << log_hex_str(data) << "}" << endl;

    return std::vector<unsigned char>();
}


/*
 * PAN mask nexoFAST
 *
 * The PAN Mask shall be used to mask the PAN on cardholder receipts. If
 * indicated by the value of byte 7 of the PAN Mask it shall also be used to
 * mask the PAN on merchant receipts. The PAN Mask consists of 3 bytes
 * Leading PAN Mask, 3 bytes Trailing PAN Mask, and 1 byte indicating if to
 * apply the PAN Mask to the merchant receipt (see Table 66).
 *
 * A binary 1 indicated in the Leading PAN Mask means that the corresponding digit of the PAN counted from the left shall be printed.
 * A binary 1 indicated in the Trailing PAN Mask means that the corresponding digit of the PAN counted from the right shall be printed.
 *
 * Digits that are not indicated to be printed according to either the Leading PAN Mask
 * or the Trailing PAN Mask shall be masked with the character "x".
 *
 * Example:
 *
 * Leading PAN Mask = 'FC 00 00'
 * Trailing PAN Mask = '00 00 0F'
 *
 * This means that the PAN shall be masked, with the exception of the 6 leading digits and the 4 trailing digits.
 * If the PAN has a length of 18 digits, this results in the following masking
 *
 * std::vector<unsigned char> mask = {0xa0, 0xa1, 0x43, 0xc3, 0x06, 0x09, 0xc0};
 * std::vector<unsigned char> pan = {0x67, 0x99, 0x99, 0x89, 0x00, 0x00, 0x02, 0x72, 0x1F};
 *
 * PAN: 67999989000002721
 *
 *  |----------------------------------------------------------------------------------------------
 *  | Table 66: PAN MASK
 *  |
 *  | Byte b8  b7  b6  b5  b4  b3  b2  b1  Meaning
 *  | 1-3                                  Leading PAN Mask
 *  | 4-6                                  Trailing PAN Mask
 *  | 7    1   -   -   -   -   -   -   -   Fixed value: always apply PAN Mask to cardholder receipt
 *  |      -   1   -   -   -   -   -   -   Apply PAN Mask to merchant receipt
 *  |      -   -   0   0   0   0   0   0   RFU
 *  |----------------------------------------------------------------------------------------------
 */
inline static std::string mask_pan(std::vector<unsigned char> pan, std::vector<unsigned char> mask)
{
    std::string panS = Zvt::Bmp::BCDToString(pan);
    std::string panMasked = Zvt::Bmp::BCDToString(pan);

    //std::cout << "PAN String: " << panS << " with a length of " << panS.length() << std::endl;

    if (mask.size() >= 6)
    {
        // leading
        std::bitset<24> lead;
        std::vector<std::bitset<8>> leads({std::bitset<8>(mask.at(2)), std::bitset<8>(mask.at(1)), std::bitset<8>(mask.at(0))});

        int set = 0;
        for (std::bitset<8> b: leads)
        {
            for (int bit = 0; bit < 8; ++bit)
                lead.set(set++, b.test(bit));
        }

        // trailing
        std::bitset<24> trail;
        std::vector<std::bitset<8>> trails({std::bitset<8>(mask.at(5)), std::bitset<8>(mask.at(4)), std::bitset<8>(mask.at(3))});

        set = 0;
        for (std::bitset<8> b: trails)
        {
            for (int bit = 0; bit < 8; ++bit)
                trail.set(set++, b.test(bit));
        }

        // settings
        std::bitset<8> byte7(mask.at(6));

        //std::cout << "Leading Mask   : " << leads[2] << " " << leads[1] << " " << leads[0] << std::endl;
        //std::cout << "Leading Mask   : " << lead << std::endl;
        //std::cout << "Trailing Mask  : " << trails[2] << " " << trails[1] << " " << trails[0] << std::endl;
        //std::cout << "Trailing Mask  : " << trail << std::endl;

        /*
         * LEAD
         * A0 --> 1010 0000
         * A1 --> 1010 0001
         * 43 --> 0100 0011
         *
         * 1010 0000 1010 0001 0100 0011
         *
         * TRAIL
         * C3 --> 1100 0011
         * 06 --> 0000 0110
         * 09 --> 0000 1001
         *
         * 1100 0011 0000 0110 0000 1001
         *
         * FOR PAN length of 19
         *                          999x xxxx 999x xxx9 x99
         * PAN            :         6799 9989 0000 0272 100
         *
         * Leading Mask   :         1010 0000 1010 0001 010 0 0011
         * Trailing Mask  :  1100 0 0110 0000 1100 0001 001
         * shift + or     :         1110 0000 1110 0001 011
         *                          999x xxxx 999x xxx9 x99
         *                          679x xxxx 000x xxx0 x00
         */

        /*
         * FOR PAN length of 17
         *
         * PAN            :         6799 9989 0000 0272 1
         *
         * Leading Mask   :         1010 0000 1010 0001 0 1000011
         * Trailing Mask  : 1100001 1000 0011 0000 0100 1
         *                          6x9x xx89 0x0x x2x2 1
         *
         */

        std::cout << std::endl;

        for (int idx = 0, pos = 23; idx < panS.size(); ++idx, --pos)
            panMasked[idx] = lead.test(pos) ? panS.at(idx) : 'x';

        for (int idx = 0, pos = panS.size() - 1; idx < panS.size(); ++idx, --pos)
            panMasked[idx] = panMasked[idx] != 'x' ? panMasked[idx] : (trail.test(pos) ? panS.at(idx) : 'x');

        std::cout << "PAN masked: " << panMasked << " with a length of " << panMasked.length() << std::endl;
    }
    else
    {
        std::cerr << "PAN Mask must be a minimum of 6 (1-3 leading mask, 4-6 trailing mask, 7 is the setting byte)" << std::endl;
        std::cerr << "We ignore DF2C and mask with a fixed mask ..." << std::endl;

        for (std::string::size_type i = 3; i < panMasked.size() - 4; ++i)
        {
            panMasked[i] = 'x';
        }
    }

    return panMasked;
}

}
#endif /* UTILS_HPP_ */
