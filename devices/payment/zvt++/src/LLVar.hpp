//
// Created by André Heine on 03.09.23.
//

#ifndef ZVT_LLVAR_HPP
#define ZVT_LLVAR_HPP

#include <vector>

#include <Utils.hpp>

namespace LLVar
{

inline static std::vector<unsigned char> copyRange(std::vector<unsigned char> data, int from, int to)
{
    std::vector<unsigned char> range_vector;

    if (from >= 0 && from < data.size() && to >= 0 && to < data.size())
    {
        for (int idx = from; idx <= to; ++idx)
        {
            range_vector.push_back(data[idx]);
        }
    }
    else
    {
        std::cerr << "Error copy sub-vector with args from=" << from << ", to=" << to << ", data.size=" << data.size() << std::endl;
        Utils::log("Error: ", data);
    }

    return range_vector;
}

/**
 * We did not know the data length of the llvar/lllvar.
 *
 * Give Zvt::llvar_data()/Zvt::lllvar_data() the complete rest of the tag/bmp.
 *
 * The method return a vector only with the data. IF the length is reached the method returns immediately...
 */
inline static vector<unsigned char> llvar_data(vector<unsigned char> data)
{
    if (data.size() > 1)
    {
        stringstream ss;
        bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return copyRange(data, 2, stoi(ss.str()) + 2 - 1);
    }

    return vector<unsigned char>();
}

/**
 * We did not know the data length of the llvar/lllvar.
 *
 * Give Zvt::llvar_data()/Zvt::lllvar_data() the complete rest of the tag/bmp.
 *
 * The methode return a vector only wth the data. IF the length is reached the method returns immediately...
 */
inline static int llvar_length(vector<unsigned char> data)
{
    if (data.size() > 1)
    {
        stringstream ss;
        bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return stoi(ss.str());
    }

    return 0;
}

inline vector<unsigned char> lllvar_data(vector<unsigned char> data)
{
    if (data.size() > 2)
    {
        stringstream ss;
        bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[2]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return copyRange(data, 3, stoi(ss.str()) + 3 - 1);
    }

    return vector<unsigned char>();
}

inline int lllvar_length(vector<unsigned char> data)
{
    if (data.size() > 2)
    {
        stringstream ss;
        bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = bitset<8>(data[2]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return stoi(ss.str());
    }

    return 0;
}

}
#endif //ZVT_LLVAR_HPP
