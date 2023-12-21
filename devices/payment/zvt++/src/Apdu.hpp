/*
 * Apdu.hpp
 *
 *  Created on: 29.10.2020
 *      Author: ah
 */

#ifndef APDU_HPP_
#define APDU_HPP_

#include <vector>
#include <array>

#include "HexToByte.hpp"
#include "Bmp.hpp"
#include "Utils.hpp"

namespace Zvt
{

typedef enum Command
{
    CMD_UNKNOWN,
    CMD_0401,
    CMD_040D,
    CMD_040E,
    CMD_040F,
    CMD_04FF,
    CMD_0501,
    CMD_0600,
    CMD_0601,
    CMD_0602,
    CMD_0603,
    CMD_0604,
    CMD_0605,
    CMD_0609,
    CMD_060A,
    CMD_060B,
    CMD_060C,
    CMD_060F,
    CMD_0610,
    CMD_0611,
    CMD_0612,
    CMD_0618,
    CMD_061A,
    CMD_061B,
    CMD_061E,
    CMD_0620,
    CMD_0621,
    CMD_0622,
    CMD_0623,
    CMD_0624,
    CMD_0625,
    CMD_0626,
    CMD_0630,
    CMD_0631,
    CMD_0650,
    CMD_0651,
    CMD_0670,
    CMD_0679,
    CMD_0682,
    CMD_0685,
    CMD_0686,
    CMD_0687,
    CMD_0688,
    CMD_0690,
    CMD_0691,
    CMD_0693,
    CMD_0695,
    CMD_06B0,
    CMD_06C0,
    CMD_06C1,
    CMD_06C2,
    CMD_06C3,
    CMD_06C4,
    CMD_06C5,
    CMD_06C6,
    CMD_06CE,
    CMD_06D1,
    CMD_06D3,
    CMD_06D4,
    CMD_06D8,
    CMD_06D9,
    CMD_06DA,
    CMD_06DB,
    CMD_06DD,
    CMD_06E0,
    CMD_06E1,
    CMD_06E2,
    CMD_06E3,
    CMD_06E4,
    CMD_06E5,
    CMD_06E6,
    CMD_06E8,
    CMD_06E9,
    CMD_0801,
    CMD_0802,
    CMD_0810,
    CMD_0811,
    CMD_0812,
    CMD_0813,
    CMD_0820,
    CMD_0821,
    CMD_0822,
    CMD_0823,
    CMD_0824,
    CMD_0830,
    CMD_0840,
    CMD_0850,
    CMD_8000,
    CMD_8400,
    CMD_849A,
    CMD_84xx,
    CMD_849C,
    CMD_END_LOOP,
    CMD_CTLS_START_WAITING,
    CMD_CTLS_WAITING,
    CMD_CTLS_CARD_PRESENT,
    CMD_CTLS_CARD_PREAUTH_COMPLETION,
    CMD_CTLS_CARD_PREAUTH_ABORT,
    CMD_CTLS_CARD_PREAUTH_STATUS,
    CMD_CTLS_CARD_BOOK_TOTAL_COMPLETION,
    CMD_CTLS_CARD_BOOK_TOTAL_ABORT
} Command;

typedef enum LengthFormat
{
    ONE = 0x01, THREE = 0x03
} LengthFormat;

/*
 * Terminal Status Codes
 * Error-ID Status- (hexa- Code decimal) (decimal)
 *
 */
typedef enum TerminalStatusCode
{
    TSC_00 = 0x00,  // dec -> 00 	PT ready
    TSC_51 = 0x51,  // dec -> 81 Initialisation required
    TSC_62 = 0x62,  // dec -> 98 Date/time incorrect
    TSC_9C = 0x9c,  // dec -> 156 Please wait (e.g. software-update still running)
    TSC_9D = 0x9d,  // dec -> 157 Partial issue of goods
    TSC_B1 = 0xb1,  // dec -> 177 Memory full
    TSC_B2 = 0xb2,  // dec -> 178 Merchant-journal full
    TSC_BF = 0xbf,  // dec -> 191 Voltage supply too low (external power supply)
    TSC_C0 = 0xc0,  // dec -> 192 Card locking mechanism defect
    TSC_C1 = 0xc1,  // dec -> 193 Merchant card locked
    TSC_C2 = 0xc2,  // dec -> 194 Diagnosis required
    TSC_C4 = 0xc4,  // dec -> 196 Card-profile invalid. New card-profiles must be loaded
    TSC_CC = 0xcc,  // dec -> 204 Printer not ready
    TSC_DC = 0xdc,  // dec -> 220 Card inserted
    TSC_DF = 0xdf,  // dec -> 223 Out-of-order
    TSC_E0 = 0xe0,  // dec -> 224 Remote-maintenance activated
    TSC_E1 = 0xe1,  // dec -> 225 Card not completely removed
    TSC_E2 = 0xe2,  // dec -> 226 Card-reader does not answer / card-reader defective
    TSC_E3 = 0xe3,  // dec -> 227 Shutter closed
    TSC_E4 = 0xe4,  // dec -> 228 Terminal activation required
    TSC_F0 = 0xf0,  // dec -> 240 Reconciliation required
    TSC_F6 = 0xf6,  // dec -> 246 OPT-data not available (= OPT-Personalisation required)
    TSC_Unknown = 0xff
} TerminalStatusCode;

typedef enum RecoveryActions
{
// todo
} RecoveryActions;

typedef enum DiagnosisType
{
    LineDiagnosis = 0x01,
    ExtendedDiagnosis = 0x02,
    Configuration = 0x03,
    EmvConfiguration = 0x04,
    Ep2Configuration = 0x05
} DiagnosisType;

inline static TerminalStatusCode statusCode(unsigned char status)
{
    switch (status)
    {
        case Zvt::TSC_00:
            return Zvt::TSC_00;
        case Zvt::TSC_51:
            return Zvt::TSC_51;
        case Zvt::TSC_62:
            return Zvt::TSC_62;
        case Zvt::TSC_9C:
            return Zvt::TSC_9C;
        case Zvt::TSC_9D:
            return Zvt::TSC_9D;
        case Zvt::TSC_B1:
            return Zvt::TSC_B1;
        case Zvt::TSC_B2:
            return Zvt::TSC_B2;
        case Zvt::TSC_BF:
            return Zvt::TSC_BF;
        case Zvt::TSC_C0:
            return Zvt::TSC_C0;
        case Zvt::TSC_C1:
            return Zvt::TSC_C1;
        case Zvt::TSC_C2:
            return Zvt::TSC_C2;
        case Zvt::TSC_C4:
            return Zvt::TSC_C4;
        case Zvt::TSC_CC:
            return Zvt::TSC_CC;
        case Zvt::TSC_DC:
            return Zvt::TSC_DC;
        case Zvt::TSC_DF:
            return Zvt::TSC_DF;
        case Zvt::TSC_E0:
            return Zvt::TSC_E0;
        case Zvt::TSC_E1:
            return Zvt::TSC_E1;
        case Zvt::TSC_E2:
            return Zvt::TSC_E2;
        case Zvt::TSC_E3:
            return Zvt::TSC_E3;
        case Zvt::TSC_E4:
            return Zvt::TSC_E4;
        case Zvt::TSC_F0:
            return Zvt::TSC_F0;
        case Zvt::TSC_F6:
            return Zvt::TSC_F6;
        default:
            return Zvt::TSC_Unknown;
    }
}

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
inline std::vector<unsigned char> llvar_data(std::vector<unsigned char> data)
{
    if (data.size() > 1)
    {
        std::stringstream ss;
        std::bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return Zvt::copyRange(data, 2, std::stoi(ss.str()) + 2 - 1);
    }

    return std::vector<unsigned char>();
}

/**
 * We did not know the data length of the llvar/lllvar.
 *
 * Give Zvt::llvar_data()/Zvt::lllvar_data() the complete rest of the tag/bmp.
 *
 * The methode return a vector only wth the data. IF the length is reached the method returns immediately...
 */
inline int llvar_length(std::vector<unsigned char> data)
{
    if (data.size() > 1)
    {
        std::stringstream ss;
        std::bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return std::stoi(ss.str());
    }

    return 0;
}

inline std::vector<unsigned char> lllvar_data(std::vector<unsigned char> data)
{
    if (data.size() > 2)
    {
        std::stringstream ss;
        std::bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[2]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return Zvt::copyRange(data, 3, std::stoi(ss.str()) + 3 - 1);
    }

    return std::vector<unsigned char>();
}

inline int lllvar_length(std::vector<unsigned char> data)
{
    if (data.size() > 2)
    {
        std::stringstream ss;
        std::bitset<8> byte(data[0]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[1]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();

        byte = std::bitset<8>(data[2]);

        byte.set(7, 0);
        byte.set(6, 0);
        byte.set(5, 0);
        byte.set(4, 0);
        ss << byte.to_ulong();
        return std::stoi(ss.str());
    }

    return 0;
}

/**
 * APDU class is the complete container of BMPs. BMPs did not have a length-byte i all cases.
 *
 * There are many different BMPs.
 *
 * Some (like the password in 0600) is simply a vector. Most BMPs has a identification-byte and have no length byte.
 *
 * The "heaviest" BMP it the TLV-container (0x06). Which can contain BMPs (called TAGs). These Tags and the TLV container itself
 * have always a length (length can differ).So you must calculate the length of the TAG (identification-bytes)
 * and the length of the length-bytes. A TAG can contain other Tags.
 *
 * This class could build every message from/to the PT.
 *
 * For specializations see the "cmds" folder. There are classes which inherit from the APDU class. They will handle the special behaviors...
 *
 * For decoding a "command" (Completion 060F for example) you may need the initial send command.
 * A 060F may have different content (bmp, tlv, etc) which depends on the start command (0600, 0501, 0850, 0601).
 *
 *
 * To dive deeper into the zvt protocol please consult the ZVT documentation.
 *
 */

class Apdu
{
protected:
    unsigned char _ccrc;   // apdu ctrl byte 1
    unsigned char _aprc;   // apdu ctrl byte 2
    LengthFormat lf;       // ONE or THREE byte length (ONE = 0-254, THREE = 0 - 65535
    std::vector<unsigned char> vdata;  // bmp, tlv data... must match
    Command _flow; // this APDU depends to the origin APDU (start 06xx, 05xx, 08xx, ...)

    void init(void);
    void extendOneToThree(const unsigned char *, const int);

public:
    inline Apdu()
            :
            _ccrc(0x00)
            , _aprc(0x00)
            , lf(ONE)
            , vdata()
    {
    }

    Apdu(const unsigned char, const unsigned char);
    Apdu(const unsigned char, const unsigned char, const LengthFormat);
    Apdu(const unsigned char *, int);
    Apdu(const std::vector<unsigned char>);
    Apdu(const Apdu &apdu);
    virtual ~Apdu();

    void addBmp(const unsigned char);
    void addBmp(const unsigned char *, int);
    void addBmp(const std::vector<unsigned char>);
    void addBmp(const HexToByte);
    void addBmp(Zvt::Bmp);

    std::vector<unsigned char> lengthBuffer();
    Command isA(void);
    virtual void print(void);

    // vdate.size == 0 and lf = ONE
    inline void clear()
    {
        // note, _ccrc && _aprc are set
        this->vdata.clear();
        this->init();
        this->lf = ONE;
    }

    inline unsigned char ccrc() const
    {
        return this->_ccrc;
    }

    inline unsigned char aprc() const
    {
        return this->_aprc;
    }

    inline Zvt::LengthFormat fmt() const
    {
        return this->lf;
    }

    inline Zvt::Command flow() const
    {
        return this->_flow;
    }

    inline void flow(Zvt::Command flow)
    {
        this->_flow = flow;
    }
    /**
     * Attempts to extract the BMP's independently of the command flow. In special cases the buffer may have
     * to be processed explicitly.
     */
    virtual std::vector<Zvt::Bmp> parse(void);
    /* APDU generally describes the complete message. Depending on CCRC/APRC the order and the BMP's can vary!
     *
     * See cmds/XXXXX, this is a good place to implement specialized APDUs or overwrite the APDU class.
     */
    virtual std::vector<Zvt::Bmp> parse(Zvt::Command);

    inline bool isA(Zvt::Command cmd)
    {
        return cmd == this->isA();
    }

    inline bool isA(unsigned char ccrc, unsigned char aprc)
    {
        return this->_ccrc == ccrc && this->_aprc == aprc;
    }

    inline const unsigned char *cmd() const
    {
        return this->vdata.data();
    }

    inline const std::vector<unsigned char> get() const
    {
        return this->vdata;
    }

    inline const int size() const
    {
        return this->vdata.size();
    }

    // TODO
    // check size() against the APDU length byte/bytes
    // must be equal
    inline const int dataSize() const
    {
        switch (this->lf)
        {
            case THREE:
                return this->vdata.size() - 5;
            case ONE:
            default:
                return this->vdata.size() - 3;
        }
    }

    inline LengthFormat lengthFormat()
    {
        return this->lf;
    }

    /**
     * Calculates the size in APDU format (one byte or extended three-byte)
     *
     * Examples
     *
     * 	255 - 65535:
     * 	310/256			= 1  (HI) --> 0x01
     * 	310-(1*256)		= 54 (LO) --> 0x36
     *
     * 	vector { FF, 36, 01 }
     *
     * 	0 - 254:
     * 	111             = 0x6F
     *
     * 	vector { 6F }
     *
     * 	Errors:
     * 	1243534345      = vector.size() is 0
     * 	-1              = vector.size() is 0
     *
     * return vector with size does not fit ZVT APDU (0-254 or 255 - 65535)
     */
    inline static std::vector<unsigned char> calculateApduSize(const int length)
    {
        std::vector<unsigned char> asz;

        if (length > -1 && length <= 254)
        {
            asz[0] = length;
        }
        else if (length > 254 && length <= 65535)
        {
            asz.push_back(0xFF);

            int hi = length / 256;
            int lo = length - (hi * 256);

            asz.push_back(lo);
            asz.push_back(hi);
        }

        return asz;
    }

    inline static int calculateApduDataSize(const unsigned char lo, const unsigned char hi)
    {
        return lo + (hi * 256);
    }

    inline std::vector<unsigned char> data()
    {
        return this->copyRange(this->fmt() == Zvt::ONE ? 3 : 5, this->size() - 1);
    }

    inline std::vector<unsigned char> copyRange(int from, int to) const
    {
        return Zvt::copyRange(this->vdata, from, to);
    }

    inline void set(const unsigned char *buffer, const int length)
    {
        this->vdata.assign(buffer, buffer + length);
        this->_ccrc = vdata.at(0);
        this->_aprc = vdata.at(1);
        this->lf = vdata.at(2) == 0xFF ? THREE : ONE;
    }

    inline static const std::string commandName(Zvt::Command cmd)
    {
        switch (cmd)
        {
            case CMD_0401:
                return "Zvt::CMD_0401";
            case CMD_040D:
                return "Zvt::CMD_040D";
            case CMD_040E:
                return "Zvt::CMD_040E";
            case CMD_040F:
                return "Zvt::CMD_040F";
            case CMD_04FF:
                return "Zvt::CMD_04FF";
            case CMD_0501:
                return "Zvt::CMD_0501";
            case CMD_0600:
                return "Zvt::CMD_0600";
            case CMD_0601:
                return "Zvt::CMD_0601";
            case CMD_0602:
                return "Zvt::CMD_0602";
            case CMD_0603:
                return "Zvt::CMD_0603";
            case CMD_0604:
                return "Zvt::CMD_0604";
            case CMD_0605:
                return "Zvt::CMD_0605";
            case CMD_0609:
                return "Zvt::CMD_0609";
            case CMD_060A:
                return "Zvt::CMD_060A";
            case CMD_060B:
                return "Zvt::CMD_060B";
            case CMD_060C:
                return "Zvt::CMD_060C";
            case CMD_060F:
                return "Zvt::CMD_060F";
            case CMD_0610:
                return "Zvt::CMD_0610";
            case CMD_0611:
                return "Zvt::CMD_0611";
            case CMD_0612:
                return "Zvt::CMD_0612";
            case CMD_0618:
                return "Zvt::CMD_0618";
            case CMD_061A:
                return "Zvt::CMD_061A";
            case CMD_061B:
                return "Zvt::CMD_061B";
            case CMD_061E:
                return "Zvt::CMD_061E";
            case CMD_0620:
                return "Zvt::CMD_0620";
            case CMD_0621:
                return "Zvt::CMD_0621";
            case CMD_0622:
                return "Zvt::CMD_0622";
            case CMD_0623:
                return "Zvt::CMD_0623";
            case CMD_0624:
                return "Zvt::CMD_0624";
            case CMD_0625:
                return "Zvt::CMD_0625";
            case CMD_0626:
                return "Zvt::CMD_0626";
            case CMD_0630:
                return "Zvt::CMD_0630";
            case CMD_0631:
                return "Zvt::CMD_0631";
            case CMD_0650:
                return "Zvt::CMD_0650";
            case CMD_0651:
                return "Zvt::CMD_0651";
            case CMD_0670:
                return "Zvt::CMD_0670";
            case CMD_0679:
                return "Zvt::CMD_0679";
            case CMD_0682:
                return "Zvt::CMD_0682";
            case CMD_0685:
                return "Zvt::CMD_0685";
            case CMD_0686:
                return "Zvt::CMD_0686";
            case CMD_0687:
                return "Zvt::CMD_0687";
            case CMD_0688:
                return "Zvt::CMD_0688";
            case CMD_0690:
                return "Zvt::CMD_0690";
            case CMD_0691:
                return "Zvt::CMD_0691";
            case CMD_0693:
                return "Zvt::CMD_0693";
            case CMD_0695:
                return "Zvt::CMD_0695";
            case CMD_06B0:
                return "Zvt::CMD_06B0";
            case CMD_06C0:
                return "Zvt::CMD_06C0";
            case CMD_06C1:
                return "Zvt::CMD_06C1";
            case CMD_06C2:
                return "Zvt::CMD_06C2";
            case CMD_06C3:
                return "Zvt::CMD_06C3";
            case CMD_06C4:
                return "Zvt::CMD_06C4";
            case CMD_06C5:
                return "Zvt::CMD_06C5";
            case CMD_06C6:
                return "Zvt::CMD_06C6";
            case CMD_06CE:
                return "Zvt::CMD_06CE";
            case CMD_06D1:
                return "Zvt::CMD_06D1";
            case CMD_06D3:
                return "Zvt::CMD_06D3";
            case CMD_06D4:
                return "Zvt::CMD_06D4";
            case CMD_06D8:
                return "Zvt::CMD_06D8";
            case CMD_06D9:
                return "Zvt::CMD_06D9";
            case CMD_06DA:
                return "Zvt::CMD_06DA";
            case CMD_06DB:
                return "Zvt::CMD_06DB";
            case CMD_06DD:
                return "Zvt::CMD_06DD";
            case CMD_06E0:
                return "Zvt::CMD_06E0";
            case CMD_06E1:
                return "Zvt::CMD_06E1";
            case CMD_06E2:
                return "Zvt::CMD_06E2";
            case CMD_06E3:
                return "Zvt::CMD_06E3";
            case CMD_06E4:
                return "Zvt::CMD_06E4";
            case CMD_06E5:
                return "Zvt::CMD_06E5";
            case CMD_06E6:
                return "Zvt::CMD_06E6";
            case CMD_06E8:
                return "Zvt::CMD_06E8";
            case CMD_06E9:
                return "Zvt::CMD_06E9";
            case CMD_0801:
                return "Zvt::CMD_0801";
            case CMD_0802:
                return "Zvt::CMD_0802";
            case CMD_0810:
                return "Zvt::CMD_0810";
            case CMD_0811:
                return "Zvt::CMD_0811";
            case CMD_0812:
                return "Zvt::CMD_0812";
            case CMD_0813:
                return "Zvt::CMD_0813";
            case CMD_0820:
                return "Zvt::CMD_0820";
            case CMD_0821:
                return "Zvt::CMD_0821";
            case CMD_0822:
                return "Zvt::CMD_0822";
            case CMD_0823:
                return "Zvt::CMD_0823";
            case CMD_0824:
                return "Zvt::CMD_0824";
            case CMD_0830:
                return "Zvt::CMD_0830";
            case CMD_0840:
                return "Zvt::CMD_0840";
            case CMD_0850:
                return "Zvt::CMD_0850";
            case CMD_8000:
                return "Zvt::CMD_8000";
            case CMD_8400:
                return "Zvt::CMD_8400";
            case CMD_849A:
                return "Zvt::CMD_849A";
            case CMD_84xx:
                return "Zvt::CMD_84xx";
            case CMD_849C:
                return "Zvt::CMD_849C";
            case CMD_END_LOOP:
                return "Zvt::CMD_END_LOOP";
            case CMD_CTLS_START_WAITING:
                return "Zvt::CMD_CTLS_START_WAITING";
            case CMD_CTLS_WAITING:
                return "Zvt::CMD_CTLS_WAITING";
            case CMD_CTLS_CARD_PRESENT:
                return "Zvt::CMD_CTLS_CARD_PRESENT";
            case CMD_UNKNOWN:
            default:
                return "Zvt::CMD_UNKNOWN";
        }
    }
};

}
#endif /* APDU_HPP_ */
