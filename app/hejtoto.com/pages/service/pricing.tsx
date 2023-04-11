import PageLayout from '@/components/page-layout';
import { chakra } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useTranslation } from 'react-i18next';

import { StandardPage } from '@/components/page-layout/padding';
import { ActionButton, PricingCard } from '@/components/pricing/pricing';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { FaCalendarCheck, FaInfoCircle, FaTag, FaTags } from 'react-icons/fa';
import { SiMarketo } from 'react-icons/si';

const CustomImage = chakra(NextImage, {
  baseStyle: {
    borderRadius: 'lg',
    boxShadow: 'lg',
  },
  shouldForwardProp: (prop) => ['src', 'alt', 'width', 'height'].includes(prop),
});

const PreisPage = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title='Barista Café mieten' description=''>
      <StandardPage heading='Barista Café mieten'>
        <Box
          as='section'
          //bg={useColorModeValue('gray.50', 'gray.800')}
          //px={{ base: '4', md: '8' }}
        >
          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            spacing={{ base: '8', lg: '10' }}
            maxW='7xl'
            mx='auto'
            justifyItems='center'
            alignItems='center'
          >
            <PricingCard
              data={{
                price: '990 €',
                dayTwoPrice: '290 €',
                name: 'Basistarif',
                subtitel: 'Baristaservice',
                features: [
                  'Pro Heißgetränk 2,50 Euro',
                  'Inklusice Anlieferung und Abholung',
                  'Inklusice Reinigung',
                  '24/7 geöffnet',
                  'Auffüllservice',
                ],
              }}
              icon={FaTag}
              iconDayTwoPrice={FaCalendarCheck}
              button={
                <ActionButton variant='outline' borderWidth='2px'>
                  Buy now
                </ActionButton>
              }
            />
            <PricingCard
              //zIndex={1}
              isPopular
              //transform={{ lg: 'scale(1.05)' }}
              data={{
                price: '1.449 €',
                dayTwoPrice: '1.449 €',
                name: 'Flatrate',
                subtitel: 'qwd',
                features: [
                  'Kostenlose Heißgetränke*',
                  'Inklusice Anlieferung und Abholung',
                  'Inklusice Reinigung',
                  '24/7 geöffnet',
                  'Auffüllservice',
                ],
              }}
              icon={FaTags}
              iconDayTwoPrice={FaInfoCircle}
              button={<ActionButton>Buy now</ActionButton>}
            />
            <PricingCard
              data={{
                price: '$29',
                dayTwoPrice: '$29',
                name: 'Marketing UI',
                subtitel: 'qwd',
                features: [
                  'All application UI components',
                  'Lifetime access',
                  'Use on unlimited projects',
                  'Free Updates',
                ],
              }}
              icon={SiMarketo}
              iconDayTwoPrice={FaInfoCircle}
              button={
                <ActionButton variant='outline' borderWidth='2px'>
                  Buy now
                </ActionButton>
              }
            />
          </SimpleGrid>
        </Box>
      </StandardPage>
    </PageLayout>
  );
};

export default PreisPage;
