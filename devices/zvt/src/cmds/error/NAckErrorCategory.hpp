//
// Created by André Heine on 14.02.22.
//

#ifndef ZVT_NACKERRORCATEGORY_HPP
#define ZVT_NACKERRORCATEGORY_HPP


#include <boost/system/error_category.hpp>

namespace Cmd
{

class NAckErrorCategory
        : public boost::system::error_category
{
public:
    NAckErrorCategory()
            : boost::system::error_category()
    {

    }

    const char *name() const BOOST_NOEXCEPT override
    {
        return "NAckErrorCategory";
    }

    std::string message(int ev) const override
    {
        return std::string("NAck error received");
    }
};
}
#endif //ZVT_NACKERRORCATEGORY_HPP
