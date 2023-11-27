/*
 * Apdu0600.cpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#include <cmds/FeigRegister.hpp>

/*
0600
 63
 528346
 DE
 0978
 0300
 0659
 10021602
 1201401A02100026280A02040F0A02060F0A02061E0A0204FF0A0206D80A0206DB0A0206D90A0206DA0A0206DD0A0206D327031401012810150244451502454E15024652150249544002C0001F0402F1001F050100
0600 Login
Password: 528346
Config Byte: DE
CC: 0978
03 (Service Byte): 00
06 (TLV Container):
   Tag(10):1602
   Tag(12):40
   Tag(1A):1000
   Tag(26):
      Tag(0A):040F
      Tag(0A):060F
      Tag(0A):061E
      Tag(0A):04FF
      Tag(0A):06D8
      Tag(0A):06DB
      Tag(0A):06D9
      Tag(0A):06DA
      Tag(0A):06DD
      Tag(0A):06D3
   Tag(27):
      Tag(14):01
   Tag(28):
      Tag(15):4445 (DE)
      Tag(15):454E (EN)
      Tag(15):4652 (FR)
      Tag(15):4954 (IT)
   Tag(40):C000
   Tag(1F04):F100
   Tag(1F05):00


Receive (2021-06-14 14:36:04.994):
800000
ACK. OK
Error Code: 00


Receive (2021-06-14 14:36:05.166):
060F111910295250013349097806052703140101
060F Completion Command
19 (Payment Type): 10
29 (TID): 52500133
49 (CC): 0978
06 (TLV Container): 2703140101
   Tag(27):
      Tag(14):01


Send (2021-06-14 14:36:05.166):
800000
ACK. OK
Error Code: 00
 */
Cmd::FeigRegister::FeigRegister()
        :
        Zvt::Apdu(0x06, 0x00)
        , _password("528346")
        , _config_byte(0x9e)
        , _currency_code({0x09, 0x78})
        , _service_byte(0x00)
        , _bmp03(
        Zvt::Bmp(Zvt::One_Byte_Binary, {0x03, this->service_byte()}))
        , tlv_container(Zvt::Tlv())
{
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
    //Tag(1A):1000
    tlv_container.add(Zvt::Tag(0x1a, {0x10, 0x00}));
    //Tag(26):
    //    Tag(0A):040F
    //    Tag(0A):060F
    //    Tag(0A):061E
    //    Tag(0A):04FF
    //    Tag(0A):06D8
    //    Tag(0A):06DB
    //    Tag(0A):06D9
    //    Tag(0A):06DA
    //    Tag(0A):06DD
    //    Tag(0A):06D3
    tlv_container.add(Zvt::Tag(0x26, {0x0a, 0x02, 0x04, 0x0f, 0x0a, 0x02, 0x06, 0x0f, 0x0a, 0x02, 0x06, 0x1e, 0x0a, 0x02, 0x04, 0xff, 0x0a, 0x02, 0x06, 0xd8, 0x0a, 0x02, 0x06,
                                      0xdb, 0x0a, 0x02, 0x06, 0xd9, 0x0a, 0x02, 0x06, 0xda, 0x0a, 0x02, 0x06, 0xdd, 0x0a, 0x02, 0x06, 0xd3}));
    //Tag(27):
    //  Tag(14):01
    tlv_container.add(Zvt::Tag(0x27, {0x14, 0x01, 0xfe}));
    //Tag(28):
    //    Tag(15):4445 (DE)
    //    Tag(15):454E (EN)
    //    Tag(15):4652 (FR)
    //    Tag(15):4954 (IT)
    tlv_container.add(Zvt::Tag(0x28, {0x15, 0x02, 0x44, 0x45, 0x15, 0x02, 0x45, 0x4e, 0x15, 0x02, 0x46, 0x52, 0x15, 0x02, 0x49, 0x55}));
    //Tag(40):C000
    tlv_container.add(Zvt::Tag(0x40, {0xc0, 0x00}));
    //Tag(1F04):F100
    tlv_container.add(Zvt::Tag(0x1f, 0x04, {0xf1, 0x00}));
    //Tag(1F05):00
    tlv_container.add(Zvt::Tag(0x1f, 0x05, {0x00}));

    this->addBmp(this->tlv_container.all());
}

Cmd::FeigRegister::~FeigRegister()
{
}

