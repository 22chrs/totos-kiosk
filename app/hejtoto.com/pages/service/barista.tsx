import { useTranslation } from 'react-i18next';

import PageLayout from '@/components/page-layout';
import { Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
};

const headingpt = '12';
const headingpb = '5';

const Barista = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('roboter-baristaservice')} description=''>
      {/* <GridTextImage
        pt='20vh'
        pb='10vh'
        child1={
          <Box>
            <Heading variant='logo'>{t('premium-coffee')}</Heading>
            <br />
            <Divider />
            <Text>
              {t('its')} <strong>{t('futuristic-design-0')}</strong>{' '}
              {t(
                'creates-an-attractive-ambiance-that-encourages-social-media-integration-and-customer-engagement-enjoy'
              )}
              <strong> {t('premium-quality')}</strong>{' '}
              {t(
                'beverages-that-rival-those-from-your-favorite-local-coffee-shop-all-from-the-convenience-of'
              )}{' '}
              <MagicLink
                as={NextLink}
                color={useColorModeValue(
                  'brandColor.lightMode',
                  'brandColor.darkMode'
                )}
                href='/'
              >
                <i>Hej Toto</i>
              </MagicLink>
              !
            </Text>
          </Box>
        }
        child2={
          <RandomImage
            alt='Cover Image'
            src={randomImagesBestBox()} // Add this line to provide the src prop
          />
        }
      /> */}
      <Stack pt='20vh' px='15vw' pb='15vh' align='start' w='100%'>
        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Technologisch Innovativ
        </Heading>
        <Heading variant='h2'>Barista Roboterarm Toto</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Implementierung mittels 6-Achsen-Roboterarms mit großem visuellen
            Anreiz
          </ListItem>
          <ListItem>
            Faszination durch menschenähnliche Bewegungscharakteristik des
            Roboterarms
          </ListItem>
          <ListItem>
            Mittels Facetracking wird eine echte Interaktion mit den Kund:innen
            geschaffen (DSGVO konform)
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>24/7 Automatisierung</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>Autonomer Betrieb ohne Personal</ListItem>
          <ListItem>
            Optimierung des Automaten auf Geschwindigkeit und Qualität
          </ListItem>
          <ListItem>
            Intelligente Ansteuerung und Beleuchtung lockt Kund:innen an und
            spart Ressourcen
          </ListItem>
        </UnorderedList>

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Premium Sortiment
        </Heading>
        <Heading variant='h2'>Getränke</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Heißgetränke wie Tee und Kaffee in Barista Qualität
          </ListItem>
          <ListItem>Verwendung von pflanzlichen Milchalternativen</ListItem>
          <ListItem>Ausgabe in Einweg- und Mehrwegbechern</ListItem>
          <ListItem>
            Kundenspezifische Individualisierungsmöglichkeiten
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>Speisen</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Bereitstellung von nachhaltigen und veganen Snackoptionen
          </ListItem>
          <ListItem>Transparente Kommunikation von Allergenen</ListItem>
        </UnorderedList>

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Kund:innenorientiert
        </Heading>

        <Heading variant='h2'>Zielgruppe</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Premium Kaffee- und Teeliebhaber:innen mit hohen Ansprüchen
          </ListItem>
          <ListItem>Menschen mit wenig Zeit</ListItem>
          <ListItem>Nachhaltige und vegane Ernährung</ListItem>
          <ListItem>
            Spannede Neuheit bietet Raum für Social-Media Interaktionen durch
            Kund:innen
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>Zugänglich</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Bereitstellung einer mehrsprachigen Benutzeroberfläche
          </ListItem>
          <ListItem>Gewährleistung eines barrierefreien Zugangs</ListItem>
          <ListItem>
            Intuitives Design ermöglichst einfache Bestellungen auch mehrerer
            Produkte gleichzeitig
          </ListItem>
          <ListItem>
            Zwei Terminals pro Automat zur Minimierung der Wartezeit
          </ListItem>
        </UnorderedList>

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Kompakt
        </Heading>
        <Heading variant='h2'>Design</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Vandalismusgeschützte Konstruktion für den Einsatz im öffentlichen
          </ListItem>

          <ListItem>
            Wahlweise autonomer Betrieb – unabhängig von Frisch- und Abwasser
          </ListItem>
          <ListItem>
            Kein Starkstromanschluss für den Betrieb notwendig
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>Transport</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Kompakte Maße für einfache Platzierung und Transport
          </ListItem>
          <ListItem>Transport per Standard Spedition möglich</ListItem>
        </UnorderedList>

        <Heading variant='h2'>Modular</Heading>

        <UnorderedList spacing={1} pl='10'>
          <ListItem>Zugänglich für Reperaturen und einfache Wartung</ListItem>
          <ListItem>
            Erweiterung des Angebots durch weitere Module möglich
          </ListItem>
        </UnorderedList>

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Prozessoptimiert
        </Heading>

        <Heading variant='h2'>Telemetriedaten</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Ausgestattet mit einem LTE Modem für ständige Konnektivität und
            Fernüberwachung
          </ListItem>
          <ListItem>
            Proaktive Reaktion auf Nachfüll- und Wartungsbedarf durch
            Integration von Telemetrie
          </ListItem>
          <ListItem>Zugriff auf Telemetriedaten über Webanwendung</ListItem>
          <ListItem>
            Flexible Anpassung von Angebot und Preisen ebenfalls möglich
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>Wiederbefüllung</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Warenbestand für 400 Heißgetränkge und 200 Snacks pro Befüllung
          </ListItem>
          <ListItem>
            Mitarbeitende ohne spezielle technische Kenntnisse können den
            Befüllvorgang druchführen
          </ListItem>
          <ListItem>
            Sensorik erfasst aktuellen Befüllstand und verhindert
            Fehlbedienungen oder Eingaben
          </ListItem>
        </UnorderedList>

        <Heading variant='h2'>Reinigung und Wartung</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Tägliche autonome Reinigungsfunktion gewährleistet Hygienestandards
          </ListItem>
          <ListItem>
            Zusätzliche manuelle Reinigung nur einmal monatlich erforderlich
          </ListItem>
        </UnorderedList>

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Markt
        </Heading>
        <Heading variant='h2'>Fester Standort</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Ideal für fest installierte Standorte mit hohem Besucheraufkommen
          </ListItem>

          <ListItem>
            Potential für zusätzliche Einnahmen durch Produktverkauf und
            Markenpräsentation
          </ListItem>
        </UnorderedList>
        <Heading variant='h2'>Flexibler Standort</Heading>
        <UnorderedList spacing={1} pl='10'>
          <ListItem>
            Geeignet zum temporären Einsatz für Veranstaltungen, Events und
            Messen
          </ListItem>
        </UnorderedList>
      </Stack>
    </PageLayout>
  );
};

export default Barista;
