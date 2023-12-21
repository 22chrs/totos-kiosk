//
// Created by André Heine on 19.11.21.
//

#include <fstream>
#include "PrintLine.hpp"

Cmd::PrintLine::PrintLine()
        : Zvt::Apdu(0x06, 0xD1)
          , _attribute(0x00)
          , _text("")
          , _value(0)
{
}

Cmd::PrintLine::PrintLine(const std::vector<unsigned char> data)
        : Zvt::Apdu(data.data(), data.size())
          , _attribute(0x00)
          , _text("")
          , _value(0)
{
    this->parse();
}

Cmd::PrintLine::PrintLine(const PrintLine &other)
        : Zvt::Apdu(other.cmd(), other.size())
          , _attribute(0x00)
          , _text("")
          , _value(0)
{
    this->parse();
}

Cmd::PrintLine::~PrintLine()
{
}

std::vector<Zvt::Bmp> Cmd::PrintLine::parse(void)
{
    for (int idx = 0; idx < data().size(); ++idx)
    {
        if (idx == 0)
        {
            this->attribute(data()[idx]);
        }
        else
        {
            if (!this->attribute().test(7)
                && !this->attribute().test(6)
                && !this->attribute().test(5)
                && !this->attribute().test(4))
            {
                this->text(this->data());
                this->value(this->attribute());
            }
            else if (this->attribute() == 0x80)
            {
                // RFU
            }
            else if (this->attribute() == 0xFF)
            {
                this->text(std::string("\n"));
                this->value(data()[idx]);
            }
            else if (!this->attribute().test(7)
                     && (this->attribute().test(6)
                         || this->attribute().test(5)
                         || this->attribute().test(4)))
            {
                this->text(this->data());
                this->value(data()[idx]);
            }
            else std::cerr << "Missing attribute set for 06D1 {" << attribute() << "}" << std::endl;
        }
    }

    return std::vector<Zvt::Bmp>();
}

void Cmd::PrintLine::print(void)
{
    std::cout << "<-PT: 06D1 --> attribute  {" << attribute() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isLinefeed {" << this->isLinefeed() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isText     {" << this->isText() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isCentred  {" << this->isCentred() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isWidth    {" << this->isWidth() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isHeight   {" << this->isHeight() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> isLastLine {" << this->isLastLine() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> value      {" << this->value() << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> hex        {" << Utils::log_hex_str(get()) << "}" << std::endl;
    std::cout << "<-PT: 06D1 --> text       {" << this->text() << "}" << std::endl;
}

void Cmd::PrintLine::write_to_cwd(void)
{
    std::ofstream file;
    file.open("printline.txt", std::ios::out | std::ios::app);
    file << this->text() << std::endl;
    file.close();
}
