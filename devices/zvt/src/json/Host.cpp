//
// Created by André Heine on 26.04.21.
//

#include "Host.hpp"

void Json::tag_invoke(boost::json::value_from_tag, boost::json::value &value, Host const &host)
{
    value = {
            {"name", host.name()},
            {"host", host.host()},
            {"port", host.port()},
            {"pwd", host.port()}
    };
}

Json::Host Json::tag_invoke(boost::json::value_to_tag<Host>, boost::json::value const &jv)
{
    boost::json::object const &obj = jv.as_object();

    return Json::Host {
            boost::json::value_to<std::string>(obj.at("name")),
            boost::json::value_to<std::string>(obj.at("host")),
            boost::json::value_to<int>(obj.at("port")),
            boost::json::value_to<std::string>(obj.at("pwd"))
    };
}