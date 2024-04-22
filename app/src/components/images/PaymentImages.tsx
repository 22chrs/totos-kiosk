import {
  Box,
  Flex,
  HStack,
  Icon,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';

import {
  ApplePay,
  GooglePay,
  CcVisa,
  CcMastercard,
  ContactlessIcon,
  CcJcb,
  CcDiscover,
} from '@/components/icons/icons';

const MotionBox = motion(Box);

export const PaymentImagesFooter = () => {
  const width = '153';
  const height = '153';
  const borderRadius = 'xl';

  return (
    <Flex
      justify='center'
      align='center'
      w='full'
      pos='fixed'
      bottom='0'
      bg='white'
      py='0'
      overflowX='auto'
      boxShadow='md'
    >
      {/* <Box borderRadius={borderRadius} overflow='hidden' mx='2'>
        <NextImage
          src='/assets/images/payment/contactless.png'
          alt='Contactless payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box> */}
      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/vpay.png'
          alt='VPay payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>
      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/girocard.png'
          alt='Girocard payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>

      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/maestro.png'
          alt='Maestro payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>

      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/applepay.png'
          alt='Apple Pay payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>
      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/googlepay.png'
          alt='Google Pay payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>
      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/visa.png'
          alt='Visa payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>
      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/americanexpress.png'
          alt='American Express payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>

      <Box borderRadius={borderRadius} overflow='hidden'>
        <NextImage
          src='/assets/images/payment/mastercard.png'
          alt='Mastercard payment'
          width={width}
          height={height}
          quality={80}
          placeholder='empty'
        />
      </Box>
    </Flex>
  );
};

// import Maestro from '/assets/payment/Maestro.svg';
import Image from 'next/image';

export const PaymentImagesFooterIcon = () => {
  const size = '7rem';

  return (
    <HStack
      justify='center'
      align='center'
      w='full'
      pos='fixed'
      bottom='0'
      bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(0, 0, 0, 0.8)')}
      pt='3'
      pb='5'
      overflowX='auto'
      gap='14'
    >
      <Image
        src={useColorModeValue(
          '/assets/payment/contactless.svg',
          '/assets/payment/contactless_dark.svg',
        )}
        alt='ApplePay'
        width='100'
        height='100'
        quality='100'
      />

      <Box px='2'>
        <Image
          src='/assets/payment/Girocard.svg'
          alt='VPay'
          width='60'
          height='60'
          quality='100'
        />
      </Box>
      {/* <Box px='2'>
        <Image
          src='/assets/payment/V_Pay.svg'
          alt='VPay'
          width='50'
          height='50'
          quality='100'
        />
      </Box> */}

      <Image
        src={useColorModeValue(
          '/assets/payment/Maestro.svg',
          '/assets/payment/Maestro_dark.svg',
        )}
        alt='ApplePay'
        width='100'
        height='100'
        quality='100'
      />
      <Image
        src='/assets/payment/GooglePay.svg'
        alt='GooglePay'
        width='110'
        height='110'
        quality='100'
      />
      <Image
        src={useColorModeValue(
          '/assets/payment/ApplePay.svg',
          '/assets/payment/ApplePay_dark.svg',
        )}
        alt='ApplePay'
        width='110'
        height='110'
        quality='100'
      />
      <Image
        src='/assets/payment/Visa.svg'
        alt='VPay'
        width='120'
        height='120'
        quality='100'
      />

      <Image
        src={useColorModeValue(
          '/assets/payment/Mastercard.svg',
          '/assets/payment/Mastercard_dark.svg',
        )}
        alt='ApplePay'
        width='100'
        height='100'
        quality='100'
      />
    </HStack>
  );
};
