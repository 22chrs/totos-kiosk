/*
 * Apdu0600.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/Register.hpp>

//default register 0600 settings
Cmd::Register::Register()
        :
        Zvt::Apdu(0x06, 0x00)
        , _password("010203")
        , _config_byte(0x9e)
        , _currency_code({0x09, 0x78})
        , _service_byte(0x03)
        , _bmp03(
        Zvt::Bmp(Zvt::One_Byte_Binary, {0x03, this->service_byte()}))
        , tlv_container(Zvt::Tlv())
{
    this->flow(Zvt::CMD_0600);
    this->addBmp(Zvt::HexToByte(_password));
    this->addBmp(static_cast<unsigned char>(_config_byte.to_ulong()));
    this->addBmp(_currency_code);

    // std::vector<unsigned char> data03;
    // data03.push_back(_service_byte.to_ulong());
    // _bmp03.set(data03);
    // this->addBmp(_bmp03);

    //Tag(10):1602
    tlv_container.add(Zvt::Tag(0x10, {0x20, 0x04}));
    //Tag(12):40
    tlv_container.add(Zvt::Tag(0x12, 0x40));
    // produce a failure 849a
    // this->addBmp({0x03,0x03,0x01});
    tlv_container.add(Zvt::Tag(0x27, {0x14, 0x01, 0xfe}));
    tlv_container.add(Zvt::Tag(0x40, {0xb0, 0xb0}));

    this->addBmp(this->tlv_container.all());
}

Cmd::Register::Register(unsigned char config)
        :
        Zvt::Apdu(0x06, 0x00)
        , _password("010203")
        , _config_byte(config)
        , _currency_code({0x09, 0x78})
        , _service_byte(0x3)
        , _bmp03(
        Zvt::Bmp(Zvt::One_Byte_Binary, {0x03, this->service_byte()}))
        , tlv_container(Zvt::Tlv())
{
    this->flow(Zvt::CMD_0600);
    this->addBmp(Zvt::HexToByte(_password));
    this->addBmp(static_cast<unsigned char>(_config_byte.to_ulong()));
    this->addBmp(_currency_code);

    // std::vector<unsigned char> data03;
    // data03.push_back(_service_byte.to_ulong());
    // _bmp03.set(data03);
    // this->addBmp(_bmp03);

    // produce a failure 849a
    // this->addBmp({0x03,0x03,0x01});

    //Tag(10):1602
    tlv_container.add(Zvt::Tag(0x10, {0x20, 0x04}));
    //Tag(12):40
    tlv_container.add(Zvt::Tag(0x12, 0x40));
    tlv_container.add(Zvt::Tag(0x27, {0x14, 0x01, 0xfe}));
    tlv_container.add(Zvt::Tag(0x40, {0xb0, 0xb0}));

    this->addBmp(this->tlv_container.all());
}

Cmd::Register::Register(unsigned char config, std::string password)
        :
        Zvt::Apdu(0x06, 0x00)
        , _password(password)
        , _config_byte(config)
        , _currency_code({0x09, 0x78})
        , _service_byte(0x3)
        , _bmp03(
        Zvt::Bmp(Zvt::One_Byte_Binary, {0x03, this->service_byte()}))
        , tlv_container(Zvt::Tlv())
{
    this->flow(Zvt::CMD_0600);
    this->addBmp(Zvt::HexToByte(_password));
    this->addBmp(static_cast<unsigned char>(_config_byte.to_ulong()));
    this->addBmp(_currency_code);

    // std::vector<unsigned char> data03;
    // data03.push_back(_service_byte.to_ulong());
    // _bmp03.set(data03);
    // this->addBmp(_bmp03);

    // produce a failure 849a
    // this->addBmp({0x03,0x03,0x01});

    //Tag(10):1602
    tlv_container.add(Zvt::Tag(0x10, {0x20, 0x04}));
    //Tag(12):40
    tlv_container.add(Zvt::Tag(0x12, 0x40));
    tlv_container.add(Zvt::Tag(0x27, {0x14, 0x01, 0xfe}));
    //tlv_container.add(Zvt::Tag(0x40, {0xb0, 0xb0}));
    tlv_container.add(Zvt::Tag(0x40, {0xff, 0xff}));
    // TEST
    tlv_container.add(Zvt::Tag(0x1f, 0x05, {0x80}));
    this->addBmp(this->tlv_container.all());
}

Cmd::Register::Register(const std::string password, unsigned char config, std::vector<unsigned char> currency_code, unsigned char service, Zvt::Tlv tlv)
        :
        Zvt::Apdu(0x06, 0x00)
        , _password(password)
        , _config_byte(config)
        , _currency_code(currency_code.begin(), currency_code.end())
        , _service_byte(service)
        , _bmp03(Zvt::Bmp(Zvt::Bmp(Zvt::One_Byte_Binary, {0x03, this->service_byte()})))
        , tlv_container(tlv)
{
    this->flow(Zvt::CMD_0600);
    this->addBmp(Zvt::HexToByte(password));
    this->addBmp(_config_byte.to_ulong());
    this->addBmp(currency_code.data(), currency_code.size());

    //std::vector<unsigned char> data03;
    //data03.push_back(_service_byte.to_ulong());
    //_bmp03.set(data03);
    this->addBmp(_bmp03);

    //Tag(10):1602
    tlv_container.add(Zvt::Tag(0x10, {0x20, 0x04}));
    //Tag(12):40
    tlv_container.add(Zvt::Tag(0x12, 0x40));
    tlv_container.add(Zvt::Tag(0x27, {0x14, 0x01, 0xfe}));
    tlv_container.add(Zvt::Tag(0x40, {0xb0, 0xb0}));

    this->addBmp(this->tlv_container.all());
}

Cmd::Register::~Register()
{
}

