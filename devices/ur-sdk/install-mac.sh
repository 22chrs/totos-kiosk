

#!/bin/bash

command_exists () {
    type "$1" &> /dev/null ;
}

if command_exists "dialog" ; then
    echo "The tool 'dialog' is installed..."
else
    read -p "The required tool 'dialog' is not installed. Would you like to install it now (y/n)? " CONT
    if [ "$CONT" = "y" ]; then
        brew install dialog
    else
        echo "Cannot continue, exiting..."
        exit
    fi
fi

if command_exists "ant" ; then
    echo "The tool 'ant' is installed..."
else
    read -p "The required tool 'ant' is not installed. Would you like to install it now (y/n)? " CONT
    if [ "$CONT" = "y" ]; then
        brew install ant
    else
        echo "Cannot continue, exiting..."
        exit
    fi
fi

if command_exists "sshpass" ; then
    echo "The tool 'sshpass' is installed..."
else
    read -p "The required tool 'sshpass' is not installed. Would you like to install it now (y/n)? " CONT
    if [ "$CONT" = "y" ]; then
        brew install sshpass
    else
        echo "Cannot continue, exiting..."
        exit
    fi
fi

if command_exists "mvn" ; then
    echo "The tool 'mvn' (Maven) is installed..."
else
    read -p "The required tool 'maven' is not installed. Would you like to install it now (y/n)? " CONT
    if [ "$CONT" = "y" ]; then
        brew install maven
    else
        echo "Cannot continue, exiting..."
        exit
    fi
fi

echo "Installing archetype and API to maven repository..."
mvn install:install-file -Dfile=artifacts/api/1.14.0/com.ur.urcap.api-1.14.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.14.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.14.0/com.ur.urcap.api-1.14.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.14.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.14.0/com.ur.urcap.api-1.14.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.14.0 -Dpackaging=jar -Dclassifier=sources -q
mvn install:install-file -Dfile=artifacts/archetype/com.ur.urcap.archetype-1.14.0.jar -DgroupId=com.ur.urcap -DartifactId=archetype -Dversion=1.14.0 -Dpackaging=jar -q

echo "Installing older API versions to maven repository..."
mvn install:install-file -Dfile=artifacts/api/1.13.0/com.ur.urcap.api-1.13.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.13.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.13.0/com.ur.urcap.api-1.13.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.13.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.13.0/com.ur.urcap.api-1.13.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.13.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.12.0/com.ur.urcap.api-1.12.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.12.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.12.0/com.ur.urcap.api-1.12.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.12.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.12.0/com.ur.urcap.api-1.12.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.12.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.11.0/com.ur.urcap.api-1.11.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.11.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.11.0/com.ur.urcap.api-1.11.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.11.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.11.0/com.ur.urcap.api-1.11.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.11.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.10.0/com.ur.urcap.api-1.10.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.10.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.10.0/com.ur.urcap.api-1.10.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.10.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.10.0/com.ur.urcap.api-1.10.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.10.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.9.0/com.ur.urcap.api-1.9.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.9.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.9.0/com.ur.urcap.api-1.9.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.9.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.9.0/com.ur.urcap.api-1.9.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.9.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.8.0/com.ur.urcap.api-1.8.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.8.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.8.0/com.ur.urcap.api-1.8.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.8.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.8.0/com.ur.urcap.api-1.8.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.8.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.7.0/com.ur.urcap.api-1.7.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.7.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.7.0/com.ur.urcap.api-1.7.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.7.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.7.0/com.ur.urcap.api-1.7.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.7.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.6.0/com.ur.urcap.api-1.6.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.6.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.6.0/com.ur.urcap.api-1.6.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.6.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.6.0/com.ur.urcap.api-1.6.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.6.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.5.0/com.ur.urcap.api-1.5.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.5.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.5.0/com.ur.urcap.api-1.5.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.5.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.5.0/com.ur.urcap.api-1.5.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.5.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.4.0/com.ur.urcap.api-1.4.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.4.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.4.0/com.ur.urcap.api-1.4.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.4.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.4.0/com.ur.urcap.api-1.4.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.4.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.3.0/com.ur.urcap.api-1.3.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.3.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.3.0/com.ur.urcap.api-1.3.0-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.3.0 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.3.0/com.ur.urcap.api-1.3.0-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.3.0 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.2.56/com.ur.urcap.api-1.2.56.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.2.56 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.2.56/com.ur.urcap.api-1.2.56-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.2.56 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.2.56/com.ur.urcap.api-1.2.56-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.2.56 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.1.0/com.ur.urcap.api-1.1.0-69.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.1.0-69 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.1.0/com.ur.urcap.api-1.1.0-69-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.1.0-69 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.1.0/com.ur.urcap.api-1.1.0-69-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.1.0-69 -Dpackaging=jar -Dclassifier=sources -q

mvn install:install-file -Dfile=artifacts/api/1.0.0/com.ur.urcap.api-1.0.0.30.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.0.0.30 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/api/1.0.0/com.ur.urcap.api-1.0.0.30-javadoc.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.0.0.30 -Dpackaging=jar -Dclassifier=javadoc -q
mvn install:install-file -Dfile=artifacts/api/1.0.0/com.ur.urcap.api-1.0.0.30-sources.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.0.0.30 -Dpackaging=jar -Dclassifier=sources -q

echo "Installing additional jars..."
mvn install:install-file -Dfile=artifacts/other/commons-httpclient-3.1.0.0.jar -DgroupId=commons-httpclient -DartifactId=commons-httpclient -Dversion=3.1.0.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/other/ws-commons-util-1.0.2.0.jar -DgroupId=org.apache.ws.commons.util -DartifactId=ws-commons-util -Dversion=1.0.2.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/other/xmlrpc-client-3.1.3.0.jar -DgroupId=org.apache.xmlrpc -DartifactId=xmlrpc-client -Dversion=3.1.3.0 -Dpackaging=jar -q
mvn install:install-file -Dfile=artifacts/other/xmlrpc-common-3.1.3.0.jar -DgroupId=org.apache.xmlrpc -DartifactId=xmlrpc-common -Dversion=3.1.3.0 -Dpackaging=jar -q

echo "Installing archetype and API to Maven repository..."
mvn install:install-file -Dfile=artifacts/api/1.14.0/com.ur.urcap.api-1.14.0.jar -DgroupId=com.ur.urcap -DartifactId=api -Dversion=1.14.0 -Dpackaging=jar -q
# Repeat the Maven installation commands for other versions as in your original script...

# Skipping the UR C/C++ cross-compiler toolchain installation
echo "Note: The UR C/C++ cross-compiler toolchain requires an x86_64 Debian-based OS and cannot be installed on macOS. Consider using a virtual machine or Docker container if you need this toolchain."

echo "Done. Please log out and back in."
