// shop.tsx

import React, { useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ScaleFade,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useInViewport } from 'react-in-viewport';
import { useTranslation } from 'react-i18next';

import PageLayout from '@/components/page-layout/pageLayoutKiosk';
import { LanguagesTabsKiosk } from '@/components/kiosk/LanguagesKiosk';
import { InfoBar } from '@/components/kiosk/shop/InfoBar';
import { Shop } from '@/components/kiosk/shop/Shop';
import { HeaderMainPage } from '@/components/layout/menuKiosk/header';
import shopData from '@/public/kiosk/products/leipzig.json';
import { KIOSK_CONTENT_HEIGHT } from 'src/constants';
import { ModalProductCard } from '@/components/kiosk/shop/ShopModal';
import { useCart } from '@/providers/CardContext';
import { useLayoutContext } from '@/providers/LayoutContext';
import { useRouter } from '@/providers/DisplayContext';
import { useStepper } from '@/providers/StepperContext';
import i18n, { standardSprache } from '@/internationalization/i18n';

const Kiosk: React.FC = () => {
  const ref = useRef(null);
  const { inViewport, enterCount } = useInViewport(ref);
  const { t } = useTranslation();
  const router = useRouter();
  const { clearCart, setPayment, getCartTotalQuantity } = useCart();
  const { setHeader } = useLayoutContext();
  const { setActiveStep } = useStepper();

  // Timer for inactivity
  const timerRef = useRef<number | null>(null);

  const navigateToIndex = useCallback(() => {
    console.log('Timeout. Back to Index Page.');
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    setPayment('init');
    i18n.changeLanguage(standardSprache);
    clearCart();
    router.pushWithDisplay('/');
  }, [router, setPayment, clearCart]);

  const resetTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(navigateToIndex, 5 * 60 * 1000); // 5 minutes
  }, [navigateToIndex]);

  useEffect(() => {
    resetTimer();

    const events = [
      'mousemove',
      'mousedown',
      'keypress',
      'scroll',
      'touchstart',
    ];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  useEffect(() => {
    setHeader(<HeaderMainPage />);
  }, [setHeader]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    const cartQuantity = getCartTotalQuantity();
    if (cartQuantity > 0) {
      console.log('Cart is not empty, opening modal.');
      setActiveStep(2);
      onOpen();
    } else {
      console.log('Cart is empty, modal will not open.');
      // Additional logic can be added here
    }
  };

  const {
    isOpen: isLangOpen,
    onOpen: onLangOpen,
    onClose: onLangClose,
  } = useDisclosure();

  return (
    <ScaleFade
      initialScale={1.0}
      transition={{ enter: { duration: 0.5, easing: 'easeInOut' } }}
      in={enterCount > 0}
    >
      <Box ref={ref} position='relative'>
        <PageLayout title={t('kiosk')} contentHeight={KIOSK_CONTENT_HEIGHT}>
          <Shop
            data={shopData.categories}
            country={shopData.country}
            currency={shopData.currency}
          />
        </PageLayout>

        <Box>
          <InfoBar onClick={handleOpen} />
        </Box>

        <ModalProductCard
          isOpen={isOpen}
          onClose={onClose}
          selectedProduct={null}
          selectedCategory={null}
          formatPrice={(price) => `${price} €`}
        />

        <Modal
          variant='kioskLanguage'
          isOpen={isLangOpen}
          onClose={onLangClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            rounded='3xl'
            maxW='85vw'
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
              <LanguagesTabsKiosk />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ScaleFade>
  );
};

export default Kiosk;
