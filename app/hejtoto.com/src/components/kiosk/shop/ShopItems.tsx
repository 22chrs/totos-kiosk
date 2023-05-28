import { CartShoppingFastSharpRegular } from '@/components/icons/icons';
import {
  Box,
  Button,
  Center,
  Icon,
  IconButton,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FiX } from 'react-icons/fi';
import { HiOutlineLanguage } from 'react-icons/hi2';

import { formatPrice, FormatPriceProps } from '@/components/kiosk/shop/utils';
import i18n, { standardSprache } from '@/internationalization/i18n';
import { useCart } from '@/providers/CardContext';
import { useRouter } from 'next/router';

type FooterShopElementProps = {
  itemCount: number;
};

export const ShopIcon: React.FC<FooterShopElementProps> = ({ itemCount }) => {
  return (
    <Box position='relative' display='inline-block'>
      <Icon
        as={CartShoppingFastSharpRegular}
        boxSize='5rem'
        color={useColorModeValue(
          'primaryHeadingColor.lightMode',
          'primaryHeadingColor.darkMode'
        )}
      />

      {itemCount > 0 && (
        <Center
          fontSize='2xl'
          position='absolute'
          top='-3'
          right='-6'
          width='55%'
          height='55%'
          borderRadius='50%'
          bgColor='red.500'
          color='white'
          fontWeight={700}
        >
          {itemCount}
        </Center>
      )}
    </Box>
  );
};

export const Gesamtsumme: React.FC<FormatPriceProps> = ({ amount }) => {
  return <>{formatPrice({ amount })}</>;
};

export const WarenkorbButton = () => {
  return (
    <Button
      variant='kiosk_rainbow_big'
      //zIndex='10'
      // colorScheme='brand'
    >
      Warenkorb anzeigen
      {/* <Icon pl='5' boxSize={'3.5rem'} as={FaWrench} /> */}
    </Button>
  );
};

export const AbbruchButton = () => {
  const { clearCart } = useCart();
  const router = useRouter();

  const handleClick = () => {
    clearCart();
    i18n.changeLanguage(standardSprache);
    router.push('/');
  };

  const bgColorButton = useColorModeValue('red.400', 'red.300');

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none' }}>
      <IconButton
        aria-label='Cancel'
        variant='outline'
        icon={<FiX />}
        colorScheme='red'
        color={bgColorButton}
        isRound
        borderWidth='0.35rem'
        // variant='solid'
        h='6rem'
        w='6rem'
        fontSize='4rem'
      />
    </Box>
  );
};

export const LanguageButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };

  const bgColorButton = useColorModeValue('purple.400', 'purple.300');

  return (
    <>
      <IconButton
        h='6rem'
        w='6rem'
        fontSize='4rem'
        aria-label='Language'
        icon={<HiOutlineLanguage />}
        colorScheme='brand'
        isRound
        bgColor={bgColorButton}
        variant='solid'
        //borderWidth='0.35rem'
      />
      {/* <WarenkorbModal isOpen={isOpen} onClose={onClose} /> */}
    </>
  );
};
