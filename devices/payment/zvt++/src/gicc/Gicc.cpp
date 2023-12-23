//
// Created by André Heine on 01.09.23.
//

#include "Gicc.hpp"
#include <Utils.hpp>
#include <LLVar.hpp>

Gicc::GICC::GICC(const Gicc::UCharVec &data)
        : _data(data)
          , _mti("")
          , _bmp_set(0LL)
{

}

void Gicc::GICC::parse()
{
    Utils::log("***** **** *** ** ", "*** **** *****");
    Utils::log("RAW data  : ", this->data());

    int offset = 0;

    //min length
    if (this->data().size() > 10)
    {
        mti(Utils::hex_str_short({this->data().begin(), this->data().begin() + 2}));

        for (int idx = 0; idx < bitfields().size(); ++idx)
        {
            _bmp_set <<= 8;
            _bmp_set |= bitfields()[idx];
        }

        Utils::log("BMPs      : ", _bmp_set.to_string());

        offset = 10;

        if (this->data().size() > 20 && _bmp_set.test(63))
        {
            for (int idx = 0; idx < bitfields_extended().size(); ++idx)
            {
                _bmp_set <<= 8;
                _bmp_set |= bitfields_extended()[idx];
            }
            offset = 18;
        }
        else _bmp_set <<= 64;

        Utils::log("          : ", _bmp_set.to_string());
        Utils::log("          : |--------------------------------------------------------------||--------------------------------------------------------------|");
        Utils::log("***** **** *** ** ", "*** **** *****");

        if (has_bmp(BMP_1))
        {
            Utils::log("          : ", bitfields_extended());
        }

        if (has_bmp(BMP_2))
        {
            UCharVec var = LLVar::llvar_data({this->data().begin() + offset, this->data().end()});

            Utils::log("BMP   2   : ", var);
        }
    }
}



bool Gicc::GICC::has_bmp(Gicc::BMP bmp)
{
    return _bmp_set.test(128 - bmp);
}

void Gicc::GICC::debug(bool print_missing)
{


    Utils::log("-----------", "----------------------------------------------------------------");

    Utils::log("MTI       : ", mti());
    Utils::log("Bitfields : ", bitfields());
    Utils::log("BMPs      : ", _bmp_set.to_string());

    Utils::log("-----------", "----------------------------------------------------------------");

    /*
    for (int bmp = 1; bmp < 129; ++bmp)
    {
        std::string num = std::to_string(bmp);
        std::string name = (bmp < 10 ? ".." + num : (bmp < 100 ? "." + num : num)) + ": ";

        if (has_bmp(static_cast<BMP>(bmp)))
        {
            Utils::log(name, "");
        }
        else if (print_missing)
        {
            Utils::log(name, "---");
        }
    }
    */
}
