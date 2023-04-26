cd /Users/chris/GitDrive/Toto/totos-kiosk

## make file strutur root
find . \( -path './*/app' -o  -path './kiosk/hejtoto.com/node_modules' -o -path './kiosk/hejtoto.com/.next' -o -path './kiosk/hejtoto.com/node_modules' -o -path './*/dist' -o -path './.git' -path './node_modules' -o -path './app' -o -path './.git' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt



## make file strutur toto
find . \( -path './env/*' -o -path './robot/ur_log/*' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt

## make file strutur toto
find . \( -path './.next/*' -o -path './node_modules/*' -o -path './public/*' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt