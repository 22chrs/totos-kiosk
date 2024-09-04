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
import { useRouter } from '@/providers/DisplayContext';
import { FaArrowRight } from 'react-icons/fa';

type FooterShopElementProps = {
  itemCount: number;
};

export const ShopIcon: React.FC<FooterShopElementProps> = ({ itemCount }) => {
  const colorZiffer = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  return (
    <Box position='relative' display='inline-block'>
      <Icon
        as={CartShoppingFastSharpRegular}
        boxSize='5rem'
        color={useColorModeValue(
          'primaryHeadingColor.lightMode',
          'primaryHeadingColor.darkMode',
        )}
      />

      {itemCount > 0 && (
        <Center
          fontSize='3xl'
          position='absolute'
          top='-3'
          right='-6'
          width='55%'
          height='55%'
          borderRadius='50%'
          bgColor='red.400'
          color={colorZiffer}
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

export function GesamtsummePfand({ amount }) {
  const wholeNumberAmount = Math.round(amount);

  const formattedAmount = `${wholeNumberAmount} €`;

  return <div>{formattedAmount}</div>;
}

export const WarenkorbButton = () => {
  return (
    <Button
      variant='kiosk_rainbow_big'
      gap='5'
      //zIndex='10'
      // colorScheme='brand'
    >
      Deine Bestellung
      {/* <Icon pl='5' boxSize={'3.5rem'} as={FaWrench} /> */}
      <Icon boxSize='2rem' as={FaArrowRight} />
    </Button>
  );
};

export const AbbruchButton = () => {
  const { clearCart } = useCart();
  const router = useRouter();

  const handleClick = () => {
    clearCart();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
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
        h='5rem'
        w='5rem'
        fontSize='10rem'
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
        aria-label='Language'
        variant='solid'
        icon={<HiOutlineLanguage />}
        h='5rem'
        w='5rem'
        fontSize='4rem'
        colorScheme='brand'
        isRound
        bgColor={bgColorButton}

        //borderWidth='0.35rem'
      />
      {/* <WarenkorbModal isOpen={isOpen} onClose={onClose} /> */}
    </>
  );
};
