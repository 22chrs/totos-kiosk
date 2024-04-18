import { SeedlingRegular, WheatSlashRegular } from '@/components/icons/icons';
import { Box, Circle, Icon, Text, useColorModeValue } from '@chakra-ui/react';

export const GlutenFreeEmblem = () => {
  const color = useColorModeValue(
    'primaryHeadingColor.darkMode',
    'primaryHeadingColor.darkMode'
  );

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      color={color}
    >
      <Circle size='3.5rem' borderWidth='0.25rem' borderColor={color}>
        <Icon as={WheatSlashRegular} w={8} h={8} color={color} />
      </Circle>
      <Text
        color={color}
        fontSize='md'
        fontWeight='700'
        p='0'
        transform='translateY(-0.1rem)'
      >
        Glutenfrei
      </Text>
    </Box>
  );
};

export const VeganEmblem = () => {
  const colorLightMode = '#9AE6B4';
  const colorDarkMode = '#9AE6B4';
  const color = useColorModeValue(colorLightMode, colorDarkMode);

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      color={color}
    >
      <Circle size='3.5rem' borderWidth='0.25rem' borderColor={color}>
        <Icon as={SeedlingRegular} w={8} h={8} color={color} />
      </Circle>
      <Text
        color={color}
        fontSize='md'
        fontWeight='700'
        p='0'
        transform='translateY(-0.1rem)'
      >
        Vegan
      </Text>
    </Box>
  );
};
