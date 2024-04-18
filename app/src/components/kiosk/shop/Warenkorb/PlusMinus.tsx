import {
  Box,
  HStack,
  Icon,
  Input,
  useColorModeValue,
  useNumberInput,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

import { useCart } from '@/providers/CardContext';

import { ProductCart } from '@/providers/CardContext';

type PlusMinusProps = {
  productCart: ProductCart;
};

export const PlusMinus: React.FC<PlusMinusProps> = ({ productCart }) => {
  const { updateItemInCart } = useCart();

  const min = 1;
  const max = 16;
  const [isAtMin, setIsAtMin] = useState(false);
  const [isAtMax, setIsAtMax] = useState(false);

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value,
  } = useNumberInput({
    step: 1,
    defaultValue: productCart.quantity,
    min,
    max,
    precision: 0,
  });

  useEffect(() => {
    const numValue = Number(value);
    setIsAtMin(numValue <= min);
    setIsAtMax(numValue >= max);
  }, [value, min, max]);

  const updateItemInCartRef = useRef(updateItemInCart);
  const idCartRef = useRef(productCart.idCart);

  // Always keep the current values in the refs
  useEffect(() => {
    updateItemInCartRef.current = updateItemInCart;
    idCartRef.current = productCart.idCart;
  }, [updateItemInCart, productCart.idCart]);

  useEffect(() => {
    // Use the current value from the refs
    updateItemInCartRef.current(idCartRef.current, { quantity: Number(value) });
  }, [value]);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const height = '3rem';
  const iconFontSize = '1.5rem';

  const borderColor = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );

  const bgColorButton = useColorModeValue('purple.400', 'purple.300');

  const colorIconDisabled = useColorModeValue(
    'primaryFontColor.darkMode',
    'primaryFontColor.lightMode',
  );

  const fontColorButton = useColorModeValue(
    'primaryFontColor.darkMode',
    'black',
  );

  const bgColorButtonDisabled = useColorModeValue(
    'purple.100',
    'pageBGColor.darkMode',
  );

  const colorButtonDisabled = useColorModeValue('white', 'black');

  return (
    <HStack gap='1'>
      <Box
        m='0'
        p='0'
        border='0'
        aria-label='Minus'
        borderRadius='full'
        {...dec}
        fontSize={iconFontSize}
        h={height}
        w={height}
        display='flex'
        alignItems='center'
        justifyContent='center'
        bgColor={isAtMin ? bgColorButtonDisabled : bgColorButton}
      >
        <Icon
          color={isAtMin ? colorButtonDisabled : fontColorButton}
          as={FaMinus}
        />
      </Box>
      <Input
        mx='0'
        px='0'
        h={height}
        width='3rem'
        textAlign='center'
        fontSize='3xl'
        maxW='5rem'
        isReadOnly
        {...input}
        borderColor='transparent'
        bgColor={useColorModeValue(
          'footerBGColor.lightMode',
          'footerBGColor.darkMode',
        )}
        color={useColorModeValue(
          'primaryFontColor.lightMode',
          'primaryFontColor.darkMode',
        )}
        fontWeight={700}
        _hover={{ borderColor: 'transparent' }}
        _focus={{ borderColor: 'transparent' }}
        _active={{ borderColor: 'transparent' }}
        style={{ textAlign: 'center' }}
      />
      <Box
        m='0'
        p='0'
        border='0'
        aria-label='Plus'
        borderRadius='full'
        {...inc}
        fontSize={iconFontSize}
        h={height}
        w={height}
        display='flex'
        alignItems='center'
        justifyContent='center'
        bgColor={isAtMax ? bgColorButtonDisabled : bgColorButton}
      >
        <Icon
          color={isAtMax ? colorIconDisabled : fontColorButton}
          as={FaPlus}
        />
      </Box>
    </HStack>
  );
};
