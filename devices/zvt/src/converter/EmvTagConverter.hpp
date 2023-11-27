//
// Created by André Heine on 16.08.21.
//

#ifndef ZVT_EMVTAGCONVERTER_HPP
#define ZVT_EMVTAGCONVERTER_HPP

#include <converter/TagValueConverter.hpp>

class EmvTagConverter
        : public TagValueConverter
{
public:
    EmvTagConverter()
            : TagValueConverter()
    {}

    ~EmvTagConverter()
    {}

    std::string map(const std::string) const;
};


#endif //ZVT_EMVTAGCONVERTER_HPP
