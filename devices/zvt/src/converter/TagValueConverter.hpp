//
// Created by André Heine on 16.08.21.
//

#ifndef ZVT_TAGVALUECONVERTER_HPP
#define ZVT_TAGVALUECONVERTER_HPP

#include <string>

class TagValueConverter
{
protected:
    TagValueConverter() {}

public:
    virtual ~TagValueConverter() {}

    virtual std::string map(const std::string tag_str) const = 0;
};


#endif //ZVT_TAGVALUECONVERTER_HPP
