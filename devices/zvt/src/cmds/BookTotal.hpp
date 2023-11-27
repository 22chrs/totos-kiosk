//
// Created by André Heine on 26.08.22.
//

#ifndef ZVT_BOOKTOTAL_HPP
#define ZVT_BOOKTOTAL_HPP

#include <Apdu.hpp>
#include <Bmp.hpp>
#include <Tlv.hpp>

#include <sstream>
#include <string>
#include <iomanip>


namespace Cmd
{
class BookTotal
        : public Zvt::Apdu
{
private:
    Zvt::Bmp _receipt_no;
    Zvt::Bmp _amount;
public:
    BookTotal();
    BookTotal(unsigned int receiptNo);
    BookTotal(unsigned int receiptNo, unsigned long amount);
    BookTotal(std::vector<unsigned char> receiptNo, std::vector<unsigned char> amount);
    virtual ~BookTotal();

//formatter:off
    inline const Zvt::Bmp amount() const
    { return this->_amount; }

    inline const Zvt::Bmp receiptNo() const
    { return this->_receipt_no; }
//formatter:on
};
}

#endif //ZVT_BOOKTOTAL_HPP

