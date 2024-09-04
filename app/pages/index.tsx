import { HeaderStartPage } from '@/components/layout/menuKiosk/header';
import { useRouter } from '@/providers/DisplayContext';
import { useInViewport } from 'react-in-viewport';

import { DisplayContext } from '@/providers/DisplayContext';
import {
  Box,
  ScaleFade,
  Text,
  chakra,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import { LanguagesTabsKiosk } from '@/components/kiosk/LanguagesKiosk';

import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import InfoCircle from '@/components/kiosk/Info';
import InfoModal from '@/components/kiosk/infoModal';

const Video = chakra('video');

const Kiosk = () => {
  const ref = useRef(null);
  const { inViewport, enterCount } = useInViewport(ref);
  const { i18n } = useTranslation();
  const router = useRouter();
  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);

  // Modal control from Chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            '/assets/videos/AdobeStock_136947288.mov',
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
          pb='18vh'
          pl='9'
          bgColor='transparent'
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode',
          )}
          zIndex='1'
        >
          <LanguagesTabsKiosk />
        </Box>

        {/* InfoCircle with modal trigger */}
        <Box position='absolute' zIndex='1' top='5' right='5'>
          {/* Pass the onOpen function from useDisclosure to InfoCircle */}
          <InfoCircle onOpen={onOpen} />
        </Box>

        {/* Info modal */}
        <InfoModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </ScaleFade>
  );
};

export default Kiosk;
