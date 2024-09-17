// MyMenuButton.tsx

import * as React from 'react'; // Import React as a namespace
import { useCallback, useMemo } from 'react';
import { useCart } from '@/providers/CardContext';
import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';

type Option = {
  text: string;
  compareValue: string;
  icons: React.ElementType[];
};

interface ProductSize {
  size: string;
  additionalCost: number;
}

interface Product {
  sizes: ProductSize[];
}

interface ProductCart {
  idCart: string;
  product: Product;
  calculatedPrice: number;
  choosenSize: string | null;
}

interface MyMenuButtonProps {
  menuTitle: string;
  menuOptions: Option[];
  bgColorButton: string;
  colorButton: string;
  initialSelectedOption: string | null;
  productCart: ProductCart;
  selectedItemKey: string;
}

const MyMenuButtonComponent: React.FC<MyMenuButtonProps> = ({
  menuTitle,
  menuOptions,
  bgColorButton,
  colorButton,
  initialSelectedOption,
  productCart,
  selectedItemKey,
}) => {
  const { updateItemInCart } = useCart();

  // Compute selectedOption using useMemo
  const selectedOption = useMemo(() => {
    if (!initialSelectedOption) return menuOptions[0];

    const foundOption = menuOptions.find(
      (option) => option.compareValue === initialSelectedOption,
    );

    return foundOption || menuOptions[0];
  }, [menuOptions, initialSelectedOption]);

  const handleClick = useCallback(
    (option: Option) => {
      updateItemInCart(productCart.idCart, {
        [selectedItemKey]: option.compareValue,
      });

      if (selectedItemKey === 'choosenSize') {
        let additionalCostVariable = 0;
        let currentCostVariable = 0;

        // Find the new additional cost
        const newSize = productCart.product.sizes.find(
          (sizeObject) => option.compareValue === sizeObject.size,
        );
        if (newSize) {
          additionalCostVariable = newSize.additionalCost;
        }

        // Find the current additional cost
        const currentSize = productCart.product.sizes.find(
          (sizeObject) => productCart.choosenSize === sizeObject.size,
        );
        if (currentSize) {
          currentCostVariable = currentSize.additionalCost;
        }

        // Update the calculatedPrice of the productCart
        updateItemInCart(productCart.idCart, {
          calculatedPrice:
            productCart.calculatedPrice -
            currentCostVariable +
            additionalCostVariable,
        });
      }
    },
    [productCart, updateItemInCart, selectedItemKey],
  );

  const borderColor = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode',
  );

  if (!selectedOption) {
    return null; // Optionally, you can return a fallback UI here
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        leftIcon={
          selectedOption.icons.length > 0 ? (
            <HStack pr='2'>
              {selectedOption.icons.map((IconComponent, index) => (
                <Icon key={index} boxSize={5} as={IconComponent} />
              ))}
            </HStack>
          ) : undefined
        }
        bgColor={bgColorButton}
        _hover={{ bgColor: bgColorButton }}
        _active={{ bgColor: bgColorButton }}
        color={colorButton}
        fontSize='xl'
        h='2.5rem'
        px='4'
        variant='solid'
      >
        {selectedOption.text}
      </MenuButton>

      <MenuList borderColor={borderColor} p='3'>
        <MenuGroup fontSize='2xl' title={menuTitle}>
          {menuOptions.map((option, index) => (
            <MenuItem
              fontSize='xl'
              fontWeight='700'
              key={index}
              gap='3'
              pt='3'
              onClick={() => handleClick(option)}
              sx={{
                _hover: { bg: 'transparent', color: 'inherit' },
                _focus: { bg: 'transparent', color: 'inherit' },
                _active: { bg: 'transparent', color: 'inherit' },
                _selected: { bg: 'transparent', color: 'inherit' },
              }}
            >
              <HStack spacing='1'>
                {option.icons.map((IconComponent, iconIndex) => (
                  <Icon key={iconIndex} boxSize='6' as={IconComponent} />
                ))}
              </HStack>
              <Box pl='1.5'>{option.text}</Box>
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

// Wrap the component with React.memo
const MyMenuButton = React.memo(MyMenuButtonComponent);

// Set the displayName for better debugging and to satisfy ESLint
MyMenuButton.displayName = 'MyMenuButton';

export default MyMenuButton;
