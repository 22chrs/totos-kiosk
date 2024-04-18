import {
  AbbruchButton,
  Gesamtsumme,
  GesamtsummePfand,
  LanguageButton,
  ShopIcon,
  WarenkorbButton,
} from '@/components/kiosk/shop/ShopItems';
import { useCart } from '@/providers/CardContext';
import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { KIOSK_FOOTER_HEIGHT } from 'src/constants';

export function InfoBar(props) {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { cart, getCartTotalQuantity, getCartTotalPrice, getCartTotalPfand } =
    useCart();

  console.log('Cart Contents:');
  cart.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item);
  });

  return (
    <Box w='100%' height={KIOSK_FOOTER_HEIGHT}>
      <Flex w='100%' alignItems='left' justifyContent='center' h='100%'>
        <Box
          px='3'
          pt='2'
          zIndex='0'
          overflow='hidden'
          flex='1'
          alignSelf='stretch'
          bgColor={useColorModeValue(
            'footerBGColor.lightMode',
            'footerBGColor.darkMode',
          )}
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode',
          )}
        >
          <Stack
            direction='row'
            alignItems='center'
            //bgColor='yellow'
            //justifyContent='space-between'
            h='100%'
            spacing={0}
          >
            <HStack>
              {/* <Flex alignItems='center' justifyContent='center' h='100%'>
                <HStack gap='5' pr='20'>
                  <AbbruchButton />
                  <Box onClick={props.onLangChangeClick}>
                    <LanguageButton />
                  </Box>
                </HStack>
              </Flex> */}
            </HStack>
            <Spacer onClick={props.onClick} />

            <HStack
              //bgColor='red'
              gap='10'
              onClick={props.onClick}
              width='full'
              justifyContent='space-between'
            >
              <Box
                display='flex'
                flex='1'
                justifyContent='flex-start'
                alignItems='center'
                pb='3'
                pl='10'
                gap='5'
              >
                <AbbruchButton />
                <LanguageButton />
                {/* <HStack gap='3'>
                  <Button variant='kiosk_pricetag_big' fontWeight={700}>
                    Summe: <Gesamtsumme amount={getCartTotalPrice()} />
                  </Button>
                  {getCartTotalPfand() !== 0 && (
                    <Button variant='kiosk_pricetag_big' fontWeight={700}>
                      +<GesamtsummePfand amount={getCartTotalPfand()} />
                      &nbsp;Pfand
                    </Button>
                  )}
                </HStack> */}
              </Box>

              <Box display='flex' justifyContent='flex-end' flex='1' pr='2'>
                <Box pr='15'>
                  <ShopIcon itemCount={getCartTotalQuantity()} />
                </Box>
                {getCartTotalQuantity() > 0 && <WarenkorbButton />}
              </Box>
            </HStack>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
