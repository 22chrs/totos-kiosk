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
import { ModalProductCard } from '@/components/kiosk/shop/ShopModal';
import { useStepper } from '@/providers/StepperContext';

const Kiosk = () => {
  const timerRef = useRef(null); // Declare timerRef only once

  const router = useRouter();
  const { clearCart, setPayment } = useCart();

  const navigateToIndex = useCallback(() => {
    console.log('Timeout. Back to Index Page.');
    clearTimeout(timerRef.current);
    setPayment('init');
    i18n.changeLanguage(standardSprache);
    // use clearCart here
    router.pushWithDisplay('/');
    clearCart();
  }, [router, setPayment, clearCart]); // Include clearCart in the dependency array

  // Function to reset the inactivity timer
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(navigateToIndex, 5 * 60 * 1000); // 5 minutes timer
  }, [navigateToIndex]);

  // Set up the timer and event listeners when the component mounts
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
      clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  const { t } = useTranslation();
  const { displayNumber } = useContext(DisplayContext);
  const { setHeader, setFooter } = useLayoutContext();
  useEffect(() => {
    setHeader(<HeaderMainPage />);
  }, [setHeader, setFooter]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getCartTotalQuantity } = useCart();

  const { setActiveStep } = useStepper(); // Access setActiveStep from the Stepper context

  const handleOpen = () => {
    const cartQuantity = getCartTotalQuantity(); // Get the total quantity of items in the cart
    if (cartQuantity > 0) {
      console.log('Cart is not empty, opening modal.');
      setActiveStep(2); // Set the active step to 3
      onOpen(); // Open the modal
    } else {
      console.log('Cart is empty, modal will not open.');
      // You can add additional logic here, like showing a message or alert
    }
  };

  const {
    isOpen: isLangOpen,
    onOpen: onLangOpen,
    onClose: onLangClose,
  } = useDisclosure();

  return (
    <>
      <PageLayout title={t('kiosk')} contentHeight={KIOSK_CONTENT_HEIGHT}>
        <Shop
          data={shopData.categories}
          country={shopData.country}
          currency={shopData.currency}
        />
        {/* <WarenkorbModal isOpen={isOpen} onClose={onClose} /> */}
      </PageLayout>

      <Box>
        <InfoBar onClick={handleOpen} />
      </Box>

      <ModalProductCard
        isOpen={isOpen}
        onClose={onClose}
        selectedProduct={null} // Set selectedProduct accordingly
        selectedCategory={null} // Set selectedCategory accordingly
        formatPrice={(price) => `${price} €`} // Ensure this formats the price as needed
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
    </>
  );
};

export default Kiosk;
