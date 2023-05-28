// shop.tsx

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
import { DisplayContext } from '@/providers/DisplayContext';

import { LanguagesTabsKiosk } from '@/components/kiosk/LanguagesKiosk';
import { InfoBar } from '@/components/kiosk/shop/InfoBar';
import { Shop } from '@/components/kiosk/shop/Shop';
import { WarenkorbModal } from '@/components/kiosk/shop/WarenkorbModal';
import { HeaderMainPage } from '@/components/layout/menuKiosk/header';
import { useRouter } from '@/providers/DisplayContext';

import { useLayoutContext } from '@/providers/LayoutContext';
import shopData from '@/public/kiosk/products/leipzig.json';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { KIOSK_CONTENT_HEIGHT } from 'src/constants';

const Kiosk = () => {
  // Initialize selected size state
  const router = useRouter();

  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);
  const { setHeader, setFooter } = useLayoutContext();
  useEffect(() => {
    setHeader(<HeaderMainPage />);
  }, [setHeader, setFooter]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getCartTotalQuantity } = useCart();

  const handleOpen = () => {
    console.log('handleOpen called'); // Add this line for debugging
    if (getCartTotalQuantity() > 0) {
      onOpen();
    }
  };

  const timerRef = useRef(null);

  const {
    isOpen: isLangOpen,
    onOpen: onLangOpen,
    onClose: onLangClose,
  } = useDisclosure();

  const { clearCart, setPayment } = useCart();

  const handlePaymentFinished = useCallback(() => {
    clearTimeout(timerRef.current); // Clear any existing timer
    clearCart();
    setPayment('init');
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
  }, [clearCart, setPayment, router]);

  useEffect(() => {
    const events = [
      'click',
      'mousemove',
      'mousedown',
      'keypress',
      'scroll',
      'touchstart',
      'touchmove',
      'touchend',
    ];
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handlePaymentFinished, 180000);
    };

    for (let i in events) {
      window.addEventListener(events[i], resetTimer);
    }

    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimer);
      }
    };
  }, [handlePaymentFinished]);

  return (
    <>
      <PageLayout title={t('kiosk')} contentHeight={KIOSK_CONTENT_HEIGHT}>
        <Shop
          data={shopData.categories}
          country={shopData.country}
          currency={shopData.currency}
        />
        <WarenkorbModal isOpen={isOpen} onClose={onClose} />
      </PageLayout>

      <Box>
        <InfoBar onClick={handleOpen} onLangChangeClick={onLangOpen} />
      </Box>

      <Modal
        variant='kioskLanguage'
        isOpen={isLangOpen}
        onClose={onLangClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          rounded='3xl'
          maxW='75vw'
          height='auto'
          minH='auto'
          maxH='auto'
        >
          <ModalCloseButton
            fontSize='2rem'
            color={useColorModeValue('red.400', 'red.300')}
            transform='translateY(-4rem) translateX(4rem)'
            _hover={{ bgColor: 'transparent' }}
          />
          <ModalBody p='0'>
            <LanguagesTabsKiosk handleOpen={onLangClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Kiosk;
