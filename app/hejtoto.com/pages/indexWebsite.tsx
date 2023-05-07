import { useTranslation } from 'react-i18next';

import { MagicLink } from '@/components/links/CustomLink';
import PageLayout from '@/components/page-layout';

import {
  GridImageText,
  GridTextImage,
} from '@/components/page-layout/gridLayers';
import {
  Box,
  Divider,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { CustomImage } from '@/components/images/CustomImage';
import { RandomImage, randomImagesBox } from '@/components/images/randomImage';

type Props = {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
};

const IndexPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const brandColor = useColorModeValue(
    'brandColor.lightMode',
    'brandColor.darkMode'
  );

  return (
    <PageLayout title='Home' description=''>
      <GridTextImage
        pt='20vh'
        pb='8vh'
        child1={
          <Box>
            <Heading variant='logo'>Hej Toto</Heading>
            <br />
            <Divider />

            <Text>
              <i>Hej Toto</i> {t('is-a-premium')}{' '}
              <strong>{t('vending-machine')}</strong>
              {t('which-offers-high-quality')}{' '}
              <MagicLink
                as={NextLink}
                color={brandColor}
                href='/service/barista'
              >
                {t('barista-style-coffee')}
              </MagicLink>
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
          <RandomImage
            alt='Robot arm makes coffee'
            src={randomImagesBox()} // Add this line to provide the src prop
            //width='700'
            //height='700'
            //src='/assets/images/BestMidjourney/01.jpg' // Add this line to provide the src prop
          />
        }
      />

      <GridImageText
        pt='8vh'
        pb='15vh'
        child1={
          <Box>
            <Heading variant='logo'>{t('24-7-barister-robot')}</Heading>
            {/* <Button onClick={handleClick}>Hello World</Button> */}
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
              <MagicLink as={NextLink} color={brandColor} href='/'>
                <i>Hej Toto</i>
              </MagicLink>
              !
            </Text>
          </Box>
        }
        child2={
          // <RandomImage
          //   alt='Robot arm makes coffee'
          //   src={randomImagesArm()} // Add this line to provide the src prop
          // />
          <CustomImage
            alt='Robot arm makes coffee'
            src='/assets/images/robotarm/02.jpg' // Add this line to provide the src prop
            width='700'
            height='700'
          />
        }
      />
    </PageLayout>
  );
};

export default IndexPage;
