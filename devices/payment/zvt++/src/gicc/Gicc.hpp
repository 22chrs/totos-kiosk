//
// Created by André Heine on 01.09.23.
//

#ifndef ZVT_GICC_HPP
#define ZVT_GICC_HPP

#include <vector>
#include <string>
#include <bitset>

/**
 * GICC v5.9 (based on iso 8583 1987)
 */
namespace Gicc
{

typedef enum BMP
{
    BMP_Unknown = 0,
    BMP_1 = 1,
    BMP_2 = 2,
    BMP_3 = 3,
    BMP_4 = 4,
    BMP_5 = 5,
    BMP_6 = 6,
    BMP_7 = 7,
    BMP_8 = 8,
    BMP_9 = 9,
    BMP_10 = 10,
    BMP_11 = 11,
    BMP_12 = 12,
    BMP_13 = 13,
    BMP_14 = 14,
    BMP_15 = 15,
    BMP_16 = 16,
    BMP_17 = 17,
    BMP_18 = 18,
    BMP_19 = 19,
    BMP_20 = 20,
    BMP_21 = 21,
    BMP_22 = 22,
    BMP_23 = 23,
    BMP_24 = 24,
    BMP_25 = 25,
    BMP_26 = 26,
    BMP_27 = 27,
    BMP_28 = 28,
    BMP_29 = 29,
    BMP_30 = 30,
    BMP_31 = 31,
    BMP_32 = 32,
    BMP_33 = 33,
    BMP_34 = 34,
    BMP_35 = 35,
    BMP_36 = 36,
    BMP_37 = 37,
    BMP_38 = 38,
    BMP_39 = 39,
    BMP_40 = 40,
    BMP_41 = 41,
    BMP_42 = 42,
    BMP_43 = 43,
    BMP_44 = 44,
    BMP_45 = 45,
    BMP_46 = 46,
    BMP_47 = 47,
    BMP_48 = 48,
    BMP_49 = 49,
    BMP_50 = 50,
    BMP_51 = 51,
    BMP_52 = 52,
    BMP_53 = 53,
    BMP_54 = 54,
    BMP_55 = 55,
    BMP_56 = 56,
    BMP_57 = 57,
    BMP_58 = 58,
    BMP_59 = 59,
    BMP_60 = 60,
    BMP_61 = 61,
    BMP_62 = 62,
    BMP_63 = 63,
    BMP_64 = 64,
    BMP_65 = 65,
    BMP_66 = 66,
    BMP_67 = 67,
    BMP_68 = 68,
    BMP_69 = 69,
    BMP_70 = 70,
    BMP_71 = 71,
    BMP_72 = 72,
    BMP_73 = 73,
    BMP_74 = 74,
    BMP_75 = 75,
    BMP_76 = 76,
    BMP_77 = 77,
    BMP_78 = 78,
    BMP_79 = 79,
    BMP_80 = 80,
    BMP_81 = 81,
    BMP_82 = 82,
    BMP_83 = 83,
    BMP_84 = 84,
    BMP_85 = 85,
    BMP_86 = 86,
    BMP_87 = 87,
    BMP_88 = 88,
    BMP_89 = 89,
    BMP_90 = 90,
    BMP_91 = 91,
    BMP_92 = 92,
    BMP_93 = 93,
    BMP_94 = 94,
    BMP_95 = 95,
    BMP_96 = 96,
    BMP_97 = 97,
    BMP_98 = 98,
    BMP_99 = 99,
    BMP_100 = 100,
    BMP_101 = 101,
    BMP_102 = 102,
    BMP_103 = 103,
    BMP_104 = 104,
    BMP_105 = 105,
    BMP_106 = 106,
    BMP_107 = 107,
    BMP_108 = 108,
    BMP_109 = 109,
    BMP_110 = 110,
    BMP_111 = 111,
    BMP_112 = 112,
    BMP_113 = 113,
    BMP_114 = 114,
    BMP_115 = 115,
    BMP_116 = 116,
    BMP_117 = 117,
    BMP_118 = 118,
    BMP_119 = 119,
    BMP_120 = 120,
    BMP_121 = 121,
    BMP_122 = 122,
    BMP_123 = 123,
    BMP_124 = 124,
    BMP_125 = 125,
    BMP_126 = 126,
    BMP_127 = 127,
    BMP_128 = 128
} BMP;

typedef std::vector<unsigned char> UCharVec;

class GICC
{
private:
    UCharVec _data;
    std::string _mti;

    std::bitset<128> _bmp_set;

public:
    explicit GICC(const UCharVec &data);

    void parse();
    bool has_bmp(Gicc::BMP);
    void debug(bool print_missing=false);

    //inline
    UCharVec bitfields()
    { return {this->data().begin() + 2, this->data().begin() + 10}; }

    UCharVec bitfields_extended()
    { return {this->data().begin() + 10, this->data().begin() + 18}; }

    const UCharVec &data() const
    { return _data; }

    void data(const UCharVec &data)
    { _data = data; }

    const std::string &mti() const
    { return _mti; }

    void mti(const std::string &mti)
    { _mti = mti; }
};

}
#endif //ZVT_GICC_HPP
