/*
 * Tag.hpp
 *
 *  Created on: 09.11.2020
 *      Author: ah
 */

#ifndef TAG_HPP_
#define TAG_HPP_

#include <iostream>
#include <bitset>
#include <vector>

#include <boost/algorithm/hex.hpp>
#include <boost/json.hpp>

namespace Zvt
{

/**
 *
 * 9.3.1 Tag-field
 *
 * The tag-field is the identification of the following data-element. With it the receiver can associate the contents.
 * In the tag is a class (bit 7 and 8), a type (bit 6) and a number (bit 1 bis 5) encode.
 *
 * byte 1:
 * --------------------------------------------------
 * b8 b7 b6 b5 b4 b3 b2 b1 	Definition
 * 0  0						universal-class
 * 0  1						application-class
 * 1  0						context-specific class
 * 1  1						private class
 *       0					primitive data-object
 *       1					constructed data-object
 *
 *          0  0  0  0  0   tag-number
 *      bis 1  1  1  1  0   tag-number
 *          1  1  1  1  1   tag-number in next byte
 *--------------------------------------------------
 *
 * byte 2 bis n (optional):
 * --------------------------------------------------
 * b8 b7 b6 b5 b4 b3 b2 b1  Definition
 * 1						a further byte follows
 * 0						last byte
 *    0  0  0  0  0  0  0   (part of ) tag-number
 * bis1  1  1  1  1  1  1   (part of ) tag-number
 *
 *
 * For length the
 *
 */

//shortcut
typedef std::bitset<8> TagByte;

class HexToByte;

class Tag
{
private:
    std::vector<TagByte> tag_bytes;
    std::vector<unsigned char> tag_data;
    bool is_ascii;

public:
    // bmp 0X 00, zero length
    Tag(const unsigned char);
    // bmp 0X 01 0X exact 1-byte as data
    Tag(const unsigned char, const unsigned char);
    // bmp 0X 1-byte tag with variable length.
    Tag(const unsigned char, const std::vector<unsigned char> data);
    // 1F XX 2-byte TAG with variable length
    Tag(const unsigned char, const unsigned char, const std::vector<unsigned char> data);
    // 1F XX 2-byte TAG with variable length
    Tag(const HexToByte tn);
    // 1F XX 2-byte TAG with variable length
    Tag(const HexToByte tn, const std::vector<unsigned char> data);
    // create from raw byte vector (length must in tag_data)
    Tag(const std::vector<unsigned char> tag_data);
    Tag(const Tag &tag);

    virtual ~Tag();

    inline bool isPrimitive()
    { return this->tag_bytes.size() <= 0 || !this->tag_bytes.at(0).test(5); }

    inline bool isContructed()
    { return this->tag_bytes.size() > 0 && this->tag_bytes.at(0).test(5); }

    inline std::vector<unsigned char> data() const
    { return this->tag_data; };

    inline void append(const std::vector<unsigned char> data)
    { this->tag_data.insert(this->tag_data.end(), data.begin(), data.end()); }

    inline void data(const std::vector<unsigned char> data)
    {
        this->tag_data.clear();
        this->tag_data.insert(this->tag_data.end(), data.begin(), data.end());
    }

    inline bool isAscii()
    { return this->is_ascii; }

    inline void isAscii(bool ascii)
    { this->is_ascii = ascii; }

    inline std::vector<unsigned char> tag()
    {
        std::vector<unsigned char> t;

        for (TagByte tb: this->tag_bytes)
        {
            t.push_back(tb.to_ulong());
        }
        return t;
    }

    inline std::string tag_str()
    {
        std::vector<unsigned char> t = this->tag();
        std::string result;
        boost::algorithm::hex(t.begin(), t.end(), std::back_inserter(result));
        return result;
    }

    std::string data_str();
    std::string data_as_hex();
    std::vector<unsigned char> get();
    std::vector<Zvt::Tag> subtags();
    std::vector<Zvt::Tag> find(const std::vector<unsigned char> tag);
    std::vector<Zvt::Tag> find(const unsigned char byte1, const unsigned char byte2);
    Zvt::Tag find_first(const std::vector<unsigned char> tag, const std::vector<unsigned char> default_value);

    inline static bool tag_bytes_follow(unsigned char tag_byte)
    {
        std::bitset<8> byte(tag_byte);
        return byte.test(0) && byte.test(1) && byte.test(2) && byte.test(3) && byte.test(4);
    }

    inline static bool further_byte_follow(unsigned char tag_byte)
    {
        return std::bitset<8>(tag_byte).test(7);
    }

    inline static bool further_byte_follow(TagByte tag_byte)
    {
        return tag_byte.test(7);
    }

    inline static std::vector<TagByte> tag_length(std::vector<unsigned char> bytes)
    {
        std::vector<TagByte> tag_bytes;

        for (int idx = 0; idx < bytes.size(); ++idx)
        {
            tag_bytes.push_back(TagByte(bytes[idx]));

            if (Zvt::Tag::tag_bytes_follow(bytes.at(idx)))
            {
                TagByte tag_byte;
                // tag number in next byte
                do
                {
                    tag_bytes.push_back(tag_byte = bytes[++idx]);
                }
                while (Zvt::Tag::further_byte_follow(tag_byte));
            }
            break;
        }

        return tag_bytes;
    }

    inline static Zvt::Tag isAscii(Zvt::Tag &tag)
    {
        if (tag.isPrimitive())
        {
            if (tag.tag_str() == "46"
                || tag.tag_str() == "47"
                || tag.tag_str() == "67"
                || tag.tag_str() == "44"
                || tag.tag_str() == "07"
                || tag.tag_str() == "42"
                || tag.tag_str() == "4A"
                || tag.tag_str() == "1F40"
                || tag.tag_str() == "1F41"
                || tag.tag_str() == "1F59")
            {
                tag.isAscii(true);
            }
        }
        return tag;
    }
};

void from_string(const boost::json::key_value_pair &key_value_pair, Zvt::Tag &tag);
void from_string(const std::string &value, Zvt::Tag &tag);
void from_array(const boost::json::array &array, const std::string &key, Zvt::Tag &tag);
void from_object(const boost::json::object &object, Zvt::Tag &tag);

void tag_invoke(boost::json::value_from_tag, boost::json::value &, Zvt::Tag &);
Zvt::Tag tag_invoke(boost::json::value_to_tag <Zvt::Tag>, boost::json::value const &);

}
#endif /* TAG_HPP_ */
