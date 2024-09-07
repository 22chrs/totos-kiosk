import {
  AbbruchButton,
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
import { Suspense } from 'react';
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
          zIndex='0'
          overflow='hidden'
          flex='1'
          alignSelf='stretch'
          bgColor={useColorModeValue(
            'pageBGColor.lightMode',
            'pageBGColor.darkMode',
          )}
          color={useColorModeValue(
            'footerFontColor.lightMode',
            'footerFontColor.darkMode',
          )}
        >
          <Stack direction='row' alignItems='center' h='100%' spacing={0}>
            <Spacer onClick={props.onClick} />

            <HStack
              gap='10'
              onClick={props.onClick}
              width='full'
              justifyContent='center'
            >
              <Box
                display='flex'
                flex='1'
                justifyContent='flex-start'
                alignItems='center'
                gap='5'
              >
                <Box pl='10'>
                  <AbbruchButton />
                </Box>
              </Box>

              <Box
                flex='0.1'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                {getCartTotalQuantity() > 0 && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <WarenkorbButton />
                  </Suspense>
                )}
              </Box>

              <Box
                flex='1'
                pt='3'
                display='flex'
                alignItems='center'
                justifyContent='flex-end'
              >
                <Box pr='15'>
                  <ShopIcon itemCount={getCartTotalQuantity()} />
                </Box>
              </Box>
            </HStack>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
