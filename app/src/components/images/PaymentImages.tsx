import { Box, Flex, HStack, useColorModeValue } from '@chakra-ui/react';

import NextImage from 'next/image';

export const PaymentImagesFooterIcon = ({ isRounded, isWhite }) => {
  // Call the hook outside of any condition
  const defaultBg = useColorModeValue(
    'rgba(255, 255, 255, 0.5)',
    'rgba(0, 0, 0, 0.4)',
  );

  // Determine the background color conditionally
  const bg = !isWhite ? defaultBg : 'white';

  const lightSrcApple = useColorModeValue(
    '/assets/payment/ApplePay_dark.svg',
    '/assets/payment/ApplePay.svg',
  );
  const darkSrcApple = useColorModeValue(
    '/assets/payment/ApplePay.svg',
    '/assets/payment/ApplePay_dark.svg',
  );
  const srcApple = isWhite ? lightSrcApple : darkSrcApple;

  const lightSrcCashless = useColorModeValue(
    '/assets/payment/contactless_dark.svg',
    '/assets/payment/contactless.svg',
  );
  const darkSrcCashless = useColorModeValue(
    '/assets/payment/contactless.svg',
    '/assets/payment/contactless_dark.svg',
  );
  const srcCashless = isWhite ? lightSrcCashless : darkSrcCashless;

  return (
    <HStack
      justify='center'
      align='center'
      w='full'
      pos='fixed'
      bottom='0'
      bg={bg}
      pt='5'
      pb='5'
      overflowX='auto'
      gap='15'
      roundedBottom={isRounded ? 10 : undefined}
    >
      <NextImage
        src={srcCashless}
        alt='Cashless'
        priority={true}
        width={100} // Set a numeric value for width
        height={100} // Set a matching numeric value or the appropriate aspect ratio
        quality={100}
      />
      <NextImage
        src='/assets/payment/girocard.svg'
        alt='Girocard'
        priority
        width='65'
        height='65'
        quality='100'
      />

      <NextImage
        src={useColorModeValue(
          '/assets/payment/Maestro.svg',
          '/assets/payment/Maestro_dark.svg',
        )}
        alt='ApplePay'
        width='70'
        height='70'
        quality='100'
      />
      <NextImage
        src='/assets/payment/GooglePay.svg'
        alt='GooglePay'
        width='110'
        height='110'
        quality='100'
      />

      <NextImage
        src={srcApple}
        alt='ApplePay'
        width='100'
        height='100'
        quality='100'
      />

      <NextImage
        src='/assets/payment/Visa.svg'
        alt='VPay'
        width='115'
        height='115'
        quality='100'
      />

      <NextImage
        src={useColorModeValue(
          '/assets/payment/Mastercard.svg',
          '/assets/payment/Mastercard_dark.svg',
        )}
        alt='ApplePay'
        width='70'
        height='70'
        quality='100'
      />
    </HStack>
  );
};
