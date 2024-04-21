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
import { TouchToStart } from '@/components/kiosk/touchToStart';

const Video = chakra('video');

const Kiosk = () => {
  const ref = useRef(null);
  const { inViewport, enterCount } = useInViewport(ref);
  const { i18n } = useTranslation();
  const router = useRouter();
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);

  const handlePageClick = () => {
    router.pushWithDisplay('/kiosk/shop');
  };

  return (
    <ScaleFade
      initialScale={1.0}
      transition={{ enter: { duration: 0.5, easing: 'easeInOut' } }}
      in={enterCount > 0}
    >
      <Box
        position='relative'
        height='100vh'
        width='100vw'
        overflow='hidden'
        onClick={handlePageClick}
      >
        <HeaderStartPage />
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
          height='100%'
          width='100%'
          objectFit='cover'
          zIndex='-1'
        />
        <Text position='absolute' zIndex='1'>
          {displayNumber === '1'
            ? 'Display front attached.'
            : displayNumber === '2'
              ? 'Display back attached.'
              : 'Error Display'}
        </Text>
        <Box
          position='absolute'
          bottom='0'
          left='0'
          right='0'
          pb='8vh'
          pl='5vw'
          //pr='30vw'
          // paddingX='5vw'
          // paddingY='1vh'
          bgColor='transparent'
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode',
          )}
          zIndex='1'
        >
          <LanguagesTabsKiosk handleOpen={handlePageClick} />
        </Box>
        <TouchToStart />
      </Box>
    </ScaleFade>
  );
};

export default Kiosk;
