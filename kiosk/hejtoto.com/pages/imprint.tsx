import { useTranslation } from 'react-i18next';

import PageLayout from '@/components/page-layout';
import { Box, Heading, HStack, Icon, Text } from '@chakra-ui/react';

import { StandardPage } from '@/components/page-layout/padding';
import Link from 'next/link';
import {
  FiGlobe,
  FiHash,
  FiMail,
  FiPhoneIncoming,
  FiUser,
} from 'react-icons/fi';

const Impressum = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('impressum')} description='Impressum von Hej Toto.'>
      <StandardPage heading={t('impressum')}>
        <Text>
          <Box>
            {t(
              'gemaess-den-gesetzlichen-bestimmungen-folgt-nun-das-impressum-hier-finden-sie-die-angaben-zum-anbieter-dieser-website-sowie-kontaktmoeglichkeiten-und-weitere-wichtige-informationen-wie-z-b-umsatzsteuer-identifikationsnummer-und-handelsregister-eintrag-bitte-beachten-sie-dass-das-impressum-auch-informationen-zum-datenschutz-und-haftungsausschluss-enthaelt-bei-fragen-oder-anliegen-koennen-sie-uns-gerne-ueber-die-angegebenen-kontaktdaten-erreichen'
            )}
          </Box>
          <Heading variant='h2'>Anschrift und Kontaktdaten</Heading>
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

          <Heading variant='h2'>Disclaimer (rechtliche Hinweise)</Heading>
          <Heading variant='h3'>Auskunfts- und Widerrufsrecht</Heading>
          <Box>
            Sie haben jederzeit das Recht, sich unentgeltlich und unverzüglich
            über die zu Ihrer Person erhobenen Daten zu erkundigen. Ebenfalls
            können Sie Ihre Zustimmung zur Verwendung Ihrer angegebenen
            persönlichen Daten mit Wirkung für die Zukunft widerrufen. Hierfür
            wenden Sie sich bitte an den im Impressum angegebenen
            Diensteanbieter.
          </Box>
          <Heading variant='h3'>Datenschutz (allgemein)</Heading>
          <Box>
            Beim Zugriff auf unsere Webseite werden automatisch allgemeine
            Informationen (sog. Server-Logfiles) erfasst. Diese beinhalten u.a.
            den von Ihnen verwendeten Webbrowser sowie Ihr Betriebssystem und
            Ihren Internet Service Provider. Diese Daten lassen keinerlei
            Rückschlüsse auf Ihre Person zu und werden von uns statistisch
            ausgewertet, um unseren Internetauftritt technisch und inhaltlich zu
            verbessern. Das Erfassen dieser Informationen ist notwendig, um den
            Inhalt der Webseite korrekt ausliefern zu können.
          </Box>
          <br />
          <Box>
            Die Nutzung der Webseite ist grundsätzlich ohne Angabe
            personenbezogener Daten möglich. Soweit personenbezogene Daten
            (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben
            werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
            Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an
            Dritte weitergegeben.
          </Box>
          <br />
          <Box>
            Sofern ein Vertragsverhältnis begründet, inhaltlich ausgestaltet
            oder geändert werden soll oder Sie an uns eine Anfrage stellen,
            erheben und verwenden wir personenbezogene Daten von Ihnen, soweit
            dies zu diesem Zwecke erforderlich ist (Bestandsdaten). Wir erheben,
            verarbeiten und nutzen personenbezogene Daten soweit dies
            erforderlich ist, um Ihnen die Inanspruchnahme des Webangebots zu
            ermöglichen (Nutzungsdaten). Sämtliche personenbezogenen Daten
            werden nur solange gespeichert wie dies für den genannten Zweck
            (Bearbeitung Ihrer Anfrage oder Abwicklung eines Vertrags)
            erforderlich ist. Hierbei werden steuer- und handelsrechtliche
            Aufbewahrungsfristen von uns berücksichtigt. Auf Anordnung der
            zuständigen Stellen müssen wir im Einzelfall Auskunft über diese
            Daten (Bestandsdaten) erteilen, soweit dies für Zwecke der
            Strafverfolgung, zur Gefahrenabwehr, zur Erfüllung der gesetzlichen
            Aufgaben der Verfassungsschutzbehörden oder des Militärischen
            Abschirmdienstes oder zur Durchsetzung der Rechte am geistigen
            Eigentum erforderlich ist.
          </Box>
          <br />
          <Box>
            Wir weisen ausdrücklich darauf hin, dass die Datenübertragung im
            Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken
            aufweisen kann. Vor dem Zugriff auf Daten kann nicht lückenlos
            geschützt werden.
          </Box>
          <br />
          <Box>
            Die Nutzung von im Rahmen der Impressumspflicht veröffentlichten
            Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
            angeforderter Werbung und Informationsmaterialien wird hiermit
            ausdrücklich untersagt. Ausgenommen hiervon sind bestehende
            Geschäftsbeziehungen bzw. es liegt Ihnen eine entsprechende
            Einwilligung von uns vor.
          </Box>
          <br />
          <Box>
            Die Anbieter und alle auf dieser Website genannten Dritten behalten
            sich ausdrücklich rechtliche Schritte im Falle der unverlangten
            Zusendung von Werbeinformationen vor. Gleiches gilt für die
            kommerzielle Verwendung und Weitergabe der Daten.
          </Box>
          <Heading variant='h2'>Disclaimer (Haftungsausschluss)</Heading>
          <Heading variant='h3'>1. Haftung für Inhalte</Heading>
          <Box>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
            oder Sperrung der Nutzung von Informationen nach den allgemeinen
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
            jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </Box>
          <Heading variant='h3'>2. Haftung für Links</Heading>
          <Box>
            Diese Website enthält Links zu externen Webseiten Dritter, auf deren
            Inhalte kein Einfluss genommen werden kann. Deshalb kann für diese
            fremden Inhalte auch keine Gewähr übernommen werden. Für die Inhalte
            der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden
            zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
            Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
            nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden
            derartige Links umgehend von dieser Website auf die
            rechtsverletzende Site entfernen.
          </Box>

          <Heading variant='h3'>4. Urheberrecht</Heading>
          <Box>
            Die durch die Diensteanbieter, deren Mitarbeiter und beauftragte
            Dritte erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
            Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
            Urheberrechtes bedürfen der vorherigen schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
            sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden derartige Inhalte umgehend entfernen.
          </Box>
        </Text>
      </StandardPage>
    </PageLayout>
  );
};

export default Impressum;
