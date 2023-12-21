/*
 * Tag.cpp
 *
 *  Created on: 09.11.2020
 *      Author: ah
 */

#include "Apdu.hpp"
#include "Tag.hpp"
#include "Tlv.hpp"

Zvt::Tag::Tag(const unsigned char primitive)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(std::vector<unsigned char>())
          , is_ascii(false)
{
    this->tag_bytes.push_back(primitive);
}

Zvt::Tag::Tag(const unsigned char primitive, const unsigned char data)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(std::vector<unsigned char>())
          , is_ascii(false)
{
    this->tag_bytes.push_back(primitive);
    this->tag_data.push_back(data);
}

Zvt::Tag::Tag(const unsigned char primitive, const std::vector<unsigned char> data)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(data)
          , is_ascii(false)
{
    this->tag_bytes.push_back(primitive);
    //this->tag_data.insert(tag_data.end(), data.begin(), data.end());
}

Zvt::Tag::Tag(const unsigned char first, const unsigned char second, const std::vector<unsigned char> data)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(data)
          , is_ascii(false)
{
    this->tag_bytes.push_back(first);
    this->tag_bytes.push_back(second);
}

Zvt::Tag::Tag(const HexToByte tn)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(std::vector<unsigned char>())
          , is_ascii(false)
{
    for (auto &tb: tn.vector())
    {
        tag_bytes.push_back(tb);
    }
}

Zvt::Tag::Tag(const HexToByte tn, const std::vector<unsigned char> data)
        : tag_bytes(std::vector<Zvt::TagByte>())
          , tag_data(data)
          , is_ascii(false)
{
    for (auto &tb: tn.vector())
    {
        tag_bytes.push_back(tb);
    }
}

Zvt::Tag::Tag(const Zvt::Tag &tag)
        : tag_bytes(tag.tag_bytes)
          , tag_data(tag.tag_data)
          , is_ascii(tag.is_ascii)
{

}


/**
 * Copies the bytes from the vector to internal vector.
 *
 * Note:
 *
 * This class did not store the length bytes. The class stores the tag-bytes and data-bytes in different vectors.
 * tag_bytes uses bitset's unlike the tag_data which is using unsigned-char's
 *
 * Not storing the length bytes make adding tags on-the-fly a little birt easier.
 *
 * See chapter 9 in the ZVT docs. There is a overview how a TAG ist build...
 *
 */

Zvt::Tag::Tag(const std::vector<unsigned char> tag_data)
        : tag_bytes()
          , tag_data()
          , is_ascii(false)
{
    if (tag_data.size() > 0)
    {
        int start_idx = 0;
        // calculate the tag length and stores them into tag_bytes vector
        this->tag_bytes = Zvt::Tag::tag_length(Zvt::copyRange(tag_data, start_idx, tag_data.size() - 1));
        // calculate
        int offset = Zvt::Tlv::calculateSizeOffset(tag_data[this->tag_bytes.size()]);
        int from = this->tag_bytes.size();
        int to = this->tag_bytes.size() + offset - 1;
        int length = Zvt::Tlv::calculateSize(Zvt::copyRange(tag_data, from, to));

        if (length > 0)
        {
            from = start_idx + this->tag_bytes.size() + offset;
            to = start_idx + this->tag_bytes.size() + offset + length - 1;
            this->tag_data = Zvt::copyRange(tag_data, from, to);
        }
    }
}

std::string Zvt::Tag::data_str()
{
    std::vector<unsigned char> t = this->data();

    if (this->isAscii())
    {
        return Zvt::Bmp::BytesToString(t);
    }
    else
    {
        std::string result;
        boost::algorithm::hex(t.begin(), t.end(), std::back_inserter(result));
        return result;
    }
}

std::string Zvt::Tag::data_as_hex()
{
    std::vector<unsigned char> t = this->data();
    std::string result;
    if(t.size() > 0)
    {
        boost::algorithm::hex(t.begin(), t.end(), std::back_inserter(result));
    }
    else result = "";

    return result;
}

std::vector<unsigned char> Zvt::Tag::get()
{
    std::vector<unsigned char> tag;

    for (TagByte b: this->tag_bytes)
    {
        tag.push_back(b.to_ulong());
    }

    std::vector<unsigned char> size_data = Zvt::Tlv::calculateSize(this->tag_data.size());
    tag.insert(tag.end(), size_data.begin(), size_data.end());
    if (this->tag_data.size() > 0)
    {
        tag.insert(tag.end(), this->tag_data.begin(), this->tag_data.end());
    }
    return tag;
}

/**
 * 06 81 bc ---> 188
 * 1f 44 04
 * 		52 50 00 68
 *
 * 1f 54 01 ---> 1
 * 		62
 *
 * 1f 55 02 ---> 2
 * 		00 00
 *
 * e4 24    ---> 36
 * 		1f 40 05 44 32 32 30 57
 * 		1f 41 0e 70 30 32 2e 30 30 35 39 2e 34 30 2e 30 31
 * 		1f 42 04 12 43 82 20
 * 		1f 43 01 00
 *
 * e4 1e    ---> 30
 * 		1f 40 0d 4d 73 63 52 65 61 64 65 72 53 74 75 62
 * 		1f 41 00 1f 42 04 00 00 00 00
 * 		1f 43 01 00
 *
 * e4 1e    ---> 30
 * 1f 40 0d 49 63 63 52 65 61 64 65 72 53 74 75 62
 * 1f 41 00 1f 42 04 00 00 00 00
 * 1f 43 01 00
 *
 * e4 1f    ---> 31
 * 		1f 40 0e 43 74 6c 73 52 65 61 64 65 72 53 74 75 62
 * 		1f 41 00 1f 42 04 00 00 00 00
 * 		1f 43 01 00
 * 		1f 59 14 41 30 30 30 30 30 30 33 35 39 31 30 31 30 30 32 38 30 30 31
 * 		1f 59 04 30 30 30 30
 * 		1f 59 04 30 30 42 43
 */
std::vector<Zvt::Tag> Zvt::Tag::subtags()
{
    std::vector<Zvt::Tag> tags;

    if (this->isContructed())
    {
        //Utils::log("Zvt::Tag::subtags() ", this->data());

        if (this->data().size() > 1)
        {
            for (int idx = 0; idx < this->data().size(); ++idx)
            {
                int start_idx = idx;
                //std::cout << "Zvt::Tag::subtags() start_idx=" << start_idx << " data.size=" << this->data().size() << std::endl;

                // calculate the tag length
                std::vector<Zvt::TagByte> tbs = Zvt::Tag::tag_length(
                        Zvt::copyRange(this->data(), start_idx, this->data().size() - 1));
                //std::cout << "Zvt::Tag::subtags() tbs.size=" << tbs.size() << std::endl;
                // calculate
                int from = start_idx + tbs.size();
                //std::cout << "Zvt::Tag::subtags() from=" << from << std::endl;
                int offset = Zvt::Tlv::calculateSizeOffset(this->data()[from]);
                //std::cout << "Zvt::Tag::subtags() offset=" << offset << std::endl;
                int to = start_idx + tbs.size() + offset - 1;
                //std::cout << "Zvt::Tag::subtags() to=" << to << std::endl;
                int length = Zvt::Tlv::calculateSize(Zvt::copyRange(this->data(), from, to));
                //std::cout << "Zvt::Tag::subtags() length=" << length << std::endl;

                if (length > 0) to = start_idx + tbs.size() + offset + length - 1;
                else to = start_idx + tbs.size();

                Zvt::Tag tag = Zvt::Tag(Zvt::copyRange(this->data(), start_idx, to));
                tags.push_back(isAscii(tag));

                //std::cout << "Zvt::Tag::subtags() next to=" << to << std::endl;
                idx = to;
                //std::cout << "Zvt::Tag::subtags() next idx to increment++ is " << idx << std::endl;
            }
        }
    }

    return tags;
}

Zvt::Tag::~Tag()
{
    // TODO Auto-generated destructor stub
}

std::vector<Zvt::Tag> Zvt::Tag::find(const std::vector<unsigned char> tag)
{
    std::vector<Zvt::Tag> found_tags;

    if (this->isContructed())
    {
        std::vector<Zvt::Tag> tags = this->subtags();
        for (auto &t: tags)
        {
            if (t.tag() == tag)
                found_tags.push_back(t);
            else if (t.isContructed())
            {
                std::vector<Zvt::Tag> subtags = t.subtags();
                if (subtags.size() > 0)
                    found_tags.insert(subtags.end(), subtags.begin(), subtags.end());
            }
        }
    }

    return found_tags;
}

std::vector<Zvt::Tag> Zvt::Tag::find(const unsigned char byte1, const unsigned char byte2)
{
    return this->find({byte1, byte2});
}

Zvt::Tag Zvt::Tag::find_first(const std::vector<unsigned char> tag, const std::vector<unsigned char> default_value)
{
    if (this->isContructed())
    {
        std::vector<Zvt::Tag> tags = this->subtags();
        for (auto &t: tags)
        {
            if (t.tag() == tag)
                return t;
            else if (t.isContructed())
            {
                if (t.find_first(tag, default_value).tag() == tag)
                    return t.find_first(tag, default_value);
            }
        }
    }

    switch (default_value.size())
    {
        case 1:
            return Zvt::Tag(default_value[0]);
        case 2:
            return Zvt::Tag(default_value[0], default_value[1], {});
        default:
            return Zvt::Tag(0x00, 0x00, {} );
    }
}

void Zvt::from_object(const boost::json::object &object, Zvt::Tag &tag)
{
    for (auto &so: object)
    {
        if (so.value().is_string())
            from_string(so, tag);
        else if (so.value().is_array())
            from_array(so.value().as_array(), std::string(so.key_c_str()), tag);
        else if (so.value().is_object())
        {
            Zvt::Tag stag(Zvt::HexToByte(std::string(so.key_c_str())));
            from_object(so.value().as_object(), stag);
            tag.append(stag.get());
        }
        else std::cerr << "from_object: " << so.value().kind() << std::endl;
    }
}

void Zvt::from_string(const boost::json::key_value_pair &key_value_pair, Zvt::Tag &tag)
{
    Zvt::Tag stag(Zvt::HexToByte(std::string(key_value_pair.key_c_str()))
                  , Utils::hex2bytes(std::string(key_value_pair.value().as_string())));

    tag.append(stag.get());
}

void Zvt::from_string(const std::string &value, Zvt::Tag &tag)
{
    tag.append(Utils::hex2bytes(value));
}

void Zvt::from_array(const boost::json::array &array, const std::string &key, Zvt::Tag &tag)
{
    for (auto &arr: array)
    {
        Zvt::Tag stag((Zvt::HexToByte(key)));

        if (arr.is_object())
        {
            for (auto &sso: arr.as_object())
            {
                if (sso.value().is_string())
                    from_string(sso, stag);
                else if (sso.value().is_array())
                    from_array(sso.value().as_array(), std::string(sso.key_c_str()), stag);
                else if (sso.value().is_object())
                {
                    Zvt::Tag otag(HexToByte(std::string(sso.key_c_str())));

                    for (auto &ssso: sso.value().as_object())
                    {
                        if (ssso.value().is_string())
                            from_string(ssso, otag);
                        else if (ssso.value().is_object()) //
                            from_object(ssso.value().as_object(), otag);
                        else if (ssso.value().is_array())
                            from_array(ssso.value().as_array(), std::string(ssso.key_c_str()), otag);
                        else std::cerr << "from_array 2: " << ssso.value().kind() << " " << arr << std::endl;
                    }
                    stag.append(otag.get());
                }
                else std::cerr << "from_array 1: " << sso.value().kind() << std::endl;
            }
        }
        else if (arr.is_string())
            from_string(std::string(arr.as_string()), stag);
        else std::cerr << "from_array 0: " << arr.kind() << std::endl;

        tag.append(stag.get());
    }
}

// e0 20 df 76 03 98 96 86 df 50 03 56 41 4c df 14 03 43 4f 52 df 15 03 56 41 4c df 16 01 56 df 53 01 56 e1 81 9f df 76 03 98 96 91 9f 40 05 70 00 f0 f0 00 df 12 02 64 65 df 13 02 e0 00 df 17 01 01 df 18 01 03 df 40 1c a0 00 00 00 25 00 01 a0 00 00 00 04 00 02 a0 00 00 00 03 00 8c a0 00 00 03 59 00 02 df 49 1c a0 00 00 00 25 00 01 a0 00 00 00 04 00 02 a0 00 00 00 03 00 8c a0 00 00 03 59 00 02 9f 33 03 e0 f8 c8 9f 1a 02 02 80 9f 1c 08 35 32 35 30 30 31 33 33 df 34 05 0c 20 c0 d4 d6 df 33 04 64 65 65 6e 9f 35 01 22 df 35 02 09 78 df 47 03 45 55 52 df 36 01 02 df 46 01 60 df 52 02 80 00 e2 82 02 cc df 76 03 98 96 88 bf 01 1a df 01 06 a0 00 00 00 25 01 df 02 01 12 df 03 02 e0 00 df 04 01 01 df 0f 01 06 bf 01 1a df 01 06 a0 00 00 00 25 01 df 02 01 14 df 03 02 64 00 df 04 01 01 df 0f 01 06 bf 01 1a df 01 06 a0 00 00 00 25 01 df 02 01 15 df 03 02 e0 00 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 04 30 60 df 02 01 30 df 03 02 80 00 df 04 01 01 df 0f 01 06 bf 01 1f df 01 07 a0 00 00 00 04 30 60 df 02 01 31 df 03 02 80 00 df 04 01 01 df 0e 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 30 60 df 02 01 32 df 03 02 18 00 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 30 60 df 02 01 33 df 03 02 64 00 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 30 60 df 02 01 34 df 03 02 80 00 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 04 10 10 df 02 01 16 df 03 02 e0 00 df 04 01 01 df 0f 01 06 bf 01 1f df 01 07 a0 00 00 00 04 10 10 df 02 01 17 df 03 02 80 00 df 04 01 01 df 0e 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 10 10 df 02 01 18 df 03 02 18 00 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 10 10 df 02 01 19 df 03 02 64 00 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 04 10 10 df 02 01 20 df 03 02 e0 00 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 03 10 10 df 02 01 22 df 03 02 fc 08 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 03 20 20 df 02 01 23 df 03 02 e0 00 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 03 20 10 df 02 01 24 df 03 02 e0 00 df 04 01 01 df 0f 01 01 bf 01 1b df 01 07 a0 00 00 00 03 10 10 df 02 01 25 df 03 02 fc 08 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 03 20 20 df 02 01 26 df 03 02 e0 00 df 04 01 01 df 0f 01 06 bf 01 1b df 01 07 a0 00 00 00 03 20 10 df 02 01 27 df 03 02 e0 00 df 04 01 01 df 0f 01 06 bf 01 1e df 01 0a a0 00 00 03 59 10 10 02 80 01 df 02 01 40 df 03 02 a0 00 df 04 01 01 df 0f 01 01 bf 01 1e df 01 0a a0 00 00 03 59 10 10 02 80 01 df 02 01 41 df 03 02 80 00 df 04 01 01 df 0f 01 06 bf 01 22 df 01 0a a0 00 00 03 59 10 10 02 80 01 df 02 01 42 df 03 02 80 00 df 04 01 01 df 0e 01 01 df 0f 01 06 bf 01 1d df 01 09 a0 00 00 03 59 10 10 02 80 df 02 01 43 df 03 02 20 00 df 04 01 01 df 0f 01 06 e3 82 0d aa df 76 03 98 96 88 bf 01 81 c7 df 07 01 01 df 01 05 a0 00 00 00 25 9f 22 01 c8 df 02 01 01 df 03 01 01 df 04 81 90 bf 0c fc ed 70 8f b6 b0 48 e3 01 43 36 ea 24 aa 00 7d 79 67 b8 aa 4e 61 3d 26 d0 15 c4 fe 78 05 d9 db 13 1c ed 0d 2a 8e d5 04 c3 b5 cc d4 8c 33 19 9e 5a 5b f6 44 da 04 3b 54 db f6 02 76 f0 5b 17 50 fa b3 90 98 c7 51 1d 04 ba bc 64 94 82 dd cf 7c c4 2c 8c 43 5b ab 8d d0 eb 1a 62 0c 31 11 1d 1a aa f9 af 65 71 ee bd 4c f5 a0 84 96 d5 7e 7a bd bb 51 80 e0 a4 2d a8 69 ab 95 fb 62 0e ff 26 41 c3 70 2a f3 be 0b 0c 13 8e ae f2 02 e2 1d df 05 01 03 df 06 14 33 bd 7a 05 9f ab 09 49 39 b9 0a 8f 35 84 5c 9d c7 79 bd 50 bf 01 81 e7 df 07 01 01 df 01 05 a0 00 00 00 25 9f 22 01 c9 df 02 01 01 df 03 01 01 df 04 81 b0 b3 62 db 57 33 c1 5b 87 97 b8 ec ee 55 cb 1a 37 1f 76 0e 0b ed d3 71 5b b2 70 42 4f d4 ea 26 06 2c 38 c3 f4 aa a3 73 2a 83 d3 6e a8 e9 60 2f 66 83 ee cc 6b af f6 3d d2 d4 90 14 bd e4 d6 d6 03 cd 74 42 06 b0 5b 4b ad 0c 64 c6 3a b3 97 6b 5c 8c aa f8 53 95 49 f5 92 1c 0b 70 0d 5b 0f 83 c4 e7 e9 46 06 8b aa ab 54 63 54 4d b1 8c 63 80 11 18 f2 18 2e fc c8 a1 e8 5e 53 c2 a7 ae 83 9a 5c 6a 3c ab e7 37 62 b7 0d 17 0a b6 4a fc 6c a4 82 94 49 02 61 1f b0 06 1e 09 a6 7a cb 77 e4 93 d9 98 a0 cc f9 3d 81 a4 f6 c0 dc 6b 7d f2 2e 62 db df 05 01 03 df 06 14 8e 8d ff 44 3d 78 cd 91 de 88 82 1d 70 c9 8f 06 38 e5 1e 49 bf 01 82 01 2f df 07 01 01 df 01 05 a0 00 00 00 25 9f 22 01 ca df 02 01 01 df 03 01 10 df 04 81 f8 c2 3e cb d7 11 9f 47 9c 2e e5 46 c1 23 a5 85 d6 97 a7 d1 0b 55 c2 d2 8b ef 0d 29 9c 01 dc 65 42 0a 03 fe 52 27 ec de cb 80 25 fb c8 6e eb c1 93 52 98 c1 75 3a b8 49 93 67 49 71 95 91 75 8c 31 5f a1 50 40 07 89 bb 14 fa dd 6e ae 2a d6 17 da 38 16 31 99 d1 ba d5 d3 f8 f6 a7 a2 0a ef 42 0a df e2 40 4d 30 b2 19 35 9c 6a 49 52 56 5c cc a6 f1 1e c5 be 56 4b 49 b0 ea 5b f5 b3 dc 8c 5c 64 01 20 8d 00 29 c3 95 7a 8c 59 22 cb de 39 d3 a5 64 c6 de bb 6b d2 ae f9 1f c2 7b b3 d3 89 2b eb 96 46 dc e2 e1 ef 85 81 ef fa 71 21 58 aa ec 54 1c 0b bb 4b 3e 27 9d 7d a5 4e 45 a0 ac c3 57 0e 71 2c 9f 7c df 98 5c fa fd 38 2a e1 3a 3b 21 4a 9e 8e 1e 71 ab 1e a7 07 89 51 12 ab c3 a9 7d 0f cb 0a e2 ee 5c 85 49 2b 6c fd 54 88 5c dd 63 37 e8 95 cc 70 fb 32 55 e3 df 05 01 03 df 06 14 6b da 32 b1 aa 17 14 44 c7 e8 f8 80 75 a7 4f bf e8 45 76 5f bf 01 81 c7 df 07 01 01 df 01 05 a0 00 00 00 04 9f 22 01 f3 df 02 01 01 df 03 01 01 df 04 81 90 98 f0 c7 70 f2 38 64 c2 e7 66 df 02 d1 e8 33 df f4 ff e9 2d 69 6e 16 42 f0 a8 8c 56 94 c6 47 9d 16 db 15 37 bf e2 9e 4f dc 6e 6e 8a fd 1b 0e b7 ea 01 24 72 3c 33 31 79 bf 19 e9 3f 10 65 8b 2f 77 6e 82 9e 87 da ed a9 c9 4a 8b 33 82 19 9a 35 0c 07 79 77 c9 7a ff 08 fd 11 31 0a c9 50 a7 2c 3c a5 00 2e f5 13 fc cc 28 6e 64 6e 3c 53 87 53 5d 50 95 14 b3 b3 26 e1 23 4f 9c b4 8c 36 dd d4 4b 41 6d 23 65 40 34 a6 6f 40 3b a5 11 c5 ef a3 df 05 01 03 df 06 14 a6 9a c7 60 3d af 56 6e 97 2d ed c2 cb 43 3e 07 e8 b0 1a 9a bf 01 81 b7 df 07 01 01 df 01 05 a0 00 00 00 04 9f 22 01 f8 df 02 01 01 df 03 01 01 df 04 81 80 a1 f5 e1 c9 bd 86 50 bd 43 ab 6e e5 6b 89 1e f7 45 9c 0a 24 fa 84 f9 12 7d 1a 6c 79 d4 93 0f 6d b1 85 2e 25 10 f1 8b 61 cd 35 4d b8 3a 35 6b d1 90 b8 8a b8 df 04 28 4d 02 a4 20 4a 7b 6c b7 c5 55 19 77 a9 b3 63 79 ca 3d e1 a0 8e 69 f3 01 c9 5c c1 c2 05 06 95 92 75 f4 17 23 dd 5d 29 25 29 05 79 e5 a9 5b 0d f6 32 3f c8 e9 27 3d 6f 84 91 98 c4 99 62 09 16 6d 9b fc 97 3c 36 1c c8 26 e1 df 05 01 03 df 06 14 f0 6e cc 6d 2a ae bf 25 9b 7e 75 5a 38 d9 a9 b2 4e 2f f3 dd bf 01 81 c7 df 07 01 01 df 01 05 a0 00 00 00 04 9f 22 01 fa df 02 01 01 df 03 01 01 df 04 81 90 a9 0f cd 55 aa 2d 5d 99 63 e3 5e d0 f4 40 17 76 99 83 2f 49 c6 ba b1 5c da e5 79 4b e9 3f 93 4d 44 62 d5 d1 27 62 e4 8c 38 ba 83 d8 44 5d ea a7 41 95 a3 01 a1 02 b2 f1 14 ea da 0d 18 0e e5 e7 a5 c7 3e 0c 4e 11 f6 7a 43 dd ab 5d 55 68 3b 14 74 cc 06 27 f4 4b 8d 30 88 a4 92 ff aa da d4 f4 24 22 d0 e7 01 35 36 c3 c4 9a d3 d0 fa e9 64 59 b0 f6 b1 b6 05 65 38 a3 d6 d4 46 40 f9 44 67 b1 08 86 7d ec 40 fa ae cd 74 0c 00 e2 b7 a8 85 2d df 05 01 03 df 06 14 5b ed 40 68 d9 6e a1 6d 2d 77 e0 3d 60 36 fc 7a 16 0e a9 9c bf 01 82 01 2f df 07 01 01 df 01 05 a0 00 00 00 04 9f 22 01 ef df 02 01 01 df 03 01 01 df 04 81 f8 a1 91 cb 87 47 3f 29 34 9b 5d 60 a8 8b 3e ae e0 97 3a a6 f1 a0 82 f3 58 d8 49 fd df f9 c0 91 f8 99 ed a9 79 2c af 09 ef 28 f5 d2 24 04 b8 8a 22 93 ee bb c1 94 9c 43 be a4 d6 0c fd 87 9a 15 39 54 4e 09 e0 f0 9f 60 f0 65 b2 bf 2a 13 ec c7 05 f3 d4 68 b9 d3 3a e7 7a d9 d3 f1 9c a4 0f 23 dc f5 eb 7c 04 dc 8f 69 eb a5 65 b1 eb cb 46 86 cd 27 47 85 53 0f f6 f6 e9 ee 43 aa 43 fd b0 2c e0 0d ae c1 5c 7b 8f d6 a9 b3 94 ba ba 41 9d 3f 6d c8 5e 16 56 9b e8 e7 69 89 68 8e fe a2 df 22 ff 7d 35 c0 43 33 8d ea a9 82 a0 2b 86 6d e5 32 85 19 eb bc d6 f0 3c dd 68 66 73 84 7f 84 db 65 1a b8 6c 28 cf 14 62 56 2c 57 7b 85 35 64 a2 90 c8 55 6d 81 85 31 26 8d 25 cc 98 a4 cc 6a 0b df ff da 2d cc a3 a9 4c 99 85 59 e3 07 fd df 91 50 06 d9 a9 87 b0 7d da eb 3b df 05 01 03 df 06 14 21 76 6e bb 0e e1 22 af b6 5d 78 45 b7 3d b4 6b ab 65 42 7a bf 01 81 e7 df 07 01 01 df 01 05 a0 00 00 00 04 9f 22 01 f1 df 02 01 01 df 03 01 01 df 04 81 b0 a0 dc f4 bd e1 9c 35 46 b4 b6 f0 41 4d 17 4d de 29 4a ab bb 82 8c 5a 83 4d 73 aa e2 7c 99 b0 b0 53 a9 02 78 00 72 39 b6 45 9f f0 bb cd 7b 4b 9c 6c 50 ac 02 ce 91 36 8d a1 bd 21 aa ea db c6 53 47 33 7d 89 b6 8f 5c 99 a0 9d 05 be 02 dd 1f 8c 5b a2 0e 2f 13 fb 2a 27 c4 1d 3f 85 ca d5 cf 66 68 e7 58 51 ec 66 ed bf 98 85 1f d4 e4 2c 44 c1 d5 9f 59 84 70 3b 27 d5 b9 f2 1b 8f a0 d9 32 79 fb bf 69 e0 90 64 29 09 c9 ea 27 f8 98 95 95 41 aa 67 57 f5 f6 24 10 4f 6e 1d 3a 95 32 f2 a6 e5 15 15 ae ad 1b 43 b3 d7 83 50 88 a2 fa fa 7b e7 df 05 01 03 df 06 14 d8 e6 8d a1 67 ab 5a 85 d8 c3 d5 5e cb 9b 05 17 a1 a5 b4 bb bf 01 81 b7 df 07 01 01 df 01 05 a0 00 00 00 03 9f 22 01 99 df 02 01 01 df 03 01 01 df 04 81 80 ab 79 fc c9 52 08 96 96 7e 77 6e 64 44 4e 5d cd d6 e1 36 11 87 4f 39 85 72 25 20 42 52 95 ee a4 bd 0c 27 81 de 7f 31 cd 3d 04 1f 56 5f 74 73 06 ee d6 29 54 b1 7e da ba 3a 6c 5b 85 a1 de 1b eb 9a 34 14 1a f3 8f cf 82 79 c9 de a0 d5 a6 71 0d 08 db 41 24 f0 41 94 55 87 e2 03 59 ba b4 7b 75 75 ad 94 26 2d 4b 25 f2 64 af 33 de dc f2 8e 09 61 5e 93 7d e3 2e dc 03 c5 44 45 fe 7e 38 27 77 df 05 01 03 df 06 14 4a bf fd 6b 1c 51 21 2d 05 55 2e 43 1c 5b 17 00 7d 2f 5e 6d bf 01 81 c7 df 07 01 01 df 01 05 a0 00 00 00 03 9f 22 01 95 df 02 01 01 df 03 01 01 df 04 81 90 be 9e 1f a5 e9 a8 03 85 29 99 c4 ab 43 2d b2 86 00 dc d9 da b7 6d fa aa 47 35 5a 0f e3 7b 15 08 ac 6b f3 88 60 d3 c6 c2 e5 b1 2a 3c aa f2 a7 00 5a 72 41 eb aa 77 71 11 2c 74 cf 9a 06 34 65 2f bc a0 e5 98 0c 54 a6 47 61 ea 10 1a 11 4e 0f 0b 55 72 ad d5 7d 01 0b 7c 9c 88 7e 10 4c a4 ee 12 72 da 66 d9 97 b9 a9 0b 5a 6d 62 4a b6 c5 7e 73 c8 f9 19 00 0e b5 f6 84 89 8e f8 c3 db ef b3 30 c6 26 60 be d8 8e a7 8e 90 9a ff 05 f6 da 62 7b df 05 01 03 df 06 14 ee 15 11 ce c7 10 20 a9 b9 04 43 b3 7b 1d 5f 6e 70 30 30 f6 bf 01 81 e7 df 07 01 01 df 01 05 a0 00 00 00 03 9f 22 01 92 df 02 01 01 df 03 01 01 df 04 81 b0 99 6a f5 6f 56 91 87 d0 92 93 c1 48 10 45 0e d8 ee 33 57 39 7b 18 a2 45 8e fa a9 2d a3 b6 df 65 14 ec 06 01 95 31 8f d4 3b e9 b8 f0 cc 66 9e 3f 84 40 57 cb dd f8 bd a1 91 bb 64 47 3b c8 dc 9a 73 0d b8 f6 b4 ed e3 92 41 86 ff d9 b8 c7 73 57 89 c2 3a 36 ba 0b 8a f6 53 72 eb 57 ea 5d 89 e7 d1 4e 9c 7b 6b 55 74 60 f1 08 85 da 16 ac 92 3f 15 af 37 58 f0 f0 3e bd 3c 5c 2c 94 9c ba 30 6d b4 4e 6a 2c 07 6c 5f 67 e2 81 d7 ef 56 78 5d c4 d7 59 45 e4 91 f0 19 18 80 0a 9e 2d c6 6f 60 08 05 66 ce 0d af 8d 17 ea d4 6a d8 e3 0a 24 7c 9f df 05 01 03 df 06 14 42 9c 95 4a 38 59 ce f9 12 95 f6 63 c9 63 e5 82 ed 6e b2 53 bf 01 82 01 2f df 07 01 01 df 01 05 a0 00 00 00 03 9f 22 01 94 df 02 01 01 df 03 01 01 df 04 81 f8 ac d2 b1 23 02 ee 64 4f 3f 83 5a bd 1f c7 a6 f6 2c ce 48 ff ec 62 2a a8 ef 06 2b ef 6f b8 ba 8b c6 8b bf 6a b5 87 0e ed 57 9b c3 97 3e 12 13 03 d3 48 41 a7 96 d6 dc bc 41 db f9 e5 2c 46 09 79 5c 0c cf 7e e8 6f a1 d5 cb 04 10 71 ed 2c 51 d2 20 2f 63 f1 15 6c 58 a9 2d 38 bc 60 bd f4 24 e1 77 6e 2b c9 64 80 78 a0 3b 36 fb 55 43 75 fc 53 d5 7c 73 f5 16 0e a5 9f 3a fc 53 98 ec 7b 67 75 8d 65 c9 bf f7 82 8b 6b 82 d4 be 12 4a 41 6a b7 30 19 14 31 1e a4 62 c1 9f 77 1f 31 b3 b5 73 36 00 0d ff 73 2d 3b 83 de 07 05 2d 73 03 54 d2 97 be c7 28 71 dc cf 0e 19 3f 17 1a ba 27 ee 46 4c 6a 97 69 09 43 d5 9b da bb 2a 27 eb 71 ce eb da fa 11 76 04 64 78 fd 62 fe c4 52 d5 ca 39 32 96 53 0a a3 f4 19 27 ad fe 43 4a 2d f2 ae 30 54 f8 84 06 57 a2 6e 0f c6 17 df 05 01 03 df 06 14 c4 a3 c4 3c cf 87 32 7d 13 6b 80 41 60 e4 7d 43 b6 0e 6e 0f bf 01 82 01 18 df 07 01 01 df 01 05 a0 00 00 03 59 9f 22 01 fd df 02 01 01 df 03 01 01 df 04 81 f8 8b 31 b6 07 10 c8 ec b3 54 6f 14 6f 34 ec e1 26 bf 1e fb 4f 9c 4a 2b 96 4c b6 f0 87 d6 c5 1c 87 a0 94 22 4f 30 0f 70 d7 91 6b be 4e ee 84 14 d8 a3 b4 d9 0c 9c 93 6b 5a 5e 21 b8 20 a1 5c 46 68 eb d6 b0 99 a5 25 6b e7 20 f5 6f 81 3a 1e f1 2e bc aa 73 8b 6a df c3 43 6a 93 f8 d0 12 69 6c ad f8 8e d3 e2 1d 13 1f 35 7d 4a 80 e8 bf 0d 8f 83 ff 3b 1f e5 7d ff 5d 71 40 98 2d ab 45 f8 91 a8 01 50 fa 95 61 b3 b9 2e 63 f2 49 1b e4 a8 6a 70 2f 5b 6e 22 a9 97 bb 2f bb fe 14 46 54 75 15 b6 11 40 b9 36 3b cb 73 2f b6 22 ba f3 3e 73 35 5c 42 2d 05 13 69 c4 f1 fb 8c 32 f5 45 f7 cb df 68 5a 68 34 78 15 2e c4 7a c7 c6 80 54 b9 1f f2 e2 4c c6 1e ee d2 f8 26 5e d8 bf 94 61 94 9c e2 e4 3b 39 ee a2 9e 52 53 05 b6 be 75 90 dd c4 e9 6f cf 43 a6 7d 8f 68 fd 01 df 05 01 03 bf 01 81 d0 df 07 01 01 df 01 05 a0 00 00 03 59 9f 22 01 fe df 02 01 01 df 03 01 01 df 04 81 b0 99 a7 bc 13 a7 a4 7d e7 38 85 c6 4c 19 9c d9 da dc dd 68 52 85 15 81 63 84 d7 18 8e c2 70 bf 88 97 a5 07 1c ee ac 82 f0 66 89 8b 65 9d a6 84 26 0e 17 fa 77 1b 66 a3 1f 5a 8e 05 56 52 1f ac d7 2b b2 17 02 41 a9 c7 19 07 9a a2 46 de b7 84 b0 11 3c 48 61 da 23 8f 00 d8 6e 08 d3 9c c1 68 0d 30 7b d6 60 6f 47 42 4d a0 b1 5d 7a 88 4c f2 73 ff df 9c b1 eb 3f 77 cf 32 48 3e 22 ea 26 94 e4 dd 3a b6 d5 1d 73 4c a3 46 69 78 44 53 dc d0 7a 2d b9 8c 9c 81 64 b5 63 11 88 d7 7f 4e 3a ae 8c fd a4 5b 5b 69 52 2d b3 c9 f4 f2 9c f8 6e 9b 65 df 05 01 03 bf 01 81 b0 df 07 01 01 df 01 05 a0 00 00 03 59 9f 22 01 ff df 02 01 01 df 03 01 01 df 04 81 90 ce 4e 89 f0 69 06 22 e3 a2 93 b2 94 2c ff 15 e0 7a b2 24 98 c0 f9 3d a8 8b a8 09 d9 60 63 5a 91 ed 12 b8 03 42 8f cd 06 51 9a d9 13 f0 f2 dc 3a 25 e3 bf 67 f0 aa 32 6e c3 5f e5 78 8c d4 65 23 d3 5f bd 23 68 15 e2 e4 6b 95 74 a5 0d 37 de 39 d0 4a 60 bb a6 7c f6 56 f3 7f 31 df 39 b0 d7 d1 c1 95 39 a1 fd 16 5f 1b 5d e2 5f 55 6c bf ea cc ca 05 9e 65 f2 71 c7 b0 55 84 ce c9 60 79 28 98 e5 00 d8 1f fc c8 c2 78 b9 b0 5b 91 ef aa 25 f9 df 05 01 03 e4 82 01 4a df 76 03 98 96 86 bf 01 15 df 01 01 01 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 bf 01 15 df 01 01 02 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 bf 01 1d df 01 01 03 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 df 0f 01 08 df 0f 01 04 bf 01 15 df 01 01 04 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 bf 01 19 df 01 01 05 df 10 02 8f c0 df 02 01 14 df 11 01 28 df 0f 01 20 df 0f 01 08 bf 01 19 df 01 01 06 df 10 02 8f c0 df 02 01 14 df 11 01 28 df 0f 01 20 df 0f 01 08 bf 01 1d df 01 01 08 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 df 0f 01 04 df 0f 01 02 bf 01 19 df 01 01 09 df 10 02 8f c0 df 02 01 14 df 11 01 28 df 0f 01 20 df 0f 01 08 bf 01 1d df 01 01 10 df 10 02 8f c0 df 02 01 14 df 11 01 2c df 0f 01 20 df 0f 01 08 df 0f 01 04 bf 01 15 df 01 01 01 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 bf 01 15 df 01 01 02 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 bf 01 15 df 01 01 03 df 10 02 8f c0 df 02 01 14 df 11 01 20 df 0f 01 20 e5 7c df 76 03 98 96 86 bf 01 0d df 01 06 a0 00 00 00 25 01 df 02 01 00 bf 01 0e df 01 07 a0 00 00 00 04 30 60 df 02 01 00 bf 01 0e df 01 07 a0 00 00 00 04 10 10 df 02 01 00 bf 01 0e df 01 07 a0 00 00 00 03 10 10 df 02 01 00 bf 01 0e df 01 07 a0 00 00 00 03 20 10 df 02 01 01 bf 01 0e df 01 07 a0 00 00 00 03 20 20 df 02 01 01 bf 01 0e df 01 07 a0 00 00 03 59 10 10 df 02 01 00 e6 3b df 76 03 98 96 85 df 19 01 12 9f 01 06 00 00 00 00 05 25 df 24 01 15 df 1b 01 01 df 1e 05 dc 50 fc 98 00 df 1f 05 00 10 00 00 00 df 20 05 de 00 fc 98 00 9f 6d 01 c0 df 4a 01 30 e6 3b df 76 03 98 96 85 df 19 01 14 9f 01 06 00 00 00 00 05 25 df 24 01 15 df 1b 01 01 df 1e 05 00 00 00 00 00 df 1f 05 ff ff ff ff ff df 20 05 00 00 00 00 00 9f 6d 01 c0 df 4a 01 30 e6 82 01 25 df 76 03 98 96 85 df 19 01 15 9f 01 06 00 00 00 00 05 25 df 1b 01 01 9f 40 05 60 00 f0 f0 00 df 41 10 41 6d 65 72 69 63 61 6e 20 45 78 70 72 65 73 73 df 27 05 80 c2 82 f8 f6 df 28 02 f0 60 df 42 01 02 df 1a 03 9f 37 04 df 4b 03 00 00 30 df 44 01 01 df 45 01 01 df 1c 01 00 9f 15 02 59 99 9f 16 0f 39 35 30 35 36 30 32 32 35 30 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 2c 07 f0 00 00 00 00 0f c0 df 2d 06 99 99 99 99 99 00 df 2e 06 00 00 00 00 01 00 df 30 2e cb 01 95 05 c5 01 ca 04 d0 01 df 34 02 d2 01 cc 10 89 06 cd 02 c4 02 9f 34 03 df 1b 01 9f 33 03 9f 40 05 9f 1a 02 9f 35 01 9f 41 04 8a 02 df 32 10 41 6d 65 72 69 63 61 6e 20 45 78 70 72 65 73 73 df 1d 01 00 df 1e 05 dc 50 fc 98 00 df 1f 05 00 10 00 00 00 df 20 05 de 00 fc 98 00 9f 33 03 e0 f8 c8 9f 1b 04 00 00 00 00 df 21 04 00 00 00 00 9f 1a 02 02 76 e6 81 b4 df 76 03 98 96 85 df 19 01 30 df 24 01 34 9f 01 06 00 00 00 00 05 25 df 1b 01 01 df 41 07 4d 61 65 73 74 72 6f df 27 05 00 00 00 f0 f0 df 28 02 f0 60 df 81 18 01 40 df 81 19 01 08 df 81 30 01 0d df 81 1b 01 b0 df 4b 03 00 00 15 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 81 24 06 99 99 99 99 99 99 df 81 25 06 99 99 99 99 99 99 df 81 26 06 00 00 00 00 50 00 df 32 07 4d 61 65 73 74 72 6f 9f 1d 08 4c 52 80 00 00 00 00 00 e6 1d df 76 03 98 96 85 df 19 01 31 df 24 01 30 df 81 26 06 00 00 00 00 00 00 df 81 19 01 40 e6 15 df 76 03 98 96 85 df 19 01 32 df 24 01 30 9f 1b 04 00 00 00 00 e6 4a df 76 03 98 96 85 df 19 01 33 df 24 01 30 df 81 26 06 99 99 99 99 99 99 df 81 18 01 00 df 81 19 01 08 9f 33 03 e0 f8 00 df 81 1e 01 00 df 81 2c 01 00 df 1e 05 00 00 00 00 00 df 1f 05 ff ff ff ff ff df 20 05 00 00 00 00 00 e6 82 01 11 df 76 03 98 96 85 df 19 01 34 9f 01 06 00 00 00 00 05 25 df 1b 01 01 df 41 07 4d 61 65 73 74 72 6f df 42 01 01 df 27 05 61 c2 00 f0 f0 df 28 02 f0 60 df 1a 03 9f 37 04 df 4b 03 00 00 30 df 44 01 01 df 45 01 01 df 1c 01 00 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 2c 07 f0 00 00 00 00 0f c0 df 2d 06 99 99 99 99 99 99 df 2e 06 00 00 00 00 01 00 df 30 34 cb 01 95 05 c5 01 ca 04 d0 01 df 34 02 d2 01 cc 10 89 06 cd 02 c4 02 9f 34 03 df 1b 01 9f 33 03 9f 40 05 9f 1a 02 9f 35 01 df 2a 06 df 41 10 9f 41 04 8a 02 df 31 06 99 99 99 99 99 99 df 32 07 4d 61 65 73 74 72 6f df 1e 05 fe 50 bc a0 00 df 1f 05 00 00 00 00 00 df 20 05 fe 50 bc f8 00 9f 1b 04 00 00 00 00 df 21 04 00 00 00 00 9f 33 03 60 d0 c8 e6 82 01 03 df 76 03 98 96 85 df 19 01 16 df 24 01 20 9f 01 06 00 00 00 00 05 25 df 1b 01 01 df 41 0a 4d 61 73 74 65 72 43 61 72 64 df 27 05 00 00 00 f0 f0 df 81 18 01 60 df 81 19 01 08 df 81 30 01 0d df 81 1b 01 b0 df 81 1e 01 00 df 81 2c 01 00 df 4b 03 00 00 15 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 81 2d 03 00 00 13 df 2d 06 99 99 99 99 99 99 df 2e 06 00 00 00 00 00 00 df 81 31 08 00 00 00 00 00 00 00 00 df 81 24 06 99 99 99 99 99 99 df 81 25 06 99 99 99 99 99 99 df 81 26 06 00 00 00 00 50 00 df 32 0a 4d 61 73 74 65 72 43 61 72 64 df 1e 05 f4 50 84 80 0c df 1f 05 00 00 00 00 00 df 20 05 f4 50 84 80 0c 9f 1b 04 00 00 00 00 9f 1d 08 6c 72 80 00 00 00 00 00 e6 1d df 76 03 98 96 85 df 19 01 17 df 24 01 16 df 81 26 06 00 00 00 00 00 00 df 81 18 01 40 e6 15 df 76 03 98 96 85 df 19 01 18 df 24 01 16 9f 1b 04 00 00 00 00 e6 4b df 76 03 98 96 85 df 19 01 19 df 24 01 16 df 81 26 06 99 99 99 99 99 99 df 81 18 01 08 df 81 19 01 08 9f 33 03 e0 f8 00 df 1e 05 00 00 00 00 00 df 1f 05 ff ff ff ff ff df 20 05 00 00 00 00 00 9f 1d 08 6c 7a 80 00 00 00 00 00 e6 82 01 02 df 76 03 98 96 85 df 19 01 20 9f 01 06 00 00 00 00 05 25 df 1b 01 01 df 41 0a 4d 61 73 74 65 72 43 61 72 64 df 42 01 02 df 43 01 02 df 27 05 79 c2 20 f0 f0 df 28 02 f0 60 df 31 06 99 99 99 99 99 99 df 32 0a 4d 61 73 74 65 72 43 61 72 64 9f 33 03 e0 f0 48 df 4b 03 00 00 15 df 1e 05 fe 50 bc a0 00 df 1f 05 00 00 00 00 00 df 20 05 fe 50 bc f8 00 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 2c 07 f0 00 00 00 00 0f c0 df 2d 06 99 99 99 99 99 99 df 2e 06 00 00 00 00 01 00 df 30 34 cb 01 95 05 c5 01 ca 04 d0 01 df 34 02 d2 01 cc 10 89 06 cd 02 c4 02 9f 34 03 df 1b 01 9f 33 03 9f 40 05 9f 1a 02 9f 35 01 df 2a 06 df 41 10 9f 41 04 8a 02 9f 1b 04 00 00 00 00 e6 82 01 0c df 76 03 98 96 85 df 19 01 22 9f 01 06 00 00 00 00 05 25 df 1b 01 01 9f 40 05 60 00 f0 f0 00 df 41 04 56 49 53 41 df 27 05 79 c2 20 f0 f0 df 28 02 f0 60 df 42 01 02 df 43 01 02 df 1a 03 9f 37 04 df 4b 03 00 00 15 df 44 01 01 df 45 01 01 df 1c 01 00 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 2c 07 f0 00 00 00 00 0f c0 df 2d 06 99 99 99 99 99 99 df 2e 06 00 00 00 00 01 00 df 30 2e cb 01 95 05 c5 01 ca 04 d0 01 df 34 02 d2 01 cc 10 89 06 cd 02 c4 02 9f 34 03 df 1b 01 9f 33 03 9f 40 05 9f 1a 02 9f 35 01 9f 41 04 8a 02 df 32 04 56 49 53 41 df 1d 01 00 df 1e 05 dc 40 00 f8 00 df 1f 05 04 10 00 00 00 df 20 05 d8 40 04 f8 00 9f 33 03 e0 f0 c8 9f 1b 04 00 00 00 00 df 21 04 00 00 00 00 e6 25 df 76 03 98 96 85 df 19 01 23 df 24 01 22 df 41 05 56 20 50 41 59 df 32 04 56 49 53 41 df 44 01 00 df 45 01 00 e6 31 df 76 03 98 96 85 df 19 01 24 df 24 01 22 df 41 0d 56 49 53 41 20 65 6c 65 63 74 72 6f 6e df 42 01 01 df 43 01 03 df 32 04 56 49 53 41 df 1b 01 01 e6 0e df 76 03 98 96 00 df 19 01 25 df 24 01 22 e6 0e df 76 03 98 96 00 df 19 01 26 df 24 01 22 e6 0e df 76 03 98 96 00 df 19 01 27 df 24 01 22 e6 81 fe df 76 03 98 96 88 df 19 01 40 9f 01 06 00 00 00 00 05 25 df 1b 01 01 9f 40 05 70 00 f0 f0 00 df 41 08 67 69 72 6f 63 61 72 64 df 27 05 00 c0 00 f0 f0 df 28 02 80 00 df 42 01 01 df 1a 03 9f 37 04 df 4b 03 00 00 30 df 44 01 01 df 45 01 20 df 1c 01 00 9f 15 02 59 99 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 df 2c 07 f0 00 00 00 00 0f c0 df 30 2e cb 01 95 05 c5 01 ca 04 d0 01 df 34 02 d2 01 cc 10 89 06 cd 02 c4 02 9f 34 03 df 1b 01 9f 33 03 9f 40 05 9f 1a 02 9f 35 01 9f 41 04 8a 02 df 32 08 67 69 72 6f 63 61 72 64 df 1d 01 00 df 1e 05 fc 50 ac a0 00 df 1f 05 00 00 00 00 00 df 20 05 fc 50 ac f8 00 9f 33 03 60 50 48 9f 1b 04 ff ff ff ff df 21 04 00 00 00 00 e6 81 e4 df 76 03 98 96 88 df 19 01 41 9f 01 06 00 00 00 00 05 25 df 1b 01 01 df 41 08 67 69 72 6f 63 61 72 64 df 27 05 00 00 00 f0 f0 df 28 02 80 00 df 81 18 01 40 df 81 19 01 48 df 81 1b 01 b0 df 4b 03 00 00 15 9f 33 03 20 48 08 9f 15 02 59 99 9f 4e 1b 4c 41 56 45 47 4f 20 54 45 53 54 54 45 52 4d 49 4e 41 4c 53 20 4d 55 43 2c 44 45 9f 16 0f 31 30 32 30 30 33 36 31 31 20 20 20 20 20 20 df 81 24 06 99 99 99 99 99 99 df 81 25 06 99 99 99 99 99 99 df 81 26 06 00 00 00 00 50 01 df 32 08 67 69 72 6f 63 61 72 64 df 1e 05 fc 50 bc a0 0c df 1f 05 00 00 00 00 00 df 20 05 fc 50 bc f8 0c 9f 1b 04 ff ff ff ff df 81 1c 02 00 00 df 81 1d 01 00 df 81 34 02 00 0c df 81 35 02 00 0f df 81 36 02 00 c8 e6 24 df 76 03 98 96 88 df 19 01 42 df 24 01 41 df 81 26 06 00 00 00 00 00 00 df 81 19 01 40 9f 1b 04 00 00 00 00 e6 51 df 76 03 98 96 88 df 19 01 43 df 24 01 41 df 81 18 01 08 df 81 19 01 00 df 81 1f 01 00 df 81 1b 01 80 df 81 26 06 00 00 00 00 00 00 9f 33 03 20 08 08 9f 1b 04 00 00 00 00 df 1e 05 00 00 00 00 00 df 1f 05 ff ff ff ff ff df 20 05 00 00 00 00 00 e7 82 02 f1 df 76 03 98 96 88 bf 01 77 df 01 05 00 42 49 44 32 df 02 01 3f df 02 01 7f df 02 01 50 df 02 01 56 df 02 01 57 df 02 01 58 df 02 01 60 df 02 01 61 df 02 01 62 df 02 01 63 df 02 01 64 df 02 01 66 df 02 01 68 df 02 01 86 df 02 01 87 df 02 02 67 0f df 02 02 67 1f df 02 02 67 3f df 02 02 67 4f df 02 02 67 5f df 02 02 67 7f df 02 02 67 99 df 02 05 90 00 00 06 32 df 02 05 90 00 00 06 33 bf 01 81 9e df 01 05 00 42 49 44 33 df 02 01 51 df 02 01 52 df 02 01 53 df 02 01 54 df 02 01 55 df 02 02 50 01 df 02 02 58 54 df 02 03 36 01 96 df 02 03 56 30 77 df 02 03 56 65 73 df 02 03 56 66 21 df 02 03 56 69 20 df 02 03 56 69 41 df 02 03 56 77 53 df 02 03 57 72 58 df 02 03 58 92 96 df 02 03 28 94 37 df 02 03 58 94 60 df 02 03 58 97 18 df 02 03 60 10 66 df 02 03 60 18 80 df 02 03 61 04 24 df 02 03 61 04 60 df 02 03 62 81 33 df 02 03 91 41 00 df 02 03 91 88 38 df 02 03 98 83 88 bf 01 20 df 01 05 00 42 49 44 37 df 02 01 2f df 02 01 4f df 02 01 85 df 02 03 58 92 74 df 02 03 60 12 81 bf 01 10 df 01 05 00 42 49 44 38 df 02 01 34 df 02 01 37 bf 01 82 01 94 df 01 05 00 42 49 44 31 df 02 02 67 2f df 02 02 68 0f df 02 02 35 72 df 02 02 47 11 df 02 02 48 22 df 02 02 48 25 df 02 03 45 86 12 df 02 03 45 86 13 df 02 03 45 86 20 df 02 03 45 86 21 df 02 03 45 86 22 df 02 03 45 86 23 df 02 03 45 86 24 df 02 03 45 86 25 df 02 03 45 86 26 df 02 03 45 86 30 df 02 03 45 86 32 df 02 03 45 86 50 df 02 03 45 86 51 df 02 03 45 86 52 df 02 03 45 86 53 df 02 03 45 86 54 df 02 03 45 86 55 df 02 03 45 86 56 df 02 03 45 86 60 df 02 03 45 86 61 df 02 03 45 86 62 df 02 03 45 86 63 df 02 03 45 86 64 df 02 03 45 86 65 df 02 03 45 86 66 df 02 03 45 86 7f df 02 03 45 86 80 df 02 03 45 86 81 df 02 03 45 86 85 df 02 03 45 86 86 df 02 03 46 66 30 df 02 03 46 66 31 df 02 03 46 66 32 df 02 03 46 66 40 df 02 03 46 66 41 df 02 03 46 66 42 df 02 03 46 66 43 df 02 03 46 66 50 df 02 03 46 66 51 df 02 03 46 66 52 df 02 03 46 66 53 df 02 03 46 66 54 df 02 03 46 66 55 df 02 03 45 89 10 df 02 03 45 89 20 df 02 03 45 89 21 df 02 03 45 89 40 df 02 03 45 89 50 df 02 03 45 89 51 df 02 03 45 89 52 df 02 03 45 89 60 df 02 03 45 89 61 df 02 03 45 89 70 df 02 03 45 89 71 df 02 03 45 89 80 df 02 03 46 69 20 df 02 03 46 69 21 df 02 03 46 69 40 df 02 03 46 69 50 df 02 03 46 69 51 df 02 03 46 69 90 e8 7e df 76 03 98 96 88 bf 01 15 df 01 05 00 42 49 44 32 df 02 01 02 df 03 02 e0 00 df 04 01 01 bf 01 15 df 01 05 00 42 49 44 33 df 02 01 03 df 03 02 fc 08 df 04 01 01 bf 01 15 df 01 05 00 42 49 44 37 df 02 01 06 df 03 02 fc 08 df 04 01 01 bf 01 15 df 01 05 00 42 49 44 38 df 02 01 07 df 03 02 fc 00 df 04 01 01 bf 01 15 df 01 05 00 42 49 44 31 df 02 01 01 df 03 02 a0 00 df 04 01 01 e9 06 df 76 03 98 96 85 eb 81 cd df 76 03 98 96 88 bf 01 1a df 01 06 a0 00 00 00 25 01 df 02 01 04 df 03 0a 45 78 70 72 65 73 73 70 61 79 bf 01 18 df 01 07 a0 00 00 00 04 30 60 df 02 01 02 df 03 07 4d 61 65 73 74 72 6f bf 01 1b df 01 07 a0 00 00 00 04 10 10 df 02 01 02 df 03 0a 4d 61 73 74 65 72 43 61 72 64 bf 01 15 df 01 07 a0 00 00 00 03 10 10 df 02 01 03 df 03 04 56 49 53 41 bf 01 16 df 01 07 a0 00 00 00 03 20 20 df 02 01 03 df 03 05 56 20 50 41 59 bf 01 1e df 01 07 a0 00 00 00 03 20 10 df 02 01 03 df 03 0d 56 49 53 41 20 65 6c 65 63 74 72 6f 6e bf 01 1c df 01 0a a0 00 00 03 59 10 10 02 80 01 df 02 01 02 df 03 08 67 69 72 6f 63 61 72 64 ec 82 02 eb df 76 03 98 96 88 bf 01 13 df 01 07 a0 00 00 00 04 10 10 df 02 01 02 df 03 02 fd 88 bf 01 13 df 01 07 a0 00 00 00 04 30 60 df 02 01 02 df 03 02 fd 88 bf 01 41 df 01 07 a0 00 00 00 03 10 10 df 02 01 03 df 03 02 99 00 df 04 01 00 df 05 04 36 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 50 01 bf 01 41 df 01 07 a0 00 00 00 03 10 10 df 02 01 03 df 03 02 80 00 df 04 01 01 df 05 04 34 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 00 01 bf 01 41 df 01 07 a0 00 00 00 03 10 10 df 02 01 03 df 03 02 64 88 df 04 01 00 df 05 04 30 20 04 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 99 99 99 99 99 99 bf 01 41 df 01 07 a0 00 00 00 03 20 10 df 02 01 03 df 03 02 99 00 df 04 01 00 df 05 04 36 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 50 01 bf 01 41 df 01 07 a0 00 00 00 03 20 10 df 02 01 03 df 03 02 80 00 df 04 01 01 df 05 04 34 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 00 01 bf 01 41 df 01 07 a0 00 00 00 03 20 10 df 02 01 03 df 03 02 64 88 df 04 01 00 df 05 04 30 20 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 99 99 99 99 99 99 bf 01 41 df 01 07 a0 00 00 00 03 20 20 df 02 01 03 df 03 02 99 00 df 04 01 00 df 05 04 36 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 50 01 bf 01 41 df 01 07 a0 00 00 00 03 20 20 df 02 01 03 df 03 02 80 00 df 04 01 01 df 05 04 34 e0 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 00 01 bf 01 41 df 01 07 a0 00 00 00 03 20 20 df 02 01 03 df 03 02 64 88 df 04 01 00 df 05 04 30 20 40 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 99 99 99 99 99 99 bf 01 39 df 01 06 a0 00 00 00 25 01 df 02 01 04 df 03 02 80 00 df 04 01 00 df 06 01 00 df 07 01 00 df 08 06 99 99 99 99 99 99 df 09 06 00 00 00 00 00 00 df 0b 06 00 00 00 00 50 01 bf 01 16 df 01 0a a0 00 00 03 59 10 10 02 80 01 df 02 01 02 df 03 02 a0 00 ed 1b df 76 03 98 96 85 df 01 01 01 df 02 0a 41 63 71 75 69 72 65 72 30 31 df 03 01 01 ee 6d df 76 03 98 96 88 bf 01 25 df 01 07 a0 00 00 00 03 10 10 df 02 01 00 bf 02 14 df 01 07 a0 00 00 00 03 20 10 df 01 07 a0 00 00 00 03 20 20 bf 01 1b df 01 07 a0 00 00 00 03 20 20 df 02 01 00 bf 02 0a df 01 07 a0 00 00 00 03 20 10 bf 01 1e df 01 07 a0 00 00 03 59 10 10 df 02 01 00 bf 02 0d df 01 0a a0 00 00 03 59 10 10 02 80 01 f0 48 df 76 03 98 96 92 bf 01 12 df 01 01 11 df 02 07 a0 00 00 00 04 10 10 df 05 01 01 bf 01 12 df 01 01 11 df 02 07 a0 00 00 00 04 30 60 df 05 01 02 bf 01 15 df 01 01 11 df 02 0a a0 00 00 03 59 10 10 02 80 01 df 05 01 01 f1 30 df 76 03 98 96 92 bf 01 0a df 01 07 a0 00 00 00 04 10 10 bf 01 0a df 01 07 a0 00 00 00 04 30 60 bf 01 0d df 01 0a a0 00 00 03 59 10 10 02 80 01

void Zvt::tag_invoke(boost::json::value_from_tag value_from_tag, boost::json::value &value, Zvt::Tag &tag)
{
    cout << "value: " << value << endl;

    value = {
            {tag.tag_str(), tag.data_as_hex()}
    };
}

Zvt::Tag Zvt::tag_invoke(boost::json::value_to_tag<Zvt::Tag>, boost::json::value const &jv)
{
    boost::json::object const &obj = jv.as_object();

    for (auto &o: obj)
    {
        Zvt::Tag tag(Zvt::HexToByte(std::string(o.key_c_str())));

        if (o.value().is_object())
        {
            from_object(o.value().as_object(), tag);
        }
        else if (o.value().is_array())
        {
            std::cerr << "is array" << std::endl;
        }

        //cout << "\tTop : " << Utils::log_hex_str(tag.get()) << endl;
        return tag;
    }

    return Zvt::Tag(0x26);
}
