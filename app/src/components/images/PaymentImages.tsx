import { Box, HStack, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';

const MotionBox = motion(Box);

export const PaymentImages = () => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const width = '500';
  const height = '500';
  const borderRadius = 'xl';
  const gap = '2';

  return (
    <Stack gap={gap}>
      <HStack gap={gap}>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/contactless.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
      </HStack>

      <HStack gap={gap}>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/girocard.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/vpay.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
      </HStack>

      <HStack gap={gap}>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/mastercard.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/maestro.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
      </HStack>

      <HStack gap={gap}>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/applepay.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/googlepay.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
      </HStack>

      <HStack gap={gap}>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/americanexpress.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
        <Box borderRadius={borderRadius} overflow='hidden'>
          <NextImage
            src='/assets/images/payment/visa.png'
            alt='payment'
            width={width}
            height={height}
            quality={80}
            placeholder='empty'
          />
        </Box>
      </HStack>
    </Stack>
  );
};