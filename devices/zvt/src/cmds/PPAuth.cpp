//
// Created by André Heine on 14.01.21.
//

#include "PPAuth.hpp"

Cmd::PPAuth::PPAuth()
        : tag1F62(0x1f, 0x62, {0x50, 0x50})
          , tag1F63(0x1f, 0x63)
          , tlv(Zvt::Tlv())
{
    tlv.add(tag1F62);
    tlv.add(tag1F63);
    this->addBmp(tlv.all());
}

Cmd::PPAuth::PPAuth(const unsigned long amount, const std::vector<unsigned char> data1f63)
        : Auth(amount)
          , tag1F62(0x1f, 0x62, {0x50, 0x50})
          , tag1F63(0x1f, 0x63, data1f63)
          , tlv(Zvt::Tlv())
{
    tlv.add(tag1F62);
    tlv.add(tag1F63);
    this->addBmp(tlv.all());
}


Cmd::PPAuth::PPAuth(const unsigned long amount, const unsigned char payment_type,
                    const vector<unsigned char> data1F63)
        : Auth(amount, payment_type)
          , tag1F62(0x1f, 0x62, {0x50, 0x50})
          , tag1F63(0x1f, 0x63, data1F63)
          , tlv(Zvt::Tlv())
{
    tlv.add(tag1F62);
    tlv.add(tag1F63);
    this->addBmp(tlv.all());
}

Cmd::PPAuth::PPAuth(const Cmd::PPAuth &other)
        : Auth(other)
          , tag1F62(other.getTag1F62())
          , tag1F63(other.getTag1F63())
          , tlv(other.getTlv())
{
    this->addBmp(tlv.all());
}

Cmd::PPAuth::~PPAuth()
{

}

const Zvt::Tag &Cmd::PPAuth::getTag1F62() const
{
    return tag1F62;
}

void Cmd::PPAuth::setTag1F62(const Zvt::Tag &tag)
{
    PPAuth::tag1F62 = tag;
}

const Zvt::Tag &Cmd::PPAuth::getTag1F63() const
{
    return tag1F63;
}

void Cmd::PPAuth::setTag1F63(const Zvt::Tag &tag)
{
    PPAuth::tag1F63 = tag;
}

const Zvt::Tlv &Cmd::PPAuth::getTlv() const
{
    return tlv;
}

void Cmd::PPAuth::setTlv(const Zvt::Tlv &tlv_container)
{
    PPAuth::tlv = tlv_container;
}
