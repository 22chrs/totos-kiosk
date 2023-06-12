import { useTranslation } from 'react-i18next';

import ImageAndText from '@/components/cards/ImageList';
import PageLayout from '@/components/page-layout';
import { Heading, Stack } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
};

const headingpt = '12';
const headingpb = '5';

const imageHeight = '15rem'; //5.5rem

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

        <ImageAndText
          imageUrl={`/assets/images/03.png`}
          title='Barista Roboterarm Toto'
          listItems={[
            '6-Achsen-Roboterarm schafft visuellen Anreiz',
            'Faszination durch menschenähnliche Bewegungscharakteristik des Roboterarms',
            'Sensorik erfasst Kund:innen, um echte Interaktion zu schaffen',
            'Gesamter Automat reagiert und interagiert mit Kund:innen und steigert Showeffekt',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/midjourney/01.jpg`}
          title='24/7 Automatisierung'
          listItems={[
            'Kein Personal notwenidig',
            'Optimierung auf Geschwindigkeit und Qualität',
            'Intelligente Ansteuerung spart Ressourcen',
          ]}
        />

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Premium Sortiment
        </Heading>

        <ImageAndText
          imageUrl={`/assets/images/coffee/03.png`}
          title='Getränke'
          listItems={[
            'Heißgetränke wie Tee und Kaffee in Barista Qualität',
            'Verwendung von pflanzlichen Milchalternativen',
            'Ausgabe in Einweg- und Mehrwegbechern',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/01.png`}
          title='Speisen'
          listItems={[
            'Bereitstellung von nachhaltigen und veganen Snackoptionen',
            'Upselling durch live Performance des Roboters',
          ]}
        />

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Kund:innenorientiert
        </Heading>

        <ImageAndText
          imageUrl={`/assets/images/05.png`}
          title='Zielgruppe'
          listItems={[
            'Premium Kaffee- und Teeliebhaber:innen mit hohen Ansprüchen',
            'Menschen mit wenig Zeit',
            'Automat bietet sich als Objekt für Social-Media Interaktionen dar',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/06.png`}
          title='Zugänglich'
          listItems={[
            'Bereitstellung einer mehrsprachigen Benutzeroberfläche',
            'Gewährleistung eines barrierefreien Zugangs',
            'Zwei Terminals pro Automat zur Minimierung von Wartezeiten',
          ]}
        />

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Kompakt
        </Heading>

        <ImageAndText
          imageUrl={`/assets/images/07.png`}
          title='Design'
          listItems={[
            'Vandalismusgeschützte Konstruktion für den Einsatz im öffentlichen Raum',
            'Off-GridBetrieb – unabhängig von Frisch- und Abwasser',
            'Kein Starkstromanschluss für den Betrieb notwendig',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/08.png`}
          title='Transport'
          listItems={[
            'Kompakte Maße für einfache Platzierung und Transport',
            'Transport per Standard Spedition möglich',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/09.png`}
          title='Modular'
          listItems={[
            'Zugänglich für Reperaturen und einfache Wartung',
            'Erweiterung des Angebots durch weitere Module möglich',
          ]}
        />

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Prozessoptimiert
        </Heading>

        <ImageAndText
          imageUrl={`/assets/images/04.png`}
          title='Telemetrieanbindung'
          listItems={[
            'Ausgestattet mit einem LTE Modem für ständige Konnektivität und Fernüberwachung',
            'Proaktive Reaktion auf Nachfüll- und Wartungsbedarf durch Integration von Telemetrie',
            'Zugriff auf Telemetriedaten über Webanwendung',
            'Flexible Anpassung von Angebot und Preisen jederzeit möglich',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/robotarm/02.jpg`}
          title='Wiederbefüllung'
          listItems={[
            'Warenbestand für 400 Heißgetränkge und 200 Snacks pro Befüllung',
            'Mitarbeitende ohne spezielle technische Kenntnisse können den Befüllvorgang druchführen',
            'Sensorik erfasst aktuellen Befüllstand und verhindert Fehlbedienungen oder Eingaben',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/01.png`}
          title='Reinigung und Wartung'
          listItems={[
            'Tägliche autonome Reinigungsfunktion gewährleistet Hygienestandards',
            'Zusätzliche manuelle Reinigung nur einmal monatlich erforderlich',
          ]}
        />

        <Heading pt={headingpt} pb={headingpb} variant='h1'>
          Markt
        </Heading>

        <ImageAndText
          imageUrl={`/assets/images/02.png`}
          title='Fester Standort'
          listItems={[
            'Ideal für fest installierte Standorte mit hohem Besucheraufkommen',
            'Potential für zusätzliche Einnahmen durch Produktverkauf und Markenpräsentation',
          ]}
        />

        <ImageAndText
          imageUrl={`/assets/images/midjourney/egal.jpg`}
          title='Flexibler Standort'
          listItems={[
            'Geeignet zum temporären Einsatz für Veranstaltungen, Events und Messen',
            'Bequem Buchbar über unsere Webseite',
          ]}
        />
      </Stack>
    </PageLayout>
  );
};

export default Barista;
