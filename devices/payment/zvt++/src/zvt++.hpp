/*
 * zvt++.hpp
 *
 *  Created on: 24.11.2020
 *      Author: ah
 */

#ifndef ZVT___HPP_
#define ZVT___HPP_

//stl
#include <iostream>
#include <iomanip>
#include <string>
#include <iterator>
#include <algorithm>
#include <array>
#include <bitset>
#include <map>
#include <filesystem>
#include <cstdlib>
#include <fstream>

//boost
#include <boost/algorithm/hex.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/array.hpp>
#include <boost/asio.hpp>
#include <boost/chrono.hpp>
#include <boost/thread/thread.hpp>


#define BOOST_JSON_STACK_BUFFER_SIZE 1024

#include <boost/json/src.hpp>
//#include <boost/json.hpp>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/ini_parser.hpp>

//zvt++
#include "Apdu.hpp"
#include "Utils.hpp"
#include "HexToByte.hpp"
#include "Bmp.hpp"
#include "Tlv.hpp"
#include "Tag.hpp"
#include "HexToByte.hpp"

#include <bmps/IndividualTotals.hpp>

#include <cmds/Register.hpp>
#include <cmds/FeigRegister.hpp>
#include <cmds/Ack.hpp>
#include <cmds/Status.hpp>
#include <cmds/CompletionForRegister.hpp>
#include <cmds/CompletionForStatus.hpp>
#include <cmds/Auth.hpp>
#include <cmds/StatusInfo.hpp>
#include <cmds/IntermediateStatusInfo.hpp>
#include <cmds/BlockReceipt.hpp>
#include <cmds/PrintLine.hpp>
#include <cmds/EndOfDay.hpp>
#include <cmds/Diagnosis.hpp>
#include <cmds/ConfigFeig.hpp>
#include <cmds/Initialisation.hpp>
#include <cmds/PPAuth.hpp>
#include <cmds/PrintSystemConfig.hpp>
#include <cmds/RepeatReceipt.hpp>
#include <cmds/TurnoverTotals.hpp>
#include <cmds/Reversal.hpp>
#include <cmds/Abort.hpp>
#include <json/Host.hpp>
#include <converter/EmvTagConverter.hpp>
#include "Tests.hpp"
#include <cmds/LogOff.hpp>
#include <cmds/error/RegisterErrorCategory.hpp>
#include <cmds/error/StatusEnquiryErrorCategory.hpp>
#include <cmds/error/StatusErrorCategory.hpp>
#include <cmds/error/NAckErrorCategory.hpp>
#include <cmds/DisplayText.hpp>
#include <cmds/BookTotal.hpp>
#include <cmds/Reservation.hpp>

#include <gicc/Bmp55.hpp>
#include "Utils.hpp"

//Globals
Cmd::Register reg_0600;
//Cmd::Status status_0501(0x05);

Cmd::RegisterErrorCategory registerErrorCategory;
Cmd::StatusEnquiryErrorCategory statusEnquiryErrorCategory;
Cmd::StatusErrorCategory statusErrorCategory;
Cmd::NAckErrorCategory nAckErrorCategory;

std::string password = "010203";

// forward
void crawl_init_tree(std::shared_ptr<Zvt::Tag> &, int, boost::property_tree::basic_ptree<basic_string<char>, basic_string<char>>);

inline boost::system::error_code write_to_socket(Zvt::Apdu &apdu, boost::asio::ip::tcp::socket &socket)
{
    boost::system::error_code error;

    Utils::log("->PT: ", apdu.cmd(), apdu.size());

    socket.write_some(boost::asio::buffer(apdu.cmd(), apdu.size()), error);

    if (error.failed())
    {
        cerr << "failed=" << error.failed() << ", value=" << error.value() << ", message=" << error.message() << endl;
    }

    return error;
}

inline boost::system::error_code read_apdu_from_socket(Zvt::Apdu &from_pt, boost::asio::ip::tcp::socket &socket)
{
    // CCRC + APRC + 1-byte length
    //std::vector<unsigned char> buf(3);
    std::vector<unsigned char> buf(5);
    std::vector<unsigned char> data;
    boost::system::error_code error;

    size_t len = socket.read_some(boost::asio::buffer(buf), error);
    size_t expected_len = 0;
    size_t expected = 0;

    if (!error.failed())
    {
        // cout << "<-PT: received (" << len << ")" << endl;
        // only 3-bytes received. ACK (80 00 00) or a APDU with not data appended (06 0f 00)
        if (len == 3)
        {
            from_pt.set(buf.data(), len);
            expected_len = 3;
            return error;
        }
        else if (len > 3)
        {
            // 3-byte length follow
            if (buf[2] == 0xFF)
            {
                expected_len = Zvt::Apdu::calculateApduDataSize(buf[3], buf[4]) + 5;
            }
            else
            {
                // 1-byte length CCRC + APRC + LENGTH
                expected_len = buf[2] + 3;
            }
        }

        // we have already 5-bytes ...
        data.insert(data.begin(), buf.begin(), buf.begin() + len);

        buf.clear();
        buf.resize(expected_len - data.size());

        //cout << "<-PT: expected (" << expected_len << ") buf length after clear is (" << buf.size() << ")" << endl;

        size_t available = 0;

        expected = expected_len;
        expected_len = expected_len - data.size();

        //cout << "<-PT: expected (" << expected_len << ")" << endl;

        do
        {
            expected_len = expected_len - (len = socket.read_some(boost::asio::buffer(buf), error));

            if (!error.failed())
            {
                data.insert(data.end(), buf.begin(), buf.begin() + len);
                available = socket.available();

                //cout << "<-PT: received (" << len << ") available (" << available << ") expected (" << expected_len << ")" << endl;

                if (available == 0 && expected_len > 0)
                {
                    cout << "<-PT: wait for missing bytes (" << expected_len << ")" << endl;
                    socket.wait(boost::asio::ip::tcp::socket::wait_read);
                    available = socket.available();
                }
            }
            else
                cerr << "failed=" << error.failed() << ", value=" << error.value() << ", message=" << error.message()
                     << endl;

        }
        while (available != 0);

        cout << "<-PT: received " << data.size() << " from " << expected << endl;

        from_pt.set(data.data(), data.size());
    }
    else cerr << "failed=" << error.failed() << ", value=" << error.value() << ", message=" << error.message() << endl;

    return error;
}

inline void stop_and_close_socket(bool &running, Zvt::Command &current_flow, boost::asio::ip::tcp::socket &socket)
{
    running = false;
    current_flow = Zvt::CMD_UNKNOWN;
    socket.close();
}

inline boost::system::error_code send_ack(boost::asio::ip::tcp::socket &socket)
{
    Cmd::Ack ack;
    boost::system::error_code error = write_to_socket(ack, socket);

    if (error.failed())
    {
        throw boost::system::system_error(error);
    }

    return error;
}

inline boost::system::error_code write_to_or_close_socket(Zvt::Apdu &apdu, boost::asio::ip::tcp::socket &socket, Zvt::Command &current_command_flow, bool &running)
{
    boost::system::error_code error = write_to_socket(apdu, socket);

    current_command_flow = apdu.isA();

    if (error.failed())
    {
        stop_and_close_socket(running, current_command_flow, socket);
        throw boost::system::system_error(error);
    }
    return error;
}

inline boost::system::error_code basic_register_with_status_flow(unsigned char config, Zvt::Apdu command, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    boost::system::error_code error;
    static int receipt_number = -1;

    if (command.isA(Zvt::CMD_UNKNOWN))
    {
        std::cerr << "Error: Command {" << Utils::log_hex_str(command.get()) << "} is not a command in ZVT!" << std::endl;
        stop_and_close_socket(running, current_command_flow, socket);
        return error;
    }

    Cmd::Register register_cmd(config, password);
    Cmd::Status status_cmd(0x05, password);

    if (current_command_flow == Zvt::CMD_UNKNOWN)
    {
        write_to_or_close_socket(register_cmd, socket, current_command_flow, running);
    }

    Zvt::Apdu from_pt;

    error = read_apdu_from_socket(from_pt, socket);
    from_pt.print();

    if (error == boost::asio::error::eof)
    {
        running = false;
        cout << "Exit: socket close" << endl << endl;
    }
    else if (error)
    {
        throw boost::system::system_error(error);
    }  // Some other error.
    else
    {
        switch (from_pt.isA())
        {
            case Zvt::CMD_8000:
                switch (current_command_flow)
                {
                    case Zvt::CMD_0602:
                    case Zvt::CMD_06E0:
                        stop_and_close_socket(running, current_command_flow, socket);
                        break;
                    default:
                        break;
                }
                break;
            case Zvt::CMD_060F:
            {
                send_ack(socket);

                if (current_command_flow == Zvt::CMD_0600)
                {
                    Cmd::CompletionForRegister cfr(from_pt.cmd(), from_pt.size());
                    cfr.print();

                    bitset<8> status_byte = cfr.status();

                    /**
                     *   Status-byte	Definition
                     *   xxxx xxx1 		PT initialisation necessary
                     *   xxxx xx1x 		Diagnosis necessary
                     *   xxxx x1xx		OPT action necessary
                     *   xxxx 1xxx		PT functions in filling station mode
                     *   xxx1 xxxx 		PT functions in vending machine mode
                     *   xx1x xxxx 		RFU
                     *   x1xx xxxx 		RFU
                     *   1xxx xxxx		RFU
                     */
                    switch (command.isA())
                    {
                        case Zvt::CMD_0693:
                        case Zvt::CMD_0813:
                        case Zvt::CMD_0670:
                        case Zvt::CMD_0650:
                        case Zvt::CMD_0610:
                        case Zvt::CMD_061A:
                            write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            break;
                        default:
                        {
                            if (!status_byte.test(0) && !status_byte.test(1) && !status_byte.test(2))
                            {
                                write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            }
                            else
                            {
                                cout << "Check status byte (bmp19)" << endl;
                                Utils::log(status_byte.to_ulong());

                                stop_and_close_socket(running, current_command_flow, socket);
                            }
                            break;
                        }
                    }
                }
                else if (current_command_flow == Zvt::CMD_0501)
                {
                    Cmd::CompletionForStatus cfs(from_pt.cmd(), from_pt.size());

                    cout << "<-PT: 0501 Completion with Status " << cfs.status() << endl;

                    for (auto &tag: cfs.tlv().tags())
                    {
                        cout << "<-PT: " << tag.tag_str();

                        if (tag.isPrimitive())
                            cout << " --> " << tag.data_str() << endl;
                        else
                            cout << endl;

                        for (auto &stag: tag.subtags())
                        {
                            cout << "<-PT:     " << stag.tag_str();

                            if (stag.isPrimitive())
                                cout << " --> " << stag.data_str() << endl;
                            else
                                cout << endl;
                        }
                    }

                    switch (command.isA())
                    {
                        case Zvt::CMD_0693:
                        case Zvt::CMD_0813:
                        case Zvt::CMD_0670:
                        case Zvt::CMD_0650:
                        case Zvt::CMD_0610:
                        case Zvt::CMD_061A:
                            write_to_or_close_socket(command, socket, current_command_flow, running);
                            break;
                        default:
                        {
                            if (cfs.status() == Zvt::TSC_00)
                            {
                                write_to_or_close_socket(command, socket, current_command_flow, running);

                                /**
                                 * zvt++ apdu:
                                 * The given APDU is a 0501 or 0600. Normally this will end in an endless loop.
                                 * In that case we must break the flow.
                                 */
                                if (command.isA(Zvt::CMD_0501) || command.isA(Zvt::CMD_0600))
                                {
                                    current_command_flow = Zvt::CMD_END_LOOP;
                                }
                            }
                            else
                            {
                                cout << "Check terminal status code" << endl;
                                Utils::log(cfs.status());
                                stop_and_close_socket(running, current_command_flow, socket);
                            }
                            break;
                        }
                    }
                }
                else if (current_command_flow == Zvt::CMD_0622)
                {
                    cout << "<-PT| " << "receiptNo=" << receipt_number << endl;
                    stop_and_close_socket(running, current_command_flow, socket);
                }
                else
                {
                    stop_and_close_socket(running, current_command_flow, socket);
                }

                break;
            }
            case Zvt::CMD_04FF:
            {
                Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
                interStatus.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_040F:
            {
                Cmd::StatusInfo status(from_pt.cmd(), from_pt.size());
                status.print();
                receipt_number = status.receipt_number();
                send_ack(socket);

                if (status.status() != 0x00)
                {
                    cout << "<-PT: Result code is not 0x00 " << endl;
                    cout << "<-PT: Todo send error_message for " << (int) status.status() << " (dec)!" << endl;
                    cout << "<-PT: current_command_flow==" << current_command_flow << endl;
                    cout << "<-PT: check if implemention need --> stop_and_close_socket(running, current_command_flow, socket)" << endl;
                    //stop_and_close_socket(running, current_command_flow, socket);
                }

                break;
            }
            case Zvt::CMD_06D3:
            {
                Cmd::BlockReceipt blockReceipt(from_pt.get());
                blockReceipt.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_06D1:
            {
                Cmd::PrintLine printLine(from_pt.get());
                if (printLine.isText() || printLine.isLinefeed())
                    std::cout << "<-PT|" << printLine.text() << std::endl;
                else printLine.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_8400:
            case Zvt::CMD_84xx:
            case Zvt::CMD_849C:
            case Zvt::CMD_849A:
                Utils::log("<-PT: Nack ", from_pt.cmd(), from_pt.size());
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            case Zvt::CMD_061E:
            {
                send_ack(socket);

                Cmd::Abort abort(from_pt);

                cout << "<-PT: resultCode                  : " << abort.resultCode() << endl;
                cout << "<-PT: extendedErrorCodeBinaryAsHex: " << abort.extendedErrorCodeBinaryAsHex() << " (PT manufacturer depend binary)" << endl;
                cout << "<-PT: extendedErrorMessage        : " << abort.extendedErrorMessage() << endl;

                if (current_command_flow == Zvt::CMD_0623)
                {
                    if (!abort.receiptNumbers().empty())
                    {
                        for (auto receiptNo: abort.receiptNumbers())
                            cout << "<-PT: open pre_auth receiptNo     : " << receiptNo << endl;
                    }
                }

                stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            default:
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                break;
        }
    }

    return error;
}

inline boost::system::error_code basic_register_with_status_flow(Zvt::Apdu register_cmd, Zvt::Apdu command, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    boost::system::error_code error;
    Cmd::Status status_cmd(0x05, password);

    std::cout << "using password " << password << std::endl;

    if (current_command_flow == Zvt::CMD_UNKNOWN)
    {
        write_to_or_close_socket(register_cmd, socket, current_command_flow, running);
    }

    Zvt::Apdu from_pt;

    error = read_apdu_from_socket(from_pt, socket);
    from_pt.print();

    if (error == boost::asio::error::eof)
    {
        running = false;
        cout << "Exit: socket close" << endl << endl;
    }
    else if (error)
    {
        throw boost::system::system_error(error);
    }  // Some other error.
    else
    {
        switch (from_pt.isA())
        {
            case Zvt::CMD_8000:
                switch (current_command_flow)
                {
                    case Zvt::CMD_0602:
                    case Zvt::CMD_06E0:
                        stop_and_close_socket(running, current_command_flow, socket);
                        break;
                    default:
                        break;
                }
                break;
            case Zvt::CMD_060F:
            {
                send_ack(socket);

                if (current_command_flow == Zvt::CMD_0600)
                {
                    Cmd::CompletionForRegister cfr(from_pt.cmd(), from_pt.size());
                    cfr.print();

                    bitset<8> status_byte = cfr.status();

                    /**
                     *   Status-byte	Definition
                     *   xxxx xxx1 		PT initialisation necessary
                     *   xxxx xx1x 		Diagnosis necessary
                     *   xxxx x1xx		OPT action necessary
                     *   xxxx 1xxx		PT functions in filling station mode
                     *   xxx1 xxxx 		PT functions in vending machine mode
                     *   xx1x xxxx 		RFU
                     *   x1xx xxxx 		RFU
                     *   1xxx xxxx		RFU
                     */
                    switch (command.isA())
                    {
                        case Zvt::CMD_0693:
                        case Zvt::CMD_0813:
                        case Zvt::CMD_0670:
                        case Zvt::CMD_0650:
                        case Zvt::CMD_0610:
                        case Zvt::CMD_061A:
                            write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            break;
                        default:
                        {
                            if (!status_byte.test(0) && !status_byte.test(1) && !status_byte.test(2))
                            {
                                write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            }
                            else
                            {
                                cout << "Check status byte (bmp19)" << endl;
                                Utils::log(status_byte.to_ulong());

                                stop_and_close_socket(running, current_command_flow, socket);
                            }
                            break;
                        }
                    }
                }
                else if (current_command_flow == Zvt::CMD_0501)
                {
                    Cmd::CompletionForStatus cfs(from_pt.cmd(), from_pt.size());

                    cout << "<-PT: 0501 Completion with Status " << cfs.status() << endl;

                    for (auto &tag: cfs.tlv().tags())
                    {
                        cout << "<-PT: " << tag.tag_str();

                        if (tag.isPrimitive())
                            cout << " --> " << tag.data_str() << endl;
                        else
                            cout << endl;

                        for (auto &stag: tag.subtags())
                        {
                            cout << "<-PT:     " << stag.tag_str();

                            if (stag.isPrimitive())
                                cout << " --> " << stag.data_str() << endl;
                            else
                                cout << endl;
                        }
                    }

                    switch (command.isA())
                    {
                        case Zvt::CMD_0693:
                        case Zvt::CMD_0813:
                        case Zvt::CMD_0670:
                        case Zvt::CMD_0650:
                        case Zvt::CMD_0610:
                        case Zvt::CMD_061A:
                            write_to_or_close_socket(command, socket, current_command_flow, running);
                            break;
                        default:
                        {
                            if (cfs.status() == Zvt::TSC_00)
                            {
                                write_to_or_close_socket(command, socket, current_command_flow, running);

                                /**
                                 * zvt++ apdu:
                                 * The given APDU is a 0501 or 0600. Normally this will end in an endless loop.
                                 * In that case we must break the flow.
                                 */
                                if (command.isA(Zvt::CMD_0501) || command.isA(Zvt::CMD_0600))
                                {
                                    current_command_flow = Zvt::CMD_END_LOOP;
                                }
                            }
                            else
                            {
                                cout << "Check terminal status code" << endl;
                                Utils::log(cfs.status());
                                stop_and_close_socket(running, current_command_flow, socket);
                            }
                            break;
                        }
                    }
                }
                else
                {
                    stop_and_close_socket(running, current_command_flow, socket);
                }

                break;
            }
            case Zvt::CMD_04FF:
            {
                Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
                interStatus.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_040F:
            {
                Cmd::StatusInfo status(from_pt.cmd(), from_pt.size());
                status.print();
                send_ack(socket);

                if (status.status() != 0x00)
                {
                    cout << "<-PT: Result code is not 0x00 " << endl;
                    cout << "<-PT: Todo send error_message for " << (int) status.status() << " (dec)!" << endl;
                    cout << "<-PT: current_command_flow==" << current_command_flow << endl;
                    cout << "<-PT: check if implemention need --> stop_and_close_socket(running, current_command_flow, socket)" << endl;
                    //stop_and_close_socket(running, current_command_flow, socket);
                }

                break;
            }
            case Zvt::CMD_06D3:
            {
                Cmd::BlockReceipt blockReceipt(from_pt.get());
                blockReceipt.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_06D1:
            {
                Cmd::PrintLine printLine(from_pt.get());
                if (printLine.isText() || printLine.isLinefeed())
                    std::cout << "<-PT|" << printLine.text() << std::endl;
                else printLine.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_8400:
            case Zvt::CMD_84xx:
            case Zvt::CMD_849C:
            case Zvt::CMD_849A:
                Utils::log("<-PT: Nack ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            case Zvt::CMD_061E:
            {
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            default:
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                break;
        }
    }

    return error;
}

inline boost::system::error_code basic_register_with_status_flow(Zvt::Apdu command, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    unsigned char config = 0x9e;
    return basic_register_with_status_flow(config, command, current_command_flow, socket, running);
}

inline boost::system::error_code initialisation_flow(Cmd::Initialisation initCmd, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(initCmd, current_command_flow, socket, running);
}

inline boost::system::error_code config_feig_flow(std::string password, std::string ip, int port, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::ConfigFeig(password, ip, port, 0x01), current_command_flow, socket, running);
}

inline boost::system::error_code auth_flow(unsigned long amount, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::Auth(amount), current_command_flow, socket, running);
}

inline boost::system::error_code auth_flow_with_04ff(unsigned long amount, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::Register(0x9e), Cmd::Auth(amount), current_command_flow, socket, running);
}

inline boost::system::error_code feig_auth_flow_with_04ff(unsigned long amount, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::FeigRegister(), Cmd::Auth(amount), current_command_flow, socket, running);
}

inline boost::system::error_code auth_pp(unsigned long amount, std::string data1F63, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(0x9e, Cmd::PPAuth(amount, 0x44, std::vector<unsigned char>(data1F63.begin(), data1F63.end())), current_command_flow, socket, running);
}

inline boost::system::error_code auth_pp(unsigned long amount, std::string payment_type, std::string data1F63, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(0x9e, Cmd::PPAuth(amount, std::stoi(payment_type), std::vector<unsigned char>(data1F63.begin(), data1F63.end())), current_command_flow, socket, running);
}

inline boost::system::error_code end_of_day_flow(const unsigned char mode, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::EndOfDay(password, mode), current_command_flow, socket, running);
}

inline boost::system::error_code end_of_day_flow(Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return end_of_day_flow(Cmd::EndOfDay::NORMAL, current_command_flow, socket, running);
}

inline boost::system::error_code diagnosis_flow(Zvt::DiagnosisType diagnosisType, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::Diagnosis(diagnosisType), current_command_flow, socket, running);
}

inline boost::system::error_code print_system_config(Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::PrintSystemConfig(), current_command_flow, socket, running);
}

inline boost::system::error_code repeat_receipt(Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::RepeatReceipt(), current_command_flow, socket, running);
}

inline boost::system::error_code turnover_totals(Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(Cmd::TurnoverTotals(), current_command_flow, socket, running);
}

inline boost::system::error_code apdu_from_hex(std::string hex_str, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    Zvt::HexToByte hex_data(hex_str);
    return basic_register_with_status_flow(Zvt::Apdu(hex_data.vector()), current_command_flow, socket, running);
}

inline boost::system::error_code apdu_ctls_wait_loop(std::string hex_str, bool loop, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    boost::system::error_code error;
    Zvt::HexToByte hex_data(hex_str);
    Zvt::Apdu command(hex_data.vector());

    if (command.isA(Zvt::CMD_UNKNOWN))
    {
        std::cerr << "Error: Command {" << hex_str << "} is not a command in ZVT!" << std::endl;
        stop_and_close_socket(running, current_command_flow, socket);
        return error;
    }

    Cmd::Register register_cmd(0x9e, password);
//Status(const unsigned char, const std::string password, Zvt::Tlv tlv);
    Zvt::Tlv status_tlv;
    status_tlv.add(Zvt::Tag(0x1f, 0x72, {0x01}));

    Cmd::Status status_cmd(0x05, password, status_tlv);


    if (current_command_flow == Zvt::CMD_UNKNOWN)
    {
        write_to_or_close_socket(register_cmd, socket, current_command_flow, running);
    }

    Zvt::Apdu from_pt;

    error = read_apdu_from_socket(from_pt, socket);
    from_pt.print();

    if (error == boost::asio::error::eof)
    {
        running = false;
        cout << "Exit: socket close" << endl << endl;
    }
    else if (error)
    {
        throw boost::system::system_error(error);
    }  // Some other error.
    else
    {
        switch (from_pt.isA())
        {
            case Zvt::CMD_8000:
                switch (current_command_flow)
                {
                    case Zvt::CMD_0602:
                    case Zvt::CMD_06E0:
                        stop_and_close_socket(running, current_command_flow, socket);
                        break;
                    default:
                        break;
                }
                break;
            case Zvt::CMD_060F:
            {
                send_ack(socket);

                if (current_command_flow == Zvt::CMD_0600)
                {
                    Cmd::CompletionForRegister cfr(from_pt.cmd(), from_pt.size());
                    cfr.print();

                    bitset<8> status_byte = cfr.status();

/**
 *   Status-byte	Definition
 *   xxxx xxx1 		PT initialisation necessary
 *   xxxx xx1x 		Diagnosis necessary
 *   xxxx x1xx		OPT action necessary
 *   xxxx 1xxx		PT functions in filling station mode
 *   xxx1 xxxx 		PT functions in vending machine mode
 *   xx1x xxxx 		RFU
 *   x1xx xxxx 		RFU
 *   1xxx xxxx		RFU
 */
                    switch (command.isA())
                    {
                        case Zvt::CMD_0693:
                        case Zvt::CMD_0813:
                        case Zvt::CMD_0670:
                        case Zvt::CMD_0650:
                        case Zvt::CMD_0610:
                        case Zvt::CMD_061A:
                            write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            break;
                        default:
                        {
                            if (!status_byte.test(0) && !status_byte.test(1) && !status_byte.test(2))
                            {
                                write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                            }
                            else
                            {
                                cout << "Check status byte (bmp19)" << endl;
                                Utils::log(status_byte.to_ulong());

                                stop_and_close_socket(running, current_command_flow, socket);
                            }
                            break;
                        }
                    }
                }
                else if (current_command_flow == Zvt::CMD_0501)
                {
                    Cmd::CompletionForStatus cfs(from_pt.cmd(), from_pt.size());

                    cout << "<-PT: 0501 Completion with Status " << cfs.status() << endl;

                    for (auto &tag: cfs.tlv().tags())
                    {
                        cout << "<-PT: " << tag.tag_str();

                        if (tag.isPrimitive())
                            cout << " --> " << tag.data_str() << endl;
                        else
                            cout << endl;

                        for (auto &stag: tag.subtags())
                        {
                            cout << "<-PT:     " << stag.tag_str();

                            if (stag.isPrimitive())
                                cout << " --> " << stag.data_str() << endl;
                            else
                                cout << endl;
                        }
                    }

                    if (cfs.tlv().find("60").size() > 0)
                    {
                        cout << "<-PT: 0501 Completion with card present on tap field " << endl;
                        write_to_or_close_socket(command, socket, current_command_flow, running);
                    }
                    else
                    {
                        if (!loop)
                            stop_and_close_socket(running, current_command_flow, socket);
                        else
                            write_to_or_close_socket(status_cmd, socket, current_command_flow, running);
                    }
                }
                else stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            case Zvt::CMD_04FF:
            {
                Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
                interStatus.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_040F:
            {
                Cmd::StatusInfo status(from_pt.cmd(), from_pt.size());
                status.print();
                send_ack(socket);

                if (status.status() != 0x00)
                {
                    cout << "<-PT: Result code is not 0x00 " << endl;
                    cout << "<-PT: Todo send error_message for " << (int) status.status() << " (dec)!" << endl;
                    cout << "<-PT: current_command_flow==" << current_command_flow << endl;
                    cout << "<-PT: check if implemention need --> stop_and_close_socket(running, current_command_flow, socket)" << endl;
                    //stop_and_close_socket(running, current_command_flow, socket);
                }
                cout << "******" << endl << "receiptNo=" << status.receipt_number() << endl << "******" << endl;
                break;
            }
            case Zvt::CMD_06D3:
            {
                Cmd::BlockReceipt blockReceipt(from_pt.get());
                blockReceipt.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_06D1:
            {
                Cmd::PrintLine printLine(from_pt.get());
                if (printLine.isText() || printLine.isLinefeed())
                    std::cout << "<-PT|" << printLine.text() << std::endl;
                else printLine.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_8400:
            case Zvt::CMD_84xx:
            case Zvt::CMD_849C:
            case Zvt::CMD_849A:
                Utils::log("<-PT: Nack ", from_pt.cmd(), from_pt.size());
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            case Zvt::CMD_061E:
            {
                send_ack(socket);

                Cmd::Abort abort(from_pt);

                cout << "<-PT: resultCode                  : " << abort.resultCode() << endl;
                cout << "<-PT: extendedErrorCodeBinaryAsHex: " << abort.extendedErrorCodeBinaryAsHex() << " (PT manufacturer depend binary)" << endl;
                cout << "<-PT: extendedErrorMessage        : " << abort.extendedErrorMessage() << endl;

                if (current_command_flow == Zvt::CMD_0623)
                {
                    if (!abort.receiptNumbers().empty())
                    {
                        for (auto receiptNo: abort.receiptNumbers())
                            cout << "<-PT: open pre_auth receiptNo     : " << receiptNo << endl;
                    }
                }

                stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            default:
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                break;
        }
    }

    return error;
}

inline boost::system::error_code single_apdu_from_hex(std::string hex_str, bool loop, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    boost::system::error_code error;
    Zvt::HexToByte hex_data(hex_str);
    Zvt::Apdu command(hex_data.vector());

    if (command.isA(Zvt::CMD_UNKNOWN))
    {
        std::cerr << "Error: Command {" << hex_str << "} is not a command in ZVT!" << std::endl;
        stop_and_close_socket(running, current_command_flow, socket);
        return error;
    }

    if (current_command_flow == Zvt::CMD_UNKNOWN)
    {
        write_to_or_close_socket(command, socket, current_command_flow, running);
    }

    Zvt::Apdu from_pt;

    error = read_apdu_from_socket(from_pt, socket);
    from_pt.print();

    if (error == boost::asio::error::eof)
    {
        running = false;
        cout << "Exit: socket close" << endl << endl;
    }
    else if (error)
    {
        throw boost::system::system_error(error);
    }  // Some other error.
    else
    {
        switch (from_pt.isA())
        {
            case Zvt::CMD_8000:
                switch (current_command_flow)
                {
                    case Zvt::CMD_0602:
                    case Zvt::CMD_06E0:
                        stop_and_close_socket(running, current_command_flow, socket);
                        break;
                    default:
                        break;
                }
                break;
            case Zvt::CMD_060F:
            {
                send_ack(socket);
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            case Zvt::CMD_04FF:
            {
                Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
                interStatus.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_040F:
            {
                Cmd::StatusInfo status(from_pt.cmd(), from_pt.size());
                status.print();
                send_ack(socket);

                if (status.status() != 0x00)
                {
                    cout << "<-PT: Result code is not 0x00 " << endl;
                    cout << "<-PT: Todo send error_message for " << (int) status.status() << " (dec)!" << endl;
                }
                cout << "******" << endl << "receiptNo=" << status.receipt_number() << endl << "******" << endl;
                break;
            }
            case Zvt::CMD_06D3:
            {
                Cmd::BlockReceipt blockReceipt(from_pt.get());
                blockReceipt.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_06D1:
            {
                Cmd::PrintLine printLine(from_pt.get());
                if (printLine.isText() || printLine.isLinefeed())
                    std::cout << "<-PT|" << printLine.text() << std::endl;
                else printLine.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_8400:
            case Zvt::CMD_84xx:
            case Zvt::CMD_849C:
            case Zvt::CMD_849A:
                Utils::log("<-PT: Nack ", from_pt.cmd(), from_pt.size());
                stop_and_close_socket(running, current_command_flow, socket);
                break;
            case Zvt::CMD_061E:
            {
                send_ack(socket);

                Cmd::Abort abort(from_pt);

                cout << "<-PT: resultCode                  : " << abort.resultCode() << endl;
                cout << "<-PT: extendedErrorCodeBinaryAsHex: " << abort.extendedErrorCodeBinaryAsHex() << " (PT manufacturer depend binary)" << endl;
                cout << "<-PT: extendedErrorMessage        : " << abort.extendedErrorMessage() << endl;

                if (current_command_flow == Zvt::CMD_0623)
                {
                    if (!abort.receiptNumbers().empty())
                    {
                        for (auto receiptNo: abort.receiptNumbers())
                            cout << "<-PT: open pre_auth receiptNo     : " << receiptNo << endl;
                    }
                }

                stop_and_close_socket(running, current_command_flow, socket);
                break;
            }
            default:
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                break;
        }
    }

    return error;
}

inline boost::system::error_code apdu_ctls_wait_loop(std::string hex_str, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return apdu_ctls_wait_loop(hex_str, false, current_command_flow, socket, running);
}

inline boost::system::error_code single_apdu_from_hex(std::string hex_str, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return single_apdu_from_hex(hex_str, false, current_command_flow, socket, running);
}

inline boost::system::error_code reversal_flow(Cmd::Reversal reversalCmd, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    return basic_register_with_status_flow(reversalCmd, current_command_flow, socket, running);
}

inline std::stringstream settings(filesystem::path settings)
{
    stringstream content;

    if (filesystem::exists(settings))
    {
        fstream settingsFile(settings);

        if (settingsFile) content << settingsFile.rdbuf();
    }

    return content;
}

inline std::vector<Json::Host> apply_settings(std::filesystem::path path)
{
    std::vector<Json::Host> hosts;

    if (std::filesystem::exists(path))
    {
        stringstream content = settings(path);
        if (content.good())
        {
            boost::json::value hostsJson = boost::json::parse(content.str());
            hosts = boost::json::value_to<std::vector<Json::Host>>(hostsJson.at("hosts"));

            for (const auto &item: hosts)
            {
                cout << "apply_settings: name=" << item.name() << endl;
                cout << "apply_settings: host=" << item.host() << endl;
                cout << "apply_settings: port=" << item.port() << endl;
            }
        }
    }

    return hosts;
}

inline void parse_emv(const std::string filename)
{
    std::ifstream ifs(filename);
    std::stringstream buffer;
    EmvTagConverter emvTagConverter;

    buffer << ifs.rdbuf();
    //cout << "Length: " << buffer.str().length() << endl;
    //cout << buffer.str() << endl;
    Utils::log(Zvt::Tlv::calculateSize(buffer.str().size()));

    //Zvt::Tlv tlv(Zvt::HexToByte(buffer.str()).vector());
    //Utils::crawl_tlv_tags(tlv, emvTagConverter);

    Zvt::Tlv t1;

    t1.set(Zvt::HexToByte(buffer.str()).vector());
    Utils::crawl_tlv_tags(t1, emvTagConverter);
}

inline void parse_gicc55(const std::string filename)
{
    std::ifstream ifs(filename);
    if (ifs)
    {
        std::stringstream buffer;

        buffer << ifs.rdbuf();
        //cout << "Length: " << buffer.str().length() << endl;
        //cout << buffer.str() << endl;
        //Utils::log("gicc 55:\n", buffer.str());

        std::vector<unsigned char> bmp55 = Zvt::HexToByte(buffer.str()).vector();

        Utils::log_int("gicc 55: length of bmp55 is ", bmp55.size());

        if (bmp55.size() >= 3)
        {
            std::stringstream ss;

            for (int idx = 0; idx < bmp55.size(); ++idx)
            {
                int offset = 3;
                //length
                vector<unsigned char>::const_iterator first = bmp55.begin() + idx;
                vector<unsigned char>::const_iterator last = bmp55.begin() + idx + offset;
                vector<unsigned char> lv(first, last);

                if (lv.size() == offset)
                {
                    ss << Utils::hex_str_short(lv);
                    //Utils::log("gicc 55: ", Utils::hex_str_short(lv));

                    int f0 = (lv[0] &= ~(0xf0)) * 100;
                    int f1 = (lv[1] &= ~(0xf0)) * 10;
                    int f2 = lv[2] &= ~(0xf0);

                    ss << " (" << std::setw(2) << std::setfill(' ') << (f0 + f1 + f2) << ")" << "\t\t";

                    // subfield
                    first = bmp55.begin() + idx + offset;
                    last = bmp55.begin() + idx + offset + 2;

                    vector<unsigned char> lsf(first, last);
                    ss << Utils::hex_str_short(lsf);
                    //Utils::log("gicc 55: ", Utils::hex_str_short(lsf));

                    if (lsf.size() == 2)
                    {
                        int s0 = (lsf[0] &= ~(0xf0)) * 10;
                        int s1 = lsf[1] &= ~(0xf0);

                        ss << " (" << std::setw(2) << std::setfill(' ') << (s0 + s1) << ")" << "\t\t";
                    }
                    else std::cerr << "Error, wrong BMP subfield data..." << std::endl;
                    // data
                    first = bmp55.begin() + idx + offset + 2;
                    offset = offset + f0 + f1 + f2;
                    last = bmp55.begin() + idx + offset;

                    //Utils::log_int("f0=", f0, ", ");
                    //Utils::log_int("f1=", f1, ", ");
                    //Utils::log_int("f2=", f2, ", ");
                    //Utils::log_int("offset=", offset, "");

                    vector<unsigned char> ldv(first, last);
                    ss << std::setw(3) << std::setfill('.')
                       << (f0 + f1 + f2 - 2) << " "
                       << Utils::hex_str_short(ldv) << std::endl;
                    //Utils::log("gicc 55: ", Utils::hex_str_short(ldv));
                    //std::cout << std::endl;
                }
                else std::cerr << "Error, wrong LLL Var length of size..." << std::endl;

                idx = idx + offset - 1;
                //Utils::log_int("index=", idx);
            }

            std::cout << ss.str();
        }
    }
    else std::cerr << "File with name {" << filename << "} does not exist!" << std::endl;
    //Zvt::Tlv tlv(Zvt::HexToByte(buffer.str()).vector());
    //Utils::crawl_tlv_tags(tlv, emvTagConverter);
}

/*
 *
 * ios oldState(nullptr);
 * oldState.copyfmt(cout);
 *
 * for (Zvt::Tag tag : tlv.tags())
 * {
 *      cout << "Tag: " << setw(6) << setfill('_') << left
 *              << tag.tag_str() << right << "  λ "
 *              << setw(4) << setfill('.') << tag.data().size() << endl;
 *
 *      crawl_tlv_tags(tag, 0, converter);
 *  }
 *
 *  cout.copyfmt(oldState);
 */

inline void parse_emv_build_nexo(const std::string file_ini, const std::string outfile)
{
    ios oldState(nullptr);
    oldState.copyfmt(cout);

    EmvTagConverter emvTagConverter;
    boost::property_tree::ptree pt;
    boost::property_tree::ini_parser::read_ini(file_ini, pt);

    Zvt::Tlv nexo_emv;

    std::shared_ptr<Zvt::Tag> templ = NULL;
    std::shared_ptr<Zvt::Tag> bf01 = NULL;
    std::vector<std::shared_ptr<Zvt::Tag>> bf02s;

    for (auto &section: pt)
    {
        string tn;
        int width;

        int fpos = section.first.find_first_of("::");
        int lpos = section.first.find_last_of("::");

        // One byte template like E0, E1, E2, Ex
        if (section.first.find("::") == std::string::npos)
        {
            tn = Utils::upper(section.first);
            width = 4;
            cout << setw(width) << left;
            cout << tn << endl;

            if (templ)
            {
                nexo_emv.add(templ->get());
                templ.reset(new Zvt::Tag(tn));
            }
            else templ = std::shared_ptr<Zvt::Tag>(new Zvt::Tag(tn));

            crawl_init_tree(templ, width, section.second);

            // special case of BF02 deeper levels
            if (section.first.find("EE") != std::string::npos)
            {
                for (auto &forward: pt)
                {
                    if (forward.first.find_last_of("::") - forward.first.find_first_of("::") > 1)
                    {
                        //cout << setw(width) << left;
                        //cout << "Forward BF02 check: " << forward.first << "(";
                        std::shared_ptr<Zvt::Tag> bf02 = std::shared_ptr<Zvt::Tag>(new Zvt::Tag(string("BF02")));

                        for (auto &forwardBf02: forward.second)
                        {
                            Zvt::HexToByte data_as_hex(forwardBf02.second.data());
                            Zvt::Tag tag(forwardBf02.first, data_as_hex.vector());

                            bf02->append(tag.get());
                            bf02s.push_back(bf02);
                            //cout << bf02->tag_str() << "=" << forwardBf02.second.data() << ";";
                        }
                        //cout << ")" << endl;
                    }
                }
            }
        }
        else if (section.first.find("E6") != std::string::npos)
        {
            tn = "E6";
            width = 4;
            cout << setw(width) << left;
            cout << tn << endl;

            if (templ)
            {
                nexo_emv.add(templ->get());
                templ.reset(new Zvt::Tag(tn));
            }
            else templ = std::shared_ptr<Zvt::Tag>(new Zvt::Tag(tn));

            crawl_init_tree(templ, width, section.second);
        }
            // only one '::' level
        else if (lpos - fpos == 1)
        {
            tn = "BF01";
            width = 10;
            cout << setw(width) << right;
            cout << tn << ":" << endl;

            bf01 = std::shared_ptr<Zvt::Tag>(new Zvt::Tag(tn));
            crawl_init_tree(bf01, width, section.second);

            if (section.first.find("EE") != std::string::npos)
            {
                for (std::shared_ptr<Zvt::Tag> bf02: bf02s)
                {
                    bf01->append(bf02->get());
                    width = 22;
                    cout << setw(width) << right;
                    cout << bf02->tag_str() << ": " << endl;

                    for (auto &st: bf02->subtags())
                    {
                        cout << setw(width + 6) << right << st.tag_str() << ": "
                             << Utils::log_hex_str(st.data()) << endl;
                    }

                    bf02.reset();
                }
            }

            templ->append(bf01->get());
            bf01.reset();
        }
        else
        {
            // deeper values for BF02 in EE is recognized. All other should raise an error message
            if (lpos - fpos > 1 && section.first.find("EE") == std::string::npos)
                cerr << "uncaught if statement for " << section.first << endl;
        }
    }

    nexo_emv.add(templ->get());

    if (templ) templ.reset();
    if (bf01) bf01.reset();

    cout.copyfmt(oldState);

    if (outfile.empty())
        cout << Utils::log_hex_str(nexo_emv.get()) << endl;
    else
    {
        std::ofstream out(outfile);
        out << Utils::log_hex_str(nexo_emv.get());
    }
}

inline void crawl_init_tree(std::shared_ptr<Zvt::Tag> &tpl, int width, boost::property_tree::basic_ptree<basic_string<char>, basic_string<char>> section)
{
    try
    {
        for (auto &item: section)
        {
            string tg = item.first;
            string val = item.second.data().empty() ? string() : item.second.data();

            if (tg.find("-") != std::string::npos)
            {
                tg = tg.substr(0, tg.find_first_of("-"));
            }

            tg = Utils::upper(tg);

            cout << setw(width) << " " << setw(6) << left << tg << ": " << setw(64) << left << val << endl;

            Zvt::HexToByte data_as_hex(val);
            Zvt::Tag tag(tg, data_as_hex.vector());
            //cout << " " << Utils::log_hex_str(tag.get()) << endl;
            tpl->append(tag.get());
        }
    }
    catch (std::exception e)
    {
        cerr << e.what() << endl;
    }
}

inline boost::system::error_code ctls_card_wait_flow(Zvt::Apdu command, vector<Zvt::Apdu> &store, Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    boost::system::error_code error;

    if (command.isA() != current_command_flow)
        write_to_or_close_socket(command, socket, current_command_flow, running);

    Zvt::Apdu from_pt;

    error = read_apdu_from_socket(from_pt, socket);
    from_pt.print();
    from_pt.flow(current_command_flow);

    if (error)
    {
        running = false;
        cout << "Exit: socket close" << endl << endl;
    }
    else
    {
        switch (from_pt.isA())
        {
            case Zvt::CMD_8000:
            {
                switch (current_command_flow)
                {
                    case Zvt::CMD_0602:
                    case Zvt::CMD_06E0:
                        stop_and_close_socket(running, current_command_flow, socket);
                        break;
                    default:
                        break;
                }
                break;
            }
            case Zvt::CMD_060F:
            {
                send_ack(socket);

                if (current_command_flow == Zvt::CMD_0600)
                {
                    Cmd::CompletionForRegister cfr(from_pt.cmd(), from_pt.size());
                    cfr.print();

                    bitset<8> status_byte = cfr.status();

                    /**
                     *   Status-byte	Definition
                     *   xxxx xxx1 		PT initialisation necessary
                     *   xxxx xx1x 		Diagnosis necessary
                     *   xxxx x1xx		OPT action necessary
                     *   xxxx 1xxx		PT functions in filling station mode
                     *   xxx1 xxxx 		PT functions in vending machine mode
                     *   xx1x xxxx 		RFU
                     *   x1xx xxxx 		RFU
                     *   1xxx xxxx		RFU
                     */
                    if (status_byte.test(0))
                        error.assign(1, registerErrorCategory);
                    else if (status_byte.test(1))
                        error.assign(2, registerErrorCategory);
                    else if (status_byte.test(2))
                        error.assign(3, registerErrorCategory);
                    else current_command_flow = Zvt::CMD_CTLS_START_WAITING;
                }
                else if (current_command_flow == Zvt::CMD_0501)
                {
                    current_command_flow = Zvt::CMD_CTLS_WAITING;

                    Cmd::CompletionForStatus cfs(from_pt.cmd(), from_pt.size());

                    cout << "<-PT: 0501 Completion with Status " << cfs.status() << endl;

                    cfs.flow(current_command_flow);

                    Zvt::Tlv tlv = cfs.tlv();

                    for (Zvt::Tag tag: tlv.tags())
                    {
                        if (tag.tag_str() == "60")
                        {
                            cfs.print();
                            current_command_flow = Zvt::CMD_CTLS_CARD_PRESENT;
                            store.push_back(cfs);
                            break;
                        }
                    }

                    cout << "<-PT: 0501 Completion with Status " << cfs.status() << endl;

                    for (auto &tag: cfs.tlv().tags())
                    {
                        cout << "<-PT: " << tag.tag_str();

                        if (tag.isPrimitive())
                            cout << " --> " << tag.data_str() << endl;
                        else
                            cout << endl;

                        for (auto &stag: tag.subtags())
                        {
                            cout << "<-PT:     " << stag.tag_str();

                            if (stag.isPrimitive())
                                cout << " --> " << stag.data_str() << endl;
                            else
                                cout << endl;
                        }
                    }

                    error.assign(cfs.status(), statusEnquiryErrorCategory);
                }
                else if (current_command_flow == Zvt::CMD_0622)
                {
                    store.push_back(from_pt);
                    current_command_flow = Zvt::CMD_CTLS_CARD_PREAUTH_COMPLETION;
                }
                else if (current_command_flow == Zvt::CMD_0624)
                {
                    store.push_back(from_pt);
                    current_command_flow = Zvt::CMD_CTLS_CARD_BOOK_TOTAL_COMPLETION;
                }
                break;
            }
            case Zvt::CMD_04FF:
            {
                Cmd::IntermediateStatusInfo interStatus(from_pt.cmd(), from_pt.size());
                interStatus.print();
                send_ack(socket);
                break;
            }
            case Zvt::CMD_040F:
            {
                Cmd::StatusInfo status(from_pt.cmd(), from_pt.size());
                status.print();
                status.flow(current_command_flow);
                send_ack(socket);
                error.assign(status.status(), statusErrorCategory);
                if (from_pt.flow() == Zvt::CMD_0622)
                    current_command_flow = Zvt::CMD_CTLS_CARD_PREAUTH_STATUS;
                //else if(from_pt.flow() == Zvt::CMD_0624)
                //    current_command_flow = Zvt::CMD_CTLS_CARD_PREAUTH_STATUS;
                store.push_back(status);
                break;
            }
            case Zvt::CMD_06D3:
            {
                Cmd::BlockReceipt blockReceipt(from_pt.get());
                blockReceipt.print();
                blockReceipt.flow(current_command_flow);
                send_ack(socket);
                store.push_back(blockReceipt);
                break;
            }
            case Zvt::CMD_06D1:
            {
                Cmd::PrintLine printLine(from_pt.get());
                printLine.flow(current_command_flow);
                if (printLine.isText() || printLine.isLinefeed())
                    std::cout << "<-PT|" << printLine.text() << std::endl;
                else printLine.print();
                send_ack(socket);
                store.push_back(printLine);
                break;
            }
            case Zvt::CMD_8400:
            case Zvt::CMD_84xx:
            case Zvt::CMD_849C:
            case Zvt::CMD_849A:
            {
                Utils::log("<-PT: Nack ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                error.assign(1, nAckErrorCategory);
                break;
            }
            case Zvt::CMD_061E:
            {
                Cmd::Abort abort(from_pt);

                Utils::log("<-PT: ", from_pt.cmd(), from_pt.size());

                std::cout << "<-PT: Abort (061E)" << std::endl;
                std::cout << "<-PT: 1F16             : " << abort.extendedErrorCodeBinaryAsHex() << std::endl;
                std::cout << "<-PT: 1F17             : " << abort.extendedErrorMessage() << std::endl;
                std::cout << "<-PT:" << endl;

                if (current_command_flow == Zvt::CMD_0623)
                {
                    if (!abort.receiptNumbers().empty())
                    {
                        for (auto receiptNo: abort.receiptNumbers())
                            cout << "<-PT: open pre_auth receiptNo     : " << receiptNo << endl;
                    }
                }

                send_ack(socket);
                store.push_back(from_pt);
                switch (current_command_flow)
                {
                    case Zvt::CMD_0622:
                        current_command_flow = Zvt::CMD_CTLS_CARD_PREAUTH_ABORT;
                        break;
                    case Zvt::CMD_0624:
                        current_command_flow = Zvt::CMD_CTLS_CARD_BOOK_TOTAL_ABORT;
                        break;
                    default:
                        break;
                }
                break;
            }
            default:
            {
                Utils::log("<-PT: !!! todo -> ", from_pt.cmd(), from_pt.size());
                send_ack(socket);
                break;
            }
        }
    }

    return error;
}

inline void ctls_card_wait_flow(Zvt::Command &current_command_flow, int amount_in_cent, boost::asio::ip::tcp::socket &socket, bool &running)
{
    std::cout << "using password " << password << std::endl;
    vector<Zvt::Apdu> store;

    boost::system::error_code error;
    //const std::string password, unsigned char config, std::vector<unsigned char> currency_code, unsigned char service, Zvt::Tlv tlv
    Cmd::Register login(password, 0x9e, {0x09, 0x78}, 0x03, Zvt::Tlv());
    Cmd::LogOff logoff(password);

    Zvt::Tlv statusTlv;
    statusTlv.add(Zvt::Tag(0x1F, 0x72, {0x01}));

    Cmd::Status status(0x05, password, statusTlv);

    Zvt::HexToByte hex0622("0622 07 " + Utils::intToAmountBmp04(amount_in_cent));
    Zvt::Apdu preAuth(hex0622.vector());
    Zvt::Apdu bookTotal(0x06, 0x24);

    //register
    int test = 0;
    while (running)
    {
        if (!error)
        {
            cout << "<-PT* ctls_card_wait_flow current apdu is {"
                 << Zvt::Apdu::commandName(current_command_flow)
                 << "}"
                 << endl;
            switch (current_command_flow)
            {
                case Zvt::CMD_0600:
                case Zvt::CMD_UNKNOWN:
                {
                    error = ctls_card_wait_flow(login, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_0501:
                {
                    error = ctls_card_wait_flow(status, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_CTLS_START_WAITING:
                {
                    store.clear();
                    if (test == 40) stop_and_close_socket(running, current_command_flow, socket);
                    else error = ctls_card_wait_flow(status, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_CTLS_WAITING:
                {
                    current_command_flow = Zvt::CMD_CTLS_START_WAITING;
                    test++;
                    break;
                }
                case Zvt::CMD_CTLS_CARD_PRESENT:
                {
                    cout << "<-PT* ctls_card_wait_flow found card {"
                         << Zvt::Apdu::commandName(current_command_flow)
                         << "} start next command "
                         << endl;
                    Zvt::Apdu cmd0622(0x06, 0x22);
                    cmd0622.addBmp(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amount_in_cent, 6)));
                    ctls_card_wait_flow(preAuth, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_0622:
                {
                    cout << "<-PT* ctls_card_wait_flow PreAuth {"
                         << Zvt::Apdu::commandName(current_command_flow)
                         << "}"
                         << endl;
                    ctls_card_wait_flow(preAuth, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_CTLS_CARD_PREAUTH_STATUS:
                {
                    current_command_flow = Zvt::CMD_0622;
                    ctls_card_wait_flow(preAuth, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_CTLS_CARD_PREAUTH_COMPLETION:
                {
                    int receiptNo = -1;

                    for (Zvt::Apdu apdu: store)
                    {
                        if (apdu.isA(Zvt::CMD_040F))
                        {
                            Cmd::StatusInfo info(apdu.get());
                            info.flow(apdu.flow());
                            std::string trace = Zvt::Bmp::BCDToString(Zvt::Bmp::NumberToBCD(info.trace(), 2));
                            std::string receipt_no = Zvt::Bmp::BCDToString(Zvt::Bmp::NumberToBCD(info.receipt_number(), 2));
                            std::string flow = Zvt::Apdu::commandName(apdu.flow());
                            std::string cmd = Zvt::Apdu::commandName(apdu.isA());

                            receiptNo = info.receipt_number();

                            cout << "<-PT* ctls_card_wait_flow PreAuthCompletion {"
                                 << "apdu : " << cmd << ", "
                                 << "flow : " << flow << ", "
                                 << "trace : " << trace << ", "
                                 << "receipt_no : " << receipt_no << "}"
                                 << endl;
                        }
                        else
                        {
                            cout << "<-PT* ctls_card_wait_flow PreAuthCompletion {"
                                 << "apdu : " << Zvt::Apdu::commandName(apdu.isA()) << ", "
                                 << "flow : " << Zvt::Apdu::commandName(apdu.flow())
                                 << endl;
                        }
                    }

                    stop_and_close_socket(running, current_command_flow, socket);
                    /**
                     * Never ending loop, demo only...
                     * if (receiptNo > -1)
                     * {
                     *      test = 0;
                     *      int amountInCent = 1555;
                     *
                     *      Zvt::Apdu cmd0624(0x06, 0x24);
                     *      cmd0624.flow(current_command_flow);
                     *      cmd0624.addBmp(Zvt::Bmp(0x87, Zvt::Two_Byte_Bcd, Zvt::Bmp::NumberToBCD(receiptNo, 2)));
                     *      cmd0624.addBmp(Zvt::Bmp(0x04, Zvt::Six_Byte_Bcd, Zvt::Bmp::NumberToBCD(amountInCent, 6)));
                     *      bookTotal = cmd0624;
                     *      ctls_card_wait_flow(cmd0624, store, current_command_flow, socket, running);
                     * }
                     * else
                     * {
                     *      //boost::this_thread::sleep_for(boost::chrono::milliseconds(3500));
                     *      stop_and_close_socket(running, current_command_flow, socket);
                     * }
                     */
                    break;
                }
                case Zvt::CMD_CTLS_CARD_BOOK_TOTAL_COMPLETION:
                {
                    for (Zvt::Apdu apdu: store)
                    {
                        if (apdu.isA(Zvt::CMD_040F))
                        {
                            Cmd::StatusInfo info(apdu.get());
                            info.flow(apdu.flow());
                            std::string trace = Zvt::Bmp::BCDToString(Zvt::Bmp::NumberToBCD(info.trace(), 2));
                            std::string receipt_no = Zvt::Bmp::BCDToString(Zvt::Bmp::NumberToBCD(info.receipt_number(), 2));
                            std::string flow = Zvt::Apdu::commandName(apdu.flow());
                            std::string cmd = Zvt::Apdu::commandName(apdu.isA());

                            cout << "<-PT* ctls_card_wait_flow BookTotalCompletion {"
                                 << "apdu : " << cmd << ", "
                                 << "flow : " << flow << ", "
                                 << "trace : " << trace << ", "
                                 << "receipt_no : " << receipt_no
                                 << "}" << endl;
                        }
                        else
                        {
                            cout << "<-PT* ctls_card_wait_flow BookTotalCompletion {"
                                 << "apdu : " << Zvt::Apdu::commandName(apdu.isA()) << ", "
                                 << "flow : " << Zvt::Apdu::commandName(apdu.flow())
                                 << ""
                                 << "}" << endl;
                        }
                    }
                    current_command_flow = Zvt::CMD_CTLS_START_WAITING;
                    //store.clear();
                    // stop for testing.
                    //stop_and_close_socket(running, current_command_flow, socket);
                    break;
                }
                case Zvt::CMD_0624:
                {
                    ctls_card_wait_flow(bookTotal, store, current_command_flow, socket, running);
                    break;
                }
                case Zvt::CMD_CTLS_CARD_BOOK_TOTAL_ABORT:
                case Zvt::CMD_CTLS_CARD_PREAUTH_ABORT:
                {
                    cerr << "<-PT* ctls_card_wait_flow command "
                         << Zvt::Apdu::commandName(current_command_flow)
                         << " ABORT {061E}: Check your 0622/0624 message/response"
                         << endl;
                    stop_and_close_socket(running, current_command_flow, socket);
                    break;
                }
                default:
                {
                    //error = ctls_card_wait_flow(status, current_command_flow, socket, running);
                    boost::this_thread::sleep_for(boost::chrono::milliseconds(3500));
                    cout << "<-PT* ctls_card_wait_flow command "
                         << Zvt::Apdu::commandName(current_command_flow)
                         << " test {"
                         << test
                         << "}"
                         << endl;
                    stop_and_close_socket(running, current_command_flow, socket);
                    break;
                }
            }
        }
        else
        {
            cerr << "<-PT* ctls_card_wait_flow error inner loop for command " << Zvt::Apdu::commandName(current_command_flow)
                 << " {" << error.value() << ":" << error.message() << "}" << endl;
            stop_and_close_socket(running, current_command_flow, socket);
        }
    }

    cout << "stop inner loop and end zvt++" << endl;
}

inline void ctls_card_wait_flow(Zvt::Command &current_command_flow, boost::asio::ip::tcp::socket &socket, bool &running)
{
    ctls_card_wait_flow(current_command_flow, 1999, socket, running);
}

#endif /* ZVT___HPP_ */
//          DF01: A0 00 00 00 03 10 10                                                             DF 01 07 A0 00 00 00 03 10 10
