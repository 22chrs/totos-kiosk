//
// Created by André Heine on 14.02.22.
//

#ifndef ZVT_StatusErrorCategory_HPP
#define ZVT_StatusErrorCategory_HPP


#include <boost/system/error_category.hpp>

namespace Cmd
{

class StatusErrorCategory
        : public boost::system::error_category
{
public:
    StatusErrorCategory()
            : boost::system::error_category()
    {

    }

    const char *name() const BOOST_NOEXCEPT override
    {
        return "StatusErrorCategory";
    }

    std::string message(int ev) const override
    {
        return std::string("Error 040F --> ToDo: Implement chapter 10 error messages");
    }
};
}
#endif //ZVT_StatusErrorCategory_HPP
