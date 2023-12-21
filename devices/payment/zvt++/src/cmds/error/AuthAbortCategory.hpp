//
// Created by André Heine on 21.02.22.
//

#ifndef ZVT_AUTHABORTCATEGORY_HPP
#define ZVT_AUTHABORTCATEGORY_HPP


#include <boost/system/error_category.hpp>

namespace Cmd
{

class AuthAbortCategory
        : public boost::system::error_category
{
public:
    AuthAbortCategory()
            : boost::system::error_category()
    {

    }

    const char *name() const BOOST_NOEXCEPT override
    {
        return "AuthAbortCategory";
    }

    std::string message(int ev) const override
    {
        return std::string("Abort 061E --> ToDo: Implement chapter 10 error messages");
    }
};
}
#endif //ZVT_AUTHABORTCATEGORY_HPP
