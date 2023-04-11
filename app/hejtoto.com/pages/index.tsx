import { useTranslation } from 'react-i18next';
import { useWebSocket } from '@/websocket/WebSocketContext'; // Import useWebSocket hook

import PageLayout from '@/components/page-layout';

import {
  GridImageText,
  GridTextImage,
} from '@/components/page-layout/gridLayers';
import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import {
  CustomImage2,
  randomImagesArm,
  randomImagesBox,
} from '@/components/images/randomImage';

type Props = {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
};

const IndexPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  
  const wsClient = useWebSocket(); // Use the hook to get the WebSocket client instance

  const handleClick = () => {
    console.log('Button clicked');
    if (wsClient) {
      wsClient.send('orchester', 'Hello, Orchester!'); // Send a message to the host (orchester)
      // wsClient.send('clientB', 'Hello, Client B!'); // Send a message to another client (clientB)
    } else {
      console.log('WebSocket client is not available');
    }
  };

  return (
    <PageLayout title='Home' description=''>
      <GridTextImage
        pt='20vh'
        pb='8vh'
        child1={
          <Box>
            <Heading variant='logo'>Hej Toto!</Heading>
            <br />
            <Divider />

            <Text>
              <i>Hej Toto</i> {t('is-a-premium')}{' '}
              <strong>{t('vending-machine')}</strong>
              {t('which-offers-high-quality')}{' '}
              <Link
                as={NextLink}
                color={useColorModeValue(
                  'brandColor.lightMode',
                  'brandColor.darkMode'
                )}
                href='/service/barista'
              >
                {t('barista-style-coffee')}
              </Link>
              {t('featuring-advanced')}
              <strong> {t('robotic-arm')}</strong>
              {t(
                'technology-ensures-consistent-quality-and-efficient-automation'
              )}{' '}
              <strong>24/7</strong>.
            </Text>
          </Box>
        }
        child2={
          <CustomImage2
            alt='Robot arm makes coffee'
            src={randomImagesBox()} // Add this line to provide the src prop
          />
        }
      />

      <GridImageText
        pt='8vh'
        pb='15vh'
        child1={
          <Box>
            <Heading variant='logo'>{t('24-7-barister-robot')}</Heading>
            <Button onClick={handleClick}>Hello World</Button> 
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
              <Link
                as={NextLink}
                color={useColorModeValue(
                  'brandColor.lightMode',
                  'brandColor.darkMode'
                )}
                href='/'
              >
                <i>Hej Toto</i>
              </Link>
              !
            </Text>
          </Box>
        }
        child2={
          <CustomImage2
            alt='Robot arm makes coffee'
            src={randomImagesArm()} // Add this line to provide the src prop
          />
        }
      />
    </PageLayout>
  );
};

export default IndexPage;
