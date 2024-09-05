// ShopModalStep2Warenkorb.tsx

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

import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useContext } from 'react';
import { DisplayContext } from '@/providers/DisplayContext';
import { ItemBestellung } from '@/components/kiosk/shop/Warenkorb/ItemBestellung';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { KIOSK_HEIGHTCONTENT_MODAL } from 'src/constants';
import { useState } from 'react';
import { useWebSocket } from '@/websocket/WebSocketContext';
import { ArrowRightSharpSolid } from '@/components/icons/icons';

function ShopModalStepWarenkorb({ onClose }) {
  const ws = useWebSocket();

  const { activeStep, setActiveStep } = useStepper();

  const {
    cart,
    getCartTotalPrice,
    getCartTotalPfand,
    getCartTotalQuantity,
    setPayment,
  } = useCart();

  const [Trinkgeld, setTrinkgeld] = useState(0);

  const handlePaymentClick = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');

    const formattedTimestamp = `${year}${month}${day}_${hour}${minute}${second}`;

    const bestellung = {
      automatenID: null, // set by devices container
      whichTerminal:
        displayNumber === '1'
          ? 'front'
          : displayNumber === '2'
            ? 'back'
            : 'unknown',
      orderID: null, // set after payment successful
      orderStatus: 'unpaid',
      timeStampOrder: formattedTimestamp,
      totalPrice: getCartTotalPrice() + (Trinkgeld || 0),
      tip: Trinkgeld || 0,
      products: cart.map((item) => ({
        // Directly from ProductCart
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

    console.log(bestellung); // Log the bestellung object
    if (ws) {
      setPayment('processing');
      ws.send('devices', JSON.stringify(bestellung)); // Replace 'devices' with actual target //! WICHTIG
    } else {
      console.log('WebSocket not connected. Bestellung not aufgegeben.');
    }
    //handlePaymentWaiting();
  };

  const { displayNumber } = useContext(DisplayContext);

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
          py='0'
          height={KIOSK_HEIGHTCONTENT_MODAL}
        >
          {/* <ScrollFade> */}
          <Stack overflowY='auto'>
            <VStack alignItems='flex-start'>
              <Box maxW='80%' minW='80%' width='80vw' pb='0'>
                <Heading pb='5' variant='h1_Kiosk'>
                  Deine Bestellung
                </Heading>
                {/* <HStack>
                  <Icon
                    pr='0.1rem'
                    boxSize='1.2rem'
                    as={HiOutlineMagnifyingGlass}
                  />
                  <Text as='u' pt='0'>
                    Allgemeine Geschäftsbedingungen
                  </Text>
                </HStack> */}
              </Box>

              <Box>
                {getCartTotalQuantity() === 0 && (
                  <Box>
                    <Text pt='4' variant='kiosk'>
                      Dein Warenkorb ist leer. Füge Artikel hinzu, um deine
                      Bestellung aufzugeben.
                    </Text>
                  </Box>
                )}
                <Box>
                  {cart.map((item) => (
                    <ItemBestellung key={item.idCart} productCart={item} />
                  ))}
                </Box>
              </Box>
            </VStack>
          </Stack>
          {/* </ScrollFade> */}
          <Spacer />

          <HStack
            alignItems='flex-end'
            w={getCartTotalQuantity() === 0 ? '98.7%' : '100%'}
            pt='6'
            pb='8'
            transform='translateY(0.8rem) translateX(0)'
          >
            <HStack
              w='100%'
              justifyContent='flex-start'
              alignItems='flex-end'
              gap='10'
            >
              <Box>
                <HStack gap='3'>
                  <Button
                    gap='5'
                    variant='kiosk_pricetag_big'
                    onClick={() => {
                      if (getCartTotalQuantity() > 0) {
                        setActiveStep((prevStep) => prevStep + 1);
                      }
                    }}
                  >
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
                <Box transform='translateY(-0.4rem) translateX(0.4rem)'>
                  <Button
                    gap='4'
                    variant='kiosk_rainbow_big'
                    onClick={() => {
                      onClose(); // Close the modal
                    }}
                  >
                    Artikel hinzufügen
                    <Icon boxSize='2.5rem' as={FaPlus} />
                  </Button>
                </Box>

                {getCartTotalQuantity() > 0 && (
                  <Box transform='translateY(-0.4rem) translateX(-1.0rem)'>
                    <Button
                      gap='5'
                      variant='kiosk_rainbow_big'
                      onClick={() => {
                        if (getCartTotalQuantity() > 0) {
                          setActiveStep((prevStep) => prevStep + 1);
                          handlePaymentClick(); // Call the function on button click
                        }
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
