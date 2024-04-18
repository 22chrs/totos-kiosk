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
  Spacer,
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
  const imageHeight = '9rem'; //5.5rem
  return (
    <>
      <HStack spacing='8' pb='5' pt='3' display='flex'>
        <Box
          borderRadius={KISOK_BORDERRADIUS}
          minH={imageHeight}
          minW={imageHeight}
          maxH={imageHeight}
          maxW={imageHeight}
          h={imageHeight}
          w={imageHeight}
          position='relative'
          overflow='hidden'
        >
          <Image
            alt={`${productCart.product.name}`}
            fill={true}
            object-fit='contain'
            sizes='(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw'
            style={{ objectFit: 'cover' }}
            src={`/kiosk/products/images/${handleUmlauts(
              productCart.product.name,
            )}.jpg`}
          />
        </Box>

        <HStack gap='7' w='100%'>
          <VStack
            alignItems='flex-start'
            pr='0'
            h='100%'
            justifyContent='space-between'
          >
            <HStack>
              <Heading variant='h2_Kiosk' pr='3' pb='1'>
                {productCart.product.name}
              </Heading>
            </HStack>

            <HStack pt='1'>
              <HStack gap='5'>
                <HStack gap='3' transform='translateY(-0.1rem) translateX(0)'>
                  <Button variant='kiosk_pricetag_mini'>
                    {formatPrice({ amount: productCart.calculatedPrice })}
                  </Button>
                  {productCart.choosenMug === 'mehrwegVariable' && (
                    <Button variant='kiosk_pricetag_mini'>
                      {productCart.choosenLid === 'ohneDeckel'
                        ? '+ 1 € Pfand'
                        : '+ 2 € Pfand'}
                    </Button>
                  )}
                </HStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack>
            <PlusMinus productCart={productCart} />
            <HStack gap='5'>
              <Text
                fontSize='xl'
                as='u'
                onClick={() => removeFromCart(productCart.idCart)}
              >
                Artikel entfernen
              </Text>
            </HStack>
          </VStack>

          <VStack
            alignItems='flex-start'
            pr='0'
            h='100%'
            gap='0'
            justifyContent='space-between'
          >
            <VStack gap='5' style={{ alignItems: 'flex-start' }}>
              <HStack gap='5' style={{ alignItems: 'flex-start' }}>
                {' '}
                {/* Add this line */}
                <AuswahlMenuSize productCart={productCart} />
                <AuswahlMenuZucker productCart={productCart} />
              </HStack>
              <HStack gap='5' style={{ alignItems: 'flex-start' }}>
                {' '}
                {/* Add this line */}
                <AuswahlMenuEinweg productCart={productCart} />
                <AuswahlMenuDeckel productCart={productCart} />
              </HStack>
            </VStack>

            {/* <HStack gap='5'>
               <Text
                pl='5'
                fontSize='xl'
                as='u'
                onClick={() => removeFromCart(productCart.idCart)}
              >
                Artikel entfernen
              </Text> 
            </HStack> */}
          </VStack>
        </HStack>
      </HStack>
    </>
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
    <HStack alignItems='flex-start'>
      <MyMenuButton
        productCart={productCart}
        colorButton={colorButton}
        bgColorButton={bgColorButton}
        menuTitle='Mehrwegsoption'
        menuOptions={menuOptions}
        initialSelectedOption={productCart.choosenMug}
        selectedItemKey='choosenMug'
      />
    </HStack>
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
      compareValue: 'ohneDeckel',
      text: 'Ohne Deckel',
      icons: [BanRegular],
    },
    {
      compareValue: 'inklusiveDeckel',
      text: 'Inklusive Deckel',
      icons: [CirclePlusRegular],
    },
  ];

  return (
    <HStack alignItems='flex-start'>
      <MyMenuButton
        productCart={productCart}
        colorButton={colorButton}
        bgColorButton={bgColorButton}
        menuTitle='Deckel'
        menuOptions={menuOptions}
        initialSelectedOption={productCart.choosenLid}
        selectedItemKey='choosenLid'
      />
    </HStack>
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
      compareValue: '0',
    },
    {
      text: 'Wenig Zucker',
      icons: [RxCube],
      compareValue: '1',
    },
    {
      text: 'Mittel',
      icons: [RxCube, RxCube],
      compareValue: '2',
    },
    {
      text: 'Viel Zucker',
      icons: [RxCube, RxCube, RxCube],
      compareValue: '3',
    },
  ];

  return (
    <HStack alignItems='flex-start'>
      <MyMenuButton
        productCart={productCart}
        colorButton={colorButton}
        bgColorButton={bgColorButton}
        menuTitle='Zuckergehalt'
        menuOptions={menuOptions}
        initialSelectedOption={productCart.choosenSugar}
        selectedItemKey='choosenSugar'
      />
    </HStack>
  );
};

const AuswahlMenuSize = ({ productCart }) => {
  const bgColorButton = useColorModeValue('pink.400', 'pink.200');
  const colorButton = useColorModeValue('white', 'primaryFontColor.lightMode');

  // Initialize the choosenSize state
  //const [choosenSize, setChoosenSize] = useState(null);

  // Map the sizes into menuOptions
  const menuOptions = productCart.product.sizes.map((sizeObj) => ({
    text: sizeObj.size,
    icons: [Scale],
    compareValue: sizeObj.size,
  }));

  // Handle size selection
  // const handleSizeSelection = (size) => {
  //   const selectedSize = productCart.product.sizes.find(
  //     (sizeObj) => sizeObj.size === size
  //   );
  //   setChoosenSize(selectedSize);
  // };
  const selectedOption = productCart.choosenSize;

  return (
    <HStack alignItems='flex-start'>
      <MyMenuButton
        productCart={productCart}
        colorButton={colorButton}
        bgColorButton={bgColorButton}
        menuTitle='Größe'
        menuOptions={menuOptions}
        initialSelectedOption={productCart.choosenSize}
        selectedItemKey='choosenSize'
        //onMenuOptionClick={handleSizeSelection}  // Assumes that MyMenuButton calls this when a menu option is clicked
      />
    </HStack>
  );
};
