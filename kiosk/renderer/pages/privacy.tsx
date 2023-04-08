import PageLayout from '@/components/page-layout';
import {
  Box,
  Heading,
  HStack,
  Icon,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

import {
  FiGlobe,
  FiHash,
  FiMail,
  FiPhoneIncoming,
  FiUser,
} from 'react-icons/fi';

import { StandardPage } from '@/components/page-layout/padding';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Impressum' description='Impressum von Hej Toto.'>
      <StandardPage heading='Datenschutz&#x200B;erklärung'>
        <Text>
          <Box>
            Wir freuen uns sehr über Ihr Interesse an unserem Unternehmen.
            Datenschutz hat einen besonders hohen Stellenwert für die
            Geschäftsleitung von Hej Toto. Eine Nutzung der Internetseiten von
            Hej Toto ist grundsätzlich ohne jede Angabe personenbezogener Daten
            möglich. Sofern eine betroffene Person besondere Services unseres
            Unternehmens über unsere Internetseite in Anspruch nehmen möchte,
            könnte jedoch eine Verarbeitung personenbezogener Daten erforderlich
            werden. Ist die Verarbeitung personenbezogener Daten erforderlich
            und besteht für eine solche Verarbeitung keine gesetzliche
            Grundlage, holen wir generell eine Einwilligung der betroffenen
            Person ein.
            <br />
            <br />
            Die Verarbeitung personenbezogener Daten, beispielsweise des Namens,
            der Anschrift, E-Mail-Adresse oder Telefonnummer einer betroffenen
            Person, erfolgt stets im Einklang mit der
            Datenschutz-Grundverordnung und in Übereinstimmung mit den für Hej
            Toto geltenden landesspezifischen Datenschutzbestimmungen. Mittels
            dieser Datenschutzerklärung möchte unser Unternehmen die
            Öffentlichkeit über Art, Umfang und Zweck der von uns erhobenen,
            genutzten und verarbeiteten personenbezogenen Daten informieren.
            Ferner werden betroffene Personen mittels dieser
            Datenschutzerklärung über die ihnen zustehenden Rechte aufgeklärt.
            <br />
            <br />
            Hej Toto hat als für die Verarbeitung Verantwortlicher zahlreiche
            technische und organisatorische Maßnahmen umgesetzt, um einen
            möglichst lückenlosen Schutz der über diese Internetseite
            verarbeiteten personenbezogenen Daten sicherzustellen. Dennoch
            können Internetbasierte Datenübertragungen grundsätzlich
            Sicherheitslücken aufweisen, sodass ein absoluter Schutz nicht
            gewährleistet werden kann. Aus diesem Grund steht es jeder
            betroffenen Person frei, personenbezogene Daten auch auf
            alternativen Wegen, beispielsweise telefonisch, an uns zu
            übermitteln.
          </Box>
          <Heading variant='h2'>1. Begriffsbestimmungen</Heading>
          <Box>
            Die Datenschutzerklärung von Hej Toto beruht auf den
            Begrifflichkeiten, die durch den Europäischen Richtlinien- und
            Verordnungsgeber beim Erlass der Datenschutz-Grundverordnung
            (DS-GVO) verwendet wurden. Unsere Datenschutzerklärung soll sowohl
            für die Öffentlichkeit als auch für unsere Kunden und
            Geschäftspartner einfach lesbar und verständlich sein. Um dies zu
            gewährleisten, möchten wir vorab die verwendeten Begrifflichkeiten
            erläutern. Wir verwenden in dieser Datenschutzerklärung unter
            anderem die folgenden Begriffe:
          </Box>
          <Box>
            <Heading variant='h3'>1.1 personenbezogene Daten</Heading>
            <Box>
              Personenbezogene Daten sind alle Informationen, die sich auf eine
              identifizierte oder identifizierbare natürliche Person (im
              Folgenden „betroffene Person“) beziehen. Als identifizierbar wird
              eine natürliche Person angesehen, die direkt oder indirekt,
              insbesondere mittels Zuordnung zu einer Kennung wie einem Namen,
              zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung
              oder zu einem oder mehreren besonderen Merkmalen, die Ausdruck der
              physischen, physiologischen, genetischen, psychischen,
              wirtschaftlichen, kulturellen oder sozialen Identität dieser
              natürlichen Person sind, identifiziert werden kann.
            </Box>
            <Heading variant='h3'>1.2 betroffene Person</Heading>
            <Box>
              Betroffene Person ist jede identifizierte oder identifizierbare
              natürliche Person, deren personenbezogene Daten von dem für die
              Verarbeitung Verantwortlichen verarbeitet werden.
            </Box>
            <Heading variant='h3'>1.3 Verarbeitung</Heading>
            <Box>
              Verarbeitung ist jeder mit oder ohne Hilfe automatisierter
              Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im
              Zusammenhang mit personenbezogenen Daten wie das Erheben, das
              Erfassen, die Organisation, das Ordnen, die Speicherung, die
              Anpassung oder Veränderung, das Auslesen, das Abfragen, die
              Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder
              eine andere Form der Bereitstellung, den Abgleich oder die
              Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.
            </Box>
            <Heading variant='h3'>1.4 Einschränkung der Verarbeitung</Heading>
            <Box>
              Einschränkung der Verarbeitung ist die Markierung gespeicherter
              personenbezogener Daten mit dem Ziel, ihre künftige Verarbeitung
              einzuschränken.
            </Box>
            <Heading variant='h3'>1.5 Profiling</Heading>
            <Box>
              Profiling ist jede Art der automatisierten Verarbeitung
              personenbezogener Daten, die darin besteht, dass diese
              personenbezogenen Daten verwendet werden, um bestimmte persönliche
              Aspekte, die sich auf eine natürliche Person beziehen, zu
              bewerten, insbesondere, um Aspekte bezüglich Arbeitsleistung,
              wirtschaftlicher Lage, Gesundheit, persönlicher Vorlieben,
              Interessen, Zuverlässigkeit, Verhalten, Aufenthaltsort oder
              Ortswechsel dieser natürlichen Person zu analysieren oder
              vorherzusagen.
            </Box>
            <Heading variant='h3'>1.6 Pseudonymisierung</Heading>
            <Box>
              Pseudonymisierung ist die Verarbeitung personenbezogener Daten in
              einer Weise, auf welche die personenbezogenen Daten ohne
              Hinzuziehung zusätzlicher Informationen nicht mehr einer
              spezifischen betroffenen Person zugeordnet werden können, sofern
              diese zusätzlichen Informationen gesondert aufbewahrt werden und
              technischen und organisatorischen Maßnahmen unterliegen, die
              gewährleisten, dass die personenbezogenen Daten nicht einer
              identifizierten oder identifizierbaren natürlichen Person
              zugewiesen werden.
            </Box>
            <Heading variant='h3'>
              1.7 Verantwortlicher oder für die Verarbeitung Verantwortlicher
            </Heading>
            <Box>
              Verantwortlicher oder für die Verarbeitung Verantwortlicher ist
              die natürliche oder juristische Person, Behörde, Einrichtung oder
              andere Stelle, die allein oder gemeinsam mit anderen über die
              Zwecke und Mittel der Verarbeitung von personenbezogenen Daten
              entscheidet. Sind die Zwecke und Mittel dieser Verarbeitung durch
              das Unionsrecht oder das Recht der Mitgliedstaaten vorgegeben, so
              kann der Verantwortliche beziehungsweise können die bestimmten
              Kriterien seiner Benennung nach dem Unionsrecht oder dem Recht der
              Mitgliedstaaten vorgesehen werden.
            </Box>
            <Heading variant='h3'>1.8 Auftragsverarbeiter</Heading>
            <Box>
              Auftragsverarbeiter ist eine natürliche oder juristische Person,
              Behörde, Einrichtung oder andere Stelle, die personenbezogene
              Daten im Auftrag des Verantwortlichen verarbeitet.
            </Box>
            <Heading variant='h3'>1.9 Empfänger</Heading>
            <Box>
              Empfänger ist eine natürliche oder juristische Person, Behörde,
              Einrichtung oder andere Stelle, der personenbezogene Daten
              offengelegt werden, unabhängig davon, ob es sich bei ihr um einen
              Dritten handelt oder nicht. Behörden, die im Rahmen eines
              bestimmten Untersuchungsauftrags nach dem Unionsrecht oder dem
              Recht der Mitgliedstaaten möglicherweise personenbezogene Daten
              erhalten, gelten jedoch nicht als Empfänger.
            </Box>
            <Heading variant='h3'>1.10 Dritter</Heading>
            <Box>
              Dritter ist eine natürliche oder juristische Person, Behörde,
              Einrichtung oder andere Stelle außer der betroffenen Person, dem
              Verantwortlichen, dem Auftragsverarbeiter und den Personen, die
              unter der unmittelbaren Verantwortung des Verantwortlichen oder
              des Auftragsverarbeiters befugt sind, die personenbezogenen Daten
              zu verarbeiten.
            </Box>
            <Heading variant='h3'>1.11 Einwilligung</Heading>
            <Box>
              Einwilligung ist jede von der betroffenen Person freiwillig für
              den bestimmten Fall in informierter Weise und unmissverständlich
              abgegebene Willensbekundung in Form einer Erklärung oder einer
              sonstigen eindeutigen bestätigenden Handlung, mit der die
              betroffene Person zu verstehen gibt, dass sie mit der Verarbeitung
              der sie betreffenden personenbezogenen Daten einverstanden ist.
            </Box>
          </Box>
          <Heading variant='h2'>
            2. Name und Anschrift des für die Verarbeitung Verantwortlichen
          </Heading>
          <Box>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung, sonstiger
            in den Mitgliedstaaten der Europäischen Union geltenden
            Datenschutzgesetze und anderer Bestimmungen mit
            datenschutzrechtlichem Charakter ist die:
          </Box>

          <Heading variant='h3'>Anschrift und Kontaktdaten</Heading>

          <Box>
            Hej Toto UG i.Gr. (haftungsbeschränkt)
            <br />
            Reudnitzer Str. 1 <br />
            04103 Leipzig <br />
            Germany
          </Box>

          <Box>
            <HStack pt='5'>
              <Icon fontSize='xl' as={FiUser} />
              <Text fontWeight={700}>Geschäftsführer</Text>
            </HStack>
            <Text>Christoph Walter</Text>
          </Box>

          <Box>
            <HStack pt='5'>
              <Icon fontSize='xl' as={FiHash} />
              <Text fontWeight={700}>USt-IdNr.</Text>
            </HStack>
            <Text>DE XXX (i.Gr., daher UsID folgt sobald vorhanden.)</Text>
          </Box>

          <Box>
            <HStack pt='5'>
              <Icon fontSize='xl' as={FiGlobe} />
              <Text fontWeight={700}>Internetauftritt</Text>
            </HStack>
            <Link href='https://hejtoto.com' target='_blank'>
              <Text>www.hejtoto.com</Text>
            </Link>
          </Box>

          <Box>
            <HStack pt='5'>
              <Icon fontSize='xl' as={FiMail} />
              <Text fontWeight={700}>E-Mail Adresse</Text>
            </HStack>
            <Link href='hej@hejtoto.com' target='_blank'>
              <Text>hej@hejtoto.com</Text>
            </Link>
          </Box>

          <Box>
            <HStack pt='5'>
              <Icon fontSize='xl' as={FiPhoneIncoming} />
              <Text fontWeight={700}>Telefonnummer</Text>
            </HStack>
            <Text> +49 (0) 341 39290435</Text>
          </Box>

          <Heading variant='h2'>3. Cookies</Heading>
          <Box>
            Die Internetseiten von Hej Toto verwenden Cookies. Cookies sind
            Textdateien, welche über einen Internetbrowser auf einem
            Computersystem abgelegt und gespeichert werden.
            <br />
            <br />
            Zahlreiche Internetseiten und Server verwenden Cookies. Viele
            Cookies enthalten eine sogenannte Cookie-ID. Eine Cookie-ID ist eine
            eindeutige Kennung des Cookies. Sie besteht aus einer Zeichenfolge,
            durch welche Internetseiten und Server dem konkreten Internetbrowser
            zugeordnet werden können, in dem das Cookie gespeichert wurde. Dies
            ermöglicht es den besuchten Internetseiten und Servern, den
            individuellen Browser der betroffenen Person von anderen
            Internetbrowsern, die andere Cookies enthalten, zu unterscheiden.
            Ein bestimmter Internetbrowser kann über die eindeutige Cookie-ID
            wiedererkannt und identifiziert werden.
            <br />
            <br />
            Durch den Einsatz von Cookies kann Hej Toto den Nutzern dieser
            Internetseite nutzerfreundlichere Services bereitstellen, die ohne
            die Cookie-Setzung nicht möglich wären.
            <br />
            <br />
            Mittels eines Cookies können die Informationen und Angebote auf
            unserer Internetseite im Sinne des Benutzers optimiert werden.
            Cookies ermöglichen uns, wie bereits erwähnt, die Benutzer unserer
            Internetseite wiederzuerkennen. Zweck dieser Wiedererkennung ist es,
            den Nutzern die Verwendung unserer Internetseite zu erleichtern. Der
            Benutzer einer Internetseite, die Cookies verwendet, muss
            beispielsweise nicht bei jedem Besuch der Internetseite erneut seine
            Zugangsdaten eingeben, weil dies von der Internetseite und dem auf
            dem Computersystem des Benutzers abgelegten Cookie übernommen wird.
            Ein weiteres Beispiel ist das Cookie eines Warenkorbes im
            Online-Shop. Der Online-Shop merkt sich die Artikel, die ein Kunde
            in den virtuellen Warenkorb gelegt hat, über ein Cookie.
            <br />
            <br />
            Die betroffene Person kann die Setzung von Cookies durch unsere
            Internetseite jederzeit mittels einer entsprechenden Einstellung des
            genutzten Internetbrowsers verhindern und damit der Setzung von
            Cookies dauerhaft widersprechen. Ferner können bereits gesetzte
            Cookies jederzeit über einen Internetbrowser oder andere
            Softwareprogramme gelöscht werden. Dies ist in allen gängigen
            Internetbrowsern möglich. Deaktiviert die betroffene Person die
            Setzung von Cookies in dem genutzten Internetbrowser, sind unter
            Umständen nicht alle Funktionen unserer Internetseite vollumfänglich
            nutzbar.
          </Box>
          <Heading variant='h2'>
            4. Erfassung von allgemeinen Daten und Informationen
          </Heading>
          <Box>
            Die Internetseite von Hej Toto erfasst mit jedem Aufruf der
            Internetseite durch eine betroffene Person oder ein automatisiertes
            System eine Reihe von allgemeinen Daten und Informationen. Diese
            allgemeinen Daten und Informationen werden in den Logfiles des
            Servers gespeichert. Erfasst werden können die (1) verwendeten
            Browsertypen und Versionen, (2) das vom zugreifenden System
            verwendete Betriebssystem, (3) die Internetseite, von welcher ein
            zugreifendes System auf unsere Internetseite gelangt (sogenannte
            Referrer), (4) die Unterwebseiten, welche über ein zugreifendes
            System auf unserer Internetseite angesteuert werden, (5) das Datum
            und die Uhrzeit eines Zugriffs auf die Internetseite, (6) eine
            Internet-Protokoll-Adresse (IP-Adresse), (7) der
            Internet-Service-Provider des zugreifenden Systems und (8) sonstige
            ähnliche Daten und Informationen, die der Gefahrenabwehr im Falle
            von Angriffen auf unsere informationstechnologischen Systeme dienen.
            <br />
            <br />
            Bei der Nutzung dieser allgemeinen Daten und Informationen zieht Hej
            Toto keine Rückschlüsse auf die betroffene Person. Diese
            Informationen werden vielmehr benötigt, um (1) die Inhalte unserer
            Internetseite korrekt auszuliefern, (2) die Inhalte unserer
            Internetseite sowie die Werbung für diese zu optimieren, (3) die
            dauerhafte Funktionsfähigkeit unserer informationstechnologischen
            Systeme und der Technik unserer Internetseite zu gewährleisten sowie
            (4) um Strafverfolgungsbehörden im Falle eines Cyberangriffes die
            zur Strafverfolgung notwendigen Informationen bereitzustellen. Diese
            anonym erhobenen Daten und Informationen werden durch Hej Toto daher
            einerseits statistisch und ferner mit dem Ziel ausgewertet, den
            Datenschutz und die Datensicherheit in unserem Unternehmen zu
            erhöhen, um letztlich ein optimales Schutzniveau für die von uns
            verarbeiteten personenbezogenen Daten sicherzustellen. Die anonymen
            Daten der Server-Logfiles werden getrennt von allen durch eine
            betroffene Person angegebenen personenbezogenen Daten gespeichert.
          </Box>
          <Heading variant='h2'>5. Abonnement unseres Newsletters</Heading>
          <Box>
            Auf der Internetseite von Hej Toto wird den Benutzern die
            Möglichkeit eingeräumt, den Newsletter unseres Unternehmens zu
            abonnieren. Welche personenbezogenen Daten bei der Bestellung des
            Newsletters an den für die Verarbeitung Verantwortlichen übermittelt
            werden, ergibt sich aus der hierzu verwendeten Eingabemaske.
            <br />
            <br />
            Hej Toto informiert ihre Kunden und Geschäftspartner in regelmäßigen
            Abständen im Wege eines Newsletters über Angebote des Unternehmens.
            Der Newsletter unseres Unternehmens kann von der betroffenen Person
            grundsätzlich nur dann empfangen werden, wenn (1) die betroffene
            Person über eine gültige E-Mail-Adresse verfügt und (2) die
            betroffene Person sich für den Newsletterversand registriert. An die
            von einer betroffenen Person erstmalig für den Newsletterversand
            eingetragene E-Mail-Adresse wird aus rechtlichen Gründen eine
            Bestätigungsmail im Double-Opt-In-Verfahren versendet. Diese
            Bestätigungsmail dient der Überprüfung, ob der Inhaber der
            E-Mail-Adresse als betroffene Person den Empfang des Newsletters
            autorisiert hat.
            <br />
            <br />
            Bei der Anmeldung zum Newsletter speichern wir ferner die vom
            Internet-Service-Provider (ISP) vergebene IP-Adresse des von der
            betroffenen Person zum Zeitpunkt der Anmeldung verwendeten
            Computersystems sowie das Datum und die Uhrzeit der Anmeldung. Die
            Erhebung dieser Daten ist erforderlich, um den(möglichen) Missbrauch
            der E-Mail-Adresse einer betroffenen Person zu einem späteren
            Zeitpunkt nachvollziehen zu können und dient deshalb der rechtlichen
            Absicherung des für die Verarbeitung Verantwortlichen.
            <br />
            <br />
            Die im Rahmen einer Anmeldung zum Newsletter erhobenen
            personenbezogenen Daten werden ausschließlich zum Versand unseres
            Newsletters verwendet. Ferner könnten Abonnenten des Newsletters per
            E-Mail informiert werden, sofern dies für den Betrieb des
            Newsletter-Dienstes oder eine diesbezügliche Registrierung
            erforderlich ist, wie dies im Falle von Änderungen am
            Newsletterangebot oder bei der Veränderung der technischen
            Gegebenheiten der Fall sein könnte. Es erfolgt keine Weitergabe der
            im Rahmen des Newsletter-Dienstes erhobenen personenbezogenen Daten
            an Dritte. Das Abonnement unseres Newsletters kann durch die
            betroffene Person jederzeit gekündigt werden. Die Einwilligung in
            die Speicherung personenbezogener Daten, die die betroffene Person
            uns für den Newsletterversand erteilt hat, kann jederzeit widerrufen
            werden. Zum Zwecke des Widerrufs der Einwilligung findet sich in
            jedem Newsletter ein entsprechender Link. Ferner besteht die
            Möglichkeit, sich jederzeit auch direkt auf der Internetseite des
            für die Verarbeitung Verantwortlichen vom Newsletterversand
            abzumelden oder dies dem für die Verarbeitung Verantwortlichen auf
            andere Weise mitzuteilen.
          </Box>
          <Heading variant='h2'>
            6. Kontaktmöglichkeit über die Internetseite
          </Heading>
          <Box>
            Die Internetseite von Hej Toto enthält aufgrund von gesetzlichen
            Vorschriften Angaben, die eine schnelle elektronische
            Kontaktaufnahme zu unserem Unternehmen sowie eine unmittelbare
            Kommunikation mit uns ermöglichen, was ebenfalls eine allgemeine
            Adresse der sogenannten elektronischen Post (E-Mail-Adresse)
            umfasst. Sofern eine betroffene Person per E-Mail oder über ein
            Kontaktformular den Kontakt mit dem für die Verarbeitung
            Verantwortlichen aufnimmt, werden die von der betroffenen Person
            übermittelten personenbezogenen Daten automatisch gespeichert.
            Solche auf freiwilliger Basis von einer betroffenen Person an den
            für die Verarbeitung Verantwortlichen übermittelten
            personenbezogenen Daten werden für Zwecke der Bearbeitung oder der
            Kontaktaufnahme zur betroffenen Person gespeichert. Es erfolgt keine
            Weitergabe dieser personenbezogenen Daten an Dritte.
          </Box>
          <Heading variant='h2'>
            7. Routinemäßige Löschung und Sperrung von personenbezogenen Daten
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche verarbeitet und speichert
            personenbezogene Daten der betroffenen Person nur für den Zeitraum,
            der zur Erreichung des Speicherungszwecks erforderlich ist oder
            sofern dies durch den Europäischen Richtlinien- und Verordnungsgeber
            oder einen anderen Gesetzgeber in Gesetzen oder Vorschriften,
            welchen der für die Verarbeitung Verantwortliche unterliegt,
            vorgesehen wurde.
            <br />
            <br />
            Entfällt der Speicherungszweck oder läuft eine vom Europäischen
            Richtlinien- und Verordnungsgeber oder einem anderen zuständigen
            Gesetzgeber vorgeschriebene Speicherfrist ab, werden die
            personenbezogenen Daten routinemäßig und entsprechend den
            gesetzlichen Vorschriften gesperrt oder gelöscht.
          </Box>
          <Heading variant='h2'>8. Rechte der betroffenen Person</Heading>
          <Heading variant='h3'>8.1 Recht auf Bestätigung</Heading>
          <Box>
            Jede betroffene Person hat das vom Europäischen Richtlinien- und
            Verordnungsgeber eingeräumte Recht, von dem für die Verarbeitung
            Verantwortlichen eine Bestätigung darüber zu verlangen, ob sie
            betreffende personenbezogene Daten verarbeitet werden. Möchte eine
            betroffene Person dieses Bestätigungsrecht in Anspruch nehmen, kann
            sie sich hierzu jederzeit an einen Mitarbeitenden des für die
            Verarbeitung Verantwortlichen wenden.
          </Box>
          <Heading variant='h3'>8.2 Recht auf Auskunft</Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, jederzeit von dem für die Verarbeitung Verantwortlichen
            unentgeltliche Auskunft über die zu seiner Person gespeicherten
            personenbezogenen Daten und eine Kopie dieser Auskunft zu erhalten.
            Ferner hat der Europäische Richtlinien- und Verordnungsgeber der
            betroffenen Person Auskunft über folgende Informationen zugestanden:
          </Box>
          <br />
          <UnorderedList>
            <ListItem>Die Verarbeitungszwecke</ListItem>
            <ListItem>
              Die Kategorien personenbezogener Daten, die verarbeitet werden
            </ListItem>
            <ListItem>
              Die Empfänger oder Kategorien von Empfängern, gegenüber denen die
              personenbezogenen Daten offengelegt worden sind oder noch
              offengelegt werden, insbesondere bei Empfängern in Drittländern
              oder bei internationalen Organisationen
            </ListItem>
            <ListItem>
              falls möglich die geplante Dauer, für die die personenbezogenen
              Daten gespeichert werden, oder, falls dies nicht möglich ist, die
              Kriterien für die Festlegung dieser Dauer
            </ListItem>
            <ListItem>
              Das Bestehen eines Rechts auf Berichtigung oder Löschung der sie
              betreffenden personenbezogenen Daten oder auf Einschränkung der
              Verarbeitung durch den Verantwortlichen oder eines
              Widerspruchsrechts gegen diese Verarbeitung
            </ListItem>
            <ListItem>
              Das Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde
            </ListItem>
            <ListItem>
              Wenn die personenbezogenen Daten nicht bei der betroffenen Person
              erhoben werden: Alle verfügbaren Informationen über die Herkunft
              der Daten
            </ListItem>
            <ListItem>
              Das Bestehen einer automatisierten Entscheidungsfindung
              einschließlich Profiling gemäß Artikel 22 Abs.1 und 4 DS-GVO und —
              zumindest in diesen Fällen — aussagekräftige Informationen über
              die involvierte Logik sowie die Tragweite und die angestrebten
              Auswirkungen einer derartigen Verarbeitung für die betroffene
              Person
            </ListItem>
          </UnorderedList>
          <br />
          <Box>
            Ferner steht der betroffenen Person ein Auskunftsrecht darüber zu,
            ob personenbezogene Daten an ein Drittland oder an eine
            internationale Organisation übermittelt wurden. Sofern dies der Fall
            ist, so steht der betroffenen Person im Übrigen das Recht zu,
            Auskunft über die geeigneten Garantien im Zusammenhang mit der
            Übermittlung zu erhalten.Möchte eine betroffene Person dieses
            Auskunftsrecht in Anspruch nehmen, kann sie sich hierzu jederzeit an
            einen Mitarbeitenden des für die Verarbeitung Verantwortlichen
            wenden.
          </Box>
          <Heading variant='h3'>8.3 Recht auf Berichtigung</Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, die unverzügliche Berichtigung sie betreffender unrichtiger
            personenbezogener Daten zu verlangen. Ferner steht der betroffenen
            Person das Recht zu, unter Berücksichtigung der Zwecke der
            Verarbeitung, die Vervollständigung unvollständiger
            personenbezogener Daten — auch mittels einer ergänzenden Erklärung —
            zu verlangen.Möchte eine betroffene Person dieses Berichtigungsrecht
            in Anspruch nehmen, kann sie sich hierzu jederzeit an einen
            Mitarbeitenden des für die Verarbeitung Verantwortlichen wenden.
          </Box>
          <Heading variant='h3'>
            8.4 Recht auf Löschung (Recht auf Vergessen werden)
          </Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, von dem Verantwortlichen zu verlangen, dass die sie
            betreffenden personenbezogenen Daten unverzüglich gelöscht werden,
            sofern einer der folgenden Gründe zutrifft und soweit die
            Verarbeitung nicht erforderlich ist:
          </Box>
          <br />
          <UnorderedList>
            <ListItem>
              Die personenbezogenen Daten wurden für solche Zwecke erhoben oder
              auf sonstige Weise verarbeitet, für welche sie nicht mehr
              notwendig sind.
            </ListItem>
            <ListItem>
              Die betroffene Person widerruft ihre Einwilligung, auf die sich
              die Verarbeitung gemäß Art. 6 Abs. 1 Buchstabe a DS-GVO oder Art.
              9 Abs. 2 Buchstabe a DS-GVO stützte, und es fehlt an einer
              anderweitigen Rechtsgrundlage für die Verarbeitung.
            </ListItem>
            <ListItem>
              Die betroffene Person legt gemäß Art. 21 Abs. 1 DS-GVO Widerspruch
              gegen die Verarbeitung ein, und es liegen keine vorrangigen
              berechtigten Gründe für die Verarbeitung vor, oder die betroffene
              Person legt gemäß Art. 21 Abs. 2 DS-GVO Widerspruch gegen die
              Verarbeitung ein.
            </ListItem>
            <ListItem>
              Die personenbezogenen Daten wurden unrechtmäßig verarbeitet.
            </ListItem>
            <ListItem>
              Die Löschung der personenbezogenen Daten ist zur Erfüllung einer
              rechtlichen Verpflichtung nach dem Unionsrecht oder dem Recht der
              Mitgliedstaaten erforderlich, dem der Verantwortliche unterliegt.
            </ListItem>
            <ListItem>
              Die personenbezogenen Daten wurden in Bezug auf angebotene Dienste
              der Informationsgesellschaft gemäß Art. 8 Abs. 1 DS-GVO erhoben.
            </ListItem>
          </UnorderedList>
          <br />
          <Box>
            Sofern einer der oben genannten Gründe zutrifft und eine betroffene
            Person die Löschung von personenbezogenen Daten, die bei Hej Toto
            gespeichert sind, veranlassen möchte, kann sie sich hierzu jederzeit
            an einen Mitarbeitenden des für die Verarbeitung Verantwortlichen
            wenden. Die Mitarbeitenden von Hej Toto wird veranlassen, dass dem
            Löschverlangen unverzüglich nachgekommen wird.Wurden die
            personenbezogenen Daten von Hej Toto öffentlich gemacht und ist
            unser Unternehmen als Verantwortlicher gemäß Art. 17 Abs. 1 DS-GVO
            zur Löschung der personenbezogenen Daten verpflichtet, so trifft Hej
            Toto unter Berücksichtigung der verfügbaren Technologie und der
            Implementierungskosten angemessene Maßnahmen, auch technischer Art,
            um andere für die Datenverarbeitung Verantwortliche, welche die
            veröffentlichten personenbezogenen Daten verarbeiten, darüber in
            Kenntnis zu setzen, dass die betroffene Person von diesen anderen
            für die Datenverarbeitung Verantwortlichen die Löschung sämtlicher
            Links zu diesen personenbezogenen Daten oder von Kopien oder
            Replikationen dieser personenbezogenen Daten verlangt hat, soweit
            die Verarbeitung nicht erforderlich ist. Der Mitarbeitende von Hej
            Toto wird im Einzelfall das Notwendige veranlassen.
          </Box>
          <Heading variant='h3'>
            8.5 Recht auf Einschränkung der Verarbeitung
          </Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, von dem Verantwortlichen die Einschränkung der Verarbeitung
            zu verlangen, wenn eine der folgenden Voraussetzungen gegeben ist:
          </Box>
          <br />
          <UnorderedList>
            <ListItem>
              Die Richtigkeit der personenbezogenen Daten wird von der
              betroffenen Person bestritten, und zwar für eine Dauer, die es dem
              Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen
              Daten zu überprüfen.
            </ListItem>
            <ListItem>
              Die Verarbeitung ist unrechtmäßig, die betroffene Person lehnt die
              Löschung der personenbezogenen Daten ab und verlangt stattdessen
              die Einschränkung der Nutzung der personenbezogenen Daten.
            </ListItem>
            <ListItem>
              Der Verantwortliche benötigt die personenbezogenen Daten für die
              Zwecke der Verarbeitung nicht länger, die betroffene Person
              benötigt sie jedoch zur Geltendmachung, Ausübung oder Verteidigung
              von Rechtsansprüchen.
            </ListItem>
            <ListItem>
              Die betroffene Person hat Widerspruch gegen die Verarbeitung gem.
              Art. 21 Abs. 1 DS-GVO eingelegt und es steht noch nicht fest, ob
              die berechtigten Gründe des Verantwortlichen gegenüber denen der
              betroffenen Person überwiegen.
            </ListItem>
          </UnorderedList>
          <br />
          <Box>
            Sofern eine der oben genannten Voraussetzungen gegeben ist und eine
            betroffene Person die Einschränkung von personenbezogenen Daten, die
            bei Hej Toto gespeichert sind, verlangen möchte, kann sie sich
            hierzu jederzeit an einen Mitarbeitenden des für die Verarbeitung
            Verantwortlichen wenden. Der Mitarbeitende von Hej Toto wird die
            Einschränkung der Verarbeitung veranlassen.
          </Box>
          <Heading variant='h3'>8.6 Recht auf Datenübertragbarkeit</Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, die sie betreffenden personenbezogenen Daten, welche durch
            die betroffene Person einem Verantwortlichen bereitgestellt wurden,
            in einem strukturierten, gängigen und maschinenlesbaren Format zu
            erhalten. Sie hat außerdem das Recht, diese Daten einem anderen
            Verantwortlichen ohne Behinderung durch den Verantwortlichen, dem
            die personenbezogenen Daten bereitgestellt wurden, zu übermitteln,
            sofern die Verarbeitung auf der Einwilligung gemäß Art. 6 Abs. 1
            Buchstabe a DS-GVO oder Art. 9 Abs. 2 Buchstabe a DS-GVO oder auf
            einem Vertrag gemäß Art. 6 Abs. 1 Buchstabe b DS-GVO beruht und die
            Verarbeitung mithilfe automatisierter Verfahren erfolgt, sofern die
            Verarbeitung nicht für die Wahrnehmung einer Aufgabe erforderlich
            ist, die im öffentlichen Interesse liegt oder in Ausübung
            öffentlicher Gewalt erfolgt, welche dem Verantwortlichen übertragen
            wurde.Ferner hat die betroffene Person bei der Ausübung ihres Rechts
            auf Datenübertragbarkeit gemäß Art. 20 Abs. 1 DS-GVO das Recht, zu
            erwirken, dass die personenbezogenen Daten direkt von einem
            Verantwortlichen an einen anderen Verantwortlichen übermittelt
            werden, soweit dies technisch machbar ist und sofern hiervon nicht
            die Rechte und Freiheiten anderer Personen beeinträchtigt werden.Zur
            Geltendmachung des Rechts auf Datenübertragbarkeit kann sich die
            betroffene Person jederzeit an einen Mitarbeitenden von Hej Toto
            wenden.
          </Box>
          <Heading variant='h3'>8.7 Recht auf Widerspruch</Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, aus Gründen, die sich aus ihrer besonderen Situation ergeben,
            jederzeit gegen die Verarbeitung sie betreffender personenbezogener
            Daten, die aufgrund von Art. 6 Abs. 1 Buchstaben e oder f DS-GVO
            erfolgt, Widerspruch einzulegen. Dies gilt auch für ein auf diese
            Bestimmungen gestütztes Profiling. Hej Toto verarbeitet die
            personenbezogenen Daten im Falle des Widerspruchs nicht mehr, es sei
            denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung
            nachweisen, die den Interessen, Rechten und Freiheiten der
            betroffenen Person überwiegen, oder die Verarbeitung dient der
            Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
            Verarbeitet Hej Toto personenbezogene Daten, um Direktwerbung zu
            betreiben, so hat die betroffene Person das Recht, jederzeit
            Widerspruch gegen die Verarbeitung der personenbezogenen Daten zum
            Zwecke derartiger Werbung einzulegen. Dies gilt auch für das
            Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
            Widerspricht die betroffene Person gegenüber Hej Toto der
            Verarbeitung für Zwecke der Direktwerbung, so wird Hej Toto die
            personenbezogenen Daten nicht mehr für diese Zwecke verarbeiten.
            Zudem hat die betroffene Person das Recht, aus Gründen, die sich aus
            ihrer besonderen Situation ergeben, gegen die sie betreffende
            Verarbeitung personenbezogener Daten, die bei Hej Toto zu
            wissenschaftlichen oder historischen Forschungszwecken oder zu
            statistischen Zwecken gemäß Art. 89 Abs. 1 DS-GVO erfolgen,
            Widerspruch einzulegen, es sei denn, eine solche Verarbeitung ist
            zur Erfüllung einer im öffentlichen Interesse liegenden Aufgabe
            erforderlich.Zur Ausübung des Rechts auf Widerspruch kann sich die
            betroffene Person direkt an jeden Mitarbeitenden von Hej Toto oder
            einen anderen Mitarbeitenden wenden. Der betroffenen Person steht es
            ferner frei, im Zusammenhang mit der Nutzung von Diensten der
            Informationsgesellschaft, ungeachtet der Richtlinie 2002/58/EG, ihr
            Widerspruchsrecht mittels automatisierter Verfahren auszuüben, bei
            denen technische Spezifikationen verwendet werden.
          </Box>
          <Heading variant='h3'>
            8.8 Automatisierte Entscheidungen im Einzelfall einschließlich
            Profiling
          </Heading>
          <Box>
            Jede von der Verarbeitung personenbezogener Daten betroffene Person
            hat das vom Europäischen Richtlinien- und Verordnungsgeber gewährte
            Recht, nicht einer ausschließlich auf einer automatisierten
            Verarbeitung — einschließlich Profiling — beruhenden Entscheidung
            unterworfen zu werden, die ihr gegenüber rechtliche Wirkung
            entfaltet oder sie in ähnlicher Weise erheblich beeinträchtigt,
            sofern die Entscheidung (1) nicht für den Abschluss oder die
            Erfüllung eines Vertrags zwischen der betroffenen Person und dem
            Verantwortlichen erforderlich ist, oder (2) aufgrund von
            Rechtsvorschriften der Union oder der Mitgliedstaaten, denen der
            Verantwortliche unterliegt, zulässig ist und diese
            Rechtsvorschriften angemessene Maßnahmen zur Wahrung der Rechte und
            Freiheiten sowie der berechtigten Interessen der betroffenen Person
            enthalten oder (3) mit ausdrücklicher Einwilligung der betroffenen
            Person erfolgt.Ist die Entscheidung (1) für den Abschluss oder die
            Erfüllung eines Vertrags zwischen der betroffenen Person und dem
            Verantwortlichen erforderlich oder (2) erfolgt sie mit
            ausdrücklicher Einwilligung der betroffenen Person, trifft Hej Toto
            angemessene Maßnahmen, um die Rechte und Freiheiten sowie die
            berechtigten Interessen der betroffenen Person zu wahren, wozu
            mindestens das Recht auf Erwirkung des Eingreifens einer Person
            seitens des Verantwortlichen, auf Darlegung des eigenen Standpunkts
            und auf Anfechtung der Entscheidung gehört.Möchte die betroffene
            Person Rechte mit Bezug auf automatisierte Entscheidungen geltend
            machen, kann sie sich hierzu jederzeit an einen Mitarbeitenden des
            für die Verarbeitung Verantwortlichen wenden.
          </Box>
          <Heading variant='h3'>
            8.9 Recht auf Widerruf einer datenschutzrechtlichen Einwilligung
          </Heading>
          <Box>
            Recht auf Widerruf einer datenschutzrechtlichen EinwilligungJede von
            der Verarbeitung personenbezogener Daten betroffene Person hat das
            vom Europäischen Richtlinien- und Verordnungsgeber gewährte Recht,
            eine Einwilligung zur Verarbeitung personenbezogener Daten jederzeit
            zu widerrufen.Möchte die betroffene Person ihr Recht auf Widerruf
            einer Einwilligung geltend machen, kann sie sich hierzu jederzeit an
            einen Mitarbeitenden des für die Verarbeitung Verantwortlichen
            wenden.
          </Box>
          <Heading variant='h2'>
            9. Datenschutz bei Bewerbungen und im Bewerbungsverfahren
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche erhebt und verarbeitet die
            personenbezogenen Daten von Bewerbern zum Zwecke der Abwicklung des
            Bewerbungsverfahrens. Die Verarbeitung kann auch auf elektronischem
            Wege erfolgen. Dies ist insbesondere dann der Fall, wenn ein
            Bewerber entsprechende Bewerbungsunterlagen auf dem elektronischen
            Wege, beispielsweise per E-Mail oder über ein auf der Internetseite
            befindliches Webformular, an den für die Verarbeitung
            Verantwortlichen übermittelt. Schließt der für die Verarbeitung
            Verantwortliche einen Anstellungsvertrag mit einem Bewerber, werden
            die übermittelten Daten zum Zwecke der Abwicklung des
            Beschäftigungsverhältnisses unter Beachtung der gesetzlichen
            Vorschriften gespeichert. Wird von dem für die Verarbeitung
            Verantwortlichen kein Anstellungsvertrag mit dem Bewerber
            geschlossen, so werden die Bewerbungsunterlagen zwei Monate nach
            Bekanntgabe der Absageentscheidung automatisch gelöscht, sofern
            einer Löschung keine sonstigen berechtigten Interessen des für die
            Verarbeitung Verantwortlichen entgegenstehen. Sonstiges berechtigtes
            Interesse in diesem Sinne ist beispielsweise eine Beweispflicht in
            einem Verfahren nach dem Allgemeinen Gleichbehandlungsgesetz (AGG).
          </Box>
          <Heading variant='h2'>
            10. Datenschutzbestimmungen zu Einsatz und Verwendung von Instagram
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche hat auf dieser
            Internetseite Komponenten des Dienstes Instagram integriert.
            Instagram ist ein Dienst, der als audiovisuelle Plattform zu
            qualifizieren ist und den Nutzern das Teilen von Fotos und Videos
            und zudem eine Weiterverbreitung solcher Daten in anderen sozialen
            Netzwerken ermöglicht. Betreibergesellschaft der Dienste von
            Instagram ist die Facebook Ireland Ltd., 4 Grand Canal Square, Grand
            Canal Harbour, Dublin 2 Ireland. Durch jeden Aufruf einer der
            Einzelseiten dieser Internetseite, die durch den für die
            Verarbeitung Verantwortlichen betrieben wird und auf welcher eine
            Instagram-Komponente (Insta-Button) integriert wurde, wird der
            Internetbrowser auf dem informationstechnologischen System der
            betroffenen Person automatisch durch die jeweilige
            Instagram-Komponente veranlasst, eine Darstellung der entsprechenden
            Komponente von Instagram herunterzuladen. Im Rahmen dieses
            technischen Verfahrens erhält Instagram Kenntnis darüber, welche
            konkrete Unterseite unserer Internetseite durch die betroffene
            Person besucht wird. Sofern die betroffene Person gleichzeitig bei
            Instagram eingeloggt ist, erkennt Instagram mit jedem Aufruf unserer
            Internetseite durch die betroffene Person und während der gesamten
            Dauer des jeweiligen Aufenthaltes auf unserer Internetseite, welche
            konkrete Unterseite die betroffene Person besucht. Diese
            Informationen werden durch die Instagram-Komponente gesammelt und
            durch Instagram dem jeweiligen Instagram-Account der betroffenen
            Person zugeordnet. Betätigt die betroffene Person einen der auf
            unserer Internetseite integrierten Instagram-Buttons, werden die
            damit übertragenen Daten und Informationen dem persönlichen
            Instagram-Benutzerkonto der betroffenen Person zugeordnet und von
            Instagram gespeichert und verarbeitet. Instagram erhält über die
            Instagram-Komponente immer dann eine Information darüber, dass die
            betroffene Person unsere Internetseite besucht hat, wenn die
            betroffene Person zum Zeitpunkt des Aufrufs unserer Internetseite
            gleichzeitig bei Instagram eingeloggt ist; dies findet unabhängig
            davon statt, ob die betroffene Person die Instagram-Komponente
            anklickt oder nicht. Ist eine derartige Übermittlung dieser
            Informationen an Instagram von der betroffenen Person nicht gewollt,
            kann diese die Übermittlung dadurch verhindern, dass sie sich vor
            einem Aufruf unserer Internetseite aus ihrem Instagram-Account
            ausloggt.
          </Box>
          <Heading variant='h2'>
            11. Datenschutzbestimmungen zu Einsatz und Verwendung von LinkedIn
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche hat auf dieser
            Internetseite Komponenten der LinkedIn Corporation integriert.
            LinkedIn ist ein Internetbasiertes soziales Netzwerk, das eine
            Konnektierung der Nutzer mit bestehenden Geschäftskontakten sowie
            das Knüpfen von neuen Businesskontakten ermöglicht. Über 400
            Millionen registrierte Personen nutzen LinkedIn in mehr als 200
            Ländern. Damit ist LinkedIn derzeit die größte Plattform für
            Businesskontakte und eine der meistbesuchten Internetseiten der
            Welt. Betreibergesellschaft von LinkedIn ist die LinkedIn
            Corporation, 2029 Stierlin Court Mountain View, CA 94043, USA. Für
            Datenschutzangelegenheiten außerhalb der USA ist LinkedIn Ireland,
            Privacy Policy Issues, Wilton Plaza, Wilton Place, Dublin 2,
            Ireland, zuständig. Bei jedem einzelnen Abruf unserer Internetseite,
            die mit einer LinkedIn-Komponente (LinkedIn-Plug-In) ausgestattet
            ist, veranlasst diese Komponente, dass der von der betroffenen
            Person verwendete Browser eine entsprechende Darstellung der
            Komponente von LinkedIn herunterlädt. Weitere Informationen zu den
            LinkedIn-Plug-Ins können unter
            https://developer.linkedin.com/plugins abgerufen werden. Im Rahmen
            dieses technischen Verfahrens erhält LinkedIn Kenntnis darüber,
            welche konkrete Unterseite unserer Internetseite durch die
            betroffene Person besucht wird. Sofern die betroffene Person
            gleichzeitig bei LinkedIn eingeloggt ist, erkennt LinkedIn mit jedem
            Aufruf unserer Internetseite durch die betroffene Person und während
            der gesamten Dauer des jeweiligen Aufenthaltes auf unserer
            Internetseite, welche konkrete Unterseite unserer Internetseite die
            betroffene Person besucht. Diese Informationen werden durch die
            LinkedIn-Komponente gesammelt und durch LinkedIn dem jeweiligen
            LinkedIn-Account der betroffenen Person zugeordnet. Betätigt die
            betroffene Person einen auf unserer Internetseite integrierten
            LinkedIn-Button, ordnet LinkedIn diese Information dem persönlichen
            LinkedIn-Benutzerkonto der betroffenen Person zu und speichert diese
            personenbezogenen Daten. LinkedIn erhält über die
            LinkedIn-Komponente immer dann eine Information darüber, dass die
            betroffene Person unsere Internetseite besucht hat, wenn die
            betroffene Person zum Zeitpunkt des Aufrufes unserer Internetseite
            gleichzeitig bei LinkedIn eingeloggt ist; dies findet unabhängig
            davon statt, ob die betroffene Person die LinkedIn-Komponente
            anklickt oder nicht. Ist eine derartige Übermittlung dieser
            Informationen an LinkedIn von der betroffenen Person nicht gewollt,
            kann diese die Übermittlung dadurch verhindern, dass sie sich vor
            einem Aufruf unserer Internetseite aus ihrem LinkedIn-Account
            ausloggt. LinkedIn bietet unter
            https://www.linkedin.com/psettings/guest-controls die Möglichkeit,
            E-Mail-Nachrichten, SMS-Nachrichten und zielgerichtete Anzeigen
            abzubestellen sowie Anzeigen-Einstellungen zu verwalten. LinkedIn
            nutzt ferner Partner wie Quantcast, Google Analytics, BlueKai,
            DoubleClick, Nielsen, Comscore, Eloqua und Lotame, die Cookies
            setzen können. Solche Cookies können unter
            https://www.linkedin.com/legal/cookie-policy abgelehnt werden.{' '}
          </Box>
          <Heading variant='h2'>
            12. Datenschutzbestimmungen zu Einsatz und Verwendung von Matomo
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche hat auf dieser
            Internetseite die Komponente Matomo integriert. Matomo ist ein
            Open-Source-Softwaretool zur Web-Analyse. Web-Analyse ist die
            Erhebung, Sammlung und Auswertung von Daten über das Verhalten von
            Besuchern von Internetseiten. Ein Web-Analyse-Tool erfasst unter
            anderem Daten darüber, von welcher Internetseite eine betroffene
            Person auf eine Internetseite gekommen ist (sogenannter Referrer),
            auf welche Unterseiten der Internetseite zugegriffen oder wie oft
            und für welche Verweildauer eine Unterseite betrachtet wurde. Eine
            Web-Analyse wird überwiegend zur Optimierung einer Internetseite und
            zur Kosten-Nutzen-Analyse von Internetwerbung eingesetzt. Die
            Software wird auf dem Server des für die Verarbeitung
            Verantwortlichen betrieben, die datenschutzrechtlich sensiblen
            Logdateien werden ausschließlich auf diesem Server gespeichert. Der
            Zweck der Matomo-Komponente ist die Analyse der Besucherströme auf
            unserer Internetseite. Der für die Verarbeitung Verantwortliche
            nutzt die gewonnenen Daten und Informationen unter anderem dazu, die
            Nutzung dieser Internetseite auszuwerten, um Online-Reports, welche
            die Aktivitäten auf unseren Internetseiten aufzeigen,
            zusammenzustellen. Matomo setzt ein Cookie auf dem
            informationstechnologischen System der betroffenen Person. Was
            Cookies sind, wurde oben bereits erläutert. Mit der Setzung des
            Cookies wird uns eine Analyse der Benutzung unserer Internetseite
            ermöglicht. Durch jeden Aufruf einer der Einzelseiten dieser
            Internetseite wird der Internetbrowser auf dem
            informationstechnologischen System der betroffenen Person
            automatisch durch die Matomo-Komponente veranlasst, Daten zum Zwecke
            der Online-Analyse an unseren Server zu übermitteln. Im Rahmen
            dieses technischen Verfahrens erhalten wir Kenntnis über
            personenbezogene Daten, wie der IP-Adresse der betroffenen Person,
            die uns unter anderem dazu dient, die Herkunft der Besucher und
            Klicks nachzuvollziehen. Mittels des Cookies werden personenbezogene
            Informationen, beispielsweise die Zugriffszeit, der Ort, von welchem
            ein Zugriff ausging und die Häufigkeit der Besuche auf unserer
            Internetseite gespeichert. Bei jedem Besuch unserer Internetseiten
            werden diese personenbezogenen Daten, einschließlich der IP-Adresse
            des von der betroffenen Person genutzten Internetanschlusses, an
            unseren Server übertragen. Diese personenbezogenen Daten werden
            durch uns gespeichert. Wir geben diese personenbezogenen Daten nicht
            an Dritte weiter. Die betroffene Person kann die Setzung von Cookies
            durch unsere Internetseite, wie oben bereits dargestellt, jederzeit
            mittels einer entsprechenden Einstellung des genutzten
            Internetbrowsers verhindern und damit der Setzung von Cookies
            dauerhaft widersprechen. Eine solche Einstellung des genutzten
            Internetbrowsers würde auch verhindern, dass Matomo ein Cookie auf
            dem informationstechnologischen System der betroffenen Person setzt.
            Zudem kann ein von Matomo bereits gesetzter Cookie jederzeit über
            einen Internetbrowser oder andere Softwareprogramme gelöscht werden.
            Ferner besteht für die betroffene Person die Möglichkeit, einer
            Erfassung der durch den Matomo erzeugten, auf eine Nutzung dieser
            Internetseite bezogenen Daten zu widersprechen und eine solche zu
            verhindern. Hierzu muss die betroffene Person in Ihrem Browser
            `&quot;`Do Not Track`&quot;` einstellen. Mit der Setzung des
            Opt-Out-Cookies besteht jedoch die Möglichkeit, dass die
            Internetseiten des für die Verarbeitung Verantwortlichen für die
            betroffene Person nicht mehr vollumfänglich nutzbar sind. Weitere
            Informationen und die geltenden Datenschutzbestimmungen von Matomo
            können unter https://matomo.org/privacy/ abgerufen werden.
          </Box>
          <Heading variant='h2'>
            13. Datenschutzbestimmungen zu Einsatz und Verwendung von YouTube
          </Heading>
          <Box>
            Der für die Verarbeitung Verantwortliche hat auf dieser
            Internetseite Komponenten von YouTube integriert. YouTube ist ein
            Internet-Videoportal, dass Video-Publishern das kostenlose
            Einstellen von Videoclips und anderen Nutzern die ebenfalls
            kostenfreie Betrachtung, Bewertung und Kommentierung dieser
            ermöglicht. YouTube gestattet die Publikation aller Arten von
            Videos, weshalb sowohl komplette Film- und Fernsehsendungen, aber
            auch Musikvideos, Trailer oder von Nutzern selbst angefertigte
            Videos über das Internetportal abrufbar sind. Betreibergesellschaft
            von YouTube ist die Google Ireland Limited, Gordon House, Barrow
            Street, Dublin, D04 E5W5, Ireland. Durch jeden Aufruf einer der
            Einzelseiten dieser Internetseite, die durch den für die
            Verarbeitung Verantwortlichen betrieben wird und auf welcher eine
            YouTube-Komponente (YouTube-Video) integriert wurde, wird der
            Internetbrowser auf dem informationstechnologischen System der
            betroffenen Person automatisch durch die jeweilige
            YouTube-Komponente veranlasst, eine Darstellung der entsprechenden
            YouTube-Komponente von YouTube herunterzuladen. Weitere
            Informationen zu YouTube können unter
            https://www.youtube.com/yt/about/de/ abgerufen werden. Im Rahmen
            dieses technischen Verfahrens erhalten YouTube und Google Kenntnis
            darüber, welche konkrete Unterseite unserer Internetseite durch die
            betroffene Person besucht wird. Sofern die betroffene Person
            gleichzeitig bei YouTube eingeloggt ist, erkennt YouTube mit dem
            Aufruf einer Unterseite, die ein YouTube-Video enthält, welche
            konkrete Unterseite unserer Internetseite die betroffene Person
            besucht. Diese Informationen werden durch YouTube und Google
            gesammelt und dem jeweiligen YouTube-Account der betroffenen Person
            zugeordnet. YouTube und Google erhalten über die YouTube-Komponente
            immer dann eine Information darüber, dass die betroffene Person
            unsere Internetseite besucht hat, wenn die betroffene Person zum
            Zeitpunkt des Aufrufs unserer Internetseite gleichzeitig bei YouTube
            eingeloggt ist; dies findet unabhängig davon statt, ob die
            betroffene Person ein YouTube-Video anklickt oder nicht. Ist eine
            derartige Übermittlung dieser Informationen an YouTube und Google
            von der betroffenen Person nicht gewollt, kann diese die
            Übermittlung dadurch verhindern, dass sie sich vor einem Aufruf
            unserer Internetseite aus ihrem YouTube-Account ausloggt.
          </Box>
          <Heading variant='h2'>14. Rechtsgrundlage der Verarbeitung</Heading>
          <Box>
            Art. 6 I lit. a DS-GVO dient unserem Unternehmen als Rechtsgrundlage
            für Verarbeitungsvorgänge, bei denen wir eine Einwilligung für einen
            bestimmten Verarbeitungszweck einholen. Ist die Verarbeitung
            personenbezogener Daten zur Erfüllung eines Vertrags, dessen
            Vertragspartei die betroffene Person ist, erforderlich, wie dies
            beispielsweise bei Verarbeitungsvorgängen der Fall ist, die für eine
            Lieferung von Waren oder die Erbringung einer sonstigen Leistung
            oder Gegenleistung notwendig sind, so beruht die Verarbeitung auf
            Art. 6 I lit. b DS-GVO. Gleiches gilt für solche
            Verarbeitungsvorgänge die zur Durchführung vorvertraglicher
            Maßnahmen erforderlich sind, etwa in Fällen von Anfragen zur unseren
            Produkten oder Leistungen. Unterliegt unser Unternehmen einer
            rechtlichen Verpflichtung durch welche eine Verarbeitung von
            personenbezogenen Daten erforderlich wird, wie beispielsweise zur
            Erfüllung steuerlicher Pflichten, so basiert die Verarbeitung auf
            Art. 6 I lit. c DS-GVO. In seltenen Fällen könnte die Verarbeitung
            von personenbezogenen Daten erforderlich werden, um lebenswichtige
            Interessen der betroffenen Person oder einer anderen natürlichen
            Person zu schützen. Dies wäre beispielsweise der Fall, wenn ein
            Besucher in unserem Betrieb verletzt werden würde und daraufhin sein
            Name, sein Alter, seine Krankenkassendaten oder sonstige
            lebenswichtige Informationen an einen Arzt, ein Krankenhaus oder
            sonstige Dritte weitergegeben werden müssten. Dann würde die
            Verarbeitung auf Art. 6 I lit. d DS-GVO beruhen. Letztlich könnten
            Verarbeitungsvorgänge auf Art. 6 I lit. f DS-GVO beruhen. Auf dieser
            Rechtsgrundlage basieren Verarbeitungsvorgänge, die von keiner der
            vorgenannten Rechtsgrundlagen erfasst werden, wenn die Verarbeitung
            zur Wahrung eines berechtigten Interesses unseres Unternehmens oder
            eines Dritten erforderlich ist, sofern die Interessen, Grundrechte
            und Grundfreiheiten des Betroffenen nicht überwiegen. Solche
            Verarbeitungsvorgänge sind uns insbesondere deshalb gestattet, weil
            sie durch den Europäischen Gesetzgeber besonders erwähnt wurden. Er
            vertrat insoweit die Auffassung, dass ein berechtigtes Interesse
            anzunehmen sein könnte, wenn die betroffene Person ein Kunde des
            Verantwortlichen ist (Erwägungsgrund 47 Satz 2 DS-GVO).
          </Box>
          <Heading variant='h2'>
            15. Berechtigte Interessen an der Verarbeitung
          </Heading>
          <Box>
            Die von dem Verantwortlichen oder einem Dritten verfolgt werden:
            Basiert die Verarbeitung personenbezogener Daten auf Artikel 6 I
            lit. f DS-GVO ist unser berechtigtes Interesse die Durchführung
            unserer Geschäftstätigkeit zugunsten des Wohlergehens all unserer
            Mitarbeitenden und unserer Anteilseigner.
          </Box>
          <Heading variant='h2'>
            16. Dauer, für die die personenbezogenen Daten gespeichert werden
          </Heading>
          <Box>
            Das Kriterium für die Dauer der Speicherung von personenbezogenen
            Daten ist die jeweilige gesetzliche Aufbewahrungsfrist. Nach Ablauf
            der Frist werden die entsprechenden Daten routinemäßig gelöscht,
            sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung
            erforderlich sind.
          </Box>
          <Heading variant='h2'>
            17. Bereitstellung der personenbezogenen Daten
          </Heading>
          <Box>
            Gesetzliche oder vertragliche Vorschriften zur Bereitstellung der
            personenbezogenen Daten. Erforderlichkeit für den Vertragsabschluss;
            Verpflichtung der betroffenen Person, die personenbezogenen Daten
            bereitzustellen; mögliche Folgen der Nichtbereitstellung. Wir klären
            Sie darüber auf, dass die Bereitstellung personenbezogener Daten zum
            Teil gesetzlich vorgeschrieben ist (z.B. Steuervorschriften) oder
            sich auch aus vertraglichen Regelungen (z.B. Angaben zum
            Vertragspartner) ergeben kann. Mitunter kann es zu einem
            Vertragsschluss erforderlich sein, dass eine betroffene Person uns
            personenbezogene Daten zur Verfügung stellt, die in der Folge durch
            uns verarbeitet werden müssen. Die betroffene Person ist
            beispielsweise verpflichtet uns personenbezogene Daten
            bereitzustellen, wenn unser Unternehmen mit ihr einen Vertrag
            abschließt. Eine Nichtbereitstellung der personenbezogenen Daten
            hätte zur Folge, dass der Vertrag mit dem Betroffenen nicht
            geschlossen werden könnte. Vor einer Bereitstellung
            personenbezogener Daten durch den Betroffenen muss sich der
            Betroffene an einen unserer Mitarbeitenden wenden. Unser
            Mitarbeitenden klärt den Betroffenen einzelfallbezogen darüber auf,
            ob die Bereitstellung der personenbezogenen Daten gesetzlich oder
            vertraglich vorgeschrieben oder für den Vertragsabschluss
            erforderlich ist, ob eine Verpflichtung besteht, die
            personenbezogenen Daten bereitzustellen, und welche Folgen die
            Nichtbereitstellung der personenbezogenen Daten hätte.
          </Box>
          <Heading variant='h2'>
            18. Bestehen einer automatisierten Entscheidungsfindung
          </Heading>
          <Box>
            Als verantwortungsbewusstes Unternehmen verzichten wir auf eine
            automatische Entscheidungsfindung oder ein Profiling.
          </Box>
        </Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Privacy;
