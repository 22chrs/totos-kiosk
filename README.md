# Boilerplate and Starter for Tauri with TauriJS, ReactJS +18, Vite, Typescript, Zustand and Chakra-UI
https://github.com/michyaraque/tauri-boilerplate


## make file strutur
find . \( -path './*/node_modules' -o -path './*/src-tauri/target' -o -path './.git' -path './node_modules' -o -path './app' -o -path './.git' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt

find . \( -path './.next' -o -path './node_modules' -o -path './app' -o -path './public' \) -prune -o -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' > file_structure.txt