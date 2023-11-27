/*
 * Tlv.cpp
 *
 *  Created on: 06.11.2020
 *      Author: ah
 */

#include "Apdu.hpp"
#include "Tlv.hpp"
#include "Tag.hpp"
#include "Utils.hpp"

Zvt::Tlv::Tlv(const Tlv &other)
        : Bmp(0x06, Zvt::Tlv_Encoded, other.get())
{
    this->_data = other.get();
}

Zvt::Tlv::Tlv()
        : Bmp(0x06, Zvt::Tlv_Encoded, std::vector<unsigned char>())
{
}

Zvt::Tlv::Tlv(std::vector<unsigned char> data)
        : Bmp(0x06, Zvt::Tlv_Encoded, data)
{
    // needed in ZVT because BMP06 is not a TLV contructed TAG!
    this->strip_of(data);
}

Zvt::Tlv::~Tlv()
{
}

/**
 * For ZVT bmp06 you can pass the complete container 06 xx ......
 * For TLV-BER this method creates a bmp26 (Tag 0x26 it is a contructed)
 *
 * @param tlv
 */
void Zvt::Tlv::strip_of(const std::vector<unsigned char> tlv)
{
    int offset = 0;

    if (tlv.size() > 1 && tlv[0] == 0x06 && tlv.size() >= ((offset = Zvt::Tlv::calculateSizeOffset(tlv[1])) + 1))
    {
        this->_data.clear();
        this->_bmp = tlv[0];
        this->_format = Zvt::Tlv_Encoded;
        this->_data = Zvt::copyRange(tlv, offset + 1, tlv.size() - 1);
    }
    else
    {
        std::cout << "vector contains not a 06 BMP (ZVT)! Setting _bmp to 0x26 (contructed). Consider using tlv.set()" << endl;
        this->_data.clear();
        this->_bmp = 0x26;
        this->_format = Zvt::Tlv_Encoded;
        this->_data = Zvt::copyRange(tlv, offset, tlv.size() - 1);
        Utils::log("\nWarning data:\n", tlv);
    }
}

void Zvt::Tlv::add(Zvt::Tag tag)
{
    std::vector<unsigned char> newData(tag.get());
    this->_data.insert(this->_data.end(), newData.begin(), newData.end());
}

void Zvt::Tlv::add(Zvt::Tag *tag)
{
    if (tag)
    {
        std::vector<unsigned char> newData(tag->get());
        this->_data.insert(this->_data.end(), newData.begin(), newData.end());
    }
}

std::vector<Zvt::Tag> Zvt::Tlv::tags()
{
    std::vector<Zvt::Tag> tags;

    //Utils::log("Zvt::Tlv::tags() ", this->get());

    for (int idx = 0; idx < this->get().size(); ++idx)
    {
        // set start index
        int start_idx = idx;

        //std::cout << "Zvt::Tlv::tags() start_idx=" << start_idx << std::endl;

        // calulate the length of the tag. may one or more.
        // I did not seen a tag longer as 2-bytes. But according to the zvt docs it could be more...
        int tag_length = Zvt::Tag::tag_length(Zvt::copyRange(this->get(), start_idx, this->get().size() - 1)).size();
        //std::cout << "Zvt::Tlv::tags() tag_length=" << tag_length << std::endl;
        // calculate the length (1-byte, 2-byte, 3-byte).
        // see zvt docs chapter 9
        int offset = Zvt::Tlv::calculateSizeOffset(this->get().at(start_idx + tag_length));
        //std::cout << "Zvt::Tlv::tags() offset=" << offset << std::endl;

        // calculate the length of the data.
        int from = start_idx + tag_length;
        int to = start_idx + tag_length + offset - 1;
        int length = Zvt::Tlv::calculateSize(Zvt::copyRange(this->get(), from, to));
        //std::cout << "Zvt::Tlv::tags() length=" << length << std::endl;
        //std::cout << "Zvt::Tlv::tags() from=" << from << std::endl;
        //std::cout << "Zvt::Tlv::tags() to=" << to << std::endl;

        from = start_idx;
        to = to + length;

        //std::cout << "Zvt::Tlv::tags() next from=" << from << std::endl;
        //std::cout << "Zvt::Tlv::tags() next to=" << to << std::endl;

        // copy from start_idx to the end of the tag
        Zvt::Tag tag = Zvt::Tag(Zvt::copyRange(this->get(), from, to));
        tags.push_back(Zvt::Tag::isAscii(tag));

        // set the index for the next tag. Or end the loop.
        // note that the for-loop will increment idx (++idx) at least.
        idx = to;
        //std::cout << "Zvt::Tlv::tags() next idx for increment++ is " << idx << " size=" << this->get().size() << std::endl;
    }

    return tags;
}

Zvt::Tlv Zvt::Tlv::fromJsonString(std::string &content)
{
    Zvt::Tlv tlv;

    if (!content.empty())
    {
        std::cout << "Input: " << content << std::endl;

        boost::json::value emv = boost::json::parse(content);


        for (auto &tpl: emv.as_array())
            tlv.add(boost::json::value_to<Zvt::Tag>(tpl));

        std::cout << "Parse: " << Utils::log_hex_str(tlv.get()) << std::endl;
    }

    return tlv;
}
