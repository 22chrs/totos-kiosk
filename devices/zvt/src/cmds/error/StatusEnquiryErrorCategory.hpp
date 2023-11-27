//
// Created by André Heine on 14.02.22.
//

#ifndef ZVT_StatusEnquiryErrorCategory_HPP
#define ZVT_StatusEnquiryErrorCategory_HPP


#include <boost/system/error_category.hpp>

namespace Cmd
{

class StatusEnquiryErrorCategory
        : public boost::system::error_category
{
public:
    StatusEnquiryErrorCategory()
            : boost::system::error_category()
    {

    }

    const char *name() const BOOST_NOEXCEPT override
    {
        return "StatusEnquiryErrorCategory";
    }

    /**
     * 00 PT ready
     * 81 Initialisation required 98 Date/time incorrect
     * 156 Please wait (e.g. software-update still running)
     * 157 Partial issue of goods
     * 177 Memory full
     * 178 Merchant-journal full
     * 191 Voltage supply too low (external power supply)
     * 192 Card locking mechanism defect
     * 193 Merchant card locked
     * 194 Diagnosis required
     * 196 Card-profile invalid. New card-profiles must be loaded 204 Printer not ready
     * 220 Card inserted
     * 223 Out-of-order
     * 224 Remote-maintenance activated
     * 225 Card not completely removed
     * 226 Card-reader does not answer / card-reader defective
     * 227 Shutter closed
     * 228 Terminal activation required
     * 240 Reconciliation required
     * 246 OPT-data not available (= OPT-Personalisation required)
     */
    std::string message(int ev) const override
    {
        switch (ev)
        {
            case 00:
                return std::string("PT ready");
            case 81:
                return std::string("Initialisation required 98 Date/time incorrect");
            case 156:
                return std::string("Please wait (e.g. software-update still running)");
            case 157:
                return std::string("Partial issue of goods");
            case 177:
                return std::string("Memory full");
            case 178:
                return std::string("Merchant-journal full");
            case 191:
                return std::string("Voltage supply too low (external power supply)");
            case 192:
                return std::string("Card locking mechanism defect");
            case 193:
                return std::string("Merchant card locked");
            case 194:
                return std::string("Diagnosis required");
            case 196:
                return std::string("Card-profile invalid. New card-profiles must be loaded 204 Printer not ready");
            case 220:
                return std::string("Card inserted");
            case 223:
                return std::string("Out-of-order");
            case 224:
                return std::string("Remote-maintenance activated");
            case 225:
                return std::string("Card not completely removed");
            case 226:
                return std::string("Card-reader does not answer / card-reader defective");
            case 227:
                return std::string("Shutter closed");
            case 228:
                return std::string("Terminal activation required");
            case 240:
                return std::string("Reconciliation required");
            case 246:
                return std::string("OPT-data not available (= OPT-Personalisation required)");
            default:
                return std::string(&"Unknown terminal-status code " [ ev]);
        }
    }
};
}
#endif //ZVT_StatusEnquiryErrorCategory_HPP
