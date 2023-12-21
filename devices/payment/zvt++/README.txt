Pure C++ (clang,g++ c++20)

Builds a console runnable. "scratches" are only the developer gaming zone.

Currently we use c++20 in the scratches. zvt++ can be build with c++11.





zvt++ apdu c60 "0622 07 04 000000001990"

// 192.168.188.21

./zvt++ auth 192.168.188.21 301



- Reihenfolge Befehle

1. Init?

2. Payment

3. Reservieren -> Trinkgeld
4. Sonderfall

5. Fehlercode
(-> Dail< report?)

6. Eigenheiten




Ablauf:

<-PT* StatusInfo (040F) size (207)


Fehlersuche
Was ist passiert? Z.B Zahlung erfolgreich, Geheimzahl falsch, etc.: 
<-PT: resultCode                  : 55 // 
00 -> erfolgreich