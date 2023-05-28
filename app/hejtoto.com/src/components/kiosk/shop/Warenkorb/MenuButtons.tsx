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
import { useCallback, useEffect, useState } from 'react';

type Option = {
  text: string;
  compareValue: any; // replace any with the appropriate type
  icons: React.ComponentType<any>[]; // replace any with the appropriate type if necessary
};

type MyMenuButtonProps = {
  menuTitle: string;
  menuOptions: Option[];
  bgColorButton: string;
  colorButton: string;
  initialSelectedOption: any; // replace any with the appropriate type
  productCart: any; // replace any with the appropriate type
  selectedItemKey: string;
};

function MyMenuButton({
  menuTitle,
  menuOptions,
  bgColorButton,
  colorButton,
  initialSelectedOption,
  productCart,
  selectedItemKey,
}: MyMenuButtonProps) {
  console.log('MyMenuButton rendered');

  const { updateItemInCart } = useCart();

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    let initialOption = menuOptions[0];
    if (initialSelectedOption) {
      const foundOption = menuOptions.find(
        (option) => option.compareValue === initialSelectedOption
      );
      if (foundOption) {
        initialOption = foundOption;
      }
    }
    setSelectedOption(initialOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(
    (option) => {
      setSelectedOption(option);
      updateItemInCart(productCart.idCart, {
        [selectedItemKey]: option.compareValue,
      });

      if (selectedItemKey === 'choosenSize') {
        let additionalCostVariable = 0;
        let currentCostVariable = 0;

        // Compare option with productCart.product.sizes to find the new additional cost
        productCart.product.sizes.forEach((sizeObject) => {
          if (option.compareValue === sizeObject.size) {
            additionalCostVariable = sizeObject.additionalCost;
          }
        });

        // Find the current additional cost that matches to the productCart.choosenSize
        productCart.product.sizes.forEach((sizeObject) => {
          if (productCart.choosenSize === sizeObject.size) {
            currentCostVariable = sizeObject.additionalCost;
          }
        });

        // Update the calculatedPrice of the productCart
        updateItemInCart(productCart.idCart, {
          ['calculatedPrice']:
            productCart.calculatedPrice -
            currentCostVariable +
            additionalCostVariable,
        });
      }
    },
    [productCart, updateItemInCart, selectedItemKey]
  );

  const borderColor = useColorModeValue(
    'primaryHeadingColor.lightMode',
    'primaryHeadingColor.darkMode'
  );

  if (!selectedOption) {
    return null; // or return a loader
  }

  return (
    <>
      {initialSelectedOption === null ? null : (
        <Menu size='md'>
          <MenuButton
            as={Button}
            rightIcon={
              selectedOption.icons && selectedOption.icons.length > 0 ? (
                <HStack spacing='0.1rem'>
                  {selectedOption.icons.map((IconComponent, index) => (
                    <Icon key={index} boxSize={5} as={IconComponent} />
                  ))}
                </HStack>
              ) : null
            }
            bgColor={bgColorButton}
            _hover={{ bgColor: bgColorButton }}
            _active={{ bgColor: bgColorButton }}
            color={colorButton}
            fontSize='1.0rem'
            h='2.0rem'
            px='3.5'
            variant='solid'
          >
            {selectedOption.text}
          </MenuButton>

          <MenuList borderColor={borderColor}>
            <MenuGroup title={menuTitle}>
              {menuOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  gap='1'
                  onClick={() => handleClick(option)}
                  sx={{
                    _hover: { bg: 'transparent', color: 'inherit' }, // neutralize the hover effect
                    _focus: { bg: 'transparent', color: 'inherit' }, // neutralize the focus effect
                    _active: { bg: 'transparent', color: 'inherit' }, // neutralize the active effect
                    _selected: { bg: 'transparent', color: 'inherit' }, // neutralize the selected effect
                  }}
                >
                  <HStack spacing='1'>
                    {option.icons &&
                      option.icons.map((IconComponent, iconIndex) => (
                        <Icon key={iconIndex} boxSize={5} as={IconComponent} />
                      ))}
                  </HStack>
                  <Box pl='1.5'>{option.text}</Box>
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
}

export default MyMenuButton;
