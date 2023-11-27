//
// Created by André Heine on 31.05.22.
//

#include "DisplayText.hpp"

Cmd::DisplayText::DisplayText(const unsigned char duration, const std::string line1)
        : DisplayText(duration, line1, std::string(), std::string(), std::string(), std::string())
{}

Cmd::DisplayText::DisplayText(const unsigned char duration, const std::string line1, const std::string line2)
        : DisplayText(duration, line1, line2, std::string(), std::string(), std::string())
{}

Cmd::DisplayText::DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3)
        : DisplayText(duration, line1, line2, line3, std::string(), std::string())
{}

Cmd::DisplayText::DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3, const std::string line4)
        : DisplayText(duration, line1, line2, line3, line4, std::string())
{}

Cmd::DisplayText::DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3, const std::string line4, const std::string line5)
        : Apdu(0x06, 0xE0)
          , _duration(duration)
          , _line1(line1)
          , _line2(line2)
          , _line3(line3)
          , _line4(line4)
          , _line5(line5)
{
    this->addBmp(Zvt::Bmp(0xF0,duration));

    if(!line1.empty())
        this->addBmp(Utils::stringToHexAsLLVar("F1", line1));
    if(!line2.empty())
        this->addBmp(Utils::stringToHexAsLLVar("F2", line2));
    if(!line3.empty())
        this->addBmp(Utils::stringToHexAsLLVar("F3", line3));
    if(!line4.empty())
        this->addBmp(Utils::stringToHexAsLLVar("F4", line4));
    if(!line5.empty())
        this->addBmp(Utils::stringToHexAsLLVar("F5", line5));
}


Cmd::DisplayText::~DisplayText()
{

}