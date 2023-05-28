import {
  AbbruchButton,
  Gesamtsumme,
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
      <Flex w='100%' alignItems='center' justifyContent='center' h='100%'>
        <Box
          px='15'
          zIndex='0'
          overflow='hidden'
          flex='1'
          alignSelf='stretch'
          bgColor={useColorModeValue(
            'footerBGColor.lightMode',
            'footerBGColor.darkMode'
          )}
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode'
          )}
        >
          <Stack
            direction='row'
            alignItems='left'
            //justifyContent='space-between'
            h='100%'
          >
            <HStack>
              <Flex alignItems='center' justifyContent='center' h='100%'>
                <HStack gap='5' pr='20'>
                  <AbbruchButton />
                  <Box onClick={props.onLangChangeClick}>
                    <LanguageButton />
                  </Box>
                </HStack>
              </Flex>
            </HStack>
            <Spacer onClick={props.onClick} />
            <HStack gap='10' onClick={props.onClick}>
              <Box pr='6'>
                <ShopIcon itemCount={getCartTotalQuantity()} />
              </Box>
              <Box display='flex' justifyContent='right'>
                <HStack gap='1'>
                  <Button variant='kiosk_pricetag_big' fontWeight={700}>
                    <Gesamtsumme amount={getCartTotalPrice()} />
                  </Button>
                  {getCartTotalPfand() !== 0 && (
                    <Button variant='kiosk_pricetag_big' fontWeight={700}>
                      +<Gesamtsumme amount={getCartTotalPfand()} /> Pfand
                    </Button>
                  )}
                </HStack>
              </Box>
              {getCartTotalQuantity() > 0 && <WarenkorbButton />}
            </HStack>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
