// kiosk.tsx

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
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KIOSK_CONTENT_HEIGHT_STARTPAGE } from 'src/constants';
import { TouchToStart } from '@/components/kiosk/touchToStart';
import { InfoCircle, Start } from '@/components/kiosk/Info';

const Video = chakra('video');

const Kiosk = () => {
  const ref = useRef(null);
  const { inViewport, enterCount } = useInViewport(ref);
  const { i18n } = useTranslation();
  const router = useRouter();
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);

  const videoSources = [
    '/assets/videos/01.mov',
    '/assets/videos/02.mov',
    '/assets/videos/03.mov',
    '/assets/videos/04A.mov',
    '/assets/videos/04B.mov',
    '/assets/videos/05A.mov',
    '/assets/videos/05B.mov',
    '/assets/videos/06.mov',
    '/assets/videos/07.mov',
    '/assets/videos/08.mov',
    '/assets/videos/09A.mov',
    '/assets/videos/09B.mov',
    '/assets/videos/10A.mov',
    '/assets/videos/10B.mov',
    '/assets/videos/11.mov',
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handlePageClick = () => {
    router.pushWithDisplay('/kiosk/shop');
  };

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  useEffect(() => {
    const handleVideoEnd = () => {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % videoSources.length,
      );
    };

    const videoElement = ref.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [videoSources.length]);

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
        {/* <HeaderStartPage /> */}
        <Video
          ref={ref}
          position='absolute'
          autoPlay
          muted
          src={videoSources[currentVideoIndex]}
          height='100%'
          width='100%'
          objectFit='cover'
          zIndex='-1'
        />
        {/* <Text position='absolute' zIndex='1'>
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
          pb='18vh'
          pl='9'
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
          <LanguagesTabsKiosk />
        </Box>

        <InfoCircle /> */}
      </Box>
    </ScaleFade>
  );
};

export default Kiosk;
