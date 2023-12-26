cd /Users/chris/GitDrive/Toto/totos-kiosk

## make file strutur root

find . \( -path './_/app' -o -path './kiosk/hejtoto.com/node_modules' -o -path './kiosk/hejtoto.com/.next' -o -path './kiosk/hejtoto.com/node_modules' -o -path './_/dist' -o -path './.git' -path './node_modules' -o -path './app' -o -path './.git' \) -prune -o -print | sed -e 's;[^/]\*/;|\_**\_;g;s;\_\_**|; |;g' > file_structure.txt

## make file strutur toto

find . \( -path './env/_' -o -path './robot/ur_log/_' \) -prune -o -print | sed -e 's;[^/]\*/;|\_**\_;g;s;\_\_**|; |;g' > file_structure.txt

## make file strutur toto
