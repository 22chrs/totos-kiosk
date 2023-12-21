



1. Virtuelle Umgebung installieren
    - python3 -m venv venv  
2. Virtuelle Umgebung aktiveren
    - source venv/bin/activate
3. Requirments installieren
    - pip install -r requirements.txt




1. Zahlung: 
zvt_executable, "auth", "192.168.188.21", "301"

2. Beleg checken:
-> Automat abhängig starten oder nicht starten
-> Beleg speichern

Rückabwicklung:
zvt_executable, "reversal", "192.168.188.21", "0015"
// |Beleg-Nr.:                          0015|
-> Terminal freischalten lassen, Storno erlaubt?


4. 1 mal am Tag Kassenabschluss?
-> EndOfDay

5. PrintSystemConfig
-> starten können

Fragen:
- Beleg speichern? Wie lange
- Rückabwicklung erlaubt (manuelles Storno)
- Terinal Display anzeige?
- 1 mal am Tag Kassenabschluss automatisch?



zvt++ auth ip betrag | grep '<-PT|'
filtern