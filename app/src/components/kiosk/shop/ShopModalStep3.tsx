// waiting / idle
// processing
// success // error payment // error robot

import {
  CircleCheckSharpSolid,
  ShieldCheckSharpSolid,
} from '@/components/icons/icons';

import { PaymentImagesFooterIcon } from '@/components/images/PaymentImages';
import { formatPrice } from '@/components/kiosk/shop/utils';
import { addNewOrder } from '@/firebase/dbFunctionsBestellungen';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
import { useContext } from 'react';
import { DisplayContext } from '@/providers/DisplayContext';
import { useRouter } from '@/providers/DisplayContext';
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
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';

import shopData from '@/public/kiosk/products/leipzig.json';
import { useWebSocket } from '@/websocket/WebSocketContext';
const automatenID = shopData.automatenID;

const Video = chakra('video');

let paymentErrorTimeout;

function ShopModalStep3({ onClose }) {
  const {
    cart,
    getCartTotalPrice,
    getCartTotalPfand,
    clearCart,
    payment,
    bestellung,
    setPayment,
  } = useCart();

  const ws = useWebSocket();

  const router = useRouter();

  const [countdown, setCountdown] = useState(null);

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
        displayNumber === 'front'
          ? 'front'
          : displayNumber === 'back'
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
      ws.send('devices', JSON.stringify(bestellung)); // Replace 'devices' with actual target
    } else {
      console.log('WebSocket not connected. Bestellung not aufgegeben.');
    }
  };

  const handlePaymentWaiting = () => {
    //setShowTrinkgeld(false);
    //setShowTrinkgeldYes(false);
    console.log('CLICK');
    setPayment('idle');

    paymentErrorTimeout = setTimeout(() => {
      handlePaymentError();
    }, 3000);
  };

  const handlePaymentSuccess = () => {
    clearTimeout(paymentErrorTimeout); // Add this line to clear the timeout
    setShowTrinkgeld(false);
    setShowTrinkgeldYes(false);
    setShowTrinkgeldDanke(false);
    setPayment('success');
    setCountdown(7);

    const timer = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      handlePaymentFinished();
    }, 7000);

    return () => {
      clearInterval(timer);
    };
  };

  useEffect(() => {
    if (ws) {
      const handleMessage = (data) => {
        if (data.code && data.code === 'paymentSuccess') {
          setPayment('success');
          handlePaymentSuccess(); // Correctly handling the success
        } else if (data.code && data.code === 'paymentError') {
          setPayment('error'); // Explicitly handle errors
        }
      };

      ws.handleMessage(handleMessage);

      // Cleanup WebSocket listener
      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, setPayment]);

  const handlePaymentFinished = async () => {
    const orderData = bestellung('success');
    await addNewOrder(automatenID, orderData);

    clearCart();
    setPayment('init'); // <-- Make sure this is called at the end of the process.
    onClose();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
  };

  const handlePaymentError = () => {
    setPayment('error');
    setTimeout(() => {
      handlePaymentAgain();
    }, 8000);
  };

  const handlePaymentAgain = () => {
    setPayment('init');
    setShowTrinkgeldAgain(false);
  };

  const [Trinkgeld, setTrinkgeld] = useState(0);

  const [showTrinkgeld, setShowTrinkgeld] = useState(false);
  const [showTrinkgeldYes, setShowTrinkgeldYes] = useState(false);
  const [showTrinkgeldDanke, setShowTrinkgeldDanke] = useState(false);

  const [showTrinkgeldAgain, setShowTrinkgeldAgain] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showTrinkgeldAgain === true) {
        if (payment === 'waiting') {
          setShowTrinkgeld(true);
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [payment, showTrinkgeldAgain]);

  const bgColorTrinkgeld = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );

  const primaryHeadingColor = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );

  const calculateItemPfand = (item) => {
    let pfand = 0;
    if (item.choosenMug === 'mehrwegVariable') {
      pfand += 1; // 1 Euro Pfand per item
      if (item.choosenLid === 'inklusiveDeckel') {
        pfand += 1; // 1 Euro Pfand per item
      }
    }
    // Add additional Pfand calculations here if necessary
    return pfand;
  };

  const requiresPfand = cart.some(
    (item) => item.choosenMug === 'mehrwegVariable',
  );

  const { displayNumber } = useContext(DisplayContext);

  return (
    <ModalBody p='0'>
      <Box pl='11' pt='4'>
        <Flex direction='column' height='100%'>
          <Stack
            overflowX='hidden'
            alignItems='flex-start'
            h='100%'
            minH='100%'
            spacing='0'
            py='0'
            height={KIOSK_HEIGHTCONTENT_MODAL}
          >
            {/* <ScrollFade> */}
            <Stack overflowY='hidden'>
              <VStack alignItems='flex-start'>
                <Box pb='4'>
                  <HStack alignItems='flex-start'>
                    <Box width='100%'>
                      <Heading pb='0' variant='h1_Kiosk'>
                        Kasse
                      </Heading>

                      <HStack>
                        <Icon
                          pr='0.1rem'
                          boxSize='1.2rem'
                          as={ShieldCheckSharpSolid}
                        />
                        <Text as='u' pt='0'>
                          Kontaktlos und sicher.
                        </Text>
                      </HStack>

                      <Text pt='15' variant='kiosk' pb='12' maxW='100%'>
                        {payment === 'idle' && 'nothing2 here.'}
                        {payment === 'processing' &&
                          'Bitte folge den Anweisungen am Kartenterminal.'}
                        {payment === 'waiting' &&
                          'Bitte folge den Anweisungen am Kartenterminal.'}
                        {payment === 'success' &&
                          'Zahlung erfolgreich! Vielen Dank für Deine Bestellung, Toto bereitet diese nun für Dich zu.'}
                        {payment === 'error' &&
                          'Deine Zahlung ist fehlgeschlagen! Bitte versuche es erneut oder nutze ein alternatives Zahlungsmittel.'}
                      </Text>
                      {payment !== 'init' && (
                        <Video
                          rounded={KISOK_BORDERRADIUS}
                          autoPlay
                          w='20rem'
                          h='20rem'
                          loop
                          muted
                          //fill={true}
                          object-fit='contain'
                          style={{ objectFit: 'cover' }}
                          src={`/kiosk/payment/${payment}.mov`}
                        />
                      )}
                    </Box>
                    {/* <Spacer /> */}
                    {/* <Box maxW='20%' pt={herkunft === 'shop' ? '5' : '14'} pr='0'>
                    <PaymentImagesFooter />
                  </Box> */}
                  </HStack>
                </Box>
              </VStack>
            </Stack>
            {/* </ScrollFade> */}
            <Spacer />

            <HStack alignItems='flex-end' w='100%' pb='8'>
              <HStack
                w='100%'
                justifyContent='flex-start'
                alignItems='flex-end'
                gap='10'
              >
                <Box>
                  <HStack
                    pb='28'
                    gap='5'
                    transform='translateY(0.8rem) translateX(0)'
                  >
                    <>
                      {payment !== 'success' ? (
                        <>
                          <Button
                            onClick={handlePaymentWaiting}
                            gap='5'
                            variant='kiosk_pricetag_big'
                          >
                            <Box>Gesamt:</Box>
                            <Box>
                              {formatPrice({
                                amount:
                                  getCartTotalPrice() + getCartTotalPfand(),
                              })}
                            </Box>
                          </Button>

                          {Trinkgeld > 0 && (
                            <>
                              <Heading variant='h1_Kiosk'>+</Heading>
                              <Button gap='5' variant='kiosk_pricetag_big'>
                                {formatPrice({
                                  amount: Trinkgeld,
                                })}{' '}
                                Trinkgeld
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <Button gap='5' variant='kiosk_pricetag_big'>
                          <Icon boxSize='2.5rem' as={CircleCheckSharpSolid} />
                          Zahlung erfolgreich
                        </Button>
                      )}
                    </>
                  </HStack>
                </Box>
                <Spacer />
                {payment === 'waiting' && (
                  <Box>
                    <Box pt='15'>
                      {showTrinkgeld && (
                        <Box
                          //maxW='80%'
                          width='fit-content'
                          gap='5'
                          px='7'
                          py='6'
                          rounded='xl'
                          bgColor={bgColorTrinkgeld}

                          //transform='translateY(-0.4rem) translateX(-0.3rem)'
                        >
                          <HStack gap='2'>
                            <Text variant='kiosk' p='0' pr='5'>
                              Möchtest du Toto Trinkgeld geben?
                            </Text>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => {
                                setShowTrinkgeld(false);
                                setShowTrinkgeldYes(true);
                              }}
                            >
                              Ja!
                            </Button>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => setShowTrinkgeld(false)}
                            >
                              Nein.
                            </Button>
                          </HStack>
                        </Box>
                      )}
                      {showTrinkgeldYes && (
                        <Box
                          gap='5'
                          px='7'
                          py='6'
                          rounded='xl'
                          bgColor={bgColorTrinkgeld}
                          width='fit-content'
                          //transform='translateY(-0.4rem) translateX(-0.3rem)'
                        >
                          <HStack gap='2'>
                            <Text variant='kiosk' p='0' pr='3'>
                              Trinkgeld für Toto:
                            </Text>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => {
                                setTrinkgeld(0.5);
                                setShowTrinkgeldYes(false);
                                setShowTrinkgeldDanke(true);
                              }}
                            >
                              0,50 €
                            </Button>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => {
                                setTrinkgeld(1);
                                setShowTrinkgeldYes(false);
                                setShowTrinkgeldDanke(true);
                              }}
                            >
                              1 €
                            </Button>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => {
                                setTrinkgeld(2);
                                setShowTrinkgeldYes(false);
                                setShowTrinkgeldDanke(true);
                              }}
                            >
                              2 €
                            </Button>
                            <Button
                              variant='outline'
                              colorScheme='purple'
                              px='5'
                              onClick={() => {
                                setTrinkgeld(0);
                                setShowTrinkgeldYes(false);
                              }}
                            >
                              Kein Trinkgeld
                            </Button>
                          </HStack>
                        </Box>
                      )}

                      {showTrinkgeldDanke && (
                        <Box
                          gap='5'
                          px='7'
                          py='6'
                          rounded='xl'
                          bgColor={bgColorTrinkgeld}
                          width='fit-content'
                          //transform='translateY(-0.4rem) translateX(-0.3rem)'
                        >
                          <HStack gap='2'>
                            <Text variant='kiosk' p='0'>
                              Danke für Dein Trinkgeld!
                            </Text>
                          </HStack>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {payment === 'success' && (
                  <Box
                    gap='5'
                    px='7'
                    py='6'
                    rounded='xl'
                    bgColor={bgColorTrinkgeld}
                    //transform='translateY(-0.4rem) translateX(-0.3rem)'
                  >
                    <HStack gap='2'>
                      <Text variant='kiosk' p='0'>
                        {countdown !== null &&
                          `Dieses Fenster schließt sich automatisch in ${countdown} Sekunden.`}
                      </Text>
                    </HStack>
                  </Box>
                )}
              </HStack>
            </HStack>
          </Stack>
        </Flex>
      </Box>
      <Box>
        <PaymentImagesFooterIcon isRounded={true} isWhite={true} />
      </Box>
    </ModalBody>
  );
}

export default ShopModalStep3;
