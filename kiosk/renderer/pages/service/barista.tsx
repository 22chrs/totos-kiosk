import { useTranslation } from 'react-i18next';

import { CustomImage, randomImagesBox } from '@/components/images/randomImage';

import PageLayout from '@/components/page-layout';
import { GridTextImage } from '@/components/page-layout/gridLayers';
import {
  Box,
  Divider,
  Heading,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

type Props = {
  title: string;
  description: string;
  canonical?: string;
  children: React.ReactNode;
};

const Barista = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('roboter-baristaservice')} description=''>
      <GridTextImage
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
          <CustomImage
            width='700'
            height='700'
            alt='Cover Image'
            layout='intrinsic'
            quality={70}
            src={randomImagesBox()} // Add this line to provide the src prop
          />
        }
      />
    </PageLayout>
  );
};

export default Barista;
