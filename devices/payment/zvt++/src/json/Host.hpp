//
// Created by André Heine on 26.04.21.
//

#ifndef ZVT_HOST_HPP
#define ZVT_HOST_HPP

#include <string>

#define BOOST_JSON_STACK_BUFFER_SIZE 1024
#include <boost/json.hpp>

namespace Json
{

class Host
{
private:
    std::string _name;
    std::string _host;
    int _port;
    std::string _pwd;

public:
    Host(std::basic_string<char> name, std::basic_string<char> host, int port, std::basic_string<char> pwd)
            : _name(name)
              , _host(host)
              , _port(port)
              , _pwd(pwd)
    {}

    void name(const std::string name)
    { this->_name = name; }

    void host(const std::string host)
    { this->_host = host; }

    void port(const int port)
    { this->_port = port; }

    void password(const std::string pwd)
    { this->_pwd = pwd; }

    const std::string name() const
    { return this->_name; }

    const std::string host() const
    { return this->_host; }

    const int port() const
    { return this->_port; };

    const std::string password() const
    { return this->_pwd; }
};

void tag_invoke(boost::json::value_from_tag, boost::json::value &, Host const &);
Host tag_invoke(boost::json::value_to_tag<Host>, boost::json::value const &);

}
#endif //ZVT_HOST_HPP
