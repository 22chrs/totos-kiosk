//
// Created by André Heine on 31.05.22.
//

#ifndef ZVT_DISPLAYTEXT_HPP
#define ZVT_DISPLAYTEXT_HPP

#include <Apdu.hpp>
#include <string>
#include <vector>

namespace Cmd
{

class DisplayText
        : public Zvt::Apdu
{
private:
    unsigned char _duration;
    std::string _line1;
    std::string _line2;
    std::string _line3;
    std::string _line4;
    std::string _line5;

public:
    DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3, const std::string line4, const std::string line5);
    DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3, const std::string line4);
    DisplayText(const unsigned char duration, const std::string line1, const std::string line2, const std::string line3);
    DisplayText(const unsigned char duration, const std::string line1, const std::string line2);
    DisplayText(const unsigned char duration, const std::string line1);
    virtual ~DisplayText();

};

}
#endif //ZVT_DISPLAYTEXT_HPP
