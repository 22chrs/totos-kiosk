//
// Created by André Heine on 19.11.21.
//

#ifndef ZVT_PRINTLINE_HPP
#define ZVT_PRINTLINE_HPP

#include <Apdu.hpp>

namespace Cmd
{

class PrintLine
        : public Zvt::Apdu
{
private:
    std::bitset<8> _attribute;
    int _value;
    std::string _text;

public:
    PrintLine();
    PrintLine(const std::vector<unsigned char> data);
    PrintLine(const PrintLine &other);
    virtual ~PrintLine();

    std::vector<Zvt::Bmp> parse(void);
    void print(void);
    void write_to_cwd(void);

    std::bitset<8> attribute()
    { return this->_attribute; }

    void attribute(unsigned char attr)
    { this->_attribute = std::bitset<8>(attr); }

    int value()
    { return this->_value; }

    void value(unsigned char val)
    { this->_value = val; }

    void value(std::bitset<8> attr)
    {
        std::bitset<4> bs;

        bs.set(0, attr.test(0));
        bs.set(1, attr.test(1));
        bs.set(2, attr.test(2));
        bs.set(3, attr.test(3));

        this->_value = bs.to_ulong();
    }

    std::string text() const
    { return this->_text; }

    void text(const std::string &txt)
    { this->_text = txt; }

    void text(const std::vector<unsigned char> vec)
    { this->_text = std::string(vec.begin(), vec.end()); }

    bool isText()
    { return !attribute().test(7) && !attribute().test(6) && !attribute().test(5) && !attribute().test(4); }

    bool isLinefeed()
    { return attribute() == 0xFF; }

    bool isCentred()
    { return !attribute().test(7) && attribute().test(6); }

    bool isWidth()
    { return !attribute().test(7) && attribute().test(5); }

    bool isHeight()
    { return !attribute().test(7) && attribute().test(4); }

    bool isLastLine()
    { return attribute().test(7) && attribute().test(0) && attribute() != 0x80; }
};

}

#endif //ZVT_PRINTLINE_HPP
