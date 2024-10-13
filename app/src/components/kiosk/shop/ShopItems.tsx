import {
  ArrowRightSharpSolid,
  CartShoppingFastSharpRegular,
  MugMarshmallowsLight,
  XmarkSharpSolid,
} from '@/components/icons/icons';
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
import { t } from 'i18next';

type FooterShopElementProps = {
  itemCount: number;
};

export const ShopIcon: React.FC<FooterShopElementProps> = ({ itemCount }) => {
  const bgColorZifferEmpty = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );
  const bgColorZifferFilled = useColorModeValue('red.400', 'red.300');

  const colorZifferEmpty = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );

  const colorZifferFilled = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );

  const colorIconEmpty = useColorModeValue(
    'footerBGColor.lightMode',
    'footerBGColor.darkMode',
  );
  const colorIconFilled = useColorModeValue(
    'footerBGColor.darkMode',
    'footerBGColor.lightMode',
  );

  return (
    <Box position='relative' display='inline-block'>
      <Icon
        as={MugMarshmallowsLight}
        boxSize='4.5rem'
        color={itemCount == 0 ? colorIconEmpty : colorIconFilled}
      />

      {itemCount >= 0 && (
        <Center
          fontSize='3xl'
          position='absolute'
          top='-3.5'
          right={itemCount >= 10 ? '-12' : '-7'}
          width={itemCount >= 10 ? '68%' : '50%'}
          height={itemCount >= 10 ? '68%' : '50%'}
          borderRadius='50%'
          bgColor={itemCount == 0 ? bgColorZifferEmpty : bgColorZifferFilled}
          color={itemCount == 0 ? colorZifferEmpty : colorZifferFilled}
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
      {t(`Deine Bestellung`)}
      {/* <Icon pl='5' boxSize={'3.5rem'} as={FaWrench} /> */}
      <Icon boxSize='3.5rem' as={ArrowRightSharpSolid} />
    </Button>
  );
};

export const AbbruchButton = () => {
  const { clearCart, setPayment } = useCart();
  const router = useRouter();

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to parent elements
    clearCart();
    i18n.changeLanguage(standardSprache);
    router.pushWithDisplay('/');
    setPayment('idle');
  };

  const bgColorButton = useColorModeValue('red.400', 'red.300');

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none' }}>
      <Icon
        aria-label='Cancel'
        as={XmarkSharpSolid}
        color={bgColorButton}
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
