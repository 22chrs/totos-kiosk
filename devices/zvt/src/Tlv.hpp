/*
 * Tlv.hpp
 *
 *  Created on: 06.11.2020
 *      Author: ah
 */

#ifndef TLV_HPP_
#define TLV_HPP_

#include "Bmp.hpp"
#include "Tag.hpp"

#include <vector>
#include <array>
#include <iostream>
#include <iomanip>
#include <map>

#include <boost/json.hpp>

namespace Zvt
{

/*
 * 27 03 14 01 01
 * 12 01 30
 * 26 81 d4
 * 0a 02 05 01 0a 02 06 00 0a 02
 * 06 01 0a 02 06 02 0a 02 06 03
 * 0a 02 06 05 0a 02 06 0a 0a 02
 * 06 0c 0a 02 06 12 0a 02 06 18
 * 0a 02 06 1a 0a 02 06 1b 0a 02
 *
 * 06 20 0a 02 06 21 0a 02 06 22
 * 0a 02 06 23 0a 02 06 24 0a 02
 * 06 25 0a 02 06 26 0a 02 06 30
 * 0a 02 06 31 0a 02 06 50 0a 02
 * 06 70 0a 02 06 85 0a 02 06 86
 *
 * 0a 02 06 87 0a 02 06 88 0a 02
 * 06 93 0a 02 06 b0 0a 02 06 c0
 * 0a 02 06 c1 0a 02 06 c2 0a 02
 * 06 c3 0a 02 06 c4 0a 02 06 c5
 * 0a 02 06 c6 0a 02 06 d1 0a 02
 *
 * 06 d3 0a 02 06 e0 0a 02 06 e1
 * 0a 02 06 e2 0a 02 06 e3 0a 02
 * 06 e5 0a 02 06 e6 0a 02 06 e7
 * 0a 02 08 01 0a 02 08 02 0a 02
 * 08 10 0a 02 08 11 0a 02 08 12
 *
 * 0a 02 08 13 0a 02 08 30 0a 02
 * 08 50
 *
 *
 * 1f 71 46
 * 0f 12 14 1b 1d 25 26 27 2d 40
 * 41 e8 1f 01 1f 02 1f 03 1f 06
 * 1f 0d 1f 15 1f 25 1f 32 1f 33
 * 1f 35 1f 36 1f 46 1f 48 1f 49
 * 1f 4a 1f 4b 1f 4c 1f 5b 1f 60
 * 1f 61 1f 62 1f 63 1f 6b 1f 6d
 * 1f 70 1f 72 1f 76 1f 77 1f 78
 */

typedef enum TlvTags
{
    TAG_UNKNOWN, TAG_27
} TlvTags;

/**
 * This class handle the Tlv container with the tags.
 *
 * Unlike the APDU class these class did not store the length-bytes but inherits the Bmp class.
 * Tlv::all() overwrites Bmp::all(). Use get() to receive only the data part.
 *
 * Unlike the Tag class, the Tlv class is a BMP! The BMP_06 is mentioned in the ZVT docs as Tlv_Encoded BMP.
 * At least the length is calculated in the same way as a tag. Therefore the calculateXXX methods are used in the Tag class.
 *
 * Maybe someone thinks that this method should be included in Tag.hpp.  This class was added before the Tag class (That is why it is as it is)
 * For now they are here...
 *
 */

class Tlv
        : public Bmp
{

public:
    Tlv();
    Tlv(const Tlv &other);
    /**
     * CTOR needs a wrapped 0x06 (ZVT) TLV container
     * CTOR works but prints an error!
     *
     * Use "tlv.set()" instead
     */
    Tlv(const std::vector<unsigned char>);
    virtual ~Tlv();

    void strip_of(const std::vector<unsigned char>);

    /**
     * Calculates the size in APDU format (one byte or extended three-byte)
     *
     * Examples
     *
     * 	255 - 65535:
     * 	310/256			= 1  (HI) --> 0x01
     * 	310-(1*256)		= 54 (LO) --> 0x36
     *
     * 	vector { FF, 36, 01 }
     *
     * 	0 - 254:
     * 	111             = 0x6F
     *
     * 	vector { 6F }
     *
     * 	Errors:
     * 	1243534345      = vector.size() is 0
     * 	-1              = vector.size() is 0
     *
     * return vector with size does not fit ZVT APDU (0-254 or 255 - 65535)
     */
    inline static std::vector<unsigned char> calculateSize(const int length)
    {
        std::vector<unsigned char> tlvSize;

        if (length >= 0 && length <= 127)
        {
            tlvSize.push_back(length);
        }
        else if (length > 127 && length <= 255)
        {
            tlvSize.push_back(0x81);
            tlvSize.push_back(length);
        }
        else if (length > 255 && length <= 0xFFFF)
        {
            int hi = length / 256;
            int lo = length - (hi * 256);

            tlvSize.push_back(0x82);
            tlvSize.push_back(hi);
            tlvSize.push_back(lo);
        }
            // APDU max is 0x82 (see above).
            // Next 0x83 is 65536 - 16777215
        else if (length > 0xFFFF && length <= 0xFFFFFF)
        {
            tlvSize.push_back(0x83);
            tlvSize.push_back(((length >> 16) & 0xff));
            tlvSize.push_back(((length >> 8) & 0xff));
            tlvSize.push_back(((length >> 0) & 0xff));
        }
        else if (length > 0xFFFFFF && length <= 0xFFFFFFFF)
        {
            tlvSize.push_back(0x84);
            tlvSize.push_back(((length >> 24) & 0xff));
            tlvSize.push_back(((length >> 16) & 0xff));
            tlvSize.push_back(((length >> 8) & 0xff));
            tlvSize.push_back(((length >> 0) & 0xff));
        }
        else
        {
            std::cerr << "Data size error! " << std::endl;
        }

        return tlvSize;
    }

    /*
     * Calculates the length from a 3-byte vector.
     */
    inline static int calculateSize(const std::vector<unsigned char> bytes)
    {
        if (bytes.size() == 1) return bytes.at(0);
        else if (bytes.size() == 2) return bytes.at(1);
        else if (bytes.size() == 3) return ((bytes.at(1) * 256) + bytes.at(2));
        else if (bytes.size() == 4) return ((bytes.at(1) << 16) + (bytes.at(2) << 8) + (bytes.at(3)));
        else if (bytes.size() == 5) return ((bytes.at(1) << 24) + (bytes.at(2) << 16) + (bytes.at(3) << 8) + (bytes.at(4)));
        else return 0;
    }

    /**
     * b8 b7 b6 b5 b4 b3 b2 b1 		Definition
     * 0  |  values decimal 0-127	length (1-byte) of the following data
     * 1  0  0  0  0  0  0  0       invalid length
     * 1  0  0  0  0  0  0  1       one byte follows (decimal of hex presentation)
     * 1  0  0  0  0  0  1  0       two bytes follows.
     * 								2nd byte is the HI-byte
     * 								3nd byte is the LO-byte
     * 1  value 3 to 127			Reserved for future use
     */
    inline static int calculateSizeOffset(const unsigned char byte)
    {
        if (byte >= 0x00 && byte < 0x80) return 1;
        else if (byte == 0x80) return 0; // invalid or broken length
        else if (byte == 0x81) return 2;
        else if (byte == 0x82) return 3;
        else return (byte ^ 0x80) + 1;
        /*
         * Real BER-TLV can store much more bytes as 65535 (0x82). Set b8 to 0   0x82 --> 0x02; 0x83 --> 0x03; ...
         */
    }

    void add(Zvt::Tag);
    void add(Zvt::Tag *);

    inline std::vector<unsigned char> all() const
    {
        std::vector<unsigned char> tlv = {this->_bmp};
        std::vector<unsigned char> tdata = this->get();
        std::vector<unsigned char> tlvSize = calculateSize(tdata.size());

        tdata.insert(tdata.begin(), tlvSize.begin(), tlvSize.end());
        tdata.insert(tdata.begin(), this->_bmp);

        return tdata;
    }

    // extract tags from the data vector
    std::vector<Zvt::Tag> tags();

    inline std::vector<Zvt::Tag> find(std::string hextag)
    {
        std::vector<Zvt::Tag> result;

        for (auto &tag: this->tags())
        {
            if (tag.tag_str() == hextag)
                result.push_back(tag);
            else
            {
                for (auto &stag: tag.subtags())
                {
                    if (stag.tag_str() == hextag)
                        result.push_back(stag);
                    else
                    {
                        for (auto &sstag: stag.subtags())
                        {
                            if (stag.tag_str() == hextag)
                                result.push_back(sstag);
                        }
                    }
                }
            }
        }

        return result;
    }

    static inline void printTagTree(Zvt::Tag tag, int level = 0)
    {
        std::cout << std::setw((level * 4) + 5)
                  << std::setfill(' ')
                  << std::right
                  << tag.tag_str()
                  << ": "
                  << (tag.isPrimitive() ? tag.data_as_hex() : "")
                  << std::endl;

        if (tag.isContructed())
        {
            level++;
            for (auto &stag: tag.subtags())
                printTagTree(stag, level);
        }

    }

    static inline void printTree(Zvt::Tlv tlv, int level = 0)
    {
        for (auto &tag: tlv.tags())
        {
            printTagTree(tag, level);
        }
    }

    static inline boost::json::array makeArray(boost::json::object object, Zvt::Tag tag)
    {
        if (object[tag.tag_str()].is_array())
        {
            object[tag.tag_str()].as_array().emplace_back(tag.data_as_hex());
            return object[tag.tag_str()].as_array();
        }

        boost::json::value oldValue = object[tag.tag_str()];
        boost::json::array array;
        array.emplace_back(oldValue);
        array.emplace_back(tag.data_as_hex());

        return array;
    }

    static inline boost::json::object toJson(Zvt::Tag &tag)
    {
        boost::json::object object;

        if (tag.isPrimitive())
        {
            if (object.contains(tag.tag_str()))
                object[tag.tag_str()] = makeArray(object, tag);
            else
                object[tag.tag_str()] = tag.data_as_hex();
        }
        else
        {
            boost::json::object sobject;
            for (auto &stag: tag.subtags())
            {
                if (stag.isPrimitive())
                {
                    if (sobject.contains(stag.tag_str()))
                        sobject[stag.tag_str()] = makeArray(sobject, stag);
                    else
                        sobject[stag.tag_str()] = stag.data_as_hex();
                }
                else
                {
                    boost::json::value value = toJson(stag)[stag.tag_str()];

                    if (sobject.contains(stag.tag_str()))
                    {
                        if (sobject[stag.tag_str()].is_array())
                            sobject[stag.tag_str()].as_array().emplace_back(value);
                        else
                        {
                            boost::json::value oldValue = sobject[stag.tag_str()];
                            boost::json::array array;
                            array.emplace_back(oldValue);
                            array.emplace_back(value);
                            sobject[stag.tag_str()] = array;
                        }
                    }
                    else
                        sobject[stag.tag_str()] = value;
                }
            }
            object.emplace(tag.tag_str(), sobject);
        }

        return object;
    }

    static inline boost::json::array toJson(Zvt::Tlv &tlv)
    {
        boost::json::object object;
        boost::json::array array;

        for (auto &tag: tlv.tags())
            array.emplace_back(toJson(tag));

        return array;
    }

    static inline std::string toJsonString(Zvt::Tlv &tlv)
    {
        return boost::json::serialize(Zvt::Tlv::toJson(tlv));
    }

    static Zvt::Tlv fromJsonString(std::string &content);
};

}
#endif /* TLV_HPP_ */
