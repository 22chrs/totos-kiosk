//
// Created by André Heine on 14.02.22.
//

#ifndef ZVT_REGISTERERRORCATEGORY_HPP
#define ZVT_REGISTERERRORCATEGORY_HPP


#include <boost/system/error_category.hpp>

namespace Cmd
{

class RegisterErrorCategory
        : public boost::system::error_category
{
public:
    RegisterErrorCategory() : boost::system::error_category()
    {

    }

    const char *name() const BOOST_NOEXCEPT override
    {
        return "RegisterErrorCategory";
    }

    /**
     * Status-byte	Definition
     * xxxx xxx1 		PT initialisation necessary
     * xxxx xx1x 		Diagnosis necessary
     * xxxx x1xx		OPT action necessary
     * xxxx 1xxx		PT functions in filling station mode
     * xxx1 xxxx 		PT functions in vending machine mode
     * xx1x xxxx 		RFU
     * x1xx xxxx 		RFU
     * 1xxx xxxx		RFU
    */
    std::string message(int ev) const override
    {
        switch (ev)
        {
            case 0:
                return std::string("no error");
            case 1:
                return std::string("PT initialisation necessary");
            case 2:
                return std::string("Diagnosis necessary");
            case 3:
                return std::string("OPT action necessary");
            default:
                return std::string(&"Unknown error/action in Register 0600"[ev]);
        }
    }
};
}
#endif //ZVT_REGISTERERRORCATEGORY_HPP
