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

import { CheckDuotone } from '@/components/icons/icons';
import { ItemBestellung } from '@/components/kiosk/shop/Warenkorb/ItemBestellung';
import { useCart } from '@/providers/CardContext';
import { useStepper } from '@/providers/StepperContext';
import { FaPlus } from 'react-icons/fa';
import { KIOSK_HEIGHTCONTENT_MODAL } from 'src/constants';

function ShopModalStepWarenkorb({ onClose }) {
  const { activeStep, setActiveStep } = useStepper();

  const { cart, getCartTotalPrice, getCartTotalPfand, getCartTotalQuantity } =
    useCart();

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
          <Stack overflowY='auto'>
            <VStack alignItems='flex-start'>
              <Box maxW='80%' minW='80%' width='80vw' pb='4'>
                <Heading pb='0' variant='h1_Kiosk'>
                  Deine Bestellung
                </Heading>
                <HStack>
                  <Icon
                    pr='0.1rem'
                    boxSize='1.2rem'
                    as={HiOutlineMagnifyingGlass}
                  />
                  <Text as='u' pt='0'>
                    Allgemeine Geschäftsbedingungen
                  </Text>
                </HStack>
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

          <HStack alignItems='flex-end' w='100%' pt='12' pb='11'>
            <HStack
              w='100%'
              justifyContent='flex-start'
              alignItems='flex-end'
              gap='5'
              //bgColor='red.100'
            >
              <Box transform='translateY(-0.4rem) translateX(0.4rem)'>
                <Button
                  gap='3'
                  variant='kiosk_rainbow_big'
                  onClick={() => {
                    onClose(); // Close the modal
                  }}
                >
                  Artikel hinzufügen
                  <Icon boxSize='2.2rem' as={FaPlus} />
                </Button>
              </Box>
              <Spacer /> {/* Spacer added here */}
              <Box>
                <HStack gap='1'>
                  <Button
                    gap='5'
                    variant='kiosk_pricetag_big'
                    onClick={() => {
                      if (getCartTotalQuantity() > 0) {
                        setActiveStep((prevStep) => prevStep + 1);
                      }
                    }}
                  >
                    {formatPrice({ amount: getCartTotalPrice() })}
                  </Button>
                  {getCartTotalPfand() !== 0 && (
                    <Button
                      gap='5'
                      variant='kiosk_pricetag_big'
                      onClick={() => setActiveStep((prevStep) => prevStep + 1)}
                    >
                      +{formatPrice({ amount: getCartTotalPfand() })} Pfand
                    </Button>
                  )}
                </HStack>
              </Box>
              {getCartTotalQuantity() > 0 && (
                <Box transform='translateY(-0.4rem) translateX(-0.4rem)'>
                  <Button
                    gap='5'
                    variant='kiosk_rainbow_big'
                    onClick={() => setActiveStep((prevStep) => prevStep + 1)}
                  >
                    Bezahlen
                    <Icon boxSize='3.5rem' as={CheckDuotone} />
                  </Button>
                </Box>
              )}
            </HStack>
          </HStack>
        </Stack>
      </Flex>
    </ModalBody>
  );
}

export default ShopModalStepWarenkorb;
