import {
  CircleCheckSharpSolid,
  ShieldCheckSharpSolid,
} from '@/components/icons/icons';
import { PaymentImages } from '@/components/images/PaymentImages';
import { formatPrice } from '@/components/kiosk/shop/utils';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
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

const Video = chakra('video');

let paymentErrorTimeout;

function ShopModalStep3({ herkunft, onClose }) {
  const {
    getCartTotalPrice,
    getCartTotalPfand,
    clearCart,
    payment,
    setPayment,
  } = useCart();

  const router = useRouter();

  const [countdown, setCountdown] = useState(null);

  const handlePaymentWaiting = () => {
    setShowTrinkgeld(false);
    setShowTrinkgeldYes(false);
    setPayment('waiting');

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

  const handlePaymentFinished = () => {
    clearCart();
    setPayment('init');
    onClose();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
  };

  const handlePaymentError = () => {
    setPayment('error');
    setTimeout(() => {
      handlePaymentAgain();
    }, 5000);
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
        if (payment === 'init') {
          setShowTrinkgeld(true);
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [payment, showTrinkgeldAgain]);

  const bgColorTrinkgeld = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode'
  );

  return (
    <ModalBody>
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
              <Box maxW='100%' minW='100%' width='100%' pb='4'>
                <HStack alignItems='flex-start'>
                  <Box>
                    <Heading pb='0' variant='h1_Kiosk'>
                      Bezahlvorgang
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

                    <Text pt='4' variant='kiosk' pb='8'>
                      {payment === 'init' &&
                        'Präsentiere deine Zahlungsmittel am Lesegerät um kontaktlos zu zahlen.'}
                      {payment === 'waiting' &&
                        'Zahlung erfolgt – verifiziere Zahlungsmittel ...'}
                      {payment === 'success' &&
                        'Zahlung erfolgreich! Vielen Dank für Deine Bestellung, Toto bereitet diese für Dich zu.'}
                      {payment === 'error' &&
                        'Zahlung fehlgeschlagen! Bitte versuche es erneut oder nutze ein alternatives Zahlungsmittel.'}
                    </Text>

                    <Video
                      rounded={KISOK_BORDERRADIUS}
                      autoPlay
                      w='40rem'
                      h='23rem'
                      loop
                      muted
                      //fill={true}
                      object-fit='contain'
                      style={{ objectFit: 'cover' }}
                      src={`/kiosk/payment/${payment}.mov`}
                    />
                  </Box>
                  <Spacer />
                  <Box maxW='25%' pt={herkunft === 'shop' ? '5' : '14'} pr='1'>
                    <PaymentImages />
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Stack>
          {/* </ScrollFade> */}
          <Spacer />

          <HStack alignItems='flex-end' w='100%' pb='11'>
            <HStack
              w='100%'
              justifyContent='flex-start'
              alignItems='flex-end'
              gap='5'
              //bgColor='red.100'
            >
              <Box>
                <Box>
                  <HStack gap='1'>
                    {payment !== 'success' ? (
                      <>
                        <Button
                          gap='5'
                          variant='kiosk_pricetag_big'
                          onClick={() => {
                            if (payment === 'init') {
                              handlePaymentWaiting();
                            }
                            if (payment === 'waiting') {
                              handlePaymentSuccess();
                            }
                          }}
                        >
                          {formatPrice({ amount: getCartTotalPrice() })}
                        </Button>
                        {getCartTotalPfand() !== 0 && (
                          <Button gap='5' variant='kiosk_pricetag_big'>
                            + {formatPrice({ amount: getCartTotalPfand() })}{' '}
                            Pfand
                          </Button>
                        )}
                        {Trinkgeld !== 0 && (
                          <Button gap='5' variant='kiosk_pricetag_big'>
                            + {formatPrice({ amount: Trinkgeld })} Trinkgeld
                          </Button>
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
              </Box>
              <Spacer />
              {showTrinkgeld && (
                <Box
                  gap='5'
                  px='7'
                  py='6'
                  rounded='xl'
                  bgColor={bgColorTrinkgeld}
                  transform='translateY(-0.4rem) translateX(-0.3rem)'
                >
                  <HStack gap='2'>
                    <Text variant='kiosk' p='0' pr='5'>
                      Würdest du einem Roboterarm Trinkgeld geben?
                    </Text>
                    <Button
                      variant='solid'
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
                      variant='solid'
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
                  transform='translateY(-0.4rem) translateX(-0.3rem)'
                >
                  <HStack gap='2'>
                    <Text variant='kiosk' p='0' pr='3'>
                      Trinkgeld für Toto:
                    </Text>
                    <Button
                      variant='solid'
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
                      variant='solid'
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
                      variant='solid'
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
                      variant='solid'
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
                  transform='translateY(-0.4rem) translateX(-0.3rem)'
                >
                  <HStack gap='2'>
                    <Text variant='kiosk' p='0'>
                      Danke für Dein Trinkgeld!
                    </Text>
                  </HStack>
                </Box>
              )}

              {payment === 'success' && (
                <Box
                  gap='5'
                  px='7'
                  py='6'
                  rounded='xl'
                  bgColor={bgColorTrinkgeld}
                  transform='translateY(-0.4rem) translateX(-0.3rem)'
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
    </ModalBody>
  );
}

export default ShopModalStep3;
