//
// Created by André Heine on 16.08.21.
//

#include "EmvTagConverter.hpp"

std::string EmvTagConverter::map(const std::string tag_str) const
{
    if(tag_str == "9F35") return "TerminalTyp";
    else if(tag_str == "9F1A") return "Application country code";
    else if(tag_str == "9F1C") return "Terminal Identification";
    else if(tag_str == "9F22") return "Index Public Key CA";
    else if(tag_str == "DF30") return "Signature Algo CA";
    else if(tag_str == "DF29") return "Hash Algo CA";
    else if(tag_str == "DF32") return "Exponent Public Key CA";
    else if(tag_str == "DF31") return "Modulus Public CA";
    else if(tag_str == "DF1B") return "Config Currency";
    else if(tag_str == "DF1C") return "Exponent Config Currency";
    else if(tag_str == "9F33") return "Terminal Capabilities";
    else if(tag_str == "9F40") return "Additional Terminal Capabilities";
    else if(tag_str == "DF47") return "Max Error Retries";
    else if(tag_str == "DF48") return "Operator Language";
    else if(tag_str == "DF39") return "Journal-DOL";
    else if(tag_str == "DF8133") return "Maximum Relay Resistance Grace Period";
    else if(tag_str == "DF34") return "Registered Application Provider ID";
    else if(tag_str == "DF33") return "Checksum for integrity assurance";
    else if(tag_str == "9F06") return "Terminal DF Name";
    else if(tag_str == "DF60") return "Not found in DPOS 3";
    else if(tag_str == "DF0A") return "Application Label";
    else if(tag_str == "DF0B") return "ASI";
    else if(tag_str == "F8") return "DOL";
    else if(tag_str == "DF2A") return "Configuration Product View and Language Selection";
    else if(tag_str == "DF0C") return "DDOL";
    else if(tag_str == "DF0D") return "TDOL";
    else if(tag_str == "9F09") return "Application Version Number";
    else if(tag_str == "9F15") return "Merchant Category Code";
    else if(tag_str == "DF27") return "Application specific configuration of terminal capabilities";
    else if(tag_str == "DF28") return "Extended Application specific configuration of terminal capabilities";
    else if(tag_str == "9F4E") return "Merchant Name and Location";
    else if(tag_str == "9F16") return "Merchant Identifier";
    else if(tag_str == "9F01") return "Acquirer Identifier";
    else if(tag_str == "DF26") return "Floor Limit";
    else if(tag_str == "DF0E") return "Threshold Value for Biased Random Selection";
    else if(tag_str == "DF0F") return "Maximum Target Percentage to be Used for Biased Random Selection";
    else if(tag_str == "DF10") return "Target Percentage to be Used for Biased Random Selection";
    else if(tag_str == "DF23") return "Max Offline Transactions";
    else if(tag_str == "DF2F") return "Enabling the early PIN entry";
    else if(tag_str == "DF11") return "Terminal Action Code - Denial";
    else if(tag_str == "DF12") return "Terminal Action Code - Online";
    else if(tag_str == "DF13") return "Terminal Action Code - Default";
    else if(tag_str == "DF22") return "Permitted special transactions, transaction types and transaction processes";
    else if(tag_str == "DF25") return "Receipt Parameter";
    else if(tag_str == "DF40") return "Receipt DOL for merchant receipts for online transactions";
    else if(tag_str == "DF41") return "Receipt DOL for merchant receipts for authorized offline transactions";
    else if(tag_str == "DF42") return "Receipt DOL for merchant receipts for rejected or canceled offline transactions.";
    else if(tag_str == "DF43") return "Receipt DOL for customer receipts for online transactions";
    else if(tag_str == "DF44") return "Receipt DOL for customer receipts for authorized offline transactions";
    else if(tag_str == "DF45") return "Receipt DOL for customer receipts for rejected or cancelled offline transactions.";
    else if(tag_str == "DF35") return "Terminal Country Code";
    else if(tag_str == "FB") return "Magstripe Application";
    else if(tag_str == "E0") return "E0 template";
    else if(tag_str == "E1") return "E1 template";
    else if(tag_str == "DF2C") return "PAN prefix";
    else if(tag_str == "F9") return "Data Object Prefix";
    else if(tag_str == "DF46") return "Necessary track(s) of the magnetic stripe and identifying magnetic stripe data";
    else if(tag_str == "DF14") return "Reader Contactless Transaction Limit (Kernel, No On- device CVM)";
    else if(tag_str == "DF15") return "Reader Contactless Transaction Limit (Kernel, On-device CVM)";
    else if(tag_str == "DF18") return "Removal Timeout OR Fallback-Parameter";
    else if(tag_str == "DF06") return "ID of the magnetic stripe based application (MID)";
    else if(tag_str == "DF04") return "Reader Contactless Transaction Limit (Pre-Processing)";
    else if(tag_str == "DF16") return "Reader CVM Required Limit (Kernel)";
    else if(tag_str == "9F66") return "Terminal Transaction Qualifiers (TTQ)";
    else if(tag_str == "DF09") return "Kernel Priority";
    else if(tag_str == "DF01") return "Kernel ID";

    return tag_str;
}
