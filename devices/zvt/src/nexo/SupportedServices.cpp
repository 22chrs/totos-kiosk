//
// Created by André Heine on 09.09.22.
//

#include "SupportedServices.hpp"

std::bitset<8> Nexo::SupportedServices::byte1() const
{
    return std::bitset<8>( _services.to_ulong() >> 8);
}

std::bitset<8> Nexo::SupportedServices::byte2() const
{
    return std::bitset<8>( _services.to_ulong());
}

void Nexo::SupportedServices::bytes(unsigned char byte1, unsigned char byte2)
{
    _services = std::bitset<16>((byte1 << 8) ^ byte2);
}

Nexo::SupportedServices::SupportedServices(unsigned char byte1, unsigned char byte2)
        : _services(std::bitset<16>((byte1 << 8) ^ byte2))
{
}

Nexo::SupportedServices::SupportedServices()
        : _services(std::bitset<16>(0))
{
}

const std::bitset<16> &Nexo::SupportedServices::services() const
{
    return _services;
}

void Nexo::SupportedServices::services(const std::bitset<16> &services)
{
    _services = services;
}
