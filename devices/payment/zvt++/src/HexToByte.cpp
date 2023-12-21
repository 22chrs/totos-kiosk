/*
 * Command.cpp
 *
 *  Created on: 27.10.2020
 *      Author: ah
 */

//project
#include "HexToByte.hpp"

#include <cassert>

//boost
#include <boost/algorithm/hex.hpp>
#include <boost/algorithm/string.hpp>

using namespace std;

using boost::algorithm::hex;
using boost::algorithm::unhex;
using boost::algorithm::replace_all;

std::string Zvt::HexToByte::assert_check(std::string cmd)
{
    if (cmd.size() != 0)
    {
        // length not 0
        assert(cmd.size() != 0);
        // remove blanks
        replace_all(cmd, " ", "");
        replace_all(cmd, "\n", "");
        replace_all(cmd, "\r", "");
        // length must be even after cleaning the string
        assert(cmd.size() % 2 == 0);
    }
    return cmd;
}

Zvt::HexToByte::HexToByte(const std::string c)
        :
        cmd(this->assert_check(c))
        , buf(NULL)
{
    this->create_unhex_buffer();
}

Zvt::HexToByte::~HexToByte()
{
    delete[] buf;
}

Zvt::HexToByte::HexToByte(const HexToByte &other)
        :
        cmd(this->assert_check(other.asStr()))
{
    this->create_unhex_buffer();
}

void Zvt::HexToByte::set(const std::string &c)
{
    this->cmd = this->assert_check(c);
    this->create_unhex_buffer();
}

void Zvt::HexToByte::create_unhex_buffer()
{
    string unhex_str = unhex(this->cmd);

    //cout << unhex_str.size() << endl;
    //cout << this->cmd.size() << endl;
    if (this->buf != NULL)
        delete[] this->buf;

    this->buf = new unsigned char[unhex_str.size()];
    this->length = unhex_str.size();
    copy(unhex_str.begin(), unhex_str.end(), this->buf);
}

