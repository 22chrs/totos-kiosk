cmake_minimum_required(VERSION 3.17)
project(zvt++ VERSION 1.1.7)

set(CMAKE_CXX_FLAGS "-O2 -fvisibility=hidden -fvisibility-inlines-hidden")

#        cxxflags=-fvisibility=hidden
#        cxxflags=-fvisibility-inlines-hidden

#set(CMAKE_CXX_FLAGS_DEBUG "-g -O1")
#set(CMAKE_CXX_FLAGS_RELEASE "-O1")

set(CMAKE_CXX_STANDARD 17)

set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)

find_package(Boost 1.78.0 COMPONENTS system thread json chrono)

if(Boost_FOUND)
    file(GLOB BMPS_SRC src/bmps/*.?pp)
    file(GLOB CMDS_SRC src/cmds/*.?pp)
    file(GLOB SRC src/*.?pp)
    file(GLOB UTILS_SRC src/utils/*.?pp)
    file(GLOB NEXO_SRC src/nexo/*.?pp)
    file(GLOB HEADER src/*.hpp)

    include_directories(src src/bmps src/cmds src/cmds/error src/json src/converter src/gicc src/nexo)
    include_directories(/opt/homebrew/include)
    link_directories(/opt/homebrew/lib)

    include_directories(${Boost_INCLUDE_DIR})

    add_executable(zvt++ ${CMDS_SRC} ${BMPS_SRC} ${SRC} src/zvt++.cpp src/zvt++.hpp src/cmds/RepeatReceipt.cpp src/cmds/RepeatReceipt.hpp src/cmds/Abort.cpp src/cmds/Abort.hpp src/json/Host.cpp src/json/Host.hpp src/cmds/Reversal.cpp src/cmds/Reversal.hpp src/converter/TagValueConverter.cpp src/converter/TagValueConverter.hpp src/converter/EmvTagConverter.cpp src/converter/EmvTagConverter.hpp src/gicc/Bmp55.cpp src/gicc/Bmp55.hpp src/cmds/PrintLine.cpp src/cmds/PrintLine.hpp src/cmds/error/RegisterErrorCategory.hpp src/cmds/error/StatusEnquiryErrorCategory.hpp src/cmds/error/StatusErrorCategory.hpp src/cmds/error/NAckErrorCategory.hpp src/cmds/error/AuthAbortCategory.hpp src/cmds/DisplayText.cpp src/cmds/DisplayText.hpp src/cmds/BookTotal.cpp src/cmds/BookTotal.hpp src/nexo/SupportedServices.cpp src/nexo/SupportedServices.hpp
            src/gicc/Gicc.cpp
            src/gicc/Gicc.hpp
            src/LLVar.hpp
            src/cmds/Reservation.cpp
            src/cmds/Reservation.hpp)
    target_link_libraries(zvt++ ${Boost_LIBRARIES})

    add_library(shared-zvt++ SHARED ${CMDS_SRC} ${BMPS_SRC} ${SRC} src/zvt++.cpp src/zvt++.hpp src/cmds/RepeatReceipt.cpp src/cmds/RepeatReceipt.hpp src/cmds/Abort.cpp src/cmds/Abort.hpp src/json/Host.cpp src/json/Host.hpp src/cmds/Reversal.cpp src/cmds/Reversal.hpp src/converter/TagValueConverter.cpp src/converter/TagValueConverter.hpp src/converter/EmvTagConverter.cpp src/converter/EmvTagConverter.hpp src/gicc/Bmp55.cpp src/gicc/Bmp55.hpp src/cmds/PrintLine.cpp src/cmds/PrintLine.hpp src/cmds/error/RegisterErrorCategory.hpp src/cmds/error/StatusEnquiryErrorCategory.hpp src/cmds/error/StatusErrorCategory.hpp src/cmds/error/NAckErrorCategory.hpp src/cmds/error/AuthAbortCategory.hpp src/cmds/DisplayText.cpp src/cmds/DisplayText.hpp src/cmds/BookTotal.cpp src/cmds/BookTotal.hpp src/nexo/SupportedServices.cpp src/nexo/SupportedServices.hpp
            src/gicc/Gicc.cpp
            src/gicc/Gicc.hpp
            src/LLVar.hpp
            src/cmds/Reservation.cpp
            src/cmds/Reservation.hpp)
    target_link_libraries(shared-zvt++ ${Boost_LIBRARIES})

    add_library(static-zvt++ STATIC ${CMDS_SRC} ${BMPS_SRC} ${SRC} src/zvt++.cpp src/zvt++.hpp src/cmds/RepeatReceipt.cpp src/cmds/RepeatReceipt.hpp src/cmds/Abort.cpp src/cmds/Abort.hpp src/json/Host.cpp src/json/Host.hpp src/cmds/Reversal.cpp src/cmds/Reversal.hpp src/converter/TagValueConverter.cpp src/converter/TagValueConverter.hpp src/converter/EmvTagConverter.cpp src/converter/EmvTagConverter.hpp src/gicc/Bmp55.cpp src/gicc/Bmp55.hpp src/cmds/PrintLine.cpp src/cmds/PrintLine.hpp src/cmds/error/RegisterErrorCategory.hpp src/cmds/error/StatusEnquiryErrorCategory.hpp src/cmds/error/StatusErrorCategory.hpp src/cmds/error/NAckErrorCategory.hpp src/cmds/error/AuthAbortCategory.hpp src/cmds/DisplayText.cpp src/cmds/DisplayText.hpp src/cmds/BookTotal.cpp src/cmds/BookTotal.hpp src/nexo/SupportedServices.cpp src/nexo/SupportedServices.hpp
            src/gicc/Gicc.cpp
            src/gicc/Gicc.hpp
            src/LLVar.hpp
            src/cmds/Reservation.cpp
            src/cmds/Reservation.hpp)
    target_link_libraries(static-zvt++ ${Boost_LIBRARIES})

endif()
