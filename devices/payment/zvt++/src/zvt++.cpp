//============================================================================
// Name        : zvt++.cpp
// Author      : 
// Version     :
// Copyright   : Your copyright notice
// Description : Hello World in C++, Ansi-style
//============================================================================

#include "zvt++.hpp"

using namespace std;

inline void print_help_line(const std::string first, const std::string second, const std::string third)
{
    cout << setw(7) << left << setfill(' ') << first
         << setw(25) << left << setfill(' ') << second
         << third << endl;
}

inline int help()
{
    print_help_line("Usage:", "zvt++ command params", "\n");
    print_help_line("", "test", "");
    print_help_line("", "auth", "<PT IP[:PT_PORT]> [amount in cent] default amount is 100 cent");
    print_help_line("", "auth_with_04ff", "<PT IP[:PT_PORT]> [amount in cent] default amount is 100 cent (only ccv fly and fly-next)");
    print_help_line("", "auth_pp", "<PT IP[:PT_PORT]> <amount in cent> <E9 data>");
    print_help_line("", "auth_pp", "<PT IP[:PT_PORT]> <payment_type in dec> <amount in cent> <E9 data>");
    print_help_line("", "auth_ctls_wait", "<PT IP[:PT_PORT]> <amount in cent>");
    print_help_line("", "endOfDay", "<PT IP[:PT_PORT]> [normal|force|auto] default is normal");
    print_help_line("", "lineDiagnosis", "<PT IP[:PT_PORT]>");
    print_help_line("", "extendedDiagnosis", "<PT IP[:PT_PORT]>");
    print_help_line("", "configuration", "<PT IP[:PT_PORT]>");
    print_help_line("", "emvConfiguration", "<PT IP[:PT_PORT]>");
    print_help_line("", "ep2Configuration", "<PT IP[:PT_PORT]>");
    print_help_line("", "configFeig", "<PT IP[:PT_PORT]> <PASSWORD> <HOST IP> <HOST PORT>");
    print_help_line("", "init", "<PT IP[:PT_PORT]> [PASSWORD]");
    print_help_line("", "reversal", "<PT IP[:PT_PORT]> <receiptNo> [PASSWORD]");
    print_help_line("", "printSysConfig", "<PT IP[:PT_PORT]>");
    print_help_line("", "repeatReceipt", "<PT IP[:PT_PORT]>");
    print_help_line("", "totals", "<PT IP[:PT_PORT]>");
    print_help_line("", "apdu", "<PT IP[:PT_PORT]> <hex string>");
    print_help_line("", "open_pre_auths", "<PT IP[:PT_PORT]>");
    print_help_line("", "book_total", "<PT IP[:PT_PORT]> <receiptNo> [amount in cent]");
    print_help_line("", "single_apdu", "<PT IP[:PT_PORT]> <hex string>");
    print_help_line("", "apdu_ctls_wait_loop", "<PT IP[:PT_PORT]> <hex string>");
    print_help_line("", "display", "<PT IP[:PT_PORT]> <duration> <ascii string>");
    print_help_line("", "emv", "<emv_config_file>");
    print_help_line("", "emv_build_nexo", "<emv_config_file_ini> [outfile]");
    print_help_line("", "gicc55", "<gicc55 hexfile>");

    cout << endl;
    cout << "Notes:" << endl;
    cout << endl;
    cout << "Amounts not equal to 00 cents (e.g. 150 (1.50€)) can generally cause an error in the " << endl;
    cout << "test system (payment is rejected with error e.g. 0x50). This is normal in TST," << endl;
    cout << "because it simulates errors in the backend to reject a payment." << endl;
    cout << endl;
    cout << "In the best case the cent amount is equal to the error code, " << endl;
    cout << "but this can be different. These amounts can also function normally and book 1.50€." << endl;
    cout << "This depends on the respective configuration." << endl;
    cout << endl;
    cout << "In the production system, the amount will of course have no influence on the error code." << endl;
    cout << endl;
    cout << "E9 data:" << endl;
    cout << "Something like:" << endl;
    cout << "\"D=LAV;T=D;I=001;S=9ce7ab9bd1426b13;L=ar4yXwYYrpD5yuII;P={t=F;b=3600;k=TEST-123-456;s=535535;u=c9661d9f-db18-4c42-9499-974a63da9a88;m=5000;r=998765}\""
         << endl;
    cout << endl;
    return 0;
}

int main(int argc, char *argv[])
{
    /**
     * zvt++ command 	options_for_command
     *
     * zvt++ test
     * zvt++ auth		<host-ip>
     */
    string self = "";
    string command = "";
    vector<std::string> options;
    filesystem::path settings = filesystem::path(getenv("HOME")) / filesystem::path(".zvt++/hosts.json");
    vector<Json::Host> hosts = apply_settings(settings);
    cout << "!!!Zvt cash register to poi/pos!!!" << endl << endl;  // prints !!!Hello World!!!

    for (int idx = 0; idx < argc; ++idx)
    {
        std::string arg(argv[idx]);
        cout << "argv " << idx << " λ " << arg << endl;
        cout.clear();

        switch (idx)
        {
            case 0:
                self = arg;
                break;
            case 1:
                // arg on idx must be the command
                command = arg;
                break;
            default:
                // options for command X
                options.push_back(arg);
                break;
        }
    }

    if (!command.empty())
    {
        //without sockets
        if (command == "test") return test();
        else if ((command == "auth" && options.size() < 1)
                 || (command == "auth_with_04ff" && options.size() < 1)
                 || (command == "auth_ctls_wait" && options.size() < 1)
                 || (command == "auth_pp" && options.size() < 3)
                 || (command == "endOfDay" && (options.size() < 1 || options.size() > 2))
                 || (command == "lineDiagnosis" && options.size() != 1)
                 || (command == "extendedDiagnosis" && options.size() != 1)
                 || (command == "configuration" && options.size() != 1)
                 || (command == "printSysConfig" && options.size() != 1)
                 || (command == "repeatReceipt" && options.size() != 1)
                 || (command == "totals" && options.size() != 1)
                 || (command == "emvConfiguration" && options.size() != 1)
                 || (command == "ep2Configuration" && options.size() != 1)
                 || (command == "reversal" && options.size() < 2)
                 || (command == "init" && options.size() < 1)
                 || (command == "apdu" && options.size() != 2)
                 || (command == "book_total" && options.size() != 3)
                 || (command == "open_pre_auths" && options.size() != 1)
                 || (command == "single_apdu" && options.size() != 2)
                 || (command == "apdu_ctls_wait_loop" && options.size() != 2)
                 || (command == "configFeig" && options.size() != 4)
                 || (command == "emv" && options.size() != 1)
                 || (command == "gicc55" && options.size() != 1)
                 || (command == "display" && options.size() != 3)
                 || (command == "emv_build_nexo" && options.size() < 1))
            return help();
        else if (command != "test"
                 && command != "auth"
                 && command != "auth_pp"
                 && command != "auth_with_04ff"
                 && command != "auth_ctls_wait"
                 && command != "endOfDay"
                 && command != "lineDiagnosis"
                 && command != "extendedDiagnosis"
                 && command != "configuration"
                 && command != "emvConfiguration"
                 && command != "ep2Configuration"
                 && command != "printSysConfig"
                 && command != "repeatReceipt"
                 && command != "totals"
                 && command != "init"
                 && command != "apdu"
                 && command != "open_pre_auths"
                 && command != "book_total"
                 && command != "single_apdu"
                 && command != "apdu_ctls_wait_loop"
                 && command != "emv"
                 && command != "display"
                 && command != "gicc55"
                 && command != "emv_build_nexo"
                 && command != "reversal"
                 && command != "configFeig")
            return help();
    }
    else
    {
        return help();
    }

    try
    {
        if (command == "emv")
        {
            cout << "emv parsing..." << endl;

            parse_emv(options[0]);
        }
        else if (command == "emv_build_nexo")
        {
            cout << "parsing ini file and create BER-TLV EMV data" << endl;
            parse_emv_build_nexo(options[0], options.size() > 1 ? options[1] : string());
        }
        else if (command == "gicc55")
        {
            parse_gicc55(options[0]);
        }
        else
        {
            boost::asio::io_context io_context;
            boost::asio::socket_base::receive_buffer_size option(1024);
            boost::asio::ip::tcp::socket socket(io_context);

            string ip = options[0];
            int port = 22000;

            string tname = "";

            for (const auto &host: hosts)
            {
                if (host.name() == ip)
                {
                    tname = ip;
                    ip = string(host.host()).append(":").append(to_string(host.port()));
                    password = host.password();
                    //if (tname == "vfone") password = "000000";
                    break;
                }
            }

            if (ip.find(":") != std::string::npos)
            {
                istringstream f(ip);
                string s;

                while (getline(f, s, ':'))
                {
                    if (s.find('.') != std::string::npos) ip = s;
                    else port = std::stoi(s);
                }
            }

            boost::asio::ip::tcp::endpoint endpoint(address::from_string(ip), port);

            cout << "Socket created: " << endpoint.address().to_string() << ":" << endpoint.port() << endl << endl;

            socket.connect(endpoint);

            if (socket.is_open())
            {
                boost::system::error_code ec;
                socket.set_option(option, ec);
                cout << "socket option: " << option.value() << ", set with ec {" << ec.value() << "}" << endl;
            }

            boost::asio::socket_base::receive_buffer_size getOption;
            socket.get_option(getOption);

            cout << "socket option: get value is " << getOption.value() << endl;

            for (const auto &item: options)
                cout << "option: " << item << endl;

            bool running = true;
            Zvt::Command current_command_flow = Zvt::CMD_UNKNOWN;

            // TODO Use boost::program_options
            while (running)
            {
                if (command == "auth" && options.size() == 1)
                    auth_flow(100, current_command_flow, socket, running);
                else if (command == "auth" && options.size() == 2)
                    auth_flow(std::stoul(options[1]), current_command_flow, socket, running);
                else if (command == "auth_with_04ff" && options.size() == 1 && port != 22000)
                    auth_flow_with_04ff(100, current_command_flow, socket, running);
                else if (command == "auth_with_04ff" && options.size() == 1)
                    feig_auth_flow_with_04ff(100, current_command_flow, socket, running);
                else if (command == "auth_pp" && options.size() == 3)
                    auth_pp(std::stoul(options[1]), options[2], current_command_flow, socket, running);
                else if (command == "auth_pp" && options.size() == 4)
                    auth_pp(std::stoul(options[1]), options[2], options[3], current_command_flow, socket, running);
                else if (command == "auth_with_04ff" && options.size() == 2 && port != 22000)
                    auth_flow_with_04ff(std::stoul(options[1]), current_command_flow, socket, running);
                else if (command == "auth_with_04ff" && options.size() == 2)
                    feig_auth_flow_with_04ff(std::stoul(options[1]), current_command_flow, socket, running);
                else if (command == "auth_ctls_wait" && options.size() == 2)
                {
                    try
                    {
                        ctls_card_wait_flow(current_command_flow, std::stoi(options[1]), socket, running);
                    }
                    catch (exception e)
                    {
                        std::cerr << "Cannot convert string {" << options[1] << "} to integer!" << endl << e.what() << endl;
                        return 0;
                    }
                }
                else if (command == "endOfDay")
                {
                    if (options.size() == 1)
                    {
                        end_of_day_flow(Cmd::EndOfDay::NORMAL, current_command_flow, socket, running);
                    }
                    else if (options.size() == 2)
                    {
                        std::string mode = Utils::lower(options[1]);
                        if (mode == "normal") end_of_day_flow(Cmd::EndOfDay::NORMAL, current_command_flow, socket, running);
                        else if (mode == "force") end_of_day_flow(Cmd::EndOfDay::FORCE, current_command_flow, socket, running);
                        else if (mode == "auto") end_of_day_flow(Cmd::EndOfDay::AUTO, current_command_flow, socket, running);
                    }
                }
                else if (command == "lineDiagnosis")
                    diagnosis_flow(Zvt::LineDiagnosis, current_command_flow, socket, running);
                else if (command == "extendedDiagnosis")
                    diagnosis_flow(Zvt::ExtendedDiagnosis, current_command_flow, socket, running);
                else if (command == "configuration")
                    diagnosis_flow(Zvt::Configuration, current_command_flow, socket, running);
                else if (command == "emvConfiguration")
                    diagnosis_flow(Zvt::EmvConfiguration, current_command_flow, socket, running);
                else if (command == "ep2Configuration")
                    diagnosis_flow(Zvt::Ep2Configuration, current_command_flow, socket, running);
                else if (command == "configFeig")
                    config_feig_flow(options[1], options[2], std::stoi(options[3]), current_command_flow, socket, running);
                else if (command == "init")
                    initialisation_flow(options.size() > 1 ? Cmd::Initialisation(options[1]) : Cmd::Initialisation(password), current_command_flow, socket, running);
                else if (command == "printSysConfig")
                    print_system_config(current_command_flow, socket, running);
                else if (command == "repeatReceipt")
                    repeat_receipt(current_command_flow, socket, running);
                else if (command == "totals")
                    turnover_totals(current_command_flow, socket, running);
                else if (command == "single_apdu")
                    single_apdu_from_hex(options[1], current_command_flow, socket, running);
                else if (command == "apdu")
                    apdu_from_hex(options[1], current_command_flow, socket, running);
                else if (command == "book_total")
                {
                    Cmd::BookTotal bookTotal_3(Zvt::Bmp::NumberToBCD(std::stoul(options[1]), 2)
                                               , Zvt::Bmp::NumberToBCD(std::stoul(options[2]), 6));

                    basic_register_with_status_flow(bookTotal_3, current_command_flow, socket, running);
                    //return 0; //apdu_from_hex(hex_apdu, current_command_flow, socket, running);
                }
                else if (command == "open_pre_auths")
                    apdu_from_hex("0623 03 87FFFF", current_command_flow, socket, running);
                else if (command == "apdu_ctls_wait_loop")
                    apdu_ctls_wait_loop(options[1], true, current_command_flow, socket, running);
                else if (command == "reversal")
                    reversal_flow(Cmd::Reversal(std::stol(options[1]), password), current_command_flow, socket, running);
                else if (command == "display")
                {
                    basic_register_with_status_flow(Cmd::DisplayText(std::stoi(options[1]), options[2]), current_command_flow, socket, running);
                }
                else return 0;
            }
        }
    }
    catch (std::exception &e)
    {
        cerr << e.what() << std::endl;
    }

    return 0;
}
