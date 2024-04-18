//kiosk.tsx

import { HeaderStartPage } from '@/components/layout/menuKiosk/header';

import { useRouter } from '@/providers/DisplayContext';
import { useInViewport } from 'react-in-viewport';

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import { DisplayContext } from '@/providers/DisplayContext';
import {
  Box,
  Flex,
  ScaleFade,
  Text,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';

//import { BackgroundImage } from '@/components/images/Backgroundimage';
import { LanguagesTabsKiosk } from '@/components/kiosk/LanguagesKiosk';
import { useLayoutContext } from '@/providers/LayoutContext';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { KIOSK_CONTENT_HEIGHT_STARTPAGE } from 'src/constants';

const Video = chakra('video');

const Kiosk = () => {
  const ref = useRef(null);
  const { inViewport, enterCount } = useInViewport(ref);
  const { i18n } = useTranslation();
  const router = useRouter();
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);
  const { setHeader } = useLayoutContext();
  useEffect(() => {
    setHeader(<HeaderStartPage />);
  }, [setHeader]);

  const handlePageClick = () => {
    router.pushWithDisplay('/kiosk/shop');
  };

  return (
    <ScaleFade
      initialScale={1.0}
      transition={{ enter: { duration: 0.5, easing: 'easeInOut' } }}
      in={enterCount > 0}
    >
      <Box onClick={handlePageClick}>
        <Video
          ref={ref}
          position='absolute'
          autoPlay
          loop
          muted
          src={useColorModeValue(
            '/assets/videos/video_day.mov',
            '/assets/videos/video_night.mov',
          )}
          h='100vh'
          w='100vw'
          objectFit='cover'
          zIndex='-1'
        />

        <PageLayout
          title={t('kiosk')}
          description=''
          contentHeight={KIOSK_CONTENT_HEIGHT_STARTPAGE}
        >
          <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            height='75vh'
            maxW='30%'
          >
            {/* <Heading variant='h1_kiosk' fontSize='5rem'>
            {t('kiosk')}
          </Heading> */}
          </Flex>
          <Text>
            {displayNumber === '1'
              ? 'Display front attached.'
              : displayNumber === '2'
                ? 'Display back attached.'
                : 'Error Display'}
          </Text>
        </PageLayout>
        <Box
          position='relative'
          h='100vh'
          onClick={handlePageClick}
          px='13vw'
          bgColor='transparent'
          // bgColor={useColorModeValue(
          //   'footerBGColor.lightMode',
          //   'footerBGColor.darkMode'
          // )}
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode',
          )}
          //px='5vw'

          w='100%'
        >
          <Box
            //bgColor='red'
            //p='3'
            //pt={`calc((${KIOSK_FOOTER_HEIGHT_STARTPAGE} - ${KIOSK_LANG_HEIGHT}) / 2)`}
            onClick={(e) => e.stopPropagation()}
          >
            <LanguagesTabsKiosk handleOpen={handlePageClick} />
          </Box>
        </Box>
      </Box>
    </ScaleFade>
  );
};

export default Kiosk;
