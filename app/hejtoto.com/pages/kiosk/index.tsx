//kiosk.tsx

import { FooterStartPage } from '@/components/layout/menuKiosk/footer';
import { HeaderStartPage } from '@/components/layout/menuKiosk/header';
import { useRouter } from 'next/router';

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import { DisplayContext } from '@/providers/DisplayContext';
import { Box, Text, chakra, useColorModeValue } from '@chakra-ui/react';

//import { BackgroundImage } from '@/components/images/Backgroundimage';
import { StandardPage } from '@/components/page-layout/padding';
import { useLayoutContext } from '@/providers/LayoutContext';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Video = chakra('video');

const Kiosk = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);
  const { setHeader, setFooter } = useLayoutContext();
  useEffect(() => {
    setHeader(<HeaderStartPage />);
    setFooter(<FooterStartPage />);
  }, [setHeader, setFooter]);

  const handlePageClick = () => {
    router.push('./kiosk/shop');
  };

  return (
    //<BackgroundImage imageUrl='/assets/images/coffee/01.png'>
    <Box onClick={handlePageClick}>
      <Video
        position='absolute'
        autoPlay
        loop
        muted
        src={useColorModeValue(
          '/assets/videos/AdobeStock_216174652_Video_HD_Preview.mov',
          '/assets/videos/AdobeStock_136947288_Video_HD_Preview.mov'
        )}
        h='80%'
        w='100%'
        objectFit='cover'
        zIndex='-1'
      />
      <PageLayout title={t('kiosk')} description=''>
        <StandardPage heading={t('kiosk')}>
          <Text>
            {displayNumber === '1'
              ? 'Display 1 attached.'
              : displayNumber === '2'
              ? 'Display 2 attached.'
              : 'Error Display'}
          </Text>
        </StandardPage>
      </PageLayout>
    </Box>
    //</BackgroundImage>
  );
};

export default Kiosk;
