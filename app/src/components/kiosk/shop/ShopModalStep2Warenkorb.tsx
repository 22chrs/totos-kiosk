// ShopModalStepWarenkorb.tsx

import { formatPrice } from '@/components/kiosk/shop/utils';
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  ModalBody,
  Spacer,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { ItemBestellung } from '@/components/kiosk/shop/Warenkorb/ItemBestellung';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { FaPlus } from 'react-icons/fa';
import { KIOSK_HEIGHTCONTENT_MODAL } from 'src/constants';
import { ArrowRightSharpSolid } from '@/components/icons/icons';
import { useContext } from 'react';
import { DisplayContext } from '@/providers/DisplayContext';
import { useWebSocket } from '@/websocket/WebSocketContext';

function ShopModalStepWarenkorb({ onClose }) {
  const { setActiveStep } = useStepper();
  const {
    cart,
    getCartTotalPrice,
    getCartTotalPfand,
    getCartTotalQuantity,
    setPayment,
  } = useCart();
  const { displayNumber } = useContext(DisplayContext);
  const ws = useWebSocket();

  const handlePaymentClick = () => {
    const now = new Date();
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
      .replace('T', '_');

    const bestellung = {
      automatenID: null, // Set by devices container
      whichTerminal:
        displayNumber === 'front'
          ? 'front'
          : displayNumber === 'back'
            ? 'back'
            : 'unknown',
      orderID: null, // Set after payment successful
      orderStatus: 'unpaid',
      timeStampOrder: formattedTimestamp,
      totalPrice: getCartTotalPrice(),
      tip: 0,
      products: cart.map((item) => ({
        productName: item.product.name,
        productCategory: item.productCategory,
        calculatedPrice: item.calculatedPrice,
        vat: item.product.vat,
        choosenSize: item.choosenSize || null,
        choosenSugar: item.choosenSugar || null,
        choosenMug: item.choosenMug || null,
        choosenLid: item.choosenLid || null,
        preparationStation: 'ordered',
        quantity: item.quantity,
      })),
    };

    console.log(bestellung); // Log the order object
    if (ws) {
      setPayment('processing'); // Set payment state to processing
      ws.send('devices', JSON.stringify(bestellung)); // Send order via WebSocket
    } else {
      console.log('WebSocket not connected. Order not sent.');
    }
  };

  return (
    <ModalBody pt='0'>
      <Flex direction='column' height='100%'>
        <Stack
          overflowX='hidden'
          overflowY='hidden'
          alignItems='flex-start'
          h='100%'
          minH='100%'
          spacing='0'
          height={KIOSK_HEIGHTCONTENT_MODAL}
          px='5'
          pt='3'
        >
          {/* Scrollable content */}
          <Stack overflowY='auto'>
            <VStack alignItems='flex-start'>
              <Box maxW='80%' minW='80%' width='80vw' pb='0'>
                <Heading pb='5' variant='h1_Kiosk'>
                  Deine Bestellung
                </Heading>
              </Box>
              <Box>
                {getCartTotalQuantity() === 0 ? (
                  <Text pt='4' variant='kiosk'>
                    Dein Warenkorb ist leer. Füge Artikel hinzu, um deine
                    Bestellung aufzugeben.
                  </Text>
                ) : (
                  cart.map((item) => (
                    <ItemBestellung key={item.idCart} productCart={item} />
                  ))
                )}
              </Box>
            </VStack>
          </Stack>
          <Spacer />
          {/* Action buttons */}
          <HStack
            alignItems='flex-end'
            w={getCartTotalQuantity() === 0 ? '98.7%' : '100%'}
            pt='6'
            pb='8'
            transform='translateY(0.9rem) translateX(0)'
          >
            <HStack
              w='100%'
              justifyContent='flex-start'
              alignItems='flex-end'
              gap='10'
            >
              <Box>
                <HStack gap='3'>
                  {/* Total price button */}
                  <Button gap='5' variant='kiosk_pricetag_big'>
                    <Box>Gesamt:</Box>
                    <Box>
                      {formatPrice({
                        amount: getCartTotalPrice() + getCartTotalPfand(),
                      })}
                    </Box>
                  </Button>
                </HStack>
              </Box>
              <Spacer />
              <HStack gap='14'>
                {/* Add items button */}
                <Box transform='translateY(-0.4rem) translateX(0.4rem)'>
                  <Button gap='4' variant='kiosk_rainbow_big' onClick={onClose}>
                    Artikel hinzufügen
                    <Icon boxSize='2.5rem' as={FaPlus} />
                  </Button>
                </Box>
                {/* Proceed to checkout button */}
                {getCartTotalQuantity() > 0 && (
                  <Box transform='translateY(-0.4rem) translateX(0.2rem)'>
                    <Button
                      gap='5'
                      variant='kiosk_rainbow_big'
                      onClick={() => {
                        handlePaymentClick(); // Send order via WebSocket
                        setActiveStep((prevStep) => prevStep + 1); // Proceed to next step
                      }}
                    >
                      Zur Kasse
                      <Icon boxSize='3.5rem' as={ArrowRightSharpSolid} />
                    </Button>
                  </Box>
                )}
              </HStack>
            </HStack>
          </HStack>
        </Stack>
      </Flex>
    </ModalBody>
  );
}

export default ShopModalStepWarenkorb;
