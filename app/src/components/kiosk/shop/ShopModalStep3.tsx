import {
  ArrowDownSharpSolid,
  ArrowRightSharpSolid,
  CircleCheckSharpRegular,
  CircleCheckSharpSolid,
  CreditCardRegular,
  ShieldCheckSharpSolid,
} from '@/components/icons/icons';

import {
  PaymentImagesFooterIcon,
  PaymentImagesFooterIconWhiteBG,
} from '@/components/images/PaymentImages';
import { formatPrice } from '@/components/kiosk/shop/utils';
import { addNewOrder } from '@/firebase/dbFunctionsBestellungen';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
import { useContext, useCallback, useRef } from 'react';
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
  keyframes,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { KIOSK_HEIGHTCONTENT_MODAL, KISOK_BORDERRADIUS } from 'src/constants';

import shopData from '@/public/kiosk/products/leipzig.json';
import { useWebSocket } from '@/websocket/WebSocketContext';
import { FaHeart } from 'react-icons/fa';

const automatenID = shopData.automatenID;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Video = chakra('video');

let paymentErrorTimeout: NodeJS.Timeout;

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

  const [countdown, setCountdown] = useState<number | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [Trinkgeld, setTrinkgeld] = useState<number>(0);

  const [showTrinkgeld, setShowTrinkgeld] = useState(false);
  const [showTrinkgeldYes, setShowTrinkgeldYes] = useState(false);
  const [showTrinkgeldDanke, setShowTrinkgeldDanke] = useState(false);
  const [showTrinkgeldAgain, setShowTrinkgeldAgain] = useState(true);

  const { displayNumber } = useContext(DisplayContext);

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

  // Initialize the ref to track intentional aborts
  const isAborting = useRef(false);

  // Renamed to avoid conflict
  // Renamed to avoid conflict
  const processPaymentError = useCallback(
    (errorCode: string) => {
      let errorMessage: string;

      switch (errorCode) {
        case '6c':
          errorMessage = 'Invalid card details';
          break;
        case '51':
          errorMessage = 'Insufficient funds';
          break;
        case '00010000':
          errorMessage = 'Du warst zu langsam!';
          break;
        default:
          errorMessage = `Unknown error occurred. Code: ${errorCode}`;
      }
      setShowTrinkgeld(false);
      setShowTrinkgeldAgain(true);

      //setShowTrinkgeldYes(false);
      //setShowTrinkgeldDanke(false);
      setErrorCode(errorMessage);

      if (isAborting.current) {
        setPayment('waitingForTrinkgeld'); // Set to 'waitingForTrinkgeld'
        isAborting.current = false; // Reset the abort flag
        console.log(
          'Intentional abort detected. Setting payment to waitingForTrinkgeld.',
        );
      } else {
        setPayment('error'); // Set to 'error'
        console.log(
          'Genuine payment error detected. Setting payment to error.',
        );
      }

      console.error(`Payment Error (${errorCode}): ${errorMessage}`);
    },
    [setPayment],
  );

  // Ensure useEffect runs only once by providing stable dependencies
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (data) => {
      if (data.Payment === '00') {
        setPayment('success');
        handlePaymentSuccess();
      } else if (data.Payment) {
        console.log('Received Payment Data:', data.Payment);
        const errorCode = data.Payment;
        processPaymentError(errorCode);
      }
    };

    ws.handleMessage(handleMessage);

    // Cleanup WebSocket listener on unmount
    return () => {
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws, processPaymentError, setPayment]);

  const handlePaymentClick = (tipAmount: number) => {
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
      totalPrice: getCartTotalPrice() + getCartTotalPfand() + tipAmount,
      tip: tipAmount || 0,
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

    console.log('Sending Bestellung:', bestellung);
    if (ws) {
      ws.send('devices', JSON.stringify(bestellung)); // Replace 'devices' with actual target
    } else {
      console.log('WebSocket not connected. Bestellung not aufgegeben.');
    }
  };

  const handlePaymentSuccess = () => {
    clearTimeout(paymentErrorTimeout); // Clear the timeout
    setShowTrinkgeld(false);
    setShowTrinkgeldYes(false);
    setShowTrinkgeldDanke(false);
    setPayment('success');
    setCountdown(10);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      handlePaymentFinished();
    }, 9800);

    // Cleanup interval on unmount
    return () => {
      clearInterval(timer);
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showTrinkgeldAgain === true) {
        if (payment === 'processing') {
          setShowTrinkgeldYes(false);
          setShowTrinkgeldDanke(false);
          setShowTrinkgeld(true);
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [payment, showTrinkgeldAgain]);

  const handlePaymentFinished = async () => {
    //const orderData = bestellung('success');
    //await addNewOrder(automatenID, orderData); //! FIREBIRD BASE
    clearCart();
    onClose();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
    setPayment('idle');
  };

  return (
    <ModalBody p='0'>
      <Box pl='8' pr='8' pt='3' pb='4'>
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
              <HStack alignItems='flex-start'>
                <Box width='100%' pb='8'>
                  <Heading pb='0' variant='h1_Kiosk' w='100%'>
                    Kasse
                  </Heading>

                  <HStack gap='2'>
                    <Icon
                      pr='0.1rem'
                      boxSize='1.2rem'
                      as={ShieldCheckSharpSolid}
                    />
                    <Text as='u' pt='0'>
                      Kontaktlos und sicher.
                    </Text>
                  </HStack>
                </Box>
              </HStack>
              <Stack w='calc(100vw - 6rem)'>
                <HStack align='top' justify='space-between' maxW='55%'>
                  <Text pt='0' variant='kiosk' pb='12'>
                    {payment === 'idle' && 'Nothing here. Pls go.'}
                    {payment === 'processing' &&
                      'Bitte präsentiere dein Zahlungsmittel am Lesegerät, um kontaktlos zu zahlen.'}
                    {payment === 'waitingForTrinkgeld' &&
                      'Du möchtest Trinkgeld geben? Toto freut sich! Wie viel möchtest du geben?'}
                    {payment === 'danke' &&
                      'Super sweet! Bitte präsentiere dein Zahlungsmittel am Lesegerät, um kontaktlos zu zahlen.'}
                    {payment === 'waiting' &&
                      'Bitte folge den Anweisungen am Kartenterminal.'}
                    {payment === 'success' &&
                      'Zahlung erfolgreich! Vielen Dank für Deine Bestellung, Toto bereitet diese nun für Dich zu.'}
                    {payment === 'error' &&
                      `Deine Zahlung ist fehlgeschlagen. ${errorCode}`}
                  </Text>

                  <Spacer />

                  {/* Video */}
                  {payment !== 'idle' && (
                    <Box right='10' top='16%' position='absolute'>
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
            <Box
              gap='5'
              px='6'
              py='4'
              rounded='xl'
              bgColor={bgColorTrinkgeld}
              //transform='translateY(-0.4rem) translateX(-0.3rem)'
            >
              <HStack gap='6'>
                <Icon boxSize='2rem' as={CircleCheckSharpRegular} />
                <Text variant='kiosk' p='0'>
                  {countdown !== null &&
                    `Dieses Fenster schließt sich automatisch in ${countdown} Sekunden.`}
                </Text>
              </HStack>
            </Box>
          )}
          {/* </ScrollFade> */}

          {payment === 'error' && errorCode === 'Du warst zu langsam!' && (
            <Box pl='0.5rem'>
              <Button
                gap='5'
                variant='kiosk_rainbow_big'
                colorScheme='blue'
                onClick={() => {
                  setPayment('processing'); //###
                  setTrinkgeld(0);
                  setShowTrinkgeld(false);
                  setShowTrinkgeldYes(false);
                  setShowTrinkgeldDanke(false);
                  setShowTrinkgeldAgain(true);
                  handlePaymentClick(0);
                }}
              >
                Zahlung erneut starten
                <Icon boxSize='3.0rem' as={ArrowRightSharpSolid} />
                <Icon boxSize='2.5rem' as={CreditCardRegular} />
              </Button>
            </Box>
          )}

          {(payment === 'processing' ||
            payment === 'waitingForTrinkgeld' ||
            payment === 'danke') && (
            <Box>
              <Box>
                {showTrinkgeld && (
                  <Box
                    //maxW='80%'

                    width='fit-content'
                    maxWidth='60vw'
                    zIndex='100'
                    gap='5'
                    px='5'
                    py='4'
                    rounded='xl'
                    bgColor={bgColorTrinkgeld}

                    //transform='translateY(-0.4rem) translateX(-0.3rem)'
                  >
                    <HStack gap='5'>
                      <Text variant='kiosk' p='0' pr='5'>
                        Trinkgeld für Toto?
                      </Text>
                      <HStack gap='7'>
                        <Button
                          gap='2'
                          fontSize='xl'
                          h='3rem'
                          px='4'
                          variant='outline'
                          colorScheme='purple'
                          onClick={() => {
                            setShowTrinkgeld(false);
                            setTrinkgeld(0);
                            setShowTrinkgeldYes(true);
                            setPayment('waitingForTrinkgeld'); // Set payment to 'waitingForTrinkgeld'

                            console.log(
                              'Ja button clicked: Setting payment to waitingForTrinkgeld',
                            );

                            isAborting.current = true; // Indicate an intentional abort
                            ws.send('devices', 'abort_payment'); // Send abort_payment
                          }}
                        >
                          Ja!
                          <Icon as={FaHeart} />
                        </Button>
                        <Button
                          fontSize='xl'
                          h='3rem'
                          px='4'
                          variant='outline'
                          colorScheme='purple'
                          onClick={() => {
                            setShowTrinkgeld(false);
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
                    px='5'
                    py='4'
                    rounded='xl'
                    bgColor={bgColorTrinkgeld}
                    width='fit-content'
                    //transform='translateY(-0.4rem) translateX(-0.3rem)'
                  >
                    <HStack gap='6'>
                      <Button
                        fontSize='xl'
                        h='3rem'
                        px='4'
                        variant='outline'
                        colorScheme='purple'
                        onClick={() => {
                          setTrinkgeld(0.5);
                          console.log(Trinkgeld);
                          setShowTrinkgeldYes(false);
                          setPayment('danke');
                          setShowTrinkgeldDanke(true);
                          handlePaymentClick(0.5);
                        }}
                      >
                        0,50 €
                      </Button>
                      <Button
                        fontSize='xl'
                        h='3rem'
                        px='4'
                        variant='outline'
                        colorScheme='purple'
                        onClick={() => {
                          setTrinkgeld(1);
                          setShowTrinkgeldYes(false);
                          setPayment('danke');
                          setShowTrinkgeldDanke(true);
                          handlePaymentClick(1);
                        }}
                      >
                        1,00 €
                      </Button>
                      <Button
                        fontSize='xl'
                        h='3rem'
                        px='4'
                        variant='outline'
                        colorScheme='purple'
                        onClick={() => {
                          setTrinkgeld(2);
                          setShowTrinkgeldYes(false);
                          setPayment('danke');
                          setShowTrinkgeldDanke(true);
                          handlePaymentClick(2);
                        }}
                      >
                        2,00 €
                      </Button>
                      <Button
                        fontSize='xl'
                        h='3rem'
                        px='4'
                        variant='outline'
                        colorScheme='purple'
                        onClick={() => {
                          setTrinkgeld(0);
                          setShowTrinkgeldYes(false);
                          setShowTrinkgeldAgain(false);
                          setPayment('processing');
                          handlePaymentClick(0);
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
                    //transform='translateY(-0.4rem) translateX(-0.3rem)'
                  >
                    <HStack spacing={3}>
                      <Text variant='kiosk' p={0}>
                        Danke!
                      </Text>
                      <Icon as={FaHeart} />
                      <Icon as={FaHeart} />
                      <Icon as={FaHeart} />
                    </HStack>
                  </Box>
                )}
              </Box>
            </Box>
          )}
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
                        <Button gap='5' variant='kiosk_pricetag_big'>
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

                        {/* {Trinkgeld > 0 && (
                          <>
                            <Heading variant='h1_Kiosk'>+</Heading>
                            <Button gap='5' variant='kiosk_pricetag_big'>
                              {formatPrice({
                                amount: Trinkgeld,
                              })}{' '}
                              Trinkgeld
                            </Button>
                          </>
                        )} */}
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
            </HStack>
          </HStack>
        </Stack>
      </Box>
      <Box>
        <PaymentImagesFooterIconWhiteBG />
      </Box>
      {(payment === 'processing' || payment === 'danke') && (
        <Box
          position='absolute'
          bottom='22%'
          left='50%'
          transform='translateX(-50%)'
        >
          <Icon
            boxSize='20rem'
            as={ArrowDownSharpSolid}
            animation={`${blink} 1s infinite`} // Apply the blink animation
          />
        </Box>
      )}
    </ModalBody>
  );
}

export default ShopModalStep3;
