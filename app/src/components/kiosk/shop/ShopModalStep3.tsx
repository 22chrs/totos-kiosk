import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  ModalBody,
  Spacer,
  Stack,
  Text,
  VStack,
  chakra,
  keyframes,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ArrowDownSharpSolid,
  CircleCheckSharpRegular,
  CircleCheckSharpSolid,
  ShieldCheckSharpSolid,
} from '@/components/icons/icons';
import { PaymentImagesFooterIconWhiteBG } from '@/components/images/PaymentImages';
import { formatPrice } from '@/components/kiosk/shop/utils';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
import { DisplayContext } from '@/providers/DisplayContext';
import { useRouter } from '@/providers/DisplayContext';
import shopData from '@/public/kiosk/products/leipzig.json';
import { useWebSocket } from '@/websocket/WebSocketContext';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';

const automatenID = shopData.automatenID;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Video = chakra('video');

function TipSection({ onTipSelected, payment }) {
  const [showTrinkgeld, setShowTrinkgeld] = useState(false);
  const [showTrinkgeldYes, setShowTrinkgeldYes] = useState(false);
  const [showTrinkgeldDanke, setShowTrinkgeldDanke] = useState(false);
  const [showTrinkgeldAgain, setShowTrinkgeldAgain] = useState(true);

  const bgColorTrinkgeld = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );

  useEffect(() => {
    if (showTrinkgeldAgain && payment === 'processing') {
      const timer = setTimeout(() => {
        setShowTrinkgeld(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [payment, showTrinkgeldAgain]);

  return (
    <>
      {payment === 'processing' && (
        <Box zIndex='10'>
          {showTrinkgeld && (
            <Box
              width='fit-content'
              gap='5'
              px='5'
              py='4'
              rounded='xl'
              bgColor={bgColorTrinkgeld}
            >
              <HStack gap='2'>
                <Text variant='kiosk' p='0' pr='5'>
                  Möchtest du Toto Trinkgeld geben?
                </Text>
                <HStack gap='5'>
                  <Button
                    variant='solid'
                    colorScheme='blue'
                    px='4'
                    onClick={() => {
                      setShowTrinkgeld(false);
                      setShowTrinkgeldYes(true);
                    }}
                  >
                    Ja!
                  </Button>
                  <Button
                    variant='outline'
                    colorScheme='blue'
                    px='4'
                    onClick={() => {
                      setShowTrinkgeld(false);
                      setShowTrinkgeldAgain(false);
                    }}
                  >
                    Nein.
                  </Button>
                </HStack>
              </HStack>
            </Box>
          )}
          {showTrinkgeldYes && (
            <Box
              gap='5'
              px='5'
              py='4'
              rounded='xl'
              bgColor={bgColorTrinkgeld}
              width='fit-content'
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
                    onTipSelected(0.5);
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
                    onTipSelected(1);
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
                    onTipSelected(2);
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
                    onTipSelected(0);
                    setShowTrinkgeldYes(false);
                    setShowTrinkgeldAgain(false);
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
              px='5'
              py='4'
              rounded='xl'
              bgColor={bgColorTrinkgeld}
              width='fit-content'
            >
              <HStack gap='2'>
                <Text variant='kiosk' p='0'>
                  Danke für Dein Trinkgeld!
                </Text>
              </HStack>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

function ShopModalStep3({ onClose }) {
  const {
    cart,
    getCartTotalPrice,
    getCartTotalPfand,
    clearCart,
    payment,
    setPayment,
  } = useCart();
  const { displayNumber } = useContext(DisplayContext);
  const ws = useWebSocket();
  const router = useRouter();

  const [countdown, setCountdown] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [Trinkgeld, setTrinkgeld] = useState(0);

  const paymentErrorTimeout = useRef(null);
  const paymentSuccessTimer = useRef(null);
  const paymentSuccessTimeout = useRef(null);

  const bgColorTrinkgeld = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );

  const handleTipSelected = (amount) => {
    setTrinkgeld(amount);
  };

  const handlePaymentError = useCallback(
    (errorCode) => {
      let errorMessage;

      switch (errorCode) {
        case '6c':
          errorMessage = 'Invalid card details';
          break;
        case '51':
          errorMessage = 'Insufficient funds';
          break;
        case '91':
          errorMessage = 'Issuer unavailable';
          break;
        case 'timeout':
          errorMessage = 'Payment timed out. Please try again.';
          break;
        default:
          errorMessage = `Unknown error occurred. Code: ${errorCode}`;
      }

      setErrorCode(errorMessage);
      setPayment('error');
      console.error(`Payment Error (${errorCode}): ${errorMessage}`);
    },
    [setErrorCode, setPayment],
  );

  const handlePaymentFinished = useCallback(async () => {
    clearCart();
    onClose();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
    setPayment('idle');
  }, [clearCart, onClose, router, setPayment]);

  const handlePaymentSuccess = useCallback(() => {
    if (paymentErrorTimeout.current) {
      clearTimeout(paymentErrorTimeout.current);
    }
    setPayment('success');
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(timer);
      handlePaymentFinished();
    }, 10000);

    paymentSuccessTimer.current = timer;
    paymentSuccessTimeout.current = timeout;
  }, [handlePaymentFinished, setPayment]);

  const handleMessage = useCallback(
    (data) => {
      if (data.Payment && data.Payment === '00') {
        handlePaymentSuccess();
      } else if (data.Payment) {
        const errorCode = data.Payment;
        handlePaymentError(errorCode);
      }
    },
    [handlePaymentError, handlePaymentSuccess],
  );

  useEffect(() => {
    if (ws) {
      ws.handleMessage(handleMessage);
      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, handleMessage]);

  useEffect(() => {
    return () => {
      if (paymentErrorTimeout.current) {
        clearTimeout(paymentErrorTimeout.current);
      }
      if (paymentSuccessTimer.current) {
        clearInterval(paymentSuccessTimer.current);
      }
      if (paymentSuccessTimeout.current) {
        clearTimeout(paymentSuccessTimeout.current);
      }
    };
  }, []);

  const handlePaymentClick = () => {
    const now = new Date();
    const formattedTimestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0]
      .replace('T', '_');

    const bestellung = {
      automatenID: automatenID || null,
      whichTerminal:
        displayNumber === 'front'
          ? 'front'
          : displayNumber === 'back'
            ? 'back'
            : 'unknown',
      orderID: null,
      orderStatus: 'unpaid',
      timeStampOrder: formattedTimestamp,
      totalPrice: getCartTotalPrice() + (Trinkgeld || 0),
      tip: Trinkgeld || 0,
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

    console.log(bestellung);
    if (ws) {
      ws.send('devices', JSON.stringify(bestellung));
    } else {
      console.log('WebSocket not connected. Bestellung not aufgegeben.');
    }
  };

  const startPaymentProcess = () => {
    console.log('Starting payment process');
    setPayment('processing');

    handlePaymentClick();

    paymentErrorTimeout.current = setTimeout(() => {
      handlePaymentError('timeout');
    }, 30000);
  };

  return (
    <ModalBody p='0'>
      <Box px='11' pt='4' pb='4'>
        <Stack
          overflowX='hidden'
          alignItems='flex-start'
          h='100%'
          minH='100%'
          spacing='0'
          py='0'
          height={KIOSK_HEIGHTCONTENT_MODAL}
        >
          <Stack overflowY='hidden'>
            <VStack alignItems='flex-start'>
              <HStack alignItems='flex-start'>
                <Box width='100%' pb='8'>
                  <Heading pb='0' variant='h1_Kiosk' w='100%'>
                    Kasse
                  </Heading>

                  <Box>
                    <Icon boxSize='1.2rem' as={ShieldCheckSharpSolid} />
                    <Text as='u' pt='0' pl='3'>
                      Kontaktlos und sicher.
                    </Text>
                  </Box>
                </Box>
              </HStack>
              <Stack w='calc(100vw - 6rem)'>
                <HStack align='top' justify='space-between' maxW='55%'>
                  <Text pt='0' variant='kiosk' pb='12'>
                    {payment === 'idle' && 'Nothing here. Pls go.'}
                    {payment === 'processing' &&
                      'Bitte präsentiere dein Zahlungsmittel am Lesegerät, um kontaktlos zu zahlen.'}
                    {payment === 'waiting' &&
                      'Bitte folge den Anweisungen am Kartenterminal.'}
                    {payment === 'success' &&
                      'Zahlung erfolgreich! Vielen Dank für Deine Bestellung, Toto bereitet diese nun für Dich zu.'}
                    {payment === 'error' &&
                      `Deine Zahlung ist fehlgeschlagen: ${errorCode}`}
                  </Text>

                  <Spacer />

                  {payment !== 'idle' && (
                    <Box right='12' top='16%' position='absolute'>
                      <Video
                        rounded={KISOK_BORDERRADIUS}
                        autoPlay
                        w='20rem'
                        h='30rem'
                        loop
                        muted
                        style={{ objectFit: 'cover' }}
                        src={`/kiosk/payment/${payment}.mov`}
                      />
                    </Box>
                  )}
                </HStack>
              </Stack>
            </VStack>
          </Stack>
          {payment === 'success' && (
            <Box gap='5' px='6' py='4' rounded='xl' bgColor={bgColorTrinkgeld}>
              <HStack gap='6'>
                <Icon boxSize='2rem' as={CircleCheckSharpRegular} />
                <Text variant='kiosk' p='0'>
                  {countdown !== null &&
                    `Dieses Fenster schließt sich automatisch in ${countdown} Sekunden.`}
                </Text>
              </HStack>
            </Box>
          )}
          <Spacer />

          {/* Tip Section */}
          <TipSection onTipSelected={handleTipSelected} payment={payment} />

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
                  {payment !== 'success' ? (
                    <>
                      <Button
                        onClick={startPaymentProcess}
                        gap='5'
                        variant='kiosk_pricetag_big'
                      >
                        <Box>Gesamt:</Box>
                        <Box>
                          {formatPrice({
                            amount:
                              getCartTotalPrice() +
                              getCartTotalPfand() +
                              Trinkgeld,
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
                </HStack>
              </Box>
              <Spacer />
            </HStack>
          </HStack>
        </Stack>
      </Box>
      <Box>
        <PaymentImagesFooterIconWhiteBG />
      </Box>
      {payment === 'processing' && (
        <Box
          position='absolute'
          bottom='22%'
          left='50%'
          transform='translateX(-50%)'
        >
          <Icon
            boxSize='20rem'
            as={ArrowDownSharpSolid}
            animation={`${blink} 1s infinite`}
          />
        </Box>
      )}
    </ModalBody>
  );
}

export default ShopModalStep3;
