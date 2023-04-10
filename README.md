# Boilerplate and Starter for Tauri with TauriJS, ReactJS +18, Vite, Typescript, Zustand and Chakra-UI
https://github.com/michyaraque/tauri-boilerplate


cd /Users/chris/GitDrive/Toto/totos-kiosk

## make file strutur
find . \( -path './*/app' -o  -path './*/renderer/public/assets' -o -path './kiosk/renderer/.next' -o -path './*/node_modules' -o -path './*/dist' -o -path './.git' -path './node_modules' -o -path './app' -o -path './.git' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt