import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  useColorModeValue as mode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowIcon, RobotRegular } from '../icons/icons';

export const TouchToStart = () => {
  return (
    <Box
      px='7'
      height='100'
      bgColor={mode('pageBGColor.lightMode', 'pageBGColor.lightMode')}
      borderWidth='0.2rem'
      borderColor={mode('footerBGColor.darkMode', 'footerBGColor.darkMode')}
      position='fixed'
      right='5.7vw' // Add this property to center horizontally
      bottom='21.5vh'
      //transform='translateX(-50%)' // Add this property to center horizontally
      //width='30vw'
      rounded='2xl'
      display='flex' // Add this property for centering the text
      alignItems='center' // Add this property for centering the text
      justifyContent='center' // Add this property for centering the text
    >
      <HStack
        gap='10'
        color={mode('primaryFontColor.lightMode', 'primaryFontColor.lightMode')}
      >
        <Icon
          as={RobotRegular}
          fontSize='5rem'
          display='flex' // Add this property for centering the text
          alignItems='center' // Add this property for centering the text
          justifyContent='center' // Add this property for centering the text
          borderRadius='10rem' // Add this property to create round corners
        />
        <Heading
          color={mode(
            'primaryFontColor.lightMode',
            'primaryFontColor.lightMode',
          )}
        >
          START
        </Heading>
        <Icon
          as={ArrowIcon}
          fontSize='4rem'
          display='flex' // Add this property for centering the text
          alignItems='center' // Add this property for centering the text
          justifyContent='center' // Add this property for centering the text
          borderRadius='10rem' // Add this property to create round corners
        />
      </HStack>
    </Box>
  );
};
