//
// Created by André Heine on 14.01.21.
//

#ifndef ZVT_PPAUTH_HPP
#define ZVT_PPAUTH_HPP

#include <Bmp.hpp>
#include <Tlv.hpp>
#include <Tag.hpp>

#include <sstream>
#include <string>
#include <iomanip>
#include <vector>

#include "Auth.hpp"

namespace Cmd
{

class PPAuth
        : public Auth
{
private:
    Zvt::Tag tag1F62;
    Zvt::Tag tag1F63;
    Zvt::Tlv tlv;

public:
    PPAuth();
    PPAuth(const unsigned long amount, const std::vector<unsigned char> data1F63);
    PPAuth(const unsigned long amount, const unsigned char payment_type, const std::vector<unsigned char> data1F63);
    PPAuth(const PPAuth &other);

    virtual ~PPAuth();

    const Zvt::Tag &getTag1F62() const;
    void setTag1F62(const Zvt::Tag &tag);
    const Zvt::Tag &getTag1F63() const;

    void setTag1F63(const Zvt::Tag &tag);
    const Zvt::Tlv &getTlv() const;
    void setTlv(const Zvt::Tlv &tlv_container);
};
}

#endif //ZVT_PPAUTH_HPP
