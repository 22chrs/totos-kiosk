/*
 * Ack.hpp
 *
 *  Created on: 11.11.2020
 *      Author: ah
 */

#ifndef CMDS_ABORT_HPP_
#define CMDS_ABORT_HPP_


#include <Apdu.hpp>

#include <iostream>
#include <bitset>
#include <vector>

namespace Cmd
{

class Abort
        : public Zvt::Apdu
{
private:
    int _resultCode;
    std::string _extendedErrorCode;
    std::string _extendedErrorMessage;
    std::vector<std::string> _receipt_numbers;

public:
    Abort();
    Abort(const Zvt::Apdu &);
    virtual ~Abort();

    std::vector<Zvt::Bmp> parse(void);

// @formatter:off
    inline const int resultCode() const
    { return this->_resultCode; }

    inline const std::string extendedErrorCodeBinaryAsHex() const
    { return this->_extendedErrorCode; }

    inline const std::string extendedErrorMessage() const
    { return this->_extendedErrorMessage; }

    inline const std::vector<std::string> receiptNumbers() const
    { return this->_receipt_numbers; }
// @formatter:on

};

}

#endif /* CMDS_ABORT_HPP_ */
