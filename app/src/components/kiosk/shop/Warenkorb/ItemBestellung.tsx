import {
  BanRegular,
  CirclePlusRegular,
  CupTogoRegular,
  MugHotRegular,
  Scale,
} from '@/components/icons/icons';
import { useCart } from '@/providers/CardContext';
import {
  Box,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import { RxCube } from 'react-icons/rx';
import { KISOK_BORDERRADIUS } from 'src/constants';
import { formatPrice, handleUmlauts } from '../utils';
import MyMenuButton from './MenuButtons';
import { PlusMinus } from './PlusMinus';

export const ItemBestellung = ({ productCart }) => {
  const { removeFromCart } = useCart();
  const imageHeight = '9rem';

  const {
    product: { name },
    calculatedPrice,
    choosenMug,
    choosenLid,
    idCart,
  } = productCart;

  return (
    <HStack spacing='8' pb='5' pt='3' display='flex'>
      <Box
        borderRadius={KISOK_BORDERRADIUS}
        h={imageHeight}
        w={imageHeight}
        position='relative'
        overflow='hidden'
      >
        <Image
          alt={name}
          fill
          sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
          style={{ objectFit: 'cover' }}
          src={`/kiosk/products/images/${handleUmlauts(name)}.jpg`}
        />
      </Box>

      <HStack gap='7' w='100%'>
        <VStack
          alignItems='flex-start'
          pr='0'
          h='100%'
          justifyContent='space-between'
        >
          <Heading variant='h2_Kiosk' pr='3' pb='1'>
            {name}
          </Heading>

          <HStack pt='1' gap='5' transform='translateY(-0.1rem)'>
            <Button px='3' variant='kiosk_pricetag_mini'>
              {formatPrice({ amount: calculatedPrice })}
            </Button>
            {choosenMug === 'mehrwegVariable' && (
              <Button px='3' variant='kiosk_pricetag_mini'>
                {choosenLid === 'ohneDeckel' ? '+ 1 € Pfand' : '+ 2 € Pfand'}
              </Button>
            )}
          </HStack>
        </VStack>

        <VStack>
          <PlusMinus productCart={productCart} />
          <Text fontSize='xl' as='u' onClick={() => removeFromCart(idCart)}>
            Artikel entfernen
          </Text>
        </VStack>

        <VStack
          alignItems='flex-start'
          pr='0'
          h='100%'
          justifyContent='space-between'
        >
          <VStack gap='5' alignItems='flex-start'>
            <HStack gap='5' alignItems='flex-start'>
              <AuswahlMenuSize productCart={productCart} />
              <AuswahlMenuZucker productCart={productCart} />
            </HStack>
            <HStack gap='5' alignItems='flex-start'>
              <AuswahlMenuEinweg productCart={productCart} />
              <AuswahlMenuDeckel productCart={productCart} />
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </HStack>
  );
};

const AuswahlMenuEinweg = ({ productCart }) => {
  const bgColorButton = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );
  const colorButton = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );

  const menuOptions = [
    {
      text: 'Einweg',
      compareValue: 'einwegVariable',
      icons: [CupTogoRegular],
    },
    {
      text: 'Mehrweg',
      compareValue: 'mehrwegVariable',
      icons: [MugHotRegular],
    },
  ];

  return (
    <MyMenuButton
      productCart={productCart}
      colorButton={colorButton}
      bgColorButton={bgColorButton}
      menuTitle='Mehrwegsoption'
      menuOptions={menuOptions}
      initialSelectedOption={productCart.choosenMug}
      selectedItemKey='choosenMug'
    />
  );
};

const AuswahlMenuDeckel = ({ productCart }) => {
  const bgColorButton = useColorModeValue(
    'pageBGColor.lightMode',
    'pageBGColor.darkMode',
  );
  const colorButton = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );

  const menuOptions = [
    {
      text: 'Ohne Deckel',
      compareValue: 'ohneDeckel',
      icons: [BanRegular],
    },
    {
      text: 'Inklusive Deckel',
      compareValue: 'inklusiveDeckel',
      icons: [CirclePlusRegular],
    },
  ];

  return (
    <MyMenuButton
      productCart={productCart}
      colorButton={colorButton}
      bgColorButton={bgColorButton}
      menuTitle='Deckel'
      menuOptions={menuOptions}
      initialSelectedOption={productCart.choosenLid}
      selectedItemKey='choosenLid'
    />
  );
};

const AuswahlMenuZucker = ({ productCart }) => {
  const bgColorButton = useColorModeValue('pink.100', 'pink.100');
  const colorButton = useColorModeValue(
    'primaryFontColor.lightMode',
    'primaryFontColor.lightMode',
  );

  const menuOptions = [
    {
      text: 'Kein Zucker',
      icons: [BanRegular],
      compareValue: 'zero',
    },
    {
      text: 'Wenig Zucker',
      icons: [RxCube],
      compareValue: 's',
    },
    {
      text: 'Mittel',
      icons: [RxCube, RxCube],
      compareValue: 'm',
    },
    {
      text: 'Viel Zucker',
      icons: [RxCube, RxCube, RxCube],
      compareValue: 'l',
    },
  ];

  return (
    <MyMenuButton
      productCart={productCart}
      colorButton={colorButton}
      bgColorButton={bgColorButton}
      menuTitle='Zuckergehalt'
      menuOptions={menuOptions}
      initialSelectedOption={productCart.choosenSugar}
      selectedItemKey='choosenSugar'
    />
  );
};

const AuswahlMenuSize = ({ productCart }) => {
  const bgColorButton = useColorModeValue('pink.400', 'pink.200');
  const colorButton = useColorModeValue('white', 'primaryFontColor.lightMode');

  const {
    product: { sizes },
    choosenSize,
  } = productCart;

  const menuOptions = sizes.map((sizeObj) => ({
    text: sizeObj.size,
    icons: [Scale],
    compareValue: sizeObj.size,
  }));

  return (
    <MyMenuButton
      productCart={productCart}
      colorButton={colorButton}
      bgColorButton={bgColorButton}
      menuTitle='Größe'
      menuOptions={menuOptions}
      initialSelectedOption={choosenSize}
      selectedItemKey='choosenSize'
    />
  );
};
