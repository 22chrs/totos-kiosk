Pure C++ (clang,g++ c++20)

Builds a console runnable. "scratches" are only the developer gaming zone.

Currently we use c++20 in the scratches. zvt++ can be build with c++11.







Die zvt++ Sourcen können Sie hier herunterladen: https://dracoon.team/public/download-shares/UOoqX1NJn07k30zunZRL3aQvHGhSEVKd

Grundsätzlich kompiliert das cmake Projekt auf sämtlichen Linux Derivaten. Das Demo Programm benötigt die C++ boost Library für die Socket Verbindung. Ansonsten wird lediglich Standard C++ mit der STL benutzt.

Hier im Anhang ein TGZ mit diversen Beispiel Aufrufen der Konsolen Anwendung (Traces).

Der Einstieg gelingt am besten in zvt++.cpp / zvt++.hpp (auth_flow).  Ist das Programm zvt++ kompiliert einfach "./zvt++" ohne Parameter aufrufen um zur Hilfe zu gelangen.

Die ZVT ECR Dokumentation ist in den Sourcen enthalten.











1. Install Homebrew

2. Install Boost Libraries
The error cannot open source file "boost/algorithm/hex.hpp" suggests that the Boost libraries are either not installed or not properly included in your project. Here's how to install Boost on macOS:
Open Terminal.
If you have Homebrew installed (a package manager for macOS), run brew install boost. If you don't have Homebrew, you can install it from https://brew.sh.

3. Setting Up Include Path in VS Code
Open VS Code and your project.
Open the Command Palette:
You can do this by going to View > Command Palette or by pressing Cmd + Shift + P.
Edit C/C++ Configurations:
Type and select C/C++: Edit Configurations (UI) in the Command Palette.
Update Include Path:
In the Include path section, add /opt/homebrew/include as the path. This is where the Boost headers are symlinked by Homebrew.
Save Configuration:
Save the configuration file after adding the include path.